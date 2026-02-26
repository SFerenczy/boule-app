<script lang="ts">
	import type { TeamStats } from '$lib/types';
	import StatRow from './StatRow.svelte';
	import { pointing, shooting } from '$lib/paraglide/messages.js';

	const {
		teamName,
		stats,
		onUpdate,
		teamIndex,
	}: {
		readonly teamName: string;
		readonly stats: TeamStats;
		readonly onUpdate: (category: 'pointing' | 'shooting', type: 'success' | 'fail') => void;
		readonly teamIndex: 0 | 1;
	} = $props();

	const accentClass = $derived(teamIndex === 0 ? 'bg-primary-500' : 'bg-secondary-600');
</script>

<div class="card preset-outlined-surface-500 overflow-hidden p-0">
	<div class={`h-1.5 ${accentClass}`}></div>
	<div class="space-y-2 p-4">
		<h2 class="h2 font-semibold">{teamName}</h2>
		<StatRow
			label={pointing()}
			successes={stats.pointingSuccess}
			fails={stats.pointingFail}
			onSuccess={() => onUpdate('pointing', 'success')}
			onFail={() => onUpdate('pointing', 'fail')}
		/>
		<StatRow
			label={shooting()}
			successes={stats.shootingSuccess}
			fails={stats.shootingFail}
			onSuccess={() => onUpdate('shooting', 'success')}
			onFail={() => onUpdate('shooting', 'fail')}
		/>
	</div>
</div>
