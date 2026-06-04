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
supersedes_note: 'Replaces three-lane model; maps to existing audits in docs/audit/'
---

# Readiness model — five audit lanes

**Purpose:** One score per lane. Each lane has **existing audit artifacts** in `docs/audit/` (and `docs/gtm/` for GTM) — lane index files only synthesize and link; they do not replace forensic audits.

---

## The five lanes

| #   | Lane                                   | Question                                                      | Canonical audits (existing)                                                                                                                                                                                                                                                                                                                                                                                                                | Index (rollup)                                                                                     |
| --- | -------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| 1   | **Engineering completeness & quality** | Can we build, test, release, and integrate?                   | [internal-10-10-signoff-2026-05-28.md](./internal-10-10-signoff-2026-05-28.md), [internal-completion-audit-2026-05-21.md](./internal-completion-audit-2026-05-21.md), [full-audit-2026-06-04.md](./full-audit-2026-06-04.md), [ci-confirmation-2026-06-01.md](./ci-confirmation-2026-06-01.md), [repo-hygiene-2026-06-05.md](./repo-hygiene-2026-06-05.md), [fuzz-campaign-evidence-2026-05-21.md](./fuzz-campaign-evidence-2026-05-21.md) | [engineering-completeness-quality-2026-06-05.md](./engineering-completeness-quality-2026-06-05.md) |
| 2   | **Internal compliance**                | Are in-repo controls, docs, and governance evidence complete? | [docs-standard-compliance-2026-06-05.md](./docs-standard-compliance-2026-06-05.md), [repo-hygiene-2026-06-05.md](./repo-hygiene-2026-06-05.md), [internal-10-10-signoff § INT-CORE-05/06](../compliance/soc2-readiness.md)                                                                                                                                                                                                                 | [internal-compliance-2026-06-05.md](./internal-compliance-2026-06-05.md)                           |
| 3   | **External-dependent compliance**      | Are third-party / org / time-based attestations delivered?    | [external-dependencies-register-2026-05-28.md](./external-dependencies-register-2026-05-28.md), [external-validation-findings-log.md](../release/external-validation-findings-log.md)                                                                                                                                                                                                                                                      | [external-dependent-compliance-2026-06-05.md](./external-dependent-compliance-2026-06-05.md)       |
| 4   | **Bank-grade**                         | Blended procurement/investor composite (SCORING_FRAMEWORK)?   | [master-audit-2026-06-03.md](./master-audit-2026-06-03.md), [latest.json](./latest.json)                                                                                                                                                                                                                                                                                                                                                   | [bank-grade-2026-06-05.md](./bank-grade-2026-06-05.md)                                             |
| 5   | **GTM**                                | Can which buyer adopt or buy today (non-engineering)?         | [gtm-readiness-2026-06-05.md](./gtm-readiness-2026-06-05.md), [gtm-reality-check-2026-06-02.md](../gtm/gtm-reality-check-2026-06-02.md), [engagement-log](../agile/engagement-log/README.md)                                                                                                                                                                                                                                               | Same                                                                                               |

---

## Scores at a glance (2026-06-05)

| Lane                          | Score / status                                       | Do not confuse with    |
| ----------------------------- | ---------------------------------------------------- | ---------------------- |
| Engineering                   | **10.0** internal signoff · **9.5** completion audit | Bank-grade 8.9         |
| Internal compliance           | **~9.3/10**                                          | External pen-test      |
| External-dependent compliance | **0/12** register items complete                     | Engineering 10.0       |
| Bank-grade                    | **8.9/10** certified composite                       | Engineering 10.0       |
| GTM (library)                 | **S1 Ready**                                         | Ecosystem sovereign S2 |

---

## Rules

1. **Never** cite bank-grade 8.9 as engineering status.
2. **Never** cite engineering 10.0 as pen-test complete.
3. **GTM** rows in [external-dependencies-register](./external-dependencies-register-2026-05-28.md) (EXT-CORE-007–010) belong to **lane 5**, not lane 3.
4. **DTF Tier 5 ~88%** is engineering + crypto evidence; commercial Tier 5 is GTM (human authorization).

---

## Audit folder map (by lane)

### Lane 1 — Engineering

| Audit                                     | Role                            |
| ----------------------------------------- | ------------------------------- |
| `internal-10-10-signoff-2026-05-28.md`    | Gate sign-off @ HEAD            |
| `internal-completion-audit-2026-05-21.md` | Package-level 9.5/10 completion |
| `full-audit-2026-06-04.md`                | Architecture sprint findings    |
| `repo-hygiene-2026-06-05.md`              | Workspace policy                |
| `moat-dimension-roadmap-10-10.md`         | DTF engineering track           |
| `algorithmic-moat-sprint2-assessment.md`  | ZKP moat scoring                |

### Lane 2 — Internal compliance

| Audit                                        | Role                                     |
| -------------------------------------------- | ---------------------------------------- |
| `docs-standard-compliance-2026-06-05.md`     | Machine-readable docs **9.6/10**         |
| `repo-hygiene-2026-06-05.md`                 | Root allowlist CI                        |
| `anti-inflation-audit-results-2026-05-11.md` | Score honesty                            |
| `../compliance/soc2-readiness.md`            | TSC mapping (design — not Type I letter) |
| `../security/threat-control-matrix.md`       | 12 controls                              |

### Lane 3 — External-dependent compliance

| Audit                                            | Role                                   |
| ------------------------------------------------ | -------------------------------------- |
| `external-dependencies-register-2026-05-28.md`   | **SoR** — 12 open external items       |
| `../release/external-validation-findings-log.md` | Pen-test findings (empty until vendor) |
| XR-402 / CORE-004                                | Ceremony (compliance, not engineering) |

### Lane 4 — Bank-grade

| Audit                                 | Role                               |
| ------------------------------------- | ---------------------------------- |
| `master-audit-2026-06-03.md`          | Latest blended certification       |
| `master-audit-2026-05-28.md`          | Prior certified 8.9 @ HEAD signoff |
| `gtcx-ecosystem-rating-2026-05-08.md` | Ecosystem context                  |

### Lane 5 — GTM

| Audit                                    | Role                      |
| ---------------------------------------- | ------------------------- |
| `../gtm/gtm-reality-check-2026-06-02.md` | S0–S6 history             |
| `../gtm/16-ecosystem-gtm-alignment.md`   | Owner split core vs infra |
| `../agile/engagement-log/`               | Sandbox send status       |

---

## Machine-readable

[latest.json](./latest.json) — update `lanes` when scores change.
