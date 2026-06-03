---
title: 'Agent Work Selection Manifest'
status: current
date: 2026-06-03
owner: protocol-architect
role: protocol-architect
tier: standard
tags: ['agents', 'roadmap', 'protocol-22', 'work-selection', 'dtf-001']
review_cycle: on-change
document_id: OPS-AWS-001
protocol: gtcx-docs/docs/governance/protocols/22-agent-work-selection/
adoption_status: established
---

# Agent Work Selection — gtcx-core

> **Protocol:** [Protocol 22 — Agent Work Selection](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/docs/governance/protocols/22-agent-work-selection/protocol.md)
>
> Agents compute next work from the 10/10 roadmap and **Defensibility Tier 5** workplan. **Never ask the operator to choose.**

## Canonical paths

| Artifact                | Path                                                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Execution roadmap**   | `docs/audit/execution-roadmap.md` (active phase FA-S1)                                                        |
| **Full audit (latest)** | `docs/audit/full-audit-2026-06-04.md`                                                                         |
| **Unified 10/10 index** | `docs/audit/moat-completion-reconciliation-2026-06-03.md`                                                     |
| **Tier 5 work plan**    | `docs/operations/tier-5-workplan-2026-06.md`                                                                  |
| **DTF framework**       | [DTF-001 v1.0.0](https://github.com/gtcx-ecosystem/gtcx-docs/tree/main/frameworks/defensibility-tiers/v1.0.0) |
| 10/10 dimension roadmap | `docs/audit/moat-dimension-roadmap-10-10.md`                                                                  |
| Session pointer         | `.baseline/memory/session.md`                                                                                 |
| Selection script        | `scripts/agent-next-work.mjs`                                                                                 |

## Commands

```bash
pnpm agent:next-work
pnpm agent:work-selection:check
```

## Active frame

**Development** (default). Skip evidence-capture and external vendor milestones; select next **code** or **ops-docs** work.

## Selection algorithm

Apply tiers in order:

| Tier                         | Rule                                                                                |
| ---------------------------- | ----------------------------------------------------------------------------------- |
| 1 — Resume                   | `in_progress` in session — **DTF-5.x** or **D# M#.#**                               |
| 2 — Critical path code       | Lowest-score moat dimension (D1–D10) with pending milestone                         |
| 3 — Non-critical code        | Other dimensions with pending milestones                                            |
| 4 — Ops-docs                 | Author `docs/` when no code milestones remain                                       |
| **5 — Defensibility Tier 5** | Next pending **DTF-5.x** from tier-5 workplan (class `code` / `ops-docs`)           |
| 6 — External                 | CORE-004 ceremony, CORE-005–009, D8/D9/D10 — **do not start** without authorization |

## P0 — Full-audit pre-flight (blocks Tier 5 until done)

**Source:** [full-audit-2026-06-04.md](../audit/full-audit-2026-06-04.md) — turbo cycle breaks root `pnpm typecheck`.

| Next (default)                                      | Sprint | Owner                   |
| --------------------------------------------------- | ------ | ----------------------- |
| FA-P0-1 Break workproof ↔ verification turbo cycle  | FA-S1  | **done**                |
| **FA-P0-2** README: library readiness vs DTF Tier 5 | FA-S1  | frontier-infra-engineer |

## Defensibility Tier 5 (current automatable track)

**Status:** Tiers 1–4 achieved; **Tier 5 ~45%** (S-T5-1 done; S-T5-2 partial).

| Milestone                                 | Sprint | Status      |
| ----------------------------------------- | ------ | ----------- |
| DTF-5.1.1–5.1.4                           | S-T5-1 | **done**    |
| DTF-5.2.1–5.2.2                           | S-T5-2 | **done**    |
| DTF-5.2.3 diamond + range KATs            | S-T5-2 | **done**    |
| **DTF-5.3.1** gh-cocoa-origin profile     | S-T5-3 | **done**    |
| **DTF-5.3.2** Five-jurisdiction fixtures  | S-T5-3 | **done**    |
| **DTF-5.3.3** Minerals board UAT template | S-T5-3 | **done**    |
| **DTF-5.4.1** CircuitRegistry semver      | S-T5-4 | **done**    |
| **DTF-5.4.2** Load test 1000 proofs/min   | S-T5-4 | **pending** |

Full register: `docs/operations/tier-5-workplan-2026-06.md` · sprint overlay: [execution-roadmap.md](../audit/execution-roadmap.md).

## External-blocked (moat dimensions)

- **D8** — Z3/Coq consultant
- **D9** — pen-test vendor SOW
- **D10 M10.3** — regulator letter
- **DTF-5.4.4** — `gtcx-protocols` E2E (owner repo)
- **DTF-5.5.4+** — commercial / GTM

## Dimension quick-reference (moat 10/10)

| Dim   | Score | Critical | Status                        |
| ----- | ----- | -------- | ----------------------------- |
| D1–D6 | 10    | mixed    | **Done** in-repo              |
| D3    | 9.5   | No       | M3.2 release-gated (CORE-004) |
| D7    | 9     | No       | M7.5 external                 |
| D8–D9 | 0     | No       | **EXTERNAL**                  |
| D10   | 9.5   | No       | M10.3 external                |

## Active phase

| Track                  | Status                        |
| ---------------------- | ----------------------------- |
| A — Internal 10/10 S5  | **Done** (22/22 provenance)   |
| B — AM-1, AM-2         | **Done**                      |
| **FA — Full-audit P0** | **Done** (FA-P0-1–3)          |
| **T5 — Defensibility** | **~50%** — **DTF-5.3.1** next |
| Ceremony / vendors     | CORE-004–009 external         |

## Critical handoffs

| Handoff      | Item                                       | Status               |
| ------------ | ------------------------------------------ | -------------------- |
| CORE-003     | protocols KAT consumption                  | **done** 2026-06-03  |
| CORE-004     | D3 transcript verify                       | release-gated XR-402 |
| CORE-005–009 | pen-test, formal, lab, regulator, ZW email | external             |

## Implementation classes

| Class            | Action                      |
| ---------------- | --------------------------- |
| code             | Select                      |
| ops-docs         | Select when no code remains |
| evidence-capture | Skip                        |
| external         | Skip — handoff              |

## After completing a milestone

1. Mark **done** in `tier-5-workplan-2026-06.md` (if DTF-5.x) or update `moat-dimension-roadmap-10-10.md`.
2. Refresh `.baseline/memory/session.md`.
3. Run quality gates.
4. Micro-commit.
5. Re-run `pnpm agent:next-work`.

## Forbidden

- Asking the user which milestone to pick.
- Starting D8/D9 or commercial Tier 5 without authorization.
- Claiming **Tier 5 achieved** from generic circuits only (that is **Tier 2**).
