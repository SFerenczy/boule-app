# Ticket: Observer-Friendly Team & Player Naming

## Priority

High

## Goal

Replace the "I/We/They" framing with neutral "Team A/Team B" and "Player 1/2/3" defaults, making the app usable for observers, coaches, and spectators — not just self-tracking players.

## Context

Two testers reported they'd use the app as an observer/coach/trainer, not as a player. The current "Ich" (Me), "Wir" (We), "Sie" (They) framing assumes the user is playing. Neutral defaults make the app work for both perspectives. All names should remain editable.

## Tasks

- [ ] Update i18n default labels:
  - `team1_label`: DE "Wir" → "Team A", EN "We" → "Team A", FR "Nous" → "Équipe A"
  - `team2_label`: DE "Sie" → "Team B", EN "They" → "Team B", FR "Eux" → "Équipe B"
  - `me` key: Remove or repurpose — the first player slot should default to "Spieler 1"/"Player 1"/"Joueur 1" like all other slots
- [ ] Update game setup logic: when player tracking is enabled, all player slots default to "Player {n}" pattern (no special "Me" pre-fill for team1Players[0])
- [ ] Update `getCurrentPlayerName()` in player-stats.ts — this function infers "current player" from team1Players[0] frequency. It needs to be replaced or adapted for the new model (ticket 021 handles the stats selector, but this function should not break)
- [ ] Update tests that reference "Me"/"We"/"They" strings
- [ ] Run `just check`

## Acceptance

- Default team names are "Team A" / "Team B" (localized)
- Default player names are "Player 1", "Player 2", etc. (no "Me" special case)
- Team and player names are still editable in game setup
- All tests pass
- `just check` passes

## Dependencies

None (018 can be merged independently)

## Notes

The `me` i18n key can be removed entirely. The `player_name` key with `{number}` placeholder already exists and handles the pattern.
