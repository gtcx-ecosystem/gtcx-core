# gtcx-edge

Edge runtime for resource-constrained devices — device profiling, resource limits, and verification caching.

## Usage

```toml
[dependencies]
gtcx-edge = "0.1"
```

```rust
use gtcx_edge::{DeviceProfile, ResourceLimits, VerificationCache};

let profile = DeviceProfile::MidRange;
let limits = ResourceLimits::default_gtcx();
assert!(limits.max_memory_mb == 50);

let mut cache = VerificationCache::new(1000, 86400);
cache.insert("proof-hash", true);
assert_eq!(cache.get("proof-hash"), Some(true));
```

## Device Profiles

`FeaturePhone`, `LowEnd`, `MidRange`, `HighEnd`, `Server`

## License

MIT
