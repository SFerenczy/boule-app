# Specs: Project Scaffold — Tooling & Conventions (002)

Contracts for linting, testing, task runner, CI, and code conventions.
See also: [002-specs-project.md](002-specs-project.md)

## Section Index

- [Linting & Formatting](#linting--formatting)
- [Testing](#testing)
- [Justfile](#justfile)
- [CI Pipeline](#ci-pipeline)
- [Source Documentation](#source-documentation)

## Linting & Formatting

### ESLint

Flat config (`eslint.config.js`). Key constraints:

| Setting      | Value                                        |
| ------------ | -------------------------------------------- |
| Config style | ESLint flat config (v9+)                     |
| Plugins      | `eslint-plugin-svelte`, `typescript-eslint`  |
| Base         | Extends recommended rulesets for TS + Svelte |
| Max warnings | `0` — warnings are errors                    |
| Scope        | `src/**/*.{ts,svelte}`                       |

### Prettier

```json
{
	"plugins": ["prettier-plugin-svelte"],
	"overrides": [{ "files": "*.svelte", "options": { "parser": "svelte" } }],
	"singleQuote": true,
	"trailingComma": "all",
	"printWidth": 100,
	"useTabs": true
}
```

Tabs per Svelte ecosystem convention (`sv create` default).

### .prettierignore

Ignore: `pnpm-lock.yaml`, `build/`, `.svelte-kit/`, `static/`.

## Testing

### Runner & Libraries

| Tool                        | Purpose                                            |
| --------------------------- | -------------------------------------------------- |
| Vitest                      | Test runner (SvelteKit default, Vite-native)       |
| `@testing-library/svelte`   | Component rendering + DOM queries                  |
| `@testing-library/jest-dom` | DOM assertion matchers (`toBeInTheDocument`, etc.) |
| `fake-indexeddb`            | IndexedDB polyfill for Node environment            |
| `jsdom`                     | DOM environment for Vitest                         |

### Vitest Configuration

```ts
// vite.config.ts — test block
test: {
  include: ['src/**/*.test.ts'],
  environment: 'jsdom',
  setupFiles: ['src/test/setup.ts'],
}
```

```ts
// src/test/setup.ts
import 'fake-indexeddb/auto';
import '@testing-library/jest-dom/vitest';
```

### Conventions

BDD-style with Given/When/Then comments. Co-located tests: `*.test.ts` next to source.

### Required Example Tests

**Unit test** — `src/lib/db/database.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { BoubleDB } from './database';

describe('BoubleDB', () => {
	it('should initialize with the correct database name', () => {
		// Given: a fresh database instance
		const db = new BoubleDB();

		// Then: the database name should be 'boule-app'
		expect(db.name).toBe('boule-app');

		db.close();
	});
});
```

**Component test** — `src/routes/page.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Page from './+page.svelte';

describe('Home Page', () => {
	it('should render the app title', () => {
		// Given: the home page is rendered
		render(Page);

		// Then: the title should be visible
		expect(screen.getByText(/boule/i)).toBeInTheDocument();
	});
});
```

## Justfile

| Recipe         | Command                                               | Purpose                  |
| -------------- | ----------------------------------------------------- | ------------------------ |
| `setup`        | `pnpm install`                                        | Install all dependencies |
| `dev`          | `pnpm exec vite dev`                                  | Start dev server         |
| `build`        | `pnpm exec vite build`                                | Static SPA build         |
| `preview`      | `pnpm exec vite preview`                              | Preview production build |
| `test`         | `pnpm exec vitest run`                                | Run tests once           |
| `test-watch`   | `pnpm exec vitest`                                    | Tests in watch mode      |
| `lint`         | `pnpm exec eslint src/ --max-warnings 0`              | Lint (zero warnings)     |
| `format`       | `pnpm exec prettier --write .`                        | Format all files         |
| `format-check` | `pnpm exec prettier --check .`                        | Verify formatting        |
| `typecheck`    | `pnpm exec svelte-kit sync && pnpm exec svelte-check` | Type check               |
| `check`        | Runs: format-check, lint, typecheck, test             | Full quality gate        |

`just check` runs all four steps sequentially. All must pass. This is the precommit gate (DEC-006).

## CI Pipeline

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push: { branches: [main] }
  pull_request: { branches: [main] }

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: extractions/setup-just@v2
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: pnpm }
      - run: just setup
      - run: just check

  deploy:
    needs: check
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    permissions: { pages: write, id-token: write }
    environment:
      name: github-pages
      url: ${{ steps.deploy.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: extractions/setup-just@v2
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: pnpm }
      - run: just setup && just build
      - uses: actions/upload-pages-artifact@v3
        with: { path: build }
      - id: deploy
        uses: actions/deploy-pages@v4
```

## Source Documentation

`src/CLAUDE.md` must document:

| Topic                  | Content                                                                               |
| ---------------------- | ------------------------------------------------------------------------------------- |
| Module boundaries      | Where UI ends and data begins (`routes/` = smart, `components/` = dumb, `db/` = data) |
| Component architecture | Smart (page-level, data-aware) vs dumb (presentational, props-only)                   |
| Reactive data pattern  | `liveQuery` → Svelte reactivity integration                                           |
| File naming            | Conventions for components, tests, types                                              |
| Import conventions     | `$lib/` alias usage, barrel exports from `types/` and `db/`                           |
| Type-first approach    | All shared types in `$lib/types/`, no inline type defs scattered across files         |
