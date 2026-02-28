<script lang="ts">
	import { Dialog } from '@skeletonlabs/skeleton-svelte';
	import { who_played } from '$lib/paraglide/messages.js';

	export interface PlayerProgress {
		readonly name: string;
		readonly thrown: number;
		readonly total: number;
	}

	const {
		open,
		players,
		playerProgress,
		onSelect,
		onClose,
	}: {
		readonly open: boolean;
		readonly players: readonly string[];
		readonly playerProgress?: readonly PlayerProgress[];
		readonly onSelect: (player: string) => void;
		readonly onClose: () => void;
	} = $props();

	const progressMap = $derived(
		playerProgress
			? new Map(playerProgress.map((p) => [p.name, p]))
			: undefined,
	);
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
			<div class="flex flex-col gap-6">
				{#each players as player (player)}
					{@const progress = progressMap?.get(player)}
					{@const remaining = progress ? progress.total - progress.thrown : undefined}
					{@const exhausted = remaining !== undefined && remaining <= 0}
					<button
						type="button"
						class="btn preset-outlined-primary-500 min-h-20 w-full text-xl {exhausted ? 'opacity-50' : ''}"
						onclick={() => onSelect(player)}
					>
						<span class="flex flex-col items-center gap-1">
							<span>{player}</span>
							{#if progress}
								<span class="flex gap-1 text-sm">
									{#each Array(progress.total) as _, i}
										{#if i < remaining!}
											<span class="text-primary-500">●</span>
										{:else}
											<span class="text-surface-400">○</span>
										{/if}
									{/each}
								</span>
							{/if}
						</span>
					</button>
				{/each}
			</div>
		</Dialog.Content>
	</Dialog.Positioner>
</Dialog>
