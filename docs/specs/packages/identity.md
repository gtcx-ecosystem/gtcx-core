# Package Spec — `@gtcx/identity`

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

**Classification:** Security-sensitive — all changes require Cryptographic Security Engineer co-review and human approval before merge.

---

## Purpose

Identity lifecycle management for the GTCX protocol. Owns the creation, derivation, validation, and resolution of decentralized identifiers (DIDs) and cryptographic identity objects. Every protocol participant — producer, verifier, device, service — has an identity managed through this package.

---

## Public API

### Identity Lifecycle (`identity.ts`)

| Export                                  | Description                                                         |
| --------------------------------------- | ------------------------------------------------------------------- |
| `createIdentity(options)`               | Create a new identity with an Ed25519 key pair                      |
| `createEnhancedIdentity(options)`       | Create identity with extended metadata (role, capabilities, expiry) |
| `deriveIdentity(masterIdentity, index)` | Derive a child identity via HD derivation                           |
| `validateIdentity(identity)`            | Validate identity structure and key material                        |
| `isIdentityExpired(identity)`           | Check expiry timestamp                                              |
| `generateIdentityId(publicKey)`         | Generate deterministic identity ID from public key                  |
| `CreateIdentityOptions`                 | Type                                                                |
| `IdentityCreationResult`                | Type                                                                |
| `EnhancedIdentityCreationResult`        | Type                                                                |

### DID Operations (`did.ts`)

| Export                                   | Description                                          |
| ---------------------------------------- | ---------------------------------------------------- |
| `DID_METHOD`                             | The GTCX DID method string (`gtcx`)                  |
| `createDID(publicKey)`                   | Create a `did:gtcx:...` identifier from a public key |
| `parseDID(did)`                          | Parse a DID string into components                   |
| `isValidDID(did)`                        | Validate DID format                                  |
| `createDIDDocument(identity)`            | Create a W3C DID Document from an identity           |
| `resolveDID(did, resolver?)`             | Resolve a DID to its DID Document                    |
| `resolveDIDWithMetadata(did, resolver?)` | Resolve with full resolution metadata                |
| `extractPublicKey(didDocument)`          | Extract the Ed25519 public key from a DID Document   |
| `DIDDocument`                            | Type: W3C DID Document                               |
| `VerificationMethod`                     | Type: DID Document verification method               |

### DID Resolver Infrastructure (`resolver.ts`)

| Export                                 | Description                         |
| -------------------------------------- | ----------------------------------- |
| `createDIDResolver(config)`            | Create a configurable DID resolver  |
| `createHttpDIDResolverAdapter(config)` | HTTP-backed resolver adapter        |
| `createInMemoryDIDCache(config?)`      | In-memory resolution cache          |
| `createStaticDIDResolverAdapter(map)`  | Static map resolver (testing)       |
| `DIDResolverError`                     | Error class for resolution failures |
| `DIDResolver`                          | Type: resolver function signature   |
| `DIDResolverAdapter`                   | Type: pluggable backend interface   |
| `DIDResolverCache`                     | Type: cache interface               |
| `DIDResolutionResult`                  | Type: full resolution result        |
| `DIDRevocationChecker`                 | Type: revocation check interface    |
| `DIDRevocationStatus`                  | Type: revocation status             |
| `HttpDIDResolverConfig`                | Type: HTTP adapter configuration    |

---

## Dependencies

| Dependency                   | Role                                       |
| ---------------------------- | ------------------------------------------ |
| `@gtcx/crypto` `workspace:*` | Key generation, signing, key ID derivation |
| `@gtcx/types` `workspace:*`  | Shared protocol types                      |

No external npm dependencies for cryptographic operations.

---

## Non-Goals

- Does not manage session tokens or permissions — that is `@gtcx/security` (auth module)
- Does not produce certificates or verification proofs — that is `@gtcx/verification`
- Does not store identities on disk — callers integrate with platform-specific secure storage
- Does not define DID registry infrastructure — registration is a protocol-layer concern

---

## DID Method

GTCX uses a proprietary DID method: `did:gtcx:<multibase-encoded-public-key>`.

- Method: `gtcx`
- Key type: Ed25519
- Encoding: multibase (base58btc by default)
- Resolution: via `@gtcx/identity`'s resolver infrastructure or the GTCX registry service

---

## Security Constraints

- `createIdentity` generates key material — returned private key must be stored in secure storage immediately; never log
- `deriveIdentity` uses the same HD derivation as `@gtcx/crypto` — child keys are mathematically linked to the master; protect master keys accordingly
- DID resolution results must be validated before use — do not trust unvalidated DID Documents from external resolvers
- Revocation checking is optional in the resolver but required in production verification flows

---

## Implementation

`packages/identity/src/`

---

## Reference

- [`docs/specs/packages/crypto.md`](./crypto.md) — cryptographic primitives this package depends on
- [`docs/specs/packages/verification.md`](./verification.md) — consumes identity for certificate signing
- [`docs/security/security-framework.md`](../../security/security-framework.md) — identity and key management policy
- [`docs/specs/core-spec.md`](../core-spec.md) — system overview
