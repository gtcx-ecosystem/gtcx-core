---
last_reconciled: 2026-06-01
sources:
  - docs/audit/full-audit-2026-06-01.md
  - docs/gtm/gtm-roadmap-10-10-internal-2026-06-01.md
  - docs/audit/10-10-roadmap-2026-05-25.md
  - docs/agile/roadmap/engagement-readiness-sprint-roadmap-2026-05-22.md
---

# Execution roadmap — gtcx-core

**Active phase:** Complete — internal 10/10 engineering track  
**Bank-grade 10/10:** blocked on external pen test / SOC 2 ([10-10-roadmap-2026-05-25.md](./10-10-roadmap-2026-05-25.md))  
**CI confirmation:** [ci-confirmation-2026-06-01.md](./ci-confirmation-2026-06-01.md)

---

## Phase map

| Phase | Theme                                           | Status   |
| ----- | ----------------------------------------------- | -------- |
| P1    | Doc truth (README, trust portal, overview)      | **done** |
| P2    | Trust artifacts (ai-eval CI, GA gate, portal)   | **done** |
| P3    | DevEx proof (runtime integration test)          | **done** |
| P4    | Internal signoff + blocked externals documented | **done** |

---

## Sprint 1: Front-door truth — **done**

| Story | Title                             | Status |
| ----- | --------------------------------- | ------ |
| S1-01 | README blockers + 21/21 npm       | done   |
| S1-02 | Trust portal substrate versions   | done   |
| S1-03 | Runbook package counts            | done   |
| S1-04 | Overview + executive brief sync   | done   |
| S1-05 | Full-audit synthesis closed items | done   |

---

## Sprint 2: Trust artifacts — **done**

**Goal:** Machine-readable AI scorecard on every CI run; GA evidence and trust portal reference it.

| Story | Title                                        | Status |
| ----- | -------------------------------------------- | ------ |
| S2-01 | CI generates and uploads `ai-scorecard.json` | done   |
| S2-02 | `check-ai-scorecard` in GA evidence gate     | done   |
| S2-03 | GA evidence log row for AI scorecard         | done   |
| S2-04 | Trust portal scorecard section               | done   |
| S2-05 | Spec-drift checks in ai-eval                 | done   |

---

## Sprint 3: DevEx proof — **done**

| Story | Title                                           | Status |
| ----- | ----------------------------------------------- | ------ |
| S3-01 | Integration test `createRuntime()` edge profile | done   |
| S3-02 | Downstream integration doc copy-paste path      | done   |

---

## Sprint 4: Signoff — **done**

| Story | Title                                                | Status |
| ----- | ---------------------------------------------------- | ------ |
| S4-01 | CI confirmation evidence                             | done   |
| S4-02 | npm provenance tooling + 21/21 registry attestations | done   |
| S4-03 | Internal GTM roadmap checkboxes                      | done   |

See [ci-confirmation-2026-06-01.md](./ci-confirmation-2026-06-01.md).

---

## Deferred (external)

| Item                   | Owner                    | Reason              |
| ---------------------- | ------------------------ | ------------------- |
| Pen-test report        | crypto-security-engineer | Vendor not selected |
| SOC 2 Type 1           | quality-evidence-lead    | CPA engagement      |
| Zimbabwe sandbox email | gtm-lead                 | Human approval      |
