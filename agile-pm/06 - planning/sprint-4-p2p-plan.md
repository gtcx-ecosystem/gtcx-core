# Sprint 4 Plan: P2P Networking Transport

**Updated**: 2026-02-20  
**Sprint Goal**: Establish P2P transport primitives and adapter model.  
**Status**: In progress  
**Epic**: Sprint 4 in `agile-pm/05 - roadmap/gtcx-core-full-spec-epics.md`

## Scope

- Define P2P node + transport adapter interface.
- Provide in-memory transport for tests and local simulations.
- Implement rate limiting and pub/sub delivery.
- Add tests for peer drop/recovery and rate limiting.

## Out of Scope

- Full libp2p/QUIC/gossipsub implementation.
- Production peer discovery and reputation system.

## Task Breakdown

- [x] P2P-001: Create `@gtcx/network` package with core types.
- [x] P2P-002: Implement in-memory transport adapter.
- [x] P2P-003: Implement publish/subscribe + rate limiting.
- [x] P2P-004: Add tests for delivery, rate limiting, node drop/recovery.
- [x] P2P-005: Add libp2p/QUIC adapter (scaffolded).
- [ ] P2P-006: UAT evidence run and log entry (libp2p runtime).

## Acceptance Criteria

1. Messages deliver across in-memory peers.
2. Rate limiting enforced per node.
3. Node drop and recovery handled without crashes.

## UAT Scenarios

1. Publish/subscribe across a three-node mesh.
2. Exceed rate limit and verify rejection.
3. Stop a node, publish, restart, and verify recovery.

## Dependencies

- Network protocol spec: `docs/specs/network-protocol.md`

## Estimates

- Engineering: 6 to 8 weeks.
- QA and UAT: 1 to 2 weeks.
