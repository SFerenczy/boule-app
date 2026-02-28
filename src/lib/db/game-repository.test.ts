import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { IDBFactory } from 'fake-indexeddb';
import { BoubleDB } from './database';
import {
	createGame,
	getActiveGame,
	recordAction,
	undoLastAction,
	completeGame,
	recordRound,
} from './game-repository';

let db: BoubleDB;

beforeEach(async () => {
	db = new BoubleDB({ indexedDB: new IDBFactory() });
	await db.open();
});

afterEach(async () => {
	await db.close();
});

describe('createGame', () => {
	it('initializes with empty history', async () => {
		const id = await createGame(db, 'Team A', 'Team B');
		const game = await db.games.get(id);
		expect(game?.history).toEqual([]);
	});

	it('sets status to in-progress', async () => {
		const id = await createGame(db, 'Team A', 'Team B');
		const game = await db.games.get(id);
		expect(game?.status).toBe('in-progress');
	});

	it('persists team names', async () => {
		const id = await createGame(db, 'Red', 'Blue');
		const game = await db.games.get(id);
		expect(game?.team1Name).toBe('Red');
		expect(game?.team2Name).toBe('Blue');
	});

	it('defaults players to Anonymous', async () => {
		const id = await createGame(db, 'Team A', 'Team B');
		const game = await db.games.get(id);
		expect(game?.team1Players).toEqual(['Anonymous']);
		expect(game?.team2Players).toEqual(['Anonymous']);
	});

	it('accepts custom player lists', async () => {
		const id = await createGame(db, 'Team A', 'Team B', ['Alice', 'Bob'], ['Charlie']);
		const game = await db.games.get(id);
		expect(game?.team1Players).toEqual(['Alice', 'Bob']);
		expect(game?.team2Players).toEqual(['Charlie']);
	});
});

describe('getActiveGame', () => {
	it('returns undefined when no active game exists', async () => {
		const game = await getActiveGame(db);
		expect(game).toBeUndefined();
	});

	it('returns the active game', async () => {
		await createGame(db, 'Team A', 'Team B');
		const game = await getActiveGame(db);
		expect(game?.status).toBe('in-progress');
	});

	it('does not return completed games', async () => {
		const id = await createGame(db, 'Team A', 'Team B');
		await completeGame(db, id);
		const game = await getActiveGame(db);
		expect(game).toBeUndefined();
	});
});

describe('recordAction', () => {
	it('appends entry to history', async () => {
		const id = await createGame(db, 'Team A', 'Team B');
		await recordAction(db, id, {
			teamIndex: 0,
			player: 'Anonymous',
			category: 'pointing',
			type: 'success',
		});
		const game = await db.games.get(id);
		expect(game?.history).toHaveLength(1);
		expect(game?.history[0]?.teamIndex).toBe(0);
		expect(game?.history[0]?.category).toBe('pointing');
		expect(game?.history[0]?.type).toBe('success');
		expect(game?.history[0]?.timestamp).toBeDefined();
	});

	it('accumulates multiple entries', async () => {
		const id = await createGame(db, 'Team A', 'Team B');
		await recordAction(db, id, {
			teamIndex: 0,
			player: 'Anonymous',
			category: 'pointing',
			type: 'success',
		});
		await recordAction(db, id, {
			teamIndex: 1,
			player: 'Anonymous',
			category: 'shooting',
			type: 'fail',
		});
		const game = await db.games.get(id);
		expect(game?.history).toHaveLength(2);
	});

	it('throws for unknown game id', async () => {
		await expect(
			recordAction(db, 999, {
				teamIndex: 0,
				player: 'Anonymous',
				category: 'pointing',
				type: 'success',
			}),
		).rejects.toThrow('Game 999 not found');
	});
});

describe('undoLastAction', () => {
	it('removes last entry from history', async () => {
		const id = await createGame(db, 'Team A', 'Team B');
		await recordAction(db, id, {
			teamIndex: 0,
			player: 'Anonymous',
			category: 'pointing',
			type: 'success',
		});
		await recordAction(db, id, {
			teamIndex: 1,
			player: 'Anonymous',
			category: 'shooting',
			type: 'fail',
		});
		await undoLastAction(db, id);
		const game = await db.games.get(id);
		expect(game?.history).toHaveLength(1);
		expect(game?.history[0]?.teamIndex).toBe(0);
	});

	it('does nothing on empty history', async () => {
		const id = await createGame(db, 'Team A', 'Team B');
		await undoLastAction(db, id);
		const game = await db.games.get(id);
		expect(game?.history).toEqual([]);
	});

	it('throws for unknown game id', async () => {
		await expect(undoLastAction(db, 999)).rejects.toThrow('Game 999 not found');
	});
});

describe('completeGame', () => {
	it('sets status to completed', async () => {
		const id = await createGame(db, 'Team A', 'Team B');
		await completeGame(db, id);
		const game = await db.games.get(id);
		expect(game?.status).toBe('completed');
	});

	it('sets endedAt timestamp', async () => {
		const before = new Date();
		const id = await createGame(db, 'Team A', 'Team B');
		await completeGame(db, id);
		const after = new Date();
		const game = await db.games.get(id);
		expect(game?.endedAt).toBeDefined();
		expect(game?.endedAt?.getTime()).toBeGreaterThanOrEqual(before.getTime());
		expect(game?.endedAt?.getTime()).toBeLessThanOrEqual(after.getTime());
	});
});

describe('Active game constraint', () => {
	it('only one active game returned at a time (first in wins)', async () => {
		await createGame(db, 'Team A', 'Team B');
		await createGame(db, 'Team C', 'Team D');
		const active = await getActiveGame(db);
		expect(active?.team1Name).toBe('Team A');
	});
});

describe('recordRound', () => {
	it('appends round correctly', async () => {
		const id = await createGame(db, 'Team A', 'Team B', ['Alice', 'Bob'], ['Charlie', 'Dave']);
		await recordRound(db, id, 0, 3);
		const game = await db.games.get(id);
		expect(game?.rounds).toHaveLength(1);
		expect(game?.rounds[0]?.scoringTeamIndex).toBe(0);
		expect(game?.rounds[0]?.points).toBe(3);
		expect(game?.rounds[0]?.timestamp).toBeDefined();
	});

	it('sets expectedThrows to 6 for 1v1', async () => {
		const id = await createGame(db, 'A', 'B', ['Alice'], ['Bob']);
		await recordRound(db, id, 0, 1);
		const game = await db.games.get(id);
		expect(game?.rounds[0]?.expectedThrows).toBe(6);
	});

	it('sets expectedThrows to 12 for 2v2', async () => {
		const id = await createGame(db, 'A', 'B', ['A1', 'A2'], ['B1', 'B2']);
		await recordRound(db, id, 0, 1);
		const game = await db.games.get(id);
		expect(game?.rounds[0]?.expectedThrows).toBe(12);
	});

	it('sets expectedThrows to 12 for 3v3', async () => {
		const id = await createGame(db, 'A', 'B', ['A1', 'A2', 'A3'], ['B1', 'B2', 'B3']);
		await recordRound(db, id, 0, 1);
		const game = await db.games.get(id);
		expect(game?.rounds[0]?.expectedThrows).toBe(12);
	});

	it('stays in-progress at target score (no auto-complete)', async () => {
		const id = await createGame(db, 'A', 'B');
		await recordRound(db, id, 0, 13);
		const game = await db.games.get(id);
		expect(game?.status).toBe('in-progress');
		expect(game?.endedAt).toBeUndefined();
	});

	it('throws for unknown game id', async () => {
		await expect(recordRound(db, 999, 0, 1)).rejects.toThrow('Game 999 not found');
	});
});

describe('recordAction round/throwIndex', () => {
	it('stamps round and throwIndex on throws', async () => {
		const id = await createGame(db, 'A', 'B');
		await recordAction(db, id, {
			teamIndex: 0,
			player: 'Anonymous',
			category: 'pointing',
			type: 'success',
		});
		await recordAction(db, id, {
			teamIndex: 1,
			player: 'Anonymous',
			category: 'shooting',
			type: 'fail',
		});
		const game = await db.games.get(id);
		expect(game?.history[0]?.round).toBe(1);
		expect(game?.history[0]?.throwIndex).toBe(1);
		expect(game?.history[1]?.round).toBe(1);
		expect(game?.history[1]?.throwIndex).toBe(2);
	});

	it('resets throwIndex after round scored', async () => {
		const id = await createGame(db, 'A', 'B');
		await recordAction(db, id, {
			teamIndex: 0,
			player: 'Anonymous',
			category: 'pointing',
			type: 'success',
		});
		await recordRound(db, id, 0, 1);
		await recordAction(db, id, {
			teamIndex: 1,
			player: 'Anonymous',
			category: 'pointing',
			type: 'success',
		});
		const game = await db.games.get(id);
		expect(game?.history[1]?.round).toBe(2);
		expect(game?.history[1]?.throwIndex).toBe(1);
	});
});
