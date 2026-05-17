---
title: 'Crypto Native'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs', 'specs']
review_cycle: 'on-change'
---

# Package Spec — `@gtcx/crypto-native`

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

**Classification:** Security-sensitive — all changes require Cryptographic Security Engineer co-review and human approval before merge.

---

## Purpose

NAPI bridge between TypeScript and the `gtcx-node` Rust crate. Exposes the compiled native `.node` binary to `@gtcx/crypto`'s backend loader at runtime. This package is the boundary between TypeScript and the Rust cryptographic implementation.

This package is not called directly by application code. All consumers go through `@gtcx/crypto`.

---

## Public API

All exports are raw NAPI bindings. The shapes are typed but the implementations are in Rust.

| Export                                        | Type                                      | Description                        |
| --------------------------------------------- | ----------------------------------------- | ---------------------------------- |
| `generateKeyPair()`                           | `() => NativeKeyPair`                     | Generate Ed25519 key pair via Rust |
| `sign(message, privateKeyHex)`                | `(Uint8Array, string) => string`          | Ed25519 sign                       |
| `verify(signatureHex, message, publicKeyHex)` | `(string, Uint8Array, string) => boolean` | Ed25519 verify                     |
| `sha256(data)`                                | `(Uint8Array) => string`                  | SHA-256 via Rust                   |
| `sha512(data)`                                | `(Uint8Array) => string`                  | SHA-512 via Rust                   |
| `blake3Hash(data)`                            | `(Uint8Array) => string \| undefined`     | Blake3 if available                |
| `deriveChildKey(parentKeyHex, index)`         | `(string, number) => string \| undefined` | HD key derivation                  |
| `derivePurposeKey(masterKeyHex, purpose)`     | `(string, string) => string \| undefined` | Purpose-scoped key derivation      |
| `version()`                                   | `() => string \| undefined`               | Native binary version string       |
| `nativeBindings`                              | `NativeCryptoBindings`                    | Composed binding object            |

### Types

```typescript
interface NativeKeyPair {
  privateKey: string;
  publicKey: string;
}

interface NativeCryptoBindings {
  generateKeyPair: () => NativeKeyPair;
  sign: (message: Uint8Array, privateKeyHex: string) => string;
  verify: (signatureHex: string, message: Uint8Array, publicKeyHex: string) => boolean;
  sha256: (data: Uint8Array) => string;
  sha512: (data: Uint8Array) => string;
  blake3Hash?: (data: Uint8Array) => string;
  deriveChildKey?: (parentKeyHex: string, index: number) => string;
  derivePurposeKey?: (masterKeyHex: string, purpose: string) => string;
  version?: () => string;
}
```

---

## Binary Resolution

The loader attempts to find `gtcx_node.node` at these locations in order:

1. `GTCX_CRYPTO_NATIVE_PATH` env override
2. `<package>/native/gtcx_node.node`
3. `<package>/../native/gtcx_node.node`
4. `<cwd>/packages/crypto-native/native/gtcx_node.node`
5. `<cwd>/rust/target/release/gtcx_node.node`
6. `<cwd>/rust/target/debug/gtcx_node.node`

If no candidate is found, throws with a list of all attempted paths.

---

## Dependencies

No npm dependencies. Requires the compiled `gtcx_node.node` NAPI binary, built from the `gtcx-node` Rust crate.

---

## Platform CI Matrix

The native binary must be built and tested on all four targets before release:

| Target        | Architecture  |
| ------------- | ------------- |
| Linux x86_64  | glibc         |
| Linux aarch64 | glibc         |
| macOS x86_64  | Intel         |
| macOS aarch64 | Apple Silicon |

---

## Non-Goals

- Does not implement fallback behavior — that is `@gtcx/crypto`'s `native-loader.ts`
- Does not perform input validation — callers validate before crossing the NAPI boundary
- Does not manage key lifecycle or storage

---

## Security Constraints

- NAPI boundary is a trust boundary — never pass unvalidated input from external sources
- String encoding for keys and signatures is hex throughout; binary is `Uint8Array`
- `blake3Hash`, `deriveChildKey`, `derivePurposeKey`, `version` are optional — check for `undefined` before calling
- `GTCX_REQUIRE_NATIVE=true` must be set in production; absence causes hard fail in `@gtcx/crypto`

---

## Implementation

`packages/crypto-native/src/`

---

## Reference

- [`docs/specs/packages/crypto.md`](./crypto.md) — TS crypto package that consumes this
- [`docs/security/security-framework.md`](../../security/security-framework.md) — cryptographic standards
- [`docs/devops/ci-cd/ci-cd.md`](../../devops/ci-cd/ci-cd.md) — platform matrix CI
