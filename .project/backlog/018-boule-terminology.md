# Ticket: Boule Terminology

## Priority

High

## Goal

Replace informal/incorrect terminology with standard boule/pétanque terms across all i18n files and any code references.

## Context

Feedback from experienced players: "Aufnahme" is the correct term for a round/end in pétanque, not "Runde". Similarly, "Spielverlauf" (game flow) is more appropriate than "Rundenverlauf" (round flow).

## Tasks

- [ ] In all message files (de.json, en.json, fr.json):
  - `round` key: DE "Runde {number}" → "Aufnahme {number}", EN "Round" → "End", FR "Manche" → "Mène"
  - `score_round` key: DE "Runde werten" → "Aufnahme werten", EN stays or becomes "Score End", FR "Manche werten" → "Marquer la mène"
  - `round_history` key: DE "Rundenverlauf" → "Spielverlauf", EN "Round History" → "Game Progress", FR "Historique des manches" → "Déroulement"
  - `round_history_entry` key: DE "R{number}" → "A{number}", EN "R{number}" → "E{number}", FR "M{number}" stays or → "M{number}"
- [ ] Check for any hardcoded "Runde"/"Round" strings in Svelte components
- [ ] Update tests that assert on these strings
- [ ] Run `just check`

## Acceptance

- All UI text uses standard pétanque terminology
- No hardcoded German/English round terminology in source files
- All tests pass
- `just check` passes

## Dependencies

None

## Notes

This is a pure i18n string change. No logic changes needed. The i18n keys themselves (like `round`, `score_round`) can stay as-is — only the displayed values change.
