import Dexie, { type DexieOptions, type EntityTable } from 'dexie';
import type { Game } from '$lib/types';

export class BoubleDB extends Dexie {
	games!: EntityTable<Game, 'id'>;

	constructor(options?: DexieOptions) {
		super('boule-app', options);
		this.version(1).stores({});
		this.version(2).stores({
			games: '++id, status, startedAt',
		});
	}
}
