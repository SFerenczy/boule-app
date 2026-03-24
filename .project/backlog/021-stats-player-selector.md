# Ticket: Stats Player Selector

## Priority

Medium

## Goal

Replace the inferred "my stats" model with an explicit player selector, so any player's stats can be viewed.

## Context

The current stats page infers the "current player" by finding the most frequent name in team1Players[0] across all games. With the observer-friendly naming (ticket 019), this heuristic breaks down — observers aren't players. Instead, offer a dropdown of all known player names and let the user pick whose stats to view.

## Tasks

- [ ] Collect all unique player names across all games (excluding "Anonymous")
- [ ] Add a player selector dropdown/picker at the top of the stats page
- [ ] Default selection: most recently active player, or first alphabetically
- [ ] Update stats page to filter by selected player instead of `getCurrentPlayerName()`
- [ ] Update i18n: "Meine Statistik" → "Statistik" (or "Spieler-Statistik"), similar for EN/FR
  - Add key for "Select player" / "Spieler auswählen" / "Choisir un joueur"
- [ ] Handle edge case: no players found (keep existing empty state)
- [ ] Run `just check`

## Acceptance

- Stats page shows a player selector with all known player names
- Selecting a player updates all stats cards and charts for that player
- Works correctly with games that have no player tracking (Anonymous filtered out)
- All tests pass
- `just check` passes

## Dependencies

019 (observer-friendly naming — no more "Me" special case)

## Notes

`getCurrentPlayerName()` in player-stats.ts can be replaced with a `getAllPlayerNames()` function. The existing `getPlayerOverallStats()` and `getPlayerTimeSeries()` already accept a player name parameter — the selector just needs to feed them the chosen name.
