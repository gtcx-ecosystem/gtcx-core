---
'@gtcx/crypto-native': minor
---

Validate hex at the NAPI boundary to close the README-tracked
"odd-length hex at NAPI boundary" issue that caused Rust panics or
silent corruption depending on which native binding received the
malformed input.

**New exports**

- `assertHex(value, label)` — throws `TypeError` with parameter label,
  violated rule, and offending length. Used by computing/mutating
  functions where invalid input has no sensible return value.
- `isHex(value)` — non-throwing predicate. Used by verifier functions
  to return `false` for malformed input, preserving
  verifier-as-predicate semantics.

**Behavior change at the NAPI boundary**

- `sign`, `deriveChildKey`, `derivePurposeKey`,
  `groth16ProveGciThreshold`, `bulletproofsProveAmountRange`,
  `schnorrProveIdentityAttribute` now throw `TypeError` on malformed
  hex inputs (previously: opaque downstream error, panic, or silent
  corruption).
- `verify`, `groth16VerifyProof`, `bulletproofsVerifyAmountRange`,
  `schnorrVerifyIdentityAttribute` now return `false` on malformed
  hex inputs (previously: opaque downstream error or panic).

**Tests**

- 19 new tests in `tests/hex-validation.test.ts` including
  property-based coverage via `fast-check`.
- Mock-binding `generateKeyPair` and `sign` returns updated to valid
  hex so the preflight round-trip exercises the validation path.
