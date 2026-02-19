# Epic E01: KORA Verification Pipeline

## Document Information

- **Project**: GTCX Cryptographic Systems
- **Epic**: E01 -- KORA Verification Pipeline
- **Phase**: 1
- **Priority**: P0 (Critical)
- **Date**: 2026-02-03
- **Owner**: Crypto Engineering
- **Estimated Effort**: 5 sprints (10 weeks)
- **Total Story Points**: 55
- **Classification**: CONFIDENTIAL
- **Dependencies**: Phase 0 (Cryptographic Foundation) -- DONE
- **Success Criteria**: End-to-end verification pipeline produces cryptographically signed behavioral equivalence certificates for database migrations, with fraud detection, time-travel replay, and Merkle proof infrastructure fully operational

## Epic Overview

KORA ("Truth Oracle") is a Rust-based verification engine that provides behavioral equivalence certificates for database migrations. This epic implements the full KORA verification pipeline on top of the existing stub infrastructure in `sensei-ai/packages/sensei-rs/kora-core/` and `kora-crypto/`.

### What Exists Today

| Component                      | Location                                       | Status                                                                                                               |
| ------------------------------ | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `kora-core/src/lib.rs`         | `sensei-rs/kora-core/src/lib.rs`               | 269 lines; `VerificationResult`, `VerificationType`, `VerificationStatus` types; `Verifier` struct with stub methods |
| `kora-crypto/src/lib.rs`       | `sensei-rs/kora-crypto/src/lib.rs`             | 60 lines; `hash_blake3` and `hash_sha256` functions                                                                  |
| `kora-crypto/src/merkle.rs`    | `sensei-rs/kora-crypto/src/merkle.rs`          | 2-line stub                                                                                                          |
| `kora-crypto/src/signature.rs` | `sensei-rs/kora-crypto/src/signature.rs`       | 2-line stub                                                                                                          |
| `kora-crypto/src/hash.rs`      | `sensei-rs/kora-crypto/src/hash.rs`            | 2-line stub                                                                                                          |
| `kora-crypto/src/zk.rs`        | `sensei-rs/kora-crypto/src/zk.rs`              | 2-line stub                                                                                                          |
| `kora-core/src/certificate/`   | `sensei-rs/kora-core/src/certificate/`         | `mod.rs`, `generator.rs`, `verifier.rs` -- all 2-line stubs                                                          |
| `kora-core/src/time_travel/`   | `sensei-rs/kora-core/src/time_travel/`         | `mod.rs`, `checkpoint.rs`, `reconstruction.rs`, `replay.rs` -- all 2-line stubs                                      |
| `kora-core/src/fraud/`         | `sensei-rs/kora-core/src/fraud/`               | `mod.rs`, `detector.rs`, `anomaly.rs` -- all 2-line stubs                                                            |
| `certificate.proto`            | `protocols/proto/sensei/v1/certificate.proto`  | 41 lines; `CertificateService` gRPC service with `GetCertificate`, `ListCertificates`, `RevokeCertificate`           |
| `verification.proto`           | `protocols/proto/sensei/v1/verification.proto` | 277 lines; `VerificationService` gRPC service with full request/response schemas                                     |

### What This Epic Delivers

1. Production-grade Merkle tree implementation in `kora-crypto` with SHA-256 internal nodes
2. Certificate generation, signing (Ed25519), chain-of-trust validation, and revocation in `kora-core/src/certificate/`
3. Time-travel checkpoint capture, state reconstruction, and behavioral replay in `kora-core/src/time_travel/`
4. Three-level behavioral comparison engine (exact, semantic, business) with divergence analysis and confidence scoring
5. Fraud detection module with statistical, referential, and temporal anomaly detection in `kora-core/src/fraud/`

## Sprint Allocation

| Sprint    | Theme                                 | Story Points | Stories |
| --------- | ------------------------------------- | ------------ | ------- |
| Sprint 1  | Merkle Tree Implementation            | 8            | 3       |
| Sprint 2  | Certificate Generation and Validation | 13           | 5       |
| Sprint 3  | Time-Travel Checkpoint Capture        | 13           | 4       |
| Sprint 4  | Behavioral Replay and Comparison      | 13           | 5       |
| Sprint 5  | Fraud Detection                       | 8            | 3       |
| **Total** |                                       | **55**       | **20**  |

---

## Sprint 1: Merkle Tree Implementation

**Sprint Goal**: Deliver a production-grade Merkle tree in `kora-crypto` that supports efficient proof generation and verification, forming the cryptographic backbone for certificate integrity.

**Sprint Points**: 8

### KORA-US-001: Implement MerkleTree Struct

**Story ID**: KORA-US-001
**Priority**: P0
**Story Points**: 3
**Sprint**: 1
**Assignee**: Unassigned

**User Story**:
As a verification engine, I want a MerkleTree data structure that can build a tree from leaf data, compute a root hash, generate inclusion proofs, and verify those proofs, so that certificate integrity can be cryptographically guaranteed.

**Description**:
Implement a `MerkleTree` struct in `kora-crypto/src/merkle.rs` that uses SHA-256 for hashing internal nodes. The tree must support inserting leaf data (as byte slices), computing the Merkle root, generating inclusion proofs (a vector of sibling hashes plus position indicators), and verifying a proof against a given root. The implementation must handle edge cases: empty trees, single-leaf trees, and trees whose leaf count is not a power of two (pad with hash of empty data). The struct should implement `Clone`, `Debug`, `Serialize`, and `Deserialize`.

**Acceptance Criteria**:

- MerkleTree can be constructed from a `Vec<Vec<u8>>` of leaf data
- `root()` returns the 32-byte SHA-256 Merkle root hash
- `proof(leaf_index)` returns a `MerkleProof` containing sibling hashes and directions (left/right)
- `MerkleProof::verify(leaf_data, root)` returns `true` for valid proofs and `false` for tampered proofs
- Tree with 1,000,000 leaves builds in less than 2 seconds on a single core (measured via `criterion` benchmark)
- Proof verification completes in less than 1 millisecond for any tree size up to 10,000,000 leaves
- Empty tree returns a well-defined sentinel root hash
- Single-leaf tree returns the hash of the single leaf
- Non-power-of-two leaf counts are handled correctly via padding
- All operations are deterministic: same inputs always produce identical root and proofs
- `#![deny(unsafe_code)]` is enforced
- Unit tests include at least 10 hand-computed test vectors

**Dependencies**:

- Phase 0 `hash_sha256` function in `kora-crypto/src/lib.rs` (DONE)
- `sha2` crate dependency already in `kora-crypto/Cargo.toml`

**Definition of Done**:

- Implementation complete in `kora-crypto/src/merkle.rs`
- Unit tests written and passing with 100% branch coverage for the module
- `criterion` benchmark target created; 1M-leaf build time < 2s verified
- Property-based tests with `proptest` for tree invariants (root determinism, proof validity after insert)
- Code reviewed and approved by designated security reviewer
- Module-level doc comments describe threat model assumptions
- No `unsafe` code

---

### KORA-US-002: Merkle Proof Serialization

**Story ID**: KORA-US-002
**Priority**: P0
**Story Points**: 2
**Sprint**: 1
**Assignee**: Unassigned

**User Story**:
As a certificate generator, I want to serialize and deserialize Merkle proofs so that they can be persisted alongside certificates and transmitted over gRPC.

**Description**:
Implement `Serialize` and `Deserialize` (via serde) for `MerkleProof`. Additionally provide `to_bytes()` and `from_bytes()` methods that produce a compact binary encoding suitable for embedding in protobuf `bytes` fields. The binary format must be versioned (leading version byte) to support future format changes. Include a canonical JSON serialization for debugging and logging.

**Acceptance Criteria**:

- `MerkleProof` implements `serde::Serialize` and `serde::Deserialize`
- Round-trip serialization via JSON preserves proof validity: `verify(deserialize(serialize(proof)))` returns `true`
- Round-trip serialization via binary (`to_bytes` / `from_bytes`) preserves proof validity
- Binary format includes a leading version byte (currently `0x01`)
- `from_bytes` returns a typed error for corrupt or truncated input
- Binary encoding size is within 2x of the theoretical minimum (32 bytes per sibling hash + 1 bit per direction + overhead)
- Deserializing a proof and then verifying it against the original root succeeds
- Deserializing a proof with a single tampered byte and then verifying it against the original root fails
- `cargo-fuzz` target for `from_bytes` created with a minimum of 10 million iterations before merge

**Dependencies**:

- KORA-US-001 (MerkleTree struct and MerkleProof type)

**Definition of Done**:

- Serialization logic implemented in `kora-crypto/src/merkle.rs`
- Unit tests for round-trip JSON and binary serialization
- Fuzz target created under `kora-crypto/fuzz/` for `MerkleProof::from_bytes`
- Documentation updated with binary format specification in doc comments
- Code reviewed and approved

---

### KORA-US-003: Batch Proof Generation

**Story ID**: KORA-US-003
**Priority**: P1
**Story Points**: 3
**Sprint**: 1
**Assignee**: Unassigned

**User Story**:
As a verification engine processing many verification results, I want to generate multiple Merkle inclusion proofs in a single pass so that certificate generation for large result sets is efficient.

**Description**:
Add a `proofs(indices: &[usize])` method to `MerkleTree` that generates proofs for multiple leaf indices simultaneously. The batch method should exploit shared sibling nodes to avoid redundant hash lookups. It should return a `Vec<MerkleProof>` in the same order as the input indices. Internally, collect the union of all required sibling nodes in a single tree traversal rather than performing one traversal per proof.

**Acceptance Criteria**:

- `proofs(&[usize])` returns `Vec<MerkleProof>` with one proof per requested index
- Each returned proof independently verifies against the tree root (same semantics as individual `proof()`)
- Generating a batch of 100 proofs is measurably faster than calling `proof()` 100 times individually, as demonstrated by a `criterion` benchmark
- Requesting a proof for an out-of-bounds index returns a typed error, not a panic
- Duplicate indices in the input produce duplicate (identical) proofs in the output
- Empty index list returns an empty vector
- The batch method is thread-safe (does not require `&mut self`)

**Dependencies**:

- KORA-US-001 (MerkleTree struct)

**Definition of Done**:

- Batch method implemented in `kora-crypto/src/merkle.rs`
- Unit tests covering: normal batch, single-element batch, empty batch, out-of-bounds, duplicates
- `criterion` benchmark comparing batch vs. sequential proof generation
- Property-based test: for any subset of indices, batch-generated proofs all verify individually
- Code reviewed and approved

---

## Sprint 2: Certificate Generation and Validation

**Sprint Goal**: Deliver the full certificate lifecycle -- generation, signing, chain-of-trust validation, and revocation -- so that verification results are cryptographically attested and tamper-evident.

**Sprint Points**: 13

### KORA-US-004: Certificate Data Structure

**Story ID**: KORA-US-004
**Priority**: P0
**Story Points**: 2
**Sprint**: 2
**Assignee**: Unassigned

**User Story**:
As a verification pipeline, I want a Rust `Certificate` struct that faithfully represents the `Certificate` message defined in `certificate.proto` and `verification.proto`, so that certificates can be generated, serialized, and transmitted without schema drift.

**Description**:
Implement a `Certificate` struct in `kora-core/src/certificate/generator.rs` (or a new `types.rs` if cleaner) that contains: `certificate_id` (String), `migration_id` (UUID), `issued_at` (DateTime), `expires_at` (DateTime), verification results (Vec of VerificationResult), `overall_score` (f64), `hash` (hex-encoded SHA-256), `signature` (hex-encoded Ed25519 signature), `public_key` (hex-encoded Ed25519 public key), `coverage_metrics` (struct with table coverage, column coverage, row sample rate), `confidence_score` (f64 in [0.0, 1.0]), and `audit_trail` (Vec of AuditEntry with timestamp, action, actor, details). The struct must derive `Serialize`, `Deserialize`, `Clone`, and `Debug`. Provide `From`/`Into` conversions between this struct and the generated protobuf type.

**Acceptance Criteria**:

- `Certificate` struct contains all fields from the proto `Certificate` message (verification.proto lines 231-248)
- Additional fields for `coverage_metrics` and `confidence_score` are included per GitBook specification
- `Certificate` derives `Serialize`, `Deserialize`, `Clone`, `Debug`
- Conversion to/from protobuf generated type compiles and round-trips correctly
- Default certificate has `expires_at` set to 90 days after `issued_at`
- `AuditEntry` struct matches proto definition: timestamp, action, actor, details
- JSON serialization of a fully populated `Certificate` matches the canonical schema
- All field names use snake_case in Rust and map correctly to proto field names

**Dependencies**:

- Proto definitions in `verification.proto` and `certificate.proto` (DONE)
- `prost` / `tonic` dependencies in `kora-core/Cargo.toml` (DONE)

**Definition of Done**:

- Struct implemented with full field coverage
- Unit tests for construction, default values, serialization round-trip, and proto conversion
- Code reviewed and approved
- Doc comments reference the proto field numbers for traceability

---

### KORA-US-005: Certificate Signing

**Story ID**: KORA-US-005
**Priority**: P0
**Story Points**: 3
**Sprint**: 2
**Assignee**: Unassigned

**User Story**:
As a verification pipeline, I want to sign certificates with an Ed25519 key so that the authenticity and integrity of each certificate can be verified by any party holding the public key.

**Description**:
Implement certificate signing in `kora-core/src/certificate/generator.rs`. The signing process: (1) compute the Merkle root of all `VerificationResult` entries in the certificate by hashing each result's canonical JSON form as a leaf, (2) construct the signing payload as `certificate_id || migration_id || merkle_root || issued_at || expires_at || overall_score`, (3) sign the payload with the KORA signing authority's Ed25519 private key, (4) populate the certificate's `hash`, `signature`, and `public_key` fields. The signing authority key must be loaded from a configurable source (environment variable, file path, or HSM interface trait). Private key material must be wrapped in `Zeroizing<T>`.

**Acceptance Criteria**:

- Signing produces a valid Ed25519 signature verifiable with the corresponding public key
- The Merkle root of all verification results is embedded in the signing payload
- Signing payload format is deterministic: identical inputs always produce identical payloads
- The `hash` field contains the SHA-256 hash of the signing payload (hex-encoded)
- The `signature` field contains the Ed25519 signature (hex-encoded)
- The `public_key` field contains the Ed25519 public key (hex-encoded)
- Private key material is wrapped in `Zeroizing<T>` and never logged or serialized
- A `SigningAuthority` trait abstracts key loading, supporting at minimum `FileKeyProvider` and `EnvKeyProvider` implementations
- Signing a certificate twice with the same key produces identical signatures (deterministic)
- Signing with a different key produces a different signature
- Unit test verifies signature using `ed25519-dalek` verify

**Dependencies**:

- KORA-US-001 (MerkleTree for computing root of verification results)
- KORA-US-004 (Certificate data structure)
- `ed25519-dalek` crate in `kora-crypto/Cargo.toml` (DONE)
- Phase 0 `signing` module in `gtcx-crypto` (DONE)

**Definition of Done**:

- Signing logic implemented in `kora-core/src/certificate/generator.rs`
- `SigningAuthority` trait and at least two implementations in `kora-crypto/src/signature.rs`
- Unit tests including known-answer test with a fixed test keypair
- Private key handling reviewed by security reviewer for zeroization compliance
- No private key material appears in any log output or serialized form
- Code reviewed and approved

---

### KORA-US-006: Certificate Chain of Trust

**Story ID**: KORA-US-006
**Priority**: P0
**Story Points**: 3
**Sprint**: 2
**Assignee**: Unassigned

**User Story**:
As an auditor validating a migration certificate, I want a chain of trust from a root certificate authority through the KORA signing authority to the individual migration certificate, so that I can verify the provenance of any certificate without trusting the issuing system directly.

**Description**:
Implement a three-level certificate chain: (1) Root CA -- a self-signed Ed25519 certificate that signs (2) KORA Signing Authority certificate, which in turn signs (3) Migration Certificates. Each level includes the public key of the level below, signed by the level above. Implement a `CertificateChain` struct that holds all three levels and a `validate_chain()` method that verifies each link. The Root CA certificate is embedded as a constant (compiled into the binary) for zero-trust bootstrapping. The KORA Signing Authority certificate is loaded at runtime.

**Acceptance Criteria**:

- `CertificateChain` struct contains: root CA certificate, signing authority certificate, migration certificate
- `validate_chain()` verifies: root CA is self-signed, signing authority cert is signed by root CA, migration cert is signed by signing authority
- Chain validates end-to-end when all signatures are valid
- Chain validation fails if the root CA signature is tampered
- Chain validation fails if the signing authority certificate is tampered
- Chain validation fails if the migration certificate is tampered
- Root CA public key is embedded as a compile-time constant (`const ROOT_CA_PUBLIC_KEY: [u8; 32]`)
- Chain validation returns structured errors indicating which link in the chain failed
- The chain validation function is pure (no I/O, no side effects) for testability

**Dependencies**:

- KORA-US-005 (Certificate signing with Ed25519)

**Definition of Done**:

- `CertificateChain` and `validate_chain()` implemented in `kora-core/src/certificate/verifier.rs`
- Unit tests for: valid chain, tampered root, tampered authority, tampered migration cert, expired certificates in chain
- Integration test building and validating a full chain from scratch
- Doc comments describe the trust model and assumptions
- Code reviewed and approved

---

### KORA-US-007: Certificate Validation

**Story ID**: KORA-US-007
**Priority**: P0
**Story Points**: 3
**Sprint**: 2
**Assignee**: Unassigned

**User Story**:
As a downstream system consuming a migration certificate, I want to validate the certificate's signature, expiry, Merkle proofs, and revocation status, so that I can trust the certificate before acting on its verification results.

**Description**:
Implement `validate_certificate()` in `kora-core/src/certificate/verifier.rs`. Validation performs the following checks in order: (1) verify the Ed25519 signature against the certificate's public key and signing payload, (2) check that `issued_at` is in the past and `expires_at` is in the future, (3) recompute the Merkle root from the certificate's verification results and compare to the embedded Merkle root in the hash, (4) check the certificate ID against the revocation list. Return a `ValidationResult` with a boolean `valid` field, a `reason` string, and structured error details. Map directly to the proto `ValidationResult` message.

**Acceptance Criteria**:

- Valid certificate passes all four checks and returns `valid: true`
- Certificate with a tampered signature returns `valid: false` with reason containing "signature"
- Certificate with `expires_at` in the past returns `valid: false` with reason containing "expired"
- Certificate with `issued_at` in the future returns `valid: false` with reason containing "not yet valid"
- Certificate with a modified verification result (changing the Merkle root) returns `valid: false` with reason containing "merkle"
- Certificate whose ID appears in the revocation list returns `valid: false` with reason containing "revoked"
- Validation completes in under 5 milliseconds for a certificate with 100 verification results
- `ValidationResult` maps to/from the proto `ValidationResult` message
- Validation checks execute in the specified order; first failure short-circuits and returns

**Dependencies**:

- KORA-US-005 (Certificate signing, for signature verification)
- KORA-US-006 (Chain of trust, for key validation)
- KORA-US-008 (Certificate revocation, for revocation list)

**Definition of Done**:

- Validation logic implemented in `kora-core/src/certificate/verifier.rs`
- Unit tests for each failure mode (tampered signature, expired, future-dated, tampered Merkle root, revoked)
- Unit test for the happy path (all checks pass)
- Performance test confirming < 5ms for 100 verification results
- Code reviewed and approved

---

### KORA-US-008: Certificate Revocation

**Story ID**: KORA-US-008
**Priority**: P1
**Story Points**: 2
**Sprint**: 2
**Assignee**: Unassigned

**User Story**:
As a security operator, I want to revoke a previously issued certificate so that compromised or incorrect certificates are rejected by all consumers within a bounded time window.

**Description**:
Implement a `RevocationList` in `kora-core/src/certificate/verifier.rs` (or a dedicated `revocation.rs`). The revocation list is a thread-safe, in-memory set of revoked certificate IDs backed by a persistent store (trait-abstracted for storage flexibility). When `revoke(certificate_id, reason)` is called, the certificate ID is added to the in-memory set and persisted. The `is_revoked(certificate_id)` method checks the in-memory set. The list must support periodic reload from the persistent store to synchronize across instances. Map to the proto `RevokeCertificateRequest` / `RevokeCertificateResponse` messages.

**Acceptance Criteria**:

- `revoke(certificate_id, reason)` adds the ID to the revocation list and persists the entry
- `is_revoked(certificate_id)` returns `true` for revoked certificates and `false` for non-revoked ones
- A revoked certificate fails validation (via KORA-US-007) within 1 minute of revocation when running in the same process
- The revocation list is thread-safe (`Send + Sync`) and supports concurrent reads and writes
- `RevocationStore` trait abstracts persistence, with an in-memory implementation for testing
- Revocation entries include: certificate_id, reason, revoked_at timestamp, actor
- `list_revoked()` returns all revoked certificate IDs with metadata
- Re-revoking an already-revoked certificate is a no-op (idempotent)
- Proto message mapping: `RevokeCertificateRequest` and `RevokeCertificateResponse` conversions implemented

**Dependencies**:

- KORA-US-004 (Certificate data structure, for certificate ID type)

**Definition of Done**:

- Revocation list implemented with thread-safe in-memory set (using `dashmap` or `RwLock<HashSet>`)
- `RevocationStore` trait and in-memory implementation
- Unit tests for: revoke, is_revoked, idempotent re-revocation, concurrent access (multi-threaded test)
- Proto message conversion tests
- Code reviewed and approved

---

## Sprint 3: Time-Travel Checkpoint Capture

**Sprint Goal**: Implement the time-travel checkpoint system that captures database state, query workloads, and temporal markers at specific points in a migration lifecycle, forming the basis for behavioral replay in Sprint 4.

**Sprint Points**: 13

### KORA-US-009: Checkpoint State Capture

**Story ID**: KORA-US-009
**Priority**: P0
**Story Points**: 5
**Sprint**: 3
**Assignee**: Unassigned

**User Story**:
As a verification engine, I want to capture a snapshot of database state at a specific point in time -- including DDL, data samples, stored procedures, triggers, and views -- so that I can later reconstruct that state for behavioral comparison.

**Description**:
Implement `capture_checkpoint()` in `kora-core/src/time_travel/checkpoint.rs`. A checkpoint captures: (1) full DDL for all tables (CREATE TABLE statements), (2) representative data samples per table (configurable sample rate, default 1%), (3) stored procedure definitions, (4) trigger definitions, (5) view definitions. Each component is individually hashed (SHA-256) and the component hashes are combined into a checkpoint hash via a Merkle tree. The checkpoint is represented as a `Checkpoint` struct containing all components, their individual hashes, the composite hash, and metadata (migration_id, capture timestamp, description). Database access is abstracted via a `DatabaseSnapshot` trait to support multiple database engines. Map to the proto `CaptureCheckpointRequest` / `CaptureCheckpointResponse` messages.

**Acceptance Criteria**:

- `capture_checkpoint()` captures DDL, data samples, stored procedures, triggers, and views
- Each component is individually hashed with SHA-256
- The composite checkpoint hash is a Merkle root of the component hashes
- Capturing the same database state twice produces identical checkpoint hashes (deterministic, reproducible)
- `DatabaseSnapshot` trait abstracts database access with methods: `get_ddl()`, `sample_data(table, rate)`, `get_procedures()`, `get_triggers()`, `get_views()`
- At least one implementation of `DatabaseSnapshot` exists (PostgreSQL or mock)
- Data samples are captured in a canonical row ordering (sorted by primary key) to ensure determinism
- Checkpoint struct includes: checkpoint_id, migration_id, captured_at, description, component hashes, composite hash, size_bytes
- Proto message mapping: `CaptureCheckpointRequest` to function parameters, `CaptureCheckpointResponse` from checkpoint metadata

**Dependencies**:

- KORA-US-001 (MerkleTree for composite hash computation)
- `sqlx` dependency in `kora-core/Cargo.toml` (DONE)

**Definition of Done**:

- Checkpoint capture implemented in `kora-core/src/time_travel/checkpoint.rs`
- `DatabaseSnapshot` trait defined with mock implementation
- Unit tests using mock database snapshot: deterministic hashing, component capture, edge cases (empty database, no procedures)
- Integration test with a real PostgreSQL instance (behind a feature flag `integration-tests`)
- Doc comments describe the canonical ordering and hashing scheme
- Code reviewed and approved

---

### KORA-US-010: Query Workload Capture

**Story ID**: KORA-US-010
**Priority**: P0
**Story Points**: 3
**Sprint**: 3
**Assignee**: Unassigned

**User Story**:
As a verification engine, I want to capture query workloads with their result sets in a canonical form, so that I can replay them against a reconstructed target state and compare outputs.

**Description**:
Implement query workload capture in `kora-core/src/time_travel/checkpoint.rs` (or a dedicated `workload.rs`). Queries can come from two sources: (1) database query logs (parsed from `pg_stat_statements` or equivalent), (2) explicitly provided queries in the `CaptureCheckpointRequest.queries` field. For each captured query, execute it against the current database state and record the result set. Result sets are stored in a canonical form: rows sorted by all columns left-to-right using a stable sort, NULLs sorted first, strings in NFC normalization, timestamps in UTC, and floating-point numbers rounded to a configurable number of significant digits (default 15). Each canonical result set is hashed for comparison.

**Acceptance Criteria**:

- Queries from `CaptureCheckpointRequest.queries` are captured and executed
- Query log parsing is supported via a `QueryLogSource` trait with at least a mock implementation
- Result sets are stored in canonical form: deterministic row ordering, NFC strings, UTC timestamps, rounded floats
- Canonical ordering is deterministic regardless of the database's native result ordering
- Each canonical result set is hashed (SHA-256) for efficient comparison
- `CapturedQuery` struct contains: query text, parameter bindings, canonical result hash, result row count, capture timestamp
- Capturing the same query against the same data twice produces an identical canonical result hash
- NULL values sort before non-NULL values in canonical ordering
- Empty result sets are handled correctly (hash of empty data)

**Dependencies**:

- KORA-US-009 (Checkpoint state capture, for integration with checkpoint flow)

**Definition of Done**:

- Query workload capture implemented
- `QueryLogSource` trait and mock implementation
- Canonical result set ordering and hashing implemented and tested
- Unit tests: deterministic ordering, NFC normalization, UTC conversion, float rounding, NULL handling, empty results
- Property-based tests with `proptest`: canonical ordering invariants
- Code reviewed and approved

---

### KORA-US-011: Temporal Marker Tracking

**Story ID**: KORA-US-011
**Priority**: P1
**Story Points**: 2
**Sprint**: 3
**Assignee**: Unassigned

**User Story**:
As a verification engine, I want to track transaction IDs and log sequence numbers (LSNs) for each checkpoint, so that I can establish point-in-time consistency and capture multiple checkpoints for the same migration.

**Description**:
Extend the `Checkpoint` struct with temporal markers: database transaction ID (or equivalent), log sequence number (LSN), and wall-clock timestamp at capture time. Implement a `TemporalMarker` struct that encapsulates these values. When a checkpoint is captured, the current temporal marker is recorded alongside it. Multiple checkpoints can be captured for the same `migration_id` at different temporal markers. The temporal markers establish a total ordering of checkpoints for a migration and enable correlation with database write-ahead logs for forensic analysis.

**Acceptance Criteria**:

- `TemporalMarker` struct contains: transaction_id (String), lsn (u64), wall_clock (DateTime<Utc>)
- Each `Checkpoint` includes its `TemporalMarker`
- Multiple checkpoints can be captured for the same `migration_id` with different temporal markers
- Temporal markers are retrieved from the database via the `DatabaseSnapshot` trait (new method: `current_marker()`)
- Checkpoints for a migration can be ordered by their temporal markers
- `TemporalMarker` implements `Ord` (ordered by LSN, then transaction_id as tiebreaker)
- Temporal marker is included in the checkpoint's hashed payload (changes to marker change the checkpoint hash)

**Dependencies**:

- KORA-US-009 (Checkpoint struct to extend)

**Definition of Done**:

- `TemporalMarker` struct implemented
- `Checkpoint` struct extended with temporal marker field
- Ordering and comparison implemented
- Unit tests: ordering, multiple checkpoints per migration, marker inclusion in hash
- Code reviewed and approved

---

### KORA-US-012: Checkpoint Storage and Retrieval

**Story ID**: KORA-US-012
**Priority**: P0
**Story Points**: 3
**Sprint**: 3
**Assignee**: Unassigned

**User Story**:
As a verification engine, I want to persist checkpoints and retrieve them by migration ID or temporal marker, so that checkpoints survive process restarts and can be accessed during behavioral replay.

**Description**:
Implement a `CheckpointStore` trait in `kora-core/src/time_travel/checkpoint.rs` with methods: `store(checkpoint)`, `get(checkpoint_id)`, `list_by_migration(migration_id)`, `get_by_marker(migration_id, temporal_marker)`, and `delete(checkpoint_id)`. Provide two implementations: (1) an in-memory store for testing, (2) a PostgreSQL-backed store using `sqlx`. Checkpoints are stored with their full component data and metadata. Retrieval by migration ID returns all checkpoints for that migration ordered by temporal marker. Retrieval by temporal marker returns the checkpoint closest to (but not after) the specified marker.

**Acceptance Criteria**:

- `CheckpointStore` trait defines `store`, `get`, `list_by_migration`, `get_by_marker`, `delete`
- In-memory implementation passes all trait contract tests
- PostgreSQL implementation compiles and passes integration tests (behind feature flag)
- Retrieval by `migration_id` returns checkpoints ordered by temporal marker (ascending)
- Retrieval by temporal marker returns the correct checkpoint (closest prior)
- `get(checkpoint_id)` returns `None` for nonexistent IDs (not an error)
- Retrieval latency is under 100 milliseconds for any single checkpoint (measured in integration test)
- Deleting a checkpoint removes it from all query paths
- Storing a checkpoint with a duplicate ID returns an error (no silent overwrite)

**Dependencies**:

- KORA-US-009 (Checkpoint struct)
- KORA-US-011 (Temporal markers for ordering)

**Definition of Done**:

- `CheckpointStore` trait and in-memory implementation complete
- PostgreSQL implementation complete (behind `integration-tests` feature flag)
- Unit tests with in-memory store covering all methods and edge cases
- Integration test with PostgreSQL verifying retrieval latency < 100ms
- Code reviewed and approved

---

## Sprint 4: Behavioral Replay and Comparison

**Sprint Goal**: Implement the core behavioral verification engine: reconstruct target state, replay captured queries, compare results at three fidelity levels, classify divergences, and compute confidence scores.

**Sprint Points**: 13

### KORA-US-013: Target State Reconstruction

**Story ID**: KORA-US-013
**Priority**: P0
**Story Points**: 3
**Sprint**: 4
**Assignee**: Unassigned

**User Story**:
As a verification engine, I want to reconstruct the pre-migration database state from a post-migration target by reversing migration transformations in an isolated temporary schema, so that I can replay queries against the original representation.

**Description**:
Implement `reconstruct_state()` in `kora-core/src/time_travel/reconstruction.rs`. Given a checkpoint (representing pre-migration state) and the current post-migration target database, this function creates an isolated temporary schema and applies reverse transformations to recover the pre-migration representation. Reverse transformations are derived from the migration's forward transformations (which are available via the migration metadata). The reconstructed state is validated by comparing its DDL hash and data sample hashes against the checkpoint's recorded hashes. The temporary schema is automatically cleaned up on drop (RAII pattern via a `ReconstructedState` struct that implements `Drop`).

**Acceptance Criteria**:

- `reconstruct_state(checkpoint, target_db)` creates an isolated temporary schema
- The reconstructed schema's DDL hash matches the checkpoint's DDL hash
- The reconstructed schema's data sample hashes match the checkpoint's data sample hashes (within configured tolerance)
- Reconstruction matches source state at checkpoint time for all captured tables
- The `ReconstructedState` struct implements `Drop` to clean up the temporary schema
- A `MigrationTransform` trait abstracts forward/reverse transformation pairs
- At least one transformation type is implemented: column rename, table rename, or type change
- If reconstruction fails (hash mismatch), the temporary schema is still cleaned up and a detailed error is returned
- The temporary schema name is generated using a UUID to avoid collisions

**Dependencies**:

- KORA-US-009 (Checkpoint with DDL and data hashes)
- KORA-US-012 (Checkpoint retrieval)

**Definition of Done**:

- Reconstruction logic implemented in `kora-core/src/time_travel/reconstruction.rs`
- `MigrationTransform` trait defined with at least one implementation
- `ReconstructedState` struct with `Drop` implementation for cleanup
- Unit tests with mock database: successful reconstruction, hash mismatch detection, cleanup on error
- Integration test verifying RAII cleanup (temp schema removed after drop)
- Code reviewed and approved

---

### KORA-US-014: Query Replay Engine

**Story ID**: KORA-US-014
**Priority**: P0
**Story Points**: 3
**Sprint**: 4
**Assignee**: Unassigned

**User Story**:
As a verification engine, I want to execute captured queries against the reconstructed target state, translating source SQL dialect to target dialect where necessary, so that I can compare the outputs with the original checkpoint results.

**Description**:
Implement `replay_queries()` in `kora-core/src/time_travel/replay.rs`. For each `CapturedQuery` in the checkpoint, translate the SQL to the target dialect if the source and target databases differ (e.g., MySQL to PostgreSQL), execute the query against the reconstructed state, capture the result set in canonical form (same canonicalization as KORA-US-010), and record the outcome. Queries that fail to execute are recorded as findings (not errors that abort the replay). The replay engine supports streaming progress via the proto `ReplayProgress` message. SQL dialect translation is abstracted via a `SqlTranslator` trait.

**Acceptance Criteria**:

- All captured queries from a checkpoint are replayed against the reconstructed state
- Result sets are captured in the same canonical form as KORA-US-010
- Queries that fail to execute are recorded as findings with the error message, not treated as fatal errors
- A `SqlTranslator` trait abstracts dialect translation with at least an identity translator (no-op for same-dialect)
- Progress is reported via a callback or channel compatible with the proto `ReplayProgress` message
- `ReplayResult` struct contains: query text, original result hash, replay result hash, match status, error (if any), duration_ms
- The replay engine is resilient: one query failure does not prevent remaining queries from executing
- All queries execute or are recorded as findings (no silent drops)

**Dependencies**:

- KORA-US-010 (Captured queries with canonical result sets)
- KORA-US-013 (Reconstructed target state)

**Definition of Done**:

- Replay engine implemented in `kora-core/src/time_travel/replay.rs`
- `SqlTranslator` trait and identity implementation
- Unit tests: successful replay, failed query recording, progress reporting, dialect translation stub
- Code reviewed and approved

---

### KORA-US-015: Three-Level Comparison Engine

**Story ID**: KORA-US-015
**Priority**: P0
**Story Points**: 3
**Sprint**: 4
**Assignee**: Unassigned

**User Story**:
As a verification engine, I want to compare query results at three fidelity levels -- exact, semantic, and business -- so that I can accurately classify whether differences between source and target are meaningful.

**Description**:
Implement a three-level comparison engine in `kora-core/src/time_travel/replay.rs` (or a dedicated `comparison.rs`). The three levels, evaluated in order from strictest to most lenient:

1. **Exact**: Byte-identical comparison of canonical result set hashes. If hashes match, classification is `Exact`.
2. **Semantic**: If exact fails, apply semantic equivalence rules: epsilon tolerance for floating-point numbers (configurable, default 1e-9), NFC normalization for strings, UTC normalization for timestamps, case-insensitive comparison for identifiers. If semantically equivalent, classification is `Semantic`.
3. **Business**: If semantic fails, apply business equivalence rules: same business decision (e.g., both approve or both reject a loan), same aggregate totals within tolerance, same record counts. Business rules are configurable via a `BusinessRule` trait. If business-equivalent, classification is `Business`.

If none of the three levels match, classify as `Divergent`. Map to the proto `BehavioralFidelity` enum.

**Acceptance Criteria**:

- Exact comparison: byte-identical hashes are classified as `Exact`
- Semantic comparison: float values within epsilon are classified as `Semantic`
- Semantic comparison: strings differing only in NFC normalization are classified as `Semantic`
- Semantic comparison: timestamps differing only in timezone representation but same UTC instant are classified as `Semantic`
- Business comparison: configurable via `BusinessRule` trait
- Results that fail all three levels are classified as `Divergent`
- The comparison produces exactly one of four classifications: `Exact`, `Semantic`, `Business`, `Divergent`
- Classification maps to the proto `BehavioralFidelity` enum values
- Comparison levels are evaluated in order (exact first); processing stops at the first match
- Correctly classifies all four divergence categories in unit tests

**Dependencies**:

- KORA-US-014 (Replay results to compare)
- KORA-US-010 (Canonical result format)

**Definition of Done**:

- Three-level comparison engine implemented
- `BusinessRule` trait defined with at least one example implementation
- Unit tests for each level and for the `Divergent` case
- Unit tests for edge cases: NaN floats, empty result sets, very large result sets
- Code reviewed and approved

---

### KORA-US-016: Divergence Analysis and Classification

**Story ID**: KORA-US-016
**Priority**: P0
**Story Points**: 2
**Sprint**: 4
**Assignee**: Unassigned

**User Story**:
As a verification engine, I want to classify each divergence into a formal taxonomy category so that consumers can understand whether a difference is a migration defect, an acceptable variance, or a change in the source data.

**Description**:
Implement divergence classification in `kora-core/src/time_travel/replay.rs`. Each `Divergent` result from KORA-US-015 is further classified into one of three categories:

1. **migration_defect**: The divergence is caused by the migration itself (e.g., data loss, incorrect transformation). Detected when the source checkpoint data does not match the reconstructed target and the difference cannot be explained by known transformation rules.
2. **acceptable_variance**: The divergence is within acceptable bounds (e.g., floating-point rounding in a different engine, timestamp precision differences). Detected when the divergence falls within configured tolerance thresholds.
3. **source_change**: The divergence is caused by source data changing between checkpoint capture and verification (e.g., new rows inserted). Detected when the source data at verification time differs from the checkpoint.

Each classified divergence includes: category, affected table/column, expected value, actual value, explanation text.

**Acceptance Criteria**:

- Every `Divergent` result is classified into exactly one of: `migration_defect`, `acceptable_variance`, `source_change`
- `migration_defect` is correctly identified when transformation rules cannot explain the difference
- `acceptable_variance` is correctly identified when differences are within configured tolerance
- `source_change` is correctly identified when source data has changed since checkpoint
- Classification matches the formal taxonomy in all unit test scenarios
- `DivergenceClassification` struct contains: category, table, column, expected, actual, explanation
- Classification is deterministic: same inputs always produce the same classification

**Dependencies**:

- KORA-US-015 (Three-level comparison, identifies Divergent results)
- KORA-US-009 (Checkpoint data for source comparison)

**Definition of Done**:

- Divergence classification logic implemented
- Unit tests for each category with representative scenarios
- Property-based test: every Divergent result receives exactly one classification
- Code reviewed and approved

---

### KORA-US-017: Confidence Scoring

**Story ID**: KORA-US-017
**Priority**: P0
**Story Points**: 2
**Sprint**: 4
**Assignee**: Unassigned

**User Story**:
As a verification pipeline, I want to compute a composite confidence score for each certificate so that consumers can make risk-informed decisions about trusting a migration.

**Description**:
Implement confidence scoring in `kora-core/src/certificate/generator.rs` (or a dedicated `scoring.rs`). The composite confidence score is computed as:

```
confidence = 0.40 * coverage + 0.25 * fidelity + 0.20 * temporal + 0.15 * volume
```

Where:

- **coverage** (0.0-1.0): Fraction of tables, columns, and rows verified. Computed as `(table_coverage + column_coverage + row_sample_rate) / 3`.
- **fidelity** (0.0-1.0): Fraction of replayed queries that matched at Exact or Semantic level. Queries matching at Business level contribute 0.5, Divergent queries contribute 0.0.
- **temporal** (0.0-1.0): Number of distinct checkpoints divided by a target count (configurable, default 3), capped at 1.0.
- **volume** (0.0-1.0): Number of rows verified divided by total row count, capped at 1.0.

Additionally, compute a 95% confidence interval via bootstrap resampling (1000 iterations) over the per-query fidelity scores.

**Acceptance Criteria**:

- Confidence score is computed using the formula: `0.40 * coverage + 0.25 * fidelity + 0.20 * temporal + 0.15 * volume`
- Score is a float in [0.0, 1.0]
- Score matches the formula exactly for known inputs (verified by hand-computed test vectors)
- Coverage sub-score is the average of table coverage, column coverage, and row sample rate
- Fidelity sub-score weights: Exact/Semantic = 1.0, Business = 0.5, Divergent = 0.0
- Temporal sub-score is `min(checkpoint_count / target_count, 1.0)`
- Volume sub-score is `min(rows_verified / total_rows, 1.0)`
- 95% confidence interval is computed via bootstrap resampling with 1000 iterations
- CI bounds are included in the `Certificate` struct alongside the point estimate
- Score computation is deterministic for a given set of inputs (bootstrap uses a seeded RNG)

**Dependencies**:

- KORA-US-015 (Fidelity classifications for scoring)
- KORA-US-009 (Coverage metrics from checkpoints)

**Definition of Done**:

- Confidence scoring implemented
- Unit tests with hand-computed expected scores for at least 5 different input scenarios
- Bootstrap CI computation tested with a fixed seed for determinism
- Performance test: scoring 10,000 query results completes in under 100ms
- Code reviewed and approved

---

## Sprint 5: Fraud Detection

**Sprint Goal**: Implement the fraud detection module that identifies statistical, referential, and temporal anomalies in migration data, completing the KORA verification pipeline.

**Sprint Points**: 8

### KORA-US-018: Statistical Anomaly Detection

**Story ID**: KORA-US-018
**Priority**: P0
**Story Points**: 3
**Sprint**: 5
**Assignee**: Unassigned

**User Story**:
As a verification engine, I want to detect statistical anomalies in migration parameters and outcomes so that migrations with suspicious data patterns are flagged for review.

**Description**:
Implement statistical anomaly detection in `kora-core/src/fraud/anomaly.rs`. Analyze migration data for unusual patterns including: (1) row count changes that deviate significantly from expected (z-score > 3), (2) column value distributions that shift unexpectedly (KL divergence exceeding threshold), (3) NULL rate changes beyond tolerance, (4) distinct value count changes beyond tolerance, (5) synthetic-looking test data patterns (low entropy, sequential IDs where random expected, uniform distributions where natural distributions expected). The detector operates on pre/post migration statistics and flags anomalies with severity levels (info, warning, critical) and confidence scores.

**Acceptance Criteria**:

- Detects row count anomalies with z-score > 3 as warnings, > 5 as critical
- Detects distribution shifts via KL divergence exceeding configurable threshold
- Detects NULL rate changes beyond configurable tolerance (default 5%)
- Detects distinct value count changes beyond configurable tolerance (default 10%)
- Detects synthetic test data patterns with > 90% precision (measured against a labeled test set of at least 50 synthetic and 50 genuine migration datasets)
- Each anomaly includes: anomaly type, affected table/column, severity, confidence, description
- `StatisticalAnomalyDetector` struct is configurable with thresholds for all detection types
- Detection completes within 5 seconds for a migration with 100 tables and 1000 columns
- False positive rate is below 10% on the labeled test set

**Dependencies**:

- KORA-US-009 (Checkpoint data for pre/post statistics)
- kora-core lib.rs `VerificationResult` and `Discrepancy` types (DONE)

**Definition of Done**:

- Statistical anomaly detection implemented in `kora-core/src/fraud/anomaly.rs`
- Labeled test dataset created (minimum 50 synthetic + 50 genuine scenarios)
- Unit tests for each anomaly type
- Precision/recall measured and documented (>90% precision required)
- Benchmark test for 100 tables / 1000 columns
- Code reviewed and approved

---

### KORA-US-019: Referential Anomaly Detection

**Story ID**: KORA-US-019
**Priority**: P0
**Story Points**: 3
**Sprint**: 5
**Assignee**: Unassigned

**User Story**:
As a verification engine, I want to detect foreign key violations and orphaned records introduced during migration so that referential integrity issues are caught before the migration is certified.

**Description**:
Implement referential anomaly detection in `kora-core/src/fraud/anomaly.rs` (or a dedicated `referential.rs`). The detector queries the post-migration target database for: (1) foreign key constraints that are violated (child rows referencing nonexistent parent rows), (2) orphaned records (rows with no FK reference when one is expected based on source schema), (3) new FK violations not present in the source (comparing source and target FK violation sets). Results map to the proto `ReferentialIssue` message. The detector abstracts database access via the existing `DatabaseSnapshot` trait.

**Acceptance Criteria**:

- Detects all foreign key violations in the post-migration target database
- Detects orphaned records (rows with NULL FK values where the source had non-NULL values)
- Distinguishes between pre-existing FK violations (present in source) and new violations (introduced by migration)
- Zero false negatives on a test set of known FK violation patterns (every real violation is detected)
- Each finding includes: table, constraint name, orphan count, sample values (up to 10)
- Results map to/from the proto `ReferentialIssue` message
- Detection uses the `DatabaseSnapshot` trait (no direct SQL in the detector)
- Performance: detection completes within 10 seconds for a schema with 100 tables and 200 FK constraints

**Dependencies**:

- KORA-US-009 (Checkpoint data for source FK state)
- Proto `ReferentialIssue` message in verification.proto (DONE)

**Definition of Done**:

- Referential anomaly detection implemented
- Test set of known FK violation patterns created (minimum 20 scenarios)
- Unit tests using mock `DatabaseSnapshot` for all detection cases
- Zero false negatives verified against test set
- Proto message mapping tested
- Code reviewed and approved

---

### KORA-US-020: Temporal Anomaly Detection

**Story ID**: KORA-US-020
**Priority**: P1
**Story Points**: 2
**Sprint**: 5
**Assignee**: Unassigned

**User Story**:
As a verification engine, I want to detect suspicious timing patterns in migration data so that time-shifted records and impossible temporal sequences are flagged.

**Description**:
Implement temporal anomaly detection in `kora-core/src/fraud/anomaly.rs`. The detector analyzes timestamp columns in the migrated data for: (1) records with creation timestamps that predate the table's own creation time, (2) records with modification timestamps in the future, (3) records whose temporal ordering in the target differs from their ordering in the source (time-shifted records), (4) clusters of records with suspiciously identical timestamps (bulk-fabricated data). The detector compares source and target timestamp distributions for each timestamp column and flags anomalies.

**Acceptance Criteria**:

- Detects records with creation timestamps before the table's creation date
- Detects records with modification timestamps in the future (relative to migration time)
- Detects time-shifted records whose temporal ordering changed between source and target
- Detects clusters of records with identical timestamps (configurable cluster size threshold, default 100)
- Each anomaly includes: anomaly type, table, column, affected record count, sample records, severity
- Time-shifted record detection compares the Kendall tau rank correlation between source and target ordering; correlation below 0.95 flags a warning, below 0.80 flags critical
- False positive rate is below 15% for timestamp cluster detection (validated against labeled test data)

**Dependencies**:

- KORA-US-009 (Checkpoint data for source timestamps)
- KORA-US-011 (Temporal markers for establishing time bounds)

**Definition of Done**:

- Temporal anomaly detection implemented in `kora-core/src/fraud/anomaly.rs`
- Unit tests for each anomaly type: pre-dated records, future timestamps, time-shifted ordering, timestamp clusters
- Test data with known temporal anomalies
- Kendall tau computation tested against known-answer vectors
- Code reviewed and approved

---

## Epic Summary and Prioritization

### Sprint Priority Matrix

| Sprint                        | Priority | Effort (Points) | Business Value | Risk   | Dependencies   |
| ----------------------------- | -------- | --------------- | -------------- | ------ | -------------- |
| Sprint 1: Merkle Tree         | P0       | 8               | High           | Low    | Phase 0 (DONE) |
| Sprint 2: Certificates        | P0       | 13              | High           | Medium | Sprint 1       |
| Sprint 3: Time-Travel Capture | P0       | 13              | High           | Medium | Sprint 1       |
| Sprint 4: Behavioral Replay   | P0       | 13              | Critical       | High   | Sprints 2, 3   |
| Sprint 5: Fraud Detection     | P0       | 8               | High           | Medium | Sprint 3       |

### Story Point Distribution

| Sprint    | Total Points | Stories | Avg Points per Story |
| --------- | ------------ | ------- | -------------------- |
| Sprint 1  | 8            | 3       | 2.7                  |
| Sprint 2  | 13           | 5       | 2.6                  |
| Sprint 3  | 13           | 4       | 3.3                  |
| Sprint 4  | 13           | 5       | 2.6                  |
| Sprint 5  | 8            | 3       | 2.7                  |
| **Total** | **55**       | **20**  | **2.8**              |

### Sprint Dependency Graph

```
Sprint 1 (Merkle) ----> Sprint 2 (Certificates) ----> Sprint 4 (Replay)
                   \                                /
                    --> Sprint 3 (Checkpoints) ----/
                                              \
                                               --> Sprint 5 (Fraud)
```

Sprints 2 and 3 can run in parallel after Sprint 1 completes, given sufficient team capacity. Sprint 4 requires both Sprint 2 and Sprint 3. Sprint 5 requires Sprint 3 but can run in parallel with Sprint 4 if needed.

## Success Metrics

| Metric                                    | Target                  | Measurement Method         |
| ----------------------------------------- | ----------------------- | -------------------------- |
| Merkle tree build time (1M leaves)        | < 2 seconds             | `criterion` benchmark      |
| Proof verification time                   | < 1 millisecond         | `criterion` benchmark      |
| Certificate validation time (100 results) | < 5 milliseconds        | Integration test timer     |
| Checkpoint retrieval latency              | < 100 milliseconds      | Integration test timer     |
| Statistical anomaly precision             | > 90%                   | Labeled test set           |
| Referential anomaly false negatives       | 0                       | Known violation test set   |
| Confidence score accuracy                 | Matches formula exactly | Hand-computed test vectors |
| Code coverage (unit tests)                | > 90%                   | `cargo testa --coverage`   |
| Fuzz iterations (parsers)                 | > 10 million            | `cargo-fuzz` run logs      |

## Crate Mapping

| Story                      | Primary Crate               | Primary File(s)                                                |
| -------------------------- | --------------------------- | -------------------------------------------------------------- |
| KORA-US-001, 002, 003      | `kora-crypto`               | `src/merkle.rs`                                                |
| KORA-US-004                | `kora-core`                 | `src/certificate/generator.rs` or `src/certificate/types.rs`   |
| KORA-US-005                | `kora-core` + `kora-crypto` | `src/certificate/generator.rs`, `src/signature.rs`             |
| KORA-US-006, 007, 008      | `kora-core`                 | `src/certificate/verifier.rs`                                  |
| KORA-US-009, 010, 011, 012 | `kora-core`                 | `src/time_travel/checkpoint.rs`                                |
| KORA-US-013                | `kora-core`                 | `src/time_travel/reconstruction.rs`                            |
| KORA-US-014, 015, 016      | `kora-core`                 | `src/time_travel/replay.rs`                                    |
| KORA-US-017                | `kora-core`                 | `src/certificate/generator.rs` or `src/certificate/scoring.rs` |
| KORA-US-018, 019, 020      | `kora-core`                 | `src/fraud/anomaly.rs`                                         |

## Definition of Done -- Epic Level

This epic is complete when:

1. All 20 user stories are implemented and pass their acceptance criteria
2. All unit tests pass with > 90% code coverage across `kora-core` and `kora-crypto`
3. All `criterion` benchmarks meet their performance targets
4. All `cargo-fuzz` targets have completed 10 million+ iterations without crashes
5. All property-based tests pass with default `proptest` configuration (256 cases)
6. A full end-to-end integration test exists that: captures a checkpoint, performs a migration, replays queries, generates a certificate, and validates the certificate
7. All cryptographic code satisfies the Cryptographic Definition of Done from the master roadmap (audited libraries, zeroizing keys, no unsafe code, constant-time comparisons, standard test vectors, fuzz testing, security review)
8. Proto message conversions are tested for all request/response types
9. Documentation: module-level doc comments, threat model assumptions, and binary format specifications
10. Security review completed and approved for all PRs

---

**Document Status**: Active epic
**Next Review**: Sprint 1 planning
**Parent Document**: [README.md](README.md) (GTCX Cryptographic Systems Master Roadmap)
