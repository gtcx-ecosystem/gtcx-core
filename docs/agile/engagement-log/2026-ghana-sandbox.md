---
title: "Ghana Sandbox — Engagement Log"
status: "current"
date: "2026-05-27"
owner: "gtcx-core"
role: "protocol-architect"
agent_id: "agent://gtcx-core/2026-05-27/session-backfill"
trust_score: 60
autonomy_level: "permissioned"
tier: "standard"
tags: ["documentation", "agile"]
review_cycle: "on-change"
---

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

## Email source

The outbound email is rendered from the canonical [`sandbox-intro-email-template.md`](../../gtm/sandbox-intro-email-template.md) using the **Ghana** row in its parameter table — no per-country email draft is maintained here. Updates to shared text (cited artifacts, attestation status, meeting offer) happen once in the template and propagate to every country.

The send-ready render (every `{{placeholder}}` substituted, copy-paste-ready) lives at [`docs/gtm/renders/ghana-2026.md`](../../gtm/renders/ghana-2026.md).

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
