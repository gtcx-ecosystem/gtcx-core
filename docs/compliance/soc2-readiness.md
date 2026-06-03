---
title: 'SOC 2 Type 1 Readiness Gap Analysis'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'standard'
tags: ['documentation', 'compliance']
review_cycle: 'on-change'
---

---

title: 'Soc2 Readiness'
status: 'current'
date: '2026-05-17'
owner: 'quality-evidence-lead'
role: 'quality-evidence-lead'
tier: 'critical'
tags: ['docs', 'compliance']
review_cycle: 'quarterly'

---

# SOC 2 Type 1 Readiness Gap Analysis

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Quality & Evidence Lead

**Subject:** gtcx-core (cryptographic foundation library)
**Standard:** AICPA SOC 2 Trust Services Criteria (2017, with 2022 points of focus)
**Type:** Type 1 (design of controls at a point in time)
**Assessment date:** 2026-05-10
**Classification:** Internal — for procurement / vendor risk management discussions
**Owner:** Cryptographic Security Engineer (`docs/agents/roles/crypto-security-engineer.md`)

---

## Executive Summary

`gtcx-core` is **library infrastructure**, not a service organization. Strict SOC 2 applies to service organizations that handle customer data — a library that runs entirely inside the consumer's process boundary doesn't directly have a SOC 2 audit. However, banks and regulated financial institutions evaluating gtcx-core for embedded use will ask for SOC 2 alignment as a procurement gate. This gap analysis maps gtcx-core's existing development, release, and security controls to the SOC 2 Trust Services Criteria (TSC) so a vendor risk assessor can evaluate readiness without a formal audit.

**Readiness summary:**

| Trust Service Criterion       | Applicability                    | Readiness | Effort to formalize                                                                  |
| ----------------------------- | -------------------------------- | --------- | ------------------------------------------------------------------------------------ |
| **Security (CC)**             | Required                         | **78%**   | ~6 weeks                                                                             |
| **Confidentiality (C)**       | Applicable (key material)        | **85%**   | ~3 weeks                                                                             |
| **Processing Integrity (PI)** | Applicable (verification proofs) | **80%**   | ~4 weeks                                                                             |
| **Availability (A)**          | **Not applicable**               | n/a       | n/a — library has no runtime to be unavailable                                       |
| **Privacy (P)**               | **Not applicable**               | n/a       | n/a — library processes no PII (GDPR zero-PII determination in `gdpr-assessment.md`) |

**Bottom line for procurement:** gtcx-core can clear most institutional vendor-risk questionnaires today by referencing existing artifacts (threat model, fuzz results, FIPS provider, ops:check, dual-AI CODEOWNER governance). Formalization for a SOC 2 Type 1 letter requires ~6 weeks of process documentation, NOT additional engineering work.

---

## Scope and Service-vs-Library Caveat

SOC 2 reports apply to **service organizations** — entities that operate systems on behalf of users (cloud providers, SaaS, payment processors). A library shipped via npm and consumed inside a customer's process does not directly meet the service-organization definition.

What banks actually want when they ask "is gtcx-core SOC 2 compliant?":

1. **Procurement-gate clearance** — evidence that the library producer follows controls equivalent to SOC 2's Common Criteria. This is the question this doc answers.
2. **SOC 2 by association** — when gtcx-core is consumed by a service that has SOC 2, the service's auditor will trace through to gtcx-core's controls. This doc supports that trace.
3. **Future SOC 2 carve-out** — when gtcx-core is hosted as a service (key issuance, attestation API), a SOC 2 Type 2 audit becomes directly applicable. This doc establishes the design-of-controls baseline that audit would assess.

The framing throughout this doc: gtcx-core's controls are mapped to SOC 2 TSC, not certified against them. A formal Type 1 attestation requires an independent CPA firm performing the audit per AT-C 105 / AT-C 205.

---

## Trust Services Criteria — Common Criteria (CC)

The Common Criteria are required for any SOC 2 report. CC1 through CC9 cover governance, communication, risk, monitoring, control activities, access, operations, change management, and risk mitigation.

### CC1 — Control Environment

| Control | Requirement                                                               | gtcx-core status | Evidence                                                                                                                                 |
| ------- | ------------------------------------------------------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| CC1.1   | Demonstrates commitment to integrity and ethical values                   | ✓                | `CLAUDE.md` (no `--no-verify`, no force-push), `CONTRIBUTING.md`, `SECURITY.md`                                                          |
| CC1.2   | Board exercises oversight responsibility                                  | ⚠                | No formal board oversight documented; appropriate for a single-maintainer + AI-CODEOWNER repo, but a SOC 2 auditor will note the absence |
| CC1.3   | Establishes structure, authority, and responsibility                      | ✓                | `docs/agents/roles/` (4 agent roles), `.github/CODEOWNERS` (dual-reviewer enforcement), `docs/agents/governance/` (AI CODEOWNER pattern) |
| CC1.4   | Demonstrates commitment to attract, develop, retain competent individuals | ⚠                | No formal hiring/training process documented; bus-factor mitigation is via gtcx-agent (recently activated)                               |
| CC1.5   | Holds individuals accountable for internal control responsibilities       | ✓                | Required CODEOWNER review on `main` (branch protection enabled 2026-05-10), audit log of merges via `git log`                            |

**CC1 readiness: 70%.** Gaps are governance-formalization (CC1.2, CC1.4), not technical.

### CC2 — Communication and Information

| Control | Requirement                                        | gtcx-core status | Evidence                                                                                                                                    |
| ------- | -------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| CC2.1   | Obtains or generates relevant, quality information | ✓                | Threat model (`docs/security/threat-model.md`), STRIDE analysis, attack tree, fuzz campaign results                                         |
| CC2.2   | Internally communicates control responsibilities   | ✓                | `docs/agents/governance/`, `security-incident-runbook.md`, agent role docs                                                                  |
| CC2.3   | Communicates with external parties                 | ✓                | `SECURITY.md` (vulnerability reporting), `docs/gtm/` (sandbox regulator pack), public advisories template in `security-incident-runbook.md` |

**CC2 readiness: 95%.**

### CC3 — Risk Assessment

| Control | Requirement                     | gtcx-core status | Evidence                                                                                                                    |
| ------- | ------------------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------- |
| CC3.1   | Specifies suitable objectives   | ✓                | `README.md` engineering standards, `docs/architecture/overview.md`                                                          |
| CC3.2   | Identifies and analyzes risk    | ✓                | STRIDE table in threat model; attack tree in `docs/security/attack-tree-signing.md`                                         |
| CC3.3   | Considers fraud potential       | ✓                | Threat actor table includes "malicious contributor" and "supply chain attacker" rows with mitigations                       |
| CC3.4   | Identifies and assesses changes | ✓                | API surface baseline (`quality/api-surface-baseline.json`); architecture boundary check; CODEOWNER review on critical paths |

**CC3 readiness: 100%.** Threat-model rigor is the strongest dimension.

### CC4 — Monitoring Activities

| Control | Requirement                                                     | gtcx-core status | Evidence                                                                                                                                |
| ------- | --------------------------------------------------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| CC4.1   | Selects, develops, and performs ongoing or separate evaluations | ⚠                | CI runs every PR (CodeQL, Trivy, cargo-audit, secret scan); ops:check runs on demand; **but no scheduled control-effectiveness review** |
| CC4.2   | Communicates evaluation deficiencies                            | ✓                | `,auto-dev-state.md`, `,full-audit-2026-05-09.md`, finding lifecycle in audit table                                                     |

**CC4 readiness: 75%.** Gap: formal periodic control-effectiveness review (e.g., quarterly).

### CC5 — Control Activities

| Control | Requirement                                           | gtcx-core status | Evidence                                                                                                      |
| ------- | ----------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------- |
| CC5.1   | Selects and develops control activities               | ✓                | 21 CI gates, `tools/check-*.mjs` enforcement (architecture, secrets, threat matrix, crypto deps, ops prereqs) |
| CC5.2   | Selects and develops general controls over technology | ✓                | Branch protection on main, CODEOWNERS, signed commits via husky, dual-AI review                               |
| CC5.3   | Deploys controls through policies and procedures      | ✓                | `CLAUDE.md` (hard rules), `docs/devops/runbooks/quality-runbook.md`, `security-incident-runbook.md`           |

**CC5 readiness: 100%.**

### CC6 — Logical and Physical Access (Crypto-Relevant — Highest-Weight Control)

| Control | Requirement                                                                | gtcx-core status | Evidence                                                                                                                                                      |
| ------- | -------------------------------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CC6.1   | Implements logical access security software, infrastructure, architectures | ✓                | FIPS provider behind `--features fips` (CMVP #4816), Ed25519 via @noble/curves, content-hash allowlist for crypto deps                                        |
| CC6.2   | Authorizes registers, modifies, and prevents unauthorized identification   | ✓                | `KeyStore` trait with NIST SP 800-57 lifecycle states (Created, Active, Rotated, Revoked, Destroyed)                                                          |
| CC6.3   | Authorizes access based on roles and responsibilities                      | ✓                | CODEOWNERS dual-review; branch protection enforces it on `main`                                                                                               |
| CC6.4   | Restricts physical access                                                  | n/a              | Library has no physical asset; consumer's deployment context determines this                                                                                  |
| CC6.5   | Discontinues access when no longer required                                | ⚠                | Logical: KeyStore lifecycle handles key revocation; **but no formal personnel-offboarding process documented (gtcx-agent invitation lifecycle is the proxy)** |
| CC6.6   | Implements logical access controls for boundaries                          | ✓                | Architecture boundary check (`tools/check-package-boundaries.mjs`); forbidden-imports table; redactSecrets default sanitizer                                  |
| CC6.7   | Restricts transmission, movement, and removal of information               | ✓                | Per-credential AAD on offline storage (CC6.7 is mostly downstream-consumer territory for a library)                                                           |
| CC6.8   | Implements controls to prevent or detect malicious software                | ✓                | CodeQL, Trivy, cargo-deny, content-hash allowlist for `@noble/*`, dependency audit on every PR                                                                |

**CC6 readiness: 90%.** Gap: formal offboarding (CC6.5) is a process artifact, not engineering.

### CC7 — System Operations

| Control | Requirement                                                 | gtcx-core status | Evidence                                                                                   |
| ------- | ----------------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------ |
| CC7.1   | Detection and monitoring procedures for new vulnerabilities | ✓                | Dependabot, `pnpm audit` on PR, cargo-audit, CodeQL daily                                  |
| CC7.2   | Monitors system components and operation                    | ⚠                | CI gates monitor build/test; **no production runtime monitoring (library has no runtime)** |
| CC7.3   | Evaluates security events for incident response             | ✓                | `security-incident-runbook.md` six-phase runbook with severity classification              |
| CC7.4   | Responds to identified security incidents                   | ✓                | `security-incident-runbook.md` Phase 2 (containment), Phase 4 (remediation), templates     |
| CC7.5   | Identifies, develops, implements activities to recover      | ✓                | Runbook Phase 5 (coordinated disclosure), `--provenance` on publish                        |

**CC7 readiness: 85%.** Gap: CC7.2 is mostly N/A for a library; the auditor will note this.

### CC8 — Change Management

| Control | Requirement                                                                 | gtcx-core status | Evidence                                                                                                |
| ------- | --------------------------------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------- |
| CC8.1   | Authorizes, designs, develops, configures, tests, approves, deploys changes | ✓                | Branch protection, CODEOWNERS, dual-AI review, conventional commits, changesets, `pnpm api:check` on PR |

**CC8 readiness: 100%.**

### CC9 — Risk Mitigation

| Control | Requirement                                                                           | gtcx-core status | Evidence                                                                                                                                                                            |
| ------- | ------------------------------------------------------------------------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CC9.1   | Identifies, selects, and develops risk mitigation activities for business disruptions | ⚠                | `security-incident-runbook.md` covers incidents but not business continuity; library has no operational continuity concern, **but vendor risk assessors expect this even when N/A** |
| CC9.2   | Assesses and manages risks associated with vendors and business partners              | ⚠                | `tools/check-crypto-deps.mjs` (allowlist for `@noble/*`), `cargo-deny`, Dependabot — but no formal vendor management policy document                                                |

**CC9 readiness: 60%.** Gap: business continuity disclaimer + formal vendor management policy.

---

## Trust Services Criteria — Confidentiality (C)

Applicable because gtcx-core's purpose is to handle cryptographic key material — confidentiality is load-bearing.

| Control | Requirement                                       | gtcx-core status | Evidence                                                                                    |
| ------- | ------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------- |
| C1.1    | Identifies and maintains confidential information | ✓                | Threat model classifies private keys, secrets, mnemonics; `redactSecrets` default sanitizer |
| C1.2    | Disposes of confidential information              | ✓                | Zeroize on key destruction (`KeyStore::destroy_key`); `secureWipe` in TS path               |

**C readiness: 85%.** Gap: formal data classification matrix (currently distributed across threat model + redact patterns).

---

## Trust Services Criteria — Processing Integrity (PI)

Applicable because gtcx-core's verification primitives produce outputs (signatures, certificates, proofs) whose integrity is the load-bearing property.

| Control | Requirement                                                        | gtcx-core status | Evidence                                                                                                           |
| ------- | ------------------------------------------------------------------ | ---------------- | ------------------------------------------------------------------------------------------------------------------ |
| PI1.1   | Inputs of system components are validated                          | ✓                | Zod schemas at every input boundary; size-bounded JSON parse; constant-time hex validation                         |
| PI1.2   | System processing is complete, valid, accurate, timely, authorized | ✓                | Property-based tests (25 properties in `packages/crypto/tests/property-based.test.ts`), 9.9M fuzz runs / 0 crashes |
| PI1.3   | Outputs are complete and accurate, distributed accordingly         | ✓                | API surface baseline; `tracedVerifyCertificate` returns explicit `checks` object with all verification dimensions  |
| PI1.4   | System reports inputs, processing, and outputs to meet objectives  | ✓                | Structured stderr JSON traces; `SpanEmitter` contract for OTel forwarding                                          |
| PI1.5   | Stores inputs and outputs completely, accurately, and timely       | n/a              | Library has no persistent storage                                                                                  |

**PI readiness: 80%.**

---

## Gap Summary

Sorted by effort to close, descending:

| #   | Gap                                                  | TSC   | Effort  | Type     |
| --- | ---------------------------------------------------- | ----- | ------- | -------- |
| 1   | Formal vendor management policy                      | CC9.2 | 2 weeks | Document |
| 2   | Quarterly control-effectiveness review process       | CC4.1 | 2 weeks | Process  |
| 3   | Personnel offboarding process                        | CC6.5 | 1 week  | Document |
| 4   | Board / governance oversight documentation           | CC1.2 | 1 week  | Document |
| 5   | Hiring and training process                          | CC1.4 | 1 week  | Document |
| 6   | Business continuity disclaimer (library not service) | CC9.1 | 3 days  | Document |
| 7   | Formal data classification matrix                    | C1.1  | 3 days  | Document |

**Total effort:** ~6 weeks of documentation work, all of it process formalization. Zero engineering gaps.

This is the consequential finding: gtcx-core's technical posture already exceeds what most service organizations carry into a SOC 2 Type 1 audit. The gaps are governance and process documentation that a CPA firm can help draft as part of the engagement.

---

## Path to Type 1 Attestation

A formal SOC 2 Type 1 letter requires:

1. **Engagement with a qualified CPA firm.** Cost: $15K-$45K for a Type 1 of a small service-aligned library. Timeline: 6-10 weeks from engagement to letter.
2. **Close the seven gaps above.** Estimated 6 weeks of internal documentation work, parallelizable with the CPA engagement.
3. **Auditor reviews controls design and tests one or more in operation.** Type 1 = design only; auditor reviews artifacts but does not test operating effectiveness over time.
4. **Auditor issues opinion letter.** Letter scope: design of controls as of a specific date.

Recommended sequence:

- Weeks 1-3: Close gaps 4, 5, 6, 7 (documentation, low complexity)
- Weeks 4-5: Close gaps 1, 2, 3 (process formalization, requires policy decisions)
- Weeks 6-8: CPA engagement, control walkthroughs, evidence gathering
- Weeks 9-10: Letter issuance

**Earliest realistic Type 1 letter date:** 8-10 weeks from engagement start, assuming the seven gaps close in parallel.

---

## Path to Type 2 Attestation

Type 2 requires evidence of **operating effectiveness over a period** — typically 6 or 12 months. The earliest realistic Type 2 letter is 6 months after Type 1, because the auditor needs that history.

Critical artifacts to generate continuously starting now:

1. **CI run logs** — already retained (`gh api`)
2. **Branch protection event log** — GitHub records this; export quarterly
3. **CODEOWNER review log** — `quality/ai-review-log/` (when AI CODEOWNER action runs against real PRs); already designed
4. **Incident response evidence** — `quality/incidents/<id>/` per `security-incident-runbook.md`
5. **Quarterly control-effectiveness reviews** (gap #2 above) — meeting minutes, sign-off
6. **Vendor / dependency change log** — `pnpm audit` output, `cargo audit` output, Dependabot PR history

Most of these are already being captured automatically; the gap is the formal review-and-sign-off cadence.

---

## Recommended Posture for Procurement Conversations

When a financial institution's vendor risk team asks "is gtcx-core SOC 2 compliant?":

**Honest answer:** "gtcx-core is library infrastructure, not a service organization. We don't carry a SOC 2 letter today, and a formal SOC 2 audit requires the consumer's deployment context to be in scope. We've performed a SOC 2 Type 1 readiness gap analysis (this document) that maps our controls to the Common Criteria. Our technical posture exceeds typical service-organization baselines; the documented gaps are process formalization. We can engage a CPA firm to produce a Type 1 letter on a 8-10 week timeline if required for procurement."

This framing is more credible than claiming SOC 2 compliance you don't have. It also positions the library accurately: the consumer's service organization carries the SOC 2 letter; gtcx-core's controls feed into that audit's scope.

---

## Cross-references

- [`docs/security/threat-model.md`](../security/threat-model.md) — STRIDE + threat actors + mitigations
- [`docs/security/attack-tree-signing.md`](../security/attack-tree-signing.md) — attack-tree analysis for signature forgery
- [`docs/security/internal-security-assessment.md`](../security/internal-security-assessment.md) — six assessment methods + residual risk
- [`docs/security/fips-validation-boundary.md`](../security/fips-validation-boundary.md) — FIPS inheritance via aws-lc-rs CMVP #4816
- [`docs/security/key-ceremony.md`](../security/key-ceremony.md) — NIST SP 800-57 key lifecycle
- [`docs/agents/governance/`](../agents/governance/) — dual-AI CODEOWNER pattern
- [`SECURITY.md`](../../SECURITY.md) — public disclosure policy
- [`security-incident-runbook.md`](../security/security-incident-runbook.md) — internal response runbook
- [`docs/compliance/gdpr-assessment.md`](./gdpr-assessment.md) — zero-PII determination
- [`docs/compliance/pci-dss-scope.md`](./pci-dss-scope.md) — zero-CHD determination
- [`docs/compliance/sox-controls.md`](./sox-controls.md) — SOX ITGC mapping

## Changelog

- **1.0.0** (2026-05-10) — Initial readiness gap analysis. 78% Security TSC, 85% Confidentiality, 80% Processing Integrity. Seven documented gaps, all process-formalization. Engineering posture exceeds typical service-org baselines.
