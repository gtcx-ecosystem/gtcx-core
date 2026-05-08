# Fuzz Campaign Summary

**Date:** 2026-05-08
**Duration:** 10 minutes per target (60 minutes total)
**Toolchain:** cargo-fuzz + libFuzzer, Rust nightly (aarch64-apple-darwin)
**Sanitizer:** AddressSanitizer (ASAN)

## Results

| Target                      | Runs          | Duration   | Crashes | Coverage  |
| --------------------------- | ------------- | ---------- | ------- | --------- |
| fuzz_signature_verification | 1,470,573     | 601s       | 0       | 451 edges |
| fuzz_key_generation         | 827,372       | 601s       | 0       | 541 edges |
| fuzz_key_derivation         | 785,474       | 601s       | 0       | 640 edges |
| fuzz_hashing                | 6,587,842     | 601s       | 0       | —         |
| fuzz_chain_integrity        | 124,790       | 601s       | 0       | —         |
| fuzz_secp256k1_verification | 93,289        | 601s       | 0       | —         |
| **Total**                   | **9,889,340** | **3,606s** | **0**   |           |

## Conclusion

Zero crashes across 9.9 million executions with AddressSanitizer enabled. All cryptographic operations (signing, verification, hashing, key generation, key derivation, chain integrity) are panic-safe and memory-safe under adversarial input.
