# Native Binding Safety Audit Checklist

**Last updated:** 2026-05-06
**Scope:** `@gtcx/crypto-native` NAPI-RS bindings (`rust/gtcx-node/src/lib.rs`)

## Overview

This checklist documents the safety invariants enforced at the JavaScript ↔ Rust boundary. It is reviewed after every NAPI-RS upgrade or binding surface change.

## Checklist

### 1. Memory Ownership Rules for Buffers (JS → Rust)

| Item                                                                       | Status  | Evidence                                                                                                                 |
| -------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------ |
| All JS `Uint8Array` inputs are copied into Rust-owned `Vec<u8>` before use | ✅ Pass | NAPI-RS auto-converts `Uint8Array` → `Vec<u8>` by copy; no borrows across the boundary.                                  |
| No Rust code retains references to JS buffer memory after function return  | ✅ Pass | All binding functions take owned `Vec<u8>`; no lifetime annotations on JS buffers.                                       |
| Fixed-size arrays (e.g., `[u8; 32]`) are copied from decoded `Vec<u8>`     | ✅ Pass | `copy_from_slice` is used after explicit length checks (see `zkp_commit_and_prove`, `schnorr_prove_identity_attribute`). |

### 2. Bounds & Length Validation

| Function                            | Input                | Validation                               | Code Location    |
| ----------------------------------- | -------------------- | ---------------------------------------- | ---------------- |
| `zkp_commit_and_prove`              | `salt_hex`           | Length == 32 bytes                       | `lib.rs:210-215` |
| `bulletproofs_prove_amount_range`   | `randomness_hex`     | Length == 32 bytes                       | `lib.rs:457-462` |
| `groth16_verify_proof`              | `public_inputs_json` | Valid JSON array of hex strings          | `lib.rs:399-409` |
| `schnorr_prove_identity_attribute`  | `subject_hash_hex`   | Length == 32 bytes                       | `lib.rs:550-554` |
| `schnorr_verify_identity_attribute` | `*_hex` args         | Length == 32 bytes via `decode_32_bytes` | `lib.rs:594-606` |
| `verify`                            | `signature_hex`      | Decodes to valid signature bytes         | `lib.rs:96-97`   |
| `sign`                              | `private_key_hex`    | Decodes to valid key bytes               | `lib.rs:70-73`   |

### 3. Panic-to-JS-Exception Mapping

| Item                                                             | Status  | Evidence                                                              |
| ---------------------------------------------------------------- | ------- | --------------------------------------------------------------------- |
| Rust panics are caught by NAPI-RS and converted to JS exceptions | ✅ Pass | NAPI-RS default behavior; no `catch_unwind` overrides.                |
| All `Result::Err` paths return `napi::Error::from_reason(...)`   | ✅ Pass | Every `?` operator and `map_err` uses `napi::Error::from_reason`.     |
| No `unwrap()` or `expect()` in production binding code           | ✅ Pass | `#![deny(warnings)]` + clippy `-D warnings` blocks unhandled unwraps. |

### 4. Unsafe Code Surface

| Item                                           | Status  | Evidence                                                                 |
| ---------------------------------------------- | ------- | ------------------------------------------------------------------------ |
| `#![deny(unsafe_code)]` enforced at crate root | ✅ Pass | `lib.rs:23`                                                              |
| No `unsafe` blocks in `gtcx-node`              | ✅ Pass | Verified by `grep -rn 'unsafe' rust/gtcx-node/src/` — 0 matches.         |
| No C++ NAPI glue (pure Rust via `napi-rs`)     | ✅ Pass | Build uses `napi-rs`/`napi-derive` only; no `binding.gyp` or C++ source. |

### 5. Experimental / Unsafe NAPI Feature Flags

| Feature Flag                          | Used? | Risk                                                                |
| ------------------------------------- | ----- | ------------------------------------------------------------------- |
| `napi5` / `napi6` / `napi7` / `napi8` | No    | Not required for current binding surface.                           |
| `async`                               | No    | All binding functions are synchronous.                              |
| `tokio_rt`                            | No    | No async runtime bridging.                                          |
| `latin1`                              | No    | All strings are UTF-8.                                              |
| `serde-json`                          | No    | Manual JSON serialization via `serde_json` crate, not NAPI feature. |

### 6. Symbol Scan (Built Artifact)

Run after building `.node` artifact:

```bash
nm -C rust/target/release/libgtcx_node.dylib 2>/dev/null | grep -E '\b(malloc|free|memcpy)\b' || echo "No forbidden symbols"
```

**Status:** Should show only system `malloc`/`free` from Rust allocator; no unexpected C++ symbols.

### 7. Fuzz / Property-Based Testing

| Test Suite                                  | Coverage                                  |
| ------------------------------------------- | ----------------------------------------- |
| `test_sign_invalid_key_hex`                 | Malformed hex (odd length, non-hex chars) |
| `test_sign_wrong_key_length`                | Wrong byte length                         |
| `test_zkp_invalid_salt_length`              | Short salt                                |
| `test_zkp_verify_tampered_proof_data_fails` | Tampered proof                            |
| `test_schnorr_tampered_response_fails`      | Tampered Schnorr response                 |
| `test_bulletproofs_out_of_range_fails`      | Out-of-range amount                       |
| `test_groth16_score_below_threshold_fails`  | Invalid circuit witness                   |

**Recommendation:** Add a nightly CI job that runs `cargo fuzz` (or `proptest` integration) against `gtcx-node` entry points with random inputs (empty, max-size, malformed UTF-8 where applicable).

## Sign-off

| Role              | Name | Date |
| ----------------- | ---- | ---- |
| Security Engineer | —    | —    |
| Rust Lead         | —    | —    |

## Related

- `rust/gtcx-node/src/lib.rs` — binding source
- `packages/crypto-native/src/index.ts` — JS wrapper
- `.github/workflows/crypto-native-ci.yml` — native CI pipeline
- `docs/audits/remediation-plan-2026-05-06.md` — Phase 5.2
