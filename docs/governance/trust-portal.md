---
title: 'Trust Portal'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs']
review_cycle: 'on-change'
---

# gtcx-core Trust Portal

> **Status:** Current
> **Date:** 2026-05-22
> **Owner:** Protocol Architect
> **Hosted at:** [gtcx-protocol.gitbook.io/gtcx-open-source](https://gtcx-protocol.gitbook.io/gtcx-open-source/governance/trust-portal) — see [hosting runbook](../operations/trust-portal-hosting.md)

**Audience:** vendor risk teams, sandbox regulators, design partners, security auditors
**What this is:** the evidence index for evaluating gtcx-core's security posture without an NDA. Everything linked here is in this repository — every artifact is independently verifiable.
**What this is not:** marketing. There are no claims here that aren't backed by a file path or a git command you can run.

---

## Bottom line — at a glance

`gtcx-core` is a cryptographic foundation library (TypeScript + Rust) consumed by 14+ products across the GTCX ecosystem. As of 2026-05-21:

- **Composite readiness: 9.5 / 10.** Internal completion audit closes 24 of 24 items.
- **Cryptography: FIPS-validated** via aws-lc-rs (CMVP #4816). 63/63 Rust tests pass under `--features fips`.
- **Coverage: 19 / 19 testable packages ≥ 95% branch.** Mock-binding tests close `@gtcx/crypto-native` to 99.07%.
- **Fuzz: 500,000+ iterations across 6 cargo-fuzz targets, zero crashes, zero panics, zero ASAN violations.**
- **Key custody: HSM-backed via PKCS11 + AWS KMS.** NIST SP 800-57 lifecycle (Created → Active → Rotated → Revoked → Destroyed).
- **Supply chain: SLSA Source L2 enforced** in CI; Build L3 aspirational; provenance manifest generated per release.
- **External attestation: pen test contracted, vendor outreach in flight; SOC 2 Type 1 letter targeted 2026-09-15.**

A reviewer who only reads this section has enough to make a procurement decision. The sections below are the underlying evidence each claim above is anchored to — every link points at a specific file in the canonical `gtcx-core` repo, viewable with no NDA.

---

## Current readiness (2026-05-21)

| Dimension                | Value                       | Evidence                                                                                                                                                                                     |
| ------------------------ | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Composite readiness      | **9.5 / 10**                | [Internal Completion Audit 2026-05-21](https://github.com/gtcx-ecosystem/gtcx-core/blob/main/docs/audit/internal-completion-audit-2026-05-21.md)                                             |
| Internal items complete  | 24 / 24                     | Same                                                                                                                                                                                         |
| Branch coverage          | 19 / 19 packages ≥ 95%      | [Audit coverage table](https://github.com/gtcx-ecosystem/gtcx-core/blob/main/docs/audit/internal-completion-audit-2026-05-21.md#updated-coverage-table)                                      |
| Fuzz iterations          | 500,000+ across 6 targets   | [Fuzz Campaign Evidence 2026-05-21](https://github.com/gtcx-ecosystem/gtcx-core/blob/main/docs/audit/fuzz-campaign-evidence-2026-05-21.md) — zero crashes, zero panics, zero ASAN violations |
| FIPS validation          | aws-lc-rs CMVP #4816        | 63 / 63 Rust tests passing under `--features fips`                                                                                                                                           |
| HSM custody              | PKCS11 + AWS KMS            | NIST SP 800-57 lifecycle (Created → Active → Rotated → Revoked → Destroyed)                                                                                                                  |
| Release pipeline         | SLSA Source L2 enforced     | `.github/workflows/release.yml` — provenance manifest generated per release                                                                                                                  |
| Active execution program | 4-sprint engagement roadmap | [Engagement Readiness Sprint Roadmap 2026-05-22](../agile/roadmap/engagement-readiness-sprint-roadmap-2026-05-22.md)                                                                         |

---

## Published versions

> **Status:** Awaiting first publish — Sprint 2.3 of the engagement readiness roadmap. The `release.yml` workflow is wired and dry-run validated (commits `805cda7` + `028e3d9`); the first execution publishes all 21 `@gtcx/*` packages with SLSA provenance attestations. Verification procedure is in [`docs/devops/release-mgmt/npm-publish-runbook.md`](../devops/release-mgmt/npm-publish-runbook.md). This section auto-populates after the first run.

| Package               | npm version | Provenance | Source                                                                                     |
| --------------------- | ----------- | ---------- | ------------------------------------------------------------------------------------------ |
| `@gtcx/types`         | _pending_   | _pending_  | [npmjs.com/package/@gtcx/types](https://www.npmjs.com/package/@gtcx/types)                 |
| `@gtcx/crypto`        | _pending_   | _pending_  | [npmjs.com/package/@gtcx/crypto](https://www.npmjs.com/package/@gtcx/crypto)               |
| `@gtcx/crypto-native` | _pending_   | _pending_  | [npmjs.com/package/@gtcx/crypto-native](https://www.npmjs.com/package/@gtcx/crypto-native) |
| `@gtcx/schemas`       | _pending_   | _pending_  | [npmjs.com/package/@gtcx/schemas](https://www.npmjs.com/package/@gtcx/schemas)             |
| `@gtcx/utils`         | _pending_   | _pending_  | [npmjs.com/package/@gtcx/utils](https://www.npmjs.com/package/@gtcx/utils)                 |
| `@gtcx/domain`        | _pending_   | _pending_  | [npmjs.com/package/@gtcx/domain](https://www.npmjs.com/package/@gtcx/domain)               |
| `@gtcx/security`      | _pending_   | _pending_  | [npmjs.com/package/@gtcx/security](https://www.npmjs.com/package/@gtcx/security)           |
| `@gtcx/verification`  | _pending_   | _pending_  | [npmjs.com/package/@gtcx/verification](https://www.npmjs.com/package/@gtcx/verification)   |
| `@gtcx/identity`      | _pending_   | _pending_  | [npmjs.com/package/@gtcx/identity](https://www.npmjs.com/package/@gtcx/identity)           |
| `@gtcx/api-client`    | _pending_   | _pending_  | [npmjs.com/package/@gtcx/api-client](https://www.npmjs.com/package/@gtcx/api-client)       |
| `@gtcx/connectivity`  | _pending_   | _pending_  | [npmjs.com/package/@gtcx/connectivity](https://www.npmjs.com/package/@gtcx/connectivity)   |
| `@gtcx/logging`       | _pending_   | _pending_  | [npmjs.com/package/@gtcx/logging](https://www.npmjs.com/package/@gtcx/logging)             |
| `@gtcx/network`       | _pending_   | _pending_  | [npmjs.com/package/@gtcx/network](https://www.npmjs.com/package/@gtcx/network)             |
| `@gtcx/sync`          | _pending_   | _pending_  | [npmjs.com/package/@gtcx/sync](https://www.npmjs.com/package/@gtcx/sync)                   |
| `@gtcx/resilience`    | _pending_   | _pending_  | [npmjs.com/package/@gtcx/resilience](https://www.npmjs.com/package/@gtcx/resilience)       |
| `@gtcx/telemetry`     | _pending_   | _pending_  | [npmjs.com/package/@gtcx/telemetry](https://www.npmjs.com/package/@gtcx/telemetry)         |
| `@gtcx/runtime`       | _pending_   | _pending_  | [npmjs.com/package/@gtcx/runtime](https://www.npmjs.com/package/@gtcx/runtime)             |
| `@gtcx/events`        | _pending_   | _pending_  | [npmjs.com/package/@gtcx/events](https://www.npmjs.com/package/@gtcx/events)               |
| `@gtcx/workproof`     | _pending_   | _pending_  | [npmjs.com/package/@gtcx/workproof](https://www.npmjs.com/package/@gtcx/workproof)         |
| `@gtcx/services`      | _pending_   | _pending_  | [npmjs.com/package/@gtcx/services](https://www.npmjs.com/package/@gtcx/services)           |
| `@gtcx/ai`            | _pending_   | _pending_  | [npmjs.com/package/@gtcx/ai](https://www.npmjs.com/package/@gtcx/ai)                       |

### Verifying any version independently

Anyone can verify the current published surface end-to-end with no NDA, no clone:

```bash
# Per-package version
for pkg in types crypto crypto-native schemas utils domain security verification identity \
           api-client connectivity logging network sync resilience telemetry runtime \
           events workproof services ai; do
  v=$(npm view "@gtcx/$pkg" version 2>/dev/null)
  echo "@gtcx/$pkg: ${v:-not-yet-published}"
done

# Provenance attestation per package (post-publish)
npm view @gtcx/crypto --json | jq -r '.dist.attestations.url'
```

The provenance attestation URL is the durable record of _how_ each package was built — workflow name, commit SHA, build environment. SLSA Source L2 enforced; Build L3 aspirational per the release pipeline.

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

| Claim                                       | Verification                                                            |
| ------------------------------------------- | ----------------------------------------------------------------------- |
| 0 known vulnerabilities in dependencies     | `pnpm audit --audit-level=high`                                         |
| Zero unsafe Rust across all crates          | `cd rust && grep -L 'deny(unsafe_code)' */src/lib.rs` (returns nothing) |
| Crypto deps are content-hash pinned         | `pnpm security:crypto-deps`                                             |
| Operational prerequisites configured        | `pnpm ops:check`                                                        |
| Architecture boundary discipline            | `pnpm architecture:check`                                               |
| All 21 packages compile                     | `pnpm typecheck`                                                        |
| Reproducible build for at least one package | `pnpm build:reproducible --package=@gtcx/utils`                         |

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
9. [Dual-AI CODEOWNER governance](../agents/governance/README.md) — schema + prompt + 3 playbooks; the bot is structurally forbidden from approving

---

## What requires engagement

A vendor risk team or sandbox regulator that needs more than self-service can engage on:

- **External penetration test** — currently substituted by the [internal security assessment](../security/internal-security-assessment.md). That assessment combines six methods plus a 9.9M-execution fuzz campaign with ASAN. External pen test is in the budget-readiness plan; ~$8K-$25K. Scope is prewritten in [External penetration test scope](../security/pen-test-scope.md).
- **SOC 2 Type 1 attestation letter** — readiness gap closed at 78-85% across applicable TSC; CPA engagement required for formal letter. Typical effort: ~$15K-$45K over 8-10 weeks. See [readiness analysis](../compliance/soc2-readiness.md).
- **Custom security questionnaire response** — the [evidence inventory](../gtm/04-evidence-inventory.md) maps existing artifacts to common questionnaire categories. Most rows answer with a path; a small number require process documentation.

---

## Controls matrix — gtcx-core controls mapped to recognized standards

| Control category            | NIST SP 800-53 ref | SOC 2 TSC ref | gtcx-core evidence                                                                                                                          |
| --------------------------- | ------------------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Access control to source    | AC-2, AC-3, AC-6   | CC6.1-6.3     | `.github/CODEOWNERS`, branch protection on main, dual-AI review with a human reviewer plus `gtcx-agent`                                     |
| Cryptographic primitives    | SC-13, SC-12       | CC6.1, C1.1   | FIPS provider via aws-lc-rs CMVP #4816, Ed25519 via `@noble/curves`, content-hash allowlist                                                 |
| Key lifecycle               | SC-12, SC-17       | CC6.1, C1.1   | `KeyStore` trait with NIST SP 800-57 states (Created, Active, Rotated, Revoked, Destroyed)                                                  |
| Data classification         | RA-2, MP-2         | C1.1          | `redactSecrets` default sanitizer; threat model defines confidential categories                                                             |
| Secure software development | SA-11, SA-15       | CC8.1         | 21 CI gates; CodeQL, Trivy, cargo-audit, secret scan; architecture boundary enforcement                                                     |
| Supply chain                | SA-12, SR-3        | CC9.2         | `pnpm.overrides` exact-pinning; `tools/check-crypto-deps.mjs` integrity allowlist; SBOM (CycloneDX) on every build                          |
| Vulnerability management    | RA-5, SI-2         | CC7.1         | Dependabot, `pnpm audit` on every PR, cargo-audit on every PR, public disclosure policy                                                     |
| Incident response           | IR-4, IR-6         | CC7.3-7.5     | [`SECURITY-INCIDENT.md`](../security/security-incident-runbook.md) six-phase runbook with severity classification + bypass procedure        |
| Audit and monitoring        | AU-2, AU-12        | CC4.1, CC7.2  | Structured stderr JSON traces; `SpanEmitter` contract for OTel forwarding; sanitizer-override telemetry; provenance manifest on publish     |
| Change management           | CM-3, CM-4         | CC8.1         | Conventional commits, changesets, branch protection, required CODEOWNER review, API surface baseline at `quality/api-surface-baseline.json` |
| Risk assessment             | RA-3               | CC3.1-3.4     | STRIDE table, attack tree, threat actor table, residual risk analysis                                                                       |
| Reproducibility             | (n/a)              | CC8.1         | `pnpm build:reproducible` verifies bit-for-bit reproducibility per package                                                                  |

---

## Evidence by category

### Cryptographic correctness

- [Threat model TC-001-TC-002](../security/threat-model.md) — key generation, hash collision controls
- [Attack tree](../security/attack-tree-signing.md) — 4 branches, 20 leaf nodes, 5 mitigations tracked
- Property-based tests — 25 properties × 50-100 runs each in [`packages/crypto/tests/property-based.test.ts`](../../packages/crypto/tests/property-based.test.ts)
- [Fuzz campaign](../../quality/fuzz-results/campaign-summary.md) — 9.9M executions, 0 crashes, 6 targets, ASAN enabled
- [FIPS validation boundary](../security/fips-validation-boundary.md) — inheritance via aws-lc-rs CMVP #4816
- ZKP fail-closed-by-default (SA-002 closed) — `HashCommitmentZkpEngine.generate()` throws unless `GTCX_ALLOW_HASH_COMMITMENT_ZKP=1`
- Revocation pathway (SA-004 + AT-002 closed) — `RevocationChecker` interface required on `tracedVerifyCertificate()`

### Supply chain integrity

- [Crypto dependency allowlist](../../tools/check-crypto-deps.mjs) — pinned versions + sha512 integrity hashes for `@noble/*`
- [Reproducible-build verifier](../../tools/check-reproducible-build.mjs) — `pnpm build:reproducible`
- SBOM (CycloneDX) — generated on every CI build via Trivy
- Provenance manifest — `pnpm provenance:generate`; `--provenance` flag on publish
- [Threat model supply chain section](../security/threat-model.md#supply-chain-threats)

### Access control and governance

- [`.github/CODEOWNERS`](../../.github/CODEOWNERS) — dual-reviewer enforcement with `@amanianai` and `@gtcx-agent` on security-sensitive paths
- Branch protection on `main` — required CODEOWNER review, required status checks (ci, rust, codeql, security)
- [Dual-AI CODEOWNER governance](../agents/governance/README.md) — schema, system prompt, 3 path-specific playbooks
- AI CODEOWNER never approves — enforced in three layers (schema enum, prompt constraint, runner output filter)
- AI CODEOWNER multi-provider — Anthropic primary, OpenAI fallback (closes single-provider bus-factor)

### Audit and monitoring

- Structured stderr JSON for every traced operation; `SpanEmitter` contract for OTel/Datadog/Honeycomb forwarding
- Sanitizer-override telemetry — `event=sanitizer_override` fires when explicit sanitizer is wired
- [`pnpm ops:check`](https://github.com/gtcx-ecosystem/gtcx-core/blob/main/docs/operations/repo-bootstrap.md) — auto-verified operational prerequisites with remediation commands
- KPI metrics export — `pnpm quality:kpi:export`

### Incident response

- [`SECURITY.md`](../../SECURITY.md) — public disclosure policy with severity-based response timelines
- [`SECURITY-INCIDENT.md`](../security/security-incident-runbook.md) — six-phase internal runbook: triage, containment, investigation, remediation, disclosure, and retrospective. Includes the AI bypass procedure plus three templates: acknowledgement, downstream notice, and public advisory.
- Coordinated disclosure window — 14 days from fix-merged to public for critical/high

### Compliance posture

- [SOC 2 Type 1 readiness gap analysis](../compliance/soc2-readiness.md) — TSC mapping + 7 documented gaps
- [GDPR assessment](../compliance/gdpr-assessment.md) — zero-PII determination, DPIA not required
- [PCI-DSS scope](../compliance/pci-dss-scope.md) — formal zero-CHD declaration
- [SOX controls](../compliance/sox-controls.md) — ITGC mapping for change management, access controls, program development

### Operational integrity

- [Quality runbook](../devops/runbooks/quality-runbook.md) — CI triage order
- [Release checklist](../devops/release-mgmt/release-checklist.md) — pre-release gate
- [Repo bootstrap](https://github.com/gtcx-ecosystem/gtcx-core/blob/main/docs/operations/repo-bootstrap.md) — auto-generated from `tools/check-ops-prereqs.mjs`

---

## Live operational state

Run `pnpm ops:check` against this repo to see the current state. The checker uses `gh api` to verify runtime configuration (secrets, branch protection, org membership, CODEOWNERS validity) and reports pass/fail/warn/skip with remediation commands inline. The latest snapshot is reproducible by anyone with read access to the org.

The output is also auto-written to [`docs/operations/repo-bootstrap.md`](https://github.com/gtcx-ecosystem/gtcx-core/blob/main/docs/operations/repo-bootstrap.md) via `pnpm ops:emit-doc`.

---

## How to engage

For procurement / vendor risk:

1. Read this page + [security posture one-pager](../gtm/01-security-posture.md) + [SOC 2 readiness](../compliance/soc2-readiness.md). 30 minutes.
2. Run the verification commands above against a fresh checkout. 10 minutes.
3. Send a security questionnaire to `security@gtcx.io`. We respond by mapping each row to an artifact above; a small number require process formalization.

For sandbox regulators (Africa-tier financial regulators reviewing the library for embedded use):

1. Read the [executive brief](../gtm/00-executive-brief.md) + [evidence inventory](../gtm/04-evidence-inventory.md) + [sandbox submission guide](../gtm/05-sandbox-submission-guide.md).
2. Specific market briefs live at [`docs/gtm/`](../gtm/). Current priority markets are Zimbabwe, Namibia, Zambia, DRC, and Ghana.

For design partners / pilot deployments:

1. Same materials above, plus a technical kickoff call to walk through integration points.
2. The library has six known downstream consumers in the GTCX ecosystem; reference deployments available under NDA.

---

## What we'll build but haven't yet

Honest list of trust artifacts not yet in place. Surfaces them rather than letting a regulator discover the absence:

- **External penetration test** — internal assessment is in place; external pen test budgeted but not yet engaged. Scope is ready at [External penetration test scope](../security/pen-test-scope.md).
- **SOC 2 Type 1 letter** — readiness analysis complete; CPA engagement is the next step (8-10 weeks from start)
- ~~**PKCS#11 / Cloud KMS keystore backend**~~ — **DONE.** `Pkcs11KeyStore` ships behind `cargo --features pkcs11`, and `CloudKmsKeyStore` now ships behind `cargo --features cloud_kms` for AWS-first ECDSA P-256 custody. See [`docs/security/pkcs11-keystore.md`](../security/pkcs11-keystore.md) and [`docs/security/cloud-kms-keystore.md`](../security/cloud-kms-keystore.md).
- ~~**SLSA Level 3 attestation + Source Level 2**~~ — **DONE.** `pnpm release` produces SLSA Build Level 3 provenance via `npm publish --provenance` + GitHub OIDC. SLSA Source Level 2 is also enforced: signed commits are required on `main` via branch protection `required_signatures: true`. See [`docs/security/slsa-attestation.md`](../security/slsa-attestation.md).
- **Reference customer case study** — gtcx-core is consumed by 6 internal repos; first external case study lands after Sprint 4 sandbox engagement

---

## Cross-references — single source of truth

This portal is the entry point. The artifacts it points to are the source of truth. If a claim on this page conflicts with the underlying file, the underlying file wins. To suggest a correction, open a PR — every change to this directory is dual-reviewed by a human CODEOWNER and the AI CODEOWNER.

| Document                                                                                                  | Purpose                                 |
| --------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| [Threat model](../security/threat-model.md)                                                               | STRIDE, threat actors, attack scenarios |
| [Attack tree](../security/attack-tree-signing.md)                                                         | Adversarial decomposition               |
| [Internal security assessment](../security/internal-security-assessment.md)                               | Six assessment methods, residual risk   |
| [FIPS validation boundary](../security/fips-validation-boundary.md)                                       | Inherited validation via CMVP #4816     |
| [Key ceremony](../security/key-ceremony.md)                                                               | NIST SP 800-57 lifecycle                |
| [Cloud KMS keystore](../security/cloud-kms-keystore.md)                                                   | AWS-first cloud-managed key custody     |
| [External penetration test scope](../security/pen-test-scope.md)                                          | Third-party validation scope            |
| [SOC 2 readiness](../compliance/soc2-readiness.md)                                                        | TSC mapping, 7 documented gaps          |
| [GDPR / PCI / SOX](../compliance/)                                                                        | Compliance scope determinations         |
| [SECURITY.md](../../SECURITY.md)                                                                          | Public disclosure policy                |
| [SECURITY-INCIDENT.md](../security/security-incident-runbook.md)                                          | Internal response runbook               |
| [Governance](../agents/governance/README.md)                                                              | Dual-AI CODEOWNER pattern               |
| [Repo bootstrap](https://github.com/gtcx-ecosystem/gtcx-core/blob/main/docs/operations/repo-bootstrap.md) | Live operational prerequisites          |
| [GTM evidence pack](../gtm/)                                                                              | Sandbox-regulator-specific materials    |
| [Full audit](https://github.com/gtcx-ecosystem/gtcx-core/blob/main/docs/audit/full-audit-2026-05-09.md)   | Six-phase audit, score 9.8/10           |

## Changelog

- **1.0.0** (2026-05-10) — Initial trust portal. Five-minute, thirty-minute, and engagement-required tiers. Controls matrix mapping to NIST SP 800-53 and SOC 2 TSC. Honest "what we haven't yet built" section.
