# GTCX Core Full-Spec UAT Plan

**Updated**: 2026-02-20  
**Scope**: gtcx-core full-spec implementation bouts  
**Objective**: Validate end-to-end readiness for enterprise and government-grade deployment.

## UAT Entry Criteria

1. All targeted epics in the bout are code-complete.
2. CI and Release workflows are green on main.
3. Threat-control checks and performance budgets pass.
4. Required test suites are green (unit + integration + property).

## UAT Exit Criteria

1. All UAT scenarios pass without critical defects.
2. No P0 or P1 defects remain open.
3. Audit evidence artifacts are published for the bout.

## UAT Scenarios by Bout

## Bout 1: DID Resolver

1. Resolve a valid DID through the configured adapter and verify document integrity.
2. Resolve a revoked DID and confirm denial of verification.
3. Validate resolver cache TTL and invalidation behavior.

## Bout 2: Offline Sync Engine

1. Simulate offline creation of records, reconnect, and verify convergence.
2. Create a conflicting update on two devices, ensure deterministic resolution.
3. Verify conflict audit logs and reconciliation metadata.

## Bout 3: API Client Enterprise Hardening

1. Execute signed requests and confirm server-side validation.
2. Validate mTLS handshake and reject invalid certs.
3. Confirm retry and timeout behavior under simulated network faults.

## Bout 4: P2P Networking Transport

1. Spin up a 3-node validator mesh and verify peer discovery.
2. Kill one node, ensure consensus continues and state converges on recovery.
3. Validate topic permissions and rate limit enforcement.

## Bout 5: ZKP System

1. Generate and verify compliance proof; verify acceptance path.
2. Submit invalid proof; verify rejection path and audit logging.
3. Validate proof generation latency against budgets.

## Bout 6: secp256k1 Interop

1. Sign a message with secp256k1 and verify via external library.
2. Validate imported secp256k1 signatures against Rust verifier.
3. Confirm test vectors match expected output.
