# Ticket: Stats Page with Pre-baked Insight Cards

## Priority

Medium

## Goal

A `/stats` route showing the current player's performance across all games — pre-baked insight cards they can scroll through without any interaction.

## Context

The "Am I improving?" page. Focus is on individual self-reflection, not cross-player comparison. The player sees their own history visualized in ready-made charts and summary cards.

Uses LayerChart v2 (ticket 013) for rendering and the stats derivation layer (ticket 014) for data.

A separate stats explorer (ticket 017) will later sit above these cards, letting users slice data by arbitrary dimensions. This ticket is the scrollable baseline — useful on its own.

## Tasks

- [ ] Create `/stats` route (no player selector — always shows current user's stats)
- [ ] Add bottom nav with Stats + Home entries (hidden during active games)
- [ ] Summary stats cards: total games, total throws, overall success rate
- [ ] Category bar chart: pointing vs shooting success rate
- [ ] Trend line chart: success rate per game over time
- [ ] Day-of-week breakdown (the Monday question)
- [ ] Ensure charts are readable outdoors (large labels, high contrast, no thin lines)
- [ ] Handle empty state: no games yet → friendly message, no broken charts
- [ ] Handle single-game state: show what's available, no "not enough data" gates
- [ ] i18n for all labels and UI text
- [ ] Visual verification via `/screenshot`

## Acceptance

- Stats page exists at `/stats`, reachable via bottom nav
- Bottom nav visible on non-game screens, hidden during active games
- Shows current user's stats without a player selector
- Summary cards, one bar chart (category), one line chart (trend over time), day-of-week breakdown
- Charts render correctly on mobile viewport
- Outdoor-readable: large text, high contrast
- Empty state handled gracefully
- `just check` passes
- Visual verification passes

## Dependencies

- Ticket 013 (LayerChart v2)
- Ticket 014 (stats derivation layer)

## Notes

- **No player comparison.** Self-reflection only, no leaderboards.
- Show charts whenever there's data — even one game. No minimum threshold.
- Round-level visualizations depend on ticket 011 and are out of scope here.
- The stats explorer (ticket 017) will be added on top of this page later.
