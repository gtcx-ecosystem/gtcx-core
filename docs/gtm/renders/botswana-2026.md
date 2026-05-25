---
title: 'Botswana Sandbox Intro — Send-Ready Render'
status: 'draft'
date: '2026-05-25'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'critical'
tags: ['gtm', 'engagement', 'render', 'botswana', 'sandbox', 'send-ready']
review_cycle: 'on-change'
---

# Botswana Sandbox Intro — Send-Ready Render

> **Status:** Draft — send-blocked on shared gates (see [Zimbabwe render](./zimbabwe-2026.md#send-blocked-on-verify-each-before-send))
> **Date:** 2026-05-25
> **Rendered from:** [`sandbox-intro-email-template.md`](../sandbox-intro-email-template.md) using the **Botswana** row in the parameter table
> **Operational state:** [`docs/agile/engagement-log/2026-botswana-sandbox.md`](../../agile/engagement-log/2026-botswana-sandbox.md)

## Recipient decision

Botswana is the one engagement where the **mining authority (Department of Mines / Ministry of Minerals and Energy)** is the more natural primary than the central bank — diamond traceability is the country's flagship regulatory tradition. Default below addresses DoM with Bank of Botswana (BoB) cited inline.

---

## Email body (ready to copy-paste)

```
To: info@mom.gov.bw           ← verify before send
Cc: engagement@gtcx.io
Subject: GTCX Protocol — pre-submission meeting request for Botswana commodity-export sandbox cohort
```

Dear Department of Mines, Ministry of Minerals and Energy team,

I'm writing on behalf of GTCX Protocol — the open cryptographic foundation we've built to give Batswana commodity producers, regulators, and export partners a shared trust layer for chain-of-custody attestation. Our core library is independently auditable, FIPS-aligned, and designed specifically for the constraints Southern African commodity supply chains face (offline-first, low-bandwidth, sovereign data residency).

We would value a 45-minute pre-submission meeting to walk through our work and understand how it best fits into the DoM structure (or, if more appropriate, the Bank of Botswana (BoB) regulatory framework). Three concrete artifacts we'd ask you to review beforehand, all public and independently verifiable:

1. **Trust portal** — [trust.gtcx.io](https://gtcx-ecosystem.github.io/gtcx-core/governance/trust-portal) _(custom domain provisioning in flight)_. Index of every security and compliance artifact, with file paths to each piece of evidence.
2. **Internal completion audit (2026-05-21)** — composite 9.5/10 across security, code quality, and operational readiness; 24/24 internal items complete with cited evidence per item.
3. **Fuzz campaign evidence (2026-05-21)** — six cryptographic primitives, 500,000+ libFuzzer iterations, zero crashes, zero panics, zero AddressSanitizer violations.

In addition, an external penetration test and SOC 2 Type 1 attestation are contracted and in motion (target completion 2026-08-25 and 2026-09-15 respectively). We can share the engagement letters under NDA at the meeting.

**On Botswana-specific readiness:** we have a per-jurisdiction configuration validated end-to-end against our cryptographic surface, anchored to the country's regulatory authority structure (Bank of Botswana (BoB) for mining oversight, DoM for payment-rails), Pula settlement, and the English and Setswana localization. The reference fixture sits in the gtcx-core repo — the production version requires your team's sign-off on the regulatory parameters. Botswana's diamond-traceability regulatory tradition is one of the most mature in the world. We're prioritizing engagement here because the institutional muscle for export-grade chain-of-custody already exists at world-class quality, and GTCX is designed to extend that pattern beyond a single sector.

We would be happy to come to Gaborone in person at your convenience, or to meet by video. If a Johannesburg-hub trip with cross-border travel is more efficient, that also works. Please let us know which weeks in June or July suit the team.

For procurement / vendor risk purposes the relevant primary contact is:

- **Cryptographic Security:** _security@gtcx.io_
- **Engineering:** _engineering@gtcx.io_
- **Engagement lead:** _<your name and contact>_

Thank you for the work you've done supporting innovation in Botswana. We hope GTCX can be a useful element of that effort.

With appreciation,

_<Sender name>_
_<Title>_
GTCX Protocol
trust.gtcx.io

---

## Note on authority mapping

The "BoB for mining oversight, DoM for payment-rails" phrasing in the readiness paragraph is intentionally inverted from the other countries — Botswana is the engagement where mining authority is primary. Before send, double-check the parameter row in the [canonical template](../sandbox-intro-email-template.md) and confirm whether the paragraph reads naturally with this inversion or whether the wording should be reworked to lead with DoM.

## Related

- [Canonical template](../sandbox-intro-email-template.md) · [Engagement log](../../agile/engagement-log/2026-botswana-sandbox.md) · [Engagement playbook](../../agile/engagement-log/playbook.md)
