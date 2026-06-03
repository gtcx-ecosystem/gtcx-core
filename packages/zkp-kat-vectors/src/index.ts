/**
 * GTCX ZKP Known Answer Test (KAT) vectors.
 *
 * This package exports canonical KAT artifacts for all supported
 * ZKP circuits (Groth16 and Bulletproofs) as typed JSON data.
 *
 * @example
 * ```typescript
 * import { groth16GciThreshold, type Groth16KatArtifact } from '@gtcx/zkp-kat-vectors';
 *
 * const kat: Groth16KatArtifact = groth16GciThreshold;
 * console.log(kat.vk_hash);
 * ```
 */

export type {
  BulletproofsKatArtifact,
  BulletproofsKatPublicInputs,
  BulletproofsKatWitness,
  Groth16KatArtifact,
  Groth16KatPublicInputs,
  Groth16KatWitness,
  KatArtifact,
  KatCircuitName,
} from './types.js';

import bulletproofsAmountRangeJson from './data/bulletproofs-amount-range.kat.json' with { type: 'json' };
import bulletproofsCommodityRangeJson from './data/bulletproofs-commodity-range.kat.json' with { type: 'json' };
import groth16AssetOwnershipJson from './data/groth16-asset-ownership.kat.json' with { type: 'json' };
import groth16CommodityOriginJson from './data/groth16-commodity-origin.kat.json' with { type: 'json' };
import groth16GciThresholdJson from './data/groth16-gci-threshold.kat.json' with { type: 'json' };
import groth16GhGoldOriginJson from './data/groth16-gh-gold-origin.kat.json' with { type: 'json' };
import groth16LocationRegionJson from './data/groth16-location-region.kat.json' with { type: 'json' };
import groth16ZwDiamondOriginJson from './data/groth16-zw-diamond-origin.kat.json' with { type: 'json' };

export const groth16GciThreshold = groth16GciThresholdJson as typeof groth16GciThresholdJson;
export const groth16AssetOwnership = groth16AssetOwnershipJson as typeof groth16AssetOwnershipJson;
export const groth16LocationRegion = groth16LocationRegionJson as typeof groth16LocationRegionJson;
export const groth16CommodityOrigin =
  groth16CommodityOriginJson as typeof groth16CommodityOriginJson;
export const groth16GhGoldOrigin = groth16GhGoldOriginJson as typeof groth16GhGoldOriginJson;
export const groth16ZwDiamondOrigin =
  groth16ZwDiamondOriginJson as typeof groth16ZwDiamondOriginJson;
export const bulletproofsAmountRange =
  bulletproofsAmountRangeJson as typeof bulletproofsAmountRangeJson;
export const bulletproofsCommodityRange =
  bulletproofsCommodityRangeJson as typeof bulletproofsCommodityRangeJson;

/** All KAT artifacts keyed by circuit name. */
export const katArtifacts = {
  'groth16-gci-threshold': groth16GciThreshold,
  'groth16-asset-ownership': groth16AssetOwnership,
  'groth16-location-region': groth16LocationRegion,
  'groth16-commodity-origin': groth16CommodityOrigin,
  'groth16-gh-gold-origin': groth16GhGoldOrigin,
  'groth16-zw-diamond-origin': groth16ZwDiamondOrigin,
  'bulletproofs-amount-range': bulletproofsAmountRange,
  'bulletproofs-commodity-range': bulletproofsCommodityRange,
} as const;

/** Ordered list of all available KAT circuit names. */
export const katCircuitNames = Object.keys(katArtifacts) as Array<keyof typeof katArtifacts>;
