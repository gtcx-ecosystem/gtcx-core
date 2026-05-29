---
title: "Sandbox Intro Email — Canonical Template"
status: "current"
date: "2026-05-27"
owner: "gtcx-core"
role: "protocol-architect"
agent_id: "agent://gtcx-core/2026-05-27/session-backfill"
trust_score: 60
autonomy_level: "permissioned"
tier: "standard"
tags: ["documentation", "gtm"]
review_cycle: "on-change"
---

---
title: 'Sandbox Intro Email Template'
status: 'current'
date: '2026-05-24'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'strategic'
tags: ['gtm', 'engagement', 'template', 'sovereign-state', 'sandbox']
review_cycle: 'on-change'
---

# Sandbox Intro Email — Canonical Template

> **Status:** Current
> **Date:** 2026-05-24
> **Owner:** Protocol Architect
> **Supersedes:** [`09-pre-submission-email-zimbabwe.md`](./09-pre-submission-email-zimbabwe.md), [`10-pre-submission-email-namibia.md`](./10-pre-submission-email-namibia.md), [`11-pre-submission-email-zambia.md`](./11-pre-submission-email-zambia.md), [`12-engagement-brief-drc.md`](./12-engagement-brief-drc.md), [`13-pre-submission-email-ghana.md`](./13-pre-submission-email-ghana.md) — individual country drafts replaced by this template + parameter table.
> **French variant:** [`sandbox-intro-email-template.fr.md`](./sandbox-intro-email-template.fr.md) for Francophone targets (DR Congo first; future: Côte d'Ivoire, Senegal, etc.).

One template, one parameter table, N countries. Adding a new target is a row in the table; updates to shared text are a one-line template edit that propagates everywhere.

For per-country operational state (checklist, event log, decisions), see [`docs/agile/engagement-log/`](../agile/engagement-log/) — each engagement log references this template + names the country parameter row to render.

---

## Parameters

These are the inputs the template needs. All values are derivable from [`tests/integration/fixtures/jurisdiction-fixtures.ts`](../../tests/integration/fixtures/jurisdiction-fixtures.ts) plus per-country recipient designation.

| Param                     | Meaning                                                                 | Example                                                                                                                                                             |
| ------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `{{country}}`             | Country name (common form)                                              | Zimbabwe                                                                                                                                                            |
| `{{country_adjective}}`   | Demonym used in "Zimbabwean producers, regulators, …"                   | Zimbabwean                                                                                                                                                          |
| `{{region}}`              | Regional descriptor                                                     | Southern African / West African / Central African                                                                                                                   |
| `{{regulator_recipient}}` | Full name of the addressed body                                         | Reserve Bank of Zimbabwe Fintech Sandbox                                                                                                                            |
| `{{regulator_short}}`     | Short form used in body text                                            | RBZ                                                                                                                                                                 |
| `{{regulator_email}}`     | To-line address (always verify before send)                             | sandbox@rbz.co.zw                                                                                                                                                   |
| `{{secondary_authority}}` | Backup recipient cited inline if primary defers                         | Ministry of Mines and Mining Development (MMMD)                                                                                                                     |
| `{{currency_name}}`       | Local currency human name                                               | Zimbabwe Dollar                                                                                                                                                     |
| `{{language_set}}`        | Localization languages                                                  | English, Shona, and Ndebele                                                                                                                                         |
| `{{country_framing}}`     | 1–2 sentence country-specific differentiator (the actual customization) | Zimbabwe's RBZ Fintech Sandbox is one of the more structured Southern African sandbox programs and a credible adjacent-fintech path for commodity-export use cases. |
| `{{travel_city}}`         | Capital / meeting city                                                  | Harare                                                                                                                                                              |
| `{{travel_hub}}`          | Regional hub for pooled travel                                          | Johannesburg                                                                                                                                                        |

---

## Parameter table

| `{{country}}` | `{{country_adjective}}` | `{{region}}`     | `{{regulator_recipient}}`                            | `{{regulator_short}}` | `{{regulator_email}}` _(verify)_ | `{{secondary_authority}}`                       | `{{currency_name}}`                          | `{{language_set}}`                                   | `{{travel_city}}` | `{{travel_hub}}`               |
| ------------- | ----------------------- | ---------------- | ---------------------------------------------------- | --------------------- | -------------------------------- | ----------------------------------------------- | -------------------------------------------- | ---------------------------------------------------- | ----------------- | ------------------------------ |
| Zimbabwe      | Zimbabwean              | Southern African | Reserve Bank of Zimbabwe Fintech Sandbox             | RBZ                   | sandbox@rbz.co.zw                | Ministry of Mines and Mining Development (MMMD) | Zimbabwe Dollar                              | English, Shona, and Ndebele                          | Harare            | Johannesburg                   |
| Ghana         | Ghanaian                | West African     | Bank of Ghana Regulatory Sandbox                     | BoG                   | sandbox@bog.gov.gh               | Minerals Commission (MinComm)                   | Ghanaian Cedi                                | English, with Twi and Ga widely used                 | Accra             | Accra                          |
| Namibia       | Namibian                | Southern African | Bank of Namibia Innovation Hub                       | BoN                   | innovation@bon.com.na            | Ministry of Mines and Energy (MME)              | Namibian Dollar                              | English and Afrikaans                                | Windhoek          | Johannesburg                   |
| Botswana      | Batswana                | Southern African | Department of Mines, Ministry of Minerals and Energy | DoM                   | info@mom.gov.bw                  | Bank of Botswana (BoB)                          | Pula                                         | English and Setswana                                 | Gaborone          | Johannesburg                   |
| DR Congo      | Congolese               | Central African  | Cadastre Minier (CAMI)                               | CAMI                  | info@cami.cd                     | Banque Centrale du Congo (BCC)                  | Congolese Franc (USD also used commercially) | French, with Lingala, Swahili, Kikongo, and Tshiluba | Kinshasa          | Nairobi (Kinshasa via routing) |
| Zambia        | Zambian                 | Southern African | Bank of Zambia Regulatory Sandbox                    | BoZ                   | innovation@boz.zm                | Ministry of Mines and Minerals Development      | Zambian Kwacha                               | English, with Bemba, Nyanja, Tonga widely used       | Lusaka            | Johannesburg                   |

**Country-specific framing sentences** (one of these substitutes for `{{country_framing}}` — they are the actual customization that makes each email feel native to its recipient rather than templated):

| Country  | `{{country_framing}}`                                                                                                                                                                                                                                                                                         |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Zimbabwe | The RBZ Fintech Sandbox is one of the more structured Southern African sandbox programs and a credible adjacent-fintech path for commodity-export use cases. We're prioritizing engagement here because the regional precedent it sets matters for the broader continental effort.                            |
| Ghana    | The BoG Regulatory Sandbox has admitted fintech and adjacent-fintech cohorts since 2019. We're prioritizing engagement here because Ghana's existing sandbox precedent and Minerals Commission infrastructure together make an extension into commodity-export traceability a natural next step.              |
| Namibia  | Namibia's mature mining-export regulatory tradition — uranium and diamond traceability in particular — is part of why we're prioritizing engagement here. The institutional muscle for chain-of-custody attestation already exists; GTCX is designed to extend that pattern to a broader commodity set.       |
| Botswana | Botswana's diamond-traceability regulatory tradition is one of the most mature in the world. We're prioritizing engagement here because the institutional muscle for export-grade chain-of-custody already exists at world-class quality, and GTCX is designed to extend that pattern beyond a single sector. |
| DR Congo | The complexity of artisanal-mining traceability in DRC, particularly for cobalt and coltan, is precisely why we're prioritizing engagement here. No generic solution will work; a foundation built to respect Congolese sovereignty over its own traceability mechanisms is the only credible approach.       |
| Zambia   | Zambia's copper-export regulatory framework and the BoZ sandbox structure together make this a natural early engagement — the country has both the institutional surface for chain-of-custody attestation and the financial-sector willingness to pilot adjacent-fintech use cases.                           |

---

## Template body (English)

> **Render rules.** Substitute every `{{placeholder}}` with the parameter-table row for the target country. The body is otherwise verbatim. For Francophone targets see [`sandbox-intro-email-template.fr.md`](./sandbox-intro-email-template.fr.md).

---

**To:** `{{regulator_email}}` _(verify current address before send)_
**Cc:** `engagement@gtcx.io`
**Subject:** GTCX Protocol — pre-submission meeting request for {{country}} commodity-export sandbox cohort

Dear {{regulator_recipient}} team,

I'm writing on behalf of GTCX Protocol — the open cryptographic foundation we've built to give {{country_adjective}} commodity producers, regulators, and export partners a shared trust layer for chain-of-custody attestation. Our core library is independently auditable, FIPS-aligned, and designed specifically for the constraints {{region}} commodity supply chains face (offline-first, low-bandwidth, sovereign data residency).

We would value a 45-minute pre-submission meeting to walk through our work and understand how it best fits into the {{regulator_short}} structure (or, if more appropriate, the {{secondary_authority}} regulatory framework). Three concrete artifacts we'd ask you to review beforehand, all public and independently verifiable:

1. **Trust portal** — [gtcx-protocol.gitbook.io/gtcx-open-source](https://gtcx-protocol.gitbook.io/gtcx-open-source/governance/trust-portal). Index of every security and compliance artifact, with file paths to each piece of evidence.
2. **Internal completion audit (2026-05-21)** — composite 9.5/10 across security, code quality, and operational readiness; 24/24 internal items complete with cited evidence per item.
3. **Fuzz campaign evidence (2026-05-21)** — six cryptographic primitives, 500,000+ libFuzzer iterations, zero crashes, zero panics, zero AddressSanitizer violations.

In addition, an external penetration test and SOC 2 Type 1 attestation are contracted and in motion (target completion 2026-08-25 and 2026-09-15 respectively). We can share the engagement letters under NDA at the meeting.

**On {{country}}-specific readiness:** we have a per-jurisdiction configuration validated end-to-end against our cryptographic surface, anchored to the country's regulatory authority structure ({{secondary_authority}} for mining oversight, {{regulator_short}} for payment-rails), {{currency_name}} settlement, and the {{language_set}} localization. The reference fixture sits in the gtcx-core repo — the production version requires your team's sign-off on the regulatory parameters. {{country_framing}}

We would be happy to come to {{travel_city}} in person at your convenience, or to meet by video. If a {{travel_hub}}-hub trip with cross-border travel is more efficient, that also works. Please let us know which weeks in June or July suit the team.

For procurement / vendor risk purposes the relevant primary contact is:

- **Cryptographic Security:** _security@gtcx.io_
- **Engineering:** _engineering@gtcx.io_
- **Engagement lead:** _<your name and contact>_

Thank you for the work you've done supporting innovation in {{country}}. We hope GTCX can be a useful element of that effort.

With appreciation,

_<Sender name>_
_<Title>_
GTCX Protocol
gtcx-protocol.gitbook.io/gtcx-open-source

---

## Pre-send checklist (per country)

Use the [engagement playbook](../agile/engagement-log/playbook.md) 8-item checklist plus, for the DRC variant only: French-fluent review before send. Per-country state lives in each engagement log under `docs/agile/engagement-log/2026-{country}-sandbox.md`.

## How to add a new country

1. Add one row to the parameter table above.
2. Add one row to the country-specific framing sentences table.
3. Create `docs/agile/engagement-log/2026-{country}-sandbox.md` from the [playbook](../agile/engagement-log/playbook.md) shape — it should be ~50 lines (operational state only).
4. Update [`engagement-log/dashboard.md`](../agile/engagement-log/dashboard.md) with the new row.
5. The email body itself does not need to be redrafted — it's rendered from this template using the new parameter row.

For French-language targets, also add a row to [`sandbox-intro-email-template.fr.md`](./sandbox-intro-email-template.fr.md).

## Why this shape

A single template that takes a parameter set per country is the right architecture because:

- The email body is ~80% identical across countries; only ~7 parameters meaningfully vary.
- Updates to shared text (e.g., when the npm publish completes and we want to drop "imminent publish" language, or when SOC 2 Type 1 lands and we want to upgrade the attestation paragraph) are one-line template edits — they don't require finding and updating N country drafts.
- Adding a new country becomes one parameter row + one engagement-log file — not a 30-line copy-paste from a sibling.
- The audit trail of "what was sent to country X on date Y" is preserved by the engagement log's event log entry; rendering the template at that point in time is reproducible.
