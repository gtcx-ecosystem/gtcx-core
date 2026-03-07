# Core Architecture Overview

| Field       | Value                                           |
| ----------- | ----------------------------------------------- |
| Layer       | Foundation                                      |
| Depends on  | Nothing                                         |
| Consumed by | Downstream GTCX repos and external integrations |

## Role in the Ecosystem

`gtcx-core` is the shared foundation for the GTCX ecosystem. It provides cryptographic primitives, type systems, validation schemas, domain models, networking abstractions, and ZKP tooling used by all downstream repos. It is intentionally commodity-agnostic and modular — new verticals are added via configuration, not core code changes.

## TypeScript Package Inventory

| Package               | Responsibility                                                     |
| --------------------- | ------------------------------------------------------------------ |
| `@gtcx/types`         | Shared TypeScript type definitions                                 |
| `@gtcx/domain`        | Domain types, schemas, events, metrics, migrations, offline queue  |
| `@gtcx/services`      | Application services (registration, trading, compliance)           |
| `@gtcx/schemas`       | Zod validation schemas (Core12) with runtime validation            |
| `@gtcx/crypto`        | Cryptographic primitives (Ed25519, SHA-256, Blake3, proofs)        |
| `@gtcx/crypto-native` | Native bindings loader for Rust crypto                             |
| `@gtcx/security`      | Input validation, auth, offline integrity, audit logging           |
| `@gtcx/identity`      | DID/VC primitives, credential lifecycle, key rotation              |
| `@gtcx/verification`  | Verification logic, certificate issuance, QR codes, proof bundles  |
| `@gtcx/ai`            | AI integration stubs and tracing helpers                           |
| `@gtcx/logging`       | Structured logging utilities                                       |
| `@gtcx/utils`         | Shared utilities                                                   |
| `@gtcx/events`        | Typed event bus with offline buffering and replay                  |
| `@gtcx/connectivity`  | Network status detection and connectivity profiles                 |
| `@gtcx/sync`          | Offline-first sync engine with conflict resolution                 |
| `@gtcx/api-client`    | Resilient API client with retry, signing, and mTLS                 |
| `@gtcx/network`       | P2P networking primitives for validator mesh                       |
| `@gtcx/workproof`     | WorkProof and TradeCV credential structures and disclosure helpers |
| `@gtcx/config`        | Shared ESLint, TypeScript, tsup, and Tailwind configurations       |

## Rust Crate Inventory

| Crate            | Responsibility                        | TypeScript Binding                       |
| ---------------- | ------------------------------------- | ---------------------------------------- |
| `gtcx-crypto`    | Ed25519, SHA-256, Blake3              | `@gtcx/crypto` via native loader         |
| `gtcx-zkp`       | Groth16, Bulletproofs, Schnorr proofs | Proof generation + verification          |
| `gtcx-node`      | Native bindings artifact target       | Required to enable `@gtcx/crypto-native` |
| `gtcx-network`   | libp2p transport primitives           | Used by `@gtcx/network` (optional)       |
| `gtcx-consensus` | Consensus engine foundations          | Planned validator integration            |
| `gtcx-edge`      | Edge runtime utilities                | Planned edge deployment                  |

## Downstream Consumption

Downstream repos import `@gtcx/*` packages as versioned dependencies:

- Protocol repos use `@gtcx/crypto`, `@gtcx/identity`, and `@gtcx/schemas` for signing, identity, and validation.
- Application repos use `@gtcx/domain`, `@gtcx/security`, and `@gtcx/verification` for business logic and enforcement.
- Networking and sync are provided by `@gtcx/network` and `@gtcx/sync`.

## Key Design Decisions

| Decision                  | Rationale                                                                      |
| ------------------------- | ------------------------------------------------------------------------------ |
| Rust for cryptography     | Performance and memory safety for high-throughput signing and proof generation |
| Zod over JSON Schema      | Runtime validation with TypeScript type inference from a single source         |
| pnpm workspace            | Strict dependency resolution and deterministic installs                        |
| Commodity-agnostic design | New commodities added via configuration rather than core code changes          |
| JS fallback for native    | Portability retained while enabling the native performance path                |

## ZKP Maturity

- Circuits implemented in Rust: Groth16 (GCI threshold, asset ownership, location region), Bulletproofs (amount range), Schnorr (identity attribute).
- `HashCommitmentZkpEngine` in `@gtcx/crypto` provides a compatible dev/test surface until native bindings are active.
- Native loader exists in `@gtcx/crypto-native`; building `gtcx-node` is required to enable the native path.
- libp2p TCP + QUIC mesh validated via UAT evidence log.

## References

- `overview.md`
- `components.md`
- `data-flows.md`
- `shared-infrastructure.md`
- `cryptographic-verification.md`
- `integration-patterns.md`
- `zkp-circuit-plan.md`
- `SOP/2-docs/2-specs/packages/`
