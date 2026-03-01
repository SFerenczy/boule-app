import { describe, it, expect } from 'vitest';
import type { Game, HistoryEntry, Round } from '$lib/types';
import {
	getPlayerGames,
	getPlayerGameStats,
	getPlayerOverallStats,
	getPlayerTimeSeries,
} from '$lib/stats/player-stats';

const makeEntry = (
	overrides: Partial<HistoryEntry> & Pick<HistoryEntry, 'player' | 'category' | 'type'>,
): HistoryEntry => ({
	teamIndex: 0,
	timestamp: new Date(),
	round: 1,
	throwIndex: 1,
	...overrides,
});

const makeRound = (scoringTeamIndex: 0 | 1, points: number): Round => ({
	scoringTeamIndex,
	points,
	expectedThrows: 12,
	timestamp: new Date(),
});

const makeGame = (overrides: Partial<Game> = {}): Game => ({
	id: 1,
	team1Name: 'Team A',
	team2Name: 'Team B',
	team1Players: ['Alice', 'Bob'],
	team2Players: ['Charlie', 'Diana'],
	history: [],
	rounds: [],
	targetScore: 13,
	status: 'completed',
	startedAt: new Date('2025-06-01'),
	...overrides,
});

describe('getPlayerGames', () => {
	it('returns empty array when player is in no games', () => {
		const games = [makeGame()];
		expect(getPlayerGames(games, 'Nobody')).toEqual([]);
	});

	it('returns empty array for empty input', () => {
		expect(getPlayerGames([], 'Alice')).toEqual([]);
	});

	it('filters games containing the player on team1', () => {
		const games = [makeGame({ id: 1 }), makeGame({ id: 2, team1Players: ['Eve'] })];
		const result = getPlayerGames(games, 'Alice');
		expect(result).toHaveLength(1);
		expect(result[0]!.id).toBe(1);
	});

	it('filters games containing the player on team2', () => {
		const games = [makeGame({ id: 1 })];
		const result = getPlayerGames(games, 'Charlie');
		expect(result).toHaveLength(1);
	});
});

describe('getPlayerGameStats', () => {
	it('returns zero stats for a game with no throws', () => {
		const game = makeGame({ rounds: [makeRound(0, 13)] });
		const stats = getPlayerGameStats(game, 'Alice');

		expect(stats.pointing).toEqual({ successes: 0, attempts: 0, rate: null });
		expect(stats.shooting).toEqual({ successes: 0, attempts: 0, rate: null });
		expect(stats.overall).toEqual({ successes: 0, attempts: 0, rate: null });
	});

	it('computes category stats from history entries', () => {
		const game = makeGame({
			history: [
				makeEntry({ player: 'Alice', category: 'pointing', type: 'success' }),
				makeEntry({ player: 'Alice', category: 'pointing', type: 'success' }),
				makeEntry({ player: 'Alice', category: 'pointing', type: 'fail' }),
				makeEntry({ player: 'Alice', category: 'shooting', type: 'success' }),
				makeEntry({ player: 'Alice', category: 'shooting', type: 'fail' }),
				makeEntry({ player: 'Alice', category: 'shooting', type: 'fail' }),
			],
			rounds: [makeRound(0, 13)],
		});
		const stats = getPlayerGameStats(game, 'Alice');

		expect(stats.pointing).toEqual({ successes: 2, attempts: 3, rate: 67 });
		expect(stats.shooting).toEqual({ successes: 1, attempts: 3, rate: 33 });
		expect(stats.overall).toEqual({ successes: 3, attempts: 6, rate: 50 });
	});

	it('ignores other players throws', () => {
		const game = makeGame({
			history: [
				makeEntry({ player: 'Alice', category: 'pointing', type: 'success' }),
				makeEntry({ player: 'Bob', category: 'pointing', type: 'fail' }),
			],
		});
		const stats = getPlayerGameStats(game, 'Alice');
		expect(stats.overall).toEqual({ successes: 1, attempts: 1, rate: 100 });
	});

	it('reports score from players team perspective', () => {
		const game = makeGame({
			rounds: [makeRound(0, 3), makeRound(1, 5)],
		});
		// Alice is on team1 (index 0)
		const aliceStats = getPlayerGameStats(game, 'Alice');
		expect(aliceStats.score).toEqual([3, 5]);

		// Charlie is on team2 (index 1)
		const charlieStats = getPlayerGameStats(game, 'Charlie');
		expect(charlieStats.score).toEqual([5, 3]);
	});

	it('returns won=true when players team won', () => {
		const game = makeGame({
			status: 'completed',
			rounds: [makeRound(0, 13)],
		});
		expect(getPlayerGameStats(game, 'Alice').won).toBe(true);
		expect(getPlayerGameStats(game, 'Charlie').won).toBe(false);
	});

	it('returns won=null for in-progress games', () => {
		const game = makeGame({
			status: 'in-progress',
			rounds: [makeRound(0, 5)],
		});
		expect(getPlayerGameStats(game, 'Alice').won).toBe(null);
	});

	it('uses game id and startedAt for gameId and date', () => {
		const date = new Date('2025-07-15');
		const game = makeGame({ id: 42, startedAt: date });
		const stats = getPlayerGameStats(game, 'Alice');
		expect(stats.gameId).toBe(42);
		expect(stats.date).toBe(date);
	});

	it('defaults gameId to 0 when id is missing', () => {
		const game: Game = {
			team1Name: 'Team A',
			team2Name: 'Team B',
			team1Players: ['Alice'],
			team2Players: ['Bob'],
			history: [],
			rounds: [],
			targetScore: 13,
			status: 'completed',
			startedAt: new Date('2025-06-01'),
		};
		expect(getPlayerGameStats(game, 'Alice').gameId).toBe(0);
	});
});

describe('getPlayerOverallStats', () => {
	it('returns zero stats for no games', () => {
		const stats = getPlayerOverallStats([], 'Alice');
		expect(stats).toEqual({
			games: 0,
			wins: 0,
			losses: 0,
			totalThrows: 0,
			pointing: { successes: 0, attempts: 0, rate: null },
			shooting: { successes: 0, attempts: 0, rate: null },
			overall: { successes: 0, attempts: 0, rate: null },
		});
	});

	it('returns zero stats when player is in none of the games', () => {
		const stats = getPlayerOverallStats([makeGame()], 'Nobody');
		expect(stats.games).toBe(0);
	});

	it('aggregates stats across multiple games', () => {
		const games = [
			makeGame({
				id: 1,
				startedAt: new Date('2025-06-01'),
				history: [
					makeEntry({ player: 'Alice', category: 'pointing', type: 'success' }),
					makeEntry({ player: 'Alice', category: 'pointing', type: 'fail' }),
				],
				rounds: [makeRound(0, 13)],
			}),
			makeGame({
				id: 2,
				startedAt: new Date('2025-06-02'),
				history: [
					makeEntry({ player: 'Alice', category: 'shooting', type: 'success' }),
					makeEntry({ player: 'Alice', category: 'shooting', type: 'success' }),
				],
				rounds: [makeRound(1, 13)],
			}),
		];
		const stats = getPlayerOverallStats(games, 'Alice');

		expect(stats.games).toBe(2);
		expect(stats.wins).toBe(1);
		expect(stats.losses).toBe(1);
		expect(stats.totalThrows).toBe(4);
		expect(stats.pointing).toEqual({ successes: 1, attempts: 2, rate: 50 });
		expect(stats.shooting).toEqual({ successes: 2, attempts: 2, rate: 100 });
		expect(stats.overall).toEqual({ successes: 3, attempts: 4, rate: 75 });
	});

	it('excludes in-progress games from win/loss count', () => {
		const games = [
			makeGame({
				id: 1,
				status: 'completed',
				rounds: [makeRound(0, 13)],
			}),
			makeGame({
				id: 2,
				status: 'in-progress',
				rounds: [makeRound(0, 5)],
			}),
		];
		const stats = getPlayerOverallStats(games, 'Alice');
		expect(stats.games).toBe(2);
		expect(stats.wins).toBe(1);
		expect(stats.losses).toBe(0);
	});
});

describe('getPlayerTimeSeries', () => {
	it('returns empty array for no games', () => {
		expect(getPlayerTimeSeries([], 'Alice')).toEqual([]);
	});

	it('returns data points ordered by date', () => {
		const games = [
			makeGame({ id: 2, startedAt: new Date('2025-06-15') }),
			makeGame({ id: 1, startedAt: new Date('2025-06-01') }),
			makeGame({ id: 3, startedAt: new Date('2025-06-30') }),
		];
		const series = getPlayerTimeSeries(games, 'Alice');
		expect(series.map((dp) => dp.gameId)).toEqual([1, 2, 3]);
	});

	it('excludes games the player is not in', () => {
		const games = [
			makeGame({ id: 1 }),
			makeGame({ id: 2, team1Players: ['Eve'], team2Players: ['Frank'] }),
		];
		const series = getPlayerTimeSeries(games, 'Alice');
		expect(series).toHaveLength(1);
		expect(series[0]!.gameId).toBe(1);
	});

	it('includes full stats per data point', () => {
		const games = [
			makeGame({
				id: 1,
				history: [
					makeEntry({ player: 'Alice', category: 'pointing', type: 'success' }),
					makeEntry({ player: 'Alice', category: 'shooting', type: 'fail' }),
				],
				rounds: [makeRound(0, 13)],
			}),
		];
		const series = getPlayerTimeSeries(games, 'Alice');
		expect(series).toHaveLength(1);
		expect(series[0]!.won).toBe(true);
		expect(series[0]!.overall).toEqual({ successes: 1, attempts: 2, rate: 50 });
	});
});
