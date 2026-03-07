# Agent Coordination — gtcx-core

How the four-role team operates, coordinates, and escalates in this repo.

## Team Structure

```
Protocol Architect          — architecture, specs, ADRs, traceability
Cryptographic Security Eng  — crypto packages, Rust crates, threat model
Frontier Infra Engineer     — sync, network, native bindings, edge
Quality & Evidence Lead     — CI gates, API baselines, release evidence
```

Each role is a Baseline-governed agent identity instantiated from `1-agentic/archetypes/`. The role files in `SOP/1-agents/roles/` define the repo-specific scope and constraints on top of the archetype baseline.

## Decision Matrix

| Decision type             | Owns                        | Reviews                 | Human required                      |
| ------------------------- | --------------------------- | ----------------------- | ----------------------------------- |
| New ADR (propose)         | Protocol Architect          | All roles               | No                                  |
| ADR accepted              | —                           | —                       | Yes                                 |
| Package spec              | Protocol Architect          | Quality & Evidence Lead | No                                  |
| New package               | Protocol Architect          | All roles               | Yes                                 |
| New Rust crate            | Frontier / Crypto (by type) | All roles               | Yes                                 |
| Crypto package change     | Cryptographic Security Eng  | Protocol Architect      | Yes                                 |
| Security threat control   | Cryptographic Security Eng  | —                       | Yes (to modify matrix)              |
| ZKP circuit selection     | Cryptographic Security Eng  | Protocol Architect      | No (to select) / Yes (to implement) |
| API baseline update       | Quality & Evidence Lead     | Protocol Architect      | Yes                                 |
| Performance budget change | Quality & Evidence Lead     | Role owning the package | Yes                                 |
| Release publish           | Quality & Evidence Lead     | All roles               | Yes                                 |
| CI gate bypass            | —                           | —                       | Never                               |

## Coordination Protocols

### For any PR touching a security-sensitive package

1. Cryptographic Security Engineer reviews the diff first
2. Protocol Architect reviews architectural impact
3. Quality & Evidence Lead runs gates
4. Human approval required before merge

Security-sensitive packages: `@gtcx/crypto`, `@gtcx/security`, `@gtcx/verification`, `@gtcx/identity`, `@gtcx/crypto-native`, `rust/gtcx-crypto`, `rust/gtcx-zkp`

### For sprint planning

1. Protocol Architect reviews spec-to-code traceability gaps
2. All roles surface blockers and dependencies for the next sprint
3. Quality & Evidence Lead confirms UAT evidence is current before sprint closes
4. Human approves sprint goals

### For release

See `SOP/1-agents/tasks/cut-release.md`. Quality & Evidence Lead leads; all roles confirm their domain gates pass.

### For incident response

1. Quality & Evidence Lead identifies which gate failed and triages by category
2. Relevant role investigates and owns the fix
3. If security-sensitive: Cryptographic Security Engineer leads, human notified immediately
4. Root cause documented in PR; spec updated if gap was revealed

## Cross-Role Boundaries

### Protocol Architect → Cryptographic Security Engineer

The Protocol Architect does not make algorithm selection decisions. Algorithm choices (Ed25519 vs secp256k1, Groth16 vs Bulletproofs for a given circuit) belong to the Cryptographic Security Engineer. The Protocol Architect designs the interface; the Crypto Security Engineer specifies what is behind it.

### Cryptographic Security Engineer → Frontier Infrastructure Engineer

The Cryptographic Security Engineer does not own the native binding build pipeline — only the security review of what the binding exposes. The Frontier Infrastructure Engineer builds and maintains the pipeline; the Crypto Security Engineer gates the FFI surface.

### Frontier Infrastructure Engineer → Quality & Evidence Lead

The Frontier Infrastructure Engineer is responsible for sync and network performance budgets reaching the budget targets. The Quality & Evidence Lead enforces the gates but does not own the optimization work.

### Quality & Evidence Lead → All Roles

The Quality & Evidence Lead can block any PR by failing a gate. This authority is non-negotiable. No role can override a gate failure by claiming their domain expertise supersedes the gate.

## Escalation

When uncertain: stop. State the action, the uncertainty, and the consequence of getting it wrong. Ask.

The cost of pausing is zero. The cost of an unauthorized change to a cryptographic primitive or a broken downstream dependency is unbounded.

### Immediate escalation triggers

- Any CI gate failure on `main`
- Any security finding in a PR touching crypto packages
- Any API breaking change detected by `pnpm api:check`
- Any performance regression that exceeds budget by more than 10%
- Any request to bypass a hard rule from `SOP/1-agents/safety-rules.md`

## 1-agentic Governance

All agent work in this repo operates through `1-agentic` — GTCX's internal AI development platform. `1-agentic` itself runs on Baseline (`ai-1-baseline`), but the connection point for this repo is `1-agentic`, not Baseline directly.

`SOP/1-agents/` is the per-repo expression of `1-agentic`: roles, safety rules, task playbooks, and orientation protocol instantiated for the specific demands of `gtcx-core`. Canonical archetype definitions live in `1-agentic` and are extended here.

Changes to `SOP/1-agents/` files are autonomous for documentation and orientation updates. Changes to safety rules require human review.
