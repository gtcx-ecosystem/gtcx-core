# Data and Identity Core

## Document Control

| Attribute   | Value                                                                                                                            |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Scope**   | gtcx-core architecture                                                                                                           |
| **Status**  | Publication-Ready                                                                                                                |
| **Related** | [EventCore Spec](../specs/eventcore.md), [Identity Core Spec](../specs/identity-core.md), [Data Models](../specs/data-models.md) |

---

## 1. Overview

The Data and Identity Core is the information fabric of the GTCX ecosystem. It guarantees that every byte collected at the edge and every party in the network is represented in a single, verifiable, and future-proof format. The domain is anchored by two open specifications:

1. **EventCore v1.0** — A canonical envelope and encoding for every supply-chain event
2. **TradePass Credential v2.0** — A Verifiable Credential profile for actors, devices, and roles, plus delegated authorization

### 1.1 Why These Two Specs Together

- **EventCore** defines _what_ happened and _when_
- **TradePass** proves _who_ did it (or which device sensed it) and _why we should trust them_

Everything in GTCX — from a miner's GPS ping to a customs PvP release — can be expressed as:

```
EventCore(event) + TradePass(subject)
```

This symmetry eliminates bespoke integrations and lets any validator replay the entire history from hashes alone.

---

## 2. Conceptual Flow

```
Edge Device         ──► EventCore (JSON / Proto / CBOR)
                    │
                    └── signed by device TradePass key

Supply-Chain Actor  ──► TradePass Credential (VC, JSON-LD)

Ledger / DB         ◄── hash(event), hash(credential)
```

Each new EventCore message embeds the `tradePassId` of the signer. Registry services dereference that ID to fetch the corresponding credential — including revocation status and endorsements — and validate the signature chain on the fly.

---

## 3. Shared Design Principles

| Principle                     | Implementation                                                                                    |
| ----------------------------- | ------------------------------------------------------------------------------------------------- |
| **Canonical formats**         | EventCore uses deterministic JSON and Protobuf; TradePass uses JSON-LD + JSON Schema              |
| **Self-describing**           | Both specs carry `schemaVersion` and extension namespaces                                         |
| **Permissionless extension**  | Namespaced keys (`extensions` in EventCore, `credentialSubject.extra` in TradePass) prevent forks |
| **Cryptographic determinism** | IDs are SHA-3-256 hashes of canonicalized content                                                 |
| **Upgrade path**              | SemVer: new optional fields = minor bump; breaking change = major bump via Governance RFC         |

---

## 4. Interaction with Other Domains

### 4.1 Edge-Device and Runtime Suite

Assets produce EventCore messages; devices themselves are issued _device-class_ TradePass credentials. A device's secure element generates its keypair, and the TradePass credential binds that key to the device identity and its operator.

### 4.2 Compliance-as-a-Service (CaaS / ComReg)

Consumes EventCore streams, attaches a `ComplianceScore` EventCore message, and writes an audit Verifiable Credential referencing the actor's TradePass. The GCI scoring algorithm (see [Data Models](../specs/data-models.md) Section 7.7) operates entirely on EventCore input data.

### 4.3 Governance and Security

Revocation registries and extensions are version-controlled in the on-chain parameter store defined by the Governance RFC. Key rotation events are themselves EventCore messages, creating a self-documenting key lifecycle.

### 4.4 Interop Bridge

Converts EventCore into external schemas (GS1 EPCIS, LBMA Chain of Custody) while preserving the original hash. Embeds TradePass public keys as X.509 Subject Alternative Names or EPCIS party IDs for downstream compatibility.

---

## 5. Deployment Lifecycle

| Phase                  | Action                                                                                                   | Specifications Used                                  |
| ---------------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| 1. Identity enrollment | Actor submits KYC/KYB, receives signed TradePass VC                                                      | [Identity Core](../specs/identity-core.md)           |
| 2. Edge registration   | Device boots, keypair generated in secure element, device TradePass issued                               | [Identity Core](../specs/identity-core.md)           |
| 3. Event emission      | Device or backend wraps data in EventCore, signs with TradePass key, publishes                           | [EventCore](../specs/eventcore.md)                   |
| 4. Validation          | Downstream node fetches issuer's DID doc, checks VC status, hashes canonical event, verifies signature   | [Security Framework](../specs/security-framework.md) |
| 5. Aggregation         | Data warehouses group EventCore records by `tradePassId` for analytics; wallets present selective proofs | [Data Models](../specs/data-models.md)               |

Adding a new vertical (e.g., lithium, fisheries) requires implementing one EventCore Extension Pack (if needed) and reusing existing schemas. No changes to the core specifications.

---

## 6. Extensibility Roadmap

| Timeframe                | Planned Work                                                                                                              |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| Near-term (< 12 months)  | SD-JWT selective disclosure for TradePass per-field privacy; `gold-v1` and `grain-eu` EventCore Extension Packs           |
| Long-term (12-24 months) | Merkle-tree aggregation in EventCore for light-client proofs; decentralized revocation via status-list-2023 for TradePass |

---

## 7. Related Documents

- [EventCore Specification](../specs/eventcore.md) — Full canonical data model and encoding specification
- [Identity Core Specification](../specs/identity-core.md) — TradePass identity container with verification levels, DID documents, and API endpoints
- [Data Models](../specs/data-models.md) — Complete schema definitions including asset registry and GCI scoring
- [Security Framework](../specs/security-framework.md) — Cryptographic standards, key hierarchy, and threat model
