<script lang="ts">
	import { onMount } from 'svelte';
	import { liveQuery } from 'dexie';
	import type { Game } from '$lib/types';
	import { db, createGame, recordAction, undoLastAction, completeGame, recordRound } from '$lib/db';
	import { deriveScore, deriveRoundHistory } from '$lib/stats';
	import { loading as loadingMsg } from '$lib/paraglide/messages.js';
	import NewGameForm from '$lib/components/NewGameForm.svelte';
	import ScoringScreen from '$lib/components/ScoringScreen.svelte';
	import GameOverCard from '$lib/components/GameOverCard.svelte';

	let activeGame: Game | undefined = $state(undefined);
	let loading = $state(true);
	let lastCompletedGame: Game | undefined = $state(undefined);

	onMount(() => {
		const subscription = liveQuery(() =>
			db.games.where('status').equals('in-progress').first(),
		).subscribe({
			next: (game) => {
				activeGame = game;
				loading = false;
			},
			error: () => {
				loading = false;
			},
		});

		return () => subscription.unsubscribe();
	});

	function isTrackingEnabled(game: Game): boolean {
		return !(
			game.team1Players.length === 1 &&
			game.team1Players[0] === 'Anonymous' &&
			game.team2Players.length === 1 &&
			game.team2Players[0] === 'Anonymous'
		);
	}

	function computeMaxPoints(game: Game, tracking: boolean): readonly [number, number] {
		if (!tracking) return [6, 6] as const;
		const boules1 = game.team1Players.length <= 2 ? 3 : 2;
		const boules2 = game.team2Players.length <= 2 ? 3 : 2;
		return [game.team1Players.length * boules1, game.team2Players.length * boules2] as const;
	}

	const trackingEnabled = $derived(
		activeGame !== undefined ? isTrackingEnabled(activeGame) : false,
	);
	const score = $derived.by((): readonly [number, number] =>
		activeGame !== undefined ? deriveScore(activeGame.rounds) : [0, 0],
	);
	const roundNumber = $derived.by(() =>
		activeGame !== undefined ? activeGame.rounds.length + 1 : 1,
	);
	const roundHistory = $derived.by(() =>
		activeGame !== undefined
			? deriveRoundHistory(activeGame.rounds, activeGame.team1Name, activeGame.team2Name)
			: [],
	);
	const maxPointsByTeam = $derived.by((): readonly [number, number] =>
		activeGame !== undefined ? computeMaxPoints(activeGame, trackingEnabled) : [6, 6],
	);

	async function handleStart(
		team1Name: string,
		team2Name: string,
		team1Players: readonly string[],
		team2Players: readonly string[],
	) {
		lastCompletedGame = undefined;
		await createGame(db, team1Name, team2Name, team1Players, team2Players);
	}

	async function handleRecord(
		teamIndex: 0 | 1,
		category: 'pointing' | 'shooting',
		type: 'success' | 'fail',
		player: string,
	) {
		if (!activeGame?.id) return;
		await recordAction(db, activeGame.id, { teamIndex, player, category, type });
	}

	async function handleUndo() {
		if (!activeGame?.id || activeGame.history.length === 0) return;
		await undoLastAction(db, activeGame.id);
	}

	async function handleEndGame() {
		if (!activeGame?.id) return;
		const game = await db.games.get(activeGame.id);
		await completeGame(db, activeGame.id);
		if (game) lastCompletedGame = game;
	}

	async function handleScoreRound(teamIndex: 0 | 1 | null, points: number) {
		if (!activeGame?.id) return;
		await recordRound(db, activeGame.id, teamIndex, points);
	}
</script>

{#if loading}
	<div class="flex min-h-screen items-center justify-center">
		<span
			class="border-primary-500 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
			aria-label={loadingMsg()}
		></span>
	</div>
{:else if lastCompletedGame && !activeGame}
	<GameOverCard
		team1Name={lastCompletedGame.team1Name}
		team2Name={lastCompletedGame.team2Name}
		score={deriveScore(lastCompletedGame.rounds)}
		roundCount={lastCompletedGame.rounds.length}
		onNewGame={() => (lastCompletedGame = undefined)}
	/>
{:else if activeGame}
	<ScoringScreen
		game={activeGame}
		{trackingEnabled}
		{score}
		{roundNumber}
		{roundHistory}
		{maxPointsByTeam}
		onRecord={handleRecord}
		onEndGame={handleEndGame}
		onUndo={handleUndo}
		onScoreRound={handleScoreRound}
		canUndo={activeGame.history.length > 0}
	/>
{:else}
	<NewGameForm onStart={handleStart} />
{/if}
