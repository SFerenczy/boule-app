import tailwindcss from '@tailwindcss/vite';
import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { sveltekit } from '@sveltejs/kit/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	server: { port: 5174 },
	plugins: [
		tailwindcss(),
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide',
			strategy: ['localStorage', 'preferredLanguage', 'baseLocale'],
		}),
		sveltekit(),
		svelteTesting(),
	],
	test: {
		include: ['src/**/*.test.ts'],
		environment: 'jsdom',
		setupFiles: ['src/test/setup.ts'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'text-summary', 'lcov'],
			include: ['src/lib/**/*.ts'],
			exclude: ['src/lib/paraglide/**', '**/*.test.ts', '**/*.spec.ts', 'src/test/**'],
			thresholds: {
				lines: 50,
				functions: 50,
				branches: 50,
				statements: 50,
			},
		},
	},
});
