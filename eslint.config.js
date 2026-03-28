import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import functional from 'eslint-plugin-functional';
import sonarjs from 'eslint-plugin-sonarjs';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import ts from 'typescript-eslint';
import noRawTailwindColors from './eslint/rules/no-raw-tailwind-colors.js';
import validPresetClass from './eslint/rules/valid-preset-class.js';

const boule = {
	rules: {
		'no-raw-tailwind-colors': noRawTailwindColors,
		'valid-preset-class': validPresetClass,
	},
};

export default ts.config(
	eslint.configs.recommended,
	...ts.configs.strict,
	...ts.configs.stylistic,
	...svelte.configs.recommended,
	sonarjs.configs.recommended,
	prettier,
	...svelte.configs.prettier,

	// Complexity rules — keep functions small and simple
	{
		rules: {
			complexity: ['error', 10],
			'max-depth': ['error', 3],
			'max-lines-per-function': ['error', { max: 50, skipBlankLines: true, skipComments: true }],
			'max-params': ['error', 4],
		},
	},

	// Functional programming rules (all files)
	{
		plugins: { functional },
		rules: {
			// Immutability
			'functional/no-let': 'error',
			'functional/immutable-data': 'error',
			'functional/prefer-readonly-type': 'error',
			'functional/no-mixed-types': 'error',

			// No imperative loops — use map/filter/reduce
			'functional/no-loop-statements': 'error',

			// No classes (prefer plain objects + functions)
			'functional/no-classes': 'error',

			// No throw — throw in async functions is equivalent to Promise.reject
			'functional/no-throw-statements': ['error', { allowToRejectPromises: true }],

			// Arrow functions
			'prefer-arrow-callback': 'error',
			'arrow-body-style': ['error', 'as-needed'],

			// Strict JS
			'no-var': 'error',
			'prefer-const': 'error',
			'no-param-reassign': 'error',

			// TS strict extras
			'@typescript-eslint/no-explicit-any': 'error',
			'@typescript-eslint/explicit-function-return-type': 'error',
			'@typescript-eslint/no-non-null-assertion': 'error',
			'@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
		},
	},

	// Dexie requires class extension — no way around it
	{
		files: ['**/db/database.ts'],
		rules: {
			'functional/no-classes': 'off',
			'functional/prefer-readonly-type': 'off',
		},
	},

	// Tests: beforeEach requires reassignable vars; assertion helpers need non-null
	{
		files: ['**/*.test.ts', '**/*.test.js', '**/*.spec.ts', '**/*.spec.js'],
		rules: {
			'functional/no-let': 'off',
			'@typescript-eslint/no-non-null-assertion': 'off',
			'@typescript-eslint/explicit-function-return-type': 'off',
			// Test functions are naturally large — setup + assertions in a single block
			'max-lines-per-function': 'off',
		},
	},

	// Design system enforcement — Svelte files only (where class attributes live)
	{
		files: ['**/*.svelte'],
		plugins: { boule },
		rules: {
			'boule/no-raw-tailwind-colors': 'error',
			'boule/valid-preset-class': 'error',
		},
	},

	// Svelte overrides — relax rules that clash with Svelte's reactive model
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser,
				extraFileExtensions: ['.svelte'],
			},
		},
		rules: {
			// Svelte uses expression statements for reactive assignments and event handlers
			'functional/no-expression-statements': 'off',

			// Svelte 5 runes require let for reactive state ($state, $derived)
			'functional/no-let': 'off',

			// Svelte stores and props involve mutation patterns
			'functional/immutable-data': 'off',

			// Svelte components are class-like structures
			'functional/no-classes': 'off',

			// Component scripts often don't need explicit return types
			'@typescript-eslint/explicit-function-return-type': 'off',

			// sonarjs/deprecation crashes on .svelte files (index out of range bug)
			'sonarjs/deprecation': 'off',
		},
	},

	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},

	{
		ignores: ['build/', '.svelte-kit/', 'dist/', 'src/lib/paraglide/', 'src/service-worker.ts'],
	},
);
