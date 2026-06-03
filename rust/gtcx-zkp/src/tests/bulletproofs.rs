use crate::bulletproofs::{
    bulletproofs_prove_amount_range, bulletproofs_prove_commodity_range,
    bulletproofs_verify_amount_range, bulletproofs_verify_commodity_range,
};
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

#[test]
fn test_bulletproofs_commodity_range_valid() {
    let bundle =
        bulletproofs_prove_commodity_range(55, 10, 100, [1u8; 32], [2u8; 32], [7u8; 32]).unwrap();
    assert!(bulletproofs_verify_commodity_range(&bundle).unwrap());
}

#[test]
fn test_bulletproofs_commodity_range_outside_bounds_rejected() {
    let err = bulletproofs_prove_commodity_range(5, 10, 100, [1u8; 32], [2u8; 32], [7u8; 32])
        .unwrap_err();
    assert!(matches!(err, ZkpError::InvalidWitness { .. }));
}

#[test]
fn test_bulletproofs_commodity_range_tamper_fails() {
    let bundle =
        bulletproofs_prove_commodity_range(42, 10, 100, [1u8; 32], [2u8; 32], [7u8; 32]).unwrap();
    assert!(bulletproofs_verify_commodity_range(&bundle).unwrap());

    let mut tampered = bundle.clone();
    tampered.commitment[0] ^= 0xFF;
    assert!(matches!(
        bulletproofs_verify_commodity_range(&tampered),
        Ok(false) | Err(_)
    ));
}

#[test]
fn test_bulletproofs_amount_range_boundary_eq_min_passes() {
    let bundle = bulletproofs_prove_amount_range(10, 10, 100, [7u8; 32]).unwrap();
    assert!(bulletproofs_verify_amount_range(&bundle).unwrap());
}

#[test]
fn test_bulletproofs_amount_range_boundary_eq_max_passes() {
    let bundle = bulletproofs_prove_amount_range(100, 10, 100, [7u8; 32]).unwrap();
    assert!(bulletproofs_verify_amount_range(&bundle).unwrap());
}

#[test]
fn test_bulletproofs_commodity_range_boundary_eq_min_passes() {
    let bundle =
        bulletproofs_prove_commodity_range(10, 10, 100, [1u8; 32], [2u8; 32], [7u8; 32]).unwrap();
    assert!(bulletproofs_verify_commodity_range(&bundle).unwrap());
}

#[test]
fn test_bulletproofs_commodity_range_boundary_eq_max_passes() {
    let bundle =
        bulletproofs_prove_commodity_range(100, 10, 100, [1u8; 32], [2u8; 32], [7u8; 32]).unwrap();
    assert!(bulletproofs_verify_commodity_range(&bundle).unwrap());
}

#[test]
fn test_kat_bulletproofs_amount_range_verifies() {
    let kat_path = std::path::Path::new(env!("CARGO_MANIFEST_DIR"))
        .join("../../artifacts/kat/bulletproofs-amount-range.kat.json");
    if !kat_path.exists() {
        return;
    }
    let kat_json: serde_json::Value =
        serde_json::from_str(&std::fs::read_to_string(&kat_path).unwrap()).unwrap();

    assert_eq!(
        kat_json["circuit"].as_str().unwrap(),
        "BulletproofsAmountRange"
    );
    assert!(kat_json["expected_verify"].as_bool().unwrap());

    let commitment =
        hex::decode(kat_json["public_inputs"]["commitment"].as_str().unwrap()).unwrap();
    let proof_low = hex::decode(kat_json["proof_low_bytes"].as_str().unwrap()).unwrap();
    let proof_high = hex::decode(kat_json["proof_high_bytes"].as_str().unwrap()).unwrap();
    let min = kat_json["public_inputs"]["min"].as_u64().unwrap();
    let max = kat_json["public_inputs"]["max"].as_u64().unwrap();

    let bundle = crate::types::BulletproofsRangeProofBundle {
        min,
        max,
        commitment: commitment.try_into().unwrap(),
        proof_low,
        proof_high,
    };

    assert!(
        bulletproofs_verify_amount_range(&bundle).unwrap(),
        "KAT proof must verify"
    );
}

#[test]
fn test_kat_bulletproofs_commodity_range_verifies() {
    let kat_path = std::path::Path::new(env!("CARGO_MANIFEST_DIR"))
        .join("../../artifacts/kat/bulletproofs-commodity-range.kat.json");
    if !kat_path.exists() {
        return;
    }
    let kat_json: serde_json::Value =
        serde_json::from_str(&std::fs::read_to_string(&kat_path).unwrap()).unwrap();

    assert_eq!(
        kat_json["circuit"].as_str().unwrap(),
        "BulletproofsCommodityRange"
    );
    assert!(kat_json["expected_verify"].as_bool().unwrap());

    let pi = &kat_json["public_inputs"];
    let commitment = hex::decode(pi["commitment"].as_str().unwrap()).unwrap();
    let commodity_hash = hex::decode(pi["commodity_hash"].as_str().unwrap()).unwrap();
    let unit_hash = hex::decode(pi["unit_hash"].as_str().unwrap()).unwrap();
    let proof_low = hex::decode(kat_json["proof_low_bytes"].as_str().unwrap()).unwrap();
    let proof_high = hex::decode(kat_json["proof_high_bytes"].as_str().unwrap()).unwrap();
    let min = pi["min"].as_u64().unwrap();
    let max = pi["max"].as_u64().unwrap();

    let bundle = crate::types::BulletproofsCommodityRangeBundle {
        min,
        max,
        commitment: commitment.try_into().unwrap(),
        commodity_hash: commodity_hash.try_into().unwrap(),
        unit_hash: unit_hash.try_into().unwrap(),
        proof_low,
        proof_high,
    };

    assert!(
        bulletproofs_verify_commodity_range(&bundle).unwrap(),
        "KAT proof must verify"
    );
}
