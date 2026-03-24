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

export const deriveScore = (rounds: readonly Round[]): readonly [number, number] =>
	rounds.reduce<readonly [number, number]>(
		(acc, r) =>
			r.scoringTeamIndex === null
				? acc
				: r.scoringTeamIndex === 0
					? [acc[0] + r.points, acc[1]]
					: [acc[0], acc[1] + r.points],
		[0, 0],
	);

export const boulesPerPlayer = (playerCount: number): number => (playerCount <= 2 ? 3 : 2);

export interface RoundProgress {
	readonly thrown: number;
	readonly expected: number;
}

export const deriveRoundProgress = (
	history: readonly HistoryEntry[],
	roundNumber: number,
	team1PlayerCount: number,
	team2PlayerCount: number,
): RoundProgress => {
	const thrown = history.filter((e) => e.round === roundNumber).length;
	const expected =
		team1PlayerCount * boulesPerPlayer(team1PlayerCount) +
		team2PlayerCount * boulesPerPlayer(team2PlayerCount);
	return { thrown, expected };
};

export const deriveTeamRoundProgress = (
	history: readonly HistoryEntry[],
	roundNumber: number,
	teamIndex: 0 | 1,
	playerCount: number,
): RoundProgress => {
	const thrown = history.filter((e) => e.round === roundNumber && e.teamIndex === teamIndex).length;
	const expected = playerCount * boulesPerPlayer(playerCount);
	return { thrown, expected };
};

export const derivePlayerRoundThrows = (
	history: readonly HistoryEntry[],
	roundNumber: number,
	player: string,
): number => history.filter((e) => e.round === roundNumber && e.player === player).length;

export interface RoundHistoryEntry {
	readonly roundNumber: number;
	readonly teamName: string | null;
	readonly points: number;
	readonly isDeadEnd: boolean;
}

export const deriveRoundHistory = (
	rounds: readonly Round[],
	team1Name: string,
	team2Name: string,
): readonly RoundHistoryEntry[] =>
	rounds.map((r, i) => ({
		roundNumber: i + 1,
		teamName: r.scoringTeamIndex === null ? null : r.scoringTeamIndex === 0 ? team1Name : team2Name,
		points: r.points,
		isDeadEnd: r.scoringTeamIndex === null,
	}));
