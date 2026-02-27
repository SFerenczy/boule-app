<script lang="ts">
	import { round as roundMsg } from '$lib/paraglide/messages.js';

	const {
		team1Name,
		team2Name,
		score,
		roundNumber,
	}: {
		readonly team1Name: string;
		readonly team2Name: string;
		readonly score: readonly [number, number];
		readonly roundNumber: number;
	} = $props();
</script>

<header class="bg-surface-50-950 sticky top-0 z-10 px-4 py-3 text-center">
	<div class="text-2xl font-bold">
		{team1Name}
		<span class="text-primary-500 mx-2">{score[0]} – {score[1]}</span>
		{team2Name}
	</div>
	<div class="text-surface-500 text-sm">{roundMsg({ number: String(roundNumber) })}</div>
</header>
