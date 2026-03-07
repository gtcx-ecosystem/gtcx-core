# Codebase Orientation — gtcx-core

Session-start protocol for any agent or contributor entering this repo.

---

## What This Repo Is

`gtcx-core` is the shared cryptographic and protocol foundation for the GTCX ecosystem. It exports 18 TypeScript packages (`@gtcx/*`) and 6 Rust crates (`gtcx-*`) consumed by every downstream GTCX repo. It has no product surface, no UI, and no users. Its output is primitives — signing, identity, verification, sync, networking, and ZKP.

Downstream repos depend on this. Breaking changes here break everything.

---

## Read Before Touching Code

In this order — no exceptions:

1. `_sop/2-docs/5-specs/4-backend/core-spec.md` — scope, NFRs, design principles
2. `_sop/2-docs/3-engineering/2-system-design/overview.md` — layer map and trust boundaries
3. `_sop/2-docs/3-engineering/6-decisions/` — all ADRs (understand why things are the way they are)
4. `_sop/2-docs/5-specs/4-backend/packages/` — spec for the package you are working in
5. `_sop/1-agents/4-workflows/safety-rules.md` — before making any change

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

See `_sop/2-docs/4-devops/2-runbooks/quality-runbook.md` for the full gate sequence and triage order when a gate fails.

---

## Where Things Live

| Need                   | Location                                     |
| ---------------------- | -------------------------------------------- |
| System specification   | `_sop/2-docs/5-specs/4-backend/core-spec.md` |
| Package specs          | `_sop/2-docs/5-specs/4-backend/packages/`    |
| System architecture    | `_sop/2-docs/3-engineering/2-system-design/` |
| Architecture decisions | `_sop/2-docs/3-engineering/6-decisions/`     |
| Security framework     | `_sop/2-docs/3-engineering/7-security/`      |
| CI/CD pipeline         | `_sop/2-docs/4-devops/3-ci-cd-pipelines/`    |
| Operations runbooks    | `_sop/2-docs/4-devops/2-runbooks/`           |
| Sprint and roadmap     | `_sop/3-agile/`                              |
| Quality evidence       | `quality/`, `benchmarks/`                    |

---

## Reference

- [`safety-rules.md`](../4-workflows/safety-rules.md) — what requires human approval
- [`context-recovery.md`](./context-recovery.md) — how to recover agent context across sessions
- [`core-spec.md`](../../2-docs/5-specs/4-backend/core-spec.md) — top-level system specification
- [`overview.md`](../../2-docs/3-engineering/2-system-design/overview.md) — architecture overview
- [`quality-runbook.md`](../../2-docs/4-devops/2-runbooks/quality-runbook.md) — full pre-commit gate sequence and triage
