# Documentation Index

Complete documentation for the GTCX Core monorepo — the shared foundation layer for the GTCX ecosystem.

## Architecture

| Document                                                                   | Description                                                            |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| [Core Architecture Overview](./architecture/core-architecture-overview.md) | Composable architecture, layers, and ecosystem integration             |
| [Shared Infrastructure](./architecture/shared-infrastructure.md)           | Shared infrastructure and integration patterns                         |
| [Cryptographic Verification](./architecture/cryptographic-verification.md) | Crypto design, signing model, and verification chain                   |
| [Data and Identity Core](./architecture/data-identity-core.md)             | Data layer and identity architecture                                   |
| [Integration Patterns](./architecture/integration-patterns.md)             | Cross-protocol integration patterns                                    |
| [Crypto Research](./architecture/crypto-research.md)                       | Cryptographic infrastructure over blockchain — pragmatic trust systems |

## Specifications

| Document                                            | Description                                                      |
| --------------------------------------------------- | ---------------------------------------------------------------- |
| [Data Models](./specs/data-models.md)               | Core data model specification (Section 7)                        |
| [Security Framework](./specs/security-framework.md) | Security architecture, threat model, and privacy (Section 8)     |
| [Network Protocol](./specs/network-protocol.md)     | P2P network protocol specification (Section 9)                   |
| [Identity Core](./specs/identity-core.md)           | TradePass identity specification — DIDs, credentials, resolution |
| [EventCore v1.0](./specs/eventcore.md)              | Canonical data model and encoding for events                     |

## Package Documentation

| Document                                         | Description                                                    |
| ------------------------------------------------ | -------------------------------------------------------------- |
| [Package Index](./packages/README.md)            | Overview of all TypeScript packages                            |
| [@gtcx/crypto](./packages/crypto.md)             | Cryptographic primitives — noble curves, signing, Merkle trees |
| [@gtcx/domain](./packages/domain.md)             | Commodity-agnostic domain services with DI and offline support |
| [@gtcx/identity](./packages/identity.md)         | DID creation, credential management, key lifecycle             |
| [@gtcx/security](./packages/security.md)         | Auth, validation, offline credentials, audit logging           |
| [@gtcx/verification](./packages/verification.md) | Certificates, QR codes, proof bundles                          |
| [@gtcx/events](./packages/events.md)             | Type-safe event bus with offline buffering                     |
| [@gtcx/api-client](./packages/api-client.md)     | Resilient HTTP client with retry and circuit breakers          |
| [@gtcx/connectivity](./packages/connectivity.md) | Network detection and adaptive sync profiles                   |
| [@gtcx/sync](./packages/sync.md)                 | Offline-first sync engine with conflict resolution             |
| [Security Audit](./packages/security-audit.md)   | @gtcx/security principle compliance audit                      |

## Rust Documentation

| Document                               | Description                                  |
| -------------------------------------- | -------------------------------------------- |
| [Rust Core Overview](./rust/README.md) | Rust crate architecture and dependency graph |
| [gtcx-crypto](./rust/gtcx-crypto.md)   | Core cryptographic primitives crate          |

## Guides

| Document                                                    | Description                              |
| ----------------------------------------------------------- | ---------------------------------------- |
| [First Integration Tutorial](./guides/first-integration.md) | Getting started with gtcx-core (30 min)  |
| [Validator Deployment](./guides/validator-deployment.md)    | Deploying a GTCX validator node (45 min) |

## Architecture Decision Records

| ADR                                                | Title                                                |
| -------------------------------------------------- | ---------------------------------------------------- |
| [ADR-001](./adr/001-rust-for-cryptography.md)      | Use Rust for All Cryptographic Operations            |
| [ADR-002](./adr/002-zod-over-json-schema.md)       | Zod over JSON Schema for Runtime Validation          |
| [ADR-003](./adr/003-pnpm-workspace-strict-deps.md) | pnpm Workspaces with Strict Dependency Resolution    |
| [ADR-004](./adr/004-commodity-agnostic-domain.md)  | Commodity-Agnostic Domain Model                      |
| [ADR-005](./adr/005-ed25519-signing.md)            | Ed25519 over secp256k1 for Identity Signing          |
| [ADR-006](./adr/006-hash-chain-audit-trail.md)     | Event-Sourced Audit Trail with Hash Chains           |
| [ADR-007](./adr/007-offline-first-architecture.md) | Offline-First with Deterministic Conflict Resolution |
| [ADR-008](./adr/008-optional-tracing-peer-deps.md) | Optional Tracing via Peer Dependencies               |
| [ADR-009](./adr/009-typescript-rust-fallback.md)   | TypeScript Fallback When Rust Bindings Unavailable   |
| [ADR-010](./adr/010-pbft-weighted-consensus.md)    | PBFT Consensus with Weighted Stake Model             |

## Benchmarks

| Document                      | Description                                              |
| ----------------------------- | -------------------------------------------------------- |
| [Benchmarks](./BENCHMARKS.md) | Performance benchmarks for core cryptographic operations |
