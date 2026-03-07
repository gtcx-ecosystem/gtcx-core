# Metrics

_Product and service metrics (SLOs, DAU, retention, business KPIs) are not applicable to `gtcx-core`. This repo is a shared primitives library with no running services and no end users._

## What is tracked for gtcx-core

Library-level signals tracked in CI and at release:

| Signal                      | Source                                 | Notes                                  |
| --------------------------- | -------------------------------------- | -------------------------------------- |
| CI pass rate                | GitHub Actions                         | Gate regressions flagged immediately   |
| Critical path test coverage | Vitest + `pnpm test:coverage:critical` | Target: 100%                           |
| API surface stability       | `pnpm api:check`                       | Breaking changes caught before publish |
| Performance budgets         | `pnpm perf:check-budgets`              | Signing, hashing within targets        |
| Dependency CVEs             | `pnpm audit`, `cargo audit`            | Run per PR and weekly                  |
| npm download trends         | npm registry                           | Consumer adoption tracking             |

These signals are reviewed at each release and tracked in the QA process. See `_sop/2-docs/4-devops/4-quality-assurance/qa-process.md`.
