# Roadmap

Guiding principle: **local-first, no backend until proven necessary.** The app is used on boule fields with spotty connectivity. Every phase should work offline. A backend (Rust/Axum) only enters the picture when social features demand it.

---

## Phase 1: Foundation

Tech stack decisions, project scaffold, CI/CD pipeline, precommit checks.

**Deliverables:**

- SvelteKit + TypeScript + adapter-static scaffold
- PWA setup (service worker, manifest, offline support)
- IndexedDB for local persistence (via a typed wrapper)
- Build, lint, format, test gates (`just check`)
- CI pipeline (lint + test on push)
- Deploy to GitHub Pages

**Key tickets:** 001 (tech stack decisions), then scaffold tickets

---

## Phase 2: Game Tracker MVP

Replace boule-zaehler with a proper game model. This is the "your dad uses it" milestone.

**Deliverables:**

- Game creation (two teams, player names optional)
- Live scoring: Legen + Schießen success/fail counters per team (the 8-counter model from boule-zaehler)
- Live percentage display per category per team
- Game completion + save to IndexedDB
- Mobile-optimized UI — big touch targets, outdoor-readable contrast

**Dependencies:** Phase 1 complete

**Non-goals for this phase:** round/mene tracking, player profiles, history browsing. Just the counter + persistence.

---

## Phase 3: Game History & Stats

Track games over time. See how you develop.

**Deliverables:**

- Match history list (date, teams, result, stats)
- Per-player stats across games (win rate, Legen/Schießen percentages, trends)
- Simple player profiles (name, games played, stats)
- Trend visualization (improving/declining over time)

**Dependencies:** Phase 2 complete

---

## Phase 4: Polish & PWA Hardening

Make it feel like a native app. Still no backend.

**Deliverables:**

- Full offline support (all features work without connectivity)
- Add to Home Screen experience (icon, splash, full-screen)
- Data export/import (JSON — backup + transfer between devices)
- UI polish, animations, accessibility
- Dark/light mode (outdoor readability matters)

**Dependencies:** Phase 2 complete (can run parallel to Phase 3)

---

## Phase 5: Social (Backend Required)

Only pursued if adoption validates the need. This is where Rust enters.

**Deliverables:**

- Backend: Rust/Axum API server
- User accounts + auth
- Cross-device sync (local-first with server sync)
- Share game results / leaderboards
- Group/club features (play with friends, celebrate wins)

**Dependencies:** Phases 3 + 4 complete, validated user demand

**Open questions:**

- Auth strategy (OAuth? magic link? keep it simple)
- Sync protocol (CRDTs? last-write-wins? depends on data model complexity)
- Hosting (existing Hetzner VPS, or something lighter?)
