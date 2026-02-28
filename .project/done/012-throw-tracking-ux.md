# Ticket: Throw Tracking UX Improvements

## Priority

Medium

## Goal

Give the tracker visual feedback on how many boules are left — per player and per team — so they know where they are in a round at a glance.

## Context

With round scoring (ticket 011), the app knows how many throws to expect per round. This opens up UX improvements that help the tracker stay oriented during a round. Currently, the tracker has to mentally count who has thrown and how many are left. The app has all the data to show this.

## Ideas

### Player Boule Indicators

In the player select modal, show remaining boules per player as small filled/empty circles (e.g., ●●○ = 2 of 3 thrown). Gives instant feedback on who still needs to throw. Could also de-emphasize or visually dim players who have thrown all their boules.

### Team Throw Counter

Show remaining throws per team somewhere on the `TeamCard` or near the team name (e.g., "4/6 thrown" or 6 small dots). Helps the tracker know when a team is done without counting in their head.

### Round Progress

A compact indicator showing total round progress (e.g., "8/12 throws" or a progress bar). Could live near the round number in the score header. Gives a sense of "how close are we to scoring this round?"

### Auto-Prompt Round Scoring

When all expected throws are recorded (recorded === expectedThrows from ticket 011), automatically prompt the user to score the round — either by opening the round-score modal or highlighting the "Score Round" button. Reduces the chance of forgetting to score.

### Throw Tracking Without Player Modal

When boule indicators show a player has 0 remaining, the modal could skip them or auto-select when only one player has boules left. Reduces taps in the late round when choices are obvious.

## Tasks

_To be refined when this ticket is picked up. The ideas above need UX design and prioritization — not all may be worth implementing._

- [ ] Design boule indicator component (filled/empty circles)
- [ ] Add per-player remaining-boule count to player select modal
- [ ] Add per-team throw counter to TeamCard or score header
- [ ] Add round progress indicator
- [ ] Auto-prompt round scoring when all throws recorded
- [ ] Skip/auto-select in player modal when only one player has boules left
- [ ] Visual verification: indicators readable outdoors, don't clutter the screen

## Acceptance

- Tracker can see at a glance how many boules each player has left
- Tracker can see how many total throws remain per team
- Indicators are small and unobtrusive — they support the flow, not dominate it
- Works with and without player tracking (team-level counters work either way)

## Dependencies

- Ticket 011 (round scoring) — needs `round` on `HistoryEntry` and `expectedThrows` on `Round`

## Notes

- **Don't over-clutter.** These are all progressive enhancements. The screen is already information-dense with two teams × two stat categories × success/fail. Every indicator added must earn its space.
- **Boule indicators assume known boules-per-player.** Currently 3 per player (see ticket 011 notes). If 3v3 with 2 boules is supported later, this needs to adapt.
- **Auto-prompt is the highest-value item.** Nudging the user to score when all throws are in prevents the "forgot to score the round" problem. Could be as simple as pulsing the Score Round button.
