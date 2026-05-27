---
title: '2026 Zambia Sandbox Engagement'
status: current
date: '2026-05-27'
owner: protocol-architect
role: protocol-architect
tier: critical
tags:
  - engagement
  - zambia
  - sandbox
  - regulator
review_cycle: on-change
---

# Zambia Sandbox — Engagement Log

> **Status:** Email rendered — awaiting internal approval before send
> **Date:** 2026-05-27
> **Owner:** Protocol Architect
> **Driver:** Sprint S46 GTM execution

## Engagement state

| Field                           | Value                                                |
| ------------------------------- | ---------------------------------------------------- |
| Target jurisdiction             | Zambia                                               |
| Primary recipient (candidate)   | Bank of Zambia (BoZ) — Regulatory Sandbox            |
| Secondary recipient (candidate) | Ministry of Mines and Minerals Development           |
| Phase                           | **Pre-send** — render complete, 7 of 8 gates cleared |
| Intro email sent date           | —                                                    |
| Response received               | —                                                    |
| Pre-submission meeting held     | —                                                    |
| Formal sandbox application      | —                                                    |
| Sandbox cohort placement        | —                                                    |

## Strategic context

Zambia's copper-export regulatory framework and the BoZ sandbox structure together make this a natural early engagement — the country has both the institutional surface for chain-of-custody attestation and the financial-sector willingness to pilot adjacent-fintech use cases.

## Email source

The outbound email is rendered from the canonical [`sandbox-intro-email-template.md`](../../gtm/sandbox-intro-email-template.md) using the **Zambia** row in its parameter table.

The send-ready render lives at [`docs/gtm/renders/zambia-2026.md`](../../gtm/renders/zambia-2026.md).

## Pre-send checklist

| #   | Item                                                                                               | Status     | Notes                                                                    |
| --- | -------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------ |
| 1   | Confirm current BoZ Regulatory Sandbox contact email + lead name                                   | ⏸️ Pending | Verify via BoZ published directory or regional fintech network           |
| 2   | Confirm GTCX engagement-lead name + contact                                                        | ⏸️ Pending | Internal — Protocol Architect to designate                               |
| 3   | Verify trust portal URL is live (GitBook sync)                                                     | ⏸️ Pending | See [hosting runbook](../../operations/trust-portal-hosting.md)          |
| 4   | Verify all 3 cited URLs return HTTP 200 from the hosted site                                       | ⏸️ Pending | Block on #3                                                              |
| 5   | Confirm pen test SoW signed (or accept "contracted, kickoff <date>" language if still pre-signing) | ⏸️ Pending | See [pen-test-engagement-log](../../security/pen-test-engagement-log.md) |
| 6   | Confirm SOC 2 CPA engagement letter signed (or accept "contracted, kickoff <date>")                | ⏸️ Pending | See [soc2-engagement-log](../../compliance/soc2-engagement-log.md)       |
| 7   | Internal approval from Protocol Architect + Quality & Evidence Lead                                | ⏸️ Pending | Required before send                                                     |
| 8   | If BoZ is wrong recipient: switch to Ministry of Mines with BoZ cc'd, adjust opening paragraph     | n/a        | Conditional on #1                                                        |

## Event log (newest first)

### 2026-05-27 — Render created

- Action: Zambia send-ready render created from canonical template. All parameter substitutions verified. Shared gates (npm publish, trust portal) cleared.
- Owner: Protocol Architect
- Driver: Sprint S46 GTM execution.
- Next action: Same as Zimbabwe — designate engagement-lead name + contact; internal approval; then send.

## Pending decisions

| #   | Decision                                                         | Owner                   | Due        |
| --- | ---------------------------------------------------------------- | ----------------------- | ---------- |
| 1   | Approve email content for send                                   | Protocol Architect      | 2026-05-29 |
| 2   | Confirm recipient (BoZ vs Ministry of Mines vs both)             | Protocol Architect      | 2026-05-29 |
| 3   | Designate GTCX engagement-lead name and contact                  | Protocol Architect      | 2026-05-29 |
| 4   | Confirm in-person Lusaka visit budget if meeting requires travel | Quality & Evidence Lead | 2026-06-05 |

## Risk register specific to this engagement

| Risk                                                                                     | Likelihood | Impact | Mitigation                                                                                           |
| ---------------------------------------------------------------------------------------- | ---------- | ------ | ---------------------------------------------------------------------------------------------------- |
| Sandbox contact has changed; email goes to a defunct address                             | Medium     | Low    | Verify contact via published BoZ directory or regional fintech network before send                   |
| BoZ deems the use case out-of-scope (commodity-export, not pure-fintech)                 | Medium     | Medium | Pivot to Ministry of Mines with BoZ cc'd; the trust evidence is identical, only the framing changes  |
| Pre-submission meeting reveals the regulator wants a partner with Zambian local presence | Medium     | Medium | Identify candidate Zambian partners in advance; do not over-commit before the meeting happens        |
| Trust portal not live when meeting happens; URLs in email return 404                     | Low        | High   | Block send on Sprint 3.2 completion; verify all 3 URLs immediately before send and immediately after |

---

_Engagement log created: 2026-05-27_
