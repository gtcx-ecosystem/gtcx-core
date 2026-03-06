# Identity Core — gtcx-core

**Status**: Active
**Last reviewed**: 2026-02-21

Describes the identity capabilities implemented in `@gtcx/identity`. Reflects current code and highlights integration points for persistence and resolution.

## Purpose

- Create and manage cryptographic identities for GTCX participants.
- Generate DID identifiers and DID Documents for verification.
- Support multi-key identities for higher-assurance use cases.

## DID Method

- **Format**: `did:gtcx:<fingerprint>`
- **Fingerprint**: derived from public key hash via `packages/identity/src/did.ts`
- **Compatibility**: simplified W3C DID Document structure

## API Surface (`packages/identity/src/`)

| Function                      | Description                                          |
| ----------------------------- | ---------------------------------------------------- |
| `createIdentity()`            | Standard Ed25519 identity generation                 |
| `createEnhancedIdentity()`    | Multi-key identity (Ed25519 + Secp256k1)             |
| `createDID(identity)`         | Derives `did:gtcx:<fingerprint>`                     |
| `createDIDDocument(identity)` | Emits a simplified W3C-compatible DID document       |
| `resolveDID(did, resolver?)`  | Pluggable resolver — no network backing in this repo |

## Security Levels

| Level      | Description                              |
| ---------- | ---------------------------------------- |
| `standard` | Ed25519 single-key identity              |
| `enhanced` | Ed25519 + Secp256k1 multi-key            |
| `military` | Enhanced + additional assurance metadata |

Security levels are metadata signals. Enforcement decisions belong to downstream services.

## Supported Algorithms

- **Ed25519** (default) — all identity types
- **Secp256k1** — enhanced and military identities

## Persistence and Resolution

- This package does **not** include storage or on-chain resolution.
- Provide a `DIDResolver` function to `resolveDID` for network-backed resolution.
- Local key storage is the responsibility of the consuming runtime.

## References

- `../engineering/security/security-framework.md`
- `packages/identity.md`
- `packages/identity/src/did.ts`
