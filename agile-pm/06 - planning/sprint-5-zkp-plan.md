# Sprint 5 Plan: ZKP System

**Updated**: 2026-02-21  
**Sprint Goal**: Replace placeholder proofs with a production-ready ZKP pipeline.  
**Status**: In progress  
**Epic**: Sprint 5 in `agile-pm/05 - roadmap/gtcx-core-full-spec-epics.md`

## Scope

- Define ZK proof schema and engine interfaces aligned with `docs/specs/security-framework.md`.
- Implement a placeholder ZKP engine to validate end-to-end flows while real circuits are built.
- Establish hooks for verification flows to consume ZK proofs.
- Add tests and UAT evidence scaffolding.

## Out of Scope

- Full arkworks Groth16/Bulletproofs circuit implementation (tracked in sub-tasks).
- NAPI bindings for Rust ZKP (separate epic once circuits are stable).

## Task Breakdown

- [x] ZKP-001: Add ZK proof schemas + engine interfaces in `@gtcx/crypto`.
- [x] ZKP-002: Implement hash-commitment placeholder engine (generate/verify).
- [x] ZKP-003: Add unit tests + docs for ZKP primitives.
- [x] ZKP-004: Wire verification hooks into compliance flows (accept/reject path).
- [x] ZKP-005: Define circuit selection + performance budgets (arkworks plan).
- [x] ZKP-006: UAT evidence run and log entry (proof acceptance/rejection).
- [x] ZKP-007: Implement Groth16 GCI threshold circuit in `rust/gtcx-zkp`.
- [x] ZKP-008: Add Groth16 circuit tests for proof generation + verification.
- [x] ZKP-009: Implement Groth16 asset ownership circuit (Merkle membership) in `rust/gtcx-zkp`.
- [x] ZKP-010: Add asset ownership circuit tests for proof generation + verification.

## Acceptance Criteria

1. ZK proofs have a stable schema and validation layer.
2. Placeholder engine supports proof generation + verification for testing.
3. Verification flows can accept or reject proofs deterministically.
4. Performance budgets are defined for proof gen/verify.

## UAT Scenarios

1. Generate a valid proof and verify acceptance.
2. Submit an invalid proof and verify rejection path.
3. Verify proof handling does not regress compliance workflows.

## Dependencies

- Security framework spec: `docs/specs/security-framework.md`
- Rust ZKP crate: `rust/gtcx-zkp`

## Estimates

- Engineering: 6 to 8 weeks.
- QA and UAT: 1 to 2 weeks.
