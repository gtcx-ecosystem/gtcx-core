# GTCX Core — Architecture Overview

| Field       | Value                                                                                                  |
| ----------- | ------------------------------------------------------------------------------------------------------ |
| Layer       | Foundation                                                                                             |
| Depends on  | Nothing                                                                                                |
| Consumed by | Downstream GTCX repos and external integrations                                                        |
| Related     | `overview.md`, `components.md`, `data-flows.md`, `shared-infrastructure.md`, `integration-patterns.md` |

## Role in the Ecosystem

GTCX Core is the shared foundation for the ecosystem. It provides cryptographic primitives, type systems, validation schemas, domain models, networking abstractions, and ZKP tooling used by downstream repos. It is intentionally commodity-agnostic and modular so that new verticals can be added via configuration rather than core code changes.

## Package Composition

All packages are published under the `@gtcx/` scope and managed in a pnpm workspace.

| Package             | Responsibility                                                    |
| ------------------- | ----------------------------------------------------------------- |
| @gtcx/types         | Shared TypeScript type definitions                                |
| @gtcx/domain        | Domain types, schemas, events, metrics, migrations, offline queue |
| @gtcx/services      | Application services (registration, trading, compliance)          |
| @gtcx/schemas       | Zod validation schemas (Core12) with runtime validation           |
| @gtcx/crypto        | Cryptographic primitives (Ed25519, SHA-256, Blake3, proofs)       |
| @gtcx/crypto-native | Native bindings loader for Rust crypto                            |
| @gtcx/security      | Input validation, auth, offline integrity, audit logging          |
| @gtcx/identity      | DID/VC primitives, credential lifecycle, key rotation             |
| @gtcx/verification  | Verification logic, certificate issuance, QR codes, proof bundles |
| @gtcx/ai            | AI integration stubs and tracing helpers                          |
| @gtcx/logging       | Structured logging utilities                                      |
| @gtcx/utils         | Shared utilities                                                  |
| @gtcx/events        | Typed event bus with offline buffering and replay                 |
| @gtcx/connectivity  | Network status detection and connectivity profiles                |
| @gtcx/sync          | Offline-first sync engine with conflict resolution                |
| @gtcx/api-client    | Resilient API client with retry, signing, and mTLS                |
| @gtcx/network       | P2P networking primitives for validator mesh                      |
| @gtcx/workproof     | Workproof and disclosure primitives                               |
| config/eslint       | Shared ESLint configuration                                       |
| config/typescript   | Shared TypeScript configuration                                   |
| config/tsup         | Shared tsup build config                                          |
| config/tailwind     | Shared Tailwind config                                            |
| config/jurisdiction | Jurisdiction data and policy configuration                        |

## Rust Cryptographic Foundation

Performance-critical cryptographic operations are implemented in Rust and exposed to TypeScript via NAPI-RS where available. The wrapper package `@gtcx/crypto-native` loads native bindings if a `gtcx_node.node` artifact is present. A JS fallback remains available for environments without native support.

Rust crates include:

- `rust/gtcx-crypto` — signing, hashing, key utilities
- `rust/gtcx-zkp` — Groth16 + Bulletproofs + Schnorr proofs
- `rust/gtcx-node` — native bindings target (in active integration)
- `rust/gtcx-network` — networking primitives
- `rust/gtcx-consensus` — consensus engine foundations
- `rust/gtcx-edge` — edge runtime utilities

### Maturity Note

- ZKP circuits are implemented in Rust (Groth16 GCI threshold, asset ownership, location region; Bulletproofs amount range; Schnorr identity attribute).
- The native loader exists in `@gtcx/crypto-native`; building `gtcx-node` is required to enable the native path.
- libp2p TCP + QUIC mesh UAT evidence is logged via the mesh demo.

## Downstream Consumption

Downstream repos import `@gtcx/*` packages as versioned dependencies. Key patterns:

- Protocol repos use `@gtcx/crypto`, `@gtcx/identity`, and `@gtcx/schemas` for signing, identity, and validation.
- Application repos use `@gtcx/domain`, `@gtcx/security`, and `@gtcx/verification` for business logic and enforcement.
- Networking and sync are provided by `@gtcx/network` and `@gtcx/sync`.

## Key Design Decisions

| Decision                  | Rationale                                                                                   |
| ------------------------- | ------------------------------------------------------------------------------------------- |
| Rust for cryptography     | Strong performance and memory safety guarantees for high-throughput signing and proofs      |
| Zod over JSON Schema      | Runtime validation with TypeScript type inference from a single source                      |
| pnpm workspace            | Strict dependency resolution and deterministic installs                                     |
| Commodity-agnostic design | New commodities added via configuration rather than core code changes                       |
| JS fallback for native    | Native bindings are optional; JS fallback keeps portability while enabling performance path |

## References

- `overview.md`
- `components.md`
- `data-flows.md`
- `shared-infrastructure.md`
- `cryptographic-verification.md`
- `integration-patterns.md`
- `zkp-circuit-plan.md`
