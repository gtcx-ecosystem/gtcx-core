import { certificationBitMask, CertificationBit } from './certification';
import type { CommodityOriginProfileConfig } from './types';

/**
 * Tier-5 reference profile for gold origin (registry ID `gh-gold-origin`).
 * Maps to underlying `CommodityOrigin` Groth16 — not a separate circuit.
 */
export const GH_GOLD_ORIGIN_PROFILE: CommodityOriginProfileConfig = {
  profileId: 'gh-gold-origin',
  underlyingCircuit: 'CommodityOrigin',
  jurisdictionCode: 'GH',
  commodityType: 0,
  // lon micro-degrees with +180° offset (Rust u64 circuit encoding)
  bounds: [4_700_000, 11_200_000, 176_700_000, 181_200_000],
  minPrimary: 950,
  minSecondary: 500,
  requiredCertificationMask: certificationBitMask(CertificationBit.RegulatoryExportLicense),
  metricSemantics: 'purity-basis-points-and-grams',
  policyNotes: 'Regulatory export license bit; purity bps + weight grams',
};
