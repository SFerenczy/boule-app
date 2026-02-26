# Ticket: Polish start screen layout

## Priority

Low

## Goal

Fix spacing issues and improve the visual quality of the new-game form.

## Context

The start screen (`NewGameForm.svelte`) works but has rough edges — some elements lack proper gaps, and the overall presentation could be tighter for a mobile-first outdoor app.

## Tasks

- [ ] Fix missing gap between Team 1 input and Team 2 label — they're visually touching
- [ ] Fix missing gap between Team 2 input and "Start Game" button — button sits flush against the input
- [ ] Review vertical rhythm — ensure consistent spacing between heading, inputs, and actions
- [ ] General visual pass — alignment, padding, proportions on a mobile viewport

## Acceptance

- All form elements have visually consistent spacing
- No elements appear cramped or touching without a gap
- Looks good on a 375px-wide mobile viewport
- `just check` passes
- Design system compliance maintained (presets, min text sizes, outdoor readability)

## Dependencies

None

## Notes

- This is a polish pass, not a redesign. Keep the existing structure and components.
- The form currently uses `space-y-4` on the card — that may need adjustment or supplementing with explicit gaps on specific elements.
