---
title: 'Developer Quickstart — gtcx-core'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'standard'
tags: ['documentation', 'agents']
review_cycle: 'on-change'
---

---

title: 'Developer Quickstart'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs', 'agentic']
review_cycle: 'on-change'

---

# Developer Quickstart — gtcx-core

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

Get a working local build and complete your first integration workflow.

**Last reviewed:** 2026-05-06

---

## Setup

```bash
git clone https://github.com/gtcx-ecosystem/gtcx-core.git
cd gtcx-core
pnpm install
pnpm build
pnpm test
```

Prerequisites: Node.js >= 20, pnpm >= 9.15, Rust >= 1.75. See [Developer Setup](developer-setup.md) for full prerequisites and troubleshooting.

---

## What This Repo Is

`gtcx-core` is a library monorepo — 22 public TypeScript packages, 4 shared config workspace packages, and 6 Rust crates. It has no server, no database, and produces no deployable application artifact. Downstream GTCX repos (`gtcx-protocols`, `gtcx-platforms`, `gtcx-app`, etc.) consume its public packages as npm dependencies.

There is no "run the app" workflow. All work is package-level: build, test, lint, and verify.

---

## First Workflow — Use a Package in Another Repo

To integrate `@gtcx/crypto` into a downstream repo:

```bash
# In the downstream repo
pnpm add @gtcx/crypto
```

```typescript
import { generateKeyPair, sign, verify, sha256 } from '@gtcx/crypto';

// Generate an Ed25519 key pair
const { publicKey, privateKey } = await generateKeyPair('ed25519');

// Sign a message
const message = new TextEncoder().encode('hello gtcx');
const signature = await sign(message, privateKey);

// Verify the signature
const valid = await verify(message, signature, publicKey);
```

---

## First Workflow — Run Tests for a Single Package

```bash
# Run tests for a specific package
pnpm --filter @gtcx/crypto test

# Run in watch mode during development
pnpm --filter @gtcx/crypto test -- --watch

# Run with coverage
pnpm --filter @gtcx/crypto test:coverage
```

---

## Package Overview

| Package                     | What It Gives You                                                                    |
| --------------------------- | ------------------------------------------------------------------------------------ |
| `@gtcx/crypto`              | Ed25519/Secp256k1 signing, SHA-256/512, Merkle proofs, commitments                   |
| `@gtcx/types`               | Shared TypeScript types for the GTCX ecosystem                                       |
| `@gtcx/schemas`             | Zod validation schemas for all Core12 entities                                       |
| `@gtcx/identity`            | DID creation, credential management, key lifecycle                                   |
| `@gtcx/security`            | Auth, AES-256-GCM storage, offline credential management                             |
| `@gtcx/verification`        | Certificate generation, QR codes, W3C VC proof bundles                               |
| `@gtcx/workproof`           | TradeCV/WorkProof v2.2 — W3C VC work attestations, 47 predicates across 9 categories |
| `@gtcx/domain`              | Commodity-agnostic domain services, DI container, observability                      |
| `@gtcx/sync`                | Offline-first sync engine with deterministic conflict resolution                     |
| `@gtcx/events`              | Type-safe event bus with offline buffering                                           |
| `@gtcx/logging`             | Structured logging for GTCX services                                                 |
| `@gtcx/api-client`          | Resilient HTTP client with retry, offline queue, and request signing                 |
| `@gtcx/connectivity`        | Network connectivity detection for offline-first apps                                |
| `@gtcx/services`            | Registration, trading, and compliance business services                              |
| `@gtcx/ai`                  | AI integration hooks and tracing utilities                                           |
| `@gtcx/utils`               | Shared utility functions                                                             |
| `@gtcx/crypto-native`       | NAPI-RS native binding loader                                                        |
| `@gtcx/eslint-config`       | Shared ESLint workspace configuration                                                |
| `@gtcx/typescript-config`   | Shared TypeScript workspace configuration                                            |
| `@gtcx/tsup-config`         | Shared tsup workspace configuration                                                  |
| `@gtcx/jurisdiction-config` | Shared jurisdictional configuration workspace package                                |

For Rust crates: `gtcx-crypto`, `gtcx-zkp`, `gtcx-consensus`, `gtcx-network`, `gtcx-edge`, `gtcx-node`.

---

## Key Commands

```bash
pnpm build             # Build all packages
pnpm test              # Run all tests
pnpm typecheck         # Type check all packages
pnpm lint              # Lint all packages
pnpm architecture:check  # Verify no package boundary violations
pnpm api:check         # Check API surface against baseline
cargo clippy -D warnings  # Rust lint (must pass before PR)
cargo test --workspace --lib  # Rust unit tests
```

---

## Making a Change

1. Pick a package in `packages/` or a crate in `rust/`
2. Make the change
3. Run `pnpm build && pnpm test && pnpm typecheck && pnpm lint`
4. If touching `@gtcx/crypto`, `@gtcx/security`, `@gtcx/identity`, `@gtcx/verification`, or any Rust crate — also run `pnpm architecture:check` and `pnpm api:check`
5. If the API surface changed, review the diff in `quality/api-surface-baseline.json` before committing — do not update the baseline without human approval

---

## Need Help?

- Architecture decisions: [`../../decisions/`](../../decisions/)
- Security rules: [`../workflows/safety-rules.md`](../workflows/safety-rules.md)
- Package specs: [`../../specs/packages/`](../../specs/packages/)
- Issues: https://github.com/gtcx-ecosystem/gtcx-core/issues
