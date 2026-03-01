import type { CategoryStats, Game, PlayerGameDataPoint, PlayerOverallStats } from '$lib/types';
import { deriveScore } from '$lib/stats';

const makeCategoryStats = (successes: number, attempts: number): CategoryStats => ({
	successes,
	attempts,
	rate: attempts === 0 ? null : Math.round((successes / attempts) * 100),
});

const findPlayerTeamIndex = (game: Game, playerName: string): 0 | 1 | null => {
	if (game.team1Players.includes(playerName)) return 0;
	if (game.team2Players.includes(playerName)) return 1;
	return null;
};

export const getPlayerGames = (games: readonly Game[], playerName: string): readonly Game[] =>
	games.filter((g) => g.team1Players.includes(playerName) || g.team2Players.includes(playerName));

export const getPlayerGameStats = (game: Game, playerName: string): PlayerGameDataPoint => {
	const teamIndex = findPlayerTeamIndex(game, playerName);
	const playerHistory = game.history.filter((e) => e.player === playerName);

	const pointingSuccesses = playerHistory.filter(
		(e) => e.category === 'pointing' && e.type === 'success',
	).length;
	const pointingAttempts = playerHistory.filter((e) => e.category === 'pointing').length;
	const shootingSuccesses = playerHistory.filter(
		(e) => e.category === 'shooting' && e.type === 'success',
	).length;
	const shootingAttempts = playerHistory.filter((e) => e.category === 'shooting').length;

	const score = deriveScore(game.rounds);
	const playerTeamScore = teamIndex === 0 ? score[0] : score[1];
	const opponentScore = teamIndex === 0 ? score[1] : score[0];

	const won: boolean | null =
		game.status === 'completed' && teamIndex !== null ? playerTeamScore > opponentScore : null;

	return {
		gameId: game.id ?? 0,
		date: game.startedAt,
		won,
		score: [playerTeamScore, opponentScore],
		pointing: makeCategoryStats(pointingSuccesses, pointingAttempts),
		shooting: makeCategoryStats(shootingSuccesses, shootingAttempts),
		overall: makeCategoryStats(
			pointingSuccesses + shootingSuccesses,
			pointingAttempts + shootingAttempts,
		),
	};
};

interface Accumulator {
	readonly wins: number;
	readonly losses: number;
	readonly pointingSuccesses: number;
	readonly pointingAttempts: number;
	readonly shootingSuccesses: number;
	readonly shootingAttempts: number;
}

export const getPlayerOverallStats = (
	games: readonly Game[],
	playerName: string,
): PlayerOverallStats => {
	const playerGames = getPlayerGames(games, playerName);
	const dataPoints = playerGames.map((g) => getPlayerGameStats(g, playerName));

	const acc = dataPoints.reduce<Accumulator>(
		(a, dp) => ({
			wins: a.wins + (dp.won === true ? 1 : 0),
			losses: a.losses + (dp.won === false ? 1 : 0),
			pointingSuccesses: a.pointingSuccesses + dp.pointing.successes,
			pointingAttempts: a.pointingAttempts + dp.pointing.attempts,
			shootingSuccesses: a.shootingSuccesses + dp.shooting.successes,
			shootingAttempts: a.shootingAttempts + dp.shooting.attempts,
		}),
		{
			wins: 0,
			losses: 0,
			pointingSuccesses: 0,
			pointingAttempts: 0,
			shootingSuccesses: 0,
			shootingAttempts: 0,
		},
	);

	const totalThrows = acc.pointingAttempts + acc.shootingAttempts;

	return {
		games: playerGames.length,
		wins: acc.wins,
		losses: acc.losses,
		totalThrows,
		pointing: makeCategoryStats(acc.pointingSuccesses, acc.pointingAttempts),
		shooting: makeCategoryStats(acc.shootingSuccesses, acc.shootingAttempts),
		overall: makeCategoryStats(acc.pointingSuccesses + acc.shootingSuccesses, totalThrows),
	};
};

export const getPlayerTimeSeries = (
	games: readonly Game[],
	playerName: string,
): readonly PlayerGameDataPoint[] =>
	getPlayerGames(games, playerName)
		.toSorted((a, b) => a.startedAt.getTime() - b.startedAt.getTime())
		.map((g) => getPlayerGameStats(g, playerName));
