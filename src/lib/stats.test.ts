import { describe, it, expect } from 'vitest';
import type { HistoryEntry } from '$lib/types';
import type { Round } from '$lib/types';
import {
	deriveTeamStats,
	derivePlayerStats,
	deriveTotals,
	deriveScore,
	deriveRoundHistory,
	boulesPerPlayer,
	deriveRoundProgress,
	deriveTeamRoundProgress,
	derivePlayerRoundThrows,
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

describe('boulesPerPlayer', () => {
	it('returns 3 for 1-player teams', () => {
		expect(boulesPerPlayer(1)).toBe(3);
	});

	it('returns 3 for 2-player teams', () => {
		expect(boulesPerPlayer(2)).toBe(3);
	});

	it('returns 2 for 3-player teams', () => {
		expect(boulesPerPlayer(3)).toBe(2);
	});
});

describe('deriveRoundProgress', () => {
	it('returns zero thrown for empty history', () => {
		expect(deriveRoundProgress([], 1, 2, 2)).toEqual({ thrown: 0, expected: 12 });
	});

	it('counts throws in the current round only', () => {
		const history = [
			entry({ teamIndex: 0, category: 'pointing', type: 'success', round: 1, throwIndex: 1 }),
			entry({ teamIndex: 1, category: 'pointing', type: 'success', round: 1, throwIndex: 2 }),
			entry({ teamIndex: 0, category: 'pointing', type: 'success', round: 2, throwIndex: 1 }),
		];
		expect(deriveRoundProgress(history, 1, 2, 2)).toEqual({ thrown: 2, expected: 12 });
	});

	it('computes expected for mixed team sizes', () => {
		// 1v3: 1*3 + 3*2 = 9
		expect(deriveRoundProgress([], 1, 1, 3)).toEqual({ thrown: 0, expected: 9 });
	});
});

describe('deriveTeamRoundProgress', () => {
	it('counts only throws for the specified team', () => {
		const history = [
			entry({ teamIndex: 0, category: 'pointing', type: 'success', round: 1, throwIndex: 1 }),
			entry({ teamIndex: 1, category: 'pointing', type: 'success', round: 1, throwIndex: 2 }),
			entry({ teamIndex: 0, category: 'shooting', type: 'fail', round: 1, throwIndex: 3 }),
		];
		expect(deriveTeamRoundProgress(history, 1, 0, 2)).toEqual({ thrown: 2, expected: 6 });
		expect(deriveTeamRoundProgress(history, 1, 1, 2)).toEqual({ thrown: 1, expected: 6 });
	});
});

describe('derivePlayerRoundThrows', () => {
	it('returns 0 for a player with no throws', () => {
		expect(derivePlayerRoundThrows([], 1, 'Alice')).toBe(0);
	});

	it('counts throws for a specific player in a specific round', () => {
		const history = [
			entry({
				teamIndex: 0,
				player: 'Alice',
				category: 'pointing',
				type: 'success',
				round: 1,
				throwIndex: 1,
			}),
			entry({
				teamIndex: 0,
				player: 'Bob',
				category: 'pointing',
				type: 'success',
				round: 1,
				throwIndex: 2,
			}),
			entry({
				teamIndex: 0,
				player: 'Alice',
				category: 'shooting',
				type: 'fail',
				round: 1,
				throwIndex: 3,
			}),
			entry({
				teamIndex: 0,
				player: 'Alice',
				category: 'pointing',
				type: 'success',
				round: 2,
				throwIndex: 1,
			}),
		];
		expect(derivePlayerRoundThrows(history, 1, 'Alice')).toBe(2);
		expect(derivePlayerRoundThrows(history, 1, 'Bob')).toBe(1);
		expect(derivePlayerRoundThrows(history, 2, 'Alice')).toBe(1);
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
		expect(deriveRoundHistory([], 'Team A', 'Team B')).toEqual([]);
	});

	it('maps rounds to history entries with team names', () => {
		const rounds = [round(0, 3), round(1, 2)];
		expect(deriveRoundHistory(rounds, 'Team A', 'Team B')).toEqual([
			{ roundNumber: 1, teamName: 'Team A', points: 3 },
			{ roundNumber: 2, teamName: 'Team B', points: 2 },
		]);
	});
});
