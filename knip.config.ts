import type { KnipConfig } from 'knip';

const config: KnipConfig = {
	entry: ['src/**/*.svelte', 'src/**/*.ts', 'scripts/*.mjs'],
	project: ['src/**/*.{ts,svelte}', 'scripts/*.mjs'],
	ignoreDependencies: [
		// Imported in app.css — knip doesn't trace CSS @import
		'@skeletonlabs/skeleton',
		// Used via @tailwindcss/vite plugin, not imported directly
		'tailwindcss',
		// CLI tool invoked via `just lighthouse`, not imported
		'@lhci/cli',
	],
	ignore: ['src/lib/paraglide/**'],
};

export default config;
