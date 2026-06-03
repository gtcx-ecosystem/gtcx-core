---
title: 'DR Congo Sandbox — Engagement Log'
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

title: '2026 DRC Sandbox Engagement'
status: 'current'
date: '2026-05-24'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'critical'
tags: ['engagement', 'drc', 'sandbox', 'regulator']
review_cycle: 'on-change'

---

# DR Congo Sandbox — Engagement Log

> **Status:** Pre-send — email drafted (French), awaiting recipient verification, local-presence partner, and approval
> **Date:** 2026-05-24
> **Owner:** Protocol Architect
> **Inherits:** [Sovereign-State Engagement Playbook](./playbook.md)

## Engagement state

| Field                           | Value                          |
| ------------------------------- | ------------------------------ |
| Target jurisdiction             | DR Congo                       |
| Primary recipient (candidate)   | Cadastre Minier (CAMI)         |
| Secondary recipient (candidate) | Banque Centrale du Congo (BCC) |
| Phase                           | **Pre-send** — stub only       |
| Email drafted                   | Yes — see below (French)       |
| Email sent date                 | —                              |
| Response received               | —                              |
| Pre-submission meeting held     | —                              |
| Formal sandbox application      | —                              |
| Sandbox cohort placement        | —                              |

## Country-specific framing inputs

For when the email is drafted — anchored to the [DR Congo fixture](../../../tests/integration/fixtures/jurisdiction-fixtures.ts):

| Input                          | Value                                                                           |
| ------------------------------ | ------------------------------------------------------------------------------- |
| ISO codes                      | CD / COD                                                                        |
| Currency                       | CDF (Congolese Franc); USD also widely used in commercial transactions          |
| Region                         | Central Africa                                                                  |
| Official language              | French (with Lingala, Swahili, Kikongo, Tshiluba)                               |
| Primary mining authority       | Cadastre Minier (CAMI) under Ministry of Mines                                  |
| Primary financial regulator    | Banque Centrale du Congo (BCC)                                                  |
| Sector precedent               | DRC dominates global cobalt + coltan supply; mining traceability is high-stakes |
| Local-presence partner needed? | TBD — likely yes given operational complexity                                   |
| Language for email             | **French** — primary recipient communicates in French                           |

## Email source

The outbound email is rendered from the canonical **French variant** [`sandbox-intro-email-template.fr.md`](../../gtm/sandbox-intro-email-template.fr.md) using the **RDC** row in its parameter table. Updates propagate from the parent [English template](../../gtm/sandbox-intro-email-template.md) where applicable.

The send-ready French render (every `{{placeholder}}` substituted, copy-paste-ready) lives at [`docs/gtm/renders/drc-2026.fr.md`](../../gtm/renders/drc-2026.fr.md). **French-fluent review required before send.**

## Status against playbook checklist

| #   | Playbook checklist item                                                                  | Status     |
| --- | ---------------------------------------------------------------------------------------- | ---------- |
| 1   | Confirm current CAMI / BCC contact                                                       | ⏸️ Pending |
| 2   | Confirm GTCX engagement-lead name + contact (French-speaking preferred)                  | ⏸️ Pending |
| 3   | Verify trust portal live and cited URLs return HTTP 200                                  | ⏸️ Pending |
| 4   | Confirm pen test SoW signed or accept "contracted" language                              | ⏸️ Pending |
| 5   | Confirm SOC 2 CPA engagement letter signed or accept "contracted" language               | ⏸️ Pending |
| 6   | Internal approval                                                                        | ⏸️ Pending |
| 7   | Verify primary recipient (CAMI vs BCC)                                                   | ⏸️ Pending |
| 8   | Identify Congolese local-presence partner — likely required given operational complexity | ⏸️ Pending |
| 9   | Translate intro email to French (or write natively in French)                            | ⏸️ Pending |

## Event log (newest first)

### 2026-05-24 — Email drafted (French)

- Action: Drafted intro email in French targeting Cadastre Minier (CAMI), with BCC as secondary. Cites trust portal + internal completion audit + fuzz evidence; acknowledges pen test + SOC 2 contracted. Anchors DRC-specific framing to CAMI regulatory structure, CDF/USD settlement, and the cobalt/coltan artisanal-mining traceability stakes that drive the sovereignty framing.
- Owner: Protocol Architect
- Next action: French-fluent reviewer pass before send. Identify Congolese local-presence partner — CAMI engagement is gated on this. Verify CAMI vs BCC primary recipient.

### 2026-05-22 — Stub created

- Action: Stub engagement log created inheriting the [Sovereign-State Engagement Playbook](./playbook.md). Country-specific framing inputs captured for email drafting.
- Owner: Protocol Architect

## Pending decisions

| #   | Decision                                       | Owner              | Due        |
| --- | ---------------------------------------------- | ------------------ | ---------- |
| 1   | Draft intro email in French                    | Protocol Architect | 2026-06-12 |
| 2   | Confirm CAMI vs BCC as primary recipient       | Protocol Architect | 2026-06-12 |
| 3   | Designate Congolese local-presence partner     | Protocol Architect | 2026-06-12 |
| 4   | Designate French-speaking GTCX engagement lead | Protocol Architect | 2026-06-12 |

## DRC-specific risk register

| Risk                                                                                 | Likelihood | Impact | Mitigation                                                                                                                      |
| ------------------------------------------------------------------------------------ | ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------------- |
| Email in English signals lack of local context                                       | High       | Medium | Draft and send in French; have a French-fluent reviewer check before send                                                       |
| CAMI requires local partner for meaningful conversation                              | High       | Medium | Pre-identify local partner; mention them by name in the intro email if a partnership is already in motion                       |
| Cobalt/coltan supply chain is geopolitically sensitive — perceived foreign overreach | Medium     | High   | Frame as supporting Congolese sovereignty over traceability, not displacing it; cite the sovereign-data-residency design choice |
| Travel logistics in Kinshasa more complex than other capitals                        | Medium     | Low    | Allow longer lead time; video-first meetings preferred for initial conversations                                                |
