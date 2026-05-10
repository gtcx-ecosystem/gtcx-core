#![cfg(feature = "cloud_kms")]

use gtcx_crypto::cloud_kms_keystore::{AwsKmsConfig, CloudKmsKeyStore};
use gtcx_crypto::keystore::{Algorithm, KeyStore};
use gtcx_crypto::p256;

#[test]
fn aws_kms_roundtrip_skips_without_env() {
    if std::env::var("GTCX_AWS_KMS_INTEGRATION").ok().as_deref() != Some("1") {
        return;
    }

    let runtime = tokio::runtime::Runtime::new().unwrap();
    let store = runtime.block_on(async {
        let sdk_config = aws_config::load_defaults(aws_config::BehaviorVersion::latest()).await;
        CloudKmsKeyStore::new(AwsKmsConfig {
            sdk_config,
            region: std::env::var("AWS_REGION").ok(),
            tag_prefix: "gtcx-".to_string(),
        })
    });
    let store = store.unwrap();

    let key_id = store.generate_key(Algorithm::EcdsaP256).unwrap();
    let signature = store.sign(&key_id, b"gtcx-cloud-kms").unwrap();
    let public_key = store.public_key(&key_id).unwrap();

    let parsed_public_key = p256::PublicKey::from_bytes(&public_key).unwrap();
    let parsed_signature = p256::Signature::from_bytes(&signature).unwrap();
    assert!(p256::verify(
        &parsed_signature,
        b"gtcx-cloud-kms",
        &parsed_public_key,
    ));

    store.destroy_key(&key_id).unwrap();
}
