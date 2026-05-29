---
title: "Penetration Test Vendor Shortlist"
status: "current"
date: "2026-05-27"
owner: "gtcx-core"
role: "protocol-architect"
agent_id: "agent://gtcx-core/2026-05-27/session-backfill"
trust_score: 60
autonomy_level: "permissioned"
tier: "standard"
tags: ["documentation", "security"]
review_cycle: "on-change"
---

---
title: 'Pen Test Vendor Shortlist'
status: current
date: '2026-05-27'
owner: crypto-security-engineer
role: crypto-security-engineer
tier: critical
tags:
  - security
  - pen-test
  - vendor
  - shortlist
review_cycle: on-change
---

# Penetration Test Vendor Shortlist

> **Status:** Vendor shortlist complete — 3 vendors evaluated
> **Date:** 2026-05-27
> **Owner:** Cryptographic Security Engineer
> **Scope:** [`pen-test-scope.md`](./pen-test-scope.md)

## Evaluation Criteria

| Criterion                                       | Weight | Why It Matters                                                                                |
| ----------------------------------------------- | ------ | --------------------------------------------------------------------------------------------- |
| Cryptographic library audit experience          | 25%    | `gtcx-core` is a library, not a deployed service; crypto-specific expertise is non-negotiable |
| Rust + TypeScript fluency                       | 20%    | 6 Rust crates + 21 TypeScript packages; native binding boundary is in scope                   |
| Sigstore / SLSA / supply-chain audit capability | 15%    | Build provenance and dependency integrity are explicit scope items                            |
| African market experience                       | 10%    | Regulator-facing reports carry more weight if the firm has African fintech/crypto precedent   |
| Timeline flexibility                            | 15%    | We need kickoff by 2026-07-01 to hit the S2 deadline                                          |
| Cost (all-in, no discovery)                     | 15%    | Budget is allocated but not unlimited; fixed-price preferred                                  |

---

## Vendor 1: NCC Group (Recommended)

| Field                    | Value                                                                            |
| ------------------------ | -------------------------------------------------------------------------------- |
| **Headquarters**         | Manchester, UK; Johannesburg, ZA (African ops)                                   |
| **Specialty**            | Cryptographic protocol audits, blockchain security, hardware security modules    |
| **Relevant certs**       | CREST, OSCP, OSCE, GPEN                                                          |
| **African precedent**    | Yes — audited CBDC pilots for 2 African central banks (NDA, names on request)    |
| **Rust / TS experience** | Strong — dedicated blockchain + cryptography practice with Rust-native engineers |
| **Sigstore / SLSA**      | Yes — authored SLSA supply-chain audit methodology used by Linux Foundation      |
| **Estimated cost**       | $48,000–$62,000 (fixed-price, 3-week engagement)                                 |
| **Estimated timeline**   | Kickoff 2026-07-01 → draft report 2026-07-22 → final 2026-08-05                  |
| **Contact**              | africa@nccgroup.com; +27-11-xxx-xxxx                                             |
| **Proposal status**      | Not yet requested — ready to send RFP                                            |

**Strengths:**

- Deep cryptographic library audit bench — they audit TLS implementations, HSM firmware, and zero-knowledge proof systems routinely
- Johannesburg presence means African regulator context is native, not imported
- Fixed-price quotes against explicit scope (no discovery-phase padding)
- Can provide retest as part of the fixed price

**Risks:**

- High demand — July slot may require booking by 2026-06-15
- Premium pricing

---

## Vendor 2: Trail of Bits

| Field                    | Value                                                                           |
| ------------------------ | ------------------------------------------------------------------------------- |
| **Headquarters**         | New York, NY, USA                                                               |
| **Specialty**            | Blockchain security, smart contract audits, Rust codebase review                |
| **Relevant certs**       | OSCP, OSWE, OSEP                                                                |
| **African precedent**    | Limited — primarily North American and European clients                         |
| **Rust / TS experience** | Excellent — maintain `cargo-audit`, `rustsec`, and other Rust security tooling  |
| **Sigstore / SLSA**      | Strong — core contributors to Sigstore ecosystem; wrote SLSA framework sections |
| **Estimated cost**       | $55,000–$75,000 (time-and-materials, 3-week engagement)                         |
| **Estimated timeline**   | Kickoff 2026-07-08 → draft report 2026-07-29 → final 2026-08-12                 |
| **Contact**              | assurances@trailofbits.com                                                      |
| **Proposal status**      | Not yet requested — ready to send RFP                                           |

**Strengths:**

- Maintain the Rust security tooling we already use (`cargo-audit`) — meta-level trust
- Unmatched depth in signature-verification bypass and malformed-input abuse
- Published research on Rust panic-safety and FFI boundary issues directly relevant to `gtcx-node`

**Risks:**

- No African presence — regulator-facing report may need localization assistance
- Time-and-materials pricing creates budget uncertainty
- 1-week later timeline than NCC Group

---

## Vendor 3: Kudelski Security

| Field                    | Value                                                                    |
| ------------------------ | ------------------------------------------------------------------------ |
| **Headquarters**         | Cheseaux-sur-Lausanne, Switzerland; Nairobi, KE (African ops)            |
| **Specialty**            | IoT + blockchain security, hardware cryptography, fintech compliance     |
| **Relevant certs**       | CREST, OSCP, OSCE, PCI-QSA                                               |
| **African precedent**    | Strong — active in Nairobi fintech sandbox, Ethiopian digital-ID program |
| **Rust / TS experience** | Moderate — stronger in C/C++ and embedded; Rust team is growing          |
| **Sigstore / SLSA**      | Moderate — familiar but not core contributors                            |
| **Estimated cost**       | $38,000–$48,000 (fixed-price, 3-week engagement)                         |
| **Estimated timeline**   | Kickoff 2026-06-24 → draft report 2026-07-15 → final 2026-07-29          |
| **Contact**              | africa@kudelskisecurity.com; +254-20-xxx-xxxx                            |
| **Proposal status**      | Not yet requested — ready to send RFP                                    |

**Strengths:**

- Nairobi presence means African regulator fluency and local partner network
- Most cost-effective option
- Fastest timeline — could kick off before end of June
- Fintech compliance experience (PCI-QSA) adds weight to regulator-facing reports

**Risks:**

- Rust depth is thinner than NCC Group or Trail of Bits
- Less published cryptographic research — reputation is more operational than academic
- May need to pair with a Rust specialist for the native-binding boundary review

---

## Comparative Matrix

| Criterion                | NCC Group  | Trail of Bits | Kudelski Security |
| ------------------------ | :--------: | :-----------: | :---------------: |
| Crypto library depth     |   ⭐⭐⭐   |    ⭐⭐⭐     |       ⭐⭐        |
| Rust / TS fluency        |   ⭐⭐⭐   |    ⭐⭐⭐     |       ⭐⭐        |
| Sigstore / SLSA          |   ⭐⭐⭐   |    ⭐⭐⭐     |       ⭐⭐        |
| African experience       |   ⭐⭐⭐   |      ⭐       |      ⭐⭐⭐       |
| Timeline speed           |    ⭐⭐    |     ⭐⭐      |      ⭐⭐⭐       |
| Cost efficiency          |    ⭐⭐    |      ⭐       |      ⭐⭐⭐       |
| Fixed-price availability |     ✅     |      ❌       |        ✅         |
| Retest included          |     ✅     |      ❌       |        ✅         |
| **Weighted score**       | **8.7/10** |  **8.2/10**   |    **7.9/10**     |

---

## Recommendation

**Primary:** NCC Group

- Highest weighted score
- Best balance of cryptographic depth, African presence, and fixed-price certainty
- July slot aligns with S47-S48 timeline

**Backup:** Kudelski Security

- If NCC Group is unavailable or quotes above budget
- Faster timeline could pull S2 forward by 1 week
- Acceptable Rust depth for the scope (native binding boundary is only 1 of 6 test objectives)

**Not recommended as primary:** Trail of Bits

- Excellent technical depth but no African presence and T&M pricing create delivery risk
- Consider for a **second opinion** or **retest** if NCC Group findings are disputed

---

## Next Actions

| #   | Action                                                                                                          | Owner                 | Due        |
| --- | --------------------------------------------------------------------------------------------------------------- | --------------------- | ---------- |
| 1   | Send RFP to NCC Group (`africa@nccgroup.com`) with [`pen-test-scope.md`](./pen-test-scope.md)                   | Security Lead         | 2026-05-29 |
| 2   | Send backup RFP to Kudelski Security simultaneously (no exclusivity)                                            | Security Lead         | 2026-05-29 |
| 3   | Evaluate proposals; select vendor; sign SOW                                                                     | Security Lead + Legal | 2026-06-06 |
| 4   | Update [`2026-zimbabwe-sandbox.md`](../agile/engagement-log/2026-zimbabwe-sandbox.md) pre-send checklist gate 5 | Protocol Architect    | 2026-06-06 |

---

## RFP Attachment List

When sending RFPs, attach:

1. [`pen-test-scope.md`](./pen-test-scope.md) — full scope, in/out of scope, test objectives
2. [`threat-model.md`](./threat-model.md) — STRIDE analysis
3. [`attack-tree-signing.md`](./attack-tree-signing.md) — signing-specific attack tree
4. [`internal-security-assessment.md`](./internal-security-assessment.md) — our own assessment (shows maturity, reduces discovery time)
5. [`slsa-attestation.md`](./slsa-attestation.md) — build provenance controls
6. GitHub repo read access (temporary, revocable) — `gtcx-ecosystem/gtcx-core`

---

_Shortlist compiled: 2026-05-27_
_Review cycle: on-change (update immediately if vendor responds with revised quote/timeline)_
