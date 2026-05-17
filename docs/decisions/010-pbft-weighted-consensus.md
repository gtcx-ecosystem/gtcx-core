---
title: '010 Pbft Weighted Consensus'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'critical'
tags: ['docs', 'architecture']
review_cycle: 'quarterly'
---

# ADR-010: PBFT Consensus with Weighted Stake Model

## Status

Accepted

## Date

2025-01-15

## Context

GTCX requires multi-party consensus for critical operations: asset verification, provenance attestation, and compliance certification. Multiple stakeholders must agree before a verification is considered finalized.

The GTCX validator set consists of known, identified entities:

- **Government regulatory bodies** (mining authorities, trade ministries)
- **Licensed vault operators** (storage facilities, refineries)
- **Industry participants** (miners, traders, exporters)
- **Technical validators** (GTCX infrastructure operators)

These stakeholders have different levels of authority and responsibility. A government regulator's attestation carries more weight than a technical validator's. Equal-weight consensus (one-validator-one-vote) would not reflect this reality.

Classical PBFT (Practical Byzantine Fault Tolerance) provides consensus among known participants but uses equal voting weight. Blockchain-style PoW/PoS is designed for anonymous, permissionless networks — unnecessary overhead for a permissioned system.

## Decision

Implement weighted PBFT consensus via the `gtcx-consensus` crate, where validators have different voting weights based on their stakeholder role:

| Stakeholder | Default Weight |
| ----------- | -------------- |
| Government  | 40%            |
| Vaults      | 30%            |
| Industry    | 20%            |
| Technical   | 10%            |

Quorum is reached when the sum of approving validators' weights exceeds ⅔ of total weight:

```
Σ(weight_i × vote_i) > ⅔ × Σ(weight_i)
```

The consensus protocol follows PBFT phases:

1. **Pre-prepare** — Leader proposes a verification
2. **Prepare** — Validators review and vote
3. **Commit** — If quorum reached, validators commit
4. **Finalize** — Verification is recorded in the hash-chain audit trail

View changes handle leader failures: if the current leader times out, the next validator by weight assumes leadership and the view number increments.

## Consequences

### Positive

- Reflects real-world authority: government attestations carry appropriate weight
- Byzantine fault tolerance: system tolerates up to ⅓ of weight being malicious
- Known validator set: no Sybil attack risk (validators are identified entities)
- Deterministic finality: once committed, a verification cannot be rolled back
- No token economics, gas fees, or mining — pure consensus on verification outcomes

### Negative

- Weight distribution is a governance decision that may be politically sensitive
- Centralization risk: government validators with 40% weight have significant influence
- Adding new stakeholder types requires updating the weight model
- View change protocol adds complexity compared to simple leader election

### Neutral

- Weight percentages are configurable per deployment (different jurisdictions may adjust)
- The `gtcx-network` crate handles the transport layer; `gtcx-consensus` is pure protocol logic
- Single-stakeholder-type deployments (e.g., only government) degenerate to simple majority voting
