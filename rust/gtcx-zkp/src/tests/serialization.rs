use super::test_salt;
use crate::commitment::generate_proof;
use crate::error::ZkpError;
use crate::types::{CircuitType, Proof, PublicInputs, Witness};

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
