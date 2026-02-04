# Epic 06: TradePass Identity and Key Management

**Project**: GTCX Cryptographic Systems
**Phase**: 6 -- Identity and Key Management
**Status**: Not Started
**Priority**: P1 (High)
**Estimated Effort**: 4 sprints (8 weeks)
**Total Story Points**: 29
**Owner**: Crypto Engineering
**Target**: Q4 2026
**Dependencies**: Phase 0 (Cryptographic Foundation -- DONE), Phase 5 (ZK Proof System -- BBS+ selective disclosure)


## Epic Summary

This epic delivers the TradePass identity system, hierarchical key management infrastructure, HSM integration, and access control framework for the GTCX ecosystem. It establishes decentralized identifiers (DIDs) in the `did:gtcx:tp:{uuid}` format with five verification levels (L0 through L4), implements the five-level key hierarchy defined in the security framework specification, integrates hardware security modules for root key protection, and builds role-based and attribute-based access control enforcement at all API boundaries.

The identity system depends on BBS+ selective disclosure from Phase 5 (Epic 05, ZKP-US-010) for privacy-preserving credential presentation and on the certificate structures from Phase 1 (Epic 01) for identity attestation chains. The `gtcx-crypto` crate (Phase 0) provides the underlying Ed25519 signing, HD key derivation, and SHA-256/Blake3 hashing primitives on which all identity operations build.

### What Exists Today

| Asset | Location | Status |
|-------|----------|--------|
| Ed25519 signing with batch verification | `gtcx-crypto/src/signing.rs` | DONE (516 lines) |
| HD key derivation (BIP-32 compatible) | `gtcx-crypto/src/keys.rs` | DONE (271 lines) |
| Hash-chained audit logs | `gtcx-crypto/src/audit.rs` | DONE (499 lines) |
| SHA-256 and Blake3 hashing | `gtcx-crypto/src/hashing.rs` | DONE (242 lines) |
| Security framework specification (Section 8) | `gtcx-core/docs/specs/security-framework.md` | Complete -- defines key hierarchy, HSM integration, RBAC/ABAC models, rotation policies |
| TradePass identity specification | GitBook | Complete -- defines DID structure `did:gtcx:tp:{uuid}`, verification levels L0--L4, attestation model |

### What This Epic Delivers

1. TradePass DID implementation (`did:gtcx:tp:{uuid}`) with globally unique identifiers, verification level tracking (L0--L4), and immutable transition logging
2. Identity keypair management with Ed25519 and secp256k1 support, key rotation with historical signature verification, and rotation timestamp tracking
3. Five-level key hierarchy (Root, Domain, Service, Operational, User) with HKDF-based derivation and deterministic derivation paths
4. Automated key rotation with configurable intervals, grace periods, advance notifications, and revocation propagation
5. HSM abstraction layer supporting AWS CloudHSM, Azure KeyVault, Google CloudKMS, Thales Luna, YubiHSM, and a software mode for development
6. Root key ceremony with Shamir secret sharing (3-of-5 threshold)
7. BBS+ verifiable credential issuance with selective disclosure proofs
8. RBAC with 12 system roles and ABAC with multi-attribute policy evaluation under 10 milliseconds


## Success Criteria

- DIDs are globally unique, parseable, and include verification level metadata
- Key rotation preserves the ability to verify all historical signatures
- Verification level transitions are strictly one-way (no downgrades) and each transition is logged immutably
- Keys at each hierarchy level are deterministically derived from their parent via HKDF with context strings
- Key revocation propagates to all derived keys and revoked keys fail verification within 1 minute
- HSM operations exceed 1,000 operations per second with authentication latency below 500 milliseconds (P99)
- No single person can reconstruct the root key (Shamir 3-of-5)
- Selective disclosure proofs reveal only chosen attributes while hiding all others in zero knowledge
- RBAC permissions are enforced at every API boundary
- ABAC policy evaluation completes in under 10 milliseconds


## Story Point Summary

| Sprint | Theme | Points | Stories |
|--------|-------|--------|---------|
| Sprint 21 | TradePass Identity | 8 | 4 |
| Sprint 22 | Key Hierarchy | 8 | 4 |
| Sprint 23 | HSM Integration | 5 | 3 |
| Sprint 24 | Selective Disclosure and RBAC | 8 | 4 |
| **Total** | | **29** | **15** |


## Dependency Map

```
Phase 0: Crypto Foundation (DONE)
  |
  +-- Phase 5: ZK Proof System
  |     |
  |     +-- ZKP-US-010 (BBS+ Selective Disclosure)
  |           |
  |           +-- IDM-US-012 (BBS+ Credential Issuance)
  |           |
  |           +-- IDM-US-013 (Selective Disclosure Proofs)
  |
  +-- IDM-US-001 (DID Structure)
  |     |
  |     +-- IDM-US-002 (Identity Keypair Management)
  |     |     |
  |     |     +-- IDM-US-003 (Verification Level Transitions)
  |     |     |
  |     |     +-- IDM-US-004 (Identity Attestations)
  |     |
  |     +-- IDM-US-005 (5-Level Key Hierarchy)
  |           |
  |           +-- IDM-US-006 (Key Derivation Paths)
  |           |
  |           +-- IDM-US-007 (Key Rotation Automation)
  |           |     |
  |           |     +-- IDM-US-008 (Key Revocation)
  |           |
  |           +-- IDM-US-009 (HSM Abstraction Layer)
  |                 |
  |                 +-- IDM-US-010 (Root Key Ceremonies)
  |                 |
  |                 +-- IDM-US-011 (HSM Performance)
  |
  +-- IDM-US-014 (RBAC Implementation)
  |     |
  |     +-- IDM-US-015 (ABAC Policies)
  |
  Phase 1: KORA Verification (certificates)
        |
        +-- IDM-US-004 (Identity Attestations -- attestation chain structure)
```


---


## Sprint 21: TradePass Identity

**Sprint Goal**: Implement the TradePass decentralized identity system including DID creation and parsing, identity keypair lifecycle management, verification level transitions, and third-party attestations.
**Story Points**: 8


### IDM-US-001: DID Structure

**Title**: Implement TradePass DID (`did:gtcx:tp:{uuid}`) with Verification Levels

**Description**: As a participant in the GTCX ecosystem, I want a globally unique decentralized identifier in the format `did:gtcx:tp:{uuid}` that encodes my verification level, so that any system in the ecosystem can identify me, parse my DID, and determine my verification status without contacting a central authority.

The DID structure follows the W3C DID specification adapted for GTCX. Each DID contains a method-specific identifier composed of a UUID v4 and is associated with a DID Document that includes the current verification level, active public keys, service endpoints, and creation/update timestamps. Verification levels range from L0 (unverified, self-asserted identity) through L4 (government-enrolled validator). The DID Document is the authoritative record for an identity's current state.

**Acceptance Criteria**:
- DID format is `did:gtcx:tp:{uuid}` where `{uuid}` is a valid UUID v4
- DIDs are globally unique; generating two DIDs produces distinct identifiers
- A `Did` struct can be parsed from a string and serialized back to an identical string (round-trip)
- Parsing rejects malformed DIDs with a typed error indicating the specific validation failure (invalid method, missing UUID, malformed UUID)
- DID Document contains: DID, verification level (L0--L4), active public keys, service endpoints, created timestamp, updated timestamp
- Verification levels are represented as an enum with five variants: `L0` (unverified), `L1` (government ID uploaded), `L2` (liveness check passed), `L3` (in-person biometric verified), `L4` (government-enrolled validator)
- New DIDs are created at verification level L0 by default
- DID Document implements `Serialize`, `Deserialize`, `Clone`, and `Debug`
- DID resolution (looking up a DID Document by DID) is abstracted via a `DidResolver` trait

**Story Points**: 2
**Dependencies**: Phase 0 (`gtcx-crypto` crate for key generation)


### IDM-US-002: Identity Keypair Management

**Title**: Identity Keypair Lifecycle with Key Rotation and Historical Verification

**Description**: As a TradePass identity holder, I want my identity to be backed by a cryptographic keypair that can be rotated when needed while preserving the ability to verify signatures made with previous keys, so that my identity remains secure over time without invalidating my historical actions.

Each identity maintains a current keypair (Ed25519 or secp256k1, configurable at creation time) and an ordered list of previous keypairs with their rotation timestamps and validity windows. When a key is rotated, the new keypair becomes the active signing key, and the previous keypair is moved to the historical list with its deactivation timestamp. Signature verification checks the signing timestamp against the validity windows of all keypairs (current and historical) to determine which key was active at the time of signing.

**Acceptance Criteria**:
- Each identity has exactly one current keypair (Ed25519 or secp256k1)
- Key rotation generates a new keypair, moves the current keypair to the historical list, and records the rotation timestamp
- Historical keypairs are stored in chronological order with activation and deactivation timestamps
- Signature verification against a historical signature succeeds when using the keypair that was active at the signature's timestamp
- Signature verification fails when the signature timestamp does not fall within any keypair's validity window
- The current keypair is always used for new signatures
- Key material (private keys) is wrapped in `Zeroizing<T>` and never logged or serialized in plaintext
- `IdentityKeychain` struct encapsulates the current keypair, historical keypairs, and rotation history
- At least two key algorithms are supported: Ed25519 and secp256k1
- Key rotation is atomic: either the rotation completes fully or the identity retains its previous state

**Story Points**: 3
**Dependencies**: IDM-US-001 (DID structure for identity association), Phase 0 (`gtcx-crypto` signing and key derivation)


### IDM-US-003: Verification Level Transitions

**Title**: One-Way Verification Level Transitions with Immutable Audit Trail

**Description**: As a compliance officer, I want verification level transitions to be strictly one-way (upgrades only) and recorded in an immutable audit trail, so that an identity's verification history is tamper-evident and no identity can regress to a lower trust level once elevated.

The transition path is: L0 (unverified) to L1 (upload government-issued ID), L1 to L2 (pass automated liveness check), L2 to L3 (complete in-person biometric verification), L3 to L4 (government enrollment as a validator). Each transition requires specific evidence (e.g., document hash for L0 to L1, liveness session ID for L1 to L2, biometric attestation hash for L2 to L3, government enrollment certificate for L3 to L4). The transition record is appended to a hash-chained audit log so that the full verification history is tamper-evident.

**Acceptance Criteria**:
- Transitions follow the defined path: L0 to L1, L1 to L2, L2 to L3, L3 to L4
- Attempting a skip transition (e.g., L0 to L2) returns an error
- Attempting a downgrade transition (e.g., L2 to L1) returns an error
- Attempting a same-level transition (e.g., L1 to L1) returns an error
- Each transition requires a `TransitionEvidence` struct containing: evidence type, evidence hash (SHA-256), attestor DID, timestamp
- Every transition is recorded in a hash-chained audit log (using the `gtcx-crypto` audit module)
- The audit log is tamper-evident: modifying any entry invalidates the chain
- Transition records include: identity DID, from level, to level, evidence hash, attestor DID, timestamp, chain hash
- A `VerificationHistory` can be retrieved for any identity, returning the full chain of transitions
- Transition validation is a pure function (no I/O) for testability; persistence is handled by a separate storage trait

**Story Points**: 2
**Dependencies**: IDM-US-001 (DID and verification levels), Phase 0 (`gtcx-crypto` audit module for hash-chained logs)


### IDM-US-004: Identity Attestations

**Title**: Third-Party Attestations Signed by Attestor Key

**Description**: As a verifier in the GTCX ecosystem, I want to validate attestations about an identity (e.g., "this producer is licensed in jurisdiction X") without needing to contact the attestor at verification time, so that attestation verification is decentralized and available even when the attestor is offline.

An attestation is a signed statement by one identity (the attestor) about another identity (the subject). The attestation contains: subject DID, attestor DID, claim type, claim value, issuance timestamp, expiration timestamp, and the attestor's Ed25519 signature over the canonical form of the attestation. Verification requires only the attestor's public key, which is available from the attestor's DID Document. Attestations are self-contained: the verifier does not need to contact the attestor or any central registry.

**Acceptance Criteria**:
- `Attestation` struct contains: attestation ID, subject DID, attestor DID, claim type (string), claim value (string), issued at, expires at, signature
- Attestation is signed by the attestor using their current Ed25519 keypair
- Attestation can be verified using only the attestor's public key (obtainable from the attestor's DID Document)
- Verification succeeds without any network call to the attestor
- Verification checks: signature validity, expiration (not expired), and attestor key validity at issuance time
- Expired attestations fail verification with a specific error indicating expiration
- Attestation with a tampered claim value fails signature verification
- Canonical serialization of the attestation (for signing) is deterministic: identical attestation data always produces the same signing payload
- Attestation implements `Serialize`, `Deserialize`, `Clone`, and `Debug`
- Batch verification of multiple attestations is supported using Ed25519 batch verification from Phase 0

**Story Points**: 1
**Dependencies**: IDM-US-002 (Identity keypair for signing/verification), Phase 1 (KORA certificate structures for attestation chain model)


---


## Sprint 22: Key Hierarchy

**Sprint Goal**: Implement the five-level key hierarchy with HKDF-based derivation, deterministic derivation paths, automated rotation with grace periods, and revocation that propagates to all derived keys.
**Story Points**: 8


### IDM-US-005: Five-Level Key Hierarchy

**Title**: Five-Level Key Hierarchy with HKDF Derivation

**Description**: As the security infrastructure, I want a five-level key hierarchy where each level derives its keys from the parent level using HKDF with domain-specific context strings, so that key compromise at a lower level does not expose keys at higher levels and each domain has cryptographically isolated key material.

The five levels as defined in the security framework specification (Section 8.3.1) are:
- **Level 0 -- Root** (HSM-protected): Protocol master key, validator root key, recovery root key
- **Level 1 -- Domain**: Identity, settlement, compliance, audit
- **Level 2 -- Service**: TradePass, GCI, VaultMark, PvP
- **Level 3 -- Operational**: Node signing key, node encryption key, session keys (ephemeral)
- **Level 4 -- User**: TradePass identity key, device authentication key, backup recovery key

Derivation uses HKDF-SHA256 (RFC 5869) with the parent key as input key material, `GTCX-v3` as the salt, and the derivation path as the info parameter. The derivation is deterministic: the same parent key and path always produce the same derived key.

**Acceptance Criteria**:
- Five hierarchy levels are represented as an enum: `Root`, `Domain`, `Service`, `Operational`, `User`
- Each level derives its keys from the parent level using HKDF-SHA256
- HKDF parameters: input key material = parent key, salt = `GTCX-v3`, info = derivation path string
- Derivation is deterministic: same parent key and path always produce the same derived key
- Root keys are marked as HSM-only and cannot be exported in plaintext (enforced by type system)
- Domain keys can derive service keys but not root keys (derivation is strictly downward)
- A `KeyHierarchy` struct manages the full tree of derived keys with parent-child relationships
- Key metadata tracks: key ID, hierarchy level, parent key ID, derivation path, creation timestamp, expiration timestamp
- All derived key material is wrapped in `Zeroizing<T>`
- The hierarchy supports at least 4 domain keys, 4 service keys per domain, and arbitrary operational and user keys per service

**Story Points**: 3
**Dependencies**: Phase 0 (`gtcx-crypto` key derivation module), IDM-US-001 (DID for user-level key association)


### IDM-US-006: Key Derivation Paths

**Title**: Deterministic Key Derivation Path Format

**Description**: As a developer integrating with the GTCX key infrastructure, I want key derivation paths in the format `gtcx/<domain>/<service>/<identifier>` so that I can deterministically derive the same key from the same path on any node in the system.

The path format follows a hierarchical structure: the first segment is always `gtcx`, the second is the domain name (identity, settlement, compliance, audit), the third is the service name (tradepass, gci, vaultmark, pvp), and the fourth is an instance-specific identifier (node ID, user DID, device ID). The path is validated against a regex pattern and used as the info parameter in HKDF derivation.

**Acceptance Criteria**:
- Path format is `gtcx/<domain>/<service>/<identifier>` with lowercase alphanumeric segments and hyphens
- Path validation accepts valid paths and rejects malformed paths with specific error messages
- The same path always derives the same key from the same parent key (deterministic)
- Different paths always derive different keys from the same parent key (collision-resistant within HKDF guarantees)
- Predefined path templates exist for all standard derivation paths listed in the security framework specification (Section 8.3.2)
- Path segments are validated individually: domain must be one of the defined domains, service must be one of the defined services
- `KeyPath` struct provides builder methods: `KeyPath::identity().tradepass(node_id)` produces `gtcx/identity/tradepass/{node_id}`
- Path parsing from string and formatting to string are round-trip compatible
- Path comparison is case-sensitive (lowercase enforced)
- Documentation includes a complete table of all standard derivation paths

**Story Points**: 1
**Dependencies**: IDM-US-005 (Key hierarchy for derivation context)


### IDM-US-007: Key Rotation Automation

**Title**: Automated Key Rotation with Configurable Intervals and Grace Periods

**Description**: As the operations team, I want keys to rotate automatically on a configurable schedule with grace periods during which both old and new keys are valid, so that key rotation does not cause service disruptions and stale keys are retired predictably.

Rotation intervals follow the security framework specification (Section 8.3.4): Root keys rotate every 365 days, domain keys every 180 days, service keys every 90 days, and operational keys every 30 days. Each rotation has a grace period during which both the old key and new key are valid for verification (old key: verify only, new key: sign and verify). Advance notifications are sent before rotation occurs. Session keys are ephemeral and do not rotate.

**Acceptance Criteria**:
- Root keys rotate every 365 days with a 30-day grace period and 60-day advance notification
- Domain keys rotate every 180 days with a 14-day grace period and 30-day advance notification
- Service keys rotate every 90 days with a 7-day grace period and 14-day advance notification
- Operational keys rotate every 30 days with a 3-day grace period and 7-day advance notification
- During the grace period, the old key remains valid for verification but not for signing
- After the grace period expires, the old key is deactivated and verification with it fails
- Advance notifications are emitted via a `RotationNotifier` trait (supporting log-based and webhook-based notifications)
- Rotation is automated via a `KeyRotationScheduler` that runs as a background task
- Rotation is atomic: either the new key is activated and the old key enters grace period, or the rotation fails and the current key remains active
- Rotation events are recorded in the hash-chained audit log
- All rotation intervals and grace periods are configurable per key type

**Story Points**: 2
**Dependencies**: IDM-US-005 (Key hierarchy for key lifecycle), IDM-US-006 (Derivation paths for re-derivation after rotation)


### IDM-US-008: Key Revocation

**Title**: Key Revocation with Propagation to Derived Keys

**Description**: As a security operator, I want to revoke a compromised key and have that revocation automatically propagate to all keys derived from it, so that a single compromised key does not require manual revocation of every downstream key.

When a key is revoked, all keys in the hierarchy that were derived from the revoked key are also revoked. Revocation propagation is recursive: revoking a domain key revokes all service keys under it, all operational keys under those service keys, and all user keys under those operational keys. Revoked keys fail verification within 1 minute of revocation (bounded propagation latency). Revocation is irreversible.

**Acceptance Criteria**:
- Revoking a key adds it to a revocation list and marks it as revoked in the key hierarchy
- Revocation propagates to all derived keys recursively (domain revokes service, service revokes operational, operational revokes user)
- A revoked key fails signature verification within 1 minute of revocation
- Revocation is irreversible: a revoked key cannot be un-revoked
- Revocation events are recorded in the hash-chained audit log with: key ID, reason, actor, timestamp, list of propagated key IDs
- The `RevocationList` is thread-safe (`Send + Sync`) and supports concurrent reads and writes
- Re-revoking an already-revoked key is idempotent (no error, no duplicate log entry)
- `is_revoked(key_id)` returns `true` for directly revoked keys and for keys revoked via propagation
- Revocation latency (time from revocation call to all derived keys failing verification) is under 1 minute in a benchmark with 1,000 derived keys
- Revocation propagation handles circular references gracefully (should not exist in a tree hierarchy, but defensive coding prevents infinite loops)

**Story Points**: 2
**Dependencies**: IDM-US-005 (Key hierarchy for parent-child traversal), IDM-US-007 (Rotation automation, for interaction between rotation and revocation)


---


## Sprint 23: HSM Integration

**Sprint Goal**: Build the hardware security module abstraction layer, implement the root key ceremony with Shamir secret sharing, and validate HSM performance against production targets.
**Story Points**: 5


### IDM-US-009: HSM Abstraction Layer

**Title**: HSM Provider Abstraction Supporting Multiple Vendors

**Description**: As the infrastructure team, I want a single HSM interface that works identically regardless of the underlying HSM provider, so that the GTCX platform can be deployed across different cloud providers and on-premises environments without changing application code.

The HSM abstraction layer defines an `IHSMProvider` trait (as specified in Section 8.3.3 of the security framework) with methods for key generation, signing, verification, encryption, decryption, key wrapping/unwrapping, rotation, and destruction. Provider implementations are supplied for AWS CloudHSM, Azure KeyVault, Google CloudKMS, Thales Luna, and YubiHSM. A `SOFTWARE` mode implementation using in-memory keys is provided for development and testing environments. The provider is selected via configuration and instantiated at startup.

**Acceptance Criteria**:
- `IHSMProvider` trait defines: `connect`, `disconnect`, `generate_key`, `sign`, `verify`, `encrypt`, `decrypt`, `wrap_key`, `unwrap_key`, `rotate_key`, `get_key_info`, `list_keys`, `destroy_key`
- All methods have identical semantics regardless of the underlying provider
- `SOFTWARE` mode implementation passes all trait contract tests using in-memory key storage
- At least one cloud HSM provider implementation compiles and passes integration tests (behind a feature flag)
- Provider selection is configuration-driven via the `HSMConfigSchema` defined in the security framework specification
- The abstraction supports three protection levels: `SOFTWARE`, `HSM`, `HSM_FIPS` (FIPS 140-2 Level 3)
- All HSM operations are logged via the `HSMOperationLog` schema (Section 8.3.3)
- Connection retry logic follows the retry configuration (max attempts, backoff) from `HSMConfigSchema`
- The `SOFTWARE` mode is clearly marked as development-only and logs a warning at startup

**Story Points**: 2
**Dependencies**: IDM-US-005 (Key hierarchy, which requires HSM for root key storage)


### IDM-US-010: Root Key Ceremonies

**Title**: Root Key Generation with Shamir Secret Sharing (3-of-5 Threshold)

**Description**: As the security team, I want the root key to be generated through a formal ceremony using Shamir secret sharing with a 3-of-5 threshold, so that no single person can reconstruct the root key and the protocol is resilient to the loss of up to two key custodians.

The root key ceremony generates a root key inside the HSM, splits the backup material into five shares using Shamir's Secret Sharing scheme with a threshold of three, and distributes each share to a different key custodian. The ceremony is conducted in a controlled environment with audit logging. Reconstruction requires any three of the five shares. The ceremony process is scripted as a CLI tool that guides the operator through each step with verification checkpoints.

**Acceptance Criteria**:
- Root key is generated inside the HSM and never exists in plaintext outside the HSM boundary
- Backup material is split into exactly 5 shares using Shamir's Secret Sharing with a threshold of 3
- Any 3 of 5 shares can reconstruct the backup material
- Fewer than 3 shares reveal no information about the backup material (information-theoretic security)
- The ceremony CLI tool guides the operator step by step: initialize HSM session, generate root key, generate shares, verify share reconstruction, distribute shares
- Each share is encrypted with the recipient custodian's public key before display or storage
- The ceremony produces an audit log entry containing: ceremony timestamp, participant count, threshold, key fingerprint (public key hash), verification status
- Share verification: after generation, the ceremony tool verifies that a randomly selected 3-share subset can reconstruct correctly
- The ceremony can be rehearsed in `SOFTWARE` mode without touching a real HSM
- No share or reconstructed material is written to disk or transmitted over a network

**Story Points**: 2
**Dependencies**: IDM-US-009 (HSM abstraction layer for key generation inside HSM)


### IDM-US-011: HSM Performance

**Title**: HSM Performance Benchmarking and Optimization

**Description**: As the engineering lead, I want to confirm that HSM operations meet the production performance targets defined in the security framework specification, so that the HSM integration does not become a latency bottleneck in authentication and signing flows.

The performance targets from Section 8.12 of the security framework are: HSM operations exceeding 1,000 operations per second and authentication latency below 500 milliseconds at the 99th percentile. Benchmarks must run against a real HSM in the staging environment (not the `SOFTWARE` mode) to capture accurate hardware latency. Optimization strategies include connection pooling, operation batching, and caching of public key material.

**Acceptance Criteria**:
- HSM signing operations achieve greater than 1,000 operations per second on the staging HSM
- Authentication latency (key lookup plus signature verification via HSM) is below 500 milliseconds at the 99th percentile
- Benchmarks are implemented using `criterion` and run as part of the CI pipeline against the staging HSM (behind a feature flag)
- Benchmark results include: p50, p95, p99 latency; throughput (operations per second); connection pool utilization
- Connection pooling is implemented with configurable pool size (minimum 5, maximum 50 connections)
- Public key caching reduces repeat key lookups to under 1 millisecond (cache hit path)
- Benchmark suite covers: signing, verification, key generation, key rotation, and encryption operations
- If performance targets are not met, the benchmark report includes profiling data identifying the bottleneck

**Story Points**: 1
**Dependencies**: IDM-US-009 (HSM abstraction layer), IDM-US-010 (Root key ceremony for staging HSM setup)


---


## Sprint 24: Selective Disclosure and RBAC

**Sprint Goal**: Implement BBS+ verifiable credential issuance with selective disclosure proofs, role-based access control with 12 system roles, and attribute-based access control with sub-10ms policy evaluation.
**Story Points**: 8


### IDM-US-012: BBS+ Credential Issuance

**Title**: Issue Verifiable Credentials with BBS+ Signatures

**Description**: As a credential issuer (e.g., a government body or licensed inspector), I want to issue verifiable credentials containing multiple attributes signed with a BBS+ signature, so that the credential holder can later selectively disclose individual attributes without revealing the entire credential.

BBS+ signatures (building on ZKP-US-010 from Phase 5) allow signing a vector of messages (attributes) such that the holder can later derive a proof revealing any subset. This story implements the issuance side: given a set of attributes (e.g., name, jurisdiction, license type, GCI score, verification level), generate a BBS+ signature over all attributes and package the result as a W3C-compatible verifiable credential.

**Acceptance Criteria**:
- Credentials contain multiple attributes as a vector of typed values
- Credential is signed using a BBS+ signature over all attributes
- Credential is verifiable: given the issuer's public key and the full attribute vector, signature verification succeeds
- Credential with a tampered attribute fails verification
- Credential format is compatible with W3C Verifiable Credentials data model (JSON-LD structure)
- Credential includes: issuer DID, subject DID, issuance date, expiration date, credential type, attribute vector, BBS+ signature
- Credentials with up to 32 attributes are supported
- Credential issuance completes in under 100 milliseconds for 32 attributes
- Issuer key management integrates with the key hierarchy (service-level key for the issuing service)
- Credential serialization and deserialization are round-trip compatible

**Story Points**: 2
**Dependencies**: Phase 5 ZKP-US-010 (BBS+ selective disclosure foundation), IDM-US-002 (Identity keypairs for issuer and subject), IDM-US-005 (Key hierarchy for issuer key derivation)


### IDM-US-013: Selective Disclosure Proofs

**Title**: Zero-Knowledge Selective Disclosure of Credential Attributes

**Description**: As a credential holder, I want to generate a proof that reveals only a chosen subset of my credential attributes while proving in zero knowledge that the hidden attributes are part of a validly signed credential, so that I can satisfy verification requirements with minimal information disclosure.

Building on the BBS+ credential from IDM-US-012, this story implements the holder's proof generation and the verifier's proof verification. The holder selects which attributes to disclose and which to hide. The derived proof convinces the verifier that: (a) the disclosed attributes are authentic (part of a credential signed by the issuer), and (b) the holder possesses valid hidden attributes, without revealing their values. The verifier learns only the disclosed attributes, the issuer's identity, and the credential type.

**Acceptance Criteria**:
- Holder can select any subset of attributes to disclose (including none or all)
- Disclosed attributes are verifiable as part of a validly signed credential
- Hidden attributes are information-theoretically hidden from the verifier
- The verifier learns only: disclosed attribute values, issuer DID, credential type, and that hidden attributes exist and are valid
- Selective disclosure proofs are unlinkable: two proofs derived from the same credential cannot be correlated by the verifier
- Proof generation completes in under 200 milliseconds for a credential with 32 attributes
- Proof verification completes in under 100 milliseconds
- Proof size scales linearly with the number of disclosed attributes, not the total attribute count
- Edge cases are handled: disclosing all attributes, disclosing no attributes (pure existence proof), single-attribute credential
- Integration test: issuer creates credential, holder derives selective disclosure proof, verifier validates proof -- end-to-end

**Story Points**: 3
**Dependencies**: IDM-US-012 (BBS+ credential issuance for credentials to disclose), Phase 5 ZKP-US-010 (BBS+ proof derivation)


### IDM-US-014: RBAC Implementation

**Title**: Role-Based Access Control with 12 System Roles

**Description**: As the platform security layer, I want to enforce role-based access control at every API boundary so that each participant can only perform actions permitted by their assigned role(s) and unauthorized operations are rejected before reaching business logic.

The 12 system roles as defined in the security framework specification (Section 8.6.1) are: `producer`, `rco`, `aggregator`, `vault_operator`, `refiner`, `buyer`, `inspector`, `validator`, `auditor`, `government_official`, `system_admin`, and `protocol_council`. Each role maps to a set of permissions covering identity, asset, compliance, settlement, consensus, and administration operations. Permission checks are performed as middleware at the API boundary.

**Acceptance Criteria**:
- All 12 roles are defined: `producer`, `rco`, `aggregator`, `vault_operator`, `refiner`, `buyer`, `inspector`, `validator`, `auditor`, `government_official`, `system_admin`, `protocol_council`
- Each role has a defined set of permissions matching the security framework specification (Section 8.6.1)
- `has_permission(role, permission)` returns the correct result for all role-permission combinations
- Wildcard permissions are supported (e.g., `asset:*` grants all asset operations)
- A participant can hold multiple roles; permissions are the union of all assigned roles
- Permission check is enforced as middleware at the API boundary (before handler execution)
- Unauthorized requests receive a 403 Forbidden response with a structured error body (no internal details leaked)
- Role assignments are stored in the identity's DID Document
- Role-permission mappings are configurable (not hardcoded) to support future role additions
- Permission evaluation completes in under 1 millisecond (benchmarked)
- All permission checks are logged in the audit trail with: actor DID, role, permission requested, outcome

**Story Points**: 2
**Dependencies**: IDM-US-001 (DID for actor identification), Phase 0 (`gtcx-crypto` audit module for logging)


### IDM-US-015: ABAC Policies

**Title**: Attribute-Based Access Control with Multi-Attribute Policy Evaluation

**Description**: As the compliance team, I want fine-grained access control policies that evaluate multiple attributes of the subject, resource, action, and environment so that access decisions can incorporate contextual factors such as jurisdiction, GCI score, data sensitivity, time windows, and MFA status.

ABAC extends RBAC by evaluating policies against four attribute categories as defined in Section 8.6.2 of the security framework: (1) Subject attributes -- roles, jurisdictions, minimum GCI score, verification status. (2) Resource attributes -- resource types, data sensitivity classification (public, internal, confidential, restricted). (3) Action attributes -- the operation being performed. (4) Environment attributes -- time window restrictions, IP allowlist, MFA requirement. Policies are evaluated in priority order; the first matching policy determines the access decision. If no policy matches, the default is deny.

**Acceptance Criteria**:
- Policies can specify subject attributes: roles (array), jurisdictions (array), minimum GCI score (number), verification status (boolean)
- Policies can specify resource attributes: types (array), sensitivity classification (public, internal, confidential, restricted)
- Policies can specify action attributes: list of permitted operations
- Policies can specify environment attributes: time window (start/end), IP allowlist (CIDR ranges), MFA required (boolean)
- Policy effect is either `allow` or `deny`
- Policies are evaluated in priority order (highest priority first); first match wins
- Default decision (no matching policy) is `deny`
- Policy evaluation completes in under 10 milliseconds for a policy set of 100 policies (benchmarked)
- `PolicyEvaluation` result includes: allowed (boolean), matched policy ID, reason string, obligations (e.g., MFA required)
- Subject with GCI score below a policy's `gciMinimum` is denied even if all other attributes match
- Subject outside the time window is denied even if all other attributes match
- Subject without MFA is denied when the matched policy requires MFA
- Policy engine supports dynamic policy addition and removal at runtime without restart
- All policy evaluations are logged in the audit trail

**Story Points**: 3
**Dependencies**: IDM-US-014 (RBAC for role-based attributes), IDM-US-001 (DID for subject identification), IDM-US-003 (Verification levels for verification status attribute)


---


## Technical Notes

- **DID method**: `did:gtcx:tp` follows W3C DID Core specification; method-specific identifier is UUID v4
- **Key algorithms**: Ed25519 (default for identity keys, aligned with Phase 0), secp256k1 (supported for interoperability with external systems)
- **Key derivation**: HKDF-SHA256 per RFC 5869; salt = `GTCX-v3`, info = derivation path string
- **BBS+ library**: Evaluate `bbs` or `zkryptium` crate; must support unlinkable selective disclosure (same evaluation as Phase 5)
- **Shamir's Secret Sharing**: Use `sharks` or `vsss-rs` crate; threshold = 3, shares = 5
- **HSM providers**: AWS CloudHSM via `aws-sdk-cloudhsmv2`, Azure KeyVault via `azure_security_keyvault`, Google CloudKMS via `google-cloud-kms`, Thales Luna via PKCS#11 bindings, YubiHSM via `yubihsm` crate
- **Security**: All private key material wrapped in `Zeroizing<T>`; `#![deny(unsafe_code)]` enforced; no private keys in logs or debug output; constant-time comparison for all authentication-related checks
- **Serialization**: DID Documents and credentials use JSON-LD; internal types use serde with both JSON and binary (bincode) support
- **Fuzz testing**: All DID parsing, key derivation path parsing, and attestation deserialization paths require `cargo-fuzz` targets per the project Definition of Done


## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| BBS+ crate ecosystem immaturity -- limited audited implementations in Rust | High | Medium | Evaluate multiple crates (bbs, zkryptium); maintain fallback to attribute-level Groth16 proofs; allocate extra time for integration testing |
| HSM vendor API differences -- cloud provider HSM APIs have subtle behavioral differences | Medium | Medium | Extensive integration testing per provider; abstract retry and error handling in the provider layer; maintain a compatibility matrix |
| Key rotation grace period misconfiguration -- too short causes outages, too long reduces security | Medium | High | Default to conservative values from the security framework spec; monitor key usage patterns during grace periods; alert on keys used after grace period expiry |
| Shamir share loss -- custodian loses their share or becomes unavailable | Low | Critical | Encrypted backup shares in geographically separate secure storage; annual share verification ceremony; maintain a documented recovery process |
| ABAC policy complexity -- large policy sets may cause evaluation latency to exceed 10ms target | Medium | Medium | Index policies by subject role and resource type for fast filtering; benchmark with 1,000+ policies during development; implement policy compilation for hot paths |
| DID resolution availability -- DID Document lookup may become a bottleneck | Medium | Medium | Cache DID Documents with configurable TTL; support local resolution for same-node identities; implement circuit breaker for external resolution |


---

**Document Status**: Draft
**Last Updated**: 2026-02-03
**Next Review**: Sprint 21 planning
**Parent Document**: [README.md](README.md) (GTCX Cryptographic Systems Master Roadmap)
