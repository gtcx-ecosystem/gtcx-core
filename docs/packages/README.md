# GTCX Core Packages

This section documents the packages in the `gtcx-core` workspace. Each package doc reflects current implementation.

## Package Index

| Package               | Description                             | Docs               |
| --------------------- | --------------------------------------- | ------------------ |
| `@gtcx/ai`            | AI tracing stubs and category logging   | `ai.md`            |
| `@gtcx/api-client`    | Low‑level HTTP client with retry + mTLS | `api-client.md`    |
| `@gtcx/config`        | Shared eslint/ts/tsup/tailwind configs  | `config.md`        |
| `@gtcx/connectivity`  | Connectivity profiling utilities        | `connectivity.md`  |
| `@gtcx/crypto`        | Cryptographic primitives                | `crypto.md`        |
| `@gtcx/crypto-native` | Native crypto bindings                  | `crypto-native.md` |
| `@gtcx/domain`        | Domain types, schemas, events, metrics  | `domain.md`        |
| `@gtcx/events`        | Typed event bus + offline buffering     | `events.md`        |
| `@gtcx/identity`      | Identity + DID utilities                | `identity.md`      |
| `@gtcx/logging`       | Structured logging utilities            | `logging.md`       |
| `@gtcx/network`       | P2P mesh transport                      | `network.md`       |
| `@gtcx/schemas`       | Core12 schemas + helpers                | `schemas.md`       |
| `@gtcx/security`      | Auth, validation, offline security      | `security.md`      |
| `@gtcx/services`      | Business services                       | `services.md`      |
| `@gtcx/sync`          | Sync engine + conflict resolution       | `sync.md`          |
| `@gtcx/types`         | Shared TypeScript types                 | `types.md`         |
| `@gtcx/utils`         | Common utility helpers                  | `utils.md`         |
| `@gtcx/verification`  | Certificates, QR, proof bundles         | `verification.md`  |
| `@gtcx/workproof`     | WorkProof / TradeCV schemas             | `workproof.md`     |

## Notes

- Rust crates are documented under `docs/rust/README.md`.
- Security posture is summarized in `docs/specs/security-framework.md`.
