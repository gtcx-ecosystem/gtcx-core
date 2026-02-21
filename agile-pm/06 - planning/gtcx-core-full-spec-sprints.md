# GTCX Core Full-Spec Sprint Plan

**Updated**: 2026-02-21  
**Status**: Sprint 1 complete; Sprint 2 complete; Sprint 3 complete (API client hardening); Sprint 4 in progress (P2P TCP UAT complete; QUIC pending); Sprint 5 in progress (ZKP circuits landed: Groth16 GCI threshold, asset ownership, location region; Bulletproofs amount range); Sprint 6 complete (secp256k1 interop)  
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

- [x] Offline → online convergence test passes
- [x] Deterministic conflict resolution verified

## Sprint 3: API Client Enterprise Hardening (In Progress)

**Goal**: Secure, resilient client with signing and mTLS support.  
**Dependencies**: Security framework requirements.  
**Primary Deliverables**:

- [x] Request signing hooks
- [x] mTLS support for node deployments
- [x] Structured error taxonomy
- [x] UAT evidence logged

**Exit Criteria**:

- Signed request UAT passes
- mTLS handshake validated

## Sprint 4: P2P Networking Transport (In Progress)

**Goal**: libp2p transport with QUIC + gossipsub and secure discovery.  
**Dependencies**: Network protocol spec.  
**Primary Deliverables**:

- [x] P2P adapter + in-memory transport scaffolding
- [x] Pub/sub delivery + rate limiting
- [x] QUIC transport + Noise handshake (libp2p adapter scaffold)
- [x] Gossipsub topics + rate limits (libp2p adapter scaffold)
- [x] Peer discovery and telemetry
- [x] TCP libp2p mesh UAT evidence logged
- [ ] QUIC mesh UAT evidence (pending)

**Exit Criteria**:

- Mesh survives node drop and recovery
- Rate limiting and topic ACLs enforced

## Sprint 5: ZKP System (In Progress)

**Goal**: Real circuits replacing hash-commitment placeholders.  
**Dependencies**: ZKP design selection; security requirements.  
**Primary Deliverables**:

- ZK proof schema + engine interfaces
- Placeholder proof engine + tests
- Verification hooks into compliance flows
- Circuit selection + performance budgets
- Rust Groth16 GCI threshold circuit (initial real backend)
- Rust Groth16 asset ownership circuit (Merkle membership)
- Rust Groth16 location region circuit (geo compliance)
- Bulletproofs amount range circuit

**Exit Criteria**:

- Proof acceptance/rejection UAT passes
- Latency budgets met in CI

## Sprint 6: secp256k1 Interop (Complete)

**Goal**: Rust secp256k1 signing and verification.  
**Dependencies**: Crypto ADRs; interop requirements.  
**Primary Deliverables**:

- secp256k1 module with tests
- Interop vectors validated
- UAT evidence logged

**Exit Criteria**:

- All vectors pass
- Optional NAPI bindings documented

## Cross-Sprint Governance

- Each sprint must publish audit evidence in CI artifacts.
- Security and performance gates must remain green throughout.
- UAT plan is mandatory for each sprint (`agile-pm/06 - planning/uat-gtcx-core-full-spec.md`).
