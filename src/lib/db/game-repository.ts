import type { BoubleDB } from './database';
import type { Game, TeamStats } from '$lib/types';

const emptyStats = (): TeamStats => ({
	pointingSuccess: 0,
	pointingFail: 0,
	shootingSuccess: 0,
	shootingFail: 0,
});

export const createGame = async (
	db: BoubleDB,
	team1Name: string,
	team2Name: string,
): Promise<number> => {
	const game: Omit<Game, 'id'> = {
		team1Name,
		team2Name,
		team1Stats: emptyStats(),
		team2Stats: emptyStats(),
		status: 'in-progress',
		startedAt: new Date(),
	};
	return db.games.add(game as Game) as Promise<number>;
};

export const getActiveGame = (db: BoubleDB): Promise<Game | undefined> =>
	db.games.where('status').equals('in-progress').first();

export const updateStats = async (
	db: BoubleDB,
	gameId: number,
	teamIndex: 0 | 1,
	category: 'pointing' | 'shooting',
	type: 'success' | 'fail',
): Promise<void> => {
	const game = await db.games.get(gameId);
	if (!game) throw new Error(`Game ${gameId} not found`);

	const statsKey = teamIndex === 0 ? 'team1Stats' : 'team2Stats';
	const statField =
		category === 'pointing'
			? type === 'success'
				? 'pointingSuccess'
				: 'pointingFail'
			: type === 'success'
				? 'shootingSuccess'
				: 'shootingFail';

	const updated = { ...game[statsKey], [statField]: game[statsKey][statField] + 1 };
	await db.games.update(gameId, { [statsKey]: updated });
};

export const decrementStats = async (
	db: BoubleDB,
	gameId: number,
	teamIndex: 0 | 1,
	category: 'pointing' | 'shooting',
	type: 'success' | 'fail',
): Promise<void> => {
	const game = await db.games.get(gameId);
	if (!game) throw new Error(`Game ${gameId} not found`);

	const statsKey = teamIndex === 0 ? 'team1Stats' : 'team2Stats';
	const statField =
		category === 'pointing'
			? type === 'success'
				? 'pointingSuccess'
				: 'pointingFail'
			: type === 'success'
				? 'shootingSuccess'
				: 'shootingFail';

	const current = game[statsKey][statField];
	const updated = { ...game[statsKey], [statField]: Math.max(0, current - 1) };
	await db.games.update(gameId, { [statsKey]: updated });
};

export const completeGame = async (db: BoubleDB, gameId: number): Promise<void> => {
	await db.games.update(gameId, { status: 'completed', endedAt: new Date() });
};
