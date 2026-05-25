import type { PredicateURI } from '../types/definitions/predicates';

/**
 * TradePass legacy predicate ID -> canonical gtcx-core PredicateURI alias map.
 *
 * Used during the TradePass-to-gtcx-core predicate reconciliation (per
 * gtcx-intelligence/docs/specs/verification-fabric-v2.md section 5).
 *
 * To use:
 * ```typescript
 * import { resolveLegacyPredicateId } from '@gtcx/verification/migration';
 * const canonical = resolveLegacyPredicateId('tradepass.identity.proven');
 * // -> 'tradepass://workproof/identity/verified'
 * ```
 *
 * This map is purely advisory — it does not change behavior in gtcx-core.
 * TradePass consumers can use it during their own migration to translate
 * existing references without breaking changes.
 */
export const TRADEPASS_LEGACY_ID_ALIASES: Readonly<Record<string, PredicateURI>> = Object.freeze({
  // Identity
  'tradepass.identity.proven': 'tradepass://workproof/identity/verified',
  'tradepass.identity.role_held': 'tradepass://workproof/identity/role-held',
  'tradepass.identity.employment_active': 'tradepass://workproof/identity/employment-active',
  'tradepass.community.member': 'tradepass://workproof/identity/community-membership',

  // Production
  'tradepass.production.commodity': 'tradepass://workproof/production/commodity-produced',
  'tradepass.production.quantity_verified': 'tradepass://workproof/production/quantity-verified',
  'tradepass.production.quality_graded': 'tradepass://workproof/production/quality-graded',
  'tradepass.production.origin': 'tradepass://workproof/production/origin-authenticated',

  // Location
  'tradepass.location.site_verified': 'tradepass://workproof/location/site-verified',
  'tradepass.location.geofence': 'tradepass://workproof/location/geofence-compliant',
  'tradepass.location.environmental': 'tradepass://workproof/location/environmental-compliance',

  // Compliance
  'tradepass.compliance.license_valid': 'tradepass://workproof/compliance/license-valid',
  'tradepass.compliance.inspection_passed': 'tradepass://workproof/compliance/inspection-passed',
  'tradepass.compliance.standard_met': 'tradepass://workproof/compliance/standard-met',
  'tradepass.compliance.violation_free': 'tradepass://workproof/compliance/violation-free',
  'tradepass.compliance.gci_score': 'tradepass://workproof/compliance/gci-score-recorded',

  // Financial
  'tradepass.financial.payment_received': 'tradepass://workproof/financial/payment-received',
  'tradepass.financial.tax_withheld': 'tradepass://workproof/financial/tax-withheld',

  // Entity (added by ADR-012 predicate extension)
  'tradepass.entity.registered': 'tradepass://workproof/entity/registered',
  'tradepass.entity.sanctions_cleared': 'tradepass://workproof/entity/sanctions-cleared',
  'tradepass.entity.pep_cleared': 'tradepass://workproof/entity/pep-cleared',
  'tradepass.entity.adverse_media_cleared': 'tradepass://workproof/entity/adverse-media-cleared',
  'tradepass.entity.beneficial_ownership_disclosed':
    'tradepass://workproof/entity/beneficial-ownership-disclosed',
  'tradepass.entity.accreditation_held': 'tradepass://workproof/entity/accreditation-held',
  'tradepass.entity.recognized': 'tradepass://workproof/entity/recognized',
  'tradepass.entity.issued_by': 'tradepass://workproof/entity/issued-by',
  'tradepass.entity.ownership_chain': 'tradepass://workproof/entity/ownership-chain',
});

/**
 * Resolve a legacy TradePass predicate ID to its canonical gtcx-core PredicateURI.
 *
 * Returns `undefined` for unknown legacy IDs (no fallback — caller decides
 * whether unknown IDs should be ignored, errored, or pass-through preserved).
 */
export function resolveLegacyPredicateId(legacyId: string): PredicateURI | undefined {
  return TRADEPASS_LEGACY_ID_ALIASES[legacyId];
}

/**
 * Reverse lookup — find legacy TradePass IDs that map to a given canonical URI.
 * Multiple legacy IDs may map to the same canonical URI.
 */
export function findLegacyIdsForUri(uri: PredicateURI): string[] {
  return Object.entries(TRADEPASS_LEGACY_ID_ALIASES)
    .filter(([, mapped]) => mapped === uri)
    .map(([legacyId]) => legacyId);
}
