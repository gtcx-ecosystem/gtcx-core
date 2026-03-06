# Epic Catalog (gtcx-core Full-Spec)

**Status**: Sprints 0-6 complete. All epics delivered.
**Objective**: Complete full protocol implementation with enterprise and government-grade readiness.

## Sprint Overview

| Sprint   | Goal                            | Status   |
| -------- | ------------------------------- | -------- |
| Sprint 0 | Spec-to-code traceability       | Complete |
| Sprint 1 | DID resolver core               | Complete |
| Sprint 2 | Offline sync engine             | Complete |
| Sprint 3 | API client enterprise hardening | Complete |
| Sprint 4 | P2P networking transport        | Complete |
| Sprint 5 | ZKP system                      | Complete |
| Sprint 6 | secp256k1 interop               | Complete |

---

## Epic 0: Spec-to-Code Traceability

**Priority**: P0 | **Effort**: 2-3 weeks

### Feature 0.1: Spec Mapping Matrix (13 pts)

**TRACE-US-001**: As a lead engineer, I want each spec section mapped to code so that execution gaps are explicit.

Acceptance criteria:

1. Each spec section references a code module or backlog item
2. Gaps are tagged with owner and dependency
3. Matrix updated and linked from `SOP/2-docs/4-operations/compliance/spec-to-code-traceability.md`

DoD: Matrix reviewed and approved by architecture owner.

### Feature 0.2: Gap Backlog (8 pts)

**TRACE-US-002**: As a PM, I want gaps converted into epics with acceptance criteria so that execution is bounded.

Acceptance criteria:

1. Each gap is mapped to an epic
2. Acceptance criteria and UAT gates are specified
3. Cross-epic dependencies listed

---

## Epic 1: DID Resolver (Sprint 1) — Complete

**Priority**: P0 | **Effort**: 4-6 weeks

### Feature 1.1: Resolver Adapters (13 pts)

**DID-US-001**: As a verifier, I want DID resolution via adapter interfaces so that we can integrate government registries.

Acceptance criteria:

1. Adapter interface supports HTTP, registry, and local resolution modes
2. Resolver supports timeouts and retry policy
3. Failure modes are typed and logged

DoD: Integration test passes with stubbed resolver service.

### Feature 1.2: Cache + Revocation Hooks (8 pts)

**DID-US-002**: As a system operator, I want cached resolution with revocation checks to reduce latency and ensure correctness.

Acceptance criteria:

1. Cache supports TTL and invalidation
2. Revocation checks are optional but pluggable
3. Cache hit/miss metrics emitted

DoD: UAT scenario validates revoked identity detection.

---

## Epic 2: Offline Sync Engine (Sprint 2) — Complete

**Priority**: P0 | **Effort**: 6-8 weeks

### Feature 2.1: Sync Core (13 pts)

**SYNC-US-001**: As a field agent, I want offline-first sync so that work continues without connectivity.

Acceptance criteria:

1. Sync uploads and downloads batches with resumable state
2. Sync emits deterministic operation ordering
3. Sync produces metrics and audit log entries

DoD: Integration test simulates offline and reconnection.

### Feature 2.2: Conflict Resolution (13 pts)

**SYNC-US-002**: As a compliance operator, I want conflict resolution policies so that data integrity is preserved.

Acceptance criteria:

1. LWW policy implemented for simple fields
2. Merge policy hooks exist for complex objects
3. Conflicts captured in audit records

DoD: UAT covers conflict and reconciliation outcomes.

---

## Epic 3: API Client Enterprise Hardening (Sprint 3) — Complete

**Priority**: P1 | **Effort**: 3-4 weeks

### Feature 3.1: Signing and mTLS (8 pts)

**API-US-001**: As an integrator, I want signed requests and mTLS so that integration is secure.

Acceptance criteria:

1. Request signing hook supports external key providers
2. mTLS configuration supported for node deployments
3. Failure reasons are structured and actionable

DoD: UAT includes signed request validation.

---

## Epic 4: P2P Networking Transport (Sprint 4) — Complete

**Priority**: P1 | **Effort**: 8-12 weeks

### Feature 4.1: libp2p Transport (13 pts)

**P2P-US-001**: As a validator, I want QUIC and gossipsub transport so that the network is resilient.

Acceptance criteria:

1. QUIC transport wired with Noise handshake
2. Gossipsub topics and rate limits enforced
3. Peer discovery is secure and observable

DoD: UAT simulates node loss and recovery.

---

## Epic 5: ZKP System (Sprint 5) — Complete

**Priority**: P1 | **Effort**: 10-14 weeks

### Feature 5.1: Compliance and Provenance Circuits (13 pts)

**ZKP-US-001**: As a regulator, I want compliance proofs without data disclosure so that privacy is preserved.

Acceptance criteria:

1. Real circuits replace hash-commitment placeholders
2. Proof generation and verification budgets defined
3. Proofs integrated into verification flow

DoD: UAT validates proof acceptance and rejection.

---

## Epic 6: secp256k1 Interop (Sprint 6) — Complete

**Priority**: P2 | **Effort**: 3-4 weeks

### Feature 6.1: Rust secp256k1 Module (8 pts)

**SECP-US-001**: As an interop partner, I want secp256k1 signing so that external networks can verify signatures.

Acceptance criteria:

1. Sign/verify and key derivation implemented in Rust
2. Test vectors from known libraries pass
3. NAPI bindings optional but documented

DoD: CI adds secp256k1 tests and passes.

---

## UAT Gates by Sprint

| Sprint   | UAT Gate                                                   |
| -------- | ---------------------------------------------------------- |
| Sprint 1 | DID resolution passes with revoked identity case           |
| Sprint 2 | Offline sync conflict scenarios resolved deterministically |
| Sprint 3 | Signed request and mTLS flow validated                     |
| Sprint 4 | Node mesh survives peer drop and resumes                   |
| Sprint 5 | ZKP verification passes with invalid proof negative case   |
| Sprint 6 | secp256k1 interop verified against external vectors        |

## References

- `SOP/3-agile/roadmap.md`
- `SOP/3-agile/uat-evidence-log.md`
- `SOP/3-agile/sprints/`
