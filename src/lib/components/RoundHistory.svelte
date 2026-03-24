<script lang="ts">
	import type { RoundHistoryEntry } from '$lib/stats';
	import {
		round_history,
		round_history_entry,
		round_history_dead_end,
	} from '$lib/paraglide/messages.js';

	const {
		entries,
	}: {
		readonly entries: readonly RoundHistoryEntry[];
	} = $props();
</script>

{#if entries.length > 0}
	<details class="text-sm">
		<summary class="text-surface-500 cursor-pointer py-2 font-medium">{round_history()}</summary>
		<ul class="text-surface-600 dark:text-surface-400 space-y-1 py-2">
			{#each entries as entry (entry.roundNumber)}
				<li>
					{#if entry.isDeadEnd}
						{round_history_dead_end({ number: String(entry.roundNumber) })}
					{:else}
						{round_history_entry({
							number: String(entry.roundNumber),
							team: entry.teamName ?? '',
							points: String(entry.points),
						})}
					{/if}
				</li>
			{/each}
		</ul>
	</details>
{/if}
