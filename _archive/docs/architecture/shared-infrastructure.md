# Shared Infrastructure Architecture

## Document Control

| Attribute   | Value                                                                 |
| ----------- | --------------------------------------------------------------------- |
| **Scope**   | gtcx-core architecture                                                |
| **Status**  | Active                                                                |
| **Related** | `components.md`, `integration-patterns.md`, `../specs/data-models.md` |

---

## 1. Overview

The shared infrastructure layer provides the foundational packages and crates that every downstream GTCX repo depends on. Core concerns such as identity, cryptography, validation, networking, and sync are centralized in composable `@gtcx/*` packages and Rust crates.

## 2. Design Principles

| Principle                  | Application                                                            |
| -------------------------- | ---------------------------------------------------------------------- |
| Modular package boundaries | Each package has a single responsibility and explicit dependency rules |
| Runtime validation         | Zod schemas validate all external boundaries                           |
| Composable primitives      | Packages are independently importable and DI-friendly                  |
| Security-first defaults    | Validation, auditing, and key handling are enforced by default         |
| Offline-first readiness    | Sync and event layers are designed for intermittent connectivity       |

## 3. Package Inventory (TypeScript)

| Package             | Responsibility                                                  |
| ------------------- | --------------------------------------------------------------- |
| @gtcx/crypto        | Signing, hashing, proofs, key management                        |
| @gtcx/crypto-native | Native bindings loader for Rust crypto                          |
| @gtcx/identity      | DID creation, resolution, credential lifecycle                  |
| @gtcx/security      | Validation, auth, offline integrity, audit                      |
| @gtcx/verification  | Proof bundles, certificates, QR encoding                        |
| @gtcx/domain        | Foundational domain types, schemas, events, metrics, migrations |
| @gtcx/services      | Application services (registration, trading, compliance)        |
| @gtcx/schemas       | Core12 compliance validation                                    |
| @gtcx/events        | Typed event bus and offline buffering                           |
| @gtcx/sync          | Offline-first sync with conflict resolution                     |
| @gtcx/network       | P2P networking primitives for mesh transport                    |
| @gtcx/connectivity  | Network detection and connectivity profiles                     |
| @gtcx/api-client    | Resilient API client with retry, signing, and mTLS              |
| @gtcx/types         | Shared TypeScript types                                         |
| @gtcx/utils         | Shared utilities                                                |
| @gtcx/logging       | Structured logging                                              |
| @gtcx/ai            | AI integration stubs                                            |
| @gtcx/workproof     | Workproof and disclosure primitives                             |

## 4. Rust Foundation Layer

| Crate          | Responsibility                        | TypeScript Binding                     |
| -------------- | ------------------------------------- | -------------------------------------- |
| gtcx-crypto    | Ed25519, SHA-256, Blake3              | @gtcx/crypto via native loader         |
| gtcx-zkp       | Groth16, Bulletproofs, Schnorr proofs | Proof generation + verification        |
| gtcx-network   | libp2p transport primitives           | Used by networking layer               |
| gtcx-consensus | Consensus engine foundations          | Planned validator integration          |
| gtcx-edge      | Edge runtime utilities                | Planned edge deployment                |
| gtcx-node      | Native bindings target                | Required to enable @gtcx/crypto-native |

## 5. Dependency Rules

- `@gtcx/crypto` has no hard internal dependencies.
- `@gtcx/identity`, `@gtcx/security`, and `@gtcx/verification` build on `@gtcx/crypto`.
- `@gtcx/domain` provides foundational types and events; `@gtcx/services` builds on it.
- Circular dependencies are disallowed.

## 6. Performance and Evidence

- Performance budgets and results are tracked in `benchmarks/`.
- Quality and API baselines are tracked in `quality/`.
- UAT evidence is logged in `agile-pm/06 - planning/uat-evidence-log.md`.

## 7. References

- `components.md`
- `integration-patterns.md`
- `../specs/data-models.md`
