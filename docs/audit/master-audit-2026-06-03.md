---
audit_type: master
target_repo: gtcx-core
audit_date: '2026-06-03'
composite: 8.9
composite_raw: 8.89
investor: 8.9
enterprise: 8.7
sov_dfi: 9.0
p0_count: 0
p1_count: 3
p2_count: 5
caps_fired: 0
status: current
owner: quality-evidence-lead
role: quality-evidence-lead
tier: critical
tags: ['audit', 'master-audit', 'bank-grade', 'refresh']
review_cycle: quarterly
supersedes_note: 'Post-remediation refresh at bdfe7cb — doc-standard 9.6, repo hygiene P1–P4, Tier 5 technical ~88%'
---

# gtcx-core — Master Audit & Bank-Grade Certification

> **Lane 4 — Bank-grade only.** Do not use **8.9** for engineering, internal compliance, or GTM-Readiness. [readiness-model.md](./readiness-model.md) — five lanes; indexes: [engineering](./engineering-completeness-quality-2026-06-05.md) · [internal compliance](./internal-compliance-2026-06-05.md) · [Industry Compliance](./industry-compliance-2026-06-05.md) · [bank-grade](./bank-grade-2026-06-05.md) · [GTM-Readiness](./gtm-readiness-2026-06-05.md).

**Date:** 2026-06-03 (refresh)  
**Repo:** `gtcx-ecosystem/gtcx-core`  
**Branch:** `main` @ `bdfe7cb`  
**Auditor:** Cursor agent (master-audit framework)  
**Methodology:** `gtcx-docs/tools/audit/audit-framework/prompts/master/comprehensive-audit-prompt.md`  
**Reference:** `gtcx-docs/tools/audit/audit-framework/SCORING_FRAMEWORK.md`  
**Prior baseline:** morning pass (8.6 @ `6127da5`); [full-audit-2026-06-04.md](./full-audit-2026-06-04.md)

---

## Executive Summary (legacy blended lens)

| Dimension                    |      Score | Rating band                      |
| ---------------------------- | ---------: | -------------------------------- |
| **Core weighted (legacy)**   | **8.9/10** | Blended — see three lanes above  |
| Investor lens                |     8.9/10 | Strong platform asset            |
| Enterprise buyer lens        |     8.7/10 | Serious library; attestation gap |
| African sovereign / DFI lens |     9.0/10 | Strong crypto + resilience story |

**Verdict:** `gtcx-core` is a **reference-grade cryptographic foundation library** with **engineering readiness 9.5/10** (in-repo gates green). **Compliance attestation** and **ecosystem GTM** are separate lanes — pen-test, SOC 2 letter, ceremony (CORE-004 / XR-402), and sovereign stack pilots are **not** engineering blockers.

**Top 3 priorities (by lane):**

| Lane            | Priority                                                                  |
| --------------- | ------------------------------------------------------------------------- |
| Compliance      | XR-402 ceremony → CORE-004; EXT-INF-002 pen-test; SOC 2 Type I engagement |
| GTM (ecosystem) | OI-X02 infra hub ack; sandbox outreach (human send)                       |
| Engineering     | CORE-004 code after ceremony; optional network Phase 2                    |

> **Hardcore sanity check:** Post-remediation hygiene/docs uplift verified in-session. No score inflation on external attestation — pen-test/SOC 2 still absent (§9).

---

## Evidence Reviewed (Session — Protocol 27)

| Step | Command                                        | Exit | Result                                                |
| ---- | ---------------------------------------------- | ---: | ----------------------------------------------------- |
| V1   | `git log -1` @ `bdfe7cb`                       |    0 | 7 commits ahead of origin                             |
| V2   | `pnpm format:check`                            |    0 | All matched files formatted                           |
| V2   | `pnpm lint`                                    |    0 | 45/45 tasks                                           |
| V2   | `pnpm typecheck`                               |    0 | 45/45 tasks (turbo cycle **closed** — FA-P0-1)        |
| V2   | `pnpm architecture:check`                      |    0 | **24 packages**, **287** source files                 |
| V2   | `pnpm build`                                   |    0 | 25/25 tasks (turbo cache)                             |
| V3   | `pnpm test`                                    |    0 | **51/51** turbo tasks; integration **128** tests pass |
| V3   | `pnpm jurisdiction:validate-packs`             |    0 | **16/16** strict pack tests                           |
| V3   | `pnpm provenance:check-npm:strict`             |    0 | **22/22** Sigstore attestations                       |
| V4   | `pnpm docs:check-links`                        |    0 | **500** files                                         |
| V4   | `pnpm docs:check-frontmatter`                  |    0 | **280/280** valid                                     |
| V4   | `pnpm check:workspace-root-cleanliness:strict` |    0 | Status PASS                                           |
| V5   | `pnpm quality:governance:check`                |    0 | 14 scripts, 8 CODEOWNERS                              |
| V5   | `pnpm security:secret-scan`                    |    0 | 1298 files scanned                                    |
| V5   | `pnpm audit --audit-level=high`                |    0 | No known vulnerabilities                              |
| V5   | `pnpm ops:check`                               |    0 | **8 pass**, **3 warn**, 0 fail                        |
| V5   | `pnpm agent:coordination:check`                |    0 | Protocol 24 hygiene pass                              |
| P22  | `pnpm agent:next-work`                         |    0 | CORE-004 blocked (XR-402) — expected                  |

**Supporting audits (this cycle):** [docs-standard-compliance-2026-06-05.md](./docs-standard-compliance-2026-06-05.md) (9.6/10) · [repo-hygiene-2026-06-05.md](./repo-hygiene-2026-06-05.md) (9.6/10 post-bootstrap)

---

## 1. Initial State (Phase 1 — Pre-Improvement Baseline)

Morning snapshot @ `6127da5` before doc-standard P2 + repo hygiene bootstrap.

### 1.1 Architecture

| Dimension             | Score | Confidence | Top finding                                |
| --------------------- | ----: | :--------: | ------------------------------------------ |
| Spec fidelity         |  7/10 |     B      | README Tier-5 % stale; package count drift |
| Structural integrity  |  9/10 |     A      | Architecture check clean                   |
| Code quality          |  9/10 |     A      | Strong test matrix                         |
| Testability           |  9/10 |     A      | ZKP + integration depth                    |
| Operational readiness |  9/10 |     A      | CI comprehensive                           |
| Consistency           |  8/10 |     B      | Duplicate frontmatter in some docs         |

### 1.2 Security

Mechanical security **9.0/10**; **procurement trust** limited by absent third-party pen-test / SOC 2 letter. FIPS via aws-lc-rs (CMVP #4816); `#![deny(unsafe_code)]` in Rust crates; TS ZKP dev path placeholder-gated.

### 1.3 GTM

| Stage              | Status        | Notes                                    |
| ------------------ | ------------- | ---------------------------------------- |
| S1 Developer MVP   | **Ready**     | 22 npm packages + provenance             |
| S2 Sovereign pilot | **Not ready** | Ecosystem blockers (EXT-INF-002/014/015) |
| S3 GA              | Not ready     | No library MSA                           |

### 1.4 Hygiene (pre-bootstrap)

| Category         |  Score | Notes                            |
| ---------------- | -----: | -------------------------------- |
| Root cleanliness | 8.5/10 | No machine allowlist             |
| Docs standard    | 9.1/10 | P1 frontmatter failures          |
| Package READMEs  |   8/10 | 3 config packages missing README |

**Initial hygiene composite:** **8.7/10**

---

## 2. Doc Cleanup (Phase 2)

**Skipped** — only `/docs/` documentation root; no `_sop/`, `_cannon/`, `wiki/`, or `documentation/` competing roots.

---

## 3. Docs-Standard Compliance (Phase 3)

Executed in prior session commits `6ab4e8b`, `3a3bd67`, `30d1075`, `95a8bbb`. Re-verified this session.

| Axis         |      Score | Notes                                                                              |
| ------------ | ---------: | ---------------------------------------------------------------------------------- |
| Structural   |     9.4/10 | Single `/docs/` root                                                               |
| Naming       |    10.0/10 | P1 renames complete                                                                |
| Frontmatter  |    10.0/10 | **280/280** gate pass                                                              |
| Linking      |     9.8/10 | **500** files; trust-portal relative links                                         |
| Length       |     9.5/10 | Agile roadmaps split; historical audits exempt                                     |
| Agentic      |     9.0/10 | Protocol 22 + coordination bridge                                                  |
| RAG          |    10.0/10 | `baseline.config.ts` exclude contract                                              |
| Master INDEX |     8.8/10 | Refreshed 2026-06-03                                                               |
| **Overall**  | **9.6/10** | [docs-standard-compliance-2026-06-05.md](./docs-standard-compliance-2026-06-05.md) |

---

## 3.5 Repo Folder Hygiene (Phase 3.5)

Executed in `f512c0d` — policy bundle + CI gate.

| Axis                 |      Score | Notes                                                      |
| -------------------- | ---------: | ---------------------------------------------------------- |
| Root cleanliness     |      10/10 | `check:workspace-root-cleanliness:strict` PASS             |
| Per-directory README |     9.5/10 | Config package READMEs added                               |
| Build artifacts      |      10/10 | 0 tracked artifacts                                        |
| Archive handling     |       9/10 | `_archive/` gitignored                                     |
| Naming               |       9/10 | Root allowlist enforced                                    |
| Size outliers        |      10/10 | None >500KB tracked                                        |
| OS junk              |      10/10 | None tracked                                               |
| Empty dirs           |     8.5/10 | Minor empty dirs (mostly gitignored)                       |
| **Overall**          | **9.6/10** | [repo-hygiene-2026-06-05.md](./repo-hygiene-2026-06-05.md) |

**Repo / Folder Hygiene dimension input:** 9.6 × 0.6 (docs) + 9.6 × 0.4 (repo) = **9.6/10**

---

## 4. Post-Improvement State (Phase 4 — Re-Audit)

### 4.1 Architecture (post-remediation)

| Dimension             |      Score | Δ    | Evidence                                         |
| --------------------- | ---------: | ---- | ------------------------------------------------ |
| Spec fidelity         | **8.5/10** | +1.5 | README Tier-5 ~88%; packages README 24+4         |
| Structural integrity  |  **10/10** | +1   | FA-P0-1 turbo cycle closed; root typecheck green |
| Code quality          | **9.2/10** | +0.2 | 51 test tasks; jurisdiction strict Zod           |
| Testability           | **9.3/10** | +0.3 | `tier5-jurisdiction-proofs.test.ts` (14 tests)   |
| Operational readiness | **9.5/10** | +0.5 | Root hygiene CI step wired                       |
| Consistency           | **9.0/10** | +1   | Duplicate frontmatter merged; agile splits       |

**Architecture average:** **9.3/10**

### 4.2 Security — unchanged external gap

No third-party crypto audit report in tree. Mechanical controls remain strong. **Security phase: 8.8/10** (A/B).

### 4.3 GTM — unchanged deal posture

Sovereign pilot still requires infra + human gates. DTF Tier 5 **technical ~88%** — not commercial Tier 5.

### 4.4 Findings closed this cycle

| ID        | Finding                              | Closed by                                         |
| --------- | ------------------------------------ | ------------------------------------------------- |
| FA-P0-1   | workproof ↔ verification turbo cycle | Integration test relocation                       |
| FA-P0-4   | format:check drift                   | Agent-sync excluded / formatted                   |
| DOC-P1    | Frontmatter gate failures            | `6ab4e8b`                                         |
| DOC-P2    | Long operational docs                | Trust-portal, integration, overview, agile splits |
| RH-P1     | No repo hygiene policy               | `f512c0d`                                         |
| DTF-5.4.4 | Protocols E2E witness                | `73eaff2b` ack                                    |
| DTF-5.5.1 | Strict jurisdiction packs            | `pnpm jurisdiction:validate-packs`                |
| MA-P2-01  | Network maturity honesty badges      | `0b572f8` — README + overview matrix              |
| MA-P2-04  | Overview README vs audit scores      | `a48b0c7` Phase 7 + `0b572f8` feature matrix      |

### 4.5 Findings remaining

| Sev | ID       | Finding                          | Evidence                           |
| --- | -------- | -------------------------------- | ---------------------------------- |
| P1  | MA-P1-01 | No third-party pen-test report   | EXT-INF-002; trust portal gap      |
| P1  | MA-P1-02 | CORE-004 ceremony blocked        | `pnpm agent:next-work` → XR-402    |
| P1  | MA-P1-03 | Sovereign pilot ecosystem gates  | EXT-INF-014/015; not core-only     |
| P2  | MA-P2-02 | USSD protocol scaffolding        | connectivity profile enum only     |
| P2  | MA-P2-03 | `ops:check` 3 warns              | OPENAI*API_KEY, TURBO*\* org scope |
| P2  | MA-P2-05 | Historical audit docs >300 lines | Justified evidence retention       |

---

## 5. Bank-Grade Scorecard (Phase 5)

### 5.1 Core Dimensions

| Dimension                         | Weight |   Score | Confidence | Notes                                             |
| --------------------------------- | -----: | ------: | :--------: | ------------------------------------------------- |
| Code Quality                      |     15 | **9.2** |     A      | All gates green; 128 integration tests            |
| Repo / Folder Hygiene             |     10 | **9.6** |     A      | Doc 9.6 + repo 9.6 weighted                       |
| Security                          |     20 | **8.8** |    A/B     | Strong mechanical; no pen-test artifact           |
| Global South Resilience           |     15 | **9.1** |     A      | Offline queue, jurisdiction packs, sync           |
| Ecosystem Integration             |     15 | **9.2** |     A      | Protocols `73eaff2b`; downstream pins             |
| Agentic Maturity                  |     10 | **9.0** |     A      | ai-eval, P22, coordination bridge                 |
| Enterprise / Production Readiness |     15 | **8.3** |     B      | CI/provenance excellent; external attestation gap |

**Raw weighted:** (9.2×15 + 9.6×10 + 8.8×20 + 9.1×15 + 9.2×15 + 9.0×10 + 8.3×15) / 100 = **8.89**  
**Final core composite:** **8.9/10** (rounded)

### 5.2 Caps Applied

| Cap                                     | Triggered? | Finding                                       |
| --------------------------------------- | ---------- | --------------------------------------------- |
| Unresolved critical                     | **N**      | —                                             |
| 2+ unresolved high (consequential code) | **N**      | Pen-test is external process, not code defect |
| Money in process memory                 | **N**      | Library repo                                  |
| Non-durable audit                       | **N**      | Structured logging + telemetry                |
| Raw AI approves consequential           | **N**      | Human/CODEOWNER gates                         |
| Local placeholder authority             | **N**      | Real crypto primitives                        |
| No degraded-mode                        | **N**      | Offline queue + connectivity profiles         |

**Caps fired:** 0

### 5.3 Audience Lens Scores

#### Investor (8.9/10)

| Area                        | Weight | Score |
| --------------------------- | -----: | ----: |
| Technical differentiation   |     25 |   9.2 |
| Execution credibility       |     25 |   8.7 |
| Ecosystem leverage          |     20 |   9.2 |
| Commercialization readiness |     15 |   8.0 |
| Platform compounding        |     15 |   9.1 |

#### Enterprise buyer (8.7/10)

| Area                    | Weight | Score |
| ----------------------- | -----: | ----: |
| Control environment     |     25 |   8.6 |
| Security & auditability |     25 |   8.8 |
| Integration reliability |     20 |   9.2 |
| Operability             |     15 |   9.0 |
| Deployment readiness    |     15 |   8.2 |

#### African sovereign / DFI (9.0/10)

| Area                           | Weight | Score |
| ------------------------------ | -----: | ----: |
| Mission & regional fit         |     15 |   9.0 |
| Global South resilience        |     25 |   9.0 |
| Governance & trust             |     25 |   8.8 |
| Institutional interoperability |     15 |   9.4 |
| Long-term strategic value      |     20 |   9.1 |

### Delta vs morning audit (8.6)

| Area             | Δ        | Driver                                          |
| ---------------- | -------- | ----------------------------------------------- |
| Core             | **+0.3** | Hygiene CI + doc-standard P2 + FA-S1            |
| Repo hygiene dim | +0.9     | Machine allowlist + checker                     |
| Enterprise       | +0.3     | INDEX/truth alignment; still capped by pen-test |

---

## 6. Sprint Plan (6-Week Synthesis)

| Week | Theme                                              | Owner               | Exit                     |
| ---- | -------------------------------------------------- | ------------------- | ------------------------ |
| W1   | **XR-402 ceremony** + CORE-004 transcript verify   | gtcx-core + infra   | D3 M3.2 code path green  |
| W2   | Pen-test vendor kickoff (EXT-INF-002)              | gtcx-infrastructure | SOW signed               |
| W3   | Infra hub ack OI-X02 + validate-all closure        | gtcx-infrastructure | Hub log row              |
| W4   | `@gtcx/network` maturity badges + USSD spike scope | gtcx-core           | Spec fidelity P2 cleared |
| W5   | SOC 2 CPA engagement letter                        | compliance          | Engagement log updated   |
| W6   | Tier 5 commercial gate prep (DTF-5.5.2 scoping)    | Legal/GTM           | Human authorization only |

Full register: [execution-roadmap.md](./execution-roadmap.md) · [tier-5-workplan-2026-06.md](../operations/tier-5-workplan-2026-06.md)

---

## 7. Top 5 Remediation Items

| Priority | Item                                  | Owner               | Dependency   | Expected lift        |
| -------- | ------------------------------------- | ------------------- | ------------ | -------------------- |
| P1       | Trusted-setup ceremony → CORE-004     | gtcx-core + infra   | XR-402       | D3 → 10; core +0.2   |
| P1       | Live-stack pen-test report            | gtcx-infrastructure | EXT-INF-002  | Enterprise +0.5      |
| P1       | Infra ER-1-08 hub ack                 | gtcx-infrastructure | OI-X02       | Coordination closure |
| P2       | Org secrets: OPENAI*API_KEY, TURBO*\* | DevOps              | gh org admin | ops:check 11/11      |
| P2       | USSD protocol spike scope (MA-P2-02)  | gtcx-core           | Product spec | Global South roadmap |

---

## 8. One-Point-Uplift Conditions

| Lens                | To raise +1.0                                                                |
| ------------------- | ---------------------------------------------------------------------------- |
| Core → 9.9          | Delivered pen-test + CORE-004 ceremony + zero P1 for 90 days                 |
| Investor → 9.9      | Named sovereign pilot live with downstream validation citing core provenance |
| Enterprise → 9.7    | Pen-test on deployed stack + SOC 2 Type I letter linked in trust portal      |
| Sovereign/DFI → 9.9 | Live testnet DR proof + regulator submission package from infra              |

---

## 9. Honest Score Recalculation (Phase 5.5)

### 9.1 Verification gaps

| Claim                            | Forensic finding                                                 | Honest adjustment          |
| -------------------------------- | ---------------------------------------------------------------- | -------------------------- |
| "Tier 5 achieved"                | Technical ~88%; ceremony + commercial external                   | Do not claim Tier 5 in GTM |
| "9.5 composite" (README history) | Ecosystem rubric **8.9** today                                   | Use master audit score     |
| ai-eval provenance               | **22/22** strict pass includes `@gtcx/ai-eval@0.1.4`             | Close prior P2             |
| Internal completion 9.5          | Still valid for **internal checklist**; not bank-grade composite | Keep separate labels       |

### 9.2 Honest dimension table

Same as §5.1 — no downward adjustment required beyond external attestation already reflected in Security (8.8) and Enterprise (8.3).

### 9.3 Lens honesty

| Lens       | Could inflate to | Honest | Δ blocked by          |
| ---------- | ---------------- | -----: | --------------------- |
| Investor   | 9.2              |    8.9 | Commercialization 8.0 |
| Enterprise | 9.0              |    8.7 | No pen-test artifact  |
| Sovereign  | 9.2              |    9.0 | Deploy proof external |

### 9.4 Path to 10.0

In-repo engineering is **near ceiling (~9.6 hygiene, ~9.2 code)**. Remaining gap to **10.0** is **external validation** (pen-test, formal methods, side-channel lab, regulator letter) and **ceremony-gated crypto** (CORE-004) — not more TypeScript polish.

---

## 10. Audit Trail (Commits This Cycle)

| Phase              | Commit       | What                                                  |
| ------------------ | ------------ | ----------------------------------------------------- |
| 3 Standard P1      | `6ab4e8b`    | Doc-standard frontmatter + renames                    |
| 3 Standard P2      | `3a3bd67`    | Trust-portal/integration/overview splits              |
| 3.5 Hygiene        | `f512c0d`    | Repo hygiene policy + CI                              |
| 3 Standard P2 cont | `30d1075`    | Agile roadmap splits + README Tier-5                  |
| 3 Fix              | `95a8bbb`    | Lightweight frontmatter + trust links                 |
| Coordination       | `bdfe7cb`    | Infra validate-all mirror + FA-S1                     |
| 6 Master           | _(this doc)_ | Master audit refresh — **not committed** (audit-only) |

---

## 11. Sign-Off

| Role             | Status  | Date       |
| ---------------- | ------- | ---------- |
| Author (agent)   | Drafted | 2026-06-03 |
| Repo lead        | Pending | —          |
| Head of Security | Pending | —          |

---

_Next scheduled audit: 2026-09-01 or on ceremony close / pen-test delivery._
