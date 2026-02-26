<script lang="ts">
	import type { HistoryEntry } from '$lib/types';
	import { deriveTeamStats } from '$lib/stats';
	import StatRow from './StatRow.svelte';
	import TeamSummary from './TeamSummary.svelte';
	import { pointing, shooting } from '$lib/paraglide/messages.js';

	const {
		teamName,
		history,
		teamIndex,
		onUpdate,
	}: {
		readonly teamName: string;
		readonly history: readonly HistoryEntry[];
		readonly teamIndex: 0 | 1;
		readonly onUpdate: (category: 'pointing' | 'shooting', type: 'success' | 'fail') => void;
	} = $props();

	const stats = $derived(deriveTeamStats(history, teamIndex));
	const accentClass = $derived(teamIndex === 0 ? 'border-primary-500' : 'border-secondary-600');
</script>

<section class={`space-y-2 border-l-4 pl-4 ${accentClass}`}>
	<h2 class="h2 font-semibold">{teamName}</h2>
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
