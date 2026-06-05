---
title: 'Agent Team — gtcx-core'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'standard'
tags: ['documentation', 'agents']
review_cycle: 'on-change'
---

---

title: 'Tech Team'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs', 'agentic']
review_cycle: 'on-change'

---

# Agent Team — gtcx-core

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

The four-role agentic team responsible for `gtcx-core`. All roles are instantiated from `1-agentic/archetypes/` and scoped to this repo.

**Last reviewed:** 2026-05-06

---

## Team Roster

| Role                             | Archetype                  | Primary Owned Packages                                                                                        |
| -------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Protocol Architect               | `protocol-architect`       | Architecture, ADRs, dependency graph, spec-to-code traceability                                               |
| Cryptographic Security Engineer  | `crypto-security-engineer` | `@gtcx/crypto`, `@gtcx/security`, `@gtcx/verification`, `rust/gtcx-crypto`, `rust/gtcx-zkp`                   |
| Frontier Infrastructure Engineer | `frontier-infra-engineer`  | `@gtcx/sync`, `@gtcx/network`, `@gtcx/crypto-native`, `rust/gtcx-node`, `rust/gtcx-network`, `rust/gtcx-edge` |
| Quality & Evidence Lead          | `quality-evidence-lead`    | CI gates, API baselines, performance budgets, release evidence                                                |

---

## Responsibility Boundaries

| Package / Area                         | Protocol Architect | Crypto Security Eng | Frontier Infra Eng | Quality & Evidence Lead |
| -------------------------------------- | :----------------: | :-----------------: | :----------------: | :---------------------: |
| ADRs and architecture decisions        |       Owner        |                     |                    |                         |
| `@gtcx/crypto`, `@gtcx/security`       |                    |        Owner        |                    |                         |
| `@gtcx/verification`, `@gtcx/identity` |                    |        Owner        |                    |                         |
| `rust/gtcx-crypto`, `rust/gtcx-zkp`    |                    |        Owner        |                    |                         |
| `@gtcx/sync`, `@gtcx/network`          |                    |                     |       Owner        |                         |
| `rust/gtcx-node`, `rust/gtcx-edge`     |                    |                     |       Owner        |                         |
| `@gtcx/crypto-native`                  |                    |                     |       Owner        |                         |
| CI gates and quality runbook           |                    |                     |                    |          Owner          |
| API surface baseline                   |                    |                     |                    |          Owner          |
| Performance budgets                    |                    |                     |                    |          Owner          |
| Release signoff                        |                    |                     |                    |          Owner          |
| Package boundary enforcement           |       Owner        |                     |                    |        Runs gate        |
| Security-sensitive PR review           |                    |      Required       |                    |                         |
| New package or crate                   |      Approves      | If crypto-sensitive |                    |          Gates          |

---

## Escalation

Any agent encountering a decision outside their role scope escalates to the human before proceeding. See [`../workflows/safety-rules.md`](../workflows/safety-rules.md) for the full approval matrix.
