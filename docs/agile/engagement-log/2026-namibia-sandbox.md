---
title: '2026 Namibia Sandbox Engagement'
status: 'current'
date: '2026-05-24'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'critical'
tags: ['engagement', 'namibia', 'sandbox', 'regulator']
review_cycle: 'on-change'
---

# Namibia Sandbox — Engagement Log

> **Status:** Pre-send — email drafted, awaiting recipient verification and approval
> **Date:** 2026-05-24
> **Owner:** Protocol Architect
> **Inherits:** [Sovereign-State Engagement Playbook](./playbook.md)

## Engagement state

| Field                           | Value                                  |
| ------------------------------- | -------------------------------------- |
| Target jurisdiction             | Namibia                                |
| Primary recipient (candidate)   | Bank of Namibia (BoN) — Innovation Hub |
| Secondary recipient (candidate) | Ministry of Mines and Energy (MME)     |
| Phase                           | **Pre-send** — stub only               |
| Email drafted                   | Yes — see below                        |
| Email sent date                 | —                                      |
| Response received               | —                                      |
| Pre-submission meeting held     | —                                      |
| Formal sandbox application      | —                                      |
| Sandbox cohort placement        | —                                      |

## Country-specific framing inputs

For when the email is drafted — anchored to the [Namibia fixture](../../../tests/integration/fixtures/jurisdiction-fixtures.ts):

| Input                          | Value                                                         |
| ------------------------------ | ------------------------------------------------------------- |
| ISO codes                      | NA / NAM                                                      |
| Currency                       | NAD (Namibian Dollar; pegged 1:1 with ZAR)                    |
| Region                         | Southern Africa                                               |
| Official languages             | English (with Afrikaans and indigenous languages widely used) |
| Primary mining authority       | Ministry of Mines and Energy (MME)                            |
| Primary financial regulator    | Bank of Namibia (BoN)                                         |
| Local-presence partner needed? | TBD — flag at pre-send time                                   |

## Email draft

> **Recipient guidance:** Namibia's mining sector is well-regulated (uranium, diamonds, gold) — MME is a credible primary path given the commodity-export framing. BoN Innovation Hub is the secondary path if MME defers. **Confirm contact + lead name before sending.**

---

**To:** `<innovation@bon.com.na>` _(verify; secondary: `<info@mme.gov.na>`)_
**Cc:** `<engagement@gtcx.io>`
**Subject:** GTCX Protocol — pre-submission meeting request for Namibia commodity-export sandbox cohort

Dear Bank of Namibia Innovation Hub team,

I'm writing on behalf of GTCX Protocol — the open cryptographic foundation we've built to give Namibian commodity producers, regulators, and export partners a shared trust layer for chain-of-custody attestation. Our core library is independently auditable, FIPS-aligned, and designed specifically for the constraints Southern African commodity supply chains face (offline-first, low-bandwidth, sovereign data residency).

We would value a 45-minute pre-submission meeting to walk through our work and understand how it best fits into the BoN sandbox structure (or, if more appropriate, the Ministry of Mines and Energy's regulatory framework). Three concrete artifacts we'd ask you to review beforehand, all public and independently verifiable:

1. **Trust portal** — [trust.gtcx.io](https://gtcx-ecosystem.github.io/gtcx-core/governance/trust-portal) _(custom domain provisioning in flight)_. Index of every security and compliance artifact, with file paths to each piece of evidence.
2. **Internal completion audit (2026-05-21)** — composite 9.5/10 across security, code quality, and operational readiness; 24/24 internal items complete with cited evidence per item.
3. **Fuzz campaign evidence (2026-05-21)** — six cryptographic primitives, 500,000+ libFuzzer iterations, zero crashes, zero panics, zero AddressSanitizer violations.

In addition, an external penetration test and SOC 2 Type 1 attestation are contracted and in motion (target completion 2026-08-25 and 2026-09-15 respectively). We can share the engagement letters under NDA at the meeting.

**On Namibia-specific readiness:** we have a per-jurisdiction configuration validated end-to-end against our cryptographic surface, anchored to the country's regulatory authority structure (Ministry of Mines and Energy for mining oversight, BoN for payment-rails), Namibian Dollar settlement (with ZAR parity for cross-border settlement), and the English + Afrikaans localization. The reference fixture sits in the gtcx-core repo — the production version requires your team's sign-off on the regulatory parameters. Namibia's mature mining-export regulatory tradition (uranium and diamond traceability in particular) is part of why we're prioritizing engagement here.

We would be happy to come to Windhoek in person at your convenience, or to meet by video. If a Johannesburg-hub trip with cross-border travel is more efficient, that also works. Please let us know which weeks in June or July suit the team.

For procurement / vendor risk purposes the relevant primary contact is:

- **Cryptographic Security:** _<security@gtcx.io>_
- **Engineering:** _<engineering@gtcx.io>_
- **Engagement lead:** _<your name and contact>_

Thank you for the work you've done supporting fintech and adjacent-sector innovation in Namibia. We hope GTCX can be a useful element of that effort.

With appreciation,

_<Sender name>_
_<Title>_
GTCX Protocol
trust.gtcx.io

---

## Status against playbook checklist

| #   | Playbook checklist item                                                    | Status     |
| --- | -------------------------------------------------------------------------- | ---------- |
| 1   | Confirm current BoN / MME contact                                          | ⏸️ Pending |
| 2   | Confirm GTCX engagement-lead name + contact                                | ⏸️ Pending |
| 3   | Verify trust portal live and cited URLs return HTTP 200                    | ⏸️ Pending |
| 4   | Confirm pen test SoW signed or accept "contracted" language                | ⏸️ Pending |
| 5   | Confirm SOC 2 CPA engagement letter signed or accept "contracted" language | ⏸️ Pending |
| 6   | Internal approval                                                          | ⏸️ Pending |
| 7   | Verify primary recipient (BoN vs MME)                                      | ⏸️ Pending |
| 8   | Identify candidate Namibian local-presence partner if needed               | ⏸️ Pending |

## Event log (newest first)

### 2026-05-24 — Email drafted

- Action: Drafted intro email targeting Bank of Namibia Innovation Hub with 45-minute pre-submission meeting request. Cites trust portal + internal completion audit + fuzz evidence; acknowledges pen test + SOC 2 contracted. Anchors Namibia-specific framing to MME regulatory structure, NAD/ZAR settlement, and the country's mature mining-export regulatory tradition (uranium + diamonds).
- Owner: Protocol Architect
- Next action: Walk through the 8-item pre-send checklist; confirm BoN vs MME primary recipient.

### 2026-05-22 — Stub created

- Action: Stub engagement log created inheriting the [Sovereign-State Engagement Playbook](./playbook.md). Country-specific framing inputs captured for email drafting.
- Owner: Protocol Architect

## Pending decisions

| #   | Decision                                              | Owner              | Due        |
| --- | ----------------------------------------------------- | ------------------ | ---------- |
| 1   | Draft intro email                                     | Protocol Architect | 2026-06-05 |
| 2   | Confirm BoN vs MME as primary recipient               | Protocol Architect | 2026-06-05 |
| 3   | Designate Namibian local-presence partner if required | Protocol Architect | 2026-06-12 |
