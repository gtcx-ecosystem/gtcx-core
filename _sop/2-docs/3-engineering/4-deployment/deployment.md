# Package Publishing — gtcx-core

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
- [ ] UAT evidence log updated (`_sop/3-agile/` sprint evidence)
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

- `_sop/2-docs/4-devops/` — CI/CD pipeline, environments, quality runbook
- `_sop/2-docs/3-engineering/6-decisions/013-api-baseline-and-performance-budget-gates.md`
- `_sop/1-agents/6-tasks/cut-release.md` — agent task: cut a release
