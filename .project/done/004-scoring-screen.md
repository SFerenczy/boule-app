# Ticket: Scoring Screen

## Priority

High

## Goal

Build the main game screen — the core interaction loop of creating a game, tracking Legen/Schießen stats per team, and completing the game. This is the "your dad uses it on the field" milestone.

## Context

Replaces the original boule-zaehler's single-page counter with a proper Svelte component backed by IndexedDB persistence. The interaction model stays the same: big buttons, live percentages, minimal friction. But now games persist across sessions.

### What the original boule-zaehler does

- Two team cards, each with Legen and Schießen rows
- Each row: green success button, red fail button, percentage display (e.g. "67%" with "(4/6)" detail)
- Reset button with confirm dialog
- Dark theme, large touch targets, no navigation

### What this ticket adds

- Game creation (team names, default "Team 1"/"Team 2")
- Persistent game state (survives refresh/close)
- Game completion flow (end game, save results)
- Resume: reopening the app returns to the active game

## Tasks

### Game Start

- [ ] New game flow: enter team names (default "Team 1" / "Team 2"), start game
- [ ] If an active game exists on app load, resume it directly
- [ ] Minimal UI — don't over-design, just get to the counters fast

### Scoring UI

- [ ] Two team cards, each with Legen + Schießen rows
- [ ] Success (green) and fail (red) buttons per row — big touch targets (min 48px)
- [ ] Live percentage display per category: "67%" with "(4/6)" detail
- [ ] Debounce/guard against accidental double-taps
- [ ] Undo last action (single-level undo, nice to have)

### Game Completion

- [ ] "End Game" action with confirmation
- [ ] Marks game as completed via repository
- [ ] Returns to new game screen after completion

### Data Integration

- [ ] Wire UI to `GameRepository` from ticket 003
- [ ] Use `liveQuery` for reactive stat updates
- [ ] All state changes persist immediately to IndexedDB

### Mobile Optimization

- [ ] Outdoor-readable contrast (dark theme, high contrast text)
- [ ] Touch targets ≥ 48px per Material Design guidelines
- [ ] No horizontal scroll — single column, full width
- [ ] Fast: no loading spinners, no perceived latency

### Tests

- [ ] Component test: scoring screen renders with correct initial state
- [ ] Component test: tapping success/fail updates the display
- [ ] Integration test: game creation → scoring → completion flow

## Acceptance

- Can create a new game with team names
- Can track Legen/Schießen success/fail for both teams with live percentages
- Game state survives browser refresh
- Can complete a game and start a new one
- Mobile-friendly: usable on a phone in sunlight with one hand
- `just check` passes

## Dependencies

- Ticket 003 (game data model) — must be completed first

## Design Notes

- The scoring screen IS the app for Phase 2. It's the default route (`/`). No navigation, no sidebar, no header menu. Just the game.
- Keep the layout close to the original boule-zaehler — it works. Two team cards stacked vertically, counters inside each card.
- Use Skeleton UI components where they add value (buttons, cards, modals for confirmation). Don't force Skeleton where raw Tailwind is simpler.
- Undo is listed as nice-to-have. If it complicates the data model, defer to a future ticket.
