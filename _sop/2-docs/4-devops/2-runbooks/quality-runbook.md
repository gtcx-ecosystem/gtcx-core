# Quality Gates Runbook — gtcx-core

Required quality gates and triage order for `gtcx-core`. Run this sequence before every release and after any CI gate failure.

---

## TypeScript / pnpm Gate Sequence

Run in order. Do not skip or reorder. Do not proceed past a failing gate.

```bash
pnpm architecture:check          # Dependency graph + circular dep enforcement
pnpm quality:governance:check    # Governance artifacts and CODEOWNERS validity
pnpm lint                        # ESLint across all TypeScript packages
pnpm format:check                # Prettier format check
pnpm typecheck                   # TypeScript strict mode — all 18 packages
pnpm test                        # Full test suite (Vitest)
pnpm test:coverage:critical      # Critical path coverage thresholds
pnpm build                       # All 18 TypeScript packages and 6 Rust crates
pnpm api:check                   # API surface baseline comparison
pnpm quality:kpi:collect         # KPI metrics collection
pnpm quality:kpi:export          # KPI metrics export
pnpm provenance:generate         # Provenance manifest generation
pnpm docs                        # TypeDoc generation
pnpm docs:check-links            # Broken link check in generated docs
pnpm security:threat-matrix      # Threat control matrix validation
pnpm perf:update-history         # Update benchmark history
pnpm perf:check-budgets          # Performance budget enforcement
```

---

## Rust Gate Sequence

```bash
cd rust
cargo fmt --all -- --check
cargo clippy --workspace --all-targets -- -D warnings
cargo test --workspace --lib
```

---

## Heavy Proof Validation (Scheduled)

```bash
cargo test -p gtcx-zkp --release -- --ignored
```

Must complete successfully within 7 days before any release. Failures require a remediation ticket before release proceeds.

---

## Failure Triage Order

Resolve failures in this order — fix each before moving to the next:

1. `architecture:check` — boundary violations make all subsequent results unreliable
2. `typecheck` — type errors indicate structural problems
3. `lint` — surface errors before running tests
4. `test` / `test:coverage:critical` — test failures after clean type and lint
5. `build` — build failures after tests pass
6. `api:check` — API drift after build
7. `perf:check-budgets` — performance regression after build
8. `security:threat-matrix` — escalate to Cryptographic Security Engineer immediately
9. `quality:governance:check` — update documentation or governance artifacts

---

## Evidence Artifacts

| Artifact             | Path                                 |
| -------------------- | ------------------------------------ |
| API surface report   | `quality/api-surface-report.json`    |
| API surface baseline | `quality/api-surface-baseline.json`  |
| KPI metrics          | `quality/kpi-metrics.json`           |
| Performance history  | `benchmarks/history.json`            |
| Performance report   | `benchmarks/performance-report.json` |
| Provenance manifest  | `artifacts/provenance-manifest.json` |

---

## Notes

- For release readiness, also run `pnpm check:dist`.
- Update `quality/api-surface-baseline.json` only after human approval via `pnpm api:update-baseline`.
- Do not raise performance budgets to unblock a failing gate — investigate the regression.
- Gate 8 (`security:threat-matrix`) failures must be escalated to the Cryptographic Security Engineer before resolution.

---

## Reference

- [`_sop/2-docs/4-devops/7-release-mgmt/release-checklist.md`](../7-release-mgmt/release-checklist.md) — release gate checklist
- [`_sop/2-docs/5-specs/6-testing/quality-standards.md`](../../5-specs/6-testing/quality-standards.md) — test coverage standards
- [`_sop/1-agents/2-roles/quality-evidence-lead.md`](../../../1-agents/2-roles/quality-evidence-lead.md) — role that owns this runbook
- [`_sop/1-agents/4-workflows/tasks/investigate-ci-failure.md`](../../../1-agents/4-workflows/tasks/investigate-ci-failure.md) — investigation protocol
