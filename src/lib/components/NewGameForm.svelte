<script lang="ts">
	import { new_game, team1_label, team2_label, start_game } from '$lib/paraglide/messages.js';
	import LanguageSelector from './LanguageSelector.svelte';

	const { onStart }: { readonly onStart: (team1Name: string, team2Name: string) => void } =
		$props();

	let team1Name = $state(team1_label());
	let team2Name = $state(team2_label());

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		onStart(team1Name.trim() || team1_label(), team2Name.trim() || team2_label());
	}
</script>

<div class="flex min-h-screen items-center justify-center p-4">
	<form
		onsubmit={handleSubmit}
		class="card preset-outlined-surface-500 flex w-full max-w-sm flex-col gap-6 p-6"
	>
		<h1 class="h3 text-center font-bold">{new_game()}</h1>

		<label class="flex flex-col gap-1">
			<span class="text-base font-medium">{team1_label()}</span>
			<input
				type="text"
				class="preset-form-input w-full"
				bind:value={team1Name}
				placeholder={team1_label()}
			/>
		</label>

		<label class="flex flex-col gap-1">
			<span class="text-base font-medium">{team2_label()}</span>
			<input
				type="text"
				class="preset-form-input w-full"
				bind:value={team2Name}
				placeholder={team2_label()}
			/>
		</label>

		<button type="submit" class="preset-page-action mt-2">{start_game()}</button>

		<div class="flex justify-center">
			<LanguageSelector />
		</div>
	</form>
</div>
