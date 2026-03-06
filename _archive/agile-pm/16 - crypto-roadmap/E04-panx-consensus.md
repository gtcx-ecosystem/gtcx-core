# Epic E04: PANX Consensus (Privacy-Aware Network eXchange)

## Document Information

- **Project**: GTCX Cryptographic Systems
- **Epic**: E04 -- PANX Consensus
- **Phase**: 4
- **Priority**: P1 (High)
- **Date**: 2026-02-03
- **Owner**: Crypto Engineering
- **Estimated Effort**: 5 sprints (10 weeks)
- **Total Story Points**: 42
- **Classification**: CONFIDENTIAL
- **Dependencies**: Phase 0 (Cryptographic Foundation) -- DONE, Phase 3 (Network Layer)
- **Target**: Q3 2026
- **Success Criteria**: Weighted PBFT consensus achieves sub-3-second finality, tolerates f < n/3 Byzantine faults, persists and recovers consensus state across crashes, supports safe validator rotation across epoch boundaries, and exposes governance-controlled parameters with full observability

## Epic Overview

PANX ("Privacy-Aware Network eXchange") is a weighted PBFT consensus engine designed for the GTCX multi-stakeholder governance model. Unlike traditional PBFT where every validator has equal voting power, PANX assigns tiered weights to validators based on their institutional role (Government, Enterprise, Community, Academic), modulated by reputation scores and stake deposits. This epic implements the full consensus lifecycle -- from validator registration through message flow, fault tolerance, persistence, recovery, epoch management, observability, and governance -- in a new `gtcx-consensus` Rust crate.

### What Exists Today

| Component                | Location                                                 | Status                                                                                                |
| ------------------------ | -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `certificate.proto`      | `protocols/proto/sensei/v1/certificate.proto`            | 40 lines; `CertificateService` gRPC service (consensus results reference certificates)                |
| Rust consensus code      | N/A                                                      | No Rust consensus code exists yet; this epic builds the module from scratch                           |
| PANX governance model    | `docs/developers/architecture/scout-agents.md` (GitBook) | Documented governance tiers and validator roles for the PANX network                                  |
| Weighted validator model | `agile-pm/kora/09 - security/security-architecture.md`   | Describes the weighted validator model, quorum thresholds, and Byzantine fault tolerance requirements |

### What This Epic Delivers

1. Tiered validator registration with Government 40%, Enterprise 30%, Community 20%, Academic 10% weight allocation
2. Reputation and stake modifier weight calculation with weighted quorum determination
3. Full PBFT message flow: pre-prepare, prepare, commit, reply with Ed25519 signatures
4. View change protocol for leader failure recovery within 2 rounds
5. Consensus state persistence and crash recovery with periodic snapshots
6. Validator rotation and epoch management for safe reconfiguration
7. Consensus observability, governance parameter updates, and slashing conditions

## Sprint Allocation

| Sprint    | Theme                        | Story Points | Stories |
| --------- | ---------------------------- | ------------ | ------- |
| Sprint 15 | Validator Registry           | 5            | 3       |
| Sprint 16 | PBFT Message Flow            | 13           | 5       |
| Sprint 17 | Integration and Hardening    | 5            | 3       |
| Sprint 18 | Persistence and Recovery     | 11           | 4       |
| Sprint 19 | Observability and Governance | 8            | 3       |
| **Total** |                              | **42**       | **18**  |

---

## Sprint 15: Validator Registry

**Sprint Goal**: Deliver the validator registration system with tiered weight allocation, reputation-modulated weight calculation, and weighted quorum determination, establishing the governance foundation for all subsequent consensus operations.

**Sprint Points**: 5

### PANX-US-001: Tiered Validator Registration

**Story ID**: PANX-US-001
**Priority**: P0
**Story Points**: 2
**Sprint**: 15
**Assignee**: Unassigned

**User Story**:
As a network operator, I want to register validators into one of four governance tiers (Government, Enterprise, Community, Academic) with predefined base weight allocations, so that the consensus protocol reflects the PANX multi-stakeholder governance model.

**Description**:
Implement a `ValidatorRegistry` struct in `gtcx-consensus/src/validator/registry.rs` that manages the lifecycle of validator registrations. Each validator is identified by its Ed25519 public key and assigned to exactly one governance tier upon registration. The four tiers carry base weight allocations: Government (40%), Enterprise (30%), Community (20%), and Academic (10%). These percentages represent the fraction of total consensus weight allocated to all validators within that tier collectively. Within a tier, weight is distributed equally among registered validators of that tier.

The registry must enforce several invariants. A validator's public key must be unique across all tiers; attempting to register a duplicate key returns a typed error. The registry must support a configurable minimum and maximum number of validators per tier to prevent governance capture (e.g., a single Government validator absorbing 40% of total weight). Registration requires a valid Ed25519 signature over a registration payload to prove key ownership. The registry exposes methods for querying validators by tier, by public key, and for retrieving the full validator set with computed weights.

The `ValidatorRegistry` must be thread-safe (`Send + Sync`) to support concurrent access from the consensus engine and the governance API. All mutations (register, deregister) are serialized via an internal lock, while reads are lock-free where possible (using `Arc<RwLock<_>>` or a concurrent data structure). The registry persists its state via a `RegistryStore` trait, with an in-memory implementation for testing and a `sled`-backed implementation for production.

**Acceptance Criteria**:

- `ValidatorRegistry` supports four tiers: Government (40%), Enterprise (30%), Community (20%), Academic (10%)
- Validators are identified by Ed25519 public key and assigned to exactly one tier
- Within a tier, base weight is distributed equally among all validators in that tier
- Duplicate public key registration returns a typed `RegistryError::DuplicateKey` error
- Registration requires a valid Ed25519 signature over the registration payload (public key + tier + nonce)
- Minimum and maximum validators per tier are configurable (default: min 1, max 100)
- `get_validators_by_tier(tier)` returns all validators in the specified tier
- `get_validator(public_key)` returns the validator's registration details or `None`
- `get_all_validators()` returns the full validator set with computed weights
- The registry is thread-safe (`Send + Sync`) and supports concurrent reads
- `RegistryStore` trait abstracts persistence with in-memory and sled implementations
- Deregistration removes a validator and redistributes weight within the tier

**Dependencies**:

- Phase 0 `ed25519-dalek` signing primitives in `gtcx-crypto` (DONE)
- Phase 3 network identity layer for peer discovery (DONE)

**Definition of Done**:

- `ValidatorRegistry` implemented in `gtcx-consensus/src/validator/registry.rs`
- `RegistryStore` trait and in-memory implementation complete
- Unit tests covering: registration, duplicate rejection, signature verification, tier queries, deregistration, concurrent access (multi-threaded test with 10 threads)
- Property-based test with `proptest`: total weight across all tiers always sums to 1.0 regardless of validator count distribution
- Doc comments describe governance model assumptions and weight distribution formula
- Code reviewed and approved

---

### PANX-US-002: Reputation and Stake Modifier Weight Calculation

**Story ID**: PANX-US-002
**Priority**: P1
**Story Points**: 1
**Sprint**: 15
**Assignee**: Unassigned

**User Story**:
As a consensus engine, I want to adjust each validator's base tier weight using reputation scores and stake deposits, so that well-behaved validators with higher stakes have proportionally greater influence on consensus outcomes.

**Description**:
Implement a `WeightCalculator` in `gtcx-consensus/src/validator/weight.rs` that computes the effective weight for each validator by applying reputation and stake modifiers to the base tier weight. The effective weight formula is:

```
effective_weight = base_tier_weight * reputation_modifier * stake_modifier
```

The reputation modifier is a value in [0.5, 1.5] derived from the validator's historical behavior: timely message delivery, correct vote participation, uptime percentage, and absence of slashing events. A new validator starts with a reputation modifier of 1.0. The reputation score is updated at epoch boundaries (see PANX-US-015) based on the validator's performance during the epoch.

The stake modifier is a sublinear function of the validator's deposited stake relative to the tier's minimum stake requirement: `stake_modifier = 1.0 + 0.5 * ln(stake / min_stake)`, clamped to [1.0, 2.0]. This ensures that stake provides a bonus but cannot dominate the tier-based governance structure. After computing raw effective weights for all validators, the weights are normalized so that the total across all validators sums to 1.0.

The `WeightCalculator` must be deterministic: given the same registry state, reputation scores, and stake deposits, it always produces identical effective weights. This is critical because all validators must independently compute the same weight vector to agree on quorum thresholds.

**Acceptance Criteria**:

- Effective weight is computed as `base_tier_weight * reputation_modifier * stake_modifier`
- Reputation modifier is in [0.5, 1.5] with default value 1.0 for new validators
- Stake modifier formula: `1.0 + 0.5 * ln(stake / min_stake)`, clamped to [1.0, 2.0]
- After computation, all effective weights are normalized to sum to 1.0
- Computation is deterministic: same inputs always produce identical weights (verified by running computation twice and asserting equality)
- `WeightCalculator::compute_weights(registry, reputations, stakes)` returns `HashMap<PublicKey, f64>`
- Validators with zero stake receive a stake modifier of 1.0 (no penalty, no bonus)
- Validators with reputation modifier below 0.5 are clamped to 0.5 (not excluded)
- Weight computation completes in under 1 millisecond for 1000 validators
- Unit tests include at least 5 hand-computed test vectors validating the formula

**Dependencies**:

- PANX-US-001 (Validator registry with tier assignments and base weights)

**Definition of Done**:

- `WeightCalculator` implemented in `gtcx-consensus/src/validator/weight.rs`
- Unit tests with hand-computed test vectors for various tier distributions, reputation scores, and stake levels
- Property-based test: normalized weights always sum to 1.0 (within floating-point epsilon)
- Performance benchmark: weight computation for 1000 validators < 1ms
- Doc comments include the weight formula and examples
- Code reviewed and approved

---

### PANX-US-003: Weighted Quorum Determination

**Story ID**: PANX-US-003
**Priority**: P0
**Story Points**: 2
**Sprint**: 15
**Assignee**: Unassigned

**User Story**:
As a consensus engine, I want to determine whether a set of validators constitutes a weighted quorum, so that the PBFT message flow can correctly decide when sufficient agreement has been reached.

**Description**:
Implement a `QuorumChecker` in `gtcx-consensus/src/validator/quorum.rs` that determines whether a given set of validator public keys meets the weighted quorum threshold. In standard PBFT, quorum requires 2f+1 out of 3f+1 validators. In weighted PBFT, the equivalent condition is that the aggregate effective weight of the agreeing validators exceeds 2/3 of the total effective weight. This threshold is configurable but defaults to 2/3 (0.6667).

The `QuorumChecker` takes the current weight vector (from `WeightCalculator`) and provides two primary methods: `has_quorum(signers: &[PublicKey])` which returns a boolean, and `quorum_margin(signers: &[PublicKey])` which returns the margin above or below the threshold (positive means quorum met, negative means quorum not met, with the magnitude indicating how much additional weight is needed).

The quorum checker must handle edge cases robustly: if a signer is not in the current validator set, their weight contribution is zero (not an error). If the weight vector is empty, quorum is never met. The checker must also support a "super-quorum" mode for governance parameter changes that requires a higher threshold (configurable, default 3/4 or 0.75). The quorum check must be constant-time with respect to the number of signers (no timing side channels that reveal how many validators have signed).

**Acceptance Criteria**:

- `has_quorum(signers)` returns `true` when aggregate weight of signers exceeds 2/3 of total weight
- `has_quorum(signers)` returns `false` when aggregate weight is at or below the threshold
- `quorum_margin(signers)` returns a positive float when quorum is met and negative when not met
- Unknown signers (not in validator set) contribute zero weight (no error raised)
- Empty weight vector means quorum is never achievable
- Super-quorum mode with configurable threshold (default 3/4) is supported for governance changes
- Quorum check is constant-time with respect to the number of signers (verified via timing test)
- `QuorumChecker` is stateless and can be reconstructed from any weight vector
- Quorum determination is deterministic across all validators (same weight vector and signer set produces identical result)
- Unit tests cover: exact threshold boundary (just below, exactly at, just above), single validator with majority weight, all validators signing, no validators signing
- At least 8 hand-computed test vectors covering diverse weight distributions

**Dependencies**:

- PANX-US-002 (Weight calculation providing the effective weight vector)

**Definition of Done**:

- `QuorumChecker` implemented in `gtcx-consensus/src/validator/quorum.rs`
- Unit tests with hand-computed quorum calculations for at least 8 scenarios
- Timing test verifying constant-time behavior (variance < 5% across different signer set sizes)
- Property-based test: adding a signer never decreases the quorum margin
- Doc comments describe the weighted quorum model and its relationship to Byzantine fault tolerance
- Code reviewed and approved

---

## Sprint 16: PBFT Message Flow

**Sprint Goal**: Implement the complete PBFT consensus message flow -- pre-prepare, prepare, commit, reply, and view change -- with Ed25519 signatures on every message, enabling the network to reach agreement on transaction ordering despite Byzantine faults.

**Sprint Points**: 13

### PANX-US-004: Pre-Prepare Phase

**Story ID**: PANX-US-004
**Priority**: P0
**Story Points**: 3
**Sprint**: 16
**Assignee**: Unassigned

**User Story**:
As a consensus leader, I want to broadcast a signed pre-prepare message containing a proposed transaction batch and sequence number, so that all validators can begin the agreement process for this batch.

**Description**:
Implement the pre-prepare phase of weighted PBFT in `gtcx-consensus/src/consensus/pre_prepare.rs`. The leader for the current view selects pending transactions from the transaction pool, assigns a monotonically increasing sequence number, constructs a `PrePrepareMessage` containing the view number, sequence number, a digest of the transaction batch (SHA-256 hash), and the full transaction batch. The leader signs the message with its Ed25519 private key and broadcasts it to all validators via the network layer.

Upon receiving a pre-prepare message, a validator performs the following checks before accepting it: (1) the message is from the current view's leader, (2) the view number matches the validator's current view, (3) the sequence number is within the acceptable window (between the low and high watermarks), (4) the validator has not already accepted a pre-prepare for this view and sequence number with a different digest, (5) the Ed25519 signature is valid. If all checks pass, the validator accepts the pre-prepare and transitions to the prepare phase. If any check fails, the message is rejected and the rejection reason is logged.

The pre-prepare message format must be deterministic and serializable via `serde` and protobuf. The transaction batch digest must be computed in a canonical way (sorted transaction hashes, then SHA-256 of the concatenation) to ensure all validators compute the same digest independently. The sequence number watermark window is configurable with a default range of [last_committed + 1, last_committed + 300].

**Acceptance Criteria**:

- `PrePrepareMessage` struct contains: view, sequence_number, batch_digest, transaction_batch, leader_signature
- Leader constructs pre-prepare with monotonically increasing sequence number
- Batch digest is computed canonically: sorted transaction hashes concatenated and SHA-256 hashed
- Ed25519 signature covers: view || sequence_number || batch_digest (deterministic signing payload)
- Validators reject pre-prepare from non-leader for the current view
- Validators reject pre-prepare with mismatched view number
- Validators reject pre-prepare with sequence number outside watermark window
- Validators reject pre-prepare if a different digest was already accepted for the same (view, sequence)
- Validators reject pre-prepare with invalid Ed25519 signature
- Valid pre-prepare transitions the validator to the prepare phase
- `PrePrepareMessage` serializes/deserializes via serde and maps to protobuf
- All rejection reasons are logged with structured context (view, sequence, reason)

**Dependencies**:

- PANX-US-001 (Validator registry for leader determination)
- PANX-US-003 (Quorum checker for downstream phases)
- Phase 0 Ed25519 signing in `gtcx-crypto` (DONE)
- Phase 3 network broadcast primitives (DONE)

**Definition of Done**:

- Pre-prepare construction and validation implemented in `gtcx-consensus/src/consensus/pre_prepare.rs`
- Leader selection logic implemented (round-robin by view number within sorted validator set)
- Unit tests: valid pre-prepare acceptance, each rejection condition, signature verification, deterministic digest
- Integration test: leader broadcasts pre-prepare and all honest validators accept it
- Message format documented in doc comments with field-level descriptions
- Code reviewed and approved

---

### PANX-US-005: Prepare Phase

**Story ID**: PANX-US-005
**Priority**: P0
**Story Points**: 3
**Sprint**: 16
**Assignee**: Unassigned

**User Story**:
As a validator that has accepted a pre-prepare, I want to broadcast a signed prepare message and collect prepare messages from other validators, so that the network can verify broad agreement before committing.

**Description**:
Implement the prepare phase in `gtcx-consensus/src/consensus/prepare.rs`. After accepting a valid pre-prepare, each validator constructs a `PrepareMessage` containing the view number, sequence number, batch digest, and the validator's public key, then signs it with their Ed25519 private key and broadcasts it to all other validators.

Each validator collects prepare messages from other validators and checks: (1) the prepare is for the same view and sequence number as the accepted pre-prepare, (2) the batch digest matches the accepted pre-prepare's digest, (3) the Ed25519 signature is valid, (4) the sender is a registered validator in the current validator set. A validator considers itself "prepared" when it has received valid prepare messages whose aggregate effective weight (computed via `WeightCalculator`) meets the weighted quorum threshold (via `QuorumChecker`). This is the key difference from standard PBFT: instead of counting 2f prepare messages, the engine sums the effective weights of the preparing validators and checks against the weighted 2/3 threshold.

The prepare phase must handle late-arriving messages gracefully. Prepare messages that arrive after the validator has already reached the prepared state are stored but do not trigger re-evaluation (idempotent). Prepare messages for future views or sequence numbers are buffered for later processing. A configurable timeout (default 5 seconds) triggers a view change if the prepared state is not reached within the timeout window.

**Acceptance Criteria**:

- `PrepareMessage` struct contains: view, sequence_number, batch_digest, sender_public_key, signature
- Validator broadcasts prepare after accepting a valid pre-prepare
- Ed25519 signature covers: view || sequence_number || batch_digest || sender_public_key
- Duplicate prepare messages from the same validator are ignored (idempotent)
- Prepare messages from unknown validators are rejected
- Prepare messages with invalid signatures are rejected
- "Prepared" state is reached when aggregate weight of valid prepares meets weighted quorum threshold
- Late-arriving prepares after "prepared" state are stored but do not re-trigger state transition
- Prepare messages for future views are buffered (not rejected)
- Configurable timeout (default 5 seconds) triggers view change if prepared state is not reached
- Weighted quorum is verified using `QuorumChecker::has_quorum`
- All prepare message events are logged with structured context

**Dependencies**:

- PANX-US-004 (Pre-prepare phase producing accepted pre-prepare)
- PANX-US-002 (Weight calculator for effective weights)
- PANX-US-003 (Quorum checker for weighted quorum determination)

**Definition of Done**:

- Prepare phase implemented in `gtcx-consensus/src/consensus/prepare.rs`
- Unit tests: valid prepare collection, quorum detection at exact threshold, signature rejection, duplicate handling, timeout trigger
- Property-based test: adding valid prepares monotonically increases aggregate weight toward quorum
- Integration test: N validators exchange prepares and all reach "prepared" state
- Code reviewed and approved

---

### PANX-US-006: Commit Phase

**Story ID**: PANX-US-006
**Priority**: P0
**Story Points**: 2
**Sprint**: 16
**Assignee**: Unassigned

**User Story**:
As a prepared validator, I want to broadcast a signed commit message and collect commits from other validators, so that the transaction batch can be finalized when sufficient weighted agreement is reached.

**Description**:
Implement the commit phase in `gtcx-consensus/src/consensus/commit.rs`. Once a validator reaches the "prepared" state, it constructs a `CommitMessage` containing the view number, sequence number, batch digest, and the validator's public key, signs it with Ed25519, and broadcasts it to all validators.

The commit phase mirrors the prepare phase structurally but represents a stronger guarantee: a validator that sends a commit message is asserting that it has observed a weighted quorum of prepare messages and is ready to finalize. The validator collects commit messages and reaches the "committed" state when the aggregate effective weight of valid commit messages meets the weighted quorum threshold. At this point, the transaction batch is considered finalized and can be applied to the local state.

The commit message format intentionally overlaps with the prepare message format (same fields) to simplify implementation, but the message type discriminator differentiates them on the wire. The committed state is the point of no return: once a validator commits, it must not accept a conflicting decision for the same sequence number. This invariant is enforced by storing the committed digest in a persistent commit log (see PANX-US-012) and checking against it before accepting any new pre-prepare for the same sequence number.

**Acceptance Criteria**:

- `CommitMessage` struct contains: view, sequence_number, batch_digest, sender_public_key, signature
- Validator broadcasts commit only after reaching "prepared" state
- Ed25519 signature covers: view || sequence_number || batch_digest || sender_public_key
- "Committed" state is reached when aggregate weight of valid commits meets weighted quorum threshold
- Committed digest is stored persistently to prevent conflicting commits for the same sequence number
- Duplicate commit messages from the same validator are ignored
- Commit messages with invalid signatures are rejected
- Commit messages from unknown validators are rejected
- Committed state triggers transaction batch application to local state
- Committed batches are delivered to the application layer via a callback or channel
- The commit phase completes within the sub-3-second finality target

**Dependencies**:

- PANX-US-005 (Prepare phase producing "prepared" state)
- PANX-US-003 (Quorum checker for weighted quorum)

**Definition of Done**:

- Commit phase implemented in `gtcx-consensus/src/consensus/commit.rs`
- Unit tests: valid commit collection, quorum detection, duplicate handling, signature rejection, conflict prevention
- Integration test: N validators complete full pre-prepare -> prepare -> commit flow
- Latency benchmark: full consensus round completes in < 3 seconds with 20 validators on localhost
- Code reviewed and approved

---

### PANX-US-007: Reply with Aggregate Proof

**Story ID**: PANX-US-007
**Priority**: P0
**Story Points**: 2
**Sprint**: 16
**Assignee**: Unassigned

**User Story**:
As a consensus engine, I want to produce a reply message containing an aggregate proof of consensus (the collection of commit signatures), so that clients can verify that a transaction batch was committed by a weighted quorum of validators.

**Description**:
Implement the reply phase in `gtcx-consensus/src/consensus/reply.rs`. After reaching the "committed" state, the consensus engine constructs a `ReplyMessage` that serves as a certificate of consensus. The reply contains: the view number, sequence number, batch digest, and an aggregate proof consisting of all valid commit signatures collected during the commit phase along with the corresponding public keys and their effective weights.

The aggregate proof allows any external verifier to independently confirm that a weighted quorum of validators committed to the batch digest. The verifier re-computes the aggregate weight of the signers and checks it against the quorum threshold, then verifies each individual Ed25519 signature. While a future optimization could use BLS aggregate signatures to reduce proof size, the initial implementation uses the full set of individual Ed25519 signatures for simplicity and auditability.

The reply message is sent to the original client that submitted the transaction batch and also persisted locally as part of the consensus log. The reply includes a `consensus_certificate` field that can be referenced by the KORA certificate system (linking to `certificate.proto`). The reply message is the final output of a successful consensus round and represents the cryptographic proof that the network agreed on the transaction ordering.

**Acceptance Criteria**:

- `ReplyMessage` struct contains: view, sequence_number, batch_digest, aggregate_proof, consensus_certificate_id
- Aggregate proof contains: list of (public_key, signature, effective_weight) tuples for all committing validators
- External verifier can re-compute aggregate weight and verify it meets quorum threshold
- Each individual Ed25519 signature in the aggregate proof is independently verifiable
- Reply is sent to the client that submitted the transaction batch
- Reply is persisted in the local consensus log
- `consensus_certificate_id` links to the KORA certificate system (references `certificate.proto`)
- Reply construction completes within 100 milliseconds of reaching committed state
- Reply message serializes/deserializes via serde and maps to protobuf
- `verify_aggregate_proof(reply, weight_vector, threshold)` returns true for valid proofs and false for tampered proofs
- Aggregate proof size scales linearly with the number of committing validators

**Dependencies**:

- PANX-US-006 (Commit phase producing committed state and collecting signatures)
- `certificate.proto` definitions (DONE)

**Definition of Done**:

- Reply phase implemented in `gtcx-consensus/src/consensus/reply.rs`
- `verify_aggregate_proof` function implemented for external verification
- Unit tests: valid proof verification, tampered signature detection, weight threshold verification, serialization round-trip
- Integration test: full consensus round produces a verifiable reply
- Doc comments describe the aggregate proof format and verification algorithm
- Code reviewed and approved

---

### PANX-US-008: View Change Protocol

**Story ID**: PANX-US-008
**Priority**: P0
**Story Points**: 3
**Sprint**: 16
**Assignee**: Unassigned

**User Story**:
As a consensus participant, I want the network to automatically recover from a failed or Byzantine leader by electing a new leader through a view change protocol, so that consensus progress is not blocked by a single faulty node.

**Description**:
Implement the view change protocol in `gtcx-consensus/src/consensus/view_change.rs`. When a validator suspects the current leader has failed (due to a timeout waiting for a pre-prepare, or receiving conflicting pre-prepares from the leader), it initiates a view change by broadcasting a `ViewChangeMessage`. The view change message contains: the new proposed view number (current view + 1), the validator's last committed sequence number, a set of prepared certificates (proofs of any in-progress but uncommitted consensus rounds), and the validator's Ed25519 signature.

The new leader for the proposed view (determined by `(view_number % validator_count)` applied to the sorted validator set) collects view change messages. When it has received view change messages whose aggregate effective weight meets the weighted quorum threshold, it constructs a `NewViewMessage` containing: the new view number, the set of received view change messages as proof, and any re-proposed pre-prepare messages for uncommitted sequences that had reached the prepared state in the previous view. The new leader broadcasts the new view message, and validators transition to the new view and resume normal consensus operation.

The view change protocol must complete within 2 rounds of message exchange (view change messages in round 1, new view message in round 2) to minimize disruption. A view change timer with exponential backoff (starting at 10 seconds, doubling per consecutive view change, capped at 60 seconds) prevents rapid view changes from destabilizing the network. The protocol must preserve the safety invariant: no committed transaction is ever lost or contradicted across view changes.

**Acceptance Criteria**:

- `ViewChangeMessage` struct contains: new_view, last_committed_sequence, prepared_certificates, sender_public_key, signature
- `NewViewMessage` struct contains: new_view, view_change_proofs, re_proposed_pre_prepares, leader_signature
- View change is triggered by configurable timeout (default 10 seconds) or conflicting pre-prepares
- New leader is determined by `view_number % validator_count` on the sorted validator set
- New leader constructs new view message after receiving weighted quorum of view change messages
- View change completes within 2 rounds of message exchange
- Exponential backoff timer: 10s, 20s, 40s, 60s (capped) for consecutive view changes
- Safety invariant: committed transactions are never contradicted across view changes
- Uncommitted prepared sequences are re-proposed by the new leader in the new view message
- Validators reject new view messages with insufficient view change proof weight
- View change messages with invalid signatures are rejected
- The protocol handles concurrent view change attempts (multiple validators triggering simultaneously)

**Dependencies**:

- PANX-US-004 through PANX-US-006 (Normal consensus flow that view change recovers from)
- PANX-US-003 (Quorum checker for weighted quorum of view change messages)

**Definition of Done**:

- View change protocol implemented in `gtcx-consensus/src/consensus/view_change.rs`
- Unit tests: timeout-triggered view change, conflicting pre-prepare triggered view change, new leader selection, re-proposal of uncommitted sequences, exponential backoff
- Safety test: committed transaction is preserved across 10 consecutive view changes
- Integration test: leader crash triggers view change and consensus resumes with new leader
- Liveness test: progress continues after view change within 2 rounds
- Code reviewed and approved

---

## Sprint 17: Integration and Hardening

**Sprint Goal**: Verify Byzantine fault tolerance through adversarial simulation, validate performance against the sub-3-second finality and 5000+ TPS targets, and establish a hash-chained audit trail for forensic analysis of consensus decisions.

**Sprint Points**: 5

### PANX-US-009: Byzantine Fault Tolerance Verification

**Story ID**: PANX-US-009
**Priority**: P0
**Story Points**: 2
**Sprint**: 17
**Assignee**: Unassigned

**User Story**:
As a security engineer, I want to verify through adversarial simulation that the weighted PBFT implementation tolerates up to f Byzantine faults where f < n/3 by total weight, so that I have empirical confidence in the consensus engine's correctness under attack.

**Description**:
Implement a comprehensive adversarial simulation framework in `gtcx-consensus/tests/adversarial.rs` that runs 10,000 consensus rounds with configurable Byzantine behavior. The simulation framework instantiates N validators (configurable, default 20) with realistic tier-weighted distributions and introduces f Byzantine validators that exhibit a range of adversarial behaviors: (1) equivocation (sending conflicting messages to different validators), (2) message withholding (selectively dropping messages), (3) message reordering (delivering messages out of order), (4) invalid signatures (sending messages with corrupted signatures), (5) coalition attacks (Byzantine validators coordinating to maximize disruption).

The simulation must verify three properties across all 10,000 rounds: **safety** (no two honest validators commit different values for the same sequence number), **liveness** (every proposed transaction is eventually committed as long as the leader is honest or a view change succeeds), and **weight integrity** (Byzantine validators cannot accumulate more than their allocated weight even by equivocating). The simulation uses a deterministic network simulator with configurable message delays (uniform random in [0, 100ms]) and message loss rates (configurable, default 5%).

Each simulation run produces a report containing: rounds completed, rounds where Byzantine validators were detected, safety violations (must be zero), liveness violations (must be zero if f < n/3 by weight), average commit latency, and view changes triggered. The simulation is seeded for reproducibility and can replay specific failure scenarios.

**Acceptance Criteria**:

- Adversarial simulation framework runs 10,000 consensus rounds
- Configurable number of validators (default 20) with tier-weighted distributions
- Five adversarial behavior types implemented: equivocation, withholding, reordering, invalid signatures, coalition
- Safety property verified: zero conflicting commits across all 10,000 rounds
- Liveness property verified: all transactions committed when f < n/3 by weight
- Weight integrity verified: Byzantine validators cannot exceed allocated weight
- Network simulator supports configurable delays (default [0, 100ms]) and message loss (default 5%)
- Simulation is deterministic and reproducible from a seed
- Simulation report includes: rounds, detections, safety violations, liveness violations, latency, view changes
- Simulation completes within 10 minutes on CI hardware
- At least 3 specific failure scenarios are documented and reproducible via seed

**Dependencies**:

- PANX-US-004 through PANX-US-008 (Complete PBFT message flow including view change)

**Definition of Done**:

- Adversarial simulation framework implemented in `gtcx-consensus/tests/adversarial.rs`
- 10,000-round simulation passes with zero safety and liveness violations
- Five adversarial behavior types tested individually and in combination
- Simulation report generation and seed-based replay implemented
- CI integration: simulation runs on every PR (may use reduced round count of 1,000 for speed)
- Code reviewed and approved

---

### PANX-US-010: Performance Benchmarking

**Story ID**: PANX-US-010
**Priority**: P0
**Story Points**: 2
**Sprint**: 17
**Assignee**: Unassigned

**User Story**:
As a platform engineer, I want to benchmark the consensus engine's finality latency and throughput so that I can verify it meets the sub-3-second finality and 5000+ TPS targets specified in the PANX architecture.

**Description**:
Implement a comprehensive benchmark suite in `gtcx-consensus/benches/consensus_bench.rs` using the `criterion` benchmarking framework. The benchmark suite measures three primary metrics: (1) **finality latency** -- the wall-clock time from transaction submission to committed reply, measured at various validator counts (4, 10, 20, 50, 100), (2) **throughput** -- the number of transactions per second the consensus engine can sustain under continuous load, measured with varying batch sizes (1, 10, 100, 1000 transactions per batch), (3) **view change latency** -- the time from leader failure detection to resumed consensus under the new leader.

The benchmarks use a simulated network with configurable latency (default 10ms per hop for localhost simulation, 50ms for WAN simulation). Each benchmark configuration is run for at least 100 iterations to establish statistical significance. The benchmark produces a report with median, p95, p99, and max latencies, as well as throughput in TPS. The benchmarks must be reproducible and run as part of the CI pipeline with regression detection (alert if latency increases by more than 10% compared to the baseline).

The performance targets are: finality latency < 3 seconds with 20 validators on simulated 10ms network, throughput > 5,000 TPS with batch size 100 and 20 validators, view change latency < 5 seconds with 20 validators. These targets must be met for the epic to be considered complete.

**Acceptance Criteria**:

- Finality latency benchmarked at validator counts: 4, 10, 20, 50, 100
- Throughput benchmarked at batch sizes: 1, 10, 100, 1000 transactions
- View change latency benchmarked with 20 validators
- Simulated network with configurable per-hop latency (10ms localhost, 50ms WAN)
- Each configuration runs at least 100 iterations
- Report includes: median, p95, p99, max latency, and TPS
- Finality latency < 3 seconds with 20 validators on 10ms network (MUST PASS)
- Throughput > 5,000 TPS with batch size 100 and 20 validators (MUST PASS)
- View change latency < 5 seconds with 20 validators (MUST PASS)
- CI integration with regression detection (10% threshold)
- Benchmark results stored as JSON for historical comparison
- `criterion` HTML reports generated for visual analysis

**Dependencies**:

- PANX-US-004 through PANX-US-008 (Complete PBFT message flow)
- `criterion` crate dependency in `gtcx-consensus/Cargo.toml`

**Definition of Done**:

- Benchmark suite implemented in `gtcx-consensus/benches/consensus_bench.rs`
- All three performance targets met and documented
- CI pipeline integration with regression detection
- Baseline results committed to repository for comparison
- Code reviewed and approved

---

### PANX-US-011: Hash-Chained Consensus Audit Trail

**Story ID**: PANX-US-011
**Priority**: P1
**Story Points**: 1
**Sprint**: 17
**Assignee**: Unassigned

**User Story**:
As an auditor, I want every consensus decision to be recorded in a hash-chained audit log so that the history of consensus decisions is tamper-evident and can be independently verified.

**Description**:
Implement a hash-chained audit trail in `gtcx-consensus/src/audit.rs` that records every consensus event (pre-prepare accepted, prepare quorum reached, commit quorum reached, reply sent, view change initiated, view change completed) as an entry in an append-only log. Each entry contains: a monotonically increasing entry number, a timestamp, the event type, the event payload (view, sequence, batch digest, participants), and a hash that chains to the previous entry (`entry_hash = SHA-256(prev_hash || entry_number || timestamp || event_type || event_payload)`).

The hash chain ensures that any tampering with historical entries is detectable: verifying the chain from genesis to the latest entry confirms integrity. The audit trail integrates with the `gtcx-crypto::audit` module for standardized audit event formatting. The trail is persisted to durable storage via the same `sled`-backed store used for consensus state (PANX-US-012), ensuring that audit entries survive crashes. The audit log supports efficient verification: a verifier can check the chain integrity without replaying the full consensus protocol.

**Acceptance Criteria**:

- Every consensus event (pre-prepare, prepare quorum, commit quorum, reply, view change) is recorded
- Each entry contains: entry_number, timestamp, event_type, event_payload, prev_hash, entry_hash
- Hash chain formula: `entry_hash = SHA-256(prev_hash || entry_number || timestamp || event_type || payload)`
- Genesis entry has `prev_hash = [0u8; 32]`
- Tampering with any entry invalidates the chain from that point forward
- `verify_chain(entries)` returns `true` for an untampered chain and `false` with the first invalid entry index for a tampered chain
- Audit trail integrates with `gtcx-crypto::audit` for event formatting
- Audit entries are persisted to sled-backed durable storage
- Audit log is append-only: no update or delete operations are exposed
- Chain verification completes in under 1 second for 100,000 entries

**Dependencies**:

- PANX-US-004 through PANX-US-008 (Consensus events to audit)
- `gtcx-crypto::audit` module (DONE)

**Definition of Done**:

- Hash-chained audit trail implemented in `gtcx-consensus/src/audit.rs`
- Unit tests: chain integrity verification, tamper detection, genesis entry, append-only enforcement
- Performance test: chain verification for 100,000 entries < 1 second
- Integration with `gtcx-crypto::audit` module verified
- Code reviewed and approved

---

## Sprint 18: Persistence and Recovery

**Sprint Goal**: Implement durable consensus state persistence with WAL-based crash recovery, periodic snapshots for fast recovery, safe validator rotation without consensus interruption, and epoch-based timeline management with weight recalculation at epoch boundaries.

**Sprint Points**: 11

### PANX-US-012: Consensus State Persistence

**Story ID**: PANX-US-012
**Priority**: P0
**Story Points**: 3
**Sprint**: 18
**Assignee**: Unassigned

**User Story**:
As a consensus participant, I want the consensus engine to persist its state (current view, sequence number, committed log, and in-progress round state) to durable storage, so that it can recover after a crash without violating safety or liveness guarantees.

**Description**:
Implement consensus state persistence in `gtcx-consensus/src/persistence/state.rs` using a write-ahead log (WAL) pattern. Every state-mutating operation in the consensus engine -- accepting a pre-prepare, collecting a prepare, collecting a commit, committing a batch, initiating a view change, completing a view change -- is first written to the WAL before being applied to the in-memory state. The WAL is implemented on top of `sled` for durable, crash-safe storage with its built-in transactional guarantees.

The persisted state includes: (1) the current view number, (2) the current sequence number, (3) the committed log (mapping from sequence number to committed batch digest and aggregate proof), (4) in-progress round state (any pre-prepare accepted but not yet committed, along with collected prepare and commit messages), (5) the last stable checkpoint sequence number (see PANX-US-013). On startup, the recovery procedure reads the WAL from the last stable checkpoint, replays all entries to reconstruct the in-memory state, and resumes consensus from the recovered state.

The WAL must handle the case where a crash occurs mid-write (partial entry). Each WAL entry includes a CRC-32 checksum that is verified during recovery; entries with invalid checksums are discarded (they represent incomplete writes). The recovery procedure must be idempotent: replaying the same WAL entries multiple times produces the same state. The persisted state must be compact; old WAL entries that precede the last stable checkpoint are eligible for garbage collection (truncation).

**Acceptance Criteria**:

- Every state-mutating consensus operation is written to the WAL before in-memory application
- WAL is implemented on `sled` with transactional guarantees
- Persisted state includes: view number, sequence number, committed log, in-progress rounds, last checkpoint
- Recovery reads the WAL from the last checkpoint and replays entries to reconstruct state
- Each WAL entry includes a CRC-32 checksum for integrity verification
- Entries with invalid CRC-32 (partial writes) are discarded during recovery
- Recovery is idempotent: replaying the same WAL entries produces identical state
- WAL entries preceding the last stable checkpoint are eligible for garbage collection
- Recovery completes within 5 seconds for a WAL with 10,000 entries
- Safety invariant: recovered state never contradicts previously committed decisions
- Liveness invariant: recovered node can rejoin consensus within one view change timeout
- Unit tests simulate crash at each state mutation point and verify correct recovery

**Dependencies**:

- PANX-US-004 through PANX-US-008 (Consensus state to persist)
- `sled` crate dependency in `gtcx-consensus/Cargo.toml`

**Definition of Done**:

- WAL-based persistence implemented in `gtcx-consensus/src/persistence/state.rs`
- Recovery procedure implemented and tested
- Crash simulation tests: crash after each state mutation type and verify recovery
- CRC-32 validation tested with corrupted entries
- Idempotency test: double-replay produces identical state
- Performance test: recovery of 10,000 WAL entries < 5 seconds
- Code reviewed and approved

---

### PANX-US-013: Checkpoint and Snapshot

**Story ID**: PANX-US-013
**Priority**: P0
**Story Points**: 3
**Sprint**: 18
**Assignee**: Unassigned

**User Story**:
As a consensus participant, I want the engine to create periodic state snapshots (checkpoints) so that crash recovery can start from the latest snapshot instead of replaying the entire WAL from genesis, enabling fast recovery.

**Description**:
Implement periodic checkpointing in `gtcx-consensus/src/persistence/checkpoint.rs`. A checkpoint captures the full consensus state at a specific sequence number: the committed log up to that point, the current validator set with weights, the current view number, and a hash of the entire state. Checkpoints are created at configurable intervals (default: every 100 committed sequences) and are persisted to `sled` alongside the WAL.

When a checkpoint is created, the consensus engine broadcasts a `CheckpointMessage` to all validators containing the sequence number and state hash. When a validator receives checkpoint messages for the same sequence number and state hash from a weighted quorum of validators, it considers the checkpoint "stable." A stable checkpoint means all validators agree on the state at that sequence number, and the WAL can be safely truncated up to that point. This prevents unbounded WAL growth and ensures that recovery starts from a known-good state agreed upon by the network.

The checkpoint must be self-contained: a node recovering from a checkpoint should not need any WAL entries prior to the checkpoint to reconstruct its state. The checkpoint format includes a version number for forward compatibility. Old checkpoints (more than 3 stable checkpoints behind the latest) are garbage collected to reclaim storage.

**Acceptance Criteria**:

- Checkpoints are created at configurable intervals (default: every 100 committed sequences)
- Checkpoint captures: committed log, validator set with weights, view number, state hash
- `CheckpointMessage` contains: sequence_number, state_hash, sender_public_key, signature
- Checkpoint becomes "stable" when a weighted quorum of validators agree on the same (sequence, state_hash)
- Stable checkpoint allows WAL truncation up to the checkpoint sequence number
- Recovery from checkpoint does not require any WAL entries before the checkpoint
- Checkpoint format includes a version number for forward compatibility
- Old checkpoints (> 3 behind latest stable) are garbage collected
- Checkpoint creation completes within 500 milliseconds
- State hash is computed deterministically (same state always produces the same hash)
- Unit tests: checkpoint creation, stability detection, WAL truncation, recovery from checkpoint
- Recovery from checkpoint + subsequent WAL produces identical state to uninterrupted operation

**Dependencies**:

- PANX-US-012 (WAL-based persistence that checkpoints complement)
- PANX-US-003 (Quorum checker for stable checkpoint agreement)

**Definition of Done**:

- Checkpoint and snapshot system implemented in `gtcx-consensus/src/persistence/checkpoint.rs`
- Unit tests: creation, stability, truncation, recovery, garbage collection
- Integration test: node recovers from checkpoint + WAL replay and reaches same state as peers
- Performance test: checkpoint creation < 500ms for state with 10,000 committed entries
- Code reviewed and approved

---

### PANX-US-014: Validator Rotation

**Story ID**: PANX-US-014
**Priority**: P0
**Story Points**: 3
**Sprint**: 18
**Assignee**: Unassigned

**User Story**:
As a network operator, I want to add and remove validators without stopping the consensus engine, so that the validator set can evolve over time as organizations join or leave the network.

**Description**:
Implement a safe validator rotation protocol in `gtcx-consensus/src/validator/rotation.rs`. Validator set changes (additions and removals) are themselves proposed as special consensus transactions that go through the normal PBFT flow. This ensures that all honest validators agree on the new validator set at the same sequence number, preventing split-brain scenarios where different validators have different views of the validator set.

The rotation protocol works as follows: (1) A rotation proposal transaction is submitted containing the proposed change (add validator with tier assignment, or remove validator by public key). (2) The proposal goes through the normal pre-prepare -> prepare -> commit flow. (3) Upon commit, all validators apply the change at the next epoch boundary (see PANX-US-015), not immediately. This deferred application ensures that in-progress consensus rounds are not disrupted by mid-round validator set changes. (4) The new validator set is recorded in the next epoch's checkpoint.

Adding a validator requires the new validator to synchronize its state before becoming an active participant. The rotation protocol includes a "sync" phase where the new validator receives the latest stable checkpoint and replays the WAL from that point. The new validator does not participate in consensus until it has caught up to the current sequence number. Removing a validator takes effect at the epoch boundary; the removed validator's weight is redistributed among the remaining validators in its tier.

**Acceptance Criteria**:

- Validator additions and removals are proposed as consensus transactions through normal PBFT flow
- All honest validators apply the change at the same sequence number (the epoch boundary)
- Validator set changes do not disrupt in-progress consensus rounds
- New validators synchronize state via latest stable checkpoint + WAL replay before participating
- New validators do not participate in consensus until state synchronization is complete
- Removed validators' weight is redistributed among remaining validators in the tier at epoch boundary
- Rotation proposals require super-quorum approval (3/4 weighted threshold via `QuorumChecker`)
- Concurrent rotation proposals are serialized (one change per epoch to prevent cascading reconfigurations)
- The protocol handles the edge case of removing the current leader (triggers view change)
- Rotation is recorded in the epoch checkpoint for auditability
- Unit tests: add validator, remove validator, remove leader, concurrent proposals, sync phase
- Safety: no committed transactions are lost during rotation

**Dependencies**:

- PANX-US-001 (Validator registry to modify)
- PANX-US-004 through PANX-US-006 (Consensus flow for rotation proposals)
- PANX-US-013 (Checkpoints for new validator synchronization)
- PANX-US-015 (Epoch boundaries for deferred application)

**Definition of Done**:

- Rotation protocol implemented in `gtcx-consensus/src/validator/rotation.rs`
- State synchronization for new validators implemented
- Unit tests: all acceptance criteria scenarios
- Integration test: add validator mid-operation, remove validator mid-operation, network continues without disruption
- Safety test: no committed transactions lost during rotation
- Code reviewed and approved

---

### PANX-US-015: Epoch Management

**Story ID**: PANX-US-015
**Priority**: P1
**Story Points**: 2
**Sprint**: 18
**Assignee**: Unassigned

**User Story**:
As a consensus engine, I want to divide the consensus timeline into epochs with defined boundaries, so that validator set changes, weight recalculations, and reputation updates are applied at predictable, coordinated points.

**Description**:
Implement epoch management in `gtcx-consensus/src/epoch.rs`. An epoch is a contiguous range of sequence numbers with a fixed validator set and fixed weight assignments. Epochs provide a coordination mechanism for applying changes that affect the consensus parameters: validator additions/removals (PANX-US-014), reputation score updates (PANX-US-002), stake changes, and governance parameter updates (PANX-US-017).

Each epoch is defined by: an epoch number (monotonically increasing), the starting sequence number, the ending sequence number (or "open" if the epoch is current), the validator set for the epoch, the weight vector for the epoch, and the epoch's configuration parameters (quorum threshold, timeout values, batch size limits). Epochs have a configurable length (default: 1000 committed sequences). At the epoch boundary, the engine: (1) creates a stable checkpoint, (2) applies any pending validator set changes, (3) recalculates effective weights using updated reputation scores and stakes, (4) applies any pending governance parameter changes, (5) transitions to the new epoch.

The epoch transition is atomic from the consensus perspective: all validators must transition at the same sequence number. This is enforced by the checkpoint stability protocol (PANX-US-013). The epoch history is persisted and queryable for forensic analysis (e.g., "what was the validator set during epoch 47?"). Each epoch boundary checkpoint includes the full epoch metadata, making it self-describing.

**Acceptance Criteria**:

- Epochs are identified by a monotonically increasing epoch number
- Each epoch has a fixed validator set, weight vector, and configuration parameters
- Epoch length is configurable (default: 1000 committed sequences)
- Epoch boundary triggers: checkpoint creation, validator set change application, weight recalculation, parameter updates
- All validators transition to the new epoch at the same sequence number
- Epoch history is persisted and queryable by epoch number
- Epoch boundary checkpoint includes full epoch metadata (validator set, weights, parameters)
- Per-epoch weight recalculation uses updated reputation scores and stake deposits
- `EpochManager` provides `current_epoch()`, `get_epoch(number)`, `epoch_at_sequence(seq)` methods
- Epoch transition completes within 2 seconds
- Unit tests: epoch creation, boundary detection, transition, history query, parameter application

**Dependencies**:

- PANX-US-002 (Weight calculator for per-epoch weight recalculation)
- PANX-US-013 (Checkpoint system for epoch boundary checkpoints)
- PANX-US-014 (Validator rotation applied at epoch boundaries)

**Definition of Done**:

- Epoch management implemented in `gtcx-consensus/src/epoch.rs`
- Unit tests: epoch lifecycle, boundary detection, transition atomicity, history queries
- Integration test: epoch transition with validator set change and weight recalculation
- Performance test: epoch transition completes in < 2 seconds
- Doc comments describe epoch semantics and coordination guarantees
- Code reviewed and approved

---

## Sprint 19: Observability and Governance

**Sprint Goal**: Deliver comprehensive consensus metrics with Prometheus export, a governance proposal system for on-chain parameter changes, and a slashing framework for detecting and penalizing provably Byzantine behavior.

**Sprint Points**: 8

### PANX-US-016: Consensus Metrics and Observability

**Story ID**: PANX-US-016
**Priority**: P1
**Story Points**: 3
**Sprint**: 19
**Assignee**: Unassigned

**User Story**:
As a platform operator, I want to monitor consensus health through detailed metrics -- including round latency, message counts, quorum margins, and view change frequency -- so that I can detect degradation and diagnose issues before they impact availability.

**Description**:
Implement a comprehensive metrics subsystem in `gtcx-consensus/src/metrics.rs` that instruments every phase of the consensus engine. The metrics subsystem collects and exposes the following metric categories:

**Latency metrics** (histograms): pre-prepare-to-commit latency (finality time), pre-prepare broadcast time, prepare phase duration, commit phase duration, view change duration, reply construction time. Each histogram uses configurable bucket boundaries optimized for the expected latency ranges (e.g., [0.1s, 0.5s, 1s, 2s, 3s, 5s, 10s] for finality time).

**Counter metrics**: total consensus rounds completed, total rounds failed, total view changes initiated, total view changes completed, total messages sent (by type), total messages received (by type), total messages rejected (by reason), total Byzantine behaviors detected, total transactions committed.

**Gauge metrics**: current view number, current sequence number, current epoch number, active validator count, pending transaction count, WAL size (bytes), latest checkpoint sequence number, quorum margin of the most recent round (how much weight exceeded the threshold).

All metrics are exposed via a Prometheus-compatible HTTP endpoint (`/metrics`) using the `prometheus` crate. Labels are used to differentiate metrics by message type, tier, and rejection reason. The metrics subsystem is designed to have minimal performance impact: metric recording uses atomic operations and does not block the consensus hot path. A configurable metrics sampling rate (default 100%) allows reducing overhead in extreme throughput scenarios.

**Acceptance Criteria**:

- Latency histograms for: finality, pre-prepare, prepare, commit, view change, reply
- Counter metrics for: rounds completed, rounds failed, view changes, messages by type, rejections by reason, Byzantine detections, transactions committed
- Gauge metrics for: view number, sequence number, epoch number, validator count, pending transactions, WAL size, checkpoint sequence, quorum margin
- Prometheus-compatible `/metrics` HTTP endpoint
- Labels differentiate metrics by message type, tier, and rejection reason
- Metric recording uses atomic operations (no mutex on hot path)
- Configurable sampling rate (default 100%)
- Metrics endpoint responds within 100 milliseconds
- All metric names follow Prometheus naming conventions (`gtcx_consensus_*`)
- Unit tests verify metric values after simulated consensus rounds
- Integration test: metrics endpoint returns valid Prometheus exposition format

**Dependencies**:

- PANX-US-004 through PANX-US-008 (Consensus phases to instrument)
- PANX-US-012 (WAL for size gauge)
- PANX-US-015 (Epoch manager for epoch gauge)
- `prometheus` crate dependency in `gtcx-consensus/Cargo.toml`

**Definition of Done**:

- Metrics subsystem implemented in `gtcx-consensus/src/metrics.rs`
- All listed metric categories implemented and verified
- Prometheus endpoint implemented and tested
- Unit tests: metric values after simulated rounds
- Integration test: endpoint returns valid exposition format
- Performance test: metric recording adds < 1% overhead to consensus round latency
- Code reviewed and approved

---

### PANX-US-017: Governance Parameter Updates

**Story ID**: PANX-US-017
**Priority**: P1
**Story Points**: 3
**Sprint**: 19
**Assignee**: Unassigned

**User Story**:
As a governance administrator, I want to propose and enact changes to consensus parameters (tier weights, minimum stake requirements, timeout values, quorum thresholds) through a formal governance proposal process that requires quorum approval, so that the network can adapt its configuration without code changes or restarts.

**Description**:
Implement a governance proposal system in `gtcx-consensus/src/governance.rs` that allows authorized participants to propose changes to consensus configuration parameters. Governance proposals are a specialized type of consensus transaction that goes through the normal PBFT flow but requires super-quorum approval (configurable, default 3/4 weighted threshold) instead of the standard 2/3 threshold.

The following parameters are governable: (1) tier weight allocations (Government %, Enterprise %, Community %, Academic %, must sum to 100%), (2) minimum stake requirements per tier, (3) consensus timeout values (pre-prepare timeout, prepare timeout, view change base timeout), (4) quorum threshold (the 2/3 default), (5) epoch length, (6) maximum batch size, (7) reputation modifier bounds ([min, max]).

A governance proposal lifecycle proceeds as follows: (1) **Proposal creation**: an authorized proposer submits a `GovernanceProposal` specifying the parameter to change, the proposed new value, a justification text, and a voting deadline (in sequence numbers or wall-clock time). (2) **Voting period**: validators vote for or against the proposal by signing vote messages. Votes are weighted by effective weight. (3) **Tally**: at the voting deadline, the aggregate weight of "for" votes is compared against the super-quorum threshold. If met, the proposal is approved. (4) **Enactment**: approved proposals are applied at the next epoch boundary (via PANX-US-015). (5) **Recording**: the proposal outcome is recorded in the audit trail (PANX-US-011) and the epoch metadata.

The governance system includes safety rails: tier weight changes must still sum to 100%, quorum threshold cannot be set below 50% or above 90%, timeout values have minimum floors (1 second), and epoch length has a minimum of 100. Proposals that violate these constraints are rejected at submission time. Only one proposal per parameter can be active at a time to prevent conflicting concurrent changes.

**Acceptance Criteria**:

- `GovernanceProposal` struct contains: proposal_id, parameter, proposed_value, justification, voting_deadline, proposer
- Seven governable parameters: tier weights, min stakes, timeouts, quorum threshold, epoch length, max batch size, reputation bounds
- Proposals go through normal PBFT flow with super-quorum (3/4) approval requirement
- Voting is weighted by effective validator weight
- Approved proposals are applied at the next epoch boundary
- Tier weight changes must sum to 100% (validated at submission)
- Quorum threshold constrained to [50%, 90%]
- Timeout values have minimum floor of 1 second
- Epoch length has minimum of 100
- Only one active proposal per parameter at a time
- Proposal outcomes are recorded in the audit trail
- `GovernanceProposal` lifecycle: created -> voting -> approved/rejected -> enacted/discarded
- Vote messages are Ed25519 signed and include the validator's public key
- Rejected proposals (insufficient quorum) are recorded with the final vote tally

**Dependencies**:

- PANX-US-003 (Quorum checker with super-quorum mode)
- PANX-US-004 through PANX-US-006 (Consensus flow for proposal transactions)
- PANX-US-011 (Audit trail for recording outcomes)
- PANX-US-015 (Epoch boundary for enactment)

**Definition of Done**:

- Governance proposal system implemented in `gtcx-consensus/src/governance.rs`
- Unit tests: proposal creation, voting, approval, rejection, constraint validation, epoch-boundary enactment
- Safety rail tests: invalid tier weights, out-of-range quorum threshold, below-minimum timeouts
- Integration test: end-to-end proposal lifecycle from creation through enactment at epoch boundary
- Audit trail integration verified
- Code reviewed and approved

---

### PANX-US-018: Slashing Conditions

**Story ID**: PANX-US-018
**Priority**: P1
**Story Points**: 2
**Sprint**: 19
**Assignee**: Unassigned

**User Story**:
As a consensus engine, I want to detect and penalize provably Byzantine behavior -- such as equivocation (sending conflicting messages) and double-voting -- by slashing the offending validator's stake and reputation, so that malicious behavior carries a concrete economic cost.

**Description**:
Implement a slashing framework in `gtcx-consensus/src/slashing.rs` that detects, records, and penalizes provably Byzantine behavior. The framework focuses on behaviors that can be proven with cryptographic evidence (the signed messages themselves), ensuring that honest validators are never falsely slashed. Two primary slashable offenses are implemented:

**Equivocation**: A validator signs two different pre-prepare, prepare, or commit messages for the same (view, sequence) pair with different batch digests. The evidence consists of the two conflicting signed messages. Any validator that receives both messages can construct a `SlashingEvidence` containing them.

**Double-voting**: A validator sends conflicting votes in a governance proposal -- signing both a "for" and "against" vote for the same proposal. The evidence consists of the two conflicting signed vote messages.

Upon detecting a slashable offense, the detecting validator broadcasts a `SlashingEvidence` message to all validators. Validators independently verify the evidence by checking both signatures and confirming the conflict. Once a weighted quorum of validators has verified the evidence (via the normal consensus flow), the penalty is applied: the offending validator's stake is slashed by a configurable percentage (default 10% for first offense, escalating for repeat offenses), their reputation modifier is reduced by 0.2 (clamped to the minimum of 0.5), and a slashing event is recorded in the audit trail. The slashed validator remains in the validator set but with reduced weight; repeated offenses can reduce weight to the point of effective exclusion.

The slashing framework must never produce false positives. Only evidence consisting of two validly signed conflicting messages from the same public key is accepted. Network delays, message reordering, and view changes must not cause false detections.

**Acceptance Criteria**:

- Equivocation detection: conflicting messages for same (view, sequence) with different digests
- Double-voting detection: conflicting governance votes for same proposal
- `SlashingEvidence` struct contains: offense_type, message_a, message_b, offender_public_key
- Evidence is independently verifiable: both signatures are valid and messages conflict
- Slashing requires weighted quorum of validators to verify evidence
- Stake penalty: configurable percentage (default 10%), escalating for repeat offenses
- Reputation penalty: -0.2 per offense (clamped to minimum 0.5)
- Slashing event recorded in audit trail with full evidence
- False positive rate: zero (only cryptographically proven offenses are slashable)
- Network delays and view changes do not cause false detections
- Slashed validator remains in set with reduced weight (not immediately ejected)
- `SlashingDetector` runs continuously, examining all received messages for conflicts
- Evidence broadcast is idempotent: submitting the same evidence twice does not double-penalize

**Dependencies**:

- PANX-US-004 through PANX-US-008 (Message types to examine for conflicts)
- PANX-US-002 (Weight and reputation to modify upon slashing)
- PANX-US-011 (Audit trail for recording slashing events)
- PANX-US-017 (Governance votes to examine for double-voting)

**Definition of Done**:

- Slashing framework implemented in `gtcx-consensus/src/slashing.rs`
- Equivocation detection and double-voting detection implemented
- Unit tests: equivocation detection, double-voting detection, false positive prevention (view change does not trigger), evidence verification, penalty application, escalation
- Integration test: Byzantine validator equivocates, evidence is detected and broadcast, quorum verifies, penalty applied
- Zero false positives verified in the 10,000-round adversarial simulation (PANX-US-009)
- Code reviewed and approved

---

## Story Point Summary

### Sprint Priority Matrix

| Sprint                                  | Priority | Effort (Points) | Business Value | Risk   | Dependencies            |
| --------------------------------------- | -------- | --------------- | -------------- | ------ | ----------------------- |
| Sprint 15: Validator Registry           | P0       | 5               | High           | Low    | Phase 0, Phase 3 (DONE) |
| Sprint 16: PBFT Message Flow            | P0       | 13              | Critical       | High   | Sprint 15               |
| Sprint 17: Integration and Hardening    | P0       | 5               | High           | Medium | Sprint 16               |
| Sprint 18: Persistence and Recovery     | P0       | 11              | High           | Medium | Sprints 16, 17          |
| Sprint 19: Observability and Governance | P1       | 8               | Medium         | Low    | Sprints 16, 18          |

### Story Point Distribution

| Sprint    | Total Points | Stories | Avg Points per Story |
| --------- | ------------ | ------- | -------------------- |
| Sprint 15 | 5            | 3       | 1.7                  |
| Sprint 16 | 13           | 5       | 2.6                  |
| Sprint 17 | 5            | 3       | 1.7                  |
| Sprint 18 | 11           | 4       | 2.8                  |
| Sprint 19 | 8            | 3       | 2.7                  |
| **Total** | **42**       | **18**  | **2.2**              |

## Dependency Map

### Sprint Dependency Graph

```
Phase 0 (Crypto Foundation) --DONE--> Sprint 15 (Validator Registry)
Phase 3 (Network Layer) ---DONE--> Sprint 15 (Validator Registry)

Sprint 15 (Validator Registry) ----> Sprint 16 (PBFT Message Flow)
Sprint 16 (PBFT Message Flow) -----> Sprint 17 (Integration / Hardening)
Sprint 16 (PBFT Message Flow) -----> Sprint 18 (Persistence / Recovery)
Sprint 17 (Integration / Hardening) -> Sprint 18 (Persistence / Recovery)
Sprint 16 (PBFT Message Flow) -----> Sprint 19 (Observability / Governance)
Sprint 18 (Persistence / Recovery) -> Sprint 19 (Observability / Governance)
```

### Inter-Story Dependencies

```
PANX-US-001 (Registry) --> PANX-US-002 (Weight) --> PANX-US-003 (Quorum)
                                                        |
PANX-US-003 (Quorum) -----> PANX-US-004 (Pre-Prepare) --> PANX-US-005 (Prepare)
                                                             --> PANX-US-006 (Commit)
                                                                  --> PANX-US-007 (Reply)
PANX-US-004..006 ----------> PANX-US-008 (View Change)
PANX-US-004..008 ----------> PANX-US-009 (BFT Verification)
PANX-US-004..008 ----------> PANX-US-010 (Benchmarking)
PANX-US-004..008 ----------> PANX-US-011 (Audit Trail)
PANX-US-004..008 ----------> PANX-US-012 (State Persistence)
PANX-US-012 (Persistence) -> PANX-US-013 (Checkpoint/Snapshot)
PANX-US-013 (Checkpoint) --> PANX-US-014 (Validator Rotation)
PANX-US-002 + US-013 ------> PANX-US-015 (Epoch Management)
PANX-US-004..015 ----------> PANX-US-016 (Metrics)
PANX-US-003 + US-011 + US-015 -> PANX-US-017 (Governance)
PANX-US-002 + US-011 + US-017 -> PANX-US-018 (Slashing)
```

## Module Structure

```
gtcx-consensus/
  Cargo.toml
  src/
    lib.rs                          # Crate root, public API re-exports
    validator/
      mod.rs                        # Validator module root
      registry.rs                   # PANX-US-001: ValidatorRegistry, RegistryStore
      weight.rs                     # PANX-US-002: WeightCalculator
      quorum.rs                     # PANX-US-003: QuorumChecker
      rotation.rs                   # PANX-US-014: Validator rotation protocol
    consensus/
      mod.rs                        # Consensus module root
      pre_prepare.rs                # PANX-US-004: PrePrepareMessage, leader logic
      prepare.rs                    # PANX-US-005: PrepareMessage, prepare collection
      commit.rs                     # PANX-US-006: CommitMessage, commit collection
      reply.rs                      # PANX-US-007: ReplyMessage, aggregate proof
      view_change.rs                # PANX-US-008: ViewChangeMessage, NewViewMessage
    persistence/
      mod.rs                        # Persistence module root
      state.rs                      # PANX-US-012: WAL-based state persistence
      checkpoint.rs                 # PANX-US-013: Periodic snapshots
    epoch.rs                        # PANX-US-015: Epoch management
    audit.rs                        # PANX-US-011: Hash-chained audit trail
    metrics.rs                      # PANX-US-016: Prometheus metrics
    governance.rs                   # PANX-US-017: Governance proposals
    slashing.rs                     # PANX-US-018: Slashing detection and penalties
  benches/
    consensus_bench.rs              # PANX-US-010: criterion benchmarks
  tests/
    adversarial.rs                  # PANX-US-009: 10K-round adversarial simulation
    integration.rs                  # End-to-end consensus integration tests
```

## Technical Notes

- **Consensus Model**: Weighted PBFT with tier-based governance weights, reputation modifiers, and stake modifiers. Quorum is determined by aggregate effective weight exceeding 2/3 threshold (configurable). This differs from standard PBFT where each validator has equal weight.
- **Cryptographic Signing**: All consensus messages are signed with Ed25519 via `ed25519-dalek`. Signing payloads are deterministic and canonicalized. Private key material is wrapped in `Zeroizing<T>`.
- **Benchmarking**: All performance targets are validated using `criterion` benchmarks. Performance regression detection is integrated into CI with a 10% threshold.
- **Async Runtime**: The consensus engine runs on `tokio` with configurable concurrency. Message handling uses `tokio::mpsc` channels. Timers for view change and epoch management use `tokio::time`.
- **Audit Integration**: The hash-chained audit trail integrates with the `gtcx-crypto::audit` module for standardized event formatting and cross-module audit correlation.
- **Storage Backend**: Consensus state persistence uses `sled` for its crash-safe, embedded, transactional key-value store. WAL entries and checkpoints are stored in separate `sled` trees for isolation.
- **Testing**: The adversarial simulation framework is the primary correctness validation tool. Property-based testing with `proptest` validates invariants. Fuzz testing targets message deserialization paths.

## Risks

| Risk                                                                                                 | Impact | Likelihood | Mitigation                                                                                                                                             |
| ---------------------------------------------------------------------------------------------------- | ------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Weighted quorum introduces subtle consensus bugs not present in standard PBFT                        | High   | Medium     | 10,000-round adversarial simulation (PANX-US-009) with formal safety and liveness verification; peer review by distributed systems expert              |
| Sub-3-second finality target not achievable with Ed25519 individual signatures at scale              | Medium | Low        | Benchmark early in Sprint 16; if needed, implement BLS aggregate signatures as an optimization in a follow-up epic                                     |
| WAL-based recovery introduces state divergence between recovered and non-recovered nodes             | High   | Low        | Idempotency tests, crash-at-every-mutation-point tests, and checkpoint stability protocol ensure state convergence                                     |
| Validator rotation creates a window of vulnerability during state synchronization                    | Medium | Medium     | New validators do not participate in consensus until fully synchronized; super-quorum required for rotation approval                                   |
| Governance parameter changes (e.g., quorum threshold reduction) could be used to capture the network | High   | Low        | Safety rails enforce minimum thresholds; super-quorum (3/4) required for governance changes; audit trail provides transparency                         |
| Slashing false positives could deter honest validator participation                                  | High   | Low        | Only cryptographically provable offenses (conflicting signed messages) are slashable; zero false positive guarantee verified in adversarial simulation |

## Definition of Done -- Epic Level

This epic is complete when:

1. All 18 user stories are implemented and pass their acceptance criteria
2. All unit tests pass with > 90% code coverage across `gtcx-consensus`
3. All `criterion` benchmarks meet their performance targets (< 3s finality, > 5000 TPS, < 5s view change)
4. The 10,000-round adversarial simulation passes with zero safety violations and zero liveness violations
5. WAL-based crash recovery is verified at every state mutation point
6. Checkpoint-based fast recovery produces identical state to uninterrupted operation
7. Validator rotation completes without disrupting in-progress consensus rounds
8. Epoch transitions are atomic and all validators transition at the same sequence number
9. Prometheus metrics endpoint exposes all listed metrics in valid exposition format
10. Governance proposal lifecycle works end-to-end from creation through epoch-boundary enactment
11. Slashing framework has zero false positives verified across adversarial simulation
12. Hash-chained audit trail records all consensus events and is verifiable
13. All cryptographic code satisfies the Cryptographic Definition of Done from the master roadmap (audited libraries, zeroizing keys, no unsafe code, constant-time comparisons, standard test vectors, fuzz testing, security review)
14. Security review completed and approved for all PRs

---

**Document Status**: Active epic
**Next Review**: Sprint 15 planning
**Parent Document**: [README.md](README.md) (GTCX Cryptographic Systems Master Roadmap)
