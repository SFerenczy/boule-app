# Ticket: Stats Explorer Widget

## Priority

Medium

## Goal

An interactive chart widget at the top of the stats page where the user picks dimensions to explore their own data — "show me X grouped by Y."

## Context

The stats page (ticket 015) gives pre-baked insight cards. This ticket adds a power tool above them: a single chart area with dimension pickers that let the user ask their own questions.

Examples of what a user should be able to explore:

- Success rate grouped by day of week
- Success rate grouped by teammate
- Pointing vs shooting over time, filtered to mornings only
- Performance with a specific teammate

The pre-baked cards below serve as inspiration for what to explore. The explorer itself is open-ended.

## Tasks

- [ ] Design the dimension picker UI (metric selector + group-by selector + optional filters)
- [ ] Implement metric options (success rate, attempt count, games played, etc.)
- [ ] Implement group-by options (day of week, month, teammate, category, time of day, etc.)
- [ ] Implement optional filters (date range, category, teammate, time of day, etc.)
- [ ] Render a single chart that updates based on selections
- [ ] Choose appropriate chart type automatically (bar for categorical groups, line for temporal)
- [ ] Ensure outdoor readability — large pickers, big touch targets, high contrast chart
- [ ] Handle edge cases: no data for filter combination → friendly message
- [ ] i18n for all labels, picker options, and UI text
- [ ] Visual verification via `/screenshot`

## Acceptance

- Explorer widget sits at the top of the `/stats` page
- User can select a metric and a grouping dimension
- User can optionally filter data (at least date range and category)
- Chart updates immediately on selection change
- Chart type adapts to the grouping dimension (bar vs line)
- Outdoor-readable: large pickers, high contrast, no tiny controls
- Empty filter results handled gracefully
- `just check` passes
- Visual verification passes

## Dependencies

- Ticket 015 (stats page — the explorer lives on this page)
- Ticket 014 (stats derivation layer)

## Notes

- Keep the picker UI simple. Two dropdowns + an optional filter section is better than a complex query builder.
- The explorer should feel like a tool, not a dashboard. One chart, one question at a time.
- Dimension options will grow as more data is tracked (e.g., shot position from ticket 011). Design for extensibility but only implement what's available now.
- This is still self-reflection — no cross-player comparison dimensions.
