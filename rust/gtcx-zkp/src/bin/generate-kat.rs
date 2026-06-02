//! Generate Known Answer Test (KAT) vectors for GTCX ZKP circuits.
//!
//! Run: cargo run --bin generate-kat -- ../../artifacts/kat/

use gtcx_zkp::{
    groth16_generate_keys, groth16_prove_commodity_origin, sample_commodity_origin,
    groth16_verify, Groth16CircuitType,
};
use sha2::{Digest, Sha256};
use std::path::PathBuf;

fn main() {
    let out_dir = std::env::args()
        .nth(1)
        .map(PathBuf::from)
        .unwrap_or_else(|| PathBuf::from("artifacts/kat"));

    std::fs::create_dir_all(&out_dir).expect("create output directory");

    println!("Generating KAT vector for CommodityOrigin circuit...");

    let keys = groth16_generate_keys(Groth16CircuitType::CommodityOrigin)
        .expect("key generation failed");

    let sample = sample_commodity_origin().expect("sample generation failed");

    let (bundle, inputs) = groth16_prove_commodity_origin(
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
    .expect("proof generation failed");

    let is_valid = groth16_verify(&bundle).expect("verification error");
    assert!(is_valid, "generated proof must verify");

    let vk_hash = hex::encode(Sha256::digest(&bundle.verifying_key));

    let kat = serde_json::json!({
        "version": "1.0.0",
        "circuit": "CommodityOrigin",
        "generated_at": std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_secs(),
        "vk_hash": vk_hash,
        "witness": {
            "commodity_type": sample.commodity_type,
            "mine_id": hex::encode(sample.mine_id),
            "lat": sample.lat,
            "lon": sample.lon,
            "primary_metric": sample.primary_metric,
            "secondary_metric": sample.secondary_metric,
            "primary_randomness": hex::encode(sample.primary_randomness),
            "secondary_randomness": hex::encode(sample.secondary_randomness),
            "location_randomness": hex::encode(sample.location_randomness),
            "bounds": sample.bounds,
            "min_primary": sample.min_primary,
            "min_secondary": sample.min_secondary,
            "certification_flags": sample.certification_flags,
        },
        "public_inputs": {
            "commodity_type": inputs.commodity_type,
            "region_hash": hex::encode(inputs.region_hash),
            "primary_commitment": hex::encode(inputs.primary_commitment),
            "secondary_commitment": hex::encode(inputs.secondary_commitment),
            "mines_root": hex::encode(inputs.mines_root),
            "min_primary": inputs.min_primary,
            "min_secondary": inputs.min_secondary,
            "certification_flags": inputs.certification_flags,
        },
        "proof_bytes": hex::encode(&bundle.proof),
        "verifying_key_bytes": hex::encode(&bundle.verifying_key),
        "expected_verify": true,
    });

    let out_path = out_dir.join("groth16-commodity-origin.kat.json");
    std::fs::write(&out_path, serde_json::to_string_pretty(&kat).unwrap())
        .expect("write KAT file");

    println!("KAT vector written to: {}", out_path.display());
    println!("  VK hash: {}", vk_hash);
    println!("  Proof size: {} bytes", bundle.proof.len());
    println!("  VK size: {} bytes", bundle.verifying_key.len());
}
