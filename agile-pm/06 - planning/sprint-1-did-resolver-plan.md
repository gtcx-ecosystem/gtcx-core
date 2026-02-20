# Sprint 1 Plan: DID Resolver Core

**Updated**: 2026-02-20  
**Sprint Goal**: Implement resolver adapters, caching, and revocation hooks for production identity resolution.  
**Status**: Complete (2026-02-20)
**Epic**: Sprint 1 in `agile-pm/05 - roadmap/gtcx-core-full-spec-epics.md`

## Scope

- Implement pluggable DID resolver interface and adapters.
- Add caching with TTL and invalidation.
- Integrate revocation checks and structured error taxonomy.

## Out of Scope

- Full registry governance workflows.
- On-chain resolver implementation beyond adapter scaffolding.

## Technical Design (High Level)

1. Resolver interface lives in `@gtcx/identity`.
2. Resolver adapters include:
3. HTTP registry adapter.
4. Local in-memory adapter for tests and dev.
5. Cache layer wraps all adapters with TTL and invalidation.
6. Revocation hooks provided via optional callback.

## Task Breakdown

- [x] DID-RES-001: Add resolver interface and default resolver wiring in `@gtcx/identity`.
- [x] DID-RES-002: Implement HTTP registry adapter with timeout and retry policy.
- [x] DID-RES-003: Implement in-memory adapter for local and test use.
- [x] DID-RES-004: Implement cache with TTL, invalidation, and metrics hooks.
- [x] DID-RES-005: Add revocation hook interface and integrate into resolve flow.
- [x] DID-RES-006: Structured error types and cause propagation.
- [x] DID-RES-007: Integration tests for resolver + cache + revocation flows.
- [x] DID-RES-008: Update docs and examples.

## Acceptance Criteria

1. Resolver can resolve DID via HTTP registry adapter in integration tests.
2. Cache returns hits within TTL and invalidates after expiry.
3. Revocation hook denies revoked identities.
4. All resolver errors are structured and typed.
5. Docs updated for resolver usage and configuration.

## UAT Scenarios

1. Resolve a valid DID from registry.
2. Resolve a revoked DID and confirm rejection.
3. Validate cache TTL and invalidation behavior.
4. Verify resolver fails gracefully under timeout and network errors.

## Dependencies

- Identity core spec: `docs/specs/identity-core.md`
- Security framework: `docs/specs/security-framework.md`

## Estimates

- Engineering: 3 to 4 weeks.
- QA and UAT: 1 week.
