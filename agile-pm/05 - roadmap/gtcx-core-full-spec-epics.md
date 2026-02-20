# GTCX Core Full-Spec Epics and Sprints

**Updated**: 2026-02-20  
**Status**: Sprint 2 in progress (offline sync core + conflict hooks implemented)  
**Scope**: gtcx-core full-spec delivery, phased into execution sprints  
**Objective**: Complete full protocol implementation with enterprise and government-grade readiness.

## Sprint Overview

**Sprint 0: Spec-to-Code Closure** — Complete  
Goal: 100% traceability and execution-ready backlog.

**Sprint 1: Identity Resolution Core** — Complete  
Goal: DID resolution with caching, revocation checks, and resolver adapters.

**Sprint 2: Offline Sync Engine** — In Progress  
Goal: Deterministic offline-first sync with conflict resolution.

**Sprint 3: API Client Enterprise Hardening** — Planned  
Goal: Secure, resilient integration client with signing and mTLS support.

**Sprint 4: P2P Networking Transport** — Planned  
Goal: libp2p transport with QUIC + gossipsub and secure peer discovery.

**Sprint 5: ZKP System** — Planned  
Goal: Real proof circuits for compliance, provenance, quality, identity.

**Sprint 6: secp256k1 Interop** — Planned  
Goal: Rust secp256k1 signing and verification with interop tests.

## Epic Catalog

## Epic 0: Spec-to-Code Traceability

**Priority**: P0  
**Estimated Effort**: 2-3 weeks  
**Success Criteria**: 100% spec sections mapped to code or backlog.

### Feature 0.1: Spec Mapping Matrix

**Story Points**: 13

**TRACE-US-001**: As a lead engineer, I want each spec section mapped to code so that execution gaps are explicit.  
**Acceptance Criteria**:

1. Each spec section references a code module or backlog item.
2. Gaps are tagged with owner and dependency.
3. Matrix is updated and linked from `docs/README.md`.  
   **Definition of Done**: Matrix reviewed and approved by architecture owner.

### Feature 0.2: Gap Backlog

**Story Points**: 8

**TRACE-US-002**: As a PM, I want gaps converted into epics with acceptance criteria so that execution is bounded.  
**Acceptance Criteria**:

1. Each gap is mapped to an epic in this document.
2. Acceptance criteria and UAT gates are specified.
3. Cross-epic dependencies are listed.  
   **Definition of Done**: Epics linked to the full-spec roadmap.

## Epic 1: DID Resolver (Sprint 1)

**Priority**: P0  
**Estimated Effort**: 4-6 weeks  
**Success Criteria**: Resolvers work in staging with cache + revocation checks.

### Feature 1.1: Resolver Adapters

**Story Points**: 13

**DID-US-001**: As a verifier, I want DID resolution via adapter interfaces so that we can integrate government registries.  
**Acceptance Criteria**:

1. Adapter interface supports HTTP, registry, and local resolution modes.
2. Resolver supports timeouts and retry policy.
3. Failure modes are typed and logged.  
   **Definition of Done**: Integration test passes with stubbed resolver service.

### Feature 1.2: Cache + Revocation Hooks

**Story Points**: 8

**DID-US-002**: As a system operator, I want cached resolution with revocation checks to reduce latency and ensure correctness.  
**Acceptance Criteria**:

1. Cache supports TTL and invalidation.
2. Revocation checks are optional but pluggable.
3. Cache hit/miss metrics emitted.  
   **Definition of Done**: UAT scenario validates revoked identity detection.

## Epic 2: Offline Sync Engine (Sprint 2)

**Priority**: P0  
**Estimated Effort**: 6-8 weeks  
**Success Criteria**: Deterministic sync with conflict audit logs.

**Progress**:

- Completed: core sync engine, deterministic ID ordering, conflict hooks (`onConflict`, `resolveConflict`), audit/metrics callbacks.
- Pending: offline convergence integration test, UAT scenarios.

### Feature 2.1: Sync Core

**Story Points**: 13

**SYNC-US-001**: As a field agent, I want offline-first sync so that work continues without connectivity.  
**Acceptance Criteria**:

1. Sync uploads and downloads batches with resumable state.
2. Sync emits deterministic operation ordering.
3. Sync produces metrics and audit log entries.  
   **Definition of Done**: Integration test simulates offline and reconnection.

### Feature 2.2: Conflict Resolution

**Story Points**: 13

**SYNC-US-002**: As a compliance operator, I want conflict resolution policies so that data integrity is preserved.  
**Acceptance Criteria**:

1. LWW policy implemented for simple fields.
2. Merge policy hooks exist for complex objects.
3. Conflicts are captured in audit records.  
   **Definition of Done**: UAT covers conflict and reconciliation outcomes.

## Epic 3: API Client Enterprise Hardening (Sprint 3)

**Priority**: P1  
**Estimated Effort**: 3-4 weeks  
**Success Criteria**: Secure and resilient client ready for partner integration.

### Feature 3.1: Signing and mTLS

**Story Points**: 8

**API-US-001**: As an integrator, I want signed requests and mTLS so that integration is secure.  
**Acceptance Criteria**:

1. Request signing hook supports external key providers.
2. mTLS configuration supported for node deployments.
3. Failure reasons are structured and actionable.  
   **Definition of Done**: UAT includes signed request validation.

## Epic 4: P2P Networking Transport (Sprint 4)

**Priority**: P1  
**Estimated Effort**: 8-12 weeks  
**Success Criteria**: Validator mesh operates without centralized relay.

### Feature 4.1: libp2p Transport

**Story Points**: 13

**P2P-US-001**: As a validator, I want QUIC and gossipsub transport so that the network is resilient.  
**Acceptance Criteria**:

1. QUIC transport wired with Noise handshake.
2. Gossipsub topics and rate limits enforced.
3. Peer discovery is secure and observable.  
   **Definition of Done**: UAT simulates node loss and recovery.

## Epic 5: ZKP System (Sprint 5)

**Priority**: P1  
**Estimated Effort**: 10-14 weeks  
**Success Criteria**: Proofs validate in CI with acceptable performance.

### Feature 5.1: Compliance and Provenance Circuits

**Story Points**: 13

**ZKP-US-001**: As a regulator, I want compliance proofs without data disclosure so that privacy is preserved.  
**Acceptance Criteria**:

1. Real circuits replace hash-commitment placeholders.
2. Proof generation and verification budgets defined.
3. Proofs integrated into verification flow.  
   **Definition of Done**: UAT validates proof acceptance and rejection.

## Epic 6: secp256k1 Interop (Sprint 6)

**Priority**: P2  
**Estimated Effort**: 3-4 weeks  
**Success Criteria**: secp256k1 signs and verifies with test vectors.

### Feature 6.1: Rust secp256k1 Module

**Story Points**: 8

**SECP-US-001**: As an interop partner, I want secp256k1 signing so that external networks can verify signatures.  
**Acceptance Criteria**:

1. Sign/verify and key derivation implemented in Rust.
2. Test vectors from known libraries pass.
3. NAPI bindings optional but documented.  
   **Definition of Done**: CI adds secp256k1 tests and passes.

## UAT Gates by Sprint

1. Sprint 1: DID resolution passes with revoked identity case.
2. Sprint 2: Offline sync conflict scenarios resolved deterministically.
3. Sprint 3: Signed request and mTLS flow validated.
4. Sprint 4: Node mesh survives peer drop and resumes consensus.
5. Sprint 5: ZKP verification passes with invalid proof negative case.
6. Sprint 6: secp256k1 interop verified against external vectors.
