# Observability & Quality Metrics — gtcx-core

> gtcx-core is a library with no runtime service. Observability means tracking library health: build reliability, test coverage, API surface stability, performance budgets, and security posture.

---

## 1. Quality KPI Framework

### North Star Metric

> **Zero regressions shipped to consumers** — no breaking API change, coverage drop, performance regression, or security gap reaches a published version without human review and explicit approval.

### Tier 1 — Release Health

Reviewed before every release.

| Metric                    | Definition                                                   | Target               | Gate command                          |
| ------------------------- | ------------------------------------------------------------ | -------------------- | ------------------------------------- |
| API surface stability     | No unreviewed changes to exported symbols                    | 0 unreviewed         | `pnpm api:check`                      |
| Build success rate        | All 18 packages + 6 crates build cleanly                     | 100%                 | `pnpm build`                          |
| Test pass rate            | All Vitest and cargo tests pass                              | 100%                 | `pnpm test && cargo test --workspace` |
| Critical package coverage | Coverage on crypto, domain, security, services, verification | Per-package minimums | `pnpm test:coverage:critical`         |
| Security threat matrix    | No unresolved critical/high threats                          | 0 open               | `pnpm security:threat-matrix`         |

### Tier 2 — CI Health

Reviewed weekly.

| Metric                           | Definition                                  | Target     | Gate command               |
| -------------------------------- | ------------------------------------------- | ---------- | -------------------------- |
| Architecture boundary violations | Circular or boundary-crossing imports       | 0          | `pnpm architecture:check`  |
| Lint errors                      | ESLint failures across all packages         | 0          | `pnpm lint`                |
| Type errors                      | TypeScript type check failures              | 0          | `pnpm typecheck`           |
| Rust clippy warnings             | Clippy warnings treated as errors           | 0          | `cargo clippy -D warnings` |
| Dependency audit findings        | `cargo audit` and npm audit vulnerabilities | 0 critical | Weekly CI                  |

### Tier 3 — Performance Budgets

Reviewed per PR; enforced on trend.

| Metric                     | Definition                           | Target                  | Gate command              |
| -------------------------- | ------------------------------------ | ----------------------- | ------------------------- |
| Ed25519 sign throughput    | Operations per second (Rust native)  | Budget in `benchmarks/` | `pnpm perf:check-budgets` |
| SHA-256 hashing throughput | MB/s (Rust native)                   | Budget in `benchmarks/` | `pnpm perf:check-budgets` |
| ZKP proof generation time  | ms per proof (Groth16, Bulletproofs) | Budget in `benchmarks/` | `pnpm perf:check-budgets` |
| Merkle tree construction   | ms for large verification batches    | Budget in `benchmarks/` | `pnpm perf:check-budgets` |

---

## 2. Data Collection

### Quality KPI collection

Quality KPIs are collected and stored in `quality/`:

```bash
# Collect current KPI snapshot
pnpm quality:kpi:collect

# Export quality KPIs report
pnpm quality:kpi:export
```

### Performance history

Benchmark results are tracked in `benchmarks/`:

```bash
# Capture latest benchmark results
pnpm perf:capture-latest

# Update benchmark history (per PR in CI)
pnpm perf:update-history
```

### API surface tracking

The API surface baseline is stored at `quality/api-surface-baseline.json`:

```bash
# Check for regressions against baseline
pnpm api:check

# Release-mode check with strict semver enforcement
pnpm api:check:release

# Update baseline (human approval required)
pnpm api:update-baseline
```

---

## 3. CI Observability

### Gate results per PR

Every PR produces gate results visible in GitHub Actions:

| Gate                     | Output location                                 |
| ------------------------ | ----------------------------------------------- |
| Lint / typecheck / tests | GitHub Actions check summary                    |
| Architecture check       | Log output from `check-package-boundaries.mjs`  |
| API surface diff         | Log output from `check-api-surface.mjs`         |
| Performance budget       | Log output from `check-performance-budgets.mjs` |
| Security threat matrix   | Log output from `check-threat-matrix.mjs`       |
| Rust clippy              | Cargo output in CI log                          |
| Rust tests               | Cargo test output in CI log                     |

### Native binding matrix

Native binding CI runs across 4 platform targets. All must pass:

- Linux x86_64
- Linux aarch64
- macOS x86_64
- macOS aarch64 (Apple Silicon)

Matrix results are visible in the GitHub Actions workflow run.

---

## 4. Quality Governance

Governance rules tracked separately from CI gates:

```bash
# Check governance requirements
pnpm quality:governance:check

# Verify branch protection rules
pnpm quality:verify-branch-protection
```

---

## 5. Reporting Cadences

| Report                   | Frequency            | Audience            | Owner            |
| ------------------------ | -------------------- | ------------------- | ---------------- |
| PR gate summary          | Every PR             | Author + reviewers  | CI               |
| Performance budget check | Every PR             | Engineering         | CI               |
| Dependency audit         | Weekly               | Engineering         | CI               |
| ZKP heavy proof tests    | Weekly               | Engineering         | CI               |
| Release quality review   | Before every release | Engineering + human | Engineering lead |
| UAT evidence log update  | Before every release | Engineering + human | Engineering lead |

---

## 6. Privacy

`gtcx-core` is a library — it handles no user data and has no analytics pipeline. All metrics described in this document are engineering quality metrics (build, test, performance, security), not product or user analytics.

---

_Measure what blocks a bad release from reaching consumers. If a metric cannot catch a regression before publish, it should not be on this list._
