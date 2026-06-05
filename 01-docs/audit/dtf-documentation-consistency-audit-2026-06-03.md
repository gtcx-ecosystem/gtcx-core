---
title: 'DTF Documentation Consistency Audit'
status: 'current'
date: '2026-06-03'
owner: 'quality-evidence-lead'
role: 'quality-evidence-lead'
tier: 'critical'
tags: ['audit', 'DTF-001', 'documentation', 'consistency']
review_cycle: 'on-change'
framework_id: 'DTF-001'
target_scope: 'gtcx-core, gtcx-docs DTF framework, cross-repo references'
---

# DTF Documentation Consistency Audit

**Date:** 2026-06-03  
**Scope:** Defensibility Tiers Framework (DTF-001) rollout across docs, specs, audits, GTM, and sibling-repo collision checks  
**Canonical SoR:** [gtcx-docs/frameworks/defensibility-tiers/v1.0.0/](https://github.com/gtcx-ecosystem/gtcx-docs/tree/main/frameworks/defensibility-tiers/v1.0.0)

---

## Executive summary

| Area                                    | Verdict                                                                                           | Score |
| --------------------------------------- | ------------------------------------------------------------------------------------------------- | ----: |
| **DTF framework (gtcx-docs)**           | Internally consistent; one thin doc (`open-boundary.md`)                                          |  9/10 |
| **gtcx-core — updated files**           | Aligned (`gtm-reality-check`, `moat-completion` § strategic moat, `master-audit-2026-06-03` §1.6) |  9/10 |
| **gtcx-core — corpus drift**            | Many pre-06-03 audits/specs still use “90-day copy test” without DTF                              |  5/10 |
| **gtcx-protocols**                      | **Different** `T0`/`T1` = catalog coverage depth — not DTF; disambiguation required               |   N/A |
| **Audit framework prompts (gtcx-docs)** | Still mandate “90-day copy test” only                                                             |  4/10 |

**Overall documentation consistency for DTF:** **6.5/10** — framework is correct; **adoption incomplete** in historical audits, master roadmap, specs, and audit prompts.

---

## 1. DTF framework internal audit (gtcx-docs)

| File                               | Status      | Notes                                                      |
| ---------------------------------- | ----------- | ---------------------------------------------------------- |
| `README.md`                        | Pass        | Defines tier = defensibility × replication time; no Tier 0 |
| `tiers.md`                         | Pass        | Canonical Tier 1–5; disambiguates SEF / STRIDE             |
| `path-to-tier-5.md`                | Pass        | Milestones DTF-5.x; maps to algorithmic moat program       |
| `master-index.md`                  | Pass        | FAQ clear                                                  |
| `adoption-guide.md`                | Pass        | Attestation template                                       |
| `ecosystem-governance.md`          | Pass        | SoR = gtcx-docs                                            |
| `roadmap.md`                       | Pass        | Quarterly targets                                          |
| `open-boundary.md`                 | **Partial** | Decision matrix truncated; references “prior MRT draft”    |
| `moat-replication-tiers/README.md` | Pass        | Redirect only                                              |

**Finding DTF-F1 (Low):** `open-boundary.md` incomplete vs other framework docs — restore full decision matrix.

---

## 2. gtcx-core — aligned (post-update)

| File                                                            | DTF link | Tier language                   |
| --------------------------------------------------------------- | -------- | ------------------------------- |
| `01-docs/08-gtm/gtm-reality-check-2026-06-02.md`                | Yes      | Defensibility Tier 1–5 table    |
| `01-docs/05-audit/moat-completion-reconciliation-2026-06-03.md` | Yes      | § strategic moat; §6 Tier 5 row |
| `01-docs/05-audit/master-audit-2026-06-03.md`                   | Yes      | §1.6 DTF-001                    |

---

## 3. gtcx-core — drift (needs update or historical banner)

### 3.1 Audits (historical — still indexed)

| File                                      | Issue                                    | Severity                                 |
| ----------------------------------------- | ---------------------------------------- | ---------------------------------------- |
| `master-audit-2026-06-02.md`              | “90-day copy test” for algorithmic layer | Medium — add `_historical` + DTF pointer |
| `master-audit-2026-06-02-post-sprint2.md` | Same                                     | Medium                                   |
| `master-audit-2026-05-10.md`              | “90-day copy test” row                   | Low — historical                         |
| `full-audit-2026-06-01.md`                | § Competitive reality (90-day copy test) | Medium                                   |
| `full-audit-2026-05-09.md`                | § Competitive reality (90-day copy test) | Low                                      |

**Finding DTF-C1 (Medium):** Prior audits remain discoverable via `01-docs/05-audit/` without pointing to DTF-001; risk of agents citing stale moat claims.

**Remediation:** Add banner to audits dated before 2026-06-03:

```markdown
> **Historical moat framing.** Superseded by [DTF-001 Defensibility Tiers 1–5](https://github.com/gtcx-ecosystem/gtcx-docs/tree/main/frameworks/defensibility-tiers/v1.0.0). “90-day copy” = **Tier 1 only**.
```

### 3.2 Specs

| File                                                        | Issue                               | Severity                    |
| ----------------------------------------------------------- | ----------------------------------- | --------------------------- |
| `01-docs/specs/ai-evaluation-pipeline.md`                   | “90-day copy test” for ai-eval moat | Medium — maps to **Tier 4** |
| `01-docs/specs/packages/jurisdiction-config.md` | No DTF link; Tier 5 packs implied   | Low                         |
| `01-docs/specs/packages/crypto.md`              | No DTF tier callout                 | Low                         |

**Finding DTF-C2 (Medium):** Package/spec moat language not tied to DTF tiers.

### 3.3 Roadmaps & programs

| File                                                                     | Issue                                                      | Severity                               |
| ------------------------------------------------------------------------ | ---------------------------------------------------------- | -------------------------------------- |
| `01-docs/roadmap.md` §4.10                                               | “90-day copy test” for ai-eval                             | Medium                                 |
| `01-docs/05-audit/agile/roadmap/algorithmic-moat-program-2026-06-02.md`  | Opening claims “copyable in 90 days” for algorithmic layer | **High** — contradicts Tier 2 achieved |
| `01-docs/05-audit/moat-completion-reconciliation-2026-06-03.md` §1 table | Track A still says “Sprint 5 blocked”                      | **High** — S5 done 2026-06-03          |

**Finding DTF-C3 (High):** `moat-completion` §1 track table stale (Sprint 5).

**Finding DTF-C4 (High):** Algorithmic moat program executive summary still pre–AM-1 / pre–DTF.

### 3.4 Entry points

| File                         | Issue                                  |
| ---------------------------- | -------------------------------------- |
| `AGENTS.md`                  | No DTF-001 pointer for moat/GTM claims |
| `01-docs/overview/README.md` | No DTF pointer                         |
| `README.md`                  | No defensibility tier snapshot         |

**Finding DTF-C5 (Medium):** Session-start paths omit canonical moat framework.

### 3.5 master-audit-2026-06-03 self-drift

| Item           | Issue                                                       |
| -------------- | ----------------------------------------------------------- |
| P2-06          | Claims GTM stale — **fixed** in same session as DTF rollout |
| Remediation #2 | Marked done but P2-06 still listed open                     |

**Finding DTF-C6 (Low):** Fresh audit findings list partially resolved items.

---

## 4. gtcx-protocols — tier collision (not DTF drift)

| Namespace                          | Meaning                 | Example                                       |
| ---------------------------------- | ----------------------- | --------------------------------------------- |
| **DTF Defensibility Tier 1–5**     | Replication time / moat | Tier 2 = ZKP stack (~6–12 mo)                 |
| **Protocols catalog T0 / T1 / T2** | Schema coverage depth   | `commodity-catalog.md`: T0 universal, T1 deep |
| **Protocols roadmap**              | “T0 universal contract” | Sprint / coverage strategy                    |

**Finding DTF-X1 (Info):** Do **not** rename protocols T0/T1. Require explicit prefix in cross-repo docs: **“DTF Tier”** vs **“catalog T0”**.

**File:** `gtcx-protocols/01-docs/08-gtm/sovereign-positioning.md` § “90-day copy test” — valid protocols narrative; optional footnote linking DTF for `gtcx-core` crypto depth.

---

## 5. gtcx-docs audit framework (ecosystem)

| File                                                     | Issue                                   |
| -------------------------------------------------------- | --------------------------------------- |
| `01-docs/05-audit/prompts/forensic-full-audit-prompt.md` | Requires “90-day copy test” without DTF |
| `01-docs/05-audit/prompts/forensic-master-prompt.md`     | Same                                    |

**Finding DTF-H1 (High for future audits):** New audits will keep producing stale moat sections until prompts reference DTF-001 § tiers.md.

**Remediation:** Add to Phase 1.3 GTM: “Apply DTF-001 Defensibility Tiers 1–5; state achieved tier with evidence. Legacy phrase ‘90-day copy test’ = Tier 1 only.”

---

## 6. Cross-repo spot check (unchanged / expected)

| Repo                              | DTF adoption | Note                                      |
| --------------------------------- | ------------ | ----------------------------------------- |
| `gtcx-infrastructure`             | None         | Uses own 90-day moat prose in audits — OK |
| `gtcx-intelligence`               | None         | Own moat-assessment.md                    |
| `gtcx-hardware`, `terra-os`, etc. | None         | Product-specific 90-day tests             |

No action required outside `gtcx-core` + `gtcx-docs` unless ecosystem-wide prompt update is scheduled.

---

## 7. Remediation priority (gtcx-core + gtcx-docs)

| P   | Action                                                                        | Owner              | Files                                          |
| --- | ----------------------------------------------------------------------------- | ------------------ | ---------------------------------------------- |
| P0  | Fix Sprint 5 “blocked” in moat-completion §1                                  | protocol-architect | `moat-completion-reconciliation-2026-06-03.md` |
| P0  | Update algorithmic moat program exec summary → Tier 2 achieved, Tier 5 target | protocol-architect | `algorithmic-moat-program-2026-06-02.md`       |
| P1  | Link DTF in `roadmap.md` §4.10 + `ai-evaluation-pipeline.md`                  | protocol-architect | 2 files                                        |
| P1  | Complete `open-boundary.md` in gtcx-docs                                      | gtcx-docs          | 1 file                                         |
| P1  | Historical banners on Jun 02 and earlier audits                               | quality-evidence   | 4–5 files                                      |
| P2  | `AGENTS.md` + `01-docs/overview/README.md` DTF pointer                        | protocol-architect | 2 files                                        |
| P2  | Update forensic audit prompts (gtcx-docs)                                     | gtcx-docs          | 2 prompts                                      |

---

## 8. Verification

| Check                                                                   | Result                                        |
| ----------------------------------------------------------------------- | --------------------------------------------- |
| No `moat-replication-tiers/v1.0.0` links in gtcx-core (except redirect) | Pass — all point to `defensibility-tiers`     |
| No `T0` defensibility tier in DTF framework                             | Pass                                          |
| `gtm-reality-check` uses Defensibility Tier table                       | Pass                                          |
| `pnpm docs:check-links` (gtcx-core)                                     | Not re-run this audit — run after P0/P1 edits |

---

## Agent attestation

- [x] Read DTF framework v1.0.0 (all 8 files)
- [x] Grepped gtcx-core + gtcx-docs + protocols for MRT/T0/DTF/90-day
- [x] Identified protocols catalog T0/T1 as separate namespace

---

_Next review: after P0/P1 remediation or DTF v1.1.0._
