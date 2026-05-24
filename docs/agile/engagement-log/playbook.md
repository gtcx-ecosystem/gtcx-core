---
title: 'Sovereign-State Engagement Playbook'
status: 'current'
date: '2026-05-22'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'critical'
tags: ['engagement', 'playbook', 'sovereign', 'africa']
review_cycle: 'on-change'
---

# Sovereign-State Engagement Playbook

> **Status:** Current
> **Date:** 2026-05-22
> **Owner:** Protocol Architect

Generic engagement playbook for sovereign-state regulator outreach. Extracted from the [Zimbabwe engagement template](./2026-zimbabwe-sandbox.md) so the same shape can be reused across the 5 imminent target jurisdictions (Zimbabwe, Ghana, Namibia, Botswana, DR Congo) and any future ones.

Per-engagement instances inherit this playbook by reference. See the [engagement log index](./README.md) for the active set.

## The lever

African sandbox regulators accept internal assessments as starting evidence. **The pre-submission meeting is the lever** — not the formal application. The intro email's job is to earn that meeting; the meeting earns the cohort placement.

## Phases

```
1. Pre-send      → email drafted, internal approval, recipient verified
2. Sent          → outbound email logged, response window opens
3. Response      → regulator replies; meeting scheduled or pivot needed
4. Meeting       → 45-minute pre-submission walkthrough
5. Application   → formal sandbox application based on meeting outcomes
6. Cohort        → active sandbox participation
7. Production    → graduation / production deployment
```

## Required artifacts per engagement

Each per-country engagement log captures:

| Section                | Purpose                                                                               |
| ---------------------- | ------------------------------------------------------------------------------------- |
| **Engagement state**   | Single-screen status: phase, recipient, key dates, sandbox cohort placement           |
| **Email draft**        | Country-specific intro email, ready to send pending pre-send checklist                |
| **Pre-send checklist** | All items that must be true before the email goes out                                 |
| **Event log**          | Append-only timestamped record of every outbound and inbound communication            |
| **Pending decisions**  | Open questions blocking progress, with owner and due date                             |
| **Risk register**      | Engagement-specific risks (defunct contact, scope mismatch, local-presence ask, etc.) |

## Cited artifacts (same across all 5 jurisdictions)

These three URLs appear in every intro email. They are jurisdiction-agnostic and prove substance up front:

1. **Trust portal** — `https://gtcx-ecosystem.github.io/gtcx-core/governance/trust-portal` (or `https://trust.gtcx.io/governance/trust-portal` after DNS)
2. **Internal completion audit (2026-05-21)** — composite 9.5/10, 24/24 internal items complete
3. **Fuzz campaign evidence (2026-05-21)** — 6 targets, 500K+ iterations, zero crashes

## Jurisdiction-specific framing

Each per-country log adapts the email to:

- **Recipient framing** — financial-sector regulator (RBZ, BoG, BoN, BoB, BCC) vs mines/minerals authority (MMMD, MinComm, MME, DoM, CAMI) depending on which best fits the sandbox structure.
- **Currency + localization** — surface the local currency code and the supported language set so the regulator sees that the deployment shape respects local context.
- **Local-presence question** — be ready for "do you have a Zimbabwean/Ghanaian/Namibian/Batswana/Congolese partner already" and have a candidate-list response ready.

The [per-jurisdiction fixtures](../../../tests/integration/fixtures/jurisdiction-fixtures.ts) anchor the firm public facts each engagement should reference.

## When pen test / SOC 2 isn't fully complete

Acceptable language for the pre-meeting period:

- "External penetration test contracted; vendor engaged; final report target <date>"
- "SOC 2 Type 1 attestation contracted; CPA engaged; final letter target <date>"

Reference the engagement logs ([pen test](../../security/pen-test-engagement-log.md) and [SOC 2](../../compliance/soc2-engagement-log.md)) under NDA at the meeting itself.

## Parallel-engagement coordination

The 5 engagements run in parallel, not sequentially. Use the [engagement log index](./README.md) to keep them visible. Coordination notes:

- **Cross-jurisdiction precedent** — when one sandbox accepts an artifact (e.g., a security evidence package), capture which artifact in the engagement log so the next regulator can be told "RBZ accepted this; we are happy to share their feedback under NDA."
- **Travel pooling** — if multiple meetings are scheduled close in time, coordinate single-trip itineraries through the relevant regional hubs (Johannesburg for southern Africa, Accra for west Africa, Nairobi for east Africa).
- **Sequencing** — if one regulator wants exclusivity for a cohort window, log the request and decide at the leadership level rather than at the engagement-lead level.

## Pre-send checklist (template)

Each per-engagement log instantiates this checklist with country-specific contacts:

| #   | Item                                                                                              | Owner                           |
| --- | ------------------------------------------------------------------------------------------------- | ------------------------------- |
| 1   | Confirm current regulator-team contact email + lead name                                          | Engagement lead                 |
| 2   | Confirm GTCX engagement-lead name + contact                                                       | Protocol Architect              |
| 3   | Verify trust portal is live and all cited URLs return HTTP 200                                    | Frontier Infra Engineer         |
| 4   | Confirm pen test SoW signed (or accept "contracted, kickoff <date>" language)                     | Cryptographic Security Engineer |
| 5   | Confirm SOC 2 CPA engagement letter signed (or accept "contracted, kickoff <date>")               | Quality & Evidence Lead         |
| 6   | Internal approval from Protocol Architect + Quality & Evidence Lead                               | Protocol Architect              |
| 7   | If primary recipient is wrong: switch and adjust opening paragraph                                | Engagement lead                 |
| 8   | If a Zimbabwean/Ghanaian/Namibian/Batswana/Congolese local-presence partner is needed pre-meeting | Engagement lead                 |

## Decision log

### 2026-05-22 — Playbook extracted

- Extracted from the Zimbabwe engagement log so the other 4 target jurisdictions can inherit the same shape.
- Per-jurisdiction stub logs created concurrently:
  [Ghana](./2026-ghana-sandbox.md),
  [Namibia](./2026-namibia-sandbox.md),
  [Botswana](./2026-botswana-sandbox.md),
  [DR Congo](./2026-drc-sandbox.md).
- Each stub starts at Phase 1 (pre-send), references this playbook for the generic structure, and overrides only the country-specific fields.
