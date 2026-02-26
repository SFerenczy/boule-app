# Ticket: Project Scaffold

## Specs

- [002-specs-project.md](002-specs-project.md) — Structure, dependencies, configuration
- [002-specs-tooling.md](002-specs-tooling.md) — Linting, testing, justfile, CI, conventions

## Priority

High

## Goal

Set up a working development environment with all tooling, conventions, and architecture patterns so that feature work (starting with the Game Tracker MVP) can begin on a solid foundation.

## Context

All tech stack decisions are locked in (see ticket 001, DEC-001 through DEC-006). This ticket turns those decisions into a working project with build gates, test infrastructure, and a clear code organization pattern.

## Tasks

### Project Init

- [x] SvelteKit scaffold (`sv create`) with Svelte 5 + TypeScript (strict) + adapter-static
- [x] Tailwind CSS v4 setup
- [x] Skeleton UI integration
- [x] Dexie.js installed with typed database skeleton (empty tables, ready for Phase 2 schema)
- [x] PWA manifest + service worker basics (installable, offline shell)

### Code Organization

- [x] Define directory structure under `src/` (routes, components, lib, db, types)
- [x] Document conventions in a `src/CLAUDE.md` or split per-domain as appropriate
- [x] Establish module boundary rules: where does UI end and data begin?

### Code Architecture

- [x] Data layer pattern: Dexie DB wrapper with typed repositories (e.g. `GameRepository`, `PlayerRepository`)
- [x] Reactive data access pattern: how `liveQuery` integrates with Svelte components
- [x] Component architecture: smart (page-level, data-aware) vs dumb (presentational, props-only)
- [x] Type-first approach: shared types in a central `types/` module, no inline type definitions scattered across files

### Linting & Formatting

- [x] ESLint with `eslint-plugin-svelte`, strict config, warnings as errors
- [x] Prettier with `prettier-plugin-svelte`
- [x] TypeScript strict mode (`strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true`)
- [x] Verify: `just check` catches all lint/format/type violations

### Testing Framework

- [x] Choose test runner (Vitest is the SvelteKit default — confirm or justify alternative)
- [x] Unit test setup: test utility types, Dexie in-memory fakes or `fake-indexeddb`
- [x] Component test setup: `@testing-library/svelte` or Svelte's built-in test utils
- [x] BDD-style conventions: Given/When/Then structure, descriptive test names
- [x] At least one example test per category (unit, component) to validate the setup
- [x] Integration into `just check` — tests must pass before commit

### Tooling & CI

- [x] `justfile` with recipes: `setup`, `dev`, `check`, `build`, `test`, `lint`, `format`
- [x] GitHub Actions workflow: lint + typecheck + test on push to `main` and on PRs
- [x] GitHub Pages deploy pipeline (on push to `main`, after checks pass)

## Acceptance

- [x] `just setup` works from a fresh clone (installs deps, ready to dev)
- [x] `just dev` starts the dev server
- [x] `just check` runs format-check + lint + typecheck + test — all pass, all strict
- [x] `just build` produces a static SPA build
- [x] CI pipeline runs `just check` and deploys to GitHub Pages on `main`
- [x] At least one passing unit test and one passing component test exist
- [x] Code organization is documented in a `CLAUDE.md` close to the source
- [x] PWA is installable (manifest + service worker registered)
- [x] Dexie DB is initialized (even if tables are empty — ready for feature work)

## Dependencies

- Ticket 001 (tech stack) — completed

## Resolution

**Completed:** 2026-02-21

### Decisions Made

- Vitest confirmed as test runner (SvelteKit default, Vite-native)
- `fake-indexeddb` chosen over Dexie test utils for IndexedDB polyfill in Node
- `@testing-library/svelte` + `@testing-library/jest-dom` for component testing
- Cerberus theme as Skeleton UI starting point

### Artifacts Created

- `src/` — Full source tree with conventions documented in `src/CLAUDE.md`
- `src/lib/db/` — Dexie DB skeleton with typed wrapper and singleton export
- `src/lib/types/` — Shared types module with barrel export
- `src/lib/components/` — Empty component directory (ready for Phase 2)
- `src/routes/` — Root layout with Skeleton shell and SW registration
- `src/service-worker.ts` — Cache-first PWA service worker
- `src/test/setup.ts` — Test setup with fake-indexeddb + jest-dom
- `static/manifest.json` — PWA manifest with icons
- `eslint.config.js` — ESLint flat config (TS + Svelte)
- `.prettierrc` / `.prettierignore` — Prettier config
- `justfile` — 11 recipes including `check` quality gate
- `.github/workflows/ci.yml` — CI + GitHub Pages deploy
- `vite.config.ts` — Tailwind + SvelteKit + testing plugins
- `tsconfig.json` — Strict TypeScript configuration

## Notes

- This is a "green field scaffold" ticket — no feature code, just infrastructure. The goal is that an agent picking up ticket 003 (Game Tracker MVP) can immediately start writing features without any tooling setup.
- Don't over-engineer the architecture patterns. Define the conventions, create one example of each pattern, and document it. The patterns will evolve as real features land.
- Skeleton UI may need specific Tailwind plugin config — verify during setup.
- Consider whether `fake-indexeddb` or Dexie's own test utilities are better for testing. Document the choice.
