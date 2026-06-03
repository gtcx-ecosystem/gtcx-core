export {
  GH_GOLD_ORIGIN_PROFILE,
  ZW_DIAMOND_ORIGIN_PROFILE,
  profileById,
} from '../circuit-profiles';
export {
  buildCommodityOriginWitness,
  serializeCommodityOriginWitness,
  type BuildCommodityOriginWitnessInput,
} from './build-commodity-origin';
export { WitnessBuildError, type WitnessBuildErrorCode } from './errors';
export {
  PRODUCTION_ORIGIN_PREDICATE_FAMILY,
  type CommodityOriginMerklePathWitness,
  type CommodityOriginWitness,
  type CommodityOriginWitnessSupplement,
  type ProductionOriginPredicateType,
  type WitnessCircuitTarget,
} from './types';
export {
  commodityTypeFromLabel,
  coordToCircuitU64,
  lonToCircuitU64,
  digestHex32,
  parseGpsFromEvidenceMetadata,
  randomnessHex32,
  type GpsCoordinates,
} from './utils';
