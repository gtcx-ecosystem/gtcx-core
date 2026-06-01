---
title: 'Downstream Integration Guide'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'standard'
tags: ['documentation', 'gtm']
review_cycle: 'on-change'
---

---

title: '07 Downstream Integration'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs']
review_cycle: 'on-change'

---

# Downstream Integration Guide

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

**For teams consuming gtcx-core in their products.**

---

## Quick Start

```bash
# Install
pnpm add @gtcx/crypto @gtcx/identity @gtcx/verification

# Verify installation
node -e "const { generateKeyPair } = require('@gtcx/crypto'); console.log(generateKeyPair());"
```

## Runtime substrate (recommended for services)

Batteries-included wiring for API client, connectivity, resilience, and telemetry:

```bash
pnpm add @gtcx/runtime @gtcx/api-client @gtcx/connectivity @gtcx/resilience @gtcx/telemetry
```

```typescript
import { createRuntime } from '@gtcx/runtime';

const runtime = createRuntime({
  baseUrl: 'https://api.your-service.test',
  deployment: 'edge', // edge | satellite | standard | test
  circuitBreaker: true,
  telemetry: 'in-memory',
});

await runtime.client.get('/health');
runtime.destroy();
```

Integration smoke: `tests/integration/runtime-substrate.test.ts` in gtcx-core.

## What You Get

| Package              | What It Does                                             | Critical?   |
| -------------------- | -------------------------------------------------------- | ----------- |
| `@gtcx/crypto`       | Ed25519/Secp256k1 signing, SHA-256/BLAKE3 hashing, ZKP   | Yes         |
| `@gtcx/identity`     | DID creation, resolution, credential management          | Yes         |
| `@gtcx/verification` | Certificates, proof bundles, QR codes                    | Yes         |
| `@gtcx/security`     | Token lifecycle, permissions, sanitization, audit        | Yes         |
| `@gtcx/domain`       | Domain models, offline queue, DI container               | Yes         |
| `@gtcx/services`     | Business services, compliance, health checks             | Yes         |
| `@gtcx/schemas`      | Zod validation schemas (Core12: 12 domains, 24 controls) | Yes         |
| `@gtcx/api-client`   | HTTP client with signing, retry, offline queue           | Depends     |
| `@gtcx/sync`         | Offline-first sync with 5 conflict strategies            | Depends     |
| `@gtcx/types`        | TypeScript type definitions                              | Foundation  |
| `@gtcx/utils`        | Common utilities                                         | Foundation  |
| `@gtcx/runtime`      | `createRuntime()` — connectivity + client + telemetry    | Recommended |
| `@gtcx/resilience`   | Circuit breaker, retry, bulkhead                         | Via runtime |
| `@gtcx/telemetry`    | Metrics, traces, logs                                    | Via runtime |

## Production Configuration

### Required Environment Variables

```bash
# Enforce Rust crypto backend (prevents JS fallback ZKP)
GTCX_REQUIRE_NATIVE=true

# Enable FIPS mode (if required by your deployment)
GTCX_FIPS_MODE=true
```

### Native Bindings

`@gtcx/crypto-native` provides Rust-backed Ed25519/ZKP via NAPI-RS. Pre-built binaries ship for:

- macOS ARM (Apple Silicon)
- macOS x86_64
- Linux x86_64
- Linux ARM64

If binaries aren't available for your platform, the library falls back to pure JavaScript. Set `GTCX_REQUIRE_NATIVE=true` to fail instead of falling back — recommended for production.

---

## Trust Verification Checklist

Before deploying gtcx-core in your product:

### Version Pinning

- [ ] Pin `@gtcx/*` packages to exact versions (no `^` ranges)
- [ ] Verify `pnpm-lock.yaml` is committed
- [ ] Review CHANGELOG for breaking changes between your version and current

### Security Configuration

- [ ] Set `GTCX_REQUIRE_NATIVE=true` in production
- [ ] Set `GTCX_FIPS_MODE=true` if FIPS compliance required
- [ ] Verify `isFipsMode()` returns expected value at startup
- [ ] Review native binding availability for your deployment target

### Cryptographic Verification

- [ ] Run signing roundtrip test: `generateKeyPair() → sign() → verify()`
- [ ] Verify hash determinism: `hash256("test")` matches expected value
- [ ] Run canonical test vectors: `pnpm --filter @gtcx/api-client test`

### Offline Resilience

- [ ] Test offline queue behavior (enqueue when offline, sync when connected)
- [ ] Test clock-skew handling (device clock set backward)
- [ ] Test conflict resolution with your chosen strategy

### Evidence Review

- [ ] Review provenance manifest: `artifacts/provenance-manifest.json`
- [ ] Review API surface baseline: `quality/api-surface-baseline.json`
- [ ] Review security assessment: `docs/security/internal-security-assessment.md`
- [ ] Review SBOM for your deployment's dependency audit

---

## API Stability Guarantees

| Change Type                         | Semver         | How You'll Know                   |
| ----------------------------------- | -------------- | --------------------------------- |
| New export (function, type, module) | Minor bump     | CHANGELOG, changeset              |
| Export removed or signature changed | Major bump     | CHANGELOG, breaking change notice |
| Bug fix, internal refactor          | Patch bump     | CHANGELOG                         |
| Security fix                        | Patch or minor | SECURITY.md advisory              |

API surface is enforced by `pnpm api:check` — breaking changes cannot merge without explicit major version bump.

---

## Reporting Issues

- **Security vulnerabilities:** security@gtcx.io (24h initial response SLA for critical)
- **Bugs:** GitHub issues on gtcx-core repository
- **Integration questions:** GitHub discussions

## Source Documents

- [Downstream Production Readiness Checklist](../release/downstream-production-readiness-checklist.md)
- [API Change Migration Policy](../release/api-change-migration-policy.md)
- [Versioning Policy](../release/versioning/versioning-policy.md)
- [Supportability Policy](../release/supportability-policy.md)
