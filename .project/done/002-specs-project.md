# Specs: Project Scaffold — Structure & Configuration (002)

Exact contracts for project structure, dependencies, and configuration.
See also: [002-specs-tooling.md](002-specs-tooling.md)

## Section Index

- [Directory Structure](#directory-structure)
- [Package Manager](#package-manager)
- [Dependencies](#dependencies)
- [SvelteKit Configuration](#sveltekit-configuration)
- [TypeScript Configuration](#typescript-configuration)
- [Tailwind v4 + Skeleton UI](#tailwind-v4--skeleton-ui)
- [Dexie DB Skeleton](#dexie-db-skeleton)
- [PWA](#pwa)

## Directory Structure

```
boule-app/
├── .github/workflows/ci.yml
├── justfile
├── package.json
├── pnpm-lock.yaml
├── svelte.config.js
├── vite.config.ts
├── tsconfig.json
├── eslint.config.js
├── .prettierrc
├── .prettierignore
├── static/
│   ├── manifest.json
│   └── icons/
│       ├── icon-192.png         # PWA icon (192x192)
│       └── icon-512.png         # PWA icon (512x512)
├── src/
│   ├── CLAUDE.md                # Source conventions
│   ├── app.html                 # SvelteKit HTML shell
│   ├── app.css                  # Tailwind + Skeleton imports
│   ├── app.d.ts                 # SvelteKit ambient types
│   ├── service-worker.ts        # PWA offline support
│   ├── routes/
│   │   ├── +layout.svelte       # Root layout (Skeleton shell, SW registration)
│   │   ├── +layout.ts           # SPA mode config (ssr=false)
│   │   └── +page.svelte         # Home placeholder
│   ├── lib/
│   │   ├── components/          # Presentational (dumb) components
│   │   │   └── .gitkeep
│   │   ├── db/
│   │   │   ├── database.ts      # BoubleDB class (extends Dexie)
│   │   │   └── index.ts         # DB singleton export
│   │   └── types/
│   │       └── index.ts         # Shared type exports
│   └── test/
│       └── setup.ts             # Test setup (fake-indexeddb)
```

## Package Manager

pnpm. Lockfile committed. `packageManager` field set in `package.json`.

## Dependencies

Scaffold via `sv create` provides: svelte, @sveltejs/kit, vite, typescript, svelte-check, eslint, prettier, vitest (when selected during setup).

Additional dependencies beyond scaffold:

| Package                         | Type | Purpose                                   |
| ------------------------------- | ---- | ----------------------------------------- |
| `@sveltejs/adapter-static`      | dev  | Static SPA output (replaces adapter-auto) |
| `@tailwindcss/vite`             | dev  | Tailwind v4 Vite plugin                   |
| `@skeletonlabs/skeleton`        | dev  | Skeleton design system                    |
| `@skeletonlabs/skeleton-svelte` | dev  | Skeleton Svelte components                |
| `dexie`                         | prod | IndexedDB wrapper                         |
| `@testing-library/svelte`       | dev  | Component test rendering + queries        |
| `@testing-library/jest-dom`     | dev  | DOM assertion matchers                    |
| `fake-indexeddb`                | dev  | IndexedDB polyfill for Node test env      |
| `jsdom`                         | dev  | DOM environment for Vitest                |

## SvelteKit Configuration

```js
// svelte.config.js — key settings
import adapter from '@sveltejs/adapter-static';

export default {
	kit: {
		adapter: adapter({ fallback: 'index.html' }), // SPA mode
		prerender: { entries: [] }, // No prerendering
	},
};
```

```ts
// src/routes/+layout.ts
export const prerender = false;
export const ssr = false;
```

No `+server.ts` files anywhere. No server-side load functions. No form actions. (DEC-001, DEC-003)

## TypeScript Configuration

Extends SvelteKit's base tsconfig. Strict overrides:

```jsonc
// tsconfig.json (merged with SvelteKit defaults)
{
	"compilerOptions": {
		"strict": true,
		"noUncheckedIndexedAccess": true,
		"exactOptionalPropertyTypes": true,
	},
}
```

## Tailwind v4 + Skeleton UI

Vite plugin in `vite.config.ts`:

```ts
import tailwindcss from '@tailwindcss/vite';
// Add to plugins array alongside sveltekit()
```

Global stylesheet (`src/app.css`):

```css
@import 'tailwindcss';
@import '@skeletonlabs/skeleton';
@import '@skeletonlabs/skeleton-svelte';
@import '@skeletonlabs/skeleton/themes/cerberus';
```

Theme attribute in `src/app.html`:

```html
<html lang="en" data-theme="cerberus"></html>
```

Theme choice (`cerberus`) is a starting point. Can be swapped later without code changes.

## Dexie DB Skeleton

```ts
// src/lib/db/database.ts
import Dexie from 'dexie';

export class BoubleDB extends Dexie {
	constructor() {
		super('boule-app');
		this.version(1).stores({}); // Empty — tables added in Phase 2
	}
}
```

```ts
// src/lib/db/index.ts
import { BoubleDB } from './database';
export const db = new BoubleDB();
```

Reactive data access pattern (documented in `src/CLAUDE.md`, not implemented until Phase 2):

```ts
// Future usage — liveQuery integrates with Svelte reactivity:
import { liveQuery } from 'dexie';
const games$ = liveQuery(() => db.games.toArray());
```

## PWA

### Manifest (`static/manifest.json`)

```json
{
	"name": "Boule App",
	"short_name": "Boule",
	"description": "Boule & Pétanque companion app",
	"start_url": "/",
	"scope": "/",
	"display": "standalone",
	"orientation": "portrait",
	"background_color": "#1a1a2e",
	"theme_color": "#1a1a2e",
	"icons": [
		{ "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
		{ "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
	]
}
```

Colors are placeholders — match to chosen Skeleton theme during implementation.

### Service Worker (`src/service-worker.ts`)

Uses SvelteKit's `$service-worker` module (`build`, `files`, `version`). Strategy:

| Event    | Behavior                                                       |
| -------- | -------------------------------------------------------------- |
| Install  | Precache all static assets + built app shell                   |
| Activate | Purge old versioned caches                                     |
| Fetch    | Cache-first for app shell; network-first for external requests |

### Registration

In `src/routes/+layout.svelte`:

```svelte
<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	onMount(() => {
		if (browser && 'serviceWorker' in navigator) {
			navigator.serviceWorker.register('/service-worker.js');
		}
	});
</script>
```
