# @gtcx/workproof

## 1.0.4

### Patch Changes

- chore(release): republish with npm publish --provenance

  Uses publish-packages-provenance.mjs (pnpm pack + npm publish). Prior pnpm publish releases lack registry attestations.

- Updated dependencies
  - @gtcx/types@3.1.4
  - @gtcx/crypto@3.1.4
  - @gtcx/verification@3.1.4

## 1.0.3

### Patch Changes

- fe01c1a: chore(release): republish with npm provenance via pnpm publish

  Enables NPM_CONFIG_PROVENANCE / publishConfig.provenance (changeset --provenance is ignored).

- Updated dependencies [fe01c1a]
  - @gtcx/types@3.1.3
  - @gtcx/crypto@3.1.3
  - @gtcx/verification@3.1.3

## 1.0.2

### Patch Changes

- 330da2c: chore(release): republish with npm provenance attestations

  No API changes. Publishes Sigstore attestations on the npm registry via `changeset publish --provenance` (SLSA Build L3 pipeline).

- Updated dependencies [330da2c]
  - @gtcx/types@3.1.2
  - @gtcx/crypto@3.1.2
  - @gtcx/verification@3.1.2

## 1.0.1

### Patch Changes

- Documentation and supply-chain hygiene improvements
  - Add SLSA provenance verification section to `@gtcx/crypto` README
  - Add maturity badges to scaffolding and beta packages (`ai`, `network`, `runtime`, `workproof`, `crypto-native`)
  - Update `@gtcx/crypto` README with supply-chain verification instructions
  - Improve package discoverability with explicit maturity state

- Updated dependencies
  - @gtcx/crypto@3.1.1
  - @gtcx/types@3.1.1
  - @gtcx/verification@3.1.1

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
