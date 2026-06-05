import { certificationBitMask, CertificationBit } from './certification';
import type { CommodityOriginProfileConfig } from './types';

/** Tier-5 reference profile for diamond origin (registry ID `zw-diamond-origin`). */
export const ZW_DIAMOND_ORIGIN_PROFILE: CommodityOriginProfileConfig = {
  profileId: 'zw-diamond-origin',
  underlyingCircuit: 'CommodityOrigin',
  jurisdictionCode: 'ZW',
  commodityType: 1,
  bounds: [15_000_000, 25_000_000, 25_000_000, 35_000_000],
  minPrimary: 70,
  minSecondary: 100,
  requiredCertificationMask: certificationBitMask(CertificationBit.RegionalCertification),
  metricSemantics: 'clarity-and-centi-carats',
  policyNotes: 'Regional certification bit; clarity + centi-carats',
};
