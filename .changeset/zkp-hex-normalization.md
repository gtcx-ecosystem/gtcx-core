---
'@gtcx/crypto': patch
---

Fix ZKP NAPI boundary hex encoding bug in `NativeZkpEngine`. `schnorrProveIdentityAttribute` now normalizes arbitrary `subjectHash` inputs to 32-byte SHA-256 digests before crossing the JS→Rust boundary. Verify path hardened against malformed JSON and cryptographic errors, returning `false` instead of throwing.
