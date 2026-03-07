# Codebase Orientation — gtcx-core

Session-start protocol for any agent or team member entering this repo.

## What This Repo Is

`gtcx-core` is the shared cryptographic and protocol foundation for the GTCX ecosystem. It exports 18 TypeScript packages (`@gtcx/*`) and 6 Rust crates (`gtcx-*`) consumed by every downstream GTCX repo. It has no product surface, no users, and no UI. Its output is primitives — signing, identity, verification, sync, networking, ZKP.

Downstream repos depend on this. Breaking changes here break everything.

## Read Before Touching Code

In this order:

1. `SOP/2-docs/2-specs/core-spec.md` — scope, NFRs, design principles
2. `SOP/2-docs/1-architecture/overview.md` — layer map and trust boundaries
3. `SOP/2-docs/1-architecture/decisions/` — all 13 ADRs (understand why things are the way they are)
4. `SOP/2-docs/2-specs/packages/` — the package you are working in
5. `SOP/1-agents/safety-rules.md` — before making any change

## Package Structure

```
packages/           TypeScript packages (@gtcx/* scope)
rust/               Rust crates (gtcx-* scope)
tools/              Quality gate scripts and automation
tests/integration/  Cross-package integration tests
benchmarks/         Performance budgets and results
quality/            API baselines and evidence artifacts
```

## Critical Dependency Rules

- `@gtcx/crypto` has no hard internal dependencies — keep it that way
- `@gtcx/identity`, `@gtcx/security`, `@gtcx/verification` build on `@gtcx/crypto`
- `@gtcx/domain` is the foundational domain layer; `@gtcx/services` builds on it
- Circular dependencies are disallowed — enforced by `pnpm architecture:check`
- Any new dependency must be declared; phantom dependencies are a CI failure

## Security-Sensitive Packages

These packages require the Cryptographic Security Engineer role and human review before any change ships:

- `@gtcx/crypto` — signing, hashing, ZKP engine
- `@gtcx/crypto-native` — native binding loader
- `@gtcx/security` — auth, validation, secure storage
- `@gtcx/verification` — certificates, proof bundles
- `@gtcx/identity` — DID, credentials, key management
- `rust/gtcx-crypto` — Ed25519, SHA-256, Blake3
- `rust/gtcx-zkp` — Groth16, Bulletproofs, Schnorr

## Before Any Commit

```bash
pnpm architecture:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

See `SOP/2-docs/3-engineering/guides/build-and-test.md` for the full gate sequence.

## Where Things Live

| Need                   | Location                                                          |
| ---------------------- | ----------------------------------------------------------------- |
| System specs           | `SOP/2-docs/2-specs/`                                             |
| Package specs          | `SOP/2-docs/2-specs/packages/`                                    |
| Architecture decisions | `SOP/2-docs/1-architecture/decisions/`                            |
| Security framework     | `SOP/2-docs/3-engineering/security/`                              |
| CI/release process     | `SOP/2-docs/3-engineering/devops/` and `SOP/2-docs/4-operations/` |
| Sprint and roadmap     | `SOP/3-agile/`                                                    |
| Quality evidence       | `quality/`, `benchmarks/`                                         |
