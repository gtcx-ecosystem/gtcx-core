---
title: 'Pen Test RFP 2026'
status: 'draft'
date: '2026-05-22'
owner: 'crypto-security-engineer'
role: 'crypto-security-engineer'
tier: 'critical'
tags: ['security', 'pen-test', 'engagement', 'rfp']
review_cycle: 'on-change'
---

# External Penetration Test — RFP 2026

> **Status:** Draft — ready for vendor outreach
> **Date:** 2026-05-22
> **Owner:** Cryptographic Security Engineer
> **Driver:** Sprint 4 task 4.1 of the [engagement readiness roadmap](../agile/roadmap/engagement-readiness-sprint-roadmap-2026-05-22.md). Required before sovereign-state engagements with Zimbabwe, Ghana, Namibia, Botswana, DR Congo.

## Engagement context

GTCX has imminent engagements with five African states for commodity export and mining compliance. A third-party penetration test is a customer-side procurement gate for institutional and regulator-facing adoption. Internal evidence (`docs/security/internal-security-assessment.md`, fuzz-campaign-evidence-2026-05-21.md, 500K+ iterations with 0 crashes) covers the substantive technical bar, but external attestation is what closes the bank-grade procurement loop.

## What we need from the vendor

A formal external penetration test of `gtcx-core` aligned to the [pre-written scope](./pen-test-scope.md), producing a customer-deliverable report suitable for inclusion in vendor risk packages.

### Deliverables (mandatory)

1. **Engagement letter / SoW** — scope, methodology, exclusions, timeline, deliverables, point-of-contact, fee structure.
2. **Pre-engagement briefing** — vendor reviews our threat model (`docs/security/threat-model.md`), attack tree (`docs/security/attack-tree-signing.md`), and architecture (`docs/architecture/overview.md`) before testing.
3. **Active testing** against the [scoped surfaces](./pen-test-scope.md): cryptographic signing, verification/certificate flow, NAPI boundary, key management, build/supply-chain, observability redaction.
4. **Final report** with:
   - Executive summary suitable for institutional procurement
   - Per-finding: severity (CVSS), category (OWASP/CWE), reproduction steps, recommended remediation
   - Methodology statement signed by lead tester
   - Vendor company-letterhead version we can attach to customer responses
5. **Remediation re-test** — fixed-fee re-test of remediated High/Critical findings within 30 days of fix submission.
6. **Vendor disclosure agreement** — the report belongs to GTCX; the vendor may reference engagement existence (not findings) in their marketing.

### Deliverables (optional, scored favorably)

- Fuzzing review of our existing `cargo-fuzz` campaign methodology
- SLSA Build L3 readiness assessment alongside the test
- Threat-model walkthrough session (1–2 hours, recorded)

## Vendor criteria

| Criterion                                   | Weight |
| ------------------------------------------- | ------ |
| Cryptographic library + protocol experience | 30%    |
| NAPI / FFI boundary testing experience      | 20%    |
| Supply-chain / SLSA experience              | 15%    |
| Bank / regulator reference customers        | 15%    |
| Timeline alignment (5–6 weeks from kickoff) | 10%    |
| Cost competitiveness                        | 10%    |

**Minimum bar:** vendor has completed at least 3 cryptographic-library pen tests in the last 24 months and can name at least 2 institutional reference customers (under NDA acceptable).

## Vendor longlist (initial)

To be populated when outreach begins:

| Vendor             | Status  | Notes                                          |
| ------------------ | ------- | ---------------------------------------------- |
| _Trail of Bits_    | Pending | Top-of-mind for cryptographic library audits   |
| _NCC Group_        | Pending | Strong bank reference; NAPI experience unknown |
| _Cure53_           | Pending | Strong supply-chain track record               |
| _Doyensec_         | Pending | Strong on language-runtime boundaries          |
| _Atredis Partners_ | Pending | Cryptographic + protocol depth                 |

## Timeline

| Milestone                              | Target date             |
| -------------------------------------- | ----------------------- |
| RFP issued to ≥2 vendors               | 2026-05-26              |
| Vendor responses received              | 2026-06-09              |
| Vendor selected and SoW signed         | 2026-06-16              |
| Engagement kickoff                     | 2026-06-23              |
| Active testing window (4 weeks)        | 2026-06-23 → 2026-07-21 |
| Draft report received                  | 2026-07-28              |
| Final report after remediation re-test | 2026-08-25              |

## Budget

| Component                 | Range               |
| ------------------------- | ------------------- |
| Initial test (4 weeks)    | $8,000–$22,000      |
| Remediation re-test       | $2,000–$5,000       |
| Optional: SLSA assessment | $2,000–$4,000       |
| **Total budget envelope** | **$10,000–$31,000** |

## Approval

| Role                            | Approval | Date       |
| ------------------------------- | -------- | ---------- |
| Protocol Architect              | Pending  | —          |
| Cryptographic Security Engineer | Drafted  | 2026-05-22 |
| Quality & Evidence Lead         | Pending  | —          |
