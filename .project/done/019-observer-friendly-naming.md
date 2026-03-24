# 019 — Observer-Friendly Team & Player Naming

## Status: Done

## Goal

Replace first-person framing ("I/We/They") with neutral observer-friendly defaults so the app works for anyone watching or scoring, not just the player holding the phone.

## Changes

- **team1_label**: "We"/"Wir"/"Nous" → "Team A"/"Team A"/"Équipe A"
- **team2_label**: "They"/"Sie"/"Eux" → "Team B"/"Team B"/"Équipe B"
- **Removed `me` i18n key** — first player slot now uses `player_name` pattern ("Player 1"/"Spieler 1"/"Joueur 1") like all other slots
- **Removed special-casing** of team1Players[0] in NewGameForm (was readonly, locked to "Me")
- **stats_title**: "My Stats"/"Meine Statistik"/"Mes Stats" → "Stats"/"Statistik"/"Stats"
- Updated all affected tests
