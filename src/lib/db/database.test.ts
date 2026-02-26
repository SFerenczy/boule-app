import { describe, it, expect } from 'vitest';
import { BoubleDB } from './database';

describe('BoubleDB', () => {
	it('should initialize with the correct database name', () => {
		// Given: a fresh database instance
		const db = new BoubleDB();

		// Then: the database name should be 'boule-app'
		expect(db.name).toBe('boule-app');

		db.close();
	});
});
