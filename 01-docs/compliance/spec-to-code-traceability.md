---
title: 'Spec-to-Code Traceability — gtcx-core'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'standard'
tags: ['documentation', 'compliance']
review_cycle: 'on-change'
---

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

| Package               | Spec                                                  | Implementation                            |
| --------------------- | ----------------------------------------------------- | ----------------------------------------- |
| `@gtcx/crypto`        | `01-docs/specs/03-platform/packages/crypto.md`        | `03-platform/packages/crypto/src/`        |
| `@gtcx/crypto-native` | `01-docs/specs/03-platform/packages/crypto-native.md` | `03-platform/packages/crypto-native/src/` |
| `@gtcx/identity`      | `01-docs/specs/03-platform/packages/identity.md`      | `03-platform/packages/identity/src/`      |
| `@gtcx/security`      | `01-docs/specs/03-platform/packages/security.md`      | `03-platform/packages/security/src/`      |
| `@gtcx/verification`  | `01-docs/specs/03-platform/packages/verification.md`  | `03-platform/packages/verification/src/`  |
| `@gtcx/workproof`     | `01-docs/specs/03-platform/packages/workproof.md`     | `03-platform/packages/workproof/src/`     |
| `@gtcx/domain`        | `01-docs/specs/03-platform/packages/domain.md`        | `03-platform/packages/domain/src/`        |
| `@gtcx/schemas`       | `01-docs/specs/03-platform/packages/schemas.md`       | `03-platform/packages/schemas/src/`       |
| `@gtcx/types`         | `01-docs/specs/03-platform/packages/types.md`         | `03-platform/packages/types/src/`         |
| `@gtcx/events`        | `01-docs/specs/03-platform/packages/events.md`        | `03-platform/packages/events/src/`        |
| `@gtcx/sync`          | `01-docs/specs/03-platform/packages/sync.md`          | `03-platform/packages/sync/src/`          |
| `@gtcx/network`       | `01-docs/specs/03-platform/packages/network.md`       | `03-platform/packages/network/src/`       |
| `@gtcx/connectivity`  | `01-docs/specs/03-platform/packages/connectivity.md`  | `03-platform/packages/connectivity/src/`  |
| `@gtcx/services`      | `01-docs/specs/03-platform/packages/services.md`      | `03-platform/packages/services/src/`      |
| `@gtcx/api-client`    | `01-docs/specs/03-platform/packages/api-client.md`    | `03-platform/packages/api-client/src/`    |
| `@gtcx/utils`         | `01-docs/specs/03-platform/packages/utils.md`         | `03-platform/packages/utils/src/`         |
| `@gtcx/logging`       | `01-docs/specs/03-platform/packages/logging.md`       | `03-platform/packages/logging/src/`       |
| `@gtcx/ai`            | `01-docs/specs/03-platform/packages/ai.md`            | `03-platform/packages/ai/src/`            |

---

## Rust Crate Traceability

| Crate            | Spec                                                        | Implementation                         |
| ---------------- | ----------------------------------------------------------- | -------------------------------------- |
| `gtcx-crypto`    | `01-docs/specs/03-platform/packages/rust/gtcx-crypto.md`    | `rust/gtcx-crypto/03-platform/src/`    |
| `gtcx-zkp`       | `01-docs/specs/03-platform/packages/rust/gtcx-zkp.md`       | `rust/gtcx-zkp/03-platform/src/`       |
| `gtcx-node`      | `01-docs/specs/03-platform/packages/rust/gtcx-node.md`      | `rust/gtcx-node/03-platform/src/`      |
| `gtcx-network`   | `01-docs/specs/03-platform/packages/rust/gtcx-network.md`   | `rust/gtcx-network/03-platform/src/`   |
| `gtcx-consensus` | `01-docs/specs/03-platform/packages/rust/gtcx-consensus.md` | `rust/gtcx-consensus/03-platform/src/` |
| `gtcx-edge`      | `01-docs/specs/03-platform/packages/rust/gtcx-edge.md`      | `rust/gtcx-edge/03-platform/src/`      |

---

## Reference

- [`01-docs/specs/03-platform/packages/`](../specs/03-platform/packages/) — package specifications
- [`01-docs/01-agents/workflows/tasks/add-package.md`](../agents/workflows/tasks/add-package.md) — process for adding a new package
- [`01-docs/01-agents/workflows/tasks/add-rust-crate.md`](../agents/workflows/tasks/add-rust-crate.md) — process for adding a Rust crate
