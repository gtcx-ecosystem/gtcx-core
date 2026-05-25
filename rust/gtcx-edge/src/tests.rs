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
