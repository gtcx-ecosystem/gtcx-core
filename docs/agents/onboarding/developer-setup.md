# Developer Setup — gtcx-core

**Last reviewed:** 2026-05-06

---

## Prerequisites

| Tool    | Version    | Install                                                           |
| ------- | ---------- | ----------------------------------------------------------------- |
| Node.js | >= 20.0.0  | https://nodejs.org or `nvm install 20`                            |
| pnpm    | >= 9.15.0  | `npm install -g pnpm@9.15.0`                                      |
| Rust    | >= 1.75.0  | `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \| sh` |
| Git     | any recent | system package manager                                            |

Rust is required to build the 6 workspace Rust crates (`gtcx-crypto`, `gtcx-zkp`, `gtcx-consensus`, `gtcx-network`, `gtcx-edge`, `gtcx-node`). TypeScript packages build without it, but native bindings will fall back to the JS implementation unless native mode is required.

---

## Clone & Install

```bash
# 1. Clone the repository
git clone https://github.com/gtcx-ecosystem/gtcx-core.git
cd gtcx-core

# 2. Install all workspace dependencies
pnpm install

# 3. Build all packages (TypeScript + Rust native bindings)
pnpm build
```

No `.env` file is required. `gtcx-core` is a library — it has no runtime server, no database, and no environment configuration.

---

## Running Tests

```bash
# Run all tests across the workspace
pnpm test

# Run tests for a single package
pnpm --filter @gtcx/crypto test

# Run tests with coverage for critical packages
pnpm test:coverage:critical

# Run Rust tests across all crates
cargo test --workspace --lib
```

---

## Linting and Type Checking

```bash
# Lint all packages
pnpm lint

# Type check all packages
pnpm typecheck

# Check architecture boundaries (enforced in CI)
pnpm architecture:check

# Check API surface against baseline
pnpm api:check
```

---

## Rust Crates

```bash
# Run Rust clippy (mirrors CI gate)
cargo clippy -D warnings

# Run all Rust tests
cargo test --workspace --lib

# Run Rust benchmarks
pnpm bench

# Build Rust documentation
pnpm docs:rust
```

---

## Native Bindings

The native binding layer (`@gtcx/crypto-native`) uses NAPI-RS to expose Rust crypto operations to Node.js.

To require native bindings (mirrors production behavior):

```bash
GTCX_REQUIRE_NATIVE=true pnpm test
```

Without this flag, the TypeScript fallback engine is used. In production, `GTCX_REQUIRE_NATIVE=true` must always be set — the system will hard-fail if the native module is unavailable.

---

## Common Issues

| Problem                              | Cause                                            | Solution                                                         |
| ------------------------------------ | ------------------------------------------------ | ---------------------------------------------------------------- |
| `cargo: command not found`           | Rust not installed or not on PATH                | Run `source $HOME/.cargo/env` or restart terminal                |
| NAPI-RS build fails                  | Rust version too old or missing target           | `rustup update stable && rustup target add aarch64-apple-darwin` |
| `pnpm build` fails on a specific pkg | Dependency not built yet (Turborepo order issue) | Run `pnpm build` again — Turborepo caches intermediate builds    |
| `pnpm architecture:check` fails      | Circular or boundary-crossing import added       | Check `tools/check-package-boundaries.mjs` and fix the import    |
| Tests fail with `Cannot find module` | Package not built before test run                | `pnpm build` then `pnpm test`                                    |

---

## IDE Setup

**Recommended editor:** VS Code

**Extensions:**

- `rust-analyzer` — Rust language server, type hints, and inline errors
- `dbaeumer.vscode-eslint` — ESLint integration
- `esbenp.prettier-vscode` — Prettier formatting
- `ms-vscode.vscode-typescript-next` — Enhanced TypeScript support

**Settings:**

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[rust]": {
    "editor.defaultFormatter": "rust-lang.rust-analyzer"
  }
}
```

---

## Verification

Confirm your setup is working by checking each item:

- [ ] `pnpm install` completes without errors
- [ ] `pnpm build` completes — all public packages, shared config packages, and Rust crates build
- [ ] `pnpm test` passes — all unit tests green
- [ ] `pnpm typecheck` passes — zero type errors
- [ ] `pnpm lint` passes — zero lint errors
- [ ] `pnpm architecture:check` passes — no boundary violations
- [ ] `cargo clippy -D warnings` passes — no Rust warnings treated as errors
- [ ] `cargo test --workspace --lib` passes — all Rust unit tests green
