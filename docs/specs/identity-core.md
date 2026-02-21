# Identity Core (TradePass)

**Status**: Active (2026-02-21)

This document describes the identity capabilities implemented in `@gtcx/identity`. It reflects current code and highlights integration points for persistence and resolution.

## Purpose

- Create and manage cryptographic identities for GTCX participants.
- Generate DID identifiers and DID Documents for verification.
- Support multi-key identities for higher assurance use cases.

## Current Implementation

Located in `packages/identity/src/*`:

- `createIdentity()` — standard identity generation.
- `createEnhancedIdentity()` — multi-key identity (Ed25519 + Secp256k1).
- `createDID()` — derives `did:gtcx:<fingerprint>` identifiers.
- `createDIDDocument()` — emits a simplified W3C-compatible DID document.
- `resolveDID()` — pluggable resolver (no network backing in this repo).

### Supported Algorithms

- **Ed25519** (default)
- **Secp256k1** (enhanced identities)

### Security Levels

`SecurityLevel` values used by `@gtcx/identity`:

- `standard`
- `enhanced`
- `military`

These are metadata-level signals; enforcement decisions belong to downstream services.

## DID Method

- Format: `did:gtcx:<fingerprint>`
- Fingerprint is derived from the public key hash (see `packages/identity/src/did.ts`).

## Persistence and Resolution

- The package does **not** include storage or on-chain resolution.
- Implementations should provide a `DIDResolver` or resolver function to `resolveDID`.

## References

- `docs/specs/security-framework.md`
- `docs/packages/identity.md`
- `packages/identity/src/did.ts`
