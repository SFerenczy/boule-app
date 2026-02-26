<script lang="ts">
	import { getLocale, setLocale, locales } from '$lib/paraglide/runtime.js';
	import { language as languageMsg } from '$lib/paraglide/messages.js';

	const labels: Record<string, string> = {
		en: 'English',
		de: 'Deutsch',
		fr: 'Français',
	};

	function handleChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		setLocale(target.value as (typeof locales)[number]);
	}
</script>

<label class="flex items-center gap-2 text-sm">
	<span class="text-surface-700 dark:text-surface-300">{languageMsg()}</span>
	<select class="preset-form-input py-1 text-sm" value={getLocale()} onchange={handleChange}>
		{#each locales as locale (locale)}
			<option value={locale}>{labels[locale] ?? locale}</option>
		{/each}
	</select>
</label>
