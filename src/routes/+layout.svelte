<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { getLocale } from '$lib/paraglide/runtime.js';
	import '../app.css';

	const { children } = $props();

	onMount(() => {
		if (browser) {
			document.documentElement.lang = getLocale();

			if ('serviceWorker' in navigator) {
				navigator.serviceWorker.register('/service-worker.js');
			}
		}
	});
</script>

{@render children()}
