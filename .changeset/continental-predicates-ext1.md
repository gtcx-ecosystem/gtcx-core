---
'@gtcx/workproof': minor
'@gtcx/verification': minor
---

Add 10 continental-Africa predicates with SADC authority taxonomy

- New `definitions/continental.ts` with 10 net-new predicates:
  `GoldBuyingLicenseValid`, `CooperativeRegistered`, `Traceability3tTagged`,
  `RegionalCertificationIcglrRcm`, `RegionalProtocolSignatory`,
  `PricePreciousMetalFix`, `ConflictZoneCleared`, `OriginSatelliteVerified`,
  `PhysicalSealAttested`, `RegionalSanctionsCleared`
- New `AUTHORITY_SLUGS` type-safe constant for SADC mining, cooperative,
  identity, and screening authorities
- Schema extensions (additive, non-breaking):
  - `IdentityVerified`: add `biometric_attestation` to `evidence.optional`
  - `LicenseValid`: expand `evidence.required` to accept `government_id` or
    `mining_license` as alternative required evidence
- Migration aliases added to `TRADEPASS_LEGACY_ID_ALIASES` where applicable
