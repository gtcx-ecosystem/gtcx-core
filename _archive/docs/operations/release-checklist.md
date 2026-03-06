# Release Checklist

**Updated**: 2026-02-21

Canonical release checklist for `gtcx-core`.

## Pre‑Release

- [ ] `pnpm lint`
- [ ] `pnpm format:check`
- [ ] `pnpm typecheck`
- [ ] `pnpm test`
- [ ] `pnpm test:coverage:critical`
- [ ] `pnpm build`
- [ ] `pnpm api:check`
- [ ] `pnpm docs` + `pnpm docs:check-links`
- [ ] `pnpm security:threat-matrix`
- [ ] `pnpm perf:update-history` + `pnpm perf:check-budgets`
- [ ] Rust quality gates (`cargo fmt`, `cargo clippy`, `cargo test --workspace --lib`)
- [ ] ZKP heavy proofs (scheduled or run): `cargo test -p gtcx-zkp --release -- --ignored`
- [ ] UAT evidence log updated if applicable

## Release

- [ ] Version changes validated
- [ ] Release notes prepared
- [ ] CI required checks green

## Post‑Release

- [ ] Verify published artifacts
- [ ] Update `docs/quality` evidence references if needed
- [ ] Communicate release summary to stakeholders
