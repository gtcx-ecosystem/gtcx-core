# GTCX Core Packages

Shared TypeScript packages for the GTCX Protocol ecosystem. Each package follows the 12 Architectural Principles and is designed for offline-first operation in frontier market environments.

## Package Index

| Package | Description | Key Principles |
|---------|-------------|----------------|
| [`@gtcx/crypto`](./crypto.md) | Cryptographic primitives (Ed25519, SHA-256, proofs) | P9 Security, P5 AI-Native |
| [`@gtcx/identity`](./identity.md) | DID creation, credential management, key lifecycle | P8 Offline, P9 Security |
| [`@gtcx/security`](./security.md) | Validation, auth, offline credential cache, audit | P2 Type Safety, P8 Offline |
| [`@gtcx/verification`](./verification.md) | Certificates, QR codes, proof bundles, Merkle trees | P9 Security, P6 Abstraction |
| [`@gtcx/domain`](./domain.md) | Commodity-agnostic domain services | P6 Abstraction, P4 Composability |
| [`@gtcx/events`](./events.md) | Type-safe event contracts and offline event bus | P2 Type Safety, P8 Offline |
| [`@gtcx/sync`](./sync.md) | Offline-first synchronization engine | P8 Offline (core impl) |
| [`@gtcx/api-client`](./api-client.md) | Resilient API client with retry and circuit breaker | P8 Offline, P9 Security |
| [`@gtcx/connectivity`](./connectivity.md) | Adaptive connectivity profiles and USSD gateway | P8 Offline, P12 Observability |

## Dependency Graph

```
@gtcx/crypto           (no internal deps — foundational)
    │
    ├── @gtcx/identity  (uses crypto for key generation and signing)
    │
    ├── @gtcx/security  (uses crypto for tamper detection)
    │
    └── @gtcx/verification (uses crypto for proof structures)

@gtcx/events           (standalone — type-safe event contracts)
    │
    └── @gtcx/sync      (uses events for sync event emission)
        │
        └── @gtcx/api-client (uses sync for offline queue)

@gtcx/domain           (uses events, depends on crypto via DI)

@gtcx/connectivity     (standalone — network detection, USSD gateway)
```

## Offline-First Architecture (P8)

All packages support operation without network connectivity. The sync strategy varies by protocol:

| Protocol | Strategy | Rationale |
|----------|----------|-----------|
| TradePass | `last-write-wins` | Most recent credential update is authoritative |
| GeoTag | `append-only` | Location proofs are immutable |
| VaultMark | `chain-validated` | Custody chain integrity required |
| PvP | `highest-version` | Latest settlement state wins |
| GCI | `highest-version` | Compliance scores use version numbers |
| PANX | `server-wins` | Oracle prices are server-authoritative |

### Key Offline Capabilities

| Package | Offline Capability |
|---------|-------------------|
| `@gtcx/crypto` | All signing and hashing operations run locally |
| `@gtcx/identity` | Cached credentials with configurable TTL (default 72h) |
| `@gtcx/security` | Encrypted local storage, offline credential cache, tamper detection |
| `@gtcx/events` | Offline event queue with 72-hour persistence |
| `@gtcx/sync` | Change tracking, conflict detection, deferred resolution |
| `@gtcx/api-client` | Request queue with automatic drain on reconnect |
| `@gtcx/connectivity` | 6 connectivity profiles from offline to satellite |

## 12 Architectural Principles

All packages enforce these principles:

| # | Principle | Enforcement |
|---|-----------|-------------|
| P1 | Package Structure | No circular dependencies; clear module boundaries |
| P2 | Type Safety | Zod validation at all external boundaries |
| P3 | Modularity | Single-responsibility functions; small modules |
| P4 | Composability | Dependency injection; pluggable storage and handlers |
| P5 | AI-Native | Structured logging for ML analysis |
| P6 | Asset Abstraction | `commodityType: string` — no hardcoded commodities |
| P7 | Documentation | JSDoc on all exports; README with examples |
| P8 | Offline-First | Works without network; syncs when connected |
| P9 | Security | Input validation; rate limiting; audit trails |
| P10 | API Stability | Versioned exports; deprecation markers |
| P11 | Data Evolution | Schema versioning with migration support |
| P12 | Observability | Structured events; correlation IDs; metrics |

## Development

```bash
# Build all packages
pnpm build

# Build specific package
pnpm --filter @gtcx/sync build

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
