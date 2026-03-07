# Safety Rules — gtcx-core

What agents and contributors may do autonomously vs. what requires explicit human authorization.

Governed by the Baseline Protocol (`ai-1-baseline`) and enforced through `1-agentic`. These rules apply to all AI-assisted work in this repo.

---

## Autonomous — No Approval Required

- Read any file in the repo
- Run any quality gate (`pnpm lint`, `pnpm test`, `pnpm build`, `pnpm architecture:check`, etc.)
- Write or update documentation in `_sop/`
- Write new tests for existing behavior
- Fix failing tests where the fix is clearly scoped to the failing case
- Update package docs in `_sop/2-docs/5-specs/4-backend/packages/`
- Propose ADRs — status must remain `Proposed`; human approval required before `Accepted`
- Commit completed work using conventional commit format — commit after each meaningful, self-contained unit of work; never accumulate multiple tasks into a single commit

---

## Requires Human Approval Before Proceeding

| Action                                                                                                                    | Reason                                      |
| ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| Any change to `@gtcx/crypto`, `@gtcx/security`, `@gtcx/verification`, `@gtcx/identity`                                    | Security-sensitive packages                 |
| Any change to `@gtcx/crypto-native`                                                                                       | Native binding surface                      |
| Any change to a Rust crate (`rust/gtcx-crypto`, `rust/gtcx-zkp`, `rust/gtcx-node`, `rust/gtcx-network`, `rust/gtcx-edge`) | Cryptographic and infrastructure primitives |
| Adding any new `@gtcx/*` package or Rust crate                                                                            | Changes workspace configuration             |
| Any change to `pnpm-workspace.yaml`, `turbo.json`, or root `package.json`                                                 | Build system integrity                      |
| Any change to `.github/workflows/`                                                                                        | CI/CD pipeline                              |
| Any change to `tools/check-package-boundaries.mjs`                                                                        | Architecture enforcement gate               |
| Any change to `quality/api-surface-baseline.json`                                                                         | Published API contract                      |
| Any change to `benchmarks/performance-budgets.json`                                                                       | Performance contract                        |
| Marking an ADR status `Accepted`                                                                                          | Architectural decision finalization         |
| Running `pnpm api:update-baseline`                                                                                        | API contract update                         |
| Any destructive git operation                                                                                             | Irreversible                                |
| Publishing a release to the package registry                                                                              | Downstream impact on every GTCX repo        |

---

## Never — Hard Rules

These rules have no exceptions. There is no circumstance where these actions are permitted:

- Never skip CI gates — no `--no-verify`, no bypassing hooks
- Never push to `main` without explicit instruction
- Never force push
- Never commit `.env` files or secrets
- Never implement custom cryptographic primitives
- Never remove or downgrade a security control
- Never mark a release checklist item complete without running the actual gate
- Never modify the threat control matrix without Cryptographic Security Engineer review
- Never run `pnpm api:update-baseline` without human approval

---

## Escalation

If uncertain whether an action requires approval: stop. State the action, the uncertainty, and the consequence of getting it wrong. Ask.

The cost of pausing is zero. The cost of an unauthorized change to a cryptographic primitive or a broken downstream dependency is unbounded.

---

## Reference

- [`_sop/1-agents/3-structure/coordination.md`](../3-structure/coordination.md) — decision matrix and coordination protocols
- [`_sop/1-agents/4-workflows/tasks/`](./tasks/) — task playbooks for common operations
- [`_sop/2-docs/4-devops/7-release-mgmt/release-checklist.md`](../../2-docs/4-operations/compliance/release-checklist.md) — release gate checklist
- `ai-1-baseline` — Baseline Protocol governing these rules
