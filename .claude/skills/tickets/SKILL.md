---
name: tickets
description: Understand how to work with project tickets and the ticket workflow
---

# Ticket System

Tickets are small, focused work items stored as markdown files in `.project/`.

```
.project/
├── backlog/           # Work to do
├── done/              # Completed work
├── systems/           # Component state (not tickets)
├── roadmap.md         # Product roadmap
└── decisions.md       # Architectural decisions log
```

## Finding Work

1. `ls .project/backlog/`
2. Read a ticket to understand the task
3. Check priority and dependencies

## Starting Work

1. Read the full ticket
2. Check dependencies (other tickets that must complete first)
3. Understand acceptance criteria
4. Start working

## Completing Work

1. Verify all acceptance criteria are met
2. Run `/finalize-ticket` for cleanup (derived tickets, system updates, cross-links)
3. Add completion date: `**Completed:** YYYY-MM-DD`
4. Move: `mv .project/backlog/NNN-name.md .project/done/`
5. Commit with ticket reference: `[NNN] Description`

## Creating Tickets

Naming: `NNN-short-name.md` (next sequential number).

```markdown
# Ticket: Short Descriptive Title

## Priority

High / Medium / Low

## Goal

One sentence describing the outcome.

## Context

Why this matters, background info.

## Tasks

- [ ] Specific task 1
- [ ] Specific task 2

## Acceptance

- Criteria that must be true when done

## Dependencies

- Ticket NNN must be done first (if any)

## Notes

Any other relevant info.
```

## Decision Tickets

Some tickets result in architectural decisions rather than code:

1. Document the decision in `.project/decisions.md` (format: DEC-NNN)
2. Update any tickets or system docs that reference the open question
3. The ticket's resolution should reference the DEC number

## Tickets vs Systems vs Decisions

| Tickets                     | Systems                        | Decisions                 |
| --------------------------- | ------------------------------ | ------------------------- |
| Discrete work items         | Component definitions          | Architectural choices     |
| Move to done/ when complete | Stay in systems/, get updated  | Permanent record          |
| Focus on "what to do"       | Focus on "what exists + ideas" | Focus on "why we chose X" |
