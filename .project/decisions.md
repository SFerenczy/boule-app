# Architectural Decisions

Persistent log of decisions made for the project. Each decision gets a DEC number. When a decision comes from resolving a ticket, link back to it.

---

## DEC-001: Local-First PWA, No Backend

**Date:** 2026-02-21 | **Status:** Decided
**Ticket:** 001-choose-tech-stack

**Context:** The app is used on boule fields with spotty or no connectivity. Need to decide between a traditional client-server architecture and a local-first approach.

**Decision:** Local-first PWA. No backend for Phases 1-4. All data lives in the browser via IndexedDB. Backend (Rust/Axum) deferred to Phase 5, only if social features prove necessary.

**Rationale:**

- The core use case (score tracking during a game) must work offline. A server dependency would make the app unreliable in exactly the scenario it's designed for.
- A counter app with local persistence doesn't need a server. Adding one increases complexity, hosting costs, and deployment overhead for zero user benefit.
- Keeping it static (GitHub Pages) means zero operational overhead — no server to maintain, no database to back up, no uptime to monitor.
- If social features are needed later, a backend can be added without rewriting the frontend. The local data layer stays; sync becomes an addition, not a replacement.

**Trade-off:** No cross-device sync, no shared leaderboards until Phase 5. Users can only see their own data on their own device. Data export/import (Phase 4) is the manual workaround.

---

## DEC-002: PWA Over App Store

**Date:** 2026-02-21 | **Status:** Decided
**Ticket:** 001-choose-tech-stack

**Context:** The app needs to feel native on mobile (primary use case). Options are native app (App Store / Play Store), PWA, or hybrid (Capacitor/TWA wrapper).

**Decision:** PWA with "Add to Home Screen". No app store presence for now.

**Rationale:**

- No $99/year Apple Developer fee, no review delays, no approval risk. Push to `main` and it's live — aligns with the DevOps philosophy.
- PWA provides: home screen icon, full-screen mode, offline support via service worker, splash screen. The target audience (boule players sharing a link) won't know the difference from a native app.
- iOS has supported PWA features including push notifications since iOS 16.4. The main gap (no App Store discoverability) doesn't matter — distribution is via direct link sharing within boule groups.
- Can wrap in Capacitor or TWA later if app store presence becomes necessary. The PWA is the app; the wrapper is just distribution packaging.

**Trade-off:** No app store discoverability. Users must be sent a link. Acceptable for a niche sport app shared within groups.

---

## DEC-003: SvelteKit + TypeScript (Strict)

**Date:** 2026-02-21 | **Status:** Decided
**Ticket:** 001-choose-tech-stack

**Context:** Need a frontend framework for a mobile-first SPA with PWA capabilities.

**Decision:** SvelteKit with `adapter-static` (SPA mode), Svelte 5 runes, TypeScript in strict mode.

**Rationale:**

- Svelte 5 runes provide a clean reactivity model with minimal boilerplate — good for agent-driven development where less magic means fewer surprises.
- SvelteKit's file-based routing is maintained by the core team, unlike the fragmented standalone Svelte router ecosystem.
- `adapter-static` produces a pure static SPA — no server runtime, deploys to any static host (GitHub Pages).
- TypeScript strict mode enforces the "types are the spec" philosophy. No `any`, no implicit returns, no unchecked nulls.

**Constraints:**

- No `+server.ts` files, no server-side load functions, no form actions — there is no server.
- All data access through the local Dexie.js layer, never through SvelteKit server features.

---

## DEC-004: Dexie.js for IndexedDB

**Date:** 2026-02-21 | **Status:** Decided
**Ticket:** 001-choose-tech-stack

**Context:** Need a typed IndexedDB wrapper for local persistence. Evaluated Dexie.js, idb, and raw IndexedDB.

**Decision:** Dexie.js.

**Rationale:**

- **Query API.** The app will query games by date, filter by player, compute aggregates. Dexie provides `where`, `above`, `between`, `sortBy` — idb and raw IndexedDB require manual cursor iteration for anything beyond key lookups.
- **Reactive queries.** `liveQuery` returns observables that re-emit when underlying data changes. These map naturally to Svelte's reactivity — components subscribe to database queries and update automatically.
- **Schema migrations.** Built-in versioned schema upgrades. As the data model evolves across phases, Dexie handles the migration path. With idb or raw IndexedDB, you manage this yourself.
- **TypeScript support.** Typed table definitions, typed query results.
- **Dexie Cloud** (paid sync service) is a potential Phase 5 shortcut for cross-device sync, but this is not a factor in the current decision — it's a bonus, not a dependency.

**Trade-off:** ~45kB min+gzip vs idb's ~1.2kB. Acceptable for a PWA that caches its assets aggressively — the size difference is paid once on first load.

**Rejected alternatives:**

- **idb:** Too thin. Promise wrapper only — no query API, no reactive queries, no migration helpers. Would require significant boilerplate for the query patterns this app needs.
- **Raw IndexedDB:** Callback-heavy, painful API. No type safety. No reason to suffer this when wrappers exist.
- **localForage:** Key-value only, no indexes or querying. Too limited.
- **PouchDB:** Heavy, CouchDB-sync oriented, aging ecosystem. Wrong abstraction for a local-first app that may never need sync.

---

## DEC-005: Tailwind CSS v4 + Skeleton UI

**Date:** 2026-02-21 | **Status:** Decided
**Ticket:** 001-choose-tech-stack

**Context:** Need a styling approach for a mobile-first app used outdoors.

**Decision:** Tailwind CSS v4 with Skeleton UI component library.

**Rationale:**

- Tailwind v4 uses CSS-first configuration (no `tailwind.config.js`), simpler setup for a new project.
- Skeleton UI is built specifically for Svelte + Tailwind — pre-built components (buttons, modals, toasts, forms) that follow Tailwind conventions and support theming.
- Mobile-first responsive design is Tailwind's default approach (`sm:`, `md:` breakpoints scale up from mobile).
- Outdoor readability (high contrast, large touch targets) is a CSS concern handled through Tailwind utilities and Skeleton's theme customization.

---

## DEC-006: Tooling (just, GitHub Actions, prettier + eslint)

**Date:** 2026-02-21 | **Status:** Decided
**Ticket:** 001-choose-tech-stack

**Context:** Need a task runner, CI platform, and code quality tooling.

**Decision:**

- **Task runner:** `just` — simple, language-agnostic, no dependencies beyond the binary.
- **CI:** GitHub Actions — lint + test on push to `main` and on PRs.
- **Formatting:** `prettier` with `prettier-plugin-svelte`.
- **Linting:** `eslint` with `eslint-plugin-svelte`, strict config, warnings treated as errors.
- **Precommit gate:** `just check` runs format-check + lint + typecheck + test. Must pass before every commit.

**Rationale:**

- `just` over `make`: cleaner syntax, no tab-sensitivity, better for non-C projects. Over npm scripts: language-agnostic, works if Rust enters later.
- GitHub Actions: free for public repos, already the platform for GitHub Pages deploys.
- prettier + eslint: standard SvelteKit tooling. Canonical formatters mean formatting is never a review concern.
