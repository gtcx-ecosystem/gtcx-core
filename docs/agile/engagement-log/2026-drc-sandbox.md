---
title: '2026 DRC Sandbox Engagement'
status: 'draft'
date: '2026-05-22'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'critical'
tags: ['engagement', 'drc', 'sandbox', 'regulator']
review_cycle: 'on-change'
---

# DR Congo Sandbox — Engagement Log

> **Status:** Pre-send — stub created, email not yet drafted
> **Date:** 2026-05-22
> **Owner:** Protocol Architect
> **Inherits:** [Sovereign-State Engagement Playbook](./playbook.md)

## Engagement state

| Field                           | Value                          |
| ------------------------------- | ------------------------------ |
| Target jurisdiction             | DR Congo                       |
| Primary recipient (candidate)   | Cadastre Minier (CAMI)         |
| Secondary recipient (candidate) | Banque Centrale du Congo (BCC) |
| Phase                           | **Pre-send** — stub only       |
| Email drafted                   | No                             |
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

### 2026-05-22 — Stub created

- Action: Stub engagement log created inheriting the [Sovereign-State Engagement Playbook](./playbook.md). Country-specific framing inputs captured for email drafting.
- Owner: Protocol Architect
- Next action: Draft intro email **in French**; secure French-speaking engagement-lead. Identify Congolese local-presence partner before send; CAMI is unlikely to engage without one given the operational complexity of artisanal-mining traceability.

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
