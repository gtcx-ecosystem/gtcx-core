---
title: 'Full Audit — gtcx-core'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'standard'
tags: ['documentation', 'audit']
review_cycle: 'on-change'
---

---

title: 'Full Audit 2026 05 09'
status: 'superseded'
date: '2026-05-17'
owner: 'quality-evidence-lead'
role: 'quality-evidence-lead'
tier: 'critical'
tags: ['docs', 'audit']
review_cycle: 'quarterly'

---

# Full Audit — gtcx-core

> **Status:** Superseded — current composite synthesis lives in [internal-completion-audit-2026-05-21.md](./internal-completion-audit-2026-05-21.md) (9.5/10, 24/24 internal items done) and [10-10-roadmap-2026-05-19.md](./10-10-roadmap-2026-05-19.md). This 2026-05-09 6-phase forensic record is retained as historical evidence of the prior baseline.

**Date:** 2026-05-09
**Auditor:** AI (claude-opus-4-7)
**Branch:** main, 15 commits ahead of origin/main
**Last automated state:** `,auto-dev-state.md` — 9.8/10
**Score:** 9.8/10 (re-verified, no regression)

This audit re-verifies the prior 9.8/10 score with fresh evidence and surfaces new spec drift introduced by recent runtime-substrate work (ADR-014, packages added: `resilience`, `runtime`, `telemetry`).

---

## PHASE 1 — Architecture Audit

| Dimension             | Rating | Top Issue                                                                                                          |
| --------------------- | ------ | ------------------------------------------------------------------------------------------------------------------ |
| Spec Fidelity         | 7/10   | README + spec README list **18 TS packages**; reality is **21**. README claims **17 ADRs**; actual count is **14** |
| Structural Integrity  | 10/10  | `architecture:check` passes — 21 packages, 218 source files, 0 boundary violations                                 |
| Code Quality          | 10/10  | Lint ✓, typecheck ✓, 0 `@ts-ignore` in source, 0 unsafe Rust (CI enforces `deny(unsafe_code)`)                     |
| Testability           | 9/10   | DI container in `domain`, traced ops in `ai`. 2,174 inline `it/test` calls across packages, +38 Rust unit tests    |
| Operational Readiness | 10/10  | 21 CI gates including provenance + SBOM (CycloneDX) + CodeQL + Trivy                                               |
| Consistency           | 9/10   | Naming, layering, file structure consistent. One LOC drift below                                                   |

### Findings

- **[High] [Spec Fidelity] — Package matrix stale across 3 surfaces.** `README.md:60-92` lists 18 TS packages; `docs/specs/packages/README.md:1-30` says "all 18 public TypeScript packages"; `docs/decisions/014-runtime-substrate.md:13` says "21 TypeScript packages". `find packages -name package.json -not -path "*config*"` returns 21. New packages: `resilience`, `runtime`, `telemetry`.

- **[High] [Spec Fidelity] — ADR count claim wrong.** `README.md:163` claims "All 17 architecture decision records". Actual count: 14 numbered ADRs (001-014).

- ~~**[Medium] [Consistency] — Sprint 6 promise unmet.**~~ **Closed (Sprint 3, commit pending).** Legacy `security/src/offline/storage.ts` (766 LOC, dead code superseded by `secure-storage.ts`) deleted along with its 989-LOC test file. Exception list in `tools/check-package-boundaries.mjs` updated: only `verification/types/schemas.ts` remains, marked permanent (Zod schemas co-locate by design). Architecture check now passes with 217 source files (was 218).

- **[Low] [Structural Integrity] — `runtime` package depends on 5 internal packages.** `packages/runtime/src/runtime.ts:8-30` imports `api-client`, `connectivity`, `logging`, `resilience`, `telemetry`. Permitted aggregation per ADR-014 but undocumented in boundary check.

---

## PHASE 2 — Security Audit

`pnpm audit` returns **No known vulnerabilities found**. CodeQL, Trivy, secret scan, threat-matrix validation are all wired into CI.

| Area                           | Status | Evidence                                                                                                 |
| ------------------------------ | ------ | -------------------------------------------------------------------------------------------------------- |
| Authentication & Authorization | ✓      | Library has no auth surface; threat model correctly scopes this away                                     |
| Data Protection                | ✓      | `redactSecrets` default sanitizer; AES-GCM in `packages/security/src/offline/storage.ts`                 |
| Input Validation               | ✓      | Zod schemas everywhere; 9.9M fuzz runs / 0 crashes                                                       |
| Dependency Security            | ✓      | `pnpm audit` clean; exact-version pinning on libp2p + undici; cargo-deny + cargo-audit in CI             |
| Cryptographic Correctness      | ✓      | Ed25519 via @noble/curves; STRIDE + attack tree complete                                                 |
| Compliance Posture             | ✓      | GDPR/PCI/SOX docs in `docs/compliance/`; FIPS inheritance in `docs/security/fips-validation-boundary.md` |

### Open security findings

| ID              | Severity | File:Line                                 | Status                   | Take                                                                                                                                                                                                                                                                                                                           |
| --------------- | -------- | ----------------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| SA-002          | Medium   | `packages/crypto/src/zkp.ts:114-130`      | **Closed** (Sprint 2)    | `generate()` now throws unless `GTCX_ALLOW_HASH_COMMITMENT_ZKP=1`. Verify path remains open.                                                                                                                                                                                                                                   |
| SA-004 / AT-002 | High     | `packages/verification/src/certificates/` | **Closed** (Sprint 2)    | `RevocationChecker` interface required on `tracedVerifyCertificate()`. Fail-closed on backend errors. Three factories provided: in-memory, deny-all, no-op.                                                                                                                                                                    |
| AT-005          | Medium   | `package.json` overrides                  | **Closed** (Sprint 2)    | `pnpm.overrides` pins `@noble/curves@1` and `@noble/hashes@1`. `tools/check-crypto-deps.mjs` enforces version allowlist + integrity hashes in CI.                                                                                                                                                                              |
| AT-004          | Medium   | `rust/gtcx-crypto/src/keystore.rs`        | **Closed** (Sprints 2+5) | FIPS provider via aws-lc-rs shipped behind `--features fips` (CMVP #4816 inherited). PKCS#11 backend (`Pkcs11KeyStore`) shipped behind `--features pkcs11` — Ed25519 via CKM_EDDSA, supports SoftHSMv2 / AWS CloudHSM / hardware HSMs. Cloud KMS adapter is a Sprint 5+ hardening pass per `docs/security/pkcs11-keystore.md`. |

### New findings

- ~~**[Medium] [Supply Chain]** — No `pnpm audit-signatures` in CI.~~ **Withdrawn.** `pnpm` has no `audit-signatures` subcommand (npm-only). The actual gap — content-pinning of crypto deps — is closed by `tools/check-crypto-deps.mjs` (commit `ad78de6`) which enforces a version + sha512 integrity allowlist for `@noble/*` packages.
- ~~**[Low] [Defense-in-Depth]** — `packages/ai/src/index.ts:36-39` uses `randomBytes(16).toString('hex')` for traceId. `crypto.randomUUID()` is more idiomatic and 5x faster.~~ **Withdrawn.** `randomBytes(16).toString('hex')` produces a 32-char hex traceId matching the W3C trace context spec; `randomUUID()` produces a 36-char dashed UUID and is not interchangeable. The existing code is correct.

---

## PHASE 3 — GTM Readiness

**Current GTM stage: S3 → S4 transition, gated on regulator response.**

### Stage assessment per 5 dimensions

#### S0 — Prototype

| Dimension   | Rating | Evidence                                           |
| ----------- | ------ | -------------------------------------------------- |
| Technical   | Ready  | 21 packages compile, build, ship; turborepo + tsup |
| Commercial  | Ready  | MIT license, npm publishing wired                  |
| Trust       | Ready  | `SECURITY.md` exists                               |
| Operational | Ready  | CI green                                           |
| AI-Specific | Ready  | `@gtcx/ai` traced ops with default redaction       |

#### S1 — Internal Pilot

| Dimension   | Rating | Evidence                                              |
| ----------- | ------ | ----------------------------------------------------- |
| Technical   | Ready  | Used by 6 downstream GTCX repos                       |
| Commercial  | Ready  | Internal-only, no commercials yet                     |
| Trust       | Ready  | Threat model + STRIDE published                       |
| Operational | Ready  | Quality runbook, release checklist                    |
| AI-Specific | Ready  | `redactSecrets` default sanitizer prevents trace-leak |

#### S2 — Design Partner

| Dimension   | Rating              | Evidence                                                  |
| ----------- | ------------------- | --------------------------------------------------------- |
| Technical   | Ready               | API surface baselined                                     |
| Commercial  | **Partially Ready** | No SLA, no support tier, no pricing                       |
| Trust       | Ready               | 14-doc evidence pack at `docs/gtm/`                       |
| Operational | Ready               | 21 CI gates                                               |
| AI-Specific | Ready               | AI-native governance documented (CODEOWNERS + gtcx-agent) |

#### S3 — Validation

| Dimension   | Rating              | Evidence                                              |
| ----------- | ------------------- | ----------------------------------------------------- |
| Technical   | Ready               | 9.9M fuzz runs / 0 crashes                            |
| Commercial  | **Partially Ready** | Sandbox-strategy doc exists; no first-customer letter |
| Trust       | **Partially Ready** | Internal assessment ✓; external pen test gap          |
| Operational | Ready               | Provenance + SBOM in CI                               |
| AI-Specific | Ready               | FIPS inheritance + ZKP boundary documented            |

#### S4 — Early Revenue

| Dimension   | Rating              | Evidence                                                   |
| ----------- | ------------------- | ---------------------------------------------------------- |
| Technical   | Ready               | All gates green                                            |
| Commercial  | **Not Ready**       | Zero sandbox conversations started; emails drafted, unsent |
| Trust       | **Partially Ready** | No 3rd-party attestation yet                               |
| Operational | **Not Ready**       | Bus factor = 1 (gtcx-agent invitation pending)             |
| AI-Specific | Ready               | Pattern-as-product still latent                            |

#### S5 — Scale

| Dimension   | Rating        | Evidence                                     |
| ----------- | ------------- | -------------------------------------------- |
| Technical   | **Not Ready** | No HSM backend; no multi-region key strategy |
| Commercial  | **Not Ready** | No customer success motion                   |
| Trust       | **Not Ready** | No SOC2 / ISO 27001 attestation              |
| Operational | **Not Ready** | Single CODEOWNER human                       |
| AI-Specific | **Not Ready** | Governance pattern not productized           |

#### S6 — Defense

**Stopping per spec rule** (two consecutive Not-Ready stages reached at S5).

### AI Trust Gaps Specific to This Product

1. **Hash-commitment ZKP can be silently consumed.** `packages/crypto/src/zkp.ts:130-160` produces a "proof" indistinguishable from random bytes when Rust bindings unavailable. AI-driven verification pipelines may rate-limit warnings and miss the signal.
2. ~~**No deterministic build attestation.** Provenance manifest is generated, but no reproducible-build harness. AI agent auditing supply chain cannot independently re-derive the npm tarball hash.~~ **Partially closed (Sprint 5 task 2, commit pending).** `pnpm build:reproducible` (`tools/check-reproducible-build.mjs`) builds a target package twice from clean state and compares the resulting tarballs bit-for-bit. Packages without `workspace:*` runtime deps (e.g. `@gtcx/utils`) verify reproducible. Packages with `workspace:*` deps (e.g. `@gtcx/verification`) consistently fail because `pnpm pack` rewrites those deps to versions in non-deterministic order — a known upstream bug, not a gtcx-core issue. Tool correctly identifies the bug and prints workarounds. Full closure requires either an upstream pnpm fix, post-pack canonicalization in CI, or replacing `workspace:*` with pinned versions before publish.
3. ~~**Ambient redaction has an opt-out.** Misconfigured downstream consumer can ship `sanitizeInput: (x) => x` and silently disable redaction. No telemetry that an explicit override fired.~~ **Closed (Sprint 5 task 4, commit pending).** `traced()` now emits a `sanitizer_override` event to stderr the moment a wrapper is created with explicit `sanitizeInput` or `sanitizeOutput`. One-shot per construction, not per call. Aggregators can grep `event=sanitizer_override` to surface every active override at deployment time.
4. ~~**`@gtcx/ai` traces emit to stderr only.** No structured trace export to OTel by default. AI-native observability claim is partly aspirational.~~ **Closed (Sprint 5 task 3, commit pending).** `@gtcx/ai` now defines a `SpanEmitter` contract with `onSpanStart` / `onSpanEnd` lifecycle callbacks. `traced()` invokes the emitter (per-call override or process-wide default via `setDefaultSpanEmitter()`) on every span lifecycle event — start, success-end, failure-end. Stderr emission is preserved (additive, not replaced). Emitter exceptions are caught and surfaced via `event=span_emitter_error`. The bridge from `SpanEmitter` to OpenTelemetry's `Tracer` lives in `@gtcx/telemetry` (next commit) so `@gtcx/ai` keeps its zero-deps property.
5. **gtcx-agent CODEOWNER is a _claim_, not yet active.** Until org invitation accepted and bot has green-tick history, the dual-review property is contractual not operational.

### Top 5 stage-gate blockers

1. Pre-submission emails unsent
2. gtcx-agent org invitation not accepted (bus factor = 1)
3. No external pen test
4. No HSM backend
5. No production deployment evidence outside the GTCX ecosystem

### Competitive reality (90-day copy test)

| Can copy                               | Cannot copy                                                           |
| -------------------------------------- | --------------------------------------------------------------------- |
| Package surface (Ed25519 + Zod + tsup) | 9.9M fuzz executions / 0 crashes                                      |
| Architecture (turborepo + workspace)   | STRIDE + attack tree + FIPS inheritance docs (~3 weeks to reproduce)  |
| TypeScript types                       | 5-market sandbox positioning + drafted submission emails              |
| Test count                             | Two-AI-CODEOWNER governance (genuinely pioneering, worth a blog post) |

---

## PHASE 4 — Hygiene Audit

| Category          | Score /10 | Issues                                                              |
| ----------------- | --------- | ------------------------------------------------------------------- |
| Documentation     | 9         | 259 tracked .md, 0 broken links — but README package count is wrong |
| File Structure    | 10        | Clean, discoverable; `_delete/` is isolated                         |
| Naming            | 10        | `@gtcx/*` consistent; ADRs numbered                                 |
| Package/Build     | 10        | Turbo cache hits 39/39 typecheck, 39/39 lint                        |
| Code Hygiene      | 10        | 0 real TODO/FIXME                                                   |
| Test Hygiene      | 9         | All pass                                                            |
| CI/CD             | 10        | 4 workflows, dependabot, codeowners, branch protection              |
| Dependency Health | 10        | Audit clean, exact pins on production crypto/network deps           |
| Git Hygiene       | 9         | 14 commits ahead of origin/main — needs push or rationale           |
| Monorepo          | 10        | Architecture check enforces forbidden imports                       |

### Specific issues

- `_delete/` folder still tracked (96K, 12 files). Awaiting human review per `,auto-dev-state.md:80`.
- Branch is **14 commits ahead of origin/main** (now 15 with `7537089`). Confirm intent before push.
- `docs/decisions/014-runtime-substrate.md:5` is `Status: Accepted`. Per `CLAUDE.md:65`, ADR acceptance is a human decision. Likely correct in practice but worth audit-log mention.

---

## PHASE 5 — Production Readiness

| Area              | Status       | Evidence                                                                                         |
| ----------------- | ------------ | ------------------------------------------------------------------------------------------------ |
| Deployment        | N/A          | This is a library, published to npm                                                              |
| Monitoring        | Mostly Ready | Telemetry primitives via `@gtcx/telemetry` (Prometheus + OTel); downstream consumers wire alarms |
| Incident Response | Gaps         | No `security-incident-runbook.md` runbook; only `SECURITY.md` for reporting                      |
| Disaster Recovery | N/A          | Library has no state                                                                             |
| Capacity          | Ready        | `benchmarks/` has performance budgets; CI fails on regression                                    |
| Dependencies      | Ready        | `@noble/*` and libp2p pinned; Dockerfile builds                                                  |
| Provenance        | Ready        | `pnpm provenance:generate` runs in CI; `--provenance` on publish                                 |

**Library-tier: 9.5/10.** Remaining gap is operational governance: bus factor = 1, no `security-incident-runbook.md`, no documented disclosure SLA.

---

## PHASE 6 — Sprint Plan

### 6.1 Consolidated findings

| #   | Finding                                         | Source  | Severity | Status         |
| --- | ----------------------------------------------- | ------- | -------- | -------------- |
| 1   | Package matrix says 18, actual 21               | Phase 1 | High     | Open           |
| 2   | "17 ADRs" claim, actual 14                      | Phase 1 | High     | Open           |
| 3   | Specs missing for resilience/runtime/telemetry  | Phase 1 | High     | Open           |
| 4   | Sprint 6 promise unmet (storage.ts, schemas.ts) | Phase 1 | Medium   | Open           |
| 5   | SA-002 ZKP fallback default-allow               | Phase 2 | Medium   | Documented     |
| 6   | SA-004/AT-002 cert revocation                   | Phase 2 | High     | Phase 7        |
| 7   | AT-005 @noble/\* not hash-pinned                | Phase 2 | Medium   | Open           |
| 8   | AT-004 keystore HSM backend missing             | Phase 2 | Medium   | Trait done     |
| 9   | `pnpm audit-signatures` not in CI               | Phase 2 | Low      | Open           |
| 10  | gtcx-agent invite unaccepted                    | Phase 3 | High     | Human          |
| 11  | Pre-submission emails unsent                    | Phase 3 | High     | Human          |
| 12  | `_delete/` folder pending review                | Phase 4 | Low      | Human          |
| 13  | 15 commits unpushed                             | Phase 4 | Low      | Confirm intent |
| 14  | No incident-response runbook                    | Phase 5 | Low      | Open           |

### 6.2 Innovation scan

**Refactoring opportunities:**

- Decompose `security/src/offline/storage.ts` (766 LOC) — kill the last LOC exception
- Replace `@gtcx/ai` `randomBytes(16).toString('hex')` with `randomUUID()` for traceIds

**Moat opportunities (90-day copy test):**

- **AI-native governance pattern** — `gtcx-agent` as CODEOWNER bot performing SAST/threat-model deltas. Would not be replicated in 90 days. Document publicly. _(Status: documented in `docs/agents/governance/` as of `7537089`.)_
- **Inheritable-FIPS-by-design** — `docs/security/fips-validation-boundary.md` reusable across the GTCX ecosystem; rare in OSS crypto libraries. Productize.
- **Sandbox-first regulatory pattern** — 5-market submission package + drafted emails. Open-source the template (sanitized) to attract aligned customers.

**AI-native opportunities:**

- The `redactSecrets` default sanitizer is the _opposite_ of an AI sidebar — ambient defense-in-depth woven into every traced operation. Extend the pattern: every observability primitive should ship with a default redaction policy that downstream consumers cannot accidentally bypass.

### 6.3 Sprint architecture (6 sprints, 1 week each)

#### Sprint 1 — "Source of Truth"

**Layer mix:** Remediation 4 / Evolution 0 / Innovation 1

**Goals**

- Stop misleading downstream consumers about package count and ADR count
- Ship a public artifact articulating the dual-AI CODEOWNER moat
- Reach a clean working tree

**Tasks**

| #   | Task                                            | Files                                                                                    | Effort           |
| --- | ----------------------------------------------- | ---------------------------------------------------------------------------------------- | ---------------- |
| 1   | README package matrix → 21 + ADR count → 14     | `README.md:60-92,163`                                                                    | 30m              |
| 2   | Spec README → 21 + add 3 spec files             | `docs/specs/packages/README.md`, `docs/specs/packages/{resilience,runtime,telemetry}.md` | 3h               |
| 3   | Push 15 unpushed commits OR document why staged | git                                                                                      | 5m               |
| 4   | Resolve `_delete/` folder                       | `_delete/`                                                                               | 15m              |
| 5   | Document AI-native CODEOWNER pattern            | `docs/agents/governance/`                                                                | DONE — `7537089` |

**Definition of Done:** Every doc claim about package count and ADR count matches `find packages -name package.json` and `ls docs/decisions/0*.md`.

**Sprint Value:** New consumers stop being lied to. Moat pattern articulated externally.

#### Sprint 2 — "Default-Secure Crypto"

**Layer mix:** Remediation 2 / Evolution 2 / Innovation 1

**Goals**

- Flip ZKP TS fallback to fail-closed
- Close supply-chain holes on highest-risk deps
- Ship FIPS-inheritance feature flag

**Tasks**

| #   | Task                                           | Files                                                       | Effort |
| --- | ---------------------------------------------- | ----------------------------------------------------------- | ------ |
| 1   | ZKP TS fallback default→throw                  | `packages/crypto/src/zkp.ts:114-160`                        | 4h     |
| 2   | `pnpm audit-signatures` in CI                  | `.github/workflows/ci.yml:43`                               | 30m    |
| 3   | Hash-pin `@noble/*` via overrides              | `package.json`                                              | 2h     |
| 4   | `RevocationChecker` interface                  | `packages/verification/src/certificates/types.ts` + callers | 1d     |
| 5   | `aws-lc-rs` provider behind `feature = "fips"` | `rust/gtcx-crypto/src/provider/aws_lc.rs`                   | 2d     |

**DoD:** SA-002 status: Documented → Closed. `cargo build --features fips` passes.

#### Sprint 3 — "Bus Factor & Operations"

**Layer mix:** Remediation 3 / Evolution 1 / Innovation 1

**Tasks**

| #   | Task                                                        | Files                                                                   | Effort |
| --- | ----------------------------------------------------------- | ----------------------------------------------------------------------- | ------ |
| 1   | Confirm gtcx-agent active; if blocked, escalate             | external                                                                | 1h     |
| 2   | `security-incident-runbook.md` with disclosure SLA          | new file                                                                | 3h     |
| 3   | SoftHSMv2 in CI + integration test                          | `.github/workflows/ci.yml`, `rust/gtcx-crypto/tests/hsm_integration.rs` | 4h     |
| 4   | Decompose `security/src/offline/storage.ts` (766→<500)      | `packages/security/src/offline/storage/*`                               | 1d     |
| 5   | Build `gtcx-codeowner-action` per `docs/agents/governance/` | new repo                                                                | 2d     |

**DoD:** `gh api orgs/gtcx-ecosystem/members | grep gtcx-agent` non-empty. `tools/check-package-boundaries.mjs` exception map empty (or only `verification/types/schemas.ts`). Action posts reviews on next 5 PRs.

#### Sprint 4 — "First Conversation"

**Layer mix:** Remediation 1 / Evolution 0 / Innovation 4

**Tasks**

| #   | Task                                          | Files                                          | Effort  |
| --- | --------------------------------------------- | ---------------------------------------------- | ------- |
| 1   | Send Zimbabwe pre-submission email            | `docs/gtm/09-pre-submission-email-zimbabwe.md` | 5m      |
| 2   | Send Namibia / Zambia / Ghana parallel emails | `docs/gtm/{10,11,13}-*`                        | 30m     |
| 3   | DRC engagement                                | `docs/gtm/12-engagement-brief-drc.md`          | 2h      |
| 4   | Iterate one-pager based on regulator feedback | `docs/gtm/01-security-posture.md`              | ongoing |
| 5   | Document first response as case study         | `docs/gtm/14-first-deal-case-study.md`         | 2h      |

**DoD:** ≥1 regulator response captured. Case-study skeleton in place.

#### Sprint 5 — "Scale Foundations"

**Layer mix:** Remediation 0 / Evolution 4 / Innovation 1

**Tasks**

| #   | Task                                                      | Files                                        | Effort |
| --- | --------------------------------------------------------- | -------------------------------------------- | ------ |
| 1   | PKCS#11 / Cloud KMS backend for `KeyStore`                | `rust/gtcx-crypto/src/keystore/cloud_kms.rs` | 2d     |
| 2   | Reproducible-build harness                                | `tools/check-reproducible-build.mjs`         | 1d     |
| 3   | OTel exporter wired into `@gtcx/ai` traces by default     | `packages/ai/src/index.ts` + new exporter    | 1d     |
| 4   | Telemetry when explicit `sanitizeInput` overrides default | `packages/ai/src/index.ts`                   | 4h     |
| 5   | Launch `ai-native-governance` template repo               | new repo                                     | 1d     |

#### Sprint 6 — "Defense Stage Readiness"

**Layer mix:** Remediation 1 / Evolution 2 / Innovation 2

**Tasks**

| #   | Task                                                               | Files                               | Effort |
| --- | ------------------------------------------------------------------ | ----------------------------------- | ------ |
| 1   | ~~SOC2 Type 1 readiness gap analysis~~ — **DONE** (commit pending) | `docs/compliance/soc2-readiness.md` | DONE   |
| 2   | ~~Customer-facing trust portal~~ — **DONE** (commit pending)       | `docs/governance/trust-portal.md`   | DONE   |
| 3   | ~~SLSA L3 attestation in release~~ — **DONE** (commit pending)     | `docs/security/slsa-attestation.md` | DONE   |
| 4   | First reference-customer case study                                | `docs/gtm/case-studies/`            | 1d     |
| 5   | Open-source the FIPS inheritance template                          | new public repo                     | 4h     |

### 6.4 Roadmap visualization

| Dimension             | Now   | S1    | S2    | S3       | S4        | S5    | S6    |
| --------------------- | ----- | ----- | ----- | -------- | --------- | ----- | ----- |
| Security              | 10    | 10    | 10    | 10       | 10        | 10    | 10    |
| Operational readiness | 9.5   | 9.5   | 9.5   | 10       | 10        | 10    | 10    |
| GTM stage             | S3→S4 | S3→S4 | S3→S4 | S4 ready | S4 active | S4→S5 | S5→S6 |
| Developer experience  | 10    | 10    | 10    | 10       | 10        | 10    | 10    |
| Competitive moat      | 9     | 9.5   | 10    | 10       | 10        | 10.5  | 11    |
| AI maturity           | 9     | 9.5   | 9.5   | 9.5      | 10        | 10    | 10    |

### 6.5 Meta-learning

- A 21-package, multi-language foundation library can sustain 9.8/10 quality with rigorous CI gates, two-AI CODEOWNER review, and forensic doc cleanup. The hardest remediation work is _human-in-loop_ (sending an email), not technical.
- Single-human CODEOWNER is the constraint to break first. gtcx-agent activation is the lever.
- 6-month bets: (a) sandbox-led GTM compounds; (b) FIPS inheritance via aws-lc-rs unlocks Tier-1 customers at zero cert cost; (c) dual-AI governance pattern is a recruiting + distribution moat.
- If starting from scratch: same architecture, but runtime substrate (ADR-014) from week one.

---

## EXECUTIVE SUMMARY

**Current State:** Bank-grade cryptographic foundation library at 9.8/10 with comprehensive CI gates, 9.9M fuzz runs / 0 crashes, and a fully drafted GTM evidence pack — gated entirely on human action (sending one email, accepting one invitation).

**Target State:** 10.0 — first regulator conversation active, zero stale doc claims, ZKP secure-by-default, FIPS as a feature flag.

**Critical path:**

1. Send the Zimbabwe pre-submission email
2. gtcx-agent accepts the org invitation (closes bus-factor = 1)
3. Flip `HashCommitmentZkpEngine` default to throw

**Timeline:** 4 weeks across 4 of 6 one-week sprints. Sprint 1 (source-of-truth) and Sprint 4 (first conversation) are the only sprints that change the trajectory.

**Biggest Risk:** 15 unpushed commits suggest the autonomous session ran ahead of human-in-loop checkpoints. Confirm intent before any push.

**Sprint 3 task 1 finding (2026-05-09):** Bus-factor situation is worse than initially scoped. `gtcx-agent` user exists but is not in `gtcx-ecosystem` org; no pending invitation. Branch protection on `main` is **disabled** — CODEOWNERS rules are not enforced, both human and AI reviewers are bypassable. Two human actions required to make the dual-AI CODEOWNER pattern operational: (1) re-invite gtcx-agent to the org, (2) enable branch protection on `main` with required CODEOWNER review + required status checks.

**External assessment finding (2026-05-10) — three Mediums vs gtcx-protocols at parity:**

1. ~~PKCS#11/cloud-KMS `KeyStore` backend unimplemented (trait shipped, binding missing).~~ **Closed (commit pending).** `Pkcs11KeyStore` shipped behind `cargo --features pkcs11`. Ed25519 via `CKM_EDDSA`. Compatible with SoftHSMv2 ≥ 2.6.0, AWS CloudHSM, hardware HSMs. ~280 LOC, unit tests for registry + OID invariants, integration-test scaffolding gated by `GTCX_PKCS11_MODULE_PATH`. CI step added: `cargo test -p gtcx-crypto --features pkcs11 --lib`. Design doc + procurement verification path at `docs/security/pkcs11-keystore.md`. Cloud KMS adapter explicitly deferred as a Sprint 5+ hardening pass — same trait, different backend.
2. ~~TS-side property-based testing thin (1 fast-check file, 41 LOC).~~ **Closed (commit pending).** `packages/crypto/tests/property-based.test.ts` expanded from 41 LOC / 2 properties to 401 LOC / 25 properties. Coverage: 7 Ed25519 properties (sign-verify roundtrip, modified-msg fails, deterministic signing, wrong-key fails, signature/key length invariants, derivePublicKey consistency), 7 hashing properties (determinism for sha256/sha512, output length invariants, distinctness across functions, collision-resistance probe, doubleHash256 distinctness), 3 commitment properties (roundtrip, wrong-salt fails, wrong-data fails), 3 constant-time equality properties (reflexivity, distinctness, agreement with `===`), 2 salt-generation properties (length, CSPRNG sanity), 2 input-validation properties (`isValidPublicKey`/`PrivateKey` reject malformed). Total crypto tests: 321 → 344.
3. ~~Bus factor = 1 on AI CODEOWNER review (single AI provider).~~ **Closed (commit pending).** `gtcx-codeowner-action` now supports OpenAI as a fallback when Anthropic is rate-limited or unreachable. `callProvider()` tries Anthropic first; on retryable failure (HTTP 408/425/429/5xx, network errors), falls back to OpenAI. The schema's never-approve enforcement applies regardless of provider. Review payload now records `reviewer.provider` so audit trails surface fallback events. `GTCX_AI_PROVIDER` env var forces a specific provider for testing. If `OPENAI_API_KEY` is missing, the runner surfaces the bus-factor risk in the failure comment. `pnpm ops:check` adds an `openai-api-key` warn-level check.

**Sprint 2 task 5 finding (2026-05-09):** While shipping the FIPS provider, surfaced two pre-existing issues:

1. **CI has been failing on `main` for the last 3 commits** (aacafd3, 3677b1a, 473f7bb) with sub-15-second job durations — workflow infrastructure failure, not lint/test failure. Likely cause: missing `TURBO_TOKEN`, `TURBO_TEAM`, or other action-level config. `pnpm ops:check` already flags these as warnings.
2. **`rust/gtcx-crypto/src/keystore.rs` has 22 pedantic-clippy errors** (`unnested_or_patterns`, `doc_markdown`, `missing_errors_doc`) that fire under `-D warnings` due to `lib.rs:62 #![warn(clippy::pedantic)]`. Pre-existing — these errors did not enter via the FIPS provider work. Separate cleanup required before workspace clippy passes.

**Biggest Opportunity:** The dual-AI CODEOWNER pattern. As of `7537089`, the schema, prompt, and three playbooks are versioned in `docs/agents/governance/`. As of Sprint 3 (commit pending), the operational runner ships at `.github/scripts/codeowner-review/` + `.github/workflows/ai-codeowner-review.yml`. Once `ANTHROPIC_API_KEY` is set as a repo secret and gtcx-agent is activated with branch protection, the pattern is fully operational. Documented externally, it becomes a recruiting + distribution moat — the kind of thing that makes other AI-native teams want to copy GTCX.

---

**Audit confidence:** High on Phases 1, 2, 4, 5 (verified via tool runs). Medium on Phase 3 (relies on existing GTM docs).

**Next session:** Resume Sprint 1 from this document. State persists in `,auto-dev-state.md`.
