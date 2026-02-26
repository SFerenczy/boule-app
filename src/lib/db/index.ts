import { BoubleDB } from './database';
export {
	createGame,
	getActiveGame,
	updateStats,
	decrementStats,
	completeGame,
} from './game-repository';

export const db = new BoubleDB();
