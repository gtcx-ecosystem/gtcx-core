---
title: 'GTM readiness — index'
status: current
date: 2026-06-05
owner: gtcx-core
role: protocol-architect
document_id: AUDIT-GTM-INDEX-2026-06-05
audit_lane: gtm
framework: '~/.claude/GTM.md v1.0'
tier: standard
tags: ['audit', 'gtm', 'index']
review_cycle: quarterly
---

# GTM readiness — index

**Lane 5 of 5** — [readiness-model.md](./readiness-model.md)

Commercial adoptability and buyer stages — **non-engineering**.

---

## Scores (by buyer)

| Buyer                                           | Stage            | Notes                                                  |
| ----------------------------------------------- | ---------------- | ------------------------------------------------------ |
| **A — Library integrator** (`pnpm add @gtcx/*`) | **S1 Ready**     | npm + Sigstore + downstream docs                       |
| **A — Integrator 30-day trial**                 | **S2 Partial**   | Technical OK; no library-only pilot MSA                |
| **B — Ecosystem sovereign stack**               | **S2 Not Ready** | Infra/founder gates — not a core engineering downgrade |

---

## Canonical audits & docs

| Artifact                                                                         | Role                                      |
| -------------------------------------------------------------------------------- | ----------------------------------------- |
| [gtm-reality-check-2026-06-02.md](../gtm/gtm-reality-check-2026-06-02.md)        | Full S0–S6 assessment (historical detail) |
| [16-ecosystem-gtm-alignment.md](../gtm/16-ecosystem-gtm-alignment.md)            | Core vs infrastructure ownership          |
| [engagement-log/README.md](../agile/engagement-log/README.md)                    | Sandbox send status (all send-blocked)    |
| [external-dependencies-register](./external-dependencies-register-2026-05-28.md) | EXT-CORE-007–010 (GTM rows only)          |
| [gtm/README.md](../gtm/README.md)                                                | Regulator / investor evidence pack index  |

---

## Ecosystem blockers (buyer B)

Pen-test on live stack, pilot DPA, testnet/DR — see [16-ecosystem-gtm-alignment](../gtm/16-ecosystem-gtm-alignment.md) and gtcx-infrastructure GTM. **Lane 3** owns pen-test artifact; **lane 5** owns outreach and contracts.

---

## Out of scope

| Topic                     | Lane                                                                                 |
| ------------------------- | ------------------------------------------------------------------------------------ |
| `pnpm test` pass          | [engineering-completeness-quality](./engineering-completeness-quality-2026-06-05.md) |
| SOC 2 TSC mapping in-repo | [internal-compliance](./internal-compliance-2026-06-05.md)                           |
| Certified 8.9 composite   | [bank-grade](./bank-grade-2026-06-05.md)                                             |
