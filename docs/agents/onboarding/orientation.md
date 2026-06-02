---
title: 'Codebase Orientation — gtcx-core'
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

title: 'Orientation'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs', 'agentic']
review_cycle: 'on-change'

---

# Codebase Orientation — gtcx-core

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

Session-start protocol for any agent or contributor entering this repo.

---

## What This Repo Is

`gtcx-core` is the shared cryptographic and protocol foundation for the GTCX ecosystem. It exports 22 public TypeScript packages (`@gtcx/*`), 4 shared config workspace packages, and 6 Rust crates (`gtcx-*`) consumed by downstream GTCX repos. It has no product surface, no UI, and no end users. Its output is primitives — signing, identity, verification, sync, networking, and ZKP.

Downstream repos depend on this. Breaking changes here break everything.

---

## Read Before Touching Code

In this order — no exceptions:

1. `docs/specs/core-spec.md` — scope, NFRs, design principles
2. `docs/architecture/overview.md` — layer map and trust boundaries
3. `docs/decisions/` — all ADRs (understand why things are the way they are)
4. `docs/specs/packages/` — spec for the package you are working in
5. `docs/agents/workflows/safety-rules.md` — before making any change

---

## Repo Structure

```
packages/           TypeScript packages (@gtcx/* scope)
rust/               Rust crates (gtcx-* scope)
tools/              Quality gate scripts and automation
tests/integration/  Cross-package integration tests
benchmarks/         Performance budgets and benchmark results
quality/            API surface baselines and evidence artifacts
```

---

## Dependency Rules

- `@gtcx/crypto` has no hard internal dependencies — keep it that way
- `@gtcx/identity`, `@gtcx/security`, `@gtcx/verification` build on `@gtcx/crypto`
- `@gtcx/domain` is the foundational domain layer; `@gtcx/services` builds on it
- Circular dependencies are disallowed — enforced by `pnpm architecture:check`
- Any new dependency must be declared; phantom dependencies are a CI failure

---

## Security-Sensitive Areas

These packages require the Cryptographic Security Engineer role and explicit human review before any change ships:

| Package               | Area                             |
| --------------------- | -------------------------------- |
| `@gtcx/crypto`        | Signing, hashing, ZKP engine     |
| `@gtcx/crypto-native` | Native binding loader            |
| `@gtcx/security`      | Auth, validation, secure storage |
| `@gtcx/verification`  | Certificates, proof bundles      |
| `@gtcx/identity`      | DID, credentials, key management |
| `rust/gtcx-crypto`    | Ed25519, SHA-256, Blake3         |
| `rust/gtcx-zkp`       | Groth16, Bulletproofs, Schnorr   |

---

## Pre-Commit Gate

Run this sequence before every commit:

```bash
pnpm architecture:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

See `docs/devops/runbooks/quality-runbook.md` for the full gate sequence and triage order when a gate fails.

---

## Where Things Live

| Need                   | Location                  |
| ---------------------- | ------------------------- |
| System specification   | `docs/specs/core-spec.md` |
| Package specs          | `docs/specs/packages/`    |
| System architecture    | `docs/architecture/`      |
| Architecture decisions | `docs/decisions/`         |
| Security framework     | `docs/security/`          |
| CI/CD pipeline         | `docs/devops/ci-cd/`      |
| Operations runbooks    | `docs/devops/runbooks/`   |
| Sprint and roadmap     | `docs/agile/`             |
| Quality evidence       | `quality/`, `benchmarks/` |

---

## Reference

- [`safety-rules.md`](../workflows/safety-rules.md) — what requires human approval
- [`context-recovery.md`](./context-recovery.md) — how to recover agent context across sessions
- [`../../specs/core-spec.md`](../../specs/core-spec.md) — top-level system specification
- [`../../architecture/overview.md`](../../architecture/overview.md) — architecture overview
- [`../../devops/runbooks/quality-runbook.md`](../../devops/runbooks/quality-runbook.md) — full pre-commit gate sequence and triage
