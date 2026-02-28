# Ticket: Add `createdAt` to Game

## Priority

Low

## Goal

Track when a game was created (set up), distinct from `startedAt` (when scoring begins). Enables accurate time-based analysis for stats.

## Context

The `Game` type has `startedAt` and `endedAt`, but `startedAt` is set when the game object is created — which is actually game _setup_ time, not first-throw time. The naming is slightly misleading, but more importantly, for time-based stats ("Am I bad on Mondays?"), we want the date the game was _played_, which is closer to creation time than first throw.

Adding an explicit `createdAt` separates concerns:

- `createdAt` — when the user tapped "New Game" (used for date-based grouping in stats)
- `startedAt` — when scoring actually began (could be set on first throw in the future)
- `endedAt` — when the game was completed

For now, `createdAt` and `startedAt` will have the same value. But having the field in place means we can refine `startedAt` semantics later without breaking stats queries.

## Tasks

- [ ] Add `createdAt: Date` field to `Game` type
- [ ] Set `createdAt` at game creation time (same place `startedAt` is currently set)
- [ ] Update Dexie schema version
- [ ] Update game creation code to populate `createdAt`
- [ ] Update stats derivation (ticket 014) to prefer `createdAt` for time-series grouping
- [ ] Update any tests that construct `Game` objects

## Acceptance

- `createdAt` exists on all new games
- Existing code continues to work (no regressions)
- `just check` passes

## Dependencies

None.

## Notes

- No migration needed for existing data — pre-launch app, Dexie version bump + clear is fine.
- This is a small change but has a long tail: every time-based visualization benefits from having a clean "when did this game happen" field.
- Could be done as part of ticket 014 if the scope is small enough, but separating it keeps tickets focused.
