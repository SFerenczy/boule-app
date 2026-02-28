<script lang="ts">
	import type { HistoryEntry } from '$lib/types';
	import type { RoundProgress } from '$lib/stats';
	import { deriveTeamStats } from '$lib/stats';
	import StatRow from './StatRow.svelte';
	import TeamSummary from './TeamSummary.svelte';
	import { pointing, shooting } from '$lib/paraglide/messages.js';

	const {
		teamName,
		history,
		teamIndex,
		roundProgress,
		onUpdate,
	}: {
		readonly teamName: string;
		readonly history: readonly HistoryEntry[];
		readonly teamIndex: 0 | 1;
		readonly roundProgress?: RoundProgress;
		readonly onUpdate: (category: 'pointing' | 'shooting', type: 'success' | 'fail') => void;
	} = $props();

	const stats = $derived(deriveTeamStats(history, teamIndex));
	const accentClass = $derived(teamIndex === 0 ? 'border-primary-500' : 'border-secondary-600');
	const filledClass = $derived(teamIndex === 0 ? 'text-primary-500' : 'text-secondary-600');
	const emptyClass = $derived(teamIndex === 0 ? 'text-primary-500/30' : 'text-secondary-600/30');
</script>

<section class={`space-y-2 border-l-4 pl-4 ${accentClass}`}>
	<h2 class="text-base font-semibold">
		{teamName}
		{#if roundProgress && roundProgress.expected > 0}
			<span class="ml-2 inline-flex gap-0.5 align-middle text-sm">
				{#each Array.from({ length: roundProgress.expected }, (_, i) => i) as i (i)}
					{#if i < roundProgress.expected - roundProgress.thrown}
						<span class={filledClass}>●</span>
					{:else}
						<span class={emptyClass}>●</span>
					{/if}
				{/each}
			</span>
		{/if}
	</h2>
	<div class="preset-stat-row">
		<StatRow
			label={pointing()}
			successes={stats.pointingSuccess}
			fails={stats.pointingFail}
			onSuccess={() => onUpdate('pointing', 'success')}
			onFail={() => onUpdate('pointing', 'fail')}
		/>
	</div>
	<div class="preset-stat-row">
		<StatRow
			label={shooting()}
			successes={stats.shootingSuccess}
			fails={stats.shootingFail}
			onSuccess={() => onUpdate('shooting', 'success')}
			onFail={() => onUpdate('shooting', 'fail')}
		/>
	</div>
	<TeamSummary {stats} />
</section>
