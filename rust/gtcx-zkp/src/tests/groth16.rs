use crate::error::ZkpError;
use crate::groth16::{
    groth16_generate_keys, groth16_prove_gci_threshold, groth16_verify, sample_asset_ownership,
    sample_commodity_origin, sample_diamond_origin, sample_location_region, AssetOwnershipCircuit,
    CommodityOriginCircuit, LocationRegionCircuit,
};
use crate::types::{Groth16CircuitType, DIGEST_BYTES};
use ark_bn254::Fr;
use ark_relations::r1cs::{ConstraintSynthesizer, ConstraintSystem};

#[test]
fn test_groth16_gci_threshold_proof_valid() {
    let keys = groth16_generate_keys(Groth16CircuitType::GciThreshold).unwrap();
    let proof = groth16_prove_gci_threshold(92, 80, &keys).unwrap();
    assert!(groth16_verify(&proof).unwrap());
}

#[test]
fn test_groth16_gci_threshold_invalid_score() {
    let keys = groth16_generate_keys(Groth16CircuitType::GciThreshold).unwrap();
    let err = groth16_prove_gci_threshold(10, 80, &keys).unwrap_err();
    assert!(matches!(err, ZkpError::InvalidWitness { .. }));
}

#[test]
fn test_groth16_gci_threshold_tampered_public_inputs_fail() {
    let keys = groth16_generate_keys(Groth16CircuitType::GciThreshold).unwrap();
    let mut proof = groth16_prove_gci_threshold(95, 80, &keys).unwrap();
    proof.public_inputs[0] = Fr::from(1u64);
    assert!(!groth16_verify(&proof).unwrap());
}

#[test]
fn test_asset_ownership_constraints_satisfied() {
    let sample = sample_asset_ownership().unwrap();
    let circuit = AssetOwnershipCircuit {
        asset_id: Some(sample.asset_id),
        asset_commitment: Some(sample.asset_commitment),
        owner_hash: Some(sample.owner_hash),
        randomness: Some(sample.randomness),
        ownership_root: Some(sample.ownership_root),
        merkle_path: Some(sample.merkle_path),
    };
    let cs = ConstraintSystem::<Fr>::new_ref();
    circuit.generate_constraints(cs.clone()).unwrap();
    if !cs.is_satisfied().unwrap() {
        let unsatisfied = cs.which_is_unsatisfied().unwrap();
        panic!("constraints unsatisfied: {unsatisfied:?}");
    }
}

#[test]
fn test_location_region_constraints_satisfied() {
    let sample = sample_location_region().unwrap();
    let circuit = LocationRegionCircuit {
        lat: Some(sample.lat),
        lon: Some(sample.lon),
        timestamp: Some(sample.timestamp),
        randomness: Some(sample.randomness),
        bounds: Some(sample.bounds),
        region_hash: Some(sample.region_hash),
        location_commitment: Some(sample.location_commitment),
    };
    let cs = ConstraintSystem::<Fr>::new_ref();
    circuit.generate_constraints(cs.clone()).unwrap();
    if !cs.is_satisfied().unwrap() {
        let unsatisfied = cs.which_is_unsatisfied().unwrap();
        panic!("constraints unsatisfied: {unsatisfied:?}");
    }
}

#[test]
fn test_commodity_origin_constraints_satisfied() {
    let sample = sample_commodity_origin().unwrap();
    let circuit = CommodityOriginCircuit {
        commodity_type: Some(sample.commodity_type),
        mine_id: Some(sample.mine_id),
        lat: Some(sample.lat),
        lon: Some(sample.lon),
        primary_metric: Some(sample.primary_metric),
        secondary_metric: Some(sample.secondary_metric),
        primary_randomness: Some(sample.primary_randomness),
        secondary_randomness: Some(sample.secondary_randomness),
        location_randomness: Some(sample.location_randomness),
        bounds: Some(sample.bounds),
        min_primary: Some(sample.min_primary),
        min_secondary: Some(sample.min_secondary),
        certification_flags: Some(sample.certification_flags),
        region_hash: Some(sample.region_hash),
        primary_commitment: Some(sample.primary_commitment),
        secondary_commitment: Some(sample.secondary_commitment),
        mines_root: Some(sample.mines_root),
        merkle_path: Some(sample.merkle_path),
    };
    let cs = ConstraintSystem::<Fr>::new_ref();
    circuit.generate_constraints(cs.clone()).unwrap();
    if !cs.is_satisfied().unwrap() {
        let unsatisfied = cs.which_is_unsatisfied().unwrap();
        panic!("constraints unsatisfied: {unsatisfied:?}");
    }
}

#[test]
#[ignore = "Groth16 proof generation is heavy; run explicitly for UAT evidence"]
fn test_groth16_commodity_origin_proof_and_tamper() {
    use crate::groth16::groth16_prove_commodity_origin;

    let keys = groth16_generate_keys(Groth16CircuitType::CommodityOrigin).unwrap();
    let sample = sample_commodity_origin().unwrap();
    let (mut proof, _inputs) = groth16_prove_commodity_origin(
        sample.commodity_type,
        sample.mine_id,
        sample.lat,
        sample.lon,
        sample.primary_metric,
        sample.secondary_metric,
        sample.primary_randomness,
        sample.secondary_randomness,
        sample.location_randomness,
        sample.bounds,
        sample.min_primary,
        sample.min_secondary,
        sample.certification_flags,
        sample.merkle_path,
        &keys,
    )
    .unwrap();
    assert!(groth16_verify(&proof).unwrap());

    // Tamper with public inputs
    proof.public_inputs[0] = Fr::from(1u64);
    assert!(!groth16_verify(&proof).unwrap());
}

#[test]
#[ignore = "Groth16 proof generation is heavy; run explicitly for UAT evidence"]
fn test_groth16_asset_ownership_proof_and_tamper() {
    use crate::groth16::groth16_prove_asset_ownership;

    let keys = groth16_generate_keys(Groth16CircuitType::AssetOwnership).unwrap();
    let sample = sample_asset_ownership().unwrap();
    let (mut proof, inputs) = groth16_prove_asset_ownership(
        sample.asset_id,
        sample.owner_hash,
        sample.randomness,
        sample.ownership_root,
        sample.merkle_path,
        &keys,
    )
    .unwrap();
    assert_eq!(inputs.ownership_root, sample.ownership_root);
    assert!(groth16_verify(&proof).unwrap());

    let root_start = DIGEST_BYTES * 8 * 2; // after commitment + owner hash
    proof.public_inputs[root_start] = Fr::from(1u64) - proof.public_inputs[root_start];
    assert!(!groth16_verify(&proof).unwrap());
}

#[test]
#[ignore = "Groth16 proof generation is heavy; run explicitly for UAT evidence"]
fn test_groth16_location_region_proof_and_tamper() {
    use crate::groth16::groth16_prove_location_region;

    let keys = groth16_generate_keys(Groth16CircuitType::LocationRegion).unwrap();
    let sample = sample_location_region().unwrap();
    let (mut proof, inputs) = groth16_prove_location_region(
        sample.lat,
        sample.lon,
        sample.timestamp,
        sample.randomness,
        sample.bounds,
        &keys,
    )
    .unwrap();
    assert_eq!(inputs.region_hash, sample.region_hash);
    assert!(groth16_verify(&proof).unwrap());

    proof.public_inputs[0] = Fr::from(1u64) - proof.public_inputs[0];
    assert!(!groth16_verify(&proof).unwrap());
}

#[test]
fn test_diamond_origin_constraints_satisfied() {
    // Diamond origin is now just commodity origin with commodity_type = 1
    let sample = sample_diamond_origin().unwrap();
    let circuit = CommodityOriginCircuit {
        commodity_type: Some(sample.commodity_type),
        mine_id: Some(sample.mine_id),
        lat: Some(sample.lat),
        lon: Some(sample.lon),
        primary_metric: Some(sample.primary_metric),
        secondary_metric: Some(sample.secondary_metric),
        primary_randomness: Some(sample.primary_randomness),
        secondary_randomness: Some(sample.secondary_randomness),
        location_randomness: Some(sample.location_randomness),
        bounds: Some(sample.bounds),
        min_primary: Some(sample.min_primary),
        min_secondary: Some(sample.min_secondary),
        certification_flags: Some(sample.certification_flags),
        region_hash: Some(sample.region_hash),
        primary_commitment: Some(sample.primary_commitment),
        secondary_commitment: Some(sample.secondary_commitment),
        mines_root: Some(sample.mines_root),
        merkle_path: Some(sample.merkle_path),
    };
    let cs = ConstraintSystem::<Fr>::new_ref();
    circuit.generate_constraints(cs.clone()).unwrap();
    if !cs.is_satisfied().unwrap() {
        let unsatisfied = cs.which_is_unsatisfied().unwrap();
        panic!("constraints unsatisfied: {unsatisfied:?}");
    }
}

#[test]
#[ignore = "Groth16 proof generation is heavy; run explicitly for UAT evidence"]
fn test_groth16_diamond_origin_proof_and_tamper() {
    use crate::groth16::groth16_prove_commodity_origin;

    // Diamond origin uses the same CommodityOrigin circuit with commodity_type = 1
    let keys = groth16_generate_keys(Groth16CircuitType::CommodityOrigin).unwrap();
    let sample = sample_diamond_origin().unwrap();
    let (mut proof, _inputs) = groth16_prove_commodity_origin(
        sample.commodity_type,
        sample.mine_id,
        sample.lat,
        sample.lon,
        sample.primary_metric,
        sample.secondary_metric,
        sample.primary_randomness,
        sample.secondary_randomness,
        sample.location_randomness,
        sample.bounds,
        sample.min_primary,
        sample.min_secondary,
        sample.certification_flags,
        sample.merkle_path,
        &keys,
    )
    .unwrap();
    assert!(groth16_verify(&proof).unwrap());

    // Tamper with public inputs
    proof.public_inputs[0] = Fr::from(1u64);
    assert!(!groth16_verify(&proof).unwrap());
}
