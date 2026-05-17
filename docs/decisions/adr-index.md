---
title: 'Adr Index'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'critical'
tags: ['docs', 'architecture']
review_cycle: 'quarterly'
---

# Architecture Decision Records

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

This directory contains Architecture Decision Records (ADRs) for the GTCX Core repository. ADRs document significant architectural decisions, their context, and consequences.

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
| [014](014-runtime-substrate.md)                         | Runtime substrate — batteries-included foundation    | Accepted | 2026-05-06 |

## Format

Each ADR follows the [ADR template](adr-template.md) format with Status, Date, Context, Decision, and Consequences sections.

## Process

1. Copy `adr-template.md` to `NNN-short-title.md`
2. Fill in all sections with substantive content
3. Set status to "Proposed"
4. Submit PR for review
5. Once merged, update status to "Accepted"
