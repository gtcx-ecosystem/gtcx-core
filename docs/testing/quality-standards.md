# Quality Standards — gtcx-core

The enterprise quality standard for `gtcx-core`. Authoritative source for required CI gates, evidence requirements, and audit cadence.

---

## Mandatory CI Gates (Every PR)

All gates must pass on every pull request. Zero exceptions, zero bypasses:

| Gate                         | Command                                                                                            | Blocks   |
| ---------------------------- | -------------------------------------------------------------------------------------------------- | -------- |
| Architecture boundaries      | `pnpm architecture:check`                                                                          | PR merge |
| Governance policy            | `pnpm quality:governance:check`                                                                    | PR merge |
| Lint                         | `pnpm lint`                                                                                        | PR merge |
| Format                       | `pnpm format:check`                                                                                | PR merge |
| Type check                   | `pnpm typecheck`                                                                                   | PR merge |
| Unit/integration tests       | `pnpm test`                                                                                        | PR merge |
| Coverage (critical packages) | `pnpm test:coverage:critical`                                                                      | PR merge |
| Build                        | `pnpm build`                                                                                       | PR merge |
| API surface                  | `pnpm api:check`                                                                                   | PR merge |
| KPI collection               | `pnpm quality:kpi:collect`                                                                         | PR merge |
| Provenance                   | `pnpm provenance:generate`                                                                         | PR merge |
| GA evidence freshness        | `pnpm release:ga:evidence:check`                                                                   | PR merge |
| Docs + link check            | `pnpm docs && pnpm docs:check-links`                                                               | PR merge |
| Threat matrix                | `pnpm security:threat-matrix`                                                                      | PR merge |
| Performance budgets          | `PERF_ENFORCE_TREND=true pnpm perf:check-budgets`                                                  | PR merge |
| Rust quality                 | `cargo fmt --check && cargo clippy -D warnings && cargo test --workspace --lib`                    | PR merge |
| Rust Fuzzing                 | `cd rust/gtcx-crypto && cargo +nightly fuzz run fuzz_signature_verification -- -max_total_time=60` | PR merge |
| TS Property Testing          | `cd packages/crypto && pnpm test tests/property-based.test.ts`                                     | PR merge |

---

## Heavy Proof Validation (Scheduled)

ZKP heavy proofs run on schedule via `.github/workflows/zkp-heavy.yml`:

```bash
cargo test -p gtcx-zkp --release -- --ignored
```

Must complete successfully within 7 days before any release. Failures require a remediation ticket before release proceeds.

---

## PR Evidence Requirements

Each PR description must include:

- Test results (unit/integration pass/fail summary)
- Performance budget check status
- API surface check status (if public exports changed)
- Any security or governance exceptions (with justification and ticket ID)

---

## Production Requirements

- Native crypto bindings must be used in production: `GTCX_REQUIRE_NATIVE=true`
- TypeScript `HashCommitmentZkpEngine` is acceptable only in dev/test environments
- JS fallback for signing is acceptable only in dev/test

---

## Audit Cadence

- **Weekly:** verify heavy ZKP workflow completes successfully
- **Monthly:** re-run 10/10 quality audit review and update audit report
- **Per release:** full gate sequence documented in `docs/devops/release-mgmt/release-checklist.md`

---

## Governance

Changes to this standard require CODEOWNERS approval and must include evidence of gate impact analysis. Changes must be reflected in `pnpm quality:governance:check` and the threat control matrix.

---

## Reference

- [`docs/devops/runbooks/quality-runbook.md`](../devops/runbooks/quality-runbook.md) — gate sequence and triage order
- [`docs/devops/release-mgmt/release-checklist.md`](../devops/release-mgmt/release-checklist.md) — release checklist
- [`docs/decisions/011-architecture-boundary-enforcement.md`](../decisions/011-architecture-boundary-enforcement.md) — ADR-011
- [`docs/decisions/013-api-baseline-and-performance-budget-gates.md`](../decisions/013-api-baseline-and-performance-budget-gates.md) — ADR-013
