---
title: 'Readiness model — five audit lanes'
status: current
date: 2026-06-05
owner: gtcx-core
role: quality-evidence-lead
document_id: AUDIT-READINESS-MODEL-002
tier: critical
tags: ['audit', 'readiness', 'governance']
review_cycle: on-change
supersedes_note: 'Industry Compliance + GTM-Readiness tiers; audit quality 1-10 separate from outcomes'
---

# Readiness model — five audit lanes

**Purpose:** Separate **audit artifact quality** (1–10) from **readiness outcomes** (scores, **Industry Compliance tiers**, **GTM-Readiness tiers**). Lane indexes link forensic audits.

**Ecosystem:** [ecosystem-audit-catalog-2026-06-05.md](./ecosystem-audit-catalog-2026-06-05.md)

---

## Two different numbers (do not mix)

| Kind                  | Scale         | Example                                                                                                 |
| --------------------- | ------------- | ------------------------------------------------------------------------------------------------------- |
| **Audit quality**     | **1–10**      | How good the audit document is                                                                          |
| **Readiness outcome** | Repo-specific | Engineering 9.5; bank-grade 8.9; Industry **IC-T0**; GTM-Readiness **GR-T1** / sovereign **&lt; GR-T2** |

**Industry Compliance and GTM-Readiness:** use **tier + status only** for readiness — never 1–10.

---

## Audit quality rankings (1–10) — 2026-06-05

| Lane                  | Audit quality (1–10) | Primary artifacts                                                                |
| --------------------- | -------------------: | -------------------------------------------------------------------------------- |
| 1 Engineering         |              **8.5** | signoff, completion, full-audit, ci-confirmation                                 |
| 2 Internal compliance |              **8.5** | six domains: repo hygiene, docs, AI trust, security, corporate readiness         |
| 3 Industry Compliance |              **8.0** | [external-dependencies-register](./external-dependencies-register-2026-05-28.md) |
| 4 Bank-grade          |              **8.5** | [master-audit-2026-06-03](./master-audit-2026-06-03.md)                          |
| 5 GTM-Readiness       |              **8.0** | [gtm-reality-check-2026-06-02](../gtm/gtm-reality-check-2026-06-02.md)           |

---

## Readiness outcomes (not audit quality)

| Lane                  | Outcome                   | Current                                                                     | Source                                                           |
| --------------------- | ------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| 1 Engineering         | Completion / signoff      | **9.5** / **10.0**                                                          | internal-completion, signoff                                     |
| 2 Internal compliance | Domain composite          | **9.0** (repo **9.6**, docs **9.6**, AI **8.8**, sec **8.8**, corp **8.2**) | [internal-compliance index](./internal-compliance-2026-06-05.md) |
| 3 Industry Compliance | Register + aggregate tier | **OPEN 0/12** · **IC-T0**                                                   | [industry-compliance index](./industry-compliance-2026-06-05.md) |
| 4 Bank-grade          | Certified composite       | **8.9**                                                                     | master-audit                                                     |
| 5 GTM-Readiness       | GR tier by buyer          | Library **GR-T1** · sovereign **&lt; GR-T2**                                | [gtm-readiness index](./gtm-readiness-2026-06-05.md)             |

---

## Lane 3 — Industry Compliance tiers (IC-T0–IC-T4)

| Tier                   | Scope                            | Placement        |
| ---------------------- | -------------------------------- | ---------------- |
| **IC-T0 Blocker**      | Pen-test, SOC 2 letter, ceremony | **Active**       |
| **IC-T1 Assurance**    | FIPS review, DR drill            | Open             |
| **IC-T2 Platform**     | Org npm provenance               | Blocked          |
| **IC-T3 Supply chain** | RUSTSEC / upstream               | Open (mitigated) |
| **IC-T4 Temporal**     | 90-day P1-free window            | In-flight        |

**Register status:** OPEN · **0/12 complete** · **PREP-READY** in-repo

Full mapping: [industry-compliance-2026-06-05.md](./industry-compliance-2026-06-05.md)

---

## Lane 5 — GTM-Readiness tiers (GR-T0–GR-T6)

| Tier         | Maps to            | Placement                                             |
| ------------ | ------------------ | ----------------------------------------------------- |
| **GR-T0**    | S0 Prototype       | Achieved                                              |
| **GR-T1**    | S1 MVP (library)   | **Achieved**                                          |
| **GR-T2**    | S2 Pilot           | Partial (integrator); **Not ready** (sovereign stack) |
| **GR-T3–T6** | S3–S6 GA → Defense | Not ready                                             |

Full mapping: [gtm-readiness-2026-06-05.md](./gtm-readiness-2026-06-05.md)

---

## Lane 2 — Internal compliance domains (readiness scores)

| Domain                      | Readiness | Canonical audit                                                                    |
| --------------------------- | --------: | ---------------------------------------------------------------------------------- |
| Repo hygiene & organization |   **9.6** | [repo-hygiene-2026-06-05.md](./repo-hygiene-2026-06-05.md)                         |
| Documentation quality       |   **9.6** | [docs-standard-compliance-2026-06-05.md](./docs-standard-compliance-2026-06-05.md) |
| AI trust & safety           |   **8.8** | master-audit agentic + full-audit AI gaps                                          |
| Security (in-repo)          |   **8.8** | threat matrix + full-audit Phase 2                                                 |
| Corporate readiness         |   **8.2** | [soc2-readiness.md](../compliance/soc2-readiness.md)                               |

**Weighted composite:** **9.0/10** — full sub-scores in [internal-compliance-2026-06-05.md](./internal-compliance-2026-06-05.md).

---

## The five lanes (index map)

| #   | Lane                               | Audit quality | Readiness scale     | Index                                                                                              |
| --- | ---------------------------------- | ------------- | ------------------- | -------------------------------------------------------------------------------------------------- |
| 1   | Engineering completeness & quality | 8.5           | Scores (9.5 / 10.0) | [engineering-completeness-quality-2026-06-05.md](./engineering-completeness-quality-2026-06-05.md) |
| 2   | Internal compliance                | 8.5           | **9.0** composite   | [internal-compliance-2026-06-05.md](./internal-compliance-2026-06-05.md)                           |
| 3   | **Industry Compliance**            | 8.0           | **IC-T0–IC-T4**     | [industry-compliance-2026-06-05.md](./industry-compliance-2026-06-05.md)                           |
| 4   | Bank-grade                         | 8.5           | 8.9 composite       | [bank-grade-2026-06-05.md](./bank-grade-2026-06-05.md)                                             |
| 5   | **GTM-Readiness**                  | 8.0           | **GR-T0–GR-T6**     | [gtm-readiness-2026-06-05.md](./gtm-readiness-2026-06-05.md)                                       |

---

## Rules

1. **1–10 = audit quality** only (unless labeled readiness outcome).
2. **Industry Compliance** and **GTM-Readiness** use **tiers**, not 1–10 delivery scores.
3. Never cite bank-grade **8.9** as engineering readiness.
4. DTF Tier 5 **~88%** is engineering outcome, not GTM-Readiness.

---

## Machine-readable

[latest.json](./latest.json)
