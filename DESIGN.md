# Design Enforcement & Feedback Loop

How we keep UI quality tight. Two layers: lint rules and visual verification.

- [Blacklist Rule](#blacklist-rule)
- [Whitelist Rule](#whitelist-rule)
- [Playwright Workflow](#playwright-workflow)
- [Status](#status)

---

Together these two rules funnel all color usage through the preset system: the blacklist pushes you away from raw Tailwind utilities, the whitelist ensures the preset you land on is valid.

## Blacklist Rule

**What:** ESLint rule that rejects raw Tailwind palette colors in any class string. Simpler to implement; catches the most common mistake.

**File:** `eslint/rules/no-raw-tailwind-colors.js`

**Logic:**

```js
const FORBIDDEN_COLORS = [
	'red',
	'green',
	'blue',
	'yellow',
	'orange',
	'amber',
	'lime',
	'emerald',
	'teal',
	'cyan',
	'sky',
	'indigo',
	'violet',
	'purple',
	'fuchsia',
	'pink',
	'rose',
	'gray',
	'zinc',
	'slate',
	'stone',
	'neutral',
];
const PREFIXES = [
	'bg',
	'text',
	'border',
	'ring',
	'fill',
	'stroke',
	'shadow',
	'outline',
	'accent',
	'caret',
	'divide',
	'placeholder',
];
const RE = new RegExp(`^(${PREFIXES.join('|')})-(?!opacity)(${FORBIDDEN_COLORS.join('|')})-\\d+`);
// visit SvelteAttribute 'class' nodes → split value → test each token → report
```

**Catches:** `bg-red-500`, `text-zinc-400`, `border-green-600` in static class strings.

**Misses:** typos in preset names (`preset-filled-errro-500`), dynamic class strings.

---

## Whitelist Rule

**What:** ESLint rule that validates `preset-*` classes against a dynamically built allowlist. Stricter than blacklist — catches typos and undefined presets.

**File:** `eslint/rules/valid-preset-class.js`

**Logic:**

The allowlist is built at rule initialization from two sources:

1. **Skeleton built-ins** — computed from color × shade matrix:

```js
const COLORS = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'surface'];
const SHADES = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];

const builtins = new Set([
	'preset-tonal',
	...COLORS.flatMap((c) => [
		`preset-tonal-${c}`,
		...SHADES.map((s) => `preset-outlined-${c}-${s}`),
		...SHADES.map((s) => `preset-filled-${c}-${s}`),
		...SHADES.flatMap((s1) => SHADES.map((s2) => `preset-filled-${c}-${s1}-${s2}`)),
	]),
]);
```

2. **Custom presets** — parsed live from `src/app.css`:

```js
const css = fs.readFileSync('src/app.css', 'utf8');
const custom = new Set([...css.matchAll(/\.(preset-[\w-]+)/g)].map((m) => m[1]));
```

Any class token starting with `preset-` that isn't in `builtins ∪ custom` is an error.

**Catches:** blacklist violations + typos in preset names + usage of presets not yet defined.

**Misses:** dynamic class strings (`clsx(...)`, template literals).

**Note:** The built-in set is ~10k entries. Fine as a `Set` — O(1) lookup, initialized once per lint run.

---

## Playwright Workflow

**What:** Agent takes a mobile-viewport screenshot after writing UI, reads it back, and self-critiques before considering work done.

**Viewport:** 390×844px (iPhone 14). This is the primary design target.

**Steps:**

1. Ensure `pnpm dev` is running
2. Navigate Playwright to the target route
3. Capture screenshot at mobile viewport
4. Read the screenshot image
5. Check against the outdoor readability rules:
   - Touch targets visually ≥ 48px
   - Text readable (not washed out, sufficient size)
   - Hierarchy clear at a glance
   - No obvious contrast failures
6. Iterate if needed; re-screenshot to confirm

**Skill:** `/screenshot <route>` — wraps steps 1–4. Agent handles 5–6.

The dev server start is idempotent — if already running, the command is a no-op.

---

## Status

| Layer                          | Status    | Ticket |
| ------------------------------ | --------- | ------ |
| Blacklist ESLint rule          | Built     | —      |
| Whitelist ESLint rule          | Built     | —      |
| `/screenshot` Playwright skill | Built     | —      |
| Custom theme (`boule`)         | Not built | 006    |

Both lint rules are pre-conditions for ticket 006 landing with confidence. They could be bundled into a single ticket or treated as a prerequisite subtask.

---

_Design spec:_ `.project/systems/design-system.md`
_Preset working rules:_ `.claude/skills/design-system/SKILL.md`
