#!/usr/bin/env node
// Usage: node scripts/screenshot.mjs [route]
// Route defaults to '/'. Output: screenshots/latest.png

import { withPage } from './browser.mjs';

const route = process.argv[2] ?? '/';
await withPage(async () => {}, { route });
