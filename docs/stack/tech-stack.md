# Technology Stack — gtcx-core

`gtcx-core` is a monorepo of shared cryptographic primitives, protocol types, and infrastructure packages consumed by all GTCX product repos. It is not a service — it is a library.

**Last reviewed:** 2026-05-06

---

## Monorepo Structure

| Layer           | Technology      | Version | Purpose                                       |
| --------------- | --------------- | ------- | --------------------------------------------- |
| Package manager | pnpm workspaces | 9+      | Dependency management, workspace linking      |
| Build system    | Turborepo       | 2.x     | Task orchestration, incremental builds        |
| Language (TS)   | TypeScript      | 6.0.x   | Primary language for all TypeScript packages  |
| Runtime         | Node.js         | 20 LTS  | Package execution and test runner             |
| Language (Rust) | Rust            | 1.88    | Pinned cryptographic crates and ZKP circuits  |
| Build (Rust)    | Cargo           | 1.88    | Rust crate builds and test execution          |
| Native bindings | NAPI-RS         | 2.x     | TypeScript ↔ Rust FFI (`@gtcx/crypto-native`) |

---

## TypeScript Packages (`@gtcx/*`)

18 public packages plus 4 shared config workspace packages:

| Group                | Packages                                                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Foundational**     | `@gtcx/types`, `@gtcx/schemas`, `@gtcx/domain`, `@gtcx/events`                                                           |
| **Trust / Security** | `@gtcx/crypto`, `@gtcx/crypto-native`, `@gtcx/security`, `@gtcx/verification`, `@gtcx/identity`                          |
| **Application edge** | `@gtcx/services`, `@gtcx/api-client`, `@gtcx/connectivity`, `@gtcx/network`, `@gtcx/sync`, `@gtcx/workproof`, `@gtcx/ai` |
| **Utilities**        | `@gtcx/logging`, `@gtcx/utils`                                                                                           |
| **Config workspace** | `@gtcx/eslint-config`, `@gtcx/typescript-config`, `@gtcx/tsup-config`, `@gtcx/jurisdiction-config`                       |

### Key TS Dependencies

| Dependency      | Purpose                                |
| --------------- | -------------------------------------- |
| `@noble/curves` | Ed25519 and secp256k1 primitives       |
| `@noble/hashes` | SHA-256, SHA-512, Blake3, HMAC support |
| `zod`           | Schema validation and type inference   |
| `vitest`        | Unit and integration testing           |

---

## Rust Crates (`gtcx-*`)

6 crates in `rust/`:

| Crate            | Purpose                                                        |
| ---------------- | -------------------------------------------------------------- |
| `gtcx-crypto`    | Ed25519 signing, SHA-256/Blake3 hashing, key material handling |
| `gtcx-zkp`       | ZKP circuits — Groth16, Bulletproofs, Schnorr                  |
| `gtcx-node`      | Node binding/runtime bridge for native operations              |
| `gtcx-network`   | P2P networking layer (libp2p QUIC + gossipsub)                 |
| `gtcx-edge`      | Edge/offline compute primitives                                |
| `gtcx-consensus` | Weighted PBFT and consensus primitives                         |

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

- `#![deny(unsafe_code)]` on cryptographic crates
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

`gtcx-core` public packages are published to npm (scoped to `@gtcx/*`) via Changesets:

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
