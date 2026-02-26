<script lang="ts">
	import { Dialog } from '@skeletonlabs/skeleton-svelte';
	import { who_played } from '$lib/paraglide/messages.js';

	const {
		open,
		players,
		onSelect,
		onClose,
	}: {
		readonly open: boolean;
		readonly players: readonly string[];
		readonly onSelect: (player: string) => void;
		readonly onClose: () => void;
	} = $props();
</script>

<Dialog
	{open}
	onOpenChange={(e) => {
		if (!e.open) onClose();
	}}
>
	<Dialog.Backdrop class="fixed inset-0 bg-surface-950/60" />
	<Dialog.Positioner class="fixed inset-0 flex items-center justify-center p-4">
		<Dialog.Content class="card preset-filled-surface-50-950 w-full max-w-sm space-y-4 p-6">
			<Dialog.Title class="h3 font-bold">{who_played()}</Dialog.Title>
			<div class="flex flex-col gap-3">
				{#each players as player (player)}
					<button
						type="button"
						class="btn preset-outlined-primary-500 min-h-14 w-full text-xl"
						onclick={() => onSelect(player)}
					>
						{player}
					</button>
				{/each}
			</div>
		</Dialog.Content>
	</Dialog.Positioner>
</Dialog>
