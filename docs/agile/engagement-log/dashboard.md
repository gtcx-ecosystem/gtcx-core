---
title: "Sovereign-State Engagement Dashboard"
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
title: 'Engagement Dashboard'
status: 'current'
date: '2026-05-22'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'critical'
tags: ['engagement', 'dashboard', 'sovereign', 'africa']
review_cycle: 'on-change'
---

# Sovereign-State Engagement Dashboard

> **Status:** Current
> **Date:** 2026-05-22
> **Owner:** Protocol Architect

Single-screen aggregate of the 5 active sovereign-state engagements. Source of truth for each is the per-country [engagement log](./README.md); this dashboard pulls the status / next action / blocker / owner into one view so parallel outreach across all 5 jurisdictions is operationally visible.

Update cadence: on every meaningful state change to any per-country log (event log entry, phase advance, decision resolved).

## All engagements at a glance

| Jurisdiction                           | Phase            | Primary recipient         | Email status       | Owner              | Next blocker                                                   |
| -------------------------------------- | ---------------- | ------------------------- | ------------------ | ------------------ | -------------------------------------------------------------- |
| [Zimbabwe](./2026-zimbabwe-sandbox.md) | **1 — Pre-send** | RBZ Fintech Sandbox       | Render staged      | Protocol Architect | Pages live + contact verified + internal approval              |
| [Ghana](./2026-ghana-sandbox.md)       | **1 — Pre-send** | BoG Regulatory Sandbox    | Render staged      | Protocol Architect | Verify BoG vs MinComm recipient; internal approval; Pages live |
| [Namibia](./2026-namibia-sandbox.md)   | **1 — Pre-send** | BoN Innovation Hub        | Render staged      | Protocol Architect | Verify BoN vs MME recipient; internal approval; Pages live     |
| [Botswana](./2026-botswana-sandbox.md) | **1 — Pre-send** | DoM (primary), BoB (sec.) | Render staged      | Protocol Architect | Verify DoM vs BoB recipient; internal approval; Pages live     |
| [DR Congo](./2026-drc-sandbox.md)      | **1 — Pre-send** | Cadastre Minier (CAMI)    | Render staged (FR) | Protocol Architect | French-fluent review; local-presence partner; CAMI vs BCC      |

## Phase legend (from [playbook](./playbook.md))

```
1. Pre-send      → email drafted, internal approval, recipient verified
2. Sent          → outbound email logged, response window opens
3. Response      → regulator replies; meeting scheduled or pivot needed
4. Meeting       → 45-minute pre-submission walkthrough
5. Application   → formal sandbox application based on meeting outcomes
6. Cohort        → active sandbox participation
7. Production    → graduation / production deployment
```

## Shared blockers (one fix unblocks multiple engagements)

| Blocker                                                              | Engagements affected                                                               | Resolution                                                                                                                                |
| -------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| GitHub Pages not yet enabled (trust portal URLs return 404)          | **All 5**                                                                          | Repo admin enables Pages → Actions per [hosting runbook](../../operations/trust-portal-hosting.md); see Sprint 3.2                        |
| First-publish has not fired (no `npm view @gtcx/* version` resolves) | **All 5** for "ready to install" claims, though emails can use "imminent" language | Engineering lead fires `release.yml` per [publish runbook](../../devops/release-mgmt/npm-publish-runbook.md); mobile team commits to ≤48h |
| Pen test SoW not signed                                              | **All 5** for the "external pen test contracted" line in each intro email          | Sprint 4.1 — RFP at [`pen-test-rfp-2026.md`](../../security/pen-test-rfp-2026.md); vendor outreach pending                                |
| SOC 2 CPA engagement letter not signed                               | **All 5** for the "SOC 2 Type 1 contracted" line                                   | Sprint 4.2 — readiness prep at [`soc2-readiness-prep.md`](../../compliance/soc2-readiness-prep.md); CPA outreach pending                  |
| GTCX engagement-lead name + contact not designated                   | **All 5** intro emails (signature block)                                           | Protocol Architect designates; one-time decision                                                                                          |

## Critical-path view

```
[GitHub Pages enabled]              [npm publish fires]
        │                                   │
        └──────────────┬────────────────────┘
                       │ (parallel — neither blocks the other)
                       ▼
              [Zimbabwe email ready to send]
                       │
                       │  + (recipient verified, lead designated, approvals)
                       ▼
              [Zimbabwe email sent] ── Phase 2 begins
                       │
                       │ — meanwhile other 4 stubs advance to drafted email
                       ▼
        [Ghana / Namibia / Botswana / DR Congo emails sent]
                       │
                       ▼
              [Pre-submission meetings booked]
                       │
                       ▼
            [Formal sandbox applications]
```

## Owner load

Currently all 5 engagement-leads are the Protocol Architect by default. Recommend designating a dedicated GTCX engagement-lead per country (or pairing them: Anglophone Southern Africa lead for Zimbabwe/Namibia/Botswana, Anglophone West Africa lead for Ghana, Francophone lead for DR Congo) before sending Phase 2 communications. Per-country log "Pending decisions" table captures this.

## Cross-jurisdiction precedent reuse

When one engagement accepts an artifact (e.g., RBZ accepts the trust portal as sufficient evidence for the pre-submission meeting), capture which artifact in the relevant per-country log so the next regulator can be told: _"RBZ accepted this; happy to share their feedback under NDA."_ This compounds — each accepted engagement makes the next one easier to start.

## Travel-pooling opportunity

If multiple meetings cluster in time, coordinate single-trip itineraries through regional hubs:

| Hub                   | Reachable engagements       | Notes                                                                                     |
| --------------------- | --------------------------- | ----------------------------------------------------------------------------------------- |
| Johannesburg          | Zimbabwe, Namibia, Botswana | Direct flights to Harare, Windhoek, Gaborone; 1.5–2.5 hours each                          |
| Accra                 | Ghana                       | Direct from Accra to most West African capitals if Ghana expands                          |
| Kinshasa (or Nairobi) | DR Congo                    | Kinshasa logistically complex; Nairobi-routing for inbound from EU/US is sometimes faster |

## Linked artifacts

- [Engagement Readiness Sprint Roadmap 2026-05-22](../roadmap/engagement-readiness-sprint-roadmap-2026-05-22.md) — Sprint 3 task 3.3
- [Sovereign-State Engagement Playbook](./playbook.md) — the generic structure each per-country log inherits
- [Jurisdiction fixture data](../../../tests/integration/fixtures/jurisdiction-fixtures.ts) — anchored country-specific framing inputs
- [Per-jurisdiction config schema](../../specs/packages/README.md) — `@gtcx/jurisdiction-config`
- [Trust portal](../../governance/trust-portal.md) — primary evidence surface each email cites
