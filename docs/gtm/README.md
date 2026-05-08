# GTM Evidence Pack — gtcx-core

**Purpose:** Everything needed to achieve 10/10 bank-grade readiness, in one folder.
**Audience:** Regulatory sandbox teams, enterprise auditors, compliance reviewers, investors conducting technical due diligence.
**Last updated:** 2026-05-08

---

## How to Use This Folder

**If you're a regulator:** Start with [00-executive-brief.md](./00-executive-brief.md), then [02-compliance-matrix.md](./02-compliance-matrix.md).

**If you're an auditor:** Start with [01-security-posture.md](./01-security-posture.md), then [04-evidence-inventory.md](./04-evidence-inventory.md).

**If you're an enterprise customer:** Start with [07-downstream-integration.md](./07-downstream-integration.md).

**If you're the team:** Start with [05-sandbox-submission-guide.md](./05-sandbox-submission-guide.md).

---

## Contents

| #   | Document                                                     | What It Answers                                                   |
| --- | ------------------------------------------------------------ | ----------------------------------------------------------------- |
| 00  | [Executive Brief](./00-executive-brief.md)                   | What is this, why should you trust it, what's the current state   |
| 01  | [Security Posture](./01-security-posture.md)                 | How is this secured, what was tested, what are the residual risks |
| 02  | [Compliance Matrix](./02-compliance-matrix.md)               | ISO 27001, SOC 2, GDPR, PCI-DSS, SOX, FIPS — one view             |
| 03  | [FIPS Readiness](./03-fips-readiness.md)                     | Can this run in a FIPS-required environment                       |
| 04  | [Evidence Inventory](./04-evidence-inventory.md)             | Where is every piece of machine-generated evidence                |
| 05  | [Sandbox Submission Guide](./05-sandbox-submission-guide.md) | How to prepare and execute a regulatory sandbox application       |
| 06  | [Budget Readiness Plan](./06-budget-readiness-plan.md)       | The $0 path to 10/10 — what remains and how to close it           |
| 07  | [Downstream Integration](./07-downstream-integration.md)     | How consumers validate, integrate, and maintain trust             |

---

## Current Readiness Score

**9.4 / 10** as of 2026-05-08.

| Dimension                   | Score | Status                                                            |
| --------------------------- | ----- | ----------------------------------------------------------------- |
| Code quality & architecture | 9.5   | All 21 CI gates passing                                           |
| Security controls           | 9.5   | STRIDE threat model, 6 fuzz targets, internal assessment complete |
| Supply chain                | 9.0   | Exact-version pinning, zero audit findings, SBOM generation       |
| Compliance documentation    | 9.0   | GDPR, PCI-DSS, SOX, ISO 27001, SOC 2, FIPS — all documented       |
| Production readiness        | 9.0   | Performance budgets, provenance, release gates                    |

**Remaining 0.6 points:** Fuzz campaign execution, Rust FIPS backend (aws-lc-rs), KeyStore trait, pre-submission meeting with regulator.
