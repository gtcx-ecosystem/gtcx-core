# Pre-Submission Email — Reserve Bank of Zimbabwe

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

**To:** Fintech Regulatory Sandbox Unit, Reserve Bank of Zimbabwe
**CC:** Securities and Exchange Commission of Zimbabwe (SECZ)
**Subject:** Pre-Submission Consultation Request — Commodity Verification Protocol

---

## Email Draft

Subject: **Request for Pre-Submission Consultation — Digital Commodity Verification Infrastructure**

Dear Fintech Regulatory Sandbox Team,

I am writing to request a pre-submission consultation regarding the GTCX Verification Protocol — a cryptographic infrastructure platform for digitally verifying commodity origins, custody chains, and trade compliance across Zimbabwe's mining and agricultural sectors.

### What We Do

GTCX provides a digital verification system that enables:

- **Proof of origin** for gold, platinum, lithium, diamonds, and chrome at the point of extraction
- **Chain of custody** tracking from artisanal mining sites through aggregation, processing, and export
- **Compliance certificates** that are cryptographically signed, tamper-evident, and verifiable offline
- **Identity credentials** for producers, aggregators, traders, custodians, and regulatory authorities

The system is designed specifically for environments with intermittent connectivity, uses zero-knowledge proofs for selective disclosure of trade data, and operates on mobile devices without requiring continuous internet access.

### Why Zimbabwe

Zimbabwe's gold sector — particularly artisanal and small-scale mining (ASM) — faces significant verification challenges that our protocol is designed to address:

- Traceability from point of extraction to Fidelity Gold Refinery and export
- Digital identity for licensed and unlicensed operators entering the formal system
- Compliance evidence for the Extractive Industries Transparency Initiative (EITI) and Kimberley Process
- Offline verification capability for remote mining sites

We believe Zimbabwe's Fintech Regulatory Sandbox is the appropriate venue to validate our protocol in a controlled environment with regulatory oversight.

### Our Readiness

- **Security:** Internal cryptographic security assessment complete. 9.9 million fuzz test executions with zero vulnerabilities found. Full STRIDE threat model with 18 threats mapped to mitigations.
- **Standards:** ISO 27001 controls mapped. SOC 2 trust criteria addressed. FIPS 140-3 compliant via validated cryptographic modules (CMVP #4282, #4816).
- **Architecture:** 21 TypeScript packages and 6 Rust crates. No custom cryptographic implementations — all operations delegate to internationally audited libraries.
- **Commodity coverage:** Gold, platinum, diamonds, lithium, chrome, and 20+ additional commodity types supported natively.

### Our Request

We would appreciate a 30-minute consultation to:

1. Understand the evidence requirements for sandbox admission as a cryptographic infrastructure provider
2. Clarify whether our internal security assessment is acceptable or if an external penetration test is required
3. Discuss the appropriate scope for a sandbox pilot — we propose gold supply chain verification as the initial use case
4. Understand the timeline from application to admission

We are prepared to provide a complete evidence pack including our security assessment, compliance matrix, FIPS boundary statement, and technical architecture documentation at your request.

### About GTCX

GTCX (Global Trade & Compliance Exchange) is building the verification infrastructure for commodity trade in Africa. Our cryptographic foundation is open-source, audited, and designed for the constraints of the Global South — offline-first, mobile-capable, and sovereignty-preserving. We do not custody funds, process payments, or handle personal data.

I am available at your convenience for a consultation meeting.

Respectfully,

[Name]
[Title]
GTCX Protocol
[Email]
[Phone]

---

## Attachments to Prepare

When the sandbox team responds, have these ready as PDFs:

1. **Executive Brief** — `docs/gtm/00-executive-brief.md`
2. **Security Posture** — `docs/gtm/01-security-posture.md`
3. **Compliance Matrix** — `docs/gtm/02-compliance-matrix.md`
4. **FIPS Readiness** — `docs/gtm/03-fips-readiness.md`

## Contact Information

| Entity            | Contact           | Notes                                                    |
| ----------------- | ----------------- | -------------------------------------------------------- |
| RBZ Fintech Unit  | fintech@rbz.co.zw | Primary contact for sandbox applications                 |
| SECZ              | info@seczim.co.zw | Securities regulator — relevant for digital certificates |
| Ministry of Mines | —                 | For mining-specific regulatory alignment                 |

## Follow-Up Protocol

1. Send email (adapt draft above)
2. Follow up after 5 business days if no response
3. If meeting is scheduled, prepare 10-minute presentation from executive brief
4. Bring printed copies of security posture and compliance matrix
5. Take notes on specific evidence requirements — update docs/gtm/ accordingly
