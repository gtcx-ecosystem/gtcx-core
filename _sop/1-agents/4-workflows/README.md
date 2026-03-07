# Agent Workflows — gtcx-core

Operational workflows and task playbooks for AI agents working in this repo.

---

## Safety Rules

| File                                 | Description                                                                  |
| ------------------------------------ | ---------------------------------------------------------------------------- |
| [`safety-rules.md`](safety-rules.md) | Three-tier authority structure: Autonomous / Requires Human Approval / Never |

Read this before taking any action in the repo.

---

## Task Playbooks

Step-by-step playbooks for common high-stakes operations. Each playbook includes pre-flight checklist, numbered steps, hard rules, and post-flight verification.

| File                                                                 | Task                                                                               |
| -------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [`tasks/add-package.md`](tasks/add-package.md)                       | Add a new `@gtcx/*` TypeScript package to the workspace                            |
| [`tasks/add-rust-crate.md`](tasks/add-rust-crate.md)                 | Add a new `gtcx-*` Rust crate to the workspace                                     |
| [`tasks/cut-release.md`](tasks/cut-release.md)                       | Run all 9 CI gates, produce evidence artifacts, prepare release for human approval |
| [`tasks/investigate-ci-failure.md`](tasks/investigate-ci-failure.md) | Triage and resolve a failing CI gate                                               |
| [`tasks/write-adr.md`](tasks/write-adr.md)                           | Author a new Architecture Decision Record                                          |

---

## Reference

- [`../4-workflows/safety-rules.md`](safety-rules.md) — authority tiers
- [`../2-roles/`](../2-roles/) — role-specific decision standards
- [`../../2-docs/4-devops/2-runbooks/quality-runbook.md`](../../2-docs/4-devops/2-runbooks/quality-runbook.md) — full CI gate sequence
