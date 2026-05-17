---
title: 'Spec To Code Traceability'
status: 'current'
date: '2026-05-17'
owner: 'quality-evidence-lead'
role: 'quality-evidence-lead'
tier: 'critical'
tags: ['docs', 'compliance']
review_cycle: 'quarterly'
---

# Spec-to-Code Traceability — gtcx-core

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Quality & Evidence Lead

Maps each package specification to its implementation module. Updated when packages are added or when a spec changes scope.

---

## How to Use This Document

- When adding a new package: add an entry here after completing the package spec
- When a spec changes: verify the implementation module is updated to match
- During release: confirm all spec-to-code mappings are current

---

## TypeScript Package Traceability

| Package               | Spec                                   | Implementation                |
| --------------------- | -------------------------------------- | ----------------------------- |
| `@gtcx/crypto`        | `docs/specs/packages/crypto.md`        | `packages/crypto/src/`        |
| `@gtcx/crypto-native` | `docs/specs/packages/crypto-native.md` | `packages/crypto-native/src/` |
| `@gtcx/identity`      | `docs/specs/packages/identity.md`      | `packages/identity/src/`      |
| `@gtcx/security`      | `docs/specs/packages/security.md`      | `packages/security/src/`      |
| `@gtcx/verification`  | `docs/specs/packages/verification.md`  | `packages/verification/src/`  |
| `@gtcx/workproof`     | `docs/specs/packages/workproof.md`     | `packages/workproof/src/`     |
| `@gtcx/domain`        | `docs/specs/packages/domain.md`        | `packages/domain/src/`        |
| `@gtcx/schemas`       | `docs/specs/packages/schemas.md`       | `packages/schemas/src/`       |
| `@gtcx/types`         | `docs/specs/packages/types.md`         | `packages/types/src/`         |
| `@gtcx/events`        | `docs/specs/packages/events.md`        | `packages/events/src/`        |
| `@gtcx/sync`          | `docs/specs/packages/sync.md`          | `packages/sync/src/`          |
| `@gtcx/network`       | `docs/specs/packages/network.md`       | `packages/network/src/`       |
| `@gtcx/connectivity`  | `docs/specs/packages/connectivity.md`  | `packages/connectivity/src/`  |
| `@gtcx/services`      | `docs/specs/packages/services.md`      | `packages/services/src/`      |
| `@gtcx/api-client`    | `docs/specs/packages/api-client.md`    | `packages/api-client/src/`    |
| `@gtcx/utils`         | `docs/specs/packages/utils.md`         | `packages/utils/src/`         |
| `@gtcx/logging`       | `docs/specs/packages/logging.md`       | `packages/logging/src/`       |
| `@gtcx/ai`            | `docs/specs/packages/ai.md`            | `packages/ai/src/`            |

---

## Rust Crate Traceability

| Crate            | Spec                                         | Implementation             |
| ---------------- | -------------------------------------------- | -------------------------- |
| `gtcx-crypto`    | `docs/specs/packages/rust/gtcx-crypto.md`    | `rust/gtcx-crypto/src/`    |
| `gtcx-zkp`       | `docs/specs/packages/rust/gtcx-zkp.md`       | `rust/gtcx-zkp/src/`       |
| `gtcx-node`      | `docs/specs/packages/rust/gtcx-node.md`      | `rust/gtcx-node/src/`      |
| `gtcx-network`   | `docs/specs/packages/rust/gtcx-network.md`   | `rust/gtcx-network/src/`   |
| `gtcx-consensus` | `docs/specs/packages/rust/gtcx-consensus.md` | `rust/gtcx-consensus/src/` |
| `gtcx-edge`      | `docs/specs/packages/rust/gtcx-edge.md`      | `rust/gtcx-edge/src/`      |

---

## Reference

- [`docs/specs/packages/`](../specs/packages/) — package specifications
- [`docs/agents/workflows/tasks/add-package.md`](../agents/workflows/tasks/add-package.md) — process for adding a new package
- [`docs/agents/workflows/tasks/add-rust-crate.md`](../agents/workflows/tasks/add-rust-crate.md) — process for adding a Rust crate
