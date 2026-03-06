# Component Inventory

Canonical list of all packages and crates with their responsibilities. For detailed API/behavioral specs, see `SOP/2-docs/2-specs/packages/`.

## TypeScript Packages

| Package               | Responsibility                                                |
| --------------------- | ------------------------------------------------------------- |
| `@gtcx/crypto`        | Hashing, signing, proofs, key utilities; JS + native-backed   |
| `@gtcx/crypto-native` | Native bindings loader for Rust crypto (`gtcx-node` artifact) |
| `@gtcx/identity`      | DID creation, credential lifecycle, identity flows            |
| `@gtcx/verification`  | Certificate verification, proof bundles, QR encoding          |
| `@gtcx/security`      | Auth, input validation, offline integrity, audit logging      |
| `@gtcx/domain`        | Domain models, migrations, Core12 types, offline queue        |
| `@gtcx/events`        | Typed event bus with offline buffering and replay             |
| `@gtcx/network`       | P2P transport abstractions and mesh support                   |
| `@gtcx/connectivity`  | Connectivity detection and policies                           |
| `@gtcx/sync`          | Offline-first sync engine with conflict resolution            |
| `@gtcx/api-client`    | HTTP client with retry, request signing, and mTLS             |
| `@gtcx/services`      | Application service layer (registration, trading, compliance) |
| `@gtcx/types`         | Shared type contracts                                         |
| `@gtcx/schemas`       | Zod-based Core12 validation schemas                           |
| `@gtcx/utils`         | Shared helpers                                                |
| `@gtcx/logging`       | Structured logging                                            |
| `@gtcx/ai`            | AI integration stubs (no-op)                                  |
| `@gtcx/workproof`     | WorkProof and TradeCV credential structures                   |
| `@gtcx/config`        | Shared ESLint, TypeScript, tsup, Tailwind configurations      |

## Rust Crates

| Crate                 | Responsibility                                                   |
| --------------------- | ---------------------------------------------------------------- |
| `rust/gtcx-crypto`    | Cryptographic primitives (Ed25519, SHA-256, Blake3)              |
| `rust/gtcx-zkp`       | Groth16, Bulletproofs, Schnorr proof generation and verification |
| `rust/gtcx-node`      | Native Node.js bindings target — produces `.node` artifact       |
| `rust/gtcx-network`   | libp2p networking primitives and transport utilities             |
| `rust/gtcx-consensus` | Consensus engine foundations (planned validator integration)     |
| `rust/gtcx-edge`      | Edge runtime and hardware integration utilities (planned)        |

## Supporting Infrastructure

| Path                 | Purpose                                   |
| -------------------- | ----------------------------------------- |
| `tools/`             | Automation and quality gate scripts       |
| `tests/integration/` | Cross-package integration tests           |
| `quality/`           | Metrics, baselines, and evidence inputs   |
| `benchmarks/`        | Performance budgets and benchmark results |

## References

- `SOP/2-docs/2-specs/packages/` — full per-package API specs
- `SOP/2-docs/2-specs/packages/rust/` — full per-crate specs
- `core-architecture-overview.md`
