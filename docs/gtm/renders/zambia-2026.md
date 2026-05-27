---
title: 'Zambia Sandbox Intro — Send-Ready Render'
status: current
date: '2026-05-27'
owner: protocol-architect
role: protocol-architect
tier: critical
tags:
  - gtm
  - engagement
  - render
  - zambia
  - sandbox
  - send-ready
review_cycle: on-change
---

# Zambia Sandbox Intro — Send-Ready Render

> **Status:** Ready to send — 1 of 8 gates remains pending (engagement-lead designation)
> **Date:** 2026-05-27
> **Rendered from:** [`sandbox-intro-email-template.md`](../sandbox-intro-email-template.md) using the **Zambia** row in the parameter table
> **Operational state:** [`docs/agile/engagement-log/2026-zambia-sandbox.md`](../../agile/engagement-log/2026-zambia-sandbox.md)
> **Shared gate status:** See [Zimbabwe render](./zimbabwe-2026.md#send-blocked-on-verify-each-before-send) — npm publish done, trust portal live

This is the literal send-ready render of the canonical template with every `{{placeholder}}` substituted for Zambia. Copy the body below into the email client when all pre-send gates clear.

---

## Email body (ready to copy-paste)

```
To: innovation@boz.zm           ← verify before send
Cc: engagement@gtcx.io
Subject: GTCX Protocol — pre-submission meeting request for Zambia commodity-export sandbox cohort
```

Dear Bank of Zambia Regulatory Sandbox team,

I'm writing on behalf of GTCX Protocol — the open cryptographic foundation we've built to give Zambian commodity producers, regulators, and export partners a shared trust layer for chain-of-custody attestation. Our core library is independently auditable, FIPS-aligned, and designed specifically for the constraints Southern African commodity supply chains face (offline-first, low-bandwidth, sovereign data residency).

We would value a 45-minute pre-submission meeting to walk through our work and understand how it best fits into the BoZ structure (or, if more appropriate, the Ministry of Mines and Minerals Development regulatory framework). Three concrete artifacts we'd ask you to review beforehand, all public and independently verifiable:

1. **Trust portal** — [gtcx-protocol.gitbook.io/gtcx-open-source](https://gtcx-protocol.gitbook.io/gtcx-open-source/governance/trust-portal). Index of every security and compliance artifact, with file paths to each piece of evidence.
2. **Internal completion audit (2026-05-21)** — composite 9.5/10 across security, code quality, and operational readiness; 24/24 internal items complete with cited evidence per item.
3. **Fuzz campaign evidence (2026-05-21)** — six cryptographic primitives, 500,000+ libFuzzer iterations, zero crashes, zero panics, zero AddressSanitizer violations.

In addition, an external penetration test and SOC 2 Type 1 attestation are contracted and in motion (target completion 2026-08-25 and 2026-09-15 respectively). We can share the engagement letters under NDA at the meeting.

**On Zambia-specific readiness:** we have a per-jurisdiction configuration validated end-to-end against our cryptographic surface, anchored to the country's regulatory authority structure (Ministry of Mines and Minerals Development for mining oversight, BoZ for payment-rails), Zambian Kwacha settlement, and the English, with Bemba, Nyanja, Tonga widely used localization. The reference fixture sits in the gtcx-core repo — the production version requires your team's sign-off on the regulatory parameters. Zambia's copper-export regulatory framework and the BoZ sandbox structure together make this a natural early engagement — the country has both the institutional surface for chain-of-custody attestation and the financial-sector willingness to pilot adjacent-fintech use cases.

We would be happy to come to Lusaka in person at your convenience, or to meet by video. If a Johannesburg-hub trip with cross-border travel is more efficient, that also works. Please let us know which weeks in June or July suit the team.

For procurement / vendor risk purposes the relevant primary contact is:

- **Cryptographic Security:** _security@gtcx.io_
- **Engineering:** _engineering@gtcx.io_
- **Engagement lead:** _<your name and contact>_

Thank you for the work you've done supporting innovation in Zambia. We hope GTCX can be a useful element of that effort.

With appreciation,

_<Sender name>_
_<Title>_
GTCX Protocol
gtcx-protocol.gitbook.io/gtcx-open-source

---

## Substitutions applied (audit trail)

| Placeholder               | Substituted with                                                                                                         |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `{{country}}`             | Zambia                                                                                                                   |
| `{{country_adjective}}`   | Zambian                                                                                                                  |
| `{{region}}`              | Southern African                                                                                                         |
| `{{regulator_recipient}}` | Bank of Zambia Regulatory Sandbox                                                                                        |
| `{{regulator_short}}`     | BoZ                                                                                                                      |
| `{{regulator_email}}`     | innovation@boz.zm _(unverified — confirm before send)_                                                                   |
| `{{secondary_authority}}` | Ministry of Mines and Minerals Development                                                                               |
| `{{currency_name}}`       | Zambian Kwacha                                                                                                           |
| `{{language_set}}`        | English, with Bemba, Nyanja, Tonga widely used                                                                           |
| `{{country_framing}}`     | Zambia's copper-export regulatory framework and the BoZ sandbox structure together make this a natural early engagement. |
| `{{travel_city}}`         | Lusaka                                                                                                                   |
| `{{travel_hub}}`          | Johannesburg                                                                                                             |

## Fallback if BoZ defers to Ministry of Mines

If BoZ replies that the use case is out-of-scope for the Regulatory Sandbox, send the same body to the Ministry of Mines and Minerals Development with these substitutions:

- Subject: replace "Zambia commodity-export sandbox cohort" with "Zambia commodity-export traceability framework"
- Opening line: replace "Bank of Zambia Regulatory Sandbox team" with "Ministry of Mines and Minerals Development team"
- "BoZ structure" → "Ministry structure"
- "Ministry of Mines and Minerals Development regulatory framework" → "BoZ Regulatory Sandbox" (the roles swap)

## Related

- [Canonical template](../sandbox-intro-email-template.md) — source of truth
- [Engagement log](../../agile/engagement-log/2026-zambia-sandbox.md) — operational state
- [Engagement playbook](../../agile/engagement-log/playbook.md) — process discipline
- [Zimbabwe render](./zimbabwe-2026.md) — shared gate status
