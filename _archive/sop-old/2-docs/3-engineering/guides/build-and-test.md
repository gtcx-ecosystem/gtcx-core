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

Standard tests (fast):

```bash
cd rust
cargo test --workspace --lib
```

Heavy ZKP proof tests (UAT evidence, slow):

```bash
cargo test -p gtcx-zkp --release -- --ignored
```

## Quality Gates

Full gate sequence before release:

```bash
pnpm architecture:check      # boundary enforcement (ADR-011)
pnpm api:check               # API surface baseline (ADR-013)
pnpm perf:check-budgets      # performance budgets (ADR-013)
```

To update baselines after an intentional API change:

```bash
pnpm api:update-baseline
```

## Native Binding Smoke Test

```bash
GTCX_CRYPTO_NATIVE_PATH=rust/gtcx-node/target/release/gtcx_node.node \
GTCX_REQUIRE_NATIVE=1 \
pnpm test --filter @gtcx/crypto-native
```

## References

- `SOP/2-docs/4-operations/runbooks/quality-runbook.md`
- `SOP/2-docs/1-architecture/decisions/011-architecture-boundary-enforcement.md`
- `SOP/2-docs/1-architecture/decisions/013-api-baseline-and-performance-budget-gates.md`
