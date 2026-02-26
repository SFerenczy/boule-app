<script lang="ts">
	import type { DerivedStats } from '$lib/stats';
	import { deriveTotals } from '$lib/stats';
	import { success_summary } from '$lib/paraglide/messages.js';

	const { stats }: { readonly stats: DerivedStats } = $props();

	const totals = $derived(deriveTotals(stats));
</script>

<div class="text-surface-700 dark:text-surface-300 flex items-center justify-between text-base">
	<span>{success_summary()}</span>
	{#if totals.percentage !== null}
		<span class="font-bold"
			>{totals.percentage}% ({totals.totalSuccesses}/{totals.totalAttempts})</span
		>
	{:else}
		<span>–</span>
	{/if}
</div>
