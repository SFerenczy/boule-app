export type GameStatus = 'in-progress' | 'completed';

export interface TeamStats {
	readonly pointingSuccess: number;
	readonly pointingFail: number;
	readonly shootingSuccess: number;
	readonly shootingFail: number;
}

export interface HistoryEntry {
	readonly teamIndex: 0 | 1;
	readonly category: 'pointing' | 'shooting';
	readonly type: 'success' | 'fail';
}

export interface Game {
	readonly id?: number;
	readonly team1Name: string;
	readonly team2Name: string;
	readonly team1Stats: TeamStats;
	readonly team2Stats: TeamStats;
	readonly status: GameStatus;
	readonly startedAt: Date;
	readonly endedAt?: Date;
}
