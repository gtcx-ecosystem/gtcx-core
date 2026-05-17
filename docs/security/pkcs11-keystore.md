---
title: 'Pkcs11 Keystore'
status: 'current'
date: '2026-05-17'
owner: 'crypto-security-engineer'
role: 'crypto-security-engineer'
tier: 'critical'
tags: ['docs', 'security']
review_cycle: 'quarterly'
---

# PKCS#11 KeyStore

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Cryptographic Security Engineer

**Module:** `gtcx_crypto::pkcs11_keystore`
**Feature flag:** `pkcs11` (in `rust/gtcx-crypto/Cargo.toml`)
**Closes:** AT-004 (audit) / external Medium #1 (procurement assessment)
**Cross-references:** [Trust Portal](../governance/trust-portal.md), [Key Ceremony](./key-ceremony.md), [FIPS Validation Boundary](./fips-validation-boundary.md)

---

## Why this exists

The `KeyStore` trait in `rust/gtcx-crypto/src/keystore.rs` was shipped earlier as a contract for pluggable key backends. The default `MemoryKeyStore` keeps keys in zeroizing process memory — appropriate for tests and single-process services, but not for institutional deployments where private keys must live inside a tamper-resistant boundary.

`Pkcs11KeyStore` is the hardware-backed implementation. It delegates key generation, signing, and destruction to a PKCS#11 module loaded at runtime. Private keys are generated inside the HSM and marked non-extractable; signing happens inside the module; gtcx-core never sees the raw private key bytes.

This closes the audit's AT-004 finding and the external assessment's Medium #1.

---

## Compilation

```bash
cargo build -p gtcx-crypto --features pkcs11
cargo test  -p gtcx-crypto --features pkcs11 --lib
```

CI runs both on every PR. The feature is opt-in — default builds do not pull `cryptoki` or any HSM-related dependencies.

You can combine with `--features fips`:

```bash
cargo build -p gtcx-crypto --features fips --features pkcs11
```

In a FIPS+PKCS#11 build, signing routes through aws-lc-rs (FIPS-validated) for in-process operations and through the HSM for key-stored operations. The two paths are independent — choose per-operation by which provider you call.

---

## Algorithm support

Ed25519 only, via `CKM_EDDSA` with `EddsaSignatureScheme::Pure`.

| PKCS#11 module         | Ed25519 support | Notes                                            |
| ---------------------- | --------------- | ------------------------------------------------ |
| SoftHSMv2 ≥ 2.6.0      | ✓               | Recommended for CI integration tests             |
| AWS CloudHSM v3+       | ✓               | Native CKM_EDDSA support                         |
| Thales Luna 7+         | ✓               | Requires firmware enabling Edwards curves        |
| Utimaco SecurityServer | ✓ (SE Series)   | Check firmware version                           |
| Older v2.x modules     | ✗               | Operations fail at session-mechanism enumeration |

Other algorithms (ECDSA P-256, ECDSA secp256k1, RSA) are not yet wired. The trait is shaped to accept new variants of `Algorithm` without breaking changes; adding ECDSA P-256 is a follow-up that mirrors the Ed25519 wiring.

---

## API

```rust
use std::sync::Arc;
use cryptoki::context::Pkcs11;
use gtcx_crypto::keystore::{Algorithm, KeyState, KeyStore};
use gtcx_crypto::pkcs11_keystore::{Pkcs11KeyStore, SessionPin};

// 1. Load the PKCS#11 module (caller-supplied path)
let module = Arc::new(Pkcs11::new("/usr/lib/softhsm/libsofthsm2.so")?);
module.initialize(cryptoki::context::CInitializeArgs::OsThreads)?;

// 2. Pick a slot. Real deployments select by token label or serial.
let slot = module.get_slots_with_token()?[0];

// 3. Construct the keystore. Login happens here.
let pin = SessionPin::new("1234");
let store = Pkcs11KeyStore::new(module, slot, &pin)?;

// 4. Use the standard KeyStore trait.
let key_id = store.generate_key(Algorithm::Ed25519)?;
let signature = store.sign(&key_id, b"message")?;
let public_key = store.public_key(&key_id)?;

// Lifecycle transitions per NIST SP 800-57.
store.transition(&key_id, KeyState::Rotated)?;
store.transition(&key_id, KeyState::Destroyed)?;
store.destroy_key(&key_id)?;
```

The `SessionPin` newtype wraps `cryptoki::types::AuthPin`, which zeroizes on drop. PINs do not appear in error messages or `Debug` output.

---

## State tracking

NIST SP 800-57 lifecycle states (Created, Active, Rotated, Revoked, Destroyed) are tracked through the `KeyStateStore` trait (in `pkcs11_state.rs`). Two implementations ship out of the box:

- **`MemoryKeyStateStore`** (default) — in-process `HashMap`. State is lost on process restart. Used by `Pkcs11KeyStore::new()` when no explicit store is provided.
- **`FileSystemKeyStateStore`** — JSON file persistence. State survives process restarts. Use `Pkcs11KeyStore::with_state_store(module, slot, pin, Arc::new(FileSystemKeyStateStore::open(path)?))`.

The HSM itself does not have a per-key lifecycle state model in PKCS#11 v3 — the state machine is a gtcx-core abstraction layered on top.

```rust
use std::sync::Arc;
use gtcx_crypto::pkcs11_keystore::{Pkcs11KeyStore, SessionPin};
use gtcx_crypto::pkcs11_state::FileSystemKeyStateStore;

let state_store = Arc::new(FileSystemKeyStateStore::open("/var/lib/gtcx/keystate.json")?);
let store = Pkcs11KeyStore::with_state_store(module, slot, &pin, state_store)?;
```

### Restart-safety scope

`KeyStateStore` persists **lifecycle state**. PKCS#11 object handles are session-scoped and CANNOT be persisted — restart-safe operation against a real HSM additionally requires CKA_ID-paired key generation so handles can be re-resolved by attribute lookup after restart. That is documented as a separate hardening pass below (#1) and remains Sprint 5+ work.

In practice: with `FileSystemKeyStateStore`, a process restart preserves "key X is in state Active" but the in-process handle map is empty after restart. The next sign call will fail with `KeyNotFound` until handles are re-resolved by CKA_ID. The state-persistence primitive is shippable today; the full restart-safety story requires both layers.

---

## Concurrency

`Pkcs11KeyStore` is `Send + Sync`. Internally, a single PKCS#11 session is shared via `Arc<Mutex<Session>>`. PKCS#11 v3 sessions are not thread-safe per spec; the mutex serializes access.

HSM round-trip latency typically dominates the cost of HSM operations (1-10ms for a software HSM, 5-100ms for a network HSM). Mutex contention is rarely the bottleneck.

For higher throughput, run multiple `Pkcs11KeyStore` instances against separate sessions (PKCS#11 supports multiple sessions per token).

---

## Testing

### Unit tests (no HSM required)

`rust/gtcx-crypto/src/pkcs11_keystore.rs` includes unit tests for:

- KeyId format distinguishability from `MemoryKeyStore`
- Ed25519 OID DER encoding correctness

These run as part of `cargo test --features pkcs11` and require no HSM.

### Integration tests (require SoftHSMv2)

Integration tests against a real PKCS#11 module are gated by the `GTCX_PKCS11_MODULE_PATH` environment variable. Tests skip silently when unset.

To run locally:

```bash
# 1. Install SoftHSMv2
brew install softhsm        # macOS
sudo apt install softhsm2   # Linux

# 2. Initialize a token
softhsm2-util --init-token --slot 0 --label "gtcx-test" --pin 1234 --so-pin 5678

# 3. Run the integration tests
GTCX_PKCS11_MODULE_PATH=/usr/lib/softhsm/libsofthsm2.so \
  GTCX_PKCS11_PIN=1234 \
  GTCX_PKCS11_TOKEN_LABEL=gtcx-test \
  cargo test -p gtcx-crypto --features pkcs11 --test pkcs11_integration
```

### CI integration

Wire SoftHSMv2 into CI as a service container or a setup step:

```yaml
- name: Install SoftHSMv2
  run: sudo apt install -y softhsm2

- name: Initialize SoftHSMv2 token
  run: |
    softhsm2-util --init-token --slot 0 --label gtcx-ci --pin 1234 --so-pin 5678

- name: Run PKCS#11 integration tests
  env:
    GTCX_PKCS11_MODULE_PATH: /usr/lib/softhsm/libsofthsm2.so
    GTCX_PKCS11_PIN: '1234'
    GTCX_PKCS11_TOKEN_LABEL: gtcx-ci
  run: cargo test -p gtcx-crypto --features pkcs11 --test pkcs11_integration
```

This wiring is documented but not yet active in `.github/workflows/ci.yml` — gated on CI infrastructure recovery (separate operational issue).

---

## Hardening passes (Sprint 5+)

1. **CKA_ID-paired generation** — set the same `CKA_ID` attribute on the public/private pair at generation time so we can re-find the public key after session restart. v1 keeps the public handle in the same process-memory registry as the private handle, which works for short-running deployments but loses the link across process restarts.

2. ~~**Persistent state**~~ — **DONE.** `KeyStateStore` trait + `FileSystemKeyStateStore` implementation ship in `rust/gtcx-crypto/src/pkcs11_state.rs`. Database-backed implementations (Postgres, Redis) are straightforward to add against the same trait — left to the consumer.

3. **Multi-slot pooling** — accept a `Vec<Slot>` and round-robin across them for higher throughput against a clustered HSM.

4. **Cloud KMS adapter** — implement a `CloudKmsKeyStore` that wraps AWS KMS / GCP Cloud KMS / Azure Key Vault. The trait is identical; only the backend changes. AWS KMS specifically is appropriate for cloud-native deployments where the HSM is provided by the cloud platform.

5. **Provenance recording** — emit a `key:lifecycle:transition` event for every state change so an external audit log captures the lineage.

6. **Algorithm extension** — add ECDSA P-256 (NIST P-256, FIPS-approved) and secp256k1 variants of `Algorithm`. The trait shape doesn't change; the `generate_key` `match` arm and the `Mechanism` selection do.

---

## Verification path for procurement

A vendor risk team or sandbox regulator can confirm the implementation as follows:

1. **Source review** — `rust/gtcx-crypto/src/pkcs11_keystore.rs` is ~280 LOC of well-commented Rust. Single-pass readable in 15 minutes.
2. **Compile check** — `cargo build --features pkcs11` produces a working library without a real HSM.
3. **Unit-test review** — `cargo test --features pkcs11 --lib` runs 2 unit tests for the registry and OID invariants.
4. **Integration-test review** — the integration-test setup above produces an end-to-end signing round-trip through SoftHSMv2 in ~30 minutes of setup.
5. **Production deployment** — caller substitutes their HSM's PKCS#11 library path, manages PINs per their policy, and the rest works unchanged.

---

## Cross-references

- [`rust/gtcx-crypto/src/keystore.rs`](../../rust/gtcx-crypto/src/keystore.rs) — `KeyStore` trait, `MemoryKeyStore` reference implementation
- [`rust/gtcx-crypto/src/pkcs11_keystore.rs`](../../rust/gtcx-crypto/src/pkcs11_keystore.rs) — this module's source
- [Key Ceremony](./key-ceremony.md) — NIST SP 800-57 lifecycle context
- [FIPS Validation Boundary](./fips-validation-boundary.md) — relationship between the FIPS provider and HSM-backed keys
- [Trust Portal](../governance/trust-portal.md) — section "Cryptographic correctness"

## Changelog

- **1.0.0** (2026-05-10) — Initial Pkcs11KeyStore implementation. Ed25519-only, in-process state tracking, public_key extraction via CKA_EC_POINT. Unit tests + documented SoftHSM integration test path. Five Sprint 5+ hardening passes documented.
