<script lang="ts">
	import type { Game } from '$lib/types';
	import TeamCard from './TeamCard.svelte';
	import PlayerSelectModal from './PlayerSelectModal.svelte';
	import { Dialog } from '@skeletonlabs/skeleton-svelte';
	import {
		app_title,
		end_game,
		end_game_title,
		end_game_description,
		cancel,
		undo,
	} from '$lib/paraglide/messages.js';

	const {
		game,
		trackingEnabled = false,
		onRecord,
		onEndGame,
		onUndo,
		canUndo,
	}: {
		readonly game: Game;
		readonly trackingEnabled?: boolean;
		readonly onRecord: (
			teamIndex: 0 | 1,
			category: 'pointing' | 'shooting',
			type: 'success' | 'fail',
			player: string,
		) => void;
		readonly onEndGame: () => void;
		readonly onUndo?: () => void;
		readonly canUndo?: boolean;
	} = $props();

	let confirmOpen = $state(false);
	let playerModalOpen = $state(false);
	let pendingAction = $state<{
		readonly teamIndex: 0 | 1;
		readonly category: 'pointing' | 'shooting';
		readonly type: 'success' | 'fail';
	} | null>(null);

	function handleStatTap(
		teamIndex: 0 | 1,
		category: 'pointing' | 'shooting',
		type: 'success' | 'fail',
	) {
		if (trackingEnabled) {
			pendingAction = { teamIndex, category, type };
			playerModalOpen = true;
		} else {
			onRecord(teamIndex, category, type, 'Anonymous');
		}
	}

	function handlePlayerSelect(player: string) {
		if (pendingAction) {
			onRecord(pendingAction.teamIndex, pendingAction.category, pendingAction.type, player);
			pendingAction = null;
		}
		playerModalOpen = false;
	}

	const modalPlayers = $derived(
		pendingAction ? (pendingAction.teamIndex === 0 ? game.team1Players : game.team2Players) : [],
	);
</script>

<div class="flex min-h-screen flex-col p-4">
	<header class="pt-2 text-center">
		<h1 class="h2 font-bold">{app_title()}</h1>
	</header>

	<div class="mt-4 flex flex-col">
		<TeamCard
			teamName={game.team1Name}
			history={game.history}
			teamIndex={0}
			onUpdate={(category, type) => handleStatTap(0, category, type)}
		/>

		<hr class="my-4" />

		<TeamCard
			teamName={game.team2Name}
			history={game.history}
			teamIndex={1}
			onUpdate={(category, type) => handleStatTap(1, category, type)}
		/>
	</div>

	<div class="mt-6 flex gap-4 pt-4">
		{#if onUndo}
			<button
				type="button"
				class="btn preset-outlined-surface-500 flex-1"
				disabled={!canUndo}
				onclick={onUndo}
			>
				{undo()}
			</button>
		{/if}
		<button
			type="button"
			class="btn preset-outlined-error-500 flex-1"
			onclick={() => (confirmOpen = true)}
		>
			{end_game()}
		</button>
	</div>
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

<PlayerSelectModal
	open={playerModalOpen}
	players={modalPlayers}
	onSelect={handlePlayerSelect}
	onClose={() => {
		playerModalOpen = false;
		pendingAction = null;
	}}
/>
