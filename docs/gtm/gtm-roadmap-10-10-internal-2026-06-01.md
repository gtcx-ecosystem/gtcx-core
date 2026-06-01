---
title: 'GTM Roadmap — 10/10 Internal (Engineering, DevEx, Documentation)'
status: 'current'
date: '2026-06-01'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-06-01/gtm-internal-roadmap'
trust_score: 85
autonomy_level: 'authorized'
tier: 'critical'
tags: ['gtm', 'roadmap', '10-10', 'internal']
review_cycle: 'on-change'
---

# GTM Roadmap — 10/10 Internal Track (2026-06-01)

> **Scope:** Engineering, developer experience, and documentation items **we can ship without external vendors**.  
> **Out of scope here:** Pen test report, SOC 2 Type 1 letter, CPA/FIPS boundary reviewer, 90-day P1-free time gate — see [10-10-roadmap-2026-05-25.md](../audit/10-10-roadmap-2026-05-25.md) (bank-grade composite).

---

## Two scores (do not conflate)

| Score                       | Value          | Meaning                                                                                                                                  |
| --------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Internal completion**     | **9.5 / 10**   | All 24/24 engineering-controlled items closed ([internal-completion-audit-2026-05-21](../audit/internal-completion-audit-2026-05-21.md)) |
| **Bank-grade composite**    | **8.9 / 10**   | Includes external attestation gaps ([master-audit-2026-05-27](../audit/master-audit-2026-05-27.md))                                      |
| **GTM stage (buyer today)** | **S2 Partial** | Library integrator + sovereign sandbox; not S3 enterprise procurement ([GTM assessment](#gtm-stage-snapshot) below)                      |

**This roadmap** closes the remaining **customer-visible doc/devEx gaps** and advances **trust automation** (ai-eval). It does **not** claim bank-grade 10.0 — that requires M3 external validation in the 10-10 program.

---

## Reconciliation status (2026-06-01)

| Surface                                              | Status         | Notes                                                                           |
| ---------------------------------------------------- | -------------- | ------------------------------------------------------------------------------- |
| `README.md`                                          | ✅ Reconciled  | Odd-length-hex blocker removed; 21/21 npm; last reviewed 2026-06-01 (`6456bfa`) |
| `docs/governance/trust-portal.md`                    | ✅ Reconciled  | Substrate packages live on npm (0.2.0 / 0.2.2)                                  |
| `docs/devops/runbooks/quality-runbook.md`            | ✅ Reconciled  | Package counts → 21 public                                                      |
| `docs/agile/.../engagement-readiness-sprint-roadmap` | ✅ Reconciled  | Task 2.4 complete                                                               |
| `docs/overview/README.md`                            | 🚧 This sprint | Still claims "release pending"; fixed in this pass                              |
| `docs/audit/full-audit-2026-06-01.md`                | 🚧 This sprint | Finding #1/#2 marked closed post-`6456bfa`                                      |
| `docs/gtm/*` (pack)                                  | ✅ Current     | Evidence pack; this file is the **execution roadmap**                           |
| `docs/roadmap.md` §4.10                              | ✅ Added       | ai-eval trust scorecard moat track                                              |

---

## Internal workstreams

### A. Documentation truth (P0 — sovereign front door)

| ID  | Item                                    | Status         | Verification                                                |
| --- | --------------------------------------- | -------------- | ----------------------------------------------------------- |
| D1  | README blockers match code              | ✅ Done        | No odd-length-hex in README internal blockers               |
| D2  | Trust portal 21/21 npm                  | ✅ Done        | `npm view @gtcx/resilience version` → 0.2.0                 |
| D3  | Overview + GTM pack sync                | 🚧 In progress | `docs/overview/README.md`, `docs/gtm/00-executive-brief.md` |
| D4  | Audit cross-links stale "open"          | 🚧 In progress | `full-audit-2026-06-01.md` synthesis table                  |
| D5  | Engagement roadmap Phase 1 issues #2/#9 | ✅ Historical  | Keep in doc as completed; status tables current             |

### B. Developer experience (P1)

| ID  | Item                                                | Status      | Verification                                    |
| --- | --------------------------------------------------- | ----------- | ----------------------------------------------- |
| X1  | `pnpm install && pnpm build && pnpm test` < 1h cold | ✅ Done     | README quickstart                               |
| X2  | All 21 packages `npm install @gtcx/*`               | ✅ Done     | Trust portal verify loop                        |
| X3  | Integration guide for runtime substrate             | ✅ Done     | `docs/specs/integration-guide.md`, ADR-014      |
| X4  | Optional `TURBO_*` / `OPENAI_API_KEY` org secrets   | ⏸️ Optional | `pnpm ops:check` — not a release blocker        |
| X5  | Published integration smoke for `createRuntime()`   | 📋 Planned  | `tests/integration/` runtime + offline scenario |

### C. Trust automation — ai-eval (P1 — moat)

| ID  | Item                                           | Status     | Verification                             |
| --- | ---------------------------------------------- | ---------- | ---------------------------------------- |
| T1  | `@gtcx/ai-eval` + `pnpm ai:evaluate`           | ✅ Done    | `packages/ai-eval/`                      |
| T2  | CI uploads `ai-scorecard.json`                 | 📋 Planned | `.github/workflows/ci.yml`               |
| T3  | `release:ga:evidence:check` includes scorecard | 📋 Planned | `tools/generate-ga-evidence-summary.mjs` |
| T4  | Trust portal links scorecard per version       | 📋 Planned | `docs/governance/trust-portal.md`        |
| T5  | Spec-drift rules (README, package count)       | 📋 Planned | `packages/ai-eval/src/`                  |

Canonical spec: [ai-evaluation-pipeline.md](../specs/ai-evaluation-pipeline.md) · Moat: [roadmap.md §4.10](../roadmap.md#410-gtcxai-eval--machine-readable-trust-scorecards-strategic-moat)

### D. Engineering hygiene (P2 — internal 10/10 polish)

| ID  | Item                                      | Status     | Verification                                                         |
| --- | ----------------------------------------- | ---------- | -------------------------------------------------------------------- |
| E1  | Architecture boundaries                   | ✅ Done    | `pnpm architecture:check`                                            |
| E2  | ≥95% branch coverage (testable pkgs)      | ✅ Done    | Internal completion audit                                            |
| E3  | Fuzz evidence                             | ✅ Done    | `docs/audit/fuzz-campaign-evidence-2026-05-21.md`                    |
| E4  | SLSA manifest per CI run                  | ✅ Done    | `pnpm provenance:generate`                                           |
| E5  | npm provenance attestations on registry   | 📋 Partial | `npm view @gtcx/crypto --json \| jq .dist.attestations` — often null |
| E6  | `@gtcx/ai-eval` publish to npm (optional) | 📋 Backlog | Not required for core GTM; workspace CLI sufficient                  |

---

## Sprint plan (internal only, 4 weeks)

### Week 1 — Doc reconciliation (complete)

- [x] README + trust portal + runbooks (`6456bfa`)
- [x] This roadmap file
- [ ] Overview + executive brief npm/release lines
- [ ] Close full-audit open doc findings

### Week 2 — Trust artifacts

- [ ] CI: `pnpm ai:evaluate --output artifacts/ai-scorecard.json`
- [ ] GA evidence gate: scorecard freshness
- [ ] Trust portal: link scorecard + verify command

### Week 3 — DevEx proof

- [ ] Integration test: `createRuntime()` + offline queue replay
- [ ] Update `docs/gtm/07-downstream-integration.md` with copy-paste path

### Week 4 — Freeze internal 10/10 signoff

- [ ] Run `pnpm ops:check`, `architecture:check`, `docs:check-links`, `release:ga:evidence:check`
- [ ] Publish [internal-10-10-signoff](../audit/internal-10-10-signoff-2026-05-28.md) delta or successor dated 2026-06-01
- [ ] Do **not** relabel bank-grade composite to 10.0 without M3 external artifacts

---

## GTM stage snapshot

**Highest stage where all dimensions are Ready:** **S1 MVP** (developer integrates via npm in < 1 day).

**S2 Pilot Ready:** **Partially Ready** — technical and npm surface yes; **trust** lacks delivered pen-test report (sovereign procurement will ask).

**S3 GA / S4 Enterprise:** **Not Ready** — SOC 2 letter, pen test, standard enterprise commercial wrapper for the _foundation library_ (buyers adopt via downstream products).

Full assessment: produced 2026-06-01 in session (see repo chat log) — refresh quarterly.

---

## References

| Doc                                                                                                       | Role                                  |
| --------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| [10-10-roadmap-2026-05-25.md](../audit/10-10-roadmap-2026-05-25.md)                                       | Bank-grade path (external milestones) |
| [engagement-readiness-sprint-roadmap](../agile/roadmap/engagement-readiness-sprint-roadmap-2026-05-22.md) | Sovereign customer-visible sprints    |
| [full-audit-2026-06-01.md](../audit/full-audit-2026-06-01.md)                                             | Six-phase forensic + sprint synthesis |
| [06-budget-readiness-plan.md](./06-budget-readiness-plan.md)                                              | External budget path to 10/10         |
