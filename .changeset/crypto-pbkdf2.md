---
'@gtcx/crypto': minor
---

Add `deriveKeyPbkdf2` to the canonical `@gtcx/crypto` surface.

**New export**

- `deriveKeyPbkdf2(params): Promise<string>` — PBKDF2-HMAC-SHA256 via
  `crypto.subtle.deriveBits`. Returns a hex-encoded derived key.
  Tuned for short, low-entropy inputs (PIN hashing) where a high
  iteration count is the only useful cost lever.
- `Pbkdf2Params` type — `{ password, salt, iterations, keyLengthBits? }`.

**Why now**

`gtcx-mobile` has maintained a workspace-fork of `@gtcx/crypto` since
Sprint 4 specifically to add this function for PIN hashing v3 (100k
iterations). Upstreaming it removes the dual-source problem that
otherwise lands the moment `@gtcx/crypto` publishes to npm.
Coordination context: `gtcx-mobile/docs/gtm/external-tracking/gtcx-core-tickets.md`
(P2).

**Implementation choice**

Canonical-only — no iterated-SHA-256 fallback. If `crypto.subtle.deriveBits`
is unavailable, the function throws a typed `Error`. The mobile fork has
the fallback for React Native Hermes; in the canonical Node/browser
package a silent non-RFC-7914 fallback would create regulator-visible
discrepancies. Better to throw.

**FIPS posture**

`crypto.subtle.deriveBits` routes through OpenSSL/aws-lc-rs in Node 20+,
so this function inherits the existing FIPS validation (CMVP #4816)
when running under our FIPS-enabled build.

**Tests**

19 new tests in `key-derivation.test.ts`: RFC 7914 §11 PBKDF2-HMAC-SHA256
reference vectors, PIN-hash use cases (determinism, salt-sensitivity,
password-sensitivity), output-length parameterization (128/160/256/384/512
bits), and input-validation rejections (non-string types, zero / negative /
fractional iterations, non-byte-aligned keyLengthBits).
