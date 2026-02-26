export type GameStatus = 'in-progress' | 'completed';

export interface HistoryEntry {
	readonly teamIndex: 0 | 1;
	readonly player: string;
	readonly category: 'pointing' | 'shooting';
	readonly type: 'success' | 'fail';
	readonly timestamp: Date;
}

export interface Game {
	readonly id?: number;
	readonly team1Name: string;
	readonly team2Name: string;
	readonly team1Players: readonly string[];
	readonly team2Players: readonly string[];
	readonly history: readonly HistoryEntry[];
	readonly status: GameStatus;
	readonly startedAt: Date;
	readonly endedAt?: Date;
}
