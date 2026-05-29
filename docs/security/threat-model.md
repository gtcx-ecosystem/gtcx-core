---
title: "Threat Model — gtcx-core"
status: "current"
date: "2026-05-27"
owner: "gtcx-core"
role: "protocol-architect"
agent_id: "agent://gtcx-core/2026-05-27/session-backfill"
trust_score: 60
autonomy_level: "permissioned"
tier: "standard"
tags: ["documentation", "security"]
review_cycle: "on-change"
---

---
title: 'Threat Model'
status: 'current'
date: '2026-05-17'
owner: 'crypto-security-engineer'
role: 'crypto-security-engineer'
tier: 'critical'
tags: ['docs', 'security']
review_cycle: 'quarterly'
---

# Threat Model — gtcx-core

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Cryptographic Security Engineer

**Version:** 1.0.0
**Classification:** Internal
**Threat model date:** 2026-05-04
**Review cycle:** Quarterly
**Scope:** TypeScript packages (`@gtcx/*`) and Rust crates (`gtcx-*`) — cryptographic library primitives consumed by downstream GTCX products

---

## System Scope

gtcx-core is a **library**, not a service. It has no network listeners, no user-facing API, no persistent storage, and no deployment surface. Threats target the **code supply chain** and the **correctness of cryptographic operations** — not infrastructure.

### Components under threat analysis

| Component                | Package                                 | What it does                                                         |
| ------------------------ | --------------------------------------- | -------------------------------------------------------------------- |
| Key generation + signing | `@gtcx/crypto`, `rust/gtcx-crypto`      | Ed25519/Secp256k1 key pairs, message signing, signature verification |
| Hashing                  | `@gtcx/crypto`                          | SHA-256, SHA-512, BLAKE3 with domain separation                      |
| ZKP engine               | `@gtcx/crypto`, `rust/gtcx-zkp`         | Hash-commitment (TS fallback), Groth16/Bulletproofs/Schnorr (Rust)   |
| Identity                 | `@gtcx/identity`                        | DID creation, resolution, credential management                      |
| Verification             | `@gtcx/verification`                    | Certificate generation, proof bundles, QR codes                      |
| Security primitives      | `@gtcx/security`                        | Token lifecycle, permissions, sanitization, audit logging            |
| Offline queue            | `@gtcx/domain`                          | Operation queueing with conflict resolution                          |
| API client               | `@gtcx/api-client`                      | HTTP requests with signing, retry, offline awareness                 |
| Native bindings          | `@gtcx/crypto-native`, `rust/gtcx-node` | NAPI-RS bridge for Rust crypto from Node.js                          |

### Data flow

```
[Downstream GTCX App]
        ↓ imports
[@gtcx/services, @gtcx/api-client]
        ↓ calls
[@gtcx/identity, @gtcx/verification, @gtcx/security]
        ↓ delegates
[@gtcx/crypto] ──→ [@gtcx/crypto-native] ──→ [rust/gtcx-node] ──→ [rust/gtcx-crypto, rust/gtcx-zkp]
```

Key material flows through: `@gtcx/crypto` (generation) → `@gtcx/identity` (DID binding) → `@gtcx/verification` (proof signing) → `@gtcx/api-client` (request signing). Private keys must never leave the generating context.

---

## Threat Actors

| Actor                          | Motivation                                             | Capability    | Relevance to gtcx-core                                         |
| ------------------------------ | ------------------------------------------------------ | ------------- | -------------------------------------------------------------- |
| Supply chain attacker          | Compromise downstream products via poisoned dependency | High          | Critical — gtcx-core is the foundation for 6+ downstream repos |
| Sophisticated adversary        | Forge trade verification proofs                        | High          | Critical — targets ZKP and signing                             |
| Malicious contributor          | Introduce subtle crypto weakness                       | Medium        | High — single CODEOWNER, open to PRs                           |
| Insider at downstream consumer | Extract private keys from library misuse               | High (access) | Medium — library must make misuse hard                         |
| Automated scanner              | Find known CVEs in dependencies                        | Low           | Medium — dependencies must stay patched                        |

---

## STRIDE Analysis (scoped to library threats)

### Spoofing

| Component          | Threat                                    | Impact   | Likelihood | Risk   | Current mitigation                                                            | Evidence |
| ------------------ | ----------------------------------------- | -------- | ---------- | ------ | ----------------------------------------------------------------------------- | -------- |
| `@gtcx/crypto`     | Weak key generation allows key prediction | Critical | Low        | High   | Ed25519 via audited @noble/curves; CSPRNG via Web Crypto / Node.js crypto     | TC-001   |
| `@gtcx/identity`   | DID spoofing via forged DID documents     | High     | Medium     | High   | Cryptographic DID resolution with Zod schema validation of resolved documents | TC-010   |
| `@gtcx/api-client` | Request forgery via missing/weak signing  | Medium   | Medium     | Medium | HMAC request signing with per-request nonce                                   | TC-012   |

### Tampering

| Component            | Threat                                      | Impact   | Likelihood | Risk   | Current mitigation                                                     | Evidence                   |
| -------------------- | ------------------------------------------- | -------- | ---------- | ------ | ---------------------------------------------------------------------- | -------------------------- |
| `@gtcx/verification` | Proof bundle modification after signing     | Critical | Low        | High   | Hash-chained proof bundles; signature covers full payload              | TC-011                     |
| `@gtcx/crypto`       | Hash collision exploitation                 | High     | Very Low   | Medium | SHA-256 + BLAKE3 with domain-separated prefixes                        | TC-002                     |
| `@gtcx/domain`       | Offline queue payload tampering during sync | Medium   | Medium     | Medium | Conflict resolution strategies; checksum metadata on queued operations | TC-004                     |
| npm registry         | Published package modified post-publish     | Critical | Low        | High   | Provenance manifest generation; `--provenance` flag on publish         | `pnpm provenance:generate` |

### Repudiation

| Component            | Threat                          | Impact | Likelihood | Risk   | Current mitigation                                                               | Evidence                       |
| -------------------- | ------------------------------- | ------ | ---------- | ------ | -------------------------------------------------------------------------------- | ------------------------------ |
| `@gtcx/security`     | Audit log tampering or omission | High   | Low        | Medium | Structured audit events with severity levels, batch flushing                     | `packages/security/src/audit/` |
| `@gtcx/verification` | Denial of certificate issuance  | Medium | Low        | Low    | Certificate ID includes timestamp + randomness; proof bundles are self-contained | TC-011                         |

### Information Disclosure

| Component          | Threat                                        | Impact   | Likelihood | Risk     | Current mitigation                                                                                          | Evidence                      |
| ------------------ | --------------------------------------------- | -------- | ---------- | -------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `@gtcx/crypto`     | Private key leakage in error messages or logs | Critical | Medium     | Critical | DID document creation validates no private key material in output; traced operations use sanitize callbacks | TC-001, `identity.ts:115-119` |
| `@gtcx/security`   | Secrets in console output                     | High     | Medium     | High     | Audit logger uses structured events; no raw credential logging                                              | TC-008                        |
| `@gtcx/crypto`     | Timing side-channel on signature verification | High     | Low        | Medium   | @noble/curves uses constant-time comparison; Rust ed25519-dalek uses `ct_eq`                                | TC-001                        |
| `rust/gtcx-crypto` | Key material in memory after use              | Medium   | Low        | Medium   | `zeroize` derive on all key structs                                                                         | `Cargo.toml` zeroize dep      |

### Denial of Service

| Component          | Threat                                   | Impact | Likelihood | Risk   | Current mitigation                                                    | Evidence                              |
| ------------------ | ---------------------------------------- | ------ | ---------- | ------ | --------------------------------------------------------------------- | ------------------------------------- |
| `@gtcx/domain`     | Offline queue exhaustion                 | Medium | Medium     | Medium | `maxQueueSize` cap (default 10,000); JSON serialization validation    | `offline-queue.ts:142-146`            |
| `@gtcx/crypto`     | ZKP proof generation resource exhaustion | High   | Low        | Medium | Performance budgets enforced in CI; Groth16 prove budgeted at ≤5000ms | `benchmarks/performance-budgets.json` |
| `@gtcx/api-client` | Retry storm amplification                | Medium | Medium     | Medium | Exponential backoff with jitter; max 3 retries; max 2s delay cap      | `api-client/src/index.ts:369-370`     |

### Elevation of Privilege

| Component        | Threat                                    | Impact   | Likelihood | Risk   | Current mitigation                                                                                                                                                                                                                                                                        | Evidence                             |
| ---------------- | ----------------------------------------- | -------- | ---------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| `@gtcx/security` | Permission bypass via zone escalation     | High     | Low        | Medium | Zone-based permission system with explicit grants                                                                                                                                                                                                                                         | TC-006                               |
| `@gtcx/crypto`   | JS fallback ZKP accepted as real ZK proof | Critical | Low        | Medium | `HashCommitmentZkpEngine.generate()` throws by default (SA-002 closed). Opt-in requires `GTCX_ALLOW_HASH_COMMITMENT_ZKP=1`. `createZkpEngine()` factory's no-native fallback path also fail-closes by default. `GTCX_REQUIRE_NATIVE=true` continues to surface the pointed error message. | `packages/crypto/src/zkp.ts:113-152` |
| `rust/gtcx-node` | Unsafe code in NAPI bridge                | Critical | Low        | High   | `#![deny(unsafe_code)]` enforced in all crates; CI verifies this                                                                                                                                                                                                                          | `ci.yml` unsafe_code check           |

---

## Supply Chain Threats

This is the highest-risk category for a foundation library.

| Threat                                    | Impact   | Likelihood | Risk     | Current mitigation                                                                            | Gap                                                  |
| ----------------------------------------- | -------- | ---------- | -------- | --------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Compromised npm dependency                | Critical | Medium     | Critical | Trivy scanning in CI; SBOM generation; `pnpm audit` on every PR; pinned versions via lockfile | No runtime SCA in downstream apps                    |
| Malicious PR introducing crypto weakness  | Critical | Low        | High     | Single CODEOWNER review; lint-staged hooks; architecture boundary check                       | No formal code review checklist for crypto changes   |
| Typosquatting on `@gtcx/*` scope          | High     | Low        | Medium   | Private registry planned; `publishConfig` set to npm                                          | Scope not yet claimed on npm                         |
| Build artifact tampering                  | High     | Low        | Medium   | Provenance manifest generated; `--provenance` on publish                                      | Not yet publishing; no Sigstore integration          |
| Dependency confusion (internal vs public) | High     | Low        | Medium   | `workspace:*` protocol for all internal refs                                                  | Must claim `@gtcx` scope on npm before first publish |

---

## Attack Scenarios

### Scenario 1: Forged verification proof

```yaml
Attack_Scenario:
  Name: 'Forged commodity verification proof'
  Attack_Path: 1. Attacker obtains a valid proof bundle structure from public QR code
    2. Modifies certificate data (commodity weight, origin location)
    3. Attempts to re-sign with a different key pair
    4. Submits modified proof bundle to downstream verification service
  Impact:
    Financial: 'Fraudulent commodity certification could enable trade of uncertified goods'
    Reputation: 'Critical — undermines entire verification protocol'
  Current_Controls:
    - Proof bundles include publicKey; verifier checks key against DID registry
    - Certificate ID is hash-derived and tamper-evident
    - Hash-chained proof structure detects any field modification
    - tracedVerifyCertificate() requires a RevocationChecker on every call (SA-004 closed); fail-closed on backend errors
    - HashCommitmentZkpEngine.generate() throws by default (SA-002 closed)
  Gaps:
    - No production HTTP/ledger-backed RevocationChecker reference implementation in this repo (consumers supply their own)
  Recommendations:
    - Enforce GTCX_REQUIRE_NATIVE=true in all production deployments
    - Publish a reference RevocationChecker that consults the gtcx-protocols revocation status list
    - Complete pen test on verification pipeline
```

### Scenario 2: Private key extraction via logging

```yaml
Attack_Scenario:
  Name: 'Key material leakage through traced operations'
  Attack_Path:
    1. Developer enables verbose tracing in development
    2. Traced crypto operation logs input containing key material
    3. Logs are shipped to centralized logging service
    4. Attacker with log access extracts private keys
  Impact:
    Financial: 'Complete identity compromise for affected users'
    Reputation: 'High'
  Current_Controls:
    - TracedOptions includes sanitizeInput/sanitizeOutput callbacks
    - DID document creation explicitly rejects documents containing privateKey fields
    - @gtcx/ai stub logger only outputs structured JSON with explicit fields
    - Default redactSecrets() sanitizer applied when logInput/logOutput is true (CLOSED 2026-05-08)
    - sanitizer_override telemetry event emitted at traced() construction time when explicit sanitizer overrides the default — surfaces deliberate overrides for audit (CLOSED 2026-05-10)
  Gaps:
    - No static analysis rule to prevent key material from reaching log calls
  Recommendations:
    - Add ESLint rule or architecture check that flags direct logging of crypto function outputs
```

### Scenario 3: Supply chain compromise via dependency

```yaml
Attack_Scenario:
  Name: 'Compromised transitive dependency in @noble/curves'
  Attack_Path: 1. Attacker compromises a maintainer account of @noble/curves or @noble/hashes
    2. Publishes a patch version with weakened key generation
    3. pnpm update pulls the compromised version
    4. All downstream GTCX products generate weak keys
  Impact:
    Financial: 'All verification proofs become forgeable'
    Reputation: 'Critical — total system compromise'
  Current_Controls:
    - Pinned versions in package.json (not ranges)
    - pnpm lockfile committed
    - Trivy vulnerability scanning in CI
    - Dependabot weekly updates (reviewed before merge)
  Gaps:
    - No hash pinning of dependency contents (only version pinning)
    - No reproducible build verification
  Recommendations:
    - Add integrity checksums to lockfile verification
    - Pin @noble/* to exact content hashes, not just versions
    - Monitor @noble/* releases via security advisory feeds
```

---

## Risk Heat Map

```
Impact ↑
  CRIT │    [S3][S1]
  HIGH │ [TC6][TC3][KL ]
   MED │ [DoS][TC4]
   LOW │
       └──────────────→
         Low  Med  High
         Likelihood

S1 = Forged proof (if native not enforced)
S3 = Supply chain compromise
KL = Key leakage via logs
TC3 = ZKP forgery
TC4 = Input injection
TC6 = Permission bypass
DoS = Queue/retry exhaustion
```

---

## Action Items

### Critical priority (immediate)

- [x] Enforce `GTCX_REQUIRE_NATIVE=true` documentation for all production deployments
- [x] Add `#![deny(unsafe_code)]` verification to CI for all Rust crates
- [x] Claim `@gtcx` scope on npm before first publish to prevent typosquatting — org owned by gtcx-protocol
- [ ] Complete penetration test on crypto, identity, and verification packages

### High priority (30 days)

- [x] Add default input sanitization to traced operations (strip key material) — redactSecrets() in @gtcx/ai
- [x] Add certificate revocation support to `@gtcx/verification` — RevocationChecker interface required on tracedVerifyCertificate()
- [ ] Wire real Groth16/Bulletproofs circuits to NAPI bridge (eliminate JS ZKP fallback path in production) — partial: HashCommitmentZkpEngine.generate() now fails closed

### Medium priority (90 days)

- [ ] Implement Sigstore provenance signing for published packages
- [ ] Add content hash verification for critical dependencies (@noble/\*)
- [ ] Establish formal crypto code review checklist for security-sensitive packages

### Ongoing

- [ ] Quarterly threat model review
- [ ] Weekly dependency scanning via Dependabot + Trivy
- [ ] Annual penetration test
- [ ] Monitor NIST/CISA advisories for ed25519-dalek, arkworks, @noble/\*

---

## References

- [Threat Control Matrix](./threat-control-matrix.md) — 12 controls mapped to packages
- [Security Framework](./security-framework.md) — security architecture overview
- [FIPS Assessment](./fips-assessment.md) — FIPS 140-2/3 compliance pathway
- [NIST 800-53 Mapping](./nist-800-53-mapping.md) — control family alignment
- STRIDE threat modeling framework (Microsoft)
- DREAD risk scoring (Microsoft)
