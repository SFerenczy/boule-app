# Ticket: Scoring Screen Polish

## Priority

Medium

## Goal

Redesign the scoring screen to be visually polished, outdoor-readable, and genuinely pleasant to use — while keeping the interaction model identical.

## Context

The current scoring screen (ticket 004) is functional but uses default Skeleton UI styling with no deliberate design decisions. This ticket applies the design system defined in ticket 005 to make the app feel intentional.

The layout and interaction model are already correct — big buttons, live percentages, two team cards. This ticket is about execution quality, not feature changes.

## Tasks

### Apply Design System

- [x] Read `.project/systems/design-system.md` before writing any markup
- [x] Replace ad-hoc Skeleton presets with design-system-specified classes
- [x] Ensure all component rules (cards, buttons, colors, spacing) are followed

### Scoring Screen (`ScoringScreen.svelte`, `TeamCard.svelte`, `StatRow.svelte`)

- [x] Team cards: strong visual separation between teams (color accent or heavier border)
- [x] Pointing/Shooting rows: label, buttons, and stat display in clear visual hierarchy
- [x] Success/fail buttons: clearly distinct (not just green/red — shape, icon, or label too)
- [x] Percentage display: dominant number, secondary fraction — size hierarchy
- [x] "End Game" button: clearly destructive but not alarming; bottom of screen, full width
- [x] Replace browser `window.confirm()` with a proper Skeleton modal

### New Game Form (`NewGameForm.svelte`)

- [x] Center vertically and horizontally, comfortable padding
- [x] Team name inputs: large, clear labels, no unnecessary chrome
- [x] "Start Game" CTA: prominent, full width

### Loading State

- [x] Replace plain text "Loading..." with something appropriate to the design system
- [x] Should be instantaneous in practice — keep it minimal

### Mobile Polish

- [x] Test layout on 375px viewport (iPhone SE baseline)
- [x] Verify no text truncation in team names
- [x] Verify percentage display doesn't overflow at 100% / (10/10)
- [x] Verify bottom button is reachable with thumb (safe area insets if needed)

### Accessibility

- [x] Verify button `aria-label` values are descriptive
- [x] Color + non-color indicators for success/fail (icon or text, not color alone)
- [x] Minimum contrast verified against design system spec

## Acceptance

- App looks intentional — not a Skeleton demo
- Outdoor readable: high contrast, large touch targets, clear hierarchy
- No visual regressions — game flow unchanged
- `just check` passes

## Dependencies

- Ticket 005 (design system) — must be completed first

---

## Resolution

**Completed:** 2026-02-22

### Decisions Made

- **Team accent approach:** Colored top-bar strip (1.5px `h-1.5`) inside the card rather than a border override, to avoid conflicts with `preset-outlined-surface-500`. Team 1 → `bg-primary-500` (terracotta), Team 2 → `bg-secondary-600` (amber/gold).
- **Custom theme generation:** Built the boule theme by hand from the cerberus CSS structure rather than using themes.skeleton.dev, to keep a clean oklch-based palette with no external tooling dependency.
- **StatRow secondary text:** Raised from `text-xs` (12px) to `text-sm` (14px) to meet the outdoor readability caption minimum. Changed `text-surface-500` to `text-surface-700 dark:text-surface-300` to avoid the washed-out mid-range.

### Artifacts Created

- `src/themes/boule.css` — Custom Skeleton theme: terracotta primary, golden-sand secondary, Mediterranean-blue tertiary, warm-tinted surface
- `src/app.css` — Updated to import `boule.css` instead of cerberus
- `src/app.html` — `data-theme="boule"`, updated `meta[theme-color]` to `#1e1b18`
- `src/lib/components/TeamCard.svelte` — Added `teamIndex: 0 | 1` prop for accent color; team name upgraded to `h2`
- `src/lib/components/ScoringScreen.svelte` — Passes `teamIndex` to TeamCard; modal description contrast fixed
- `src/lib/components/StatRow.svelte` — Fixed outdoor readability (font size, contrast)
- `src/lib/components/NewGameForm.svelte` — Labels bumped to `text-base` (16px body minimum)
