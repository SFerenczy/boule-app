<script lang="ts">
	import { success_aria, fail_aria } from '$lib/paraglide/messages.js';

	const {
		label,
		successes,
		fails,
		onSuccess,
		onFail,
	}: {
		readonly label: string;
		readonly successes: number;
		readonly fails: number;
		readonly onSuccess: () => void;
		readonly onFail: () => void;
	} = $props();

	const total = $derived(successes + fails);
	const percentage = $derived(total === 0 ? null : Math.round((successes / total) * 100));

	let lastTap = $state(0);
	const DEBOUNCE_MS = 300;

	function guardedTap(handler: () => void) {
		const now = Date.now();
		if (now - lastTap < DEBOUNCE_MS) return;
		lastTap = now;
		handler();
	}
</script>

<div class="flex items-center gap-3 py-1">
	<span class="w-20 shrink-0 text-sm font-medium">{label}</span>

	<button
		type="button"
		class="preset-stat-tap-success"
		onclick={() => guardedTap(onSuccess)}
		aria-label={success_aria({ label })}
	>
		✓
	</button>

	<div class="flex flex-1 flex-col items-center justify-center text-center">
		{#if percentage !== null}
			<span class="text-lg font-bold leading-tight">{percentage}%</span>
			<span class="text-surface-700 dark:text-surface-300 text-sm">{successes}/{total}</span>
		{:else}
			<span class="text-surface-600 dark:text-surface-400 text-xl">–</span>
		{/if}
	</div>

	<button
		type="button"
		class="preset-stat-tap-fail"
		onclick={() => guardedTap(onFail)}
		aria-label={fail_aria({ label })}
	>
		✗
	</button>
</div>
