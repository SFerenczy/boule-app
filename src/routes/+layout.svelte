<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import { liveQuery } from 'dexie';
	import { getLocale } from '$lib/paraglide/runtime.js';
	import { db } from '$lib/db';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import '../app.css';

	const { children } = $props();

	let hasActiveGame = $state(false);

	onMount(() => {
		if (browser) {
			document.documentElement.lang = getLocale();

			if ('serviceWorker' in navigator) {
				navigator.serviceWorker.register('/service-worker.js');
			}
		}

		const subscription = liveQuery(() =>
			db.games.where('status').equals('in-progress').count(),
		).subscribe({
			next: (count) => {
				hasActiveGame = count > 0;
			},
		});

		return () => subscription.unsubscribe();
	});

	const showNav = $derived(!hasActiveGame);
</script>

{@render children()}

{#if showNav}
	<BottomNav currentPath={page.url.pathname} />
{/if}
