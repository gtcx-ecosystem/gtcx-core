# Sprint 6: secp256k1 Interop

**Goal**: Implement secp256k1 signing and interop validation in Rust core.
**Status**: Complete (2026-02-21)

## Scope

- secp256k1 signing and verification in `rust/gtcx-crypto`
- Interop tests against an external secp256k1 library
- Documentation and roadmap status updates

## Out of Scope

- NAPI bindings (tracked after Rust API stabilizes)
- EVM address derivation utilities (separate story)

## Tasks

- [x] SECP-001: Implement secp256k1 module (keys, sign, verify)
- [x] SECP-002: Add interop tests with external library
- [x] SECP-003: Update Rust docs and roadmap references
- [x] SECP-004: UAT evidence run and log entry

## Acceptance Criteria

1. secp256k1 sign/verify works for known test vectors
2. External library verifies signatures (interop)
3. Documentation updated with usage examples

## UAT Scenarios

1. Sign a message with secp256k1 and verify via external library
2. Reject invalid signature
3. Confirm test vectors match expected output

## References

- `SOP/2-docs/2-specs/packages/rust/gtcx-crypto.md`
- `SOP/2-docs/1-architecture/decisions/005-ed25519-signing.md`
- `SOP/3-agile/uat-evidence-log.md` — Sprint 6
