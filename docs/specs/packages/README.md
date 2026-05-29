---
title: "Package Specifications — gtcx-core"
status: "current"
date: "2026-05-27"
owner: "gtcx-core"
role: "protocol-architect"
agent_id: "agent://gtcx-core/2026-05-27/session-backfill"
trust_score: 95
autonomy_level: "sovereign"
tier: "critical"
tags: ["documentation", "specs"]
review_cycle: "on-change"
---

# Package Specifications — gtcx-core

Per-package specifications for all 21 public TypeScript packages, 4 shared config workspace packages, and 6 Rust crates in `gtcx-core`.

---

## TypeScript Packages (21)

| Package               | Spec               | Description                                                                                             |
| --------------------- | ------------------ | ------------------------------------------------------------------------------------------------------- |
| `@gtcx/types`         | `types.md`         | Canonical TypeScript type definitions                                                                   |
| `@gtcx/schemas`       | `schemas.md`       | Compliance framework schemas                                                                            |
| `@gtcx/crypto`        | `crypto.md`        | Cryptographic primitives — signing, hashing, proofs                                                     |
| `@gtcx/crypto-native` | `crypto-native.md` | Native NAPI-RS bindings loader                                                                          |
| `@gtcx/domain`        | `domain.md`        | Domain types, schemas, events, metrics, versioning                                                      |
| `@gtcx/identity`      | `identity.md`      | DID creation, resolution, credential lifecycle                                                          |
| `@gtcx/security`      | `security.md`      | Validation, auth, offline storage, audit logging                                                        |
| `@gtcx/verification`  | `verification.md`  | Certificates, QR codes, proof bundles                                                                   |
| `@gtcx/workproof`     | `workproof.md`     | W3C VC attestation schemas                                                                              |
| `@gtcx/events`        | `events.md`        | Typed event bus with offline buffering                                                                  |
| `@gtcx/services`      | `services.md`      | Registration, trading, compliance business services                                                     |
| `@gtcx/sync`          | `sync.md`          | Offline-first sync engine with conflict resolution                                                      |
| `@gtcx/network`       | `network.md`       | P2P networking primitives for validator mesh                                                            |
| `@gtcx/connectivity`  | `connectivity.md`  | Network connectivity detection and profiles                                                             |
| `@gtcx/api-client`    | `api-client.md`    | Resilient HTTP client with retry and mTLS                                                               |
| `@gtcx/logging`       | `logging.md`       | Structured logging utilities                                                                            |
| `@gtcx/ai`            | `ai.md`            | AI integration hooks and tracing stubs                                                                  |
| `@gtcx/resilience`    | `resilience.md`    | Resilience primitives: circuit breaker, adaptive retry, timeout, bulkhead                               |
| `@gtcx/telemetry`     | `telemetry.md`     | Unified OpenTelemetry-compatible instrumentation: metrics, traces, logs                                 |
| `@gtcx/runtime`       | `runtime.md`       | Batteries-included runtime substrate aggregating connectivity/resilience/telemetry/api-client (ADR-014) |
| `@gtcx/utils`         | `utils.md`         | Common utilities — minimal logic                                                                        |

## Shared Config Workspace Packages (4)

These live under `packages/config/` and support the workspace/tooling layer rather than the main runtime API surface.

| Package                     | Location                        | Description                       |
| --------------------------- | ------------------------------- | --------------------------------- |
| `@gtcx/eslint-config`       | `packages/config/eslint/`       | Shared ESLint flat configuration  |
| `@gtcx/typescript-config`   | `packages/config/typescript/`   | Shared TypeScript config presets  |
| `@gtcx/tsup-config`         | `packages/config/tsup/`         | Shared `tsup` build presets       |
| `@gtcx/jurisdiction-config` | `packages/config/jurisdiction/` | Shared jurisdiction configuration |

---

## Rust Crates (6)

| Crate            | Spec                     | Description                                     |
| ---------------- | ------------------------ | ----------------------------------------------- |
| `gtcx-crypto`    | `rust/gtcx-crypto.md`    | Ed25519, SHA-256/512, Blake3, key derivation    |
| `gtcx-zkp`       | `rust/gtcx-zkp.md`       | Groth16, Bulletproofs, Schnorr ZKP circuits     |
| `gtcx-node`      | `rust/gtcx-node.md`      | NAPI-RS native bindings target                  |
| `gtcx-network`   | `rust/gtcx-network.md`   | libp2p transport primitives                     |
| `gtcx-consensus` | `rust/gtcx-consensus.md` | Weighted PBFT consensus foundations             |
| `gtcx-edge`      | `rust/gtcx-edge.md`      | Edge runtime with resource-constrained profiles |

---

## Security Posture

All packages follow the security framework in `docs/security/security-framework.md`. Security-sensitive packages (`@gtcx/crypto`, `@gtcx/crypto-native`, `@gtcx/security`, `@gtcx/verification`, `@gtcx/identity`, `rust/gtcx-crypto`, `rust/gtcx-zkp`) require Cryptographic Security Engineer review on every change.

---

## Reference

- [`docs/specs/core-spec.md`](../core-spec.md) — system specification
- [`docs/security/security-framework.md`](../../security/security-framework.md) — security framework
- [`docs/agents/roles/crypto-security-engineer.md`](../../agents/roles/crypto-security-engineer.md) — gatekeeper for security-sensitive packages
