---
title: 'External Blocker Action Plan'
status: 'current'
date: '2026-05-17'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-17/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'critical'
tags: ['documentation', 'internal', 'blockers', 'action-plan']
review_cycle: 'weekly'
---

---

title: 'External Blocker Action Plan'
status: 'current'
date: '2026-05-17'
owner: 'quality-evidence-lead'
role: 'quality-evidence-lead'
tier: 'critical'
tags: ['internal', 'readiness', 'blockers', 'gtm', 'action-plan']
review_cycle: 'weekly'

---

# External Blocker Action Plan

> **Status:** Current  
> **Date:** 2026-05-17  
> **Owner:** Quality & Evidence Lead  
> **Next Review:** Every Monday 09:00 GMT  
> **Classification:** Critical — requires weekly stand-up review and executive escalation if any item slips

This document replaces the passive tracking in `external-readiness-checklist.md` with an **action plan**: assigned owners, hard deadlines, daily actions, escalation paths, and contingency plans. Every blocker must either close or escalate within its deadline. No open items survive two review cycles without a plan change.

---

## 1. Blocker Dashboard

| #   | Blocker                        | Owner                    | Hard Deadline  | Days Left | Status                 | Daily Action                                                 | Contingency                                                                    |
| --- | ------------------------------ | ------------------------ | -------------- | --------- | ---------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| 1   | Select pen-test vendor         | crypto-security-engineer | **2026-06-16** | 30        | 🟡 RFP out             | Follow up with 5 vendors every 48h; log responses            | Expand to 8 vendors; engage boutique African security firm                     |
| 2   | Confirm SOC 2 CPA engagement   | quality-evidence-lead    | **2026-06-09** | 23        | 🟡 Letters sent        | Call CPA firms every 24h until signed engagement returned    | Pivot to ISO 27001 Stage 1 if SOC 2 CPA unresponsive by 2026-06-02             |
| 3   | Publish SLSA provenance to npm | mobile-engineering-lead  | **2026-05-30** | 13        | 🟠 Ready to fire       | Daily ping to org admin for `NPM_TOKEN`; document each ping  | Publish to GitHub Packages as fallback; migrate consumers                      |
| 4   | Apple Developer cert           | gtm-lead                 | **2026-06-06** | 20        | 🔴 Not started         | Submit application + payment; daily check on approval status | Delay desktop notarization; ship unsigned beta to pilot partners               |
| 5   | SIS pilot engagement letter    | gtm-lead                 | **2026-05-30** | 13        | 🟠 Draft ready         | Send draft to Zimbabwe contact; follow up every 48h          | Redirect to Ghana or Namibia pre-submission if no response by 2026-05-27       |
| 6   | FIPS boundary reviewer         | crypto-security-engineer | **2026-06-30** | 44        | 🟡 Reviewer identified | Send engagement letter to reviewer; confirm availability     | Use self-attestation with auditor review note if external reviewer unavailable |
| 7   | Zimbabwe pre-submission email  | gtm-lead                 | **2026-05-30** | 13        | 🟠 Draft ready         | Send email; cc legal counsel; track open rate and reply      | Switch to Botswana or DRC if Zimbabwe unresponsive by 2026-05-27               |

**Legend:** 🟢 On track | 🟡 At risk | 🟠 Urgent | 🔴 Blocked

---

## 2. Detailed Action Plans

### 2.1 Pen-Test Vendor Selection

**Owner:** crypto-security-engineer  
**Deadline:** 2026-06-16  
**Blocking:** R5 external validation; baseline-os, gtcx-core, gtcx-infrastructure production readiness

**This Week's Actions (Every 48h):**

- [ ] 2026-05-19: Follow-up email to Vendor A (Cobalt), Vendor B (Synack), Vendor C (African security boutique)
- [ ] 2026-05-21: Phone call to top 2 responders
- [ ] 2026-05-23: Evaluate proposals received; shortlist to 2
- [ ] 2026-05-26: Final negotiation and selection
- [ ] 2026-05-30: Sign SoW and schedule kickoff

**Evidence Location:** `docs/security/pen-test-engagement-log.md`

**Escalation Path:**

- Day 7 (2026-05-24): If <3 proposals received, escalate to Quality & Evidence Lead
- Day 14 (2026-05-31): If no vendor selected, escalate to CTO/CEO for exec introduction to vendor principals
- Day 21 (2026-06-07): If still unresolved, trigger contingency (expand to 8 vendors + African boutique)

**Contingency:** Expand RFP to 8 vendors including boutique African security firms. Accept 4-week lead time instead of 2-week if necessary. Pen-test can begin in July and still complete before August GA target.

---

### 2.2 SOC 2 Type 1 CPA Engagement

**Owner:** quality-evidence-lead  
**Deadline:** 2026-06-09  
**Blocking:** SOC 2 attestation; enterprise customer conversations; investor due diligence

**This Week's Actions (Every 24h):**

- [ ] 2026-05-18: Call CPA Firm 1 (BDO) and Firm 2 (Grant Thornton) to confirm engagement letter receipt
- [ ] 2026-05-19: Call CPA Firm 3 (local African firm with SOC 2 experience)
- [ ] 2026-05-20: Evaluate proposal turnaround times; select firm with fastest start date
- [ ] 2026-05-21: Negotiate scope and price; confirm Type 1 timeline (target: 2026-08-31)
- [ ] 2026-05-23: Signed engagement letter returned

**Evidence Location:** `docs/compliance/soc2-engagement-log.md`

**Escalation Path:**

- Day 5 (2026-05-22): If no firm has confirmed start date, escalate to CFO for budget flexibility (may need to pay premium for expedited start)
- Day 10 (2026-05-27): If still unsigned, trigger contingency (pivot to ISO 27001 Stage 1)

**Contingency:** Pivot to ISO 27001 Stage 1 audit with a local African certification body. ISO 27001 Stage 1 is faster to schedule (2-3 weeks) and satisfies many enterprise prospects. SOC 2 Type 1 can follow in Q3. This is **not** a downgrade — it's a parallel path.

---

### 2.3 SLSA Provenance Publish to npm

**Owner:** mobile-engineering-lead  
**Deadline:** 2026-05-30  
**Blocking:** SLSA Build L3 completion; supply chain attestation; enterprise trust

**This Week's Actions:**

- [ ] 2026-05-18: Email org admin requesting `NPM_TOKEN` with `publish` scope for `@gtcx/*` packages
- [ ] 2026-05-19: If no response, Slack DM to org admin + cc DevOps lead
- [ ] 2026-05-20: If still no response, escalate to CTO for org-level secret approval
- [ ] 2026-05-21: Once token received, add to GitHub org secrets as `NPM_TOKEN`
- [ ] 2026-05-22: Trigger release workflow; verify provenance attestation on npm
- [ ] 2026-05-23: Document provenance verification steps in `docs/security/slsa-attestation.md`

**Evidence Location:** `.github/workflows/release.yml`, `docs/security/slsa-attestation.md`

**Escalation Path:**

- Day 3 (2026-05-21): No token → escalate to DevOps lead
- Day 5 (2026-05-23): No token → escalate to CTO for org-level override
- Day 7 (2026-05-25): No token → trigger contingency

**Contingency:** Publish to GitHub Packages Registry (`ghcr.io` or GitHub npm) with provenance. Update downstream repos to pull from GitHub Packages instead of npm. This preserves SLSA L3 while resolving the token issue asynchronously. Migration back to npm is trivial once the token is available.

---

### 2.4 Apple Developer Certificate

**Owner:** gtm-lead  
**Deadline:** 2026-06-06  
**Blocking:** baseline-os desktop notarization; macOS distribution

**This Week's Actions:**

- [ ] 2026-05-18: Submit Apple Developer application ($99 payment)
- [ ] 2026-05-19: Confirm payment processed; obtain enrollment ID
- [ ] 2026-05-20: Check Apple Developer portal for approval status
- [ ] 2026-05-21: If pending, contact Apple Developer Support with enrollment ID
- [ ] 2026-05-25: Expected approval (standard: 2-5 business days)
- [ ] 2026-05-26: Generate Developer ID certificate; add to CI secrets

**Evidence Location:** Apple Developer portal; CI secrets inventory

**Escalation Path:**

- Day 7 (2026-05-25): If still pending, contact Apple Developer Support via phone
- Day 10 (2026-05-28): If rejected or stalled, escalate to legal counsel for D-U-N-S number verification

**Contingency:** Ship unsigned beta builds to pilot partners (Zimbabwe, Ghana) for initial testing. Notarization is required for public distribution but not for closed beta. This unblocks pilot testing by 4-6 weeks.

---

### 2.5 SIS Pilot Engagement Letter (Zimbabwe)

**Owner:** gtm-lead  
**Deadline:** 2026-05-30  
**Blocking:** Phase 8.2 case study; sovereign engagement credibility

**This Week's Actions:**

- [ ] 2026-05-18: Send engagement letter draft to Zimbabwe contact via email + WhatsApp
- [ ] 2026-05-19: Follow-up call to confirm receipt
- [ ] 2026-05-21: If no response, request introduction to decision-maker via mutual contact
- [ ] 2026-05-23: Second follow-up with simplified one-page version
- [ ] 2026-05-26: Final follow-up; set deadline for response

**Evidence Location:** `docs/gtm/09-pre-submission-email-zimbabwe.md`

**Escalation Path:**

- Day 7 (2026-05-25): No response → escalate to CEO for exec-level outreach
- Day 10 (2026-05-28): No response → trigger contingency

**Contingency:** Redirect to Ghana or Namibia pre-submission engagement. Both have warmer leads and faster response cycles. Zimbabwe can be re-engaged in Q3 when local champion is back from travel (per GTM intel).

---

### 2.6 FIPS Boundary Reviewer

**Owner:** crypto-security-engineer  
**Deadline:** 2026-06-30  
**Blocking:** FIPS 140-3 full validation; regulator acceptance

**This Week's Actions:**

- [ ] 2026-05-18: Send engagement letter to identified reviewer (Dr. [Name] at [Institution])
- [ ] 2026-05-20: Confirm availability and timeline
- [ ] 2026-05-23: Negotiate scope (cryptographic module boundary document review)
- [ ] 2026-05-26: Signed agreement and deposit
- [ ] 2026-06-02: Reviewer begins document review
- [ ] 2026-06-30: Review complete; feedback incorporated

**Evidence Location:** `docs/security/fips-boundary-review.md` (to be created)

**Escalation Path:**

- Day 14 (2026-06-01): No reviewer confirmed → expand search to NIST CMVP consultants list
- Day 21 (2026-06-08): No reviewer → trigger contingency

**Contingency:** Self-attestation with detailed auditor review notes. The FIPS module (AWS-LC CMVP #4816) is already validated. Our use is within the validated boundary. A third-party reviewer is ideal but not strictly required for regulator pre-submission. We can proceed with AWS-LC's existing validation documentation and add our own boundary analysis whitepaper.

---

### 2.7 Zimbabwe Pre-Submission Email

**Owner:** gtm-lead  
**Deadline:** 2026-05-30  
**Blocking:** Zimbabwe sandbox entry; Southern Africa credibility

**This Week's Actions:**

- [ ] 2026-05-18: Send pre-submission email (final draft from `docs/gtm/09-pre-submission-email-zimbabwe.md`)
- [ ] 2026-05-19: CC legal counsel; request read receipt
- [ ] 2026-05-21: Follow-up WhatsApp to contact
- [ ] 2026-05-23: Second email with subject "RE: GTCX Protocol — Sandbox Pre-Submission (Follow-up)"
- [ ] 2026-05-26: Final follow-up; propose alternative contact

**Evidence Location:** `docs/gtm/09-pre-submission-email-zimbabwe.md`

**Escalation Path:**

- Day 7 (2026-05-25): No reply → escalate to GTM advisor with Zimbabwe relationships
- Day 10 (2026-05-28): No reply → trigger contingency

**Contingency:** Same as 2.5 — redirect to Ghana or Namibia. The pre-submission email is a low-cost touchpoint; we can send to all three markets simultaneously if Zimbabwe remains cold.

---

## 3. Weekly Review Ritual

**When:** Every Monday 09:00 GMT  
**Where:** `ClickUp / baseline-os` Slack channel  
**Duration:** 15 minutes max

**Agenda:**

1. Read each blocker's status from this doc (2 min)
2. Owner reports: what happened last week, what will happen this week (10 min)
3. Identify any blockers slipping → assign escalation (3 min)

**Output:** Update this document with new statuses, revised deadlines, and escalation notes.

---

## 4. Escalation Matrix

| Level | Trigger                            | Action                                    | Decision Maker                |
| ----- | ---------------------------------- | ----------------------------------------- | ----------------------------- |
| 1     | Item at risk of slipping           | Owner increases contact frequency         | Owner                         |
| 2     | No progress after 5 business days  | Escalate to Quality & Evidence Lead       | Quality & Evidence Lead       |
| 3     | No progress after 10 business days | Escalate to CTO/CEO for exec intervention | CTO/CEO                       |
| 4     | Deadline passed with no closure    | Trigger contingency plan; revise roadmap  | Protocol Architect + GTM Lead |

---

## 5. Sign-Off

This action plan must be reviewed and signed off by:

| Role                    | Status     | Date | Notes |
| ----------------------- | ---------- | ---- | ----- |
| Quality & Evidence Lead | ⬜ Pending | —    |       |
| GTM Lead                | ⬜ Pending | —    |       |
| Security Lead           | ⬜ Pending | —    |       |
| Protocol Architect      | ⬜ Pending | —    |       |

**No external outreach shall proceed until all four roles have signed off.**

---

## 6. Change Log

| Date       | Change                                                                            | Author             |
| ---------- | --------------------------------------------------------------------------------- | ------------------ |
| 2026-05-17 | Initial action plan with hard deadlines, owners, daily actions, and contingencies | Protocol Architect |
