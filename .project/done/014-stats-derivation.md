# Ticket: Stats Derivation Layer

## Priority

Medium

## Goal

Build pure functions that compute per-player stats from game history data. This is the data layer that all visualizations draw from — no UI in this ticket.

## Context

The app stores event-sourced `HistoryEntry` data (player, category, success/fail, timestamp, round, throwIndex) and `Game` metadata (teams, players, dates, rounds). To power a stats page, we need functions that aggregate this raw data into meaningful stats per player across games.

Focus on individual player performance over time — not cross-player comparison. The primary use case is a player reviewing their own trends ("Am I improving?", "Am I better at pointing or shooting?").

Analysis questions like "Am I bad on Mondays?" are handled by the UI filtering the `Game[]` input before passing it to these same derivation functions — not by special-purpose stats functions.

## Return Types

```ts
interface CategoryStats {
	successes: number;
	attempts: number;
	rate: number | null; // null when 0 attempts
}

interface PlayerOverallStats {
	games: number;
	wins: number;
	losses: number;
	totalThrows: number;
	pointing: CategoryStats;
	shooting: CategoryStats;
	overall: CategoryStats;
}

interface PlayerGameDataPoint {
	gameId: number;
	date: Date;
	won: boolean | null; // null if game still in-progress
	score: [number, number]; // [player's team, opponent]
	pointing: CategoryStats;
	shooting: CategoryStats;
	overall: CategoryStats;
}
```

## Functions

| Function                | Signature                                                      | Purpose                                   |
| ----------------------- | -------------------------------------------------------------- | ----------------------------------------- |
| `getPlayerGames`        | `(games: Game[], playerName: string) => Game[]`                | Filter games a player participated in     |
| `getPlayerOverallStats` | `(games: Game[], playerName: string) => PlayerOverallStats`    | Aggregate stats across all provided games |
| `getPlayerGameStats`    | `(game: Game, playerName: string) => PlayerGameDataPoint`      | Stats for a single game                   |
| `getPlayerTimeSeries`   | `(games: Game[], playerName: string) => PlayerGameDataPoint[]` | Per-game data points ordered by date      |

`getPlayerCategoryBreakdown` was dropped — the breakdown is already in `PlayerOverallStats.pointing` / `.shooting`. The UI can filter the input `Game[]` for any slice (by date, day of week, etc.) and call `getPlayerOverallStats` on the filtered set.

## Tasks

- [ ] Create `$lib/stats/player-stats.ts` as a new module (existing `$lib/stats.ts` stays for in-game team/round derivation)
- [ ] Define `CategoryStats`, `PlayerOverallStats`, `PlayerGameDataPoint` types in `$lib/types/index.ts`
- [ ] Implement `getPlayerGames`
- [ ] Implement `getPlayerOverallStats` (including wins/losses derived from round scores)
- [ ] Implement `getPlayerGameStats` (including score from player's team perspective)
- [ ] Implement `getPlayerTimeSeries` (maps `getPlayerGameStats` over games, ordered by date)
- [ ] Handle edge cases: player with no games, games with no throws for a player, in-progress games (won=null)
- [ ] Unit tests for all derivation functions

## Acceptance

- All functions are pure (no side effects, no database access)
- Functions accept `Game[]` and return typed result objects
- Edge cases handled gracefully (empty data returns sensible defaults, not crashes)
- Unit tests cover: single game, multiple games, empty history, mixed categories, in-progress games
- `just check` passes

## Dependencies

None — uses existing `Game` and `HistoryEntry` types.

## Notes

- Existing `$lib/stats.ts` handles in-game team/round derivation — different concern, keep separate.
- Round-level stats (per-round performance, positional analysis) are not in scope — just overall and per-game aggregates.
- No caching needed. Local device data, even 1000 games is trivially fast to derive.
