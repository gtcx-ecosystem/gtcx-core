# GTCX Core Full-Spec Roadmap (Enterprise and Military-Grade)

**Updated**: 2026-02-21  
**Status**: Sprint 1 complete (DID resolver core); Sprint 2 complete (offline sync); Sprint 3 complete (API client hardening); Sprint 4 in progress (P2P TCP UAT complete; QUIC pending); Sprint 5 in progress (ZKP kickoff)  
**Scope**: gtcx-core monorepo + required downstream integrations to reach full spec functionality  
**Objective**: Implement the full spec for global south deployment with offline-first capability, government-grade identity, and financial market infrastructure reliability.
**Source of truth**: `agile-pm/06 - planning/gtcx-core-full-spec-sprints.md`

## Context and Goals

- Deliver a production-ready protocol core for frontier commodity markets.
- Support government and financial infrastructure use cases with auditable security.
- Enable offline-first and low-connectivity operation at scale.

## Priority Order (Based on Market Needs)

**Phase 1 (Operational Core)**

- DID resolver (identity trust anchor)
- Sync engine (offline-first)
- API client (integration surface)

**Phase 2 (Protocol Backbone)**

- P2P networking transport layer (libp2p/QUIC/gossipsub)
- ZKP system (privacy-preserving compliance and provenance)

**Phase 3 (Interop and Deep Crypto)**

- Rust secp256k1 signing module (EVM/Bitcoin interoperability)

## Target Environments

- Phase 1: Validator nodes + mobile/edge
- Phase 2: Add partner systems and desktop/web admin surfaces
- Phase 3: Full multi-environment parity (validators, mobile/edge, desktop, partner integrations)

## Security and Compliance Profile

**Baseline (required)**

- ISO 27001 aligned controls and evidence.
- SOC 2 Type II operational controls.
- SBOM + provenance artifacts in every release.

**Government-grade (recommended for public sector deployments)**

- FIPS 140-3 validated cryptographic modules.
- HSM-backed key management for validators.
- Secure boot and tamper-evident logging for nodes.
- Export control policy review for crypto distribution.

## Phased Delivery Plan

### Phase 0: Spec-to-Code Traceability (2-3 weeks)

**Objective**: Map every spec requirement to code or backlog.

**Deliverables**

- Spec-to-code traceability matrix (per spec section).
- Gap list with ownership, dependencies, and acceptance criteria.

**Exit Criteria**

- 100% spec sections mapped to implemented, planned, or out-of-scope items.

### Phase 1: Operational Core (6-8 weeks)

**Workstream A: DID Resolver**

- Implement resolver adapters (on-chain, registry-backed, or service endpoint).
- Add caching + revocation status checks.
- Provide resolver injection + fallback strategies.

**Workstream B: Offline Sync Engine**

- Implement conflict resolution strategies (LWW, merge policies, vector clocks where required).
- Provide resumable sync, conflict audit logs, and deterministic reconciliation.
- Progress: core sync engine + deterministic ordering + conflict hooks + audit/metrics + UAT evidence complete.

**Workstream C: API Client**

- Implement resilient HTTP client with retries, circuit breakers, and offline queue.
- Add signed request support and integration hooks for identity/verification.
- Progress: request signing + mTLS + error taxonomy done; circuit breaker + offline queue pending.

**Exit Criteria**

- Resolver used in all verification paths with real backends.
- Sync engine in production mode with measurable convergence.
- API client supports enterprise integration patterns.

### Phase 2: Protocol Backbone (8-12 weeks)

**Workstream D: P2P Networking**

- Implement libp2p transport with QUIC + gossipsub.
- Add secure peer discovery and identity handshake.
- Enforce topic permissions and rate limits.
- Progress: adapter scaffolding + in-memory mesh tests + TCP libp2p mesh demo; QUIC pending.

**Workstream E: ZKP System**

- Replace hash-commitment placeholders with real circuits.
- Add proof generation/verification performance budgets.
- Integrate proof verification into compliance workflows.
- Progress: ZK schema + placeholder engine + unit tests + compliance hooks + circuit plan.

**Exit Criteria**

- Validator mesh operates without centralized relay.
- ZKP proofs validated in CI benchmarks and integration tests.

### Phase 3: Interop and Deep Crypto (4-6 weeks)

**Workstream F: Rust secp256k1**

- Implement secp256k1 signing and verification in Rust.
- Add test vectors and interop tests against known implementations.

**Exit Criteria**

- Cross-chain/interop signatures supported in Rust core.

## Definition of Done (Full Spec)

- All intentional stubs removed or implemented:
  - `@gtcx/api-client`, `@gtcx/sync`, `@gtcx/ai` (if required), DID resolver, Rust secp256k1, ZKP circuits, P2P transport.
- Production deployments support offline-first operation with deterministic sync.
- ZKP proofs validate compliance/provenance without data disclosure.
- Validator mesh operates without single points of failure.
- Security/compliance evidence packages produced per release.

## Dependencies

- HSM selection and procurement for validator deployment.
- Government integrations for DID registry and identity resolution policy.
- Legal review for export controls and cryptography distribution.

## Risks and Mitigations

- ZKP complexity risk: start with one circuit family and expand.
- P2P operational risk: staged rollout with telemetry and fail-safe fallback.
- Compliance overhead risk: build evidence automation into CI early.

## Reference Specs and Docs

- `docs/architecture/core-architecture-overview.md`
- `docs/architecture/shared-infrastructure.md`
- `docs/adr/007-offline-first-architecture.md`
- `docs/specs/identity-core.md`
- `docs/specs/network-protocol.md`
- `docs/specs/security-framework.md`
