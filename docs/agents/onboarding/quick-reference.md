---
title: 'Quick Reference'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs', 'agentic']
review_cycle: 'on-change'
---

# Quick Reference — gtcx-core

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

> One-page orientation. Start here, then follow the links.

**Last reviewed:** 2026-05-06

---

## What This Repo Is

Shared foundation for the GTCX ecosystem. 18 public TypeScript packages, 4 shared config workspace packages, and 6 Rust crates. Cryptographic primitives, Zod schemas, DID/credential infrastructure, WorkProof/TradeCV attestations, and the offline sync engine. Depends on nothing else in the GTCX stack; everything else depends on it.

---

## Key Documents

| What                  | Where                                                                                              |
| --------------------- | -------------------------------------------------------------------------------------------------- |
| Codebase map          | [`orientation.md`](orientation.md)                                                                 |
| Safety rules          | [`../workflows/safety-rules.md`](../workflows/safety-rules.md)                                     |
| Architecture overview | [`../../architecture/overview.md`](../../architecture/overview.md)                                 |
| ADR index             | [`../../decisions/README.md`](../../decisions/README.md)                                           |
| Security framework    | [`../../security/security-framework.md`](../../security/security-framework.md)                     |
| Quality runbook       | [`../../devops/runbooks/quality-runbook.md`](../../devops/runbooks/quality-runbook.md)             |
| Release checklist     | [`../../devops/release-mgmt/release-checklist.md`](../../devops/release-mgmt/release-checklist.md) |
| Package specs         | [`../../specs/packages/README.md`](../../specs/packages/README.md)                                 |

---

## Repo Structure

```
gtcx-core/
├── packages/          # 18 public packages + shared config workspace packages
├── rust/              # 6 Rust crates (gtcx-crypto, gtcx-zkp, etc.)
├── tests/             # Cross-package integration tests
├── benchmarks/        # Performance budgets
├── quality/           # API surface baselines and evidence artifacts
└── docs/              # Docs, agent team, safety rules, runbooks
```

---

## Common Commands

```bash
pnpm install             # Install dependencies
pnpm build               # Build all packages
pnpm typecheck           # Type check
pnpm lint                # Lint
pnpm test                # Run all tests
pnpm test --coverage     # With coverage (80% minimum on critical paths)
pnpm architecture:check  # Boundary enforcement
pnpm api:check           # API surface diff vs baseline
pnpm audit               # Security vulnerability scan
```

---

## Session Start

1. Read [`orientation.md`](orientation.md) — codebase map and pre-commit gates
2. Read [`../workflows/safety-rules.md`](../workflows/safety-rules.md) — what needs human approval
3. Read the role file for your current work
4. After a break: [`context-recovery.md`](context-recovery.md)

---

## Security-Sensitive — Always Requires Human Approval

- `packages/crypto/` — Ed25519, SHA-256/512, commitments, Merkle trees
- `rust/gtcx-crypto/` — Rust crypto primitives
- `packages/security/` — auth, key storage, audit log chain integrity
- `packages/identity/` — DID lifecycle, key management
- Public API surface of any published `@gtcx/*` package
