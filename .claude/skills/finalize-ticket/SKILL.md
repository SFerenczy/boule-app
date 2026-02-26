---
name: finalize-ticket
description: Clean up after completing a ticket - derived tickets, doc updates, cross-links
---

# Finalize Ticket

Run after completing a ticket's main work to ensure proper cleanup.

## Checklist

### 1. Update the Completed Ticket

- [ ] Mark all tasks as `[x]` complete
- [ ] Add a `## Resolution` section:

```markdown
## Resolution

**Completed:** YYYY-MM-DD

### Decisions Made

- Decision 1: rationale

### Artifacts Created

- `path/to/file` - Description
```

- [ ] Move to `.project/done/`

### 2. Update Decisions Log (if applicable)

- [ ] Add DEC-NNN entry to `.project/decisions.md`
- [ ] Cross-reference ticket number and DEC number

### 3. Identify Derived Tickets

Ask: "What new work did this ticket reveal?"

| Completed ticket type | Often creates                   |
| --------------------- | ------------------------------- |
| Decision ticket       | Implementation ticket(s)        |
| Design/spec           | Implementation ticket(s)        |
| Implementation        | Testing, documentation tickets  |
| Any                   | Refactoring ideas, enhancements |

Create new tickets in `.project/backlog/` with next sequential number.

### 4. Update Related Documentation

- Update system files in `.project/systems/` if component state changed
- Update State emoji if appropriate (🔴→🟡→🟢)
- Cross-link related docs

### 5. Update Dependent Tickets

Check if other backlog tickets:

- Were blocked by this ticket (now unblocked)
- Reference outdated information
- Have tasks that are now complete
