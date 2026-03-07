# @gtcx/identity

Identity generation and DID utilities for GTCX. Provides identity creation, DID identifiers, DID Documents, and a pluggable resolver interface.

## Scope

- Identity generation — standard and enhanced multi-key
- DID creation, parsing, and validation
- DID Document construction
- Pluggable DID resolver interface

## Key Exports (`packages/identity/src/index.ts`)

| Export                   | Description                                    |
| ------------------------ | ---------------------------------------------- |
| `createIdentity`         | Standard Ed25519 identity generation           |
| `createEnhancedIdentity` | Multi-key identity — Ed25519 + Secp256k1       |
| `createDID`              | Derives `did:gtcx:<fingerprint>` from identity |
| `createDIDDocument`      | Simplified W3C-compatible DID Document         |
| `parseDID`               | Parses a DID string into components            |
| `isValidDID`             | Validates DID format                           |
| `resolveDID`             | Resolves a DID using an injected resolver      |
| `resolveDIDWithMetadata` | Resolution with metadata                       |
| `DIDResolver`            | Resolver interface type                        |

## Security Levels

| Level      | Algorithms          | Use Case                          |
| ---------- | ------------------- | --------------------------------- |
| `standard` | Ed25519             | Default — operators, participants |
| `enhanced` | Ed25519 + Secp256k1 | Higher-assurance flows            |
| `military` | Enhanced + metadata | Maximum assurance                 |

Security levels are metadata signals. Enforcement belongs to downstream services.

## Notes

- No network-backed resolver ships in this repo — provide a `DIDResolver` implementation for resolution.
- No local storage — key persistence is a runtime responsibility.

## References

- `../../../specs/identity-core.md`
- `../../../engineering/security/security-framework.md`
