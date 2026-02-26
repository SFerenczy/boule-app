# Boule App

A boule/petanque companion app. Mobile-first, designed for outdoor use during games.

Evolved from [boule-zaehler](../boule-zaehler/), a single-file HTML score counter with 8 counters (success/fail for Legen and Schießen per team). The app extends this into persistent game tracking, player stats, and match history — while keeping the core experience simple enough for your dad to use on a field.

## For Agents: Start Here

1. **Read this file** — project philosophy and conventions
2. **Load `/project`** — understand the current state and architecture
3. **Load `/tickets`** — find and complete work from `.project/backlog/`

This file is kept short. It links to focused docs — follow the links, don't expect everything here.

## Project Structure

```
boule-app/
├── CLAUDE.md              # You are here
├── AGENTS.md              # Symlink → CLAUDE.md
├── .project/              # Tickets, roadmap, decisions
│   ├── backlog/           # Pending work
│   ├── done/              # Completed work
│   ├── systems/           # Component state docs
│   ├── roadmap.md         # Product roadmap
│   └── decisions.md       # Architectural decisions log
└── .claude/skills/        # Agent skills
```

Component directories get their own `CLAUDE.md` as they're created (e.g. `frontend/CLAUDE.md`, `backend/CLAUDE.md`). Those files own the conventions for their domain.

## Philosophy

### User-First UX

The primary user is someone mid-game on a boule field — possibly older, not particularly tech-savvy, standing in sunlight with dirty hands. Every UX decision flows from this:

- **Big touch targets.** Buttons must be large and easy to hit without precision. Minimum 48px, prefer larger for primary actions.
- **No fiddly interactions.** No small toggles, no drag-and-drop, no long-press menus. Tap and done.
- **Obvious flow.** The user should never wonder "what do I tap next?" Every screen has one clear primary action.
- **Fast in, fast out.** Starting a game or logging a score should take seconds, not minutes. Minimize setup steps, maximize defaults.
- **Readability outdoors.** Large text, high contrast, no thin fonts. Designed for sunlight on a phone screen.
- **Forgiving.** Easy to undo, hard to break. Accidental taps shouldn't cause data loss.

If a feature makes the app harder to use for a 60-year-old on a field, it's wrong — no matter how clever it is.

### AI-First Development

This project is built _by_ agents, _for_ agents. Every convention exists to make the agent feedback loop tight and reliable.

- **Tight loops.** Every commit must pass checks. If there's no precommit gate, create one before writing features. `just check` (or equivalent) must exist and must be fast.
- **Strict contracts.** Types are the spec. If the compiler/linter accepts it, it should be correct. Maximize what the type system can enforce.
- **No ambiguity.** Specs before code. When an agent picks up a ticket, the expected behavior should be unambiguous from the ticket + specs alone.
- **Small files.** Agent context is expensive. Docs under ~200 lines. Source files should have a single clear responsibility. Split and cross-link aggressively.

### DevOps Mindset

Ship fast, recover fast, fear nothing.

- **Git is the safety net.** Commit often, branch cheaply, revert freely. Every meaningful state should be a commit. Broken code on a feature branch is fine — broken code on `main` is not.
- **Automate everything repeatable.** If you do it twice, script it. CI, formatting, linting, deploys — no manual steps.
- **Environments are disposable.** Setup from zero should be one command. `just setup` or equivalent. Document any external dependencies.
- **Fail forward.** Prefer shipping an imperfect fix now over a perfect fix later. The next commit is seconds away.

### Strongly Typed, Strictly Linted

- **Preferred languages:** Rust, TypeScript, Go. Pick the right tool for the component.
- **Zero warnings policy.** Warnings are errors in CI. No `#[allow]`, no `// @ts-ignore`, no `//nolint` without a ticket number justifying it.
- **Format on save.** Formatting is not a review concern — it's automated. Use the language's canonical formatter (`rustfmt`, `prettier`, `gofmt`).
- **Lint rules are project law.** Don't disable rules to make code compile. Fix the code.

## Agentic SDLC

Every non-trivial feature follows this pipeline:

```
ticket → specs → plan → implement → finalize
```

| Artifact     | Purpose                    | Detail                                                            |
| ------------ | -------------------------- | ----------------------------------------------------------------- |
| **Ticket**   | _What_ and _why_ (product) | Goal, context, tasks, acceptance criteria                         |
| **Specs**    | _Exact contracts_ (design) | Schemas, API shapes, error cases, edge cases                      |
| **Plan**     | _Execution order_ (impl)   | Files to touch, sequence, how to break into commits               |
| **Code**     | _Delivery_                 | Production-quality. No stubs, no TODOs, no "fix later"            |
| **Finalize** | _Cleanup_                  | Derived tickets, doc updates, cross-links. Run `/finalize-ticket` |

See [tickets skill](.claude/skills/tickets/SKILL.md) for the full workflow.

## Coding Standards

Standards that apply regardless of language or component.

### Code Quality

- **Production-quality from the start.** Agent labour is cheap; confusion from half-done code is not. Write it as if it's the final version.
- **No dead code.** Don't comment out code "for later". Git has history.
- **Error handling at boundaries.** Validate at system edges (user input, external APIs, file I/O). Trust internal code.
- **Tests prove behavior.** Tests are documentation. They describe what the system does, not how it's implemented. Prefer integration tests over unit tests when the boundary is clear.

### Documentation

- **Docs live next to code.** Component-level `CLAUDE.md` files, not a top-level `docs/` dump.
- **~200 lines max per file.** If it's longer, split and cross-link.
- **Tables over prose** for reference data. **Code blocks over descriptions** for structure.
- **No filler.** Cut "In this section we will discuss..." — just discuss it.
- See [docs skill](.claude/skills/docs/SKILL.md) for formatting conventions.

### Git Conventions

- Commit messages reference ticket numbers when applicable: `[003] Add player model`
- One logical change per commit
- Feature branches for non-trivial work, squash-merge to `main`
- **Run `just check` before every commit.** It runs format-check, lint, typecheck, and tests.

## Skills Available

| Skill              | When to use                                                       |
| ------------------ | ----------------------------------------------------------------- |
| `/project`         | Start of session — understand current state                       |
| `/tickets`         | Before picking up, creating, or modifying tickets                 |
| `/finalize-ticket` | After completing a ticket — cleanup, derived tickets, doc updates |
| `/docs`            | Before creating or editing documentation files                    |
| `/design-system`   | Before writing any UI — presets, colors, how to extend the system |

## Quick Reference

| Resource                            | Purpose                                         |
| ----------------------------------- | ----------------------------------------------- |
| `.project/backlog/`                 | Pending tickets                                 |
| `.project/done/`                    | Completed tickets                               |
| `.project/systems/`                 | Component state + improvement ideas             |
| `.project/roadmap.md`               | Product roadmap                                 |
| `.project/decisions.md`             | Architectural decisions log                     |
| `DESIGN.md`                         | UI enforcement — lint rules, types, screenshots |
| `.project/systems/design-system.md` | Visual spec — colors, spacing, components       |
