---
title: 'ADR-005: Ed25519 over secp256k1 for Identity Signing'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'standard'
tags: ['documentation', 'decisions']
review_cycle: 'on-change'
---

---

title: '005 Ed25519 Signing'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'critical'
tags: ['docs', 'architecture']
review_cycle: 'quarterly'

---

# ADR-005: Ed25519 over secp256k1 for Identity Signing

## Status

Accepted

## Date

2025-01-15

## Context

GTCX requires digital signatures for identity documents (DIDs), event signing, audit trails, and verification certificates. Two elliptic curve signature schemes were evaluated:

1. **secp256k1** — Used by Bitcoin and Ethereum. 256-bit keys. ECDSA-based. Widely adopted in blockchain ecosystems. Variable-time verification. Signatures are malleable (S-value canonicalization required).

2. **Ed25519** — Edwards-curve Digital Signature Algorithm on Curve25519. 256-bit keys. 128-bit security level. Deterministic signatures. Constant-time operations. Batch verification support. Used by Signal, SSH, TLS 1.3, Solana.

Key evaluation criteria for GTCX:

- **Determinism**: Same message + key must produce same signature (required for audit trail reproducibility)
- **Performance**: Signing and verification on the critical path for every transaction
- **Batch verification**: Validators verify thousands of signatures per block
- **Side-channel resistance**: Constant-time implementation required for government-grade security
- **Simplicity**: Fewer implementation footguns (no S-value normalization, no random nonce generation)

## Decision

Use Ed25519 as the primary signing algorithm for all GTCX identity and verification operations. The implementation uses `ed25519-dalek` in Rust (`gtcx-crypto` crate) with `@noble/curves` as the TypeScript fallback.

- All DID documents are signed with Ed25519
- All event audit trail entries are signed with Ed25519
- Verification certificates use Ed25519 signatures
- Batch verification (`ed25519_dalek::verify_batch`) used by validators for ~50x speedup
- secp256k1 (`k256` crate) is available as a secondary algorithm for interoperability but is not the default

## Consequences

### Positive

- Deterministic signatures: same input always produces same output (no random nonce)
- 2x faster verification than secp256k1 ECDSA (benchmarked)
- Native batch verification: ~50x speedup for validators verifying large batches
- Constant-time implementation prevents timing side-channel attacks
- Simpler implementation: no S-value canonicalization, no nonce generation
- Smaller signatures: 64 bytes (vs 71-73 for DER-encoded ECDSA)

### Negative

- Not compatible with Bitcoin/Ethereum ecosystems (secp256k1 is their standard)
- Fewer hardware security module (HSM) implementations support Ed25519 natively
- Ed25519 is not NIST-approved (though Curve25519 is included in NIST SP 800-186)

### Neutral

- Both algorithms provide 128-bit security level
- Ed25519 is already recognized by digital signature laws in most jurisdictions
- The `k256` crate provides secp256k1 fallback when blockchain interop is needed
