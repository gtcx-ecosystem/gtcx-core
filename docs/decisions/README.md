---
title: "Architecture Decision Records — gtcx-core"
status: "current"
date: "2026-05-27"
owner: "gtcx-core"
role: "protocol-architect"
agent_id: "agent://gtcx-core/2026-05-27/session-backfill"
trust_score: 95
autonomy_level: "sovereign"
tier: "critical"
tags: ["documentation", "decisions"]
review_cycle: "on-change"
---

# Architecture Decision Records — gtcx-core

ADRs documenting significant architectural decisions for `gtcx-core`. Templates and the index are in this folder.

---

## Index

| ADR                                                     | Title                                                | Status   | Date       |
| ------------------------------------------------------- | ---------------------------------------------------- | -------- | ---------- |
| [001](001-rust-for-cryptography.md)                     | Use Rust for all cryptographic operations            | Accepted | 2025-01-15 |
| [002](002-zod-over-json-schema.md)                      | Zod over JSON Schema for runtime validation          | Accepted | 2025-01-15 |
| [003](003-pnpm-workspace-strict-deps.md)                | pnpm workspaces with strict dependency resolution    | Accepted | 2025-01-15 |
| [004](004-commodity-agnostic-domain.md)                 | Commodity-agnostic domain model                      | Accepted | 2025-01-15 |
| [005](005-ed25519-signing.md)                           | Ed25519 over secp256k1 for identity signing          | Accepted | 2025-01-15 |
| [006](006-hash-chain-audit-trail.md)                    | Event-sourced audit trail with hash chains           | Accepted | 2025-01-15 |
| [007](007-offline-first-architecture.md)                | Offline-first with deterministic conflict resolution | Accepted | 2025-01-15 |
| [008](008-optional-tracing-peer-deps.md)                | Optional tracing via peer dependencies               | Accepted | 2025-01-15 |
| [009](009-typescript-rust-fallback.md)                  | TypeScript fallback when Rust bindings unavailable   | Accepted | 2025-01-15 |
| [010](010-pbft-weighted-consensus.md)                   | PBFT consensus with weighted stake model             | Accepted | 2025-01-15 |
| [011](011-architecture-boundary-enforcement.md)         | Architecture boundary enforcement in CI              | Accepted | 2026-02-19 |
| [012](012-error-taxonomy-and-cause-propagation.md)      | Error taxonomy and cause propagation                 | Accepted | 2026-02-19 |
| [013](013-api-baseline-and-performance-budget-gates.md) | API baseline and performance budget gates            | Accepted | 2026-02-19 |

---

## Process

1. Copy [`adr-template.md`](adr-template.md) to `NNN-<kebab-case-title>.md`
2. Fill all sections — Status must be `Proposed`
3. Update this index with the new ADR
4. Submit PR for review
5. Human reviewer sets status to `Accepted` — agents do not mark ADRs Accepted

See [`adr-guide.md`](adr-guide.md) for guidance on when to write an ADR and how to structure the content.

---

## Contents

| File                                 | Description                           |
| ------------------------------------ | ------------------------------------- |
| [`adr-template.md`](adr-template.md) | Mandatory ADR template                |
| [`adr-guide.md`](adr-guide.md)       | Guide to writing and maintaining ADRs |
