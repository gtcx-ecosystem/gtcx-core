# Core System Specification

This is the canonical, top-level specification for gtcx-core. It summarizes system goals, capabilities, and non-functional requirements, and points to deeper specs for implementation detail.

## Goals

- Provide secure identity, verification, and proof primitives for the GTCX ecosystem.
- Support offline-first workflows with deterministic sync.
- Enable secure networking and proof exchange across untrusted environments.

## Core Capabilities

1. **Identity and Credentials**
   - DID creation and resolution
   - Credential issuance and verification
   - Key lifecycle and rotation

2. **Cryptography and Proofs**
   - Hashing and signing primitives
   - ZKP proofs for range, ownership, and attributes
   - Deterministic proof serialization and verification

3. **Network and Sync**
   - P2P mesh transport (TCP/QUIC)
   - Topic-based publish/subscribe
   - Offline queueing and sync with conflict resolution

4. **Auditability and Compliance**
   - Hash-chained audit trails
   - Telemetry schema for monitoring
   - Evidence and quality gates

## Non-Functional Requirements

- Security first: authenticated transport, cryptographic integrity, and least-privilege boundaries.
- Reliability: predictable failure modes, retry behavior, and rate limiting.
- Performance: proof generation and verification within defined budgets.
- Operability: explicit runbooks, SLOs, and telemetry.

## References

- `security-framework.md`
- `data-models.md`
- `identity-core.md`
- `network-protocol.md`
- `eventcore.md`
- `docs/architecture/zkp-circuit-plan.md`
