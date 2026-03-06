# Metrics — gtcx-core

Quality metrics, performance targets, and SLO tracking for `gtcx-core`.

## Contents

| Document                                             | Description                                        |
| ---------------------------------------------------- | -------------------------------------------------- |
| [`slo-targets.md`](./slo-targets.md)                 | SLO definitions and targets for core quality gates |
| [`performance-metrics.md`](./performance-metrics.md) | Performance budget tracking and benchmark history  |

## Key Metric Locations

| Metric               | Location                              |
| -------------------- | ------------------------------------- |
| Performance budgets  | `benchmarks/performance-budgets.json` |
| Performance history  | `benchmarks/history.json`             |
| API surface baseline | `quality/api-surface-baseline.json`   |
| KPI metrics          | `quality/kpi-metrics.json`            |

## References

- `SOP/2-docs/5-reference/BENCHMARKS.md`
- `SOP/2-docs/4-operations/runbooks/slo-targets.md`
- `SOP/2-docs/4-operations/runbooks/quality-runbook.md`
