# Ticket: Choose Tech Stack

## Priority

High

## Goal

Lock in the tech stack and document the decisions so subsequent tickets can scaffold the project.

## Context

The app is a boule/petanque companion — mobile-first, used outdoors during games. Evolved from [boule-zaehler](../../boule-zaehler/), a single-file HTML score counter with 8 counters (Legen/Schießen success/fail per team).

Key constraints from product discussion:

- **Offline-first.** Used on boule fields with no wifi. Must work without connectivity.
- **No backend for now.** A counter app with local persistence doesn't need a server. Backend (Rust/Axum) deferred to Phase 5 (social features), only if adoption warrants it.
- **PWA over app store.** No $99/year Apple fee, no review delays, instant deploys. "Add to Home Screen" is native-enough for the target audience. Can wrap in Capacitor/TWA later if app store presence becomes necessary.
- **Side project.** Minimize moving parts. Fewer things to maintain > more flexibility.

## Direction (agreed)

### Frontend: SvelteKit + TypeScript

- SvelteKit with `adapter-static` (SPA mode, no SSR)
- Svelte 5 runes + TypeScript (strict)
- Deploy to GitHub Pages
- PWA plugin for offline + installability

### Data Layer: Local-first with Dexie.js

- IndexedDB for persistent local storage (survives across sessions — the main gap from boule-zaehler's sessionStorage)
- **Dexie.js** as the typed wrapper — rich query API, `liveQuery` for reactive Svelte integration, built-in schema migrations
- Dexie over idb: the app will query games by date, filter by player, compute aggregates — Dexie's query API saves significant boilerplate. `liveQuery` gives reactive database subscriptions that map naturally to Svelte stores.
- Dexie over raw IndexedDB: typed schemas, migration system, and a humane API. Raw IndexedDB is callback-heavy and painful.
- ~45kB min+gzip — acceptable for a PWA that caches aggressively
- No server database until Phase 5. Dexie Cloud (paid sync) is a potential Phase 5 shortcut but not a commitment.

### Styling: Tailwind CSS + Skeleton UI

- **Tailwind CSS v4** (CSS-first config, no `tailwind.config.js`)
- **Skeleton UI** for component library — built for Svelte + Tailwind, provides pre-built components (buttons, modals, toasts, etc.)
- Mobile-first, high contrast for outdoor readability

### Tooling

- `just` as task runner
- GitHub Actions for CI
- `prettier` + `eslint` with strict configs
- Precommit gate: `just check` must pass before every commit

## Tasks

- [x] Evaluate IndexedDB wrapper options (Dexie vs idb vs raw) → Dexie.js
- [x] Decide styling approach → Tailwind v4 + Skeleton UI
- [x] Document all decisions as DEC entries in `decisions.md`

## Acceptance

- Each choice has a DEC entry with rationale and trade-offs
- Chosen stack is: mobile-first, offline-capable, strongly typed, no backend
- PWA vs native decision is documented with reasoning

## Notes

- Rust intentionally absent from Phase 1-4. It enters in Phase 5 if/when social features need a backend. Don't build a server just to use Rust.
- The "no app store" decision can be revisited — PWA can be wrapped in Capacitor/TWA for native distribution later if needed.
