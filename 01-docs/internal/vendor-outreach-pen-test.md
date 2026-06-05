---
title: 'Pen-Test Vendor Outreach — Draft Emails'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'standard'
tags: ['documentation', 'internal']
review_cycle: 'on-change'
---

---

title: 'Pen-Test Vendor Outreach — Draft Emails'
status: 'draft'
date: '2026-05-25'
owner: 'crypto-security-engineer'
role: 'crypto-security-engineer'
tier: 'critical'
tags: ['internal', 'pen-test', 'vendor', 'outreach']
review_cycle: 'on-change'

---

# Pen-Test Vendor Outreach — Draft Emails

> **Status:** Draft — awaiting crypto-security-engineer review and send
> **Date:** 2026-05-25
> **Target send:** Wed 2026-05-28
> **RFP:** `01-docs/09-security/pen-test-rfp-2026.md`
> **Scope:** `01-docs/09-security/pen-test-scope.md`

---

## Longlist

| Vendor           | Contact                  | Specialty                                | Notes                                          |
| ---------------- | ------------------------ | ---------------------------------------- | ---------------------------------------------- |
| Trail of Bits    | security@trailofbits.com | Crypto, blockchain, smart contracts      | Strong reputation; has audited similar systems |
| NCC Group        | info@nccgroup.com        | Generalist, large team, global reach     | Good for enterprise buyer confidence           |
| Cure53           | info@cure53.de           | Web security, browser extensions, crypto | Smaller team, very thorough                    |
| Doyensec         | contact@doyensec.com     | Application security, cloud, mobile      | Startup-friendly pricing                       |
| Atredis Partners | contact@atredis.com      | Hardware, firmware, embedded, crypto     | Deep crypto experience; higher cost            |

---

## Template Email

**Subject:** RFP — External Penetration Test: GTCX Core Cryptographic Library (TradePass + WorkProof)

---

Hi [Vendor Name] security team,

GTCX is a global trade verification platform serving African commodity producers and regulators. We are preparing for sovereign-state regulatory sandbox admissions (Zimbabwe, Ghana, Namibia, DRC, Botswana) and require an external penetration test of our cryptographic and protocol foundation.

**Target:** `gtcx-core` — 21 TypeScript packages + 6 Rust crates (~31K LOC). Library-only, no hosted services. Full scope in attached RFP.

**Key surfaces:**

- Cryptographic signing (Ed25519, secp256k1) and verification flows
- Zero-knowledge proof generation/verification (Groth16 via arkworks)
- NAPI boundary between TypeScript and Rust crypto modules
- Key management and attestation lifecycle
- Supply chain and build integrity

**Deliverables required:**

1. Technical findings report with CVSS scoring and remediation guidance
2. Executive summary suitable for regulator submission
3. Remediation validation re-test (included in scope)

**Timeline:** 5–6 weeks active testing, starting mid-June 2026.
**Budget envelope:** $10K–$31K depending on scope depth and team size.

**Attachments:**

- `pen-test-rfp-2026.pdf` — full RFP with mandatory deliverables, vendor criteria, and acceptance checklist
- `pen-test-scope.pdf` — scoped attack surfaces, out-of-scope items, and test environment access

**Next step:** Please confirm receipt and indicate whether you can meet the timeline. We will schedule 30-minute scoping calls with shortlisted vendors by 2026-06-02.

Best regards,

[Cryptographic Security Engineer]
GTCX Protocol Security
security@gtcx.trade

---

## Customization Notes per Vendor

### Trail of Bits

- Mention: "We noted your audits of @noble/curves and ed25519-dalek — our system builds directly on these libraries."
- Emphasis: Deep crypto audit, formal verification where applicable

### NCC Group

- Mention: "We require a customer-deliverable report suitable for bank-grade vendor risk assessments."
- Emphasis: Report quality, enterprise credentials, fast turnaround

### Cure53

- Mention: "Our NAPI boundary and WebCrypto polyfills align with your browser-extension and web-security expertise."
- Emphasis: Web-facing surfaces, edge-case input handling

### Doyensec

- Mention: "We are a lean team shipping to African regulators with tight budgets."
- Emphasis: Cost efficiency, flexible scope, startup-friendly engagement

### Atredis Partners

- Mention: "Our Rust crypto modules and potential HSM integrations align with your hardware/crypto focus."
- Emphasis: Deep crypto, HSM readiness, highest assurance level

---

## Follow-Up Schedule

| Date       | Action                        | Owner                                         |
| ---------- | ----------------------------- | --------------------------------------------- |
| 2026-05-28 | Send emails to all 5 vendors  | crypto-security-engineer                      |
| 2026-06-02 | Scoping calls with responders | crypto-security-engineer                      |
| 2026-06-09 | Select preferred vendor       | crypto-security-engineer + Protocol Architect |
| 2026-06-16 | SoW signed, kickoff scheduled | crypto-security-engineer                      |
| 2026-06-23 | Active testing begins         | Vendor                                        |

---

## Tracking

| Vendor           | Sent | Response | Quote | Timeline | Status  |
| ---------------- | ---- | -------- | ----- | -------- | ------- |
| Trail of Bits    | —    | —        | —     | —        | Pending |
| NCC Group        | —    | —        | —     | —        | Pending |
| Cure53           | —    | —        | —     | —        | Pending |
| Doyensec         | —    | —        | —     | —        | Pending |
| Atredis Partners | —    | —        | —     | —        | Pending |
