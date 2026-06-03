//! Profile-bound tests for `gh-gold-origin` on generic `CommodityOrigin` R1CS (DTF-5.1.2).

use ark_relations::r1cs::{ConstraintSynthesizer, ConstraintSystem};
use crate::circuit_profiles::{
    gh_gold_origin_profile, sample_commodity_origin_for_profile, validate_profile_sample,
    zw_diamond_origin_profile, ProfileValidationError, PROFILE_GH_GOLD_ORIGIN,
    PROFILE_ZW_DIAMOND_ORIGIN,
};
use crate::groth16::CommodityOriginCircuit;
use crate::groth16::CommodityOriginSample;

fn circuit_from_sample(sample: &CommodityOriginSample) -> CommodityOriginCircuit {
    CommodityOriginCircuit {
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
        merkle_path: Some(sample.merkle_path.clone()),
    }
}

fn assert_constraints_satisfied(sample: &CommodityOriginSample) {
    let circuit = circuit_from_sample(sample);
    let cs = ConstraintSystem::new_ref();
    circuit.generate_constraints(cs.clone()).unwrap();
    assert!(cs.is_satisfied().unwrap(), "profile sample must satisfy R1CS");
}

fn assert_constraints_unsatisfied(sample: &CommodityOriginSample) {
    let circuit = circuit_from_sample(sample);
    let cs = ConstraintSystem::new_ref();
    circuit.generate_constraints(cs.clone()).unwrap();
    assert!(!cs.is_satisfied().unwrap());
}

#[test]
fn gh_gold_profile_registry_id_and_underlying_circuit() {
    let profile = gh_gold_origin_profile();
    assert_eq!(profile.profile_id, PROFILE_GH_GOLD_ORIGIN);
    assert_eq!(
        format!("{:?}", profile.groth16_circuit),
        "CommodityOrigin"
    );
}

#[test]
fn gh_gold_profile_sample_validates_and_satisfies_r1cs() {
    let profile = gh_gold_origin_profile();
    let sample = sample_commodity_origin_for_profile(&profile).unwrap();
    validate_profile_sample(&profile, &sample).unwrap();
    assert_constraints_satisfied(&sample);
}

#[test]
fn gh_gold_profile_cert_mask_rejected_before_prove() {
    let profile = gh_gold_origin_profile();
    let mut sample = sample_commodity_origin_for_profile(&profile).unwrap();
    sample.certification_flags = 0;
    let err = validate_profile_sample(&profile, &sample).unwrap_err();
    assert_eq!(
        err,
        ProfileValidationError::CertificationMaskUnsatisfied {
            required_mask: profile.required_certification_mask,
            actual: 0,
        }
    );
}

#[test]
fn gh_gold_profile_gps_lat_below_min_fails_r1cs() {
    let profile = gh_gold_origin_profile();
    let mut sample = sample_commodity_origin_for_profile(&profile).unwrap();
    sample.lat = profile.bounds[0] - 1;
    assert_constraints_unsatisfied(&sample);
}

#[test]
fn gh_gold_profile_gps_lat_above_max_fails_r1cs() {
    let profile = gh_gold_origin_profile();
    let mut sample = sample_commodity_origin_for_profile(&profile).unwrap();
    sample.lat = profile.bounds[1] + 1;
    assert_constraints_unsatisfied(&sample);
}

#[test]
fn gh_gold_profile_gps_lon_below_min_fails_r1cs() {
    let profile = gh_gold_origin_profile();
    let mut sample = sample_commodity_origin_for_profile(&profile).unwrap();
    sample.lon = profile.bounds[2] - 1;
    assert_constraints_unsatisfied(&sample);
}

#[test]
fn gh_gold_profile_gps_lon_above_max_fails_r1cs() {
    let profile = gh_gold_origin_profile();
    let mut sample = sample_commodity_origin_for_profile(&profile).unwrap();
    sample.lon = profile.bounds[3] + 1;
    assert_constraints_unsatisfied(&sample);
}

#[test]
fn gh_gold_profile_primary_below_min_fails_r1cs() {
    let profile = gh_gold_origin_profile();
    let mut sample = sample_commodity_origin_for_profile(&profile).unwrap();
    sample.primary_metric = profile.min_primary - 1;
    assert_constraints_unsatisfied(&sample);
}

#[test]
fn gh_gold_profile_secondary_below_min_fails_r1cs() {
    let profile = gh_gold_origin_profile();
    let mut sample = sample_commodity_origin_for_profile(&profile).unwrap();
    sample.secondary_metric = profile.min_secondary - 1;
    assert_constraints_unsatisfied(&sample);
}

#[test]
fn gh_gold_profile_wrong_primary_commitment_fails_r1cs() {
    let profile = gh_gold_origin_profile();
    let mut sample = sample_commodity_origin_for_profile(&profile).unwrap();
    sample.primary_commitment[0] ^= 0xff;
    assert_constraints_unsatisfied(&sample);
}

#[test]
fn gh_gold_profile_wrong_secondary_commitment_fails_r1cs() {
    let profile = gh_gold_origin_profile();
    let mut sample = sample_commodity_origin_for_profile(&profile).unwrap();
    sample.secondary_commitment[0] ^= 0xff;
    assert_constraints_unsatisfied(&sample);
}

#[test]
fn gh_gold_profile_wrong_region_hash_fails_r1cs() {
    let profile = gh_gold_origin_profile();
    let mut sample = sample_commodity_origin_for_profile(&profile).unwrap();
    sample.region_hash[0] ^= 0xff;
    assert_constraints_unsatisfied(&sample);
}

#[test]
fn gh_gold_profile_wrong_merkle_path_fails_r1cs() {
    let profile = gh_gold_origin_profile();
    let mut sample = sample_commodity_origin_for_profile(&profile).unwrap();
    sample.mine_id[0] ^= 0xff;
    assert_constraints_unsatisfied(&sample);
}

#[test]
fn zw_diamond_profile_registry_id_and_underlying_circuit() {
    let profile = zw_diamond_origin_profile();
    assert_eq!(profile.profile_id, PROFILE_ZW_DIAMOND_ORIGIN);
    assert_eq!(
        format!("{:?}", profile.groth16_circuit),
        "CommodityOrigin"
    );
}

#[test]
fn zw_diamond_profile_sample_validates_and_satisfies_r1cs() {
    let profile = zw_diamond_origin_profile();
    let sample = sample_commodity_origin_for_profile(&profile).unwrap();
    validate_profile_sample(&profile, &sample).unwrap();
    assert_constraints_satisfied(&sample);
}

#[test]
fn zw_diamond_profile_cert_mask_rejected_before_prove() {
    let profile = zw_diamond_origin_profile();
    let mut sample = sample_commodity_origin_for_profile(&profile).unwrap();
    sample.certification_flags = 0;
    let err = validate_profile_sample(&profile, &sample).unwrap_err();
    assert_eq!(
        err,
        ProfileValidationError::CertificationMaskUnsatisfied {
            required_mask: profile.required_certification_mask,
            actual: 0,
        }
    );
}

#[test]
fn zw_diamond_profile_gps_lat_below_min_fails_r1cs() {
    let profile = zw_diamond_origin_profile();
    let mut sample = sample_commodity_origin_for_profile(&profile).unwrap();
    sample.lat = profile.bounds[0] - 1;
    assert_constraints_unsatisfied(&sample);
}

#[test]
fn zw_diamond_profile_gps_lon_above_max_fails_r1cs() {
    let profile = zw_diamond_origin_profile();
    let mut sample = sample_commodity_origin_for_profile(&profile).unwrap();
    sample.lon = profile.bounds[3] + 1;
    assert_constraints_unsatisfied(&sample);
}

#[test]
fn zw_diamond_profile_primary_below_min_fails_r1cs() {
    let profile = zw_diamond_origin_profile();
    let mut sample = sample_commodity_origin_for_profile(&profile).unwrap();
    sample.primary_metric = profile.min_primary - 1;
    assert_constraints_unsatisfied(&sample);
}

#[test]
fn zw_diamond_profile_wrong_region_hash_fails_r1cs() {
    let profile = zw_diamond_origin_profile();
    let mut sample = sample_commodity_origin_for_profile(&profile).unwrap();
    sample.region_hash[0] ^= 0xff;
    assert_constraints_unsatisfied(&sample);
}
