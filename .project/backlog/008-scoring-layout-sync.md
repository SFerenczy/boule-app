# Ticket: Sync scoring screen layout with boule-zaehler

## Priority

High

## Goal

Mirror the latest boule-zaehler layout changes in the boule-app scoring screen: per-team success summary, undo functionality, and updated visual layout.

## Context

The upstream single-file app (`../boule-zaehler`, commit `2667e5b`) introduced three changes that the boule-app should adopt:

1. **Per-team success summary** — a line below each team's stat rows showing combined success rate and fraction across both categories (Pointing + Shooting).
2. **Undo button** — reverts the last stat increment using a history stack. Sits alongside the existing end-game button at the bottom.
3. **Flatter layout** — team cards become flat sections separated by `<hr>`, with tighter spacing and per-row card styling instead of a wrapping team card.

Reference diff: `../boule-zaehler` commit `2667e5b`.

## Tasks

- [ ] Add per-team success summary component/line below each team's stat rows
  - Shows combined percentage and fraction (`success/total`) across Pointing + Shooting
  - Displays "–" when no data
- [ ] Add undo functionality
  - History stack tracking `{ team, category, type }` per tap
  - `undo()` decrements the last recorded action
  - Persist history in session (or equivalent — doesn't need to survive app restart)
  - Wire to an "Undo" button in the bottom action bar
- [ ] Update layout from card-per-team to flat sections
  - Replace team card borders with horizontal separators between teams
  - Per-row card styling (background on each stat row instead of wrapping card)
  - Tighter vertical spacing
- [ ] Update or add tests for undo and summary calculations
- [ ] Verify design system compliance (presets, outdoor readability, min touch targets)

## Acceptance

- Each team shows a combined success line below its stat rows
- Undo button reverts the most recent tap (success or fail, any team/category)
- Undo history survives page interaction but not app restart
- Layout visually matches boule-zaehler's flat-section style
- All existing tests pass
- `just check` passes

## Dependencies

None

## Notes

- The boule-zaehler uses raw DOM manipulation; boule-app uses Svelte components + Skeleton UI. Adapt the patterns, don't copy the implementation.
- Undo was listed as "nice to have" in ticket 004 — this promotes it to a first-class feature.
- The history stack should integrate with the existing Dexie-based data model (e.g. a `gameHistory` array or similar), not `sessionStorage`.
