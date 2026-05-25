use super::{test_salt, test_salt_2};
use crate::commitment::{commit, generate_proof, prove_and_verify, verify_proof};
use crate::types::{CircuitType, PublicInputs, Witness};

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
