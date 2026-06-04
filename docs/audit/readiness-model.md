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

**Purpose:** One score per lane. Each lane has **existing audit artifacts** in `docs/audit/` (and `docs/gtm/` for GTM) — lane index files (`*-2026-06-05.md`) only synthesize and link; they do **not** replace forensic audits.

**Already in repo before 2026-06-05:** The split was documented; the five-lane **names and index files** were added in commit `6067267`. Pre-existing forensic audits:

| Lane                  | Pre-existing audit (date)                                                                                                                                                                                                    |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 Engineering         | [internal-completion-audit-2026-05-21.md](./internal-completion-audit-2026-05-21.md), [internal-10-10-signoff-2026-05-28.md](./internal-10-10-signoff-2026-05-28.md), [full-audit-2026-06-04.md](./full-audit-2026-06-04.md) |
| 2 Internal compliance | [docs-standard-compliance-2026-06-05.md](./docs-standard-compliance-2026-06-05.md), [repo-hygiene-2026-06-05.md](./repo-hygiene-2026-06-05.md)                                                                               |
| 3 External-dependent  | [external-dependencies-register-2026-05-28.md](./external-dependencies-register-2026-05-28.md) — **internal 10.0 vs certified 8.9** split                                                                                    |
| 4 Bank-grade          | [master-audit-2026-06-03.md](./master-audit-2026-06-03.md), [latest.json](./latest.json)                                                                                                                                     |
| 5 GTM                 | [gtm-reality-check-2026-06-02.md](../gtm/gtm-reality-check-2026-06-02.md), [gtm-roadmap-10-10-internal-2026-06-01.md](../gtm/gtm-roadmap-10-10-internal-2026-06-01.md) § “Two scores”                                        |

Also: [docs/internal/external-readiness-checklist.md](../internal/external-readiness-checklist.md), README § “Two scores apply” (2026-06-04).

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

## Rankings (1–10) — 2026-06-05

Conservative **1–10** per lane. Source = forensic audit cited in [audit folder map](#audit-folder-map-by-lane), not the index files alone.

| Lane                                 | Rank (1–10) | Primary evidence                                                                                                                                           | Notes                                                                                                                                                |
| ------------------------------------ | ----------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 Engineering completeness & quality |     **9.5** | [internal-completion-audit-2026-05-21.md](./internal-completion-audit-2026-05-21.md)                                                                       | Gate signoff claims **10.0** ([internal-10-10-signoff](./internal-10-10-signoff-2026-05-28.md)); use **9.5** for holistic package/coverage narrative |
| 2 Internal compliance                |     **9.3** | [docs-standard-compliance-2026-06-05.md](./docs-standard-compliance-2026-06-05.md) (9.6), [repo-hygiene-2026-06-05.md](./repo-hygiene-2026-06-05.md) (9.6) | In-repo controls + docs; SOC 2 **design** only — no Type I letter                                                                                    |
| 3 External-dependent compliance      |       **2** | [external-dependencies-register-2026-05-28.md](./external-dependencies-register-2026-05-28.md)                                                             | **0/12** items `complete`; RFP/prep done (lane 2) does not raise this rank                                                                           |
| 4 Bank-grade                         |     **8.9** | [master-audit-2026-06-03.md](./master-audit-2026-06-03.md)                                                                                                 | Blended SCORING_FRAMEWORK composite — investor 8.9, enterprise 8.7, sovereign/DFI 9.0                                                                |
| 5a GTM — library integrator          |       **7** | [gtm-reality-check-2026-06-02.md](../gtm/gtm-reality-check-2026-06-02.md)                                                                                  | **S1 Ready** — npm integrate &lt; 1 day; not S2 commercial pilot SKU                                                                                 |
| 5b GTM — ecosystem sovereign stack   |       **3** | [16-ecosystem-gtm-alignment.md](../gtm/16-ecosystem-gtm-alignment.md), [engagement-log](../agile/engagement-log/README.md)                                 | Sandbox sends blocked; pen-test/testnet/DPA open                                                                                                     |

**Do not confuse:** Lane 1 **9.5** ≠ lane 4 **8.9**. Lane 3 **2** ≠ lane 2 **9.3**.

### GTM stage vs 1–10

GTM framework uses **S0–S6 stages**, not a single 1–10. The ranks above map stages to a rough diligence scale (S1 ≈ 7, sovereign S2-not-ready ≈ 3).

---

## Scores at a glance (2026-06-05)

| Lane                          | Rank | Status shorthand                                  |
| ----------------------------- | ---: | ------------------------------------------------- |
| Engineering                   |  9.5 | 10.0 signoff gates · 9.5 completion audit         |
| Internal compliance           |  9.3 | Docs/hygiene 9.6; governance + threat matrix pass |
| External-dependent compliance |    2 | 0/12 register complete                            |
| Bank-grade                    |  8.9 | Certified composite                               |
| GTM library                   |    7 | S1 Ready                                          |
| GTM ecosystem sovereign       |    3 | S2 Not Ready                                      |

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
