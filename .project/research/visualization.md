# Visualization Research

Initial exploration of charting tooling and visualization ideas for the boule app. This is **early-stage research** — no decisions made, no library chosen. The goal is to capture what we know so far and inform future tickets.

- Charting Library Options
- Visualization Ideas
- Open Questions
- Data Model Gaps

## Charting Library Options

Evaluated against the stack: SvelteKit 5, Skeleton UI, Tailwind CSS v4, static SPA with service worker caching.

| Library                        | Size (gzip) | Svelte 5                          | Mobile             | Fit    | Notes                                                            |
| ------------------------------ | ----------- | --------------------------------- | ------------------ | ------ | ---------------------------------------------------------------- |
| **LayerChart**                 | ~5-15 KB    | v1 compat, v2 pre-release (runes) | SVG, responsive    | Best   | Svelte-native, style with Tailwind directly, built on Layer Cake |
| **Chart.js** (svelte5-chartjs) | ~30-40 KB   | Community wrapper                 | Canvas, good touch | Good   | Largest ecosystem, config-based styling (not CSS)                |
| **frappe-charts**              | ~17 KB      | Compat mode                       | SVG, responsive    | OK     | Simplest API, limited chart types, smaller community             |
| **Layer Cake** (DIY)           | ~3 KB       | Full runes (v8.4+)                | SVG/HTML           | Power  | Headless — you draw everything yourself                          |
| **Unovis**                     | ~30-50 KB   | Likely compat                     | Basic              | Viable | TypeScript-first, CSS variable theming                           |

**Not viable:** visx (React-only), Recharts (React-only), Plotly (~1MB), ECharts (~200KB+ shaken), Pancake (abandoned).

**Current leaning:** LayerChart for Svelte-native integration with Tailwind/Skeleton. Chart.js as fallback if LayerChart's v2 pre-release proves unstable.

## Visualization Ideas

What the current data model can support (event-sourced `HistoryEntry` with timestamp, player, category, type).

### Per-Player Stats (bar charts)

- Success rate by category — pointing vs shooting. "Am I a better shooter or pointer?"
- Success rate vs team average — "How do I stack up?"
- Attempts breakdown (pointing success/fail, shooting success/fail)

### Trends Over Time (line charts)

- Success rate per game — "Am I improving?"
- Pointing vs shooting divergence over time
- Games played frequency

### Cross-Player / Team Analysis

- Win rate correlation with shooting success % (scatter)
- Head-to-head records (if names tracked consistently)
- "MVP" metric — highest success rate in winning games

### Simple Grids

- Player × category success heatmap (like the original boule-zaehler, but aggregated across games)

## Decisions Made

1. **Library: LayerChart v2.** Native Svelte 5 runes support. Chart.js as fallback only if v2 proves unstable. → Ticket 013
2. **Where: Dedicated stats page.** `/stats` route focused on individual player self-reflection over time. No post-game comparison view — avoids unnecessary competitiveness. → Ticket 015
3. **No minimum data threshold.** Show charts whenever there's data, even one game.
4. **No caching.** Local device data for single players — even 1000 games is trivially fast to derive.
5. **Focus: individual over time, not player comparison.** "Am I improving?" and "Am I bad on Mondays?" over "Who's the best?"

## Data Model Gaps

Things the current model **cannot** answer that would make interesting visualizations:

| Question                                            | Missing Data                | Ticket                                        |
| --------------------------------------------------- | --------------------------- | --------------------------------------------- |
| Per-round analysis ("how do I perform in round 3?") | Round boundaries on throws  | 011-round-scoring adds `round` + `throwIndex` |
| Positional stats ("last boule accuracy")            | Throw position within round | 011-round-scoring adds `throwIndex`           |
| Score progression ("who was leading?")              | Round-level scores          | 011-round-scoring adds `rounds[]`             |
| Location-based ("success from position X")          | No spatial data             | Not planned                                   |
| Weather/conditions correlation                      | No external data            | Not planned                                   |

**Key dependency:** Ticket 011 (round scoring) significantly enriches the data available for visualization. Many interesting charts become possible only after rounds are tracked.
