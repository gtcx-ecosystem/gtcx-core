//! Named circuit profiles over commodity-agnostic Groth16 primitives (DTF-5.1.2+).
//!
//! Profile IDs such as `gh-gold-origin` are registry labels and policy packs — not
//! separate R1CS implementations. All profiles map to [`Groth16CircuitType::CommodityOrigin`].

mod certification;
mod registry;
mod sample;
mod validate;

pub use certification::{certification_mask_satisfied, CertificationBit};
pub use registry::{
    all_profile_ids, commodity_origin_profile, gh_cocoa_origin_profile, gh_gold_origin_profile,
    profile_by_id, zw_diamond_origin_profile, CommodityOriginProfileConfig, MetricSemantics,
    PROFILE_GH_COCOA_ORIGIN, PROFILE_GH_GOLD_ORIGIN, PROFILE_ZW_DIAMOND_ORIGIN,
};
pub use sample::sample_commodity_origin_for_profile;
pub use validate::{
    validate_profile_sample, validate_profile_witness, ProfileValidationError,
    ProfileValidationResult, ProfileWitnessFields,
};
