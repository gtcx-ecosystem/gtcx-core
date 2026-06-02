use crate::error::ZkpError;
use crate::types::{zk_rng, CircuitType, Witness, MAX_WITNESS_SIZE};
use ark_std::rand::RngCore;

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

#[test]
fn test_zk_rng_non_deterministic() {
    let mut rng1 = zk_rng();
    let mut rng2 = zk_rng();
    let mut bytes1 = [0u8; 32];
    let mut bytes2 = [0u8; 32];
    rng1.fill_bytes(&mut bytes1);
    rng2.fill_bytes(&mut bytes2);
    assert_ne!(
        bytes1, bytes2,
        "zk_rng() must produce different seeds on each call"
    );
}
