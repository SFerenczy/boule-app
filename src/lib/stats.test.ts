import { describe, it, expect } from 'vitest';
import type { HistoryEntry } from '$lib/types';
import { deriveTeamStats, derivePlayerStats, deriveTotals } from '$lib/stats';

const entry = (
	overrides: Partial<HistoryEntry> & Pick<HistoryEntry, 'teamIndex' | 'category' | 'type'>,
): HistoryEntry => ({
	player: 'Anonymous',
	timestamp: new Date(),
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
