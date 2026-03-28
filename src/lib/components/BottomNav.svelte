<script lang="ts">
	import { resolve } from '$app/paths';
	import { nav_home, nav_stats, nav_settings } from '$lib/paraglide/messages.js';

	const {
		currentPath,
	}: {
		readonly currentPath: string;
	} = $props();
</script>

<nav
	class="bg-surface-50-950 fixed bottom-0 left-0 right-0 z-50 flex border-t border-surface-300 dark:border-surface-700"
>
	<a
		href={resolve('/')}
		class="flex min-h-14 flex-1 flex-col items-center justify-center gap-1 text-sm font-medium {currentPath ===
		'/'
			? 'text-primary-500'
			: 'text-surface-500'}"
		aria-current={currentPath === '/' ? 'page' : undefined}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
			class="h-6 w-6"
			aria-hidden="true"
		>
			<path
				d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z"
			/>
			<path
				d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625A1.875 1.875 0 013.75 19.875v-6.198a.75.75 0 01.091-.086L12 5.432z"
			/>
		</svg>
		{nav_home()}
	</a>
	<a
		href={resolve('/stats')}
		class="flex min-h-14 flex-1 flex-col items-center justify-center gap-1 text-sm font-medium {currentPath ===
		'/stats'
			? 'text-primary-500'
			: 'text-surface-500'}"
		aria-current={currentPath === '/stats' ? 'page' : undefined}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
			class="h-6 w-6"
			aria-hidden="true"
		>
			<path
				d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.035-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z"
			/>
		</svg>
		{nav_stats()}
	</a>
	<a
		href={resolve('/settings')}
		class="flex min-h-14 flex-1 flex-col items-center justify-center gap-1 text-sm font-medium {currentPath ===
		'/settings'
			? 'text-primary-500'
			: 'text-surface-500'}"
		aria-current={currentPath === '/settings' ? 'page' : undefined}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
			class="h-6 w-6"
			aria-hidden="true"
		>
			<path
				fill-rule="evenodd"
				d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
				clip-rule="evenodd"
			/>
		</svg>
		{nav_settings()}
	</a>
</nav>
