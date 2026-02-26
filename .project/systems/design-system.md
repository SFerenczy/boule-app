# Design System

Reference doc for all UI work. Table-first. A new agent picking up a UI ticket should be able to derive consistent markup from this alone.

For working rules and the preset inventory, load the `/design-system` skill. This doc covers the _why_ and the full visual spec; the skill covers the _how_ and stays up to date with custom presets as they're added.

---

## Tone & Personality

**Adjectives:** Confident, direct, warm, trustworthy

**NOT:** Gamified, playful, decorated, clinical, sterile

**Design brief:** Used outdoors on a boule field — often by non-tech-savvy players mid-round, in bright sunlight, sometimes with dirty or wet hands. The primary interaction is a quick tap to log a result. The app earns trust through clarity and speed, not aesthetics. Warmth comes from color and copy, not from decorative UI.

---

## Visual Language

### Theme

| Decision         | Value                                                                                                                                  |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Base theme       | Custom — replace `cerberus`                                                                                                            |
| Closest built-in | `sahara` (warm amber) — usable as starting point                                                                                       |
| Reason           | Cerberus is purple-neutral with no connection to the sport. A terracotta-anchored custom theme matches the outdoor/Mediterranean feel. |

Custom theme lives in `src/themes/boule.css`, imported in `src/app.css`. Applied via `data-theme="boule"` on `<html>`. Implemented in ticket 006.

### Color Palette

Skeleton owns seven color roles: `primary`, `secondary`, `tertiary`, `success`, `warning`, `error`, `surface`. Each has shades 50–950 plus contrast values. Use Skeleton's roles — not Tailwind's built-in palette (e.g. `zinc`, `green`, `red`).

| Role      | Intent                       | Notes                            |
| --------- | ---------------------------- | -------------------------------- |
| `primary` | Primary actions, focus rings | Terracotta — set in custom theme |
| `surface` | Backgrounds, cards, borders  | Replaces raw `zinc-*` references |
| `success` | Positive outcome             | Always paired with ✓ icon        |
| `error`   | Negative/destructive         | Always paired with ✗ icon        |
| `warning` | Caution states               | Paired with ⚠ icon               |

**Color pairings:** Prefer `bg-surface-50-950` over separate `bg-surface-50 dark:bg-surface-950`. Skeleton resolves paired shades automatically via `light-dark()`.

**Contrast values:** Use `text-primary-contrast-500` (not hardcoded white/black) for text on primary-colored backgrounds.

**Rule:** Never convey state with color alone. Success/fail must use icon + color.

### Typography

| Level   | Class              | Weight   | Use                  |
| ------- | ------------------ | -------- | -------------------- |
| h1      | `h1` / `text-3xl`  | Bold     | Screen titles (rare) |
| h2      | `h2` / `text-2xl`  | Semibold | Team names           |
| h3      | `h3` / `text-xl`   | Medium   | Section headers      |
| h4      | `h4` / `text-lg`   | Medium   | Card labels          |
| Body    | `text-base` (16px) | Normal   | Stats, descriptions  |
| Caption | `text-sm` (14px)   | Normal   | Secondary labels     |

**Outdoor rule:** Body minimum 16px. Caption minimum 14px. Never go smaller.

Skeleton's typography uses `h1`–`h6` utility classes driven by `--text-scaling` in the theme. Set this in the custom theme to control the scale ratio.

### Spacing

| Token        | Value              | Use                     |
| ------------ | ------------------ | ----------------------- |
| Base unit    | 4px (Tailwind `1`) | —                       |
| Card padding | `p-4` (16px)       | All cards               |
| Section gap  | `gap-4` (16px)     | Between major sections  |
| Button gap   | `gap-2` (8px)      | Icon + label in buttons |
| Page padding | `p-4`              | Outer page container    |

### Border Radius

| Element      | Class          | Value |
| ------------ | -------------- | ----- |
| Cards        | `rounded-lg`   | 8px   |
| Buttons      | `rounded-md`   | 6px   |
| Badges/chips | `rounded-full` | —     |

No mixing — cards use `rounded-lg`, buttons use `rounded-md`, always.

---

## Component Rules

### Preset Syntax Reference

Skeleton provides three preset types. Use these — don't write raw Tailwind color classes for interactive elements.

| Type     | Syntax                                                                    | Use                                                      |
| -------- | ------------------------------------------------------------------------- | -------------------------------------------------------- |
| Filled   | `preset-filled-{color}-{shade}` or `preset-filled-{color}-{light}-{dark}` | Primary CTAs, destructive confirms                       |
| Tonal    | `preset-tonal` / `preset-tonal-{color}`                                   | Stat buttons, auxiliary actions — subtle background tint |
| Outlined | `preset-outlined-{color}-{shade}`                                         | Cards, secondary buttons, error states                   |

Examples: `preset-filled-primary-500`, `preset-tonal-surface`, `preset-outlined-error-500`, `preset-filled-error-500`

### Cards

| Variant | Class                          | When                           |
| ------- | ------------------------------ | ------------------------------ |
| Default | `preset-outlined-surface-500`  | Team cards, content containers |
| Tonal   | `preset-tonal-surface`         | Subtle grouped sections        |
| Filled  | `preset-filled-surface-50-950` | Modal backgrounds, overlays    |
| Custom  | Avoid                          | Use one of the above           |

### Buttons

| Size | Class        | Min height | When                                       |
| ---- | ------------ | ---------- | ------------------------------------------ |
| lg   | `btn btn-lg` | 52px       | Primary page action (End Game, Start Game) |
| md   | `btn`        | 48px       | Standard actions                           |
| sm   | `btn btn-sm` | 40px       | Secondary/inline — use sparingly           |

Stat tap buttons: use `preset-stat-tap-success` / `preset-stat-tap-fail` — filled success/error with large touch targets. Filled is intentional here: color-coded tap targets are critical for outdoor speed-of-use, and the +/− glyphs satisfy the icon requirement so color isn't conveying state alone.

**Touch target rule:** All interactive elements minimum 48px × 48px. If a button is visually smaller, add padding to reach 48px.

**Icon-only buttons:** Must include `aria-label`. Minimum 48px × 48px.

### States

| State          | Visual treatment                                                            |
| -------------- | --------------------------------------------------------------------------- |
| Disabled       | `opacity-50 cursor-not-allowed` — no pointer events                         |
| Loading        | Skeleton `ProgressRadial` spinner inline, or `animate-pulse` on the element |
| Error          | `preset-outlined-error-500` + error icon — never red text alone             |
| Active/pressed | `scale-95` for 100ms (see Motion)                                           |

### Modals & Confirmations

**Use Skeleton modal component** — not `window.confirm()`.

| Dialog type              | Component         | Notes                                                                             |
| ------------------------ | ----------------- | --------------------------------------------------------------------------------- |
| Destructive confirmation | `Modal`           | Title + message + Cancel/Confirm buttons. Confirm uses `preset-filled-error-500`  |
| Informational            | `Modal`           | Title + message + OK button                                                       |
| Quick confirm            | Inline double-tap | Button changes state to "Tap again to confirm" — for very low-stakes actions only |

The existing `window.confirm('End this game?')` in `ScoringScreen.svelte` should be replaced with a Skeleton modal in ticket 006.

---

## Outdoor Readability Rules

| Rule                    | Requirement                                                                               |
| ----------------------- | ----------------------------------------------------------------------------------------- |
| Text contrast           | WCAG AAA (7:1) for body text in both light and dark modes                                 |
| Primary action contrast | WCAG AA (4.5:1) minimum — aim for AAA                                                     |
| Font size               | 16px body minimum, 14px caption minimum                                                   |
| Color-only state        | Never — always pair with icon or label                                                    |
| Dark mode               | Preferred for sunlight; system default respected, dark explicitly recommended in app meta |
| Low-contrast grays      | Avoid `surface-300`–`surface-600` range as primary text — too easily washed out           |

---

## Motion & Interaction

| Element             | Behavior                              | Duration |
| ------------------- | ------------------------------------- | -------- |
| Button press        | `scale-95` on `:active`               | 100ms    |
| Modal entry         | Fade in (`opacity-0` → `opacity-100`) | 150ms    |
| Modal exit          | Fade out                              | 100ms    |
| Page transitions    | None — instant                        | —        |
| Stat counter change | None — instant                        | —        |

**Policy:** No animation by default. Only the above exceptions are permitted. No slides, no parallax, no bounces. `prefers-reduced-motion` must be respected — all transitions wrap in `@media (prefers-reduced-motion: no-preference)`.

---

## Skeleton UI Usage Decisions

These are explicit, not implied. When in doubt, use what's listed here.

| Component        | Decision                                            |
| ---------------- | --------------------------------------------------- |
| `Modal`          | Yes — for all confirmations and dialogs             |
| `ProgressRadial` | Yes — for loading states                            |
| `card`           | Yes — with `preset-outlined-surface-500` by default |
| `btn`            | Yes — size from table above                         |
| `AppBar`         | Evaluate per-screen — not forced                    |
| Skeleton toasts  | Yes — for non-blocking feedback (e.g. "Game saved") |
| Skeleton tabs    | Evaluate when needed                                |
| `window.confirm` | No — replace with Modal                             |
| `window.alert`   | No — replace with Modal or toast                    |
