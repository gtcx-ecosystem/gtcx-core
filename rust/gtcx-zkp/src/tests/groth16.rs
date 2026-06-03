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
fn test_groth16_gci_threshold_boundary_score_eq_threshold_passes() {
    let keys = groth16_generate_keys(Groth16CircuitType::GciThreshold).unwrap();
    let proof = groth16_prove_gci_threshold(80, 80, &keys).unwrap();
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
fn test_asset_ownership_wrong_commitment_fails() {
    let sample = sample_asset_ownership().unwrap();
    let mut wrong_commitment = sample.asset_commitment;
    wrong_commitment[0] ^= 0xFF;
    let circuit = AssetOwnershipCircuit {
        asset_id: Some(sample.asset_id),
        asset_commitment: Some(wrong_commitment),
        owner_hash: Some(sample.owner_hash),
        randomness: Some(sample.randomness),
        ownership_root: Some(sample.ownership_root),
        merkle_path: Some(sample.merkle_path),
    };
    let cs = ConstraintSystem::<Fr>::new_ref();
    circuit.generate_constraints(cs.clone()).unwrap();
    assert!(
        !cs.is_satisfied().unwrap(),
        "expected constraints to fail with wrong asset commitment"
    );
}

#[test]
fn test_asset_ownership_wrong_asset_id_fails() {
    let sample = sample_asset_ownership().unwrap();
    let wrong_asset_id = [99u8; 32];
    let circuit = AssetOwnershipCircuit {
        asset_id: Some(wrong_asset_id),
        asset_commitment: Some(sample.asset_commitment),
        owner_hash: Some(sample.owner_hash),
        randomness: Some(sample.randomness),
        ownership_root: Some(sample.ownership_root),
        merkle_path: Some(sample.merkle_path),
    };
    let cs = ConstraintSystem::<Fr>::new_ref();
    circuit.generate_constraints(cs.clone()).unwrap();
    assert!(
        !cs.is_satisfied().unwrap(),
        "expected constraints to fail with wrong asset_id (Merkle path invalid)"
    );
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
fn test_location_region_lat_below_min_fails() {
    let sample = sample_location_region().unwrap();
    let circuit = LocationRegionCircuit {
        lat: Some(5u64), // below min_lat = 10
        lon: Some(sample.lon),
        timestamp: Some(sample.timestamp),
        randomness: Some(sample.randomness),
        bounds: Some(sample.bounds),
        region_hash: Some(sample.region_hash),
        location_commitment: Some(sample.location_commitment),
    };
    let cs = ConstraintSystem::<Fr>::new_ref();
    circuit.generate_constraints(cs.clone()).unwrap();
    assert!(
        !cs.is_satisfied().unwrap(),
        "expected constraints to fail when lat < min_lat"
    );
}

#[test]
fn test_location_region_lon_above_max_fails() {
    let sample = sample_location_region().unwrap();
    let circuit = LocationRegionCircuit {
        lat: Some(sample.lat),
        lon: Some(45u64), // above max_lon = 40
        timestamp: Some(sample.timestamp),
        randomness: Some(sample.randomness),
        bounds: Some(sample.bounds),
        region_hash: Some(sample.region_hash),
        location_commitment: Some(sample.location_commitment),
    };
    let cs = ConstraintSystem::<Fr>::new_ref();
    circuit.generate_constraints(cs.clone()).unwrap();
    assert!(
        !cs.is_satisfied().unwrap(),
        "expected constraints to fail when lon > max_lon"
    );
}

#[test]
fn test_location_region_wrong_region_hash_fails() {
    let sample = sample_location_region().unwrap();
    let mut wrong_hash = sample.region_hash;
    wrong_hash[0] ^= 0xFF;
    let circuit = LocationRegionCircuit {
        lat: Some(sample.lat),
        lon: Some(sample.lon),
        timestamp: Some(sample.timestamp),
        randomness: Some(sample.randomness),
        bounds: Some(sample.bounds),
        region_hash: Some(wrong_hash),
        location_commitment: Some(sample.location_commitment),
    };
    let cs = ConstraintSystem::<Fr>::new_ref();
    circuit.generate_constraints(cs.clone()).unwrap();
    assert!(
        !cs.is_satisfied().unwrap(),
        "expected constraints to fail with wrong region_hash"
    );
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
fn test_commodity_origin_gps_lat_below_min_fails() {
    let sample = sample_commodity_origin().unwrap();
    let circuit = CommodityOriginCircuit {
        commodity_type: Some(sample.commodity_type),
        mine_id: Some(sample.mine_id),
        lat: Some(5u64), // below min_lat = 10
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
    assert!(
        !cs.is_satisfied().unwrap(),
        "expected constraints to fail when lat < min_lat"
    );
}

#[test]
fn test_commodity_origin_gps_lat_above_max_fails() {
    let sample = sample_commodity_origin().unwrap();
    let circuit = CommodityOriginCircuit {
        commodity_type: Some(sample.commodity_type),
        mine_id: Some(sample.mine_id),
        lat: Some(25u64), // above max_lat = 20
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
    assert!(
        !cs.is_satisfied().unwrap(),
        "expected constraints to fail when lat > max_lat"
    );
}

#[test]
fn test_commodity_origin_primary_below_min_fails() {
    let sample = sample_commodity_origin().unwrap();
    let circuit = CommodityOriginCircuit {
        commodity_type: Some(sample.commodity_type),
        mine_id: Some(sample.mine_id),
        lat: Some(sample.lat),
        lon: Some(sample.lon),
        primary_metric: Some(900u64), // below min_primary = 950
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
    assert!(
        !cs.is_satisfied().unwrap(),
        "expected constraints to fail when primary_metric < min_primary"
    );
}

#[test]
fn test_commodity_origin_wrong_primary_commitment_fails() {
    let sample = sample_commodity_origin().unwrap();
    let mut wrong_commitment = sample.primary_commitment;
    wrong_commitment[0] ^= 0xFF;
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
        primary_commitment: Some(wrong_commitment),
        secondary_commitment: Some(sample.secondary_commitment),
        mines_root: Some(sample.mines_root),
        merkle_path: Some(sample.merkle_path),
    };
    let cs = ConstraintSystem::<Fr>::new_ref();
    circuit.generate_constraints(cs.clone()).unwrap();
    assert!(
        !cs.is_satisfied().unwrap(),
        "expected constraints to fail with wrong primary commitment"
    );
}

#[test]
fn test_commodity_origin_wrong_region_hash_fails() {
    let sample = sample_commodity_origin().unwrap();
    let mut wrong_hash = sample.region_hash;
    wrong_hash[0] ^= 0xFF;
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
        region_hash: Some(wrong_hash),
        primary_commitment: Some(sample.primary_commitment),
        secondary_commitment: Some(sample.secondary_commitment),
        mines_root: Some(sample.mines_root),
        merkle_path: Some(sample.merkle_path),
    };
    let cs = ConstraintSystem::<Fr>::new_ref();
    circuit.generate_constraints(cs.clone()).unwrap();
    assert!(
        !cs.is_satisfied().unwrap(),
        "expected constraints to fail with wrong region_hash"
    );
}

#[test]
fn test_commodity_origin_boundary_lat_eq_min_passes() {
    let sample = sample_commodity_origin().unwrap();
    let circuit = CommodityOriginCircuit {
        commodity_type: Some(sample.commodity_type),
        mine_id: Some(sample.mine_id),
        lat: Some(10u64), // exactly min_lat
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
    assert!(
        cs.is_satisfied().unwrap(),
        "expected constraints to pass when lat == min_lat"
    );
}

#[test]
fn test_commodity_origin_gps_lon_below_min_fails() {
    let sample = sample_commodity_origin().unwrap();
    let circuit = CommodityOriginCircuit {
        commodity_type: Some(sample.commodity_type),
        mine_id: Some(sample.mine_id),
        lat: Some(sample.lat),
        lon: Some(25u64), // below min_lon = 30
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
    assert!(
        !cs.is_satisfied().unwrap(),
        "expected constraints to fail when lon < min_lon"
    );
}

#[test]
fn test_commodity_origin_gps_lon_above_max_fails() {
    let sample = sample_commodity_origin().unwrap();
    let circuit = CommodityOriginCircuit {
        commodity_type: Some(sample.commodity_type),
        mine_id: Some(sample.mine_id),
        lat: Some(sample.lat),
        lon: Some(45u64), // above max_lon = 40
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
    assert!(
        !cs.is_satisfied().unwrap(),
        "expected constraints to fail when lon > max_lon"
    );
}

#[test]
fn test_commodity_origin_secondary_below_min_fails() {
    let sample = sample_commodity_origin().unwrap();
    let circuit = CommodityOriginCircuit {
        commodity_type: Some(sample.commodity_type),
        mine_id: Some(sample.mine_id),
        lat: Some(sample.lat),
        lon: Some(sample.lon),
        primary_metric: Some(sample.primary_metric),
        secondary_metric: Some(400u64), // below min_secondary = 500
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
    assert!(
        !cs.is_satisfied().unwrap(),
        "expected constraints to fail when secondary_metric < min_secondary"
    );
}

#[test]
fn test_commodity_origin_wrong_secondary_commitment_fails() {
    let sample = sample_commodity_origin().unwrap();
    let mut wrong_commitment = sample.secondary_commitment;
    wrong_commitment[0] ^= 0xFF;
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
        secondary_commitment: Some(wrong_commitment),
        mines_root: Some(sample.mines_root),
        merkle_path: Some(sample.merkle_path),
    };
    let cs = ConstraintSystem::<Fr>::new_ref();
    circuit.generate_constraints(cs.clone()).unwrap();
    assert!(
        !cs.is_satisfied().unwrap(),
        "expected constraints to fail with wrong secondary commitment"
    );
}

#[test]
fn test_commodity_origin_wrong_merkle_path_fails() {
    let sample = sample_commodity_origin().unwrap();
    // Use a different mine_id so the leaf hash doesn't match the path
    let wrong_mine_id = [99u8; 32];
    let circuit = CommodityOriginCircuit {
        commodity_type: Some(sample.commodity_type),
        mine_id: Some(wrong_mine_id),
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
    assert!(
        !cs.is_satisfied().unwrap(),
        "expected constraints to fail with wrong mine_id (Merkle path invalid)"
    );
}

#[test]
fn test_commodity_origin_boundary_lon_eq_min_passes() {
    let sample = sample_commodity_origin().unwrap();
    let circuit = CommodityOriginCircuit {
        commodity_type: Some(sample.commodity_type),
        mine_id: Some(sample.mine_id),
        lat: Some(sample.lat),
        lon: Some(30u64), // exactly min_lon
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
    assert!(
        cs.is_satisfied().unwrap(),
        "expected constraints to pass when lon == min_lon"
    );
}

#[test]
fn test_commodity_origin_boundary_lat_eq_max_passes() {
    let sample = sample_commodity_origin().unwrap();
    let circuit = CommodityOriginCircuit {
        commodity_type: Some(sample.commodity_type),
        mine_id: Some(sample.mine_id),
        lat: Some(20u64), // exactly max_lat
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
    assert!(
        cs.is_satisfied().unwrap(),
        "expected constraints to pass when lat == max_lat"
    );
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
#[ignore = "Groth16 proof generation is heavy; run with --release: cargo test --release -- --ignored test_proof_non_determinism"]
fn test_proof_non_determinism() {
    use std::collections::HashSet;

    let keys = groth16_generate_keys(Groth16CircuitType::GciThreshold).unwrap();
    let mut proofs = HashSet::new();
    for i in 0..100 {
        let proof = groth16_prove_gci_threshold(92, 80, &keys).unwrap();
        assert!(
            proofs.insert(proof.proof.clone()),
            "proof {i} is identical to a previous proof — witness entropy is not non-deterministic"
        );
    }
    assert_eq!(proofs.len(), 100, "all 100 proofs must be distinct");
}

#[test]
fn test_kat_commodity_origin_proof_verifies() {
    use crate::types::{Groth16CircuitType, Groth16ProofBundle};

    let kat_path = std::path::Path::new(env!("CARGO_MANIFEST_DIR"))
        .join("../../artifacts/kat/groth16-commodity-origin.kat.json");
    if !kat_path.exists() {
        return;
    }
    let kat_json: serde_json::Value =
        serde_json::from_str(&std::fs::read_to_string(&kat_path).unwrap()).unwrap();

    assert_eq!(kat_json["circuit"].as_str().unwrap(), "CommodityOrigin");
    assert!(kat_json["expected_verify"].as_bool().unwrap());

    let proof_bytes = hex::decode(kat_json["proof_bytes"].as_str().unwrap()).unwrap();
    let vk_bytes = hex::decode(kat_json["verifying_key_bytes"].as_str().unwrap()).unwrap();

    let public_inputs = {
        let pi = &kat_json["public_inputs"];
        let mut inputs = Vec::new();

        let commodity_type = pi["commodity_type"].as_u64().unwrap();
        inputs.extend((0..64).map(|i| Fr::from((commodity_type >> i) & 1)));

        let region_hash = hex::decode(pi["region_hash"].as_str().unwrap()).unwrap();
        for byte in &region_hash {
            for i in 0..8 {
                inputs.push(Fr::from(u64::from((byte >> i) & 1)));
            }
        }

        let primary_commitment = hex::decode(pi["primary_commitment"].as_str().unwrap()).unwrap();
        for byte in &primary_commitment {
            for i in 0..8 {
                inputs.push(Fr::from(u64::from((byte >> i) & 1)));
            }
        }

        let secondary_commitment =
            hex::decode(pi["secondary_commitment"].as_str().unwrap()).unwrap();
        for byte in &secondary_commitment {
            for i in 0..8 {
                inputs.push(Fr::from(u64::from((byte >> i) & 1)));
            }
        }

        let mines_root = hex::decode(pi["mines_root"].as_str().unwrap()).unwrap();
        for byte in &mines_root {
            for i in 0..8 {
                inputs.push(Fr::from(u64::from((byte >> i) & 1)));
            }
        }

        let min_primary = pi["min_primary"].as_u64().unwrap();
        inputs.extend((0..64).map(|i| Fr::from((min_primary >> i) & 1)));

        let min_secondary = pi["min_secondary"].as_u64().unwrap();
        inputs.extend((0..64).map(|i| Fr::from((min_secondary >> i) & 1)));

        let certification_flags = pi["certification_flags"].as_u64().unwrap();
        inputs.extend((0..64).map(|i| Fr::from((certification_flags >> i) & 1)));

        inputs
    };

    let bundle = Groth16ProofBundle {
        circuit: Groth16CircuitType::CommodityOrigin,
        proof: proof_bytes,
        verifying_key: vk_bytes,
        public_inputs,
    };

    assert!(groth16_verify(&bundle).unwrap(), "KAT proof must verify");
}

#[test]
fn test_kat_gh_gold_origin_profile_proof_verifies() {
    use crate::types::{Groth16CircuitType, Groth16ProofBundle};

    let kat_path = std::path::Path::new(env!("CARGO_MANIFEST_DIR"))
        .join("../../artifacts/kat/groth16-gh-gold-origin.kat.json");
    if !kat_path.exists() {
        return;
    }
    let kat_json: serde_json::Value =
        serde_json::from_str(&std::fs::read_to_string(&kat_path).unwrap()).unwrap();

    assert_eq!(kat_json["circuit"].as_str().unwrap(), "CommodityOrigin");
    assert_eq!(
        kat_json["profile_id"].as_str().unwrap(),
        "gh-gold-origin"
    );
    assert!(kat_json["expected_verify"].as_bool().unwrap());

    let proof_bytes = hex::decode(kat_json["proof_bytes"].as_str().unwrap()).unwrap();
    let vk_bytes = hex::decode(kat_json["verifying_key_bytes"].as_str().unwrap()).unwrap();

    let public_inputs = {
        let pi = &kat_json["public_inputs"];
        let mut inputs = Vec::new();
        let commodity_type = pi["commodity_type"].as_u64().unwrap();
        inputs.extend((0..64).map(|i| Fr::from((commodity_type >> i) & 1)));
        for field in [
            "region_hash",
            "primary_commitment",
            "secondary_commitment",
            "mines_root",
        ] {
            let bytes = hex::decode(pi[field].as_str().unwrap()).unwrap();
            for byte in &bytes {
                for i in 0..8 {
                    inputs.push(Fr::from(u64::from((byte >> i) & 1)));
                }
            }
        }
        for field in ["min_primary", "min_secondary", "certification_flags"] {
            let v = pi[field].as_u64().unwrap();
            inputs.extend((0..64).map(|i| Fr::from((v >> i) & 1)));
        }
        inputs
    };

    let bundle = Groth16ProofBundle {
        circuit: Groth16CircuitType::CommodityOrigin,
        proof: proof_bytes,
        verifying_key: vk_bytes,
        public_inputs,
    };

    assert!(groth16_verify(&bundle).unwrap(), "gh-gold-origin KAT must verify");
}

#[test]
fn test_kat_gci_threshold_proof_verifies() {
    use crate::types::{Groth16CircuitType, Groth16ProofBundle};

    let kat_path = std::path::Path::new(env!("CARGO_MANIFEST_DIR"))
        .join("../../artifacts/kat/groth16-gci-threshold.kat.json");
    if !kat_path.exists() {
        return;
    }
    let kat_json: serde_json::Value =
        serde_json::from_str(&std::fs::read_to_string(&kat_path).unwrap()).unwrap();

    assert_eq!(kat_json["circuit"].as_str().unwrap(), "GciThreshold");
    assert!(kat_json["expected_verify"].as_bool().unwrap());

    let proof_bytes = hex::decode(kat_json["proof_bytes"].as_str().unwrap()).unwrap();
    let vk_bytes = hex::decode(kat_json["verifying_key_bytes"].as_str().unwrap()).unwrap();

    let pi = &kat_json["public_inputs"];
    let threshold = pi["threshold"].as_u64().unwrap();
    let mut public_inputs = Vec::new();
    public_inputs.extend((0..64).map(|i| Fr::from((threshold >> i) & 1)));

    let bundle = Groth16ProofBundle {
        circuit: Groth16CircuitType::GciThreshold,
        proof: proof_bytes,
        verifying_key: vk_bytes,
        public_inputs,
    };

    assert!(groth16_verify(&bundle).unwrap(), "KAT proof must verify");
}

#[test]
fn test_kat_asset_ownership_proof_verifies() {
    use crate::types::{Groth16CircuitType, Groth16ProofBundle};

    let kat_path = std::path::Path::new(env!("CARGO_MANIFEST_DIR"))
        .join("../../artifacts/kat/groth16-asset-ownership.kat.json");
    if !kat_path.exists() {
        return;
    }
    let kat_json: serde_json::Value =
        serde_json::from_str(&std::fs::read_to_string(&kat_path).unwrap()).unwrap();

    assert_eq!(kat_json["circuit"].as_str().unwrap(), "AssetOwnership");
    assert!(kat_json["expected_verify"].as_bool().unwrap());

    let proof_bytes = hex::decode(kat_json["proof_bytes"].as_str().unwrap()).unwrap();
    let vk_bytes = hex::decode(kat_json["verifying_key_bytes"].as_str().unwrap()).unwrap();

    let pi = &kat_json["public_inputs"];
    let mut public_inputs = Vec::new();

    let asset_commitment = hex::decode(pi["asset_commitment"].as_str().unwrap()).unwrap();
    for byte in &asset_commitment {
        for i in 0..8 {
            public_inputs.push(Fr::from(u64::from((byte >> i) & 1)));
        }
    }

    let owner_hash = hex::decode(pi["owner_hash"].as_str().unwrap()).unwrap();
    for byte in &owner_hash {
        for i in 0..8 {
            public_inputs.push(Fr::from(u64::from((byte >> i) & 1)));
        }
    }

    let ownership_root = hex::decode(pi["ownership_root"].as_str().unwrap()).unwrap();
    for byte in &ownership_root {
        for i in 0..8 {
            public_inputs.push(Fr::from(u64::from((byte >> i) & 1)));
        }
    }

    let bundle = Groth16ProofBundle {
        circuit: Groth16CircuitType::AssetOwnership,
        proof: proof_bytes,
        verifying_key: vk_bytes,
        public_inputs,
    };

    assert!(groth16_verify(&bundle).unwrap(), "KAT proof must verify");
}

#[test]
fn test_kat_location_region_proof_verifies() {
    use crate::types::{Groth16CircuitType, Groth16ProofBundle};

    let kat_path = std::path::Path::new(env!("CARGO_MANIFEST_DIR"))
        .join("../../artifacts/kat/groth16-location-region.kat.json");
    if !kat_path.exists() {
        return;
    }
    let kat_json: serde_json::Value =
        serde_json::from_str(&std::fs::read_to_string(&kat_path).unwrap()).unwrap();

    assert_eq!(kat_json["circuit"].as_str().unwrap(), "LocationRegion");
    assert!(kat_json["expected_verify"].as_bool().unwrap());

    let proof_bytes = hex::decode(kat_json["proof_bytes"].as_str().unwrap()).unwrap();
    let vk_bytes = hex::decode(kat_json["verifying_key_bytes"].as_str().unwrap()).unwrap();

    let pi = &kat_json["public_inputs"];
    let mut public_inputs = Vec::new();

    let region_hash = hex::decode(pi["region_hash"].as_str().unwrap()).unwrap();
    for byte in &region_hash {
        for i in 0..8 {
            public_inputs.push(Fr::from(u64::from((byte >> i) & 1)));
        }
    }

    let location_commitment = hex::decode(pi["location_commitment"].as_str().unwrap()).unwrap();
    for byte in &location_commitment {
        for i in 0..8 {
            public_inputs.push(Fr::from(u64::from((byte >> i) & 1)));
        }
    }

    let timestamp = pi["timestamp"].as_u64().unwrap();
    public_inputs.extend((0..64).map(|i| Fr::from((timestamp >> i) & 1)));

    let bundle = Groth16ProofBundle {
        circuit: Groth16CircuitType::LocationRegion,
        proof: proof_bytes,
        verifying_key: vk_bytes,
        public_inputs,
    };

    assert!(groth16_verify(&bundle).unwrap(), "KAT proof must verify");
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
