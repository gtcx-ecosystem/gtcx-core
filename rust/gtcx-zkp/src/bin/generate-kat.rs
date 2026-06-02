//! Generate Known Answer Test (KAT) vectors for GTCX ZKP circuits.
//!
//! Usage: cargo run --bin generate-kat -- <circuit> <output-dir>
//!   circuit: gci-threshold | asset-ownership | location-region | commodity-origin |
//!            bulletproofs-amount | bulletproofs-commodity
//!   output-dir: defaults to artifacts/kat/

use gtcx_zkp::{
    bulletproofs_prove_amount_range, bulletproofs_prove_commodity_range,
    groth16_generate_keys, groth16_prove_asset_ownership, groth16_prove_commodity_origin,
    groth16_prove_gci_threshold, groth16_prove_location_region, groth16_verify,
    sample_asset_ownership, sample_commodity_origin,
    sample_location_region, Groth16CircuitType,
};
use sha2::{Digest, Sha256};
use std::path::PathBuf;

fn main() {
    let circuit = std::env::args().nth(1).unwrap_or_else(|| {
        eprintln!("Usage: generate-kat <circuit> [output-dir]");
        eprintln!("Circuits: gci-threshold, asset-ownership, location-region, commodity-origin,");
        eprintln!("          bulletproofs-amount, bulletproofs-commodity");
        std::process::exit(1);
    });

    let out_dir = std::env::args()
        .nth(2)
        .map(PathBuf::from)
        .unwrap_or_else(|| PathBuf::from("artifacts/kat"));

    std::fs::create_dir_all(&out_dir).expect("create output directory");

    match circuit.as_str() {
        "commodity-origin" => generate_groth16_commodity_origin(&out_dir),
        "gci-threshold" => generate_groth16_gci_threshold(&out_dir),
        "asset-ownership" => generate_groth16_asset_ownership(&out_dir),
        "location-region" => generate_groth16_location_region(&out_dir),
        "bulletproofs-amount" => generate_bulletproofs_amount(&out_dir),
        "bulletproofs-commodity" => generate_bulletproofs_commodity(&out_dir),
        _ => {
            eprintln!("Unknown circuit: {}", circuit);
            std::process::exit(1);
        }
    }
}

fn generate_groth16_commodity_origin(out_dir: &PathBuf) {
    println!("Generating KAT vector for CommodityOrigin circuit...");

    let keys = groth16_generate_keys(Groth16CircuitType::CommodityOrigin)
        .expect("key generation failed");
    let sample = sample_commodity_origin().expect("sample generation failed");

    let (bundle, inputs) = groth16_prove_commodity_origin(
        sample.commodity_type, sample.mine_id, sample.lat, sample.lon,
        sample.primary_metric, sample.secondary_metric,
        sample.primary_randomness, sample.secondary_randomness, sample.location_randomness,
        sample.bounds, sample.min_primary, sample.min_secondary, sample.certification_flags,
        sample.merkle_path, &keys,
    ).expect("proof generation failed");

    assert!(groth16_verify(&bundle).expect("verification error"));

    let vk_hash = hex::encode(Sha256::digest(&bundle.verifying_key));
    let kat = serde_json::json!({
        "version": "1.0.0",
        "circuit": "CommodityOrigin",
        "generated_at": std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_secs(),
        "vk_hash": vk_hash,
        "witness": {
            "commodity_type": sample.commodity_type,
            "mine_id": hex::encode(sample.mine_id),
            "lat": sample.lat, "lon": sample.lon,
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

    write_kat(out_dir, "groth16-commodity-origin.kat.json", &kat);
    print_summary(&vk_hash, &bundle.proof, &bundle.verifying_key);
}

fn generate_groth16_gci_threshold(out_dir: &PathBuf) {
    println!("Generating KAT vector for GciThreshold circuit...");

    let keys = groth16_generate_keys(Groth16CircuitType::GciThreshold)
        .expect("key generation failed");

    let bundle = groth16_prove_gci_threshold(95, 80, &keys)
        .expect("proof generation failed");

    assert!(groth16_verify(&bundle).expect("verification error"));

    let vk_hash = hex::encode(Sha256::digest(&bundle.verifying_key));
    let kat = serde_json::json!({
        "version": "1.0.0",
        "circuit": "GciThreshold",
        "generated_at": std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_secs(),
        "vk_hash": vk_hash,
        "witness": { "score": 95, "threshold": 80 },
        "public_inputs": { "score": 95, "threshold": 80 },
        "proof_bytes": hex::encode(&bundle.proof),
        "verifying_key_bytes": hex::encode(&bundle.verifying_key),
        "expected_verify": true,
    });

    write_kat(out_dir, "groth16-gci-threshold.kat.json", &kat);
    print_summary(&vk_hash, &bundle.proof, &bundle.verifying_key);
}

fn generate_groth16_asset_ownership(out_dir: &PathBuf) {
    println!("Generating KAT vector for AssetOwnership circuit...");

    let keys = groth16_generate_keys(Groth16CircuitType::AssetOwnership)
        .expect("key generation failed");
    let sample = sample_asset_ownership().expect("sample generation failed");

    let (bundle, inputs) = groth16_prove_asset_ownership(
        sample.asset_id, sample.owner_hash, sample.randomness,
        sample.ownership_root, sample.merkle_path, &keys,
    ).expect("proof generation failed");

    assert!(groth16_verify(&bundle).expect("verification error"));

    let vk_hash = hex::encode(Sha256::digest(&bundle.verifying_key));
    let kat = serde_json::json!({
        "version": "1.0.0",
        "circuit": "AssetOwnership",
        "generated_at": std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_secs(),
        "vk_hash": vk_hash,
        "witness": {
            "asset_id": hex::encode(sample.asset_id),
            "owner_hash": hex::encode(sample.owner_hash),
            "randomness": hex::encode(sample.randomness),
        },
        "public_inputs": {
            "asset_commitment": hex::encode(inputs.asset_commitment),
            "owner_hash": hex::encode(inputs.owner_hash),
            "ownership_root": hex::encode(inputs.ownership_root),
        },
        "proof_bytes": hex::encode(&bundle.proof),
        "verifying_key_bytes": hex::encode(&bundle.verifying_key),
        "expected_verify": true,
    });

    write_kat(out_dir, "groth16-asset-ownership.kat.json", &kat);
    print_summary(&vk_hash, &bundle.proof, &bundle.verifying_key);
}

fn generate_groth16_location_region(out_dir: &PathBuf) {
    println!("Generating KAT vector for LocationRegion circuit...");

    let keys = groth16_generate_keys(Groth16CircuitType::LocationRegion)
        .expect("key generation failed");
    let sample = sample_location_region().expect("sample generation failed");

    let (bundle, inputs) = groth16_prove_location_region(
        sample.lat, sample.lon, sample.timestamp, sample.randomness,
        sample.bounds, &keys,
    ).expect("proof generation failed");

    assert!(groth16_verify(&bundle).expect("verification error"));

    let vk_hash = hex::encode(Sha256::digest(&bundle.verifying_key));
    let kat = serde_json::json!({
        "version": "1.0.0",
        "circuit": "LocationRegion",
        "generated_at": std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_secs(),
        "vk_hash": vk_hash,
        "witness": {
            "lat": sample.lat, "lon": sample.lon,
            "timestamp": sample.timestamp,
            "randomness": hex::encode(sample.randomness),
            "bounds": sample.bounds,
        },
        "public_inputs": {
            "region_hash": hex::encode(inputs.region_hash),
            "location_commitment": hex::encode(inputs.location_commitment),
        },
        "proof_bytes": hex::encode(&bundle.proof),
        "verifying_key_bytes": hex::encode(&bundle.verifying_key),
        "expected_verify": true,
    });

    write_kat(out_dir, "groth16-location-region.kat.json", &kat);
    print_summary(&vk_hash, &bundle.proof, &bundle.verifying_key);
}

fn generate_bulletproofs_amount(out_dir: &PathBuf) {
    println!("Generating KAT vector for BulletproofsAmountRange...");

    let bundle = bulletproofs_prove_amount_range(55, 10, 100, [7u8; 32])
        .expect("proof generation failed");

    let kat = serde_json::json!({
        "version": "1.0.0",
        "circuit": "BulletproofsAmountRange",
        "generated_at": std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_secs(),
        "witness": { "value": 55, "min": 10, "max": 100, "blinding": hex::encode([7u8; 32]) },
        "public_inputs": { "commitment": hex::encode(bundle.commitment), "min": bundle.min, "max": bundle.max },
        "proof_low_bytes": hex::encode(&bundle.proof_low),
        "proof_high_bytes": hex::encode(&bundle.proof_high),
        "expected_verify": true,
    });

    write_kat(out_dir, "bulletproofs-amount-range.kat.json", &kat);
    println!("  Proof sizes: low={} bytes, high={} bytes", bundle.proof_low.len(), bundle.proof_high.len());
}

fn generate_bulletproofs_commodity(out_dir: &PathBuf) {
    println!("Generating KAT vector for BulletproofsCommodityRange...");

    let bundle = bulletproofs_prove_commodity_range(
        55, 10, 100, [1u8; 32], [2u8; 32], [7u8; 32],
    ).expect("proof generation failed");

    let kat = serde_json::json!({
        "version": "1.0.0",
        "circuit": "BulletproofsCommodityRange",
        "generated_at": std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_secs(),
        "witness": {
            "value": 55, "min": 10, "max": 100,
            "value_blinding": hex::encode([1u8; 32]),
            "metric_blinding": hex::encode([2u8; 32]),
            "range_blinding": hex::encode([7u8; 32]),
        },
        "public_inputs": {
            "commitment": hex::encode(bundle.commitment),
            "commodity_hash": hex::encode(bundle.commodity_hash),
            "unit_hash": hex::encode(bundle.unit_hash),
            "min": bundle.min,
            "max": bundle.max,
        },
        "proof_low_bytes": hex::encode(&bundle.proof_low),
        "proof_high_bytes": hex::encode(&bundle.proof_high),
        "expected_verify": true,
    });

    write_kat(out_dir, "bulletproofs-commodity-range.kat.json", &kat);
    println!("  Proof sizes: low={} bytes, high={} bytes", bundle.proof_low.len(), bundle.proof_high.len());
}

fn write_kat(out_dir: &PathBuf, filename: &str, kat: &serde_json::Value) {
    let out_path = out_dir.join(filename);
    std::fs::write(&out_path, serde_json::to_string_pretty(kat).unwrap())
        .expect("write KAT file");
    println!("KAT vector written to: {}", out_path.display());
}

fn print_summary(vk_hash: &str, proof: &[u8], vk: &[u8]) {
    println!("  VK hash: {}", vk_hash);
    println!("  Proof size: {} bytes", proof.len());
    println!("  VK size: {} bytes", vk.len());
}
