# Agent Roles — gtcx-core

The four AI agent roles authorized to work in this repo. Each role has a defined scope of authority, decision standards, escalation triggers, and coordination interfaces.

---

## Role Files

| File                                                         | Role                             | Primary Domain                                                                 |
| ------------------------------------------------------------ | -------------------------------- | ------------------------------------------------------------------------------ |
| [`protocol-architect.md`](protocol-architect.md)             | Protocol Architect               | Package dependency graph, ADRs, API surface, cross-package contracts           |
| [`crypto-security-engineer.md`](crypto-security-engineer.md) | Cryptographic Security Engineer  | Security-sensitive packages, cryptographic stack, threat model                 |
| [`frontier-infra-engineer.md`](frontier-infra-engineer.md)   | Frontier Infrastructure Engineer | Network, sync, edge, operational SLOs for field environments                   |
| [`quality-evidence-lead.md`](quality-evidence-lead.md)       | Quality & Evidence Lead          | CI gate sequence, API surface baseline, performance budgets, release checklist |

---

## Role Assignment

Roles are assigned per task, not per session. A single agent session may act in multiple roles sequentially. Role boundaries are enforced by the decision standards in each role file — not by tooling.

If a task spans role boundaries (e.g. a change to `@gtcx/crypto` that also triggers a CI gate failure), the agent must satisfy the decision standards of each affected role before proceeding.

---

## Reference

- [`../1-onboarding/orientation.md`](../1-onboarding/orientation.md) — session-start reading order
- [`../4-workflows/safety-rules.md`](../4-workflows/safety-rules.md) — what requires human approval
- [`../3-structure/coordination.md`](../3-structure/coordination.md) — cross-role coordination protocols
