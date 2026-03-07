# Crate Spec — `gtcx-edge`

**Classification:** Standard — changes follow normal PR review process.

---

## Purpose

Edge runtime for the GTCX protocol on constrained devices — mobile, IoT, and WASM targets. Provides offline verification cache, device capability profiling, resource constraint checking, and lightweight proof verification. Designed to run in environments with severe resource limits and no continuous network connectivity.

---

## Resource Constraints

| Constraint        | Limit                         |
| ----------------- | ----------------------------- |
| RAM               | < 50MB                        |
| Binary size       | < 10MB                        |
| WASM bundle       | < 2MB                         |
| Offline operation | 30+ days without network sync |

Changes that increase binary size or RAM usage must be benchmarked before merge.

---

## Public API

### Offline Verification Cache

| Type / Function             | Description                                               |
| --------------------------- | --------------------------------------------------------- |
| `VerificationCache`         | Struct: local cache of verified proofs and certificates   |
| `CacheEntry`                | Struct: cached item with expiry and Blake3 integrity hash |
| `cache_verification(entry)` | Store a verification result in the cache                  |
| `lookup_verification(id)`   | Retrieve a cached verification result                     |
| `evict_expired(cache)`      | Remove expired entries to free storage                    |

### Resource Constraint Checking

| Type / Function                            | Description                                                  |
| ------------------------------------------ | ------------------------------------------------------------ |
| `DeviceProfile`                            | Struct: device capabilities — memory, storage, compute class |
| `check_constraints(profile, requirements)` | Verify a device meets minimum requirements                   |
| `ResourceConstraintError`                  | Error: `{ resource, available, required }`                   |

### Lightweight Proof Verification

Delegates to `gtcx-crypto` for Blake3 hash verification. Full ZKP circuit verification is not available in the edge runtime — only hash commitment proofs are supported offline.

| Function                                          | Description                           |
| ------------------------------------------------- | ------------------------------------- |
| `verify_hash_commitment(commitment, value, salt)` | Verify a Blake3 hash commitment       |
| `verify_chain_entry(entry, prev_hash)`            | Verify a hash-chained audit log entry |

### Errors

| Type        | Description                                                               |
| ----------- | ------------------------------------------------------------------------- |
| `EdgeError` | Enum: `ResourceConstraint`, `CacheExpired`, `InvalidProof`, `StorageFull` |

---

## Dependencies

| Crate                  | Role                                                      |
| ---------------------- | --------------------------------------------------------- |
| `gtcx-crypto` (local)  | Blake3 hashing for cache integrity and proof verification |
| `serde` + `serde_json` | Cache serialization                                       |
| `tracing`              | Observability (low-overhead in edge environments)         |
| `thiserror`            | Error types                                               |

---

## Offline Operation Model

The edge runtime is designed for the GPRS field agent scenario:

- Agent syncs when online — caches verified credentials and proofs locally
- Agent operates offline for up to 30 days using cached verifications
- Cache integrity is maintained via Blake3 hash chains — tamper detection without network
- On next sync, the sync engine (`@gtcx/sync` or `gtcx-node`) reconciles the local cache

---

## Non-Goals

- Does not implement full ZKP circuit verification — too computationally expensive for edge
- Does not manage network sync — `@gtcx/sync` handles the sync cycle
- Does not expose NAPI bindings directly — embedded via the mobile and device SDK layers
- Does not target server environments — use the full Rust stack for server-side verification

---

## Implementation

`rust/gtcx-edge/src/`

---

## Reference

- [`_sop/2-docs/5-specs/4-backend/packages/rust/gtcx-crypto.md`](./gtcx-crypto.md) — hash operations
- [`_sop/2-docs/5-specs/4-backend/packages/connectivity.md`](../connectivity.md) — connectivity detection
- [`_sop/2-docs/5-specs/4-backend/packages/sync.md`](../sync.md) — sync engine
- [`_sop/2-docs/5-specs/4-backend/core-spec.md`](../../core-spec.md) — system overview and operational SLOs
