---
name: project
description: Understand the Boule App project structure and current state
---

# Project Overview

A boule/petanque companion app for tracking games, player stats, and match history. Mobile-first, designed for outdoor use during games.

**Origin:** Evolved from [boule-zaehler](../../boule-zaehler/), a single-file HTML score counter with 8 counters (Legen/Schießen success/fail per team, showing percentages).

**Architecture direction:** Local-first PWA. No backend until social features prove necessary (Phase 5). See [roadmap](../../.project/roadmap.md).

## Planned Stack

| Layer    | Choice                                | Status   |
| -------- | ------------------------------------- | -------- |
| Frontend | SvelteKit + adapter-static, Svelte 5  | Decided  |
| Language | TypeScript (strict)                   | Decided  |
| Data     | Dexie.js over IndexedDB (local-first) | Decided  |
| Styling  | Tailwind CSS v4 + Skeleton UI         | Decided  |
| PWA      | Service worker + manifest             | Decided  |
| Deploy   | GitHub Pages                          | Decided  |
| Tooling  | just, GitHub Actions, prettier+eslint | Decided  |
| Backend  | Rust/Axum (Phase 5 only, if needed)   | Deferred |

## Directory Structure

```
boule-app/
├── CLAUDE.md              # Project entry point
├── AGENTS.md              # Symlink → CLAUDE.md
├── .project/
│   ├── roadmap.md         # 5-phase product roadmap
│   ├── decisions.md       # Architectural decisions log
│   ├── backlog/           # Pending tickets
│   ├── done/              # Completed tickets
│   └── systems/           # Component state docs
└── .claude/skills/        # Agent skills (you are here)
```

Component directories (e.g. `src/`) will appear once the scaffold ticket is completed. Each significant component gets its own `CLAUDE.md`.

## How to Work on This Project

1. **Check tickets:** `ls .project/backlog/`
2. **Understand the system:** Read relevant `.project/systems/` files
3. **Check decisions:** Read `.project/decisions.md` for past choices
4. **Check the roadmap:** Read `.project/roadmap.md` for the bigger picture
5. **Follow conventions:** See `CLAUDE.md` (root + component-level) for standards
6. **Complete work:** Run `/finalize-ticket` when done

## Related Skills

- `/tickets` — how to use the ticket system
- `/finalize-ticket` — cleanup after completing a ticket
- `/docs` — documentation conventions
