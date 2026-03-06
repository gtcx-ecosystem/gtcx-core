# System Architecture Overview

The canonical, high-level view of the `gtcx-core` architecture.

## Scope

- `gtcx-core` monorepo: TypeScript packages, Rust crates, tooling, and documentation
- Core flows: identity, verification, offline sync, network transport, and ZKP proofs
- Non-functional requirements: security, auditability, and performance

## Architecture Principles

1. **Security-first defaults** — cryptographic integrity, strong key management, and explicit trust boundaries.
2. **Offline-first operation** — deterministic conflict resolution and resilient sync.
3. **Composable primitives** — small packages and crates independently importable and reusable across products.
4. **Rust where it matters** — performance-critical crypto and ZKP paths in Rust; JS fallback for portability.

## High-Level Layers

| Layer                   | Components                                                                    |
| ----------------------- | ----------------------------------------------------------------------------- |
| Client & Service Layer  | Downstream apps and services consuming `@gtcx/*` packages                     |
| TypeScript Core Layer   | `packages/*` — domain logic, crypto, identity, verification, sync, networking |
| Rust Core Layer         | `rust/gtcx-crypto`, `rust/gtcx-zkp`, and related crates                       |
| Integration & Transport | P2P mesh, TCP/QUIC transport, runtime adapters                                |

## Trust Boundaries

- Key material is generated and held client-side where possible.
- Proof generation occurs in Rust for performance and security; JS is a fallback where required.
- Transport sessions are encrypted; auth and integrity are enforced end-to-end.

## References

- `core-architecture-overview.md` — detailed package inventory and design decisions
- `shared-infrastructure.md` — infrastructure layer, dependency rules
- `cryptographic-verification.md` — crypto vs. blockchain architecture decision
- `data-identity-core.md` — EventCore and Identity Core integration
- `integration-patterns.md` — cross-repo consumption patterns
- `zkp-circuit-plan.md` — ZKP circuits, budgets, and phasing
