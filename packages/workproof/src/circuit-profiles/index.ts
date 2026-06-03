export { GH_GOLD_ORIGIN_PROFILE } from './gh-gold-origin';
export {
  CertificationBit,
  certificationBitMask,
  certificationMaskSatisfied,
} from './certification';
export type {
  CircuitProfileId,
  CommodityOriginProfileConfig,
  ProfileMetricSemantics,
  UnderlyingGroth16Circuit,
} from './types';

import { GH_GOLD_ORIGIN_PROFILE } from './gh-gold-origin';
import type { CircuitProfileId, CommodityOriginProfileConfig } from './types';

const REGISTRY: Record<CircuitProfileId, CommodityOriginProfileConfig> = {
  'gh-gold-origin': GH_GOLD_ORIGIN_PROFILE,
  'zw-diamond-origin': {
    profileId: 'zw-diamond-origin',
    underlyingCircuit: 'CommodityOrigin',
    jurisdictionCode: 'ZW',
    commodityType: 1,
    bounds: [15_000_000, 25_000_000, 25_000_000, 35_000_000],
    minPrimary: 70,
    minSecondary: 100,
    requiredCertificationMask: 1 << 0,
    metricSemantics: 'clarity-and-centi-carats',
    policyNotes: 'Regional certification bit; clarity + centi-carats',
  },
  'commodity-origin': {
    profileId: 'commodity-origin',
    underlyingCircuit: 'CommodityOrigin',
    jurisdictionCode: '*',
    commodityType: 0,
    bounds: [10, 20, 30, 40],
    minPrimary: 950,
    minSecondary: 500,
    requiredCertificationMask: 0,
    metricSemantics: 'purity-basis-points-and-grams',
    policyNotes: 'Lab default commodity-origin (no cert mask)',
  },
};

export function profileById(id: CircuitProfileId): CommodityOriginProfileConfig {
  return REGISTRY[id];
}
