---
title: 'Barrel Export Tracking'
status: 'current'
date: '2026-05-27'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['architecture', 'debt', 'tree-shaking']
review_cycle: 'quarterly'
---

# Barrel Export Tracking — gtcx-core

> **Status:** Current
> **Date:** 2026-05-27
> **Owner:** Engineering Lead
> **Type:** Structural debt (non-blocking, tracked)

## Problem

Five packages use `export *` barrel patterns in their `src/index.ts` entry points. This defeats tree-shaking in downstream bundlers (Webpack, Rollup, esbuild) and increases bundle size for consumers who only need a subset of exports.

## Affected Packages

| Package            | File             | Export Count | Consumer Impact        | Target Resolution |
| ------------------ | ---------------- | ------------ | ---------------------- | ----------------- |
| `@gtcx/api-client` | `src/index.ts:1` | ~15 exports  | All downstream bundles | Sprint S48        |
| `@gtcx/network`    | `src/index.ts:1` | ~8 exports   | `gtcx-infrastructure`  | Sprint S49        |
| `@gtcx/schemas`    | `src/index.ts:1` | ~25 exports  | All downstream bundles | Sprint S48        |
| `@gtcx/sync`       | `src/index.ts:1` | ~10 exports  | Mobile clients         | Sprint S48        |
| `@gtcx/types`      | `src/index.ts:1` | ~40 exports  | All downstream bundles | Sprint S49        |

## Why This Is P2 (Not P1)

- Bundle size impact is measurable but not blocking — no consumer has reported size issues
- `@gtcx/types` is consumed in full by most downstream repos anyway (they need all type definitions)
- Refactoring requires coordinated changes across downstream repos to update import paths
- The `api:check` gate ensures no accidental breaking changes during refactoring

## Refactoring Pattern

Replace:

```typescript
// Before (barrel)
export * from './client';
export * from './errors';
export * from './retry';
```

With:

```typescript
// After (explicit)
export { ApiClient, type ApiClientConfig } from './client';
export { ApiError, NetworkError, TimeoutError } from './errors';
export { RetryPolicy, ExponentialBackoff } from './retry';
```

## Verification

After refactoring each package:

1. `pnpm api:check` passes (no breaking changes to public API)
2. `pnpm build` produces identical or smaller `.d.ts` bundles
3. Downstream smoke tests pass (`tests/integration/downstream-smoke/`)

## Acceptance Criteria

- [ ] All 5 packages refactored to explicit exports
- [ ] `api:check` passes for each refactored package
- [ ] Bundle size delta measured and documented (target: ≥5% reduction in typical consumer)
- [ ] Downstream repos updated to use deep imports where appropriate

---

_Tracked as HYG-002 in [`docs/audit/10-10-remediation-plan-2026-05-27.md`](../audit/10-10-remediation-plan-2026-05-27.md)._
