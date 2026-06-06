---
title: 'gtcx-core Trust Portal'
status: current
date: 2026-06-05
owner: protocol-architect
role: protocol-architect
tier: standard
tags: ['documentation', 'governance', 'trust-portal']
review_cycle: on-change
---

# gtcx-core Trust Portal

> **Status:** Current
> **Date:** 2026-05-22
> **Owner:** Protocol Architect
> **Hosted at:** [gtcx-protocol.gitbook.io/gtcx-open-source](https://gtcx-protocol.gitbook.io/gtcx-open-source/governance/trust-portal) — see [hosting runbook](../operations/trust-portal-hosting.md)

**Audience:** vendor risk teams, sandbox regulators, design partners, security auditors
**What this is:** the evidence index for evaluating gtcx-core's security posture without an NDA. Everything linked here is in this repository — every artifact is independently verifiable.

**Tier 5 technical artifacts (DTF-5.5.5):** [audit evidence index](../audit/evidence/README.md#tier-5-technical-exit-register-dtf-555) — KATs, load bench JSON, minerals-board UAT, circuit registry, protocols E2E witness.
**What this is not:** marketing. There are no claims here that aren't backed by a file path or a git command you can run.

---

## Bottom line — at a glance

`gtcx-core` is a cryptographic foundation library (TypeScript + Rust) consumed by 14+ products across the GTCX ecosystem. As of 2026-05-21:

- **Composite readiness: 9.5 / 10.** Internal completion audit closes 24 of 24 items.
- **Cryptography: FIPS-validated** via aws-lc-rs (CMVP #4816). 63/63 Rust tests pass under `--features fips`.
- **Coverage: 19 / 19 testable packages ≥ 95% branch.** Mock-binding tests close `@gtcx/crypto-native` to 99.07%.
- **Fuzz: 500,000+ iterations across 6 cargo-fuzz targets, zero crashes, zero panics, zero ASAN violations.**
- **Key custody: HSM-backed via PKCS11 + AWS KMS.** NIST SP 800-57 lifecycle (Created → Active → Rotated → Revoked → Destroyed).
- **Supply chain: SLSA Source L2 enforced** in CI; **npm Sigstore provenance on 22/22 public packages** (21 core + `@gtcx/ai-eval`); manifest per release via `pnpm provenance:generate`.
- **External attestation: pen test contracted, vendor outreach in flight; SOC 2 Type 1 letter targeted 2026-09-15.**

A reviewer who only reads this section has enough to make a procurement decision. The sections below are the underlying evidence each claim above is anchored to — every link points at a specific file in the canonical `gtcx-core` repo, viewable with no NDA.

---

## Current readiness (2026-05-21)

| Dimension                | Value                           | Evidence                                                                                                                             |
| ------------------------ | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Composite readiness      | **9.5 / 10**                    | [Internal Completion Audit 2026-05-21](../audit/internal-completion-audit-2026-05-21.md)                                             |
| Internal items complete  | 24 / 24                         | Same                                                                                                                                 |
| Branch coverage          | 19 / 19 packages ≥ 95%          | [Audit coverage table](../audit/internal-completion-audit-2026-05-21.md#updated-coverage-table)                                      |
| Fuzz iterations          | 500,000+ across 6 targets       | [Fuzz Campaign Evidence 2026-05-21](../audit/fuzz-campaign-evidence-2026-05-21.md) — zero crashes, zero panics, zero ASAN violations |
| FIPS validation          | aws-lc-rs CMVP #4816            | 63 / 63 Rust tests passing under `--features fips`                                                                                   |
| HSM custody              | PKCS11 + AWS KMS                | NIST SP 800-57 lifecycle (Created → Active → Rotated → Revoked → Destroyed)                                                          |
| Release pipeline         | SLSA Source L2 + npm provenance | `.github/workflows/release.yml` — `publish-packages-provenance.mjs`; verify `pnpm provenance:check-npm:strict`                       |
| Active execution program | 4-sprint engagement roadmap     | [Engagement Readiness Sprint Roadmap 2026-05-22](../agile/roadmap/engagement-readiness-sprint-roadmap-2026-05-22.md)                 |

---

## Published versions

> **Status (2026-06-03):** **22 public `@gtcx/*` packages** on npm, all with **Sigstore provenance** at the versions below ([core train 26778909174](https://github.com/gtcx-ecosystem/gtcx-core/actions/runs/26778909174); [ai-eval 26891411936](https://github.com/gtcx-ecosystem/gtcx-core/actions/runs/26891411936)). **Provenance baseline:** pin these versions or newer. **Older npm releases** (e.g. `3.1.3`, `ai-eval@0.1.2`) lack registry attestations.

| Package               | npm version (provenance baseline) | Provenance | Source                                                                                     |
| --------------------- | --------------------------------- | ---------- | ------------------------------------------------------------------------------------------ |
| `@gtcx/types`         | 3.1.4                             | Yes        | [npmjs.com/package/@gtcx/types](https://www.npmjs.com/package/@gtcx/types)                 |
| `@gtcx/crypto`        | 3.1.4                             | Yes        | [npmjs.com/package/@gtcx/crypto](https://www.npmjs.com/package/@gtcx/crypto)               |
| `@gtcx/crypto-native` | 0.4.4                             | Yes        | [npmjs.com/package/@gtcx/crypto-native](https://www.npmjs.com/package/@gtcx/crypto-native) |
| `@gtcx/schemas`       | 3.1.4                             | Yes        | [npmjs.com/package/@gtcx/schemas](https://www.npmjs.com/package/@gtcx/schemas)             |
| `@gtcx/utils`         | 0.2.5                             | Yes        | [npmjs.com/package/@gtcx/utils](https://www.npmjs.com/package/@gtcx/utils)                 |
| `@gtcx/domain`        | 3.1.4                             | Yes        | [npmjs.com/package/@gtcx/domain](https://www.npmjs.com/package/@gtcx/domain)               |
| `@gtcx/security`      | 3.1.4                             | Yes        | [npmjs.com/package/@gtcx/security](https://www.npmjs.com/package/@gtcx/security)           |
| `@gtcx/verification`  | 3.1.4                             | Yes        | [npmjs.com/package/@gtcx/verification](https://www.npmjs.com/package/@gtcx/verification)   |
| `@gtcx/identity`      | 3.1.4                             | Yes        | [npmjs.com/package/@gtcx/identity](https://www.npmjs.com/package/@gtcx/identity)           |
| `@gtcx/api-client`    | 0.4.5                             | Yes        | [npmjs.com/package/@gtcx/api-client](https://www.npmjs.com/package/@gtcx/api-client)       |
| `@gtcx/connectivity`  | 0.5.4                             | Yes        | [npmjs.com/package/@gtcx/connectivity](https://www.npmjs.com/package/@gtcx/connectivity)   |
| `@gtcx/logging`       | 0.3.3                             | Yes        | [npmjs.com/package/@gtcx/logging](https://www.npmjs.com/package/@gtcx/logging)             |
| `@gtcx/network`       | 0.2.4                             | Yes        | [npmjs.com/package/@gtcx/network](https://www.npmjs.com/package/@gtcx/network)             |
| `@gtcx/sync`          | 0.3.3                             | Yes        | [npmjs.com/package/@gtcx/sync](https://www.npmjs.com/package/@gtcx/sync)                   |
| `@gtcx/resilience`    | 0.2.3                             | Yes        | [npmjs.com/package/@gtcx/resilience](https://www.npmjs.com/package/@gtcx/resilience)       |
| `@gtcx/telemetry`     | 0.2.3                             | Yes        | [npmjs.com/package/@gtcx/telemetry](https://www.npmjs.com/package/@gtcx/telemetry)         |
| `@gtcx/runtime`       | 0.2.5                             | Yes        | [npmjs.com/package/@gtcx/runtime](https://www.npmjs.com/package/@gtcx/runtime)             |
| `@gtcx/events`        | 1.0.3                             | Yes        | [npmjs.com/package/@gtcx/events](https://www.npmjs.com/package/@gtcx/events)               |
| `@gtcx/workproof`     | 1.0.4                             | Yes        | [npmjs.com/package/@gtcx/workproof](https://www.npmjs.com/package/@gtcx/workproof)         |
| `@gtcx/services`      | 1.0.5                             | Yes        | [npmjs.com/package/@gtcx/services](https://www.npmjs.com/package/@gtcx/services)           |
| `@gtcx/ai`            | 0.3.4                             | Yes        | [npmjs.com/package/@gtcx/ai](https://www.npmjs.com/package/@gtcx/ai)                       |
| `@gtcx/ai-eval`       | 0.1.4                             | Yes        | [npmjs.com/package/@gtcx/ai-eval](https://www.npmjs.com/package/@gtcx/ai-eval)             |

### Verifying any version independently

Anyone can verify the current published surface end-to-end with no NDA, no clone:

```bash
# All public packages at provenance-baseline versions (clone gtcx-core first)
pnpm provenance:check-npm:strict

# Single-package attestation URL (example: linked core @ 3.1.4)
npm view @gtcx/crypto@3.1.4 --json | jq -r '.dist.attestations.url'
```

The provenance attestation URL is the durable record of _how_ each package was built — workflow name, commit SHA, build environment. Requires **public** `gtcx-ecosystem/gtcx-core` and `npm publish --provenance` from `release.yml`.

---

## Quick orientation

`gtcx-core` is the cryptographic foundation library for the GTCX ecosystem. It exports cryptographic primitives, identity types, verification protocols, and observability tooling that 6+ downstream products depend on. It runs as library code inside the consumer's process — no service surface, no deployment runtime, no PII processing.

Three reference posture artifacts:

- [Security posture one-pager](../gtm/01-security-posture.md) — what a regulator reads first
- [SOC 2 Type 1 readiness gap analysis](../compliance/soc2-readiness.md) — controls mapped to AICPA TSC
- [Threat model](../security/threat-model.md) — STRIDE + attack actors + mitigations

---

## What you can verify in 5 minutes

Run these commands against this repo to confirm the claims below — no source-reading required.

| Claim                                       | Verification                                                                        |
| ------------------------------------------- | ----------------------------------------------------------------------------------- |
| 0 known vulnerabilities in dependencies     | `pnpm audit --audit-level=high`                                                     |
| Zero unsafe Rust across all crates          | `cd rust && grep -L 'deny(unsafe_code)' */03-platform/src/lib.rs` (returns nothing) |
| Crypto deps are content-hash pinned         | `pnpm security:crypto-deps`                                                         |
| Operational prerequisites configured        | `pnpm ops:check`                                                                    |
| Architecture boundary discipline            | `pnpm architecture:check`                                                           |
| All 22 packages compile                     | `pnpm typecheck`                                                                    |
| Reproducible build for at least one package | `pnpm build:reproducible --package=@gtcx/utils`                                     |

Each command exits non-zero if the claim fails. CI runs all of them on every PR.

---

## What you can verify in 30 minutes

Read these primary documents in order. They are mutually reinforcing — together they describe the security model end-to-end.

1. [Threat model](../security/threat-model.md) — STRIDE table, threat actors, attack scenarios, control mappings
2. [Attack tree for signature forgery](../security/attack-tree-signing.md) — adversarial decomposition with mitigations
3. [Internal security assessment](../security/internal-security-assessment.md) — six assessment methods: SAST, dependency audit, secret scan, fuzz, threat modeling, and architecture enforcement
4. [FIPS validation boundary](../security/fips-validation-boundary.md) — algorithm mapping and CMVP inheritance via OpenSSL #4282 for TypeScript and AWS-LC #4816 for Rust
5. [Key ceremony](../security/key-ceremony.md) — NIST SP 800-57 lifecycle, key tier model, emergency revocation
6. [Cloud KMS keystore](../security/cloud-kms-keystore.md) — AWS-first cloud-managed custody path behind `cargo --features cloud_kms`
7. [Fuzz campaign results](../../quality/fuzz-results/campaign-summary.md) — 9.9M executions, 0 crashes across 6 targets with AddressSanitizer enabled
8. [External penetration test scope](../security/pen-test-scope.md) — vendor-ready scope for third-party validation
9. [Dual-AI CODEOWNER governance](../01-agents/governance/README.md) — schema + prompt + 3 playbooks; the bot is structurally forbidden from approving

---

## Machine-readable trust artifacts (roadmap)

**Status:** `@gtcx/ai-eval` baseline shipped; per-release scorecard attachment **planned Q2 2026**.

GTCX is adding a **JSON AI scorecard** (`pnpm ai:evaluate`) to every release evidence bundle. The scorecard quantifies agent accuracy, safety (diff scan against [`safety-rules.json`](../01-agents/safety-rules.json)), efficiency, and context utilization. Regulators and vendor-risk teams can diff scorecards across versions without re-running the full test matrix.

| Artifact                      | Purpose                              | When available                            |
| ----------------------------- | ------------------------------------ | ----------------------------------------- |
| `artifacts/ai-scorecard.json` | Per-build trust score (4 dimensions) | Every CI run (`ci-ai-scorecard` artifact) |
| GA evidence summary           | Scorecard freshness gate             | `pnpm release:ga:evidence:check`          |

**Why it matters:** Crypto libraries are commoditized; **governance-encoded, machine-checkable trust per release** is the moat. See [roadmap §4.10](../roadmap.md#410-gtcxai-eval--machine-readable-trust-scorecards-strategic-moat) and [full-audit-2026-06-01](../audit/full-audit-2026-06-01.md).

**Verify locally today:**

```bash
pnpm ai:evaluate --output artifacts/ai-scorecard.json
node ./03-platform/tools/check-ai-scorecard.mjs
```

Download the latest scorecard from a passing CI run: workflow **CI** → artifact **ci-ai-scorecard**.

---

## ZKP circuit registry (DTF-5.4.3)

Full registry table, off-circuit policy, and verify-throughput evidence: **[trust-portal-zkp-circuit-registry.md](./trust-portal-zkp-circuit-registry.md)**.

---

## What requires engagement

A vendor risk team or sandbox regulator that needs more than self-service can engage on:

- **External penetration test** — currently substituted by the [internal security assessment](../security/internal-security-assessment.md). That assessment combines six methods plus a 9.9M-execution fuzz campaign with ASAN. External pen test is in the budget-readiness plan; ~$8K-$25K. Scope is prewritten in [External penetration test scope](../security/pen-test-scope.md).
- **SOC 2 Type 1 attestation letter** — readiness gap closed at 78-85% across applicable TSC; CPA engagement required for formal letter. Typical effort: ~$15K-$45K over 8-10 weeks. See [readiness analysis](../compliance/soc2-readiness.md).
- **Custom security questionnaire response** — the [evidence inventory](../gtm/04-evidence-inventory.md) maps existing artifacts to common questionnaire categories. Most rows answer with a path; a small number require process documentation.

---

## Controls matrix and evidence

NIST/SOC 2 controls matrix, evidence-by-category index, and live `pnpm ops:check` state: **[trust-portal-evidence.md](./trust-portal-evidence.md)**.

---

## How to engage

For procurement / vendor risk:

1. Read this page + [security posture one-pager](../gtm/01-security-posture.md) + [SOC 2 readiness](../compliance/soc2-readiness.md). 30 minutes.
2. Run the verification commands above against a fresh checkout. 10 minutes.
3. Send a security questionnaire to `security@gtcx.trade`. We respond by mapping each row to an artifact above; a small number require process formalization.

For sandbox regulators (Africa-tier financial regulators reviewing the library for embedded use):

1. Read the [executive brief](../gtm/00-executive-brief.md) + [evidence inventory](../gtm/04-evidence-inventory.md) + [sandbox submission guide](../gtm/05-sandbox-submission-guide.md).
2. Specific market briefs live at [`01-docs/08-gtm/`](../gtm/). Current priority markets are Zimbabwe, Namibia, Zambia, DRC, and Ghana.

For design partners / pilot deployments:

1. Same materials above, plus a technical kickoff call to walk through integration points.
2. The library has six known downstream consumers in the GTCX ecosystem; reference deployments available under NDA.

---

## What we'll build but haven't yet

Honest list of trust artifacts not yet in place. Surfaces them rather than letting a regulator discover the absence:

- **External penetration test** — internal assessment is in place; external pen test budgeted but not yet engaged. Scope is ready at [External penetration test scope](../security/pen-test-scope.md).
- **SOC 2 Type 1 letter** — readiness analysis complete; CPA engagement is the next step (8-10 weeks from start)
- ~~**PKCS#11 / Cloud KMS keystore backend**~~ — **DONE.** `Pkcs11KeyStore` ships behind `cargo --features pkcs11`, and `CloudKmsKeyStore` now ships behind `cargo --features cloud_kms` for AWS-first ECDSA P-256 custody. See [`01-docs/09-security/pkcs11-keystore.md`](../security/pkcs11-keystore.md) and [`01-docs/09-security/cloud-kms-keystore.md`](../security/cloud-kms-keystore.md).
- ~~**SLSA Level 3 attestation + Source Level 2**~~ — **DONE.** `pnpm release` produces SLSA Build Level 3 provenance via `npm publish --provenance` + GitHub OIDC. SLSA Source Level 2 is also enforced: signed commits are required on `main` via branch protection `required_signatures: true`. See [`01-docs/09-security/slsa-attestation.md`](../security/slsa-attestation.md).
- **Reference customer case study** — gtcx-core is consumed by 6 internal repos; first external case study lands after Sprint 4 sandbox engagement

---

## Cross-references — single source of truth

This portal is the entry point. The artifacts it points to are the source of truth. If a claim on this page conflicts with the underlying file, the underlying file wins. To suggest a correction, open a PR — every change to this directory is dual-reviewed by a human CODEOWNER and the AI CODEOWNER.

| Document                                                                    | Purpose                                 |
| --------------------------------------------------------------------------- | --------------------------------------- |
| [Threat model](../security/threat-model.md)                                 | STRIDE, threat actors, attack scenarios |
| [Attack tree](../security/attack-tree-signing.md)                           | Adversarial decomposition               |
| [Internal security assessment](../security/internal-security-assessment.md) | Six assessment methods, residual risk   |
| [FIPS validation boundary](../security/fips-validation-boundary.md)         | Inherited validation via CMVP #4816     |
| [Key ceremony](../security/key-ceremony.md)                                 | NIST SP 800-57 lifecycle                |
| [Cloud KMS keystore](../security/cloud-kms-keystore.md)                     | AWS-first cloud-managed key custody     |
| [External penetration test scope](../security/pen-test-scope.md)            | Third-party validation scope            |
| [SOC 2 readiness](../compliance/soc2-readiness.md)                          | TSC mapping, 7 documented gaps          |
| [GDPR / PCI / SOX](../compliance/)                                          | Compliance scope determinations         |
| [SECURITY.md](../../SECURITY.md)                                            | Public disclosure policy                |
| [SECURITY-INCIDENT.md](../security/security-incident-runbook.md)            | Internal response runbook               |
| [Governance](../01-agents/governance/README.md)                             | Dual-AI CODEOWNER pattern               |
| [Repo bootstrap](../operations/repo-bootstrap.md)                           | Live operational prerequisites          |
| [GTM evidence pack](../gtm/)                                                | Sandbox-regulator-specific materials    |
| [Full audit](../audit/full-audit-2026-06-04.md)                             | Six-phase audit (2026-06-04)            |
| [ZKP circuit registry](./trust-portal-zkp-circuit-registry.md)              | Profile IDs, KAT, throughput (DTF-5.4)  |
| [Controls and evidence](./trust-portal-evidence.md)                         | NIST/SOC 2 matrix + evidence categories |

## Changelog

- **1.1.0** (2026-06-03) — DTF-5.4.3: ZKP circuit ID column (registry snapshot), off-circuit policy disclosure, verify load-test evidence link (DTF-5.4.2).
- **1.0.0** (2026-05-10) — Initial trust portal. Five-minute, thirty-minute, and engagement-required tiers. Controls matrix mapping to NIST SP 800-53 and SOC 2 TSC. Honest "what we haven't yet built" section.
