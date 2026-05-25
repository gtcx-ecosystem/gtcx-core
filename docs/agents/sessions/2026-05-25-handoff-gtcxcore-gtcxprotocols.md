---
title: 'Cross-Repo Handoff — ADR-012 Stage 1 (gtcx-core → gtcx-protocols)'
date: '2026-05-25'
from: 'gtcx-core'
to: 'gtcx-protocols'
scope: 'ADR-012 predicate reconciliation Stage 1'
tags: ['handoff', 'gtcx-core', 'gtcx-protocols', 'ADR-012', 'predicate-reconciliation']
status: 'complete'
---

# Cross-Repo Handoff — ADR-012 Stage 1

## What gtcx-core Delivered (Stage 0)

**Commit:** `27184d0` on `gtcx-core/main`
**Follow-up:** `aefba49` (rustls-webpki CI unblock + clippy/fmt fixes)
**Version bump:** `1ccd05a` (workproof 0.1.3 → 1.0.0, verification 3.0.0 → 3.1.0)

### Deliverables

1. **47 predicates in `@gtcx/workproof`**
   - 9 new entity-tier predicates: `EntityRegistered`, `SanctionsCleared`, `PepCleared`, `AdverseMediaCleared`, `BeneficialOwnershipDisclosed`, `AccreditationHeld`, `EntityRecognized`, `IssuedBy`, `OwnershipChain`
   - New `Entity` category (9 categories total)
   - Full `PredicateDefinition` schema for each: evidence, attestation, confidence, temporal, AI metadata

2. **`corporate_registry` evidence type** in `@gtcx/verification`
   - Already present in `EvidenceType` union; no code change needed

3. **Migration helper** exported from `@gtcx/verification/migration`
   - `resolveLegacyPredicateId(legacyId)` — forward lookup
   - `findLegacyIdsForUri(uri)` — reverse lookup
   - `TRADEPASS_LEGACY_ID_ALIASES` — full read-only mapping

4. **Tests**
   - 18 new entity predicate assertions in `packages/workproof/tests/entity.test.ts`
   - Existing tests updated for 47-count / 9-category
   - All 312 workproof tests + 265 verification tests pass

### Files Touched in gtcx-core

```
packages/workproof/src/predicates/definitions/entity.ts      (new)
packages/workproof/src/predicates/uri.ts                     (+9 URIs)
packages/workproof/src/predicates/types.ts                   (+EntityPredicateType, +Entity category)
packages/workproof/src/predicates/schemas.ts                 (+9 schema entries)
packages/workproof/src/predicates/registry.ts                (+9 imports, +9 entries)
packages/workproof/src/index.ts                              (+EntityPredicateType export)
packages/workproof/tests/entity.test.ts                      (new)
packages/workproof/tests/predicates.test.ts                  (count updates)
packages/verification/src/migration/tradepass-aliases.ts     (new)
packages/verification/src/migration/index.ts                 (new)
packages/verification/src/index.ts                           (+migration export)
packages/verification/package.json                           (+./migration export)
packages/verification/tsup.config.ts                         (+migration/index entry)
```

## What gtcx-protocols Needs to Do (Stage 1)

Per `gtcx-intelligence/docs/adr/012-predicate-reconciliation-cross-repo.md` §Stage 1:

### Step 1 — Add gtcx-core dependencies

In `gtcx-protocols/protocols/tradepass/package.json`:

```json
{
  "dependencies": {
    "@gtcx/verification": "workspace:*",
    "@gtcx/workproof": "workspace:*"
  }
}
```

### Step 2 — Create predicate bridge

New file: `gtcx-protocols/protocols/tradepass/src/predicate-bridge.ts`

This file translates TradePass legacy predicate IDs (e.g., `tradepass.entity.sanctions_cleared`) to gtcx-core canonical `PredicateURI` values (e.g., `tradepass://workproof/entity/sanctions-cleared`) on the fly.

**Pattern:**

```typescript
import { WORKPROOF_PREDICATES } from '@gtcx/workproof';
import { resolveLegacyPredicateId } from '@gtcx/verification/migration';
import type { PredicateDefinition, PredicateURI } from '@gtcx/verification';

export function resolvePredicate(id: string): PredicateDefinition | undefined {
  // Try canonical URI directly
  const direct = Object.values(WORKPROOF_PREDICATES).find((p) => p.uri === id);
  if (direct) return direct;

  // Try legacy ID alias
  const canonicalUri = resolveLegacyPredicateId(id);
  if (canonicalUri) {
    return Object.values(WORKPROOF_PREDICATES).find((p) => p.uri === canonicalUri);
  }

  return undefined;
}
```

### Step 3 — Leave parallel registry in place

TradePass's existing `predicate-registry.ts`, `predicate-types.ts`, etc. should NOT be deleted in Stage 1. They stay as-is. New code uses the bridge; old code continues working.

### Step 4 — Acceptance criteria

- `gtcx-protocols` imports `@gtcx/workproof` predicates successfully
- The bridge resolves both legacy IDs and canonical URIs to a single `PredicateDefinition`
- TradePass tests still pass (no behavior change yet)

## Blockers & Decisions

| Topic                              | Decision               | Rationale                                                                                                                      |
| ---------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `workproof` major bump (1.0.0)     | Accept breaking change | `CompositeValue` removed from public exports; TradePass should pattern-match on `PredicateValue` or use `PredicateValueSchema` |
| `corporate_registry` evidence type | Use as-is              | Already in `@gtcx/verification`; no migration needed                                                                           |
| Migration helper completeness      | Advisory only          | The alias map is a best guess; TradePass team should review and complete it                                                    |

## Next Steps (Estimated Effort)

| Step                                            | Effort     | Owner          |
| ----------------------------------------------- | ---------- | -------------- |
| Add workspace dependencies                      | 15 min     | gtcx-protocols |
| Draft `predicate-bridge.ts`                     | 2–3 hours  | gtcx-protocols |
| Integrate bridge into TradePass entry points    | 2–4 hours  | gtcx-protocols |
| Run TradePass tests, fix drift                  | 1–2 hours  | gtcx-protocols |
| Code review by gtcx-core + gtcx-protocols leads | 1 hour     | Both           |
| **Total**                                       | **~1 day** | gtcx-protocols |

## Cross-Repo Coordination

- **Dependency order:** gtcx-core publishes first (done), then gtcx-protocols consumes
- **PR references:** gtcx-protocols PR should reference `gtcx-core@27184d0` and `ADR-012`
- **Communication:** Announce in gtcx-engineering channel when Stage 1 PR opens

## References

- gtcx-intelligence ADR-012: `gtcx-intelligence/docs/adr/012-predicate-reconciliation-cross-repo.md`
- gtcx-core predicate extension spec: `gtcx-intelligence/docs/specs/gtcx-core-predicate-extension-pr.md`
- gtcx-core migration helper: `packages/verification/src/migration/tradepass-aliases.ts`
