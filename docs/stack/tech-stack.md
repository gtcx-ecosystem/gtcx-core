# Technology Stack — gtcx-core

`gtcx-core` is a monorepo of shared cryptographic primitives, protocol types, and infrastructure packages consumed by all GTCX product repos. It is not a service — it is a library.

---

## Monorepo Structure

| Layer           | Technology      | Version | Purpose                                       |
| --------------- | --------------- | ------- | --------------------------------------------- |
| Package manager | pnpm workspaces | 9+      | Dependency management, workspace linking      |
| Build system    | Turborepo       | latest  | Task orchestration, incremental builds        |
| Language (TS)   | TypeScript      | 6.x     | Primary language for all TS packages          |
| Runtime         | Node.js         | 20 LTS  | TS package execution and test runner          |
| Language (Rust) | Rust            | 1.75+   | Cryptographic crates and ZKP circuits         |
| Build (Rust)    | Cargo           | stable  | Rust crate builds and test execution          |
| Native bindings | NAPI-RS         | 2.x     | TypeScript ↔ Rust FFI (`@gtcx/crypto-native`) |

---

## TypeScript Packages (`@gtcx/*`)

18 packages across 4 capability groups:

| Group          | Packages                                                                         |
| -------------- | -------------------------------------------------------------------------------- |
| **Core types** | `@gtcx/types`, `@gtcx/errors`, `@gtcx/validation`                                |
| **Crypto**     | `@gtcx/crypto`, `@gtcx/security`, `@gtcx/verification`, `@gtcx/crypto-native`    |
| **Protocol**   | `@gtcx/identity`, `@gtcx/credentials`, `@gtcx/protocol`                          |
| **Sync / Net** | `@gtcx/sync`, `@gtcx/network`, `@gtcx/transport`                                 |
| **Utilities**  | `@gtcx/config`, `@gtcx/logger`, `@gtcx/telemetry`, `@gtcx/testing`, `@gtcx/docs` |

### Key TS Dependencies

| Dependency      | Purpose                                          |
| --------------- | ------------------------------------------------ |
| `@noble/curves` | Ed25519, secp256k1 — pure TypeScript, audited    |
| `@noble/hashes` | SHA-256, Blake3, HMAC — pure TypeScript, audited |
| `zod`           | Schema validation and type inference             |
| `vitest`        | Unit and integration testing                     |

---

## Rust Crates (`gtcx-*`)

6 crates in `rust/`:

| Crate            | Purpose                                                             |
| ---------------- | ------------------------------------------------------------------- |
| `gtcx-crypto`    | Ed25519 signing, Blake3/SHA-256 hashing, HD key derivation (BIP-32) |
| `gtcx-zkp`       | ZKP circuits — Groth16, Bulletproofs, Schnorr                       |
| `gtcx-node`      | Node runtime primitives for validator mesh                          |
| `gtcx-network`   | P2P networking layer (libp2p QUIC + gossipsub)                      |
| `gtcx-edge`      | Edge/offline compute primitives                                     |
| `gtcx-secp256k1` | secp256k1 signing — EVM and Bitcoin interop                         |

### Key Rust Dependencies

| Dependency      | Purpose                                          |
| --------------- | ------------------------------------------------ |
| `arkworks`      | ZKP circuit framework (Groth16, Bulletproofs)    |
| `libp2p`        | P2P transport (QUIC, gossipsub, peer discovery)  |
| `k256`          | secp256k1 (EVM/Bitcoin compatible)               |
| `ed25519-dalek` | Ed25519 signing and batch verification           |
| `blake3`        | High-performance Blake3 hashing                  |
| `zeroize`       | Zeroizing key material on drop — all key structs |

### Security Invariants (enforced in CI)

- `#![deny(unsafe_code)]` on all crypto crates
- `Zeroizing<T>` on all key material
- RFC test vectors on signing and hashing primitives
- No `unwrap()` / `expect()` in library code

---

## Testing

| Layer           | Tool              | Command                                         |
| --------------- | ----------------- | ----------------------------------------------- |
| TS unit tests   | Vitest            | `pnpm test`                                     |
| TS type check   | tsc               | `pnpm typecheck`                                |
| TS lint         | ESLint + Prettier | `pnpm lint && pnpm format:check`                |
| Rust unit tests | Cargo             | `cargo test --workspace --lib`                  |
| Rust ZKP proofs | Cargo (release)   | `cargo test -p gtcx-zkp --release -- --ignored` |

---

## Package Publishing

`gtcx-core` packages are published to npm (scoped to `@gtcx/*`) via Changesets:

| Tool           | Version | Purpose                                      |
| -------------- | ------- | -------------------------------------------- |
| Changesets     | latest  | Versioning, changelog generation, publishing |
| GitHub Actions | —       | CI gates, publish workflow on `main` merge   |

Publishing only occurs after all CI gates pass. See `docs/devops/` for the full release and CI/CD runbook.

---

## Architecture Decisions

Full ADRs at `docs/decisions/`. Key decisions:

| ADR | Title                              |
| --- | ---------------------------------- |
| 001 | Rust for cryptography              |
| 002 | Zod over JSON Schema               |
| 003 | pnpm workspace strict deps         |
| 004 | Commodity-agnostic domain model    |
| 005 | Ed25519 signing                    |
| 006 | Hash-chain audit trail             |
| 007 | Offline-first architecture         |
| 009 | TypeScript → Rust fallback pattern |
| 013 | API baseline and performance gates |
