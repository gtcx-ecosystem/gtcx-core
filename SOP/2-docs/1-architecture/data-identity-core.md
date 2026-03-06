# Data and Identity Core

| Attribute | Value                  |
| --------- | ---------------------- |
| Scope     | gtcx-core architecture |
| Status    | Active                 |

## Overview

The Data and Identity Core defines the canonical formats and identity rules used across `gtcx-core`. The system is anchored by two specifications:

1. **EventCore** — canonical envelope and encoding for events
2. **Identity Core** — DID + credential model for actors and devices

Every verifiable action is expressed as:

```
EventCore(event) + Identity(DID, credential)
```

This enables deterministic replay, auditing, and verification across offline and online workflows.

## Conceptual Flow

```
Edge Device / Actor ──► EventCore payload
                     └── signed by DID key

Credential Registry ◄── DID document + credential status
```

Each EventCore message includes the signer DID. Verification resolves the DID document and checks the signature chain and credential status.

## Shared Design Principles

| Principle                 | Implementation                                           |
| ------------------------- | -------------------------------------------------------- |
| Canonical formats         | Deterministic JSON and schema-backed payloads            |
| Self-describing records   | `schemaVersion` with explicit extension namespaces       |
| Permissioned extension    | Namespaced keys prevent forks and collisions             |
| Cryptographic determinism | IDs derived from SHA-256 hashes of canonicalized content |
| Upgrade path              | SemVer with governance review for breaking changes       |

## Interaction with Other Domains

- **Security**: validation and audit logging enforced by `@gtcx/security`.
- **Verification**: proof bundles attach to EventCore records.
- **Sync**: offline queues store EventCore records for deterministic replay.

## References

- `SOP/2-docs/2-specs/eventcore.md`
- `SOP/2-docs/2-specs/identity-core.md`
- `SOP/2-docs/2-specs/data-models.md`
- `SOP/2-docs/3-engineering/security/security-framework.md`
