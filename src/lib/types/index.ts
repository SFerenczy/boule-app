export type GameStatus = 'in-progress' | 'completed';

export interface HistoryEntry {
	readonly teamIndex: 0 | 1;
	readonly player: string;
	readonly category: 'pointing' | 'shooting';
	readonly type: 'success' | 'fail';
	readonly timestamp: Date;
	readonly round: number;
	readonly throwIndex: number;
}

export interface Round {
	readonly scoringTeamIndex: 0 | 1;
	readonly points: number;
	readonly expectedThrows: number;
	readonly timestamp: Date;
}

export interface Game {
	readonly id?: number;
	readonly team1Name: string;
	readonly team2Name: string;
	readonly team1Players: readonly string[];
	readonly team2Players: readonly string[];
	readonly history: readonly HistoryEntry[];
	readonly rounds: readonly Round[];
	readonly targetScore: number;
	readonly status: GameStatus;
	readonly startedAt: Date;
	readonly endedAt?: Date;
}
