# Developer Setup

This guide is the canonical setup path for gtcx-core development.

## Prerequisites

- Node.js (LTS)
- pnpm
- Rust toolchain (rustup)

## Install

```bash
pnpm install
```

## Rust Setup (Optional, required for native builds)

```bash
rustup update
```

## Common Commands

```bash
pnpm lint
pnpm typecheck
pnpm test
```

Rust tests:

```bash
cargo test -p gtcx-zkp
```
