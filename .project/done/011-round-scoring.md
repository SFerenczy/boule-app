# Ticket: Round-by-Round Score Tracking

## Priority

High

## Goal

Track the actual game score — after each round (mène), one team scores 1–N points. The app should let the user enter this, show the running score, and advance to the next round.

## Context

The app currently tracks _how_ each throw went (pointing/shooting × success/fail) but not _what happened_ — who scored and how many points. In pétanque, after all boules are thrown in a round, the team whose boule is closest to the cochonnet scores 1 point per boule closer than the opponent's nearest. The game is played to 13 points.

**Throw tracking is the high-frequency interaction.** In a 3v3 round, one person tracks up to 12 throws (6 per team). Round scoring happens once at the end — it's the low-frequency bookend. The screen layout must keep throw tracking as the primary interaction surface. Round scoring should integrate smoothly without displacing what the user taps most.

### Implications & Design Decisions

**UX priority: throw tracking stays first-class.** The stat buttons (pointing/shooting × ✓/✗) are what the user taps dozens of times per game. Round scoring (once per mène) should not push them down or make them harder to reach. The running score display and "score round" action need to fit _around_ the existing layout, not replace it.

**Layout approach.** Add the running score as a compact, always-visible header (e.g., "We 7 – 5 They" with round number). Keep stat tracking exactly where it is. Add a "Score Round" button in the bottom action bar (next to Undo / End Game). Round score entry can be a modal or inline expansion — fast to open, fast to dismiss.

**Max points per round.** In standard pétanque, max = scoring team's boule count:

- 1v1: 3 boules each → max 3
- 2v2: 3 boules each → max 6
- 3v3: 2 boules each → max 6

When player tracking is on, team size is known → derive max from boule count. When off, default max to 6. Could add a standalone team-size selector later, but defer for now.

**Game target score.** Standard is first to 13. Hardcode for now — configurable target is a future nice-to-have.

**Round history.** Visible log of past rounds ("R1: We +3, R2: They +1, ..."). Useful for verifying and catching mistakes. Should be accessible but not dominant — a collapsible section or scrollable strip.

**Undo.** Throw-level undo stays as-is. Round score undo is deferred — not needed for MVP.

**Throw ordering within a round.** Each throw should record its position within the round (1st throw, 2nd throw, ... Nth throw across both teams). This enables stats like "how often am I successful when I throw the last boule?" or "how does the team that throws first perform?" The position is a simple incrementing counter per round, derived from the count of throws already recorded in the current round. Combined with player tracking, this lets us answer positional questions per player.

**Incomplete throw tracking.** The tracker will sometimes forget to log throws. The `throwIndex` only reflects the order of _recorded_ throws, not actual game positions (we can't know which throws were skipped). To handle this, `Round` stores `expectedThrows` (derived from team size — e.g., 12 for 2v2 with 3 boules each). This gives us:

- **Completeness detection:** if recorded throws < expectedThrows, the round's positional data is incomplete
- **Positional stats use only complete rounds:** filter to rounds where recorded === expected
- **Overall stats still work:** pointing/shooting success rates use all recorded throws regardless of completeness
- **No null events:** the data stays clean — no placeholders leaking through derivation logic

## Data Model Options

The current model stores everything in a single `Game` object with a `history: HistoryEntry[]` event log. Three options for adding round scoring:

### Option A: Separate `rounds` Array

Add a parallel `rounds: Round[]` array alongside `history`.

```ts
interface Round {
	scoringTeamIndex: 0 | 1;
	points: number; // 1–6
	timestamp: Date;
}

interface Game {
	// ... existing fields ...
	history: HistoryEntry[]; // throw-level events (unchanged)
	rounds: Round[]; // round-level scores (new)
	targetScore: number; // default 13 (new)
}
```

**Pros:** Clean separation. Throw log and round scores have different shapes — no union types, no discriminators. Derivation logic stays simple: `deriveScore(rounds)` is independent of `deriveTeamStats(history)`. Easy to reason about.

**Cons:** Two parallel arrays with no structural link. Can't answer "which throws happened in round 2?" without additional bookkeeping. Undo has two separate paths.

### Option B: Unified Event Log

Expand `HistoryEntry` into a discriminated union that includes round-score events.

```ts
type GameEvent =
	| {
			kind: 'throw';
			teamIndex: 0 | 1;
			player: string;
			category: 'pointing' | 'shooting';
			type: 'success' | 'fail';
			timestamp: Date;
	  }
	| { kind: 'round-score'; scoringTeamIndex: 0 | 1; points: number; timestamp: Date };

interface Game {
	// ... existing fields ...
	events: GameEvent[]; // replaces history
	targetScore: number;
}
```

**Pros:** Single ordered event stream. Chronological ordering is implicit — round-score events naturally partition the throw events before them into rounds. Undo is always "pop last event" regardless of type. Enables future features like replay, timeline view, or per-round throw analysis without any model changes.

**Cons:** Every consumer of the event log now needs to filter by `kind`. Derivation helpers get a bit more complex (filter for throws vs. filter for scores). The `HistoryEntry` type is already used in stats, components, and tests — renaming/restructuring touches many files. Union types require discriminant checks everywhere.

### Option C: Separate Array + Round Index + Throw Order

Like Option A, but add `round` and `throwIndex` fields to `HistoryEntry` to link throws to rounds and track throw order.

```ts
interface HistoryEntry {
	// ... existing fields ...
	round: number; // which round (1-indexed)
	throwIndex: number; // position within the round (1-indexed, across both teams)
}

interface Round {
	scoringTeamIndex: 0 | 1;
	points: number;
	expectedThrows: number; // total throws that should have happened (from team size)
	timestamp: Date;
}

interface Game {
	// ... existing fields ...
	history: HistoryEntry[];
	rounds: Round[];
	targetScore: number;
}
```

**Pros:** Clean separation of concerns _and_ full structural linkage. Two cheap integer fields on each throw enable:

- "Show me the throws from round 3" → filter `history` by `round === 3`
- "How do I perform on the last throw?" → filter by `throwIndex === maxThrowsInRound`
- "How does the team that throws first perform?" → correlate `throwIndex === 1` team with round winner
- Per-player positional stats when combined with player tracking

Derivation logic stays separated: `deriveScore()` reads `rounds`, `deriveTeamStats()` reads `history`.

**Cons:** Slightly more complex than Option A — need to track current round number and throw counter. Both are cheap to derive: `currentRound = rounds.length + 1`, `nextThrowIndex = history.filter(e => e.round === currentRound).length + 1`.

### Recommendation: Option C

Option C gives us clean separation now and the data linkage we'll want later. Two integer fields on `HistoryEntry` (`round` + `throwIndex`) enable per-round filtering and positional analysis without schema changes later. The two arrays keep derivation logic simple: `deriveScore()` reads `rounds`, `deriveTeamStats()` reads `history`, and you can slice history by round or throw position when needed.

Option B (unified log) is architecturally elegant but touches too many existing consumers for the benefit it provides. The current codebase has `HistoryEntry` wired through stats, components, repository, and tests — restructuring it into a union type is more churn than value for this feature.

## Tasks

### Data Model

- [ ] Add `Round` type to `$lib/types/index.ts`
- [ ] Add `round: number` and `throwIndex: number` fields to `HistoryEntry`
- [ ] Add `rounds: readonly Round[]` and `targetScore: number` to `Game`
- [ ] Bump Dexie schema version (v4), clear old data (no backwards compat needed)
- [ ] Add `recordRound(db, gameId, scoringTeamIndex, points)` to game-repository — auto-populates `expectedThrows` from team player counts
- [ ] Update `recordAction()` to auto-populate `round` (from `rounds.length + 1`) and `throwIndex` (from count of throws in current round + 1)
- [ ] Add `deriveScore(rounds)` → `[number, number]` to stats
- [ ] Add `deriveRoundHistory(rounds, team1Name, team2Name)` helper for display

### Scoring UI

- [ ] Add score header to `ScoringScreen`: compact "{Team1} {score} – {score} {Team2}" + round number
- [ ] Add "Score Round" button to the bottom action bar
- [ ] Round score entry: modal with two team buttons → then point count buttons (1–max). Two taps, done.
- [ ] Dynamic max points: derive from team size when player tracking is on (3 for 1v1/2v2, 6 for 3v3), default 6 when off
- [ ] After scoring, round number increments, UI stays on throw tracking
- [ ] Throw tracking stat buttons remain in exactly their current position and size

### Round History

- [ ] Collapsible or scrollable round log on the scoring screen
- [ ] Each entry: "R{n}: {TeamName} +{points}"

### Game End

- [ ] Detect when a team's score reaches ≥ 13 after scoring a round
- [ ] Persist the completed game to the database
- [ ] Show game-over state with final score and round count (simple — no special flow)

### i18n

- [ ] Translation keys: "Round", "Score Round", "Game Over", point labels, round history labels
- [ ] EN, DE, FR

### Tests

- [ ] `recordRound()` appends round, `deriveScore()` returns correct totals
- [ ] Game completion when target score reached
- [ ] `recordAction()` stamps `round` and `throwIndex` on throws
- [ ] `expectedThrows` is set correctly on round creation based on team sizes
- [ ] Positional filtering: `deriveTeamStats` can filter by throwIndex range
- [ ] Incomplete rounds (recorded < expected) excluded from positional stats but included in overall stats
- [ ] Round score entry UI flow

## Acceptance

- Running score is always visible at the top of the scoring screen
- User can score a round in two taps (team → points)
- Throw tracking buttons remain the primary interaction — unchanged position and size
- Round history is visible and reviewable
- Game auto-completes at 13 points
- Throw-level undo still works as before
- Works with and without player tracking
- `just check` passes
- Visual verification: score header readable outdoors

## Dependencies

None.

## Notes

- **Throw tracking is primary.** The user taps stat buttons ~18 times per round, but "Score Round" only once. Layout must reflect this frequency.
- **Two-tap scoring.** Tap team → tap points. No confirmation. Mistakes can be corrected later (round undo deferred).
- **13 is hardcoded.** Configurable target deferred.
- **Round and throw position derived, not stored as game-level state.** `currentRound = rounds.length + 1`, `nextThrowIndex = throws-in-current-round + 1`. Both computed at write time from existing data. No extra mutable state.
- **Throw ordering is implicit.** The user doesn't manually enter throw position — it auto-increments as they tap. The data is captured silently for later analysis.
- **No migration needed.** Pre-launch app, no real user data. Dexie version bump + clear is fine.
- **Positional stats are a future display concern.** This ticket captures the `throwIndex` data on every throw. Surfacing "your last-boule accuracy" in the UI is a separate ticket — but the data model is ready for it.
- **`expectedThrows` derived from team sizes.** Standard boules per player: 3 for 1v1/2v2, 2 for 3v3. Derive from team size: `playersPerTeam <= 2 ? 3 : 2`. Total = `(team1Size + team2Size) * boulesPerPlayer`.
