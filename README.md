# GTCX Core

Shared foundation for the GTCX ecosystem. Contains cryptographic primitives (Rust), TypeScript type definitions, Zod schemas, and domain models consumed by all other repos. This is the lowest-level dependency in the stack -- it depends on nothing else.

## Quick Navigation

| Document | Description |
|----------|-------------|
| [Architecture Overview](./docs/architecture/shared-infrastructure.md) | Shared infrastructure and integration patterns |
| [Cryptographic Verification](./docs/architecture/cryptographic-verification.md) | Crypto design and verification model |
| [Data Models Spec](./docs/specs/data-models.md) | Core data model specification |
| [Security Framework](./docs/specs/security-framework.md) | Security architecture and threat model |
| [Identity Package](./docs/packages/identity.md) | DID, credentials, offline identity cache |
| [Crypto Package](./docs/packages/crypto.md) | Rust-to-TypeScript crypto bindings |
| [Security Audit](./packages/security/AUDIT.md) | Security package audit notes |
| [First Integration Guide](./docs/guides/first-integration.md) | Getting started with gtcx-core |

## Directory Structure

```
gtcx-core/
├── rust/                  # Rust crates (crypto, zkp, consensus, network, edge, node)
├── packages/              # TypeScript packages (types, schemas, crypto, domain, utils, identity, security, verification, config)
└── docs/                  # Architecture, specs, package docs, and guides
```

## Dependencies

None. This is the foundation layer.
