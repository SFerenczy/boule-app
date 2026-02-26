# Ticket: Design System & App Identity

## Priority

High

## Goal

Define the visual language, tone, and design rules for the app before we polish individual screens. This ticket produces a living document — not code — that all future UI work references.

## Context

The app has a working scoring screen but no deliberate design language. Before polishing the UI (ticket 006), we need to decide:

- What does the app feel like?
- What are the rules that make it consistent?
- How do Skeleton UI + Tailwind work together within those rules?

This is especially important because the app is used outdoors, in sunlight, often by people who aren't tech-savvy. The design must earn trust through clarity and simplicity, not impress through complexity.

## Tasks

### Tone & Personality

- [x] Define the app's personality in 3–5 adjectives (e.g. "confident, warm, direct")
- [x] Define what the app is NOT (e.g. "not playful/gamified, not clinical/sterile")
- [x] Write a one-paragraph design brief: who uses it, where, in what state of mind

### Visual Language

- [x] **Theme:** Confirm or replace `cerberus`. Define why.
- [x] **Color palette:** Primary, surface, success, error — with semantic intent for each
- [x] **Typography:** Scale (h1–h4, body, caption), weights, when to use each
- [x] **Spacing:** Base unit, padding conventions, gap conventions
- [x] **Border radius:** One radius value for cards, one for buttons — no mixing

### Component Rules

- [x] **Cards:** When to use `preset-outlined` vs `preset-filled` vs custom
- [x] **Buttons:** Size scale (sm/md/lg), when each size applies, icon-only rules
- [x] **Touch targets:** Minimum 48px — confirm this applies everywhere
- [x] **States:** How disabled, loading, and error states look
- [x] **Modals/confirmations:** Use browser `confirm()`? Or a Skeleton modal? Decide.

### Outdoor Readability Rules

- [x] Minimum contrast ratios (aim for WCAG AAA for primary text)
- [x] Font size minimums for outdoor use
- [x] Avoid relying on color alone to convey state (success/fail needs more than green/red)
- [x] Bright sunlight considerations: dark background preferred, avoid low-contrast grays

### Motion & Interaction

- [x] Animation policy: none by default? subtle only?
- [x] Tap feedback: visual response on button press
- [x] Transition policy: page transitions, modal entry

## Deliverable

A design doc at `.project/systems/design-system.md` covering all of the above. It should be terse and reference-friendly — a table per topic where possible.

## Acceptance

- `.project/systems/design-system.md` exists and covers all sections above
- Any Skeleton UI component usage decisions are explicit (not implicit)
- A new agent picking up a UI ticket can derive consistent markup from this doc alone

## Dependencies

None — can run before or alongside ticket 006.
