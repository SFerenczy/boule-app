<script lang="ts">
	import {
		new_game,
		team1_label,
		team2_label,
		start_game,
		track_players,
		team_size,
		player_name,
		me,
	} from '$lib/paraglide/messages.js';
	import LanguageSelector from './LanguageSelector.svelte';
	import { onMount } from 'svelte';

	const {
		onStart,
	}: {
		readonly onStart: (
			team1Name: string,
			team2Name: string,
			team1Players: readonly string[],
			team2Players: readonly string[],
		) => void;
	} = $props();

	let team1Name = $state(team1_label());
	let team2Name = $state(team2_label());
	let trackPlayers = $state(false);
	let teamSize = $state<1 | 2 | 3>(2);
	let team1Players = $state<readonly string[]>([me()]);
	let team2Players = $state<readonly string[]>([defaultPlayerName(3), defaultPlayerName(4)]);

	const STORAGE_KEY = 'boule-player-settings';

	function defaultPlayerName(n: number): string {
		return player_name({ number: n });
	}

	function ensurePlayerSlots(
		players: readonly string[],
		size: number,
		startIndex: number,
	): readonly string[] {
		const sliced = players.slice(0, size);
		const padding = Array.from({ length: Math.max(0, size - sliced.length) }, (_, i) =>
			defaultPlayerName(startIndex + sliced.length + i),
		);
		return [...sliced, ...padding];
	}

	function handleTeamSizeChange(size: 1 | 2 | 3) {
		teamSize = size;
		const t1 = ensurePlayerSlots(team1Players, size, 1);
		team1Players = [me(), ...t1.slice(1)];
		team2Players = ensurePlayerSlots(team2Players, size, size + 1);
	}

	onMount(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved) {
				const settings = JSON.parse(saved);
				if (typeof settings.trackPlayers === 'boolean') trackPlayers = settings.trackPlayers;
				if ([1, 2, 3].includes(settings.teamSize)) teamSize = settings.teamSize;
				if (Array.isArray(settings.team1Players)) {
					const loaded = ensurePlayerSlots(settings.team1Players, teamSize, 1);
					team1Players = [me(), ...loaded.slice(1)];
				}
				if (Array.isArray(settings.team2Players)) {
					team2Players = ensurePlayerSlots(settings.team2Players, teamSize, teamSize + 1);
				}
			}
		} catch {
			// Ignore corrupt localStorage
		}
	});

	function updatePlayer(arr: readonly string[], index: number, value: string): readonly string[] {
		return arr.map((v, i) => (i === index ? value : v));
	}

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		const t1 = team1Name.trim() || team1_label();
		const t2 = team2Name.trim() || team2_label();

		let p1: readonly string[];
		let p2: readonly string[];

		if (trackPlayers) {
			p1 = team1Players
				.map((p) => p.trim())
				.map((p, i) => p || (i === 0 ? me() : defaultPlayerName(i + 1)));
			p2 = team2Players
				.map((p) => p.trim())
				.map((p, i) => p || defaultPlayerName(teamSize + i + 1));

			try {
				localStorage.setItem(
					STORAGE_KEY,
					JSON.stringify({ trackPlayers, teamSize, team1Players: p1, team2Players: p2 }),
				);
			} catch {
				// Ignore storage errors
			}
		} else {
			p1 = ['Anonymous'];
			p2 = ['Anonymous'];

			try {
				localStorage.setItem(
					STORAGE_KEY,
					JSON.stringify({
						trackPlayers,
						teamSize,
						team1Players: team1Players,
						team2Players: team2Players,
					}),
				);
			} catch {
				// Ignore storage errors
			}
		}

		onStart(t1, t2, p1, p2);
	}
</script>

<div class="flex min-h-screen items-center justify-center p-4">
	<form
		onsubmit={handleSubmit}
		class="card preset-outlined-surface-500 flex w-full max-w-sm flex-col gap-6 p-6"
	>
		<h1 class="h3 text-center font-bold">{new_game()}</h1>

		<label class="flex flex-col gap-1">
			<span class="text-base font-medium">{team1_label()}</span>
			<input
				type="text"
				class="preset-form-input w-full"
				bind:value={team1Name}
				placeholder={team1_label()}
			/>
		</label>

		<label class="flex flex-col gap-1">
			<span class="text-base font-medium">{team2_label()}</span>
			<input
				type="text"
				class="preset-form-input w-full"
				bind:value={team2Name}
				placeholder={team2_label()}
			/>
		</label>

		<label class="flex min-h-12 cursor-pointer items-center gap-3">
			<input type="checkbox" class="h-6 w-6" bind:checked={trackPlayers} />
			<span class="text-base font-medium">{track_players()}</span>
		</label>

		{#if trackPlayers}
			<div class="space-y-4">
				<div>
					<span class="text-base font-medium">{team_size()}</span>
					<div class="mt-2 flex gap-2">
						{#each [1, 2, 3] as size (size)}
							<button
								type="button"
								class="btn min-h-12 flex-1 {teamSize === size
									? 'preset-filled-primary-500'
									: 'preset-outlined-surface-500'}"
								onclick={() => handleTeamSizeChange(size as 1 | 2 | 3)}
							>
								{size}v{size}
							</button>
						{/each}
					</div>
				</div>

				<div class="space-y-2">
					<span class="text-base font-medium">{team1Name || team1_label()}</span>
					{#each Array.from({ length: teamSize }, (_, i) => i) as i (i)}
						{#if i === 0}
							<input
								type="text"
								class="preset-form-input w-full opacity-70"
								value={me()}
								readonly
							/>
						{:else}
							<input
								type="text"
								class="preset-form-input w-full"
								value={team1Players[i] ?? ''}
								oninput={(e) => {
									team1Players = updatePlayer(team1Players, i, e.currentTarget.value);
								}}
								placeholder={defaultPlayerName(i + 1)}
							/>
						{/if}
					{/each}
				</div>

				<div class="space-y-2">
					<span class="text-base font-medium">{team2Name || team2_label()}</span>
					{#each Array.from({ length: teamSize }, (_, i) => i) as i (i)}
						<input
							type="text"
							class="preset-form-input w-full"
							value={team2Players[i] ?? ''}
							oninput={(e) => {
								team2Players = updatePlayer(team2Players, i, e.currentTarget.value);
							}}
							placeholder={defaultPlayerName(teamSize + i + 1)}
						/>
					{/each}
				</div>
			</div>
		{/if}

		<button type="submit" class="preset-page-action mt-2">{start_game()}</button>

		<div class="flex justify-center">
			<LanguageSelector />
		</div>
	</form>
</div>
