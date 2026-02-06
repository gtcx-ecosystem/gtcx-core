# GTCX Core

Shared foundation for the GTCX ecosystem. Contains cryptographic primitives (Rust), TypeScript type definitions, Zod schemas, and domain models consumed by all other repos. This is the lowest-level dependency in the stack -- it depends on nothing else.

## Quick Navigation

| Document                                                                        | Description                                       |
| ------------------------------------------------------------------------------- | ------------------------------------------------- |
| [Architecture Overview](./docs/architecture/core-architecture-overview.md)      | Composable architecture and ecosystem integration |
| [Shared Infrastructure](./docs/architecture/shared-infrastructure.md)           | Shared infrastructure and integration patterns    |
| [Cryptographic Verification](./docs/architecture/cryptographic-verification.md) | Crypto design and verification model              |
| [Data Models Spec](./docs/specs/data-models.md)                                 | Core data model specification                     |
| [Security Framework](./docs/specs/security-framework.md)                        | Security architecture and threat model            |
| [Identity Package](./docs/packages/identity.md)                                 | DID, credentials, offline identity cache          |
| [Crypto Package](./docs/packages/crypto.md)                                     | Rust-to-TypeScript crypto bindings                |
| [Security Audit](./packages/security/AUDIT.md)                                  | Security package audit notes                      |
| [First Integration Guide](./docs/guides/first-integration.md)                   | Getting started with gtcx-core                    |

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) >= 20.0.0
- [pnpm](https://pnpm.io/) >= 9.15.0

### Setup

```bash
pnpm install
pnpm build
pnpm test
pnpm lint
```

For a step-by-step integration walkthrough, see [First Integration Tutorial](./docs/guides/first-integration.md).

## Directory Structure

```
gtcx-core/
├── rust/                  # Rust crates (crypto, zkp, consensus, network, edge, node)
├── packages/              # TypeScript packages (types, schemas, crypto, domain, utils, identity, security, verification, config)
└── docs/                  # Architecture, specs, package docs, and guides
```

## Dependencies

None. This is the foundation layer.

## Principles

> Full definitions: [PRINCIPLES.md](https://github.com/gtcx-ecosystem/gtcx-infrastructure/blob/main/tools/templates/PRINCIPLES.md)

Primary principles for this repo:

- P1 Proof -- every claim requires cryptographic proof
- P2 Private -- minimal disclosure, data sovereignty
- P4 Immutable -- verification records cannot be altered
- P11 Secure -- zero-trust security at every layer

Required across all repos:

- P7 Open -- open-source, no vendor lock-in
- P13 Modular -- single responsibility, clear boundaries
- P27 Documented -- every system and API is documented
- P29 Tested -- automated tests for every module
- P30 Intentional -- every line of code serves a purpose

## Documentation Index

- docs/README.md

## Spec Canon Alignment

- gtcx-protocols/agile-pm/spec-canon.md
- gtcx-docs/docs/docs-overview.md

## Cross-Links

- gtcx-docs — Ecosystem documentation hub
- gtcx-protocols — Protocol specs and delivery planning
- gtcx-core — Shared crypto, types, and schemas
