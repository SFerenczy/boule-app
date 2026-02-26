---
name: design-system
description: Work with the app's design system — presets, colors, extending the system
---

# Design System

- Rules
- Preset Inventory
- Color Usage
- Adding a Preset
- Full Reference

---

## Rules

Two rules that are never broken:

1. **No raw color utilities on interactive elements or semantic states.**
   No `bg-red-500`, no `text-green-600`, no `border-zinc-300`. Use Skeleton color roles and presets.

2. **No hardcoded `white` or `black` for contrast.**
   Use `text-{color}-contrast-{shade}` — e.g. `text-primary-contrast-500`.

When in doubt about what class to use, grep existing components before inventing.

These rules are enforced automatically by two ESLint rules in `eslint/rules/`:

- **`boule/no-raw-tailwind-colors`** — rejects raw Tailwind palette utilities (`bg-red-500`, etc.) in Svelte class attributes. Pushes you toward presets.
- **`boule/valid-preset-class`** — validates every `preset-*` token against Skeleton's built-in allowlist plus any custom presets defined in `src/app.css`. Catches typos and undefined presets.

Together: the blacklist pushes you away from raw utilities; the whitelist ensures the preset you land on is valid. Both run as errors — `pnpm lint` will catch violations.

---

## Preset Inventory

### Built-in Presets

These ship with Skeleton. Use them directly — no definition needed.

| Class                          | Type            | Use in this app                           |
| ------------------------------ | --------------- | ----------------------------------------- |
| `preset-filled-primary-500`    | Filled          | Confirm actions, positive CTA             |
| `preset-filled-success-500`    | Filled          | Success stat tap button                   |
| `preset-filled-error-500`      | Filled          | Fail stat tap button, destructive confirm |
| `preset-outlined-surface-500`  | Outlined        | Cards, inputs, content containers         |
| `preset-outlined-error-500`    | Outlined        | End Game button, error state borders      |
| `preset-tonal-surface`         | Tonal           | Auxiliary/secondary actions               |
| `preset-tonal-primary`         | Tonal           | Active/selected state                     |
| `preset-filled-surface-50-950` | Filled (paired) | Modal backgrounds                         |

Tonal is the default for secondary buttons. Filled for clear CTAs and color-coded tap actions. Outlined for containers, inputs, and destructive page actions.

Syntax reference:

- `preset-filled-{color}-{shade}` — single shade, respects light-dark
- `preset-filled-{color}-{lightShade}-{darkShade}` — explicit pair
- `preset-tonal-{color}` — subtle background tint, correct for most buttons
- `preset-outlined-{color}-{shade}` — border only

### Custom Presets

Defined in `src/app.css` under the `/* Custom Presets */` section.

| Class                     | Composes                                                            | Use                                                  |
| ------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------- |
| `preset-team-card`        | `card preset-outlined-surface-500 space-y-1 p-4`                    | Both team containers — scoring, history, stats       |
| `preset-stat-tap-success` | `btn preset-filled-success-500 min-h-12 min-w-12 text-lg font-bold` | Record pointing/shooting success                     |
| `preset-stat-tap-fail`    | `btn preset-filled-error-500 min-h-12 min-w-12 text-lg font-bold`   | Record pointing/shooting fail                        |
| `preset-form-input`       | `input preset-outlined-surface-500`                                 | All text inputs                                      |
| `preset-page-action`      | `btn btn-lg preset-filled-primary-500 w-full`                       | Full-width primary CTA (Start Game, confirm actions) |

---

## Color Usage

Skeleton has seven color roles: `primary`, `secondary`, `tertiary`, `success`, `warning`, `error`, `surface`.
Each has shades 50–950 and contrast values. These are the only colors used in this app.

**Never use:** `zinc-*`, `gray-*`, `slate-*`, `red-*`, `green-*`, or any Tailwind built-in palette.

```html
<!-- Backgrounds — prefer paired shades for automatic light/dark -->
<div class="bg-surface-50-950">...</div>
<div class="bg-primary-500">...</div>

<!-- Text -->
<span class="text-surface-950-50">...</span>
<!-- body text, auto light/dark -->
<span class="text-surface-500">...</span>
<!-- muted/caption text -->
<span class="text-primary-contrast-500">...</span>
<!-- text ON a primary background -->

<!-- Borders -->
<div class="border border-surface-300-700">...</div>

<!-- State colors — always pair with an icon, never color alone -->
<span class="text-success-600 dark:text-success-400">✓ Success</span>
<span class="text-error-600 dark:text-error-400">✗ Failed</span>
```

---

## Adding a Preset

Work through this in order before defining anything new:

**1. Does a built-in preset already cover it?**
Check the inventory above. Try `preset-tonal-{color}` for any Skeleton color role — this covers most auxiliary patterns without a custom definition.

**2. Is it used in only one place?**
Compose Tailwind utilities inline — no preset needed. A preset only earns its name when 2+ components share identical styling.

**3. Is this a reusable semantic concept?**
Name it after what it _is_, not how it looks.

| Good name            | Bad name                       |
| -------------------- | ------------------------------ |
| `preset-team-card`   | `preset-orange-border-rounded` |
| `preset-stat-button` | `preset-big-tonal`             |

**4. Does it need colors?**
Build on existing presets + Skeleton roles. Never introduce a raw color. If you need a shade that doesn't exist in the theme, update the theme (`src/themes/boule.css`) — don't bypass it.

### How to add

```css
/* src/app.css — Custom Presets section */

.preset-team-card {
	@apply card preset-outlined-surface-500 p-4 rounded-lg;
}
```

Then update the Custom Presets table in this skill file.

---

## Full Reference

| Resource                                           | Purpose                                               |
| -------------------------------------------------- | ----------------------------------------------------- |
| `.project/systems/design-system.md`                | Design decisions, rationale, spacing/typography rules |
| `src/app.css`                                      | Theme import + custom presets                         |
| `src/themes/boule.css`                             | Custom theme (ticket 006 — not yet created)           |
| [themes.skeleton.dev](https://themes.skeleton.dev) | Theme generator for the custom terracotta theme       |
