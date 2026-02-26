<script lang="ts">
	import { onMount } from 'svelte';
	import { liveQuery } from 'dexie';
	import type { Game, HistoryEntry } from '$lib/types';
	import { db, createGame, updateStats, decrementStats, completeGame } from '$lib/db';
	import { loading as loadingMsg } from '$lib/paraglide/messages.js';
	import NewGameForm from '$lib/components/NewGameForm.svelte';
	import ScoringScreen from '$lib/components/ScoringScreen.svelte';

	let activeGame: Game | undefined = $state(undefined);
	let loading = $state(true);
	let history: readonly HistoryEntry[] = $state([]);

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
		history = [];
		await createGame(db, team1Name, team2Name);
	}

	async function handleUpdate(
		teamIndex: 0 | 1,
		category: 'pointing' | 'shooting',
		type: 'success' | 'fail',
	) {
		if (!activeGame?.id) return;
		history = [...history, { teamIndex, category, type }];
		await updateStats(db, activeGame.id, teamIndex, category, type);
	}

	async function handleUndo() {
		if (!activeGame?.id || history.length === 0) return;
		const last = history[history.length - 1];
		if (!last) return;
		history = history.slice(0, -1);
		await decrementStats(db, activeGame.id, last.teamIndex, last.category, last.type);
	}

	async function handleEndGame() {
		if (!activeGame?.id) return;
		history = [];
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
		onUpdate={handleUpdate}
		onEndGame={handleEndGame}
		onUndo={handleUndo}
		canUndo={history.length > 0}
	/>
{:else}
	<NewGameForm onStart={handleStart} />
{/if}
