import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { IDBFactory } from 'fake-indexeddb';
import { BoubleDB } from './database';
import { createGame, getActiveGame, updateStats, completeGame } from './game-repository';

let db: BoubleDB;

beforeEach(async () => {
	// Each test gets a fresh in-memory database via a new IDBFactory instance
	db = new BoubleDB({ indexedDB: new IDBFactory() });
	await db.open();
});

afterEach(async () => {
	await db.close();
});

describe('createGame', () => {
	it('initializes all counters to zero', async () => {
		const id = await createGame(db, 'Team A', 'Team B');
		const game = await db.games.get(id);

		expect(game?.team1Stats).toEqual({
			pointingSuccess: 0,
			pointingFail: 0,
			shootingSuccess: 0,
			shootingFail: 0,
		});
		expect(game?.team2Stats).toEqual({
			pointingSuccess: 0,
			pointingFail: 0,
			shootingSuccess: 0,
			shootingFail: 0,
		});
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

describe('updateStats', () => {
	it('increments team1 pointing success', async () => {
		const id = await createGame(db, 'Team A', 'Team B');
		await updateStats(db, id, 0, 'pointing', 'success');
		const game = await db.games.get(id);
		expect(game?.team1Stats.pointingSuccess).toBe(1);
	});

	it('increments team2 shooting fail', async () => {
		const id = await createGame(db, 'Team A', 'Team B');
		await updateStats(db, id, 1, 'shooting', 'fail');
		const game = await db.games.get(id);
		expect(game?.team2Stats.shootingFail).toBe(1);
	});

	it('does not affect other counters', async () => {
		const id = await createGame(db, 'Team A', 'Team B');
		await updateStats(db, id, 0, 'pointing', 'success');
		const game = await db.games.get(id);
		expect(game?.team1Stats.pointingFail).toBe(0);
		expect(game?.team1Stats.shootingSuccess).toBe(0);
		expect(game?.team1Stats.shootingFail).toBe(0);
		expect(game?.team2Stats).toEqual({
			pointingSuccess: 0,
			pointingFail: 0,
			shootingSuccess: 0,
			shootingFail: 0,
		});
	});

	it('accumulates multiple increments', async () => {
		const id = await createGame(db, 'Team A', 'Team B');
		await updateStats(db, id, 0, 'pointing', 'success');
		await updateStats(db, id, 0, 'pointing', 'success');
		await updateStats(db, id, 0, 'pointing', 'success');
		const game = await db.games.get(id);
		expect(game?.team1Stats.pointingSuccess).toBe(3);
	});

	it('throws for unknown game id', async () => {
		await expect(updateStats(db, 999, 0, 'pointing', 'success')).rejects.toThrow(
			'Game 999 not found',
		);
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
		// getActiveGame returns the first match — only one should be used at a time
		expect(active?.team1Name).toBe('Team A');
	});
});
