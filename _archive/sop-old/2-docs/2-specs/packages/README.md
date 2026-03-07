# Package Specifications — gtcx-core

Per-package specifications for all 18 TypeScript packages and 6 Rust crates in `gtcx-core`.

## TypeScript Packages

| Package               | Spec               | Description                                         |
| --------------------- | ------------------ | --------------------------------------------------- |
| `@gtcx/types`         | `types.md`         | Canonical TypeScript type definitions               |
| `@gtcx/schemas`       | `schemas.md`       | Core12 compliance framework schemas                 |
| `@gtcx/crypto`        | `crypto.md`        | Cryptographic primitives — signing, hashing, proofs |
| `@gtcx/crypto-native` | `crypto-native.md` | Native NAPI-RS bindings loader                      |
| `@gtcx/domain`        | `domain.md`        | Domain types, schemas, events, metrics, versioning  |
| `@gtcx/identity`      | `identity.md`      | DID creation, resolution, credential lifecycle      |
| `@gtcx/security`      | `security.md`      | Validation, auth, offline storage, audit logging    |
| `@gtcx/verification`  | `verification.md`  | Certificates, QR codes, proof bundles               |
| `@gtcx/workproof`     | `workproof.md`     | TradeCV/WorkProof W3C VC attestation schemas        |
| `@gtcx/events`        | `events.md`        | Typed event bus with offline buffering              |
| `@gtcx/services`      | `services.md`      | Registration, trading, compliance business services |
| `@gtcx/sync`          | `sync.md`          | Offline-first sync engine with conflict resolution  |
| `@gtcx/network`       | `network.md`       | P2P networking primitives for validator mesh        |
| `@gtcx/connectivity`  | `connectivity.md`  | Network connectivity detection and profiles         |
| `@gtcx/api-client`    | `api-client.md`    | Resilient HTTP client with retry and mTLS           |
| `@gtcx/logging`       | `logging.md`       | Structured logging utilities                        |
| `@gtcx/ai`            | `ai.md`            | AI integration hooks and tracing stubs              |
| `@gtcx/config`        | `config.md`        | Shared build configuration presets                  |

## Rust Crates

| Crate            | Spec                     | Description                                     |
| ---------------- | ------------------------ | ----------------------------------------------- |
| `gtcx-crypto`    | `rust/gtcx-crypto.md`    | Ed25519, SHA-256/512, Blake3, key derivation    |
| `gtcx-zkp`       | `rust/gtcx-zkp.md`       | Groth16, Bulletproofs, Schnorr ZKP circuits     |
| `gtcx-node`      | `rust/gtcx-node.md`      | NAPI-RS native bindings target                  |
| `gtcx-network`   | `rust/gtcx-network.md`   | libp2p transport primitives                     |
| `gtcx-consensus` | `rust/gtcx-consensus.md` | Weighted PBFT consensus foundations             |
| `gtcx-edge`      | `rust/gtcx-edge.md`      | Edge runtime with resource-constrained profiles |

## Security Posture

All packages follow the security framework defined in `../../engineering/security/security-framework.md`. Critical packages (`crypto`, `security`, `verification`, `domain`, `services`) have explicit threat controls mapped in `../../engineering/security/threat-control-matrix.md`.
