# Quality Standards

The 10/10 enterprise quality standard for `gtcx-core`. This is the authoritative source for required gates, evidence, and audit cadence.

## Mandatory CI Gates (Every PR)

| Gate                         | Command                                                                         |
| ---------------------------- | ------------------------------------------------------------------------------- |
| Lint                         | `pnpm lint`                                                                     |
| Format                       | `pnpm format:check`                                                             |
| Type check                   | `pnpm typecheck`                                                                |
| Unit/integration tests       | `pnpm test`                                                                     |
| Coverage (critical packages) | `pnpm test:coverage:critical`                                                   |
| Build                        | `pnpm build`                                                                    |
| Architecture boundaries      | `pnpm architecture:check`                                                       |
| Governance policy            | `pnpm quality:governance:check`                                                 |
| Threat matrix validation     | `pnpm security:threat-matrix`                                                   |
| Performance budgets          | `PERF_ENFORCE_TREND=true pnpm perf:check-budgets`                               |
| API surface                  | `pnpm api:check`                                                                |
| Provenance                   | `pnpm provenance:generate`                                                      |
| Docs + links                 | `pnpm docs && pnpm docs:check-links`                                            |
| Rust quality                 | `cargo fmt --check && cargo clippy -D warnings && cargo test --workspace --lib` |

## Heavy Proof Validation (Scheduled)

ZKP heavy proofs run on schedule via `.github/workflows/zkp-heavy.yml`. Failures require a remediation ticket before any release.

## PR Evidence Requirements

Each PR description must include:

- Test results (unit/integration)
- Perf budget check status
- API surface check status (if applicable)
- Any security or governance exceptions (with ticket ID)

## Production Requirements

- Native crypto bindings must be used in production (`GTCX_REQUIRE_NATIVE=1`).
- JS fallback is acceptable only for dev/test environments.

## Audit Cadence

- Monthly: re-run 10/10 audit review and update audit report.
- Weekly: verify heavy ZKP workflow completes successfully.

## Governance

Changes to this standard require CODEOWNERS approval and must include evidence of gate impact.

## References

- `SOP/2-docs/4-operations/compliance/enterprise-quality-standard.md`
- `SOP/2-docs/4-operations/compliance/governance-and-evidence.md`
- `SOP/2-docs/4-operations/runbooks/quality-runbook.md`
- `SOP/2-docs/1-architecture/decisions/011-architecture-boundary-enforcement.md`
- `SOP/2-docs/1-architecture/decisions/013-api-baseline-and-performance-budget-gates.md`
