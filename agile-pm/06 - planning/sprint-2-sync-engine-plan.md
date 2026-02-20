# Sprint 2 Plan: Offline Sync Engine

**Updated**: 2026-02-20  
**Sprint Goal**: Deliver deterministic offline-first sync with conflict resolution hooks.  
**Status**: In progress  
**Epic**: Sprint 2 in `agile-pm/05 - roadmap/gtcx-core-full-spec-epics.md`

## Scope

- Implement sync engine core with upload/download flows.
- Provide deterministic conflict resolution and custom conflict hooks.
- Prepare audit log + metrics wiring for operational visibility.

## Out of Scope

- Full vector clock implementation.
- P2P sync transport (Sprint 4).
- ZKP-backed conflict proofs (Sprint 5).

## Technical Design (High Level)

1. Engine implementation in `@gtcx/sync`.
2. Deterministic ordering for conflict evaluation.
3. Conflict hooks for telemetry (`onConflict`) and custom resolution (`resolveConflict`).
4. Planned audit log and metrics emission in sync lifecycle.

## Task Breakdown

- [x] SYNC-001: Implement sync engine core (`packages/sync/src/index.ts`).
- [x] SYNC-002: Deterministic ID ordering for conflict evaluation.
- [x] SYNC-003: Add conflict hooks (`onConflict`, `resolveConflict`).
- [ ] SYNC-004: Add conflict audit log emitter and metrics callbacks.
- [ ] SYNC-005: Add offline → online convergence integration test.
- [ ] SYNC-006: Update docs and examples for conflict hooks and audit logs.

## Acceptance Criteria

1. Sync engine converges deterministically given identical inputs.
2. Conflict hooks are invoked for all conflict cases.
3. Custom conflict resolution can override built-in strategies.
4. Audit/metrics instrumentation planned and wired in code.

## UAT Scenarios

1. Create offline records, reconnect, and validate convergence.
2. Create conflicting updates on two devices; ensure deterministic resolution.
3. Verify conflict telemetry and audit hooks are fired.

## Dependencies

- Offline-first ADR: `docs/adr/007-offline-first-architecture.md`
- Network protocol spec: `docs/specs/network-protocol.md`

## Estimates

- Engineering: 4 to 6 weeks.
- QA and UAT: 1 to 2 weeks.
