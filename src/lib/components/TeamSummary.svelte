<script lang="ts">
	import type { TeamStats } from '$lib/types';
	import { success_summary } from '$lib/paraglide/messages.js';

	const { stats }: { readonly stats: TeamStats } = $props();

	const totalSuccesses = $derived(stats.pointingSuccess + stats.shootingSuccess);
	const totalAttempts = $derived(
		stats.pointingSuccess + stats.pointingFail + stats.shootingSuccess + stats.shootingFail,
	);
	const percentage = $derived(
		totalAttempts === 0 ? null : Math.round((totalSuccesses / totalAttempts) * 100),
	);
</script>

<div class="text-surface-600 dark:text-surface-400 flex items-center justify-between text-sm">
	<span>{success_summary()}</span>
	{#if percentage !== null}
		<span class="font-semibold">{percentage}% ({totalSuccesses}/{totalAttempts})</span>
	{:else}
		<span>–</span>
	{/if}
</div>
