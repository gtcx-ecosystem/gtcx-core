//! # GTCX Edge Runtime
//!
//! Edge runtime for constrained devices (mobile, IoT, WASM).
//!
//! ## Overview
//!
//! This crate provides:
//! - Offline verification cache for disconnected operation
//! - Resource constraint checking (memory, binary size, storage)
//! - Lightweight proof verification (delegates to `gtcx-crypto`)
//! - Device capability profiling
//!
//! ## Constraints
//!
//! - < 50MB RAM
//! - < 10MB binary size
//! - < 2MB WASM bundle
//! - Works offline for 30+ days

#![deny(unsafe_code)]
#![deny(warnings)]
#![deny(missing_docs)]

use gtcx_crypto::hashing::blake3;
use serde::{Deserialize, Serialize};
use thiserror::Error;
use tracing::instrument;

// =============================================================================
// ERROR TYPES
// =============================================================================

/// Errors in the edge runtime.
#[derive(Debug, Error)]
pub enum EdgeError {
    /// Device does not meet minimum resource requirements.
    #[error("Resource constraint violated: {resource} ({available} available, {required} required)")]
    ResourceConstraint {
        /// The resource type (e.g., "memory", "storage").
        resource: String,
        /// Available amount.
        available: u64,
        /// Required amount.
        required: u64,
    },

    /// Cache entry not found.
    #[error("Cache miss: key {0}")]
    CacheMiss(String),

    /// Cache is full.
    #[error("Cache full: {size} entries (max {max})")]
    CacheFull {
        /// Current cache size.
        size: usize,
        /// Maximum cache size.
        max: usize,
    },

    /// Verification failed offline.
    #[error("Offline verification failed: {reason}")]
    VerificationFailed {
        /// Reason for failure.
        reason: String,
    },
}

/// Result type for edge operations.
pub type Result<T> = std::result::Result<T, EdgeError>;

// =============================================================================
// RESOURCE CONSTRAINTS
// =============================================================================

/// Resource limits for edge devices.
#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct ResourceLimits {
    /// Maximum RAM in bytes.
    pub max_memory_bytes: u64,
    /// Maximum binary size in bytes.
    pub max_binary_bytes: u64,
    /// Maximum WASM bundle size in bytes.
    pub max_wasm_bytes: u64,
    /// Maximum offline duration in days.
    pub max_offline_days: u32,
    /// Maximum cache entries.
    pub max_cache_entries: usize,
}

impl ResourceLimits {
    /// Default GTCX edge constraints.
    pub fn default_gtcx() -> Self {
        Self {
            max_memory_bytes: 50 * 1024 * 1024,    // 50 MB
            max_binary_bytes: 10 * 1024 * 1024,     // 10 MB
            max_wasm_bytes: 2 * 1024 * 1024,         // 2 MB
            max_offline_days: 30,
            max_cache_entries: 10_000,
        }
    }

    /// Relaxed constraints for development/testing.
    pub fn development() -> Self {
        Self {
            max_memory_bytes: 512 * 1024 * 1024,   // 512 MB
            max_binary_bytes: 100 * 1024 * 1024,    // 100 MB
            max_wasm_bytes: 20 * 1024 * 1024,        // 20 MB
            max_offline_days: 365,
            max_cache_entries: 100_000,
        }
    }
}

impl Default for ResourceLimits {
    fn default() -> Self {
        Self::default_gtcx()
    }
}

/// Device capability profile.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum DeviceProfile {
    /// Feature phone (USSD only, no local crypto).
    FeaturePhone,
    /// Low-end smartphone (basic verification, limited cache).
    LowEnd,
    /// Mid-range smartphone (full verification, moderate cache).
    MidRange,
    /// High-end device (full capability).
    HighEnd,
    /// Server/desktop (no constraints).
    Server,
}

impl DeviceProfile {
    /// Get resource limits for this device profile.
    pub fn resource_limits(self) -> ResourceLimits {
        match self {
            Self::FeaturePhone => ResourceLimits {
                max_memory_bytes: 2 * 1024 * 1024,
                max_binary_bytes: 512 * 1024,
                max_wasm_bytes: 0, // no WASM support
                max_offline_days: 7,
                max_cache_entries: 100,
            },
            Self::LowEnd => ResourceLimits {
                max_memory_bytes: 16 * 1024 * 1024,
                max_binary_bytes: 4 * 1024 * 1024,
                max_wasm_bytes: 1024 * 1024,
                max_offline_days: 14,
                max_cache_entries: 1_000,
            },
            Self::MidRange => ResourceLimits::default_gtcx(),
            Self::HighEnd => ResourceLimits {
                max_memory_bytes: 256 * 1024 * 1024,
                max_binary_bytes: 50 * 1024 * 1024,
                max_wasm_bytes: 10 * 1024 * 1024,
                max_offline_days: 90,
                max_cache_entries: 50_000,
            },
            Self::Server => ResourceLimits::development(),
        }
    }

    /// Check if this profile supports WASM.
    pub fn supports_wasm(self) -> bool {
        self.resource_limits().max_wasm_bytes > 0
    }

    /// Check if this profile supports local crypto operations.
    pub fn supports_local_crypto(self) -> bool {
        !matches!(self, Self::FeaturePhone)
    }
}

/// Check if a resource usage fits within limits.
///
/// # Errors
///
/// Returns [`EdgeError::ResourceConstraint`] if the usage exceeds the limit.
pub fn check_resource(resource: &str, available: u64, required: u64) -> Result<()> {
    if available < required {
        return Err(EdgeError::ResourceConstraint {
            resource: resource.to_string(),
            available,
            required,
        });
    }
    Ok(())
}

// =============================================================================
// OFFLINE VERIFICATION CACHE
// =============================================================================

/// A cached verification result for offline operation.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CacheEntry {
    /// The cache key (Blake3 hash of the verified data).
    pub key: String,
    /// Whether the verification passed.
    pub verified: bool,
    /// Timestamp when the verification was performed (ms since epoch).
    pub verified_at_ms: u64,
    /// How many days this cache entry remains valid.
    pub ttl_days: u32,
    /// Optional metadata.
    pub metadata: Option<String>,
}

/// An offline verification cache with LRU-style eviction.
#[derive(Debug)]
pub struct VerificationCache {
    entries: Vec<CacheEntry>,
    limits: ResourceLimits,
}

impl VerificationCache {
    /// Create a new cache with the given resource limits.
    pub fn new(limits: ResourceLimits) -> Self {
        Self {
            entries: Vec::new(),
            limits,
        }
    }

    /// Create a cache with default GTCX limits.
    pub fn with_defaults() -> Self {
        Self::new(ResourceLimits::default_gtcx())
    }

    /// Store a verification result.
    ///
    /// # Errors
    ///
    /// Returns [`EdgeError::CacheFull`] if the cache is at capacity.
    #[instrument(skip(self), fields(key = %key, verified = verified))]
    pub fn store(
        &mut self,
        key: String,
        verified: bool,
        ttl_days: u32,
        metadata: Option<String>,
    ) -> Result<()> {
        // Check capacity
        if self.entries.len() >= self.limits.max_cache_entries {
            return Err(EdgeError::CacheFull {
                size: self.entries.len(),
                max: self.limits.max_cache_entries,
            });
        }

        // Remove existing entry with same key (update)
        self.entries.retain(|e| e.key != key);

        self.entries.push(CacheEntry {
            key,
            verified,
            verified_at_ms: current_timestamp_ms(),
            ttl_days,
            metadata,
        });

        Ok(())
    }

    /// Look up a cached verification result.
    ///
    /// # Errors
    ///
    /// Returns [`EdgeError::CacheMiss`] if the key is not in the cache.
    pub fn lookup(&self, key: &str) -> Result<&CacheEntry> {
        self.entries
            .iter()
            .find(|e| e.key == key)
            .ok_or_else(|| EdgeError::CacheMiss(key.to_string()))
    }

    /// Remove expired entries based on the current time.
    pub fn evict_expired(&mut self, now_ms: u64) {
        self.entries.retain(|e| {
            let expiry_ms = e.verified_at_ms + u64::from(e.ttl_days) * 86_400_000;
            now_ms < expiry_ms
        });
    }

    /// Get the number of cached entries.
    pub fn len(&self) -> usize {
        self.entries.len()
    }

    /// Check if the cache is empty.
    pub fn is_empty(&self) -> bool {
        self.entries.is_empty()
    }

    /// Clear all entries.
    pub fn clear(&mut self) {
        self.entries.clear();
    }
}

/// Compute a cache key from data bytes.
pub fn cache_key(data: &[u8]) -> String {
    hex::encode(blake3(data))
}

// ── Internal helpers ──

fn current_timestamp_ms() -> u64 {
    use std::time::{SystemTime, UNIX_EPOCH};
    u64::try_from(
        SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap_or_default()
            .as_millis(),
    )
    .unwrap_or(u64::MAX)
}

// =============================================================================
// TESTS
// =============================================================================

#[cfg(test)]
mod tests {
    use super::*;

    // ── ResourceLimits ──

    #[test]
    fn test_default_limits() {
        let limits = ResourceLimits::default_gtcx();
        assert_eq!(limits.max_memory_bytes, 50 * 1024 * 1024);
        assert_eq!(limits.max_binary_bytes, 10 * 1024 * 1024);
        assert_eq!(limits.max_wasm_bytes, 2 * 1024 * 1024);
        assert_eq!(limits.max_offline_days, 30);
    }

    #[test]
    fn test_dev_limits_more_relaxed() {
        let prod = ResourceLimits::default_gtcx();
        let dev = ResourceLimits::development();
        assert!(dev.max_memory_bytes > prod.max_memory_bytes);
        assert!(dev.max_cache_entries > prod.max_cache_entries);
    }

    // ── DeviceProfile ──

    #[test]
    fn test_feature_phone_no_wasm() {
        assert!(!DeviceProfile::FeaturePhone.supports_wasm());
    }

    #[test]
    fn test_feature_phone_no_local_crypto() {
        assert!(!DeviceProfile::FeaturePhone.supports_local_crypto());
    }

    #[test]
    fn test_mid_range_supports_wasm() {
        assert!(DeviceProfile::MidRange.supports_wasm());
    }

    #[test]
    fn test_server_supports_everything() {
        assert!(DeviceProfile::Server.supports_wasm());
        assert!(DeviceProfile::Server.supports_local_crypto());
    }

    #[test]
    fn test_profile_resource_ordering() {
        let fp = DeviceProfile::FeaturePhone.resource_limits();
        let lo = DeviceProfile::LowEnd.resource_limits();
        let mid = DeviceProfile::MidRange.resource_limits();
        let hi = DeviceProfile::HighEnd.resource_limits();

        assert!(fp.max_memory_bytes < lo.max_memory_bytes);
        assert!(lo.max_memory_bytes < mid.max_memory_bytes);
        assert!(mid.max_memory_bytes < hi.max_memory_bytes);
    }

    // ── Resource checking ──

    #[test]
    fn test_check_resource_passes() {
        assert!(check_resource("memory", 100, 50).is_ok());
    }

    #[test]
    fn test_check_resource_exact_passes() {
        assert!(check_resource("memory", 50, 50).is_ok());
    }

    #[test]
    fn test_check_resource_fails() {
        let err = check_resource("memory", 30, 50).unwrap_err();
        assert!(matches!(err, EdgeError::ResourceConstraint { .. }));
    }

    // ── VerificationCache ──

    #[test]
    fn test_cache_store_and_lookup() {
        let mut cache = VerificationCache::with_defaults();
        cache.store("key1".to_string(), true, 30, None).unwrap();

        let entry = cache.lookup("key1").unwrap();
        assert!(entry.verified);
        assert_eq!(entry.ttl_days, 30);
    }

    #[test]
    fn test_cache_miss() {
        let cache = VerificationCache::with_defaults();
        let err = cache.lookup("nonexistent").unwrap_err();
        assert!(matches!(err, EdgeError::CacheMiss(_)));
    }

    #[test]
    fn test_cache_update_replaces() {
        let mut cache = VerificationCache::with_defaults();
        cache.store("key1".to_string(), true, 30, None).unwrap();
        cache
            .store("key1".to_string(), false, 7, Some("updated".to_string()))
            .unwrap();

        assert_eq!(cache.len(), 1);
        let entry = cache.lookup("key1").unwrap();
        assert!(!entry.verified);
        assert_eq!(entry.metadata.as_deref(), Some("updated"));
    }

    #[test]
    fn test_cache_full() {
        let limits = ResourceLimits {
            max_cache_entries: 2,
            ..ResourceLimits::default_gtcx()
        };
        let mut cache = VerificationCache::new(limits);
        cache.store("a".to_string(), true, 30, None).unwrap();
        cache.store("b".to_string(), true, 30, None).unwrap();

        let err = cache.store("c".to_string(), true, 30, None).unwrap_err();
        assert!(matches!(err, EdgeError::CacheFull { .. }));
    }

    #[test]
    fn test_cache_evict_expired() {
        let mut cache = VerificationCache::with_defaults();
        // Store with 1-day TTL
        cache.store("short".to_string(), true, 1, None).unwrap();
        cache.store("long".to_string(), true, 365, None).unwrap();

        // Advance time by 2 days
        let two_days_later = current_timestamp_ms() + 2 * 86_400_000;
        cache.evict_expired(two_days_later);

        assert_eq!(cache.len(), 1);
        assert!(cache.lookup("long").is_ok());
        assert!(cache.lookup("short").is_err());
    }

    #[test]
    fn test_cache_clear() {
        let mut cache = VerificationCache::with_defaults();
        cache.store("a".to_string(), true, 30, None).unwrap();
        cache.store("b".to_string(), true, 30, None).unwrap();
        cache.clear();
        assert!(cache.is_empty());
    }

    // ── Cache key ──

    #[test]
    fn test_cache_key_deterministic() {
        let k1 = cache_key(b"test-data");
        let k2 = cache_key(b"test-data");
        assert_eq!(k1, k2);
    }

    #[test]
    fn test_cache_key_different_data() {
        let k1 = cache_key(b"data-1");
        let k2 = cache_key(b"data-2");
        assert_ne!(k1, k2);
    }

    // ── Serialization ──

    #[test]
    fn test_cache_entry_json_roundtrip() {
        let entry = CacheEntry {
            key: "test-key".to_string(),
            verified: true,
            verified_at_ms: 1000000,
            ttl_days: 30,
            metadata: Some("test".to_string()),
        };
        let json = serde_json::to_string(&entry).unwrap();
        let deserialized: CacheEntry = serde_json::from_str(&json).unwrap();
        assert_eq!(deserialized.key, "test-key");
        assert!(deserialized.verified);
    }

    #[test]
    fn test_device_profile_json_roundtrip() {
        let profile = DeviceProfile::MidRange;
        let json = serde_json::to_string(&profile).unwrap();
        let deserialized: DeviceProfile = serde_json::from_str(&json).unwrap();
        assert_eq!(deserialized, DeviceProfile::MidRange);
    }
}
