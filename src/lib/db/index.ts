import { BoubleDB } from './database';
export { createGame, getActiveGame, updateStats, completeGame } from './game-repository';

export const db = new BoubleDB();
