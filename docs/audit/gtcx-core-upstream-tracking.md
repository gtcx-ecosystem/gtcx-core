---
title: 'gtcx-core Upstream Tracking — Protocols Capabilities'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'standard'
tags: ['documentation', 'audit']
review_cycle: 'on-change'
---

---

title: 'Gtcx Core Upstream Tracking'
status: 'current'
date: '2026-05-17'
owner: 'quality-evidence-lead'
role: 'quality-evidence-lead'
tier: 'critical'
tags: ['docs', 'audit']
review_cycle: 'quarterly'

---

# gtcx-core Upstream Tracking — Protocols Capabilities

> **Status:** Acknowledged — Phase 1 Complete
> **Date:** 2026-05-12
> **Source:** gtcx-protocols/docs/audit/gtcx-core-upstream-instructions.md
> **Priority:** Alignment (not a fire)

---

## 1. Resolution Summary

| Item                      | Status                                                                                            |
| ------------------------- | ------------------------------------------------------------------------------------------------- |
| Namespace collision       | ✅ **Resolved** — protocols renamed to `@gtcx/protocols-*`                                        |
| Core namespace ownership  | ✅ **Confirmed** — `@gtcx/crypto`, `@gtcx/domain`, `@gtcx/schemas` owned by gtcx-core permanently |
| Immediate action required | ✅ **None** — Phase 1 is acknowledgment only                                                      |

---

## 2. Phase 2: Upstream 7 Capabilities

**Timeline:** 2–12 weeks, at gtcx-core pace. Not blocking.

### 2.1 Upstream Matrix

| #   | Capability                           | Target Package     | Source in Protocols                             | Effort | Priority |
| --- | ------------------------------------ | ------------------ | ----------------------------------------------- | ------ | -------- |
| 1   | ML-DSA-65 post-quantum signing       | `@gtcx/crypto`     | `packages/crypto/src/hybrid-signer.ts`          | High   | Medium   |
| 2   | Hybrid signing (Ed25519 + ML-DSA-65) | `@gtcx/crypto`     | `packages/crypto/src/hybrid-signer.ts`          | High   | Medium   |
| 3   | Key ceremony management              | `@gtcx/crypto`     | `packages/crypto/src/ceremony-manager.ts`       | Medium | Medium   |
| 4   | Encryption-at-rest                   | `@gtcx/crypto`     | `packages/crypto/src/encryption-at-rest.ts`     | Low    | High     |
| 5   | Password KDF (Argon2id / PBKDF2)     | `@gtcx/crypto`     | `packages/crypto/src/password-kdf.ts`           | Low    | High     |
| 6   | Circuit breaker                      | `@gtcx/resilience` | `packages/domain/src/circuit-breaker.ts`        | Low    | High     |
| 7   | Pluggable rate limiter               | `@gtcx/resilience` | `packages/domain/src/pluggable-rate-limiter.ts` | Low    | High     |

### 2.2 Recommended Order

**Week 1–2 (Low effort, high value):**

- #4 Encryption-at-rest
- #5 Password KDF
- #6 Circuit breaker
- #7 Pluggable rate limiter

**Week 3–6 (Medium effort):**

- #3 Key ceremony management

**Week 7–12 (High effort, blocked on FIPS):**

- #1 ML-DSA-65
- #2 Hybrid signing

### 2.3 Protocols Capabilities Staying Separate

| Capability              | Reason                    | Location                  |
| ----------------------- | ------------------------- | ------------------------- |
| AI/ML integration hooks | Blockchain-specific       | `@gtcx/protocols-crypto`  |
| Tenant-aware pools      | Protocol governance layer | `@gtcx/protocols-domain`  |
| Replay caches           | Consensus-layer dedup     | `@gtcx/protocols-domain`  |
| Consensus schemas       | PBFT/raft message types   | `@gtcx/protocols-schemas` |
| Identity operators      | DID operation semantics   | `@gtcx/protocols-schemas` |
| Authority primitives    | Governance voting logic   | `@gtcx/protocols-schemas` |

---

## 3. Phase 3: Deprecation Coordination

**Trigger:** After gtcx-core v3.0 ships with upstreamed capabilities.

| Step | Owner     | Action                                          |
| ---- | --------- | ----------------------------------------------- |
| 1    | gtcx-core | Notify protocols team when v3.0 is ready        |
| 2    | protocols | Migrate imports from protocols-specific to core |
| 3    | protocols | Delete shim packages after migration complete   |
| 4    | gtcx-core | Update ecosystem documentation                  |

---

## 4. Integration with 10/10 Roadmap

These capabilities map to the new **Lightweight App Architecture** and **Machine-Readable Docs** dimensions:

- Circuit breaker + pluggable rate limiter → Lightweight Architecture (M2 target)
- Encryption-at-rest + password KDF → Security dimension (M2 target)
- ML-DSA-65 + hybrid signing → Security dimension (M3 target, blocked on FIPS 204)

---

## 5. No Action Required Now

This document is for **tracking and coordination only.**

- No code changes needed today
- No PRs needed today
- No urgency — protocols has already resolved their side

**When you're ready to upstream:** pick a capability from §2.2, read the source in gtcx-protocols, implement in gtcx-core, verify with `pnpm test` and `cargo test`.
