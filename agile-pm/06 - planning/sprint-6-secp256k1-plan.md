# Sprint 6 Plan: secp256k1 Interop

**Updated**: 2026-02-21  
**Sprint Goal**: Implement secp256k1 signing + interop validation in Rust core.  
**Status**: In progress  
**Epic**: Sprint 6 in `agile-pm/05 - roadmap/gtcx-core-full-spec-epics.md`

## Scope

- Implement secp256k1 signing and verification in `rust/gtcx-crypto`.
- Add interop tests against an external secp256k1 library.
- Update documentation and roadmap status.

## Out of Scope

- NAPI bindings (tracked after Rust API stabilizes).
- EVM address derivation utilities (separate story).

## Task Breakdown

- [x] SECP-001: Implement secp256k1 module (keys, sign, verify).
- [x] SECP-002: Add interop tests with external library.
- [x] SECP-003: Update Rust docs and roadmap references.
- [ ] SECP-004: UAT evidence run and log entry.

## Acceptance Criteria

1. secp256k1 sign/verify works for known test vectors.
2. External library verifies signatures (interop).
3. Documentation updated with usage examples.

## UAT Scenarios

1. Sign a message with secp256k1 and verify via external library.
2. Reject invalid signature.
3. Confirm test vectors match expected output.

## Dependencies

- Rust crate: `rust/gtcx-crypto`.
- External library for interop tests (`secp256k1` crate).

## Estimates

- Engineering: 2 to 3 weeks.
- QA and UAT: 1 week.
