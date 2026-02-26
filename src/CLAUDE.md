# Source Conventions

Rules and patterns for code under `src/`. Read this before writing any feature code.

## Module Boundaries

| Directory         | Role                                          | Data access?                 |
| ----------------- | --------------------------------------------- | ---------------------------- |
| `routes/`         | Smart components — page-level, data-aware     | Yes (imports from `$lib/db`) |
| `lib/components/` | Dumb components — presentational, props-only  | No                           |
| `lib/db/`         | Data layer — Dexie DB, repositories, queries  | Owns all IndexedDB access    |
| `lib/types/`      | Shared types — exported via barrel `index.ts` | N/A                          |

## Component Architecture

### Smart Components (Routes)

- Live in `src/routes/`
- Import and use `$lib/db` for data
- Subscribe to reactive queries via `liveQuery`
- Pass data down to dumb components via props

### Dumb Components

- Live in `src/lib/components/`
- Receive all data via `$props()`
- No direct database access, no side effects
- Emit events for parent handling

## Reactive Data Pattern

Dexie's `liveQuery` integrates with Svelte reactivity:

```ts
import { liveQuery } from 'dexie';
import { db } from '$lib/db';

// Returns a reactive observable — re-emits when data changes
const games$ = liveQuery(() => db.games.toArray());
```

Use in Svelte components with `$derived` or by subscribing in `onMount`.

## File Naming

| Type      | Convention                  | Example              |
| --------- | --------------------------- | -------------------- |
| Component | PascalCase `.svelte`        | `ScoreCard.svelte`   |
| Test      | Co-located `*.test.ts`      | `database.test.ts`   |
| Types     | Lowercase `.ts` in `types/` | `game.ts`            |
| DB tables | Lowercase `.ts` in `db/`    | `game-repository.ts` |

## Import Conventions

- Use `$lib/` alias for all imports from `src/lib/`
- Use barrel exports from `$lib/types` and `$lib/db`
- Never import across route boundaries (route A importing from route B)

```ts
// Good
import { db } from '$lib/db';
import type { Game } from '$lib/types';

// Bad
import { db } from '../../lib/db/index';
import type { Game } from '../other-route/types';
```

## Type-First Approach

- All shared types live in `$lib/types/index.ts`
- No inline type definitions scattered across files
- Define the type first, then implement the code that uses it
- Dexie table types match the shared types exactly
