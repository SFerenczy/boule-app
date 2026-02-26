<script lang="ts">
	import type { Game } from '$lib/types';
	import TeamCard from './TeamCard.svelte';
	import { Dialog } from '@skeletonlabs/skeleton-svelte';
	import {
		app_title,
		end_game,
		end_game_title,
		end_game_description,
		cancel,
	} from '$lib/paraglide/messages.js';

	const {
		game,
		onUpdate,
		onEndGame,
	}: {
		readonly game: Game;
		readonly onUpdate: (
			teamIndex: 0 | 1,
			category: 'pointing' | 'shooting',
			type: 'success' | 'fail',
		) => void;
		readonly onEndGame: () => void;
	} = $props();

	let confirmOpen = $state(false);
</script>

<div class="flex min-h-screen flex-col gap-4 p-4">
	<header class="pt-2 text-center">
		<h1 class="h2 font-bold">{app_title()}</h1>
	</header>

	<div class="flex flex-col gap-4">
		<TeamCard
			teamName={game.team1Name}
			stats={game.team1Stats}
			teamIndex={0}
			onUpdate={(category, type) => onUpdate(0, category, type)}
		/>

		<TeamCard
			teamName={game.team2Name}
			stats={game.team2Stats}
			teamIndex={1}
			onUpdate={(category, type) => onUpdate(1, category, type)}
		/>
	</div>

	<button
		type="button"
		class="btn btn-lg preset-outlined-error-500 mt-auto w-full"
		onclick={() => (confirmOpen = true)}
	>
		{end_game()}
	</button>
</div>

<Dialog open={confirmOpen} onOpenChange={(e) => (confirmOpen = e.open)}>
	<Dialog.Backdrop class="fixed inset-0 bg-surface-950/60 backdrop-blur-sm" />
	<Dialog.Positioner class="fixed inset-0 flex items-center justify-center p-4">
		<Dialog.Content class="card preset-filled-surface-50-950 w-full max-w-sm space-y-4 p-6">
			<Dialog.Title class="h3 font-bold">{end_game_title()}</Dialog.Title>
			<Dialog.Description class="text-surface-700 dark:text-surface-300 text-sm">
				{end_game_description()}
			</Dialog.Description>
			<div class="flex gap-2">
				<Dialog.CloseTrigger class="btn preset-tonal-surface flex-1">{cancel()}</Dialog.CloseTrigger
				>
				<button
					type="button"
					class="btn preset-filled-error-500 flex-1"
					onclick={() => {
						confirmOpen = false;
						onEndGame();
					}}
				>
					{end_game()}
				</button>
			</div>
		</Dialog.Content>
	</Dialog.Positioner>
</Dialog>
