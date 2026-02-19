# Cross-Epic Prioritized Backlog

**Project**: GTCX Cryptographic Systems
**Last Updated**: 2026-02-03
**Review Cycle**: Every sprint planning

---

## Priority Tiers

Stories are ranked into four priority tiers. Within each tier, stories are ordered by dependency (prerequisites first) and cross-epic value (stories that unblock other epics rank higher).

| Tier | Label        | Criteria                                               |
| ---- | ------------ | ------------------------------------------------------ |
| P0   | Must Have    | Blocks other epics or delivers core security property  |
| P1   | Should Have  | Required for production readiness but not a blocker    |
| P2   | Nice to Have | Improves quality, performance, or developer experience |
| P3   | Defer        | Can ship without; schedule in a future cycle           |

---

## Milestone Gates

Each phase has acceptance criteria that must be met before the next dependent phase begins. Gates are enforced at sprint review.

### Gate 0: Cryptographic Foundation (DONE)

| Criterion                                                          | Evidence                                 |
| ------------------------------------------------------------------ | ---------------------------------------- |
| Ed25519 sign/verify passes RFC 8032 test vectors                   | `cargo test --package gtcx-crypto` green |
| SHA-256 and Blake3 pass NIST/reference vectors                     | `cargo test --package gtcx-crypto` green |
| HD key derivation matches BIP-32 test vectors                      | `cargo test --package gtcx-crypto` green |
| Hash-chained audit log detects insertion, deletion, and reordering | `cargo test --package gtcx-crypto` green |
| `#![deny(unsafe_code)]` enforced                                   | Compiler verification                    |
| All private key material uses `Zeroizing<T>`                       | Code review attestation                  |

**Status**: PASSED

### Gate 1: KORA Verification Pipeline

| Criterion                                                             | Evidence                                              |
| --------------------------------------------------------------------- | ----------------------------------------------------- |
| Merkle tree produces deterministic root for identical input sets      | Unit tests with 1K, 10K, 100K leaf inputs             |
| Certificate generation → signing → verification round-trips correctly | Integration test across `kora-crypto` and `kora-core` |
| Certificate revocation propagates and is enforced within 1 minute     | Timed integration test                                |
| Time-travel checkpoint captures full schema + data state              | Checkpoint vs. manual snapshot comparison             |
| Behavioral replay detects all injected divergences in test suite      | Adversarial test suite with 50+ mutation scenarios    |
| Fraud detector flags statistical, referential, and temporal anomalies | Precision/recall against labeled test dataset         |
| gRPC `CertificateService` and `VerificationService` serve requests    | `grpcurl` smoke tests against running instance        |

**Unlocks**: Phase 6 (certificate structures for identity credentials)

### Gate 2: AMANI Privacy Engine

| Criterion                                                                                                               | Evidence                                                                               |
| ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| All four CRDT types (G-Counter, PN-Counter, LWW-Register, OR-Set) satisfy commutativity, associativity, and idempotency | Property-based tests with `proptest` (10K+ cases each)                                 |
| CRDT sync protocol merges 45 days of offline operations without data loss                                               | Integration test simulating extended disconnection                                     |
| Differential privacy engine calibrates noise to configured epsilon                                                      | Statistical verification: run 10K queries, measure actual vs. theoretical privacy loss |
| Federated extraction agent never transmits raw data                                                                     | Network traffic audit in integration test environment                                  |
| Paillier encrypted queries return correct similarity matches                                                            | Correctness test comparing encrypted vs. plaintext results                             |
| Privacy budget ledger is tamper-evident (hash-chained)                                                                  | Tamper injection test: modify a ledger entry, verify detection                         |
| Automatic behavior change triggers at 80% and 100% budget thresholds                                                    | Threshold simulation test                                                              |

**Unlocks**: Phase 4 (privacy budget integration with consensus)

### Gate 3: Network Layer

| Criterion                                                          | Evidence                                     |
| ------------------------------------------------------------------ | -------------------------------------------- |
| Node identity persists across restarts and is verifiable           | Restart cycle test with identity comparison  |
| DNS seed discovery finds peers within 30 seconds                   | Timed test against seed infrastructure       |
| PEX protocol stabilizes peer graph within 3 rounds                 | Multi-node simulation                        |
| Message envelope rejects replayed, unsigned, and tampered messages | Adversarial message injection test suite     |
| WSS and MQTT transports deliver messages under normal conditions   | Transport-level integration tests            |
| Mesh cluster forms over BLE within 60 seconds                      | Hardware-in-the-loop test (or simulated BLE) |
| Offline sync queue buffers and merges 45 days of operations        | Extended offline simulation                  |

**Unlocks**: Phase 4 (PANX consensus requires reliable peer communication)

### Gate 4: PANX Consensus

| Criterion                                                           | Evidence                                   |
| ------------------------------------------------------------------- | ------------------------------------------ |
| Validator weights compute correctly across all four tiers           | Unit tests covering every tier combination |
| Weighted quorum calculation matches formal specification            | Property-based tests with `proptest`       |
| Full PBFT round (pre-prepare → reply) completes in under 3 seconds  | Benchmark with `criterion`                 |
| View change recovers from leader failure within 2 rounds            | Fault injection test                       |
| System tolerates f < n/3 Byzantine faults without safety violations | 10K-round adversarial simulation           |
| Throughput exceeds 5,000 TPS                                        | Load test with realistic message sizes     |
| Audit trail is hash-chained and fully reconstructable               | Audit reconstruction verification          |

**Unlocks**: Production consensus (no downstream dependencies)

### Gate 5: ZK Proof System

| Criterion                                                                 | Evidence                                        |
| ------------------------------------------------------------------------- | ----------------------------------------------- |
| Groth16 proof generation and verification work for all four circuit types | End-to-end tests per circuit                    |
| Trusted setup produces valid keys with toxic waste disposal verified      | Setup ceremony log with `Zeroizing` attestation |
| Proof generation under 5 seconds at p95                                   | `criterion` benchmark                           |
| Proof verification under 100 milliseconds at p95                          | `criterion` benchmark                           |
| Batch verification of 100 proofs under 5 seconds                          | `criterion` benchmark                           |
| Soundness: invalid witnesses produce no valid proofs                      | Adversarial prover tests per circuit            |
| BBS+ selective disclosure reveals only chosen attributes                  | Disclosure completeness test                    |

**Unlocks**: Phase 6 (identity system requires selective disclosure)

### Gate 6: Identity and Key Management

| Criterion                                                         | Evidence                                         |
| ----------------------------------------------------------------- | ------------------------------------------------ |
| TradePass identity documents serialize/deserialize correctly      | Round-trip tests with all field combinations     |
| HD key hierarchy derives correct keys at all levels               | BIP-32 reference vector comparison               |
| HSM integration signs and verifies via PKCS#11                    | Integration test with SoftHSM                    |
| Selective disclosure reveals only requested credential attributes | End-to-end credential presentation test          |
| RBAC enforces permission boundaries at every API endpoint         | Authorization matrix test                        |
| Key rotation preserves access to previously encrypted data        | Rotation cycle test with decryption verification |

**Unlocks**: Production deployment (final gate)

---

## Prioritized Backlog

### Tier P0 — Must Have (blocks other epics)

| Rank | Story                               | Epic | Points | Blocks                                    |
| ---- | ----------------------------------- | ---- | ------ | ----------------------------------------- |
| 1    | KORA-US-001: Merkle Tree Node       | E01  | 3      | All E01 certificate work                  |
| 2    | KORA-US-002: Tree Construction      | E01  | 3      | Certificate chain validation              |
| 3    | KORA-US-003: Inclusion Proofs       | E01  | 2      | Certificate integrity                     |
| 4    | KORA-US-004: Certificate Schema     | E01  | 3      | All certificate operations                |
| 5    | KORA-US-005: Certificate Signing    | E01  | 2      | Certificate trust model                   |
| 6    | KORA-US-006: Chain of Trust         | E01  | 3      | E06 identity credentials                  |
| 7    | S6.1: G-Counter                     | E02  | 2      | CRDT sync protocol                        |
| 8    | S6.2: PN-Counter                    | E02  | 2      | Privacy budget accounting                 |
| 9    | S6.3: LWW-Register                  | E02  | 2      | Offline state sync                        |
| 10   | S6.4: OR-Set                        | E02  | 2      | Pattern collection sync                   |
| 11   | NET-US-001: Node Identity           | E03  | 2      | All networking, E04 validators            |
| 12   | NET-US-005: Message Envelope        | E03  | 3      | All transport, E04 PBFT messages          |
| 13   | ZKP-US-001: Circuit Abstraction     | E05  | 3      | All ZK circuits, E06 selective disclosure |
| 14   | ZKP-US-002: Trusted Setup           | E05  | 3      | All application circuits                  |
| 15   | PANX-US-001: Validator Registration | E04  | 2      | All consensus                             |
| 16   | PANX-US-003: Quorum Calculation     | E04  | 2      | PBFT message flow                         |
| 17   | PANX-US-004: Pre-Prepare            | E04  | 3      | All PBFT phases                           |
| 18   | ID-US-001: TradePass Schema         | E06  | 3      | Identity system                           |

### Tier P1 — Should Have (production readiness)

| Rank | Story                               | Epic | Points | Blocks                            |
| ---- | ----------------------------------- | ---- | ------ | --------------------------------- |
| 19   | KORA-US-007: Certificate Revocation | E01  | 3      | Production certificate management |
| 20   | KORA-US-008: Revocation Propagation | E01  | 2      | Distributed trust                 |
| 21   | KORA-US-009: Schema Checkpoint      | E01  | 3      | Time-travel verification          |
| 22   | KORA-US-010: Data Checkpoint        | E01  | 3      | Behavioral replay                 |
| 23   | S7.1: Sync Protocol                 | E02  | 3      | Offline merge                     |
| 24   | S7.2: Conflict Resolution           | E02  | 2      | Production sync                   |
| 25   | S7.3: Sync Compression              | E02  | 2      | Network efficiency                |
| 26   | S7.4: Sync Monitoring               | E02  | 1      | Operational visibility            |
| 27   | NET-US-002: DNS Seed Discovery      | E03  | 2      | Network bootstrap                 |
| 28   | NET-US-003: Peer Exchange           | E03  | 2      | Network resilience                |
| 29   | NET-US-006: WSS Transport           | E03  | 2      | Primary transport                 |
| 30   | NET-US-007: MQTT Transport          | E03  | 2      | Constrained devices               |
| 31   | PANX-US-002: Weight Calculation     | E04  | 1      | Weighted quorum                   |
| 32   | PANX-US-005: Prepare Phase          | E04  | 3      | Commit phase                      |
| 33   | PANX-US-006: Commit Phase           | E04  | 2      | Consensus finality                |
| 34   | PANX-US-007: Reply                  | E04  | 2      | Client response                   |
| 35   | PANX-US-008: View Change            | E04  | 3      | Leader fault tolerance            |
| 36   | ZKP-US-003: Proof Serialization     | E05  | 2      | Network transmission              |
| 37   | ZKP-US-004: GCI Score Circuit       | E05  | 3      | Compliance proofs                 |
| 38   | ZKP-US-005: Location Circuit        | E05  | 5      | Jurisdictional compliance         |
| 39   | S8.1: Gaussian Mechanism            | E02  | 3      | Differential privacy              |
| 40   | S8.2: Privacy Accountant            | E02  | 2      | Budget tracking                   |
| 41   | KORA-US-011: State Reconstruction   | E01  | 2      | Replay verification               |
| 42   | KORA-US-012: Checkpoint Integrity   | E01  | 2      | Tamper detection                  |
| 43   | KORA-US-013: Behavioral Replay      | E01  | 3      | Equivalence verification          |
| 44   | KORA-US-014: Result Comparison      | E01  | 3      | Divergence detection              |
| 45   | KORA-US-015: Semantic Comparison    | E01  | 2      | Business logic equivalence        |
| 46   | KORA-US-016: Divergence Analysis    | E01  | 3      | Root cause identification         |
| 47   | KORA-US-017: Confidence Scoring     | E01  | 2      | Verification quality              |

### Tier P2 — Nice to Have (quality and performance)

| Rank | Story                                           | Epic | Points | Blocks                      |
| ---- | ----------------------------------------------- | ---- | ------ | --------------------------- |
| 48   | KORA-US-018: Statistical Anomaly Detection      | E01  | 3      | Fraud detection             |
| 49   | KORA-US-019: Referential Integrity Verification | E01  | 3      | Data quality                |
| 50   | KORA-US-020: Temporal Anomaly Detection         | E01  | 2      | Time-series validation      |
| 51   | S8.3: Noise Calibration                         | E02  | 2      | Utility optimization        |
| 52   | S8.4: Composition Theorem                       | E02  | 1      | Multi-query privacy         |
| 53   | S9.1: Local Pattern Agent                       | E02  | 3      | Federated learning          |
| 54   | S9.2: Pattern Abstraction                       | E02  | 2      | Safe transmission           |
| 55   | S9.3: Aggregation Server                        | E02  | 3      | Central knowledge base      |
| 56   | S9.4: Quality Scoring                           | E02  | 2      | Pattern ranking             |
| 57   | NET-US-004: Peer Reputation                     | E03  | 2      | Network health              |
| 58   | NET-US-008: Transport Selection                 | E03  | 1      | Adaptive routing            |
| 59   | NET-US-009: Mesh Cluster Formation              | E03  | 3      | Offline mesh                |
| 60   | PANX-US-009: BFT Verification                   | E04  | 2      | Security assurance          |
| 61   | PANX-US-010: Performance Benchmarking           | E04  | 2      | Throughput validation       |
| 62   | PANX-US-011: Consensus Audit Trail              | E04  | 1      | Regulatory compliance       |
| 63   | ZKP-US-006: Asset Ownership Circuit             | E05  | 3      | Confidential assets         |
| 64   | ZKP-US-007: Amount Range Circuit                | E05  | 2      | Confidential transactions   |
| 65   | ZKP-US-008: Proof Performance                   | E05  | 2      | Interactive use cases       |
| 66   | ZKP-US-009: Batch Verification                  | E05  | 2      | Throughput optimization     |
| 67   | S10.1: Paillier Key Generation                  | E02  | 2      | Encrypted computation       |
| 68   | S10.2: Encrypted Queries                        | E02  | 3      | Privacy-preserving matching |
| 69   | S10.3: Similarity Engine                        | E02  | 3      | Pattern matching            |
| 70   | S10.4: Performance Optimization                 | E02  | 2      | Practical latency           |

### Tier P3 — Defer (ship without)

| Rank | Story                                 | Epic | Points | Blocks                |
| ---- | ------------------------------------- | ---- | ------ | --------------------- |
| 71   | NET-US-010: Mesh Routing Table        | E03  | 3      | Multi-hop mesh        |
| 72   | NET-US-011: Offline Sync Queue        | E03  | 2      | Extended offline      |
| 73   | ZKP-US-010: BBS+ Selective Disclosure | E05  | 1      | Advanced credentials  |
| 74   | S11.1: Budget Ledger                  | E02  | 3      | Privacy accounting    |
| 75   | S11.2: Budget Allocation              | E02  | 2      | Per-customer limits   |
| 76   | S11.3: Threshold Enforcement          | E02  | 2      | Automatic protection  |
| 77   | S11.4: Budget Reporting               | E02  | 1      | Compliance visibility |
| 78   | ID-US-002: Key Hierarchy              | E06  | 3      | Key management        |
| 79   | ID-US-003: HSM Integration            | E06  | 5      | Hardware security     |
| 80   | ID-US-004: Selective Disclosure       | E06  | 3      | Credential privacy    |
| 81   | ID-US-005: RBAC                       | E06  | 3      | Access control        |

---

## Integration Sprints

These sprints occur at phase boundaries where independently developed subsystems must connect. They are not included in individual epic story point totals.

### INT-1: KORA + Crypto Foundation Wiring (between Gate 0 and Gate 1)

**When**: After Sprint 2 (certificates operational)
**Duration**: 1 sprint (2 weeks)
**Points**: 8

| Story   | Description                                                                    | Points |
| ------- | ------------------------------------------------------------------------------ | ------ |
| INT-1.1 | Wire `kora-crypto` Merkle proofs into certificate generator                    | 2      |
| INT-1.2 | Connect `gtcx-crypto::audit` hash chain to verification event log              | 2      |
| INT-1.3 | Integrate Ed25519 signing from `gtcx-crypto::signing` into certificate service | 2      |
| INT-1.4 | End-to-end integration test: migration → verification → signed certificate     | 2      |

### INT-2: Network + Consensus Handshake (between Gate 3 and Gate 4)

**When**: After Sprint 14 (network layer complete)
**Duration**: 1 sprint (2 weeks)
**Points**: 10

| Story   | Description                                                  | Points |
| ------- | ------------------------------------------------------------ | ------ |
| INT-2.1 | Wire validator registration to node identity system          | 2      |
| INT-2.2 | Route PBFT messages through NET-US-005 message envelope      | 3      |
| INT-2.3 | Connect peer reputation scores to validator weight modifiers | 2      |
| INT-2.4 | End-to-end test: 7-node cluster runs 1,000 consensus rounds  | 3      |

### INT-3: ZK Proofs + Identity Binding (between Gate 5 and Gate 6)

**When**: After Sprint 20 (ZK system complete)
**Duration**: 1 sprint (2 weeks)
**Points**: 10

| Story   | Description                                                                               | Points |
| ------- | ----------------------------------------------------------------------------------------- | ------ |
| INT-3.1 | Wire BBS+ selective disclosure into TradePass credential presentation                     | 3      |
| INT-3.2 | Integrate GCI score threshold proof into compliance verification flow                     | 2      |
| INT-3.3 | Connect Groth16 proofs to KORA certificate evidence chain                                 | 3      |
| INT-3.4 | End-to-end test: create identity → issue credential → selective disclosure → verification | 2      |

### INT-4: Full System Integration (after Gate 6)

**When**: After all gates pass
**Duration**: 2 sprints (4 weeks)
**Points**: 16

| Story   | Description                                                                                                         | Points |
| ------- | ------------------------------------------------------------------------------------------------------------------- | ------ |
| INT-4.1 | Migration flow: MABA transform → KORA verify → certificate with Merkle proof                                        | 3      |
| INT-4.2 | Privacy flow: federated extraction → encrypted query → differential privacy → budget debit                          | 3      |
| INT-4.3 | Consensus flow: validator registration → weighted PBFT → audit trail → certificate endorsement                      | 3      |
| INT-4.4 | Identity flow: TradePass creation → key hierarchy → HSM signing → selective disclosure → RBAC enforcement           | 3      |
| INT-4.5 | Cross-cutting: offline node buffers operations → reconnects → CRDT merge → consensus catch-up → certificate resync  | 2      |
| INT-4.6 | Adversarial integration: Byzantine validators + network partitions + expired privacy budgets + revoked certificates | 2      |

---

## Sprint Sequencing (Dependency-Aware)

This table shows the recommended sprint order across all epics, accounting for dependencies and parallel tracks.

| Sprint | Track A (KORA)    | Track B (AMANI)      | Track C (Network/ZK)       | Integration |
| ------ | ----------------- | -------------------- | -------------------------- | ----------- |
| 1      | Merkle Tree       | --                   | --                         | --          |
| 2      | Certificates      | --                   | --                         | --          |
| 3      | Time-Travel       | CRDT Data Types      | Node Identity              | --          |
| --     | --                | --                   | --                         | **INT-1**   |
| 4      | Behavioral Replay | CRDT Sync Protocol   | Transport + Envelope       | --          |
| 5      | Fraud Detection   | Differential Privacy | Mesh Networking            | --          |
| 6      | --                | Federated Learning   | Arkworks Integration       | --          |
| --     | --                | --                   | --                         | **INT-2**   |
| 7      | --                | Homomorphic Matching | Validator Registry         | --          |
| 8      | --                | Privacy Budget       | PBFT Message Flow          | --          |
| 9      | --                | --                   | Consensus Hardening        | --          |
| 10     | --                | --                   | Application Circuits       | --          |
| --     | --                | --                   | --                         | **INT-3**   |
| 11     | --                | --                   | ZK Performance             | --          |
| 12     | --                | --                   | Identity: TradePass + Keys | --          |
| 13     | --                | --                   | Identity: HSM + Disclosure | --          |
| 14     | --                | --                   | Identity: RBAC + Rotation  | --          |
| 15-16  | --                | --                   | --                         | **INT-4**   |

**Total**: 14 epic sprints + 5 integration sprints = 19 sprints (~38 weeks)

Three tracks run in parallel where dependencies allow:

- **Track A** (KORA): Sprints 1-5 — can start immediately
- **Track B** (AMANI): Sprints 3-8 — starts after Phase 0 gate, overlaps with Track A
- **Track C** (Network → Consensus → ZK → Identity): Sprints 3-14 — longest track, serial within itself

Integration sprints (INT-1 through INT-4) are hard gates where all three tracks synchronize.

---

## Cross-Epic Dependency Matrix

This matrix shows which stories in each epic depend on stories from other epics.

| Consuming Story                      | Depends On                       | Reason                                           |
| ------------------------------------ | -------------------------------- | ------------------------------------------------ |
| PANX-US-001 (Validator Registration) | NET-US-001 (Node Identity)       | Validators need DID-based identity               |
| PANX-US-004 (Pre-Prepare)            | NET-US-005 (Message Envelope)    | PBFT messages use authenticated envelopes        |
| PANX-US-002 (Weight Calculation)     | NET-US-004 (Peer Reputation)     | Reputation modifier feeds weight calc            |
| ID-US-001 (TradePass Schema)         | KORA-US-006 (Chain of Trust)     | Identity credentials reference certificate chain |
| ID-US-004 (Selective Disclosure)     | ZKP-US-010 (BBS+ Disclosure)     | Identity presentation uses BBS+ proofs           |
| INT-3.3 (Proofs in certificates)     | KORA-US-004 (Certificate Schema) | ZK proofs embedded in certificate evidence       |
| INT-4.2 (Privacy flow)               | S11.1 (Budget Ledger)            | End-to-end flow requires privacy accounting      |
| INT-4.3 (Consensus flow)             | PANX-US-011 (Audit Trail)        | Consensus endorsement needs audit chain          |

---

**Document Status**: Living document — updated every sprint planning
**Next Review**: Sprint 1 planning
