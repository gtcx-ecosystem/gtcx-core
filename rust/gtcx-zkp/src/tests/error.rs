use crate::error::ZkpError;
use crate::types::MAX_WITNESS_SIZE;

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
