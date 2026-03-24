# Ticket: Boule Terminology

## Priority

Low

## Goal

Replace informal round terminology with standard pétanque terms across all i18n files.

## Context

Pétanque has specific terminology that differs from casual "round" language. Using correct terms improves authenticity and is standard in the sport:

- DE: "Aufnahme" (not "Runde")
- EN: "End" (not "Round")
- FR: "Mène" (not "Manche")

## Tasks

- [x] Update `messages/de.json`: Runde → Aufnahme, Rundenverlauf → Spielverlauf, R{n} → A{n}
- [x] Update `messages/en.json`: Round → End, Round History → Game Progress, R{n} → E{n}
- [x] Update `messages/fr.json`: Manche → Mène, Historique des manches → Déroulement, Manche werten → Marquer la mène
- [x] Check for hardcoded round terminology in Svelte components
- [x] Run `just check` — all passing

## Acceptance Criteria

- All i18n files use standard pétanque terminology
- No hardcoded informal round terms in components (i18n keys used instead)
- All checks pass

## Notes

- `GameOverCard.svelte` line 30 has a hardcoded English "round"/"rounds" string that should be addressed in a separate ticket (i18n pluralization).
- Internal code identifiers (variable names like `roundNumber`, `deriveRoundHistory`, type `Round`) were intentionally not renamed — they are code-level concepts, not user-facing strings.
