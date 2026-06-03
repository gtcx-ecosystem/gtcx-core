//! Certification flag bits — generic indices; jurisdiction meaning lives in profile config.

/// Well-known certification bit indices (profiles compose via `required_certification_mask`).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
#[repr(u32)]
pub enum CertificationBit {
    /// Kimberley Process / regional certification (e.g. diamond profiles).
    RegionalCertification = 0,
    /// Origin authenticated predicate family.
    OriginAuthenticated = 1,
    /// Regulatory export / buying license predicate (e.g. gold export license packs).
    RegulatoryExportLicense = 2,
}

impl CertificationBit {
    /// Bit mask `1 << index`.
    pub fn mask(self) -> u64 {
        1u64 << (self as u32)
    }
}

/// Returns true when `(flags & required_mask) == required_mask`.
pub fn certification_mask_satisfied(flags: u64, required_mask: u64) -> bool {
    (flags & required_mask) == required_mask
}
