# Release Checklist

Canonical release checklist for gtcx-core.

## Pre-Release

- [ ] `pnpm lint` passes
- [ ] `pnpm typecheck` passes
- [ ] `pnpm test` passes
- [ ] Rust tests pass (`cargo test -p gtcx-zkp`)
- [ ] UAT evidence log updated (if applicable)
- [ ] Benchmarks updated if performance-sensitive changes were made

## Release

- [ ] Version changes validated
- [ ] Release notes prepared
- [ ] CI required checks green

## Post-Release

- [ ] Verify published artifacts
- [ ] Update `docs/quality` evidence references if needed
- [ ] Communicate release summary to stakeholders
