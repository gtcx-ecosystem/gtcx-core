# Crate Spec — `gtcx-node`

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

**Classification:** Security-sensitive — all changes require Cryptographic Security Engineer co-review and human approval before merge (NAPI boundary is a trust boundary).

---

## Purpose

NAPI-RS bindings exposing `gtcx-crypto` to Node.js and TypeScript. This crate is the compiled native module (`gtcx_node.node`) that `@gtcx/crypto-native` loads at runtime. It is the sole bridge between the Rust cryptographic implementation and the TypeScript layer.

---

## Exposed Bindings

| Binding                                       | Rust Source                             | Description                                                                               |
| --------------------------------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------- |
| `generateKeyPair()`                           | `gtcx_crypto::keys::generate_keypair`   | Generate Ed25519 key pair — returns `JsKeyPair { private_key, public_key }` (hex strings) |
| `sign(message, privateKeyHex)`                | `gtcx_crypto::signing::ed25519::sign`   | Ed25519 sign — message as `Uint8Array`, returns hex signature                             |
| `verify(signatureHex, message, publicKeyHex)` | `gtcx_crypto::signing::ed25519::verify` | Ed25519 verify — returns boolean                                                          |
| `sha256(data)`                                | `gtcx_crypto::hashing::sha256`          | SHA-256 — `Uint8Array` → hex string                                                       |
| `sha512(data)`                                | `gtcx_crypto::hashing::sha512`          | SHA-512 — `Uint8Array` → hex string                                                       |
| `blake3Hash(data)`                            | `gtcx_crypto::hashing::blake3`          | Blake3 — `Uint8Array` → hex string                                                        |
| `deriveChildKey(parentKeyHex, index)`         | HD key derivation                       | Derive child key at given index                                                           |
| `derivePurposeKey(masterKeyHex, purpose)`     | Purpose key derivation                  | Derive purpose-scoped key                                                                 |
| `version()`                                   | Build metadata                          | Native binary version string                                                              |
| `createChainEntry(data, prevHash)`            | `gtcx_crypto::chain::create_entry`      | Create hash-chained audit entry                                                           |

### JsKeyPair Struct

```rust
#[napi(object)]
pub struct JsKeyPair {
    pub private_key: String,  // hex-encoded Ed25519 private key
    pub public_key: String,   // hex-encoded Ed25519 public key
}
```

---

## Dependencies

| Crate                 | Role                         |
| --------------------- | ---------------------------- |
| `gtcx-crypto` (local) | All cryptographic operations |
| `napi` `napi4`        | NAPI runtime bindings        |
| `napi-derive`         | `#[napi]` attribute macros   |

---

## Build Artifact

Compiled output: `gtcx_node.node` — a platform-specific native Node.js addon.

Must be built separately for each platform target:

| Target        | Architecture  |
| ------------- | ------------- |
| Linux x86_64  | glibc         |
| Linux aarch64 | glibc         |
| macOS x86_64  | Intel         |
| macOS aarch64 | Apple Silicon |

Build: `cargo build --release -p gtcx-node` — outputs `target/release/libgtcx_node.so` (Linux) or `target/release/libgtcx_node.dylib` (macOS), renamed to `gtcx_node.node` for Node.js loading.

---

## Non-Goals

- Does not implement cryptographic logic — delegates entirely to `gtcx-crypto`
- Does not implement ZKP circuits — `gtcx-zkp` bindings are separate
- Does not perform input validation beyond type coercion — callers validate before crossing the boundary

---

## Security Constraints

- `#![deny(unsafe_code)]` enforced — NAPI itself uses unsafe internally, but this crate's code must not
- Private keys cross the NAPI boundary as hex strings — they are in TypeScript memory after this point; TypeScript caller is responsible for wiping with `secureWipe()`
- Any change to the binding signatures is an API surface change — update the baseline with `pnpm api:update-baseline`

---

## Implementation

`rust/gtcx-node/src/`

---

## Reference

- [`docs/specs/packages/rust/gtcx-crypto.md`](./gtcx-crypto.md) — Rust source
- [`docs/specs/packages/crypto-native.md`](../crypto-native.md) — TypeScript consumer
- [`docs/devops/ci-cd/ci-cd.md`](../../../devops/ci-cd/ci-cd.md) — native binding CI matrix
