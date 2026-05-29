---
title: "AI Model Cards"
status: "current"
date: "2026-05-27"
owner: "gtcx-core"
role: "protocol-architect"
agent_id: "agent://gtcx-core/2026-05-27/session-backfill"
trust_score: 95
autonomy_level: "sovereign"
tier: "critical"
tags: ["documentation", "governance"]
review_cycle: "on-change"
---

# AI Model Cards

Per-AI-model governance documentation for the AI agents that contribute code, reviews, and operational decisions on `gtcx-core`.

| File                         | Model                                    |
| ---------------------------- | ---------------------------------------- |
| [`claude.md`](./claude.md)   | Anthropic Claude (Opus / Sonnet / Haiku) |
| [`codex.md`](./codex.md)     | OpenAI Codex / GPT                       |
| [`copilot.md`](./copilot.md) | GitHub Copilot                           |
| [`cursor.md`](./cursor.md)   | Cursor IDE assistant                     |
| [`gemini.md`](./gemini.md)   | Google Gemini                            |

Each card captures: model identity, capabilities, known limitations, safety boundaries, audit-trail expectations, and the per-model contribution scope (what the model is allowed and not allowed to do on this repo).

**Audience:** AI governance reviewers, security auditors evaluating AI-contribution risk, downstream consumers asking "who/what touched this code path."

Complements [`../../agents/governance/README.md`](../../agents/governance/README.md) (operational agent governance) with model-level identity documentation.
