---
title: 'Architecture Docs'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 95
autonomy_level: 'sovereign'
tier: 'critical'
tags: ['documentation', 'architecture']
review_cycle: 'on-change'
---

# Architecture Docs

Canonical architecture documentation for `gtcx-core`.

## Current Docs

| File                                                           | Description                                                                      |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| [overview.md](overview.md)                                     | Canonical high-level layer map, trust boundaries, and dependency direction       |
| [backend-architecture.md](backend-architecture.md)             | Concrete package/crate architecture, workspace layering, build/test model        |
| [api-stability.md](api-stability.md)                           | Public API stability policy and baseline enforcement                             |
| [api-patterns.md](api-patterns.md)                             | API design and contract patterns used across the workspace                       |
| [architecture-docs-protocol.md](architecture-docs-protocol.md) | Rules for keeping architecture docs current                                      |
| (removed)                                                      | Documentation structure standard — archived as unfilled template                 |
| [system-architecture-spec.md](system-architecture-spec.md)     | Formal security-oriented architecture spec template for future system-level work |
| [structural-debt.md](structural-debt.md)                       | Tracked structural debt for the `docs/` tree — deferred consolidation plan       |

## Notes

- `gtcx-core` is a library monorepo, not a deployed backend service.
- Some files in this folder are templates or standards; the live repo architecture is described by [overview.md](overview.md) and [backend-architecture.md](backend-architecture.md).
