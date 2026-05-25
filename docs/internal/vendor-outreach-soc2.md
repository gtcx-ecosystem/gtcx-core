---
title: 'SOC 2 Type 1 Vendor Outreach — Draft Emails'
status: 'draft'
date: '2026-05-25'
owner: 'quality-evidence-lead'
role: 'quality-evidence-lead'
tier: 'critical'
tags: ['internal', 'soc2', 'cpa', 'vendor', 'outreach']
review_cycle: 'on-change'
---

# SOC 2 Type 1 Vendor Outreach — Draft Emails

> **Status:** Draft — awaiting quality-evidence-lead review and send
> **Date:** 2026-05-25
> **Target send:** Thu 2026-05-29
> **Readiness prep:** `docs/compliance/soc2-readiness-prep.md`
> **Gap analysis:** `docs/compliance/soc2-readiness.md`

---

## Shortlist

| Firm              | Contact                   | Strength                                       | Notes                                       |
| ----------------- | ------------------------- | ---------------------------------------------- | ------------------------------------------- |
| A-LIGN            | info@a-lign.com           | Strong reputation, software-library experience | Good balance of cost and credibility        |
| Schellman         | info@schellman.com        | FIPS / crypto module audit experience          | Deep technical understanding of our stack   |
| Coalfire          | info@coalfire.com         | Technology audits, cloud-native focus          | Strong on infrastructure and CI/CD controls |
| Insight Assurance | info@insightassurance.com | Software-startup-friendly                      | Most flexible engagement terms              |

---

## Template Email

**Subject:** RFP — SOC 2 Type 1 Attestation: GTCX Core Cryptographic Library

---

Hi [Firm Name] team,

GTCX is a global trade verification platform serving African commodity producers and regulators. We are pursuing SOC 2 Type 1 attestation for our cryptographic and protocol foundation to support enterprise customer procurement and regulator sandbox admissions.

**Target:** `gtcx-core` — library foundation (21 TypeScript packages + 6 Rust crates). Library-only, zero PII, zero CHD. Processes no user data; all operations are cryptographic primitives, identity verification, and zero-knowledge proofs.

**Scope:** SOC 2 Type 1 — Security and Confidentiality Trust Services Criteria. Availability and Privacy are out of scope (library, not service).

**Current readiness:** 78–85% across applicable TSC. Full gap analysis and control evidence pipeline attached.

**Key controls already in place:**

- FIPS 140-3 inherited validation (OpenSSL CMVP #4282, AWS-LC CMVP #4816)
- `#![deny(unsafe_code)]` across all 6 Rust crates
- 21 automated CI gates (SAST, dependency audit, secret scan, threat matrix, architecture enforcement)
- CodeQL security-extended, Trivy, cargo-audit, cargo-deny
- 6 cargo-fuzz targets (500K+ iterations, zero crashes)
- Exact-version dependency pinning with SBOM generation
- SLSA Build L3 provenance (source L2 enforced, publish in progress)
- Signed commits, CODEOWNER review, branch protection

**Deliverables required:**

1. SOC 2 Type 1 report with auditor opinion letter
2. Control matrix gap analysis and remediation guidance
3. Pre-fieldwork mock review (internal dry run)

**Timeline:**

- Engagement letter signed by 2026-06-30
- Fieldwork: July–August 2026
- Draft report: 2026-08-31
- Final letter: 2026-09-15

**Budget envelope:** $15K–$45K depending on firm size, scope depth, and pre-fieldwork support included.

**Attachments:**

- `soc2-readiness-prep.pdf` — operational checklist, control evidence inventory, automation pipeline description
- `soc2-readiness-gap-analysis.pdf` — 78–85% readiness breakdown by TSC, identified gaps, remediation plan

**Next step:** Please confirm receipt and indicate whether you can meet the timeline. We will schedule 45-minute scoping calls with shortlisted firms by 2026-06-09.

Best regards,

[Quality & Evidence Lead]
GTCX Compliance & Quality
compliance@gtcx.io

---

## Customization Notes per Firm

### A-LIGN

- Mention: "We require a Type 1 report that can reference 'Type 2 in progress' for customer-facing procurement."
- Emphasis: Speed to Type 1, Type 2 transition path, regulatory acceptance

### Schellman

- Mention: "Our FIPS 140-3 inherited validation and Rust cryptographic modules align with your FIPS/crypto module expertise."
- Emphasis: Technical depth, crypto-specific controls, FIPS mapping

### Coalfire

- Mention: "Our CI/CD pipeline has 21 automated gates generating evidence on every PR — we need an auditor who can validate automated control evidence."
- Emphasis: Technology audit strength, CI/CD control validation, cloud-native approach

### Insight Assurance

- Mention: "We are a lean team with aggressive timeline targets for first sovereign-state engagement."
- Emphasis: Flexibility, startup-friendly terms, fast engagement start

---

## Follow-Up Schedule

| Date       | Action                        | Owner                                      |
| ---------- | ----------------------------- | ------------------------------------------ |
| 2026-05-29 | Send emails to all 4 firms    | quality-evidence-lead                      |
| 2026-06-09 | Scoping calls with responders | quality-evidence-lead                      |
| 2026-06-16 | Select preferred firm         | quality-evidence-lead + Protocol Architect |
| 2026-06-30 | Engagement letter signed      | quality-evidence-lead                      |
| 2026-07-07 | Kickoff + fieldwork begins    | CPA firm                                   |

---

## Tracking

| Firm              | Sent | Response | Quote | Timeline | Type 2 Capable | Status  |
| ----------------- | ---- | -------- | ----- | -------- | -------------- | ------- |
| A-LIGN            | —    | —        | —     | —        | Yes            | Pending |
| Schellman         | —    | —        | —     | —        | Yes            | Pending |
| Coalfire          | —    | —        | —     | —        | Yes            | Pending |
| Insight Assurance | —    | —        | —     | —        | Yes            | Pending |
