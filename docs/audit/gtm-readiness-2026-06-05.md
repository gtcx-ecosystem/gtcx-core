---
title: 'GTM readiness — gtcx-core'
status: current
date: 2026-06-05
owner: gtcx-core
role: protocol-architect
document_id: AUDIT-GTM-2026-06-05
audit_type: gtm-readiness
framework: '~/.claude/GTM.md v1.0'
tier: standard
tags: ['audit', 'gtm', 'stages']
review_cycle: quarterly
supersedes_note: 'Separates library GTM from ecosystem sovereign deals; supersedes gtm-reality-check-2026-06-02 verdict'
---

# GTM readiness — gtcx-core

**Date:** 2026-06-05  
**Product assessed:** `@gtcx/*` **foundation library** (npm/Rust) — not GTCX Cloud, not national deployment.  
**Model:** [readiness-model.md](./readiness-model.md)

---

## Two buyers — do not conflate

| Buyer                         | What they adopt                      | GTM doc row                                                                                     |
| ----------------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------- |
| **A — Platform engineer**     | npm packages in their app            | **This file — library rows**                                                                    |
| **B — Sovereign / regulator** | GTCX Cloud + protocols + infra stack | [16-ecosystem-gtm-alignment.md](../gtm/16-ecosystem-gtm-alignment.md) · gtcx-infrastructure GTM |

Failing buyer **B** does **not** lower engineering readiness.

---

## Library GTM stages (buyer A)

| Stage                 | Verdict             | Evidence                                                                                        |
| --------------------- | ------------------- | ----------------------------------------------------------------------------------------------- |
| S0 Prototype          | **Ready**           | `pnpm install && pnpm test` < 1h                                                                |
| S1 MVP                | **Ready**           | 22 npm packages + Sigstore; [07-downstream-integration.md](../gtm/07-downstream-integration.md) |
| S2 Pilot (integrator) | **Partially Ready** | RC evidence packs; no library-only pilot MSA; support via downstream owner                      |
| S3 GA                 | **Not Ready**       | No standalone library SKU contract/billing                                                      |
| S4 Enterprise         | **Not Ready**       | Attestation lane — pen-test, SOC 2                                                              |

**Current library GTM stage:** **S1 Ready** (highest stage all criteria met).

**Integrator 30-day trial:** **S2 Partial** — technically feasible; commercial wrapper undefined.

---

## Ecosystem GTM (buyer B — reference only)

Tracked for coordination honesty; **owner: gtcx-infrastructure + founder**, not core engineering.

| Stage                     | Verdict       | Blockers                                                                                                                             |
| ------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| S2 Sovereign / paid pilot | **Not Ready** | EXT-INF-002 pen-test; EXT-INF-013–015 pilot/DPA/testnet; sandbox sends blocked ([engagement-log](../agile/engagement-log/README.md)) |

**Do not** label this “gtcx-core S2 Not Ready” in README — use **“ecosystem sovereign stack S2 Not Ready.”**

---

## AI-specific (library scope)

| Concern               | Posture                                                                           |
| --------------------- | --------------------------------------------------------------------------------- |
| Runtime LLM           | **Not in core** — `@gtcx/workproof/ai` types only; runtime in `gtcx-intelligence` |
| `ai:evaluate` in CI   | Engineering gate; not a buyer SLA                                                 |
| Consequential actions | Policy: human-in-the-loop in products — demonstrate downstream                    |

---

## 90-day actions (GTM lane only)

| #   | Action                                            | Buyer | Owner    |
| --- | ------------------------------------------------- | ----- | -------- |
| 1   | Publish library integrator pilot success template | A     | Protocol |
| 2   | Send first sandbox intro (Zimbabwe)               | B     | Founder  |
| 3   | Sign pen-test SOW (enables B security narrative)  | B     | Infra    |

Full plan history: [gtm-reality-check-2026-06-02.md](../gtm/gtm-reality-check-2026-06-02.md) (partially superseded).

---

## Related

- GTM evidence pack: [gtm/README.md](../gtm/README.md)
- Compliance lane: [compliance-attestation-2026-06-05.md](./compliance-attestation-2026-06-05.md)
