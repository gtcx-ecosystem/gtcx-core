//! Profile registry — configuration only, no per-jurisdiction circuits.

use crate::types::Groth16CircuitType;

use super::certification::CertificationBit;

/// Registry ID for the Ghana gold Tier-5 reference profile (configuration, not a circuit fork).
pub const PROFILE_GH_GOLD_ORIGIN: &str = "gh-gold-origin";

/// Registry ID for the Zimbabwe diamond reference profile (DTF-5.2.1 precursor).
pub const PROFILE_ZW_DIAMOND_ORIGIN: &str = "zw-diamond-origin";

/// How verifiers interpret primary/secondary metrics for a profile (off-circuit).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum MetricSemantics {
    /// Primary = purity basis points (995 = 99.5%); secondary = mass in grams.
    PurityBasisPointsAndGrams,
    /// Primary = clarity score; secondary = mass in centi-carats.
    ClarityAndCentiCarats,
}

/// Policy pack bound to a registry profile ID.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct CommodityOriginProfileConfig {
    /// Registry circuit ID (e.g. `gh-gold-origin`).
    pub profile_id: &'static str,
    /// Always [`Groth16CircuitType::CommodityOrigin`] today.
    pub groth16_circuit: Groth16CircuitType,
    /// ISO-like jurisdiction code for documentation and packs (not used in constraints).
    pub jurisdiction_code: &'static str,
    /// Commodity discriminator passed as public input.
    pub commodity_type: u64,
    /// GPS bounding box `[min_lat, max_lat, min_lon, max_lon]` (fixed-point micro-degrees).
    pub bounds: [u64; 4],
    /// Minimum primary metric (profile-specific semantics).
    pub min_primary: u64,
    /// Minimum secondary metric (profile-specific semantics).
    pub min_secondary: u64,
    /// Required `(certification_flags & mask) == mask` before proving (off-circuit policy gate).
    pub required_certification_mask: u64,
    /// How verifiers interpret primary/secondary metrics.
    pub metric_semantics: MetricSemantics,
    /// Human-readable policy notes (audit / trust portal).
    pub policy_notes: &'static str,
}

/// Ghana gold reference profile — COCOBOD/export license + GPS box + purity/weight semantics.
pub fn gh_gold_origin_profile() -> CommodityOriginProfileConfig {
    CommodityOriginProfileConfig {
        profile_id: PROFILE_GH_GOLD_ORIGIN,
        groth16_circuit: Groth16CircuitType::CommodityOrigin,
        jurisdiction_code: "GH",
        commodity_type: 0,
        // Ghana bbox: lat/lon in micro-degrees; lon uses +180° offset (see spec).
        bounds: [4_700_000, 11_200_000, 176_700_000, 181_200_000],
        min_primary: 950,
        min_secondary: 500,
        required_certification_mask: CertificationBit::RegulatoryExportLicense.mask(),
        metric_semantics: MetricSemantics::PurityBasisPointsAndGrams,
        policy_notes: "Export/regulatory license bit required; purity bps + weight grams",
    }
}

/// Zimbabwe diamond reference profile (same R1CS; Kimberley bit via certification mask).
pub fn zw_diamond_origin_profile() -> CommodityOriginProfileConfig {
    CommodityOriginProfileConfig {
        profile_id: PROFILE_ZW_DIAMOND_ORIGIN,
        groth16_circuit: Groth16CircuitType::CommodityOrigin,
        jurisdiction_code: "ZW",
        commodity_type: 1,
        bounds: [15_000_000, 25_000_000, 25_000_000, 35_000_000],
        min_primary: 70,
        min_secondary: 100,
        required_certification_mask: CertificationBit::RegionalCertification.mask(),
        metric_semantics: MetricSemantics::ClarityAndCentiCarats,
        policy_notes: "Regional certification bit required; clarity + centi-carats",
    }
}

/// Resolve a profile by registry ID.
pub fn profile_by_id(profile_id: &str) -> Option<CommodityOriginProfileConfig> {
    match profile_id {
        PROFILE_GH_GOLD_ORIGIN => Some(gh_gold_origin_profile()),
        PROFILE_ZW_DIAMOND_ORIGIN => Some(zw_diamond_origin_profile()),
        _ => None,
    }
}

/// List registered profile IDs.
pub fn all_profile_ids() -> &'static [&'static str] {
    &[PROFILE_GH_GOLD_ORIGIN, PROFILE_ZW_DIAMOND_ORIGIN]
}

/// Resolve profile config (alias).
pub fn commodity_origin_profile(profile_id: &str) -> Option<CommodityOriginProfileConfig> {
    profile_by_id(profile_id)
}
