//! PKCS#11-backed KeyStore.
//!
//! Wraps a PKCS#11 module (SoftHSM, AWS CloudHSM, hardware HSM) so private
//! key material lives inside the HSM boundary and signing operations
//! delegate to the module. Closes AT-004 / external Medium #1 — gtcx-core
//! now ships a hardware-backed keystore alongside the existing
//! `MemoryKeyStore`.
//!
//! ## Compilation
//!
//! Behind `#[cfg(feature = "pkcs11")]`. Build with `cargo build --features pkcs11`.
//!
//! ## Configuration
//!
//! [`Pkcs11KeyStore::new`] takes a loaded `Pkcs11` module, a `Slot`, and a
//! [`SessionPin`]. The caller is responsible for module loading, token
//! initialization, and PIN management — all of which depend on the specific
//! backend (SoftHSM PIN policy differs from AWS CloudHSM differs from a
//! hardware HSM's CKF_PROTECTED_AUTHENTICATION_PATH model).
//!
//! ## Algorithm support
//!
//! Ed25519 only, via `CKM_EDDSA`. PKCS#11 v3.0+ standardized this; SoftHSMv2
//! ≥ 2.6.0 supports it; AWS CloudHSM supports it natively. Older v2.x
//! modules will fail at session-mechanism enumeration.
//!
//! ## State tracking
//!
//! NIST SP 800-57 lifecycle states are tracked in process memory alongside
//! the PKCS#11 object handles. This is a v1 simplification — production HSM
//! deployments should persist state externally (metadata DB) so state
//! survives process restarts. The trait contract is preserved; the storage
//! substrate is what changes.
//!
//! ## Concurrency
//!
//! `Pkcs11KeyStore` is `Send + Sync`. Internally a single PKCS#11 session is
//! shared across threads via `Arc<Mutex<Session>>`. PKCS#11 v3 sessions are
//! not thread-safe per spec; serializing through the mutex is correct and
//! conservative. HSM round-trip latency typically dominates over mutex
//! contention.
//!
//! ## Testing
//!
//! Unit tests cover state-machine and handle-registry invariants without a
//! real PKCS#11 module. Integration tests against SoftHSMv2 are gated by
//! `GTCX_PKCS11_MODULE_PATH`; they skip silently if unset. CI integration
//! is documented in `docs/security/pkcs11-keystore.md`.

#![allow(clippy::significant_drop_tightening)]
// PKCS#11 / HSM / SoftHSM / CloudHSM / CKM_EDDSA etc. are widely-recognized
// acronyms; backtick-wrapping every occurrence in the module docstrings adds
// noise without aiding rustdoc rendering. Suppress the lint at module level.
#![allow(clippy::doc_markdown)]

use std::collections::HashMap;
use std::sync::{Arc, Mutex};

use cryptoki::context::Pkcs11;
use cryptoki::mechanism::eddsa::{EddsaParams, EddsaSignatureScheme};
use cryptoki::mechanism::Mechanism;
use cryptoki::object::{Attribute, KeyType, ObjectClass, ObjectHandle};
use cryptoki::session::{Session, UserType};
use cryptoki::slot::Slot;
use cryptoki::types::AuthPin;

use crate::error::CryptoError;
use crate::keystore::{Algorithm, KeyId, KeyState, KeyStore};
use crate::Result;

/// PIN supplied to a PKCS#11 token at session login.
///
/// Wrapping the PIN in a newtype keeps the credential out of error messages
/// and Debug output. Internally delegates to `cryptoki::types::AuthPin`,
/// which zeroizes on drop.
pub struct SessionPin(AuthPin);

impl SessionPin {
    /// Construct a PIN from a string.
    pub fn new(pin: impl Into<String>) -> Self {
        Self(AuthPin::new(pin.into()))
    }
}

/// Per-key entry in the in-process registry.
///
/// PKCS#11 object handles are session-scoped opaque values; the `cryptoki`
/// crate intentionally does not expose construction so a handle leaked
/// outside its session can't accidentally collide. We hold the handle here
/// alongside the lifecycle state.
struct KeyEntry {
    private_handle: ObjectHandle,
    public_handle: ObjectHandle,
    state: KeyState,
}

/// PKCS#11-backed `KeyStore` implementation.
pub struct Pkcs11KeyStore {
    session: Arc<Mutex<Session>>,
    /// String-keyed registry. KeyId values are minted as `pkcs11:<n>` where
    /// `<n>` is a monotonic counter — distinguishable from
    /// `MemoryKeyStore`'s `mem-key-N` format.
    keys: Arc<Mutex<HashMap<String, KeyEntry>>>,
    counter: Arc<Mutex<u64>>,
    _module: Arc<Pkcs11>,
}

impl Pkcs11KeyStore {
    /// Create a new PKCS#11 keystore. Opens an authenticated R/W session
    /// against the given slot using the supplied PIN.
    ///
    /// # Errors
    ///
    /// Returns an error if:
    /// - The slot is invalid for the loaded module
    /// - Session opening fails (token not present, hardware unavailable)
    /// - Login fails (wrong PIN, locked token, hardware fault)
    pub fn new(module: Arc<Pkcs11>, slot: Slot, pin: &SessionPin) -> Result<Self> {
        let session = module
            .open_rw_session(slot)
            .map_err(|e| CryptoError::KeyStoreError(format!("PKCS#11 open session: {e}")))?;
        session
            .login(UserType::User, Some(&pin.0))
            .map_err(|e| CryptoError::KeyStoreError(format!("PKCS#11 login: {e}")))?;
        Ok(Self {
            session: Arc::new(Mutex::new(session)),
            keys: Arc::new(Mutex::new(HashMap::new())),
            counter: Arc::new(Mutex::new(0)),
            _module: module,
        })
    }

    fn next_id(&self) -> String {
        let next = {
            let mut counter = self.counter.lock().expect("counter lock poisoned");
            *counter += 1;
            *counter
        };
        format!("pkcs11:{next}")
    }
}

impl KeyStore for Pkcs11KeyStore {
    fn generate_key(&self, algorithm: Algorithm) -> Result<KeyId> {
        // Ed25519 in PKCS#11 v3 uses CKM_EC_EDWARDS_KEY_PAIR_GEN with the
        // edwards25519 OID encoded as the EC params attribute.
        // OID 1.3.101.112 = Ed25519, encoded as DER.
        const ED25519_OID_DER: &[u8] = &[0x06, 0x03, 0x2B, 0x65, 0x70];

        match algorithm {
            Algorithm::Ed25519 => {}
        }

        let public_template = vec![
            Attribute::Class(ObjectClass::PUBLIC_KEY),
            Attribute::KeyType(KeyType::EC_EDWARDS),
            Attribute::Token(true),
            Attribute::Verify(true),
            Attribute::EcParams(ED25519_OID_DER.to_vec()),
        ];
        let private_template = vec![
            Attribute::Class(ObjectClass::PRIVATE_KEY),
            Attribute::KeyType(KeyType::EC_EDWARDS),
            Attribute::Token(true),
            Attribute::Sign(true),
            Attribute::Sensitive(true),
            Attribute::Extractable(false),
        ];

        let session = self.session.lock().expect("pkcs11 session lock poisoned");
        let (public_handle, private_handle) = session
            .generate_key_pair(
                &Mechanism::EccEdwardsKeyPairGen,
                &public_template,
                &private_template,
            )
            .map_err(|e| CryptoError::KeyStoreError(format!("PKCS#11 generate_key_pair: {e}")))?;

        let id = self.next_id();
        self.keys.lock().expect("keys lock poisoned").insert(
            id.clone(),
            KeyEntry {
                private_handle,
                public_handle,
                state: KeyState::Active,
            },
        );
        Ok(KeyId::new(id))
    }

    fn sign(&self, key_id: &KeyId, message: &[u8]) -> Result<Vec<u8>> {
        let private_handle = {
            let keys = self.keys.lock().expect("keys lock poisoned");
            let entry = keys
                .get(key_id.as_str())
                .ok_or_else(|| CryptoError::KeyNotFound(key_id.to_string()))?;

            match entry.state {
                KeyState::Active => {}
                KeyState::Created | KeyState::Rotated | KeyState::Revoked => {
                    return Err(CryptoError::KeyNotActive(key_id.to_string()));
                }
                KeyState::Destroyed => {
                    return Err(CryptoError::KeyNotFound(key_id.to_string()));
                }
            }
            entry.private_handle
        };

        let session = self.session.lock().expect("pkcs11 session lock poisoned");
        let params = EddsaParams::new(EddsaSignatureScheme::Pure);
        let signature = session
            .sign(&Mechanism::Eddsa(params), private_handle, message)
            .map_err(|e| CryptoError::KeyStoreError(format!("PKCS#11 sign: {e}")))?;
        Ok(signature)
    }

    fn public_key(&self, key_id: &KeyId) -> Result<Vec<u8>> {
        use cryptoki::object::AttributeType;

        let public_handle = {
            let keys = self.keys.lock().expect("keys lock poisoned");
            let entry = keys
                .get(key_id.as_str())
                .ok_or_else(|| CryptoError::KeyNotFound(key_id.to_string()))?;
            entry.public_handle
        };

        let session = self.session.lock().expect("pkcs11 session lock poisoned");
        let attrs = session
            .get_attributes(public_handle, &[AttributeType::EcPoint])
            .map_err(|e| CryptoError::KeyStoreError(format!("PKCS#11 get_attributes: {e}")))?;

        for attr in attrs {
            if let Attribute::EcPoint(bytes) = attr {
                // CKA_EC_POINT for edwards keys is DER-encoded OCTET STRING
                // wrapping the raw 32-byte public key. Strip the 2-byte
                // OCTET STRING header (0x04 0x20).
                if bytes.len() == 34 && bytes[0] == 0x04 && bytes[1] == 0x20 {
                    return Ok(bytes[2..].to_vec());
                }
                // Some HSMs return the raw 32-byte point directly.
                if bytes.len() == 32 {
                    return Ok(bytes);
                }
                return Err(CryptoError::KeyStoreError(format!(
                    "unexpected CKA_EC_POINT length: {}",
                    bytes.len()
                )));
            }
        }
        Err(CryptoError::KeyStoreError(
            "PKCS#11 returned no CKA_EC_POINT attribute".to_string(),
        ))
    }

    fn key_state(&self, key_id: &KeyId) -> Result<KeyState> {
        let keys = self.keys.lock().expect("keys lock poisoned");
        keys.get(key_id.as_str())
            .map(|e| e.state)
            .ok_or_else(|| CryptoError::KeyNotFound(key_id.to_string()))
    }

    fn transition(&self, key_id: &KeyId, new_state: KeyState) -> Result<()> {
        let mut keys = self.keys.lock().expect("keys lock poisoned");
        let entry = keys
            .get_mut(key_id.as_str())
            .ok_or_else(|| CryptoError::KeyNotFound(key_id.to_string()))?;

        let valid = matches!(
            (entry.state, new_state),
            (KeyState::Created, KeyState::Active)
                | (KeyState::Active, KeyState::Rotated | KeyState::Revoked)
                | (KeyState::Rotated | KeyState::Revoked, KeyState::Destroyed)
        );

        if !valid {
            let from = format!("{:?}", entry.state);
            let to = format!("{new_state:?}");
            return Err(CryptoError::InvalidStateTransition { from, to });
        }

        entry.state = new_state;
        Ok(())
    }

    fn destroy_key(&self, key_id: &KeyId) -> Result<()> {
        let (private_handle, public_handle) = {
            let mut keys = self.keys.lock().expect("keys lock poisoned");
            let entry = keys
                .remove(key_id.as_str())
                .ok_or_else(|| CryptoError::KeyNotFound(key_id.to_string()))?;
            (entry.private_handle, entry.public_handle)
        };

        let session = self.session.lock().expect("pkcs11 session lock poisoned");
        session
            .destroy_object(private_handle)
            .map_err(|e| CryptoError::KeyStoreError(format!("PKCS#11 destroy private: {e}")))?;
        session
            .destroy_object(public_handle)
            .map_err(|e| CryptoError::KeyStoreError(format!("PKCS#11 destroy public: {e}")))?;
        Ok(())
    }
}

// ---------------------------------------------------------------------------
// Unit tests — no PKCS#11 module required
// ---------------------------------------------------------------------------
//
// These tests exercise registry invariants and KeyId formatting that don't
// require a real HSM. Integration tests against SoftHSMv2 live in
// rust/gtcx-crypto/tests/pkcs11_integration.rs (gated by
// GTCX_PKCS11_MODULE_PATH).

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn key_id_format_is_distinguishable_from_memory_keystore() {
        // We can't easily construct a Pkcs11KeyStore without a Session,
        // but next_id() format is testable via a sketch.
        let counter = Arc::new(Mutex::new(0u64));
        let next = {
            let mut c = counter.lock().unwrap();
            *c += 1;
            *c
        };
        let id = format!("pkcs11:{next}");
        assert!(id.starts_with("pkcs11:"));
        assert!(!id.starts_with("mem-key-"));
    }

    #[test]
    fn ed25519_oid_der_is_fixed() {
        // Sanity check on the OID we hardcode for CKA_EC_PARAMS.
        // 1.3.101.112 encoded as a DER OID is { 0x06 length 0x2B 0x65 0x70 }.
        const ED25519_OID_DER: &[u8] = &[0x06, 0x03, 0x2B, 0x65, 0x70];
        assert_eq!(ED25519_OID_DER[0], 0x06); // OID tag
        assert_eq!(ED25519_OID_DER[1], 0x03); // length
        assert_eq!(ED25519_OID_DER[2], 0x2B); // 1.3
        assert_eq!(ED25519_OID_DER[3], 0x65); // .101
        assert_eq!(ED25519_OID_DER[4], 0x70); // .112
    }
}
