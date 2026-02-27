import type { HistoryEntry, Round } from '$lib/types';

export interface DerivedStats {
	readonly pointingSuccess: number;
	readonly pointingFail: number;
	readonly shootingSuccess: number;
	readonly shootingFail: number;
}

export interface DerivedTotals {
	readonly totalSuccesses: number;
	readonly totalAttempts: number;
	readonly percentage: number | null;
}

export const deriveTeamStats = (history: readonly HistoryEntry[], teamIndex: 0 | 1): DerivedStats =>
	history
		.filter((e) => e.teamIndex === teamIndex)
		.reduce<DerivedStats>(
			(acc, e) => {
				const key =
					e.category === 'pointing'
						? e.type === 'success'
							? 'pointingSuccess'
							: 'pointingFail'
						: e.type === 'success'
							? 'shootingSuccess'
							: 'shootingFail';
				return { ...acc, [key]: acc[key] + 1 };
			},
			{ pointingSuccess: 0, pointingFail: 0, shootingSuccess: 0, shootingFail: 0 },
		);

export const derivePlayerStats = (
	history: readonly HistoryEntry[],
	teamIndex: 0 | 1,
	player: string,
): DerivedStats =>
	deriveTeamStats(
		history.filter((e) => e.player === player),
		teamIndex,
	);

export const deriveTotals = (stats: DerivedStats): DerivedTotals => {
	const totalSuccesses = stats.pointingSuccess + stats.shootingSuccess;
	const totalAttempts =
		stats.pointingSuccess + stats.pointingFail + stats.shootingSuccess + stats.shootingFail;
	const percentage =
		totalAttempts === 0 ? null : Math.round((totalSuccesses / totalAttempts) * 100);
	return { totalSuccesses, totalAttempts, percentage };
};

export const deriveScore = (rounds: readonly Round[]): [number, number] =>
	rounds.reduce<[number, number]>(
		(acc, r) => {
			acc[r.scoringTeamIndex] += r.points;
			return acc;
		},
		[0, 0],
	);

export interface RoundHistoryEntry {
	readonly roundNumber: number;
	readonly teamName: string;
	readonly points: number;
}

export const deriveRoundHistory = (
	rounds: readonly Round[],
	team1Name: string,
	team2Name: string,
): RoundHistoryEntry[] =>
	rounds.map((r, i) => ({
		roundNumber: i + 1,
		teamName: r.scoringTeamIndex === 0 ? team1Name : team2Name,
		points: r.points,
	}));
