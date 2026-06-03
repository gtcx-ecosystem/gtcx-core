//! Profile-scoped sample witnesses (reuses generic commodity-origin builder).

use crate::error::Result;
use crate::groth16::{
    build_commodity_origin_sample, CommodityOriginBuildParams, CommodityOriginSample,
};

use super::registry::CommodityOriginProfileConfig;

/// Build a deterministic lab witness satisfying `profile` policy bounds.
pub fn sample_commodity_origin_for_profile(
    profile: &CommodityOriginProfileConfig,
) -> Result<CommodityOriginSample> {
    let (lat, lon, primary_metric, secondary_metric, certification_flags, mine_id, leaf_index) =
        profile_lab_witness_defaults(profile);

    build_commodity_origin_sample(CommodityOriginBuildParams {
        commodity_type: profile.commodity_type,
        mine_id,
        lat,
        lon,
        primary_metric,
        secondary_metric,
        primary_randomness: [20u8; 32],
        secondary_randomness: [21u8; 32],
        location_randomness: [22u8; 32],
        bounds: profile.bounds,
        min_primary: profile.min_primary,
        min_secondary: profile.min_secondary,
        certification_flags,
        merkle_leaf_index: leaf_index,
    })
}

fn profile_lab_witness_defaults(
    profile: &CommodityOriginProfileConfig,
) -> (u64, u64, u64, u64, u64, [u8; 32], usize) {
    let lat = (profile.bounds[0] + profile.bounds[1]) / 2;
    let lon = (profile.bounds[2] + profile.bounds[3]) / 2;

    let (primary_metric, secondary_metric) = match profile.metric_semantics {
        super::registry::MetricSemantics::PurityBasisPointsAndGrams => (995u64, 1_000u64),
        super::registry::MetricSemantics::ClarityAndCentiCarats => (85u64, 500u64),
    };

    let certification_flags = profile.required_certification_mask;
    let mine_id = [7u8; 32];
    let leaf_index = 0;

    (lat, lon, primary_metric, secondary_metric, certification_flags, mine_id, leaf_index)
}
