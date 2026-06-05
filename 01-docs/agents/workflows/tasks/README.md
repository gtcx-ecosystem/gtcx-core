---
title: 'Agent Tasks'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 95
autonomy_level: 'sovereign'
tier: 'critical'
tags: ['documentation', 'agents']
review_cycle: 'on-change'
---

# Agent Tasks

Step-by-step runbooks for the most common agentic work in `gtcx-core`.

## Tasks

| File                                                   | When to use                                              |
| ------------------------------------------------------ | -------------------------------------------------------- |
| [add-package.md](add-package.md)                       | Adding a new `@gtcx/*` TypeScript package                |
| [add-rust-crate.md](add-rust-crate.md)                 | Adding a new `gtcx-*` Rust crate                         |
| [cut-release.md](cut-release.md)                       | Cutting a release via Changesets and publishing to npm   |
| [investigate-ci-failure.md](investigate-ci-failure.md) | Diagnosing and resolving a CI gate failure               |
| [write-adr.md](write-adr.md)                           | Authoring and publishing an Architecture Decision Record |

All tasks operate within the role boundaries defined in `01-docs/01-agents/workflows/safety-rules.md`.
