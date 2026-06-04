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
supersedes_note: 'Audit quality 1-10 vs readiness outcomes; external lane uses status/tier only'
---

# Readiness model — five audit lanes

**Purpose:** Separate **audit artifact quality** (how good the audit is) from **readiness outcomes** (what the repo has actually achieved). Lane indexes link forensic audits; they do not replace them.

**Ecosystem:** [ecosystem-audit-catalog-2026-06-05.md](./ecosystem-audit-catalog-2026-06-05.md) · hub [gtcx-docs/docs/audit/INDEX.md](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/docs/audit/INDEX.md)

---

## Two different numbers (do not mix)

| Kind                  | Scale         | Example                                                                                        |
| --------------------- | ------------- | ---------------------------------------------------------------------------------------------- |
| **Audit quality**     | **1–10**      | “How thorough, evidenced, and honest is this audit document?”                                  |
| **Readiness outcome** | Repo-specific | Engineering 9.5 completion, bank-grade composite 8.9, GTM stage S1, external **0/12 complete** |

**Lane 3 and other external-dependent work:** use **status / tier only** for readiness — never 1–10.

---

## Audit quality rankings (1–10) — 2026-06-05

How good the **audit artifacts** are (evidence, methodology, honesty, freshness, cross-linking).

| Lane                                     | Audit quality (1–10) | Primary audit artifacts rated                                                                                                                                                                                                                                                      | Quality notes                                                                              |
| ---------------------------------------- | -------------------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| 1 Engineering                            |              **8.5** | [internal-10-10-signoff-2026-05-28](./internal-10-10-signoff-2026-05-28.md), [internal-completion-audit-2026-05-21](./internal-completion-audit-2026-05-21.md), [full-audit-2026-06-04](./full-audit-2026-06-04.md), [ci-confirmation-2026-06-01](./ci-confirmation-2026-06-01.md) | Strong gate tables + exit codes; many dated overlaps lower suite coherence                 |
| 2 Internal compliance                    |              **8.5** | [docs-standard-compliance-2026-06-05](./docs-standard-compliance-2026-06-05.md), [repo-hygiene-2026-06-05](./repo-hygiene-2026-06-05.md), [anti-inflation-audit-results-2026-05-11](./anti-inflation-audit-results-2026-05-11.md)                                                  | Machine-verifiable axes; SOC 2 doc is prep not delivered attestation                       |
| 3 External-dependent (register as audit) |              **8.0** | [external-dependencies-register-2026-05-28](./external-dependencies-register-2026-05-28.md)                                                                                                                                                                                        | Good SoR: IDs, owners, score-impact column; **readiness** tracked separately below         |
| 4 Bank-grade (master audit as audit)     |              **8.5** | [master-audit-2026-06-03](./master-audit-2026-06-03.md)                                                                                                                                                                                                                            | Full SCORING_FRAMEWORK pass + Protocol 27 ladder; still blends outcomes into one composite |
| 5 GTM (gtm reality check as audit)       |              **8.0** | [gtm-reality-check-2026-06-02](../gtm/gtm-reality-check-2026-06-02.md)                                                                                                                                                                                                             | S0–S6 framework applied; buyer-A vs buyer-B split could be sharper                         |

**Stale / low audit quality (reference):** [gtcx-agile `2-core-audit.md`](https://github.com/gtcx-ecosystem/gtcx-agile/blob/main/docs/audits/reports/2-core-audit.md) — **4/10** (no gate runs, pre–Tier 5, contradicts later forensics).

---

## Readiness outcomes (not audit quality)

What the repo has achieved — cited from forensic audits, **not** re-labeled as 1–10 except where the source audit already uses a composite score.

| Lane                  | Outcome metric           | Current value       | Source                                                                              |
| --------------------- | ------------------------ | ------------------- | ----------------------------------------------------------------------------------- |
| 1 Engineering         | Internal completion      | **9.5/10**          | [internal-completion-audit-2026-05-21](./internal-completion-audit-2026-05-21.md)   |
| 1 Engineering         | Gate signoff @ HEAD      | **10.0/10**         | [internal-10-10-signoff-2026-05-28](./internal-10-10-signoff-2026-05-28.md)         |
| 2 Internal compliance | Docs + hygiene composite | **~9.6/10**         | docs-standard + repo-hygiene audits                                                 |
| 3 External-dependent  | Register completion      | **0/12** `complete` | [external-dependencies-register](./external-dependencies-register-2026-05-28.md)    |
| 4 Bank-grade          | Certified composite      | **8.9/10**          | [master-audit-2026-06-03](./master-audit-2026-06-03.md)                             |
| 5 GTM library         | Stage                    | **S1 Ready**        | [gtm-reality-check-2026-06-02](../gtm/gtm-reality-check-2026-06-02.md)              |
| 5 GTM ecosystem       | Stage                    | **S2 Not Ready**    | engagement-log + [16-ecosystem-gtm-alignment](../gtm/16-ecosystem-gtm-alignment.md) |

---

## Lane 3 — status / tier (external-dependent only)

**No 1–10 readiness score.** Track dependency delivery and register health.

### Register completion status

| Status         | Meaning                                                 |
| -------------- | ------------------------------------------------------- |
| **OPEN**       | 0 of 12 EXT-CORE items `complete`                       |
| **PREP-READY** | RFP, SOC 2 gap analysis, SLSA workflow in-repo (lane 2) |
| **IN-FLIGHT**  | EXT-CORE-012 90-day P1-free window (ends 2026-08-17)    |
| **BLOCKED**    | EXT-CORE-004/005 org npm provenance (HTTP 409)          |

### Item tiers (compliance-relevant subset)

| Tier             | Items                                                                        | Delivery status                     |
| ---------------- | ---------------------------------------------------------------------------- | ----------------------------------- |
| **T0 — Blocker** | EXT-CORE-001 pen-test, EXT-CORE-002 SOC 2 letter, XR-402 ceremony            | `not-started` (vendor/CPA/ceremony) |
| **T1 — High**    | EXT-CORE-003 FIPS review, EXT-CORE-004/005 provenance, EXT-CORE-011 DR drill | `open`                              |
| **T2 — Hygiene** | EXT-CORE-006 RUSTSEC upstream                                                | `open` (mitigated)                  |
| **T3 — Time**    | EXT-CORE-012 90-day stability                                                | `in-progress`                       |

GTM-only register rows (EXT-CORE-007–010) → **lane 5** status, not lane 3.

---

## The five lanes (index map)

| #   | Lane                               | Audit quality (1–10) | Readiness outcome scale              | Index                                                                                              |
| --- | ---------------------------------- | -------------------: | ------------------------------------ | -------------------------------------------------------------------------------------------------- |
| 1   | Engineering completeness & quality |                  8.5 | Scores in source audits (9.5 / 10.0) | [engineering-completeness-quality-2026-06-05.md](./engineering-completeness-quality-2026-06-05.md) |
| 2   | Internal compliance                |                  8.5 | ~9.6 (docs/hygiene audits)           | [internal-compliance-2026-06-05.md](./internal-compliance-2026-06-05.md)                           |
| 3   | External-dependent compliance      | 8.0 (register audit) | **Status / tier** only               | [external-dependent-compliance-2026-06-05.md](./external-dependent-compliance-2026-06-05.md)       |
| 4   | Bank-grade                         |   8.5 (master audit) | 8.9 composite                        | [bank-grade-2026-06-05.md](./bank-grade-2026-06-05.md)                                             |
| 5   | GTM                                |  8.0 (reality check) | **S0–S6 stages**                     | [gtm-readiness-2026-06-05.md](./gtm-readiness-2026-06-05.md)                                       |

---

## Rules

1. **1–10 on this page = audit quality**, unless the row is explicitly “readiness outcome.”
2. **Never** rate external dependency **delivery** 1–10 — use status/tier (lane 3).
3. **Never** cite bank-grade **8.9** as engineering readiness.
4. **GTM readiness** uses **stages** (S0–S6), not 1–10.
5. DTF Tier 5 **~88%** is an engineering **outcome**, not audit quality.

---

## Machine-readable

[latest.json](./latest.json) — `auditQuality1to10` vs `readinessOutcome` vs `externalStatus`.
