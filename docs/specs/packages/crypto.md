---
title: 'Package Spec — `@gtcx/crypto`'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'standard'
tags: ['documentation', 'specs']
review_cycle: 'on-change'
---

---

title: 'Crypto'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs', 'specs']
review_cycle: 'on-change'

---

# Package Spec — `@gtcx/crypto`

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

**Classification:** Security-sensitive — all changes require Cryptographic Security Engineer co-review and human approval before merge.

---

## Purpose

TypeScript API surface for all cryptographic operations in the GTCX protocol. Delegates heavy computation to the Rust `gtcx-crypto` crate via `@gtcx/crypto-native` in production; falls back to `@noble/curves` and `@noble/hashes` for development and environments without native bindings.

This package is the single entry point for all signing, verification, hashing, commitment, and ZKP operations in TypeScript. No other package calls cryptographic primitives directly.

---

## Public API

### Key Operations (`keys.ts`)

| Export                        | Description                           |
| ----------------------------- | ------------------------------------- |
| `generateKeyPair()`           | Generate Ed25519 key pair             |
| `derivePublicKey(privateKey)` | Derive public key from private key    |
| `isValidPublicKey(key)`       | Validate public key format and length |
| `isValidPrivateKey(key)`      | Validate private key format           |
| `generateKeyId(publicKey)`    | Generate deterministic key identifier |
| `keyFormats`                  | Supported key encoding formats        |
| `compressPublicKey(key)`      | Compress public key to compact form   |
| `KeyAlgorithm`                | Type: supported algorithms            |
| `KeyPairResult`               | Type: key pair output                 |
| `DerivedKey`                  | Type: derived key output              |

### Signing Operations (`signing.ts`)

| Export                                     | Description                          |
| ------------------------------------------ | ------------------------------------ |
| `sign(message, privateKey)`                | Sign raw message bytes               |
| `signHash(hash, privateKey)`               | Sign a pre-hashed value              |
| `verify(signature, message, publicKey)`    | Verify a signature                   |
| `verifyHash(signature, hash, publicKey)`   | Verify against pre-hashed value      |
| `createSignedMessage(message, privateKey)` | Create self-contained signed message |
| `verifySignedMessage(signedMessage)`       | Verify and unwrap signed message     |
| `batchVerify(items)`                       | Batch verify multiple signatures     |
| `secureWipe(buffer)`                       | Zero-fill a buffer in memory         |
| `SignatureResult`                          | Type                                 |
| `VerificationResult`                       | Type                                 |

### Hashing Operations (`hashing.ts`)

| Export                                      | Description                                 |
| ------------------------------------------- | ------------------------------------------- |
| `hash256(data)`                             | SHA-256 hash                                |
| `hash512(data)`                             | SHA-512 hash                                |
| `hash(data, algorithm)`                     | Hash with explicit algorithm selection      |
| `hashObject(obj)`                           | Deterministic hash of a serializable object |
| `doubleHash256(data)`                       | SHA-256(SHA-256(data))                      |
| `verifyHashValue(data, expected)`           | Constant-time hash comparison               |
| `createCommitment(value, salt)`             | Create a hash commitment                    |
| `verifyCommitment(commitment, value, salt)` | Verify a commitment                         |
| `generateSalt()`                            | Generate random salt bytes                  |
| `combineHashes(hashes)`                     | Combine multiple hashes deterministically   |
| `constantTimeEqual(a, b)`                   | Constant-time byte comparison               |
| `HashAlgorithm`                             | Type: supported hash algorithms             |

### ZKP / Proofs (`zkp.ts`, `proofs.ts`)

TypeScript wrappers over the Rust `gtcx-zkp` proof circuits. Development-environment stubs only — production ZKP operations run in `gtcx-zkp` via native bindings.

### Traced API (`traced.ts`, `traced-hashing.ts`, `traced-keys.ts`)

All operations above have traced counterparts prefixed with `traced` (e.g. `tracedSign`, `tracedHash256`, `tracedGenerateKeyPair`). Traced variants emit structured logs for AI observability. Import from `@gtcx/crypto` directly — the traced exports are included in the main barrel.

### Backend Selection (`native-loader.ts`)

| Export         | Description                                      |
| -------------- | ------------------------------------------------ |
| `getBackend()` | Returns the active crypto backend (native or JS) |

---

## Dependencies

| Dependency               | Role                                             |
| ------------------------ | ------------------------------------------------ |
| `@noble/curves` `^1.4.0` | JS fallback for Ed25519 and secp256k1 operations |
| `@noble/hashes` `^1.4.0` | JS fallback for SHA-256, SHA-512                 |
| `zod` `^3.23.0`          | Runtime input validation                         |
| `@gtcx/types` (peer)     | Shared protocol types                            |
| `@gtcx/ai` (peer)        | Tracing and observability infrastructure         |

No dependency on `@gtcx/crypto-native` directly — backend selection via `native-loader.ts` at runtime.

---

## Non-Goals

- Does not manage key storage — that is `@gtcx/security` (offline module)
- Does not manage identity lifecycle — that is `@gtcx/identity`
- Does not manage certificates or QR codes — that is `@gtcx/verification`
- Does not implement custom cryptographic primitives — all algorithms use audited upstream libraries

---

## Security Constraints

- Private keys must never be logged, serialized to disk, or passed over a network boundary
- Use `secureWipe()` immediately after use of any buffer containing key material
- `constantTimeEqual()` must be used for all secret-value comparisons — never `===`
- ZKP stubs in TypeScript are development-only; production requires native binary
- `GTCX_REQUIRE_NATIVE=true` must be set in production — hard-fails if native module unavailable

---

## Implementation

`packages/crypto/src/`

---

## Reference

- [`docs/security/security-framework.md`](../../security/security-framework.md) — cryptographic standards and approved libraries
- [`docs/specs/packages/crypto-native.md`](./crypto-native.md) — native binding surface
- [`docs/specs/packages/rust/gtcx-crypto.md`](./rust/gtcx-crypto.md) — Rust crate spec
- [`docs/specs/core-spec.md`](../core-spec.md) — system overview and dependency rules
