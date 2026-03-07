# Quick Reference — gtcx-core

> One-page orientation. Start here, then follow the links.

---

## What This Repo Is

Shared foundation for the GTCX ecosystem. 18 TypeScript packages + 6 Rust crates. Cryptographic primitives, Zod schemas, DID/credential infrastructure, WorkProof/TradeCV attestations, and the offline sync engine. Depends on nothing else — everything else depends on this.

---

## Key Documents

| What                  | Where                                                                                                                        |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Codebase map          | [`orientation.md`](orientation.md)                                                                                           |
| Safety rules          | [`../4-workflows/safety-rules.md`](../4-workflows/safety-rules.md)                                                           |
| Architecture overview | [`../../2-docs/3-engineering/2-system-design/overview.md`](../../2-docs/3-engineering/2-system-design/overview.md)           |
| ADR index             | [`../../2-docs/3-engineering/6-decisions/README.md`](../../2-docs/3-engineering/6-decisions/README.md)                       |
| Security framework    | [`../../2-docs/3-engineering/7-security/security-framework.md`](../../2-docs/3-engineering/7-security/security-framework.md) |
| Quality runbook       | [`../../2-docs/4-devops/2-runbooks/quality-runbook.md`](../../2-docs/4-devops/2-runbooks/quality-runbook.md)                 |
| Release checklist     | [`../../2-docs/4-devops/7-release-mgmt/release-checklist.md`](../../2-docs/4-devops/7-release-mgmt/release-checklist.md)     |
| Package specs         | [`../../2-docs/5-specs/4-backend/packages/README.md`](../../2-docs/5-specs/4-backend/packages/README.md)                     |

---

## Repo Structure

```
gtcx-core/
├── packages/          # 18 TypeScript packages (@gtcx/*)
├── rust/              # 6 Rust crates (gtcx-crypto, gtcx-zkp, etc.)
├── tests/             # Cross-package integration tests
├── benchmarks/        # Performance budgets
├── quality/           # API surface baselines and evidence artifacts
└── _sop/              # Docs, agent team, safety rules, runbooks
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
2. Read [`../4-workflows/safety-rules.md`](../4-workflows/safety-rules.md) — what needs human approval
3. Read the role file for your current work
4. After a break: [`context-recovery.md`](context-recovery.md)

---

## Security-Sensitive — Always Requires Human Approval

- `packages/crypto/` — Ed25519, SHA-256/512, commitments, Merkle trees
- `rust/gtcx-crypto/` — Rust crypto primitives
- `packages/security/` — auth, key storage, audit log chain integrity
- `packages/identity/` — DID lifecycle, key management
- Public API surface of any published `@gtcx/*` package
