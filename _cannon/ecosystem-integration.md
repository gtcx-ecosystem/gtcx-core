# Ecosystem Integration — 2-core

**Date:** 2026-03-09
**Scope:** gtcx-core — what this repo consumes, what consumes it, gaps, and the integration architecture it must enable

---

## What 2-core Consumes from the Ecosystem

Nothing. 2-core is the root of the dependency graph. It imports no `@gtcx/*` packages from other repos. All dependencies are third-party: `@noble/ed25519`, `@noble/hashes`, `zod`, `undici`, libp2p adapters (optional). This is architecturally correct and must stay this way.

---

## Confirmed Consumers of 2-core

### `3-protocols` (gtcx-protocols)

Confirmed via source imports in `protocols/*/src/*.ts` and `packages/*/src/*.ts`:

| 2-core Package     | Consumed By                                                                                                                                                          |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@gtcx/crypto`     | TradePass (`verification.ts`, `biometrics.ts`), GeoTag (`location.ts`, `chain.ts`), VaultMark (`custody.ts`), PvP (`settlement.ts`, `escrow.ts`), PANX (`oracle.ts`) |
| `@gtcx/domain`     | All six protocols — for `ILogger`, `IMetricsCollector`, `IAsyncReplayCache`, `checkReplay`, `createOfflineQueueExports`, `stableStringify`, `enforceStubGuard`       |
| `@gtcx/schemas`    | VaultMark, PvP, GCI — for `defaultRegistry`, `validateById`                                                                                                          |
| `@gtcx/validators` | All six protocols — for `assertNonEmptyString`, `assertPositiveNumber`, `assertInRange`, `invalidArg`, `GtcxError`, `assertValidW3cDid`, `assertValidDid`            |

`3-protocols` also carries its own re-exports of `@gtcx/crypto`, `@gtcx/domain`, `@gtcx/auth`, `@gtcx/audit`, `@gtcx/schemas` as local workspace packages (`packages/crypto`, `packages/domain`, etc.) — these appear to shadow or wrap the 2-core versions for protocol-internal use. This duplication is a latent divergence risk.

### `compliance-os`

Documented as consuming `@gtcx/audit-trail`, `@gtcx/types`, `@gtcx/feature-gate`, `@gtcx/agent-runtime`. Of these, only `@gtcx/types` is confirmed present in 2-core. `@gtcx/audit-trail`, `@gtcx/feature-gate`, and `@gtcx/agent-runtime` do not exist in this repo — they are either in a different repo or not yet built. This is a gap: compliance-os integration with 2-core is incomplete.

### `7-mobile` (gtcx-app)

Documented as consuming `@gtcx/crypto`, `@gtcx/types`, `@gtcx/schemas`, `@gtcx/api-client`. All four are present and implemented in 2-core. The `@gtcx/connectivity` package (USSD, satellite profiles) and `@gtcx/sync` are obvious candidates for mobile consumption but are not in the documented integration list. They should be.

### `ai-3-fiftyfour` (Next.js 15 frontend)

No confirmed 2-core consumption documented. A frontend consuming `@gtcx/types` and `@gtcx/api-client` would be standard — this should be audited and formalized.

---

## Integration Gaps: Who Should Consume 2-core But Doesn't

### `6-platforms` (AGX, CRX, SGX, Pathways)

Currently zero protocol or core imports confirmed. These backends are spec-only with no src. When implemented, they will need:

- `@gtcx/types` and `@gtcx/domain` for domain model alignment
- `@gtcx/security` for auth and audit
- `@gtcx/api-client` for service-to-service calls
- `@gtcx/events` for cross-service event coordination

### `5-intelligence` (ANISA, Cortex, PANX analytics)

Currently connected to nothing. This repo is the intended production implementation of `@gtcx/ai`. Until `5-intelligence` exports a real `traced()` implementation and 2-core wires it in, all AI observability across the ecosystem is dead.

### `9-hardware` (TapKit, VaultKit)

TapKit consumes `@gtcx/protocol-geotag` from `3-protocols`. VaultKit consumes `@gtcx/protocol-vaultmark`. Neither is documented as consuming 2-core directly — but both protocols depend on 2-core. The transitive dependency is there; direct consumption of `@gtcx/crypto-native` (the Rust NAPI bindings) would be beneficial for hardware-speed cryptographic operations on constrained devices.

---

## Package Duplication: 2-core vs 3-protocols

`3-protocols` carries its own `packages/` directory with:

- `@gtcx/crypto` (workspace local)
- `@gtcx/domain` (workspace local)
- `@gtcx/auth` (workspace local, no src — stub)
- `@gtcx/audit` (workspace local, no src — stub)
- `@gtcx/schemas` (workspace local)
- `@gtcx/validators` (workspace local)
- `@gtcx/observability` (workspace local, no src — stub)

These local packages in `3-protocols` declare dependencies on each other (`@gtcx/audit` depends on `@gtcx/crypto`, `@gtcx/domain`, `@gtcx/validators`) but have no `src/` directory — they are stubs pointing to the 2-core implementations via workspace resolution. This is a maintenance risk: any consumer of 3-protocols that imports `@gtcx/auth` or `@gtcx/audit` is importing empty stubs, not the 2-core `@gtcx/security` implementations.

**Resolution required:** Either 3-protocols' local packages should re-export from 2-core explicitly, or they should be removed in favor of direct 2-core imports.

---

## Future-Proofed Integration Architecture

### Event Contract Layer

`@gtcx/events` provides `TypedEventBus` and `IDomainEventEmitter`. `@gtcx/domain` defines `DomainEventType` and `DomainEvent<T>`. This is the foundation for async cross-service coordination. What's missing:

- A shared event contract registry (typed event schemas for cross-repo events)
- An event schema versioning policy (the `version: number` field on `DomainEvent` is unused downstream)
- A transport bridge: `TypedEventBus` is in-process only; connecting it to PANX's Kafka/NATS transports requires an adapter not yet defined

### gRPC / Service Boundaries

`@gtcx/api-client` is HTTP/REST. The ecosystem has no gRPC service boundaries defined in 2-core. As `6-platforms` comes online with multiple backends, typed gRPC service contracts should be defined in 2-core (or a new `packages/rpc` package) to avoid REST-based coupling between platforms and protocols.

### Typed Interface Contracts

`@gtcx/domain` exports `ILogger`, `IMetricsCollector`, `IAsyncReplayCache` — these are the right pattern. Every package that has cross-repo integration points should expose a typed interface (not a concrete class) in 2-core, so consumers can inject their own adapters without taking on 2-core's implementation opinions.

---

## What Must Be Built for First-Class Ecosystem Citizenship

1. **`@gtcx/audit-trail` package**: compliance-os needs it; it doesn't exist in 2-core. Build it or clarify which repo owns it.
2. **`@gtcx/feature-gate` package**: same — compliance-os dependency that is unresolved.
3. **Event transport adapter**: bridge `TypedEventBus` to PANX Kafka/NATS so domain events can propagate across service boundaries.
4. **Resolve 3-protocols package duplication**: either stub-re-export or remove. The current state creates silent integration failures.
5. **Wire `@gtcx/connectivity` and `@gtcx/sync` into mobile**: they exist and are built for this exact use case — they are not in the mobile integration list.
6. **Formalize `ai-3-fiftyfour` dependency on `@gtcx/types` and `@gtcx/api-client`**: the frontend is shipping; its 2-core dependency should be explicit, not implicit.
