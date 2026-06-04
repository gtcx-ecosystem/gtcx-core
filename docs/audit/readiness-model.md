---
title: 'Readiness model — three lanes'
status: current
date: 2026-06-05
owner: gtcx-core
role: quality-evidence-lead
document_id: AUDIT-READINESS-MODEL-001
tier: critical
tags: ['audit', 'readiness', 'governance']
review_cycle: on-change
---

# Readiness model — three lanes

**Purpose:** Stop conflating **engineering**, **compliance/attestation**, and **GTM** into one “bank-grade composite.” Each lane has its own scorecard, evidence, and owner.

**Applies to:** `gtcx-core` as an **npm/Rust foundation library**. Downstream deployable products (`gtcx-markets`, Cloud stack) carry additional lanes in their owner repos.

---

## The three lanes

| Lane                             | Question it answers                                                          | Primary evidence                                                 | Typical owner                           |
| -------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------- | --------------------------------------- |
| **1 — Engineering readiness**    | Can we build, test, release, and integrate this code safely?                 | CI gates, coverage, architecture check, fuzz, provenance         | gtcx-core engineering                   |
| **2 — Compliance & attestation** | Will security/legal/procurement accept **third-party and regulatory proof**? | Pen-test report, SOC 2 letter, ceremony transcript, trust portal | Compliance + infra + human vendors      |
| **3 — GTM readiness**            | Can a **specific buyer type** adopt or buy **today** (non-engineering)?      | Stage S0–S6, contracts, pilot owner, outbound comms              | Founder/GTM + infra for ecosystem deals |

**Rule:** Never subtract engineering score because pen-test is missing. Never claim “bank-grade 8.9” as “engineering done.”

---

## Canonical scorecards (2026-06-05)

| Lane                     | Score / stage                                           | Canonical doc                                                                  |
| ------------------------ | ------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Engineering              | **9.5/10**                                              | [engineering-readiness-2026-06-05.md](./engineering-readiness-2026-06-05.md)   |
| Compliance & attestation | **5.5/10** (attestation); **8.8/10** (in-repo controls) | [compliance-attestation-2026-06-05.md](./compliance-attestation-2026-06-05.md) |
| GTM (library buyer)      | **S1 Ready** · integrator pilot **S2 Partial**          | [gtm-readiness-2026-06-05.md](./gtm-readiness-2026-06-05.md)                   |

**Ecosystem sovereign stack GTM** (ZWCMP, regulator sandbox) is tracked under **lane 3 — ecosystem row** in [gtm-readiness-2026-06-05.md](./gtm-readiness-2026-06-05.md), owned with [gtcx-infrastructure GTM](../gtm/16-ecosystem-gtm-alignment.md) — **not** a downgrade of engineering.

---

## Legacy audits

| Doc                                                                                  | Status                                                                                          |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| [master-audit-2026-06-03.md](./master-audit-2026-06-03.md)                           | **Historical composite** — retained for investor lens; superseded for day-to-day by three lanes |
| [internal-completion-audit-2026-05-21.md](./internal-completion-audit-2026-05-21.md) | **Engineering lane source** — 9.5/10 internal completion                                        |
| [full-audit-2026-06-04.md](./full-audit-2026-06-04.md)                               | Architecture sprint snapshot — engineering findings only                                        |
| [gtm-reality-check-2026-06-02.md](../gtm/gtm-reality-check-2026-06-02.md)            | Superseded for stage verdict by [gtm-readiness-2026-06-05.md](./gtm-readiness-2026-06-05.md)    |

---

## Defensibility Tier 5 (DTF) — where it fits

| DTF slice                                           | Lane                                |
| --------------------------------------------------- | ----------------------------------- |
| Tiers 1–4, S-T5-1–5.4, DTF-5.5.1 jurisdiction packs | **Engineering** (+ crypto evidence) |
| CORE-004 trusted-setup ceremony                     | **Compliance & attestation**        |
| DTF-5.5.2+ Legal, DTF-5.5.4 GTM commercial          | **GTM** (human authorization)       |

Technical Tier 5 **~88%** is an **engineering + crypto evidence** metric, not commercial Tier 5 achieved.

---

## Verification commands (engineering lane only)

```bash
pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm build
pnpm architecture:check && pnpm provenance:check-npm:strict
pnpm docs:check-frontmatter && pnpm check:workspace-root-cleanliness:strict
```

Compliance and GTM lanes require **artifact links** (PDF/letter/hub row), not green CI alone.
