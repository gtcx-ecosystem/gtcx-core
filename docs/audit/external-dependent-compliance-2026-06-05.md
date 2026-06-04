---
title: 'External-dependent compliance — index'
status: current
date: 2026-06-05
owner: gtcx-core
role: crypto-security-engineer
document_id: AUDIT-EXT-COMPLIANCE-2026-06-05
audit_lane: external-dependent-compliance
tier: critical
tags: ['audit', 'compliance', 'external', 'index', 'status']
review_cycle: weekly
---

# External-dependent compliance — index

**Lane 3 of 5** — [readiness-model.md](./readiness-model.md)

**Audit quality (register as artifact):** **8.0/10** — itemized SoR with owners and impact.

**Readiness:** **status / tier only** — never 1–10 for delivery.

---

## Delivery status (readiness)

| Field        | Value                                                    |
| ------------ | -------------------------------------------------------- |
| Register     | **OPEN**                                                 |
| Complete     | **0 / 12**                                               |
| Prep in-repo | **PREP-READY** (pen-test RFP, SOC 2 docs, SLSA workflow) |
| Time gate    | **IN-FLIGHT** — EXT-CORE-012 until 2026-08-17            |
| Org block    | **BLOCKED** — EXT-CORE-004/005 npm provenance            |

---

## Item tiers (compliance subset)

| Tier             | EXT-CORE IDs                                      | Status             |
| ---------------- | ------------------------------------------------- | ------------------ |
| **T0 — Blocker** | 001 pen-test, 002 SOC 2, XR-402 ceremony          | `not-started`      |
| **T1 — High**    | 003 FIPS review, 004/005 provenance, 011 DR drill | `open`             |
| **T2 — Hygiene** | 006 RUSTSEC                                       | `open` (mitigated) |
| **T3 — Time**    | 012 90-day P1-free                                | `in-progress`      |

GTM rows 007–010 → [gtm-readiness](./gtm-readiness-2026-06-05.md).

---

## Canonical audit

[external-dependencies-register-2026-05-28.md](./external-dependencies-register-2026-05-28.md) — **SoR**
