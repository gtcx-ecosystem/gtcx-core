# API Stability Guide — gtcx-core

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

**Last updated**: 2026-05-06
**Source**: `quality/api-surface-baseline.json` (2026-05-06)

---

## Versioning Policy

gtcx-core follows [Semantic Versioning](https://semver.org/). The version number signals stability:

- **v1.x** — Stable. Breaking changes only in major version bumps. Downstream repos can depend on these without risk.
- **v0.x** — Experimental. API may change in minor versions. Downstream repos should pin exact versions and expect migration work.

---

## Package Stability Matrix

### Stable (v1+) — Safe to depend on

| Package              | Exports | Notes                                               |
| -------------------- | ------- | --------------------------------------------------- |
| `@gtcx/crypto`       | 82      | Core signing, hashing, ZKP, Merkle, traced variants |
| `@gtcx/domain`       | 100+    | Domain services, events, schemas, offline queues    |
| `@gtcx/identity`     | 37      | DID resolver, credentials, resolver metrics         |
| `@gtcx/types`        | (all)   | Protocol types, models, API types, common types     |
| `@gtcx/schemas`      | (all)   | Zod validation schemas for Core12 compliance        |
| `@gtcx/security`     | (all)   | Auth, validation, sanitization, secure storage      |
| `@gtcx/verification` | (all)   | Certificates, QR codes, proof bundles, traced ops   |

### Experimental (v0.x) — API may change

| Package               | Exports | Notes                                                                   |
| --------------------- | ------- | ----------------------------------------------------------------------- |
| `@gtcx/ai`            | 6       | Observability stubs only; full impl in gtcx-intelligence                |
| `@gtcx/api-client`    | 20      | HTTP client with retry, offline queue, request signing; API stabilizing |
| `@gtcx/connectivity`  | 8       | Network detection and profiling; API stabilizing                        |
| `@gtcx/crypto-native` | 12      | NAPI-RS bindings; tied to Rust crate releases                           |
| `@gtcx/events`        | (all)   | Event bus; API stabilizing                                              |
| `@gtcx/logging`       | (all)   | Structured logging; API stabilizing                                     |
| `@gtcx/network`       | (all)   | P2P networking; depends on Phase 4 delivery                             |
| `@gtcx/services`      | 17      | Registration, trading, compliance business services; API stabilizing    |
| `@gtcx/sync`          | (all)   | Offline sync engine; API stabilizing                                    |
| `@gtcx/utils`         | (all)   | Common utilities; API stabilizing                                       |
| `@gtcx/workproof`     | (all)   | WorkProof/TradeCV; ai submodule is types-only                           |

### Rust Crates (all v0.1.0) — Experimental

All Rust crates are at v0.1.0. The `gtcx-node` NAPI-RS crate is consumed via `@gtcx/crypto-native`. Direct Rust crate consumption is not yet supported for downstream repos.

---

## Drift Detection

API surface changes are tracked automatically:

- **Baseline**: `quality/api-surface-baseline.json` — SHA-256 hash of each package's type declarations
- **Drift report**: `quality/api-surface-report.json` — generated in CI, flags any export additions/removals
- **Semver enforcement**: `pnpm api:check:release` — validates that breaking changes are accompanied by major version bumps

To update the baseline after an intentional API change (requires human approval per safety-rules.md):

```bash
pnpm api:update-baseline
```

---

## For Downstream Consumers

1. **Depend on v1.x packages for critical paths** — crypto, verification, domain, security, types, schemas, services
2. **Pin exact versions for v0.x packages** — use `workspace:*` within the monorepo; pin exact versions if consuming externally
3. **Prefer base functions over traced variants** unless you have `gtcx-intelligence` wired in — traced variants are no-ops without it
4. **Watch the CHANGELOG** — breaking changes are documented per package via Changesets

---

## Reference

- [`quality/api-surface-baseline.json`](../../quality/api-surface-baseline.json) — current baseline
- [`quality/api-surface-report.json`](../../quality/api-surface-report.json) — latest drift report
- [`tools/check-api-surface.mjs`](../../tools/check-api-surface.mjs) — drift detection script
- [`.changeset/config.json`](../../.changeset/config.json) — changeset versioning config
