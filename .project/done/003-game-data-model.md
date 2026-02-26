# Ticket: Game Data Model

## Priority

High

## Goal

Define the complete data model for game tracking and implement the Dexie DB schema, types, and repository layer. This is the contract that all UI work builds on.

## Context

The original boule-zaehler tracks 8 counters (Legen success/fail + Schießen success/fail, per team) in sessionStorage. Phase 2 replaces this with a proper game model persisted in IndexedDB via Dexie.

The data model must capture:

- Two teams per game
- Per-team tracking of Legen and Schießen attempts (success/fail counts)
- Game lifecycle (in-progress → completed)
- Timestamps for history (Phase 3 dependency)

## Tasks

### Types

- [x] Define `Game` type in `$lib/types/`
- [x] Define `TeamStats` type (Legen/Schießen success/fail counts)
- [x] Define `GameStatus` enum/union (`in-progress`, `completed`)
- [x] Export all types via barrel `$lib/types/index.ts`

### Dexie Schema

- [x] Add `games` table to `BoubleDB` with version 2 migration
- [x] Define indexes needed for future queries (by status, by date)

### Repository

- [x] Create `GameRepository` in `$lib/db/`
- [x] `createGame(team1Name, team2Name)` → creates in-progress game
- [x] `getActiveGame()` → returns current in-progress game (if any)
- [x] `updateStats(gameId, teamIndex, category, type)` → increment a counter
- [x] `completeGame(gameId)` → mark game as completed with end timestamp
- [x] Export repository via `$lib/db/index.ts`

### Tests

- [x] Unit tests for all repository operations against fake-indexeddb
- [x] Test: creating a game initializes all counters to zero
- [x] Test: incrementing a stat persists correctly
- [x] Test: completing a game sets status and endedAt
- [x] Test: only one active game at a time (or document the constraint)

## Acceptance

- All types are defined, strict, and exported from `$lib/types/`
- Dexie schema is migrated (version 2) with the games table
- Repository CRUD operations work against fake-indexeddb in tests
- `just check` passes
- No UI code in this ticket — pure data layer

## Dependencies

- Ticket 002 (project scaffold) — completed

## Design Considerations

- Keep the stat model flat: `{ legenSuccess, legenFail, schiessenSuccess, schiessenFail }` per team. No need for a nested structure — the original app has exactly 4 counters per team.
- Player names are optional in Phase 2 (roadmap says "player names optional"). Teams are identified by name only.
- Game-level score (e.g. 13:8 points) is a Phase 3 concern — not tracked here. This ticket only tracks the Legen/Schießen attempt stats.
- Consider whether to store teams as embedded objects in the game row vs. separate table. Embedded is simpler for Phase 2; separate table only needed if player identity matters (Phase 3).

## Resolution

**Completed:** 2026-02-21

### Decisions Made

- **Embedded team stats:** Teams stored as embedded objects (`team1Stats`, `team2Stats`) in the game row. No separate table — flat structure matches the original app's 4 counters per team and keeps queries simple.
- **`IDBFactory` injection for tests:** `BoubleDB` accepts an optional `DexieOptions` parameter so tests can pass `new IDBFactory()` for per-test isolation without relying on database deletion.
- **`getActiveGame()` returns first match:** No enforcement of a single-active-game constraint in the DB. The convention is documented: callers should not create a new game while one is active. Enforcement can be added in the UI layer (ticket 004).

### Artifacts Created

- `src/lib/types/index.ts` — `GameStatus`, `TeamStats`, `Game` types
- `src/lib/db/database.ts` — `BoubleDB` version 2 schema with `games` table (indexes: `status`, `startedAt`)
- `src/lib/db/game-repository.ts` — `GameRepository` with all CRUD operations
- `src/lib/db/game-repository.test.ts` — 14 tests covering all operations
- `src/lib/db/index.ts` — exports `db` singleton and `gameRepository` singleton
