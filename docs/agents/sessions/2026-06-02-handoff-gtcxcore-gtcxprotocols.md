---
title: 'Cross-Repo Handoff — 10/10 Moat D6 M6.5 + FIPS Awareness'
date: '2026-06-02'
from: 'gtcx-core'
to: 'gtcx-protocols'
scope: 'Cryptographic defensibility milestones M6.5 + D10 FIPS strict mode'
tags: ['handoff', 'gtcx-core', 'gtcx-protocols', '10-10-moat', 'kat-vectors', 'fips']
status: 'open'
---

# Cross-Repo Handoff — gtcx-core → gtcx-protocols

## Context

gtcx-core has advanced its algorithmic moat score from 8.2 → 8.5 in the current session. Two milestones directly affect gtcx-protocols:

1. **D6 M6.5** — KAT vectors must be published as a consumable npm package (1 day, gtcx-core side)
2. **D10 M10.2** — Runtime FIPS strict mode now rejects non-FIPS algorithms (affects deployments)

## What gtcx-core Delivered

### D6 KAT / Interoperability (score 8 → 9)

- **M6.4 complete:** Standalone `kat-cross-impl-verify` binary verifies all 4 Groth16 KAT files using raw arkworks (zero gtcx-zkp code). Proves portability.
- **KAT artifacts present:** `artifacts/kat/*.kat.json` — 4 Groth16 + 2 Bulletproofs vectors

### D10 Primitive Compliance (score 8 → 9)

- **M10.2 complete:** `gtcx-crypto` now exposes:
  - `fips_mode_only()` — returns true when `GTCX_FIPS_STRICT=1`
  - `blake3_checked()`, `blake3_keyed_checked()`, `blake3_derive_checked()` — return `CryptoError::NonFipsAlgorithm` in strict mode
- Integration test: `test_fips_strict_rejects_blake3` passes

### API Changes (all additive — no breaking changes)

| Package                             | Change                            | Breaking? |
| ----------------------------------- | --------------------------------- | --------- |
| `@gtcx/crypto` (Rust `gtcx-crypto`) | +`NonFipsAlgorithm` error variant | No        |
| `@gtcx/crypto` (Rust `gtcx-crypto`) | +`fips_mode_only()`               | No        |
| `@gtcx/crypto` (Rust `gtcx-crypto`) | +`blake3_checked()` family        | No        |
| `@gtcx/crypto-native`               | No changes                        | —         |

## What gtcx-protocols Needs to Do

### Item 1 — Consume `@gtcx/zkp-kat-vectors` (after M6.5 is published)

**Priority:** P2 — not blocking, nice for regression confidence
**ETA:** After gtcx-core cuts M6.5 (estimated 1 day)

When gtcx-core publishes `@gtcx/zkp-kat-vectors`:

1. Add dependency:

   ```json
   {
     "devDependencies": {
       "@gtcx/zkp-kat-vectors": "^1.0.0"
     }
   }
   ```

2. In your ZKP integration tests, import KAT files:

   ```typescript
   import gciThresholdKat from '@gtcx/zkp-kat-vectors/groth16-gci-threshold.json';
   // Use kat.public_inputs, kat.proof_bytes, kat.verifying_key_bytes
   // to verify your protocol-layer proof deserialization
   ```

3. Acceptance: at least one protocol test loads a KAT file and verifies the proof through your abstraction layer.

### Item 2 — FIPS strict mode awareness

**Priority:** P1 for regulated deployments (Zimbabwe, other African sovereigns)
**ETA:** Before production rollout

If gtcx-protocols deploys to environments requiring FIPS 140-3 compliance:

1. Set environment variable: `GTCX_FIPS_STRICT=1`
2. Ensure any BLAKE3 usage in your code paths goes through `blake3_checked()` or falls back to SHA-256
3. Test that your protocol still functions with `GTCX_FIPS_STRICT=1`

No code changes needed today — this is a deployment-time flag.

### Item 3 — No action required

- No breaking API changes in any `@gtcx/*` package
- No predicate or verification schema changes
- Staging infrastructure is not blocked by this work

## Blockers & Decisions

| Topic                           | Decision             | Rationale                                                                    |
| ------------------------------- | -------------------- | ---------------------------------------------------------------------------- |
| `@gtcx/zkp-kat-vectors` publish | gtcx-core owns M6.5  | Package will contain only JSON files + type declarations; no runtime code    |
| FIPS strict default             | Opt-in, not enforced | `GTCX_FIPS_STRICT=1` is explicit; default behavior unchanged for performance |

## References

- `gtcx-core/docs/audit/moat-dimension-roadmap-10-10.md` — full milestone tracker
- `gtcx-core/rust/gtcx-crypto/src/hashing/mod.rs` — FIPS strict mode implementation
- `gtcx-core/artifacts/kat/` — KAT vector directory
