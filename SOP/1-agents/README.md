# Agent Team — gtcx-core

The agentic team responsible for building and maintaining `gtcx-core`. Human and AI agents operating through `1-agentic` — GTCX's internal AI development platform.

## Governing Standard

This folder is the per-repo expression of `1-agentic` for `gtcx-core`. It defines the roles, safety rules, and task playbooks that are specific to this codebase. The canonical archetype definitions, tooling, and team-wide configuration live in `1-agentic`. `1-agentic` itself runs on Baseline (`ai-1-baseline`), but SOP connects to `1-agentic` — not to Baseline directly.

## Team Roster

| Role                                                                   | Archetype                                       | Owns                                                           |
| ---------------------------------------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------- |
| [Protocol Architect](./roles/protocol-architect.md)                    | `1-agentic/archetypes/protocol-architect`       | ADRs, specs, architecture boundaries, dependency rules         |
| [Cryptographic Security Engineer](./roles/crypto-security-engineer.md) | `1-agentic/archetypes/crypto-security-engineer` | Crypto packages, Rust crates, threat matrix, ZKP circuits      |
| [Frontier Infrastructure Engineer](./roles/frontier-infra-engineer.md) | `1-agentic/archetypes/frontier-infra-engineer`  | Offline sync, network transport, connectivity, edge runtime    |
| [Quality & Evidence Lead](./roles/quality-evidence-lead.md)            | `1-agentic/archetypes/quality-evidence-lead`    | CI gates, API baselines, performance budgets, release evidence |

## Orientation

Any agent or team member entering this repo must read:

1. `SOP/1-agents/orientation.md` — how to orient to this codebase
2. `SOP/1-agents/safety-rules.md` — what requires human approval
3. The role file for the work being performed

## 1-agentic Integration

`SOP/1-agents/` connects to `1-agentic` — GTCX's internal AI development platform. The technical wiring between this repo and `1-agentic` is planned but not yet built. See [`1-agentic-integration.md`](./1-agentic-integration.md) for current state and what needs to be established when that work begins.

## Common Tasks

| Task                          | Playbook                                                             |
| ----------------------------- | -------------------------------------------------------------------- |
| Add a new `@gtcx/*` package   | [tasks/add-package.md](./tasks/add-package.md)                       |
| Write or update an ADR        | [tasks/write-adr.md](./tasks/write-adr.md)                           |
| Investigate a CI gate failure | [tasks/investigate-ci-failure.md](./tasks/investigate-ci-failure.md) |
| Cut a release                 | [tasks/cut-release.md](./tasks/cut-release.md)                       |
| Add a Rust crate              | [tasks/add-rust-crate.md](./tasks/add-rust-crate.md)                 |
