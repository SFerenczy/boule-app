<script lang="ts">
	import { game_over, final_score, new_game, end_count } from '$lib/paraglide/messages.js';

	const {
		team1Name,
		team2Name,
		score,
		roundCount,
		onNewGame,
	}: {
		readonly team1Name: string;
		readonly team2Name: string;
		readonly score: readonly [number, number];
		readonly roundCount: number;
		readonly onNewGame: () => void;
	} = $props();
</script>

<div class="flex min-h-screen flex-col items-center justify-center p-4">
	<div class="card preset-filled-surface-50-950 w-full max-w-sm space-y-6 p-8 text-center">
		<h1 class="h2 font-bold">{game_over()}</h1>
		<div class="text-surface-500 text-sm">{final_score()}</div>
		<div class="text-3xl font-bold">
			{team1Name}
			<span class="text-primary-500 mx-2">{score[0]} – {score[1]}</span>
			{team2Name}
		</div>
		<div class="text-surface-500 text-sm">
			{end_count({ count: roundCount })}
		</div>
		<button
			type="button"
			class="btn preset-filled-primary-500 min-h-14 w-full text-lg"
			onclick={onNewGame}
		>
			{new_game()}
		</button>
	</div>
</div>
