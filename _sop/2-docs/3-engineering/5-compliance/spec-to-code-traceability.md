# Spec-to-Code Traceability — gtcx-core

Maps each package specification to its implementation module. Updated when packages are added or when a spec changes scope.

---

## How to Use This Document

- When adding a new package: add an entry here after completing the package spec
- When a spec changes: verify the implementation module is updated to match
- During release: confirm all spec-to-code mappings are current

---

## TypeScript Package Traceability

| Package               | Spec                                                      | Implementation                |
| --------------------- | --------------------------------------------------------- | ----------------------------- |
| `@gtcx/crypto`        | `_sop/2-docs/5-specs/4-backend/packages/crypto.md`        | `packages/crypto/src/`        |
| `@gtcx/crypto-native` | `_sop/2-docs/5-specs/4-backend/packages/crypto-native.md` | `packages/crypto-native/src/` |
| `@gtcx/identity`      | `_sop/2-docs/5-specs/4-backend/packages/identity.md`      | `packages/identity/src/`      |
| `@gtcx/security`      | `_sop/2-docs/5-specs/4-backend/packages/security.md`      | `packages/security/src/`      |
| `@gtcx/verification`  | `_sop/2-docs/5-specs/4-backend/packages/verification.md`  | `packages/verification/src/`  |
| `@gtcx/workproof`     | `_sop/2-docs/5-specs/4-backend/packages/workproof.md`     | `packages/workproof/src/`     |
| `@gtcx/domain`        | `_sop/2-docs/5-specs/4-backend/packages/domain.md`        | `packages/domain/src/`        |
| `@gtcx/schemas`       | `_sop/2-docs/5-specs/4-backend/packages/schemas.md`       | `packages/schemas/src/`       |
| `@gtcx/types`         | `_sop/2-docs/5-specs/4-backend/packages/types.md`         | `packages/types/src/`         |
| `@gtcx/events`        | `_sop/2-docs/5-specs/4-backend/packages/events.md`        | `packages/events/src/`        |
| `@gtcx/sync`          | `_sop/2-docs/5-specs/4-backend/packages/sync.md`          | `packages/sync/src/`          |
| `@gtcx/network`       | `_sop/2-docs/5-specs/4-backend/packages/network.md`       | `packages/network/src/`       |
| `@gtcx/connectivity`  | `_sop/2-docs/5-specs/4-backend/packages/connectivity.md`  | `packages/connectivity/src/`  |
| `@gtcx/services`      | `_sop/2-docs/5-specs/4-backend/packages/services.md`      | `packages/services/src/`      |
| `@gtcx/api-client`    | `_sop/2-docs/5-specs/4-backend/packages/api-client.md`    | `packages/api-client/src/`    |
| `@gtcx/utils`         | `_sop/2-docs/5-specs/4-backend/packages/utils.md`         | `packages/utils/src/`         |
| `@gtcx/logging`       | `_sop/2-docs/5-specs/4-backend/packages/logging.md`       | `packages/logging/src/`       |
| `@gtcx/ai`            | `_sop/2-docs/5-specs/4-backend/packages/ai.md`            | `packages/ai/src/`            |

---

## Rust Crate Traceability

| Crate            | Spec                                                            | Implementation             |
| ---------------- | --------------------------------------------------------------- | -------------------------- |
| `gtcx-crypto`    | `_sop/2-docs/5-specs/4-backend/packages/rust/gtcx-crypto.md`    | `rust/gtcx-crypto/src/`    |
| `gtcx-zkp`       | `_sop/2-docs/5-specs/4-backend/packages/rust/gtcx-zkp.md`       | `rust/gtcx-zkp/src/`       |
| `gtcx-node`      | `_sop/2-docs/5-specs/4-backend/packages/rust/gtcx-node.md`      | `rust/gtcx-node/src/`      |
| `gtcx-network`   | `_sop/2-docs/5-specs/4-backend/packages/rust/gtcx-network.md`   | `rust/gtcx-network/src/`   |
| `gtcx-consensus` | `_sop/2-docs/5-specs/4-backend/packages/rust/gtcx-consensus.md` | `rust/gtcx-consensus/src/` |
| `gtcx-edge`      | `_sop/2-docs/5-specs/4-backend/packages/rust/gtcx-edge.md`      | `rust/gtcx-edge/src/`      |

---

## Reference

- [`_sop/2-docs/5-specs/4-backend/packages/`](../../../5-specs/4-backend/packages/) — package specifications
- [`_sop/1-agents/4-workflows/tasks/add-package.md`](../../../1-agents/4-workflows/tasks/add-package.md) — process for adding a new package
- [`_sop/1-agents/4-workflows/tasks/add-rust-crate.md`](../../../1-agents/4-workflows/tasks/add-rust-crate.md) — process for adding a Rust crate
