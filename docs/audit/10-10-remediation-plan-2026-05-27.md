---
title: 'GTCX Core — 10/10 Remediation Plan'
status: 'current'
date: '2026-05-27'
owner: 'quality-evidence-lead'
role: 'quality-evidence-lead'
tier: 'critical'
tags: ['roadmap', 'remediation', '10-10', 'audit', 'slsa', 'gtm', 'hygiene', 'ecosystem']
review_cycle: 'bi-weekly'
---

# gtcx-core — Comprehensive 10/10 Remediation Plan

> **Source audit:** [`master-audit-2026-05-27.md`](./master-audit-2026-05-27.md) (composite 8.9/10 honest)
> **Target:** 10.0/10 reference-grade
> **Gap:** 1.1 points
> **Estimated effort:** 8–12 weeks (3 FTE), with 4–6 weeks being external vendor scheduling

---

## Executive Summary

This plan closes the remaining 1.1-point gap to 10.0 across seven dimensions. The work is organized into four sprints:

| Sprint | Focus                                                 | Target Score | Duration |
| ------ | ----------------------------------------------------- | ------------ | -------- |
| S1     | Operational unblock + SLSA provenance + GTM execution | 9.3          | 2 weeks  |
| S2     | External validation engagement + ecosystem hardening  | 9.7          | 3 weeks  |
| S3     | Cross-repo contract enforcement + docs polish         | 9.9          | 2 weeks  |
| S4     | Reference-grade validation + 90-day stability         | 10.0         | 3 weeks  |

**Critical insight:** The largest single lift is external validation (pen-test + SOC 2). These are budgeted but not yet contracted. The second-largest lift is supply-chain trust (SLSA Build L3) — the pipeline is ready but has never executed a provenanced publish.

---

## 1. Why SLSA Build L3 Scores 7.5 (Not Higher)

### The Evidence

| Claim                                 | What We Found                                                               | Reality                                 |
| ------------------------------------- | --------------------------------------------------------------------------- | --------------------------------------- |
| "NPM_TOKEN present"                   | `ops:check` shows `npm-token` PASS                                          | True — token is configured at org scope |
| "Provenance manifest generates clean" | `pnpm provenance:generate` outputs `artifacts/provenance-manifest.json`     | True — local manifest is valid          |
| "Workflow ready"                      | `release.yml` has `id-token: write`, `pnpm release` includes `--provenance` | True — GitHub Actions is configured     |
| **"Build L3 achieved"**               | `npm view @gtcx/crypto --json \| jq '.dist.attestations'`                   | **NO_ATTESTATIONS**                     |

### The Root Cause

**SLSA Build L3 requires a Sigstore attestation on the npm registry — not just a local manifest.**

`gtcx-core` has published `@gtcx/crypto@2.0.0` and `@gtcx/crypto@3.1.0` to npm. Neither release has provenance attestations. The `release.yml` workflow:

1. Generates a **local provenance manifest** (`artifacts/provenance-manifest.json`) — this is a build artifact, not a registry attestation
2. Runs `pnpm release` which executes `changeset publish --provenance`
3. BUT the workflow only publishes on `workflow_dispatch`, and the published packages on npm show **zero attestations**

This means either:

- The publish was executed without the `--provenance` flag (e.g., manual publish)
- The `workflow_dispatch` trigger was never used for a real release
- The publish succeeded but provenance generation failed silently

### Why 7.5 Is the Right Score

Per `SCORING_FRAMEWORK.md` score anchors:

| Level                 | Score   | What It Means                                                |
| --------------------- | ------- | ------------------------------------------------------------ |
| Source L2 enforced    | ~7.5    | Signed commits, branch protection, CODEOWNERS — all verified |
| Build L3 aspirational | +0.0    | Workflow exists but no registry attestations                 |
| **Combined**          | **7.5** | Strong source integrity; build integrity is intent-only      |

**To raise this to 10.0:** Execute a `workflow_dispatch` release, verify `npm view @gtcx/crypto --json | jq '.dist.attestations'` returns non-null Sigstore data, and document the verification command in the trust portal.

### Remediation (S1-5.1)

| Step | Action                                                                  | Owner                    | Verification                              |
| ---- | ----------------------------------------------------------------------- | ------------------------ | ----------------------------------------- | --------------------------------------------------------------------- |
| 5.1a | Trigger `release.yml` via `workflow_dispatch` during operational window | DevOps                   | Workflow completes green                  |
| 5.1b | Verify `npm view @gtcx/crypto --json                                    | jq '.dist.attestations'` | DevOps                                    | Returns non-null with `predicateType: https://slsa.dev/provenance/v1` |
| 5.1c | Document verification command in trust portal                           | Docs Lead                | `docs/governance/trust-portal.md` updated |
| 5.1d | Add `npm audit signatures @gtcx/crypto` to CI smoke test                | DevOps                   | New CI step passes                        |

---

## 2. Docs Remediation

### Current State

| Axis                | Score      | Status                     |
| ------------------- | ---------- | -------------------------- |
| Structural          | 9.5/10     | Canonical taxonomy present |
| Naming              | 9.5/10     | Kebab-case enforced        |
| Frontmatter         | 9.5/10     | **264/264 valid**          |
| Linking             | 10/10      | 406 files, zero broken     |
| Length              | 9.0/10     | Within limits              |
| Agentic Conventions | 9.5/10     | Conclusion-first structure |
| RAG Indexing        | 10/10      | Config excludes archives   |
| Master INDEX        | 9.5/10     | `docs/README.md` present   |
| **Overall**         | **9.4/10** |                            |

### Gaps to 10.0

| ID      | Finding                                                                                                      | Severity | Dimension | Effort | Owner                |
| ------- | ------------------------------------------------------------------------------------------------------------ | -------- | --------- | ------ | -------------------- |
| DOC-001 | `docs/remediation/` exists but `remediation-plan.md` is Phase 1 draft only — no execution authorized         | P2       | Docs      | 2d     | Protocol Architect   |
| DOC-002 | `docs/gtm/15-slsa-provenance-guide.md` references pending publish — will be stale until S1-5.1 completes     | P2       | Docs      | 0.5d   | Docs Lead            |
| DOC-003 | Performance budget trend docs lack narrative — 13 metrics have data but no analysis doc                      | P2       | Docs      | 1d     | Performance Engineer |
| DOC-004 | `docs/quality/10-10-remediation-tracker.md` KPIs show 0% CI pass rate — contradicts actual 45/45 task passes | P2       | Docs      | 0.5d   | Quality Lead         |
| DOC-005 | No automated docs-standard gate in `release.yml` — frontmatter/link checks run manually                      | P2       | Docs      | 1d     | DevOps               |
| DOC-006 | `docs/gtm/responses/` — 5 market trackers all show "Awaiting first contact" with no sent-date evidence       | P2       | GTM Docs  | 0.5d   | GTM Lead             |

### Remediation Plan

**S1 — Docs hardening (2 person-days)**

- [ ] **DOC-001:** Approve and execute `docs/remediation/remediation-plan.md` — or archive it if superseded by this plan
- [ ] **DOC-002:** Update SLSA guide with actual attestation verification steps post-S1-5.1
- [ ] **DOC-003:** Write `docs/quality/performance-budget-analysis.md` interpreting the 13 metrics
- [ ] **DOC-004:** Fix `docs/quality/10-10-remediation-tracker.md` KPIs to reflect actual CI state (45/45 pass)
- [ ] **DOC-005:** Add `pnpm docs:check-frontmatter && pnpm docs:check-links` to `release.yml` as mandatory gate
- [ ] **DOC-006:** Add "Sent: Y/N" and "Date sent" columns to each market response tracker

**Verification:** `pnpm docs:check-frontmatter && pnpm docs:check-links` passes with 0 errors in CI.

---

## 3. Folder & Repo Hygiene Remediation

### Current State

| Axis                    | Score      | Status                      |
| ----------------------- | ---------- | --------------------------- |
| Root cleanliness        | 9.5/10     | Good                        |
| Per-directory README    | 9.0/10     | Good                        |
| Build-artifact tracking | 10/10      | Clean                       |
| Archive handling        | 10/10      | Clean                       |
| Naming consistency      | 9.0/10     | 14 `export *` barrels noted |
| File-size outliers      | 10/10      | Clean                       |
| IDE/OS junk             | 10/10      | Clean                       |
| Empty/orphan dirs       | 10/10      | Clean                       |
| **Overall**             | **9.6/10** |                             |

### Gaps to 10.0

| ID      | Finding                                                                                              | Severity | Dimension | Effort | Owner              |
| ------- | ---------------------------------------------------------------------------------------------------- | -------- | --------- | ------ | ------------------ |
| HYG-001 | 3 org secrets unset (`OPENAI_API_KEY`, `TURBO_TOKEN`, `TURBO_TEAM`) — `ops:check` shows 3 warns      | P2       | Hygiene   | 0.5d   | DevOps             |
| HYG-002 | 14 `export *` barrel files defeat tree-shaking — `packages/api-client/src/index.ts:1` is one example | P2       | Hygiene   | 3d     | Engineering Lead   |
| HYG-003 | `docs/agile/sprints/current.md` is a skeleton — no committed work items for Sprint S46               | P2       | Hygiene   | 0.5d   | Protocol Architect |
| HYG-004 | No `.gitattributes` for consistent line endings across OS                                            | P3       | Hygiene   | 0.5d   | DevOps             |
| HYG-005 | `packages/ai/` is scaffolding (50%+ coverage) but has no explicit maturity warning in README         | P2       | Hygiene   | 0.5d   | Docs Lead          |

### Remediation Plan

**S1 — Hygiene sprint (1 person-day)**

- [ ] **HYG-001:** Set org secrets via GitHub CLI:
  ```bash
  gh secret set OPENAI_API_KEY --org gtcx-ecosystem --visibility all
  gh secret set TURBO_TOKEN --org gtcx-ecosystem
  gh variable set TURBO_TEAM --org gtcx-ecosystem --body "<team-slug>"
  ```
- [ ] **HYG-002:** Add tracking issue for barrel refactoring — not blocking 10.0 but must be tracked
- [ ] **HYG-003:** Populate `docs/agile/sprints/current.md` with Sprint S46 committed items from this plan
- [ ] **HYG-004:** Add `.gitattributes` with `* text=auto eol=lf`
- [ ] **HYG-005:** Add `MATURITY: Scaffolding` badge to `packages/ai/README.md`

**Verification:** `pnpm ops:check` shows 11 pass, 0 warn, 0 fail.

---

## 4. GTM Docs Remediation

### Current State

GTM docs are comprehensive but execution is lagging documentation:

| Document                              | Status                       | Gap                        |
| ------------------------------------- | ---------------------------- | -------------------------- |
| `00-executive-brief.md`               | Current                      | None                       |
| `01-security-posture.md`              | Current                      | None                       |
| `02-compliance-matrix.md`             | Current                      | None                       |
| `03-fips-readiness.md`                | Current                      | None                       |
| `09-pre-submission-email-zimbabwe.md` | Drafted                      | **Not sent**               |
| `10-pre-submission-email-namibia.md`  | Drafted                      | **Not sent**               |
| `11-pre-submission-email-zambia.md`   | Drafted                      | **Not sent**               |
| `13-pre-submission-email-ghana.md`    | Drafted                      | **Not sent**               |
| `responses/*.md` (5 markets)          | All "Awaiting first contact" | **No emails sent**         |
| `15-slsa-provenance-guide.md`         | Current                      | References pending publish |

### Gaps to 10.0

| ID      | Finding                                                                             | Severity | Dimension | Effort  | Owner                  |
| ------- | ----------------------------------------------------------------------------------- | -------- | --------- | ------- | ---------------------- |
| GTM-001 | Zimbabwe pre-submission email not sent — highest-priority market                    | P1       | GTM       | 0.5d    | GTM Lead               |
| GTM-002 | Namibia, Zambia, Ghana emails not sent                                              | P2       | GTM       | 1d      | GTM Lead               |
| GTM-003 | No regulator response captured in any market                                        | P2       | GTM       | Ongoing | GTM Lead               |
| GTM-004 | `06-budget-readiness-plan.md` may be stale — needs review against current 8.9 score | P2       | GTM       | 0.5d    | Product Lead           |
| GTM-005 | No case study from live pilot (none exists yet)                                     | P2       | GTM       | N/A     | Deferred to post-pilot |

### Remediation Plan

**S1 — GTM execution sprint (2 person-days)**

- [ ] **GTM-001:** Send Zimbabwe email to `fintech@rbz.co.zw`; log in `docs/gtm/responses/zimbabwe-2026-05-11.md`
- [ ] **GTM-002:** Send Namibia, Zambia, Ghana emails; update respective response trackers
- [ ] **GTM-003:** Set calendar reminder to follow up on all 5 markets at 7-day intervals
- [ ] **GTM-004:** Review and update `06-budget-readiness-plan.md` with current scores and evidence
- [ ] **GTM-005:** Create `docs/gtm/case-studies/README.md` as a placeholder for first pilot case study

**Verification:** At least 1 market response tracker shows "Sent: <date>" and at least 1 shows "Response received: <date>" within 30 days.

---

## 5. Ecosystem Integration Remediation

### Current State

Ecosystem Integration is the most volatile dimension — scored 6.5/10 in the 2026-05-08 ecosystem rating but 9.3/10 in the 2026-05-27 master audit. The variance comes from whether "integration" means "packages are consumed" (true) or "contracts are enforced across repos" (not fully true).

| Evidence                                       | Status            |
| ---------------------------------------------- | ----------------- |
| 14 downstream repos consume `@gtcx/*` packages | Verified          |
| ADR-012 ecosystem integration at Stage 0       | Verified          |
| Continental predicates (Ext-1) shipped         | Verified          |
| Migration bridge helper exists                 | Verified          |
| Cross-repo contract enforcement                | **Not verified**  |
| Publish-and-consume validation                 | **Not automated** |

### Gaps to 10.0

| ID      | Finding                                                                                | Severity | Dimension | Effort | Owner              |
| ------- | -------------------------------------------------------------------------------------- | -------- | --------- | ------ | ------------------ |
| ECO-001 | No automated check that downstream repos use latest `@gtcx/*` versions                 | P2       | Ecosystem | 3d     | Platform Engineer  |
| ECO-002 | `docs/agile/cross-repo-coordination.md` has open items but no closure dates            | P2       | Ecosystem | 0.5d   | Protocol Architect |
| ECO-003 | No integration test matrix running across downstream repos                             | P2       | Ecosystem | 5d     | Platform Engineer  |
| ECO-004 | `adr-012-ecosystem-integration.md` is Stage 0 — needs Stage 1 handoff evidence         | P2       | Ecosystem | 1d     | Protocol Architect |
| ECO-005 | Sister repos may have stale copies of audit prompts (per `gtcx-agentic` overlay rules) | P2       | Ecosystem | 2d     | Quality Lead       |

### Remediation Plan

**S2 — Ecosystem hardening (3 person-days)**

- [ ] **ECO-001:** Add `pnpm ecosystem:check-versions` script that greps downstream `package.json` files for outdated `@gtcx/*` deps
- [ ] **ECO-002:** Add target closure dates to all open items in `docs/agile/cross-repo-coordination.md`
- [ ] **ECO-003:** Create `tests/integration/downstream-smoke/` with minimal import tests for top 5 consumers
- [ ] **ECO-004:** Update `adr-012-ecosystem-integration.md` with Stage 1 completion evidence
- [ ] **ECO-005:** Run `find .. -path "*/audit-framework/*" -name "*.md"` to detect stale prompt copies; file removal PRs

**Verification:** `pnpm ecosystem:check-versions` runs without detecting unpatched major-version drift on `@gtcx/crypto` or `@gtcx/types`.

---

## 6. Security & Enterprise Remediation (Carry-Forward)

These items are unchanged from prior audits but remain on the critical path:

| ID      | Finding                                          | Severity | Sprint | Effort | Owner                |
| ------- | ------------------------------------------------ | -------- | ------ | ------ | -------------------- |
| SEC-007 | 3 `rustls-webpki` RUSTSECs (0098, 0099, 0104)    | P2       | S1     | 2d     | Rust Lead            |
| SEC-008 | SLSA provenance publish (see §1 above)           | P2       | S1     | 1d     | DevOps               |
| SEC-009 | Pen-test vendor not selected                     | **P1**   | S1-S2  | 10d    | Security Lead        |
| SEC-010 | 3 org secrets unset                              | P2       | S1     | 0.5d   | DevOps               |
| ENT-001 | SOC 2 Type 1 readiness → engagement              | P1       | S2     | 14d    | Compliance Lead      |
| ENT-002 | 13 performance budget metrics lack trend samples | P2       | S2     | 2d     | Performance Engineer |
| ENT-003 | DR runbook drill not yet conducted               | P2       | S3     | 1d     | DevOps               |

---

## 7. New Issues Discovered in This Audit

| ID          | Finding                                                                                                                      | Severity | Why It Was Missed Before                                        |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------- |
| **NEW-001** | SLSA provenance is locally generated but **never published** — `npm view` shows NO_ATTESTATIONS despite 2 published versions | P1       | Prior audits assumed "workflow ready" = "Build L3 achieved"     |
| **NEW-002** | `docs/quality/10-10-remediation-tracker.md` shows CI pass rate 0% — contradicts actual 45/45 task passes                     | P2       | Tracker not synced with CI reality                              |
| **NEW-003** | `docs/agile/sprints/current.md` is an empty skeleton with no committed work items                                            | P2       | Created in this audit session; needs population                 |
| **NEW-004** | `docs/remediation/remediation-plan.md` is explicitly "Phase 1 only — no execution authorized" — a plan that plans to plan    | P2       | Status was clear in the doc itself but not tracked as a blocker |
| **NEW-005** | No `npm audit signatures` verification in CI — provenance could break silently                                               | P2       | Not in prior audit scope                                        |

---

## 8. Sprint Mapping

### Sprint 1: Operational Unblock + SLSA + GTM (2 weeks)

**Goal:** Close every free gate. Execute first provenanced publish. Send first regulator email.

| Item                                        | ID               | Owner              | Effort |
| ------------------------------------------- | ---------------- | ------------------ | ------ |
| Set 3 org secrets                           | HYG-001          | DevOps             | 0.5d   |
| Trigger SLSA provenance publish             | SEC-008 / S1-5.1 | DevOps             | 1d     |
| Verify npm attestations                     | S1-5.1b          | DevOps             | 0.5d   |
| Fix rustls-webpki tracking                  | SEC-007          | Rust Lead          | 2d     |
| Send Zimbabwe email                         | GTM-001          | GTM Lead           | 0.5d   |
| Send Namibia, Zambia, Ghana emails          | GTM-002          | GTM Lead           | 1d     |
| Fix tracker KPIs                            | DOC-004          | Quality Lead       | 0.5d   |
| Add docs gates to CI                        | DOC-005          | DevOps             | 1d     |
| Populate Sprint S46                         | HYG-003          | Protocol Architect | 0.5d   |
| Select pen-test vendor                      | SEC-009          | Security Lead      | 5d     |
| Add `.gitattributes`                        | HYG-004          | DevOps             | 0.5d   |
| Add maturity badges to scaffolding packages | HYG-005          | Docs Lead          | 0.5d   |

**S1 DoD:**

- `pnpm ops:check`: 11 pass, 0 warn
- `npm view @gtcx/crypto --json | jq '.dist.attestations'` returns non-null
- At least 2 regulator emails sent with logged dates
- Pen-test vendor SOW signed or shortlist finalized

### Sprint 2: External Validation + Ecosystem (3 weeks)

**Goal:** Engage paid credibility providers. Harden cross-repo contracts.

| Item                                  | ID      | Owner                | Effort |
| ------------------------------------- | ------- | -------------------- | ------ |
| Pen-test execution                    | SEC-009 | Security Lead        | 10d    |
| SOC 2 CPA engagement                  | ENT-001 | Compliance Lead      | 5d     |
| Populate performance trends           | ENT-002 | Performance Engineer | 2d     |
| Add downstream version check          | ECO-001 | Platform Engineer    | 3d     |
| Cross-repo coordination closure dates | ECO-002 | Protocol Architect   | 0.5d   |
| Downstream smoke tests                | ECO-003 | Platform Engineer    | 5d     |
| ADR-012 Stage 1 evidence              | ECO-004 | Protocol Architect   | 1d     |
| Stale prompt copy cleanup             | ECO-005 | Quality Lead         | 2d     |

**S2 DoD:**

- Pen-test report received with ≤2 Medium findings
- CPA engagement letter signed
- `pnpm ecosystem:check-versions` passes
- ADR-012 updated to Stage 1

### Sprint 3: Polish + Stability (2 weeks)

**Goal:** Close P2 debt. Achieve 90-day stability baseline.

| Item                                     | ID      | Owner                | Effort |
| ---------------------------------------- | ------- | -------------------- | ------ |
| Conduct DR runbook drill                 | ENT-003 | DevOps               | 1d     |
| Barrel export tracking issue             | HYG-002 | Engineering Lead     | 1d     |
| Performance budget analysis doc          | DOC-003 | Performance Engineer | 1d     |
| Update SLSA guide with real attestations | DOC-002 | Docs Lead            | 0.5d   |
| Budget readiness plan refresh            | GTM-004 | Product Lead         | 0.5d   |
| Case study placeholder                   | GTM-005 | GTM Lead             | 0.5d   |
| Remediation plan execution or archive    | DOC-001 | Protocol Architect   | 2d     |

**S3 DoD:**

- All P2 findings closed or formally exempted with ADR
- `pnpm architecture:check`, `pnpm docs:check-links`, `pnpm test:coverage:critical` all pass
- DR drill post-mortem published

### Sprint 4: Reference-Grade Validation (3 weeks)

**Goal:** Verify 10.0 criteria.

| Item                                 | Owner           | Effort  |
| ------------------------------------ | --------------- | ------- |
| 90 consecutive days zero P1 findings | Quality Lead    | Ongoing |
| External auditor sign-off            | Compliance Lead | 5d      |
| Final master audit                   | Quality Lead    | 3d      |
| Trust portal refresh                 | Docs Lead       | 1d      |
| Investor evidence package            | Product Lead    | 2d      |

**S4 DoD:**

- Final master audit scores 10.0/10 with zero caps fired
- All verification gates pass in CI
- Working tree clean

---

## 9. Score Trajectory

| Milestone | Composite | Security | Enterprise | Resilience | Code Quality | Ecosystem | Agentic | Hygiene |
| --------- | --------- | -------- | ---------- | ---------- | ------------ | --------- | ------- | ------- |
| Now (8.9) | 8.9       | 8.0      | 8.5        | 9.0        | 9.5          | 9.3       | 9.2     | 9.5     |
| S1 (9.3)  | 9.3       | 8.5      | 8.8        | 9.2        | 9.5          | 9.3       | 9.2     | 9.8     |
| S2 (9.7)  | 9.7       | 9.5      | 9.3        | 9.5        | 9.5          | 9.5       | 9.5     | 9.8     |
| S3 (9.9)  | 9.9       | 9.5      | 9.5        | 9.5        | 9.5          | 9.5       | 9.5     | 9.8     |
| S4 (10.0) | 10.0      | 10.0     | 9.8        | 9.8        | 9.8          | 9.8       | 9.8     | 10.0    |

---

## 10. Acceptance Criteria (10.0)

The repo is 10.0 when ALL of the following are true:

- [ ] `cargo audit` returns zero vulnerabilities OR documented exceptions for all findings
- [ ] `npm view @gtcx/crypto --json | jq '.dist.attestations'` returns non-null Sigstore provenance
- [ ] Pen-test report exists with no Critical / High findings open
- [ ] SOC 2 Type 1 readiness assessment complete OR CPA engagement letter signed
- [ ] `pnpm ops:check` shows 11 pass, 0 warn, 0 fail
- [ ] `pnpm docs:check-frontmatter && pnpm docs:check-links` passes in CI on every PR
- [ ] Zero P1 findings for 90 consecutive days
- [ ] At least 1 regulator response captured in `docs/gtm/responses/`
- [ ] `pnpm ecosystem:check-versions` passes (no unpatched major drift)
- [ ] DR runbook drill completed with post-mortem
- [ ] Performance budget trends have 4+ weeks of data for all 13 metrics
- [ ] All new issues (NEW-001 through NEW-005) closed

---

## 11. Risk Register

| Risk                                     | Likelihood | Impact   | Mitigation                                                     |
| ---------------------------------------- | ---------- | -------- | -------------------------------------------------------------- |
| Pen-test finds Critical vulnerability    | Low        | Critical | Incident runbook ready; rapid response team identified         |
| CPA finds gaps not in readiness analysis | Medium     | Medium   | Honest analysis; 6-week buffer before engagement               |
| Regulator response is "no"               | Medium     | Medium   | 5 markets in pipeline; first can be no                         |
| SLSA provenance publish fails            | Low        | High     | Dry-run validated; rollback plan: republish without provenance |
| rustls-webpki upstream fix delayed       | High       | Low      | Documented exceptions accepted by cargo audit; tracked         |
| CI billing exceeds budget                | Medium     | High     | Self-hosted runners fallback documented                        |

---

## 12. Cross-References

- [Master audit — 2026-05-27](./master-audit-2026-05-27.md)
- [Prior 10/10 roadmap — 2026-05-26](./10-10-roadmap-2026-05-26.md)
- [Prior remediation — 2026-05-11](./remediation-2026-05-11.md)
- [Trust Portal](../governance/trust-portal.md)
- [SOC 2 Readiness](../compliance/soc2-readiness.md)
- [Pen-Test Scope](../security/pen-test-scope.md)
- [SLSA Provenance Guide](../gtm/15-slsa-provenance-guide.md)
- [Engagement Readiness Roadmap](../agile/roadmap/engagement-readiness-sprint-roadmap-2026-05-22.md)

---

_Roadmap generated from §9 Honest Score Recalculation of [`master-audit-2026-05-27.md`](./master-audit-2026-05-27.md)._
