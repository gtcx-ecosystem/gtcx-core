//! Pre-prove profile validation (policy layer — no jurisdiction names in circuit).

use crate::groth16::CommodityOriginSample;

use super::certification::certification_mask_satisfied;
use super::registry::CommodityOriginProfileConfig;

/// Validation failure for a profile-bound witness.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum ProfileValidationError {
    /// `commodity_type` does not match profile.
    CommodityTypeMismatch {
        /// Expected commodity type.
        expected: u64,
        /// Actual commodity type.
        actual: u64,
    },
    /// Required certification mask not satisfied.
    CertificationMaskUnsatisfied {
        /// Required mask.
        required_mask: u64,
        /// Actual flags.
        actual: u64,
    },
    /// Primary metric below profile minimum.
    PrimaryBelowMin {
        /// Minimum required.
        min: u64,
        /// Actual value.
        actual: u64,
    },
    /// Secondary metric below profile minimum.
    SecondaryBelowMin {
        /// Minimum required.
        min: u64,
        /// Actual value.
        actual: u64,
    },
    /// GPS witness outside profile bounding box.
    GpsOutOfBounds,
}

/// Result of [`validate_profile_sample`].
pub type ProfileValidationResult = Result<(), ProfileValidationError>;

/// Witness fields checked by profile policy (pre-prove gate).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ProfileWitnessFields {
    /// Commodity type public input.
    pub commodity_type: u64,
    /// Latitude witness.
    pub lat: u64,
    /// Longitude witness.
    pub lon: u64,
    /// Primary quality metric.
    pub primary_metric: u64,
    /// Secondary quality metric.
    pub secondary_metric: u64,
    /// Certification flags public input.
    pub certification_flags: u64,
}

/// Policy checks before Groth16 prove (cert mask, bounds, commodity type).
pub fn validate_profile_witness(
    profile: &CommodityOriginProfileConfig,
    witness: &ProfileWitnessFields,
) -> ProfileValidationResult {
    if witness.commodity_type != profile.commodity_type {
        return Err(ProfileValidationError::CommodityTypeMismatch {
            expected: profile.commodity_type,
            actual: witness.commodity_type,
        });
    }

    if !certification_mask_satisfied(
        witness.certification_flags,
        profile.required_certification_mask,
    ) {
        return Err(ProfileValidationError::CertificationMaskUnsatisfied {
            required_mask: profile.required_certification_mask,
            actual: witness.certification_flags,
        });
    }

    if witness.primary_metric < profile.min_primary {
        return Err(ProfileValidationError::PrimaryBelowMin {
            min: profile.min_primary,
            actual: witness.primary_metric,
        });
    }

    if witness.secondary_metric < profile.min_secondary {
        return Err(ProfileValidationError::SecondaryBelowMin {
            min: profile.min_secondary,
            actual: witness.secondary_metric,
        });
    }

    if witness.lat < profile.bounds[0]
        || witness.lat > profile.bounds[1]
        || witness.lon < profile.bounds[2]
        || witness.lon > profile.bounds[3]
    {
        return Err(ProfileValidationError::GpsOutOfBounds);
    }

    Ok(())
}

/// Policy checks before Groth16 prove (cert mask, bounds, commodity type).
pub fn validate_profile_sample(
    profile: &CommodityOriginProfileConfig,
    sample: &CommodityOriginSample,
) -> ProfileValidationResult {
    validate_profile_witness(
        profile,
        &ProfileWitnessFields {
            commodity_type: sample.commodity_type,
            lat: sample.lat,
            lon: sample.lon,
            primary_metric: sample.primary_metric,
            secondary_metric: sample.secondary_metric,
            certification_flags: sample.certification_flags,
        },
    )
}
