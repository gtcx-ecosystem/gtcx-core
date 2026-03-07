# gtcx-core Roadmap

**Status**: Sprints 0–6 complete. Repo in active development for Phases 4–7 cryptographic systems.
**Objective**: Production-ready protocol core for global south deployment — offline-first, government-grade identity, financial market infrastructure reliability.

---

## Delivery Summary

| Phase | Name                      | Status       | Target  |
| ----- | ------------------------- | ------------ | ------- |
| 0     | Cryptographic Foundation  | **Complete** | —       |
| 1     | Operational Core          | **Complete** | —       |
| 2     | Protocol Backbone         | **Complete** | —       |
| 3     | Interop and Deep Crypto   | **Complete** | —       |
| 4     | Network Layer             | Planned      | Q2 2026 |
| 5     | PANX Consensus            | Planned      | Q3 2026 |
| 6     | ZK Proof System           | Planned      | Q3 2026 |
| 7     | Identity & Key Management | Planned      | Q4 2026 |

---

## Completed Phases

### Phase 0: Cryptographic Foundation — Complete

**Location**: `rust/gtcx-crypto/`

| Module    | Description                                        |
| --------- | -------------------------------------------------- |
| `signing` | Ed25519 digital signatures with batch verification |
| `hashing` | SHA-256 and Blake3 hashing with streaming support  |
| `keys`    | HD key derivation (BIP-32 compatible)              |
| `audit`   | Hash-chained audit logs with tamper detection      |

Security: `#![deny(unsafe_code)]`, `Zeroizing<T>` for all key material, RFC test vectors.

### Phase 1: Operational Core — Complete (Sprints 0–2)

- **DID Resolver** — resolver adapters, cache + revocation checks, injection + fallback strategies
- **Offline Sync Engine** — conflict resolution (LWW, merge), resumable sync, conflict audit logs, deterministic reconciliation
- **API Client** — retry, circuit breakers, offline queue, signed request support, mTLS

### Phase 2: Protocol Backbone — Complete (Sprints 3–4)

- **P2P Networking** — libp2p transport with QUIC + gossipsub, secure peer discovery, identity handshake, topic permissions and rate limits
- **ZKP System** — real circuits (Groth16, Bulletproofs, Schnorr), proof generation/verification performance budgets

### Phase 3: Interop and Deep Crypto — Complete (Sprints 5–6)

- **Rust secp256k1** — signing and verification, test vectors, EVM/Bitcoin interop tests

---

## Planned Phases (2026)

### Phase 4: Network Layer — Q2 2026

Owner: `gtcx-core` | 18 stories / 38 points

P2P transport hardening, validator mesh, QUIC + gossipsub at scale, secure peer discovery.

### Phase 5: PANX Consensus — Q3 2026

Owner: `gtcx-core` | 18 stories / 42 points

Weighted PBFT consensus engine, validator IDs, message envelope, adversarial scenarios.
Depends on: Phase 4.

### Phase 6: ZK Proof System — Q3 2026

Owner: `gtcx-core` | 17 stories / 53 points

Full ZKP circuit matrix — Groth16 (threshold/ownership/location), Bulletproofs (amount range), Schnorr (identity attribute). Performance budgets enforced via CI.

### Phase 7: Identity & Key Management — Q4 2026

Owner: `gtcx-core` | 15 stories / 29 points

BBS+ credentials, TradePass binding, GCI compliance proofs, key lifecycle for validator nodes.
Depends on: Phase 6.

---

## Integration Sprints

| Sprint | Name                          | After   | Points | What Gets Wired                                            |
| ------ | ----------------------------- | ------- | ------ | ---------------------------------------------------------- |
| INT-1  | Network + Consensus Handshake | Phase 4 | 10     | Validator IDs → node identity, PBFT → message envelope     |
| INT-2  | ZK + Identity Binding         | Phase 6 | 10     | BBS+ → TradePass credentials, GCI proofs → compliance      |
| INT-3  | Full System Integration       | Phase 7 | 16     | All end-to-end flows + adversarial cross-cutting scenarios |

---

## Security and Compliance Profile

**Baseline (required for all releases)**

- ISO 27001 aligned controls and evidence
- SOC 2 Type II operational controls
- SBOM + provenance artifacts per release

**Government-grade (recommended for public sector deployments)**

- FIPS 140-3 validated cryptographic modules
- HSM-backed key management for validators
- Secure boot and tamper-evident logging for nodes
- Export control policy review for crypto distribution

---

## Risk Register

| ID  | Risk                             | Likelihood | Impact | Mitigation                                     |
| --- | -------------------------------- | ---------- | ------ | ---------------------------------------------- |
| R1  | Rust crypto expertise            | High       | High   | Cross-train; specialized contractors           |
| R2  | arkworks API stability           | Medium     | Medium | Pin exact versions; thin abstraction layer     |
| R3  | libp2p breaking changes          | Medium     | Medium | Pin to specific release for Phase 4            |
| R4  | Regulatory requirements shifting | Low        | High   | Quarterly tracking; configurable policy layers |

---

## References

- [`_sop/2-docs/3-engineering/2-system-design/overview.md`](../../../2-docs/3-engineering/2-system-design/overview.md)
- [`_sop/2-docs/3-engineering/6-decisions/007-offline-first-architecture.md`](../../../2-docs/3-engineering/6-decisions/007-offline-first-architecture.md)
- [`_sop/2-docs/3-engineering/6-decisions/010-pbft-weighted-consensus.md`](../../../2-docs/3-engineering/6-decisions/010-pbft-weighted-consensus.md)
- [`_sop/2-docs/5-specs/4-backend/packages/rust/gtcx-crypto.md`](../../../2-docs/5-specs/4-backend/packages/rust/gtcx-crypto.md)
- [`_sop/2-docs/5-specs/4-backend/packages/rust/gtcx-zkp.md`](../../../2-docs/5-specs/4-backend/packages/rust/gtcx-zkp.md)
