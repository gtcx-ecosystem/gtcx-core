---
title: 'Gtcx Crypto'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs', 'specs']
review_cycle: 'on-change'
---

# Crate Spec — `gtcx-crypto`

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

**Classification:** Security-sensitive — all changes require Cryptographic Security Engineer co-review and human approval before merge.

---

## Purpose

Single source of truth for all cryptography in the GTCX protocol. Implements Ed25519 and secp256k1 signing, SHA-256/SHA-512/Blake3 hashing, key generation and HD derivation, and hash-chained audit logs. All TypeScript cryptographic operations ultimately delegate here via the `gtcx-node` NAPI layer.

---

## Design Principles

1. No unsafe code — `#![deny(unsafe_code)]` enforced
2. Secrets zeroized on drop — private keys implement `Zeroize` via `zeroize` crate
3. Newtypes prevent confusion — `PrivateKey`, `PublicKey`, `Signature` are distinct types, not `Vec<u8>`
4. Fully documented — `#![deny(missing_docs)]` enforced
5. AI-Native observability — all operations instrumented via `tracing`

---

## Public API

### Signing

#### Ed25519 (`signing::ed25519`)

| Export                                   | Description                                  |
| ---------------------------------------- | -------------------------------------------- |
| `sign(message, private_key)`             | Sign a message with an Ed25519 private key   |
| `verify(signature, message, public_key)` | Verify an Ed25519 signature                  |
| `batch_verify(items)`                    | Batch verify multiple signatures in one pass |
| `PrivateKey`                             | Newtype — zeroized on drop                   |
| `PublicKey`                              | Newtype — 32-byte Ed25519 public key         |
| `Signature`                              | Newtype — 64-byte Ed25519 signature          |

#### secp256k1 (`signing::secp256k1`)

Schnorr signature operations over the secp256k1 curve. Used for cross-chain compatibility where secp256k1 is required.

Re-exported as `secp256k1` module from crate root.

### Hashing (`hashing`)

| Export         | Description                      |
| -------------- | -------------------------------- |
| `sha256(data)` | SHA-256 hash, returns `[u8; 32]` |
| `sha512(data)` | SHA-512 hash, returns `[u8; 64]` |
| `blake3(data)` | Blake3 hash, returns `[u8; 32]`  |

### Key Generation (`keys`)

| Export               | Description                                                             |
| -------------------- | ----------------------------------------------------------------------- |
| `generate_keypair()` | Generate a random Ed25519 key pair                                      |
| `KeyPair`            | Struct holding `(PrivateKey, PublicKey)` — private key zeroized on drop |

### Hash-Chained Audit Log (`chain`)

| Export                          | Description                                    |
| ------------------------------- | ---------------------------------------------- |
| `create_entry(data, prev_hash)` | Create a new hash-chained log entry            |
| `ChainEntry`                    | Struct: `{ data, hash, prev_hash, timestamp }` |

### Error Types (`error`)

| Export        | Description                                 |
| ------------- | ------------------------------------------- |
| `CryptoError` | Enum covering all crate error variants      |
| `Result<T>`   | `std::result::Result<T, CryptoError>` alias |

---

## Dependencies

| Crate           | Role                                      |
| --------------- | ----------------------------------------- |
| `ed25519-dalek` | Ed25519 signing — IETF RFC 8032 compliant |
| `k256`          | secp256k1 Schnorr operations              |
| `sha2`          | SHA-256 and SHA-512                       |
| `blake3`        | Blake3 hashing                            |
| `rand`          | Cryptographically secure randomness       |
| `zeroize`       | Memory zeroing for secret values          |
| `serde`         | Serialization support                     |
| `hex`           | Hex encoding/decoding                     |
| `thiserror`     | Error type derivation                     |
| `tracing`       | Structured observability                  |

Dev dependencies: `proptest`, `criterion`, `serde_json`, `secp256k1`

---

## Performance Budgets

Benchmarks are defined in `benchmarks/signing` and `benchmarks/hashing`. Run via `cargo bench`. Budgets enforced by `pnpm perf:check-budgets`.

---

## Non-Goals

- Does not implement ZKP circuits — that is `gtcx-zkp`
- Does not expose NAPI bindings — that is `gtcx-node`
- Does not manage key storage — storage is a platform concern
- Does not implement custom cryptographic algorithms — all algorithms use upstream audited crates

---

## Security Constraints

- `PrivateKey` implements `Zeroize` and `Drop` — memory is wiped automatically; never clone into a `Vec<u8>` or `String`
- Constant-time comparison must be used for all secret-value equality checks — `subtle` crate preferred
- Never introduce `unsafe` blocks — reject any PR that requires `unsafe` in this crate
- New algorithm additions require a new ADR and Cryptographic Security Engineer approval before implementation begins

---

## Implementation

`rust/gtcx-crypto/src/`

---

## Reference

- [`docs/specs/packages/crypto.md`](../crypto.md) — TypeScript package that consumes this crate
- [`docs/security/security-framework.md`](../../../security/security-framework.md) — approved libraries and cryptographic standards
- [`docs/specs/core-spec.md`](../../core-spec.md) — system overview
