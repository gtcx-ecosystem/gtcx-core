---
title: 'Gtcx Ecosystem Rating 2026 05 08'
status: 'current'
date: '2026-05-17'
owner: 'quality-evidence-lead'
role: 'quality-evidence-lead'
tier: 'critical'
tags: ['docs', 'audit']
review_cycle: 'quarterly'
---

# GTCX Ecosystem — Comprehensive Rating Assessment

**Date:** 2026-05-08
**Assessed by:** Kimi Code CLI
**Scope:** gtcx-core, gtcx-intelligence, gtcx-protocols
**Methodology:** Static analysis, test execution, CI inspection, documentation audit, cross-repo dependency mapping

---

## 1. Code Quality

**Score: 8.2 / 10**

### What Earned the Score

- **gtcx-core**: Strictest TypeScript config in the ecosystem (`strict: true`, `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`, `noImplicitOverride`). Zero `@ts-ignore` in source. Zero `console.log`. Property-based fuzzing with `fast-check`. Rust crates deny `unsafe_code`.
- **gtcx-protocols**: Type-checked linting (`recommendedTypeChecked`). 156 test files. Scheduled nightly fuzz runs. Performance regression gates.
- **gtcx-intelligence**: Multi-language test suite (Vitest + pytest). Chaos tests, circuit-breaker tests, PANX fuzz tests. Contract tests across TS/Python boundary.
- All three repos: Husky + lint-staged pre-commit hooks. Conventional commits via commitlint.

### What's Holding It Back

- **gtcx-protocols**: 340 `@ts-ignore` / `eslint-disable` comments (~1 per 590 LOC) — highest suppression density in the ecosystem. Many may be from generated code, but this masks real issues.
- **gtcx-intelligence**: 57% branch coverage floor is well below core (80%) and protocols (70%). No critical-path coverage gating in CI.
- **gtcx-core**: 2 failing crypto tests (credibility issue for a crypto library).
- Cross-repo: `any` usage in `domain/src/versioning.ts` and test negative-cases.

### Evidence

```
gtcx-core:      0 @ts-ignore in source | 93 total suppressions | 2 failing tests
gtcx-intelligence: 32 suppressions | 57% branch coverage
gtcx-protocols: 340 suppressions | 80% lines / 70% branches
```

---

## 2. Repo / Folder Hygiene

**Score: 7.5 / 10**

### What Earned the Score

- **gtcx-core**: 1,172 docs files. 19/20 packages have READMEs (95%). Architecture boundary enforcement (`check-package-boundaries.mjs`). Clean monorepo structure with pnpm + Turbo.
- **gtcx-protocols**: 14/15 packages have READMEs (93%). 6/7 protocols have READMEs (86%). 9 ADRs committed. K8s manifests, docker-compose, compliance docs.
- **gtcx-intelligence**: Kustomize-based K8s overlays (staging + production). Docker image matrix (6 images). Production readiness runbooks.
- All three: No `dist/` in git. No committed secrets. `.gitignore` properly configured.

### What's Holding It Back

- **gtcx-intelligence**: Critical documentation gap — only 1/4 packages has a README. `sdk/`, `types/`, `typescript-config/`, `trainer/` are completely undocumented.
- **Duplicate package names across repos**: `@gtcx/crypto`, `@gtcx/domain`, `@gtcx/schemas`, `@gtcx/ai`, `@gtcx/types` exist in both gtcx-core and gtcx-protocols (and some in gtcx-intelligence). This creates namespace collision risk if repos are ever composed.
- **gtcx-core**: Empty `AGENTS.md` at repo root is confusing for agent tooling.
- **Cross-repo inconsistency**: gtcx-core uses shared `@gtcx/eslint-config` package; intelligence and protocols inline their config. CI pnpm setup differs (corepack vs action-setup).

### Evidence

```
gtcx-core:      95% README coverage | 1,172 docs files | boundary checks
gtcx-protocols: 93% package READMEs | 9 ADRs | K8s manifests
gtcx-intelligence: 25% package READMEs | 18 docs files | no architecture enforcement
```

---

## 3. Security

**Score: 8.0 / 10**

### What Earned the Score

- **Cryptography**: Ed25519 (default) via `ed25519-dalek` with `ZeroizeOnDrop`. P256 FIPS mode via OpenSSL. Blake3 HD key derivation. Constant-time comparison. Canonical request signing with replay protection.
- **Mobile auth**: DID-based per-device Ed25519 keys. Signed requests with nonce + timestamp. Clock skew tolerance (5 min). DID-verified key store. Key lifecycle (enroll, rotate, revoke).
- **Auth cascade**: Mobile signed requests → API key → JWT (HS256) → OIDC federation (RS256/ES256). Account lockout. RBAC. Token denylist.
- **Input validation**: Zod everywhere. `sanitizeObject()` blocks prototype pollution. `sanitizeForLlm()` strips injection markers. `MAX_BODY_BYTES = 256KB`.
- **Containers**: Multi-stage Docker builds. Non-root users. `readOnlyRootFilesystem`. `allowPrivilegeEscalation: false`. `seccompProfile: RuntimeDefault`. Security headers (CSP, HSTS, COOP).
- **Audit**: Hash-chained audit logs with optional Ed25519 signing. Encrypted audit store. SIEM export endpoint.
- **No hardcoded secrets** across all repos.

### What's Holding It Back

- **🔴 Critical: undici 6.21.0 has known CVEs** (CVE-2025-47279, CVE-2025-22150, CVE-2026-1525) in `@gtcx/api-client`. Must upgrade to `^6.21.2`.
- **Secret scanning**: Only 4 patterns (AWS, GitHub, npm, PEM). Missing Slack, Google, Stripe, generic high-entropy strings, JWTs.
- **Redis fallback risk**: If Redis fails at startup, rate limiter and replay cache silently fall back to in-memory per-instance. Split-brain risk in production.
- **JWT limited**: Custom JWT validator only supports HS256. OIDC path supports RS256/ES256 but is separate.
- **Mobile auth permissions**: Hardcoded `roles: ['mobile']` and `permissions: ['protocol:read', 'protocol:write']` — no per-DID granularity.
- **No key attestation**: No TPM/Secure Enclave proof in mobile auth flow.
- **JS private keys**: Returned as hex strings — immutable in JS memory, acknowledged risk.
- **gtcx-intelligence**: `AUTH_DISABLED=true` can disable auth entirely. gRPC insecure by default.
- **No automated dependency audit** in CI (`pnpm audit`, `cargo audit` steps not observed).

### Evidence

```
CVE: undici@6.21.0 (CRITICAL) — 3 known CVEs
Secret patterns: 4/15+ recommended
Suppressions: 340 (protocols) — potential hiding places
Redis fallback: silent in-memory on connection failure
```

---

## 4. Global South Resilience

**Score: 7.8 / 10**

### What Earned the Score

- **Offline-first architecture**: api-client offline queue, domain offline queue with logical sequence numbers, secure storage with AES-GCM, event FIFO buffer. All treat disconnection as normal.
- **Clock-agnostic ordering**: Monotonic sequences prevent replay bugs when device clocks drift backward (tested in CI).
- **Cultural context**: `CulturalContextWire` v1.0.0 schema. 11 West African + 10 East African country configs. 7 cultural variants (ubuntu, guanxi, etc.). Community stakeholders and sovereignty requirements are first-class fields.
- **African languages**: Tiered coverage — 10 Tier 1 languages (>90% detection target). 4-tier detection pipeline (fasttext → AfroLID → langdetect → keyword fallback). Code-switching detection for 7 regional patterns.
- **Connectivity profiles**: 6 tiers from `offline` to `standard`. Used in sync batch tagging. Jurisdiction config supports USSD, SMS, voice channels.
- **Latency tolerance**: Circuit breakers across all repos. Exponential backoff. Degradation middleware with explicit fallback semantics.
- **Mobile auth**: Tolerates 5-minute clock skew. Works without continuous server contact. DID resolution offline fallback.
- **Regulatory awareness**: 31 controls mapped to NIST/SOC2/ISO27001. Per-jurisdiction config: data sovereignty, government data access, regulatory bodies, compliance rules. African regulatory bodies for 12+ countries.

### What's Holding It Back

- **No persistent offline queue in core**: `IOfflineQueueStorage` interface exists but only `InMemoryQueueStorage` is implemented. No disk-backed implementation for React Native / Node.js.
- **No compression**: No gzip/brotli middleware. Mobile photos likely uncompressed on upload.
- **No USSD implementation**: Referenced everywhere in schemas and docs, but no actual code found.
- **i18n is thin**: Only 5 mobile UI locales (English + 4 African). No Arabic/Urdu/Hebrew RTL implementation. No API error localization.
- **Missing regional files**: Latin America and Asia YAML configs referenced but absent on disk.
- **No adaptive payload sizing**: Connectivity profiles are tracked but not used to adjust batch sizes.
- **No device diversity testing**: No low-RAM testing in CI. No Android API level gating. No adaptive photo quality.
- **API client retries lack jitter**: Collision risk in fleet deployments.

### Evidence

```
Offline queue persistence: ❌ (interface only)
Compression: ❌ (none found)
USSD implementation: ❌ (schema only)
Locales registered: 5 (EN + 4 African)
RTL support: ❌ (not implemented)
Regional YAML files missing: LatAm, Asia
```

---

## 5. Ecosystem Integration

**Score: 6.5 / 10**

### What Earned the Score

- **Shared canonical contracts**: Canonical signing contract with 25 locked test vectors exported from `@gtcx/api-client/canonical/test-vectors`. Formal `contract.md` specifying all 11 rules. Cross-repo validation source of truth.
- **Cross-repo provenance**: `AgenticProvenance` type defined in gtcx-core `@gtcx/types`, mirrored in gtcx-intelligence and gtcx-protocols. `evaluateProvenancePolicy()` and `shouldRequireHumanReview()` in all three repos.
- **pnpm workspaces**: All three repos use pnpm 9.15.0 + Turbo 2.3.0 with identical task topology (`build` → `^build`).
- **Node engine**: `>=20.0.0` everywhere. TypeScript `^6.0.0` everywhere.
- **CI triggers**: Consistent `push`/`pull_request` to `main` across all repos.
- **Cultural context wire**: Cross-language contract between TypeScript SDK and Python ANISA service. 3 fixture corpus files for round-trip validation.
- **Protobuf/gRPC**: ANISA proto extended with `cultural_context_json` and `provenance_json` fields. Python grpc_server + TS grpc-client.

### What's Holding It Back

- **🔴 No cross-repo workspace composition**: Each repo is an isolated pnpm workspace. They cannot be developed or built together. Shared packages (`@gtcx/types`, `@gtcx/crypto`, etc.) are duplicated across repos with different implementations.
- **🔴 No npm publish workflow**: gtcx-core is canonical but not published. Other repos have local mirrors because they can't depend on `@gtcx/types` from npm.
- **Version drift risk**: Same scoped package names with different code in different repos. If ever published, this will cause resolution conflicts.
- **Undici version mismatch**: gtcx-core pins `vite@8.0.10`; intelligence uses `^6.0.0`; protocols uses `^6.4.2`.
- **No shared CI template**: Each repo maintains its own workflows. gtcx-protocols has zizmor; core and intelligence don't.
- **Mobile contract reference**: gtcx-mobile references `gtcx-core/packages/api-client/src/canonical/` but there's no automated sync mechanism.

### Evidence

```
Cross-repo workspace: ❌ (3 isolated workspaces)
npm publish workflow: ❌ (none found)
Duplicate @gtcx/* packages: @gtcx/crypto, @gtcx/domain, @gtcx/schemas, @gtcx/ai, @gtcx/types
Shared CI templates: ❌
Automated mobile sync: ❌
```

---

## 6. Agentic Maturity

**Score: 8.5 / 10**

### What Earned the Score

- **Canonical provenance types**: `AgenticProvenance` with `trustLevel`, `confidence`, `evidenceRefs`, `methodologyVersion`, `requiresHumanReview`, `decisionProvenance`. Locked in gtcx-core `@gtcx/types`.
- **Zod schemas**: Runtime validation mirrors in `@gtcx/schemas`.
- **4 default review thresholds**: `high_impact_compliance` (0.9), `model_uncertainty` (0.6 + 2 evidence refs), `stale_or_partial_evidence` (24h / 0.8 coverage), `jurisdictional_edge_case` (0.85 + 3+ sources).
- **Cross-repo enforcement**:
  - gtcx-core: `attachProvenance()`, `createProvenanceLogger()`, 12+10+4 tests
  - gtcx-intelligence: `IntelligenceResult<T>` with optional provenance, `PolicyEngine.evaluateProvenance()`, auto-provenance generation, 11 integration tests
  - gtcx-protocols: `GTCXAgentSDK.evaluateProvenance()`, `gateDecision()`, provenance-aware policy operators, 6+9 tests
- **Acceptance gate verified**: `gateDecision()` throws if consequential AI-derived decision lacks provenance or fails review policy.
- **Review hooks**: `ReviewHook` interface with `onReviewRequired()`. `createLoggingReviewHook()` and `createWebhookReviewHook()` for async audit logging and external ticketing.
- **Trust downgrades**: `evidenceStrength < 0.3` forces `trustLevel → degraded`. `< 0.6` downgrades `full → limited`. Provenance evidenceRefs include degradation source.
- **Policy engine integration**: Provenance-first evaluation before rule chain. Block/escalate/allow actions.

### What's Holding It Back

- **Local type mirrors**: gtcx-intelligence and gtcx-protocols have local copies of provenance types instead of importing from `@gtcx/types`. Long-term maintenance burden.
- **No provenance attestation chain**: Provenance is self-reported by the AI system. No cryptographic attestation from the model provider or inference infrastructure.
- **No provenance replay / forensics tooling**: Can evaluate provenance at decision time, but no dedicated tooling for post-hoc investigation of provenance chains.
- **Webhook hooks fire-and-forget**: No delivery guarantees. Failed webhook notifications are lost.
- **No model card integration**: Methodology version is free-text. No link to model cards, training data provenance, or benchmark results.

### Evidence

```
Provenance tests across repos: 12 + 10 + 4 + 11 + 6 + 9 = 52 tests
Review thresholds: 4 default + extensible
Policy operators: 3 provenance-aware
Review hooks: logging + webhook
Trust downgrade levels: 2 (degraded, limited)
```

---

## 7. Enterprise / Production Deployment Readiness

**Score: 8.0 / 10**

### What Earned the Score

- **Observability**: Prometheus metrics (`/metrics`) with RED metrics. W3C Trace Context propagation. OTel spans on 63 protocol handlers. Structured JSON logging with 23-pattern PII redaction.
- **Health checks**: Liveness (`/health` or `/live`), readiness (`/ready`), startup probes in K8s. Deep health checks query Postgres + Redis.
- **Graceful degradation**: Redis → in-memory fallback. Circuit breakers. Inference fallback (Anthropic → OpenAI → rule-based). Non-blocking audit log failures.
- **Configuration**: Comprehensive `.env.example` files. K8s ConfigMap/Secret separation. ExternalSecrets/Sealed Secrets recommended. `NODE_ENV=production` blocks stubs.
- **Database migrations**: Custom TypeScript migration runner with version tracking and transaction-per-migration. 6 migrations in protocols.
- **Compliance**: 31 controls mapped to NIST 800-53 Rev 5, SOC 2 TSC, ISO 27001:2022 (27 IMPLEMENTED, 4 PARTIAL). SOC 2 evidence pipeline. Regulatory framework mapping (EU CS3D, CMR, EUDR, Dodd-Frank, UFLPA, OECD DDG, LBMA, RJC, CIRAF).
- **Scalability**: Stateless servers. K8s HPA (3–20 replicas for protocols, 2–15 for PANX). Topology spread constraints. Redis-backed distributed rate limiting.
- **Security headers**: CSP, HSTS, COOP, COEP, CORP, X-Frame-Options, Referrer-Policy on all responses.
- **Incident response**: P1–P4 severity with SLAs (P1 15min). Escalation matrix. Containment procedures. Blameless post-incident reviews.
- **Change management**: Changesets in gtcx-core. API surface baseline tracking. Conventional commits. Provenance manifest generation.
- **Disaster recovery**: DR runbook with RTO 4h, RPO 15min. Quarterly tabletop, bi-annual partial restore, annual full failover. Last DR test: 2026-02-20 PASS.
- **Containers**: Multi-stage builds. Non-root users. SBOM generation (CycloneDX). Cosign signing (protocols). Image digest pinning (protocols).

### What's Holding It Back

- **No Helm charts**: Raw K8s YAML only. Hard to parameterize for different environments.
- **No GitOps**: No ArgoCD/Flux configs committed.
- **SLOs are templates only**: Prometheus alerts defined but SLO tables are empty placeholders. No error budgets calculated.
- **No committed Grafana dashboards**: Dashboards documented as templates but not as JSON-as-code.
- **No Alertmanager integration**: PagerDuty/Opsgenie/Slack hooks not wired.
- **No automated DR testing in CI**: DR runbook exists but no backup/restore validation in CI.
- **gtcx-intelligence gaps**: No RBAC scoping (all API keys identical). gRPC insecure by default. Infinite data retention (GDPR violation). No Helm charts.
- **gtcx-core gaps**: No health-check endpoint contract for library consumers. No runtime metrics (library-only).
- **Changesets only in core**: gtcx-protocols and gtcx-intelligence lack automated versioning.
- **No chaos engineering**: No failure injection tests for backend timeouts, disk full, memory pressure.

### Evidence

```
Helm charts: ❌ (all repos)
GitOps: ❌ (all repos)
SLOs committed: ❌ (templates only)
Grafana dashboards as code: ❌
Alertmanager: ❌
Automated DR in CI: ❌
gtcx-intelligence RBAC: ❌ (all keys identical)
gtcx-intelligence gRPC TLS: ❌ (insecure default)
Changesets: ✅ core only
Chaos engineering: ❌
```

---

## Summary Table

| Dimension                         | Score | Grade | Top Strength                                      | Top Blocker                          |
| --------------------------------- | ----- | ----- | ------------------------------------------------- | ------------------------------------ |
| Code Quality                      | 8.2   | B+    | Strict TS + property-based fuzzing                | 340 suppressions (protocols)         |
| Repo / Folder Hygiene             | 7.5   | B+    | 1,172 docs files (core), boundary checks          | 25% README coverage (intelligence)   |
| Security                          | 8.0   | B+    | Ed25519 + ZeroizeOnDrop + mobile auth             | undici CVEs (CRITICAL)               |
| Global South Resilience           | 7.8   | B+    | Offline-first + cultural context wire             | No persistent queue / no USSD        |
| Ecosystem Integration             | 6.5   | C+    | Canonical test vectors + cross-repo provenance    | No shared workspace / no npm publish |
| Agentic Maturity                  | 8.5   | B+    | 52 provenance tests + gateDecision + review hooks | Local type mirrors (not DRY)         |
| Enterprise / Production Readiness | 8.0   | B+    | 31 compliance controls + DR runbook + K8s HPA     | No Helm / no SLOs / no GitOps        |

**Weighted Average: 7.79 / 10**

---

## Priority Actions

### P0 — Fix Before Production

1. **Upgrade undici** to resolve CVE-2025-47279, CVE-2025-22150, CVE-2026-1525
2. **Add RBAC scoping** to gtcx-intelligence (all API keys must not have identical access)
3. **Enforce gRPC TLS** in gtcx-intelligence production
4. **Fix gtcx-core failing crypto tests**
5. **Set GDPR-compliant default TTL** in gtcx-intelligence (90 days, not infinite)

### P1 — High Priority

6. **Add disk-backed offline queue** implementation for React Native / Node.js
7. **Implement USSD gateway prototype**
8. **Add image compression/resize pipeline** before mobile upload
9. **Create Helm charts** for protocols and intelligence
10. **Commit SLOs and Grafana dashboards as code**
11. **Add automated DR testing** to CI
12. **Unify duplicate package names** or publish `@gtcx/types` to npm

### P2 — Medium Priority

13. **Investigate 340 suppressions** in gtcx-protocols
14. **Expand secret scanner** to TruffleHog/GitLeaks patterns
15. **Add Redis fail-hard** in production (no silent in-memory fallback)
16. **Add jitter to API client retries**
17. **Populate missing LatAm/Asia regional YAML**
18. **Add chaos engineering tests**
19. **Raise intelligence branch coverage** from 57% to 70%+
20. **Add changesets** to protocols and intelligence
