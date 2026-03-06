# Sprint 5: ZKP System

**Goal**: Replace placeholder proofs with a production-ready ZKP pipeline.
**Status**: Complete (2026-02-21)

## Scope

- ZK proof schema and engine interfaces
- Hash-commitment placeholder engine for dev/test
- Hooks for verification flows to consume ZK proofs
- Real Rust circuits: Groth16, Bulletproofs, Schnorr

## Out of Scope

- NAPI bindings for Rust ZKP (tracked separately)
- Full native bridge (Phase C — pending `gtcx-node` artifact)

## Tasks

- [x] ZKP-001: Add ZK proof schemas + engine interfaces in `@gtcx/crypto`
- [x] ZKP-002: Implement hash-commitment placeholder engine (generate/verify)
- [x] ZKP-003: Add unit tests + docs for ZKP primitives
- [x] ZKP-004: Wire verification hooks into compliance flows (accept/reject path)
- [x] ZKP-005: Define circuit selection + performance budgets (arkworks plan)
- [x] ZKP-006: UAT evidence run and log entry (proof acceptance/rejection)
- [x] ZKP-007: Implement Groth16 GCI threshold circuit in `rust/gtcx-zkp`
- [x] ZKP-008: Add Groth16 GCI threshold circuit tests
- [x] ZKP-009: Implement Groth16 asset ownership circuit (Merkle membership)
- [x] ZKP-010: Add asset ownership circuit tests
- [x] ZKP-011: Implement Groth16 location region circuit
- [x] ZKP-012: Add location region circuit tests
- [x] ZKP-013: Implement Bulletproofs amount range circuit
- [x] ZKP-014: Add amount range circuit tests
- [x] ZKP-015: Implement Schnorr identity attribute proof
- [x] ZKP-016: Add identity attribute proof tests

## Acceptance Criteria

1. ZK proofs have a stable schema and validation layer
2. Placeholder engine supports proof generation + verification for testing
3. Verification flows can accept or reject proofs deterministically
4. Performance budgets defined for proof gen/verify

## UAT Scenarios

1. Generate a valid proof and verify acceptance
2. Submit an invalid proof and verify rejection path
3. Verify proof handling does not regress compliance workflows

## References

- `SOP/2-docs/3-engineering/security/security-framework.md`
- `SOP/2-docs/1-architecture/zkp-circuit-plan.md`
- `SOP/2-docs/2-specs/packages/rust/gtcx-zkp.md`
- `SOP/3-agile/uat-evidence-log.md` — Sprint 5
