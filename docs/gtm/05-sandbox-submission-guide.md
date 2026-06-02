---
title: 'Sandbox Submission Guide'
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

title: '05 Sandbox Submission Guide'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs']
review_cycle: 'on-change'

---

# Sandbox Submission Guide

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

**How to apply to a regulatory innovation sandbox with gtcx-core as the cryptographic foundation.**

> **Cross-repo:** The **10-document regulator package** (architecture, data residency, IRP, board resolutions) is assembled from **[gtcx-infrastructure `docs/gtm/sandbox-application/`](https://github.com/gtcx-ecosystem/gtcx-infrastructure/tree/main/docs/gtm/sandbox-application)** via `assemble-sandbox-evidence.sh`. This guide covers **core-specific** evidence and outreach templates. Full sequencing: [16-ecosystem-gtm-alignment.md](./16-ecosystem-gtm-alignment.md).

---

## The Strategy

The biggest lever is the **pre-submission meeting**. Sandbox teams will tell you exactly what they need. Use the **[canonical sandbox email template](./sandbox-intro-email-template.md)** (not superseded per-country drafts `09`–`13`). Strategy and costs follow the **[Global South 10/10 plan](https://github.com/gtcx-ecosystem/gtcx-infrastructure/blob/main/docs/gtm/plans/global-south-10x-plan.md)** — regional pen-test ($8–15K), not US bank FFIEC track unless explicitly chosen.

---

## Step 1: Identify Target Sandbox Programs

Priority markets for GTCX (commodity trade verification):

| Country      | Regulator           | Sandbox Program                     | Relevance                                 |
| ------------ | ------------------- | ----------------------------------- | ----------------------------------------- |
| Ghana        | Bank of Ghana / SEC | Regulatory Sandbox                  | Gold, cocoa — primary market              |
| Kenya        | CMA Kenya           | Regulatory Sandbox                  | Agricultural commodities                  |
| Rwanda       | BNR / CMA           | Fintech Sandbox                     | Minerals (3TG), coffee                    |
| South Africa | FSCA / SARB         | Innovation Hub                      | Precious metals, financial infrastructure |
| Nigeria      | SEC Nigeria / CBN   | Regulatory Sandbox                  | Commodities exchange                      |
| Tanzania     | Bank of Tanzania    | Regulatory Sandbox                  | Mining, agriculture                       |
| UAE          | ADGM / DIFC         | RegLab / Innovation Testing License | International trade hub                   |
| UK           | FCA                 | Regulatory Sandbox                  | International market access               |

**Start with Zimbabwe and Namibia.** See [08-target-markets.md](./08-target-markets.md) for the full five-market strategy covering Zimbabwe, Namibia, Zambia, DRC, and Ghana.

## Step 2: Pre-Submission Meeting

### What to Request

Email the sandbox team requesting a pre-submission consultation. Include:

1. One-paragraph description of GTCX (commodity verification protocol using cryptographic proofs)
2. Statement that you are evaluating sandbox application
3. Request for 30-minute meeting to understand evidence requirements

### What to Bring

- [00-executive-brief.md](./00-executive-brief.md) — printed or PDF, one-pager
- [02-compliance-matrix.md](./02-compliance-matrix.md) — shows you've thought about regulatory alignment
- Verbal ability to explain: "We verify commodity origins using digital signatures. No financial transactions, no custody of funds, no personal data processing."

### What to Ask

1. "What evidence do you need to see for a cryptographic infrastructure provider?"
2. "Do you require an external penetration test, or do you accept internal security assessments?"
3. "What's the timeline from application to admission?"
4. "Are there specific standards you expect us to meet?" (ISO, SOC 2, local regulations)
5. "Do you have a template for the application?"

### What to Listen For

The answers to these questions determine whether we need to do any more work:

| If They Say                               | Then We Need                                                     | Status                                                        |
| ----------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------- |
| "We need a security assessment"           | Internal assessment document                                     | Done (docs/security/internal-security-assessment.md)          |
| "We need FIPS compliance"                 | FIPS boundary statement                                          | Done (docs/security/fips-validation-boundary.md)              |
| "We need a pen test"                      | Either internal assessment (if accepted) or HackerOne bug bounty | Budget: $0 or $2-5K                                           |
| "We need SOC 2"                           | SOC 2 evidence pipeline execution                                | Pipeline exists, needs execution                              |
| "We need data protection assessment"      | GDPR assessment                                                  | Done (docs/compliance/gdpr-assessment.md)                     |
| "We need to understand your architecture" | Architecture overview                                            | Done (docs/architecture/overview.md)                          |
| "We need to see your test results"        | CI evidence pack                                                 | Regenerate with `pnpm test && pnpm release:ga:evidence:check` |

## Step 3: Prepare the Application

### Evidence Pack Contents

Bundle these into a PDF or shared folder:

1. **Executive Brief** — [00-executive-brief.md](./00-executive-brief.md)
2. **Security Posture** — [01-security-posture.md](./01-security-posture.md)
3. **Compliance Matrix** — [02-compliance-matrix.md](./02-compliance-matrix.md)
4. **FIPS Readiness** — [03-fips-readiness.md](./03-fips-readiness.md). Bring it only if asked.
5. **CI Gate Results** — Fresh run of `pnpm test && pnpm release:ga:evidence:check`
6. **Fuzz Campaign Results** — After running 24-hour campaigns (pending)
7. **Architecture Overview** — `docs/architecture/overview.md`
8. **Any additional items** from the pre-submission meeting

### Application Narrative

Framework for the written application:

```
Section 1: What we do
  - Cryptographic verification of commodity supply chains
  - Digital identity (DID-based), certificates, zero-knowledge proofs
  - Offline-first design for low-connectivity environments

Section 2: Why sandbox
  - Novel cryptographic approach to trade verification
  - Global South focus — designed for conditions sandbox regulators care about
  - Need regulatory clarity on: digital certificate legal standing,
    ZKP proof admissibility, cross-border verification interoperability

Section 3: How we're built
  - [Reference executive brief]
  - No custom crypto — audited libraries only
  - FIPS-ready — inherited validation from certified modules
  - 21 automated quality gates on every code change

Section 4: Risk management
  - [Reference compliance matrix]
  - Zero PII processing — library scope
  - Key lifecycle management per NIST SP 800-57
  - Threat model with STRIDE analysis and attack trees

Section 5: What we need from the sandbox
  - Regulatory guidance on digital certificate standards
  - Validation of our verification protocol in live commodity trades
  - Pathway to full authorization post-sandbox
```

## Step 4: During the Sandbox Period

### Evidence Generation Cadence

| Period      | Action                        | Output                            |
| ----------- | ----------------------------- | --------------------------------- |
| Weekly      | Run full CI gate suite        | Fresh test/coverage/audit results |
| Weekly      | Run fuzz campaigns (1hr each) | Fuzz results log                  |
| Monthly     | Refresh KPI metrics           | Updated quality/kpi-metrics.json  |
| Monthly     | Security advisory review      | Updated dependency audit          |
| Quarterly   | Threat model review           | Updated threat-model.md           |
| Per release | Full release checklist        | Release evidence pack             |

### What to Report to the Regulator

Most sandbox programs require periodic status reports. Template:

```
Reporting Period: [dates]

Summary:
- [N] code changes merged, all CI-gated
- [N] security findings (expected: 0 critical, 0 high)
- [N] dependency updates applied
- Fuzz campaigns: [N] hours, [0] crashes found
- Coverage: [X]% statements, [Y]% branches on critical packages

Changes Since Last Report:
- [List significant changes]

Risk Status: No new risks identified.
```

## Step 5: Post-Sandbox

### Path to Full Authorization

1. Document sandbox period results (all status reports compiled)
2. Compile downstream validation reports (gtcx-protocols, gtcx-platforms)
3. Reference clean fuzz campaign history
4. Request graduation meeting with sandbox team
5. Apply for full authorization using sandbox evidence as foundation

---

## Cost Breakdown

| Item                                 | Cost                  | When                                           |
| ------------------------------------ | --------------------- | ---------------------------------------------- |
| Pre-submission meeting               | $0 (regulator's time) | Week 1                                         |
| Application preparation              | $0 (engineer time)    | Week 2-3                                       |
| AWS Activate (infrastructure)        | $0 for 12+ months     | Applied for at submission                      |
| Bug bounty (if required)             | $2-5K reserve         | Only if regulator requires external validation |
| Domain + hosting for evidence portal | ~$20/year             | If PDF isn't enough                            |
| **Total**                            | **$0 - $5,020**       |                                                |
