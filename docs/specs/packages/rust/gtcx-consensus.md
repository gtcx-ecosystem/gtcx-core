# Crate Spec — `gtcx-consensus`

**Classification:** Standard — changes follow normal PR review process.

---

## Purpose

Weighted Practical Byzantine Fault Tolerance (PBFT) consensus engine for the PANX protocol in GTCX. Implements proposal, voting, quorum calculation, and finalization for multi-stakeholder consensus with differentiated validator weights.

---

## Consensus Model

### Validator Weights

| Stakeholder | Weight |
| ----------- | ------ |
| Government  | 40%    |
| Vaults      | 30%    |
| Industry    | 20%    |
| Technical   | 10%    |

### Quorum Rule

A proposal reaches consensus when:

```
Σ(weight_i × vote_i) > ⅔ × Σ(weight_i)
```

Where `vote_i = 1` for approval, `0` for rejection. A proposal fails if it does not reach quorum before timeout.

---

## Public API

### Proposal Lifecycle

| Type / Function   | Description                                                                 |
| ----------------- | --------------------------------------------------------------------------- |
| `Proposal`        | A consensus proposal — ID, payload, proposer, timestamp                     |
| `Vote`            | A validator's vote — proposal ID, validator ID, decision, weight, signature |
| `ConsensusRound`  | Active round state — proposal, votes collected, quorum status               |
| `ConsensusResult` | Outcome: `Approved { proposal, quorum_weight }` or `Rejected { reason }`    |

### Engine

| Function                             | Description                                        |
| ------------------------------------ | -------------------------------------------------- |
| `create_proposal(payload, proposer)` | Create a new proposal                              |
| `cast_vote(round, vote)`             | Record a validator's vote                          |
| `check_quorum(round, weights)`       | Evaluate quorum for the current round              |
| `finalize_round(round)`              | Finalize the round and produce a `ConsensusResult` |

### Errors

| Type             | Description                                                                |
| ---------------- | -------------------------------------------------------------------------- |
| `ConsensusError` | Enum: `DuplicateVote`, `UnknownProposal`, `InvalidWeight`, `QuorumTimeout` |

---

## Dependencies

| Crate                  | Role                              |
| ---------------------- | --------------------------------- |
| `gtcx-crypto` (local)  | Signing and verification of votes |
| `serde` + `serde_json` | Proposal and vote serialization   |
| `tracing`              | Observability                     |
| `thiserror`            | Error types                       |

---

## Byzantine Fault Tolerance

The weighted PBFT model tolerates up to ⅓ of total validator weight acting Byzantine (malicious or faulty). With government at 40%, no single stakeholder class can unilaterally approve a proposal. Government + Vaults (70%) can reach quorum together; Government alone (40%) cannot.

---

## Non-Goals

- Does not implement the network transport for vote propagation — `gtcx-network`
- Does not manage validator registration or weight assignment — a protocol governance concern
- Does not expose NAPI bindings — consensus runs in the Rust validator node process

---

## Implementation

`rust/gtcx-consensus/src/`

---

## Reference

- [`docs/specs/packages/rust/gtcx-network.md`](./gtcx-network.md) — vote propagation transport
- [`docs/specs/packages/rust/gtcx-crypto.md`](./gtcx-crypto.md) — vote signing
- [`docs/specs/core-spec.md`](../../core-spec.md) — system overview
