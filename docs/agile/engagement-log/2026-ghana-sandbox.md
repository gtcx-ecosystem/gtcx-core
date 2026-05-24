---
title: '2026 Ghana Sandbox Engagement'
status: 'current'
date: '2026-05-24'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'critical'
tags: ['engagement', 'ghana', 'sandbox', 'regulator']
review_cycle: 'on-change'
---

# Ghana Sandbox — Engagement Log

> **Status:** Pre-send — email drafted, awaiting recipient verification and approval
> **Date:** 2026-05-24
> **Owner:** Protocol Architect
> **Inherits:** [Sovereign-State Engagement Playbook](./playbook.md)

## Engagement state

| Field                           | Value                                                   |
| ------------------------------- | ------------------------------------------------------- |
| Target jurisdiction             | Ghana                                                   |
| Primary recipient (candidate)   | Bank of Ghana (BoG) — Regulatory and Innovation Sandbox |
| Secondary recipient (candidate) | Minerals Commission of Ghana (MinComm)                  |
| Phase                           | **Pre-send** — stub only                                |
| Email drafted                   | Yes — see below                                         |
| Email sent date                 | —                                                       |
| Response received               | —                                                       |
| Pre-submission meeting held     | —                                                       |
| Formal sandbox application      | —                                                       |
| Sandbox cohort placement        | —                                                       |

## Country-specific framing inputs

For when the email is drafted — anchored to the [Ghana fixture](../../../tests/integration/fixtures/jurisdiction-fixtures.ts):

| Input                          | Value                                                                               |
| ------------------------------ | ----------------------------------------------------------------------------------- |
| ISO codes                      | GH / GHA                                                                            |
| Currency                       | GHS (Ghanaian Cedi)                                                                 |
| Region                         | West Africa                                                                         |
| Official languages             | English (with Twi, Ga, and others widely used)                                      |
| Primary mining authority       | Minerals Commission (MinComm)                                                       |
| Primary financial regulator    | Bank of Ghana (BoG)                                                                 |
| Sandbox precedent              | BoG Regulatory Sandbox has admitted fintech and adjacent-fintech cohorts since 2019 |
| Local-presence partner needed? | TBD — flag at pre-send time                                                         |

## Email draft

> **Recipient guidance:** BoG Regulatory Sandbox is the primary path — its mandate covers fintech and adjacent-fintech use cases, and the commodity-export + mobile-money rails framing fits cleanly. MinComm is the secondary path if BoG defers on grounds of sector fit. **Confirm the current sandbox contact + lead name before sending.**

---

**To:** `<sandbox@bog.gov.gh>` _(verify current address)_
**Cc:** `<engagement@gtcx.io>`
**Subject:** GTCX Protocol — pre-submission meeting request for Ghana commodity-export sandbox cohort

Dear Bank of Ghana Regulatory Sandbox team,

I'm writing on behalf of GTCX Protocol — the open cryptographic foundation we've built to give Ghanaian commodity producers, regulators, and export partners a shared trust layer for chain-of-custody attestation. Our core library is independently auditable, FIPS-aligned, and designed specifically for the constraints West African commodity supply chains face (offline-first, low-bandwidth, sovereign data residency).

We would value a 45-minute pre-submission meeting to walk through our work and understand how it best fits into the BoG sandbox structure. Three concrete artifacts we'd ask you to review beforehand, all public and independently verifiable:

1. **Trust portal** — [trust.gtcx.io](https://gtcx-ecosystem.github.io/gtcx-core/governance/trust-portal) _(custom domain provisioning in flight)_. Index of every security and compliance artifact, with file paths to each piece of evidence.
2. **Internal completion audit (2026-05-21)** — composite 9.5/10 across security, code quality, and operational readiness; 24/24 internal items complete with cited evidence per item.
3. **Fuzz campaign evidence (2026-05-21)** — six cryptographic primitives, 500,000+ libFuzzer iterations, zero crashes, zero panics, zero AddressSanitizer violations.

In addition, an external penetration test and SOC 2 Type 1 attestation are contracted and in motion (target completion 2026-08-25 and 2026-09-15 respectively). We can share the engagement letters under NDA at the meeting.

**On Ghana-specific readiness:** we have a per-jurisdiction configuration validated end-to-end against our cryptographic surface, anchored to the country's regulatory authority structure (Minerals Commission for mining oversight, BoG for payment-rails), Ghanaian Cedi settlement, and the country's primary-English-with-Twi-and-Ga localization. The reference fixture sits in the gtcx-core repo — the production version requires your team's sign-off on the regulatory parameters. Ghana's existing sandbox precedent (multiple fintech cohorts since 2019) is part of why we're prioritizing engagement here.

We would be happy to come to Accra in person at your convenience, or to meet by video. Please let us know which weeks in June or July work for the team.

For procurement / vendor risk purposes the relevant primary contact is:

- **Cryptographic Security:** _<security@gtcx.io>_
- **Engineering:** _<engineering@gtcx.io>_
- **Engagement lead:** _<your name and contact>_

Thank you for the work you've done establishing the BoG Regulatory Sandbox — the precedent it has set for fintech adoption across West Africa is part of why we believe the structure can also support adjacent-sector use cases like ours.

With appreciation,

_<Sender name>_
_<Title>_
GTCX Protocol
trust.gtcx.io

---

## Status against playbook checklist

| #   | Playbook checklist item                                                    | Status     |
| --- | -------------------------------------------------------------------------- | ---------- |
| 1   | Confirm current BoG / MinComm sandbox contact                              | ⏸️ Pending |
| 2   | Confirm GTCX engagement-lead name + contact                                | ⏸️ Pending |
| 3   | Verify trust portal live and cited URLs return HTTP 200                    | ⏸️ Pending |
| 4   | Confirm pen test SoW signed or accept "contracted" language                | ⏸️ Pending |
| 5   | Confirm SOC 2 CPA engagement letter signed or accept "contracted" language | ⏸️ Pending |
| 6   | Internal approval                                                          | ⏸️ Pending |
| 7   | Verify primary recipient (BoG vs MinComm)                                  | ⏸️ Pending |
| 8   | Identify candidate Ghanaian local-presence partner if needed               | ⏸️ Pending |

## Event log (newest first)

### 2026-05-24 — Email drafted

- Action: Drafted intro email targeting Bank of Ghana Regulatory Sandbox with 45-minute pre-submission meeting request. Cites trust portal + internal completion audit + fuzz evidence; acknowledges pen test + SOC 2 contracted. Anchors Ghana-specific framing to MinComm regulatory structure, GHS settlement, and the country's existing fintech-sandbox precedent (multiple cohorts since 2019).
- Owner: Protocol Architect
- Next action: Walk through the 8-item pre-send checklist; confirm BoG vs MinComm primary recipient.

### 2026-05-22 — Stub created

- Action: Stub engagement log created inheriting the [Sovereign-State Engagement Playbook](./playbook.md). Country-specific framing inputs captured for email drafting.
- Owner: Protocol Architect

## Pending decisions

| #   | Decision                                              | Owner              | Due        |
| --- | ----------------------------------------------------- | ------------------ | ---------- |
| 1   | Draft intro email mirroring Zimbabwe shape            | Protocol Architect | 2026-06-05 |
| 2   | Confirm BoG vs MinComm as primary recipient           | Protocol Architect | 2026-06-05 |
| 3   | Designate Ghanaian local-presence partner if required | Protocol Architect | 2026-06-12 |
