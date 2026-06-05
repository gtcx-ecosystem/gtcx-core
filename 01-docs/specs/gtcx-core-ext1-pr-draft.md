---
title: 'Ext-1 PR Draft — Continental Predicate Extension'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'standard'
tags: ['documentation', 'specs']
review_cycle: 'on-change'
---

---

title: 'Ext-1 PR Draft — Continental Predicate Extension'
status: 'draft'
date: '2026-05-25'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['spec', 'pr', 'workproof', 'continental', 'ext1']
review_cycle: 'on-change'

---

# Ext-1 PR Draft — Continental Predicate Extension

> **Status:** Draft — awaiting collision review and authority taxonomy specification
> **Date:** 2026-05-25
> **Target:** `gtcx-core/packages/workproof/`
> **Net change:** 47 → 57 predicates (+10 continental)

---

## Proposal Summary

Add 12 continental-Africa predicates to the WorkProof registry, plus a type-safe authority taxonomy for SADC mining, cooperative, identity, and screening authorities.

| Element            | Detail                                                               |
| ------------------ | -------------------------------------------------------------------- |
| New file           | `definitions/continental.ts`                                         |
| Authority taxonomy | `AUTHORITY_SLUGS` const — SADC-wide                                  |
| Test fixtures      | ≥3 per predicate (Zimbabwe, DRC, +1)                                 |
| Migration          | TradePass bridge maps legacy country-specific IDs to continental IDs |

---

## Proposed 12 Predicates

| #   | Predicate                       | Category   | Evidence Type             | Notes                                                                         |
| --- | ------------------------------- | ---------- | ------------------------- | ----------------------------------------------------------------------------- |
| 1   | `GoldBuyingLicenseValid`        | Compliance | `gold_buying_license`     | Zimbabwe-specific pattern, generalizable                                      |
| 2   | `CooperativeRegistered`         | Identity   | `cooperative_registry`    | Generalizes `EntityRegistered` for cooperative legal structures               |
| 3   | `Traceability3tTagged`          | Production | `traceability_tag`        | ITSCI/iTSCi tag verification                                                  |
| 4   | `RegionalCertificationIcglrRcm` | Compliance | `regional_certification`  | ICGLR Regional Certification Mechanism                                        |
| 5   | `RegionalProtocolSignatory`     | Compliance | `protocol_signatory`      | Signatory to regional protocols (AMV, etc.)                                   |
| 6   | `PricePreciousMetalFix`         | Financial  | `price_fix_record`        | LBMA / local fix participation                                                |
| 7   | `ConflictZoneCleared`           | Compliance | `conflict_zone_clearance` | UN/ITSCI cleared-area verification                                            |
| 8   | `OriginSatelliteVerified`       | Location   | `satellite_imagery`       | Satellite-based origin verification                                           |
| 9   | `PhysicalSealAttested`          | Production | `physical_seal`           | Tamper-evident seal verification                                              |
| 10  | `RegionalSanctionsCleared`      | Compliance | `sanctions_screening`     | Renamed from `SanctionsCleared` to avoid collision with entity-tier predicate |

---

## Open Questions Before Go-Ahead

### 1. Predicate Name Collisions — Resolved

| Proposed             | Existing                             | Resolution                                    | Rationale                                                                                                                                                                                                   |
| -------------------- | ------------------------------------ | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SanctionsCleared`   | `SanctionsCleared` (entity-tier)     | **Rename to `RegionalSanctionsCleared`**      | Existing is entity-tier (corporations). Continental variant targets individuals/artisanal miners with SADC-specific screening lists. Different scope, different evidence requirements.                      |
| `IdentityProven`     | `IdentityVerified` (individual-tier) | **DROP — extend existing `IdentityVerified`** | Existing already has `optional: ['biometric_face', 'biometric_fingerprint']` and description covers "official documentation and/or biometrics." Add `biometric_attestation` to optional evidence if needed. |
| `MiningLicenseValid` | `LicenseValid` (generic)             | **DROP — extend existing `LicenseValid`**     | Existing is generic "Operating license current and valid." Add `mining_license` as an additional accepted evidence type alongside `government_id`. Keeps registry clean.                                    |

**Net effect:** 12 proposed predicates → **10 net-new predicates** (47 → 57). Three collisions resolved:

- `SanctionsCleared` → `RegionalSanctionsCleared` (rename)
- `IdentityProven` → DROP, extend `IdentityVerified.optional` with `biometric_attestation`
- `MiningLicenseValid` → DROP, extend `LicenseValid.required` with `mining_license` as alternative

#### Schema Extensions (Additive, Non-Breaking)

| Predicate          | Change                                                                                     | New Evidence Accepted               |
| ------------------ | ------------------------------------------------------------------------------------------ | ----------------------------------- |
| `IdentityVerified` | Add `biometric_attestation` to `evidence.optional`                                         | `biometric_attestation`             |
| `LicenseValid`     | Expand `evidence.required` to `['government_id', 'mining_license']` (alternative required) | `government_id` or `mining_license` |

### 2. Authority Taxonomy Scope

The proposal mentions "all SADC mining, cooperative, identity, and screening authorities." Need clarification:

- **Static const or dynamic registry?** Static const is fine; dynamic registry would need new infrastructure.
- **Jurisdiction mapping?** Does each authority map to a country code (e.g., `RBZ` → `ZW`, `SARS` → `ZA`)?
- **Maintenance model?** Who updates when a new authority is recognized (e.g., new national mineral board)?

### 3. Timing vs. Publish Window

- `@gtcx/workproof@1.0.0` publish window: **Wed 2026-05-28 → Fri 2026-05-30**
- If Ext-1 merges before publish: included in 1.0.0, no immediate follow-up release needed
- If Ext-1 merges after publish: requires changeset + 1.1.0 release

**Recommendation:** Target merge by **Tue 2026-05-27 EOD** to ensure clean inclusion in 1.0.0.

### 4. Changeset Requirement

If approved, this needs a `@changesets/cli` changeset:

- **Type:** `minor` (additive, no breaking changes)
- **Scope:** `@gtcx/workproof`
- **Description:** "Add 12 continental predicates with SADC authority taxonomy"

---

## Acceptance Criteria (for PR review)

- [ ] No predicate name collisions with existing 47 predicates
- [ ] All 10 net-new predicates have `PredicateDefinition` schema complete (evidence, attestation, confidence, temporal, AI)
- [ ] `AUTHORITY_SLUGS` const is type-safe and exported
- [ ] ≥3 test fixtures per predicate (≥30 total assertions)
- [ ] Migration aliases added to `TRADEPASS_LEGACY_ID_ALIASES` if applicable
- [ ] Changeset included (type: `minor`, scope: `@gtcx/workproof`)
- [ ] All CI gates pass (lint, typecheck, test, build, architecture, docs)

---

## Cross-References

- ADR-012 Stage 0: `gtcx-core/packages/workproof/03-platform/src/predicates/definitions/entity.ts`
- Authority taxonomy spec (TBD): `gtcx-intelligence/01-docs/specs/authority-taxonomy-sadc.md`
- Migration bridge: `gtcx-core/packages/verification/03-platform/src/migration/tradepass-aliases.ts`
