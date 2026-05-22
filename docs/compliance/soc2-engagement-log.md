---
title: 'SOC 2 Engagement Log'
status: 'current'
date: '2026-05-22'
owner: 'quality-evidence-lead'
role: 'quality-evidence-lead'
tier: 'critical'
tags: ['compliance', 'soc2', 'engagement', 'log']
review_cycle: 'on-change'
---

# SOC 2 Type 1 Engagement Log

> **Status:** Active — awaiting CPA outreach kickoff
> **Date:** 2026-05-22
> **Owner:** Quality & Evidence Lead

Append-only operational log for the 2026 SOC 2 Type 1 engagement. Cross-references:

- [SOC 2 Readiness Gap Analysis](./soc2-readiness.md) — current 78–85% readiness across applicable TSC
- [SOC 2 Readiness Prep](./soc2-readiness-prep.md) — operational checklist to close the gap
- [SOC 2 Evidence Pipeline](./soc2-evidence-pipeline.md) — automated evidence collection
- [Engagement Readiness Roadmap](../agile/roadmap/engagement-readiness-sprint-roadmap-2026-05-22.md) — Sprint 4 task 4.2

## Engagement state

| Field                 | Value         |
| --------------------- | ------------- |
| Phase                 | **Pre-RFP**   |
| CPA firm              | Not selected  |
| Engagement letter     | Not signed    |
| Kickoff date          | Not scheduled |
| Fieldwork window      | —             |
| Draft report received | No            |
| Final letter received | No            |
| Budget commitment     | Not committed |

## Event log (newest first)

### 2026-05-22 — Readiness prep drafted

- Action: Drafted [SOC 2 Readiness Prep](./soc2-readiness-prep.md) with operational checklist for closing the remaining ~15–22% TSC gap, CPA candidate criteria, and conservative engagement timeline (CPA engagement letter signed by 2026-06-30; final letter by 2026-09-15).
- Owner: Quality & Evidence Lead
- Driver: Sprint 4 task 4.2 of the engagement readiness roadmap.
- Next action: Internal approval, then CPA firm outreach.
- Blockers: None internal. External: CPA firm availability windows during summer audit season.

### 2026-05-10 — Readiness gap analysis completed

- Action: Completed [SOC 2 Readiness Gap Analysis](./soc2-readiness.md). Confirmed library-not-service-org scope; Security 78%, Confidentiality 85%, Processing Integrity 80%; Availability and Privacy not applicable.
- Owner: Quality & Evidence Lead
- Reference: `docs/compliance/soc2-readiness.md`

## Pending decisions

| #   | Decision                                             | Owner                   | Due        |
| --- | ---------------------------------------------------- | ----------------------- | ---------- |
| 1   | Approve readiness prep for sub-task execution        | Protocol Architect      | 2026-05-29 |
| 2   | Confirm $15K–$45K budget envelope for Type 1         | Quality & Evidence Lead | 2026-05-29 |
| 3   | Select preferred CPA firm shape (boutique vs Big 4)  | Quality & Evidence Lead | 2026-06-09 |
| 4   | Sign engagement letter                               | Quality & Evidence Lead | 2026-06-30 |
| 5   | Confirm Type 2 follow-through commitment with vendor | Quality & Evidence Lead | 2026-06-30 |

## CPA outreach tracking

To be populated when outreach begins. Boutique firms with software-library experience preferred over Big 4 service-org generalists.

| CPA firm            | Outreach date | Response received | Quote range | Timeline | Type 2 capable | Status  | Notes                                               |
| ------------------- | ------------- | ----------------- | ----------- | -------- | -------------- | ------- | --------------------------------------------------- |
| _A-LIGN_            | —             | —                 | —           | —        | Yes            | Pending | Strong reputation; cryptographic experience unknown |
| _Schellman_         | —             | —                 | —           | —        | Yes            | Pending | Good FIPS / crypto module experience                |
| _Coalfire_          | —             | —                 | —           | —        | Yes            | Pending | Strong on technology audits                         |
| _Insight Assurance_ | —             | —                 | —           | —        | Yes            | Pending | Software-startup-friendly                           |

## Risk register specific to this engagement

| Risk                                                                                 | Likelihood | Impact | Mitigation                                                                                                               |
| ------------------------------------------------------------------------------------ | ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------ |
| CPA discovers material control gaps in sub-tasks 6.x/7.x/8.x during fieldwork        | Medium     | High   | Run mock review with internal Quality & Evidence Lead before fieldwork start                                             |
| Auditor unfamiliar with library-vs-service-org scope drives unnecessary control work | Medium     | Medium | Pre-engagement scope letter; require auditor to acknowledge readiness analysis methodology                               |
| Timeline slip pushes final report past first sovereign-state engagement              | Medium     | High   | Engagement letter language permits "Type 1 in progress with expected completion date" attestation for customer responses |
| Budget overrun past $45K                                                             | Low        | Medium | Fixed-fee engagement letter; change orders require Protocol Architect approval                                           |
