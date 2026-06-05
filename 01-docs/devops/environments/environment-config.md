---
title: 'Development Environment — gtcx-core'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'standard'
tags: ['documentation', 'devops']
review_cycle: 'on-change'
---

---

title: 'Environment Config'
status: 'current'
date: '2026-05-17'
owner: 'frontier-infra-engineer'
role: 'frontier-infra-engineer'
tier: 'standard'
tags: ['docs', 'operations']
review_cycle: 'on-change'

---

# Development Environment — gtcx-core

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Quality & Evidence Lead

`gtcx-core` is a package library. There are no servers, staging environments, or production deployments. "Environments" means: local developer workstations and the GitHub Actions CI environment.

---

## Local Development

### Prerequisites

| Requirement    | Version | Install                                  |
| -------------- | ------- | ---------------------------------------- |
| Node.js        | 20 LTS  | `nvm install 20` or direct download      |
| pnpm           | 9+      | `npm install -g pnpm`                    |
| Rust toolchain | 1.91    | `rustup toolchain install 1.91-<target>` |
| Cargo          | 1.91    | Included with rustup                     |

### First-Time Setup

```bash
# Clone repo
git clone git@github.com:gtcx-ecosystem/gtcx-core.git
cd gtcx-core

# Install TypeScript dependencies
pnpm install

# Build Rust crates
cd rust && cargo build && cd ..

# Verify everything works
pnpm lint && pnpm typecheck && pnpm test
cd rust && cargo test --workspace --lib && cd ..
```

### Optional: Native Bindings

Rebuild the NAPI-RS native binding for `@gtcx/crypto-native`:

```bash
cd 03-platform/packages/crypto-native
pnpm build
```

Requires the Rust toolchain. Pre-built binaries are bundled in the npm package for consumers — rebuilding is only needed during local development of the native package itself.

---

## CI Environment (GitHub Actions)

The CI environment is defined in `.github/workflows/`. All gates run in GitHub Actions on Ubuntu (latest).

| Tool        | Version      | Notes                                                  |
| ----------- | ------------ | ------------------------------------------------------ |
| Node.js     | 20 LTS       | `actions/setup-node`                                   |
| pnpm        | 9+           | `pnpm/action-setup`                                    |
| Rust        | 1.91         | `dtolnay/rust-toolchain@stable` with `toolchain: 1.91` |
| Cargo cache | GitHub cache | `Swatinem/rust-cache`                                  |

### Native Binding Matrix

`@gtcx/crypto-native` is built in CI across all supported targets:

| Target triple               | Platform            |
| --------------------------- | ------------------- |
| `x86_64-unknown-linux-gnu`  | Linux (primary)     |
| `aarch64-unknown-linux-gnu` | Linux ARM           |
| `x86_64-apple-darwin`       | macOS Intel         |
| `aarch64-apple-darwin`      | macOS Apple Silicon |

---

## Environment Variables

No runtime environment variables are required to build or test the library. All configuration for tests is in `vitest.config.ts` and `Cargo.toml`.

One flag used in consuming apps (not this repo):

| Variable              | Values     | Effect                                        |
| --------------------- | ---------- | --------------------------------------------- |
| `GTCX_REQUIRE_NATIVE` | `true` / — | Fail hard if native module unavailable (prod) |

---

## References

- `01-docs/stack/tech-stack.md` — full tech stack
- `01-docs/devops/ci-cd/ci-cd.md` — CI gate sequence
- `_archive/01-docs/engineering/dev-setup.md` — original dev setup doc (legacy reference)
