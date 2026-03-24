# Ticket: Player Profiles

## Priority

Medium

## Goal

Replace free-text player names with persistent player profiles stored locally, so trainers and regular users can track players across games without retyping names.

## Context

The app is evolving toward a trainer/coach tool — observers tracking multiple players across games and tournaments. Currently, players are just strings typed into game setup, which means:

- Typos create duplicate identities ("Hans" vs "hans")
- No way to see a player's history without exact name match
- Re-entering the same names every game is tedious
- Stats depend on string matching, which is fragile

Player profiles give each player a stable identity. This is the foundation for richer trainer features later (per-player notes, tournament rosters, skill tracking over time).

## Tasks

- [ ] Design `Player` type: `{ id: string, name: string, createdAt: Date }`
- [ ] Add `players` Dexie table and repository (CRUD)
- [ ] Add player management screen (list, add, edit, delete)
- [ ] Update game setup: pick players from profile list instead of typing names
  - Keep option to create a new player inline during setup (quick-add)
  - Still allow games without player tracking (Anonymous)
- [ ] Migrate `Game.team1Players` / `team2Players` from `string[]` to player IDs (or keep names but link to profiles)
- [ ] Update stats derivation to use profile ID instead of string matching
- [ ] Update stats player selector (ticket 021) to list profiles
- [ ] Add i18n keys for player management UI
- [ ] Run `just check`

## Acceptance

- Players can be created, edited, and deleted from a dedicated screen
- Game setup lets you pick from existing profiles or quick-add new ones
- Stats are tied to player profiles, not string matching
- Existing games with string-only player names still work (backward compat)
- All tests pass
- `just check` passes

## Dependencies

019 (observer-friendly naming), 021 (stats player selector)

## Notes

Keep it simple — a profile is just a name with a stable ID. No avatars, no metadata beyond creation date. The value is identity persistence, not richness. Consider a migration path: games created before profiles should still show in stats by falling back to name matching.

This is foundational for potential future features: tournament rosters, per-player notes, skill progression tracking.
