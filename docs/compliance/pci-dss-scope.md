---
title: "PCI-DSS Scope Declaration — gtcx-core"
status: "current"
date: "2026-05-27"
owner: "gtcx-core"
role: "protocol-architect"
agent_id: "agent://gtcx-core/2026-05-27/session-backfill"
trust_score: 60
autonomy_level: "permissioned"
tier: "standard"
tags: ["documentation", "compliance"]
review_cycle: "on-change"
---

---
title: 'Pci Dss Scope'
status: 'current'
date: '2026-05-17'
owner: 'quality-evidence-lead'
role: 'quality-evidence-lead'
tier: 'critical'
tags: ['docs', 'compliance']
review_cycle: 'quarterly'
---

# PCI-DSS Scope Declaration — gtcx-core

**Document ID:** GTCX-CORE-PCI-001
**Version:** 1.0
**Date:** 2026-05-08
**Status:** Active
**Applicable Standard:** PCI DSS v4.0

---

## Scope Determination

**gtcx-core is OUT OF SCOPE for PCI-DSS compliance.**

---

## Rationale

PCI-DSS applies to entities that store, process, or transmit cardholder data (CHD) or sensitive authentication data (SAD). gtcx-core is a cryptographic library that:

| PCI-DSS Criterion                                           | gtcx-core Status                                  |
| ----------------------------------------------------------- | ------------------------------------------------- |
| Stores cardholder data (PAN, expiry, name)                  | **No** — no storage of any kind                   |
| Processes cardholder data                                   | **No** — no data interpretation or transformation |
| Transmits cardholder data                                   | **No** — no network communication                 |
| Stores sensitive authentication data (CVV, PIN, track data) | **No**                                            |
| Provides payment processing services                        | **No** — provides cryptographic primitives only   |
| Has access to cardholder data environment (CDE)             | **No** — library runs in caller's process         |

---

## Downstream Usage

gtcx-core cryptographic primitives **may** be used by downstream services that process payments. In such cases:

- The downstream service is the entity in scope for PCI-DSS, not gtcx-core
- gtcx-core provides signing, hashing, and verification primitives that can support PCI-DSS Requirement 3 (Protect Stored Account Data) and Requirement 4 (Protect Cardholder Data with Strong Cryptography During Transmission)
- The downstream service must conduct its own SAQ or ROC assessment
- gtcx-core's use of NIST-approved algorithms (Ed25519, SHA-256, AES-256-GCM) supports PCI-DSS Requirement 3.5.1 (strong cryptography)

---

## Cryptographic Strength Statement

For downstream services referencing gtcx-core's cryptographic capabilities in their PCI-DSS assessment:

| Algorithm       | Key Length | PCI-DSS Compliant | Standard                                      |
| --------------- | ---------- | ----------------- | --------------------------------------------- |
| Ed25519         | 256-bit    | Yes               | RFC 8032, equivalent to 128-bit symmetric     |
| Secp256k1 ECDSA | 256-bit    | Yes               | SEC 2, equivalent to 128-bit symmetric        |
| SHA-256         | 256-bit    | Yes               | FIPS 180-4                                    |
| SHA-512         | 512-bit    | Yes               | FIPS 180-4                                    |
| AES-256-GCM     | 256-bit    | Yes               | FIPS 197, SP 800-38D                          |
| BLAKE3          | 256-bit    | N/A               | Not NIST-approved; use SHA-256 in PCI context |

---

## Tokenization Disclaimer

If gtcx-core is used as part of a tokenization solution:

- gtcx-core provides the cryptographic signing and hashing primitives only
- The token vault, token mapping, and de-tokenization logic are downstream responsibilities
- The token vault is in PCI-DSS scope; gtcx-core is not

---

## Signature

This scope declaration confirms that gtcx-core does not store, process, or transmit cardholder data and is therefore out of scope for PCI-DSS compliance requirements.

**Prepared by:** GTCX Protocol Team
**Date:** 2026-05-08

---

## References

- PCI DSS v4.0 (March 2022)
- PCI SSC Information Supplement: Scoping and Network Segmentation
- [Security Framework](../security/security-framework.md)
