# Developer Setup

Canonical setup path for `gtcx-core` development.

## Prerequisites

- Node.js 20+
- pnpm 9+
- Rust toolchain (rustup)

## Install

```bash
pnpm install
```

## Rust Setup (Optional)

```bash
rustup update
cd rust
cargo build
```

## Common Commands

```bash
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
```

## Repo Provisioning (External)

Repo provisioning scripts live in a separate sibling repo and are intentionally **not** vendored here.

- Repo: `repo-provisioning`
- Location (local): `/Users/amanianai/Sites/gtcx-ecosystem/repo-provisioning`

Use that repo for environment bootstrapping or workspace provisioning, then return to `gtcx-core` for normal dev and CI workflows.
