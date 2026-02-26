/**
 * Shared browser helper for agent screenshot scripts.
 *
 * Usage:
 *
 *   import { withPage } from './browser.mjs';
 *
 *   await withPage(async (page) => {
 *     await page.fill('[placeholder="Team 1"]', 'Sophie');
 *     await page.click('text=Start Game');
 *     // page.screenshot() is called automatically after this function returns
 *   }, { route: '/', out: 'screenshots/latest.png' });
 */

import { chromium } from 'playwright';
import waitOn from 'wait-on';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const PORT = 5174;
const BASE_URL = `http://localhost:${PORT}`;

export async function withPage(fn, { route = '/', out = 'screenshots/latest.png' } = {}) {
	mkdirSync(dirname(out) === '.' ? 'screenshots' : dirname(out), { recursive: true });

	// Start dev server if not already listening
	try {
		await waitOn({ resources: [`tcp:${PORT}`], timeout: 500 });
	} catch {
		console.log('Dev server not running — starting it…');
		const dev = spawn('pnpm', ['exec', 'vite', 'dev'], { stdio: 'ignore', detached: true });
		dev.unref();
		await waitOn({ resources: [`tcp:${PORT}`], timeout: 15_000 });
	}

	const browser = await chromium.launch();
	const page = await browser.newPage();
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle' });

	await fn(page);

	await page.screenshot({ path: out });
	await browser.close();

	console.log(`Screenshot saved → ${out}`);
}
