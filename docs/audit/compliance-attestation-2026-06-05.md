---
title: 'Compliance & attestation readiness — gtcx-core'
status: current
date: 2026-06-05
owner: gtcx-core
role: crypto-security-engineer
document_id: AUDIT-COMPLIANCE-2026-06-05
audit_type: compliance-attestation
composite_controls: 8.8
composite_attestation: 5.5
tier: critical
tags: ['audit', 'compliance', 'soc2', 'pen-test', 'attestation']
review_cycle: quarterly
supersedes_note: 'Bank-grade trust artifacts separated from engineering readiness'
---

# Compliance & attestation readiness — gtcx-core

**Date:** 2026-06-05  
**Model:** [readiness-model.md](./readiness-model.md)

---

## What this measures

Whether **external parties** (auditors, regulators, enterprise procurement) can rely on **delivered attestations** — not whether CI is green.

| Sub-score                   |      Value | Meaning                                                                   |
| --------------------------- | ---------: | ------------------------------------------------------------------------- |
| **In-repo control design**  | **8.8/10** | FIPS implementation, threat matrix, fuzz, secret scan, governance scripts |
| **Third-party attestation** | **5.5/10** | Missing or blocked external artifacts                                     |
| **Procurement-ready?**      |     **No** | Cannot pass vendor onboarding on attestations alone                       |

**Do not** call this “engineering 8.9.” Use the two sub-scores explicitly.

---

## Attestation inventory

| Artifact                                     | Required for                    | Status               | Evidence                                                                                                 |
| -------------------------------------------- | ------------------------------- | -------------------- | -------------------------------------------------------------------------------------------------------- |
| FIPS 140-3 module use (aws-lc-rs CMVP #4816) | Regulated crypto claims         | **In-repo verified** | `cargo test -p gtcx-crypto --features fips`                                                              |
| Third-party pen-test report                  | Enterprise / sovereign security | **Missing**          | [external-validation-findings-log.md](../release/external-validation-findings-log.md) empty; EXT-INF-002 |
| SOC 2 Type I letter                          | US/EU bank track                | **Missing**          | [soc2-readiness.md](../compliance/soc2-readiness.md) — design only                                       |
| Trusted-setup ceremony transcript            | D3 M3.2 release gate            | **Blocked**          | CORE-004 / XR-402                                                                                        |
| Sigstore npm provenance                      | Supply-chain                    | **Delivered**        | 22/22 strict check                                                                                       |
| Internal security assessment                 | Substitute until pen-test       | **Delivered**        | [internal-security-assessment.md](../security/internal-security-assessment.md)                           |
| EAP staging issuance evidence                | Phase B proof                   | **Delivered**        | `docs/audit/evidence/eap-issuance-2026-06-03-*`                                                          |

---

## Open items (compliance lane)

| Sev | ID         | Finding                                              | Owner               | Unblocks                                      |
| --- | ---------- | ---------------------------------------------------- | ------------------- | --------------------------------------------- |
| P1  | COMP-P1-01 | Live-stack pen-test report                           | gtcx-infrastructure | Enterprise + sovereign security questionnaire |
| P1  | COMP-P1-02 | SOC 2 Type I CPA letter                              | Compliance + CPA    | US/EU bank procurement                        |
| P1  | COMP-P1-03 | XR-402 ceremony → CORE-004 transcript                | Core + infra        | ZKP release attestation narrative             |
| P2  | COMP-P2-01 | Link pen-test summary to trust portal when delivered | Quality             | Public trust posture                          |

---

## Relationship to “bank-grade composite”

[master-audit-2026-06-03.md](./master-audit-2026-06-03.md) reported **8.9/10** as a **blended investor/enterprise lens** (engineering + trust gap). That number is **deprecated as a single engineering score**.

For diligence:

- Cite **engineering 9.5** for build quality.
- Cite **attestation 5.5** for procurement gates.
- Cite **GTM stages** for commercial adoptability → [gtm-readiness-2026-06-05.md](./gtm-readiness-2026-06-05.md).

---

## Trust portal

Procurement-facing index: [trust-portal.md](../governance/trust-portal.md) · [trust-portal-evidence.md](../governance/trust-portal-evidence.md)

Honest gap section remains authoritative until COMP-P1-01 and COMP-P1-02 close.
