---
'@gtcx/crypto-native': minor
---

**FIPS-validated cryptographic backend via aws-lc-rs**

`rust/gtcx-crypto` now ships an `AwsLcSigningProvider` and `AwsLcHashProvider` behind `#[cfg(feature = "fips")]`. Compile with `cargo build --features fips` to route Ed25519, SHA-256, and SHA-512 through aws-lc-rs (NIST CMVP #4816). The wire format is identical to the default dalek backend — verified by an interop test that round-trips signatures between both backends.

This is the implementation half of the FIPS inheritance design documented in `docs/security/fips-validation-boundary.md`. With this change, the FIPS path is no longer aspirational.

Coverage:

- Ed25519 signing → FIPS-validated via aws-lc-rs
- SHA-256, SHA-512 → FIPS-validated via aws-lc-rs
- BLAKE3 → falls through to the blake3 crate (not FIPS-approved at any module level; consumers in regulatory paths must use SHA-256)

CI runs the FIPS test matrix on every PR. The `default_signing()` and `default_hashing()` selectors return the FIPS provider when the feature is active and the dalek provider otherwise — downstream consumers don't observe the swap.

This is a `@gtcx/crypto-native` minor bump because the Rust crate gains a new opt-in backend; the public API of consuming TypeScript packages does not change.
