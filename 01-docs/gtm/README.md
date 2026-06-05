---
title: 'GTM Evidence Pack — gtcx-core'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 95
autonomy_level: 'sovereign'
tier: 'critical'
tags: ['documentation', 'gtm']
review_cycle: 'on-change'
---

# GTM Evidence Pack — gtcx-core

**Purpose:** GTM and regulator-facing evidence. **Not** engineering readiness — see [audit/readiness-model.md](../audit/readiness-model.md).
**Audience:** Regulatory sandbox teams, enterprise auditors, compliance reviewers, investors conducting technical due diligence.
**Last updated:** 2026-06-02

**Ecosystem alignment (canonical):** [16-ecosystem-gtm-alignment.md](./16-ecosystem-gtm-alignment.md) — XC blockers, pen-test, SOC 2, and Zimbabwe outreach are owned with [gtcx-infrastructure GTM](https://github.com/gtcx-ecosystem/gtcx-infrastructure/blob/main/01-docs/08-gtm/README.md) per the [Global South 10/10 plan](https://github.com/gtcx-ecosystem/gtcx-infrastructure/blob/main/01-docs/08-gtm/plans/global-south-10x-plan.md).

**Latest stage assessment:** [gtm-readiness-2026-06-05.md](../audit/gtm-readiness-2026-06-05.md) — library **GR-T1**; ecosystem sovereign **below GR-T2** (infra). Detail: [gtm-reality-check-2026-06-02.md](./gtm-reality-check-2026-06-02.md) (S0–S6 maps to GR-T0–T6).

---

## How to Use This Folder

**If you're a regulator:** Start with [00-executive-brief.md](./00-executive-brief.md), then [02-compliance-matrix.md](./02-compliance-matrix.md).

**If you're an auditor:** Start with [01-security-posture.md](./01-security-posture.md), then [04-evidence-inventory.md](./04-evidence-inventory.md).

**If you're an enterprise customer:** Start with [07-downstream-integration.md](./07-downstream-integration.md).

**If you're the team:** Start with [05-sandbox-submission-guide.md](./05-sandbox-submission-guide.md).

---

## Cross-repo inbound

| Date       | Ticket                                                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------------------------------ |
| 2026-06-02 | [Infrastructure — repo retirements (ADR-012)](./inbound-tickets/from-gtcx-infrastructure-2026-06-02-repo-retirements.md) |

Full index: [`inbound-tickets/README.md`](./inbound-tickets/README.md).

---

## Execution roadmaps

| Document                                                                                                            | What it is                                                      |
| ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| [gtm-roadmap-10-10-internal-2026-06-01.md](./gtm-roadmap-10-10-internal-2026-06-01.md)                              | **Internal** path: engineering, DevEx, documentation (complete) |
| [16-ecosystem-gtm-alignment.md](./16-ecosystem-gtm-alignment.md)                                                    | **Cross-repo** ownership: core vs infrastructure vs protocols   |
| [gtm-reality-check-2026-06-02.md](./gtm-reality-check-2026-06-02.md)                                                | **GTM stages S0–S6** per `GTM.md` framework                     |
| [10-10-roadmap-2026-05-25.md](../audit/10-10-roadmap-2026-05-25.md)                                                 | **Bank-grade** path: pen test, SOC 2 (US/EU bank track)         |
| [engagement-readiness-sprint-roadmap](../agile/roadmap/engagement-readiness-sprint-roadmap-2026-05-22.md)           | Sovereign engagement sprints                                    |
| [gtcx-infrastructure GTM](https://github.com/gtcx-ecosystem/gtcx-infrastructure/blob/main/01-docs/08-gtm/README.md) | Sandbox ZIP, pen-test RFP, IRP, EXT-INF register                |

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
| 16  | [Ecosystem GTM Alignment](./16-ecosystem-gtm-alignment.md)             | Cross-repo blocker ownership (infra vs core)                      |

---

## Readiness lanes (this folder = lane 5 GTM-Readiness)

| Lane                            | Index                                                                                                     |
| ------------------------------- | --------------------------------------------------------------------------------------------------------- |
| 1 Engineering **10.0/9.5**      | [engineering-completeness-quality-2026-06-05.md](../audit/engineering-completeness-quality-2026-06-05.md) |
| 2 Internal compliance           | [internal-compliance-2026-06-05.md](../audit/internal-compliance-2026-06-05.md)                           |
| 3 Industry Compliance **IC-T0** | [industry-compliance-2026-06-05.md](../audit/industry-compliance-2026-06-05.md)                           |
| 4 Bank-grade **8.9**            | [bank-grade-2026-06-05.md](../audit/bank-grade-2026-06-05.md)                                             |
| 5 GTM-Readiness **GR-T1**       | [gtm-readiness-2026-06-05.md](../audit/gtm-readiness-2026-06-05.md)                                       |

Ecosystem sovereign blockers — [16-ecosystem-gtm-alignment](./16-ecosystem-gtm-alignment.md). Not lane 1.
