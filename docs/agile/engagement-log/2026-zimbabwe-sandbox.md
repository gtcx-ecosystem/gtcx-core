---
title: '2026 Zimbabwe Sandbox Engagement'
status: 'current'
date: '2026-05-22'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'critical'
tags: ['engagement', 'zimbabwe', 'sandbox', 'regulator']
review_cycle: 'on-change'
---

# Zimbabwe Sandbox — Engagement Log

> **Status:** Email drafted — awaiting internal approval before send
> **Date:** 2026-05-22
> **Owner:** Protocol Architect
> **Driver:** Sprint 3 task 3.3 of the [engagement readiness roadmap](../roadmap/engagement-readiness-sprint-roadmap-2026-05-22.md). First sovereign-state engagement trigger.

## Engagement state

| Field                           | Value                                            |
| ------------------------------- | ------------------------------------------------ |
| Target jurisdiction             | Zimbabwe                                         |
| Primary recipient (candidate)   | Reserve Bank of Zimbabwe (RBZ) — Fintech Sandbox |
| Secondary recipient (candidate) | Ministry of Mines and Mining Development (MMMD)  |
| Phase                           | **Pre-send** — email drafted                     |
| Intro email sent date           | —                                                |
| Response received               | —                                                |
| Pre-submission meeting held     | —                                                |
| Formal sandbox application      | —                                                |
| Sandbox cohort placement        | —                                                |

## Strategic context (from prior memory)

Per prior engagement intelligence on African regulatory sandboxes: regulators accept internal assessments as starting evidence; the **pre-submission meeting is the key lever**. The intro email's job is to earn that meeting, not to submit the formal application.

## Email draft

> **Recipient guidance:** the RBZ Fintech Sandbox accepts both fintech-and adjacent-fintech use cases. GTCX is adjacent — commodity-export compliance with mobile-money rails. If RBZ defers, the secondary path is MMMD with a copy to RBZ. **Confirm the correct recipient and current contact name before sending** — the contacts below are illustrative placeholders.

---

**To:** `<sandbox@rbz.co.zw>` _(verify current address)_
**Cc:** `<engagement@gtcx.io>`
**Subject:** GTCX Protocol — pre-submission meeting request for Zimbabwe commodity-export sandbox cohort

Dear Reserve Bank of Zimbabwe Fintech Sandbox team,

I'm writing on behalf of GTCX Protocol — the open cryptographic foundation we've built to give Zimbabwean commodity producers, regulators, and export partners a shared trust layer for chain-of-custody attestation. Our core library is independently auditable, FIPS-aligned, and designed specifically for the constraints African commodity supply chains face (offline-first, low-bandwidth, sovereign data residency).

We would value a 45-minute pre-submission meeting to walk through our work and understand how it best fits into the RBZ sandbox structure. Three concrete artifacts we'd ask you to review beforehand, all public and independently verifiable:

1. **Trust portal** — [trust.gtcx.io](https://gtcx-ecosystem.github.io/gtcx-core/governance/trust-portal) _(custom domain provisioning in flight)_. Index of every security and compliance artifact, with file paths to each piece of evidence.
2. **Internal completion audit (2026-05-21)** — [audit/internal-completion-audit-2026-05-21](https://gtcx-ecosystem.github.io/gtcx-core/audit/internal-completion-audit-2026-05-21). Composite 9.5/10 across security, code quality, and operational readiness; 24/24 internal items complete with cited evidence per item.
3. **Fuzz campaign evidence** — [audit/fuzz-campaign-evidence-2026-05-21](https://gtcx-ecosystem.github.io/gtcx-core/audit/fuzz-campaign-evidence-2026-05-21). Six cryptographic primitives, 500,000+ libFuzzer iterations, zero crashes, zero panics, zero AddressSanitizer violations.

In addition, an external penetration test and SOC 2 Type 1 attestation are contracted and in motion (target completion 2026-08-25 and 2026-09-15 respectively). We can share the engagement letters under NDA at the meeting.

**On Zimbabwe-specific readiness:** we have a per-jurisdiction configuration validated end-to-end against our cryptographic surface, anchored to the country's regulatory authority structure (MMMD), Zimbabwe Dollar settlement, and the three-language localization (English, Shona, Ndebele). The reference fixture sits at [packages/config/jurisdiction](https://gtcx-ecosystem.github.io/gtcx-core/specs/packages) — the production version requires your team's sign-off on the regulatory parameters.

We would be happy to come to Harare in person at your convenience, or to meet by video. We can adapt to your sandbox cohort schedule — please let us know which weeks in June or July work for the team.

For procurement / vendor risk purposes the relevant primary contact is:

- **Cryptographic Security:** _<security@gtcx.io>_
- **Engineering:** _<engineering@gtcx.io>_
- **Engagement lead:** _<your name and contact>_

Thank you for the work you've done establishing the Zimbabwean fintech sandbox — the regional precedent it sets matters for the broader continental effort, and we hope GTCX can support that work.

With appreciation,

_<Sender name>_
_<Title>_
GTCX Protocol
trust.gtcx.io

---

## Pre-send checklist

| #   | Item                                                                                               | Status     | Notes                                                                    |
| --- | -------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------ |
| 1   | Confirm current RBZ Fintech Sandbox contact email + lead name                                      | ⏸️ Pending | Direct outreach or Zimbabwean partner intro preferred                    |
| 2   | Confirm GTCX engagement-lead name + contact                                                        | ⏸️ Pending | Internal — Protocol Architect to designate                               |
| 3   | Verify trust portal URL is live (post-Sprint 3.2 GitHub Pages enablement)                          | ⏸️ Pending | See [hosting runbook](../../operations/trust-portal-hosting.md)          |
| 4   | Verify all 3 cited URLs return HTTP 200 from the hosted site                                       | ⏸️ Pending | Block on #3                                                              |
| 5   | Confirm pen test SoW signed (or accept "contracted, kickoff <date>" language if still pre-signing) | ⏸️ Pending | See [pen-test-engagement-log](../../security/pen-test-engagement-log.md) |
| 6   | Confirm SOC 2 CPA engagement letter signed (or accept "contracted, kickoff <date>")                | ⏸️ Pending | See [soc2-engagement-log](../../compliance/soc2-engagement-log.md)       |
| 7   | Internal approval from Protocol Architect + Quality & Evidence Lead                                | ⏸️ Pending | Required before send                                                     |
| 8   | If RBZ is wrong recipient: switch to MMMD with RBZ cc'd, adjust opening paragraph                  | n/a        | Conditional on #1                                                        |

## Event log (newest first)

### 2026-05-22 — Email drafted

- Action: Drafted intro email targeting Reserve Bank of Zimbabwe Fintech Sandbox with a 45-minute pre-submission meeting request. Email cites 3 public-verifiable artifacts (trust portal, internal completion audit, fuzz evidence) and acknowledges pen-test + SOC 2 are contracted-in-motion.
- Owner: Protocol Architect
- Driver: Sprint 3 task 3.3 of the engagement readiness roadmap.
- Next action: Confirm recipient contact + GTCX engagement-lead name; verify Sprint 3.2 (Pages hosting) live so cited URLs resolve; internal approval; then send.
- Blockers:
  - Sprint 3.2 (Pages) requires repo-admin to enable Pages — see [hosting runbook](../../operations/trust-portal-hosting.md).
  - External: RBZ Fintech Sandbox current contact name + email must be verified independently before send.

## Pending decisions

| #   | Decision                                                             | Owner                   | Due        |
| --- | -------------------------------------------------------------------- | ----------------------- | ---------- |
| 1   | Approve email content for send                                       | Protocol Architect      | 2026-05-29 |
| 2   | Confirm recipient (RBZ vs MMMD vs both)                              | Protocol Architect      | 2026-05-29 |
| 3   | Designate GTCX engagement-lead name and contact                      | Protocol Architect      | 2026-05-29 |
| 4   | Confirm in-person Harare visit budget if meeting requires travel     | Quality & Evidence Lead | 2026-06-05 |
| 5   | Decide whether to mention DRC/Ghana/Namibia/Botswana parallel tracks | Protocol Architect      | 2026-05-29 |

## Risk register specific to this engagement

| Risk                                                                                        | Likelihood | Impact | Mitigation                                                                                             |
| ------------------------------------------------------------------------------------------- | ---------- | ------ | ------------------------------------------------------------------------------------------------------ |
| Sandbox contact has changed; email goes to a defunct address                                | Medium     | Low    | Verify contact via published RBZ directory or regional fintech network before send                     |
| RBZ deems the use case out-of-scope (commodity-export, not pure-fintech)                    | Medium     | Medium | Pivot to MMMD with RBZ cc'd; the trust evidence is identical, only the framing changes                 |
| Pre-submission meeting reveals the regulator wants a partner with Zimbabwean local presence | Medium     | Medium | Identify candidate Zimbabwean partners in advance; do not over-commit before the meeting happens       |
| Trust portal not live when meeting happens; URLs in email return 404                        | Low        | High   | Block send on Sprint 3.2 completion; verify all 3 URLs immediately before send and immediately after   |
| Response delay extends past sovereign-state engagement window                               | Medium     | Medium | Parallel tracks for Ghana, Namibia, Botswana, DRC in flight; Zimbabwe is one of five, not the only one |
