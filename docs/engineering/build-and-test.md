# Build and Test

Canonical build and test commands for gtcx-core.

## TypeScript Packages

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Rust Crates

```bash
cargo test -p gtcx-zkp
```

Heavy proofs (UAT evidence):

```bash
cargo test -p gtcx-zkp --release -- --ignored
```

## Quality Gates

Run the quality gate sequence before release:

```bash
pnpm lint && pnpm typecheck && pnpm test
```
