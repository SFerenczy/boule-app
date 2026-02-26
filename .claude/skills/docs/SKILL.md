---
name: docs
description: Documentation conventions for agent-friendly files
---

# Working with Docs

Conventions that keep docs agent-friendly — easy to navigate without reading entire files.

## Size Limits

- **~200 lines max** per file
- If a doc grows past this, split into focused files and cross-link
- Agent context is expensive — every unnecessary line costs

## Section Index

Files over ~150 lines with 4+ sections should have a flat section index after the title:

```markdown
# Document Title

- Section One
- Section Two
- Section Three

## Section One

...
```

No line numbers (they go stale). Agents can `Grep` for the heading text.

## When to Split

**Split when:**

- File exceeds ~200 lines
- Sections serve different audiences
- You're adding a section unrelated to the file's title

**Keep together when:**

- Sections are tightly coupled
- Splitting would create files under ~30 lines
- Cross-references would outnumber the content

After splitting, add cross-links in both files.

## Writing for Agents

- **Lead with purpose.** First line after a heading = what the section is for.
- **Use headings liberally.** Agents grep for `^##` to build a mental map.
- **Tables over prose** for reference data.
- **Code blocks over descriptions** for structure and format.
- **No filler.** Cut "In this section we will discuss..." — just discuss it.

## Reading Docs Efficiently (for Agents)

1. Check for a section index (read first ~20 lines)
2. Or `Grep` for `^#{1,3} ` to list all headings with line numbers
3. `Read` with `offset`/`limit` to grab just the section you need

## Checklist

When creating or editing docs:

- [ ] Under ~200 lines? If not, split.
- [ ] Over ~150 lines with 4+ sections? Add a section index.
- [ ] Cross-links to related docs present?
- [ ] Headings are specific and greppable?
- [ ] No orphan docs — reachable from at least one other file?
