# Cryptographic Verification Architecture

## Document Control

| Attribute | Value |
|-----------|-------|
| **Scope** | Architectural decision — cryptographic infrastructure vs. blockchain |
| **Status** | Publication-Ready |
| **Related** | [Security Framework](../specs/security-framework.md), [Crypto Research Paper](./crypto-research.md) |

---

## 1. The Design Decision

GTCX uses cryptographic verification infrastructure rather than blockchain for commodity trust and provenance. This document explains the technical rationale, the security equivalence, and the adoption advantages.

### 1.1 Core Thesis

Blockchain's value proposition is delivered by its cryptographic primitives, not by the consensus mechanism or distributed ledger. By deploying those same primitives (hash chains, digital signatures, Merkle trees, zero-knowledge proofs) on conventional cloud infrastructure, GTCX achieves equivalent security guarantees with superior adoption characteristics.

---

## 2. Security Equivalence

### 2.1 Primitive-by-Primitive Comparison

| Security Property | Blockchain Mechanism | GTCX Mechanism | Equivalence |
|-------------------|---------------------|----------------|-------------|
| **Immutability** | Chained block hashes | Hash-chained audit logs (append-only, signed) | Equivalent — both use SHA-256 chains |
| **Tamper evidence** | Cryptographic signatures on blocks | Ed25519 signatures on every event (see [EventCore](../specs/eventcore.md)) | Equivalent — same Ed25519 curves |
| **Consensus** | BFT / PoW / PoS | Multi-party signature requirements (N-of-M) via PANX | Equivalent for permissioned use case |
| **Auditability** | Public ledger inspection | Cryptographically signed audit trails with Merkle proofs | Equivalent — verifiable by any party with public keys |
| **Non-repudiation** | Transaction signatures | Per-event Ed25519 signatures bound to TradePass DID | Equivalent — same cryptographic binding |
| **Privacy** | Limited (public ledger) | Zero-knowledge proofs for selective disclosure | Superior — privacy by design |

### 2.2 What Blockchain Adds (and Why We Don't Need It)

| Blockchain Feature | GTCX Alternative | Rationale |
|-------------------|-----------------|-----------|
| Decentralized storage | Cloud infrastructure with geographic redundancy | Our validators are known entities (governments, vaults, inspectors), not anonymous miners |
| Trustless consensus | Multi-party attestation via PANX validators | In commodity verification, validators have real-world identity — trustlessness is unnecessary |
| Token incentives | Fee-based economics + regulatory mandate | Participation is driven by legal compliance requirements, not token speculation |
| Smart contracts | Server-side business logic with deterministic execution | Easier to audit, upgrade, and debug |

---

## 3. Adoption Advantages

### 3.1 Government Adoption

The primary users of GTCX infrastructure are government regulatory bodies. Their technology requirements:

| Requirement | Blockchain Impact | GTCX Approach |
|-------------|------------------|---------------|
| Oversight and control | Governments cannot control decentralized networks | Full administrative control with audit access |
| Legal framework | Unclear legal status of blockchain records in most African jurisdictions | Digital signature laws already recognize Ed25519-signed documents |
| Regulatory clarity | Cryptocurrency associations create regulatory hesitation | No cryptocurrency, no tokens, no wallet complexity |
| IT integration | Requires new infrastructure, wallets, node management | Standard REST APIs and PostgreSQL — integrates with existing systems |
| Procurement | Blockchain infrastructure difficult to procure through government channels | Standard cloud services on existing procurement frameworks |

### 3.2 End-User Adoption

40% of target users operate on feature phones with no smartphone access.

| Constraint | Blockchain Impact | GTCX Approach |
|-----------|------------------|---------------|
| Feature phone users | Cannot run wallet software or sign blockchain transactions | USSD service codes (`*384#`) — works on any phone |
| Intermittent connectivity | Blockchain requires eventual network access for finality | 72-hour offline operation with local signing and deferred sync |
| Technical literacy | Wallet UX, gas fees, key management are barriers | No blockchain concepts exposed to users |

### 3.3 Performance

| Metric | Typical Blockchain | GTCX Infrastructure |
|--------|-------------------|---------------------|
| Throughput | 7–3,000 TPS depending on network | 10,000+ TPS (database-limited) |
| Latency | 10 seconds to 10+ minutes for confirmation | Sub-second response |
| Cost per transaction | Variable gas fees | Predictable, fixed infrastructure cost |
| Storage | Full chain history replicated to every node | Standard database with selective replication |

---

## 4. Technical Implementation

### 4.1 Hash-Chained Audit Logs

Every event in the GTCX system is recorded in a hash-chained log. Each entry includes the hash of the previous entry, creating an append-only chain with tamper evidence equivalent to a blockchain.

```
Event N:
  payload: { ... }
  signature: Ed25519(actor_key, payload)
  previousHash: SHA-256(Event N-1)
  eventHash: SHA-256(payload + signature + previousHash)

Event N+1:
  payload: { ... }
  signature: Ed25519(actor_key, payload)
  previousHash: SHA-256(Event N)  ← chain link
  eventHash: SHA-256(payload + signature + previousHash)
```

Any modification to a historical event breaks the hash chain, making tampering immediately detectable.

### 4.2 Multi-Party Attestation

Settlement operations require signatures from multiple independent parties before execution. This provides the same assurance as blockchain consensus without the overhead.

```
Settlement requires:
  1. Seller signature (TradePass Ed25519 key)
  2. Buyer signature (TradePass Ed25519 key)
  3. Validator attestation (PANX validator key, ≥67% threshold)
  4. Custody verification (VaultMark signature from vault operator)
  5. GCI score above threshold (signed by GCI calculation service)

All 5 conditions must be satisfied atomically.
No single party can unilaterally approve a settlement.
```

### 4.3 Merkle Tree Verification

Verification bundles use Merkle trees so that any subset of verifications can be independently proven without revealing the full bundle.

```
                    Merkle Root
                   /           \
              H(AB)             H(CD)
             /     \           /     \
        H(A)       H(B)   H(C)       H(D)
         │          │       │          │
     Origin    Weight    Purity    Custody
     Proof     Proof     Proof     Proof
```

A buyer can verify that the weight proof is included in the bundle without seeing the origin or custody proofs — enabling selective disclosure for privacy.

### 4.4 Zero-Knowledge Proofs

GCI compliance scores can be verified without revealing the underlying factor data:

- **Schnorr proofs**: Prove a GCI score exceeds a threshold without revealing the exact score
- **Bulletproofs**: Prove a weight falls within an expected range without revealing the exact measurement
- **BBS+ signatures**: Selective attribute disclosure from TradePass credentials

See [Security Framework](../specs/security-framework.md) Section 8.5 for the complete ZKP specification.

---

## 5. Migration Path

The architecture preserves optionality for future technology decisions:

1. **All data is cryptographically signed** — can be anchored to any blockchain by publishing Merkle roots
2. **Event format is blockchain-ready** — [EventCore](../specs/eventcore.md) envelope can be wrapped in blockchain transactions without modification
3. **Key management is chain-agnostic** — Ed25519 and secp256k1 are supported by all major blockchains
4. **PANX consensus can federate** — validator set can include blockchain-based validators alongside traditional ones

If blockchain infrastructure becomes necessary for international interoperability or regulatory requirements, the migration path is incremental: anchor Merkle roots to a public chain for timestamping, then gradually move settlement logic on-chain if needed. No schema changes or user-facing changes required.

---

## 6. Related Documents

- [Security Framework](../specs/security-framework.md) — Complete cryptographic specification
- [Crypto Research Paper](./crypto-research.md) — Academic analysis of the crypto-over-blockchain approach
- [EventCore Specification](../specs/eventcore.md) — Canonical event envelope with hash chain rules
- [Network Protocol](../specs/network-protocol.md) — PANX consensus messaging and validator attestation
- [@gtcx/crypto](../packages/crypto.md) — Implementation of signing, hashing, and key management primitives
