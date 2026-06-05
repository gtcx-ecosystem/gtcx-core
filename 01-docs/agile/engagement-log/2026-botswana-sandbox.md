---
title: 'Botswana Sandbox — Engagement Log'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'standard'
tags: ['documentation', 'agile']
review_cycle: 'on-change'
---

---

title: '2026 Botswana Sandbox Engagement'
status: 'current'
date: '2026-05-24'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'critical'
tags: ['engagement', 'botswana', 'sandbox', 'regulator']
review_cycle: 'on-change'

---

# Botswana Sandbox — Engagement Log

> **Status:** Pre-send — email drafted, awaiting recipient verification and approval
> **Date:** 2026-05-24
> **Owner:** Protocol Architect
> **Inherits:** [Sovereign-State Engagement Playbook](./playbook.md)

## Engagement state

| Field                           | Value                                                       |
| ------------------------------- | ----------------------------------------------------------- |
| Target jurisdiction             | Botswana                                                    |
| Primary recipient (candidate)   | Bank of Botswana (BoB) — Regulatory Innovation              |
| Secondary recipient (candidate) | Ministry of Minerals and Energy — Department of Mines (DoM) |
| Phase                           | **Pre-send** — stub only                                    |
| Email drafted                   | Yes — see below                                             |
| Email sent date                 | —                                                           |
| Response received               | —                                                           |
| Pre-submission meeting held     | —                                                           |
| Formal sandbox application      | —                                                           |
| Sandbox cohort placement        | —                                                           |

## Country-specific framing inputs

For when the email is drafted — anchored to the [Botswana fixture](../../../tests/integration/fixtures/jurisdiction-fixtures.ts):

| Input                          | Value                                                               |
| ------------------------------ | ------------------------------------------------------------------- |
| ISO codes                      | BW / BWA                                                            |
| Currency                       | BWP (Pula)                                                          |
| Region                         | Southern Africa                                                     |
| Official languages             | English and Setswana                                                |
| Primary mining authority       | Department of Mines (within Ministry of Minerals and Energy)        |
| Primary financial regulator    | Bank of Botswana (BoB)                                              |
| Sector precedent               | Diamond-export traceability is a mature regulatory area in Botswana |
| Local-presence partner needed? | TBD — flag at pre-send time                                         |

## Email source

The outbound email is rendered from the canonical [`sandbox-intro-email-template.md`](../../gtm/sandbox-intro-email-template.md) using the **Botswana** row in its parameter table — no per-country email draft is maintained here. Updates to shared text (cited artifacts, attestation status, meeting offer) happen once in the template and propagate to every country.

The send-ready render (every `{{placeholder}}` substituted, copy-paste-ready) lives at [`01-docs/08-gtm/renders/botswana-2026.md`](../../gtm/renders/botswana-2026.md).

## Status against playbook checklist

| #   | Playbook checklist item                                                    | Status     |
| --- | -------------------------------------------------------------------------- | ---------- |
| 1   | Confirm current BoB / DoM contact                                          | ⏸️ Pending |
| 2   | Confirm GTCX engagement-lead name + contact                                | ⏸️ Pending |
| 3   | Verify trust portal live and cited URLs return HTTP 200                    | ⏸️ Pending |
| 4   | Confirm pen test SoW signed or accept "contracted" language                | ⏸️ Pending |
| 5   | Confirm SOC 2 CPA engagement letter signed or accept "contracted" language | ⏸️ Pending |
| 6   | Internal approval                                                          | ⏸️ Pending |
| 7   | Verify primary recipient (BoB vs DoM)                                      | ⏸️ Pending |
| 8   | Identify candidate Batswana local-presence partner if needed               | ⏸️ Pending |

## Event log (newest first)

### 2026-05-24 — Email drafted

- Action: Drafted intro email targeting Department of Mines (with BoB as secondary path). Cites trust portal + internal completion audit + fuzz evidence; acknowledges pen test + SOC 2 contracted. Anchors Botswana-specific framing to existing diamond-traceability regulatory muscle as the common ground from which extension to other commodities becomes natural.
- Owner: Protocol Architect
- Next action: Walk through the 8-item pre-send checklist; confirm DoM vs BoB primary recipient.

### 2026-05-22 — Stub created

- Action: Stub engagement log created inheriting the [Sovereign-State Engagement Playbook](./playbook.md). Country-specific framing inputs captured for email drafting.
- Owner: Protocol Architect

## Pending decisions

| #   | Decision                                              | Owner              | Due        |
| --- | ----------------------------------------------------- | ------------------ | ---------- |
| 1   | Draft intro email                                     | Protocol Architect | 2026-06-05 |
| 2   | Confirm BoB vs DoM as primary recipient               | Protocol Architect | 2026-06-05 |
| 3   | Designate Batswana local-presence partner if required | Protocol Architect | 2026-06-12 |
