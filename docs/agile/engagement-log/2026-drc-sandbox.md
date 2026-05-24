---
title: '2026 DRC Sandbox Engagement'
status: 'current'
date: '2026-05-24'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'critical'
tags: ['engagement', 'drc', 'sandbox', 'regulator']
review_cycle: 'on-change'
---

# DR Congo Sandbox — Engagement Log

> **Status:** Pre-send — email drafted (French), awaiting recipient verification, local-presence partner, and approval
> **Date:** 2026-05-24
> **Owner:** Protocol Architect
> **Inherits:** [Sovereign-State Engagement Playbook](./playbook.md)

## Engagement state

| Field                           | Value                          |
| ------------------------------- | ------------------------------ |
| Target jurisdiction             | DR Congo                       |
| Primary recipient (candidate)   | Cadastre Minier (CAMI)         |
| Secondary recipient (candidate) | Banque Centrale du Congo (BCC) |
| Phase                           | **Pre-send** — stub only       |
| Email drafted                   | Yes — see below (French)       |
| Email sent date                 | —                              |
| Response received               | —                              |
| Pre-submission meeting held     | —                              |
| Formal sandbox application      | —                              |
| Sandbox cohort placement        | —                              |

## Country-specific framing inputs

For when the email is drafted — anchored to the [DR Congo fixture](../../../tests/integration/fixtures/jurisdiction-fixtures.ts):

| Input                          | Value                                                                           |
| ------------------------------ | ------------------------------------------------------------------------------- |
| ISO codes                      | CD / COD                                                                        |
| Currency                       | CDF (Congolese Franc); USD also widely used in commercial transactions          |
| Region                         | Central Africa                                                                  |
| Official language              | French (with Lingala, Swahili, Kikongo, Tshiluba)                               |
| Primary mining authority       | Cadastre Minier (CAMI) under Ministry of Mines                                  |
| Primary financial regulator    | Banque Centrale du Congo (BCC)                                                  |
| Sector precedent               | DRC dominates global cobalt + coltan supply; mining traceability is high-stakes |
| Local-presence partner needed? | TBD — likely yes given operational complexity                                   |
| Language for email             | **French** — primary recipient communicates in French                           |

## Email draft (French)

> **Recipient guidance:** CAMI is the primary recipient — DRC's artisanal-mining traceability stakes are mining-first by nature, and BCC is the secondary path. **The email is in French**; have a French-fluent reviewer check before sending. **A Congolese local-presence partner should be named in the email if a partnership is already in motion** — CAMI is unlikely to engage substantively without one. The English translation below the French draft is a working reference, not what gets sent.

---

**À :** `<info@cami.cd>` _(à vérifier ; en copie : `<dgmf@minesrdc.cd>`)_
**Cc :** `<engagement@gtcx.io>`
**Objet :** GTCX Protocol — demande de réunion de pré-soumission pour la cohorte sandbox d'exportation de matières premières

Cher cadastre minier (CAMI),

Je vous écris au nom de GTCX Protocol — la fondation cryptographique open source que nous avons conçue pour offrir aux producteurs, régulateurs et partenaires d'exportation congolais une couche de confiance partagée pour l'attestation de chaîne de traçabilité. Notre bibliothèque centrale est auditable indépendamment, alignée FIPS, et conçue spécifiquement pour les contraintes des chaînes d'approvisionnement en matières premières d'Afrique centrale (hors-ligne d'abord, faible bande passante, souveraineté des données).

Nous souhaiterions une réunion de pré-soumission de 45 minutes pour vous présenter notre travail et comprendre comment il peut s'intégrer dans la structure réglementaire du CAMI. Trois artefacts concrets que nous vous demanderions d'examiner au préalable, tous publics et vérifiables de manière indépendante :

1. **Portail de confiance** — [trust.gtcx.io](https://gtcx-ecosystem.github.io/gtcx-core/governance/trust-portal) _(domaine personnalisé en cours de configuration)_. Index de chaque artefact de sécurité et de conformité, avec chemins de fichiers vers chaque pièce justificative.
2. **Audit interne d'achèvement (2026-05-21)** — composite 9,5/10 en sécurité, qualité de code et préparation opérationnelle ; 24/24 éléments internes complets avec preuves citées par élément.
3. **Évidence de campagne de fuzz (2026-05-21)** — six primitives cryptographiques, 500 000+ itérations libFuzzer, zéro crash, zéro panique, zéro violation AddressSanitizer.

De plus, un test d'intrusion externe et une attestation SOC 2 Type 1 sont contractés et en cours (achèvement prévu 2026-08-25 et 2026-09-15 respectivement). Nous pourrons partager les lettres d'engagement sous NDA lors de la réunion.

**Sur la préparation spécifique à la RDC :** nous disposons d'une configuration par juridiction validée de bout en bout, ancrée sur la structure d'autorité régulatrice du pays (CAMI pour la supervision minière, Banque Centrale du Congo pour les rails de paiement), le règlement en Franc congolais (avec utilisation du USD pour les transactions commerciales), et la localisation principalement française avec lingala, swahili, kikongo et tshiluba. La fixture de référence est dans le dépôt gtcx-core — la version de production nécessite l'approbation de vos équipes sur les paramètres réglementaires. La complexité opérationnelle de la traçabilité minière artisanale en RDC, particulièrement pour le cobalt et le coltan, est précisément la raison pour laquelle nous priorisons l'engagement ici : aucune solution générique ne fonctionnera ; il faut une fondation conçue pour respecter la souveraineté de la RDC sur ses propres mécanismes de traçabilité.

Nous serions heureux de venir à Kinshasa à votre convenance, ou de nous rencontrer en visioconférence pour la première réunion. Veuillez nous indiquer quelles semaines en juin ou juillet conviennent à l'équipe.

Pour des questions de procurement / risque fournisseur, le contact principal pertinent est :

- **Sécurité cryptographique :** _<security@gtcx.io>_
- **Ingénierie :** _<engineering@gtcx.io>_
- **Responsable d'engagement :** _<votre nom et contact>_
- **Partenaire local (RDC) :** _<nom du partenaire si déjà identifié>_

Nous vous remercions du travail accompli par le CAMI pour structurer la traçabilité minière en RDC, et espérons que GTCX peut soutenir cet effort.

Avec considération,

_<Nom de l'expéditeur>_
_<Titre>_
GTCX Protocol
trust.gtcx.io

---

### English working reference (NOT FOR SENDING)

Same content as above, English. Used internally for review by non-French-speaking team members; the actual outbound is the French version above.

> Dear Cadastre Minier (CAMI), I'm writing on behalf of GTCX Protocol — the open cryptographic foundation we've built to give Congolese commodity producers, regulators, and export partners a shared trust layer for chain-of-custody attestation. [...continues with English equivalent of the French body, omitted here to keep the source-of-truth a single language.]

---

## Status against playbook checklist

| #   | Playbook checklist item                                                                  | Status     |
| --- | ---------------------------------------------------------------------------------------- | ---------- |
| 1   | Confirm current CAMI / BCC contact                                                       | ⏸️ Pending |
| 2   | Confirm GTCX engagement-lead name + contact (French-speaking preferred)                  | ⏸️ Pending |
| 3   | Verify trust portal live and cited URLs return HTTP 200                                  | ⏸️ Pending |
| 4   | Confirm pen test SoW signed or accept "contracted" language                              | ⏸️ Pending |
| 5   | Confirm SOC 2 CPA engagement letter signed or accept "contracted" language               | ⏸️ Pending |
| 6   | Internal approval                                                                        | ⏸️ Pending |
| 7   | Verify primary recipient (CAMI vs BCC)                                                   | ⏸️ Pending |
| 8   | Identify Congolese local-presence partner — likely required given operational complexity | ⏸️ Pending |
| 9   | Translate intro email to French (or write natively in French)                            | ⏸️ Pending |

## Event log (newest first)

### 2026-05-24 — Email drafted (French)

- Action: Drafted intro email in French targeting Cadastre Minier (CAMI), with BCC as secondary. Cites trust portal + internal completion audit + fuzz evidence; acknowledges pen test + SOC 2 contracted. Anchors DRC-specific framing to CAMI regulatory structure, CDF/USD settlement, and the cobalt/coltan artisanal-mining traceability stakes that drive the sovereignty framing.
- Owner: Protocol Architect
- Next action: French-fluent reviewer pass before send. Identify Congolese local-presence partner — CAMI engagement is gated on this. Verify CAMI vs BCC primary recipient.

### 2026-05-22 — Stub created

- Action: Stub engagement log created inheriting the [Sovereign-State Engagement Playbook](./playbook.md). Country-specific framing inputs captured for email drafting.
- Owner: Protocol Architect

## Pending decisions

| #   | Decision                                       | Owner              | Due        |
| --- | ---------------------------------------------- | ------------------ | ---------- |
| 1   | Draft intro email in French                    | Protocol Architect | 2026-06-12 |
| 2   | Confirm CAMI vs BCC as primary recipient       | Protocol Architect | 2026-06-12 |
| 3   | Designate Congolese local-presence partner     | Protocol Architect | 2026-06-12 |
| 4   | Designate French-speaking GTCX engagement lead | Protocol Architect | 2026-06-12 |

## DRC-specific risk register

| Risk                                                                                 | Likelihood | Impact | Mitigation                                                                                                                      |
| ------------------------------------------------------------------------------------ | ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------------- |
| Email in English signals lack of local context                                       | High       | Medium | Draft and send in French; have a French-fluent reviewer check before send                                                       |
| CAMI requires local partner for meaningful conversation                              | High       | Medium | Pre-identify local partner; mention them by name in the intro email if a partnership is already in motion                       |
| Cobalt/coltan supply chain is geopolitically sensitive — perceived foreign overreach | Medium     | High   | Frame as supporting Congolese sovereignty over traceability, not displacing it; cite the sovereign-data-residency design choice |
| Travel logistics in Kinshasa more complex than other capitals                        | Medium     | Low    | Allow longer lead time; video-first meetings preferred for initial conversations                                                |
