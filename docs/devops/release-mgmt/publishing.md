---
title: "Package Publishing — gtcx-core"
status: "current"
date: "2026-05-27"
owner: "gtcx-core"
role: "protocol-architect"
agent_id: "agent://gtcx-core/2026-05-27/session-backfill"
trust_score: 60
autonomy_level: "permissioned"
tier: "standard"
tags: ["documentation", "devops"]
review_cycle: "on-change"
---

---
title: 'Publishing'
status: 'current'
date: '2026-05-17'
owner: 'frontier-infra-engineer'
role: 'frontier-infra-engineer'
tier: 'standard'
tags: ['docs', 'operations']
review_cycle: 'on-change'
---

# Package Publishing — gtcx-core

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Quality & Evidence Lead

`gtcx-core` is a library, not a service. There are no servers to deploy. "Deployment" means publishing versioned packages to npm and Cargo registries after all CI gates pass.

---

## Publishing Targets

| Registry  | Scope / Pattern | Packages                   |
| --------- | --------------- | -------------------------- |
| npm       | `@gtcx/*`       | All 18 TypeScript packages |
| crates.io | `gtcx-*`        | 6 Rust crates (as needed)  |

---

## Release Workflow

### 1. Changeset (developer)

When a package changes, the author creates a changeset:

```bash
pnpm changeset
```

This records which packages changed and the semver bump type (patch / minor / major). The `.changeset/` file is committed alongside the code change.

### 2. CI Gates (automated — required before publish)

All of the following must pass on `main`:

```bash
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test

cd rust
cargo test --workspace --lib
```

ZKP proof evidence (UAT gate, run on release):

```bash
cargo test -p gtcx-zkp --release -- --ignored
```

Native bindings smoke test (required for `@gtcx/crypto-native`):

```bash
pnpm --filter @gtcx/crypto-native test
```

### 3. Version Bump (Changesets bot / manual)

When changesets are accumulated on `main`, Changesets creates a "Version Packages" PR:

```bash
pnpm changeset version   # bumps versions, generates changelogs
```

Review the PR — verify semver correctness and changelog accuracy — then merge.

### 4. Publish (automated via CI after merge)

```bash
pnpm changeset publish   # publishes all changed packages to npm
```

The CI publish job runs only on `main` after the version PR merges and all gates pass.

---

## Release Checklist

Before merging a version PR:

- [ ] All CI checks green on `main`
- [ ] Changeset file reviewed — semver bump is correct
- [ ] CHANGELOG entries are accurate
- [ ] No security-sensitive changes without Cryptographic Security Engineer sign-off
- [ ] SBOM and provenance artifacts generated (for releases with crypto changes)
- [ ] UAT evidence log updated (`docs/agile/` sprint evidence)
- [ ] Release signoff from Quality & Evidence Lead

---

## Native Bindings (NAPI-RS)

`@gtcx/crypto-native` links Rust via NAPI-RS. Build targets:

| Platform  | Target triple               |
| --------- | --------------------------- |
| macOS ARM | `aarch64-apple-darwin`      |
| macOS x86 | `x86_64-apple-darwin`       |
| Linux x86 | `x86_64-unknown-linux-gnu`  |
| Linux ARM | `aarch64-unknown-linux-gnu` |

Pre-built binaries are included in the npm package. Rebuild locally:

```bash
cd packages/crypto-native
pnpm build
```

---

## Versioning Policy

| Bump  | Triggers                                                      |
| ----- | ------------------------------------------------------------- |
| patch | Bug fix with no API change                                    |
| minor | New exported function, type, or module — backwards-compatible |
| major | Breaking change to any exported API, type, or module contract |

Packages in `@gtcx/*` are independently versioned. A change to `@gtcx/crypto` does not force a version bump on `@gtcx/sync`.

---

## References

- `docs/devops/ci-cd/ci-cd.md` — CI/CD pipeline
- `docs/devops/runbooks/quality-runbook.md` — quality runbook
- `docs/decisions/013-api-baseline-and-performance-budget-gates.md`
- `docs/agents/workflows/tasks/cut-release.md` — agent task: cut a release
