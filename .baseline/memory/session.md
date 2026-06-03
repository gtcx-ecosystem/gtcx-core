---
session_id: '2026-06-03-cross-repo-cleanup-infra-prep'
agent: 'gtcx-core-agent'
start_time: '2026-06-03T07:00:00Z'
focus: 'Cross-repo coordination cleanup + gtcx-infrastructure 10-10 roadmap prep'
---

# Session: Cross-repo cleanup + Infrastructure handoff

## What Was Done

### Cross-repo coordination (gtcx-core)

| Item                         | Status           | Evidence                                                 |
| ---------------------------- | ---------------- | -------------------------------------------------------- |
| D4 M4.1 backward compat test | **done**         | `packages/crypto/tests/zkp-{diamond-mocked,zkp}.test.ts` |
| D5 M5.1 RNG entropy audit    | **done**         | `rust/gtcx-zkp/RNG.md`                                   |
| D5 M5.2 non-determinism test | **done**         | `test_proof_non_determinism` (100 proofs, 26s release)   |
| D10 M10.2 FIPS enforcement   | **done**         | `rust/gtcx-crypto/src/fips.rs`                           |
| CORE-010 agent:next-work CI  | **already done** | `.github/workflows/ci.yml` lines 123–127                 |
| XR-ID collision fix          | **done**         | `XR-517/518` → `CORE-005/014` in coordination README     |
| Coordination docs updated    | **done**         | Bridge, workplan, remaining-work refreshed               |

### Algorithmic Moat Scores (Current)

| Dimension                | Score               |
| ------------------------ | ------------------- |
| D1 Circuit correctness   | **10** ✓            |
| D2 Bulletproofs range    | **10** ✓            |
| D3 Trusted setup         | 9.5 (release-gated) |
| D4 Backward compat       | **10** ✓            |
| D5 RNG / entropy         | **10** ✓            |
| D6 KAT / interop         | **10** ✓            |
| D7 Side-channel          | 9                   |
| D8 Formal verification   | 0 (external)        |
| D9 Third-party audit     | 0 (external)        |
| D10 Primitive compliance | 9.5                 |
| **Overall**              | **≈ 8.95/10**       |

## Open Cross-repo Items (not actionable by gtcx-core)

| ID                             | Owner               | Status        | Blocker           |
| ------------------------------ | ------------------- | ------------- | ----------------- |
| CORE-001 EAP ack               | gtcx-infrastructure | awaiting ack  | ESO refresh       |
| CORE-002 SLSA provenance       | gtcx-infrastructure | open          | priority decision |
| CORE-003 KAT consumption       | gtcx-protocols      | **done**      | AM-2 complete     |
| CORE-004 D3 transcript         | gtcx-core           | release-gated | XR-402 ceremony   |
| CORE-005–009 vendors/regulator | baseline-os         | blocked       | human/external    |

## Next Focus (Protocol 22 / 27 — 2026-06-03)

- **DTF-5.1.3 done:** `groth16_prove_commodity_origin_profile` NAPI + `@gtcx/crypto` `proveGhGoldOrigin`; verify via `commodity_origin`
- **DTF-5.1.4 done:** `groth16-gh-gold-origin.kat.json` + `pnpm test:kat-cross-impl` PASS (5/5); CI job at `.github/workflows/ci.yml` L104
- **DTF-5.2.1 done:** zw-diamond profile tests (20 circuit_profiles), `proveZwDiamondOrigin`, witness mapping
- **agent:next-work:** **DTF-5.2.2** — verification package integration test
- **ER-1-08 (gtcx-core):** **done** — `ba63d0d` + protocols hub log `2026-06-04T23:45Z`; **pending:** infra hub row only
- **ER-2:** infra `ENABLE_COST_ROUTER` on intel staging; INT-R2-03; baseline-os router v1.1
- **Spec:** `docs/specs/packages/zkp-circuit-profiles.md`
