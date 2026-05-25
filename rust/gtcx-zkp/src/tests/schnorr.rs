use crate::error::ZkpError;
use crate::schnorr::{
    schnorr_attribute_hash, schnorr_prove_identity_attribute, schnorr_verify_identity_attribute,
};

#[test]
fn test_schnorr_identity_attribute_valid() {
    let subject_hash = [3u8; 32];
    let bundle = schnorr_prove_identity_attribute(b"citizenship:GTX", subject_hash).unwrap();
    assert!(schnorr_verify_identity_attribute(&bundle).unwrap());
    assert_eq!(
        schnorr_attribute_hash(b"citizenship:GTX").unwrap(),
        bundle.attribute_hash
    );
}

#[test]
fn test_schnorr_identity_attribute_empty_rejected() {
    let err = schnorr_prove_identity_attribute(b"", [0u8; 32]).unwrap_err();
    assert!(matches!(err, ZkpError::InvalidWitness { .. }));
}

#[test]
fn test_schnorr_identity_attribute_tamper_fails() {
    let subject_hash = [9u8; 32];
    let bundle = schnorr_prove_identity_attribute(b"role:validator", subject_hash).unwrap();
    assert!(schnorr_verify_identity_attribute(&bundle).unwrap());

    let mut tampered = bundle.clone();
    tampered.response[0] ^= 0xFF;
    assert!(matches!(
        schnorr_verify_identity_attribute(&tampered),
        Ok(false) | Err(_)
    ));
}
