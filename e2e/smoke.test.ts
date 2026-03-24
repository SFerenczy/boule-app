import { test, expect } from '@playwright/test';

test.describe('Smoke tests', () => {
	test('app loads and shows start screen with Start Game button', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('button', { name: 'Start Game' })).toBeVisible();
	});

	test('start game with defaults shows game view with score 0:0', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: 'Start Game' }).click();

		// Score header should show "Team A 0 – 0 Team B"
		await expect(page.getByText('Team A 0 – 0 Team B')).toBeVisible();

		// Scoring controls should be visible
		await expect(page.getByRole('button', { name: 'Score End' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'End Game' })).toBeVisible();
	});

	test('score a round updates the score', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: 'Start Game' }).click();
		await expect(page.getByRole('button', { name: 'Score End' })).toBeVisible();

		// Tap "Score End" to open the round scoring modal
		await page.getByRole('button', { name: 'Score End' }).click();

		// Modal asks which team scored — select "Team A" (team 1)
		await page.getByRole('button', { name: 'Team A' }).click();

		// Modal asks how many points — select 2
		await page.getByRole('button', { name: '2' }).click();

		// Score should now show 2 – 0
		await expect(page.getByText('2 – 0')).toBeVisible();
	});

	test('end game shows game over screen', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: 'Start Game' }).click();
		await expect(page.getByRole('button', { name: 'End Game' })).toBeVisible();

		// Score a round first so we have something to show
		await page.getByRole('button', { name: 'Score End' }).click();
		await page.getByRole('button', { name: 'Team A' }).click();
		await page.getByRole('button', { name: '3' }).click();

		// End the game
		await page.getByRole('button', { name: 'End Game' }).click();

		// Confirmation dialog appears — confirm by clicking "End Game" again
		await page.locator('[data-scope="dialog"] button', { hasText: 'End Game' }).click();

		// Game over screen
		await expect(page.getByText('Game Over')).toBeVisible();
		await expect(page.getByText('Final Score')).toBeVisible();
		await expect(page.getByRole('button', { name: 'New Game' })).toBeVisible();
	});

	test('navigate to stats page via bottom nav', async ({ page }) => {
		await page.goto('/');

		// Bottom nav should be visible on the start screen (no active game)
		const statsLink = page.getByRole('link', { name: 'Stats' });
		await expect(statsLink).toBeVisible();

		await statsLink.click();
		await page.waitForURL('**/stats');

		// Stats page should show the empty state or a stats heading
		await expect(
			page.getByText('No stats yet').or(page.getByRole('heading', { name: 'Stats' })),
		).toBeVisible();
	});
});
