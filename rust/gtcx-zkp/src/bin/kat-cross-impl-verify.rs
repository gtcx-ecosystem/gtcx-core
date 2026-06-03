//! Standalone cross-implementation KAT verifier.
//!
//! Uses ONLY arkworks (no gtcx-zkp code) to verify KAT artifacts.
//! This proves that our KAT vectors are portable to any arkworks-based verifier.
//!
//! Usage:
//!   cargo run --bin kat-cross-impl-verify -- <kat-file>
//!   cargo run --bin kat-cross-impl-verify -- --all

use ark_bn254::{Bn254, Fr};
use ark_groth16::{Groth16, Proof, VerifyingKey};
use ark_serialize::CanonicalDeserialize;
use ark_snark::SNARK;
use serde_json::Value;
use std::path::Path;

fn main() {
    let args: Vec<String> = std::env::args().collect();
    if args.len() < 2 {
        eprintln!("Usage: kat-cross-impl-verify <kat-file>");
        eprintln!("       kat-cross-impl-verify --all");
        std::process::exit(1);
    }

    let kat_dir = Path::new(env!("CARGO_MANIFEST_DIR")).join("../../artifacts/kat");

    if args[1] == "--all" {
        let circuits = [
            "groth16-gci-threshold.kat.json",
            "groth16-asset-ownership.kat.json",
            "groth16-location-region.kat.json",
            "groth16-commodity-origin.kat.json",
        ];
        let mut all_ok = true;
        for name in &circuits {
            let path = kat_dir.join(name);
            if !path.exists() {
                println!("SKIP  {} (file not found)", name);
                continue;
            }
            match verify_kat(&path) {
                Ok(()) => println!("PASS  {}", name),
                Err(e) => {
                    println!("FAIL  {}: {}", name, e);
                    all_ok = false;
                }
            }
        }
        if !all_ok {
            std::process::exit(1);
        }
    } else {
        let path = Path::new(&args[1]);
        match verify_kat(path) {
            Ok(()) => {
                println!("PASS  {}", path.display());
            }
            Err(e) => {
                eprintln!("FAIL  {}: {}", path.display(), e);
                std::process::exit(1);
            }
        }
    }
}

fn verify_kat(path: &Path) -> Result<(), String> {
    let json_str = std::fs::read_to_string(path)
        .map_err(|e| format!("read error: {}", e))?;
    let json: Value = serde_json::from_str(&json_str)
        .map_err(|e| format!("json parse error: {}", e))?;

    let circuit = json["circuit"].as_str()
        .ok_or("missing circuit field")?;
    let expected_verify = json["expected_verify"].as_bool()
        .ok_or("missing expected_verify field")?;

    let proof_hex = json["proof_bytes"].as_str()
        .ok_or("missing proof_bytes")?;
    let vk_hex = json["verifying_key_bytes"].as_str()
        .ok_or("missing verifying_key_bytes")?;

    let proof_bytes = hex::decode(proof_hex)
        .map_err(|e| format!("hex decode proof: {}", e))?;
    let vk_bytes = hex::decode(vk_hex)
        .map_err(|e| format!("hex decode vk: {}", e))?;

    // Deserialize using ONLY arkworks — no gtcx-zkp code.
    let proof: Proof<Bn254> = Proof::deserialize_compressed(&mut &proof_bytes[..])
        .map_err(|e| format!("proof deserialize: {}", e))?;
    let vk: VerifyingKey<Bn254> = VerifyingKey::deserialize_compressed(&mut &vk_bytes[..])
        .map_err(|e| format!("vk deserialize: {}", e))?;

    let public_inputs = reconstruct_public_inputs(circuit, &json)?;

    let pvk = Groth16::<Bn254>::process_vk(&vk)
        .map_err(|e| format!("process_vk: {}", e))?;
    let result = Groth16::<Bn254>::verify_with_processed_vk(&pvk, &public_inputs, &proof)
        .map_err(|e| format!("verify: {}", e))?;

    if result != expected_verify {
        return Err(format!(
            "verify={} but expected_verify={}",
            result, expected_verify
        ));
    }

    Ok(())
}

/// Reconstruct public inputs from KAT JSON metadata.
/// This logic is duplicated from gtcx-zkp KAT tests to ensure independence.
fn reconstruct_public_inputs(circuit: &str, json: &Value) -> Result<Vec<Fr>, String> {
    let pi = &json["public_inputs"];
    let mut inputs = Vec::new();

    match circuit {
        "GciThreshold" => {
            let threshold = pi["threshold"].as_u64()
                .ok_or("missing threshold")?;
            inputs.extend((0..64).map(|i| Fr::from((threshold >> i) & 1)));
        }
        "AssetOwnership" => {
            let asset_commitment = hex_str_to_bytes(pi, "asset_commitment")?;
            push_bits(&mut inputs, &asset_commitment);
            let owner_hash = hex_str_to_bytes(pi, "owner_hash")?;
            push_bits(&mut inputs, &owner_hash);
            let ownership_root = hex_str_to_bytes(pi, "ownership_root")?;
            push_bits(&mut inputs, &ownership_root);
        }
        "LocationRegion" => {
            let region_hash = hex_str_to_bytes(pi, "region_hash")?;
            push_bits(&mut inputs, &region_hash);
            let location_commitment = hex_str_to_bytes(pi, "location_commitment")?;
            push_bits(&mut inputs, &location_commitment);
            let timestamp = pi["timestamp"].as_u64()
                .ok_or("missing timestamp")?;
            inputs.extend((0..64).map(|i| Fr::from((timestamp >> i) & 1)));
        }
        "CommodityOrigin" => {
            let commodity_type = pi["commodity_type"].as_u64()
                .ok_or("missing commodity_type")?;
            inputs.extend((0..64).map(|i| Fr::from((commodity_type >> i) & 1)));

            let region_hash = hex_str_to_bytes(pi, "region_hash")?;
            push_bits(&mut inputs, &region_hash);
            let primary_commitment = hex_str_to_bytes(pi, "primary_commitment")?;
            push_bits(&mut inputs, &primary_commitment);
            let secondary_commitment = hex_str_to_bytes(pi, "secondary_commitment")?;
            push_bits(&mut inputs, &secondary_commitment);
            let mines_root = hex_str_to_bytes(pi, "mines_root")?;
            push_bits(&mut inputs, &mines_root);

            let min_primary = pi["min_primary"].as_u64()
                .ok_or("missing min_primary")?;
            inputs.extend((0..64).map(|i| Fr::from((min_primary >> i) & 1)));

            let min_secondary = pi["min_secondary"].as_u64()
                .ok_or("missing min_secondary")?;
            inputs.extend((0..64).map(|i| Fr::from((min_secondary >> i) & 1)));

            let certification_flags = pi["certification_flags"].as_u64()
                .ok_or("missing certification_flags")?;
            inputs.extend((0..64).map(|i| Fr::from((certification_flags >> i) & 1)));
        }
        other => return Err(format!("unknown circuit: {}", other)),
    }

    Ok(inputs)
}

fn hex_str_to_bytes(pi: &Value, key: &str) -> Result<Vec<u8>, String> {
    let s = pi[key].as_str()
        .ok_or_else(|| format!("missing {}", key))?;
    hex::decode(s)
        .map_err(|e| format!("hex decode {}: {}", key, e))
}

fn push_bits(vec: &mut Vec<Fr>, bytes: &[u8]) {
    for byte in bytes {
        for i in 0..8 {
            vec.push(Fr::from(u64::from((byte >> i) & 1)));
        }
    }
}
