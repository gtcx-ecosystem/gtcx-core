# Component Inventory

This document lists the canonical packages and crates and their responsibilities.

## TypeScript Packages

- `@gtcx/crypto` — hashing, signing, proofs, and key utilities
- `@gtcx/crypto-native` — native bindings loader for Rust crypto
- `@gtcx/identity` — DID creation, credentials, and identity flows
- `@gtcx/verification` — certificate verification and proof bundles
- `@gtcx/security` — auth, validation, audit, offline credentials
- `@gtcx/domain` — domain models, migrations, and core business logic
- `@gtcx/events` — event bus with offline buffering
- `@gtcx/network` — P2P transport abstractions and mesh support
- `@gtcx/connectivity` — connectivity detection and policies
- `@gtcx/sync` — offline-first sync engine
- `@gtcx/api-client` — HTTP client with retry, signing, and mTLS
- `@gtcx/services` — service-layer adapters and API surface
- `@gtcx/utils` — shared helpers and types
- `@gtcx/types` — shared type contracts
- `@gtcx/ai` — AI integration helpers

## Rust Crates

- `rust/gtcx-crypto` — cryptographic primitives
- `rust/gtcx-zkp` — Groth16 + Bulletproofs + Schnorr proofs
- `rust/gtcx-node` — native bindings for JS integration
- `rust/gtcx-network` — networking primitives and transport utilities
- `rust/gtcx-consensus` — consensus engine foundations
- `rust/gtcx-edge` — edge execution utilities

## Supporting Infrastructure

- `tools/` — automation and quality gates
- `tests/integration/` — cross-package integration tests
- `quality/` — metrics, baselines, and evidence inputs
- `benchmarks/` — performance budgets and benchmark results

## References

- `docs/packages/README.md`
- `docs/rust/README.md`
