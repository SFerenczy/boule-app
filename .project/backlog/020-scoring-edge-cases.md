# Ticket: Scoring Edge Cases — Dead End & Round Cap

## Priority

High

## Goal

Add 0:0 scoring for dead ends (cochonnet knocked out) and remove any artificial round cap.

## Context

In pétanque, when the cochonnet (jack/target ball) is knocked out of the playing area and both teams still have boules, the end is "dead" — neither team scores (0:0). The current scoring modal only offers 1–N points, making this situation unrecordable.

Also, while rare, games can theoretically have many more than 12 ends. There should be no artificial cap on round count.

## Tasks

- [ ] Add a "Dead end" / "0:0" option to the round scoring flow (RoundScoreModal or equivalent)
  - This should skip the "which team scored?" step — neither team scores
  - Add i18n keys: DE "Tote Aufnahme (0:0)", EN "Dead End (0:0)", FR "Mène nulle (0:0)"
- [ ] In `recordRound()` (game-repository.ts): allow recording a round with 0 points and no winning team
  - The Round type may need to support `teamIndex: null` or similar for dead ends
- [ ] Verify there is no hardcoded round limit (check for magic numbers like 12, 13, etc.)
- [ ] Add tests for dead-end scoring
- [ ] Run `just check`

## Acceptance

- User can record a 0:0 dead end from the scoring modal
- Dead ends appear correctly in the game progress display
- Score remains unchanged after a dead end
- No artificial round cap exists
- All tests pass
- `just check` passes

## Dependencies

018 (for terminology — "Aufnahme" not "Runde" in new strings)

## Notes

The Round type currently is: `{ teamIndex: 0 | 1, points: number }`. For dead ends, consider `{ teamIndex: null, points: 0 }` or a discriminated union. Keep it simple — a null teamIndex with 0 points is clear enough.
