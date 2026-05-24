# Agent Session Handoffs

Cross-agent handoff records for multi-agent collaboration on `gtcx-core`. When one agent (Claude, Kimi, Gemini, Codex, Cursor, Aider) finishes a session and another picks up, the outgoing agent writes a handoff doc here so context survives the boundary.

| File                                | Purpose                                                           |
| ----------------------------------- | ----------------------------------------------------------------- |
| [`index.md`](./index.md)            | Index of all handoffs by date; entry point for any incoming agent |
| `YYYY-MM-DD-handoff-<from>-<to>.md` | Dated handoff records (one per cross-agent transition)            |

**Audience:** any agent (human or AI) picking up work on `gtcx-core`. Read `index.md` first, then the most recent handoff for your incoming context.

This directory is `intentionallyNotExcluded` from frontmatter checks per `tools/check-doc-frontmatter.mjs` — handoff files use a simpler header convention rather than the full Protocol 1 v2.0 frontmatter schema.
