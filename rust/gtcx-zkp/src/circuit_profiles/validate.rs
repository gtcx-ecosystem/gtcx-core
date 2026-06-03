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

/// Policy checks before Groth16 prove (cert mask, bounds, commodity type).
pub fn validate_profile_sample(
    profile: &CommodityOriginProfileConfig,
    sample: &CommodityOriginSample,
) -> ProfileValidationResult {
    if sample.commodity_type != profile.commodity_type {
        return Err(ProfileValidationError::CommodityTypeMismatch {
            expected: profile.commodity_type,
            actual: sample.commodity_type,
        });
    }

    if !certification_mask_satisfied(sample.certification_flags, profile.required_certification_mask)
    {
        return Err(ProfileValidationError::CertificationMaskUnsatisfied {
            required_mask: profile.required_certification_mask,
            actual: sample.certification_flags,
        });
    }

    if sample.primary_metric < profile.min_primary {
        return Err(ProfileValidationError::PrimaryBelowMin {
            min: profile.min_primary,
            actual: sample.primary_metric,
        });
    }

    if sample.secondary_metric < profile.min_secondary {
        return Err(ProfileValidationError::SecondaryBelowMin {
            min: profile.min_secondary,
            actual: sample.secondary_metric,
        });
    }

    if sample.lat < profile.bounds[0]
        || sample.lat > profile.bounds[1]
        || sample.lon < profile.bounds[2]
        || sample.lon > profile.bounds[3]
    {
        return Err(ProfileValidationError::GpsOutOfBounds);
    }

    Ok(())
}
