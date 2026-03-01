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

export interface CategoryStats {
	readonly successes: number;
	readonly attempts: number;
	readonly rate: number | null;
}

export interface PlayerOverallStats {
	readonly games: number;
	readonly wins: number;
	readonly losses: number;
	readonly totalThrows: number;
	readonly pointing: CategoryStats;
	readonly shooting: CategoryStats;
	readonly overall: CategoryStats;
}

export interface PlayerGameDataPoint {
	readonly gameId: number;
	readonly date: Date;
	readonly won: boolean | null;
	readonly score: readonly [number, number];
	readonly pointing: CategoryStats;
	readonly shooting: CategoryStats;
	readonly overall: CategoryStats;
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
