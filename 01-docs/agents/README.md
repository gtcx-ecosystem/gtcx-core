---
title: 'Agent Team — gtcx-core'
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

# Agent Team — gtcx-core

The agentic team responsible for building and maintaining `gtcx-core`. Agents operate through `1-agentic` — GTCX's internal AI development platform, built on Baseline (`ai-1-baseline`).

---

## Team Roster

| Role                                                                 | Archetype                                       | Owns                                                           |
| -------------------------------------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------- |
| [Protocol Architect](roles/protocol-architect.md)                    | `1-agentic/archetypes/protocol-architect`       | ADRs, specs, architecture boundaries, dependency rules         |
| [Cryptographic Security Engineer](roles/crypto-security-engineer.md) | `1-agentic/archetypes/crypto-security-engineer` | Crypto packages, Rust crates, threat matrix, ZKP circuits      |
| [Frontier Infrastructure Engineer](roles/frontier-infra-engineer.md) | `1-agentic/archetypes/frontier-infra-engineer`  | Offline sync, network transport, native bindings, edge runtime |
| [Quality & Evidence Lead](roles/quality-evidence-lead.md)            | `1-agentic/archetypes/quality-evidence-lead`    | CI gates, API baselines, performance budgets, release evidence |

---

## Folder Contents

| Folder                       | Purpose                                                                     |
| ---------------------------- | --------------------------------------------------------------------------- |
| [`onboarding/`](onboarding/) | Session-start orientation, context recovery, `1-agentic` integration status |
| [`roles/`](roles/)           | Role definitions scoped to gtcx-core                                        |
| [`structure/`](structure/)   | Team coordination and decision matrix                                       |
| [`workflows/`](workflows/)   | Safety rules, governance gates, and task playbooks                          |

---

## Orientation

Any agent entering this repo must read in order:

1. [`onboarding/orientation.md`](onboarding/orientation.md) — codebase map and what to read before touching code
2. [`workflows/safety-rules.md`](workflows/safety-rules.md) — what requires human approval
3. The role file for the current work (`roles/`)

For cross-session continuity: [`onboarding/context-recovery.md`](onboarding/context-recovery.md) — memory files, session handoffs, recovery protocol.

---

## Common Tasks

| Task                          | Playbook                                                                                 |
| ----------------------------- | ---------------------------------------------------------------------------------------- |
| Add a new `@gtcx/*` package   | [`workflows/tasks/add-package.md`](workflows/tasks/add-package.md)                       |
| Add a new Rust crate          | [`workflows/tasks/add-rust-crate.md`](workflows/tasks/add-rust-crate.md)                 |
| Write or update an ADR        | [`workflows/tasks/write-adr.md`](workflows/tasks/write-adr.md)                           |
| Investigate a CI gate failure | [`workflows/tasks/investigate-ci-failure.md`](workflows/tasks/investigate-ci-failure.md) |
| Cut a release                 | [`workflows/tasks/cut-release.md`](workflows/tasks/cut-release.md)                       |

---

## 1-agentic Integration

`01-docs/01-agents/` connects to `1-agentic`. Governance is defined and operational; technical wiring is planned. See [`onboarding/agentic-integration.md`](onboarding/agentic-integration.md) for current state.
