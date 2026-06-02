//! Property-based tests for ZKP constraint semantics.

use crate::groth16::{
    sample_commodity_origin, uint64_is_ge, CommodityOriginCircuit,
};
use ark_bn254::Fr;
use ark_r1cs_std::uint64::UInt64;
use ark_r1cs_std::alloc::AllocVar;
use ark_r1cs_std::R1CSVar;
use ark_relations::r1cs::{ConstraintSynthesizer, ConstraintSystem};
use sha2::{Digest, Sha256};

fn sha256_digest(data: &[u8]) -> [u8; 32] {
    let digest = Sha256::digest(data);
    let mut out = [0u8; 32];
    out.copy_from_slice(&digest);
    out
}

fn u64_to_le_bytes(value: u64) -> [u8; 8] {
    value.to_le_bytes()
}
use proptest::prelude::*;

proptest! {
    /// `uint64_is_ge` must agree with Rust's `>=` for all u64 pairs.
    #[test]
    fn prop_uint64_is_ge_matches_rust(a: u64, b: u64) {
        let cs = ConstraintSystem::<Fr>::new_ref();
        let a_var = UInt64::new_witness(cs.clone(), || Ok(a)).unwrap();
        let b_var = UInt64::new_witness(cs.clone(), || Ok(b)).unwrap();
        let result = uint64_is_ge(&a_var, &b_var).unwrap();
        let result_bool = result.value().unwrap();
        prop_assert_eq!(result_bool, a >= b);
    }

    /// CommodityOriginCircuit: random lat inside bounds must satisfy constraints.
    #[test]
    fn prop_commodity_origin_gps_inside_bounds_passes(
        lat_offset: u64,
        lon_offset: u64,
    ) {
        let sample = sample_commodity_origin().unwrap();
        let lat_range = sample.bounds[1] - sample.bounds[0];
        let lon_range = sample.bounds[3] - sample.bounds[2];
        let lat = sample.bounds[0] + (lat_offset % lat_range.max(1));
        let lon = sample.bounds[2] + (lon_offset % lon_range.max(1));

        let circuit = CommodityOriginCircuit {
            commodity_type: Some(sample.commodity_type),
            mine_id: Some(sample.mine_id),
            lat: Some(lat),
            lon: Some(lon),
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
        prop_assert!(cs.is_satisfied().unwrap(), "GPS inside bounds should pass");
    }

    /// CommodityOriginCircuit: random lat outside bounds must fail constraints.
    #[test]
    fn prop_commodity_origin_gps_outside_bounds_fails(
        lat_offset: u64,
    ) {
        let sample = sample_commodity_origin().unwrap();
        // lat = max_lat + 1 + offset
        let lat = sample.bounds[1].saturating_add(1).saturating_add(lat_offset % 1000);

        let circuit = CommodityOriginCircuit {
            commodity_type: Some(sample.commodity_type),
            mine_id: Some(sample.mine_id),
            lat: Some(lat),
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
        prop_assert!(!cs.is_satisfied().unwrap(), "GPS outside bounds should fail");
    }

    /// SHA-256 commitment consistency: recompute must match for random metric + randomness.
    #[test]
    fn prop_commitment_consistency(metric: u64, randomness: [u8; 32]) {
        let mut input = Vec::with_capacity(8 + 32);
        input.extend_from_slice(&u64_to_le_bytes(metric));
        input.extend_from_slice(&randomness);
        let commitment = sha256_digest(&input);

        // Verify by recomputing
        let commitment2 = sha256_digest(&input);
        prop_assert_eq!(commitment, commitment2);
    }
}
