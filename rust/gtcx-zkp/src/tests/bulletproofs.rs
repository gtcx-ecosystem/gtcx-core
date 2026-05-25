use crate::bulletproofs::{bulletproofs_prove_amount_range, bulletproofs_verify_amount_range};
use crate::error::ZkpError;

#[test]
fn test_bulletproofs_amount_range_valid() {
    let bundle = bulletproofs_prove_amount_range(55, 10, 100, [7u8; 32]).unwrap();
    assert!(bulletproofs_verify_amount_range(&bundle).unwrap());
}

#[test]
fn test_bulletproofs_amount_range_outside_bounds_rejected() {
    let err = bulletproofs_prove_amount_range(5, 10, 100, [7u8; 32]).unwrap_err();
    assert!(matches!(err, ZkpError::InvalidWitness { .. }));
}

#[test]
fn test_bulletproofs_amount_range_tamper_fails() {
    let bundle = bulletproofs_prove_amount_range(42, 10, 100, [7u8; 32]).unwrap();
    assert!(bulletproofs_verify_amount_range(&bundle).unwrap());

    let mut tampered = bundle.clone();
    tampered.commitment[0] ^= 0xFF;
    assert!(matches!(
        bulletproofs_verify_amount_range(&tampered),
        Ok(false) | Err(_)
    ));
}
