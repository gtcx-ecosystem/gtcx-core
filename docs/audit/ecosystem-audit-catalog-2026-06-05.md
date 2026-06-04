---
title: 'Ecosystem audit catalog — gtcx-core lens'
status: current
date: 2026-06-05
owner: gtcx-core
role: quality-evidence-lead
document_id: AUDIT-ECOSYSTEM-CATALOG-2026-06-05
tier: critical
tags: ['audit', 'ecosystem', 'index', 'cross-repo']
review_cycle: on-change
related:
  - readiness-model.md
  - ../gtcx-docs/docs/audit/INDEX.md
---

# Ecosystem audit catalog — gtcx-core lens

**Purpose:** `gtcx-core/docs/audit/` has **~57** forensic files — but audits also live in **gtcx-docs** (framework + hub), **gtcx-agile** (per-repo reports + V1 reconciliation), and **gtcx-agentic** (execution + ER evidence). This catalog links them so five-lane readiness does not ignore ecosystem SoR.

**Ecosystem master index:** [gtcx-docs/docs/audit/INDEX.md](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/docs/audit/INDEX.md)

---

## Where audits live (by repo)

| Repo             | Role                                                                    | Primary paths                                                                                                                | Approx. volume              |
| ---------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| **gtcx-docs**    | Constitution, templates, **audit framework v1 + v2**, ecosystem tracker | `tools/audit/audit-framework/`, `tools/audit/v2/`, `docs/audit/INDEX.md`, `docs/audit/ecosystem-audit-tracker-2026-05-26.md` | 85+ audit-related files     |
| **gtcx-agile**   | **Per-repo audit reports**, V1 SSOT, sprint reconciliation              | `docs/audits/reports/`, `docs/v1-shipping/reconciliation-index.md`, `docs/audit/master-audit-reconcile-2026-06-02.md`        | 17+ report MD + JSON ingest |
| **gtcx-agentic** | Agent execution audits, ER/EAP evidence, framework mirror               | `docs/audit/`, `tools/audit-framework/` (partial), MCP audit tools                                                           | 19+ `docs/audit/*.md`       |
| **gtcx-core**    | Repo-local forensic + five-lane indexes                                 | `docs/audit/` (this folder)                                                                                                  | ~57 `*.md` at root          |

---

## gtcx-docs — audit framework (all repos)

**Entry:** [tools/audit/audit-framework/AGENT-START.md](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/tools/audit/audit-framework/AGENT-START.md)

**Commands** ([commands.json](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/tools/audit/audit-framework/commands.json)) — each produces `docs/audit/<type>-<DATE>.md` + optional `audit-output-<DATE>.json`:

| Command                                 | Output type                    | Maps to gtcx-core lane |
| --------------------------------------- | ------------------------------ | ---------------------- |
| `master-audit` / `comprehensive-audit`  | master-audit                   | 4 Bank-grade           |
| `forensic-audit`                        | forensic-audit                 | 1 Engineering          |
| `full-audit`                            | (prompt in docs/audit/prompts) | 1 + 4                  |
| `10-10-roadmap`                         | 10-10-roadmap                  | 1 + 3 + 4              |
| `doc-standard`                          | docs-standard-compliance       | 2 Internal compliance  |
| `repo-hygiene` / `execute-repo-hygiene` | repo-hygiene                   | 1 + 2                  |
| `verification-audit`                    | anti-inflation                 | 4 Bank-grade           |
| `security-audit`                        | security-audit                 | 2 + 3                  |
| `gtm-audit`                             | gtm-audit                      | 5 GTM-Readiness        |
| `ux-audit` / `worldclass-ux-audit`      | UX                             | N/A (library)          |
| `docs-machine-readable`                 | frontmatter                    | 2                      |
| `repo-overview`                         | overview                       | 1 (docs)               |

**Audit v2:** [tools/audit/v2/README.md](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/tools/audit/v2/README.md) · hub [audit-framework-v2-index.md](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/docs/audits/audit-framework-v2-index.md) (XR-521) — dual output: Markdown + `audit-output.json`.

**Ecosystem-wide scores:** [ecosystem-audit-tracker-2026-05-26.md](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/docs/audit/ecosystem-audit-tracker-2026-05-26.md) — **gtcx-core 8.9/10** @ 2026-05-26 fresh audit.

**Ecosystem master audits:** `tools/audit/audit-framework/docs/audit/master-ecosystem-audit-2026-05-26.md` (all repos matrix).

**Sister-repo audit:** [docs/audit/2026-Q2/agentic/sister-repo-audit-2026-05-22.md](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/docs/audit/2026-Q2/agentic/sister-repo-audit-2026-05-22.md) — gtcx-core **92/100**.

**Protocol 16:** [docs/governance/protocols/16-audit-standard/](https://github.com/gtcx-ecosystem/gtcx-docs/tree/main/docs/governance/protocols/16-audit-standard)

---

## gtcx-agile — reports & coordination (gtcx-core listed as `2-core`)

| Document                                                                                                                                            | What it says about gtcx-core                                   | Score               | Staleness                                                 |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ------------------- | --------------------------------------------------------- |
| [2-core-audit.md](https://github.com/gtcx-ecosystem/gtcx-agile/blob/main/docs/audits/reports/2-core-audit.md)                                       | Implementation-truth audit (Mar 2026)                          | **6/10** overall    | **Stale** — pre–10/10 signoff, no ZKP/jurisdiction Tier 5 |
| [ecosystem-audit-post-2026-05-28.md](https://github.com/gtcx-ecosystem/gtcx-agile/blob/main/docs/audits/reports/ecosystem-audit-post-2026-05-28.md) | Points to `master-audit-2026-05-28`                            | **8.9**             | Aligns with core                                          |
| [v1-shipping/reconciliation-index.md](https://github.com/gtcx-ecosystem/gtcx-agile/blob/main/docs/v1-shipping/reconciliation-index.md)              | Canonical: `latest.json` internal **10.0** / composite **8.9** | 10.0 / 8.9          | **Preferred SSOT** for scores                             |
| [v1-shipping/ecosystem-v1-ssot.md](https://github.com/gtcx-ecosystem/gtcx-agile/blob/main/docs/v1-shipping/ecosystem-v1-ssot.md)                    | Tier 1 core — hold, API smoke                                  | 10.0 int / 8.9 comp | Active                                                    |
| [audit-2026-03-28.md](https://github.com/gtcx-ecosystem/gtcx-agile/blob/main/docs/reports/audit-2026-03-28.md)                                      | Cross-repo code findings (C7 ZKP stub, etc.)                   | Finding-level       | Historical — many fixed                                   |
| [master-audit-reconcile-2026-06-02.md](https://github.com/gtcx-ecosystem/gtcx-agile/blob/main/docs/audit/master-audit-reconcile-2026-06-02.md)      | Reconcile pass                                                 | —                   | Coordination                                              |
| [audit-ingest-state.json](https://github.com/gtcx-ecosystem/gtcx-agile/blob/main/docs/audits/audit-ingest-state.json)                               | Machine ingest of v2 JSON outputs                              | —                   | Ops                                                       |

**Note:** [gtcx-docs INDEX](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/docs/audit/INDEX.md) still lists gtcx-core report only under `2-core-audit.md` — **should also cite** `gtcx-core/docs/audit/master-audit-2026-06-03.md`.

---

## gtcx-agentic — agent platform audits

| Document                                                                                                                                                                     | Relevance to gtcx-core                                     |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| [master-audit-2026-06-02.md](https://github.com/gtcx-ecosystem/gtcx-agentic/blob/main/docs/audit/master-audit-2026-06-02.md)                                                 | Agentic repo score (not core)                              |
| [er-1-08-eap-phase-b-evidence-pointer-2026-06-03.md](https://github.com/gtcx-ecosystem/gtcx-agentic/blob/main/docs/audit/er-1-08-eap-phase-b-evidence-pointer-2026-06-03.md) | **EAP staging proof** — links core coordination + evidence |
| [execution-roadmap.md](https://github.com/gtcx-ecosystem/gtcx-agentic/blob/main/docs/audit/execution-roadmap.md)                                                             | EAP-02 owned by gtcx-core                                  |
| [exr-pack-audit-2026-06-02.md](https://github.com/gtcx-ecosystem/gtcx-agentic/blob/main/docs/audit/exr-pack-audit-2026-06-02.md)                                             | UX/doc ops                                                 |
| MCP `mcp/tools/audit.ts`                                                                                                                                                     | Programmatic audit runner                                  |

---

## gtcx-core — local forensic inventory (by five lane)

### Lane 1 — Engineering (~57 files subset)

| Audit                                                  | Date       |
| ------------------------------------------------------ | ---------- |
| internal-10-10-signoff-2026-05-28                      | 2026-05-28 |
| internal-completion-audit-2026-05-21                   | 2026-05-21 |
| full-audit-2026-06-04, full-audit-2026-06-01           | 2026-06    |
| ci-confirmation-2026-06-01                             | 2026-06    |
| fuzz-campaign-evidence-2026-05-21                      | 2026-05    |
| moat-dimension-roadmap-10-10, algorithmic-moat-sprint2 | moat       |
| 10-10-roadmap-\* (multiple dates)                      | roadmap    |
| anti-inflation-audit-results-2026-05-11                | 2026-05    |

### Lane 2 — Internal compliance

| Audit                                          | Score |
| ---------------------------------------------- | ----: |
| docs-standard-compliance-2026-06-05            |   9.6 |
| repo-hygiene-2026-06-05                        |   9.6 |
| dtf-documentation-consistency-audit-2026-06-03 |     — |

### Lane 3 — Industry Compliance

| Audit                                     | Tier / status       |
| ----------------------------------------- | ------------------- |
| industry-compliance-2026-06-05            | **IC-T0** aggregate |
| external-dependencies-register-2026-05-28 | OPEN 0/12 complete  |
| 10-10-remediation-plan-2026-05-27         | R5 industry track   |

### Lane 4 — Bank-grade

| Audit                                                        |         Composite |
| ------------------------------------------------------------ | ----------------: |
| master-audit-2026-06-03 (latest narrative)                   |               8.9 |
| master-audit-2026-05-28, master-audit-2026-05-27-\* (series) |               8.9 |
| gtcx-ecosystem-rating-2026-05-08                             | ecosystem context |

### Lane 5 — GTM-Readiness

| Audit                                 | Tier / location                              |
| ------------------------------------- | -------------------------------------------- |
| gtm-readiness-2026-06-05              | **GR-T1** library · sovereign **&lt; GR-T2** |
| gtm-reality-check-2026-06-02          | docs/gtm/                                    |
| gtm-roadmap-10-10-internal-2026-06-01 | docs/gtm/                                    |

### Cross-cutting in core

| Audit                                    | Type             |
| ---------------------------------------- | ---------------- |
| execution-roadmap.md                     | FA + DTF program |
| auto-dev-state.md                        | Agent state      |
| protocols-namespace-collision-assessment | Integration      |
| gtcx-core-upstream-tracking.md           | Downstream       |

---

## Audit quality vs readiness (read carefully)

| Source                                                                                                        | Audit quality (1–10) | Readiness outcome   |
| ------------------------------------------------------------------------------------------------------------- | -------------------: | ------------------- |
| [2-core-audit.md](https://github.com/gtcx-ecosystem/gtcx-agile/blob/main/docs/audits/reports/2-core-audit.md) |        **4** (stale) | Old repo score 6/10 |
| [internal-10-10-signoff](internal-10-10-signoff-2026-05-28.md)                                                |                **9** | Gates 10.0          |
| [master-audit-2026-06-03](master-audit-2026-06-03.md)                                                         |              **8.5** | Composite 8.9       |
| [external-dependencies-register](external-dependencies-register-2026-05-28.md)                                |                **8** | Status OPEN 0/12    |

**Canonical:** [readiness-model.md](./readiness-model.md) — **1–10 = audit quality only**.

---

## Recommended read order (gtcx-core diligence)

1. [readiness-model.md](./readiness-model.md) — five lanes + 1–10 ranks
2. [latest.json](./latest.json) — machine-readable
3. [gtcx-agile v1-shipping/reconciliation-index](https://github.com/gtcx-ecosystem/gtcx-agile/blob/main/docs/v1-shipping/reconciliation-index.md) — ecosystem SSOT
4. [gtcx-docs ecosystem-audit-tracker](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/docs/audit/ecosystem-audit-tracker-2026-05-26.md) — 19-repo matrix
5. Forensic file for the lane you care about (table above)

---

## Gap / hygiene

- **gtcx-docs INDEX** should list `gtcx-core/docs/audit/master-audit-2026-06-03.md` not only agile `2-core-audit.md`.
- **gtcx-agile 2-core-audit** should carry superseded banner or refreshed score.
- **Five-lane indexes** in core are rollups — they do not replace running `/master-audit`, `/doc-standard`, etc. from gtcx-docs framework when refreshing.
