# Developer Setup

Canonical setup path for `gtcx-core` development.

## Prerequisites

| Tool           | Version                    |
| -------------- | -------------------------- |
| Node.js        | 20+                        |
| pnpm           | 9+                         |
| Rust toolchain | Latest stable (via rustup) |

## Install

```bash
pnpm install
```

## Rust Setup (Optional)

Required only for native crypto builds or ZKP work.

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
pnpm build
```

## Repo Provisioning

Repo provisioning scripts live in a separate sibling repo and are intentionally not vendored here.

- Repo: `repo-provisioning`
- Location (local): `/Users/amanianai/Sites/gtcx-ecosystem/repo-provisioning`

Use that repo for environment bootstrapping or workspace provisioning, then return to `gtcx-core` for normal dev and CI workflows.

## References

- `SOP/2-docs/3-engineering/guides/build-and-test.md`
- `SOP/2-docs/1-architecture/decisions/003-pnpm-workspace-strict-deps.md`
