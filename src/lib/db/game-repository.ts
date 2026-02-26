import type { BoubleDB } from './database';
import type { Game, HistoryEntry } from '$lib/types';

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
	entry: Omit<HistoryEntry, 'timestamp'>,
): Promise<void> => {
	const game = await db.games.get(gameId);
	if (!game) throw new Error(`Game ${gameId} not found`);

	const historyEntry: HistoryEntry = { ...entry, timestamp: new Date() };
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
