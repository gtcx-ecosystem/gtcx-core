# Core System Specification (gtcx-core)

**Status**: Active (2026-02-21)

This is the canonical, top-level specification for `gtcx-core`. It summarizes goals, current scope, and non‑functional requirements, and points to deeper specs for implementation detail.

## Purpose

- Provide secure identity, verification, and proof primitives for the GTCX ecosystem.
- Support offline-first workflows with deterministic sync and event buffering.
- Enable secure networking and proof exchange across untrusted environments.

## Current Scope (Repo Reality)

### TypeScript packages

- **Crypto**: `@gtcx/crypto`, `@gtcx/crypto-native` (optional native backend)
- **Identity**: `@gtcx/identity`
- **Network**: `@gtcx/network`
- **Events**: `@gtcx/events`, `@gtcx/domain`
- **Schemas/Types**: `@gtcx/schemas`, `@gtcx/types`
- **Security**: `@gtcx/security`
- **Verification**: `@gtcx/verification`, `@gtcx/workproof`
- **Services/Sync**: `@gtcx/services`, `@gtcx/sync`
- **Utilities/Logging**: `@gtcx/utils`, `@gtcx/logging`, `@gtcx/config`

### Rust crates

- `rust/gtcx-zkp` — Groth16 circuits + Bulletproofs range + Schnorr attribute proofs.
- `rust/gtcx-crypto` — low‑level cryptographic primitives.
- `rust/gtcx-node` — native bindings used by `@gtcx/crypto-native`.
- `rust/gtcx-network`, `rust/gtcx-edge`, `rust/gtcx-consensus` — supporting crates.

## Non‑Functional Requirements

- **Security-first**: authenticated transport, cryptographic integrity, least-privilege boundaries.
- **Reliability**: predictable failure modes, retry behavior, and rate limiting.
- **Performance**: proof generation and verification within defined budgets.
- **Operability**: explicit runbooks, SLOs, and telemetry.

## References

- `security-framework.md`
- `data-models.md`
- `identity-core.md`
- `network-protocol.md`
- `eventcore.md`
- `docs/architecture/zkp-circuit-plan.md`
