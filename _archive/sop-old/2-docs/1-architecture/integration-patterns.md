# Cross-Repo Integration Patterns

| Attribute | Value                          |
| --------- | ------------------------------ |
| Scope     | gtcx-core integration patterns |
| Status    | Active                         |

## Overview

This document defines the canonical integration patterns for repos consuming `gtcx-core`. `gtcx-core` provides primitives, schemas, and transport utilities; downstream repos orchestrate workflow-specific logic.

## 1. Shared Authentication Pattern

All downstream flows start by resolving identity and validating credentials.

```typescript
interface CoreOperation {
  actor: {
    did: string;
    credential: unknown;
  };
  operation: string;
  payload: unknown;
  signature: string;
}
```

Identity verification is performed once at the boundary and then propagated via signed context across internal steps.

## 2. Shared Cryptography Pattern

All repos use the same cryptographic primitives from `@gtcx/crypto`:

| Primitive | Algorithm                      | Usage                              |
| --------- | ------------------------------ | ---------------------------------- |
| Signing   | Ed25519                        | Event signing, credential proofs   |
| Hashing   | SHA-256, Blake3                | Content addressing, hash chains    |
| ZK proofs | Groth16, Bulletproofs, Schnorr | Range, ownership, attribute proofs |

Native bindings are loaded via `@gtcx/crypto-native` when available. JS fallback is always present.

## 3. Shared Data Model Pattern

All cross-repo data exchange uses schemas from `SOP/2-docs/2-specs/data-models.md` with Zod validation at runtime. This ensures consistent serialization and deterministic validation across services.

## 4. Event-Oriented Orchestration

Downstream repos use `@gtcx/events` to coordinate multi-step workflows and compensate on failure. `gtcx-core` provides typed event primitives; orchestration logic lives in the consuming repo.

## 5. Transport and Sync Pattern

| Package              | Role                                                      |
| -------------------- | --------------------------------------------------------- |
| `@gtcx/network`      | P2P transport primitives and mesh support                 |
| `@gtcx/sync`         | Offline-first sync with deterministic conflict resolution |
| `@gtcx/api-client`   | Resilient HTTP integration with retry and mTLS            |
| `@gtcx/connectivity` | Runtime connectivity detection and policy profiles        |

## References

- `SOP/2-docs/2-specs/network-protocol.md`
- `SOP/2-docs/3-engineering/security/security-framework.md`
- `SOP/2-docs/2-specs/data-models.md`
