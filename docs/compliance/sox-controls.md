---
title: 'Sox Controls'
status: 'current'
date: '2026-05-17'
owner: 'quality-evidence-lead'
role: 'quality-evidence-lead'
tier: 'critical'
tags: ['docs', 'compliance']
review_cycle: 'quarterly'
---

# SOX IT General Controls — gtcx-core

**Document ID:** GTCX-CORE-SOX-001
**Version:** 1.0
**Date:** 2026-05-08
**Status:** Active
**Applicable Standard:** Sarbanes-Oxley Act Section 404, COSO Framework

---

## Scope

This document maps gtcx-core's development controls to SOX IT General Controls (ITGCs) for downstream financial systems that depend on this library. gtcx-core itself is not a financial reporting system — it is a cryptographic foundation consumed by systems that may be in SOX scope.

---

## Control Mapping

### ITGC-1: Change Management

| Control                                        | Implementation                                                                      | Evidence                                          |
| ---------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------- |
| All changes require approval before deployment | PR-based workflow; CODEOWNERS review required for all packages                      | `.github/CODEOWNERS`                              |
| Changes are tested before deployment           | 21 CI quality gates must pass before merge                                          | `.github/workflows/ci.yml`                        |
| Changes are documented                         | Conventional commits enforced via commitlint; changesets required for version bumps | `commitlint.config.js`, `.changeset/config.json`  |
| Emergency changes follow expedited process     | CODEOWNERS can approve expedited PRs; same CI gates still required                  | No bypass mechanism exists (`--no-verify` banned) |
| Change history is immutable                    | Git history on protected `main` branch; force-push prohibited                       | Branch protection rules                           |

**Automated enforcement:**

- `pnpm architecture:check` — prevents unauthorized cross-package dependencies
- `pnpm api:check` — detects breaking API changes requiring semver major bump
- `pnpm security:secret-scan` — prevents credential commits
- `pnpm security:threat-matrix` — validates security control alignment

### ITGC-2: Access Controls

| Control                         | Implementation                                                               | Evidence                        |
| ------------------------------- | ---------------------------------------------------------------------------- | ------------------------------- |
| Access is role-based            | GitHub org membership with team-based permissions                            | GitHub org settings             |
| Authentication requires MFA     | GitHub requires 2FA for all org members                                      | GitHub org security policy      |
| Privileged access is limited    | CODEOWNERS restricts write access to critical paths (crypto, security, rust) | `.github/CODEOWNERS`            |
| Access is reviewed periodically | GitHub org membership audit (quarterly)                                      | Org admin dashboard             |
| Service accounts are managed    | GitHub Actions uses OIDC tokens, not long-lived secrets                      | `.github/workflows/release.yml` |

### ITGC-3: Program Development

| Control                                 | Implementation                                                       | Evidence                                   |
| --------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------ |
| Development follows defined methodology | Architecture Decision Records (ADRs) for design decisions            | `docs/decisions/` (14 ADRs)                |
| Code is reviewed before merge           | Required reviewer approval via CODEOWNERS                            | `.github/CODEOWNERS`                       |
| Testing is automated                    | 45 Turbo test tasks, 2,224+ test cases, coverage thresholds enforced | `pnpm test`, `pnpm test:coverage:critical` |
| Security is tested                      | CodeQL SAST, Trivy vulnerability scan, cargo-audit, secret scanning  | `.github/workflows/ci.yml`                 |
| Dependencies are managed                | Exact-version pinning for production deps; Dependabot for updates    | `packages/*/package.json`                  |

### ITGC-4: Computer Operations

| Control                          | Implementation                                                       | Evidence                                        |
| -------------------------------- | -------------------------------------------------------------------- | ----------------------------------------------- |
| Build processes are automated    | Turborepo orchestration; CI/CD via GitHub Actions                    | `turbo.json`, `.github/workflows/`              |
| Build artifacts are reproducible | Provenance manifest with SHA-256 hashes of lockfile and API baseline | `pnpm provenance:generate`                      |
| Release process is gated         | Release checklist with 26 mandatory checks; human signoff required   | `docs/devops/release-mgmt/release-checklist.md` |
| Incidents are tracked            | Quality runbook with failure triage order                            | `docs/devops/runbooks/quality-runbook.md`       |

---

## Segregation of Duties

| Function                   | Who                                | Enforcement                                             |
| -------------------------- | ---------------------------------- | ------------------------------------------------------- |
| Code authorship            | Any contributor                    | Git author attribution                                  |
| Code review                | CODEOWNERS (different from author) | GitHub required reviews                                 |
| CI gate approval           | Automated (no human bypass)        | CI must pass before merge                               |
| Release decision           | Human approver                     | Changeset version PR requires manual merge              |
| Security-sensitive changes | Cryptographic Security Engineer    | CODEOWNERS path rules for `/packages/crypto/`, `/rust/` |

**Key control:** No single person can author, review, and release a change. The CI pipeline is an independent third party that cannot be overridden (no `--no-verify`, no force-push).

---

## Audit Trail

| Event              | Mechanism                                        | Retention                |
| ------------------ | ------------------------------------------------ | ------------------------ |
| Code changes       | Git history (immutable on protected branches)    | Indefinite               |
| CI gate results    | GitHub Actions run logs                          | 90 days (GitHub default) |
| Dependency changes | `pnpm-lock.yaml` in git history; SBOM generation | Indefinite               |
| Release events     | npm publish logs; provenance attestation         | Indefinite               |
| Security findings  | CodeQL SARIF, Trivy reports (CI artifacts)       | 90 days                  |
| Quality metrics    | `quality/kpi-metrics.json` in git history        | Indefinite               |

For systems requiring longer CI log retention, GitHub Actions logs can be exported to a SIEM or long-term storage system.

---

## Control Testing Schedule

| Control                | Test Frequency       | Test Method                        |
| ---------------------- | -------------------- | ---------------------------------- |
| Change management      | Every PR (automated) | CI pipeline enforces all 21 gates  |
| Access controls        | Quarterly            | GitHub org membership review       |
| Code review compliance | Every PR (automated) | CODEOWNERS required reviews        |
| Dependency security    | Every PR (automated) | `pnpm audit`, `cargo audit`, Trivy |
| Release integrity      | Per release          | Release checklist verification     |

---

## Downstream SOX Implications

For downstream financial reporting systems using gtcx-core:

1. **gtcx-core is a third-party library dependency** — treat it like any open-source dependency in your SOX risk assessment
2. **Vendor risk**: Mitigated by provenance attestation, SBOM generation, and deterministic builds
3. **Change impact**: Changesets with semver policy ensure breaking changes are explicit and require major version bumps
4. **Integrity verification**: SHA-256 hashes in provenance manifest verify artifact integrity

---

## References

- Sarbanes-Oxley Act of 2002, Section 404
- COSO Internal Control — Integrated Framework (2013)
- COBIT 2019 Framework
- [Quality Runbook](../devops/runbooks/quality-runbook.md)
- [Release Checklist](../devops/release-mgmt/release-checklist.md)
- [Architecture Decision Records](../decisions/)
