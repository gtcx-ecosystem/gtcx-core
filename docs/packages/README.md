# GTCX Core Packages

Shared TypeScript packages for the GTCX Protocol ecosystem. Each package follows the 12 Architectural Principles and is designed for offline-first operation in frontier market environments.

## Package Index

### Implemented Packages

| Package                                   | Description                                              | Key Principles                   |
| ----------------------------------------- | -------------------------------------------------------- | -------------------------------- |
| [`@gtcx/crypto`](./crypto.md)             | Cryptographic primitives (Ed25519, SHA-256, proofs)      | P9 Security, P5 AI-Native        |
| [`@gtcx/identity`](./identity.md)         | DID creation, credential management, key lifecycle       | P8 Offline, P9 Security          |
| [`@gtcx/security`](./security.md)         | Validation, auth, offline credential cache, audit        | P2 Type Safety, P8 Offline       |
| [`@gtcx/verification`](./verification.md) | Certificates, QR codes, proof bundles, Merkle trees      | P9 Security, P6 Abstraction      |
| [`@gtcx/domain`](./domain.md)             | Foundational domain types, schemas, events, metrics      | P6 Abstraction, P2 Type Safety   |
| [`@gtcx/services`](./services.md)         | Application services (registration, trading, compliance) | P4 Composability, P6 Abstraction |
| `@gtcx/schemas`                           | Core12 compliance framework and Zod validation schemas   | P2 Type Safety, P9 Security      |
| `@gtcx/types`                             | Shared TypeScript type definitions                       | P1 Package Structure             |
| `@gtcx/ai`                                | AI integration stubs (tracing, category logging)         | P5 AI-Native                     |
| `@gtcx/logging`                           | Structured logging utilities                             | P12 Observability                |
| `@gtcx/utils`                             | Common utility functions                                 | P3 Modularity                    |
| `@gtcx/events`                            | Typed event bus with offline buffering and replay        | P12 Observability, P8 Offline    |
| `@gtcx/connectivity`                      | Network status detection and connectivity profiles       | P8 Offline                       |
| `@gtcx/sync`                              | Offline-first sync engine (interface stub)               | P8 Offline                       |
| `@gtcx/api-client`                        | Resilient API client (interface stub)                    | P4 Composability                 |

## Dependency Graph

```
@gtcx/crypto           (depends on @gtcx/ai for traced wrappers, @gtcx/types)
    │
    ├── @gtcx/identity      (depends on @gtcx/crypto, @gtcx/types)
    │
    ├── @gtcx/security      (depends on @gtcx/crypto)
    │
    └── @gtcx/verification  (depends on @gtcx/crypto, @gtcx/ai, @gtcx/types)

@gtcx/domain           (foundational types, schemas, events, metrics)
    │
    └── @gtcx/services  (registration, trading, compliance — depends on domain)

@gtcx/domain           → @gtcx/events (typed event bus with offline buffering)

@gtcx/schemas          (Core12 compliance framework)
@gtcx/types            (shared TypeScript types)
@gtcx/ai               (AI integration stubs)
@gtcx/logging          (structured logging)
@gtcx/utils            (standalone utilities, no internal deps)
@gtcx/connectivity     (network status detection, no internal deps)
@gtcx/sync             (sync engine stub, no internal deps)
@gtcx/api-client       (API client stub, no internal deps)
```

## Offline-First Architecture (P8)

All packages support operation without network connectivity. The sync strategy varies by protocol:

| Protocol  | Strategy          | Rationale                                      |
| --------- | ----------------- | ---------------------------------------------- |
| TradePass | `last-write-wins` | Most recent credential update is authoritative |
| GeoTag    | `append-only`     | Location proofs are immutable                  |
| VaultMark | `chain-validated` | Custody chain integrity required               |
| PvP       | `highest-version` | Latest settlement state wins                   |
| GCI       | `highest-version` | Compliance scores use version numbers          |
| PANX      | `server-wins`     | Oracle prices are server-authoritative         |

### Key Offline Capabilities

| Package              | Offline Capability                                                  |
| -------------------- | ------------------------------------------------------------------- |
| `@gtcx/crypto`       | All signing and hashing operations run locally                      |
| `@gtcx/identity`     | Cached credentials with configurable TTL (default 72h)              |
| `@gtcx/security`     | Encrypted local storage, offline credential cache, tamper detection |
| `@gtcx/domain`       | Offline queue with conflict resolution (P8)                         |
| `@gtcx/verification` | Certificates generated locally, synced later                        |

## 12 Architectural Principles

All packages enforce these principles:

| #   | Principle         | Enforcement                                          |
| --- | ----------------- | ---------------------------------------------------- |
| P1  | Package Structure | No circular dependencies; clear module boundaries    |
| P2  | Type Safety       | Zod validation at all external boundaries            |
| P3  | Modularity        | Single-responsibility functions; small modules       |
| P4  | Composability     | Dependency injection; pluggable storage and handlers |
| P5  | AI-Native         | Structured logging for ML analysis                   |
| P6  | Asset Abstraction | `commodityType: string` — no hardcoded commodities   |
| P7  | Documentation     | JSDoc on all exports; README with examples           |
| P8  | Offline-First     | Works without network; syncs when connected          |
| P9  | Security          | Input validation; rate limiting; audit trails        |
| P10 | API Stability     | Versioned exports; deprecation markers               |
| P11 | Data Evolution    | Schema versioning with migration support             |
| P12 | Observability     | Structured events; correlation IDs; metrics          |

## Development

```bash
# Build all packages
pnpm build

# Build specific package
pnpm --filter @gtcx/services build

# Run tests
pnpm test

# Type check
pnpm typecheck
```

## Related

- [Shared Infrastructure](../architecture/shared-infrastructure.md) — Package dependency rules and architecture overview
- [Integration Patterns](../architecture/integration-patterns.md) — How packages interact across protocol boundaries
- [Security Framework](../specs/security-framework.md) — Cryptographic standards and key hierarchy
- [Rust Foundation Layer](../rust/README.md) — Performance-critical Rust crates that underpin TypeScript packages
