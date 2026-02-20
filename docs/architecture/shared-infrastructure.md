# Shared Infrastructure Architecture

## Document Control

| Attribute   | Value                                                                                                                             |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Scope**   | gtcx-core architecture                                                                                                            |
| **Status**  | Publication-Ready                                                                                                                 |
| **Related** | [Package Index](../packages/README.md), [Integration Patterns](./integration-patterns.md), [Data Models](../specs/data-models.md) |

---

## 1. Overview

The shared infrastructure layer provides the foundational packages that all GTCX protocols and platforms depend on. Rather than each protocol implementing its own identity, cryptography, security, and data handling, these concerns are centralized in a set of composable TypeScript packages under the `@gtcx/` namespace.

### 1.1 Design Principles

| Principle                 | Application                                                                 |
| ------------------------- | --------------------------------------------------------------------------- |
| **P1: Package Structure** | Each package has a single responsibility with clear module boundaries       |
| **P2: Type Safety**       | Zod runtime validation at all package boundaries; zero `any` types          |
| **P3: Modularity**        | Packages are independently importable; no circular dependencies             |
| **P4: Composability**     | Dependency injection throughout; pluggable storage, transport, and handlers |
| **P6: Asset Abstraction** | Zero commodity-specific code in any shared package                          |
| **P8: Offline-First**     | Every package supports 72-hour offline operation                            |
| **P9: Security**          | Input validation, sanitization, and audit logging at every boundary         |

---

## 2. Package Architecture

### 2.1 Package Dependency Graph

```
@gtcx/crypto           (no hard internal deps; @gtcx/ai and @gtcx/types are optional peerDependencies)
    ├── @gtcx/identity      (depends on @gtcx/crypto, @gtcx/types)
    ├── @gtcx/security      (depends on @gtcx/crypto)
    └── @gtcx/verification  (depends on @gtcx/crypto, @gtcx/types; @gtcx/ai is an optional peerDependency)

@gtcx/domain           (foundational types, schemas, events, metrics)
    ├── @gtcx/services  (registration, trading, compliance)
    └── @gtcx/events    (typed event bus, offline buffering)

@gtcx/schemas          (Core12 compliance framework)
@gtcx/types            (shared TypeScript types)
@gtcx/ai               (AI integration stubs)
@gtcx/logging          (structured logging)
@gtcx/utils            (standalone utilities)
@gtcx/connectivity     (network status detection, connectivity profiles)
@gtcx/sync             (offline-first sync engine — interface stub)
@gtcx/api-client       (resilient API client)
```

### 2.2 Package Inventory

| Package                                             | Responsibility                                           | Key Exports                                                                 | Size          |
| --------------------------------------------------- | -------------------------------------------------------- | --------------------------------------------------------------------------- | ------------- |
| [`@gtcx/crypto`](../packages/crypto.md)             | Signing, hashing, key management                         | `sign()`, `verify()`, `hash()`, `generateKeyPair()`                         | Foundation    |
| [`@gtcx/identity`](../packages/identity.md)         | DID creation, resolution, key management                 | `createIdentity()`, `resolveDID()`, `rotateKeys()`                          | Core          |
| [`@gtcx/security`](../packages/security.md)         | Validation, auth, offline security, audit                | `sanitize()`, `hasPermission()`, `SecureStorage`                            | Core          |
| [`@gtcx/verification`](../packages/verification.md) | Certificates, QR codes, proof bundles                    | `issueCertificate()`, `generateQR()`, `bundleProof()`                       | Core          |
| [`@gtcx/domain`](../packages/domain.md)             | Foundational types, schemas, events, metrics, migrations | Types, Zod schemas, event bus, offline queue                                | Domain        |
| [`@gtcx/services`](../packages/services.md)         | Application services (registration, trading, compliance) | `AssetLotRegistrationService`, `TradingService`, `UnifiedComplianceService` | Services      |
| `@gtcx/schemas`                                     | Core12 compliance framework                              | `getDomain()`, `getControl()`, 12-domain schemas                            | Validation    |
| `@gtcx/ai`                                          | AI integration stubs (tracing, logging)                  | `traced()`, `withTrace()`, `createCategoryLogger()`                         | AI            |
| `@gtcx/logging`                                     | Structured logging utilities                             | Logger factories, formatters                                                | Observability |
| `@gtcx/events`                                      | Typed event bus, offline buffering, replay               | `TypedEventBus`, `OfflineEventBuffer`                                       | Communication |
| `@gtcx/connectivity`                                | Network status detection, connectivity profiles          | `ConnectivityDetector`, `classifyProfile()`                                 | Transport     |
| `@gtcx/sync` _(stub)_                               | Offline-first sync, conflict resolution                  | `ISyncEngine`, `createSyncEngine()`                                         | Sync          |
| `@gtcx/api-client`                                  | Resilient API client with retry                          | `IApiClient`, `createApiClient()`                                           | Client        |

### 2.3 Dependency Rules

1. `@gtcx/crypto` has **zero hard internal dependencies** — `@gtcx/ai` (for traced wrappers) and `@gtcx/types` are optional peerDependencies; external deps are `@noble/curves` and `@noble/hashes`
2. `@gtcx/identity` depends on `@gtcx/crypto` and `@gtcx/types`; `@gtcx/security` depends on `@gtcx/crypto`; `@gtcx/verification` depends on `@gtcx/crypto` and `@gtcx/types` (hard), with `@gtcx/ai` as an optional peerDependency
3. `@gtcx/domain` provides foundational types, schemas, and events — no service-level logic
4. `@gtcx/services` depends on `@gtcx/domain` and provides application-level business logic
5. **No circular dependencies** — enforced by build-time checks

---

## 3. Rust Foundation Layer

Performance-critical operations are implemented in Rust and exposed to TypeScript via NAPI-RS (Node.js) and WASM (browser/React Native).

### 3.1 Rust Crate Inventory

| Crate            | Responsibility                        | TypeScript Binding                         |
| ---------------- | ------------------------------------- | ------------------------------------------ |
| `gtcx-crypto`    | Ed25519, secp256k1, SHA-256, Blake3   | `@gtcx/crypto` calls into this via NAPI-RS |
| `gtcx-zkp`       | Schnorr proofs, Bulletproofs, Groth16 | Used by GCI selective disclosure           |
| `gtcx-consensus` | PBFT consensus engine                 | Used by PANX validators                    |
| `gtcx-network`   | libp2p mesh networking                | Used by edge nodes                         |
| `gtcx-edge`      | Edge device runtime                   | Standalone binary                          |
| `gtcx-node`      | Full validator node                   | Standalone binary                          |

### 3.2 Performance Targets

| Operation      | Rust (NAPI-RS) | Pure TypeScript | Speedup |
| -------------- | -------------- | --------------- | ------- |
| Ed25519 sign   | 45 us          | 2.1 ms          | 47x     |
| Ed25519 verify | 90 us          | 4.2 ms          | 47x     |
| SHA-256 (1 KB) | 3 us           | 45 us           | 15x     |
| Blake3 (1 KB)  | 1.5 us         | 180 us          | 120x    |
| Schnorr proof  | 0.8 ms         | 12 ms           | 15x     |

The TypeScript packages fall back to pure-JS implementations when NAPI-RS bindings are not available (browser, React Native without WASM).

---

## 4. Offline-First Architecture

### 4.1 Offline Capability by Package

Every shared package is designed around the constraint that 40% of target users have intermittent or no connectivity.

| Package              | Offline Behavior                                       | Max Offline Duration    |
| -------------------- | ------------------------------------------------------ | ----------------------- |
| `@gtcx/crypto`       | Fully offline — no network dependency                  | Unlimited               |
| `@gtcx/identity`     | Cached credentials with configurable TTL               | 72 hours                |
| `@gtcx/security`     | `SecureStorage` + `CredentialCache` + tamper detection | 72 hours                |
| `@gtcx/verification` | Certificates generated locally, synced later           | 72 hours                |
| `@gtcx/domain`       | `OfflineQueue` with conflict resolution strategies     | 72 hours (configurable) |
| `@gtcx/services`     | All services support offline operation via DI          | 72 hours                |

### 4.2 Sync Strategy by Connectivity Profile

| Profile     | Bandwidth                 | Sync Behavior                                               |
| ----------- | ------------------------- | ----------------------------------------------------------- |
| `offline`   | 0                         | Queue all operations locally                                |
| `ussd-only` | 140 bytes                 | USSD service codes for critical operations only             |
| `edge`      | <200 Kbps                 | Batch sync every 30s, high-priority events only, compressed |
| `degraded`  | 1-5 Mbps                  | Batch sync every 15s, medium-priority threshold             |
| `standard`  | >5 Mbps                   | Real-time sync, full payload                                |
| `satellite` | 512 Kbps / 500ms+ latency | Batch sync with larger windows, latency-tolerant            |

---

## 5. Security Architecture

### 5.1 Trust Boundaries

```
┌─────────────────────────────────────────────────────────┐
│  USER DEVICE (untrusted)                                │
│  ┌─────────────────────────────────────────────────┐    │
│  │  @gtcx/security — validates ALL input here      │    │
│  │  Zod schemas, sanitization, rate limiting       │    │
│  └─────────────────────────┬───────────────────────┘    │
│                            │ validated data only          │
│  ┌─────────────────────────▼───────────────────────┐    │
│  │  @gtcx/crypto — signs with device key           │    │
│  │  @gtcx/identity — resolves DIDs                 │    │
│  │  @gtcx/events — emits typed, signed events      │    │
│  └─────────────────────────┬───────────────────────┘    │
│                            │ signed payloads              │
└────────────────────────────┼────────────────────────────┘
                             │
                    NETWORK BOUNDARY
                             │
┌────────────────────────────▼────────────────────────────┐
│  VALIDATOR NODE (trusted after consensus)               │
│  Re-validates signatures, re-checks schemas,            │
│  verifies TradePass credential status                   │
└─────────────────────────────────────────────────────────┘
```

### 5.2 Security Layers

| Layer                 | Package            | Controls                                                          |
| --------------------- | ------------------ | ----------------------------------------------------------------- |
| Input validation      | `@gtcx/security`   | 30+ Zod schemas, HTML stripping, length limits, prototype removal |
| Authentication        | `@gtcx/security`   | JWT tokens, session management, MFA, 6-role RBAC                  |
| Cryptographic signing | `@gtcx/crypto`     | Ed25519 signatures on all outbound data                           |
| Offline integrity     | `@gtcx/security`   | `SecureStorage` (encrypted), `TamperDetection` (hash chains)      |
| Audit trail           | `@gtcx/security`   | 40+ security event types, batched logging with PII redaction      |
| Transport security    | `@gtcx/api-client` | TLS 1.3, certificate pinning, request signing                     |

See [Security Framework](../specs/security-framework.md) for the complete specification including key hierarchy, ZKP protocols, and threat model.

---

## 6. Data Flow

### 6.1 Inbound (Device to Network)

```
User action
    │
    ▼
@gtcx/security validates input (Zod schema)
    │
    ▼
@gtcx/domain processes business logic
    │
    ▼
@gtcx/crypto signs the result
    │
    ▼
@gtcx/events emits typed event
    │
    ├── ONLINE:  @gtcx/api-client sends immediately
    └── OFFLINE: @gtcx/events queues in OfflineEventQueue
                     │
                     └── @gtcx/sync uploads on reconnect
```

### 6.2 Outbound (Network to Device)

```
Server push / poll response
    │
    ▼
@gtcx/api-client receives
    │
    ▼
@gtcx/crypto verifies server signature
    │
    ▼
@gtcx/security validates schema
    │
    ▼
@gtcx/sync merges with local state (conflict resolution)
    │
    ▼
@gtcx/events emits local event for UI
```

---

## 7. Multi-Commodity Support

The shared infrastructure is commodity-agnostic by design. Commodity-specific behavior is injected via configuration, not code.

### 7.1 Extension Points

| Extension Point           | Mechanism                               | Example                                                                        |
| ------------------------- | --------------------------------------- | ------------------------------------------------------------------------------ |
| Asset type registration   | `AssetRegistry.register(config)`        | Gold, coffee, cobalt, timber configs                                           |
| Verification requirements | `AssetTypeConfig.verifications`         | Gold requires `origin + weight + purity + custody`                             |
| GCI weight calibration    | `AssetTypeConfig.gciWeights`            | Gold: 30% environmental, 25% safety, 20% financial, 10% social, 15% regulatory |
| Custody state machine     | `AssetTypeConfig.custodyStates`         | Gold: origin → producer → aggregator → vault → refiner → final                 |
| Jurisdiction overrides    | `AssetTypeConfig.jurisdictionOverrides` | Ghana requires PMMC clearance; DRC requires child labor inspection             |

### 7.2 Adding a New Commodity

To add a new commodity type (e.g., lithium), implement `AssetTypeConfig` and register it:

```typescript
import { AssetRegistry, AssetTypeConfig } from '@gtcx/schemas';

const LithiumConfig: AssetTypeConfig = {
  typeId: 'lithium',
  displayName: 'Lithium',
  category: 'critical_minerals',
  primaryUnit: 'kg',
  requiredAttributes: [
    { name: 'weightKg', type: 'number', validation: { min: 0.1 }, description: 'Weight in kg' },
    {
      name: 'grade',
      type: 'enum',
      validation: { values: ['battery', 'technical', 'chemical'] },
      description: 'Lithium grade',
    },
  ],
  // ... (see Data Models spec Section 7.4 for full schema)
};

AssetRegistry.register(LithiumConfig);
```

No code changes required in any shared package. The new commodity type is immediately usable across all protocols.

---

## 8. Related Documents

- [Package Index](../packages/README.md) — Full package listing with dependency graph and development commands
- [Integration Patterns](./integration-patterns.md) — How protocols compose using shared infrastructure
- [Data Models](../specs/data-models.md) — Complete schema definitions including asset registry
- [Security Framework](../specs/security-framework.md) — Cryptographic standards and threat model
- [Security Audit](../packages/security-audit.md) — Principle compliance matrix for `@gtcx/security`
- [Rust Foundation](../rust/README.md) — Rust crate architecture and build configuration
