#[cfg(test)]
mod tests {
    use crate::commitment::{commit, generate_proof, prove_and_verify, verify_proof};
    use crate::bulletproofs::{bulletproofs_prove_amount_range, bulletproofs_verify_amount_range};
    use crate::error::ZkpError;
    use crate::groth16::{
        groth16_generate_keys, groth16_prove_gci_threshold, groth16_verify,
        sample_asset_ownership, sample_location_region,
        AssetOwnershipCircuit, LocationRegionCircuit,
    };
    use crate::schnorr::{
        schnorr_attribute_hash, schnorr_prove_identity_attribute, schnorr_verify_identity_attribute,
    };
    use crate::types::{
        CircuitType, Groth16CircuitType, MAX_WITNESS_SIZE, Proof, PublicInputs, Witness,
        DIGEST_BYTES,
    };
    use ark_bn254::Fr;
    use ark_relations::r1cs::{ConstraintSystem, ConstraintSynthesizer};

    fn test_salt() -> [u8; 32] {
        let mut salt = [0u8; 32];
        for (i, byte) in salt.iter_mut().enumerate() {
            *byte = (i as u8).wrapping_mul(7).wrapping_add(42);
        }
        salt
    }

    fn test_salt_2() -> [u8; 32] {
        let mut salt = [0u8; 32];
        for (i, byte) in salt.iter_mut().enumerate() {
            *byte = (i as u8).wrapping_mul(13).wrapping_add(99);
        }
        salt
    }

    // ── Error display ──

    #[test]
    fn test_error_display_empty_witness() {
        let err = ZkpError::EmptyWitness;
        assert_eq!(err.to_string(), "Witness cannot be empty");
    }

    #[test]
    fn test_error_display_witness_too_large() {
        let err = ZkpError::WitnessToLarge {
            size: 2_000_000,
            max: MAX_WITNESS_SIZE,
        };
        assert!(err.to_string().contains("2000000"));
    }

    #[test]
    fn test_error_display_unsupported_circuit() {
        let err = ZkpError::UnsupportedCircuit("foobar".to_string());
        assert!(err.to_string().contains("foobar"));
    }

    #[test]
    fn test_error_display_invalid_witness() {
        let err = ZkpError::InvalidWitness {
            reason: "score below threshold".to_string(),
        };
        assert!(err.to_string().contains("score below threshold"));
    }

    // ── CircuitType ──

    #[test]
    fn test_circuit_type_tag_roundtrip() {
        for ct in [
            CircuitType::Compliance,
            CircuitType::Provenance,
            CircuitType::Quality,
            CircuitType::Identity,
        ] {
            let tag = ct.to_tag();
            let parsed = CircuitType::from_tag(tag).unwrap();
            assert_eq!(ct, parsed);
        }
    }

    #[test]
    fn test_circuit_type_invalid_tag() {
        assert!(CircuitType::from_tag(0x00).is_err());
        assert!(CircuitType::from_tag(0xFF).is_err());
    }

    #[test]
    fn test_circuit_type_display() {
        assert_eq!(CircuitType::Compliance.to_string(), "Compliance");
        assert_eq!(CircuitType::Provenance.to_string(), "Provenance");
        assert_eq!(CircuitType::Quality.to_string(), "Quality");
        assert_eq!(CircuitType::Identity.to_string(), "Identity");
    }

    #[test]
    fn test_circuit_type_from_str() {
        assert_eq!(
            "compliance".parse::<CircuitType>().unwrap(),
            CircuitType::Compliance
        );
        assert_eq!(
            "PROVENANCE".parse::<CircuitType>().unwrap(),
            CircuitType::Provenance
        );
        assert_eq!(
            "Quality".parse::<CircuitType>().unwrap(),
            CircuitType::Quality
        );
        assert!("unknown".parse::<CircuitType>().is_err());
    }

    // ── Witness ──

    #[test]
    fn test_witness_creation() {
        let w = Witness::new(CircuitType::Compliance, vec![1, 2, 3]).unwrap();
        assert_eq!(w.circuit, CircuitType::Compliance);
        assert_eq!(w.data(), &[1, 2, 3]);
    }

    #[test]
    fn test_witness_empty_rejected() {
        let err = Witness::new(CircuitType::Quality, vec![]).unwrap_err();
        assert!(matches!(err, ZkpError::EmptyWitness));
    }

    #[test]
    fn test_witness_oversized_rejected() {
        let big = vec![0u8; MAX_WITNESS_SIZE + 1];
        let err = Witness::new(CircuitType::Identity, big).unwrap_err();
        assert!(matches!(err, ZkpError::WitnessToLarge { .. }));
    }

    #[test]
    fn test_witness_max_size_accepted() {
        let data = vec![0u8; MAX_WITNESS_SIZE];
        assert!(Witness::new(CircuitType::Provenance, data).is_ok());
    }

    // ── Commitment ──

    #[test]
    fn test_commit_deterministic() {
        let w = Witness::new(CircuitType::Compliance, vec![1, 2, 3]).unwrap();
        let salt = test_salt();
        let c1 = commit(&w, &salt);
        let c2 = commit(&w, &salt);
        assert_eq!(c1, c2);
    }

    #[test]
    fn test_commit_different_salt() {
        let w = Witness::new(CircuitType::Compliance, vec![1, 2, 3]).unwrap();
        let c1 = commit(&w, &test_salt());
        let c2 = commit(&w, &test_salt_2());
        assert_ne!(c1, c2);
    }

    #[test]
    fn test_commit_different_witness() {
        let salt = test_salt();
        let w1 = Witness::new(CircuitType::Compliance, vec![1, 2, 3]).unwrap();
        let w2 = Witness::new(CircuitType::Compliance, vec![4, 5, 6]).unwrap();
        assert_ne!(commit(&w1, &salt), commit(&w2, &salt));
    }

    #[test]
    fn test_commit_different_circuit() {
        let salt = test_salt();
        let w1 = Witness::new(CircuitType::Compliance, vec![1, 2, 3]).unwrap();
        let w2 = Witness::new(CircuitType::Identity, vec![1, 2, 3]).unwrap();
        assert_ne!(commit(&w1, &salt), commit(&w2, &salt));
    }

    // ── Proof generation + verification ──

    #[test]
    fn test_generate_and_verify_compliance() {
        let w = Witness::new(CircuitType::Compliance, b"secret-data".to_vec()).unwrap();
        let salt = test_salt();
        let proof = prove_and_verify(&w, &salt).unwrap();
        assert_eq!(proof.circuit, CircuitType::Compliance);
    }

    #[test]
    fn test_generate_and_verify_all_circuits() {
        for ct in [
            CircuitType::Compliance,
            CircuitType::Provenance,
            CircuitType::Quality,
            CircuitType::Identity,
        ] {
            let w = Witness::new(ct, b"test-witness".to_vec()).unwrap();
            let salt = test_salt();
            assert!(prove_and_verify(&w, &salt).is_ok(), "Failed for {ct}");
        }
    }

    #[test]
    fn test_verify_wrong_commitment_fails() {
        let w = Witness::new(CircuitType::Compliance, b"data".to_vec()).unwrap();
        let salt = test_salt();
        let proof = generate_proof(&w, &salt);

        let bad_inputs = PublicInputs {
            circuit: CircuitType::Compliance,
            commitment: [0xFF; 32],
        };

        assert!(verify_proof(&proof, &bad_inputs).is_err());
    }

    #[test]
    fn test_verify_wrong_circuit_fails() {
        let w = Witness::new(CircuitType::Compliance, b"data".to_vec()).unwrap();
        let salt = test_salt();
        let proof = generate_proof(&w, &salt);

        let bad_inputs = PublicInputs {
            circuit: CircuitType::Identity, // wrong circuit
            commitment: proof.commitment,
        };

        assert!(verify_proof(&proof, &bad_inputs).is_err());
    }

    #[test]
    fn test_different_salt_different_proof() {
        let w = Witness::new(CircuitType::Quality, b"same-witness".to_vec()).unwrap();
        let p1 = generate_proof(&w, &test_salt());
        let p2 = generate_proof(&w, &test_salt_2());
        assert_ne!(p1.commitment, p2.commitment);
    }

    // ── Proof serialization ──

    #[test]
    fn test_proof_serialization_roundtrip() {
        let w = Witness::new(CircuitType::Provenance, b"witness-data".to_vec()).unwrap();
        let salt = test_salt();
        let proof = generate_proof(&w, &salt);

        let bytes = proof.to_bytes().unwrap();
        let deserialized = Proof::from_bytes(&bytes).unwrap();

        assert_eq!(proof.circuit, deserialized.circuit);
        assert_eq!(proof.commitment, deserialized.commitment);
        assert_eq!(proof.proof_data(), deserialized.proof_data());
    }

    #[test]
    fn test_proof_deserialization_too_short() {
        let err = Proof::from_bytes(&[0u8; 10]).unwrap_err();
        assert!(matches!(err, ZkpError::InvalidProofFormat { .. }));
    }

    #[test]
    fn test_proof_deserialization_invalid_circuit_tag() {
        let mut bytes = vec![0xFF]; // invalid tag
        bytes.extend_from_slice(&[0u8; 36]); // commitment + length
        let err = Proof::from_bytes(&bytes).unwrap_err();
        assert!(matches!(err, ZkpError::UnsupportedCircuit(_)));
    }

    #[test]
    fn test_proof_deserialization_truncated_proof_data() {
        let w = Witness::new(CircuitType::Quality, b"data".to_vec()).unwrap();
        let proof = generate_proof(&w, &test_salt());
        let bytes = proof.to_bytes().unwrap();

        // Truncate: cut off last 10 bytes
        let truncated = &bytes[..bytes.len() - 10];
        let err = Proof::from_bytes(truncated).unwrap_err();
        assert!(matches!(err, ZkpError::InvalidProofFormat { .. }));
    }

    // ── JSON serde ──

    #[test]
    fn test_proof_json_roundtrip() {
        let w = Witness::new(CircuitType::Identity, b"json-test".to_vec()).unwrap();
        let proof = generate_proof(&w, &test_salt());

        let json = serde_json::to_string(&proof).unwrap();
        let deserialized: Proof = serde_json::from_str(&json).unwrap();

        assert_eq!(proof.circuit, deserialized.circuit);
        assert_eq!(proof.commitment, deserialized.commitment);
    }

    #[test]
    fn test_public_inputs_json_roundtrip() {
        let inputs = PublicInputs {
            circuit: CircuitType::Compliance,
            commitment: [42u8; 32],
        };
        let json = serde_json::to_string(&inputs).unwrap();
        let deserialized: PublicInputs = serde_json::from_str(&json).unwrap();
        assert_eq!(inputs.circuit, deserialized.circuit);
        assert_eq!(inputs.commitment, deserialized.commitment);
    }

    // ── Bulletproofs (Amount Range) ──

    #[test]
    fn test_bulletproofs_amount_range_valid() {
        let bundle = bulletproofs_prove_amount_range(55, 10, 100, [7u8; 32]).unwrap();
        assert!(bulletproofs_verify_amount_range(&bundle).unwrap());
    }

    #[test]
    fn test_bulletproofs_amount_range_outside_bounds_rejected() {
        let err = bulletproofs_prove_amount_range(5, 10, 100, [7u8; 32]).unwrap_err();
        assert!(matches!(err, ZkpError::InvalidWitness { .. }));
    }

    #[test]
    fn test_bulletproofs_amount_range_tamper_fails() {
        let bundle = bulletproofs_prove_amount_range(42, 10, 100, [7u8; 32]).unwrap();
        assert!(bulletproofs_verify_amount_range(&bundle).unwrap());

        let mut tampered = bundle.clone();
        tampered.commitment[0] ^= 0xFF;
        assert!(matches!(
            bulletproofs_verify_amount_range(&tampered),
            Ok(false) | Err(_)
        ));
    }

    // ── Schnorr (Identity Attribute) ──

    #[test]
    fn test_schnorr_identity_attribute_valid() {
        let subject_hash = [3u8; 32];
        let bundle = schnorr_prove_identity_attribute(b"citizenship:GTX", subject_hash).unwrap();
        assert!(schnorr_verify_identity_attribute(&bundle).unwrap());
        assert_eq!(
            schnorr_attribute_hash(b"citizenship:GTX").unwrap(),
            bundle.attribute_hash
        );
    }

    #[test]
    fn test_schnorr_identity_attribute_empty_rejected() {
        let err = schnorr_prove_identity_attribute(b"", [0u8; 32]).unwrap_err();
        assert!(matches!(err, ZkpError::InvalidWitness { .. }));
    }

    #[test]
    fn test_schnorr_identity_attribute_tamper_fails() {
        let subject_hash = [9u8; 32];
        let bundle = schnorr_prove_identity_attribute(b"role:validator", subject_hash).unwrap();
        assert!(schnorr_verify_identity_attribute(&bundle).unwrap());

        let mut tampered = bundle.clone();
        tampered.response[0] ^= 0xFF;
        assert!(matches!(
            schnorr_verify_identity_attribute(&tampered),
            Ok(false) | Err(_)
        ));
    }

    // ── Groth16 (GCI threshold) ──

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
}
