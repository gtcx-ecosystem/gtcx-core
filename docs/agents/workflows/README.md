# Agent Workflows — gtcx-core

Operational workflows and task playbooks for AI agents working in this repo.

---

## Safety Rules

| File                                                       | Description                                                                  |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------- |
| [`safety-rules.md`](safety-rules.md)                       | Three-tier authority structure: Autonomous / Requires Human Approval / Never |
| [`risk-tier-gates.md`](risk-tier-gates.md)                 | Tier-to-gate mapping derived from `quality/package-risk-tiers.json`          |
| [`agent-evidence-template.md`](agent-evidence-template.md) | Standard evidence format for high-risk work                                  |

Read this before taking any action in the repo.

---

## Task Playbooks

Step-by-step playbooks for common high-stakes operations. Each playbook includes pre-flight checklist, numbered steps, hard rules, and post-flight verification.

| File                                                                 | Task                                                                               |
| -------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [`tasks/add-package.md`](tasks/add-package.md)                       | Add a new `@gtcx/*` TypeScript package to the workspace                            |
| [`tasks/add-rust-crate.md`](tasks/add-rust-crate.md)                 | Add a new `gtcx-*` Rust crate to the workspace                                     |
| [`tasks/audit-remediation.md`](tasks/audit-remediation.md)           | Close audit findings with evidence and residual-risk accounting                    |
| [`tasks/cut-release.md`](tasks/cut-release.md)                       | Run all 9 CI gates, produce evidence artifacts, prepare release for human approval |
| [`tasks/expand-public-api.md`](tasks/expand-public-api.md)           | Add or modify public exports with semver discipline and baseline review            |
| [`tasks/investigate-ci-failure.md`](tasks/investigate-ci-failure.md) | Triage and resolve a failing CI gate                                               |
| [`tasks/security-fix.md`](tasks/security-fix.md)                     | Repair a trust-path defect with regression coverage and release evidence           |
| [`tasks/write-adr.md`](tasks/write-adr.md)                           | Author a new Architecture Decision Record                                          |

---

## Reference

- [`safety-rules.md`](safety-rules.md) — authority tiers
- [`../roles/`](../roles/) — role-specific decision standards
- [`../../devops/runbooks/quality-runbook.md`](../../devops/runbooks/quality-runbook.md) — full CI gate sequence
