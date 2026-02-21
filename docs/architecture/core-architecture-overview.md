# GTCX Core -- Architecture Overview

| Field       | Value                                                                                                  |
| ----------- | ------------------------------------------------------------------------------------------------------ |
| Layer       | Foundation                                                                                             |
| Depends on  | Nothing                                                                                                |
| Consumed by | All 10 other code repos                                                                                |
| Related     | [Shared Infrastructure](./shared-infrastructure.md), [Integration Patterns](./integration-patterns.md) |

## Role in the Ecosystem

GTCX Core is the shared foundation for the entire ecosystem. It provides the cryptographic primitives, TypeScript type definitions, Zod validation schemas, domain models, and security utilities that every other repository imports. Because it sits at the bottom of the dependency graph, it depends on nothing else -- changes here propagate upward through the entire stack.

The design philosophy is strict modularity with zero commodity-specific code. Core provides the abstract machinery (identity, verification, custody, compliance scoring) while downstream repos inject commodity-specific configuration. A new commodity type (gold, coffee, cobalt, lithium) is added via configuration registration, not code changes in core. See [Shared Infrastructure](./shared-infrastructure.md) Section 7 for the extension model.

## Package Composition

All packages are published under the `@gtcx/` scope and managed in a pnpm workspace.

| Package            | Responsibility                                                                      |
| ------------------ | ----------------------------------------------------------------------------------- |
| @gtcx/types        | Shared TypeScript type definitions for the entire ecosystem                         |
| @gtcx/domain       | Foundational domain types, schemas, events, metrics, migrations, offline queue      |
| @gtcx/services     | Application services -- registration, trading, compliance (depends on domain)       |
| @gtcx/schemas      | Zod validation schemas (Core12 framework) with runtime validation at every boundary |
| @gtcx/crypto       | Cryptographic bindings wrapping the Rust foundation (Ed25519, SHA-256, Blake3, ZKP) |
| @gtcx/security     | Input validation, authentication, RBAC, offline integrity, audit logging            |
| @gtcx/identity     | DID/VC identity primitives -- creation, resolution, key rotation, offline cache     |
| @gtcx/verification | Verification logic, certificate issuance, QR codes, proof bundle generation         |
| @gtcx/ai           | AI integration stubs -- tracing, category logging, no-op implementations            |
| @gtcx/logging      | Structured logging utilities                                                        |
| @gtcx/utils        | Shared utilities consumed across the ecosystem                                      |
| @gtcx/events       | Typed event bus with offline buffering and replay                                   |
| @gtcx/connectivity | Network status detection and connectivity profiles                                  |
| @gtcx/sync         | Offline-first sync engine with conflict resolution                                  |
| @gtcx/api-client   | Resilient API client with retry and timeouts                                        |
| @gtcx/network      | P2P networking primitives for validator mesh                                        |
| config/eslint      | Shared ESLint configuration for consistent code style                               |
| config/typescript  | Shared TypeScript configuration (strict mode, path aliases)                         |
| config/tailwind    | Shared Tailwind configuration (design tokens)                                       |

### Internal Dependency Order

```
@gtcx/crypto (no hard internal deps; @gtcx/ai and @gtcx/types are optional peerDependencies)
    ├── @gtcx/identity (DID/VC, key rotation — depends on @gtcx/crypto, @gtcx/types)
    ├── @gtcx/security (auth, RBAC, validation — depends on @gtcx/crypto)
    └── @gtcx/verification (proof bundles, certs — depends on @gtcx/crypto, @gtcx/types; @gtcx/ai is an optional peer)

@gtcx/domain (foundational types, schemas, events, metrics)
    └── @gtcx/services (registration, trading, compliance)

@gtcx/schemas (Core12 Zod validation)
@gtcx/types (shared TS types)
@gtcx/ai (AI integration stubs)
@gtcx/logging (structured logging)
@gtcx/utils (standalone utilities, no internal deps)
@gtcx/events (typed event bus, offline buffering)
@gtcx/connectivity (network status detection)
@gtcx/sync (offline-first sync engine)
@gtcx/api-client (resilient API client)
@gtcx/network (p2p networking primitives)
config/* (eslint, typescript, tailwind)
```

No circular dependencies are permitted, enforced by build-time checks. See [Shared Infrastructure](./shared-infrastructure.md) Section 2 for the full dependency graph.

## Rust Cryptographic Foundation

Performance-critical cryptographic operations are implemented in Rust and exposed to TypeScript via NAPI-RS (Node.js) and WASM (browser/React Native).

| Operation      | Pure TypeScript | Rust (NAPI-RS) | Speedup |
| -------------- | --------------- | -------------- | ------- |
| Ed25519 sign   | ~2ms            | ~0.13ms        | 15x     |
| SHA-256 hash   | ~0.5ms          | ~0.004ms       | 120x    |
| ZKP generation | ~500ms          | ~8ms           | 60x     |

Six Rust crates compose the foundation: `gtcx-crypto` (signing and hashing), `gtcx-zkp` (Schnorr proofs, Bulletproofs, Groth16), `gtcx-consensus` (PBFT engine), `gtcx-network` (libp2p mesh), `gtcx-edge` (edge device runtime), and `gtcx-node` (full validator). TypeScript packages fall back to pure-JS implementations when native bindings are unavailable.

**Maturity note**: TypeScript ZKP flows still use hash-commitment placeholders, while `rust/gtcx-zkp` now includes Groth16 GCI threshold, asset ownership, and location region circuits as the first real backends. NAPI wiring is pending. libp2p transport is scaffolded in TypeScript with runtime validation pending (see `packages/network/src/libp2p.ts`). The ZKP performance numbers are targets for the planned circuit backend, not current measurements. Circuit selection and performance budgets are defined in `docs/architecture/zkp-circuit-plan.md`.

For algorithm selection rationale and blockchain-alternative analysis, see [Crypto Research](./crypto-research.md). For the signing and proof model, see [Cryptographic Verification](./cryptographic-verification.md).

## How Downstream Repos Consume Core

Downstream repos import `@gtcx/*` packages as versioned dependencies from the registry. The integration surface is defined by typed exports and Zod schemas -- every boundary is validated at runtime.

Key integration patterns:

- **Protocol repos** (gtcx-protocols) import `@gtcx/crypto` for signing, `@gtcx/identity` for DID resolution, and `@gtcx/schemas` for data validation.
- **Application repos** (gtcx-app) import `@gtcx/domain` for business logic, `@gtcx/security` for auth and validation, and `@gtcx/identity` for credential management.
- **Platform repos** (gtcx-platforms) import `@gtcx/verification` for proof validation, `@gtcx/schemas` for compliance checks, and `@gtcx/domain` for asset services.
- **All repos** import `@gtcx/types` for shared type definitions and `@gtcx/utils` for common utilities.

Cross-protocol communication patterns, including the event-driven workflow engine and saga-based compensation, are detailed in [Integration Patterns](./integration-patterns.md).

## Key Design Decisions

| Decision                  | Rationale                                                                                                                                                  |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Rust for cryptography     | Performance (15x-120x speedup) combined with memory safety guarantees; no GC pauses during signing operations                                              |
| Zod over JSON Schema      | Runtime validation with automatic TypeScript type inference; single source of truth for types and validation                                               |
| pnpm workspace            | Strict dependency resolution prevents phantom dependencies; deterministic installs across all environments                                                 |
| Commodity-agnostic design | `commodityType: string` rather than gold-specific models; new commodities (coffee, cobalt, lithium) added via configuration registration, not code changes |

## Deep Dives

- [Shared Infrastructure](./shared-infrastructure.md) -- Package dependency graph, architecture layers, offline-first design, and security model
- [Cryptographic Verification](./cryptographic-verification.md) -- Signing and proof model rationale
- [Data and Identity Core](./data-identity-core.md) -- DID documents, credential lifecycle, and identity resolution
- [Integration Patterns](./integration-patterns.md) -- How downstream repos consume core packages and cross-protocol workflows
- [Crypto Research](./crypto-research.md) -- Algorithm selection and blockchain-alternative rationale
- [Security Hardening (Section 8.13)](../../docs/specs/security-framework.md#813-security-hardening) -- Penetration testing, dependency security, secrets management, zero-trust checklist
