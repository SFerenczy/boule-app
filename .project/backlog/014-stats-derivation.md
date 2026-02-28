# Ticket: Stats Derivation Layer

## Priority

Medium

## Goal

Build pure functions that compute per-player stats from game history data. This is the data layer that all visualizations draw from — no UI in this ticket.

## Context

The app stores event-sourced `HistoryEntry` data (player, category, success/fail, timestamp, round, throwIndex) and `Game` metadata (teams, players, dates, rounds). To power a stats page, we need functions that aggregate this raw data into meaningful stats per player across games.

Focus on individual player performance over time — not cross-player comparison. The primary use case is a player reviewing their own trends ("Am I improving?", "Am I better at pointing or shooting?", "Am I bad on Mondays?").

## Tasks

- [ ] Create `$lib/stats/player-stats.ts` (or extend existing stats module)
- [ ] `getPlayerGames(games, playerName)` — filter games a player participated in
- [ ] `getPlayerOverallStats(games, playerName)` — success rate by category (pointing/shooting), total games, total throws
- [ ] `getPlayerGameStats(game, playerName)` — stats for a single game (success rates, throw count, categories)
- [ ] `getPlayerTimeSeries(games, playerName)` — per-game data points ordered by date: success rate, category breakdown, game result. Suitable for line/trend charts.
- [ ] `getPlayerCategoryBreakdown(games, playerName)` — pointing vs shooting success rates, attempt counts. Suitable for bar charts.
- [ ] Handle edge cases: player with no games, games with no throws for a player, missing `createdAt` (fall back to `startedAt`)
- [ ] Unit tests for all derivation functions

## Acceptance

- All functions are pure (no side effects, no database access)
- Functions accept `Game[]` and return typed result objects
- Edge cases handled gracefully (empty data returns sensible defaults, not crashes)
- Unit tests cover: single game, multiple games, empty history, mixed categories
- `just check` passes

## Dependencies

None — uses existing `Game` and `HistoryEntry` types.

## Notes

- Existing `$lib/stats.ts` has some per-team derivation logic. Extend or colocate, don't duplicate.
- The `createdAt` field (ticket 016) will improve time-series accuracy but isn't a blocker — fall back to `startedAt`.
- Round-level stats (per-round performance, positional analysis) depend on ticket 011. Not in scope here — just overall and per-game aggregates.
- No caching needed. Local device data, even 1000 games is trivially fast to derive.
