# Agent Team — gtcx-core

The four-role agentic team responsible for `gtcx-core`. All roles are instantiated from `1-agentic/archetypes/` and scoped to this repo.

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

Any agent encountering a decision outside their role scope escalates to the human before proceeding. See [`_sop/1-agents/4-workflows/safety-rules.md`](../4-workflows/safety-rules.md) for the full approval matrix.
