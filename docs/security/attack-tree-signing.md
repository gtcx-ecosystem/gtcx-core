---
title: "Attack Tree — Signature Forgery"
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
title: 'Attack Tree Signing'
status: 'current'
date: '2026-05-17'
owner: 'crypto-security-engineer'
role: 'crypto-security-engineer'
tier: 'critical'
tags: ['docs', 'security']
review_cycle: 'quarterly'
---

# Attack Tree — Signature Forgery

**Version:** 1.0.0
**Status:** Active
**Last reviewed:** 2026-05-08
**Scope:** All paths that could produce a valid Ed25519 signature without the legitimate private key

---

## Root Goal

**Produce a valid Ed25519 signature that passes `verify()` for a message the attacker chose, without possessing the legitimate private key.**

---

## Attack Tree

```
[ROOT] Forge valid signature
├── [1] Extract private key
│   ├── [1.1] Memory extraction
│   │   ├── [1.1.1] Cold boot attack on device RAM
│   │   │   Mitigation: secureWipe() zeroizes key memory after use
│   │   │   Residual risk: LOW — window is milliseconds during signing
│   │   ├── [1.1.2] Core dump / heap snapshot of Node.js process
│   │   │   Mitigation: Rust zeroize on drop; JS secureWipe()
│   │   │   Residual risk: MEDIUM — if process crashes during signing, key may persist
│   │   └── [1.1.3] Side-channel via shared memory (VM/container escape)
│   │       Mitigation: Out of scope (infrastructure responsibility)
│   │       Residual risk: LOW
│   ├── [1.2] Log/trace extraction
│   │   ├── [1.2.1] Traced operation logs input containing key material
│   │   │   Mitigation: redactSecrets() default sanitizer (2026-05-08)
│   │   │   Mitigation: All 28 traced crypto ops use logInput:false for key params
│   │   │   Residual risk: LOW — defense-in-depth via default + explicit sanitization
│   │   ├── [1.2.2] Error stack trace includes key in variable binding
│   │   │   Mitigation: Error handlers in signing.ts catch and rethrow without key context
│   │   │   Residual risk: LOW
│   │   └── [1.2.3] Serialization of key-containing object (JSON.stringify)
│   │       Mitigation: sanitizeSecrets() in @gtcx/security redacts key-like fields
│   │       Residual risk: LOW
│   ├── [1.3] Storage extraction
│   │   ├── [1.3.1] Read encrypted local storage without decryption key
│   │   │   Mitigation: AES-256-GCM encryption at rest
│   │   │   Residual risk: LOW — requires device-level compromise
│   │   ├── [1.3.2] Compromise device OS and extract storage decryption key
│   │   │   Mitigation: Out of scope (device security responsibility)
│   │   │   Residual risk: MEDIUM — mobile/field devices in Global South
│   │   └── [1.3.3] Backup/sync of unencrypted key file
│   │       Mitigation: .gitignore excludes .env, credentials; no key-file format exists
│   │       Residual risk: LOW
│   └── [1.4] Supply chain key extraction
│       ├── [1.4.1] Compromised @noble/curves exfiltrates generated keys
│       │   Mitigation: Pinned exact versions; Trivy/cargo-audit in CI; Dependabot review
│       │   Residual risk: MEDIUM — sophisticated, but single point of failure
│       └── [1.4.2] Malicious PR adds key exfiltration to @gtcx/crypto
│           Mitigation: CODEOWNERS review; architecture boundary check; secret scan
│           Residual risk: MEDIUM — single CODEOWNER (bus factor)
│
├── [2] Forge signature without key
│   ├── [2.1] Break Ed25519
│   │   ├── [2.1.1] Quantum computer (Shor's algorithm)
│   │   │   Mitigation: Post-quantum hash in military-grade certificates
│   │   │   Residual risk: LOW — not practical before ~2035
│   │   └── [2.1.2] Novel mathematical break
│   │       Mitigation: None available (accept risk; monitor NIST advisories)
│   │       Residual risk: VERY LOW
│   ├── [2.2] Hash collision exploitation
│   │   ├── [2.2.1] SHA-256 collision to produce same signature input
│   │   │   Mitigation: SHA-256 has no known practical collisions
│   │   │   Residual risk: VERY LOW
│   │   └── [2.2.2] BLAKE3 collision for proof bundle hash
│   │       Mitigation: BLAKE3 domain separation prefixes; different hash per context
│   │       Residual risk: VERY LOW
│   └── [2.3] Nonce reuse / weak nonce
│       ├── [2.3.1] Ed25519 deterministic nonce (RFC 8032) prevents nonce reuse
│       │   Mitigation: @noble/curves implements RFC 8032 deterministic nonce
│       │   Residual risk: NONE — protocol-level protection
│       └── [2.3.2] ECDSA (Secp256k1) nonce reuse leaks private key
│           Mitigation: @noble/curves implements RFC 6979 deterministic nonce
│           Residual risk: NONE — protocol-level protection
│
├── [3] Replay existing valid signature
│   ├── [3.1] Capture and replay signed request
│   │   ├── [3.1.1] Replay API request with valid HMAC signature
│   │   │   Mitigation: Per-request nonce + timestamp window (TC-009)
│   │   │   Residual risk: LOW — nonce uniqueness prevents exact replay
│   │   └── [3.1.2] Replay offline queue entry after sync
│   │       Mitigation: Logical sequence ordering; duplicate detection in sync engine
│   │       Residual risk: LOW
│   └── [3.2] Replay proof bundle from QR code
│       ├── [3.2.1] Scan QR code and submit same proof bundle
│       │   Mitigation: Proof bundle includes timestamp; verifier checks recency
│       │   Residual risk: MEDIUM — recency window may be too wide for some use cases
│       └── [3.2.2] Copy proof bundle between commodity lots
│           Mitigation: Bundle includes certificateId tied to specific lot
│           Residual risk: LOW
│
└── [4] Substitute key (DID poisoning)
    ├── [4.1] Overwrite DID document with attacker's public key
    │   ├── [4.1.1] Compromise DID resolution infrastructure
    │   │   Mitigation: DID documents validated with Zod schema (TC-010)
    │   │   Residual risk: MEDIUM — depends on resolution infrastructure security
    │   └── [4.1.2] Man-in-the-middle during DID resolution
    │       Mitigation: Encrypted transport (TLS); planned certificate pinning
    │       Residual risk: LOW
    └── [4.2] Register similar DID and confuse verifier
        ├── [4.2.1] DID with similar-looking identifier
        │   Mitigation: DID format is hash-derived (deterministic from public key)
        │   Residual risk: VERY LOW — collision-resistant hash
        └── [4.2.2] Social engineering verifier to accept wrong DID
            Mitigation: Out of scope (operational procedure)
            Residual risk: MEDIUM — human factor
```

---

## Risk Summary

| Branch                  | Top Risk                     | Current Level | Accepted?                                             |
| ----------------------- | ---------------------------- | ------------- | ----------------------------------------------------- |
| 1.1 Memory extraction   | Process crash during signing | MEDIUM        | Yes — mitigated by zeroize; residual window is narrow |
| 1.2 Log extraction      | Default sanitization bypass  | LOW           | Yes — closed 2026-05-08 with redactSecrets()          |
| 1.3 Storage extraction  | Device compromise            | MEDIUM        | Yes — out of scope for library                        |
| 1.4 Supply chain        | Single CODEOWNER review      | MEDIUM        | No — add secondary reviewer (roadmap A.1)             |
| 2.x Cryptographic break | Quantum computing            | LOW           | Yes — monitored; post-quantum path exists             |
| 3.x Replay              | QR proof replay window       | MEDIUM        | Partially — tighten recency window                    |
| 4.x DID poisoning       | Resolution infrastructure    | MEDIUM        | Yes — depends on downstream infrastructure            |

---

## Open Mitigations (Not Yet Implemented)

| ID     | Mitigation                                                                      | Priority | Blocks                    |
| ------ | ------------------------------------------------------------------------------- | -------- | ------------------------- |
| AT-001 | ~~Add secondary CODEOWNER for crypto packages~~ — done (gtcx-agent, 2026-05-09) | Closed   | —                         |
| AT-002 | Certificate revocation checking in verify flow                                  | High     | Replay with revoked keys  |
| AT-003 | Tighten proof bundle recency window (configurable)                              | Medium   | QR replay window          |
| AT-004 | HSM-backed key storage (Tier 2/3)                                               | Medium   | Memory extraction vector  |
| AT-005 | Content hash pinning for @noble/\* dependencies                                 | Medium   | Supply chain substitution |

---

## References

- [Threat Model](./threat-model.md) — STRIDE analysis and attack scenarios
- [Threat Control Matrix](./threat-control-matrix.md) — 12 controls mapped to packages
- [Key Ceremony](./key-ceremony.md) — key lifecycle procedures
- RFC 8032 — Edwards-Curve Digital Signature Algorithm (Ed25519)
- RFC 6979 — Deterministic Usage of DSA and ECDSA
- NIST SP 800-57 Rev. 5 — Key Management
