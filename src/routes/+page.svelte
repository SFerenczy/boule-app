<script lang="ts">
	import { onMount } from 'svelte';
	import { liveQuery } from 'dexie';
	import type { Game } from '$lib/types';
	import { db, createGame, recordAction, undoLastAction, completeGame } from '$lib/db';
	import { loading as loadingMsg } from '$lib/paraglide/messages.js';
	import NewGameForm from '$lib/components/NewGameForm.svelte';
	import ScoringScreen from '$lib/components/ScoringScreen.svelte';

	let activeGame: Game | undefined = $state(undefined);
	let loading = $state(true);

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

	const trackingEnabled = $derived(activeGame ? isTrackingEnabled(activeGame) : false);

	async function handleStart(
		team1Name: string,
		team2Name: string,
		team1Players: readonly string[],
		team2Players: readonly string[],
	) {
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
		await completeGame(db, activeGame.id);
	}
</script>

{#if loading}
	<div class="flex min-h-screen items-center justify-center">
		<span
			class="border-primary-500 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
			aria-label={loadingMsg()}
		></span>
	</div>
{:else if activeGame}
	<ScoringScreen
		game={activeGame}
		{trackingEnabled}
		onRecord={handleRecord}
		onEndGame={handleEndGame}
		onUndo={handleUndo}
		canUndo={activeGame.history.length > 0}
	/>
{:else}
	<NewGameForm onStart={handleStart} />
{/if}
