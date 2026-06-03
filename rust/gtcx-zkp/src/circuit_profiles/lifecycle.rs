//! Registry lifecycle and semver metadata (DTF-5.4.1).

use super::registry::{
    profile_by_id, CommodityOriginProfileConfig, PROFILE_GH_COCOA_ORIGIN, PROFILE_GH_GOLD_ORIGIN,
    PROFILE_ZW_DIAMOND_ORIGIN,
};

/// Registry row lifecycle (policy SoR — not a separate R1CS).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ProfileLifecycleStatus {
    /// Current production profile ID.
    Active,
    /// Superseded; prove disallowed unless explicitly allowed.
    Deprecated,
    /// Removed from prove paths.
    #[allow(dead_code)]
    Retired,
}

/// Structured registry resolution failure.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum CircuitRegistryError {
    /// Profile ID is not registered.
    UnknownProfile {
        /// Requested profile ID.
        profile_id: String,
    },
    /// Profile is deprecated and `allow_deprecated` was false.
    DeprecatedProfile {
        /// Requested profile ID.
        profile_id: String,
        /// Replacement profile ID when known.
        superseded_by: Option<&'static str>,
    },
    /// Profile is retired.
    RetiredProfile {
        /// Requested profile ID.
        profile_id: String,
        /// Replacement profile ID when known.
        superseded_by: Option<&'static str>,
    },
}

impl std::fmt::Display for CircuitRegistryError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::UnknownProfile { profile_id } => {
                write!(f, "Unknown commodity origin profile: {profile_id}")
            }
            Self::DeprecatedProfile {
                profile_id,
                superseded_by,
            } => {
                write!(f, "Profile {profile_id} is deprecated")?;
                if let Some(next) = superseded_by {
                    write!(f, "; use {next}")?;
                }
                Ok(())
            }
            Self::RetiredProfile {
                profile_id,
                superseded_by,
            } => {
                write!(f, "Profile {profile_id} is retired")?;
                if let Some(next) = superseded_by {
                    write!(f, "; use {next}")?;
                }
                Ok(())
            }
        }
    }
}

impl std::error::Error for CircuitRegistryError {}

/// Semver and lifecycle metadata for a registry profile ID.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ProfileRegistryMeta {
    /// Registry profile ID.
    pub profile_id: &'static str,
    /// Semver `major.minor.patch`.
    pub version: &'static str,
    /// Lifecycle status.
    pub status: ProfileLifecycleStatus,
    /// ISO-like jurisdiction code (documentation only).
    pub jurisdiction_code: &'static str,
    /// Replacement profile when deprecated or retired.
    pub superseded_by: Option<&'static str>,
}

/// Preview profile retained for deprecation tests only (no `profile_by_id` config).
pub const PROFILE_GH_GOLD_ORIGIN_PREVIEW: &str = "gh-gold-origin-preview";

const REGISTRY_META: &[ProfileRegistryMeta] = &[
    ProfileRegistryMeta {
        profile_id: PROFILE_GH_GOLD_ORIGIN,
        version: "1.0.0",
        status: ProfileLifecycleStatus::Active,
        jurisdiction_code: "GH",
        superseded_by: None,
    },
    ProfileRegistryMeta {
        profile_id: PROFILE_ZW_DIAMOND_ORIGIN,
        version: "1.0.0",
        status: ProfileLifecycleStatus::Active,
        jurisdiction_code: "ZW",
        superseded_by: None,
    },
    ProfileRegistryMeta {
        profile_id: PROFILE_GH_COCOA_ORIGIN,
        version: "1.0.0",
        status: ProfileLifecycleStatus::Active,
        jurisdiction_code: "GH",
        superseded_by: None,
    },
    ProfileRegistryMeta {
        profile_id: PROFILE_GH_GOLD_ORIGIN_PREVIEW,
        version: "0.9.0",
        status: ProfileLifecycleStatus::Deprecated,
        jurisdiction_code: "GH",
        superseded_by: Some(PROFILE_GH_GOLD_ORIGIN),
    },
];

fn meta_for(profile_id: &str) -> Option<&'static ProfileRegistryMeta> {
    REGISTRY_META
        .iter()
        .find(|m| m.profile_id == profile_id)
}

/// Resolve lifecycle metadata for a profile ID.
pub fn registry_meta(profile_id: &str) -> Option<&'static ProfileRegistryMeta> {
    meta_for(profile_id)
}

/// List active profile IDs (native provable).
pub fn active_profile_ids() -> Vec<&'static str> {
    REGISTRY_META
        .iter()
        .filter(|m| m.status == ProfileLifecycleStatus::Active)
        .map(|m| m.profile_id)
        .collect()
}

/// Resolve profile config with lifecycle checks (DTF-5.4.1).
pub fn resolve_profile(
    profile_id: &str,
    allow_deprecated: bool,
) -> Result<CommodityOriginProfileConfig, CircuitRegistryError> {
    let meta = meta_for(profile_id).ok_or_else(|| CircuitRegistryError::UnknownProfile {
        profile_id: profile_id.to_string(),
    })?;

    match meta.status {
        ProfileLifecycleStatus::Active => profile_by_id(profile_id).ok_or_else(|| {
            CircuitRegistryError::UnknownProfile {
                profile_id: profile_id.to_string(),
            }
        }),
        ProfileLifecycleStatus::Deprecated => {
            if !allow_deprecated {
                return Err(CircuitRegistryError::DeprecatedProfile {
                    profile_id: profile_id.to_string(),
                    superseded_by: meta.superseded_by,
                });
            }
            profile_by_id(profile_id).ok_or_else(|| CircuitRegistryError::UnknownProfile {
                profile_id: profile_id.to_string(),
            })
        }
        ProfileLifecycleStatus::Retired => Err(CircuitRegistryError::RetiredProfile {
            profile_id: profile_id.to_string(),
            superseded_by: meta.superseded_by,
        }),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn resolve_active_profiles() {
        for id in [
            PROFILE_GH_GOLD_ORIGIN,
            PROFILE_ZW_DIAMOND_ORIGIN,
            PROFILE_GH_COCOA_ORIGIN,
        ] {
            let cfg = resolve_profile(id, false).expect(id);
            assert_eq!(cfg.profile_id, id);
        }
    }

    #[test]
    fn reject_unknown_profile() {
        let err = resolve_profile("na-gold-origin", false).unwrap_err();
        assert!(matches!(err, CircuitRegistryError::UnknownProfile { .. }));
    }

    #[test]
    fn reject_deprecated_without_flag() {
        let err = resolve_profile(PROFILE_GH_GOLD_ORIGIN_PREVIEW, false).unwrap_err();
        assert!(matches!(
            err,
            CircuitRegistryError::DeprecatedProfile { .. }
        ));
    }
}
