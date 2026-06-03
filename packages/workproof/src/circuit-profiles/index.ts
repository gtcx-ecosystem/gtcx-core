export { GH_GOLD_ORIGIN_PROFILE } from './gh-gold-origin';
export { GH_COCOA_ORIGIN_PROFILE } from './gh-cocoa-origin';
export { ZW_DIAMOND_ORIGIN_PROFILE } from './zw-diamond-origin';
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

import { circuitRegistry } from '@gtcx/crypto';

import { GH_COCOA_ORIGIN_PROFILE } from './gh-cocoa-origin';
import { GH_GOLD_ORIGIN_PROFILE } from './gh-gold-origin';
import type { CircuitProfileId, CommodityOriginProfileConfig } from './types';
import { ZW_DIAMOND_ORIGIN_PROFILE } from './zw-diamond-origin';

const REGISTRY: Record<CircuitProfileId, CommodityOriginProfileConfig> = {
  'gh-gold-origin': GH_GOLD_ORIGIN_PROFILE,
  'gh-cocoa-origin': GH_COCOA_ORIGIN_PROFILE,
  'zw-diamond-origin': ZW_DIAMOND_ORIGIN_PROFILE,
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
  circuitRegistry.resolve(id);
  return REGISTRY[id];
}
