# GTCX Core Full-Spec Sprint Plan

**Updated**: 2026-02-20  
**Status**: Sprint 1 complete; Sprint 2 in progress (sync core + conflict hooks complete)  
**Scope**: Execution plan for full-spec delivery  
**Objective**: Provide a robust, sprint-structured roadmap with dependencies and exit criteria.

## Sprint 0: Spec-to-Code Closure (Complete)

**Goal**: Complete traceability and execution-ready backlog.  
**Primary Artifacts**:

- Spec-to-code matrix
- Gap backlog with owners
- Dependencies map

**Entry Criteria**:

- Specs finalized for current scope

**Exit Criteria**:

- 100% spec sections mapped to code or backlog items
- All gaps assigned to epics

## Sprint 1: Identity Resolution Core (Complete)

**Goal**: DID resolution with caching, revocation checks, and resolver adapters.  
**Dependencies**: Identity core spec; security framework revocation policy.  
**Primary Deliverables**:

- Resolver adapter interface
- Cache + TTL + invalidation
- Revocation hook integration

**Exit Criteria**:

- Resolver works against at least one reference backend
- Revoked identity case passes UAT

## Sprint 2: Offline Sync Engine (In Progress)

**Goal**: Deterministic offline-first sync with conflict resolution.  
**Dependencies**: Offline-first ADRs; domain events.  
**Primary Deliverables**:

- [x] Sync engine core (upload/download)
- [x] Conflict policies (LWW + merge hooks)
- [x] Conflict audit logs + metrics

**Exit Criteria**:

- Offline → online convergence test passes
- Deterministic conflict resolution verified

## Sprint 3: API Client Enterprise Hardening (Planned)

**Goal**: Secure, resilient client with signing and mTLS support.  
**Dependencies**: Security framework requirements.  
**Primary Deliverables**:

- Request signing hooks
- mTLS support for node deployments
- Structured error taxonomy

**Exit Criteria**:

- Signed request UAT passes
- mTLS handshake validated

## Sprint 4: P2P Networking Transport (Planned)

**Goal**: libp2p transport with QUIC + gossipsub and secure discovery.  
**Dependencies**: Network protocol spec.  
**Primary Deliverables**:

- QUIC transport + Noise handshake
- Gossipsub topics + rate limits
- Peer discovery and telemetry

**Exit Criteria**:

- Mesh survives node drop and recovery
- Rate limiting and topic ACLs enforced

## Sprint 5: ZKP System (Planned)

**Goal**: Real circuits replacing hash-commitment placeholders.  
**Dependencies**: ZKP design selection; security requirements.  
**Primary Deliverables**:

- Compliance + provenance circuits
- Verification hooks into compliance flows
- Performance budgets

**Exit Criteria**:

- Proof acceptance/rejection UAT passes
- Latency budgets met in CI

## Sprint 6: secp256k1 Interop (Planned)

**Goal**: Rust secp256k1 signing and verification.  
**Dependencies**: Crypto ADRs; interop requirements.  
**Primary Deliverables**:

- secp256k1 module with tests
- Interop vectors validated

**Exit Criteria**:

- All vectors pass
- Optional NAPI bindings documented

## Cross-Sprint Governance

- Each sprint must publish audit evidence in CI artifacts.
- Security and performance gates must remain green throughout.
- UAT plan is mandatory for each sprint (`agile-pm/06 - planning/uat-gtcx-core-full-spec.md`).
