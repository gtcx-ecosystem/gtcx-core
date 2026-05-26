# @gtcx/workproof

## 1.1.0

### Minor Changes

- 53fa69f: Add 10 continental-Africa predicates with SADC authority taxonomy
  - New `definitions/continental.ts` with 10 net-new predicates:
    `GoldBuyingLicenseValid`, `CooperativeRegistered`, `Traceability3tTagged`,
    `RegionalCertificationIcglrRcm`, `RegionalProtocolSignatory`,
    `PricePreciousMetalFix`, `ConflictZoneCleared`, `OriginSatelliteVerified`,
    `PhysicalSealAttested`, `RegionalSanctionsCleared`
  - New `AUTHORITY_SLUGS` type-safe constant for SADC mining, cooperative,
    identity, and screening authorities
  - Schema extensions (additive, non-breaking):
    - `IdentityVerified`: add `biometric_attestation` to `evidence.optional`
    - `LicenseValid`: expand `evidence.required` to accept `government_id` or
      `mining_license` as alternative required evidence
  - Migration aliases added to `TRADEPASS_LEGACY_ID_ALIASES` where applicable

### Patch Changes

- Updated dependencies [53fa69f]
  - @gtcx/verification@3.2.0

## 1.0.0

### Major Changes

- 028e3d9: Trim public surface: `CompositeValue` is no longer re-exported from the
  package index. The type still exists in the package internals as part of
  the `PredicateValue` discriminated union — consumers needing the shape can
  pattern-match `{ kind: 'composite' }` or import the underlying Zod schema.

  Background: commit `12fb184` (2026-05-13) migrated workproof barrels from
  `export *` to explicit named exports as part of an API minimization pass.
  `CompositeValue` was previously re-exported only via the wildcard. This
  changeset declares the resulting public-surface narrowing so the next
  release is semver-correct.

  **Migration**

  If your code did:

  ```ts
  import type { CompositeValue } from '@gtcx/workproof';
  ```

  Either pattern-match on the discriminated union:

  ```ts
  import type { PredicateValue } from '@gtcx/workproof';
  function handle(v: PredicateValue) {
    if (v.kind === 'composite') {
      // v is narrowed to the composite shape
    }
  }
  ```

  Or import the Zod schema for runtime validation:

  ```ts
  import { PredicateValueSchema } from '@gtcx/workproof';
  ```

### Minor Changes

- aefba49: Add 9 entity-tier predicates and TradePass migration helper (ADR-012 Stage 0)

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

### Patch Changes

- Updated dependencies [ab3f544]
- Updated dependencies [aefba49]
  - @gtcx/crypto@3.1.0
  - @gtcx/verification@3.1.0

## 0.1.3

### Patch Changes

- Updated dependencies [5775d52]
- Updated dependencies [30126d9]
- Updated dependencies [3677b1a]
- Updated dependencies [af988b2]
- Updated dependencies [fed8541]
- Updated dependencies [b8c5c81]
  - @gtcx/types@3.0.0
  - @gtcx/crypto@3.0.0
  - @gtcx/verification@3.0.0

## 0.1.2

### Patch Changes

- Sprint 1-4 remediation release.

  **@gtcx/crypto** — Add NativeZkpEngine backed by real Groth16, Bulletproofs, and Schnorr circuits via NAPI-RS. `createZkpEngine()` factory auto-detects native bindings. HashCommitmentZkpEngine gated behind `GTCX_REQUIRE_NATIVE=false`.

  **@gtcx/api-client** — Add offline-aware request handling via `OfflineHandler`. When configured, checks connectivity before each request and enqueues offline requests.

  **@gtcx/connectivity** — Replace hardcoded `online: true` stub with real HTTP health probe. Configurable via `GTCX_HEALTH_URL` env var.

  **@gtcx/network** — Add real libp2p runtime dependencies (was all optional peers, transport was dead code).

  **@gtcx/crypto-native** — Export ZKP binding interfaces for Groth16, Bulletproofs, and Schnorr native functions.

  All packages — Remove unused peerDependencies, remove `--passWithNoTests` flags, fix stale eslint-disable directives.

- Updated dependencies []:
  - @gtcx/crypto@2.0.0
  - @gtcx/types@2.0.0
  - @gtcx/verification@2.0.0

## 0.1.1

### Patch Changes

- First published release. AI integration hooks, API client, connectivity detection, event system, logging, networking, services, sync engine, utilities, and WorkProof attestations. Pre-stable (0.x) — API may evolve.

- Updated dependencies []:
  - @gtcx/types@1.0.1
  - @gtcx/crypto@1.0.1
  - @gtcx/verification@1.0.1
