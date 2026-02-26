import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { db, createGame, getActiveGame, recordAction, completeGame } from '$lib/db';
import Page from './+page.svelte';

beforeEach(async () => {
	// Clear games for test isolation — uses the same singleton db as the page component
	await db.games.clear();
});

describe('Scoring Screen Page', () => {
	it('shows NewGameForm when no active game exists', async () => {
		render(Page);

		expect(await screen.findByRole('button', { name: /start game/i })).toBeInTheDocument();
	});

	it('shows ScoringScreen after creating a game', async () => {
		await createGame(db, 'Alpha', 'Beta');

		render(Page);

		expect(await screen.findByText('Alpha')).toBeInTheDocument();
		expect(screen.getByText('Beta')).toBeInTheDocument();
	});

	it('shows stat rows for both teams', async () => {
		await createGame(db, 'Team A', 'Team B');

		render(Page);

		await screen.findByText('Team A');
		const pointingLabels = screen.getAllByText('Pointing');
		expect(pointingLabels).toHaveLength(2);
	});

	it('updates stats when success button is tapped', async () => {
		await createGame(db, 'Team A', 'Team B');

		render(Page);
		await screen.findByText('Team A');

		const user = userEvent.setup();
		const successButtons = screen.getAllByRole('button', { name: /success/i });
		await user.click(successButtons[0]!);

		expect(await screen.findByText('100%')).toBeInTheDocument();
		expect(screen.getByText('1/1')).toBeInTheDocument();
	});

	it('end game returns to NewGameForm', async () => {
		const id = await createGame(db, 'Team A', 'Team B');

		render(Page);
		await screen.findByText('Team A');

		// Complete the game directly via the repository
		await completeGame(db, id);

		// liveQuery should react and show the NewGameForm
		expect(await screen.findByRole('button', { name: /start game/i })).toBeInTheDocument();
	});

	it('updates stats when fail button is tapped', async () => {
		await createGame(db, 'Team A', 'Team B');

		render(Page);
		await screen.findByText('Team A');

		const user = userEvent.setup();
		const failButtons = screen.getAllByRole('button', { name: /fail/i });
		await user.click(failButtons[0]!);

		expect(await screen.findByText('0%')).toBeInTheDocument();
		expect(screen.getByText('0/1')).toBeInTheDocument();
	});

	it('shows correct percentage with mixed success and fail', async () => {
		const id = await createGame(db, 'Team A', 'Team B');

		// Set up stats via repository to avoid double-tap guard timing issues
		await recordAction(db, id, {
			teamIndex: 0,
			player: 'Anonymous',
			category: 'pointing',
			type: 'success',
		});
		await recordAction(db, id, {
			teamIndex: 0,
			player: 'Anonymous',
			category: 'pointing',
			type: 'success',
		});
		await recordAction(db, id, {
			teamIndex: 0,
			player: 'Anonymous',
			category: 'pointing',
			type: 'fail',
		});

		render(Page);
		await screen.findByText('Team A');

		expect(screen.getByText('67%')).toBeInTheDocument();
		expect(screen.getByText('2/3')).toBeInTheDocument();
	});

	it('end game button with confirm returns to NewGameForm', async () => {
		await createGame(db, 'Team A', 'Team B');

		render(Page);
		await screen.findByText('Team A');

		const user = userEvent.setup();

		// Open the confirmation dialog
		const endButton = screen.getByRole('button', { name: /end game/i });
		await user.click(endButton);

		// Confirm in the dialog (main content becomes aria-hidden when dialog opens)
		const confirmButton = await screen.findByRole('button', { name: /end game/i });
		await user.click(confirmButton);

		expect(await screen.findByRole('button', { name: /start game/i })).toBeInTheDocument();
	});

	it('full flow: create game via form', async () => {
		render(Page);

		// Start in NewGameForm
		const startButton = await screen.findByRole('button', { name: /start game/i });
		const user = userEvent.setup();
		await user.click(startButton);

		// Should now show scoring screen with default team names (We/They)
		expect(await screen.findByText('We')).toBeInTheDocument();
		expect(screen.getByText('They')).toBeInTheDocument();

		// Verify the game was persisted
		const active = await getActiveGame(db);
		expect(active).toBeDefined();
	});
});

describe('Undo functionality', () => {
	it('undo reverts last stat increment', async () => {
		await createGame(db, 'Team A', 'Team B');

		render(Page);
		await screen.findByText('Team A');

		const user = userEvent.setup();
		const successButtons = screen.getAllByRole('button', { name: /success/i });
		await user.click(successButtons[0]!);

		// Verify stat was recorded
		expect(await screen.findByText('100%')).toBeInTheDocument();

		// Now undo
		const undoButton = screen.getByRole('button', { name: /undo/i });
		await user.click(undoButton);

		// Stat should be reverted — history should be empty
		const game = await getActiveGame(db);
		expect(game?.history).toHaveLength(0);
	});

	it('undo button is disabled when no history', async () => {
		await createGame(db, 'Team A', 'Team B');

		render(Page);
		await screen.findByText('Team A');

		const undoButton = screen.getByRole('button', { name: /undo/i });
		expect(undoButton).toBeDisabled();
	});
});

describe('Per-team success summary', () => {
	it('shows combined percentage across pointing and shooting', async () => {
		const id = await createGame(db, 'Team A', 'Team B');

		// 2 pointing successes, 1 pointing fail, 1 shooting success = 3/4 = 75%
		await recordAction(db, id, {
			teamIndex: 0,
			player: 'Anonymous',
			category: 'pointing',
			type: 'success',
		});
		await recordAction(db, id, {
			teamIndex: 0,
			player: 'Anonymous',
			category: 'pointing',
			type: 'success',
		});
		await recordAction(db, id, {
			teamIndex: 0,
			player: 'Anonymous',
			category: 'pointing',
			type: 'fail',
		});
		await recordAction(db, id, {
			teamIndex: 0,
			player: 'Anonymous',
			category: 'shooting',
			type: 'success',
		});

		render(Page);
		await screen.findByText('Team A');

		// The team summary should show 75% (3/4)
		expect(screen.getByText('75% (3/4)')).toBeInTheDocument();
	});

	it('shows dash when no data', async () => {
		await createGame(db, 'Team A', 'Team B');

		render(Page);
		await screen.findByText('Team A');

		// Both summaries should show "–" (en-dash)
		const summaryLabels = screen.getAllByText('Success');
		expect(summaryLabels).toHaveLength(2);

		// The dash characters should be present
		const dashes = screen.getAllByText('–');
		expect(dashes.length).toBeGreaterThanOrEqual(2);
	});
});
