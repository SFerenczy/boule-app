import { BoubleDB } from './database';
export {
	createGame,
	getActiveGame,
	recordAction,
	undoLastAction,
	completeGame,
	recordRound,
} from './game-repository';

export const db = new BoubleDB();
