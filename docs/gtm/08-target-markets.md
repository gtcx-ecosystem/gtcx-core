---
title: '08 Target Markets'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs']
review_cycle: 'on-change'
---

# Target Markets — Sandbox Strategy

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

**Priority order:** Zimbabwe, Namibia, Zambia, DRC, Ghana

---

## Market Analysis

| #   | Country      | Regulator                                                                              | Sandbox/Innovation Program     | Primary Commodities                            | Why First                                                                                                                                                                                                                                                                                     |
| --- | ------------ | -------------------------------------------------------------------------------------- | ------------------------------ | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Zimbabwe** | Reserve Bank of Zimbabwe (RBZ) / Securities and Exchange Commission (SECZ)             | RBZ Fintech Regulatory Sandbox | Gold, platinum, diamonds, lithium, chrome      | Largest informal gold sector in Southern Africa. Verification protocol solves artisanal mining traceability — a live regulatory pain point. RBZ actively digitizing gold trade.                                                                                                               |
| 2   | **Namibia**  | Bank of Namibia (BoN) / Namibia Financial Institutions Supervisory Authority (NAMFISA) | BoN Innovation Hub             | Diamonds, uranium, zinc, gold                  | Small market, sophisticated regulator. De Beers pipeline means diamond provenance is already a regulatory priority. Easier sandbox admission — fewer applicants, more attention.                                                                                                              |
| 3   | **Zambia**   | Bank of Zambia (BoZ) / Securities and Exchange Commission (SEC)                        | BoZ Regulatory Sandbox         | Copper, cobalt, emeralds, gold                 | World's 7th largest copper producer. Mining reform agenda — government wants digital verification of artisanal and small-scale mining (ASM).                                                                                                                                                  |
| 4   | **DRC**      | Banque Centrale du Congo (BCC)                                                         | — (direct engagement)          | Cobalt, coltan (tantalum), tin, tungsten, gold | 3TG minerals (conflict minerals) — international supply chain due diligence requirements (EU Conflict Minerals Regulation, US Dodd-Frank). Verification protocol directly addresses regulatory mandate. No formal sandbox — engage via mining ministry + international partners (ITSCI, RMI). |
| 5   | **Ghana**    | Bank of Ghana (BoG) / Securities and Exchange Commission (SEC)                         | BoG Regulatory Sandbox         | Gold, cocoa, oil                               | Most mature fintech sandbox in West Africa. Gold is #1 export. Cocoa supply chain already under EU deforestation regulation pressure.                                                                                                                                                         |

---

## Regulatory Entry Strategy

### Tier 1 — Formal Sandbox (Zimbabwe, Namibia, Zambia, Ghana)

These countries have established or emerging sandbox programs. The playbook:

1. **Pre-submission meeting** with the sandbox team. See [05-sandbox-submission-guide.md](./05-sandbox-submission-guide.md).
2. **Application** with GTM evidence pack
3. **Sandbox period** (typically 6-12 months)
4. **Graduation** to full authorization

### Tier 2 — Direct Engagement (DRC)

DRC has no formal fintech sandbox. The entry path is:

1. **Ministry of Mines** — present verification protocol for 3TG traceability
2. **International partners** — ITSCI (ITRI), Responsible Minerals Initiative (RMI), BGR (German geological survey)
3. **Pilot with established operator** — partner with an existing mining cooperative or exporter
4. **BCC engagement** — once pilot evidence exists, approach central bank for digital certification framework

---

## Execution Sequence

```
Month 1:  Zimbabwe pre-submission meeting (RBZ)
          Namibia pre-submission meeting (BoN)
Month 2:  Submit Zimbabwe sandbox application
          Submit Namibia sandbox application
Month 3:  Zambia pre-submission meeting (BoZ)
          DRC: initial contact with mining ministry
Month 4:  Ghana pre-submission meeting (BoG)
          Begin sandbox operations (Zim/Nam if admitted)
Month 6:  Submit Zambia + Ghana applications
          DRC: pilot scoping with ITSCI/RMI partner
```

### Why This Order

**Zimbabwe first:** The regulatory pain is acute (informal gold sector), the government is actively seeking solutions (RBZ gold digitization agenda), and the commodity mix (gold, platinum, lithium) maps directly to gtcx-core's verification primitives. A Zimbabwe sandbox success creates the reference case for every subsequent market.

**Namibia second:** Sophisticated regulator, manageable market size, diamond provenance is an established regulatory priority. Fastest path to a clean sandbox graduation — which becomes the credential for harder markets.

**DRC last in formal sequence but parallel in engagement:** The 3TG opportunity is the largest by market impact, but the regulatory environment is the most complex. International partner alignment (ITSCI, EU regulation) gives us legitimacy before we need a formal regulatory relationship.

---

## Commodity Coverage by Market

| Commodity | Zimbabwe  | Namibia   | Zambia    | DRC       | Ghana   |
| --------- | --------- | --------- | --------- | --------- | ------- |
| Gold      | Primary   | Secondary | Secondary | Primary   | Primary |
| Platinum  | Primary   | —         | —         | —         | —       |
| Diamonds  | Secondary | Primary   | —         | —         | —       |
| Lithium   | Emerging  | —         | —         | —         | —       |
| Copper    | —         | —         | Primary   | Secondary | —       |
| Cobalt    | —         | —         | Primary   | Primary   | —       |
| Tantalum  | —         | —         | —         | Primary   | —       |
| Tin       | —         | —         | —         | Primary   | —       |
| Tungsten  | —         | —         | —         | Primary   | —       |
| Cocoa     | —         | —         | —         | —         | Primary |
| Emeralds  | —         | —         | Secondary | —         | —       |
| Uranium   | —         | Primary   | —         | —         | —       |

All 12 commodities above are already configured in gtcx-core's commodity-agnostic domain model (`packages/verification/src/types/definitions/commodities.ts`). Zero code changes required per market.

---

## What Each Regulator Will Ask

Based on the GTM evidence pack, here's the mapping:

| Question                                    | Answer                                                    | Document                                                       |
| ------------------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------- |
| "What do you do?"                           | Cryptographic verification of commodity supply chains     | [00-executive-brief.md](./00-executive-brief.md)               |
| "Is it secure?"                             | 6 fuzz targets, 9.9M runs, 0 crashes, STRIDE threat model | [01-security-posture.md](./01-security-posture.md)             |
| "Does it meet compliance standards?"        | ISO 27001, SOC 2, GDPR, PCI, SOX, FIPS — all addressed    | [02-compliance-matrix.md](./02-compliance-matrix.md)           |
| "Can it run in our regulatory environment?" | FIPS-ready, offline-first, Global South designed          | [03-fips-readiness.md](./03-fips-readiness.md)                 |
| "Show us the evidence"                      | Every artifact with command to regenerate                 | [04-evidence-inventory.md](./04-evidence-inventory.md)         |
| "How do we integrate?"                      | Production config, trust checklist, API stability         | [07-downstream-integration.md](./07-downstream-integration.md) |
| "What about conflict minerals?"             | Commodity-agnostic verification — 3TG supported natively  | This document                                                  |
