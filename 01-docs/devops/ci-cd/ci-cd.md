---
title: 'CI/CD Pipeline — gtcx-core'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'standard'
tags: ['documentation', 'devops']
review_cycle: 'on-change'
---

---

title: 'Ci Cd'
status: 'current'
date: '2026-05-17'
owner: 'frontier-infra-engineer'
role: 'frontier-infra-engineer'
tier: 'standard'
tags: ['docs', 'operations']
review_cycle: 'on-change'

---

# CI/CD Pipeline — gtcx-core

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Quality & Evidence Lead

CI/CD expectations and workflow for `gtcx-core`. Every change to this repo runs through these gates before it reaches `main`.

---

## CI — Every PR

All of the following checks must pass on every pull request:

| Gate                      | Command                                                    | Blocks   |
| ------------------------- | ---------------------------------------------------------- | -------- |
| Architecture boundaries   | `pnpm architecture:check`                                  | PR merge |
| Lint                      | `pnpm lint`                                                | PR merge |
| Type check                | `pnpm typecheck`                                           | PR merge |
| Tests                     | `pnpm test`                                                | PR merge |
| Build                     | `pnpm build`                                               | PR merge |
| API surface               | `pnpm api:check`                                           | PR merge |
| Native binding smoke test | Matrix CI step                                             | PR merge |
| Rust quality              | `cargo clippy -D warnings && cargo test --workspace --lib` | PR merge |

Full gate sequence: `01-docs/testing/quality-standards.md`

---

## Native Binding CI

Native bindings require platform-specific matrix builds. All four targets must pass:

- Linux x86_64
- Linux aarch64
- macOS x86_64
- macOS aarch64 (Apple Silicon)

Artifacts are cached per platform. Integration tests requiring `GTCX_REQUIRE_NATIVE=true` run only after the platform artifact is staged.

---

## Release Workflow

Before a release, run all gates in the quality runbook. Specific release-gate actions:

| Gate                   | Command                                           | Action on Failure                                             |
| ---------------------- | ------------------------------------------------- | ------------------------------------------------------------- |
| API baseline           | `pnpm api:check`                                  | Review diff — major/minor/patch determination required        |
| Performance budgets    | `PERF_ENFORCE_TREND=true pnpm perf:check-budgets` | Investigate regression before releasing — do not raise budget |
| Security threat matrix | `pnpm security:threat-matrix`                     | Escalate to Cryptographic Security Engineer immediately       |
| UAT evidence           | Manual review                                     | Update `01-docs/05-audit/agile/testing/uat-evidence-log.md`   |
| Release checklist      | Manual review                                     | Complete `01-docs/devops/release-mgmt/release-checklist.md`   |

Update API baseline only after human approval: `pnpm api:update-baseline`

---

## Publish

Follow this sequence after all gates pass and human approval is confirmed:

1. `pnpm api:update-baseline` (if API changed, with human approval)
2. Version bump (patch / minor / major per human decision)
3. Tag: `git tag v<version>`
4. Push tag and publish packages

Never push to `main` without explicit instruction. Never force-push a release tag.

---

## Scheduled Workflows

| Workflow            | Schedule | Description                                     |
| ------------------- | -------- | ----------------------------------------------- |
| ZKP heavy proofs    | Weekly   | `cargo test -p gtcx-zkp --release -- --ignored` |
| Performance history | Per PR   | `pnpm perf:update-history`                      |
| Dependency audit    | Weekly   | `cargo audit` and npm audit                     |

---

## Reference

- [`01-docs/testing/quality-standards.md`](../../testing/quality-standards.md) — full gate list and thresholds
- [`01-docs/devops/runbooks/quality-runbook.md`](../runbooks/quality-runbook.md) — triage order when gates fail
- [`01-docs/devops/release-mgmt/release-checklist.md`](../release-mgmt/release-checklist.md) — release checklist
- [`01-docs/01-agents/workflows/tasks/cut-release.md`](../../agents/workflows/tasks/cut-release.md) — release task playbook
