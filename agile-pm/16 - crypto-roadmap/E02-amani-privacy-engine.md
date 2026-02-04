# E02 -- AMANI Privacy-Preserving Learning Engine

**Epic**: AMANI Privacy-Preserving Learning Engine
**Phase**: 2
**Status**: NOT STARTED
**Owner**: Crypto Engineering
**Target**: Q2 2026
**Total Story Points**: 58
**Sprints**: 6 (Sprints 6--11)
**Depends On**: Phase 0 (Cryptographic Foundation -- DONE)

---

## Executive Summary

This epic implements the AMANI Privacy-Preserving Cross-Migration Pattern Learning system, which enables the Sensei platform to learn from every customer migration while providing mathematical guarantees that no individual customer's data can be reconstructed or identified.

The privacy system is built on five pillars:

1. **CRDT Synchronization** -- Conflict-free replicated data types for offline-first operation, ensuring merge-without-conflicts when AMANI reconnects after offline periods.
2. **Differential Privacy** -- Calibrated Gaussian noise injection into pattern vectors so that any single customer's contribution is statistically invisible.
3. **Federated Learning** -- Local pattern extraction agents running in the customer's VPC that transmit only abstract statistical patterns, never raw data.
4. **Homomorphic Encryption** -- Paillier-based encrypted pattern queries so the central knowledge base can perform similarity matching without ever seeing plaintext queries or results.
5. **Privacy Budget Accounting** -- A tamper-proof, hash-chained ledger that tracks cumulative epsilon expenditure and enforces automatic behavior changes at defined thresholds.

### Current State

| Asset | Status |
|-------|--------|
| Feature flag (`enable_privacy_preserving_learning: bool = True`) | Exists in `sensei-ai/packages/sensei-py/sensei_core/config.py` |
| Specification documents (6 files, ~2,808 lines) | Complete -- covers every algorithm, data structure, and performance target |
| Implementation code | None whatsoever |
| Cryptographic foundation (`gtcx-crypto` crate) | DONE -- provides `chain.rs` (hash-chained audit logs), Ed25519 signing, SHA-256/Blake3 hashing, HD key derivation |

### Implementation Location

New code will be implemented in one of:
- `sensei-ai/packages/sensei-py/` (Python, for integration with existing Sensei pipeline)
- A new Rust crate under `gtcx-core/rust/` (for performance-critical cryptographic operations)

The CRDT data types and Paillier operations are strong candidates for Rust. The federated learning agent and privacy budget accounting may be Python with Rust bindings for hot paths. The decision should be finalized during Sprint 6 planning.

### Specification References

| Document | Path | Lines |
|----------|------|-------|
| Privacy-Preserving Learning (overview) | `sensei-ai/docs/product/platform/amani/privacy-preserving-learning.md` | 106 |
| CRDT Synchronization | `sensei-ai/docs/developers/components/amani/crdt-sync.md` | 176 |
| Differential Privacy | `sensei-ai/docs/developers/components/amani/differential-privacy.md` | 114 |
| Federated Pattern Extraction | `sensei-ai/docs/developers/components/amani/federated-learning.md` | 129 |
| Homomorphic Pattern Matching | `sensei-ai/docs/developers/components/amani/homomorphic-matching.md` | 127 |
| Privacy Budget Accounting | `sensei-ai/docs/developers/components/amani/privacy-budget.md` | 149 |

---

## Sprint 6: CRDT Data Types (8 points)

**Goal**: Implement the four core CRDT data types that AMANI uses for offline-first synchronization. Each type must satisfy the mathematical CRDT properties: merge is commutative, associative, and idempotent.

### S6.1 -- G-Counter (Grow-Only Counter)

**Title**: Implement G-Counter CRDT

**Description**: Implement a grow-only counter with per-node increments. Each node in the system maintains its own counter slot. The merge operation takes the element-wise maximum across all node slots, producing a counter whose total is the sum of per-node maximums. This is used for tracking monotonically increasing metrics such as records processed, errors encountered, and validation checks passed.

The data structure is a map from node ID to a non-negative integer. Increment only affects the local node's slot. The `value()` method returns the sum of all slots.

**Acceptance Criteria**:
- A G-Counter can be incremented from any node, and the increment only affects that node's slot
- Merge of two G-Counters takes the element-wise maximum of all node slots
- Concurrent increments from N nodes converge to the correct total after merge
- Merge is commutative: `merge(A, B) == merge(B, A)`
- Merge is associative: `merge(merge(A, B), C) == merge(A, merge(B, C))`
- Merge is idempotent: `merge(A, A) == A`
- Counter value never decreases (monotonic growth)
- Serialization round-trip preserves all state

**Story Points**: 2

**Dependencies**: None

**Definition of Done**:
- Implementation with full documentation
- Unit tests covering: single-node increment, multi-node increment, merge correctness, commutativity, associativity, idempotence, serialization round-trip
- Property-based tests (proptest) for algebraic invariants
- Benchmarks for increment and merge operations

---

### S6.2 -- LWW-Register (Last-Writer-Wins Register)

**Title**: Implement LWW-Register CRDT

**Description**: Implement a last-writer-wins register that stores a single value with an associated timestamp and node ID. When two replicas are merged, the value with the higher timestamp wins. Ties (identical timestamps) are broken deterministically by node ID comparison. This is used for configuration settings, user preferences, and current phase status.

The data structure holds: `value`, `timestamp` (millisecond precision), and `node_id`. The merge operation selects the entry with the higher timestamp, falling back to lexicographic node ID comparison on ties.

**Acceptance Criteria**:
- The register stores a value with a timestamp and node ID
- Merge selects the value with the higher timestamp
- Deterministic resolution for concurrent writes with the same timestamp via node ID tie-breaking
- Merge is commutative, associative, and idempotent
- The register is generic over the value type (supports any serializable value)
- Serialization round-trip preserves value, timestamp, and node ID

**Story Points**: 2

**Dependencies**: None

**Definition of Done**:
- Implementation with full documentation
- Unit tests covering: basic set/get, merge with different timestamps, merge with identical timestamps (tie-breaking), commutativity, associativity, idempotence, serialization round-trip
- Property-based tests for merge invariants
- Tests with edge cases: zero timestamp, empty value, maximum timestamp

---

### S6.3 -- OR-Set (Observed-Remove Set)

**Title**: Implement OR-Set CRDT

**Description**: Implement an Observed-Remove Set with add-wins semantics for concurrent add and remove operations. Each add operation generates a unique tag. A remove operation removes all tags currently associated with an element. If an add and a remove happen concurrently (the add was not observed before the remove), the add wins and the element remains in the set.

This is used for approved mappings, acknowledged errors, and completed tasks. The OR-Set must handle the key scenario described in the spec: User A adds an element offline while User B removes the same element on the server. After merge, the element is present (add-wins).

**Acceptance Criteria**:
- Elements can be added to and removed from the set
- Add-wins semantics: a concurrent add and remove results in the element being present
- Remove only affects tags that were observed at the time of removal
- Merge produces the union of all add tags minus the explicitly removed tags
- Merge is commutative, associative, and idempotent
- The set correctly handles: add then remove, remove then add, concurrent add+remove, multiple adds of same element, remove of non-existent element
- Serialization round-trip preserves all tags and state

**Story Points**: 3

**Dependencies**: None

**Definition of Done**:
- Implementation with full documentation
- Unit tests covering: add, remove, concurrent add+remove (add-wins), sequential add then remove, multiple tags for same element, merge correctness, commutativity, associativity, idempotence, serialization round-trip
- Property-based tests for set algebra invariants
- Tests reproducing the spec scenario: User A adds mapping X offline, User B removes mapping X on server, merge results in mapping X present

---

### S6.4 -- LWW-Map (Last-Writer-Wins Map)

**Title**: Implement LWW-Map CRDT

**Description**: Implement a key-value map where each key is backed by an independent LWW-Register. Updates to different keys are independent and merge without interference. This is used for migration state, per-table progress, and per-column mapping decisions.

Keys can be added but not removed (use tombstone values for logical deletion, as specified in the docs). Each key's value is resolved independently using the LWW-Register merge semantics.

**Acceptance Criteria**:
- Each key operates as an independent LWW-Register
- Independent key updates from different nodes merge correctly without interfering with each other
- A key updated on node A and a different key updated on node B both survive merge
- Same-key conflicts are resolved by LWW-Register rules (timestamp, then node ID)
- Merge is commutative, associative, and idempotent
- Logical deletion via tombstone values is supported
- Serialization round-trip preserves all keys, values, timestamps, and node IDs

**Story Points**: 1

**Dependencies**: S6.2 (LWW-Register)

**Definition of Done**:
- Implementation that composes LWW-Register per key, with full documentation
- Unit tests covering: single-key update, multi-key independent updates, same-key conflict resolution, merge correctness, commutativity, associativity, idempotence, tombstone deletion, serialization round-trip
- Property-based tests for map merge invariants
- Integration test with LWW-Register showing correct delegation

---

## Sprint 7: CRDT Sync Protocol (8 points)

**Goal**: Implement the synchronization protocol that exchanges CRDT state between offline clients and the server. The protocol must handle detection of missing state, correct merge application, semantic conflict identification, and offline operation queuing.

### S7.1 -- State Vector Exchange

**Title**: Implement state vector exchange for incremental sync

**Description**: Implement the mechanism by which two peers detect which entries are missing between them using version vectors. When AMANI reconnects after an offline period, the client sends its state vector (a summary of what it has seen) to the server. The server compares this against its own state vector and responds with only the missing changes. The client likewise sends its offline changes.

This corresponds to Phase 1 (State Exchange) in the CRDT sync spec. The protocol must be incremental -- only missing state is transferred, never the full state.

**Acceptance Criteria**:
- Each peer maintains a state vector summarizing its known state
- State vector exchange correctly identifies which entries are missing on each side
- Incremental sync transfers only the missing state, not the full state
- Bandwidth is proportional to the number of changes since last sync, not total state size
- Typical sync payloads match spec targets: 10--100 KB for normal sync, 1--5 MB for 1-week offline sync
- State vectors are compact and serializable

**Story Points**: 2

**Dependencies**: Sprint 6 (all CRDT data types)

**Definition of Done**:
- Implementation with full documentation
- Unit tests covering: no changes needed (already in sync), one-sided changes, two-sided changes, first-ever sync (empty state vector)
- Benchmark measuring sync payload size for varying offline durations
- Integration test with all four CRDT types

---

### S7.2 -- Merge Operation

**Title**: Implement CRDT merge with state hash verification

**Description**: Implement the merge operation that applies received state from the peer, resolves changes per CRDT-specific merge rules, and verifies consistency via state hash comparison. This corresponds to Phase 2 (Merge) and Phase 3 (Verification) in the CRDT sync spec.

After both client and server independently merge the received changes, they exchange state hashes. If hashes match, sync is complete. If hashes do not match (indicating a bug), a full state comparison is triggered to identify the discrepancy.

**Acceptance Criteria**:
- Merge correctly applies received state for all four CRDT types (G-Counter, LWW-Register, OR-Set, LWW-Map)
- Merge is commutative: both peers arrive at identical state regardless of merge order
- Merge is associative: multi-peer merge produces the same result regardless of grouping
- Merge is idempotent: re-applying the same state produces no change
- State hash is computed after merge and exchanged for verification
- Hash mismatch triggers a full state comparison and logs the discrepancy

**Story Points**: 3

**Dependencies**: S7.1 (State Vector Exchange), Sprint 6 (all CRDT data types)

**Definition of Done**:
- Implementation with full documentation
- Unit tests covering: merge for each CRDT type, hash verification success, hash verification failure path, commutativity across all types, idempotent re-merge
- Property-based tests for merge algebraic properties across all CRDT types
- Integration test: simulate full sync cycle (exchange, merge, verify)

---

### S7.3 -- Conflict Detection

**Title**: Implement semantic conflict detection and flagging

**Description**: CRDTs guarantee no technical conflicts, but semantic conflicts can occur. For example, User A approves a mapping offline while User B rejects the same mapping on the server. The CRDT merge resolves this technically (add-wins), but the semantic conflict (approval vs. rejection) requires human review.

Implement detection of these semantic conflicts by comparing the merge result against each peer's pre-merge state. When a merge produces a different result than either peer's unilateral state, flag the change as a "merge decision" requiring review. Maintain an audit trail showing both original decisions and the merge outcome.

Per the spec, semantic conflicts occur in less than 1% of sync operations.

**Acceptance Criteria**:
- Technical conflicts are impossible by construction (guaranteed by CRDT properties)
- Semantic conflicts are detected when merge result differs from either peer's individual state
- Detected conflicts are flagged with a "merge decision" marker for human review
- Audit trail records: both original decisions, the merge outcome, timestamps, and node IDs
- Notifications can be generated for users whose actions were superseded
- Conflict detection does not alter the merge result (it is observational only)

**Story Points**: 2

**Dependencies**: S7.2 (Merge Operation)

**Definition of Done**:
- Implementation with full documentation
- Unit tests covering: no semantic conflict (clean merge), semantic conflict detection (concurrent approve/reject), audit trail generation, notification payload generation
- Test reproducing the spec scenario: User A approves mapping X offline, User B rejects mapping X, merge resolves to approved, semantic conflict flagged
- Verification that conflict rate is trackable as a metric

---

### S7.4 -- Offline Queue

**Title**: Implement offline operation queue with replay on reconnection

**Description**: Implement a durable queue that buffers all CRDT operations performed during offline periods. The queue must support offline periods of up to 30 days (limited by local storage, not CRDT constraints). When connectivity is restored, the queue replays all buffered operations and initiates a sync cycle.

Per the spec, sync must initiate within 1 second of connectivity being detected, and complete within 2--60 seconds depending on the duration of the offline period.

**Acceptance Criteria**:
- All CRDT operations performed offline are buffered in a durable, persistent queue
- Queue supports offline periods of up to 30 days
- Sync initiates within 1 second of connectivity being detected
- Sync completes in 2--10 seconds for typical offline durations, up to 60 seconds for extended offline periods
- Operations are replayed in the correct order
- Queue is cleared after successful sync
- Queue survives application restarts (persisted to local storage)
- Graceful handling of partial sync (resume from last successful point)

**Story Points**: 1

**Dependencies**: S7.1 (State Vector Exchange), S7.2 (Merge Operation)

**Definition of Done**:
- Implementation with full documentation
- Unit tests covering: queue operations (enqueue, dequeue, peek), persistence across restarts, replay order correctness, queue clearing after sync
- Integration test: simulate offline period, queue operations, restore connectivity, verify sync completion
- Performance test: verify sync initiation latency (<1s) and completion time for various offline durations

---

## Sprint 8: Differential Privacy Engine (13 points)

**Goal**: Implement the differential privacy engine that adds calibrated Gaussian noise to pattern vectors, ensuring that any single customer's contribution to the shared knowledge base is statistically invisible. This is the second pillar of the privacy system.

### S8.1 -- Gaussian Mechanism

**Title**: Implement calibrated Gaussian noise injection

**Description**: Implement the Gaussian mechanism for differential privacy. Each pattern vector transmitted from a customer's environment is perturbed by adding calibrated Gaussian noise N(0, sigma^2), where sigma is determined by the sensitivity of the pattern extraction function and the target privacy parameter epsilon.

The transmitted pattern becomes: `transmitted_pattern = true_pattern + N(0, sigma^2)`.

Sigma must be computed as: `sigma = sensitivity * sqrt(2 * ln(1.25 / delta)) / epsilon`, where delta is the failure probability (default 10^-6).

**Acceptance Criteria**:
- Gaussian noise N(0, sigma^2) is added to each dimension of the pattern vector
- Sigma is correctly computed from sensitivity and epsilon using the Gaussian mechanism formula
- Noise magnitude matches the theoretical requirement for the target epsilon
- For epsilon = 1.0 and typical sensitivity, pattern similarity search remains 95%+ accurate for common patterns (per spec)
- Noise is generated using a cryptographically secure random number generator
- Each dimension receives independent noise samples
- The mechanism supports arbitrary-dimensional pattern vectors

**Story Points**: 3

**Dependencies**: None

**Definition of Done**:
- Implementation with full documentation
- Unit tests covering: noise magnitude distribution matches N(0, sigma^2), sigma computation correctness for various epsilon and sensitivity values, vector dimension independence
- Statistical tests: verify noise distribution over 10,000+ samples matches expected Gaussian parameters
- Property-based tests: noised patterns always differ from originals, noise magnitude scales correctly with epsilon
- Benchmarks for noise generation on typical pattern vector sizes

---

### S8.2 -- Sensitivity Calibration

**Title**: Implement per-pattern-type sensitivity classification

**Description**: Implement sensitivity calibration that determines how much noise to add based on the type of pattern being transmitted. Different pattern types have different sensitivities (how much one customer's data could change the output).

Per the spec, the sensitivity classifications are:

| Pattern Category | Sensitivity | Rationale |
|---|---|---|
| Schema structural fingerprints | Low | Structure is coarse-grained |
| Performance profiles | Low | Throughput curves are similar across customers |
| Error signatures | Medium | Error distributions vary more across customers |
| Strategy effectiveness | Low | Effectiveness scores are normalized |

Lower sensitivity means less noise is needed, preserving more utility. Higher sensitivity requires more noise to maintain the same privacy guarantee.

**Acceptance Criteria**:
- Sensitivity is correctly classified per the documented pattern taxonomy (schema fingerprints: low, performance profiles: low, error signatures: medium, strategy effectiveness: low)
- Sensitivity values are configurable but have correct defaults per the spec
- The calibration module provides a mapping from pattern type to numeric sensitivity value
- Sensitivity values feed correctly into the Gaussian mechanism's sigma computation
- New pattern types can be added with appropriate sensitivity classifications
- Documentation explains the rationale for each classification

**Story Points**: 2

**Dependencies**: S8.1 (Gaussian Mechanism)

**Definition of Done**:
- Implementation with full documentation
- Unit tests covering: correct sensitivity for each pattern type, sensitivity feeds into sigma computation correctly, custom sensitivity override
- Integration test: end-to-end from pattern type to noise magnitude, verifying that low-sensitivity patterns receive less noise than medium-sensitivity patterns
- Documentation of sensitivity rationale for each pattern type

---

### S8.3 -- Epsilon Configuration

**Title**: Implement configurable epsilon with privacy/utility tradeoff visibility

**Description**: Implement customer-configurable epsilon values. The system must support epsilon values from 0.1 (extremely strong privacy, high noise) to 5.0 (weak privacy, low noise), with a default of 1.0 (strong privacy, standard for sensitive data).

Per the spec:

| Epsilon | Adversary Advantage | Practical Meaning |
|---|---|---|
| 0.1 | Factor of 1.1 | Extremely strong -- adversary learns almost nothing |
| 0.5 | Factor of 1.6 | Very strong -- participation nearly undetectable |
| 1.0 (default) | Factor of 2.7 | Strong -- standard for sensitive data |
| 2.0 | Factor of 7.4 | Moderate -- detectable but not exploitable |
| 5.0 | Factor of 148 | Weak -- not recommended for sensitive applications |

Customers should be able to see the privacy/utility tradeoff when choosing their epsilon value.

**Acceptance Criteria**:
- Customer can configure epsilon values in the range [0.1, 5.0]
- Default epsilon is 1.0
- Values outside the valid range are rejected with a clear error message
- The UI/API exposes the privacy/utility tradeoff (adversary advantage factor, practical meaning) for the selected epsilon
- Changing epsilon takes effect on subsequent pattern contributions (not retroactively)
- Epsilon configuration is persisted and survives application restarts
- Feature flag `enable_privacy_preserving_learning` in `config.py` gates the entire system

**Story Points**: 2

**Dependencies**: S8.1 (Gaussian Mechanism)

**Definition of Done**:
- Implementation with full documentation
- Unit tests covering: default value, valid range enforcement, boundary values (0.1, 5.0), rejection of out-of-range values, persistence
- Integration test: epsilon change affects subsequent noise magnitude
- API/configuration schema documented

---

### S8.4 -- Composition Tracking

**Title**: Implement advanced composition theorem for cumulative epsilon

**Description**: Implement the advanced composition theorem for tracking cumulative privacy expenditure. Basic composition states that k operations at epsilon each cost k * epsilon total. Advanced composition provides a much tighter bound:

`total_epsilon = sqrt(2k * ln(1/delta)) * epsilon + k * epsilon * (e^epsilon - 1)`

Where k is the number of operations, epsilon is the per-operation epsilon, and delta is the failure probability.

Per the spec, for typical parameters (epsilon = 1.0, delta = 10^-6):
- 10 contributions: ~3.5 epsilon total (not 10 epsilon)
- 100 contributions: ~12 epsilon total (not 100 epsilon)
- 1,000 contributions: ~40 epsilon total (not 1,000 epsilon)

This dramatically extends how many operations are possible within a fixed budget.

**Acceptance Criteria**:
- Advanced composition theorem is implemented correctly: `total_epsilon = sqrt(2k * ln(1/delta)) * epsilon + k * epsilon * (e^epsilon - 1)`
- 100 contributions at epsilon = 1.0 yields approximately 12 epsilon total (not 100 epsilon)
- 10 contributions at epsilon = 1.0 yields approximately 3.5 epsilon total
- 1,000 contributions at epsilon = 1.0 yields approximately 40 epsilon total
- Both basic and advanced composition are available (advanced is default)
- Delta parameter is configurable (default 10^-6)
- Composition tracking integrates with the privacy budget ledger (Sprint 11)

**Story Points**: 3

**Dependencies**: S8.3 (Epsilon Configuration)

**Definition of Done**:
- Implementation with full documentation
- Unit tests covering: formula correctness for the three documented scenarios (10, 100, 1000 contributions), comparison showing advanced composition is tighter than basic, delta parameter variation, edge cases (k=0, k=1)
- Numerical verification against published differential privacy composition bounds
- Documentation explaining the mathematical derivation and practical implications

---

### S8.5 -- Noise Verification

**Title**: Implement auditable noise magnitude logging and verification

**Description**: Implement logging of noise magnitudes applied to each pattern contribution, along with a verification mechanism that allows third-party auditors to confirm that the noise was sufficient to meet the claimed privacy guarantee.

Per the spec, the pattern extraction agent logs noise magnitudes (not the noised values themselves). Customers can see their cumulative epsilon expenditure, and external auditors can verify the differential privacy implementation against the claimed parameters.

**Acceptance Criteria**:
- Noise magnitude is logged for every pattern contribution
- Logs include: timestamp, pattern dimensions, noise magnitude (per dimension and total), target epsilon, computed sigma, actual sigma of injected noise
- A third-party auditor can verify that the logged noise magnitude was sufficient for the claimed epsilon guarantee
- Verification does not require access to the original pattern or the noised pattern -- only the noise magnitude and the privacy parameters
- Logs are append-only and tamper-evident (compatible with the privacy budget ledger in Sprint 11)
- Noise magnitudes are never logged in a way that could be used to reverse-engineer the original pattern

**Story Points**: 3

**Dependencies**: S8.1 (Gaussian Mechanism), S8.2 (Sensitivity Calibration)

**Definition of Done**:
- Implementation with full documentation
- Unit tests covering: log entry generation, verification of sufficient noise, verification failure for insufficient noise, append-only log property
- Integration test: end-to-end from noise injection through logging to third-party verification
- Documentation of the audit verification procedure for external auditors

---

## Sprint 9: Federated Pattern Extraction (8 points)

**Goal**: Implement the federated learning agent that runs locally in the customer's VPC, extracts abstract patterns from the migration pipeline, and transmits only statistical abstractions -- never raw data, table names, column names, or identifiable information. This is the first pillar of the privacy system.

### S9.1 -- Pattern Extraction Agent

**Title**: Implement local pattern extraction agent for customer VPC

**Description**: Implement the lightweight pattern extraction agent that runs inside the customer's network perimeter. The agent observes the migration pipeline (MABA + KORA) and extracts abstract patterns in four categories: schema structural fingerprints, performance profiles, error signatures, and strategy effectiveness.

The agent is deployed as a container in the customer's VPC with read-only access to the migration pipeline. It has no external data access beyond the migration pipeline, and its code and network traffic are customer-auditable.

**Acceptance Criteria**:
- Agent runs as a container deployable in customer VPC infrastructure
- Agent has read-only access to the migration pipeline (cannot modify migration state)
- Agent extracts patterns in four categories: schema fingerprints, performance profiles, error signatures, strategy effectiveness
- Agent transmits only abstract patterns to the central knowledge base -- never raw data
- Customer can audit the agent's code (open source or source-available)
- Customer can audit the agent's network traffic (all outbound connections are to known endpoints)
- Customer can disable or remove the agent at any time without affecting migration operations
- Agent adds differential privacy noise before transmission (integrates with Sprint 8)

**Story Points**: 3

**Dependencies**: Sprint 8 (Differential Privacy Engine)

**Definition of Done**:
- Implementation with full documentation
- Dockerfile and deployment manifests for customer VPC deployment
- Unit tests covering: pattern extraction for each category, read-only access enforcement, transmission payload validation (no raw data leakage)
- Integration test: agent observes a simulated migration and produces valid pattern vectors
- Network traffic audit test: verify all outbound connections go to known endpoints only
- Documentation of deployment procedure, audit procedure, and removal procedure

---

### S9.2 -- Schema Structural Fingerprints

**Title**: Implement schema structural fingerprint extraction

**Description**: Implement the extraction of statistical properties of source and target schemas, without any identifying information. Per the spec, the fingerprint includes:

- Data type distribution (percentage numeric, string, temporal, boolean)
- Cardinality ratios (distinct values / total rows)
- Null rate distributions
- Relationship density (FK count / table count)
- Constraint patterns (PK types, index coverage)

The fingerprint must contain zero identifying information: no table names, no column names, no actual values, no database names.

**Acceptance Criteria**:
- Fingerprint includes: type distribution, cardinality ratios, null rates, relationship density, constraint patterns
- Fingerprint contains zero identifying information (no table names, column names, actual values, database names, schema identifiers)
- Fingerprint is a fixed-dimension numeric vector suitable for similarity comparison
- Fingerprint is deterministic for the same schema (same schema always produces the same fingerprint, before noise)
- Fingerprint is computed efficiently (does not require full table scans for large schemas)
- Output format matches: `{type_dist: [...], card_ratio_mean: ..., ...}` as documented in the spec

**Story Points**: 2

**Dependencies**: S9.1 (Pattern Extraction Agent)

**Definition of Done**:
- Implementation with full documentation
- Unit tests covering: fingerprint computation for known schemas, zero-information verification (no strings from source schema appear in fingerprint), determinism, dimension consistency
- Integration test: extract fingerprint from a test schema, verify structure matches spec
- Negative test: verify that table names, column names, and values are provably absent from the output

---

### S9.3 -- Performance Profiles

**Title**: Implement performance profile extraction

**Description**: Implement extraction of migration performance characteristics as abstract, normalized profiles. Per the spec, performance profiles include:

- Throughput curves (records/hour over time, normalized)
- Bottleneck classifications (network, CPU, I/O, destination)
- Resource utilization patterns
- Optimization effectiveness (which interventions helped)

All values must be normalized and relative, not absolute. No actual record counts, no timing of specific operations, no absolute throughput numbers.

**Acceptance Criteria**:
- Profiles include: throughput curves, bottleneck classifications, resource utilization patterns, optimization effectiveness
- All values are normalized/relative, not absolute (e.g., relative throughput as percentage of peak, not records/hour)
- No actual record counts appear in the output
- No timing of specific operations appears in the output
- Bottleneck classification is categorical (enum), not numeric
- Output format matches: `{throughput_profile: [...], bottleneck: "...", ...}` as documented in the spec

**Story Points**: 1

**Dependencies**: S9.1 (Pattern Extraction Agent)

**Definition of Done**:
- Implementation with full documentation
- Unit tests covering: profile extraction from simulated migration telemetry, normalization verification (all values relative), absence of absolute numbers
- Integration test: extract profile from a test migration run, verify structure matches spec
- Negative test: verify that absolute record counts and operation timings are absent from the output

---

### S9.4 -- Error Signatures and Strategy Effectiveness

**Title**: Implement error signature and strategy effectiveness extraction

**Description**: Implement extraction of error patterns and strategy effectiveness metrics as statistical abstractions. Per the spec:

Error signatures include:
- Error type frequencies (type mismatch, encoding, constraint violation)
- Recovery success rates by error type
- Escalation patterns

Strategy effectiveness includes:
- Strategy parameters used
- Outcome metrics (speed, accuracy, efficiency)
- Relative effectiveness compared to alternatives tried

No query text, no error messages, no record identifiers -- only statistical abstractions.

**Acceptance Criteria**:
- Error signatures include: error type frequencies, recovery rates, escalation patterns
- Strategy effectiveness includes: strategy parameters, outcome metrics, relative effectiveness
- No query text appears in the output
- No error messages appear in the output (only error type categories)
- No record identifiers appear in the output
- Only statistical abstractions are transmitted
- Output format matches: `{error_dist: {...}, recovery_rate: ..., strategy_id: ..., effectiveness: ...}` as documented in the spec

**Story Points**: 2

**Dependencies**: S9.1 (Pattern Extraction Agent)

**Definition of Done**:
- Implementation with full documentation
- Unit tests covering: error signature extraction from simulated error logs, strategy effectiveness extraction from simulated strategy outcomes, statistical abstraction verification
- Integration test: extract signatures from a test migration with known error patterns, verify correct frequencies
- Negative test: verify that raw error messages, query text, and record identifiers are provably absent from the output

---

## Sprint 10: Homomorphic Pattern Matching (13 points)

**Goal**: Implement Paillier-based homomorphic encryption for privacy-preserving pattern queries. The central knowledge base can perform similarity matching on encrypted vectors without ever seeing the plaintext query or results. This is the third pillar of the privacy system.

### S10.1 -- Paillier Key Generation

**Title**: Implement Paillier keypair generation for customers

**Description**: Implement Paillier cryptosystem key generation. Each customer receives a Paillier keypair: the customer holds the private key, and the server holds the public key. The server can perform computations on ciphertext using the public key, but only the customer can decrypt results using the private key.

Key generation must produce safe primes and pass NIST validation. The private key must be wrapped in zeroizing memory (consistent with the `gtcx-crypto` crate's security practices).

**Acceptance Criteria**:
- Paillier keypair is generated correctly (public key, private key)
- Customer holds the private key; server holds only the public key
- Key generation completes in less than 1 second
- Keys pass NIST validation for Paillier parameters
- Private key material is wrapped in `Zeroizing<T>` for automatic memory clearing on drop (per `gtcx-crypto` security requirements)
- Key serialization and deserialization for secure storage and transmission
- Key size is sufficient for the security level required (minimum 2048-bit modulus)

**Story Points**: 3

**Dependencies**: Phase 0 (gtcx-crypto crate -- key management patterns)

**Definition of Done**:
- Implementation with full documentation
- Unit tests covering: key generation, public/private key separation, serialization round-trip, key validation
- Performance test: key generation latency (must be <1s)
- Security review: verify key material handling follows `gtcx-crypto` patterns (zeroizing, no unsafe code)
- Fuzz testing on key deserialization

---

### S10.2 -- Encrypt/Decrypt Operations

**Title**: Implement Paillier encryption and decryption for pattern vectors

**Description**: Implement encryption and decryption of pattern vectors using the Paillier cryptosystem. The customer encrypts a query vector with the public key before sending it to the server. The customer decrypts results received from the server using the private key.

Round-trip encryption must preserve values exactly: `Decrypt(Encrypt(v, pk), sk) == v` for all valid pattern vectors.

**Acceptance Criteria**:
- Customer can encrypt a pattern vector using the public key
- Customer can decrypt a result vector using the private key
- Round-trip encryption preserves values exactly: `Decrypt(Encrypt(v, pk), sk) == v`
- Encryption is probabilistic (encrypting the same value twice produces different ciphertext)
- Ciphertext size is documented and within acceptable bounds for transmission
- Operations handle arbitrary-length pattern vectors (dimension-independent)
- Error handling for invalid keys, corrupted ciphertext, and dimension mismatches

**Story Points**: 2

**Dependencies**: S10.1 (Paillier Key Generation)

**Definition of Done**:
- Implementation with full documentation
- Unit tests covering: round-trip correctness for various vector sizes, probabilistic encryption verification, error handling for invalid inputs
- Property-based tests: round-trip identity for random vectors
- Performance benchmarks for encrypt and decrypt operations at typical vector dimensions (128-d)
- Fuzz testing on ciphertext deserialization

---

### S10.3 -- Homomorphic Dot Product

**Title**: Implement homomorphic dot product for encrypted similarity computation

**Description**: Implement the server-side homomorphic dot product computation. The server computes `similarity = sum(query[i] * pattern[i])` entirely on ciphertext using Paillier's additive homomorphism and scalar multiplication properties:

- `Encrypt(a) * Encrypt(b) = Encrypt(a + b)` (additive homomorphism)
- `Encrypt(a)^k = Encrypt(a * k)` (scalar multiplication)

The dot product is computed by: for each dimension i, raise `Encrypt(query[i])` to the power `pattern[i]` (giving `Encrypt(query[i] * pattern[i])`), then multiply all results together (giving `Encrypt(sum(query[i] * pattern[i]))`).

The encrypted computation must match the plaintext computation exactly.

**Acceptance Criteria**:
- Server computes dot product on encrypted query vectors using additive homomorphism and scalar multiplication
- Encrypted computation result, when decrypted by the customer, matches the plaintext dot product computation exactly
- Server never sees the plaintext query vector or the plaintext result
- Computation is correct for all pattern dimensions used in the system (128-d typical)
- Numerical precision is sufficient for similarity ranking (no ranking errors due to precision loss)

**Story Points**: 3

**Dependencies**: S10.2 (Encrypt/Decrypt Operations)

**Definition of Done**:
- Implementation with full documentation
- Unit tests covering: dot product correctness for known vectors, comparison of encrypted vs. plaintext results, various vector dimensions, zero vectors, orthogonal vectors
- Property-based tests: encrypted dot product matches plaintext dot product for random vectors
- Performance benchmarks for encrypted dot product at typical dimensions (128-d)
- Verification that server-side code never instantiates or accesses plaintext query values

---

### S10.4 -- Two-Stage Search

**Title**: Implement two-stage search with coarse filtering and homomorphic fine matching

**Description**: Implement the two-stage search approach that makes encrypted pattern matching practical at scale. Per the spec:

1. **Coarse filtering**: Unencrypted metadata (migration type, approximate complexity range) narrows the candidate set from the full pattern library to approximately 1,000 candidates.
2. **Fine matching**: Homomorphic dot product similarity search on the narrowed candidate set returns the top-k most similar patterns.

This hybrid approach achieves the spec target of less than 500ms query latency for top-10 retrieval while maintaining full privacy for the pattern content.

**Acceptance Criteria**:
- Coarse filtering uses unencrypted metadata to narrow candidates to approximately 1,000 patterns
- Fine matching uses homomorphic dot product on the candidate set
- Query latency is less than 500ms for top-10 retrieval from a pattern library of realistic size
- The coarse metadata does not leak pattern content (only migration type and approximate complexity)
- Results are returned encrypted; only the customer can see which patterns matched
- Ranking is correct: the top-10 results from the two-stage search match what a full plaintext search would return

**Story Points**: 3

**Dependencies**: S10.3 (Homomorphic Dot Product)

**Definition of Done**:
- Implementation with full documentation
- Unit tests covering: coarse filtering correctness, fine matching correctness, combined pipeline correctness, ranking accuracy
- Performance test: end-to-end latency <500ms for top-10 retrieval on a 10,000-pattern test library
- Integration test: full pipeline from encrypted query through coarse filter, fine match, encrypted results, decryption
- Benchmark: latency breakdown (coarse filter time vs. homomorphic computation time)

---

### S10.5 -- Query Privacy Verification

**Title**: Implement and document query privacy guarantees

**Description**: Implement verification mechanisms and provide a formal argument that the server never sees the plaintext query or results. Per the spec, even if an adversary compromises the central knowledge base, intercepts all queries, and has unlimited computational resources, they cannot determine what any customer searched for, which results were relevant, or the content of any customer's schema.

The security is based on the semantic security of the Paillier cryptosystem: ciphertexts are computationally indistinguishable from random, making it infeasible for the server to extract any information about the plaintext.

**Acceptance Criteria**:
- Formal argument (documented) that semantic security of Paillier prevents information leakage from encrypted queries
- Server-side code provably never accesses plaintext query or result values
- Code analysis confirms no side channels leak query information (constant-time comparisons where applicable)
- The system resists: server compromise, query interception, unlimited adversarial computation (per spec trust model)
- Privacy verification can be demonstrated to auditors

**Story Points**: 2

**Dependencies**: S10.3 (Homomorphic Dot Product), S10.4 (Two-Stage Search)

**Definition of Done**:
- Formal privacy argument document written and reviewed by security reviewer
- Code audit confirming no plaintext access on server side
- Unit tests: server-side code cannot distinguish between two different encrypted queries (indistinguishability test)
- Side-channel review: constant-time operations used for all comparisons involving ciphertext
- Documentation suitable for customer-facing security review and third-party audit

---

## Sprint 11: Privacy Budget Ledger (8 points)

**Goal**: Implement the tamper-proof privacy budget ledger that tracks cumulative information disclosure, enforces automatic behavior changes at defined thresholds, applies correct per-operation costs, and supports third-party audit export. This is the fourth pillar of the privacy system.

### S11.1 -- Tamper-Proof Ledger

**Title**: Implement hash-chained privacy budget ledger

**Description**: Implement a tamper-proof privacy transaction log, reusing the hash-chaining infrastructure from `gtcx-crypto/src/chain.rs`. Each entry in the ledger records:

- Timestamp
- Operation type (pattern contribution, homomorphic query, metadata query)
- Epsilon spent
- Pattern dimensions
- Noise magnitude
- SHA-256 cryptographic commitment

The ledger must be hash-chained so that modifying any entry breaks the chain, making tampering detectable. This reuses the `ChainEntry`, `create_entry`, `verify_chain`, and `verify_extension` functions from the existing `gtcx-crypto` crate.

**Acceptance Criteria**:
- Each ledger entry contains: timestamp, operation type, epsilon spent, pattern dimensions, noise magnitude, SHA-256 commitment
- Entries are hash-chained using the `gtcx-crypto` chain module (each entry's hash depends on the previous entry)
- Modifying any entry breaks the chain (detectable by `verify_chain`)
- Appending new entries uses `verify_extension` to ensure chain integrity
- Entries are signed with Ed25519 (reusing `gtcx-crypto` signing)
- Ledger entries are immutable once committed (append-only)
- Chain verification can be performed independently by any party holding the public key

**Story Points**: 2

**Dependencies**: Phase 0 (gtcx-crypto chain.rs), Sprint 8 (Differential Privacy Engine for epsilon/noise values)

**Definition of Done**:
- Implementation with full documentation
- Unit tests covering: entry creation, chain integrity verification, tamper detection (modify payload, modify epsilon, modify timestamp), append-only enforcement
- Integration test with `gtcx-crypto` chain module: create a privacy ledger, verify chain integrity, tamper with an entry, verify chain breaks
- Test with realistic privacy transaction payloads

---

### S11.2 -- Budget Enforcement

**Title**: Implement automatic behavior changes at privacy budget thresholds

**Description**: Implement automatic enforcement of privacy budget thresholds. When a customer's remaining budget crosses defined thresholds, the system's behavior changes automatically:

| Remaining Budget | System Behavior |
|---|---|
| >50% | Normal operation |
| 25--50% | Warnings shown in AMANI interface |
| 10--25% | Contribution frequency limited |
| 1--10% | Only high-value patterns contributed; user confirmation required |
| <1% | Contributions paused; customer can still receive patterns |
| 0% | No contributions; receive-only mode until budget refreshed |

Budget refresh is available (with customer consent) on an annual basis, resetting the cumulative epsilon while preserving the historical ledger.

**Acceptance Criteria**:
- Enforcement triggers at the correct thresholds: >50% (normal), 25--50% (warnings), 10--25% (limited), 1--10% (confirmation required), <1% (paused), 0% (receive-only)
- Each threshold triggers the correct behavior change as documented
- Transitions between thresholds are logged in the privacy ledger
- Budget refresh resets cumulative epsilon but preserves the full historical ledger
- Budget refresh requires explicit customer consent
- The system correctly computes remaining budget using advanced composition (from S8.4), not basic composition
- Customers can query their current budget status at any time

**Story Points**: 3

**Dependencies**: S11.1 (Tamper-Proof Ledger), S8.4 (Composition Tracking)

**Definition of Done**:
- Implementation with full documentation
- Unit tests covering: each threshold transition, correct behavior at each level, budget status query, budget refresh with ledger preservation
- Integration test: simulate a customer consuming budget through multiple contributions, verify each threshold triggers correctly
- Edge case tests: exact boundary values (50.0%, 25.0%, 10.0%, 1.0%, 0.0%), rapid consumption, budget refresh

---

### S11.3 -- Cost Accounting

**Title**: Implement per-operation epsilon cost accounting

**Description**: Implement correct epsilon cost application for each operation type. Per the spec:

| Operation | Epsilon Cost | Rationale |
|---|---|---|
| Pattern contribution | 0.5--1.5 epsilon | Reveals information about customer's migration |
| Pattern query (homomorphic) | 0.0 epsilon | Encrypted query reveals nothing |
| Pattern query (metadata-filtered) | 0.01--0.1 epsilon | Metadata filtering reveals coarse information |

The cost within each range depends on the specifics of the operation (e.g., pattern contribution cost varies with pattern dimensionality and sensitivity).

**Acceptance Criteria**:
- Pattern contribution costs 0.5--1.5 epsilon, varying with pattern type and dimensionality
- Homomorphic query costs 0.0 epsilon (free from a privacy perspective)
- Metadata-filtered query costs 0.01--0.1 epsilon, varying with the specificity of the metadata filter
- Costs are applied correctly per operation type and recorded in the ledger
- Total budget consumption uses advanced composition theorem (not simple addition)
- Cost computation is deterministic and reproducible for audit purposes
- Customers can see the cost of an operation before it is executed (preview mode)

**Story Points**: 1

**Dependencies**: S11.1 (Tamper-Proof Ledger), S8.4 (Composition Tracking)

**Definition of Done**:
- Implementation with full documentation
- Unit tests covering: cost computation for each operation type, cost variation within ranges, zero-cost homomorphic queries, cost recording in ledger, cost preview
- Integration test: sequence of operations with known costs, verify ledger total matches expected cumulative epsilon (using advanced composition)
- Documentation of cost model for customer transparency

---

### S11.4 -- Customer Audit Export

**Title**: Implement privacy budget history export for regulatory verification

**Description**: Implement export of the full privacy budget history in a format suitable for regulatory verification and third-party audit. The export must include all transactions with their cryptographic commitments, and the commitments must be independently verifiable by the auditor.

Per the spec, the privacy ledger is designed for external audit with: immutable history, cryptographic verification (auditors verify noise was correctly applied), composition verification (auditors independently compute cumulative epsilon), and a standard export format for privacy audit tools.

**Acceptance Criteria**:
- Export includes all transactions with: timestamp, operation type, epsilon spent, pattern dimensions, noise magnitude, SHA-256 commitment
- Cryptographic commitments in the export are independently verifiable by a third party holding the public key
- Auditor can independently verify the hash chain integrity from the export alone
- Auditor can independently recompute cumulative epsilon using the advanced composition theorem and verify it matches the claimed total
- Export format is a standard, documented format (JSON or similar) suitable for privacy audit tools
- Export includes the chain verification public key (or a reference to it)
- Export does not include private keys, raw patterns, or any customer data

**Story Points**: 2

**Dependencies**: S11.1 (Tamper-Proof Ledger), S11.3 (Cost Accounting)

**Definition of Done**:
- Implementation with full documentation
- Unit tests covering: export generation, chain verification from export, cumulative epsilon recomputation from export, absence of sensitive data in export
- Integration test: create a ledger with realistic transaction history, export, and independently verify the entire chain and budget computation from the export alone
- Documentation of the audit verification procedure suitable for distribution to external auditors and regulators
- Sample export with annotated fields for auditor reference

---

## Dependency Graph

```
Sprint 6: CRDT Data Types
  S6.1 G-Counter ────────────────────────┐
  S6.2 LWW-Register ──┬─────────────────┤
  S6.3 OR-Set ─────────┤                 │
  S6.4 LWW-Map ───────┘ (depends S6.2)  │
                                          │
Sprint 7: CRDT Sync Protocol             │
  S7.1 State Vector Exchange ◄────────────┘
  S7.2 Merge Operation ◄── S7.1, Sprint 6
  S7.3 Conflict Detection ◄── S7.2
  S7.4 Offline Queue ◄── S7.1, S7.2

Sprint 8: Differential Privacy Engine
  S8.1 Gaussian Mechanism
  S8.2 Sensitivity Calibration ◄── S8.1
  S8.3 Epsilon Configuration ◄── S8.1
  S8.4 Composition Tracking ◄── S8.3
  S8.5 Noise Verification ◄── S8.1, S8.2

Sprint 9: Federated Pattern Extraction
  S9.1 Pattern Extraction Agent ◄── Sprint 8
  S9.2 Schema Fingerprints ◄── S9.1
  S9.3 Performance Profiles ◄── S9.1
  S9.4 Error Signatures + Strategy ◄── S9.1

Sprint 10: Homomorphic Pattern Matching
  S10.1 Paillier Key Generation ◄── Phase 0
  S10.2 Encrypt/Decrypt ◄── S10.1
  S10.3 Homomorphic Dot Product ◄── S10.2
  S10.4 Two-Stage Search ◄── S10.3
  S10.5 Query Privacy Verification ◄── S10.3, S10.4

Sprint 11: Privacy Budget Ledger
  S11.1 Tamper-Proof Ledger ◄── Phase 0 (chain.rs), Sprint 8
  S11.2 Budget Enforcement ◄── S11.1, S8.4
  S11.3 Cost Accounting ◄── S11.1, S8.4
  S11.4 Customer Audit Export ◄── S11.1, S11.3
```

## Story Point Summary

| Sprint | Focus | Points |
|--------|-------|--------|
| Sprint 6 | CRDT Data Types | 8 |
| Sprint 7 | CRDT Sync Protocol | 8 |
| Sprint 8 | Differential Privacy Engine | 13 |
| Sprint 9 | Federated Pattern Extraction | 8 |
| Sprint 10 | Homomorphic Pattern Matching | 13 |
| Sprint 11 | Privacy Budget Ledger | 8 |
| **Total** | | **58** |

## Risk Considerations

| Risk | Mitigation |
|------|------------|
| Paillier performance at scale (R2 from roadmap) | Benchmark early in Sprint 10; the two-stage search design mitigates by limiting homomorphic operations to ~1,000 candidates |
| Rust expertise for CRDT and Paillier implementations | Cross-train during Sprint 6 (simpler CRDT types); consider Python prototypes first with Rust optimization later |
| Privacy budget model complexity | Advanced composition theorem must be numerically verified against published bounds before integration |
| Patent filing coordination (R6 from roadmap) | Coordinate with legal counsel at Sprint 8 kickoff (differential privacy) and Sprint 10 kickoff (homomorphic matching) |
| Regulatory requirements (R5 from roadmap) | Design with configurable policy layers; the audit export (S11.4) provides regulatory compliance evidence |

---

**Document Status**: Living epic document
**Created**: 2026-02-03
**Next Review**: Sprint 6 planning
