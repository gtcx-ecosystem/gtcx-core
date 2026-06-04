//! Trusted-setup transcript verification tests.
//!
//! Run with: cargo test --features trusted-setup-verify

use crate::trusted_setup::{
    default_kat_dir, default_transcript_path, groth16_generate_keys_from_seed,
    verify_groth16_kat_pins, verify_trusted_setup_vk, vk_hash, TrustedSetupTranscript,
};
use crate::types::Groth16CircuitType;
use std::io::Write;

#[test]
fn deterministic_seed_produces_same_vk_hash() {
    let seed = [0xABu8; 32];
    let keys1 = groth16_generate_keys_from_seed(Groth16CircuitType::GciThreshold, seed).unwrap();
    let keys2 = groth16_generate_keys_from_seed(Groth16CircuitType::GciThreshold, seed).unwrap();
    assert_eq!(
        vk_hash(&keys1.verifying_key),
        vk_hash(&keys2.verifying_key),
        "same seed must produce identical VK hash"
    );
}

#[test]
fn different_seeds_produce_different_vk_hashes() {
    let seed_a = [0xABu8; 32];
    let seed_b = [0xCDu8; 32];
    let keys_a = groth16_generate_keys_from_seed(Groth16CircuitType::GciThreshold, seed_a).unwrap();
    let keys_b = groth16_generate_keys_from_seed(Groth16CircuitType::GciThreshold, seed_b).unwrap();
    assert_ne!(
        vk_hash(&keys_a.verifying_key),
        vk_hash(&keys_b.verifying_key),
        "different seeds must produce different VK hashes"
    );
}

#[test]
fn all_circuit_types_are_deterministic() {
    let seed = [0x42u8; 32];
    for circuit in [
        Groth16CircuitType::GciThreshold,
        Groth16CircuitType::AssetOwnership,
        Groth16CircuitType::LocationRegion,
        Groth16CircuitType::CommodityOrigin,
    ] {
        let keys1 = groth16_generate_keys_from_seed(circuit, seed).unwrap();
        let keys2 = groth16_generate_keys_from_seed(circuit, seed).unwrap();
        assert_eq!(
            vk_hash(&keys1.verifying_key),
            vk_hash(&keys2.verifying_key),
            "circuit {:?} must be deterministic",
            circuit
        );
    }
}

#[test]
fn transcript_from_file_reads_32_byte_seed() {
    let mut tmp = tempfile::NamedTempFile::new().unwrap();
    let seed = [0x12u8; 32];
    tmp.write_all(&seed).unwrap();

    let transcript = TrustedSetupTranscript::from_file(tmp.path()).unwrap();
    assert_eq!(transcript.seed, seed);
}

#[test]
fn transcript_from_file_rejects_wrong_size() {
    let mut tmp = tempfile::NamedTempFile::new().unwrap();
    tmp.write_all(&[0u8; 31]).unwrap();

    let result = TrustedSetupTranscript::from_file(tmp.path());
    assert!(result.is_err(), "31-byte file must be rejected");
}

#[test]
fn end_to_end_mock_transcript_verification() {
    // Create a mock transcript (32-byte seed)
    let mut tmp = tempfile::NamedTempFile::new().unwrap();
    let seed = [0x99u8; 32];
    tmp.write_all(&seed).unwrap();

    // Pre-compute the expected VK hash for this seed + circuit
    let keys = groth16_generate_keys_from_seed(Groth16CircuitType::GciThreshold, seed).unwrap();
    let expected_hash = vk_hash(&keys.verifying_key);

    // Verify the end-to-end check passes
    let valid =
        verify_trusted_setup_vk(Groth16CircuitType::GciThreshold, tmp.path(), &expected_hash)
            .unwrap();
    assert!(valid, "mock transcript must verify against pre-computed hash");

    // Verify wrong hash is rejected
    let wrong_hash = "0000000000000000000000000000000000000000000000000000000000000000";
    let invalid =
        verify_trusted_setup_vk(Groth16CircuitType::GciThreshold, tmp.path(), wrong_hash).unwrap();
    assert!(!invalid, "wrong hash must be rejected");
}

#[test]
fn end_to_end_all_circuits_with_mock_transcript() {
    let mut tmp = tempfile::NamedTempFile::new().unwrap();
    let seed = [0x77u8; 32];
    tmp.write_all(&seed).unwrap();

    for circuit in [
        Groth16CircuitType::GciThreshold,
        Groth16CircuitType::AssetOwnership,
        Groth16CircuitType::LocationRegion,
        Groth16CircuitType::CommodityOrigin,
    ] {
        let keys = groth16_generate_keys_from_seed(circuit, seed).unwrap();
        let expected_hash = vk_hash(&keys.verifying_key);
        let valid = verify_trusted_setup_vk(circuit, tmp.path(), &expected_hash).unwrap();
        assert!(valid, "circuit {:?} must verify with mock transcript", circuit);
    }
}

/// Release gate: runs when `artifacts/trusted-setup/transcript.seed` exists (Class R publish).
#[test]
fn groth16_kat_pins_match_published_transcript() {
    let transcript = default_transcript_path();
    if !transcript.exists() {
        eprintln!(
            "skip groth16_kat_pins_match_published_transcript: {}",
            transcript.display()
        );
        return;
    }
    let mismatches = verify_groth16_kat_pins(&transcript, &default_kat_dir()).unwrap();
    assert!(
        mismatches.is_empty(),
        "KAT vk_hash pin failures: {:?}",
        mismatches
    );
}
