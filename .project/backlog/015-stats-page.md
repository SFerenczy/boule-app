# Ticket: Dedicated Stats Page

## Priority

Medium

## Goal

A `/stats` route where a player can explore their own performance across all games — trends over time, category strengths, patterns.

## Context

This is the "Am I bad on Mondays?" page. The focus is on individual player self-reflection, not cross-player comparison or leaderboards. A player selects themselves and sees their history visualized.

Uses LayerChart v2 (ticket 013) for rendering and the stats derivation layer (ticket 014) for data.

## Tasks

- [ ] Create `/stats` route with player selector
- [ ] Add navigation to stats page (bottom nav, or from game history — TBD)
- [ ] Determine which charts to show (decide during implementation — see ideas below)
- [ ] Implement selected charts using LayerChart v2 + derivation functions
- [ ] Ensure charts are readable outdoors (large labels, high contrast, no thin lines)
- [ ] Handle empty state: no games yet → friendly message, no broken charts
- [ ] Handle single-game state: show what's available, no "not enough data" gates
- [ ] i18n for all labels and UI text
- [ ] Visual verification via `/screenshot`

## Chart Ideas (decide during implementation)

Pick the most useful subset. Not all are required for this ticket.

**Bar charts:**

- Success rate by category (pointing vs shooting)
- Attempts breakdown (pointing success/fail, shooting success/fail)

**Line/trend charts:**

- Success rate per game over time
- Pointing vs shooting divergence over time
- Games played frequency

**Simple stats:**

- Total games, total throws, overall success rate
- Best/worst game
- Day-of-week breakdown (the Monday question)

## Acceptance

- Stats page exists at a navigable route
- Player can select themselves and see their stats
- At least one trend chart (over time) and one breakdown chart (by category) are shown
- Charts render correctly on mobile viewport
- Outdoor-readable: large text, high contrast, big touch targets
- Empty state handled gracefully
- `just check` passes
- Visual verification passes

## Dependencies

- Ticket 013 (LayerChart v2)
- Ticket 014 (stats derivation layer)

## Notes

- **No player comparison.** This page is about self-reflection, not competition. No leaderboards, no "you vs teammate" charts.
- Show charts whenever there's data — even one game. No minimum threshold.
- The exact chart selection can be refined during implementation. Start with what's simplest and most useful; iterate.
- Round-level visualizations (per-round performance, score progression) depend on ticket 011 and are out of scope here.
