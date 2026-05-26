# CI/CD Pipelines

Pipeline configuration, deployment workflows, and build standards for **gtcx-core**.

## Workflow files

All CI/CD workflows live in [`.github/workflows/`](../../../.github/workflows/):

| Workflow                | File                                                                            | Trigger                                                         | Purpose                               |
| ----------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------- |
| **CI**                  | [`ci.yml`](../../../.github/workflows/ci.yml)                                   | `push` to `main`, `pull_request`, `workflow_dispatch`           | Main validation pipeline              |
| **Security Scan**       | [`security-scan.yml`](../../../.github/workflows/security-scan.yml)             | `push`, `pull_request`, `schedule` (daily), `workflow_dispatch` | Secret scanning and dependency audits |
| **Release**             | [`release.yml`](../../../.github/workflows/release.yml)                         | `push` to `main`, `workflow_dispatch`                           | Build, test, and publish packages     |
| **Crypto Native CI**    | [`crypto-native-ci.yml`](../../../.github/workflows/crypto-native-ci.yml)       | `push`, `pull_request`, `schedule`, `workflow_dispatch`         | Cross-platform native binding builds  |
| **ZKP Heavy**           | [`zkp-heavy.yml`](../../../.github/workflows/zkp-heavy.yml)                     | `schedule` (weekly), `workflow_dispatch`                        | Long-running Groth16 proof benchmarks |
| **Rust Release**        | [`rust-release.yml`](../../../.github/workflows/rust-release.yml)               | Tags `rust-v*`                                                  | Publish Rust crates to crates.io      |
| **AI CODEOWNER Review** | [`ai-codeowner-review.yml`](../../../.github/workflows/ai-codeowner-review.yml) | `pull_request`                                                  | Automated dual-AI review comments     |

## CI pipeline stages

The [`ci.yml`](../../../.github/workflows/ci.yml) workflow runs the following stages in order:

```
setup → audit → architecture → governance → threat-matrix
  → perf-budget → lint → format-check → typecheck
  → native-build → test → coverage → build
  → api-surface → docs → provenance → kpi-export
```

### Stage details

1. **Setup** — checkout, install Node.js 22, enable Corepack/pnpm, install dependencies.
2. **Audit** — `pnpm audit --audit-level=high`, crypto dependency content-pin check, secret scan (`pnpm security:secret-scan`).
3. **Architecture & Governance** — boundary check (`pnpm architecture:check`), governance policy validation, threat matrix validation.
4. **Performance budget** — update benchmark history, enforce performance trends (`PERF_ENFORCE_TREND=true`).
5. **Lint & Format** — ESLint (`pnpm lint`) and Prettier format check (`pnpm format:check`).
6. **Type check** — TypeScript (`pnpm typecheck`).
7. **Native build** — build Rust crypto bindings (`pnpm --filter @gtcx/crypto-native run build:native`).
8. **Test** — run all tests (`pnpm test`).
9. **Coverage** — critical package coverage gate (`pnpm test:coverage:critical`).
10. **Build** — build all packages (`pnpm build`).
11. **API surface** — baseline check against PR base or previous commit (`pnpm api:check`).
12. **Docs** — generate API docs, validate markdown links, validate docs frontmatter.
13. **Provenance** — generate provenance manifest (`pnpm provenance:generate`).
14. **KPI export** — collect CI KPI history and export metrics.

### Rust CI job

`ci.yml` also includes a `rust` job that runs:

- `cargo fmt --all -- --check`
- `cargo clippy --workspace --all-targets -- -D warnings`
- `#![deny(unsafe_code)]` verification
- `cargo-deny check` and `cargo audit`
- `cargo test --workspace --lib`
- Feature-specific tests: FIPS, PKCS#11, Cloud KMS

### Security job

A separate `security` job runs:

- Trivy filesystem vulnerability scan (CRITICAL/HIGH)
- SBOM generation (CycloneDX)
- CodeQL analysis (JavaScript/TypeScript)

## Release pipeline

[`release.yml`](../../../.github/workflows/release.yml) re-runs the full CI validation sequence, then:

1. Publishes npm packages via `pnpm release` (on `workflow_dispatch` only).
2. Publishes Rust crates to crates.io in dependency order (triggered by `rust-v*` tags via `rust-release.yml`).

## Concurrency and cancellation

All workflows use concurrency groups keyed by `workflow-${{ github.ref }}` to prevent redundant runs. Pull-request workflows cancel in-progress runs when new commits are pushed.

## Local validation

Before pushing, run the same checks locally:

```bash
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm build
```

For package publishing, see [`docs/devops/release-mgmt/publishing.md`](../release-mgmt/publishing.md).

## What belongs here

- CI/CD pipeline definitions and configuration
- Deployment workflow documentation
- Build standards and artifact management
- Environment promotion procedures

## What does NOT belong here

- Environment topology. See `../environments/`.
- Incident response runbooks. See `../runbooks/`.
- QA sign-off criteria. See `../qa/`.
