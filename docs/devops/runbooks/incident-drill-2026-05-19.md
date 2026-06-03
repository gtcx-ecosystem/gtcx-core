---
title: 'Incident Drill: Transitive Dependency Signing Regression'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'standard'
tags: ['documentation', 'devops']
review_cycle: 'on-change'
---

---

title: 'Incident Drill: Transitive Dependency Signing Regression'
status: 'current'
date: '2026-05-19'
owner: 'crypto-security-engineer'
role: 'crypto-security-engineer'
tier: 'critical'
tags: ['incident-drill', 'security', 'crypto', 'runbook']
review_cycle: 'on-change'

---

# Incident Drill: Transitive Dependency Signing Regression

> **Type:** Simulated drill (tabletop + technical validation)
> **Date:** 2026-05-19
> **Scenario:** Supply-chain induced Ed25519 signature canonicalization divergence
> **Severity:** P0 — Critical
> **Participants:** Protocol Architect, Cryptographic Security Engineer, Quality & Evidence Lead

---

## 1. Scenario

### 1.1 Background

A downstream consumer (`gtcx-markets`) reports that signatures produced by `@gtcx/crypto@3.0.4` are being rejected by their EU buyer's verification system. The rejection is intermittent — approximately 3% of signatures fail validation.

### 1.2 Root Cause (Known to Drill Facilitator)

A transitive dependency update in `@gtcx/crypto`'s dependency tree (`noble-ed25519` → `noble-curves`) introduced a subtle change in how low-order points are handled during signature verification. The change is technically compliant with RFC 8032 but diverges from the canonicalization behavior that `@gtcx/crypto` has enforced since 2023.

The divergence only manifests when:

1. The signing key has a specific bit pattern in the high byte
2. The message hash produces a scalar that triggers the low-order path
3. The verifier uses the pre-update canonicalization logic

### 1.3 Impact Assessment

| Dimension               | Assessment                                             |
| ----------------------- | ------------------------------------------------------ |
| **Affected packages**   | `@gtcx/crypto@3.0.4`, `@gtcx/verification@3.0.0`       |
| **Affected downstream** | `gtcx-markets`, `gtcx-protocols` (2 repos, 6 services) |
| **Signature volume**    | ~12,000 signatures/day across all consumers            |
| **Financial exposure**  | Estimated €180K in blocked transactions/day            |
| **Regulatory exposure** | EU buyer compliance audit scheduled in 14 days         |
| **Reputational risk**   | High — GTCX signing guarantees are contractual         |

---

## 2. Timeline

### T+0:00 — Detection

**10:14 UTC** — `gtcx-markets` on-call engineer posts in `#incidents`:

> "EU validator rejecting ~3% of TradePass signatures since 09:00 UTC. Error: `INVALID_SIGNATURE_CANONICALIZATION`. Only affecting signatures from lots registered after 08:30 UTC. Need immediate escalation."

**10:16 UTC** — PagerDuty fires for `crypto-security-engineer` (P0 — Critical).

### T+0:08 — Triage

**10:22 UTC** — Crypto Security Engineer acknowledges page, joins incident bridge.

**Initial assessment:**

- Signatures from `@gtcx/crypto@3.0.3` (previous version) validate correctly
- Signatures from `@gtcx/crypto@3.0.4` (released 2026-05-18 22:00 UTC) fail intermittently
- Failure rate correlates with new release deployment window

**Hypothesis:** Regression introduced in 3.0.4 release.

### T+0:15 — Contain

**10:29 UTC** — Protocol Architect approves emergency rollback:

```bash
# Deprecate affected version immediately
npm deprecate @gtcx/crypto@3.0.4 \
  "CRITICAL: Signature canonicalization regression. Rollback to 3.0.3 immediately."

# Mark as vulnerable in advisory
npm audit --json | jq '.advisories | keys[]'
```

**10:31 UTC** — Downstream services instructed to pin `@gtcx/crypto@3.0.3`.

**10:35 UTC** — `gtcx-markets` confirms rollback stops new rejections.

### T+0:45 — Assess

**10:59 UTC** — Cryptographic Security Engineer begins diff analysis:

```bash
# Compare 3.0.3 vs 3.0.4
cd packages/crypto
git diff v3.0.3..v3.0.4 -- src/
```

**Findings:**

- No direct changes to `src/signing/ed25519.ts` between 3.0.3 and 3.0.4
- `package-lock.json` shows `noble-curves@1.8.0` upgraded from `1.7.0`
- `noble-curves@1.8.0` changelog: "Improved low-order point handling in ed25519"

**11:15 UTC** — Engineer reproduces issue:

```typescript
import { sign, verify } from '@gtcx/crypto';

// Generate 1,000 signatures with random keys
// 3.2% fail verification against pre-1.8.0 canonicalization
```

### T+1:30 — Fix

**11:44 UTC** — Protocol Architect convenes war room. Decision: **Pin `noble-curves@1.7.0` and release 3.0.5** rather than adapt to new behavior.

Rationale:

- Changing canonicalization behavior breaks all existing signatures in the wild
- The "improvement" in 1.8.0 is RFC-compliant but not backward-compatible with GTCX's canonicalization guarantee
- GTCX's threat model requires deterministic, version-locked signing behavior

**12:08 UTC** — Fix committed:

```diff
- "noble-curves": "^1.7.0"
+ "noble-curves": "1.7.0"
```

Plus `pnpm-overrides` entry to prevent transitive upgrade:

```json
"pnpm": {
  "overrides": {
    "noble-curves": "1.7.0"
  }
}
```

**12:22 UTC** — `pnpm test --filter=@gtcx/crypto` passes (201 tests).
**12:35 UTC** — `cargo test` passes (Rust crypto tests).
**12:48 UTC** — `@gtcx/crypto@3.0.5` published with SLSA provenance.

### T+2:30 — Verify

**13:14 UTC** — Downstream validation:

- `gtcx-markets` deploys 3.0.5, confirms 0% rejection rate
- `gtcx-protocols` integration tests pass
- Backward compatibility test: 10,000 signatures from 3.0.3 verify correctly with 3.0.5

### T+4:00 — Communicate

**14:14 UTC** — Incident closed. Communications sent:

1. **Security advisory** posted to `docs/security/advisories/2026-05-19-ed25519-canonicalization.md`
2. **Downstream notice** emailed to all `@gtcx/crypto` consumers
3. **npm deprecation** updated with remediation steps
4. **Status page** updated (incident duration: 3h 58m)

---

## 3. Post-Mortem

### 3.1 What Went Well

| Item                    | Evidence                                                     |
| ----------------------- | ------------------------------------------------------------ |
| Fast detection          | Downstream caught issue within 2 hours of first failure      |
| Rapid rollback          | Deprecation + pin deployed in 15 minutes                     |
| Clear escalation        | P0 page fired automatically on `#incidents` keyword          |
| Reproducible root cause | Engineer reproduced issue in <30 minutes                     |
| Cross-team coordination | Protocol Architect, Crypto SE, QE Lead aligned within 1 hour |

### 3.2 What Went Wrong

| Item                        | Evidence                                                       |
| --------------------------- | -------------------------------------------------------------- |
| Transitive dependency unpin | `noble-curves` used `^` range, allowing silent patch upgrade   |
| No canary signing test      | CI tests verify correctness but not canonicalization stability |
| Missing lockfile audit      | `pnpm audit` did not flag the change as breaking               |
| No downstream smoke test    | Release pipeline lacks integration test against `gtcx-markets` |

### 3.3 Root Cause Analysis (5 Whys)

1. **Why did signatures fail?** — `noble-curves@1.8.0` changed low-order point handling.
2. **Why did the upgrade happen silently?** — `package.json` used `^1.7.0` range.
3. **Why was the range not pinned?** — Policy did not require exact-version pinning for crypto dependencies.
4. **Why did CI not catch this?** — Tests verify RFC compliance, not canonicalization stability across versions.
5. **Why is canonicalization stability not tested?** — No requirement existed to test signature compatibility against previous dependency versions.

**Root cause:** Policy gap — crypto dependency updates were not treated as breaking changes requiring explicit approval.

---

## 4. Action Items

| #   | Action                                                                                                         | Owner                    | Due        | Status |
| --- | -------------------------------------------------------------------------------------------------------------- | ------------------------ | ---------- | ------ |
| 1   | Pin all crypto dependencies to exact versions in `packages/crypto/` and `packages/security/`                   | crypto-security-engineer | 2026-05-20 | Done   |
| 2   | Add `pnpm-overrides` for `noble-curves`, `noble-hashes`, `@noble/secp256k1` in root `package.json`             | crypto-security-engineer | 2026-05-20 | Done   |
| 3   | Create canonicalization stability test: generate signatures with current version, verify with previous version | quality-evidence-lead    | 2026-05-26 | Open   |
| 4   | Add downstream smoke test to release pipeline (`gtcx-markets` integration)                                     | frontier-infra-engineer  | 2026-06-02 | Open   |
| 5   | Update `docs/security/dependency-policy.md` to require exact-version pinning for all crypto dependencies       | protocol-architect       | 2026-05-23 | Open   |
| 6   | Add `cargo audit` and `npm audit` to pre-release gate (Gate 8)                                                 | quality-evidence-lead    | 2026-05-26 | Open   |
| 7   | Schedule quarterly dependency freeze review for crypto packages                                                | protocol-architect       | 2026-06-01 | Open   |

---

## 5. Lessons Learned

1. **Transitive dependencies in crypto are attack surface.** A patch upgrade in a dependency is a potential breaking change in a cryptographic guarantee.
2. **RFC compliance ≠ backward compatibility.** Behavior can be standards-compliant and still break existing signatures.
3. **Downstream detection is late detection.** The ideal detection point is pre-release, not post-deployment.
4. **Exact-version pinning is non-negotiable for crypto.** `^` and `~` ranges are acceptable for application dependencies, not for primitives.
5. **Incident drills validate process, not just people.** This drill exposed gaps in the release gate that manual review had missed.

---

## 6. Drill Validation

| Criterion                  | Result | Evidence                          |
| -------------------------- | ------ | --------------------------------- |
| Response time < 15 min     | Pass   | Rollback initiated at T+15        |
| Root cause identified < 2h | Pass   | Root cause confirmed at T+1:15    |
| Fix deployed < 4h          | Pass   | 3.0.5 published at T+2:18         |
| Post-mortem within 24h     | Pass   | This document published at T+4:00 |
| Action items assigned      | Pass   | 7 items with owners and dates     |

**Drill facilitator sign-off:** Protocol Architect
**Technical validator sign-off:** Cryptographic Security Engineer
**Process validator sign-off:** Quality & Evidence Lead

---

_This drill was conducted as a tabletop exercise with technical validation. No actual signatures were compromised. All timestamps are simulated._
