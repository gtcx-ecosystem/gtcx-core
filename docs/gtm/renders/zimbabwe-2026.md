---
title: 'Zimbabwe Sandbox Intro — Send-Ready Render'
status: 'draft'
date: '2026-05-24'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'critical'
tags: ['gtm', 'engagement', 'render', 'zimbabwe', 'sandbox', 'send-ready']
review_cycle: 'on-change'
---

# Zimbabwe Sandbox Intro — Send-Ready Render

> **Status:** Draft — send-blocked on three gates (see below)
> **Date:** 2026-05-24
> **Rendered from:** [`sandbox-intro-email-template.md`](../sandbox-intro-email-template.md) using the **Zimbabwe** row in the parameter table
> **Operational state:** [`docs/agile/engagement-log/2026-zimbabwe-sandbox.md`](../../agile/engagement-log/2026-zimbabwe-sandbox.md)

This is the literal send-ready render of the canonical template with every `{{placeholder}}` substituted for Zimbabwe. Copy the body below into the email client when all pre-send gates clear.

## Send-blocked on (verify each before send)

| Gate                             | Status     | Source                                                                                                            |
| -------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------- |
| Trust portal URL returns 200     | ⏸️ Pending | Requires GitHub Pages enablement per [hosting runbook](../../operations/trust-portal-hosting.md)                  |
| npm packages published           | ⏸️ Pending | Requires `gh workflow run release.yml` after CI green on `4f50c37`                                                |
| Recipient address verified       | ⏸️ Pending | `sandbox@rbz.co.zw` is the candidate; verify via RBZ published directory or partner intro before send             |
| Engagement-lead name designated  | ⏸️ Pending | Replace `<your name and contact>` below                                                                           |
| Sender name + title designated   | ⏸️ Pending | Replace `<Sender name>` / `<Title>` below                                                                         |
| Pen-test SoW state confirmed     | ⏸️ Pending | If signed, language stands; if pre-signing, change "contracted and in motion" → "vendor selected, kickoff <date>" |
| SOC 2 CPA letter state confirmed | ⏸️ Pending | Same: if signed, language stands; if pre-signing, change accordingly                                              |
| Protocol Architect approval      | ⏸️ Pending | Required before send                                                                                              |

After all gates clear, send the body below and update [`2026-zimbabwe-sandbox.md`](../../agile/engagement-log/2026-zimbabwe-sandbox.md) event log with the send date.

---

## Email body (ready to copy-paste)

```
To: sandbox@rbz.co.zw           ← verify before send
Cc: engagement@gtcx.io
Subject: GTCX Protocol — pre-submission meeting request for Zimbabwe commodity-export sandbox cohort
```

Dear Reserve Bank of Zimbabwe Fintech Sandbox team,

I'm writing on behalf of GTCX Protocol — the open cryptographic foundation we've built to give Zimbabwean commodity producers, regulators, and export partners a shared trust layer for chain-of-custody attestation. Our core library is independently auditable, FIPS-aligned, and designed specifically for the constraints Southern African commodity supply chains face (offline-first, low-bandwidth, sovereign data residency).

We would value a 45-minute pre-submission meeting to walk through our work and understand how it best fits into the RBZ structure (or, if more appropriate, the Ministry of Mines and Mining Development (MMMD) regulatory framework). Three concrete artifacts we'd ask you to review beforehand, all public and independently verifiable:

1. **Trust portal** — [gtcx-protocol.gitbook.io/gtcx-open-source](https://gtcx-protocol.gitbook.io/gtcx-open-source/governance/trust-portal). Index of every security and compliance artifact, with file paths to each piece of evidence.
2. **Internal completion audit (2026-05-21)** — composite 9.5/10 across security, code quality, and operational readiness; 24/24 internal items complete with cited evidence per item.
3. **Fuzz campaign evidence (2026-05-21)** — six cryptographic primitives, 500,000+ libFuzzer iterations, zero crashes, zero panics, zero AddressSanitizer violations.

In addition, an external penetration test and SOC 2 Type 1 attestation are contracted and in motion (target completion 2026-08-25 and 2026-09-15 respectively). We can share the engagement letters under NDA at the meeting.

**On Zimbabwe-specific readiness:** we have a per-jurisdiction configuration validated end-to-end against our cryptographic surface, anchored to the country's regulatory authority structure (Ministry of Mines and Mining Development (MMMD) for mining oversight, RBZ for payment-rails), Zimbabwe Dollar settlement, and the English, Shona, and Ndebele localization. The reference fixture sits in the gtcx-core repo — the production version requires your team's sign-off on the regulatory parameters. The RBZ Fintech Sandbox is one of the more structured Southern African sandbox programs and a credible adjacent-fintech path for commodity-export use cases. We're prioritizing engagement here because the regional precedent it sets matters for the broader continental effort.

We would be happy to come to Harare in person at your convenience, or to meet by video. If a Johannesburg-hub trip with cross-border travel is more efficient, that also works. Please let us know which weeks in June or July suit the team.

For procurement / vendor risk purposes the relevant primary contact is:

- **Cryptographic Security:** _security@gtcx.io_
- **Engineering:** _engineering@gtcx.io_
- **Engagement lead:** _<your name and contact>_

Thank you for the work you've done supporting innovation in Zimbabwe. We hope GTCX can be a useful element of that effort.

With appreciation,

_<Sender name>_
_<Title>_
GTCX Protocol
gtcx-protocol.gitbook.io/gtcx-open-source

---

## Substitutions applied (audit trail)

| Placeholder               | Substituted with                                                                                                                                                                                                                                                                   |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `{{country}}`             | Zimbabwe                                                                                                                                                                                                                                                                           |
| `{{country_adjective}}`   | Zimbabwean                                                                                                                                                                                                                                                                         |
| `{{region}}`              | Southern African                                                                                                                                                                                                                                                                   |
| `{{regulator_recipient}}` | Reserve Bank of Zimbabwe Fintech Sandbox                                                                                                                                                                                                                                           |
| `{{regulator_short}}`     | RBZ                                                                                                                                                                                                                                                                                |
| `{{regulator_email}}`     | sandbox@rbz.co.zw _(unverified — confirm before send)_                                                                                                                                                                                                                             |
| `{{secondary_authority}}` | Ministry of Mines and Mining Development (MMMD)                                                                                                                                                                                                                                    |
| `{{currency_name}}`       | Zimbabwe Dollar                                                                                                                                                                                                                                                                    |
| `{{language_set}}`        | English, Shona, and Ndebele                                                                                                                                                                                                                                                        |
| `{{country_framing}}`     | The RBZ Fintech Sandbox is one of the more structured Southern African sandbox programs and a credible adjacent-fintech path for commodity-export use cases. We're prioritizing engagement here because the regional precedent it sets matters for the broader continental effort. |
| `{{travel_city}}`         | Harare                                                                                                                                                                                                                                                                             |
| `{{travel_hub}}`          | Johannesburg                                                                                                                                                                                                                                                                       |

## Fallback if RBZ defers to MMMD

If RBZ replies that the use case is out-of-scope for the Fintech Sandbox, send the same body to **`info@mmmd.gov.zw`** (verify address) with these substitutions:

- Subject: replace "Zimbabwe commodity-export sandbox cohort" with "Zimbabwe commodity-export traceability framework"
- Opening line: replace "Reserve Bank of Zimbabwe Fintech Sandbox team" with "Ministry of Mines and Mining Development team"
- "RBZ structure" → "MMMD structure"
- "MMMD regulatory framework" → "RBZ Fintech Sandbox" (the roles swap)

## Related

- [Canonical template](../sandbox-intro-email-template.md) — source of truth
- [Engagement log](../../agile/engagement-log/2026-zimbabwe-sandbox.md) — operational state
- [Engagement playbook](../../agile/engagement-log/playbook.md) — process discipline
- [Trust portal hosting runbook](../../operations/trust-portal-hosting.md) — what needs to be live before send
