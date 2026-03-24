<script lang="ts">
	import { Dialog } from '@skeletonlabs/skeleton-svelte';
	import { select_team, select_points, dead_end } from '$lib/paraglide/messages.js';

	const {
		open,
		team1Name,
		team2Name,
		maxPointsByTeam,
		onScore,
		onClose,
	}: {
		readonly open: boolean;
		readonly team1Name: string;
		readonly team2Name: string;
		readonly maxPointsByTeam: readonly [number, number];
		readonly onScore: (teamIndex: 0 | 1 | null, points: number) => void;
		readonly onClose: () => void;
	} = $props();

	let selectedTeam = $state<0 | 1 | null>(null);
	let teamChosen = $state(false);

	const maxPoints = $derived(selectedTeam !== null ? maxPointsByTeam[selectedTeam] : 0);

	function handleTeamSelect(teamIndex: 0 | 1) {
		selectedTeam = teamIndex;
		teamChosen = true;
	}

	function handleDeadEnd() {
		onScore(null, 0);
		selectedTeam = null;
		teamChosen = false;
	}

	function handlePointSelect(points: number) {
		if (selectedTeam !== null) {
			onScore(selectedTeam, points);
			selectedTeam = null;
			teamChosen = false;
		}
	}

	function handleClose() {
		selectedTeam = null;
		teamChosen = false;
		onClose();
	}
</script>

<Dialog
	{open}
	onOpenChange={(e) => {
		if (!e.open) handleClose();
	}}
>
	<Dialog.Backdrop class="fixed inset-0 bg-surface-950/60" />
	<Dialog.Positioner class="fixed inset-0 flex items-center justify-center p-4">
		<Dialog.Content class="card preset-filled-surface-50-950 w-full max-w-sm space-y-4 p-6">
			{#if !teamChosen}
				<Dialog.Title class="h3 font-bold">{select_team()}</Dialog.Title>
				<div class="flex flex-col gap-6">
					<button
						type="button"
						class="btn preset-outlined-primary-500 min-h-20 w-full text-xl"
						onclick={() => handleTeamSelect(0)}
					>
						{team1Name}
					</button>
					<button
						type="button"
						class="btn preset-outlined-primary-500 min-h-20 w-full text-xl"
						onclick={() => handleTeamSelect(1)}
					>
						{team2Name}
					</button>
					<button
						type="button"
						class="btn preset-outlined-warning-500 min-h-16 w-full text-lg"
						onclick={handleDeadEnd}
					>
						{dead_end()}
					</button>
				</div>
			{:else}
				<Dialog.Title class="h3 font-bold">{select_points()}</Dialog.Title>
				<div class="grid grid-cols-3 gap-4">
					{#each Array.from({ length: maxPoints }, (_, i) => i + 1) as pts (pts)}
						<button
							type="button"
							class="btn preset-outlined-primary-500 min-h-16 text-xl font-bold"
							onclick={() => handlePointSelect(pts)}
						>
							{pts}
						</button>
					{/each}
				</div>
			{/if}
		</Dialog.Content>
	</Dialog.Positioner>
</Dialog>
