# @gtcx/verification

## 3.1.0

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
  - @gtcx/crypto@3.1.0

## 3.0.0

### Major Changes

- 3677b1a: **Breaking:** `tracedVerifyCertificate()` now requires a `RevocationChecker`

  Closes SA-004 / AT-002. The certificate verify path previously had no revocation check at all — a revoked certificate with a valid signature passed verification. This is a high-severity gap for any sandbox-regulator submission.

  **What changed:**
  - `tracedVerifyCertificate(certificate, revocationChecker)` — new required second arg
  - `RevocationChecker` interface exported from `@gtcx/verification`:
    ```ts
    interface RevocationChecker {
      check(certificate: Certificate): Promise<RevocationStatus>;
    }
    ```
  - `CertificateVerificationResult.checks` now includes `notRevoked: boolean`
  - Fail-closed semantics: if the checker throws or times out, `notRevoked` is set to `false` and the verify result is `isValid: false` with a `revocation check failed` reason
  - Confidence calculation now divides by 5 checks (was 4); a fully-valid certificate scores 1.0; a certificate that fails only revocation scores 0.8

  **Three factory functions provided:**
  - `createInMemoryRevocationChecker()` — backed by the existing singleton `RevocationRegistry`. Suitable for tests and single-process environments. Not durable.
  - `createDenyAllRevocationChecker(reason?)` — always returns `revoked: true`. Use during incident response or as a fail-safe when the real backend isn't wired up.
  - `createNoopRevocationChecker()` — always returns `revoked: false`. **Tests only — using this in production silently reintroduces SA-004.**

  **Migration:**

  Every call to `tracedVerifyCertificate(cert)` becomes `tracedVerifyCertificate(cert, checker)`. Production deployments should implement a `RevocationChecker` that consults their authoritative source (status list endpoint, on-chain registry, internal database). Tests can use `createNoopRevocationChecker()` for code paths where revocation is out of scope.

  See `docs/security/threat-model.md` (Scenario 1) and `packages/verification/src/certificates/revocation.ts:124-200`.

### Minor Changes

- af988b2: Expose `CustodyEntry` and `SettlementRecord` through the public verification API and align certificate template inputs with the exported type surface.

### Patch Changes

- Updated dependencies [5775d52]
- Updated dependencies [b8c5c81]
- Updated dependencies [d432014]
- Updated dependencies [30126d9]
- Updated dependencies [fed8541]
- Updated dependencies [b8c5c81]
  - @gtcx/types@3.0.0
  - @gtcx/ai@0.3.0
  - @gtcx/crypto@3.0.0

## 2.0.0

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
  - @gtcx/ai@0.2.2

## 1.0.1

### Patch Changes

- First published release. Cryptographic primitives, identity, verification, domain models, schemas, and security — production-ready foundation for the GTCX ecosystem. All quality gates passing, security audit complete, specs aligned with code.

- Updated dependencies []:
  - @gtcx/ai@0.2.1
  - @gtcx/types@1.0.1
  - @gtcx/crypto@1.0.1

## 1.0.0

### Minor Changes

- Initial public release of GTCX Core packages.
  - Ed25519 cryptographic primitives with Rust-powered performance
  - Identity management with DID (Decentralized Identifier) support
  - Certificate generation, verification, and QR code proofing
  - Domain models with offline-first queue and event sourcing
  - Core12 compliance schema framework
  - Security boundary validation with Zod schemas
  - AI integration hooks and structured logging
  - Offline-first connectivity with deterministic conflict resolution
  - Full cross-package integration test coverage (57 tests)
  - 143 Rust tests across 6 crates
  - 10 Architecture Decision Records

### Patch Changes

- Updated dependencies []:
  - @gtcx/types@1.0.0
  - @gtcx/crypto@1.0.0
  - @gtcx/ai@0.2.0
