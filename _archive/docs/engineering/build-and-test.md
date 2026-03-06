# Build and Test

Canonical build and test commands for `gtcx-core`.

## TypeScript Packages

```bash
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm build
```

## Rust Crates

```bash
cd rust
cargo test --workspace --lib
```

Heavy proofs (UAT evidence):

```bash
cargo test -p gtcx-zkp --release -- --ignored
```

## Quality Gates

See `docs/operations/quality-runbook.md` for the full gate sequence.
