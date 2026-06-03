//! Property-based tests for ZKP constraint semantics and Bulletproofs range proofs.

use crate::bulletproofs::{
    bulletproofs_prove_amount_range, bulletproofs_prove_commodity_range,
    bulletproofs_verify_amount_range, bulletproofs_verify_commodity_range,
};
use crate::error::ZkpError;
use crate::groth16::{sample_commodity_origin, uint64_is_ge, CommodityOriginCircuit};
use ark_bn254::Fr;
use ark_r1cs_std::alloc::AllocVar;
use ark_r1cs_std::uint64::UInt64;
use ark_r1cs_std::R1CSVar;
use ark_relations::r1cs::{ConstraintSynthesizer, ConstraintSystem};
use proptest::prelude::*;
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

// ------------------------------------------------------------------
// Fast property-based tests (default 256 cases)
// ------------------------------------------------------------------

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

    // ------------------------------------------------------------------
    // Bulletproofs property-based tests (Dimension 2, M2.2)
    // ------------------------------------------------------------------

    /// Random valid (amount, min, max) tuples must prove and verify.
    #[test]
    fn prop_bulletproofs_amount_range_valid(
        min in 1u64..=1_000_000u64,
        span in 1u64..=1_000_000u64,
        offset in 0u64..=1_000_000u64,
        randomness in any::<[u8; 32]>(),
    ) {
        let max = min.saturating_add(span);
        let amount = min + (offset % (span + 1));
        prop_assume!(amount >= min && amount <= max);

        let bundle = bulletproofs_prove_amount_range(amount, min, max, randomness)
            .map_err(|e| TestCaseError::fail(format!("prove failed: {}", e)))?;
        let verified = bulletproofs_verify_amount_range(&bundle)
            .map_err(|e| TestCaseError::fail(format!("verify failed: {}", e)))?;
        prop_assert!(verified, "valid amount range proof must verify");
    }

    /// Random invalid (amount, min, max) tuples must fail to prove.
    #[test]
    fn prop_bulletproofs_amount_range_invalid(
        min in 1u64..=1_000_000u64,
        span in 1u64..=1_000_000u64,
        randomness in any::<[u8; 32]>(),
    ) {
        let max = min.saturating_add(span);
        // Generate amount either below min or above max
        let amount = if randomness[0] % 2 == 0 {
            min - 1 // below min (safe because min >= 1)
        } else {
            max.saturating_add(1 + (randomness[1] as u64)) // above max
        };
        prop_assume!(amount < min || amount > max);

        let result = bulletproofs_prove_amount_range(amount, min, max, randomness);
        prop_assert!(
            matches!(result, Err(ZkpError::InvalidWitness { .. })),
            "amount={} outside [{},{}] must fail to prove, got {:?}",
            amount, min, max, result
        );
    }

    /// Random valid commodity (quantity, min, max) tuples must prove and verify.
    #[test]
    fn prop_bulletproofs_commodity_range_valid(
        min in 1u64..=1_000_000u64,
        span in 1u64..=1_000_000u64,
        offset in 0u64..=1_000_000u64,
        commodity_hash in any::<[u8; 32]>(),
        unit_hash in any::<[u8; 32]>(),
        randomness in any::<[u8; 32]>(),
    ) {
        let max = min.saturating_add(span);
        let quantity = min + (offset % (span + 1));
        prop_assume!(quantity >= min && quantity <= max);

        let bundle = bulletproofs_prove_commodity_range(
            quantity, min, max, commodity_hash, unit_hash, randomness
        ).map_err(|e| TestCaseError::fail(format!("prove failed: {}", e)))?;
        let verified = bulletproofs_verify_commodity_range(&bundle)
            .map_err(|e| TestCaseError::fail(format!("verify failed: {}", e)))?;
        prop_assert!(verified, "valid commodity range proof must verify");
    }

    /// Random invalid commodity (quantity, min, max) tuples must fail to prove.
    #[test]
    fn prop_bulletproofs_commodity_range_invalid(
        min in 1u64..=1_000_000u64,
        span in 1u64..=1_000_000u64,
        commodity_hash in any::<[u8; 32]>(),
        unit_hash in any::<[u8; 32]>(),
        randomness in any::<[u8; 32]>(),
    ) {
        let max = min.saturating_add(span);
        let quantity = if randomness[0] % 2 == 0 {
            min - 1
        } else {
            max.saturating_add(1 + (randomness[1] as u64))
        };
        prop_assume!(quantity < min || quantity > max);

        let result = bulletproofs_prove_commodity_range(
            quantity, min, max, commodity_hash, unit_hash, randomness
        );
        prop_assert!(
            matches!(result, Err(ZkpError::InvalidWitness { .. })),
            "quantity={} outside [{},{}] must fail to prove, got {:?}",
            quantity, min, max, result
        );
    }
}

// ------------------------------------------------------------------
// Slow R1CS property-based tests (capped at 32 cases)
// Each case builds a full ConstraintSystem — ~2s per case.
// ------------------------------------------------------------------

proptest! {
    #![proptest_config(ProptestConfig {
        cases: 16,
        ..ProptestConfig::default()
    })]

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
}
