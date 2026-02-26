# Ticket: Player Tracking & Event-Log Data Model

## Priority

Medium

## Goal

Migrate from flat counters to an event-log data model, and add optional per-player stat tracking — so every action is recorded as a discrete event that can power graphs, per-player breakdowns, and undo.

## Context

The current data model stores 4 counters per team (`TeamStats { pointingSuccess, pointingFail, shootingSuccess, shootingFail }`). This is fine for team totals but can't answer "how did Sophie's pointing accuracy change over the last 10 games?"

This ticket replaces the counter model with **event sourcing**: every tap is a `HistoryEntry` in a log, and all stats (team totals, per-player breakdowns, percentages) are derived by replaying the log. This gives us:

- **Undo for free** — pop the last entry
- **Per-player graphs** — filter the log by player
- **Flexibility** — derive any aggregation later without schema changes

Additionally, this ticket:

1. **Better default team names** — "We" / "They" instead of "Team 1" / "Team 2"
2. **Optional player tracking mode** — toggled per game on the start screen
3. **Team size selection** — 1v1, 2v2, or 3v3
4. **Player attribution modal** — when tracking is on, tapping a stat button opens a modal to select which player performed the action

The user ("Me") is always pre-filled as a player on Team 1. Player tracking settings (on/off, team size, names) are remembered across games but can be changed each time.

## Tasks

### Data Model Migration

- [ ] Replace `TeamStats` counters with event-log model:

  ```ts
  interface HistoryEntry {
  	teamIndex: 0 | 1;
  	player: string; // always present — unnamed default when tracking off
  	category: 'pointing' | 'shooting';
  	type: 'success' | 'fail';
  	timestamp: Date;
  }

  interface Game {
  	id?: number;
  	team1Name: string;
  	team2Name: string;
  	team1Players: string[]; // ['Anonymous'] when tracking off
  	team2Players: string[]; // ['Anonymous'] when tracking off
  	history: HistoryEntry[];
  	status: GameStatus;
  	startedAt: Date;
  	endedAt?: Date;
  }
  ```

- [ ] Remove `TeamStats` type and `team1Stats`/`team2Stats` fields
- [ ] Add stat derivation helpers (team totals, per-player, percentages) — pure functions over the history array
- [ ] Bump Dexie schema version, drop old data (no backwards compat needed)
- [ ] Update `GameRepository`: replace `updateStats()` with `recordAction()` and `undoLastAction()`
- [ ] Remove the separate undo history stack (ticket 008) — undo is now just `history.pop()`

### Team Name Defaults

- [ ] Change default team names from "Team 1"/"Team 2" to localized "We"/"They"
- [ ] Keep the name fields editable on the start screen
- [ ] Add i18n keys for "We" and "They"

### Start Screen: Player Tracking Setup

- [ ] Add a toggle on the start screen: "Track players" (off by default)
- [ ] When enabled, show team size selector: 1v1, 2v2, 3v3
- [ ] Show player name inputs based on team size
  - Team 1: first slot is always "Me" (localized, non-editable), remaining slots are text inputs
  - Team 2: all slots are text inputs
- [ ] Remember last settings in localStorage: tracking on/off, team size, player names
- [ ] Pre-fill from last settings when starting a new game

### Player Attribution Modal

- [ ] When player tracking is on, tapping any success/fail button opens a modal instead of immediately recording the stat
- [ ] Modal shows the players belonging to the tapped button's team
- [ ] Each player is a big tap target (same sizing philosophy as stat buttons)
- [ ] Tapping a player records the stat with attribution and closes the modal
- [ ] Selection is mandatory — no way to record without picking a player
- [ ] Modal should feel fast: minimal animation, instant open/close

### Update Scoring UI

- [ ] Refactor `ScoringScreen`, `TeamCard`, `StatRow` to derive stats from `game.history`
- [ ] Undo uses `undoLastAction()` (pops last history entry) — remove old undo logic
- [ ] `TeamSummary` derives from history instead of `TeamStats`
- [ ] When tracking is off, stat buttons record directly (no modal) with a default player name

### Tests

- [ ] Test: stat derivation helpers produce correct totals/percentages from history
- [ ] Test: `recordAction()` appends to history
- [ ] Test: `undoLastAction()` removes last entry and stats update accordingly
- [ ] Test: game with player tracking stores player names and attributes actions
- [ ] Test: game without tracking uses default player, no modal
- [ ] Test: modal renders correct players for the correct team
- [ ] Test: settings persistence (localStorage round-trip)

## Acceptance

- No more `TeamStats` counters — all stats derived from the event log
- Default team names are "We" / "They" (localized), still editable
- Player tracking can be toggled on the start screen
- When on: user selects 1v1/2v2/3v3 and enters player names ("Me" is pre-filled for Team 1)
- Tapping a stat button with tracking on opens a modal to select the player
- Selecting a player records the stat with attribution
- Settings are remembered for the next game
- `just check` passes

## Dependencies

- Ticket 008 (scoring layout sync) — should complete first so we build on the final layout

## Notes

- **No backwards compatibility.** Old games are dropped on schema migration. This is a pre-launch app — no users to migrate.
- The modal is the critical UX piece. It adds one tap per stat recording, so it must be _fast_. No slide-in animations, no backdrop blur transition. Appear instantly, dismiss instantly.
- Per-player stats breakdown in the UI is explicitly deferred. This ticket captures the data; displaying it is a Phase 3 concern. The scoring screen continues to show team-level totals.
- "Me" as a concept only applies to the start screen pre-fill. In the data model it's just a player name string — no special handling needed.
- Team size determines player count, not the other way around. If 2v2 is selected, each team gets exactly 2 player slots.
- When player tracking is off, use a single default player name per team (e.g. "Anonymous") so the data model is uniform — no optional fields, no special cases in derivation logic.
