<script lang="ts">
	import { Dialog } from '@skeletonlabs/skeleton-svelte';
	import { db } from '$lib/db';
	import LanguageSelector from '$lib/components/LanguageSelector.svelte';
	import {
		settings_title,
		settings_reset_title,
		settings_reset_description,
		settings_reset_button,
		settings_reset_confirm_title,
		settings_reset_confirm_description,
		settings_reset_confirm_button,
		settings_reset_success,
		cancel,
	} from '$lib/paraglide/messages.js';

	let showConfirm = $state(false);
	let showSuccess = $state(false);

	async function handleReset() {
		await db.games.clear();
		localStorage.removeItem('boule-player-settings');
		showConfirm = false;
		showSuccess = true;
		setTimeout(() => {
			showSuccess = false;
		}, 3000);
	}
</script>

<header class="p-4">
	<h2 class="h2">{settings_title()}</h2>
</header>

<div class="flex flex-col gap-4 p-4 pt-0">
	<!-- Language section -->
	<section class="card preset-outlined-surface-500 p-4">
		<LanguageSelector />
	</section>

	<!-- Danger zone section -->
	<section class="card preset-outlined-surface-500 p-4">
		<h3 class="h3 mb-2">{settings_reset_title()}</h3>
		<p class="text-sm text-surface-500 mb-4">{settings_reset_description()}</p>
		<button class="btn preset-filled-error-500 w-full" onclick={() => (showConfirm = true)}>
			{settings_reset_button()}
		</button>
	</section>

	{#if showSuccess}
		<div class="card preset-filled-success-500 p-4 text-center font-medium">
			{settings_reset_success()}
		</div>
	{/if}
</div>

<Dialog
	open={showConfirm}
	onOpenChange={(e) => {
		if (!e.open) showConfirm = false;
	}}
>
	<Dialog.Backdrop class="fixed inset-0 bg-surface-950/60" />
	<Dialog.Positioner class="fixed inset-0 flex items-center justify-center p-4">
		<Dialog.Content class="card preset-filled-surface-50-950 w-full max-w-sm space-y-4 p-6">
			<Dialog.Title class="h3 font-bold">{settings_reset_confirm_title()}</Dialog.Title>
			<p class="text-sm text-surface-500">{settings_reset_confirm_description()}</p>
			<div class="flex flex-col gap-3">
				<button
					type="button"
					class="btn preset-filled-error-500 min-h-14 w-full text-lg"
					onclick={handleReset}
				>
					{settings_reset_confirm_button()}
				</button>
				<button
					type="button"
					class="btn preset-outlined-surface-500 min-h-14 w-full text-lg"
					onclick={() => (showConfirm = false)}
				>
					{cancel()}
				</button>
			</div>
		</Dialog.Content>
	</Dialog.Positioner>
</Dialog>
