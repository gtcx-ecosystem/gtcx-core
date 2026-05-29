---
title: "SOC 2 Type 1 Readiness Preparation"
status: "current"
date: "2026-05-27"
owner: "gtcx-core"
role: "protocol-architect"
agent_id: "agent://gtcx-core/2026-05-27/session-backfill"
trust_score: 60
autonomy_level: "permissioned"
tier: "standard"
tags: ["documentation", "compliance"]
review_cycle: "on-change"
---

---
title: 'SOC 2 Type 1 Readiness Prep'
status: 'current'
date: '2026-05-22'
owner: 'quality-evidence-lead'
role: 'quality-evidence-lead'
tier: 'critical'
tags: ['compliance', 'soc2', 'engagement', 'preparation']
review_cycle: 'on-change'
---

# SOC 2 Type 1 Readiness Preparation

> **Status:** Current
> **Date:** 2026-05-22
> **Owner:** Quality & Evidence Lead
> **Driver:** Sprint 4 task 4.2 of the [engagement readiness roadmap](../agile/roadmap/engagement-readiness-sprint-roadmap-2026-05-22.md). Action plan that bridges the existing [readiness gap analysis](./soc2-readiness.md) to formal CPA engagement.

## What this doc is (and isn't)

- **This doc:** the operational checklist to close the remaining 15–22% TSC gap and prepare for a CPA-led Type 1 engagement.
- **`soc2-readiness.md`:** the underlying gap analysis (78–85% ready across applicable TSC).
- **`soc2-evidence-pipeline.md`:** the automated evidence collection plumbing already wired into CI.
- **`soc2-engagement-log.md`:** the running log of CPA outreach, contract, and kickoff state.

## Pre-engagement checklist

| #   | Item                                                                                                  | Status     | Owner                           | Source / Evidence                                       |
| --- | ----------------------------------------------------------------------------------------------------- | ---------- | ------------------------------- | ------------------------------------------------------- |
| 1   | Confirm gtcx-core scope as library-not-service-organization for SOC 2 applicability                   | ✅ Done    | Quality & Evidence Lead         | `soc2-readiness.md` §Executive Summary                  |
| 2   | Identify applicable TSC: Security (CC), Confidentiality (C), Processing Integrity (PI)                | ✅ Done    | Quality & Evidence Lead         | `soc2-readiness.md` §Readiness summary                  |
| 3   | Confirm Availability and Privacy are out-of-scope with documented justification                       | ✅ Done    | Quality & Evidence Lead         | `soc2-readiness.md` + `gdpr-assessment.md`              |
| 4   | Map existing controls to TSC criteria with evidence references                                        | ✅ Done    | Cryptographic Security Engineer | `nist-800-53-mapping.md`, `threat-control-matrix.md`    |
| 5   | Verify all controls have automated evidence collection in CI                                          | ⚠️ Partial | Frontier Infra Engineer         | `soc2-evidence-pipeline.md` — 80% of controls automated |
| 6   | Close remaining ~15% gap on Security TSC (formal access reviews, vendor inventory, incident tabletop) | ⏸️ Pending | Cryptographic Security Engineer | Tasks 6.1–6.3 below                                     |
| 7   | Close remaining ~10% gap on Confidentiality TSC (encryption-at-rest inventory for source artifacts)   | ⏸️ Pending | Frontier Infra Engineer         | Tasks 7.1–7.2 below                                     |
| 8   | Close remaining ~20% gap on Processing Integrity TSC (verification-chain reproducibility evidence)    | ⏸️ Pending | Quality & Evidence Lead         | Tasks 8.1–8.2 below                                     |
| 9   | Engage CPA firm with experience in software-library SOC 2 engagements                                 | ⏸️ Pending | Quality & Evidence Lead         | `soc2-engagement-log.md`                                |
| 10  | Schedule fieldwork window (4–6 weeks within the 8–10 week engagement)                                 | ⏸️ Pending | Quality & Evidence Lead         | Auditor coordination                                    |

## Sub-tasks to close remaining gap

### 6.1 Formal access reviews

- Document who has push access to `main` (CODEOWNERS), npm publish (NPM_TOKEN scope), and GitHub org admin
- Quarterly review cadence with sign-off in `docs/governance/access-review-<quarter>.md`
- Automated check: `pnpm ops:check` already verifies branch protection + CODEOWNER review required

### 6.2 Vendor inventory

- Enumerate third-party services used in the SDLC: GitHub, npm registry, crates.io, vendor APIs (Anthropic, OpenAI for codeowner AI)
- For each: data-shared classification, contractual basis, replacement plan if vendor becomes unavailable
- New doc: `docs/operations/vendor-inventory.md`

### 6.3 Incident tabletop drill

- Already executed once per [internal-completion-audit-2026-05-21.md](../audit/internal-completion-audit-2026-05-21.md)
- Capture as recurring quarterly drill with documented playbook (`security-incident-runbook.md` exists; add post-drill log section)

### 7.1 Encryption-at-rest inventory for source artifacts

- npm publish artifacts: encrypted in transit (HTTPS); npm storage encryption documented by npm
- GitHub source: documented by GitHub
- Build artifacts (`artifacts/`, `quality/`): currently in plaintext on CI runners; document the boundary and retention

### 7.2 Key material custody attestation

- `pkcs11-keystore.md` + `cloud-kms-keystore.md` cover the runtime model
- Need separate attestation that GTCX's own signing keys (npm publish, GitHub commits) are HSM-backed or hardware-token-backed; document in `key-ceremony.md`

### 8.1 Verification-chain reproducibility evidence

- `pnpm build:reproducible` already exists; expand to all 21 packages
- Capture build hashes per release in `artifacts/reproducible-builds.json`

### 8.2 Cross-build determinism test

- Build the same commit on two different runners (e.g., Ubuntu 22.04 + macOS 14); compare output hashes
- Document in `docs/devops/reproducible-build-attestation.md`

## CPA candidate criteria

| Criterion                                                           | Weight |
| ------------------------------------------------------------------- | ------ |
| Software-library SOC 2 experience (NOT just SaaS / service-org)     | 35%    |
| Cryptographic / FIPS-validated module audit experience              | 20%    |
| AICPA peer-review status current                                    | 15%    |
| Reference customers in financial services or crypto infrastructure  | 15%    |
| Type 1 → Type 2 follow-through capability (avoid switching vendors) | 10%    |
| Cost competitiveness within $15K–$45K range                         | 5%     |

## Timeline (conservative)

| Milestone                                 | Target date             |
| ----------------------------------------- | ----------------------- |
| Sub-tasks 6.x / 7.x / 8.x closed          | 2026-06-30              |
| CPA RFP issued to ≥3 firms                | 2026-06-09              |
| CPA selected and engagement letter signed | 2026-06-30              |
| Engagement kickoff                        | 2026-07-07              |
| Fieldwork window (4–6 weeks)              | 2026-07-07 → 2026-08-18 |
| Draft report received                     | 2026-09-01              |
| Final SOC 2 Type 1 letter received        | 2026-09-15              |

**Note on timing:** SOC 2 Type 1 attests to control DESIGN at a point in time. It is achievable inside the sovereign-state engagement window. Type 2 attests to control OPERATING EFFECTIVENESS over 6–12 months and is the natural follow-on; it cannot complete before the first sovereign-state engagement lands.

## Approval

| Role                            | Approval | Date       |
| ------------------------------- | -------- | ---------- |
| Protocol Architect              | Pending  | —          |
| Quality & Evidence Lead         | Drafted  | 2026-05-22 |
| Cryptographic Security Engineer | Pending  | —          |
