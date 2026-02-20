# Spec-to-Code Traceability Matrix (gtcx-core)

**Updated**: 2026-02-20  
**Scope**: `docs/specs/*` mapped to `packages/*` and `rust/*`

## Summary by Spec

| Spec                    | Primary Code Areas                                            | Status      | Major Gaps                                         |
| ----------------------- | ------------------------------------------------------------- | ----------- | -------------------------------------------------- |
| `data-models.md`        | `packages/types`, `packages/domain`, `packages/schemas`       | Implemented | None at spec level; ongoing schema evolution       |
| `eventcore.md`          | `packages/events`, `packages/domain`                          | Implemented | None                                               |
| `identity-core.md`      | `packages/identity`, `packages/security`, `packages/types`    | Implemented | Resolver adapters + cache; backend deployment req. |
| `network-protocol.md`   | `rust/gtcx-network`, `rust/gtcx-consensus`, `packages/events` | Partial     | No libp2p transport; networking is type-level only |
| `security-framework.md` | `packages/security`, `packages/domain`, `docs/security/*`     | Implemented | Operational controls depend on infra policies      |

## Detailed Mapping

### `data-models.md`

**Coverage**

- Core data models and type aliases mapped to `@gtcx/types`.
- Runtime validation schemas mapped to `@gtcx/schemas`.
- Domain objects and services mapped to `@gtcx/domain`.

**Primary Code**

- `packages/types/src/**`
- `packages/schemas/src/**`
- `packages/domain/src/**`

**Status**: Implemented

### `eventcore.md`

**Coverage**

- Event types, encoding, and payloads mapped to `@gtcx/events`.
- Domain event factory and emitters mapped to `@gtcx/domain`.

**Primary Code**

- `packages/events/src/**`
- `packages/domain/src/events/**`

**Status**: Implemented

### `identity-core.md`

**Coverage**

- DID formats and document construction mapped to `@gtcx/identity`.
- Credential types and security checks mapped to `@gtcx/security`.

**Primary Code**

- `packages/identity/src/**`
- `packages/security/src/**`

**Status**: Implemented (resolver adapters + cache; backends required)

### `network-protocol.md`

**Coverage**

- Network types, topics, and message formats mapped to `rust/gtcx-network`.
- Consensus structures mapped to `rust/gtcx-consensus`.

**Primary Code**

- `rust/gtcx-network/src/**`
- `rust/gtcx-consensus/src/**`

**Gap**

- No libp2p transport implementation; network stack is type-level only.

**Status**: Partial

### `security-framework.md`

**Coverage**

- Security controls mapped to `@gtcx/security`.
- Threat control matrix mapped to `docs/security/threat-control-matrix.md`.

**Primary Code**

- `packages/security/src/**`
- `docs/security/**`

**Status**: Implemented (code-level controls).  
Operational controls depend on deployment policies and infra.

## Known Full-Spec Gaps (Cross-Cutting)

| Capability       | Current Status              | Location                              | Notes                                    |
| ---------------- | --------------------------- | ------------------------------------- | ---------------------------------------- |
| API Client       | Implemented                 | `packages/api-client/src/index.ts`    | Basic retry + timeout client             |
| Sync Engine      | Implemented                 | `packages/sync/src/index.ts`          | Deterministic conflict resolution        |
| AI Tracing       | No-op stub                  | `packages/ai/src/index.ts`            | Integration lives in `gtcx-intelligence` |
| DID Resolution   | Implemented                 | `packages/identity/src/resolver.ts`   | Requires deployment-specific backends    |
| ZKP System       | Hash-commitment placeholder | `rust/gtcx-zkp/src/**`                | Real circuits planned                    |
| P2P Transport    | Not implemented             | `rust/gtcx-network/src/**`            | libp2p/QUIC planned                      |
| Rust secp256k1   | TODO                        | `rust/gtcx-crypto/src/signing/mod.rs` | Ed25519 only                             |
| TS native crypto | Not wired                   | `rust/gtcx-node/src/**`               | No TS bridge in `@gtcx/crypto`           |

## Next Actions (Phase 0)

1. Expand this matrix to section-level mapping for each spec.
2. Convert each gap into an epic with acceptance criteria.
3. Link epics to the full-spec roadmap phases.
