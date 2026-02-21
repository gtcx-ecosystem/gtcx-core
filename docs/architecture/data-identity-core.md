# Data and Identity Core

## Document Control

| Attribute   | Value                                                                                                             |
| ----------- | ----------------------------------------------------------------------------------------------------------------- |
| **Scope**   | gtcx-core architecture                                                                                            |
| **Status**  | Active                                                                                                            |
| **Related** | `../specs/eventcore.md`, `../specs/identity-core.md`, `../specs/data-models.md`, `../specs/security-framework.md` |

---

## 1. Overview

The Data and Identity Core defines the canonical formats and identity rules used across gtcx-core. The system is anchored by two specifications:

1. **EventCore** — canonical envelope and encoding for events
2. **Identity Core** — DID + credential model for actors and devices

Every verifiable action is expressed as:

```
EventCore(event) + Identity(DID, credential)
```

This enables deterministic replay, auditing, and verification across offline and online workflows.

## 2. Conceptual Flow

```
Edge Device / Actor ──► EventCore payload
                     └── signed by DID key

Credential Registry ◄── DID document + credential status
```

Each EventCore message includes the signer DID. Verification resolves the DID document and checks the signature chain and credential status.

## 3. Shared Design Principles

| Principle                 | Implementation                                           |
| ------------------------- | -------------------------------------------------------- |
| Canonical formats         | Deterministic JSON and schema-backed payloads            |
| Self-describing records   | `schemaVersion` with explicit extension namespaces       |
| Permissioned extension    | Namespaced keys prevent forks and collisions             |
| Cryptographic determinism | IDs derived from SHA-256 hashes of canonicalized content |
| Upgrade path              | SemVer with governance review for breaking changes       |

## 4. Interaction with Other Domains

- **Security**: validation and audit logging enforced by `@gtcx/security`.
- **Verification**: proof bundles attach to EventCore records.
- **Sync**: offline queues store EventCore records for deterministic replay.

## 5. Implementation Notes

- Event schemas are defined in `docs/specs/eventcore.md` and `docs/specs/data-models.md`.
- DID and credential flows are defined in `docs/specs/identity-core.md`.
- Hashing primitives are provided by `@gtcx/crypto` and Rust backends.

## 6. Related Documents

- `../specs/eventcore.md`
- `../specs/identity-core.md`
- `../specs/data-models.md`
- `../specs/security-framework.md`
