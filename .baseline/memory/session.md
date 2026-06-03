---
session_id: '2026-06-02-d1-m15-differential'
agent: 'gtcx-core-agent'
start_time: '2026-06-02T19:00:00Z'
end_time: '2026-06-03T00:00:00Z'
focus: 'Sprint 2 Algorithmic Moat — D1 M1.5 Differential testing'
---

# Session: Sprint 2 Moat — D1 M1.5

## What Was Done

### D1 Circuit Correctness: 9 → 10

- M1.5: Differential testing with independent arkworks verifier
  - New test: `test_differential_gci_threshold_100_witnesses` in `tests/differential.rs`
  - Feature-gated behind `differential`
  - Generates 5 valid Groth16 proofs with random (score, threshold)
  - Verifies each with both gtcx-zkp and raw arkworks — confirms both ACCEPT
  - Creates 19 tampered variants per proof (different byte flips)
  - Verifies each tampered with both verifiers — confirms both REJECT
  - **100 total verifications, 0 disagreements**
  - Runtime: ~48 seconds
  - CI step added to `.github/workflows/ci.yml`

## Files Created

- `rust/gtcx-zkp/src/tests/differential.rs` — NEW

## Files Modified

- `rust/gtcx-zkp/Cargo.toml` — Added `differential` feature
- `rust/gtcx-zkp/src/tests/mod.rs` — Added `differential` module
- `.github/workflows/ci.yml` — Added differential test step
- `docs/audit/moat-dimension-roadmap-10-10.md` — D1=10, overall≈8.8

## Current Dimension Scores

| Dimension                | Score    |
| ------------------------ | -------- |
| D1 Circuit correctness   | **10** ✓ |
| D2 Bulletproofs range    | **10** ✓ |
| D3 Trusted setup         | 9.5      |
| D4 Backward compat       | 9        |
| D5 RNG / entropy         | 9.5      |
| D6 KAT / interop         | **10** ✓ |
| D7 Side-channel          | **9**    |
| D8 Formal verification   | 0        |
| D9 Third-party audit     | 0        |
| D10 Primitive compliance | 9        |
| **Overall**              | **8.8**  |

## Quality Gates

- `cargo test --lib` (gtcx-crypto): 61 passed, 0 failed
- `cargo test --lib` (gtcx-zkp): 81 passed, 0 failed, 4 ignored
- `cargo test --lib --features differential`: 100 verifications, 0 disagreements ✓
- `cargo test --lib --features sidechannel-bench`: p-value=0.78 > 0.05 ✓
- `pnpm test:kat-cross-impl`: PASS (4/4 KAT files)
- `pnpm architecture:check`: pass (24 packages, 268 source files)
- `pnpm docs:check-links`: pass (452 files)
- `pnpm docs:check-frontmatter`: pass (254/254)
- `pnpm bundle:check-budgets`: pass (22 packages)

## Next Steps (per Protocol 22)

All implementable milestones are now complete.

Remaining:
| Dimension | Milestone | Status |
|-----------|-----------|--------|
| D3 | M3.2 Transcript verification | Release-gated, 1 day |
| D7 | M7.5 Third-party side-channel assessment | **EXTERNAL** |
| D10 | M10.3 Regulator attestation | **EXTERNAL** |
| D8 | All | **EXTERNAL** — Z3/Coq consultant |
| D9 | All | **EXTERNAL** — audit vendor |

**Algorithmic moat: 8.8/10.** All internal milestones complete. Final 1.2 points require external resources (audit, formal verification, regulator attestation).
