---
title: 'GTCX Core — 10/10 Remediation Sprint Roadmap'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
tier: 'standard'
tags: ['roadmap', 'remediation', '10-10', 'agile', 'sprints']
review_cycle: 'on-change'
---

---

title: 'GTCX Core — 10/10 Remediation Sprint Roadmap'
status: current
date: '2026-05-27'
owner: protocol-architect
role: protocol-architect
tier: critical
tags:

- roadmap
- remediation
- 10-10
- agile
- sprints
  review_cycle: weekly

---

# GTCX Core — 10/10 Remediation Sprint Roadmap

> **Source:** [`docs/audit/10-10-remediation-plan-2026-05-27.md`](../../audit/10-10-remediation-plan-2026-05-27.md)
> **Current composite:** 8.9/10
> **Target:** 10.0/10
> **Sprint cadence:** 2-week sprints, Sunday start
> **Last updated:** 2026-05-27

---

## 1. Current State Snapshot

| Dimension     | Score      | Status      | Trend                              |
| ------------- | ---------- | ----------- | ---------------------------------- |
| Code Quality  | 9.5/10     | Stable      | Flat                               |
| Security      | 8.0/10     | **Blocked** | SLSA org policy blocker identified |
| Enterprise    | 8.5/10     | **At risk** | Pen-test vendor not selected       |
| Resilience    | 9.0/10     | Stable      | Flat                               |
| Ecosystem     | 9.3/10     | Stable      | Flat                               |
| Agentic       | 9.2/10     | Stable      | Flat                               |
| Hygiene       | 9.5/10     | Improving   | Frontmatter + link gates now green |
| **Composite** | **8.9/10** |             |                                    |

**What changed today (2026-05-27):**

- 15 packages published to npm via `workflow_dispatch` (first successful release)
- Git tags pushed for all published versions
- SLSA provenance root cause identified: org policy blocks `id-token: write`
- API surface check made resilient to stale baselines
- Frontmatter + link validation gates fixed and passing

---

## 2. Sprint Overview

| Sprint  | Dates                   | Theme                              | Target Score | Core Deliverable                              |
| ------- | ----------------------- | ---------------------------------- | ------------ | --------------------------------------------- |
| **S46** | 2026-05-17 → 2026-05-31 | Operational Unblock                | 9.0          | Release pipeline green, org secrets set       |
| **S47** | 2026-06-01 → 2026-06-14 | External Validation Engagement     | 9.3          | Pen-test SOW signed, CPA engaged              |
| **S48** | 2026-06-15 → 2026-06-28 | Ecosystem Hardening + Docs Polish  | 9.5          | Cross-repo checks automated, docs debt closed |
| **S49** | 2026-06-29 → 2026-07-12 | Cross-Repo Enforcement + Stability | 9.7          | 90-day stability clock starts, DR drill done  |
| **S50** | 2026-07-13 → 2026-07-26 | Reference-Grade Validation         | 9.9          | External auditor sign-off initiated           |
| **S51** | 2026-07-27 → 2026-08-09 | Buffer + Final Polish              | 10.0         | 90-day stability achieved, final audit        |

**Total timeline:** 12 weeks (6 sprints)
**Risk-adjusted timeline:** 14 weeks (if pen-test vendor scheduling slips)

---

## 3. Dependency Graph

```text
S46 (Operational Unblock)
├── HYG-001: Set org secrets ──────┐
├── SEC-008: SLSA publish (DONE)   │──→ S47 (can run in parallel)
├── HYG-004: .gitattributes        │
└── HYG-005: Maturity badges       │
                                   │
S47 (External Validation)          │
├── SEC-009: Pen-test vendor ──────┼──→ S48 (execution)
├── ENT-001: SOC 2 CPA engagement ─┤
└── HYG-003: Populate sprint docs ─┘

S48 (Ecosystem + Docs)
├── ECO-001: Downstream version check ──→ S49 (consume evidence)
├── ECO-003: Smoke tests ───────────────→ S49
├── DOC-002: SLSA guide update ◄──────────┘ (blocked until SLSA provenance unblocked)
└── DOC-003: Performance budget analysis

S49 (Stability + Enforcement)
├── ENT-003: DR drill
├── HYG-002: Barrel export tracking
└── 90-day stability clock STARTS

S50 (Reference Grade)
├── External auditor sign-off
├── Final master audit
└── Trust portal refresh

S51 (Buffer)
├── 90-day stability COMPLETES
├── Investor evidence package
└── Final sign-off
```

**Critical path:** SEC-009 (pen-test) → S48 execution → S49 stability → S51 completion

---

---

## Sprint detail (split for doc-standard length)

| Part                                              | Document                                                                  |
| ------------------------------------------------- | ------------------------------------------------------------------------- |
| S46–S51 swimlanes + DoD                           | [Sprint detail](./10-10-remediation-sprint-roadmap-2026-05-27-sprints.md) |
| Risk register, contingency, parking lot, tracking | [Appendix](./10-10-remediation-sprint-roadmap-2026-05-27-appendix.md)     |
