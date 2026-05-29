---
title: "GTM Evidence Pack — gtcx-core"
status: "current"
date: "2026-05-27"
owner: "gtcx-core"
role: "protocol-architect"
agent_id: "agent://gtcx-core/2026-05-27/session-backfill"
trust_score: 95
autonomy_level: "sovereign"
tier: "critical"
tags: ["documentation", "gtm"]
review_cycle: "on-change"
---

# GTM Evidence Pack — gtcx-core

**Purpose:** Everything needed to achieve 10/10 bank-grade readiness, in one folder.
**Audience:** Regulatory sandbox teams, enterprise auditors, compliance reviewers, investors conducting technical due diligence.
**Last updated:** 2026-05-25

---

## How to Use This Folder

**If you're a regulator:** Start with [00-executive-brief.md](./00-executive-brief.md), then [02-compliance-matrix.md](./02-compliance-matrix.md).

**If you're an auditor:** Start with [01-security-posture.md](./01-security-posture.md), then [04-evidence-inventory.md](./04-evidence-inventory.md).

**If you're an enterprise customer:** Start with [07-downstream-integration.md](./07-downstream-integration.md).

**If you're the team:** Start with [05-sandbox-submission-guide.md](./05-sandbox-submission-guide.md).

---

## Contents

| #   | Document                                                               | What It Answers                                                   |
| --- | ---------------------------------------------------------------------- | ----------------------------------------------------------------- |
| 00  | [Executive Brief](./00-executive-brief.md)                             | What is this, why should you trust it, what's the current state   |
| 01  | [Security Posture](./01-security-posture.md)                           | How is this secured, what was tested, what are the residual risks |
| 02  | [Compliance Matrix](./02-compliance-matrix.md)                         | ISO 27001, SOC 2, GDPR, PCI-DSS, SOX, FIPS — one view             |
| 03  | [FIPS Readiness](./03-fips-readiness.md)                               | Can this run in a FIPS-required environment                       |
| 04  | [Evidence Inventory](./04-evidence-inventory.md)                       | Where is every piece of machine-generated evidence                |
| 05  | [Sandbox Submission Guide](./05-sandbox-submission-guide.md)           | How to prepare and execute a regulatory sandbox application       |
| 06  | [Budget Readiness Plan](./06-budget-readiness-plan.md)                 | The $0 path to 10/10 — what remains and how to close it           |
| 07  | [Downstream Integration](./07-downstream-integration.md)               | How consumers validate, integrate, and maintain trust             |
| 08  | [Target Markets](./08-target-markets.md)                               | Zimbabwe, Namibia, Zambia, DRC, Ghana — strategy and sequencing   |
| 09  | [Email: Zimbabwe](./09-pre-submission-email-zimbabwe.md)               | RBZ sandbox pre-submission email draft                            |
| 10  | [Email: Namibia](./10-pre-submission-email-namibia.md)                 | BoN Innovation Hub pre-submission email draft                     |
| 11  | [Email: Zambia](./11-pre-submission-email-zambia.md)                   | BoZ sandbox pre-submission email draft                            |
| 12  | [Brief: DRC](./12-engagement-brief-drc.md)                             | Direct engagement strategy — 3TG via ITSCI/RMI/BGR                |
| 13  | [Email: Ghana](./13-pre-submission-email-ghana.md)                     | BoG sandbox pre-submission email draft                            |
| 14  | [ADR-012 Ecosystem Integration](./14-adr-012-ecosystem-integration.md) | Entity-tier verification extension for regulators and enterprise  |
| 15  | [SLSA Provenance Guide](./15-slsa-provenance-guide.md)                 | How to verify supply-chain integrity of @gtcx packages            |

---

## Current Readiness Score

**8.9 / 10** as of 2026-05-25.

| Dimension                   | Score | Status                                                                    |
| --------------------------- | ----- | ------------------------------------------------------------------------- |
| Code quality & architecture | 9.5   | 336 workproof tests, property-based tests, 21 CI gates passing            |
| Security controls           | 8.0   | FIPS verified; cargo audit passes with documented exceptions; pen-test P1 |
| Supply chain                | 9.0   | Exact-version pinning, SBOM, npm scope claimed, SLSA provenance ready     |
| Compliance documentation    | 9.0   | GDPR, PCI-DSS, SOX, ISO 27001, FIPS documented; SOC 2 Type 1 pending      |
| Production readiness        | 8.5   | Performance budgets, provenance manifest, publish window ready            |

**Remaining 1.1 points:** External pen-test engagement, SOC 2 Type 1 fieldwork, SLSA provenance publish, upstream rustls-webpki fix, DR runbook drill.
