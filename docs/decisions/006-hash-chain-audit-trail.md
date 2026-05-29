---
title: "ADR-006: Event-Sourced Audit Trail with Hash Chains"
status: "current"
date: "2026-05-27"
owner: "gtcx-core"
role: "protocol-architect"
agent_id: "agent://gtcx-core/2026-05-27/session-backfill"
trust_score: 60
autonomy_level: "permissioned"
tier: "standard"
tags: ["documentation", "decisions"]
review_cycle: "on-change"
---

---
title: '006 Hash Chain Audit Trail'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'critical'
tags: ['docs', 'architecture']
review_cycle: 'quarterly'
---

# ADR-006: Event-Sourced Audit Trail with Hash Chains

## Status

Accepted

## Date

2025-01-15

## Context

GTCX requires tamper-evident audit logs for regulatory compliance. Every event (asset registration, ownership transfer, quality assessment, compliance check) must be:

- **Immutable** — Cannot be modified after creation
- **Tamper-evident** — Any modification is detectable
- **Non-repudiable** — Signed by the actor who performed the action
- **Auditable** — Any party with the public key can verify the entire chain

Blockchain provides these properties via distributed consensus and chained block hashes. However, GTCX's validators are known entities (governments, vaults, inspectors), not anonymous miners. The overhead of distributed consensus, token economics, and wallet UX is unnecessary for this permissioned use case.

The core insight from the [Security Architecture](../security/security-architecture.md): blockchain's value comes from its cryptographic primitives, not from the consensus mechanism. The same primitives deployed on conventional infrastructure provide equivalent security guarantees.

## Decision

Implement hash-chained audit logs using SHA-256 chaining and Ed25519 signatures, stored in PostgreSQL (not a distributed ledger). The `gtcx-crypto` crate's `chain` module provides:

- `ChainEntry` — A signed, hashed entry containing: sequence number, previous hash, timestamp, payload, Ed25519 signature, and SHA-256 hash
- `create_genesis_entry()` — Creates the first entry with all-zero previous hash
- `create_entry()` — Creates subsequent entries chained to the previous hash
- `verify_chain()` — Verifies signature validity, sequence ordering, and hash chain integrity
- `verify_extension()` — Verifies a new entry correctly extends an existing chain

Each entry's hash is computed over: `sequence || prev_hash || timestamp || payload_length || payload || signature`, creating an unbreakable chain where modifying any entry invalidates all subsequent hashes.

## Consequences

### Positive

- Equivalent tamper-evidence to blockchain hash chains (same SHA-256 chaining)
- Ed25519 signatures provide non-repudiation tied to DID identity
- Standard PostgreSQL storage: familiar operations, backup, replication, indexing
- Sub-millisecond append latency (vs seconds-to-minutes for blockchain confirmation)
- 10,000+ TPS throughput (database-limited, not consensus-limited)
- No cryptocurrency, tokens, gas fees, or wallet complexity

### Negative

- Single-authority model: the database operator can theoretically delete entries (mitigated by multi-party attestation and external hash publication)
- No decentralized redundancy by default (mitigated by geographic database replication)
- Requires trust in the storage provider (acceptable for permissioned government systems)

### Neutral

- Multi-party attestation (PANX consensus) adds distributed verification on top of hash chains when required
- External hash publication (periodic Merkle roots to public notary services) provides additional tamper evidence if needed
