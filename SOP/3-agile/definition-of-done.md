# Definition of Done (gtcx-core)

## User Story DoD

- Feature implemented per acceptance criteria
- Code reviewed by at least one peer; all comments addressed
- Unit tests written and passing
- Integration tests written and passing
- CI gates pass (lint, typecheck, test, build)
- Affected `SOP/2-docs/` documentation updated
- UAT scenario documented if applicable

## Sprint DoD

All user stories in the sprint are done.

- Sprint goal achieved
- UAT evidence logged in `SOP/3-agile/uat-evidence-log.md`
- Quality gates green (`pnpm architecture:check`, `pnpm api:check`, `pnpm perf:check-budgets`)
- Retrospective outcomes captured

## Release DoD

- All pre-release gates pass (see `SOP/2-docs/4-operations/compliance/release-checklist.md`)
- Heavy ZKP workflow completed within last 7 days
- UAT evidence log updated
- CODEOWNERS approval obtained
- Release notes updated
- `GTCX_REQUIRE_NATIVE=1` enforced in production environment

## Cryptographic Work DoD

All cryptographic code must additionally satisfy:

1. **Audited libraries only** — No custom implementations of cryptographic primitives. Use only audited crates (`ed25519-dalek`, `blake3`, `ark-*`, etc.)
2. **Zeroizing private keys** — All private key material wrapped in `Zeroizing<T>` for automatic memory clearing on drop.
3. **No unsafe code** — `#![deny(unsafe_code)]` enforced at the crate level. Any exception requires written justification and security review.
4. **Constant-time comparison** — All secret comparisons use constant-time operations (`subtle::ConstantTimeEq` or equivalent).
5. **Standard test vectors** — Unit tests include test vectors from relevant RFCs, NIST publications, or library reference implementations.
6. **Fuzz testing** — All parsers and deserialization routines have `cargo-fuzz` targets with minimum 10M iterations before initial merge.
7. **Security review** — Designated security reviewer must approve all PRs introducing or modifying cryptographic operations.

### Recommended for Cryptographic Work

- Property-based testing with `proptest` for algebraic invariants
- Benchmarks for all hot-path operations (`criterion`)
- Threat model assumptions documented in module-level doc comments

## References

- `SOP/2-docs/4-operations/compliance/release-checklist.md`
- `SOP/2-docs/3-engineering/testing/quality-standards.md`
- `SOP/2-docs/3-engineering/security/security-framework.md`
