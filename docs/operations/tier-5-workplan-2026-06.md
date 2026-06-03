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
**Related:** [algorithmic moat program](../agile/roadmap/algorithmic-moat-program-2026-06-02.md) · [moat reconciliation](../audit/moat-completion-reconciliation-2026-06-03.md) · [full-audit 2026-06-04](../audit/full-audit-2026-06-04.md) · [execution roadmap](../audit/execution-roadmap.md) · [cross-repo sprint workplan](./coordination/cross-repo-sprint-workplan-2026-06.md)

## Status today

| Defensibility tier | State                                                                      |
| -----------------: | -------------------------------------------------------------------------- |
|                1–4 | **Achieved** (2026-06-03 live audit)                                       |
|    **5 technical** | **~88%** — DTF-5.5.1 strict engagement packs; 5.5.2+ commercial (external) |
|   **5 commercial** | Blocked on GTM / Legal / infra (P5)                                        |

**10/10 note:** Algorithmic dimension scores (~8.95 weighted) measure **Tier 2** test depth. **Tier 5** requires named jurisdiction circuits + registry + commercial gate — not the same bar.

**Pilot readiness (audit 2026-06-04):** Library maturity **≠** sovereign pilot readiness — pen-test, testnet, hub acks are ecosystem gates ([full-audit executive summary](../audit/full-audit-2026-06-04.md#output-summary--executive-summary)).

---

## Exit criteria

| Bar                     | Gate                                                                                                                           | Evidence                                                                        |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| **Tier 5 — technical**  | DTF-5.4.\* + [5-T1–5-T5](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/frameworks/defensibility-tiers/v1.0.0/tiers.md) | **S-T5-4 done** — trust portal IDs, load evidence, protocols E2E ack `73eaff2b` |
| **Tier 5 — commercial** | DTF-5.5.4 or regulator letter (5-C2)                                                                                           | Redacted LOI/letter in `docs/audit/evidence/`                                   |
| **Sovereign deploy**    | XR-402 ceremony + CORE-004                                                                                                     | Parallel; not required for lab P1–P4                                            |

---

## Ecosystem open items (not gtcx-core code — track only)

| ID          | Item                       | Owner               | gtcx-core action                                 | Status             |
| ----------- | -------------------------- | ------------------- | ------------------------------------------------ | ------------------ |
| OI-X01      | ER-1-08 hub ack            | gtcx-core           | Protocols log row pushed (`518f2a2` audit chain) | **done** on remote |
| OI-X02      | ER-1-08 hub ack            | gtcx-infrastructure | Outbound ticket; no duplicate evidence in core   | **pending**        |
| OI-X06      | INT-S8-04 cost-router v1.1 | baseline-os         | Optional for intel env-fallback; link only       | **external**       |
| EXT-INF-002 | Live-stack pen-test        | gtcx-infrastructure | Supply KAT/fuzz/threat-matrix pack (FA-S6)       | **external**       |
| CORE-004    | Trusted-setup ceremony     | gtcx-core + human   | D3 M3.2 release-gated after XR-402               | **blocked**        |

Source: intelligence open-items register · [remaining-cross-repo-work](./coordination/remaining-cross-repo-work-2026-06-02.md)

---

## Sprint map (gtcx-core engineering)

| Sprint     | Dates (target)     | Phase | Theme                                                                | Exit                            |
| ---------- | ------------------ | ----- | -------------------------------------------------------------------- | ------------------------------- |
| **FA-S1**  | 2026-06-04 → 06-10 | P0    | **Build graph + doc truth** (full-audit)                             | Root `typecheck`/`build` green  |
| **S-T5-1** | 2026-06-03 → 06-14 | P1    | Witness + commodity-origin **`gh-gold-origin` profile** + NAPI + KAT | **done** (DTF-5.1.4)            |
| **S-T5-2** | 2026-06-11 → 06-21 | P2    | `zw-diamond-origin` + verification + diamond/range KAT               | **done** (DTF-5.2.3)            |
| **S-T5-3** | 2026-06-29 → 07-12 | P3    | `gh-cocoa-origin` + jurisdiction fixtures                            | DTF-5.3.3 script                |
| **S-T5-4** | 2026-07-13 → 07-26 | P4    | Circuit registry + performance                                       | **done** — handoff `73eaff2b`   |
| **S-T5-5** | 2026-07-27 → 09-30 | P5    | Certified packs + protocols + pilot                                  | **Tier 5 commercial** (GTM-led) |

---

## Master register

| ID        | Title                                                                 | Sprint | Owner                      | Status   | Class            | Depends     | Blocks            |
| --------- | --------------------------------------------------------------------- | ------ | -------------------------- | -------- | ---------------- | ----------- | ----------------- |
| FA-P0-1   | Break workproof ↔ verification turbo cycle (root `typecheck`)         | FA-S1  | frontier-infra-engineer    | **done** | code             | —           | all DTF-5.2.3+    |
| FA-P0-2   | README: library readiness vs DTF Tier 5 split                         | FA-S1  | protocol-architect         | **done** | ops-docs         | —           | —                 |
| FA-P0-3   | Reconcile package count in specs README                               | FA-S1  | protocol-architect         | **done** | ops-docs         | —           | —                 |
| DTF-5.1.1 | Witness builder: WorkProof → typed witness                            | S-T5-1 | protocol-engineer          | **done** | code             | —           | 5.1.2–5.1.4       |
| DTF-5.1.2 | Commodity-origin R1CS + **`gh-gold-origin` profile** + negative tests | S-T5-1 | crypto-security-engineer   | **done** | code             | 5.1.1       | 5.1.3             |
| DTF-5.1.3 | NAPI prove/verify (profile-aware, same R1CS)                          | S-T5-1 | frontier-infra-engineer    | **done** | code             | 5.1.2       | 5.1.4             |
| DTF-5.1.4 | KAT `groth16-gh-gold-origin.kat.json` + CI                            | S-T5-1 | quality-evidence-lead      | **done** | code             | 5.1.3       | S-T5-2            |
| DTF-5.2.1 | **`zw-diamond-origin` profile** (same R1CS)                           | S-T5-2 | crypto-security-engineer   | **done** | code             | S-T5-1 exit | 5.2.2             |
| DTF-5.2.2 | Verification package integration test                                 | S-T5-2 | protocol-engineer          | **done** | code             | 5.2.1       | 5.2.3             |
| DTF-5.2.3 | KATs for diamond + range circuits                                     | S-T5-2 | quality-evidence-lead      | **done** | code             | 5.2.2       | S-T5-3            |
| DTF-5.3.1 | **`gh-cocoa-origin` profile** (same R1CS)                             | S-T5-3 | crypto-security-engineer   | **done** | code             | S-T5-2 exit | 5.3.2             |
| DTF-5.3.2 | Five-jurisdiction integration fixtures (redacted)                     | S-T5-3 | protocol-engineer          | **done** | code             | 5.3.1       | 5.3.3             |
| DTF-5.3.3 | Minerals board UAT protocol (evidence template)                       | S-T5-3 | quality-evidence-lead      | **done** | ops-docs         | 5.3.2       | S-T5-4            |
| DTF-5.4.1 | `CircuitRegistry` with semver + deprecation                           | S-T5-4 | protocol-architect         | **done** | code             | S-T5-3 exit | 5.4.2–5.4.4       |
| DTF-5.4.2 | Load test 1000 proofs/min + evidence JSON                             | S-T5-4 | frontier-infra-engineer    | **done** | code             | 5.4.1       | 5.4.3             |
| DTF-5.4.3 | Trust portal circuit ID column                                        | S-T5-4 | protocol-architect         | **done** | ops-docs         | 5.4.1       | 5.4.4             |
| DTF-5.4.4 | `gtcx-protocols` E2E per circuit ID                                   | S-T5-4 | gtcx-protocols             | **done** | code             | 5.4.1       | **T5 technical**  |
| DTF-5.5.1 | Jurisdiction pack Zod CI hardening                                    | S-T5-5 | protocol-engineer          | **done** | code             | —           | 5.5.2             |
| DTF-5.5.2 | Certified pack pipeline (signed manifest)                             | S-T5-5 | Legal + protocol-architect | pending  | external         | 5.5.1       | 5.5.4             |
| DTF-5.5.3 | Predicate-gated export keys (optional)                                | S-T5-5 | crypto-security-engineer   | deferred | code             | 5.5.1       | —                 |
| DTF-5.5.4 | Design-partner LOI or regulator letter                                | S-T5-5 | GTM                        | pending  | evidence-capture | infra pilot | **T5 commercial** |
| DTF-5.5.5 | Evidence index entry                                                  | S-T5-5 | quality-evidence-lead      | pending  | ops-docs         | 5.5.4       | —                 |

**Cross-repo:** DTF-5.4.4 **closed** — protocols witness `73eaff2b` (hub ack in [`cross-repo-agent-bridge.md`](./coordination/cross-repo-agent-bridge.md)); core helper `fc041a6`.

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

---

## Full-audit sprint overlay (2026-06-04)

Reconciles [full-audit-2026-06-04.md](../audit/full-audit-2026-06-04.md) with DTF register. **FA-S1** FA-P0-1–3 **done**; S-T5-2 **done**.

| FA sprint | Maps to DTF           | Theme                                           |
| --------- | --------------------- | ----------------------------------------------- |
| FA-S1     | FA-P0-1, FA-P0-2      | Turbo cycle, README/doc truth                   |
| FA-S2     | DTF-5.2.3             | zw-diamond + range KATs                         |
| FA-S3     | DTF-5.3.x             | Cocoa + jurisdiction fixtures                   |
| FA-S4     | Ecosystem table above | Hub acks, coordination only                     |
| FA-S5     | DTF-5.4.x             | Registry + perf evidence                        |
| FA-S6     | DTF-5.5.5 + external  | Vendor evidence pack (no fake done on pen-test) |

---

_Last updated: 2026-06-05 — OPS-T5-001 (DTF-5.4.4 protocols handoff ack `73eaff2b`)_
