# Cross-Repo Integration Patterns

## Document Control

| Attribute         | Value                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------- |
| **Scope**         | gtcx-core integration patterns                                                              |
| **Status**        | Active                                                                                      |
| **Related Specs** | `../specs/data-models.md`, `../specs/security-framework.md`, `../specs/network-protocol.md` |

---

## 1. Overview

This document defines the canonical integration patterns for repos consuming gtcx-core. gtcx-core provides primitives, schemas, and transport utilities; downstream repos orchestrate workflow-specific logic.

## 2. Shared Authentication Pattern

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

## 3. Shared Cryptography Pattern

All repos use the same cryptographic primitives from `@gtcx/crypto`:

| Primitive | Algorithm                      | Usage                              |
| --------- | ------------------------------ | ---------------------------------- |
| Signing   | Ed25519                        | Event signing, credential proofs   |
| Hashing   | SHA-256, Blake3                | Content addressing, hash chains    |
| ZK proofs | Groth16, Bulletproofs, Schnorr | Range, ownership, attribute proofs |

Native bindings are loaded via `@gtcx/crypto-native` when available.

## 4. Shared Data Model Pattern

All cross-repo data exchange uses schemas from `docs/specs/data-models.md` with Zod validation at runtime. This ensures consistent serialization and deterministic validation.

## 5. Event-Oriented Orchestration

Downstream repos can use the `@gtcx/events` package to coordinate multi-step workflows and compensate on failure. gtcx-core provides typed event primitives; orchestration logic lives outside this repo.

## 6. Transport and Sync Pattern

- `@gtcx/network` provides P2P transport primitives.
- `@gtcx/sync` provides offline-first sync with deterministic conflict resolution.
- `@gtcx/api-client` provides resilient HTTP integration with retry and mTLS.

## 7. References

- `../specs/network-protocol.md`
- `../specs/security-framework.md`
- `../specs/data-models.md`
