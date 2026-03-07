# Agent Team — gtcx-core

The agentic team responsible for building and maintaining `gtcx-core`. Agents operate through `1-agentic` — GTCX's internal AI development platform, built on Baseline (`ai-1-baseline`).

---

## Team Roster

| Role                                                                   | Archetype                                       | Owns                                                           |
| ---------------------------------------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------- |
| [Protocol Architect](2-roles/protocol-architect.md)                    | `1-agentic/archetypes/protocol-architect`       | ADRs, specs, architecture boundaries, dependency rules         |
| [Cryptographic Security Engineer](2-roles/crypto-security-engineer.md) | `1-agentic/archetypes/crypto-security-engineer` | Crypto packages, Rust crates, threat matrix, ZKP circuits      |
| [Frontier Infrastructure Engineer](2-roles/frontier-infra-engineer.md) | `1-agentic/archetypes/frontier-infra-engineer`  | Offline sync, network transport, native bindings, edge runtime |
| [Quality & Evidence Lead](2-roles/quality-evidence-lead.md)            | `1-agentic/archetypes/quality-evidence-lead`    | CI gates, API baselines, performance budgets, release evidence |

---

## Folder Contents

| Folder                           | Purpose                                                                     |
| -------------------------------- | --------------------------------------------------------------------------- |
| [`1-onboarding/`](1-onboarding/) | Session-start orientation, context recovery, `1-agentic` integration status |
| [`2-roles/`](2-roles/)           | Role definitions scoped to gtcx-core                                        |
| [`3-structure/`](3-structure/)   | Team coordination and decision matrix                                       |
| [`4-workflows/`](4-workflows/)   | Safety rules and task playbooks                                             |
| [`5-governance/`](5-governance/) | 1-agentic governance model for this repo                                    |

---

## Orientation

Any agent entering this repo must read in order:

1. [`1-onboarding/orientation.md`](1-onboarding/orientation.md) — codebase map and what to read before touching code
2. [`4-workflows/safety-rules.md`](4-workflows/safety-rules.md) — what requires human approval
3. The role file for the current work (`2-roles/`)

For cross-session continuity: [`1-onboarding/context-recovery.md`](1-onboarding/context-recovery.md) — memory files, session handoffs, recovery protocol.

---

## Common Tasks

| Task                          | Playbook                                                                                     |
| ----------------------------- | -------------------------------------------------------------------------------------------- |
| Add a new `@gtcx/*` package   | [`4-workflows/tasks/add-package.md`](4-workflows/tasks/add-package.md)                       |
| Add a new Rust crate          | [`4-workflows/tasks/add-rust-crate.md`](4-workflows/tasks/add-rust-crate.md)                 |
| Write or update an ADR        | [`4-workflows/tasks/write-adr.md`](4-workflows/tasks/write-adr.md)                           |
| Investigate a CI gate failure | [`4-workflows/tasks/investigate-ci-failure.md`](4-workflows/tasks/investigate-ci-failure.md) |
| Cut a release                 | [`4-workflows/tasks/cut-release.md`](4-workflows/tasks/cut-release.md)                       |

---

## 1-agentic Integration

`_sop/1-agents/` connects to `1-agentic`. Governance is defined and operational; technical wiring is planned. See [`1-onboarding/1-agentic-integration.md`](1-onboarding/1-agentic-integration.md) for current state.
