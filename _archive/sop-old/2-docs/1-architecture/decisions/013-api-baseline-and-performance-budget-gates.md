# ADR-013: API Baseline and Performance Budget Gates

## Status

Accepted

## Date

2026-02-19

## Context

Release quality requires two explicit protections that were not previously CI-enforced:

- Public API drift detection for TypeScript package surfaces
- Benchmark budget enforcement for critical cryptographic operations

## Decision

Introduce two release-blocking gates:

1. **API baseline gate** — `pnpm api:check` validates current `dist/*.d.ts` hashes against `quality/api-surface-baseline.json`. Intentional API updates must run `pnpm api:update-baseline`.

2. **Performance budget gate** — `pnpm perf:check-budgets` validates `benchmarks/latest-results.json` against `benchmarks/performance-budgets.json`.

Both gates run in CI and release workflows.

## Consequences

### Positive

- Prevents unreviewed public API changes
- Establishes explicit, machine-readable performance budgets
- Improves release auditability

### Negative

- Intentional API changes require baseline refresh workflow
- Budget values require periodic maintenance as hardware/runtime evolves

### Neutral

- Gates are deterministic and low-latency; they validate tracked artifacts rather than running full benchmark suites on every CI run
