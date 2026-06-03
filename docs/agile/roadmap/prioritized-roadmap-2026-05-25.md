---
title: 'Prioritized Roadmap — GTCX Ecosystem'
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

title: 'Prioritized Roadmap — GTCX Ecosystem'
status: 'current'
date: '2026-05-25'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'critical'
tags: ['roadmap', 'prioritized', 'ecosystem', 'cross-repo']
review_cycle: 'weekly'

---

# Prioritized Roadmap — GTCX Ecosystem

> **Status:** Current
> **Date:** 2026-05-25
> **Owner:** Protocol Architect
> **Horizon:** Now → 2026-06-30

**Current composite score:** 8.9/10 (gtcx-core), 7.6/10 (gtcx-protocols)
**Target:** 9.5/10 across all repos, first sovereign-state engagement live

---

## How to Read This Roadmap

| Priority | Meaning                                                      | SLA                              |
| -------- | ------------------------------------------------------------ | -------------------------------- |
| P0       | Blocks publish, regulator engagement, or external validation | Must start within 24h            |
| P1       | High value, low risk, unblocks external readiness            | Must complete this week          |
| P2       | Important but blocked on P0/P1 or external decision          | Next sprint (week of 2026-06-02) |
| P3       | Strategic, longer timeline, or exploratory                   | Backlog, reassess weekly         |

**Dependency rule:** Nothing in P1 can require something in P2. P0 items can block P1. P2 items can block P3.

---

## P0 — Critical Path (This Week)

These block the publish window, regulator readiness, or external validation kickoff.

| #    | Item                                           | Repo           | Owner                         | Effort | Blocker                                                | Target Date           |
| ---- | ---------------------------------------------- | -------------- | ----------------------------- | ------ | ------------------------------------------------------ | --------------------- |
| P0.1 | **Fire npm publish**                           | gtcx-core      | mobile-engineering-lead       | 15 min | ✅ Complete 2026-05-26 — 18 packages published         | Wed–Fri 2026-05-28→30 |
| P0.2 | **Resolve Ext-1 predicate collisions**         | gtcx-core      | protocol-architect + proposer | 2–4h   | Proposer response on 3 renamed predicates              | Tue 2026-05-27        |
| P0.3 | **Switch gtcx-protocols deps to npm versions** | gtcx-protocols | protocol-architect            | 15 min | ✅ Complete 2026-05-26 — link: → ^, 714 tests pass     | Fri 2026-05-30        |
| P0.4 | **Pen-test vendor selection kickoff**          | gtcx-core      | crypto-security-engineer      | 2–4h   | None — RFP approved, 5-vendor longlist ready           | Wed 2026-05-28        |
| P0.5 | **SOC 2 CPA firm outreach**                    | gtcx-core      | quality-evidence-lead         | 2–4h   | None — readiness prep approved, 4-firm shortlist ready | Thu 2026-05-29        |

**P0 critical path:**

```
P0.2 (Tue) → P0.1 (Wed–Fri) → P0.3 (Fri)
     ↓
P0.4 (Wed) + P0.5 (Thu)  ← parallel, no deps
```

---

## P1 — High Value This Week

These don't block P0 but deliver significant readiness lift if completed in parallel.

| #    | Item                                            | Repo           | Owner                 | Effort | Blocker                                | Value                                                          |
| ---- | ----------------------------------------------- | -------------- | --------------------- | ------ | -------------------------------------- | -------------------------------------------------------------- |
| P1.1 | **Wire bridge into TradePass entry points**     | gtcx-protocols | protocol-architect    | 2–3h   | None — bridge exists, tests pass       | Stage 1.5 completion; claim-service uses canonical predicates  |
| P1.2 | **Enable GitHub Pages for trust portal**        | gtcx-core      | repo admin            | 30 min | Admin access to repo settings          | Unblocks Sprint 3.2; regulator-facing URL                      |
| P1.3 | **Draft vendor outreach emails**                | gtcx-core      | quality-evidence-lead | 1h     | None — templates ready                 | Unblocks P0.4/P0.5 for human owners                            |
| P1.4 | **Post-publish provenance verification**        | gtcx-core      | quality-evidence-lead | 30 min | P0.1                                   | Confirms SLSA Build L3 attestation on npm                      |
| P1.5 | **Update gtcx-protocols CHANGELOG for ADR-012** | gtcx-protocols | protocol-architect    | 30 min | None — commit `2d765f9` already merged | Downstream visibility of bridge addition                       |
| P1.6 | **Run full cross-repo test matrix**             | both           | protocol-architect    | 1h     | None — all suites pass individually    | Confidence before publish; run `pnpm test` in core + protocols |

**P1 execution order:**

- P1.3 can happen immediately (draft emails)
- P1.1 + P1.6 can happen in parallel (both internal engineering)
- P1.2 needs repo admin (external dependency)
- P1.4 + P1.5 happen after P0.1 (publish)

---

## P2 — Next Sprint (Week of 2026-06-02)

Blocked on P0/P1 completion or external decisions.

| #    | Item                                                           | Repo              | Owner                   | Effort | Unblocks When                            |
| ---- | -------------------------------------------------------------- | ----------------- | ----------------------- | ------ | ---------------------------------------- |
| P2.1 | **Send Zimbabwe pre-submission email**                         | gtcx-core         | gtm-lead                | 30 min | P0.1 + P1.2 (publish + trust portal URL) |
| P2.2 | **Implement Ext-1 continental predicates**                     | gtcx-core         | protocol-architect      | 6–8h   | P0.2 (collision resolution)              |
| P2.3 | **DR runbook drill — Scenario A (repo compromise)**            | gtcx-core         | protocol-architect      | 2h     | None — can run anytime                   |
| P2.4 | **Refactor gtcx-zkp/src/tests.rs (470 LOC)**                   | gtcx-core         | frontier-infra-engineer | 2–3h   | None — approaching 500 LOC limit         |
| P2.5 | **Update operator taxonomy to reference canonical predicates** | gtcx-intelligence | gtcx-intelligence lead  | 4–6h   | P1.1 (bridge wired into entry points)    |
| P2.6 | **Send Ghana/Namibia/Zambia/DRC pre-submission emails**        | gtcx-core         | gtm-lead                | 2h     | P2.1 (Zimbabwe response pattern)         |
| P2.7 | **TradePass parallel registry deprecation markers**            | gtcx-protocols    | protocol-architect      | 2–3h   | P1.1 (bridge in active use)              |

---

## P3 — Strategic Backlog

Reassess weekly. These are valuable but not on the critical path to first sovereign-state engagement.

| #    | Item                                                        | Repo              | Owner                    | Timeline                 |
| ---- | ----------------------------------------------------------- | ----------------- | ------------------------ | ------------------------ |
| P3.1 | **FIPS Rust backend (aws-lc-rs) — `SigningProvider` trait** | gtcx-core         | frontier-infra-engineer  | M2/M3                    |
| P3.2 | **HSM key storage — `KeyStore` trait + `MemoryKeyStore`**   | gtcx-core         | frontier-infra-engineer  | M2/M3                    |
| P3.3 | **ark-\* upstream advisory escalation**                     | gtcx-core         | frontier-infra-engineer  | Ongoing — monthly review |
| P3.4 | **Bundle size budget enforcement in CI**                    | gtcx-core         | protocol-architect       | M3                       |
| P3.5 | **24-hour fuzz campaign execution**                         | gtcx-core         | crypto-security-engineer | M3                       |
| P3.6 | **TradePass v4.0 — remove parallel registry**               | gtcx-protocols    | protocol-architect       | M3/M4                    |
| P3.7 | **Operator taxonomy execution engine**                      | gtcx-intelligence | gtcx-intelligence lead   | M3                       |

---

## Resource Allocation

| Owner                    | P0 Items   | P1 Items         | P2 Items         | Total Effort This Week |
| ------------------------ | ---------- | ---------------- | ---------------- | ---------------------- |
| protocol-architect       | P0.2, P0.3 | P1.1, P1.5, P1.6 | P2.2, P2.3, P2.7 | ~12–16h                |
| mobile-engineering-lead  | P0.1       | —                | —                | 15 min                 |
| crypto-security-engineer | P0.4       | —                | —                | 2–4h                   |
| quality-evidence-lead    | P0.5       | P1.3, P1.4       | —                | 4–6h                   |
| gtm-lead                 | —          | —                | P2.1, P2.6       | 2–3h                   |
| repo admin               | —          | P1.2             | —                | 30 min                 |
| frontier-infra-engineer  | —          | —                | P2.4             | 2–3h                   |

**Note:** P0.1 (publish) is a single trigger action — low effort, high consequence. P0.2 (Ext-1 collision resolution) is the highest-effort P0 item and is on the critical path for 1.0.0 inclusion.

---

## Risk Register

| Risk                                    | Impact                                     | Likelihood | Mitigation                                                                                                    | Owner                    |
| --------------------------------------- | ------------------------------------------ | ---------- | ------------------------------------------------------------------------------------------------------------- | ------------------------ |
| Ext-1 proposer doesn't respond by Tue   | Ext-1 misses 1.0.0, requires 1.1.0         | Medium     | Proceed with 1.0.0 as-is; schedule 1.1.0 for following week                                                   | protocol-architect       |
| Publish workflow halts                  | Packages not on npm, blocks all downstream | Low        | Standby diagnostics ready; common failure modes documented in `docs/internal/external-readiness-checklist.md` | protocol-architect       |
| Pen-test vendors unavailable            | Delays external validation by 2–4 weeks    | Medium     | 5-vendor longlist provides alternatives; negotiate phased delivery                                            | crypto-security-engineer |
| CPA firm summer audit season full       | SOC 2 Type 1 pushed to Q3                  | Medium     | Boutique firms preferred over Big 4; engagement letter with "in progress" attestation language                | quality-evidence-lead    |
| GitBook sync delay                      | Trust portal may lag repo by minutes       | Low        | GitBook auto-syncs on push; no manual action needed                                                           | gitbook admin            |
| rustls-webpki upstream fix not released | Cargo audit stays mitigated, not resolved  | Medium     | Monthly reassessment of `rust/.cargo/audit.toml`; escalate to AWS SDK maintainers if critical                 | frontier-infra-engineer  |

---

## Definition of Done for This Week

At the end of Fri 2026-05-30, the following must be true:

- [x] P0.1 — `@gtcx/workproof@1.0.0` and `@gtcx/verification@3.1.0` are installable from npm
- [ ] P0.3 — gtcx-protocols uses npm versions, not `link:`
- [ ] P0.4 — Pen-test vendor outreach emails sent to ≥2 vendors
- [ ] P0.5 — SOC 2 CPA outreach emails sent to ≥2 firms
- [ ] P1.1 — TradePass `claim-service.ts` uses `resolvePredicate()` for legacy ID fallback
- [ ] P1.4 — `npm audit signatures @gtcx/workproof` returns valid provenance attestation
- [ ] P1.6 — Cross-repo test matrix passes (gtcx-core + gtcx-protocols full suites)

Optional (nice to have):

- [ ] P0.2 — Ext-1 collision resolution complete, PR open
- [ ] P1.2 — GitHub Pages enabled, trust portal accessible at external URL
- [ ] P2.1 — Zimbabwe pre-submission email sent (blocked on human: recipient contact + approval)

---

## Sign-Off

| Role               | Status  | Date       |
| ------------------ | ------- | ---------- |
| Protocol Architect | Drafted | 2026-05-25 |
| Engineering Lead   | Pending | —          |
| GTM Lead           | Pending | —          |
| Security Lead      | Pending | —          |
