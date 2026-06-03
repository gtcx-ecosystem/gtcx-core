import { certificationBitMask, CertificationBit } from './certification';
import type { CommodityOriginProfileConfig } from './types';

/**
 * Tier-5 reference profile for cocoa origin (registry ID `gh-cocoa-origin`).
 * Maps to underlying `CommodityOrigin` Groth16 — not a separate circuit.
 */
export const GH_COCOA_ORIGIN_PROFILE: CommodityOriginProfileConfig = {
  profileId: 'gh-cocoa-origin',
  underlyingCircuit: 'CommodityOrigin',
  jurisdictionCode: 'GH',
  commodityType: 2,
  bounds: [4_700_000, 11_200_000, 176_700_000, 181_200_000],
  minPrimary: 80,
  minSecondary: 500,
  requiredCertificationMask: certificationBitMask(CertificationBit.OriginAuthenticated),
  metricSemantics: 'grade-and-grams',
  policyNotes: 'Origin-authenticated / LICOR traceability bit; grade score + weight grams',
};
