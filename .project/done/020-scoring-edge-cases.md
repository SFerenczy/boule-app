# 020 — Scoring Edge Cases: Dead End & Round Cap

## Status: Done

## Goal

Support dead-end rounds (0:0) when the cochonnet is knocked out of bounds, and verify no artificial round cap exists.

## Changes

- `Round.scoringTeamIndex` expanded from `0 | 1` to `0 | 1 | null` (null = dead end)
- `recordRound()` accepts null scoringTeamIndex
- `deriveScore()` skips dead-end rounds (score unchanged)
- `deriveRoundHistory()` marks dead-end rounds with `isDeadEnd: true` and `teamName: null`
- `RoundScoreModal` shows a "Dead End (0:0)" button on the team selection screen
- `RoundHistory` component renders dead-end entries with dedicated i18n string
- i18n keys added for DE/EN/FR: `dead_end`, `round_history_dead_end`
- No artificial round cap was found to remove (only `targetScore: 13` exists, which is the point target)

## Tests Added

- `deriveScore` ignores dead-end rounds
- `deriveRoundHistory` marks dead-end rounds correctly
- `recordRound` records dead-end round with null scoringTeamIndex
