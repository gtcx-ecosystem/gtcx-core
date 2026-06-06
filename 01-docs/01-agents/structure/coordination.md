---
title: 'Agent Coordination — gtcx-core'
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

title: 'Coordination'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs', 'agentic']
review_cycle: 'on-change'

---

# Agent Coordination — gtcx-core

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

How the four-role agent team operates, coordinates, and escalates in this repo.

**Last reviewed:** 2026-05-06

---

## Team Structure

```
Protocol Architect          — architecture, specs, ADRs, dependency graph
Cryptographic Security Eng  — crypto packages, Rust crates, threat model
Frontier Infra Engineer     — sync, network, native bindings, edge runtime
Quality & Evidence Lead     — CI gates, API baselines, performance budgets, release
```

Each role is a Baseline-governed agent identity instantiated from `1-agentic/archetypes/`. The role files in `01-docs/01-agents/roles/` define the repo-specific scope and constraints on top of the archetype baseline.

---

## Decision Matrix

| Decision type             | Owns                        | Reviews                 | Human required                |
| ------------------------- | --------------------------- | ----------------------- | ----------------------------- |
| New ADR (propose)         | Protocol Architect          | All roles               | No                            |
| ADR accepted              | —                           | —                       | Yes                           |
| Package spec              | Protocol Architect          | Quality & Evidence Lead | No                            |
| New package               | Protocol Architect          | All roles               | Yes                           |
| New Rust crate            | Frontier / Crypto (by type) | All roles               | Yes                           |
| Crypto package change     | Cryptographic Security Eng  | Protocol Architect      | Yes                           |
| Security threat control   | Cryptographic Security Eng  | —                       | Yes (to modify matrix)        |
| ZKP circuit selection     | Cryptographic Security Eng  | Protocol Architect      | No (select) / Yes (implement) |
| API baseline update       | Quality & Evidence Lead     | Protocol Architect      | Yes                           |
| Performance budget change | Quality & Evidence Lead     | Role owning the package | Yes                           |
| Release publish           | Quality & Evidence Lead     | All roles               | Yes                           |
| CI gate bypass            | —                           | —                       | Never                         |

---

## Coordination Protocols

### Security-sensitive package change

1. Cryptographic Security Engineer reviews the diff first
2. Protocol Architect reviews architectural impact
3. Quality & Evidence Lead runs all 9 CI gates
4. Human approval required before merge

Security-sensitive packages: `@gtcx/crypto`, `@gtcx/security`, `@gtcx/verification`, `@gtcx/identity`, `@gtcx/crypto-native`, `rust/gtcx-crypto`, `rust/gtcx-zkp`

---

### Sprint planning

1. Protocol Architect reviews spec-to-code traceability gaps
2. All roles surface blockers and cross-package dependencies
3. Quality & Evidence Lead confirms UAT evidence is current before sprint closes
4. Human approves sprint goals

---

### Release

See `01-docs/01-agents/workflows/tasks/cut-release.md`. Quality & Evidence Lead leads; all roles confirm their domain gates pass before release is cut.

---

### Incident response

1. Quality & Evidence Lead identifies which CI gate failed and triages by category
2. The role that owns the affected package investigates and owns the fix
3. If security-sensitive: Cryptographic Security Engineer leads, human notified immediately
4. Root cause documented in the PR; spec updated if the incident revealed a gap

---

## Cross-Role Boundaries

### Protocol Architect → Cryptographic Security Engineer

The Protocol Architect designs interfaces; the Cryptographic Security Engineer specifies what is behind them. Algorithm selection (Ed25519 vs secp256k1, Groth16 vs Bulletproofs) belongs to the Cryptographic Security Engineer — not the Protocol Architect.

---

### Cryptographic Security Engineer → Frontier Infrastructure Engineer

The Cryptographic Security Engineer does not own the native binding build pipeline — only the security review of what the binding exposes. The Frontier Infrastructure Engineer builds and maintains the pipeline; the Cryptographic Security Engineer gates the FFI surface.

---

### Frontier Infrastructure Engineer → Quality & Evidence Lead

The Frontier Infrastructure Engineer is responsible for sync and network performance reaching budget targets. The Quality & Evidence Lead enforces the gates but does not own the optimization work.

---

### Quality & Evidence Lead → All Roles

The Quality & Evidence Lead can block any PR by failing a gate. This authority is non-negotiable. No role can override a gate failure by claiming domain expertise supersedes the gate.

---

## Escalation

When uncertain: stop. State the action, the uncertainty, and the consequence of getting it wrong. Ask.

The cost of pausing is zero. The cost of an unauthorized change to a cryptographic primitive or a broken downstream dependency is unbounded.

### Immediate escalation triggers

- Any CI gate failure on `main`
- Any security finding in a PR touching a crypto package
- Any API breaking change detected by `pnpm api:check`
- Any performance regression exceeding budget by more than 10%
- Any request to bypass a hard rule from `01-docs/01-agents/workflows/safety-rules.md`

---

## 1-agentic Governance

All agent work in this repo operates through `1-agentic` — GTCX's internal AI development platform. `1-agentic` runs on Baseline (`ai-1-baseline`), but this repo's connection point is `1-agentic`, not Baseline directly.

`01-docs/01-agents/` is the per-repo expression of `1-agentic` for `gtcx-core`: roles, safety rules, task playbooks, and orientation protocol scoped to this codebase. Canonical archetype definitions live in `1-agentic` and are extended here.

Changes to `01-docs/01-agents/` files are autonomous for documentation and orientation updates. Changes to safety rules require human review.

---

## Reference

- [`../roles/protocol-architect.md`](../roles/protocol-architect.md) — Protocol Architect role
- [`../roles/crypto-security-engineer.md`](../roles/crypto-security-engineer.md) — Cryptographic Security Engineer role
- [`../roles/frontier-infra-engineer.md`](../roles/frontier-infra-engineer.md) — Frontier Infrastructure Engineer role
- [`../roles/quality-evidence-lead.md`](../roles/quality-evidence-lead.md) — Quality & Evidence Lead role
- [`../workflows/safety-rules.md`](../workflows/safety-rules.md) — safety rules and hard escalation triggers
- [`../workflows/tasks/cut-release.md`](../workflows/tasks/cut-release.md) — release coordination workflow
- `1-agentic` — GTCX internal AI development platform
