# Sessions — gtcx-core

Work session notes, decision logs, and handoff context for `gtcx-core`.

## Structure

| Folder         | Contents                                                |
| -------------- | ------------------------------------------------------- |
| `transcripts/` | Raw session transcripts (auto-generated)                |
| `insights/`    | Session insights, new ideas, flags surfaced during work |
| `handoffs/`    | Session handoff notes for continuity across sessions    |

## Naming Convention

```
transcripts/YYYY-MM-DD-{topic}.md
insights/YYYY-MM-DD-{topic}.md
handoffs/YYYY-MM-DD-handoff.md
```

## What Belongs Here

- Notes from a specific working session
- Decisions made that are too small to warrant an ADR
- Context needed to resume work at the next session
- Flags or questions surfaced that require follow-up

## What Does Not Belong Here

- Architectural decisions with broad impact → [`../2-docs/1-architecture/decisions/`](../2-docs/1-architecture/decisions/)
- Sprint planning → [`../3-agile/`](../3-agile/)
