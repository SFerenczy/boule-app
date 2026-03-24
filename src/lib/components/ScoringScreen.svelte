<script lang="ts">
	import type { Game } from '$lib/types';
	import type { RoundHistoryEntry } from '$lib/stats';
	import {
		deriveRoundProgress,
		deriveTeamRoundProgress,
		derivePlayerRoundThrows,
		boulesPerPlayer,
	} from '$lib/stats';
	import TeamCard from './TeamCard.svelte';
	import ScoreHeader from './ScoreHeader.svelte';
	import RoundHistory from './RoundHistory.svelte';
	import RoundScoreModal from './RoundScoreModal.svelte';
	import PlayerSelectModal from './PlayerSelectModal.svelte';
	import { Dialog } from '@skeletonlabs/skeleton-svelte';
	import {
		end_game,
		end_game_title,
		end_game_description,
		cancel,
		undo,
		score_round,
	} from '$lib/paraglide/messages.js';

	const {
		game,
		trackingEnabled = false,
		score,
		roundNumber,
		roundHistory,
		maxPointsByTeam,
		onRecord,
		onEndGame,
		onUndo,
		onScoreRound,
		canUndo,
	}: {
		readonly game: Game;
		readonly trackingEnabled?: boolean;
		readonly score: readonly [number, number];
		readonly roundNumber: number;
		readonly roundHistory: readonly RoundHistoryEntry[];
		readonly maxPointsByTeam: readonly [number, number];
		readonly onRecord: (
			teamIndex: 0 | 1,
			category: 'pointing' | 'shooting',
			type: 'success' | 'fail',
			player: string,
		) => void;
		readonly onEndGame: () => void;
		readonly onUndo?: () => void;
		readonly onScoreRound: (teamIndex: 0 | 1 | null, points: number) => void;
		readonly canUndo?: boolean;
	} = $props();

	let confirmOpen = $state(false);
	let playerModalOpen = $state(false);
	let roundModalOpen = $state(false);
	let pendingAction = $state<{
		readonly teamIndex: 0 | 1;
		readonly category: 'pointing' | 'shooting';
		readonly type: 'success' | 'fail';
	} | null>(null);

	function handleStatTap(
		teamIndex: 0 | 1,
		category: 'pointing' | 'shooting',
		type: 'success' | 'fail',
	) {
		if (trackingEnabled) {
			const players = teamIndex === 0 ? game.team1Players : game.team2Players;
			if (players.length === 1) {
				onRecord(teamIndex, category, type, players[0] as string);
				return;
			}

			const total = boulesPerPlayer(players.length);
			const playersWithBoules = players.filter(
				(p) => derivePlayerRoundThrows(game.history, roundNumber, p) < total,
			);

			if (playersWithBoules.length === 1) {
				onRecord(teamIndex, category, type, playersWithBoules[0] as string);
			} else {
				pendingAction = { teamIndex, category, type };
				playerModalOpen = true;
			}
		} else {
			onRecord(teamIndex, category, type, 'Anonymous');
		}
	}

	function handlePlayerSelect(player: string) {
		if (pendingAction) {
			onRecord(pendingAction.teamIndex, pendingAction.category, pendingAction.type, player);
			pendingAction = null;
		}
		playerModalOpen = false;
	}

	function handleRoundScore(teamIndex: 0 | 1 | null, points: number) {
		roundModalOpen = false;
		onScoreRound(teamIndex, points);
	}

	const roundProgress = $derived(
		trackingEnabled
			? deriveRoundProgress(
					game.history,
					roundNumber,
					game.team1Players.length,
					game.team2Players.length,
				)
			: undefined,
	);

	const team1RoundProgress = $derived(
		trackingEnabled
			? deriveTeamRoundProgress(game.history, roundNumber, 0, game.team1Players.length)
			: undefined,
	);

	const team2RoundProgress = $derived(
		trackingEnabled
			? deriveTeamRoundProgress(game.history, roundNumber, 1, game.team2Players.length)
			: undefined,
	);

	const modalPlayers = $derived(
		pendingAction ? (pendingAction.teamIndex === 0 ? game.team1Players : game.team2Players) : [],
	);

	const allThrown = $derived(
		roundProgress !== undefined &&
			roundProgress.expected > 0 &&
			roundProgress.thrown >= roundProgress.expected,
	);

	const modalPlayerProgress = $derived.by(() => {
		if (!pendingAction || !trackingEnabled) return undefined;
		const playerCount =
			pendingAction.teamIndex === 0 ? game.team1Players.length : game.team2Players.length;
		return modalPlayers.map((name) => ({
			name,
			thrown: derivePlayerRoundThrows(game.history, roundNumber, name),
			total: boulesPerPlayer(playerCount),
		}));
	});
</script>

<div class="flex min-h-screen flex-col">
	{#if roundProgress}
		<ScoreHeader
			team1Name={game.team1Name}
			team2Name={game.team2Name}
			{score}
			{roundNumber}
			{roundProgress}
		/>
	{:else}
		<ScoreHeader team1Name={game.team1Name} team2Name={game.team2Name} {score} {roundNumber} />
	{/if}

	<div class="flex flex-col p-4">
		{#if team1RoundProgress}
			<TeamCard
				teamName={game.team1Name}
				history={game.history}
				teamIndex={0}
				roundProgress={team1RoundProgress}
				onUpdate={(category, type) => handleStatTap(0, category, type)}
			/>
		{:else}
			<TeamCard
				teamName={game.team1Name}
				history={game.history}
				teamIndex={0}
				onUpdate={(category, type) => handleStatTap(0, category, type)}
			/>
		{/if}

		<hr class="my-3" />

		{#if team2RoundProgress}
			<TeamCard
				teamName={game.team2Name}
				history={game.history}
				teamIndex={1}
				roundProgress={team2RoundProgress}
				onUpdate={(category, type) => handleStatTap(1, category, type)}
			/>
		{:else}
			<TeamCard
				teamName={game.team2Name}
				history={game.history}
				teamIndex={1}
				onUpdate={(category, type) => handleStatTap(1, category, type)}
			/>
		{/if}

		<RoundHistory entries={roundHistory} />
	</div>

	<div class="mt-auto flex flex-col gap-2 p-4 pt-2">
		<button
			type="button"
			class="btn preset-filled-primary-500 w-full {allThrown ? 'animate-pulse' : ''}"
			onclick={() => (roundModalOpen = true)}
		>
			{score_round()}
		</button>
		<div class="flex gap-2">
			{#if onUndo}
				<button
					type="button"
					class="btn btn-sm preset-outlined-surface-500 flex-1"
					disabled={!canUndo}
					onclick={onUndo}
				>
					{undo()}
				</button>
			{/if}
			<button
				type="button"
				class="btn btn-sm preset-outlined-error-500 flex-1"
				onclick={() => (confirmOpen = true)}
			>
				{end_game()}
			</button>
		</div>
	</div>
</div>

<Dialog open={confirmOpen} onOpenChange={(e) => (confirmOpen = e.open)}>
	<Dialog.Backdrop class="fixed inset-0 bg-surface-950/60 backdrop-blur-sm" />
	<Dialog.Positioner class="fixed inset-0 flex items-center justify-center p-4">
		<Dialog.Content class="card preset-filled-surface-50-950 w-full max-w-sm space-y-4 p-6">
			<Dialog.Title class="h3 font-bold">{end_game_title()}</Dialog.Title>
			<Dialog.Description class="text-surface-700 dark:text-surface-300 text-sm">
				{end_game_description()}
			</Dialog.Description>
			<div class="flex gap-2">
				<Dialog.CloseTrigger class="btn preset-tonal-surface flex-1">{cancel()}</Dialog.CloseTrigger
				>
				<button
					type="button"
					class="btn preset-filled-error-500 flex-1"
					onclick={() => {
						confirmOpen = false;
						onEndGame();
					}}
				>
					{end_game()}
				</button>
			</div>
		</Dialog.Content>
	</Dialog.Positioner>
</Dialog>

<RoundScoreModal
	open={roundModalOpen}
	team1Name={game.team1Name}
	team2Name={game.team2Name}
	{maxPointsByTeam}
	onScore={handleRoundScore}
	onClose={() => (roundModalOpen = false)}
/>

{#if modalPlayerProgress}
	<PlayerSelectModal
		open={playerModalOpen}
		players={modalPlayers}
		playerProgress={modalPlayerProgress}
		onSelect={handlePlayerSelect}
		onClose={() => {
			playerModalOpen = false;
			pendingAction = null;
		}}
	/>
{:else}
	<PlayerSelectModal
		open={playerModalOpen}
		players={modalPlayers}
		onSelect={handlePlayerSelect}
		onClose={() => {
			playerModalOpen = false;
			pendingAction = null;
		}}
	/>
{/if}
