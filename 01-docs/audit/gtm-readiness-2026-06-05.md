---
title: 'GTM-Readiness — index'
status: current
date: 2026-06-05
owner: gtcx-core
role: protocol-architect
document_id: AUDIT-GTM-READINESS-2026-06-05
audit_lane: gtm-readiness
framework: '~/.claude/GTM.md v1.0'
tier: standard
tags: ['audit', 'gtm-readiness', 'index', 'tier']
review_cycle: quarterly
---

# GTM-Readiness — index

**Lane 5 of 5** — [readiness-model.md](./readiness-model.md)

**Primary command:** `gtm-audit` → `01-docs/05-audit/gtm-audit-<date>.md`  
**Scoring:** [gtm-scoring.md](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/03-platform/tools/audit/lane-scoring/gtm-scoring.md)

Commercial adoptability for **who can buy what today** — non-engineering. Aligns with `~/.claude/GTM.md` S0–S6 stages, expressed here as **GR tiers**.

**Audit quality:** **8.0/10** — [gtm-reality-check-2026-06-02](../gtm/gtm-reality-check-2026-06-02.md)

**Readiness:** **GR tier + status** — never 1–10.

---

## GTM-Readiness tiers (GR-T0–GR-T6)

| Tier      | GTM stage     | Buyer can…                                                 | Current placement (gtcx-core)                         |
| --------- | ------------- | ---------------------------------------------------------- | ----------------------------------------------------- |
| **GR-T0** | S0 Prototype  | Internal team reproduces build                             | **Achieved**                                          |
| **GR-T1** | S1 MVP        | Developer integrates `@gtcx/*` in &lt; 1 day               | **Achieved** — library integrator                     |
| **GR-T2** | S2 Pilot      | Paying customer runs 30-day controlled trial               | **Partial** — technical OK; no library-only pilot MSA |
| **GR-T3** | S3 GA         | Close commercial deals without custom engineering per deal | **Not ready**                                         |
| **GR-T4** | S4 Enterprise | Fortune 500 security/legal/procurement approve             | **Not ready**                                         |
| **GR-T5** | S5 Government | Federal/state ATO pathway                                  | **Not ready**                                         |
| **GR-T6** | S6 Defense    | Classified / air-gap environments                          | **Not ready**                                         |

**Aggregate GTM-Readiness tier (library SKU):** **GR-T1**

**Aggregate GTM-Readiness tier (ecosystem sovereign stack):** **below GR-T2** — pen-test, testnet, sandbox send, pilot DPA open ([16-ecosystem-gtm-alignment](../gtm/16-ecosystem-gtm-alignment.md)).

---

## Buyer tracks

| Track                                   | Highest tier achieved | Status    |
| --------------------------------------- | --------------------- | --------- |
| **A — Library integrator**              | **GR-T1**             | Ready     |
| **A — Integrator 30-day trial**         | **GR-T2**             | Partial   |
| **B — Ecosystem sovereign / regulator** | **&lt; GR-T2**        | Not ready |

---

## Register rows (GTM-Readiness only)

EXT-CORE-007–010 (sandbox emails, pilot, regulator response) — tracked in [external-dependencies-register](./external-dependencies-register-2026-05-28.md), attributed to **lane 5** not Industry Compliance.

---

## Canonical audits

| Artifact                                                                  | Role          |
| ------------------------------------------------------------------------- | ------------- |
| [gtm-reality-check-2026-06-02.md](../gtm/gtm-reality-check-2026-06-02.md) | S0–S6 detail  |
| [16-ecosystem-gtm-alignment.md](../gtm/16-ecosystem-gtm-alignment.md)     | Owner split   |
| [engagement-log/README.md](../agile/engagement-log/README.md)             | Send-blocked  |
| [gtm/README.md](../gtm/README.md)                                         | Evidence pack |
