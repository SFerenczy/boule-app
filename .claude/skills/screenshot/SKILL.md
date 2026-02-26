---
name: screenshot
description: Capture a mobile-viewport screenshot of the running app for visual review
---

# Screenshot

Captures a 390×844px (iPhone 14) screenshot of the app and saves it to
`screenshots/latest.png`. Starts the dev server automatically if it isn't running.

## Simple usage — direct route

    just screenshot [route]

`route` defaults to `/`. Use this when the UI state is reachable by URL alone.

## Interactive usage — scripted navigation

Some states (e.g. the scoring screen) require interaction to reach. For these,
write a one-off script using the `withPage` helper and run it directly:

```js
// scripts/my-screenshot.mjs
import { withPage } from './browser.mjs';

await withPage(
	async (page) => {
		await page.fill('[placeholder="Team 1"]', 'Sophie');
		await page.fill('[placeholder="Team 2"]', 'Flo');
		await page.click('text=Start Game');
		await page.waitForLoadState('networkidle');
	},
	{ route: '/' },
);
```

```sh
node scripts/my-screenshot.mjs
```

The `withPage` helper handles dev server startup, viewport, navigation, and
screenshot. The callback receives a Playwright `Page` — use any Playwright API.
Delete the script when done; it's throwaway.

## After capturing

1. Read `screenshots/latest.png` with the Read tool.
2. Check against outdoor readability rules:
   - Touch targets visually ≥ 48px
   - Text readable — not washed out, sufficient size
   - Visual hierarchy clear at a glance
   - No obvious contrast failures
3. Fix issues, re-screenshot to confirm.
