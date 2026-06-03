---
title: 'GTCX Core — 10/10 Remediation Sprint Detail (S46–S51)'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
tier: 'standard'
tags: ['agile', 'roadmap', 'sprints']
review_cycle: 'on-change'
---

# GTCX Core — 10/10 Remediation Sprint Detail (S46–S51)

> Parent: [10/10 Remediation Sprint Roadmap](./10-10-remediation-sprint-roadmap-2026-05-27.md)

## 4. Sprint S46 — Operational Unblock (2026-05-17 → 2026-05-31)

**Status:** In progress (4 days remaining)
**Goal:** Close every zero-cost gate. Leave no broken CI. Set foundation for external validation.

### Swimlane: DevOps

| ID       | Task                                                              | Effort | Status      | Blocked By                    |
| -------- | ----------------------------------------------------------------- | ------ | ----------- | ----------------------------- |
| HYG-001  | Set `OPENAI_API_KEY`, `TURBO_TOKEN`, `TURBO_TEAM` org secrets     | 0.5d   | Open        | Human: needs secret values    |
| SEC-008a | SLSA publish via `workflow_dispatch`                              | 1d     | **DONE**    | —                             |
| SEC-008b | Verify npm attestations                                           | 0.5d   | **BLOCKED** | Org policy: `id-token: write` |
| HYG-004  | Add `.gitattributes` with `* text=auto eol=lf`                    | 0.5d   | **DONE**    | —                             |
| DOC-005  | Add `docs:check-frontmatter && docs:check-links` to `release.yml` | 1d     | **DONE**    | —                             |
| WF-001   | Add auto-push git tags step to `release.yml` after publish        | 0.5d   | Open        | —                             |

### Swimlane: Security

| ID      | Task                                            | Effort | Status | Blocked By             |
| ------- | ----------------------------------------------- | ------ | ------ | ---------------------- |
| SEC-007 | Track rustls-webpki RUSTSECs (0098, 0099, 0104) | 2d     | Open   | Upstream fix pending   |
| SEC-009 | Select pen-test vendor                          | 5d     | Open   | Human: vendor outreach |

### Swimlane: Docs

| ID      | Task                                                              | Effort | Status   | Blocked By |
| ------- | ----------------------------------------------------------------- | ------ | -------- | ---------- |
| HYG-005 | Add `MATURITY: Scaffolding` badge to `packages/ai/README.md`      | 0.5d   | **DONE** | —          |
| DOC-004 | Fix `docs/quality/10-10-remediation-tracker.md` KPIs              | 0.5d   | Open     | —          |
| NEW-003 | Populate `docs/agile/sprints/current.md` with S46 committed items | 0.5d   | Open     | —          |

### Swimlane: GTM

| ID      | Task                               | Effort | Status | Blocked By        |
| ------- | ---------------------------------- | ------ | ------ | ----------------- |
| GTM-001 | Send Zimbabwe pre-submission email | 0.5d   | Open   | Human: send + log |
| GTM-002 | Send Namibia, Zambia, Ghana emails | 1d     | Open   | Human: send + log |

### S46 Weekly Checkpoints

| Checkpoint | Date       | Criteria                                                      |
| ---------- | ---------- | ------------------------------------------------------------- |
| Mid-sprint | 2026-05-24 | All human-action items (emails, secrets) have owners assigned |
| End-sprint | 2026-05-31 | `pnpm ops:check` shows 11 pass, 0 warn; CI green on main      |

### S46 Definition of Done

- [x] `pnpm release` executes successfully via `workflow_dispatch`
- [x] All CI gates pass on `main` (lint, typecheck, test, build, docs, links, frontmatter)
- [ ] `pnpm ops:check`: 11 pass, 0 warn, 0 fail
- [ ] At least 1 regulator email sent with logged date
- [ ] Pen-test vendor shortlist finalized (minimum 2 vendors)
- [ ] SLSA org-policy escalation sent to organization admin
- [ ] `docs/agile/sprints/current.md` populated with actual committed work

---

## 5. Sprint S47 — External Validation Engagement (2026-06-01 → 2026-06-14)

**Goal:** Contract paid credibility providers. Unblock SLSA provenance.
**Risk:** Pen-test vendor scheduling is the longest-lead item in the entire program.

### Swimlane: Security

| ID       | Task                                               | Effort | Owner         | Dependencies         |
| -------- | -------------------------------------------------- | ------ | ------------- | -------------------- |
| SEC-009a | Finalize pen-test vendor selection + SOW signature | 3d     | Security Lead | S46 vendor shortlist |
| SEC-009b | Share scope document + access credentials          | 1d     | Security Lead | SEC-009a             |
| SEC-010  | Verify org secrets are set and functional          | 0.5d   | DevOps        | HYG-001              |

### Swimlane: Compliance

| ID       | Task                                      | Effort | Owner           | Dependencies |
| -------- | ----------------------------------------- | ------ | --------------- | ------------ |
| ENT-001a | SOC 2 Type 1 readiness assessment kickoff | 3d     | Compliance Lead | —            |
| ENT-001b | CPA engagement letter drafted             | 2d     | Compliance Lead | ENT-001a     |

### Swimlane: DevOps

| ID            | Task                                                     | Effort | Owner  | Dependencies      |
| ------------- | -------------------------------------------------------- | ------ | ------ | ----------------- |
| SLSA-ESC      | Follow up on org-policy escalation for `id-token: write` | 0.5d   | DevOps | S46 escalation    |
| SLSA-FALLBACK | Document manual provenance fallback if org denies        | 0.5d   | DevOps | SLSA-ESC response |
| WF-002        | Add `npm audit signatures` step to `release.yml`         | 1d     | DevOps | —                 |

### Swimlane: Engineering

| ID      | Task                                                          | Effort | Owner            | Dependencies |
| ------- | ------------------------------------------------------------- | ------ | ---------------- | ------------ |
| SEC-007 | Update rustls-webpki tracking; bump if upstream fix available | 1d     | Rust Lead        | —            |
| HYG-002 | Create tracking issue for barrel export refactoring           | 0.5d   | Engineering Lead | —            |

### S47 Definition of Done

- [ ] Pen-test vendor SOW signed or shortlist expanded to 3+ vendors
- [ ] SOC 2 CPA engagement letter in review
- [ ] SLSA org-policy escalation has response (yes / no / pending)
- [ ] `pnpm ops:check`: 11 pass, 0 warn
- [ ] All S46 carry-over items closed

---

## 6. Sprint S48 — Ecosystem Hardening + Docs Polish (2026-06-15 → 2026-06-28)

**Goal:** Automate cross-repo contract enforcement. Close docs debt.
**Assumption:** Pen-test vendor is engaged (even if execution hasn't started).

### Swimlane: Platform Engineering

| ID      | Task                                                             | Effort | Owner              | Dependencies |
| ------- | ---------------------------------------------------------------- | ------ | ------------------ | ------------ |
| ECO-001 | Add `pnpm ecosystem:check-versions` script                       | 3d     | Platform Engineer  | —            |
| ECO-003 | Create `tests/integration/downstream-smoke/` for top 5 consumers | 5d     | Platform Engineer  | ECO-001      |
| ECO-004 | Update `adr-012-ecosystem-integration.md` to Stage 1             | 1d     | Protocol Architect | —            |

### Swimlane: Quality

| ID      | Task                                                         | Effort | Owner              | Dependencies |
| ------- | ------------------------------------------------------------ | ------ | ------------------ | ------------ |
| ECO-005 | Detect stale audit prompt copies in sister repos             | 2d     | Quality Lead       | —            |
| ECO-002 | Add closure dates to `docs/agile/cross-repo-coordination.md` | 0.5d   | Protocol Architect | —            |
| NEW-002 | Fix `docs/quality/10-10-remediation-tracker.md` KPIs         | 0.5d   | Quality Lead       | —            |

### Swimlane: Docs

| ID      | Task                                                      | Effort | Owner                | Dependencies    |
| ------- | --------------------------------------------------------- | ------ | -------------------- | --------------- |
| DOC-003 | Write `docs/quality/performance-budget-analysis.md`       | 1d     | Performance Engineer | ENT-002 data    |
| DOC-002 | Update SLSA guide with real attestations (if unblocked)   | 0.5d   | Docs Lead            | SLSA provenance |
| DOC-001 | Execute or archive `docs/remediation/remediation-plan.md` | 2d     | Protocol Architect   | —               |
| GTM-004 | Review `06-budget-readiness-plan.md` with current scores  | 0.5d   | Product Lead         | —               |

### Swimlane: GTM

| ID      | Task                                                 | Effort | Owner    | Dependencies     |
| ------- | ---------------------------------------------------- | ------ | -------- | ---------------- |
| GTM-003 | 7-day follow-up on all sent regulator emails         | 0.5d   | GTM Lead | GTM-001, GTM-002 |
| GTM-005 | Create `docs/gtm/case-studies/README.md` placeholder | 0.5d   | GTM Lead | —                |

### S48 Definition of Done

- [ ] `pnpm ecosystem:check-versions` runs without detecting unpatched major drift
- [ ] ADR-012 updated to Stage 1 with evidence
- [ ] All docs P2 findings closed or formally exempted
- [ ] At least 1 regulator response tracker shows "Response received" or "Follow-up sent"
- [ ] Downstream smoke tests run in CI (even if minimal)

---

## 7. Sprint S49 — Cross-Repo Enforcement + Stability (2026-06-29 → 2026-07-12)

**Goal:** Start the 90-day stability clock. Close remaining engineering debt.
**Assumption:** Pen-test is in progress (execution phase).

### Swimlane: DevOps

| ID      | Task                                               | Effort | Owner            | Dependencies |
| ------- | -------------------------------------------------- | ------ | ---------------- | ------------ |
| ENT-003 | Conduct DR runbook drill                           | 1d     | DevOps           | —            |
| HYG-002 | Barrel export tracking issue created + prioritized | 1d     | Engineering Lead | S48 tracking |
| WF-003  | Add `npm audit signatures` CI smoke test           | 1d     | DevOps           | —            |

### Swimlane: Performance

| ID      | Task                                               | Effort | Owner                | Dependencies |
| ------- | -------------------------------------------------- | ------ | -------------------- | ------------ |
| ENT-002 | Populate performance budget trends (4+ weeks data) | 2d     | Performance Engineer | —            |

### Swimlane: Security

| ID       | Task                                           | Effort | Owner         | Dependencies |
| -------- | ---------------------------------------------- | ------ | ------------- | ------------ |
| SEC-009c | Pen-test mid-engagement sync                   | 1d     | Security Lead | SEC-009b     |
| SEC-007  | rustls-webpki bump (if upstream fix available) | 1d     | Rust Lead     | —            |

### S49 Definition of Done

- [ ] DR drill completed with post-mortem published
- [ ] Performance budget trends have 4+ weeks of data for all 13 metrics
- [ ] 90-day stability clock starts (zero P1 findings from this date)
- [ ] All CI gates pass on every PR
- [ ] `pnpm ops:check`: 11 pass, 0 warn

---

## 8. Sprint S50 — Reference-Grade Validation (2026-07-13 → 2026-07-26)

**Goal:** Verify 10.0 criteria. Initiate external sign-off.
**Assumption:** Pen-test report received, SOC 2 engagement active.

### Swimlane: Quality

| ID        | Task                              | Effort | Owner        | Dependencies  |
| --------- | --------------------------------- | ------ | ------------ | ------------- |
| AUDIT-001 | Final master audit execution      | 3d     | Quality Lead | All S49 items |
| AUDIT-002 | Score recalculation with evidence | 1d     | Quality Lead | AUDIT-001     |

### Swimlane: Compliance

| ID       | Task                                       | Effort | Owner           | Dependencies |
| -------- | ------------------------------------------ | ------ | --------------- | ------------ |
| ENT-001c | CPA engagement letter signed               | 3d     | Compliance Lead | ENT-001b     |
| ENT-001d | SOC 2 readiness evidence package finalized | 2d     | Compliance Lead | ENT-001c     |

### Swimlane: Docs

| ID      | Task                                   | Effort | Owner        | Dependencies |
| ------- | -------------------------------------- | ------ | ------------ | ------------ |
| DOC-006 | Trust portal refresh with all evidence | 1d     | Docs Lead    | AUDIT-001    |
| DOC-007 | Investor evidence package              | 2d     | Product Lead | AUDIT-001    |

### Swimlane: Security

| ID       | Task                                          | Effort | Owner         | Dependencies    |
| -------- | --------------------------------------------- | ------ | ------------- | --------------- |
| SEC-009d | Pen-test findings remediation (Critical/High) | 5d     | Security Lead | Pen-test report |
| SEC-009e | Pen-test close-out letter                     | 1d     | Security Lead | SEC-009d        |

### S50 Definition of Done

- [ ] Final master audit scores >= 9.9/10
- [ ] Pen-test report received with zero Critical / High findings open
- [ ] SOC 2 CPA engagement letter signed
- [ ] Trust portal references all current evidence
- [ ] All CI gates pass

---

## 9. Sprint S51 — Buffer + Final Polish (2026-07-27 → 2026-08-09)

**Goal:** Absorb schedule slip. Achieve 90-day stability. Final sign-off.
**This sprint exists because:** Pen-test execution and vendor scheduling are the highest-variance items.

### Activities

| ID         | Task                            | Effort   | Owner              | Dependencies         |
| ---------- | ------------------------------- | -------- | ------------------ | -------------------- |
| BUFFER-001 | Pen-test remediation overflow   | Up to 5d | Security Lead      | SEC-009d             |
| BUFFER-002 | SOC 2 evidence gap closure      | Up to 3d | Compliance Lead    | ENT-001d             |
| BUFFER-003 | 90-day stability verification   | 1d       | Quality Lead       | S49 start date + 90d |
| BUFFER-004 | Final investor demo prep        | 2d       | Product Lead       | —                    |
| BUFFER-005 | Post-10.0 process documentation | 1d       | Protocol Architect | —                    |

### S51 Definition of Done (10.0 Achieved)

- [ ] `cargo audit` returns zero vulnerabilities OR documented exceptions
- [ ] `npm view @gtcx/crypto --json | jq '.dist.attestations'` returns non-null Sigstore provenance
- [ ] Pen-test report exists with no Critical / High findings open
- [ ] SOC 2 Type 1 readiness assessment complete OR CPA engagement letter signed
- [ ] `pnpm ops:check` shows 11 pass, 0 warn, 0 fail
- [ ] `pnpm docs:check-frontmatter && pnpm docs:check-links` passes in CI on every PR
- [ ] Zero P1 findings for 90 consecutive days
- [ ] At least 1 regulator response captured in `docs/gtm/responses/`
- [ ] `pnpm ecosystem:check-versions` passes
- [ ] DR runbook drill completed with post-mortem
- [ ] Performance budget trends have 4+ weeks of data for all 13 metrics
- [ ] All new issues (NEW-001 through NEW-005) closed

---
