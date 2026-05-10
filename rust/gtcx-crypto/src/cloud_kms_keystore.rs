//! AWS KMS-backed `KeyStore`.
//!
//! This module wires AWS KMS into the synchronous [`crate::keystore::KeyStore`]
//! trait. Private keys stay inside AWS-managed HSMs; gtcx-core receives only
//! opaque key IDs, signatures, and public keys.
//!
//! ## Compilation
//!
//! Behind `#[cfg(feature = "cloud_kms")]`. Build with:
//!
//! ```bash
//! cargo build -p gtcx-crypto --features cloud_kms
//! cargo test  -p gtcx-crypto --features cloud_kms --lib
//! ```

use std::sync::Arc;

use ::p256::elliptic_curve::sec1::ToEncodedPoint;
use ::p256::pkcs8::DecodePublicKey;
use aws_sdk_kms::primitives::Blob;
use aws_sdk_kms::types::{KeySpec, KeyUsageType, MessageType, SigningAlgorithmSpec};
use aws_sdk_kms::Client;
use tokio::runtime::Handle;

use crate::error::CryptoError;
use crate::keystore::{Algorithm, KeyId, KeyState, KeyStore};
use crate::pkcs11_state::{KeyStateStore, MemoryKeyStateStore};
use crate::signing::p256;
use crate::Result;

const DELETION_WINDOW_DAYS: i32 = 7;
const KMS_SCHEME: &str = "cloud-kms:aws:";

/// AWS KMS configuration for constructing a [`CloudKmsKeyStore`].
pub struct AwsKmsConfig {
    /// Shared AWS SDK config built by the caller.
    pub sdk_config: aws_config::SdkConfig,
    /// Optional region override when the caller wants KMS calls pinned to a
    /// specific AWS region.
    pub region: Option<String>,
    /// Prefix reserved for future AWS KMS tags and audit metadata.
    pub tag_prefix: String,
}

/// AWS KMS-backed `KeyStore` implementation.
pub struct CloudKmsKeyStore {
    client: Client,
    state_store: Arc<dyn KeyStateStore>,
    runtime: Handle,
    _tag_prefix: String,
}

impl CloudKmsKeyStore {
    /// Create a new AWS KMS keystore with default in-memory state tracking.
    ///
    /// # Errors
    ///
    /// Returns an error if no Tokio runtime is active at construction time.
    pub fn new(config: AwsKmsConfig) -> Result<Self> {
        Self::with_state_store(config, Arc::new(MemoryKeyStateStore::new()))
    }

    /// Create a new AWS KMS keystore backed by a caller-supplied state store.
    ///
    /// # Errors
    ///
    /// Returns an error if no Tokio runtime is active at construction time.
    pub fn with_state_store(
        config: AwsKmsConfig,
        state_store: Arc<dyn KeyStateStore>,
    ) -> Result<Self> {
        let runtime = Handle::try_current().map_err(|e| {
            CryptoError::KeyStoreError(format!(
                "Cloud KMS keystore requires an active Tokio runtime: {e}"
            ))
        })?;
        let client = build_client(&config);
        Ok(Self {
            client,
            state_store,
            runtime,
            _tag_prefix: config.tag_prefix,
        })
    }

    fn parse_key_id(key_id: &KeyId) -> Result<String> {
        let Some(encoded) = key_id.as_str().strip_prefix(KMS_SCHEME) else {
            return Err(CryptoError::KeyStoreError(format!(
                "Invalid cloud KMS key ID format: {key_id}"
            )));
        };
        let mut parts = encoded.splitn(4, ':');
        let region = parts.next().ok_or_else(|| {
            CryptoError::KeyStoreError(format!("Invalid cloud KMS key ID format: {key_id}"))
        })?;
        let account = parts.next().ok_or_else(|| {
            CryptoError::KeyStoreError(format!("Invalid cloud KMS key ID format: {key_id}"))
        })?;
        let resource_type = parts.next().ok_or_else(|| {
            CryptoError::KeyStoreError(format!("Invalid cloud KMS key ID format: {key_id}"))
        })?;
        let resource_id = parts.next().ok_or_else(|| {
            CryptoError::KeyStoreError(format!("Invalid cloud KMS key ID format: {key_id}"))
        })?;
        Ok(format!(
            "arn:aws:kms:{region}:{account}:{resource_type}/{resource_id}"
        ))
    }

    fn key_id_from_arn(arn: &str) -> Result<KeyId> {
        let without_prefix = arn.strip_prefix("arn:aws:kms:").ok_or_else(|| {
            CryptoError::KeyStoreError(format!("Invalid AWS KMS ARN format: {arn}"))
        })?;
        let mut parts = without_prefix.splitn(3, ':');
        let region = parts.next().ok_or_else(|| {
            CryptoError::KeyStoreError(format!("Invalid AWS KMS ARN format: {arn}"))
        })?;
        let account = parts.next().ok_or_else(|| {
            CryptoError::KeyStoreError(format!("Invalid AWS KMS ARN format: {arn}"))
        })?;
        let resource = parts.next().ok_or_else(|| {
            CryptoError::KeyStoreError(format!("Invalid AWS KMS ARN format: {arn}"))
        })?;
        let encoded_resource = resource.replacen('/', ":", 1);
        Ok(KeyId::new(format!(
            "{KMS_SCHEME}{region}:{account}:{encoded_resource}"
        )))
    }

    fn validate_state_transition(current: KeyState, new_state: KeyState) -> bool {
        matches!(
            (current, new_state),
            (KeyState::Created, KeyState::Active)
                | (KeyState::Active, KeyState::Rotated | KeyState::Revoked)
                | (KeyState::Rotated | KeyState::Revoked, KeyState::Destroyed)
        )
    }
}

impl KeyStore for CloudKmsKeyStore {
    fn generate_key(&self, algorithm: Algorithm) -> Result<KeyId> {
        match algorithm {
            Algorithm::Ed25519 => {
                return Err(CryptoError::KeyStoreError(
                    "AWS KMS does not support Algorithm::Ed25519; use Algorithm::EcdsaP256"
                        .to_string(),
                ));
            }
            Algorithm::EcdsaP256 => {}
        }

        let response = self
            .runtime
            .block_on(async {
                self.client
                    .create_key()
                    .key_spec(KeySpec::EccNistP256)
                    .key_usage(KeyUsageType::SignVerify)
                    .description("gtcx-core cloud KMS signing key")
                    .send()
                    .await
            })
            .map_err(|e| CryptoError::KeyStoreError(format!("AWS KMS CreateKey: {e}")))?;

        let arn = response
            .key_metadata()
            .and_then(|metadata| metadata.arn())
            .ok_or_else(|| {
                CryptoError::KeyStoreError("AWS KMS CreateKey returned no ARN".to_string())
            })?;
        let key_id = Self::key_id_from_arn(arn)?;
        self.state_store.set(key_id.as_str(), KeyState::Active)?;
        Ok(key_id)
    }

    fn sign(&self, key_id: &KeyId, message: &[u8]) -> Result<Vec<u8>> {
        match self.state_store.get(key_id.as_str()) {
            None => return Err(CryptoError::KeyNotFound(key_id.to_string())),
            Some(KeyState::Active) => {}
            Some(KeyState::Created | KeyState::Rotated | KeyState::Revoked) => {
                return Err(CryptoError::KeyNotActive(key_id.to_string()));
            }
            Some(KeyState::Destroyed) => return Err(CryptoError::KeyNotFound(key_id.to_string())),
        }

        let kms_key_id = Self::parse_key_id(key_id)?;
        let response = self
            .runtime
            .block_on(async {
                self.client
                    .sign()
                    .key_id(kms_key_id)
                    .message(Blob::new(message))
                    .message_type(MessageType::Raw)
                    .signing_algorithm(SigningAlgorithmSpec::EcdsaSha256)
                    .send()
                    .await
            })
            .map_err(|e| CryptoError::KeyStoreError(format!("AWS KMS Sign: {e}")))?;

        let signature = response.signature().ok_or_else(|| {
            CryptoError::KeyStoreError("AWS KMS Sign returned no signature".to_string())
        })?;
        Ok(p256::Signature::from_der(signature.as_ref())?
            .as_bytes()
            .to_vec())
    }

    fn public_key(&self, key_id: &KeyId) -> Result<Vec<u8>> {
        if matches!(
            self.state_store.get(key_id.as_str()),
            Some(KeyState::Destroyed) | None
        ) {
            return Err(CryptoError::KeyNotFound(key_id.to_string()));
        }

        let kms_key_id = Self::parse_key_id(key_id)?;
        let response = self
            .runtime
            .block_on(async { self.client.get_public_key().key_id(kms_key_id).send().await })
            .map_err(|e| CryptoError::KeyStoreError(format!("AWS KMS GetPublicKey: {e}")))?;

        let public_key = response.public_key().ok_or_else(|| {
            CryptoError::KeyStoreError("AWS KMS GetPublicKey returned no public key".to_string())
        })?;
        let parsed = ::p256::PublicKey::from_public_key_der(public_key.as_ref()).map_err(|e| {
            CryptoError::KeyStoreError(format!("AWS KMS GetPublicKey returned invalid SPKI: {e}"))
        })?;
        Ok(parsed.to_encoded_point(true).as_bytes().to_vec())
    }

    fn key_state(&self, key_id: &KeyId) -> Result<KeyState> {
        self.state_store
            .get(key_id.as_str())
            .ok_or_else(|| CryptoError::KeyNotFound(key_id.to_string()))
    }

    fn transition(&self, key_id: &KeyId, new_state: KeyState) -> Result<()> {
        let current = self
            .state_store
            .get(key_id.as_str())
            .ok_or_else(|| CryptoError::KeyNotFound(key_id.to_string()))?;
        if !Self::validate_state_transition(current, new_state) {
            return Err(CryptoError::InvalidStateTransition {
                from: format!("{current:?}"),
                to: format!("{new_state:?}"),
            });
        }

        let kms_key_id = Self::parse_key_id(key_id)?;
        match new_state {
            KeyState::Created | KeyState::Destroyed => {}
            KeyState::Active => {
                self.runtime
                    .block_on(async { self.client.enable_key().key_id(kms_key_id).send().await })
                    .map_err(|e| CryptoError::KeyStoreError(format!("AWS KMS EnableKey: {e}")))?;
            }
            KeyState::Rotated | KeyState::Revoked => {
                self.runtime
                    .block_on(async { self.client.disable_key().key_id(kms_key_id).send().await })
                    .map_err(|e| CryptoError::KeyStoreError(format!("AWS KMS DisableKey: {e}")))?;
            }
        }

        self.state_store.set(key_id.as_str(), new_state)
    }

    fn destroy_key(&self, key_id: &KeyId) -> Result<()> {
        let kms_key_id = Self::parse_key_id(key_id)?;
        self.runtime
            .block_on(async {
                self.client
                    .schedule_key_deletion()
                    .key_id(kms_key_id)
                    .pending_window_in_days(DELETION_WINDOW_DAYS)
                    .send()
                    .await
            })
            .map_err(|e| CryptoError::KeyStoreError(format!("AWS KMS ScheduleKeyDeletion: {e}")))?;
        self.state_store.remove(key_id.as_str())
    }
}

fn build_client(config: &AwsKmsConfig) -> Client {
    match &config.region {
        Some(region) => {
            let aws_config = aws_sdk_kms::config::Builder::from(&config.sdk_config)
                .region(aws_sdk_kms::config::Region::new(region.clone()))
                .build();
            Client::from_conf(aws_config)
        }
        None => Client::new(&config.sdk_config),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn key_id_roundtrip_preserves_arn_shape() {
        let arn = "arn:aws:kms:us-east-1:123456789012:key/1234abcd-12ab-34cd-56ef-1234567890ab";
        let key_id = CloudKmsKeyStore::key_id_from_arn(arn).unwrap();
        assert_eq!(
            key_id.as_str(),
            "cloud-kms:aws:us-east-1:123456789012:key:1234abcd-12ab-34cd-56ef-1234567890ab"
        );
        assert_eq!(CloudKmsKeyStore::parse_key_id(&key_id).unwrap(), arn);
    }

    #[test]
    fn invalid_key_id_is_rejected() {
        let key_id = KeyId::new("mem-key-1");
        assert!(CloudKmsKeyStore::parse_key_id(&key_id).is_err());
    }

    #[test]
    fn transition_matrix_matches_memory_keystore() {
        assert!(CloudKmsKeyStore::validate_state_transition(
            KeyState::Active,
            KeyState::Rotated
        ));
        assert!(CloudKmsKeyStore::validate_state_transition(
            KeyState::Rotated,
            KeyState::Destroyed
        ));
        assert!(!CloudKmsKeyStore::validate_state_transition(
            KeyState::Active,
            KeyState::Destroyed
        ));
    }
}
