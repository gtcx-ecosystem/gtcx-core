---
title: 'Sandbox Intro Email Template (French)'
status: 'current'
date: '2026-05-24'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'strategic'
tags: ['gtm', 'engagement', 'template', 'sovereign-state', 'sandbox', 'french']
review_cycle: 'on-change'
---

# Modèle d'email d'introduction sandbox (variante française)

> **Status:** Current
> **Date:** 2026-05-24
> **Owner:** Protocol Architect
> **Parent template:** [`sandbox-intro-email-template.md`](./sandbox-intro-email-template.md) — English canonical.

Variante française du modèle d'introduction, à utiliser pour les cibles francophones (RDC en priorité ; à venir : Côte d'Ivoire, Sénégal, Cameroun, etc.). Les paramètres sont identiques au modèle anglais — voir le tableau de paramètres ci-dessous.

For per-country operational state, see [`docs/agile/engagement-log/`](../agile/engagement-log/).

---

## Tableau de paramètres (cibles francophones)

| `{{country}}` | `{{country_adjective_fr}}` | `{{region}}`     | `{{regulator_recipient}}` | `{{regulator_short}}` | `{{regulator_email}}` _(à vérifier)_ | `{{secondary_authority}}`      | `{{currency_name_fr}}`                                  | `{{language_set_fr}}`                                | `{{travel_city}}` |
| ------------- | -------------------------- | ---------------- | ------------------------- | --------------------- | ------------------------------------ | ------------------------------ | ------------------------------------------------------- | ---------------------------------------------------- | ----------------- |
| RDC           | congolais                  | Afrique centrale | Cadastre Minier (CAMI)    | CAMI                  | info@cami.cd                         | Banque Centrale du Congo (BCC) | Franc congolais (USD également utilisé commercialement) | français, avec lingala, swahili, kikongo et tshiluba | Kinshasa          |

**Phrases de cadrage spécifiques par pays** (substitut pour `{{country_framing_fr}}`) :

| Pays | `{{country_framing_fr}}`                                                                                                                                                                                                                                                                                                               |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RDC  | La complexité de la traçabilité minière artisanale en RDC, en particulier pour le cobalt et le coltan, est précisément ce qui nous pousse à prioriser un engagement ici : aucune solution générique ne fonctionnera ; il faut une fondation conçue pour respecter la souveraineté de la RDC sur ses propres mécanismes de traçabilité. |

---

## Corps du modèle (français)

> **Règles de rendu.** Substituer chaque `{{placeholder}}` par la valeur correspondante du tableau de paramètres. Le corps est par ailleurs verbatim.

---

**À :** `{{regulator_email}}` _(vérifier l'adresse actuelle avant envoi)_
**Cc :** `engagement@gtcx.io`
**Objet :** GTCX Protocol — demande de réunion de pré-soumission pour la cohorte sandbox d'exportation de matières premières {{country}}

Cher {{regulator_recipient}},

Je vous écris au nom de GTCX Protocol — la fondation cryptographique open source que nous avons conçue pour offrir aux producteurs, régulateurs et partenaires d'exportation {{country_adjective_fr}} une couche de confiance partagée pour l'attestation de chaîne de traçabilité. Notre bibliothèque centrale est auditable de manière indépendante, alignée FIPS, et conçue spécifiquement pour les contraintes des chaînes d'approvisionnement en matières premières d'{{region}} (hors-ligne d'abord, faible bande passante, souveraineté des données).

Nous souhaiterions une réunion de pré-soumission de 45 minutes pour vous présenter notre travail et comprendre comment il peut s'intégrer dans la structure réglementaire du {{regulator_short}} (ou, si plus approprié, la {{secondary_authority}}). Trois artefacts concrets que nous vous demanderions d'examiner au préalable, tous publics et vérifiables de manière indépendante :

1. **Portail de confiance** — [trust.gtcx.io](https://gtcx-ecosystem.github.io/gtcx-core/governance/trust-portal) _(domaine personnalisé en cours de configuration)_. Index de chaque artefact de sécurité et de conformité, avec chemins de fichiers vers chaque pièce justificative.
2. **Audit interne d'achèvement (2026-05-21)** — composite 9,5/10 en sécurité, qualité de code et préparation opérationnelle ; 24/24 éléments internes complets avec preuves citées par élément.
3. **Évidence de campagne de fuzz (2026-05-21)** — six primitives cryptographiques, 500 000+ itérations libFuzzer, zéro crash, zéro panique, zéro violation AddressSanitizer.

De plus, un test d'intrusion externe et une attestation SOC 2 Type 1 sont contractés et en cours (achèvement prévu 2026-08-25 et 2026-09-15 respectivement). Nous pourrons partager les lettres d'engagement sous NDA lors de la réunion.

**Sur la préparation spécifique à {{country}} :** nous disposons d'une configuration par juridiction validée de bout en bout, ancrée sur la structure d'autorité régulatrice du pays ({{secondary_authority}} pour la supervision minière, {{regulator_short}} pour les rails de paiement), le règlement en {{currency_name_fr}}, et la localisation principalement en {{language_set_fr}}. La fixture de référence est dans le dépôt gtcx-core — la version de production nécessite l'approbation de vos équipes sur les paramètres réglementaires. {{country_framing_fr}}

Nous serions heureux de venir à {{travel_city}} à votre convenance, ou de nous rencontrer en visioconférence pour la première réunion. Veuillez nous indiquer quelles semaines en juin ou juillet conviennent à l'équipe.

Pour des questions de procurement / risque fournisseur, le contact principal pertinent est :

- **Sécurité cryptographique :** _security@gtcx.io_
- **Ingénierie :** _engineering@gtcx.io_
- **Responsable d'engagement :** _<votre nom et contact>_
- **Partenaire local ({{country}}) :** _<nom du partenaire si déjà identifié>_

Nous vous remercions du travail accompli en {{country}} pour soutenir l'innovation dans le secteur. Nous espérons que GTCX peut soutenir cet effort.

Avec considération,

_<Nom de l'expéditeur>_
_<Titre>_
GTCX Protocol
trust.gtcx.io

---

## Ajouter une nouvelle cible francophone

1. Ajouter une ligne au tableau de paramètres ci-dessus.
2. Ajouter une ligne au tableau des phrases de cadrage spécifiques.
3. Créer `docs/agile/engagement-log/2026-{country}-sandbox.md` à partir du [playbook](../agile/engagement-log/playbook.md).
4. Mettre à jour le [tableau de bord](../agile/engagement-log/dashboard.md).
