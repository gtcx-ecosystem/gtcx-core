# Implementation Truth — 2-core

**Date:** 2026-03-09
**Scope:** gtcx-core — full package inventory, implementation status, and readiness assessment

---

## What This Repo Is

The lowest-level dependency in the GTCX ecosystem. No upstream GTCX dependencies — everything here is consumed by all other repos. Contains 18 TypeScript packages and 6 Rust crates across cryptographic primitives, type definitions, domain models, verification infrastructure, identity management, and the offline-first connectivity stack.

182 commits. Production-shaped code — not scaffolding.

---

## Package Inventory and Status

### Fully Implemented — Usable Today

**`@gtcx/crypto`** (`packages/crypto`)
Full Ed25519 key generation, signing, verification, SHA-256/512 hashing, Merkle proofs, hash commitments, ZKP type system (Schnorr/Bulletproofs/Groth16/PLONK defined as enum variants). Traced variants of all operations via `@gtcx/ai`. The ZKP system exposes a proper `ZkProver`/`ZkVerifier` interface but only the hash-commitment prover is functional — production ZK backends are not wired. Usable for signatures and hashing now.

**`@gtcx/identity`** (`packages/identity`)
DID creation and parsing (`did:gtcx:` method), DID document management, HTTP and in-memory resolver adapters, credential lifecycle. Full `createIdentity`, `createEnhancedIdentity`, multi-key (Ed25519 + Secp256k1) derivation. Revocation interface defined, not backed. Ready for use.

**`@gtcx/security`** (`packages/security`)
Four implemented modules: `validation/` (Zod input sanitization), `auth/` (session tokens, permissions), `offline/` (SecureStorageBase, CredentialCache, tamper detection), `audit/` (security event logging). Offline credential cache has working logic. No JWT library — callers sign tokens themselves.

**`@gtcx/verification`** (`packages/verification`)
Certificate data generation (unsigned — platform provides signing), QR code data structures, proof bundle assembly. Commodity-agnostic by design: templateId + commodityType as strings. Produces `dataToSign`; mobile/server code does the actual signing. Fully usable.

**`@gtcx/types`** (`packages/types`)
Core TypeScript interfaces: `DigitalIdentity`, `EnhancedIdentity`, `AssetLot`, `AssetLotStatus`, models for User, Lot, Permit, Site, plus protocol types and API response types. Version 1.0.0. Load-bearing types for the entire stack.

**`@gtcx/domain`** (`packages/domain`)
Commodity-agnostic domain layer: `AssetLot` lifecycle and status transitions, offline queue factory (`createOfflineQueueExports`), typed domain event definitions (`DomainEventType`), metrics interfaces (`IMetricsCollector`, `ILogger`), replay-attack cache (`checkReplay`), schema migration framework, API versioning with changelog and `checkVersionCompatibility`. Twelve architectural principles documented in the package header and evidenced in the actual code. The most complete foundational package in this repo.

**`@gtcx/services`** (`packages/services`)
Three business services: `AssetLotRegistrationService`, `TradingService` (market pricing, trade execution), `UnifiedComplianceService`. All use dependency injection. Functional but backed by in-memory adapters — no database persistence wired.

**`@gtcx/events`** (`packages/events`)
`TypedEventBus` implementing `IDomainEventEmitter`. Offline buffer, event history, typed subscriptions, error isolation between handlers, `goOnline()` flush. Fully implemented.

**`@gtcx/connectivity`** (`packages/connectivity`)
Six network profiles: `offline`, `ussd-only`, `satellite`, `edge`, `degraded`, `standard`. Classification by bandwidth (Kbps) and latency (ms). USSD and satellite tiers are explicitly modeled — a deliberate Africa-first design choice. Implemented and documented.

**`@gtcx/api-client`** (`packages/api-client`)
Resilient HTTP client: exponential backoff retry, circuit breaker, offline queue, mTLS options, request signing interface. Typed `ApiErrorCode` and `ApiErrorCategory`. Uses `undici`. Built for hostile-network conditions.

**`@gtcx/sync`** (`packages/sync`)
Offline-first sync engine: `last-write-wins`, `highest-version`, and merge conflict resolution strategies. Batch chunking, retry with delay. `ISyncEngine` interface with real logic, not types-only.

**`@gtcx/workproof`** (`packages/workproof`)
TradeCV/WorkProof v2.1. W3C VC-based employment attestation layer. Subdirectories: `evidence/`, `predicates/`, `workproof/`, `tradecv/`, `ai/`, `disclosure/`, `offline/`, `trust/`. The core schemas and types for workproof and tradecv are solid. AI validation hooks present but stub-backed. Offline queue wired through `@gtcx/domain`. Predicate seeds cover identity, compliance, asset, location, financial, certification, and composite domains.

**`@gtcx/schemas`** (`packages/schemas`)
Core12 compliance framework: 12 domains, 67 controls, harmonizing 120+ global standards. Exports `schema` and `domains` from the Core12 module. Future slots for TradePass, GeoTag, GCI, VaultMark schemas are commented stubs — not implemented.

**`@gtcx/logging`** (`packages/logging`)
Structured logger. Minimal but consistent interface.

**`@gtcx/utils`** (`packages/utils`)
Single `index.ts`. Minimal.

### Partially Implemented / Stub-Backed

**`@gtcx/ai`** (`packages/ai`)
Stub only. `traced()` and `withTrace()` are no-ops — they return the wrapped function without modification. The interface is well-defined (`OperationLog`, `TracedOptions`). Documented as a stub: "full version lives in gtcx-intelligence." All `traced*` calls across `@gtcx/crypto` and `@gtcx/domain` are silent pass-throughs in production.

**`@gtcx/network`** (`packages/network`)
libp2p transport adapter with peer discovery and pub/sub topics. The libp2p runtime is loaded dynamically — if the actual `@libp2p/*` packages are absent, this throws `ConfigurationError` at runtime. The adapter pattern is well-designed; the deployment wiring is environment-dependent.

**`@gtcx/crypto-native`** (`packages/crypto-native`)
NAPI-RS binding loader. Single `index.ts` that dynamically requires the compiled `.node` binary from `gtcx-node`. Whether the binary is built and distributed as part of the package is not verifiable from source alone.

---

## Rust Crates (6)

| Crate            | Status                                                                                |
| ---------------- | ------------------------------------------------------------------------------------- |
| `gtcx-crypto`    | Ed25519, SHA-256/512, key derivation — implemented                                    |
| `gtcx-zkp`       | Hash-commitment ZKP — implemented                                                     |
| `gtcx-consensus` | Weighted PBFT — implemented                                                           |
| `gtcx-network`   | P2P networking types, topic pub/sub — implemented                                     |
| `gtcx-edge`      | Offline verification cache, device profiles (<50MB RAM, 30-day offline) — implemented |
| `gtcx-node`      | NAPI-RS bindings for `@gtcx/crypto-native` — implemented                              |

---

## Known Gaps

- ZKP production backends: Groth16 and PLONK interface exists, only hash-commitment proof is functional
- `@gtcx/ai`: no-op stub; AI-native observability is infrastructure-only until wired to `5-intelligence`
- `@gtcx/schemas`: Core12 done; protocol-specific schemas (TradePass, GeoTag, GCI, VaultMark) are placeholder comments
- `@gtcx/identity` revocation: interface defined, no revocation registry backend
- `@gtcx/services`: functional but in-memory only — no database persistence adapters

---

## Roadmap Position

2-core is the foundation layer and at 182 commits is substantially production-ready at the primitive level. The remaining work falls into four categories:

1. **AI observability**: connect `@gtcx/ai` stub to real traced implementation in `5-intelligence`
2. **Protocol schemas**: fill `@gtcx/schemas` with TradePass, GeoTag, GCI, VaultMark Zod schemas (aligned with `3-protocols` SPECs)
3. **Native binary distribution**: validate `@gtcx/crypto-native` `.node` delivery for mobile and edge targets
4. **ZKP production backends**: Groth16 for selective disclosure (TradePass), Bulletproofs for range proofs (PvP)

The core is ready to be consumed. Gaps are in advanced cryptographic backends and AI observability — not in the basic protocol primitives that Q2 requires.
