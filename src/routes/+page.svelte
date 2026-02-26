<script lang="ts">
	import { onMount } from 'svelte';
	import { liveQuery } from 'dexie';
	import type { Game } from '$lib/types';
	import { db, createGame, updateStats, completeGame } from '$lib/db';
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

	async function handleStart(team1Name: string, team2Name: string) {
		await createGame(db, team1Name, team2Name);
	}

	async function handleUpdate(
		teamIndex: 0 | 1,
		category: 'pointing' | 'shooting',
		type: 'success' | 'fail',
	) {
		if (!activeGame?.id) return;
		await updateStats(db, activeGame.id, teamIndex, category, type);
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
	<ScoringScreen game={activeGame} onUpdate={handleUpdate} onEndGame={handleEndGame} />
{:else}
	<NewGameForm onStart={handleStart} />
{/if}
