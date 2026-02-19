// ============================================================================
// PROTOCOLS INDEX
// Re-export all protocol types with conflict resolution
// ============================================================================

// Identity types first (canonical for VerifiableCredential, CredentialProof)
export * from './identity';

// TradePass - exclude duplicates
export {
  TradePassDID,
  TradePassIdentity,
  TradePassVerifiableCredential,
  TradePassCredentialProof,
  TradePassRole,
  TradePassRoleType,
  RoleConstraints,
  RoleDelegation,
} from './tradepass';

// GeoTag - canonical for CommodityType
export * from './geotag';

// GCI - all types
export * from './gci';

// PvP - all types
export * from './pvp';

// VaultMark - exclude CommodityType (use geotag version)
export {
  VaultCommodityForm,
  CustodyChain,
  CustodyStatus,
  CustodyEntry,
  CustodyAction,
  CustodyLocation,
  FacilityType,
  CustodyEvidence,
  SealRecord,
  WeightRecord,
  CustodyVerification,
  VerificationMethod,
  VaultLot,
  LotOrigin,
  LotSpecifications,
  LotStatus,
  // CommodityType excluded - use from geotag
} from './vaultmark';
