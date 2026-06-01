# @gtcx/types

## 3.1.2

### Patch Changes

- 330da2c: chore(release): republish with npm provenance attestations

  No API changes. Publishes Sigstore attestations on the npm registry via `changeset publish --provenance` (SLSA Build L3 pipeline).

## 3.1.1

### Patch Changes

- Documentation and supply-chain hygiene improvements
  - Add SLSA provenance verification section to `@gtcx/crypto` README
  - Add maturity badges to scaffolding and beta packages (`ai`, `network`, `runtime`, `workproof`, `crypto-native`)
  - Update `@gtcx/crypto` README with supply-chain verification instructions
  - Improve package discoverability with explicit maturity state

## 3.0.0

### Minor Changes

- 5775d52: Agentic Provenance types and schemas
  - Add `AgenticProvenance` interface with `trustLevel`, `confidence`, `evidenceRefs`, `methodologyVersion`, `requiresHumanReview`, `decisionProvenance`
  - Add `ReviewThreshold` with 4 default gates: `high_impact_compliance`, `model_uncertainty`, `stale_or_partial_evidence`, `jurisdictional_edge_case`
  - Add `ProvenancePolicy` and `evaluateProvenancePolicy()` for machine-readable policy gates
  - Add `shouldRequireHumanReview()` helper
  - Add Zod schemas in `@gtcx/schemas` for runtime validation

## 2.0.0

### Patch Changes

- Sprint 1-4 remediation release.

  **@gtcx/crypto** — Add NativeZkpEngine backed by real Groth16, Bulletproofs, and Schnorr circuits via NAPI-RS. `createZkpEngine()` factory auto-detects native bindings. HashCommitmentZkpEngine gated behind `GTCX_REQUIRE_NATIVE=false`.

  **@gtcx/api-client** — Add offline-aware request handling via `OfflineHandler`. When configured, checks connectivity before each request and enqueues offline requests.

  **@gtcx/connectivity** — Replace hardcoded `online: true` stub with real HTTP health probe. Configurable via `GTCX_HEALTH_URL` env var.

  **@gtcx/network** — Add real libp2p runtime dependencies (was all optional peers, transport was dead code).

  **@gtcx/crypto-native** — Export ZKP binding interfaces for Groth16, Bulletproofs, and Schnorr native functions.

  All packages — Remove unused peerDependencies, remove `--passWithNoTests` flags, fix stale eslint-disable directives.

## 1.0.1

### Patch Changes

- First published release. Cryptographic primitives, identity, verification, domain models, schemas, and security — production-ready foundation for the GTCX ecosystem. All quality gates passing, security audit complete, specs aligned with code.

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
