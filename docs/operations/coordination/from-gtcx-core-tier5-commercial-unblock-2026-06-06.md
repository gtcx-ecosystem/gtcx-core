---
title: 'Tier 5 commercial unblock — DTF-5.5.2 (R) vs 5.5.4 (S)'
status: current
date: 2026-06-06
owner: gtcx-core
role: protocol-architect
tier: standard
tags: ['coordination', 'tier-5', 'dtf-554']
review_cycle: on-change
document_id: COORD-CORE-T5-COMM-001
---

# gtcx-core — Tier 5 commercial track (2026-06-06)

Technical Tier 5 (~88%) is **done**. Commercial exit requires **DTF-5.5.4** (human) plus engineering pipeline **DTF-5.5.2** (Class **R**).

## IR unblock (2026-06-06)

**DTF-5.5.4 does not freeze gtcx-core engineering.**

| Track                    | Examples                                                                                                               | Agent                                         |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| **Class R (continue)**   | **CORE-004** prep, **LAUNCH-PLAN-\***, ops-docs queue, `pnpm certified-pack:*`, fuzz/KAT gates, coordination outbounds | Implement + micro-commit                      |
| **Class S (human only)** | **DTF-5.5.4** LOI or regulator letter in `docs/audit/evidence/`                                                        | **Approval needed** — never sign or fabricate |

| Forbidden                                               | Do                                                                               |
| ------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Idle because P22 names DTF-5.5.4                        | Drain `launch-focus.json` → `workSet.implement` via execution bout               |
| Claim Tier 5 **commercial** closed without redacted LOI | Witness only; link protocols evidence when human files PDF                       |
| `backlogClear` = stop session                           | `backlogClear` = commercial ceiling — keep **repoCompletable** / implement queue |

Ecosystem norm: [human-evidence-gates-unblock-2026-06-06.md](https://github.com/gtcx-ecosystem/gtcx-protocols/blob/main/docs/operations/coordination/human-evidence-gates-unblock-2026-06-06.md) (F11–F13 pattern); core commercial gate = **F14** in [ecosystem-unblock-playbook](https://github.com/gtcx-ecosystem/gtcx-protocols/blob/main/docs/operations/coordination/ecosystem-unblock-playbook-2026-06.md).

## Status Update template (P26)

### Done

- **DTF-5.5.2** certified pack pipeline — `pnpm certified-pack:build-manifest` + `verify-manifest` (Class **R**)
- **DTF-5.5.5** evidence index · **DTF-5.5.1** strict Zod packs

### Next priority

- **Owner:** gtcx-core (Class **R** witness) or **GTM/Legal** (5.5.4)
- **Action:** Run certified-pack gates after pack changes; **await** LOI/regulator letter for commercial close
- **Because:** **DTF-5.5.4** is the Tier 5 commercial gate (5-C2)

### Approval needed

- **DTF-5.5.4** — design-partner LOI or regulator letter (**Class S** — GTM / sovereign program only)

### Deferred

- Licensed delivery signature on manifest (production CSP ceremony)
- DTF-5.5.3 predicate-gated export keys (optional)

## Commands

```bash
pnpm certified-pack:build-manifest
pnpm certified-pack:verify-manifest
```

Runbook: [`certified-pack-pipeline.md`](../certified-pack-pipeline.md)  
**Commercial gate tracker:** [`dtf-554-commercial-gate-tracker-2026-06-07.md`](./dtf-554-commercial-gate-tracker-2026-06-07.md)

## Sibling repos

- **gtcx-protocols:** witness DTF-5.5.4 LOI in `docs/audit/evidence/` when redacted PDF available — do not duplicate manifest here
- **gtcx-agentic:** register row **DTF-5.5.4** awaiting-human if not present
