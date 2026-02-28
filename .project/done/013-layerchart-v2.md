# Ticket: Add LayerChart v2

## Priority

Medium

## Goal

Install LayerChart v2 and verify it integrates cleanly with Svelte 5 runes, Skeleton UI, and Tailwind CSS v4.

## Context

LayerChart v2 is the chosen charting library for the app (see [visualization research](../research/visualization.md)). It has native Svelte 5 runes support and renders SVG styled with Tailwind — a natural fit for the stack. This ticket is pure infrastructure: get the library working, prove it with a throwaway chart, then remove the chart. No user-facing feature.

## Tasks

- [x] Install LayerChart v2 (`pnpm add layerchart@next` → 2.0.0-next.46)
- [x] Install peer dependencies (d3 scale modules, etc.) as needed — none needed, bundled internally
- [x] Build a throwaway proof-of-concept chart on a temp route (`/dev/chart`)
- [x] Verify: renders correctly, styles pick up Tailwind classes, no SSR issues with adapter-static
- [x] Verify: works with Skeleton UI's theming (no style conflicts)
- [x] Remove the temp route and throwaway chart
- [x] Document any gotchas in a note on this ticket

## Acceptance

- LayerChart v2 is in `package.json` with correct peer deps
- A chart was successfully rendered and removed (commit the integration, not the demo)
- No warnings or errors from the build pipeline
- `just check` passes

## Dependencies

None.

## Notes

- Use v2 (pre-release / `@next` tag), not v1 compat mode. Decision made — see research doc.
- If v2 proves unstable, fall back to Chart.js and update this ticket. But try v2 first.
- LayerChart is built on Layer Cake — some Layer Cake docs may be relevant for understanding the primitives.
- **No peer deps required.** d3-scale and other d3 modules are bundled inside LayerChart — no separate install needed.
- **High-level chart components available.** `BarChart`, `LineChart`, `AreaChart`, `PieChart`, `ScatterChart` — these handle scales, axes, and layout automatically. Use `x` (string key) and `series` (array of `{ key, value, color }`) for simple cases.
- **No SSR issues.** Builds clean with adapter-static, no browser-only guards needed.
- **Skeleton UI compatible.** Theme colors via `var(--color-*)` tokens work in chart `color` props. No style conflicts observed.
