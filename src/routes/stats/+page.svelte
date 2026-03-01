<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { liveQuery } from 'dexie';
	import { BarChart, LineChart } from 'layerchart';
	import { db } from '$lib/db';
	import type { Game } from '$lib/types';
	import {
		getCurrentPlayerName,
		getPlayerOverallStats,
		getPlayerTimeSeries,
		getPlayerDayOfWeekStats,
		getPlayerRecentForm,
	} from '$lib/stats/player-stats';
	import {
		stats_title,
		stats_games,
		stats_throws,
		stats_success_rate,
		stats_wins,
		stats_recent_form_title,
		stats_recent_form_last,
		stats_recent_form_alltime,
		stats_overall_trend_title,
		stats_skill_trend_title,
		stats_day_of_week_title,
		stats_empty_title,
		stats_empty_description,
		stats_no_data,
		pointing,
		shooting,
		new_game,
		day_mon,
		day_tue,
		day_wed,
		day_thu,
		day_fri,
		day_sat,
		day_sun,
	} from '$lib/paraglide/messages.js';

	let games: readonly Game[] = $state([]);
	let loading = $state(true);

	onMount(() => {
		const subscription = liveQuery(() => db.games.toArray()).subscribe({
			next: (result) => {
				games = result;
				loading = false;
			},
			error: () => {
				loading = false;
			},
		});
		return () => subscription.unsubscribe();
	});

	const playerName = $derived(getCurrentPlayerName(games));
	const hasData = $derived(playerName !== null);

	const overallStats = $derived(playerName ? getPlayerOverallStats(games, playerName) : null);

	const timeSeries = $derived(playerName ? getPlayerTimeSeries(games, playerName) : []);

	const recentForm = $derived(playerName ? getPlayerRecentForm(games, playerName) : null);

	const dayLabels = $derived([
		day_mon(),
		day_tue(),
		day_wed(),
		day_thu(),
		day_fri(),
		day_sat(),
		day_sun(),
	]);

	const dayOfWeekStats = $derived(
		playerName ? getPlayerDayOfWeekStats(games, playerName, dayLabels) : [],
	);

	// Overall success rate per game
	const overallTrendData = $derived(
		timeSeries.map((dp, i) => ({
			game: i + 1,
			rate: dp.overall.rate ?? 0,
		})),
	);

	// Pointing vs Shooting comparison (static bar)
	const skillComparisonData = $derived.by(() => {
		if (!overallStats) return [];
		return [
			{ label: pointing(), rate: overallStats.pointing.rate ?? 0 },
			{ label: shooting(), rate: overallStats.shooting.rate ?? 0 },
		];
	});

	const hasSkillComparison = $derived(
		overallStats !== null &&
			(overallStats.pointing.attempts > 0 || overallStats.shooting.attempts > 0),
	);

	// Dual-line trend: pointing vs shooting per game
	const skillTrendData = $derived(
		timeSeries.map((dp, i) => ({
			game: i + 1,
			pointing: dp.pointing.rate ?? 0,
			shooting: dp.shooting.rate ?? 0,
		})),
	);

	const dayData = $derived(
		dayOfWeekStats.map((d) => ({
			day: d.label,
			rate: d.stats.rate ?? 0,
		})),
	);
</script>

{#if loading}
	<div class="flex min-h-screen items-center justify-center">
		<span
			class="border-primary-500 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
			aria-label="Loading"
		></span>
	</div>
{:else if !hasData}
	<div class="flex min-h-screen flex-col items-center justify-center p-4 pb-20 text-center">
		<h1 class="h2 mb-4 font-bold">{stats_empty_title()}</h1>
		<p class="text-surface-700 dark:text-surface-300 mb-6 text-base">
			{stats_empty_description()}
		</p>
		<a href={resolve('/')} class="btn preset-filled-primary-500 min-h-12 text-lg">{new_game()}</a>
	</div>
{:else if overallStats}
	<div class="space-y-6 p-4 pb-20">
		<h1 class="h2 font-bold">{stats_title()}</h1>

		<!-- Summary cards -->
		<div class="grid grid-cols-2 gap-4">
			<div class="card preset-outlined-surface-500 p-4 text-center">
				<div class="text-3xl font-bold">{overallStats.games}</div>
				<div class="text-surface-700 dark:text-surface-300 text-sm">{stats_games()}</div>
			</div>
			<div class="card preset-outlined-surface-500 p-4 text-center">
				<div class="text-3xl font-bold">{overallStats.totalThrows}</div>
				<div class="text-surface-700 dark:text-surface-300 text-sm">{stats_throws()}</div>
			</div>
			<div class="card preset-outlined-surface-500 p-4 text-center">
				<div class="text-3xl font-bold">
					{overallStats.overall.rate !== null ? `${overallStats.overall.rate}%` : stats_no_data()}
				</div>
				<div class="text-surface-700 dark:text-surface-300 text-sm">{stats_success_rate()}</div>
			</div>
			<div class="card preset-outlined-surface-500 p-4 text-center">
				<div class="text-3xl font-bold">{overallStats.wins}/{overallStats.games}</div>
				<div class="text-surface-700 dark:text-surface-300 text-sm">{stats_wins()}</div>
			</div>
		</div>

		<!-- 1. Recent form card -->
		{#if recentForm && recentForm.recentGames > 0}
			<section>
				<h3 class="h3 mb-3 font-medium">{stats_recent_form_title()}</h3>
				<div class="card preset-outlined-surface-500 grid grid-cols-2 gap-4 p-4">
					<div class="text-center">
						<div class="text-3xl font-bold">
							{recentForm.recentRate !== null ? `${recentForm.recentRate}%` : stats_no_data()}
						</div>
						<div class="text-surface-700 dark:text-surface-300 text-sm">
							{stats_recent_form_last({ count: recentForm.recentGames })}
						</div>
					</div>
					<div class="text-center">
						<div class="text-3xl font-bold">
							{recentForm.alltimeRate !== null ? `${recentForm.alltimeRate}%` : stats_no_data()}
						</div>
						<div class="text-surface-700 dark:text-surface-300 text-sm">
							{stats_recent_form_alltime()}
						</div>
					</div>
				</div>
			</section>
		{/if}

		<!-- 2. Overall success rate trend -->
		{#if overallTrendData.length > 1}
			<section>
				<h3 class="h3 mb-3 font-medium">{stats_overall_trend_title()}</h3>
				<div class="card preset-outlined-surface-500 p-4">
					<div class="h-48">
						<LineChart
							data={overallTrendData}
							x="game"
							series={[{ key: 'rate', color: 'var(--color-primary-500)' }]}
							props={{ yAxis: { format: (v: number) => `${v}%` } }}
						/>
					</div>
				</div>
			</section>
		{/if}

		<!-- 3. Pointing vs Shooting comparison (bar) -->
		{#if hasSkillComparison}
			<section>
				<h3 class="h3 mb-3 font-medium">{stats_skill_trend_title()}</h3>
				<div class="card preset-outlined-surface-500 p-4">
					<div class="h-48">
						<BarChart
							data={skillComparisonData}
							x="label"
							series={[{ key: 'rate', color: 'var(--color-tertiary-500)' }]}
							props={{ yAxis: { format: (v: number) => `${v}%` } }}
						/>
					</div>
				</div>
			</section>
		{/if}

		<!-- 4. Pointing vs Shooting trend -->
		{#if skillTrendData.length > 1}
			<section>
				<h3 class="h3 mb-3 font-medium">{stats_skill_trend_title()}</h3>
				<div class="card preset-outlined-surface-500 p-4">
					<div class="mb-2 flex gap-4 text-sm">
						<span class="flex items-center gap-1">
							<span class="bg-primary-500 inline-block h-3 w-3 rounded-full"></span>
							{pointing()}
						</span>
						<span class="flex items-center gap-1">
							<span class="bg-secondary-500 inline-block h-3 w-3 rounded-full"></span>
							{shooting()}
						</span>
					</div>
					<div class="h-48">
						<LineChart
							data={skillTrendData}
							x="game"
							series={[
								{ key: 'pointing', color: 'var(--color-primary-500)' },
								{ key: 'shooting', color: 'var(--color-secondary-500)' },
							]}
							props={{ yAxis: { format: (v: number) => `${v}%` } }}
						/>
					</div>
				</div>
			</section>
		{/if}

		<!-- 5. Day of week chart -->
		{#if overallStats.totalThrows > 0}
			<section>
				<h3 class="h3 mb-3 font-medium">{stats_day_of_week_title()}</h3>
				<div class="card preset-outlined-surface-500 p-4">
					<div class="h-48">
						<BarChart
							data={dayData}
							x="day"
							series={[{ key: 'rate', color: 'var(--color-tertiary-500)' }]}
							props={{ yAxis: { format: (v: number) => `${v}%` } }}
						/>
					</div>
				</div>
			</section>
		{/if}
	</div>
{/if}
