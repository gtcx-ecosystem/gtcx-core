---
title: 'Defensibility Tier 5 — Work Plan (gtcx-core)'
status: current
date: 2026-06-03
owner: protocol-architect
role: protocol-architect
document_id: OPS-T5-001
protocol: gtcx-docs/frameworks/defensibility-tiers/v1.0.0
framework_id: DTF-001
review_cycle: weekly
tier: critical
tags: ['defensibility', 'tier-5', 'zkp', 'workplan', 'protocol-22']
---

# Defensibility Tier 5 — Work Plan (gtcx-core)

**Horizon:** 2026-06-03 → 2026-09-30 (technical exit target: 8 weeks; commercial: Q4 2026)  
**Canonical framework:** [DTF-001 path-to-tier-5](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/frameworks/defensibility-tiers/v1.0.0/path-to-tier-5.md)  
**Related:** [algorithmic moat program](../agile/roadmap/algorithmic-moat-program-2026-06-02.md) · [moat reconciliation](../audit/moat-completion-reconciliation-2026-06-03.md) · [cross-repo sprint workplan](./coordination/cross-repo-sprint-workplan-2026-06.md)

## Status today

| Defensibility tier | State                                                 |
| -----------------: | ----------------------------------------------------- |
|                1–4 | **Achieved** (2026-06-03 live audit)                  |
|    **5 technical** | **In progress** — next automatable work **DTF-5.2.3** |
|   **5 commercial** | Blocked on GTM / Legal / infra (P5)                   |

**10/10 note:** Algorithmic dimension scores (~8.95 weighted) measure **Tier 2** test depth. **Tier 5** requires named jurisdiction circuits + registry + commercial gate — not the same bar.

---

## Exit criteria

| Bar                     | Gate                                                                                                                           | Evidence                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------- |
| **Tier 5 — technical**  | DTF-5.4.\* + [5-T1–5-T5](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/frameworks/defensibility-tiers/v1.0.0/tiers.md) | CI green; trust portal circuit IDs; protocols E2E |
| **Tier 5 — commercial** | DTF-5.5.4 or regulator letter (5-C2)                                                                                           | Redacted LOI/letter in `docs/audit/evidence/`     |
| **Sovereign deploy**    | XR-402 ceremony + CORE-004                                                                                                     | Parallel; not required for lab P1–P4              |

---

## Sprint map (gtcx-core engineering)

| Sprint     | Dates (target)     | Phase | Theme                                                                | Exit                            |
| ---------- | ------------------ | ----- | -------------------------------------------------------------------- | ------------------------------- |
| **S-T5-1** | 2026-06-03 → 06-14 | P1    | Witness + commodity-origin **`gh-gold-origin` profile** + NAPI + KAT | DTF-5.1.4 CI pass               |
| **S-T5-2** | 2026-06-15 → 06-28 | P2    | `zw-diamond-origin` + verification integration                       | DTF-5.2.3                       |
| **S-T5-3** | 2026-06-29 → 07-12 | P3    | `gh-cocoa-origin` + jurisdiction fixtures                            | DTF-5.3.3 script                |
| **S-T5-4** | 2026-07-13 → 07-26 | P4    | Circuit registry + performance                                       | **Tier 5 technical** candidate  |
| **S-T5-5** | 2026-07-27 → 09-30 | P5    | Certified packs + protocols + pilot                                  | **Tier 5 commercial** (GTM-led) |

---

## Master register

| ID        | Title                                                                 | Sprint | Owner                      | Status   | Class            | Depends     | Blocks            |
| --------- | --------------------------------------------------------------------- | ------ | -------------------------- | -------- | ---------------- | ----------- | ----------------- |
| DTF-5.1.1 | Witness builder: WorkProof → typed witness                            | S-T5-1 | protocol-engineer          | **done** | code             | —           | 5.1.2–5.1.4       |
| DTF-5.1.2 | Commodity-origin R1CS + **`gh-gold-origin` profile** + negative tests | S-T5-1 | crypto-security-engineer   | **done** | code             | 5.1.1       | 5.1.3             |
| DTF-5.1.3 | NAPI prove/verify (profile-aware, same R1CS)                          | S-T5-1 | frontier-infra-engineer    | **done** | code             | 5.1.2       | 5.1.4             |
| DTF-5.1.4 | KAT `groth16-gh-gold-origin.kat.json` + CI                            | S-T5-1 | quality-evidence-lead      | **done** | code             | 5.1.3       | S-T5-2            |
| DTF-5.2.1 | **`zw-diamond-origin` profile** (same R1CS)                           | S-T5-2 | crypto-security-engineer   | **done** | code             | S-T5-1 exit | 5.2.2             |
| DTF-5.2.2 | Verification package integration test                                 | S-T5-2 | protocol-engineer          | **done** | code             | 5.2.1       | 5.2.3             |
| DTF-5.2.3 | KATs for diamond + range circuits                                     | S-T5-2 | quality-evidence-lead      | pending  | code             | 5.2.2       | S-T5-3            |
| DTF-5.3.1 | **`gh-cocoa-origin` profile** (same R1CS)                             | S-T5-3 | crypto-security-engineer   | pending  | code             | S-T5-2 exit | 5.3.2             |
| DTF-5.3.2 | Five-jurisdiction integration fixtures (redacted)                     | S-T5-3 | protocol-engineer          | pending  | code             | 5.3.1       | 5.3.3             |
| DTF-5.3.3 | Minerals board UAT protocol (evidence template)                       | S-T5-3 | quality-evidence-lead      | pending  | ops-docs         | 5.3.2       | S-T5-4            |
| DTF-5.4.1 | `CircuitRegistry` with semver + deprecation                           | S-T5-4 | protocol-architect         | pending  | code             | S-T5-3 exit | 5.4.2–5.4.4       |
| DTF-5.4.2 | Load test 1000 proofs/min + evidence JSON                             | S-T5-4 | frontier-infra-engineer    | pending  | code             | 5.4.1       | 5.4.3             |
| DTF-5.4.3 | Trust portal circuit ID column                                        | S-T5-4 | protocol-architect         | pending  | ops-docs         | 5.4.1       | 5.4.4             |
| DTF-5.4.4 | `gtcx-protocols` E2E per circuit ID                                   | S-T5-4 | gtcx-protocols             | pending  | code             | 5.4.1       | **T5 technical**  |
| DTF-5.5.1 | Jurisdiction pack Zod CI hardening                                    | S-T5-5 | protocol-engineer          | pending  | code             | —           | 5.5.2             |
| DTF-5.5.2 | Certified pack pipeline (signed manifest)                             | S-T5-5 | Legal + protocol-architect | pending  | external         | 5.5.1       | 5.5.4             |
| DTF-5.5.3 | Predicate-gated export keys (optional)                                | S-T5-5 | crypto-security-engineer   | deferred | code             | 5.5.1       | —                 |
| DTF-5.5.4 | Design-partner LOI or regulator letter                                | S-T5-5 | GTM                        | pending  | evidence-capture | infra pilot | **T5 commercial** |
| DTF-5.5.5 | Evidence index entry                                                  | S-T5-5 | quality-evidence-lead      | pending  | ops-docs         | 5.5.4       | —                 |

**Cross-repo:** DTF-5.4.4 owner is `gtcx-protocols` — file inbound handoff when S-T5-4 starts.

**Ceremony:** XR-402 / CORE-004 runs parallel; production keys not required for S-T5-1 lab proofs.

---

## S-T5-1 — Witness + Ghana gold (detail)

### DTF-5.1.1 — Witness builder

| Field          | Value                                                                                                               |
| -------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Paths**      | `packages/workproof/`, new `rust/gtcx-zkp/src/witness/` (or equivalent)                                             |
| **Acceptance** | Map ≥1 WorkProof predicate family to typed witness struct; unit tests; no untyped `Vec<u8>` witnesses in public API |
| **Gates**      | `cargo test -p gtcx-zkp`, `pnpm test --filter @gtcx/workproof`                                                      |

### DTF-5.1.2 — Commodity-origin + `gh-gold-origin` profile

| Field          | Value                                                                                                                                  |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Paths**      | `rust/gtcx-zkp/src/circuit_profiles/`, `packages/workproof/src/circuit-profiles/`, `docs/specs/packages/zkp-circuit-profiles.md`       |
| **Acceptance** | No forked circuit; profile config drives GPS bounds, purity/weight, cert mask; negative test per constraint group on `CommodityOrigin` |
| **Gates**      | `cargo test -p gtcx-zkp circuit_profiles`, `pnpm test --filter @gtcx/workproof`                                                        |

### DTF-5.1.3 — NAPI

| Field          | Value                                                                                        |
| -------------- | -------------------------------------------------------------------------------------------- |
| **Acceptance** | Prove/verify from TS via `@gtcx/crypto-native`; integration test in `packages/crypto/tests/` |
| **Gates**      | `pnpm test --filter @gtcx/crypto`                                                            |

### DTF-5.1.4 — KAT

| Field          | Value                                                                                           |
| -------------- | ----------------------------------------------------------------------------------------------- |
| **Acceptance** | `artifacts/kat/groth16-gh-gold-origin.kat.json`; `pnpm test:kat-cross-impl` includes new vector |
| **Gates**      | CI KAT job green                                                                                |

---

## Protocol 22 selection

When in-repo moat dimensions D1–D6 are at 10, `pnpm agent:next-work` selects **lowest pending DTF-5.x** from this register (class `code` or `ops-docs` only).

```bash
pnpm agent:next-work
# expect: DTF-5.1.1, tier "tier-5"
```

After each milestone: update **Status** column above, `.baseline/memory/session.md`, micro-commit, re-run gates.

---

## Verification ladder (per milestone)

```bash
pnpm format:check && pnpm lint && pnpm typecheck && pnpm architecture:check
pnpm test
cd rust && cargo test -p gtcx-zkp --lib
pnpm test:kat-cross-impl   # when KAT touched
```

---

## Related 10/10 tracks (do not duplicate)

| Track                      | Relationship to Tier 5                                        |
| -------------------------- | ------------------------------------------------------------- |
| A — Internal 10/10         | Done → **Tier 4**                                             |
| B — Algorithmic moat D1–D7 | Done in-repo → **Tier 2**; Tier 5 extends with named circuits |
| C — Bank-grade             | Infra/GTM → deal readiness alongside **Tier 5 commercial**    |

---

_Last updated: 2026-06-03 — OPS-T5-001_
