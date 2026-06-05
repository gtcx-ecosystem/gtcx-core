---
title: 'Protocols Namespace Collision Assessment 2026 05 12'
status: 'current'
date: '2026-05-17'
owner: 'quality-evidence-lead'
role: 'quality-evidence-lead'
tier: 'critical'
tags: ['docs', 'audit']
review_cycle: 'quarterly'
---

# Namespace Collision Assessment: gtcx-core vs. gtcx-protocols

> **Date:** 2026-05-12
> **Status:** Assessment Complete — Pending Decision
> **Scope:** `@gtcx/crypto`, `@gtcx/domain`, `@gtcx/schemas`
> **Auditor:** Kimi Code CLI
> **Method:** Source audit of gtcx-core packages + capability gap analysis against protocols claim

---

## 1. Executive Summary

**Status: RESOLVED — 2026-05-12**

Protocols team has renamed their packages to `@gtcx/protocols-*`. gtcx-core retains permanent ownership of `@gtcx/crypto`, `@gtcx/domain`, `@gtcx/schemas`. No immediate action required.

Three packages collided on npm between `gtcx-core` (v2.0.0) and `gtcx-protocols` (v0.1.0):

| Package         | Core Version | Protocols Version | Collision Severity                                  |
| --------------- | ------------ | ----------------- | --------------------------------------------------- |
| `@gtcx/crypto`  | 2.0.0        | 0.1.0             | **Critical** — 87 exports, foundation primitive     |
| `@gtcx/domain`  | 2.0.0        | 0.1.0             | **Critical** — 158 exports, domain model foundation |
| `@gtcx/schemas` | 2.0.0        | 0.1.0             | **High** — 20 exports, compliance framework         |

**These are not forks.** They are different codebases with different capabilities. Core's versions are production-hardened (97.86% stmt coverage on crypto, 88%+ on domain). Protocols' versions contain capabilities core lacks.

**Recommended path:** **Hybrid — upstream foundational gaps, keep protocol-specific capabilities separate.** Rename protocols packages to `@gtcx/protocols-*` for permanent namespace isolation. Do not attempt to merge the codebases — they serve different architectural layers.

---

## 2. Current State: gtcx-core Packages

### 2.1 `@gtcx/crypto` v2.0.0

| Capability                               | Status              | Evidence                                                                                     |
| ---------------------------------------- | ------------------- | -------------------------------------------------------------------------------------------- |
| Ed25519 signing                          | Production          | `signing.ts` — `sign`, `verify`, `batchVerify`                                               |
| P256 (ECDSA) FIPS signing                | Production          | `fips-backend.ts` — routes to `node:crypto` / OpenSSL FIPS (CMVP #4816)                      |
| SHA-256 / SHA-512 / BLAKE3               | Production          | `hashing.ts` + native NAPI (`blake3Hash` in `native-loader.ts`, not publicly exported)       |
| Groth16 ZKP                              | Production (native) | `rust/gtcx-zkp/03-platform/src/groth16.rs` — asset ownership, GCI threshold, location region |
| Bulletproofs ZKP                         | Production (native) | `rust/gtcx-zkp/03-platform/src/bulletproofs.rs` — amount range proofs                        |
| Schnorr ZKP                              | Production (native) | `rust/gtcx-zkp/03-platform/src/schnorr.rs` — identity attribute proofs                       |
| Merkle trees / inclusion proofs          | Production          | `proofs.ts` — `buildMerkleTree`, `verifyMerkleProof`                                         |
| Hash commitments                         | Production          | `hashing.ts` — `createCommitment`, `verifyCommitment`                                        |
| Key generation / derivation / validation | Production          | `keys.ts` — `generateKeyPair`, `derivePublicKey`, `isValidPublicKey`                         |
| Key ID generation (`did:gtcx:`)          | Production          | `keys.ts` — `generateKeyId`                                                                  |
| FIPS mode runtime flag                   | Production          | `fips.ts` — `isFipsMode()`, backend routing                                                  |
| Native NAPI bindings                     | Beta                | `native-loader.ts` — Groth16, Bulletproofs, Schnorr via `@gtcx/crypto-native`                |
| AI-native tracing wrappers               | Production          | `traced*.ts` — `tracedSign`, `tracedHash256`, etc.                                           |
| **Post-quantum (ML-DSA-65)**             | **Absent**          | No ML-DSA, no hybrid signing                                                                 |
| **Encryption-at-rest**                   | **Absent**          | No symmetric encryption, no envelope encryption                                              |
| **Password KDF**                         | **Absent**          | No Argon2, no PBKDF2, no scrypt                                                              |
| **Key ceremony management**              | **Absent**          | No threshold signing, no MPC, no Shamir secret sharing                                       |
| **M integration**                        | **Absent**          | No blockchain-specific integrations                                                          |

**Coverage:** 97.86% statements / 86.48% branches. 15 test files. Zero unsafe code in Rust.

### 2.2 `@gtcx/domain` v2.0.0

| Capability                              | Status       | Evidence                                                                   |
| --------------------------------------- | ------------ | -------------------------------------------------------------------------- |
| Asset lot / trader / transaction models | Production   | `types.ts` — `AssetLot`, `Trader`, `Transaction`                           |
| Trading opportunity / request models    | Production   | `types.ts` — `TradingOpportunity`, `TradeRequest`                          |
| Compliance / regulatory models          | Production   | `types.ts` — `ComplianceRecord`, `RegulatoryFramework`                     |
| Zod validation schemas (15+)            | Production   | `schemas.ts` — `AssetRegistrationDataSchema`, `TradeRequestSchema`         |
| Domain events (factory + emitter)       | Production   | `events.ts` — `DomainEventFactory`, `InMemoryEventEmitter`                 |
| Metrics collection (Prometheus-style)   | Beta         | `metrics.ts` — `InMemoryMetricsCollector`                                  |
| AI operation logging                    | Production   | `ai-logging.ts` — `InMemoryOperationLogger`                                |
| AI provider interfaces                  | Production   | `ai-integration.ts` — `IAIProvider`, `AIContextBuilder`                    |
| Schema migrations                       | Beta         | `migrations.ts` — `SchemaMigrator` with asset_lot & transaction migrations |
| API versioning / deprecation            | Production   | `versioning.ts` — semver compatibility, `deprecated` decorator             |
| Offline queue (5 conflict strategies)   | Experimental | `internal/offline-queue.ts` — `OfflineQueue`, dependency ordering          |
| Rate limiting (internal only)           | Internal     | `internal/utils.ts` — `RateLimiter` not exported                           |
| Retry / backoff                         | Internal     | `internal/utils.ts` — `withRetry`, `calculateBackoffDelay`                 |
| Input sanitization / PII redaction      | Internal     | `internal/utils.ts` — `sanitizeKeys`, `redactPII`                          |
| **Tenant-aware pools**                  | **Absent**   | No multi-tenant resource pooling                                           |
| **Replay caches**                       | **Absent**   | No deduplication cache                                                     |
| **Circuit breakers**                    | **Absent**   | No circuit breaker pattern                                                 |
| **Pluggable rate limiters**             | **Absent**   | `RateLimiter` exists but is internal-only, not pluggable                   |

**Coverage:** 81%+ statements. 9 test files.

### 2.3 `@gtcx/schemas` v2.0.0

| Capability                                            | Status     | Evidence                                                                              |
| ----------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------- |
| Core12 compliance framework (12 domains, 24 controls) | Production | `03-platform/src/core12/` — `CORE12_DOMAINS`, `getControl`, `getDomain`               |
| Agentic provenance schemas                            | Production | `03-platform/src/provenance.ts` — `AgenticProvenanceSchema`, `ProvenancePolicySchema` |
| Evidence reference schemas                            | Production | `03-platform/src/provenance.ts` — `EvidenceRefSchema`, `DecisionProvenanceSchema`     |
| Trust level / review threshold schemas                | Production | `03-platform/src/provenance.ts` — `TrustLevelSchema`, `ReviewThresholdSchema`         |
| **Consensus schemas**                                 | **Absent** | No PBFT, no consensus message types                                                   |
| **Identity operators**                                | **Absent** | No DID operator schemas                                                               |
| **Authority primitives**                              | **Absent** | No governance authority schemas                                                       |

**Coverage:** 90%+ statements. 2 test files. Gap: only 24 of claimed 67 controls implemented.

---

## 3. Protocols Capabilities vs. Core — Gap Analysis

### 3.1 `@gtcx/crypto`

| Protocols Capability                 | In Core?        | Assessment                                                                               |
| ------------------------------------ | --------------- | ---------------------------------------------------------------------------------------- |
| Ed25519 signing                      | ✅ Yes          | Production-hardened, 100% coverage                                                       |
| ML-DSA-65 (post-quantum)             | ❌ No           | **Foundation-worthy.** NIST FIPS 204 standard. Should be in core for bank-grade posture. |
| Hybrid signing (Ed25519 + ML-DSA-65) | ❌ No           | **Foundation-worthy.** PQ transition primitive. Belongs in core.                         |
| Bulletproofs ZKP                     | ✅ Yes (native) | `rust/gtcx-zkp` provides this via NAPI. Protocols likely has different API.              |
| M integration                        | ❌ No           | **Protocol-specific.** Blockchain-specific. Keep in protocols.                           |
| Key ceremony management              | ❌ No           | **Foundation-worthy.** MPC/threshold ceremonies are bank-grade primitives.               |
| Encryption-at-rest                   | ❌ No           | **Foundation-worthy.** Symmetric encryption is a core primitive.                         |
| Password KDF                         | ❌ No           | **Foundation-worthy.** Argon2/PBKDF2/scrypt are foundational.                            |

### 3.2 `@gtcx/domain`

| Protocols Capability            | In Core?              | Assessment                                                                                                    |
| ------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------- |
| Asset/trader/transaction models | ✅ Yes                | Production-hardened interfaces                                                                                |
| Zod schemas                     | ✅ Yes                | 15+ schemas with validation functions                                                                         |
| Domain events                   | ✅ Yes                | Factory + emitter + null pattern                                                                              |
| Offline queue                   | ✅ Yes (experimental) | `internal/offline-queue.ts` — 5 conflict strategies                                                           |
| Tenant-aware pools              | ❌ No                 | **Protocol-specific.** Multi-tenancy is a protocol-layer concern.                                             |
| Replay caches                   | ❌ No                 | **Protocol-specific.** Deduplication is consensus/protocol-layer.                                             |
| Pluggable rate limiters         | ❌ Partial            | Internal `RateLimiter` exists but not exported. **Upstream candidate** — pluggable interface belongs in core. |
| Circuit breakers                | ❌ No                 | **Foundation-worthy.** `@gtcx/resilience` already has retry/bulkhead; circuit breaker is the missing piece.   |

### 3.3 `@gtcx/schemas`

| Protocols Capability | In Core? | Assessment                                                       |
| -------------------- | -------- | ---------------------------------------------------------------- |
| Core12 compliance    | ✅ Yes   | 12 domains, 24 controls (67 claimed, gap noted)                  |
| Provenance schemas   | ✅ Yes   | Full Zod suite for agentic trust                                 |
| Consensus schemas    | ❌ No    | **Protocol-specific.** PBFT message types belong in protocols.   |
| Identity operators   | ❌ No    | **Protocol-specific.** DID operation schemas are protocol-layer. |
| Authority primitives | ❌ No    | **Protocol-specific.** Governance authority is protocol-layer.   |

---

## 4. Decision Matrix

### 4.1 Upstream to Core (Foundation-Worthy)

| Capability                              | Source Package             | Target Package            | Rationale                                                                             | Effort                                          |
| --------------------------------------- | -------------------------- | ------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------- |
| ML-DSA-65 signing                       | `@gtcx/crypto` (protocols) | `@gtcx/crypto` (core)     | Post-quantum is bank-grade. NIST FIPS 204. All downstream will need.                  | High — new algorithm, FIPS certification path   |
| Hybrid signing (Ed25519 + ML-DSA-65)    | `@gtcx/crypto` (protocols) | `@gtcx/crypto` (core)     | PQ transition primitive. Industry standard by 2030.                                   | High — depends on ML-DSA-65                     |
| Key ceremony management (MPC/threshold) | `@gtcx/crypto` (protocols) | `@gtcx/crypto` (core)     | HSM integration, multi-sig, threshold signatures are enterprise requirements.         | Medium — can wrap existing primitives           |
| Encryption-at-rest (symmetric)          | `@gtcx/crypto` (protocols) | `@gtcx/crypto` (core)     | Missing primitive. Required for vault/custody use cases.                              | Low — can use noble-ciphers or node:crypto      |
| Password KDF (Argon2/PBKDF2/scrypt)     | `@gtcx/crypto` (protocols) | `@gtcx/crypto` (core)     | Required for key derivation from human-readable secrets.                              | Low — Argon2 via libsodium or noble-kdf         |
| Circuit breaker                         | `@gtcx/domain` (protocols) | `@gtcx/resilience` (core) | `@gtcx/resilience` already has retry + bulkhead. Circuit breaker completes the triad. | Low — can model on existing resilience patterns |
| Pluggable rate limiter interface        | `@gtcx/domain` (protocols) | `@gtcx/resilience` (core) | Core has internal `RateLimiter`. Making it pluggable + public is low effort.          | Low — refactor internal to public with DI       |

### 4.2 Keep Protocol-Specific

| Capability           | Source Package              | Rationale                                                                            |
| -------------------- | --------------------------- | ------------------------------------------------------------------------------------ |
| M integration        | `@gtcx/crypto` (protocols)  | Blockchain-specific. Ties to protocol-layer consensus.                               |
| Tenant-aware pools   | `@gtcx/domain` (protocols)  | Multi-tenancy is a protocol governance concern, not a foundation primitive.          |
| Replay caches        | `@gtcx/domain` (protocols)  | Deduplication at protocol consensus layer. Core's offline queue handles local dedup. |
| Consensus schemas    | `@gtcx/schemas` (protocols) | PBFT/raft message types are protocol-layer.                                          |
| Identity operators   | `@gtcx/schemas` (protocols) | DID operation schemas (create, update, deactivate) are protocol-layer.               |
| Authority primitives | `@gtcx/schemas` (protocols) | Governance voting, authority delegation are protocol-layer.                          |

### 4.3 Already in Core (No Action)

| Capability       | Location                                                                | Note                                                                                       |
| ---------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Bulletproofs ZKP | `rust/gtcx-zkp` + `NativeZkpEngine`                                     | Already production via NAPI. Protocols may have different API — reconcile if needed.       |
| Offline queue    | `03-platform/packages/domain/03-platform/src/internal/offline-queue.ts` | Already exists with 5 conflict strategies. Protocols version may have different semantics. |
| Rate limiting    | `03-platform/packages/domain/03-platform/src/internal/utils.ts`         | Internal-only. Needs to be made public + pluggable (see upstream table).                   |

---

## 5. Namespace Resolution

### 5.1 Permanent Boundary

Protocols packages that remain protocol-specific **MUST** be renamed to a distinct namespace:

```
@gtcx/protocols-crypto     ← was @gtcx/crypto in protocols
@gtcx/protocols-domain     ← was @gtcx/domain in protocols
@gtcx/protocols-schemas    ← was @gtcx/schemas in protocols
```

This is non-negotiable. Two different codebases cannot share the same npm namespace. The ecosystem convention is:

- `@gtcx/*` without prefix = **foundation packages** (owned by gtcx-core)
- `@gtcx/protocols-*` = **protocol-layer packages** (owned by gtcx-protocols)
- `@gtcx/markets-*` = **market-layer packages** (owned by gtcx-markets)

### 5.2 Migration Path for Protocols

1. **Immediate:** Rename protocols packages in `package.json` + all internal imports
2. **Publish:** `npm publish` under new names (no collision)
3. **Deprecate:** Mark old `@gtcx/crypto` v0.1.0 (protocols) as deprecated on npm with migration message
4. **Update:** Downstream repos that consume protocols versions update their dependencies

---

## 6. Upstreaming Plan (If Approved)

### 6.1 Phase 1: Low-Effort Primitives (2-3 weeks)

**Target packages:** `@gtcx/crypto`, `@gtcx/resilience`

| #   | Task                                                               | API Impact                      | Breaking? |
| --- | ------------------------------------------------------------------ | ------------------------------- | --------- |
| 1   | Add `encrypt` / `decrypt` symmetric to `@gtcx/crypto`              | New exports                     | No        |
| 2   | Add `deriveKeyFromPassword` (Argon2id) to `@gtcx/crypto`           | New exports                     | No        |
| 3   | Export `RateLimiter` as public + pluggable from `@gtcx/resilience` | New exports + internal refactor | No        |
| 4   | Add `CircuitBreaker` to `@gtcx/resilience`                         | New exports                     | No        |

**API reconciliation notes:**

- Encryption: Use `node:crypto` `createCipheriv` / `createDecipheriv` for FIPS mode, `@noble/ciphers` for pure-JS fallback. Export `encrypt(plaintext, key, aad?)` and `decrypt(ciphertext, key, aad?)`.
- KDF: Use `@noble/hashes` `argon2id` or `pbkdf2`. Export `deriveKeyFromPassword(password, salt, options)`.
- Rate limiter: Move from `03-platform/packages/domain/03-platform/src/internal/utils.ts` to `03-platform/packages/resilience/03-platform/src/rate-limiter.ts`. Add `IRateLimiter` interface with `allow(key): boolean`, `reset(key)`, `status(key)`.
- Circuit breaker: Add `CircuitBreaker` class with `execute(fn)`, `state: 'closed' | 'open' | 'half-open'`, `failureThreshold`, `recoveryTimeout`.

### 6.2 Phase 2: Medium-Effort Primitives (4-6 weeks)

**Target package:** `@gtcx/crypto`

| #   | Task                                                        | API Impact  | Breaking? |
| --- | ----------------------------------------------------------- | ----------- | --------- |
| 5   | Add key ceremony management (Shamir secret sharing)         | New exports | No        |
| 6   | Add threshold signing primitives                            | New exports | No        |
| 7   | Add ceremony state machine (`KeyCeremony`, `CeremonyRound`) | New exports | No        |

**API reconciliation notes:**

- Shamir: Use `sss-wasm` or `@noble/curves` field arithmetic. Export `splitSecret(secret, threshold, shares)` and `recombineSecret(shares)`.
- Threshold signing: Wrap existing Ed25519/P256 with additive sharing. Export `createThresholdSigner(shares, threshold)`.
- Ceremony state machine: Export `KeyCeremony` class with `start()`, `processRound(roundData)`, `finalize()`. Keep it generic — not tied to any specific protocol.

### 6.3 Phase 3: High-Effort Primitives (8-12 weeks)

**Target package:** `@gtcx/crypto`

| #   | Task                                     | API Impact           | Breaking? |
| --- | ---------------------------------------- | -------------------- | --------- |
| 8   | Add ML-DSA-65 (post-quantum signing)     | New algorithm option | No        |
| 9   | Add hybrid signing (Ed25519 + ML-DSA-65) | New algorithm option | No        |
| 10  | FIPS certification path for ML-DSA-65    | Process, not code    | N/A       |

**API reconciliation notes:**

- ML-DSA-65: Add `'ML-DSA-65'` to `KeyAlgorithm` union. Export `sign(data, keyPair, {algorithm: 'ML-DSA-65'})`.
- Hybrid: Add `'Ed25519+ML-DSA-65'` to `KeyAlgorithm` union. Sign with both algorithms, concatenate signatures, verify both.
- FIPS: ML-DSA is in FIPS 204 (draft → final). Track NIST CMVP. Use `aws-lc-fips-sys` if AWS-LC adds ML-DSA support, or use `pqclean` bindings.

### 6.4 What NOT to Upstream

| Capability           | Reason                    | Where It Stays            |
| -------------------- | ------------------------- | ------------------------- |
| M integration        | Blockchain-specific       | `@gtcx/protocols-crypto`  |
| Tenant-aware pools   | Protocol governance layer | `@gtcx/protocols-domain`  |
| Replay caches        | Consensus-layer dedup     | `@gtcx/protocols-domain`  |
| Consensus schemas    | PBFT/raft message types   | `@gtcx/protocols-schemas` |
| Identity operators   | DID operation semantics   | `@gtcx/protocols-schemas` |
| Authority primitives | Governance voting logic   | `@gtcx/protocols-schemas` |

---

## 7. Risk Assessment

| Risk                                               | Likelihood | Impact                   | Mitigation                                                                                                                     |
| -------------------------------------------------- | ---------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| Protocols team resists renaming                    | Medium     | High (blocks both repos) | Ecosystem governance decision: foundation owns `@gtcx/*` root namespace. Protocols must use prefixed namespace per convention. |
| API divergence between core and protocols versions | High       | Medium                   | Document reconciliation notes. Maintain compatibility layer in protocols if needed during transition.                          |
| ML-DSA-65 upstream takes 8-12 weeks                | High       | Low                      | Core can ship without ML-DSA-65 initially. Protocols keeps its version until upstream is ready.                                |
| FIPS certification for ML-DSA-65 unavailable       | Medium     | Medium                   | Use draft FIPS 204 with explicit "experimental" flag. Upgrade to certified when CMVP lists it.                                 |
| Downstream repos break during migration            | Medium     | High                     | Semantic versioning + deprecation cycle. Old packages stay published with deprecation notice for 90 days.                      |

---

## 8. Recommended Path Forward

### Immediate (This Week)

1. **Approve this assessment** with protocols team
2. **Decision:** Adopt the hybrid model (upstream foundation-worthy, keep protocol-specific separate)
3. **Rename protocols packages** to `@gtcx/protocols-crypto`, `@gtcx/protocols-domain`, `@gtcx/protocols-schemas`
4. **Update `gtcx-protocols` docs** with namespace isolation framework

### Short-Term (2-4 Weeks)

5. Execute Phase 1 upstreaming (encryption, KDF, rate limiter, circuit breaker)
6. Publish `@gtcx/crypto` v2.1.0 with new primitives
7. Publish `@gtcx/resilience` v2.1.0 with circuit breaker + public rate limiter
8. Deprecate old protocols package names on npm

### Medium-Term (1-3 Months)

9. Execute Phase 2 upstreaming (key ceremonies, threshold signing)
10. Execute Phase 3 upstreaming (ML-DSA-65, hybrid signing) — parallel with FIPS tracking
11. Update master audit to reflect new capabilities and scores

### Long-Term (3-6 Months)

12. Protocols team fully migrates to `@gtcx/protocols-*` namespace
13. Core's `@gtcx/crypto`, `@gtcx/domain`, `@gtcx/schemas` become the unambiguous foundation
14. Ecosystem-wide documentation updated with namespace conventions

---

## 9. Honest Assessment

**What is real:**

- Core's packages are production-hardened with high test coverage
- The namespace collision is real and blocks protocols publishing
- 7 capabilities are genuinely missing from core and are foundation-worthy
- 6 capabilities are genuinely protocol-specific and should stay separate

**What is aspirational:**

- ML-DSA-65 upstreaming (depends on FIPS 204 finalization and CMVP listing)
- Post-quantum hybrid signing (depends on ML-DSA-65)
- Key ceremony management (needs design review for generic API)

**What is blocked:**

- Protocols cannot publish until namespace collision is resolved
- No decision made yet on upstreaming vs. separation
- FIPS certification path for ML-DSA-65 is unclear

**Bottom line:** The collision is solvable. The hybrid model (upstream foundations, separate protocols) preserves both repos' value while preventing future namespace conflicts. The rename is mandatory regardless of upstreaming decisions.
