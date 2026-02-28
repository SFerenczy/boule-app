<script lang="ts">
	import type { RoundProgress } from '$lib/stats';
	import { round as roundMsg, throws_progress } from '$lib/paraglide/messages.js';

	const {
		team1Name,
		team2Name,
		score,
		roundNumber,
		roundProgress,
	}: {
		readonly team1Name: string;
		readonly team2Name: string;
		readonly score: readonly [number, number];
		readonly roundNumber: number;
		readonly roundProgress?: RoundProgress;
	} = $props();
</script>

<header class="bg-surface-50-950 sticky top-0 z-10 px-4 py-2 text-center">
	<div class="text-lg font-bold">
		{team1Name}
		<span class="text-primary-500 mx-1">{score[0]} – {score[1]}</span>
		{team2Name}
		<span class="text-surface-500 ml-2 text-xs font-normal"
			>{roundMsg({ number: String(roundNumber) })}{#if roundProgress && roundProgress.expected > 0}
				· {throws_progress({
					thrown: String(roundProgress.thrown),
					expected: String(roundProgress.expected),
				})}{/if}</span
		>
	</div>
</header>
