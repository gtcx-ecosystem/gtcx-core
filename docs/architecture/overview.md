# System Architecture Overview

This document is the canonical, high-level view of the gtcx-core architecture. It is intentionally concise and points to deeper docs for implementation detail.

## Scope

- gtcx-core monorepo: TypeScript packages, Rust crates, tooling, and documentation
- Core flows: identity, verification, offline sync, network transport, and ZKP proofs
- Non-functional requirements: security, auditability, and performance

## Architecture Principles

1. **Security-first defaults**: cryptographic integrity, strong key management, and explicit trust boundaries.
2. **Offline-first operation**: deterministic conflict resolution and resilient sync.
3. **Composable primitives**: small packages/crates that can be reused across products.
4. **Rust where it matters**: performance-critical crypto and ZKP paths in Rust.

## High-Level Layers

- **Client & Service Layer**
  - Consumers of gtcx-core packages (apps/services) that use APIs for identity, verification, sync, and networking.
- **TypeScript Core Layer**
  - `packages/*` provide domain logic, cryptography, identity, verification, sync, and network abstractions.
- **Rust Core Layer**
  - `rust/gtcx-crypto`, `rust/gtcx-zkp`, and related crates provide secure, high-performance primitives.
- **Integration & Transport**
  - P2P mesh, TCP/QUIC transport, and runtime adapters for encrypted messaging.

## Trust Boundaries

- Key material is generated and held client-side where possible.
- Proof generation occurs in Rust for performance and security; JS is a fallback where required.
- Transport sessions are encrypted; auth and integrity are enforced end-to-end.

## References

- `core-architecture-overview.md`
- `shared-infrastructure.md`
- `cryptographic-verification.md`
- `data-identity-core.md`
- `integration-patterns.md`
- `zkp-circuit-plan.md`
