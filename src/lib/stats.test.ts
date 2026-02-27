import { describe, it, expect } from 'vitest';
import type { HistoryEntry } from '$lib/types';
import type { Round } from '$lib/types';
import {
	deriveTeamStats,
	derivePlayerStats,
	deriveTotals,
	deriveScore,
	deriveRoundHistory,
} from '$lib/stats';

const entry = (
	overrides: Partial<HistoryEntry> & Pick<HistoryEntry, 'teamIndex' | 'category' | 'type'>,
): HistoryEntry => ({
	player: 'Anonymous',
	timestamp: new Date(),
	round: 1,
	throwIndex: 1,
	...overrides,
});

describe('deriveTeamStats', () => {
	it('returns zeros for empty history', () => {
		expect(deriveTeamStats([], 0)).toEqual({
			pointingSuccess: 0,
			pointingFail: 0,
			shootingSuccess: 0,
			shootingFail: 0,
		});
	});

	it('counts entries for the correct team only', () => {
		const history = [
			entry({ teamIndex: 0, category: 'pointing', type: 'success' }),
			entry({ teamIndex: 1, category: 'pointing', type: 'success' }),
			entry({ teamIndex: 0, category: 'shooting', type: 'fail' }),
		];
		expect(deriveTeamStats(history, 0)).toEqual({
			pointingSuccess: 1,
			pointingFail: 0,
			shootingSuccess: 0,
			shootingFail: 1,
		});
		expect(deriveTeamStats(history, 1)).toEqual({
			pointingSuccess: 1,
			pointingFail: 0,
			shootingSuccess: 0,
			shootingFail: 0,
		});
	});

	it('accumulates multiple entries', () => {
		const history = [
			entry({ teamIndex: 0, category: 'pointing', type: 'success' }),
			entry({ teamIndex: 0, category: 'pointing', type: 'success' }),
			entry({ teamIndex: 0, category: 'pointing', type: 'fail' }),
			entry({ teamIndex: 0, category: 'shooting', type: 'success' }),
			entry({ teamIndex: 0, category: 'shooting', type: 'fail' }),
			entry({ teamIndex: 0, category: 'shooting', type: 'fail' }),
		];
		expect(deriveTeamStats(history, 0)).toEqual({
			pointingSuccess: 2,
			pointingFail: 1,
			shootingSuccess: 1,
			shootingFail: 2,
		});
	});
});

describe('derivePlayerStats', () => {
	it('filters by player within a team', () => {
		const history = [
			entry({ teamIndex: 0, player: 'Alice', category: 'pointing', type: 'success' }),
			entry({ teamIndex: 0, player: 'Bob', category: 'pointing', type: 'success' }),
			entry({ teamIndex: 0, player: 'Alice', category: 'shooting', type: 'fail' }),
		];
		expect(derivePlayerStats(history, 0, 'Alice')).toEqual({
			pointingSuccess: 1,
			pointingFail: 0,
			shootingSuccess: 0,
			shootingFail: 1,
		});
	});

	it('returns zeros for unknown player', () => {
		const history = [
			entry({ teamIndex: 0, player: 'Alice', category: 'pointing', type: 'success' }),
		];
		expect(derivePlayerStats(history, 0, 'Nobody')).toEqual({
			pointingSuccess: 0,
			pointingFail: 0,
			shootingSuccess: 0,
			shootingFail: 0,
		});
	});
});

describe('deriveTotals', () => {
	it('returns null percentage for zero attempts', () => {
		const totals = deriveTotals({
			pointingSuccess: 0,
			pointingFail: 0,
			shootingSuccess: 0,
			shootingFail: 0,
		});
		expect(totals).toEqual({ totalSuccesses: 0, totalAttempts: 0, percentage: null });
	});

	it('computes correct totals and percentage', () => {
		const totals = deriveTotals({
			pointingSuccess: 3,
			pointingFail: 1,
			shootingSuccess: 2,
			shootingFail: 4,
		});
		expect(totals).toEqual({ totalSuccesses: 5, totalAttempts: 10, percentage: 50 });
	});

	it('rounds percentage to nearest integer', () => {
		const totals = deriveTotals({
			pointingSuccess: 1,
			pointingFail: 2,
			shootingSuccess: 0,
			shootingFail: 0,
		});
		expect(totals).toEqual({ totalSuccesses: 1, totalAttempts: 3, percentage: 33 });
	});
});

const round = (scoringTeamIndex: 0 | 1, points: number): Round => ({
	scoringTeamIndex,
	points,
	expectedThrows: 12,
	timestamp: new Date(),
});

describe('deriveScore', () => {
	it('returns [0, 0] for empty rounds', () => {
		expect(deriveScore([])).toEqual([0, 0]);
	});

	it('sums points per team', () => {
		const rounds = [round(0, 3), round(1, 1), round(0, 2)];
		expect(deriveScore(rounds)).toEqual([5, 1]);
	});
});

describe('deriveRoundHistory', () => {
	it('returns empty array for no rounds', () => {
		expect(deriveRoundHistory([], 'We', 'They')).toEqual([]);
	});

	it('maps rounds to history entries with team names', () => {
		const rounds = [round(0, 3), round(1, 2)];
		expect(deriveRoundHistory(rounds, 'We', 'They')).toEqual([
			{ roundNumber: 1, teamName: 'We', points: 3 },
			{ roundNumber: 2, teamName: 'They', points: 2 },
		]);
	});
});
