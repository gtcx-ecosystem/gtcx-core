---
id: RECON-MOAT-2026-06-03
title: Moat & 10/10 Completion Reconciliation
date: 2026-06-03
owner: protocol-architect
status: current
scope: gtcx-core — algorithmic moat, internal 10/10, bank-grade, cross-repo
sources:
  - docs/audit/full-audit-2026-06-04.md
  - docs/audit/moat-dimension-roadmap-10-10.md
  - docs/audit/execution-roadmap.md
  - docs/audit/10-10-roadmap-2026-05-25.md
  - docs/gtm/gtm-roadmap-10-10-internal-2026-06-01.md
  - docs/operations/agent-work-selection.md
  - docs/operations/coordination/remaining-cross-repo-work-2026-06-02.md
  - docs/roadmap.md
review_cycle: on-change
---

# Moat & 10/10 Completion Reconciliation

**Purpose:** One sprint-based path to completion across three parallel tracks that were documented separately. Use this file as the **index**; do not treat `algorithmic-moat-sprint2-assessment.md` (2026-06-02 pre-hardening) as current scores.

**Authoritative selection:** `pnpm agent:next-work` → **FA-P0-1** (full-audit P0; [execution-roadmap.md](./execution-roadmap.md)); then DTF-5.2.3+. Moat dimensions D1–D6 in-repo complete. **Latest audit:** [full-audit-2026-06-04.md](./full-audit-2026-06-04.md).

---

## 1. Three tracks (do not conflate)

| Track                                | What it measures                                          | Canonical doc                                                                                                                    | Current state                                                                                      |
| ------------------------------------ | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **A — Internal engineering 10/10**   | Docs, CI, ai-eval scorecard, 22-package provenance, DevEx | [execution-roadmap.md](./execution-roadmap.md), [gtm-roadmap-10-10-internal](../gtm/gtm-roadmap-10-10-internal-2026-06-01.md)    | **Sprints 1–5 done** (S5-01: 22/22 provenance); **DTF Tier 4**                                     |
| **B — Algorithmic / ZKP moat 10/10** | Circuit tests, KAT, RNG, side-channel docs, trusted setup | [moat-dimension-roadmap-10-10.md](./moat-dimension-roadmap-10-10.md)                                                             | **In-repo code ~complete** (D1–D6, D4–D5, D7 internal at 9); D3 M3.2 release-gated; D8–D9 external |
| **C — Bank-grade honest 10/10**      | Pen-test, SOC 2, regulator evidence, 90-day P1-free       | [10-10-roadmap-2026-05-25.md](./10-10-roadmap-2026-05-25.md), [16-ecosystem-gtm-alignment](../gtm/16-ecosystem-gtm-alignment.md) | **M1 done (8.7)**; M2 in progress; M3–M4 external/time                                             |

**Strategic moat (DTF-001 Defensibility Tiers 1–5)** — [canonical framework](https://github.com/gtcx-ecosystem/gtcx-docs/tree/main/frameworks/defensibility-tiers/v1.0.0). Higher tier = harder to replicate. **Tier 1 alone (~90d) is not the moat.** Today: **Tiers 1–4 achieved**; **Tier 5 ~45%** (gh-gold + zw-diamond profiles, verification bridge; KATs + registry pending). **P0:** FA-P0-1 **done** (2026-06-04); next FA-P0-2 README split. Tracks map to tiers: A → Tier 4; B → Tier 2/5; C → sovereign deal evidence (infra).

---

## 2. Algorithmic moat — reconciled dimension status

Scores from [moat-dimension-roadmap-10-10.md](./moat-dimension-roadmap-10-10.md) and `.baseline/memory/session.md` (2026-06-03). **Weighted overall ≈ 8.95/10** for implementable dimensions.

| Dim | Name                 | Score   | In-repo status                    | Gate / evidence                                                                                                      |
| --- | -------------------- | ------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| D1  | Circuit correctness  | **10**  | Done                              | Negative tests, boundary, proptest, `cargo test --features differential` in CI                                       |
| D2  | Bulletproofs range   | **10**  | Done                              | Boundary + KAT + proptest                                                                                            |
| D3  | Trusted setup        | **9.5** | M3.1 done; **M3.2 release-gated** | `cargo test --features trusted-setup-verify` after ceremony (XR-402)                                                 |
| D4  | Backward compat      | **10**  | Done                              | `packages/crypto/tests/zkp-*.test.ts`                                                                                |
| D5  | RNG / entropy        | **10**  | Done                              | `rust/gtcx-zkp/RNG.md`, `test_proof_non_determinism`                                                                 |
| D6  | KAT / interop        | **10**  | Done in core                      | 6 files under `artifacts/kat/`; CI KAT + `pnpm test:kat-cross-impl`; `@gtcx/zkp-kat-vectors@1.0.0` workspace package |
| D7  | Side-channel         | **9**   | Internal done                     | `docs/security/zkp-sidechannels.md`, uint64 audit, dudect in CI; **M7.5 external lab**                               |
| D8  | Formal verification  | **0**   | Not started                       | **External** — Z3/Coq consultant (CORE-006)                                                                          |
| D9  | Third-party audit    | **0**   | Not started                       | **External** — pen-test/crypto audit SOW (CORE-005)                                                                  |
| D10 | Primitive compliance | **9.5** | M10.1–M10.2 done                  | FIPS strict rejects BLAKE3; **M10.3 regulator letter** external                                                      |

**Doc drift fixed here:** [algorithmic-moat-sprint2-assessment.md](./algorithmic-moat-sprint2-assessment.md) still lists circuit **5/10** and overall **7/10** — that was **pre-hardening** (before `6c6327e`, `0147983`, `e4ab79e`). Do not use it for planning; use this file + moat-dimension roadmap.

---

## 3. Sprint-based completion plan (unified)

### Track A — Internal engineering (gtcx-core)

| Sprint | Theme                                          | Status              | Open stories                                                                                                         |
| ------ | ---------------------------------------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------- |
| S1–S4  | Doc truth, ai-eval CI, DevEx, 21/21 provenance | **Done**            | —                                                                                                                    |
| **S5** | Supply chain continuity                        | **Done** 2026-06-03 | S5-01: 22/22 provenance; [release 26891411936](https://github.com/gtcx-ecosystem/gtcx-core/actions/runs/26891411936) |

**Exit:** `pnpm provenance:check-npm:strict` → **22/22**; trust portal matches registry.

### Track B — Algorithmic moat (gtcx-core + one downstream)

| Sprint   | Theme                                                            | Owner                  | Status              | Stories                                                                        |
| -------- | ---------------------------------------------------------------- | ---------------------- | ------------------- | ------------------------------------------------------------------------------ |
| **AM-1** | ZKP hardening (RNG, constraints, KAT, differential, FIPS blake3) | gtcx-core              | **Done**            | Commits through `166a8f9`                                                      |
| **AM-2** | Downstream KAT consumption                                       | gtcx-protocols         | **Done** 2026-06-03 | CORE-003: `zkp-kat-vectors-consumption.test.ts` (vitest 2/2)                   |
| **AM-3** | Trusted-setup transcript CI                                      | gtcx-core              | **Release-gated**   | CORE-004 / D3 M3.2 after XR-402 ceremony + transcript publish                  |
| **AM-4** | External crypto moat                                             | baseline-os / Security | **Blocked**         | CORE-005 pen-test SOW, CORE-006 formal verification, CORE-007 side-channel lab |
| **AM-5** | Regulator primitive attestation                                  | GTM                    | **Blocked**         | CORE-008 D10 M10.3 letter                                                      |

**Agent rule:** `pnpm agent:next-work` → **external** handoffs when moat + S5 are complete; do not re-implement D1–D6.

### Track C — Bank-grade (ecosystem)

| Milestone              | Target composite | Status      | Critical path                                                                           |
| ---------------------- | ---------------- | ----------- | --------------------------------------------------------------------------------------- |
| M1 Foundation          | 8.7              | **Done**    | —                                                                                       |
| M2 Hardening           | 9.2              | In progress | ai-eval publish (2.2), rustls-webpki upstream (2.1), Zimbabwe email (2.5)               |
| M3 External validation | 9.7              | Not started | Pen-test (3.1), SOC 2 (3.2), FIPS boundary review (3.3) — **gtcx-infrastructure + GTM** |
| M4 Reference polish    | 10.0             | Time-gated  | 90-day P1-free completes **2026-08-17** earliest                                        |

---

## 4. Cross-repo open register (summary)

Full detail: [remaining-cross-repo-work-2026-06-02.md](../operations/coordination/remaining-cross-repo-work-2026-06-02.md).

| ID           | Item                                                    | Owner               | Priority            | Blocks                   |
| ------------ | ------------------------------------------------------- | ------------------- | ------------------- | ------------------------ |
| CORE-001     | EAP auth-keys sync                                      | gtcx-core → infra   | **Done** 2026-06-03 | INT staging smoke        |
| CORE-002     | SLSA provenance in infra replay                         | gtcx-infrastructure | P1 open             | Infra supply-chain story |
| CORE-003     | `@gtcx/zkp-kat-vectors` consumption                     | gtcx-protocols      | **Done** 2026-06-03 | AM-2 complete            |
| OI-X01       | ER-1-08 hub ack                                         | gtcx-core           | **Done** 2026-06-04 | Protocols log on record  |
| OI-X02       | ER-1-08 hub ack                                         | gtcx-infrastructure | **Pending**         | Outbound ticket only     |
| OI-X06       | INT-S8-04 cost-router v1.1                              | baseline-os         | **External**        | No core implementation   |
| CORE-004     | D3 transcript verify                                    | gtcx-core           | Release-gated       | D3 → 10                  |
| CORE-005–009 | Pen-test, formal, side-channel lab, regulator, ZW email | baseline-os / GTM   | External            | D7–D10, M2–M3 bank-grade |

**Already done cross-repo (provenance train):** `gtcx-protocols` + `gtcx-infrastructure/replay-protection` pinned `@gtcx/*` **3.1.4**; GitBook supply-chain page synced.

---

## 5. Critical path to “done” (ordered)

```text
DONE (2026-06-03)
  └─► S5-01: @gtcx/ai-eval@0.1.4 on npm with Sigstore (22/22)

DONE — gtcx-protocols (2026-06-03)
  └─► CORE-003 / AM-2: KAT consumption test + @gtcx/crypto verify path

WHEN XR-402 ceremony completes (gtcx-core)
  └─► CORE-004: trusted-setup-verify in release CI (Track B AM-3)

EXTERNAL (cannot code in gtcx-core)
  ├─► CORE-005: crypto/ZKP pen-test → D9, M3.1
  ├─► CORE-006: formal verification → D8
  ├─► CORE-007: side-channel lab report → D7 M7.5
  ├─► CORE-008: regulator letter → D10 M10.3
  └─► Infra: testnet + sandbox ZIP + EXT-INF register (S2 sovereign GTM)

TIME
  └─► 2026-08-17: 90-day P1-free window (M4.4)
```

---

## 6. What “10/10” means per audience

| Audience                                  | Score today                                                  | What completes it                                                                                                                                                                |
| ----------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Agent / internal engineering**          | ~9.5/10 internal; Sprint 5 done                              | External handoffs only (CORE-004–009)                                                                                                                                            |
| **Cryptographic defensibility (in-repo)** | **~8.95/10** weighted dimensions                             | AM-2–AM-4 + ceremony                                                                                                                                                             |
| **Bank-grade procurement**                | **8.7/10** honest                                            | M2–M4 + infra GTM                                                                                                                                                                |
| **Defensibility Tier 5**                  | Tiers 1–4 done; **Tier 5 ~45%** (S-T5-1 done; FA-S1 P0 open) | [tier-5-workplan-2026-06.md](../operations/tier-5-workplan-2026-06.md) · [execution-roadmap.md](./execution-roadmap.md) · [full-audit-2026-06-04.md](./full-audit-2026-06-04.md) |

---

## 7. Maintenance rules

1. After any moat milestone: update scores in `moat-dimension-roadmap-10-10.md` **and** a one-line delta in this file §2.
2. Refresh `algorithmic-moat-sprint2-assessment.md` only when materially rescoring — or mark it `_historical` and point here.
3. Cross-repo status: update `remaining-cross-repo-work-2026-06-02.md` + `cross-repo-agent-bridge.md`.
4. Re-run `pnpm agent:next-work` after unblocking AM-2 or AM-3.

---

## Agent Context Attestation

- [x] Reconciled Tracks A/B/C and cross-repo register
- [x] Corrected doc drift vs Sprint 2 assessment
- [x] Sprint plan AM-1 through AM-5 + S5 unified
