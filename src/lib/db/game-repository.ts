import type { BoubleDB } from './database';
import type { Game, HistoryEntry, Round } from '$lib/types';
import { boulesPerPlayer } from '$lib/stats';

export const createGame = async (
	db: BoubleDB,
	team1Name: string,
	team2Name: string,
	team1Players: readonly string[] = ['Anonymous'],
	team2Players: readonly string[] = ['Anonymous'],
): Promise<number> => {
	const game: Omit<Game, 'id'> = {
		team1Name,
		team2Name,
		team1Players,
		team2Players,
		history: [],
		rounds: [],
		targetScore: 13,
		status: 'in-progress',
		startedAt: new Date(),
	};
	return db.games.add(game as Game) as Promise<number>;
};

export const getActiveGame = (db: BoubleDB): Promise<Game | undefined> =>
	db.games.where('status').equals('in-progress').first();

export const recordAction = async (
	db: BoubleDB,
	gameId: number,
	entry: Omit<HistoryEntry, 'timestamp' | 'round' | 'throwIndex'>,
): Promise<void> => {
	const game = await db.games.get(gameId);
	if (!game) throw new Error(`Game ${gameId} not found`);

	const currentRound = game.rounds.length + 1;
	const throwIndex = game.history.filter((e) => e.round === currentRound).length + 1;
	const historyEntry: HistoryEntry = {
		...entry,
		timestamp: new Date(),
		round: currentRound,
		throwIndex,
	};
	await db.games.update(gameId, { history: [...game.history, historyEntry] });
};

export const undoLastAction = async (db: BoubleDB, gameId: number): Promise<void> => {
	const game = await db.games.get(gameId);
	if (!game) throw new Error(`Game ${gameId} not found`);
	if (game.history.length === 0) return;

	await db.games.update(gameId, { history: game.history.slice(0, -1) });
};

export const completeGame = async (db: BoubleDB, gameId: number): Promise<void> => {
	await db.games.update(gameId, { status: 'completed', endedAt: new Date() });
};

export const recordRound = async (
	db: BoubleDB,
	gameId: number,
	scoringTeamIndex: 0 | 1 | null,
	points: number,
): Promise<void> => {
	const game = await db.games.get(gameId);
	if (!game) throw new Error(`Game ${gameId} not found`);

	const expectedThrows =
		game.team1Players.length * boulesPerPlayer(game.team1Players.length) +
		game.team2Players.length * boulesPerPlayer(game.team2Players.length);

	const round: Round = { scoringTeamIndex, points, expectedThrows, timestamp: new Date() };
	await db.games.update(gameId, { rounds: [...game.rounds, round] });
};
