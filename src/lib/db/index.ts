import { BoubleDB } from './database';
export {
	createGame,
	getActiveGame,
	recordAction,
	undoLastAction,
	completeGame,
} from './game-repository';

export const db = new BoubleDB();
