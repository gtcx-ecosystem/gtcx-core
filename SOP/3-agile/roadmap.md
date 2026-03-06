# gtcx-core Full-Spec Roadmap

**Status**: Sprints 0-6 complete (DID resolver, offline sync, API client, P2P transport, ZKP circuits, secp256k1 interop)
**Scope**: gtcx-core monorepo + required downstream integrations to reach full spec functionality
**Objective**: Production-ready protocol core for global south deployment with offline-first capability, government-grade identity, and financial market infrastructure reliability.

## Priority Order

**Phase 1 — Operational Core** (Complete)

- DID resolver (identity trust anchor)
- Sync engine (offline-first)
- API client (integration surface)

**Phase 2 — Protocol Backbone** (Complete)

- P2P networking transport layer (libp2p/QUIC/gossipsub)
- ZKP system (privacy-preserving compliance and provenance)

**Phase 3 — Interop and Deep Crypto** (Complete)

- Rust secp256k1 signing module (EVM/Bitcoin interoperability)

## Target Environments

| Phase   | Targets                                                                                |
| ------- | -------------------------------------------------------------------------------------- |
| Phase 1 | Validator nodes + mobile/edge                                                          |
| Phase 2 | Add partner systems and desktop/web admin surfaces                                     |
| Phase 3 | Full multi-environment parity (validators, mobile/edge, desktop, partner integrations) |

## Security and Compliance Profile

**Baseline (required)**

- ISO 27001 aligned controls and evidence
- SOC 2 Type II operational controls
- SBOM + provenance artifacts in every release

**Government-grade (recommended for public sector deployments)**

- FIPS 140-3 validated cryptographic modules
- HSM-backed key management for validators
- Secure boot and tamper-evident logging for nodes
- Export control policy review for crypto distribution

## Phased Delivery Plan

### Phase 0: Spec-to-Code Traceability — Complete

- Spec-to-code traceability matrix
- Gap list with ownership, dependencies, and acceptance criteria

### Phase 1: Operational Core — Complete

**A: DID Resolver** — resolver adapters, cache + revocation checks, injection + fallback strategies

**B: Offline Sync Engine** — conflict resolution (LWW, merge), resumable sync, conflict audit logs, deterministic reconciliation

**C: API Client** — retry, circuit breakers, offline queue, signed request support, mTLS

### Phase 2: Protocol Backbone — Complete

**D: P2P Networking** — libp2p transport with QUIC + gossipsub, secure peer discovery, identity handshake, topic permissions and rate limits

**E: ZKP System** — real circuits (Groth16, Bulletproofs, Schnorr), proof generation/verification performance budgets, proof verification in compliance workflows

### Phase 3: Interop and Deep Crypto — Complete

**F: Rust secp256k1** — secp256k1 signing and verification in Rust, test vectors, interop tests

## Definition of Done (Full Spec)

- All intentional stubs removed or implemented: `@gtcx/api-client`, `@gtcx/sync`, DID resolver, Rust secp256k1, ZKP circuits, P2P transport
- Production deployments support offline-first operation with deterministic sync
- ZKP proofs validate compliance/provenance without data disclosure
- Validator mesh operates without single points of failure
- Security/compliance evidence packages produced per release

## Dependencies

- HSM selection and procurement for validator deployment
- Government integrations for DID registry and identity resolution policy
- Legal review for export controls and cryptography distribution

## Risks and Mitigations

| Risk                | Mitigation                                           |
| ------------------- | ---------------------------------------------------- |
| ZKP complexity      | Start with one circuit family and expand             |
| P2P operational     | Staged rollout with telemetry and fail-safe fallback |
| Compliance overhead | Build evidence automation into CI early              |

## References

- `SOP/2-docs/1-architecture/core-architecture-overview.md`
- `SOP/2-docs/1-architecture/decisions/007-offline-first-architecture.md`
- `SOP/2-docs/2-specs/identity-core.md`
- `SOP/2-docs/2-specs/network-protocol.md`
- `SOP/2-docs/3-engineering/security/security-framework.md`
- `SOP/3-agile/epics.md`
