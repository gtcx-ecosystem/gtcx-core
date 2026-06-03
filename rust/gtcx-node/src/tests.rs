//! Unit tests for GTCX Node.js NAPI bindings.

use proptest::prelude::*;

use crate::*;

// ── Key generation ──

#[test]
fn test_generate_key_pair() {
    let kp = generate_key_pair();
    assert_eq!(kp.private_key.len(), 64); // 32 bytes hex
    assert_eq!(kp.public_key.len(), 64); // 32 bytes hex
}

#[test]
fn test_generate_unique_keys() {
    let kp1 = generate_key_pair();
    let kp2 = generate_key_pair();
    assert_ne!(kp1.private_key, kp2.private_key);
    assert_ne!(kp1.public_key, kp2.public_key);
}

// ── Signing ──

#[test]
fn test_sign_and_verify() {
    let kp = generate_key_pair();
    let message = b"Hello, GTCX!".to_vec();

    let sig_hex = sign(message.clone(), kp.private_key).unwrap();
    assert_eq!(sig_hex.len(), 128); // 64 bytes hex

    let valid = verify(sig_hex, message, kp.public_key).unwrap();
    assert!(valid);
}

#[test]
fn test_verify_wrong_message() {
    let kp = generate_key_pair();
    let sig_hex = sign(b"original".to_vec(), kp.private_key).unwrap();
    let valid = verify(sig_hex, b"tampered".to_vec(), kp.public_key).unwrap();
    assert!(!valid);
}

#[test]
fn test_verify_wrong_key() {
    let kp1 = generate_key_pair();
    let kp2 = generate_key_pair();
    let sig_hex = sign(b"message".to_vec(), kp1.private_key).unwrap();
    let valid = verify(sig_hex, b"message".to_vec(), kp2.public_key).unwrap();
    assert!(!valid);
}

#[test]
fn test_sign_invalid_key_hex() {
    let err = sign(b"test".to_vec(), "not-hex".to_string()).unwrap_err();
    assert!(err.reason.contains("Odd"));
}

#[test]
fn test_sign_wrong_key_length() {
    let err = sign(b"test".to_vec(), "aabb".to_string()).unwrap_err();
    assert!(err.reason.contains("Invalid key length"));
}

// ── Hashing ──

#[test]
fn test_sha256_known_vector() {
    let hash = sha256(b"abc".to_vec());
    assert_eq!(
        hash,
        "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
    );
}

#[test]
fn test_sha512_output_length() {
    let hash = sha512(b"test".to_vec());
    assert_eq!(hash.len(), 128); // 64 bytes hex
}

#[test]
fn test_blake3_deterministic() {
    let h1 = blake3_hash(b"data".to_vec());
    let h2 = blake3_hash(b"data".to_vec());
    assert_eq!(h1, h2);
}

#[test]
fn test_blake3_different_inputs() {
    let h1 = blake3_hash(b"input1".to_vec());
    let h2 = blake3_hash(b"input2".to_vec());
    assert_ne!(h1, h2);
}

// ── Key derivation ──

#[test]
fn test_derive_child_key_deterministic() {
    let kp = generate_key_pair();
    let child1 = derive_child_key(kp.private_key.clone(), 0).unwrap();
    let child2 = derive_child_key(kp.private_key, 0).unwrap();
    assert_eq!(child1, child2);
}

#[test]
fn test_derive_child_key_different_indices() {
    let kp = generate_key_pair();
    let child0 = derive_child_key(kp.private_key.clone(), 0).unwrap();
    let child1 = derive_child_key(kp.private_key, 1).unwrap();
    assert_ne!(child0, child1);
}

#[test]
fn test_derive_purpose_key_deterministic() {
    let kp = generate_key_pair();
    let key1 = derive_purpose_key(kp.private_key.clone(), "signing".to_string()).unwrap();
    let key2 = derive_purpose_key(kp.private_key, "signing".to_string()).unwrap();
    assert_eq!(key1, key2);
}

#[test]
fn test_derive_purpose_key_different_purposes() {
    let kp = generate_key_pair();
    let k1 = derive_purpose_key(kp.private_key.clone(), "signing".to_string()).unwrap();
    let k2 = derive_purpose_key(kp.private_key, "encryption".to_string()).unwrap();
    assert_ne!(k1, k2);
}

// ── ZKP ──

#[test]
fn test_zkp_commit_prove_verify_roundtrip() {
    let salt = "ab".repeat(32); // 32 bytes = 64 hex chars
    let result =
        zkp_commit_and_prove("compliance".to_string(), b"secret-witness".to_vec(), salt).unwrap();

    assert_eq!(result.circuit, "compliance");
    assert_eq!(result.commitment.len(), 64); // 32 bytes hex
    assert_eq!(result.proof_data.len(), 128); // 64 bytes hex

    let valid = zkp_verify(
        "compliance".to_string(),
        result.commitment,
        result.proof_data,
    )
    .unwrap();
    assert!(valid);
}

#[test]
fn test_zkp_verify_tampered_proof_data_fails() {
    let salt = "cd".repeat(32);
    let result = zkp_commit_and_prove("provenance".to_string(), b"witness".to_vec(), salt).unwrap();

    // Tamper with proof data (replace with zeros — will fail trivial proof check)
    let tampered_proof = "00".repeat(64); // 64 bytes of zeros
    let err = zkp_verify("provenance".to_string(), result.commitment, tampered_proof);
    assert!(err.is_err());
}

#[test]
fn test_zkp_different_witnesses_produce_different_proofs() {
    let salt = "ef".repeat(32);
    let result1 =
        zkp_commit_and_prove("quality".to_string(), b"witness-a".to_vec(), salt.clone()).unwrap();
    let result2 = zkp_commit_and_prove("quality".to_string(), b"witness-b".to_vec(), salt).unwrap();

    assert_ne!(result1.commitment, result2.commitment);
    assert_ne!(result1.proof_data, result2.proof_data);
}

#[test]
fn test_zkp_invalid_salt_length() {
    let err = zkp_commit_and_prove(
        "compliance".to_string(),
        b"witness".to_vec(),
        "aabb".to_string(),
    );
    assert!(err.is_err());
}

proptest! {
    #[test]
    fn prop_sign_rejects_malformed_private_key(
        key in ".*",
        message in proptest::collection::vec(any::<u8>(), 0..256)
    ) {
        if hex::decode(&key).ok().filter(|bytes| bytes.len() == 32).is_some() {
            return Ok(());
        }

        let result = sign(message, key);
        prop_assert!(result.is_err());
    }

    #[test]
    fn prop_verify_rejects_malformed_signature_or_key(
        signature in ".*",
        public_key in ".*",
        message in proptest::collection::vec(any::<u8>(), 0..256)
    ) {
        let signature_is_valid = hex::decode(&signature)
            .ok()
            .filter(|bytes| bytes.len() == 64)
            .is_some();
        let key_is_valid = hex::decode(&public_key)
            .ok()
            .filter(|bytes| bytes.len() == 32)
            .is_some();

        if signature_is_valid && key_is_valid {
            return Ok(());
        }

        let result = verify(signature, message, public_key);
        prop_assert!(result.is_err());
    }

    #[test]
    fn prop_zkp_verify_rejects_malformed_commitment_or_proof(
        commitment in ".*",
        proof_data in ".*"
    ) {
        let commitment_is_valid = hex::decode(&commitment)
            .ok()
            .filter(|bytes| bytes.len() == 32)
            .is_some();
        let proof_is_valid = hex::decode(&proof_data)
            .ok()
            .filter(|bytes| !bytes.is_empty())
            .is_some();

        if commitment_is_valid && proof_is_valid {
            return Ok(());
        }

        let result = zkp_verify("compliance".to_string(), commitment, proof_data);
        prop_assert!(result.is_err());
    }
}

// ── Groth16 ──

#[test]
fn test_groth16_gci_threshold_roundtrip() {
    let keys = groth16_generate_keys("gci_threshold".to_string()).unwrap();
    assert!(!keys.proving_key.is_empty());
    assert!(!keys.verifying_key.is_empty());

    let bundle =
        groth16_prove_gci_threshold(85, 70, keys.proving_key, keys.verifying_key.clone()).unwrap();
    assert_eq!(bundle.circuit, "gci_threshold");

    let valid = groth16_verify_proof(
        bundle.circuit,
        bundle.proof,
        bundle.verifying_key,
        bundle.public_inputs_json,
    )
    .unwrap();
    assert!(valid);
}

#[test]
fn test_groth16_score_below_threshold_fails() {
    let keys = groth16_generate_keys("gci_threshold".to_string()).unwrap();
    let err = groth16_prove_gci_threshold(50, 70, keys.proving_key, keys.verifying_key);
    assert!(err.is_err());
}

#[test]
fn test_groth16_gh_gold_origin_profile_roundtrip() {
    use ark_serialize::CanonicalSerialize;

    let profile = gtcx_zkp::gh_gold_origin_profile();
    let sample = gtcx_zkp::sample_commodity_origin_for_profile(&profile).unwrap();

    let mut merkle_bytes = Vec::new();
    sample
        .merkle_path
        .serialize_compressed(&mut merkle_bytes)
        .unwrap();
    let merkle_path_hex = hex::encode(merkle_bytes);

    let keys = groth16_generate_keys("commodity_origin".to_string()).unwrap();

    let bundle = groth16_prove_commodity_origin_profile(
        profile.profile_id.to_string(),
        hex::encode(sample.mine_id),
        sample.lat as i64,
        sample.lon as i64,
        sample.primary_metric as i64,
        sample.secondary_metric as i64,
        hex::encode(sample.primary_randomness),
        hex::encode(sample.secondary_randomness),
        hex::encode(sample.location_randomness),
        sample.certification_flags as i64,
        merkle_path_hex,
        keys.proving_key,
        keys.verifying_key.clone(),
    )
    .unwrap();

    assert_eq!(bundle.circuit, "commodity_origin");
    assert_eq!(bundle.profile_id.as_deref(), Some(profile.profile_id));

    let valid = groth16_verify_proof(
        bundle.circuit,
        bundle.proof,
        bundle.verifying_key,
        bundle.public_inputs_json,
    )
    .unwrap();
    assert!(valid);
}

#[test]
fn test_groth16_profile_unknown_id_fails() {
    let keys = groth16_generate_keys("commodity_origin".to_string()).unwrap();
    let err = groth16_prove_commodity_origin_profile(
        "unknown-profile".to_string(),
        "07".repeat(32),
        0,
        0,
        995,
        1000,
        "14".repeat(32),
        "15".repeat(32),
        "16".repeat(32),
        4,
        "00".repeat(8),
        keys.proving_key,
        keys.verifying_key,
    );
    assert!(err.is_err());
}

#[test]
fn test_groth16_profile_cert_mask_fails() {
    let profile = gtcx_zkp::gh_gold_origin_profile();
    let sample = gtcx_zkp::sample_commodity_origin_for_profile(&profile).unwrap();
    let keys = groth16_generate_keys("commodity_origin".to_string()).unwrap();

    let err = groth16_prove_commodity_origin_profile(
        profile.profile_id.to_string(),
        hex::encode(sample.mine_id),
        sample.lat as i64,
        sample.lon as i64,
        sample.primary_metric as i64,
        sample.secondary_metric as i64,
        hex::encode(sample.primary_randomness),
        hex::encode(sample.secondary_randomness),
        hex::encode(sample.location_randomness),
        0,
        "00".repeat(8),
        keys.proving_key,
        keys.verifying_key,
    );
    assert!(err.is_err());
}

// ── Bulletproofs ──

#[test]
fn test_bulletproofs_amount_range_roundtrip() {
    let randomness = "ab".repeat(32); // 32 bytes
    let bundle = bulletproofs_prove_amount_range(500, 100, 1000, randomness).unwrap();
    assert_eq!(bundle.min, 100);
    assert_eq!(bundle.max, 1000);

    let valid = bulletproofs_verify_amount_range(
        bundle.min,
        bundle.max,
        bundle.commitment,
        bundle.proof_low,
        bundle.proof_high,
    )
    .unwrap();
    assert!(valid);
}

#[test]
fn test_bulletproofs_out_of_range_fails() {
    let randomness = "cd".repeat(32);
    let err = bulletproofs_prove_amount_range(50, 100, 1000, randomness);
    assert!(err.is_err());
}

// ── Schnorr ──

#[test]
fn test_schnorr_identity_roundtrip() {
    let subject_hash = "ef".repeat(32); // 32 bytes
    let bundle = schnorr_prove_identity_attribute(b"John Doe".to_vec(), subject_hash).unwrap();

    let valid = schnorr_verify_identity_attribute(
        bundle.attribute_hash,
        bundle.subject_hash,
        bundle.nonce_commitment,
        bundle.response,
    )
    .unwrap();
    assert!(valid);
}

#[test]
fn test_schnorr_tampered_response_fails() {
    let subject_hash = "ab".repeat(32);
    let bundle = schnorr_prove_identity_attribute(b"Jane Doe".to_vec(), subject_hash).unwrap();

    // Tamper with response
    let tampered_response = "00".repeat(32);
    let result = schnorr_verify_identity_attribute(
        bundle.attribute_hash,
        bundle.subject_hash,
        bundle.nonce_commitment,
        tampered_response,
    );
    // Either returns false or errors — both acceptable
    if let Ok(valid) = result {
        assert!(!valid);
    }
}

// ── Version ──

#[test]
fn test_version() {
    let v = version();
    assert!(!v.is_empty());
    assert!(v.contains('.'));
}
