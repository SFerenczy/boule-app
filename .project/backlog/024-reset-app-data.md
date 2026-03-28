# Ticket: Reset All App Data

## Priority

Medium

## Goal

Allow the user to wipe all stored data and return the app to a fresh state.

## Context

Over time, users accumulate games, player data, and stats that may become stale or irrelevant. There's currently no way to start fresh without manually clearing browser storage. A dedicated reset option gives users control over their data and avoids confusion from outdated records.

This aligns with the "forgiving" UX principle — easy to undo, hard to break. The reset itself is destructive, so it needs a clear confirmation step to prevent accidental data loss.

## Tasks

- [ ] Decide where the reset option lives (no settings page exists yet — could add one, or place it on the home screen)
- [ ] Implement confirmation dialog with clear warning about what will be deleted
- [ ] Clear all persisted data (games, players, stats, game settings)
- [ ] Return user to the initial app state (as if freshly installed)
- [ ] Visual verification — screenshot the flow

## Acceptance

- User can find the reset option without difficulty
- Tapping reset shows a confirmation dialog explaining the action is irreversible
- After confirming, all app data is deleted and the app behaves as a fresh install
- Accidental taps cannot trigger data loss (requires explicit confirmation)
- Works correctly on mobile in outdoor conditions (big targets, readable text)

## Dependencies

None

## Notes

- The app currently has no settings page — only Home (`/`) and Stats (`/stats`). This ticket needs a placement decision before implementation.
- Consider a two-step confirmation (e.g., "Reset all data?" → "This cannot be undone. Are you sure?") to match the "forgiving" UX principle.
- The button should look destructive (red/warning styling) so it's clearly distinguished from safe actions.
