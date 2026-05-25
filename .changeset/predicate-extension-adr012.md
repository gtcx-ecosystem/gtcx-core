---
'@gtcx/workproof': minor
'@gtcx/verification': minor
---

Add 9 entity-tier predicates and TradePass migration helper (ADR-012 Stage 0)

**`@gtcx/workproof`**

- New `EntityPredicateType` union with 9 predicates:
  `EntityRegistered`, `SanctionsCleared`, `PepCleared`, `AdverseMediaCleared`,
  `BeneficialOwnershipDisclosed`, `AccreditationHeld`, `EntityRecognized`,
  `IssuedBy`, `OwnershipChain`
- `WORKPROOF_PREDICATES` expands from 38 to 47 entries
- `PredicateCategory` gains `'Entity'` (9 categories total)
- `WorkProofPredicateTypeSchema` and `PredicateCategorySchema` updated

**`@gtcx/verification`**

- New export path `@gtcx/verification/migration` with TradePass legacy ID aliases:
  - `TRADEPASS_LEGACY_ID_ALIASES` — read-only mapping of legacy IDs to canonical PredicateURIs
  - `resolveLegacyPredicateId(legacyId)` — forward lookup
  - `findLegacyIdsForUri(uri)` — reverse lookup
- `corporate_registry` evidence type already present in `EvidenceType` union

**Tests**

- 18 new assertions in `packages/workproof/tests/entity.test.ts`
- Existing predicate tests updated for 47-count / 9-category

Unblocks gtcx-intelligence operator taxonomy spec and TradePass predicate reconciliation.
