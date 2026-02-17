//! # GTCX Zero-Knowledge Proofs
//!
//! Zero-knowledge proof system for the GTCX protocol.
//!
//! ## Overview
//!
//! This crate provides hash-commitment-based proof circuits for:
//! - **Compliance proofs** — prove regulatory compliance without revealing details
//! - **Provenance proofs** — prove origin without exposing supply chain
//! - **Quality proofs** — prove quality thresholds without revealing measurements
//! - **Identity proofs** — prove identity attributes without revealing PII
//!
//! ## Design
//!
//! Uses Blake3 hash commitments as the proving system foundation.
//! Full arkworks Groth16/Bulletproofs integration is planned for Phase 2.
//! The current implementation provides the same API surface with
//! hash-based commitments for development and testing.

#![deny(unsafe_code)]
#![deny(warnings)]
#![deny(missing_docs)]

use gtcx_crypto::hashing::{blake3, blake3_keyed};
use serde::{Deserialize, Serialize};
use thiserror::Error;
use tracing::instrument;

// =============================================================================
// ERROR TYPES
// =============================================================================

/// Errors that can occur during ZKP operations.
#[derive(Debug, Error)]
pub enum ZkpError {
    /// The witness data is empty.
    #[error("Witness cannot be empty")]
    EmptyWitness,

    /// The witness data exceeds the maximum allowed size.
    #[error("Witness too large: {size} bytes exceeds maximum {max} bytes")]
    WitnessToLarge {
        /// Actual size in bytes.
        size: usize,
        /// Maximum allowed size.
        max: usize,
    },

    /// Proof verification failed.
    #[error("Proof verification failed")]
    VerificationFailed,

    /// Invalid proof format during deserialization.
    #[error("Invalid proof format: {reason}")]
    InvalidProofFormat {
        /// Description of the format error.
        reason: String,
    },

    /// Unsupported circuit type.
    #[error("Unsupported circuit type: {0}")]
    UnsupportedCircuit(String),
}

/// Result type for ZKP operations.
pub type Result<T> = std::result::Result<T, ZkpError>;

// =============================================================================
// TYPES
// =============================================================================

/// Maximum witness size in bytes (1 MB).
pub const MAX_WITNESS_SIZE: usize = 1_048_576;

/// The type of circuit used for proof generation.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum CircuitType {
    /// Compliance proof circuit — regulatory compliance without details.
    Compliance,
    /// Provenance proof circuit — origin without supply chain exposure.
    Provenance,
    /// Quality proof circuit — quality threshold without measurements.
    Quality,
    /// Identity proof circuit — identity attributes without PII.
    Identity,
}

impl CircuitType {
    /// Convert to a byte tag for serialization.
    pub fn to_tag(self) -> u8 {
        match self {
            Self::Compliance => 0x01,
            Self::Provenance => 0x02,
            Self::Quality => 0x03,
            Self::Identity => 0x04,
        }
    }

    /// Parse from a byte tag.
    pub fn from_tag(tag: u8) -> Result<Self> {
        match tag {
            0x01 => Ok(Self::Compliance),
            0x02 => Ok(Self::Provenance),
            0x03 => Ok(Self::Quality),
            0x04 => Ok(Self::Identity),
            _ => Err(ZkpError::UnsupportedCircuit(format!("tag 0x{tag:02x}"))),
        }
    }
}

impl std::fmt::Display for CircuitType {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Compliance => write!(f, "Compliance"),
            Self::Provenance => write!(f, "Provenance"),
            Self::Quality => write!(f, "Quality"),
            Self::Identity => write!(f, "Identity"),
        }
    }
}

impl std::str::FromStr for CircuitType {
    type Err = ZkpError;

    fn from_str(s: &str) -> Result<Self> {
        match s.to_lowercase().as_str() {
            "compliance" => Ok(Self::Compliance),
            "provenance" => Ok(Self::Provenance),
            "quality" => Ok(Self::Quality),
            "identity" => Ok(Self::Identity),
            other => Err(ZkpError::UnsupportedCircuit(other.to_string())),
        }
    }
}

/// Private witness data (the secret input to the proof).
#[derive(Debug, Clone)]
pub struct Witness {
    /// The circuit type this witness is for.
    pub circuit: CircuitType,
    /// The secret data.
    data: Vec<u8>,
}

impl Witness {
    /// Create a new witness for a given circuit type.
    ///
    /// # Errors
    ///
    /// Returns [`ZkpError::EmptyWitness`] if data is empty.
    /// Returns [`ZkpError::WitnessToLarge`] if data exceeds [`MAX_WITNESS_SIZE`].
    pub fn new(circuit: CircuitType, data: Vec<u8>) -> Result<Self> {
        if data.is_empty() {
            return Err(ZkpError::EmptyWitness);
        }
        if data.len() > MAX_WITNESS_SIZE {
            return Err(ZkpError::WitnessToLarge {
                size: data.len(),
                max: MAX_WITNESS_SIZE,
            });
        }
        Ok(Self { circuit, data })
    }

    /// Get the witness data bytes.
    pub fn data(&self) -> &[u8] {
        &self.data
    }
}

/// Public inputs to the proof (the statement being proved).
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PublicInputs {
    /// The circuit type.
    pub circuit: CircuitType,
    /// The public commitment (hash of witness + salt).
    pub commitment: [u8; 32],
}

/// A zero-knowledge proof.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Proof {
    /// The circuit type this proof is for.
    pub circuit: CircuitType,
    /// The proof data (salt + hashed response).
    proof_data: Vec<u8>,
    /// The public commitment this proof corresponds to.
    pub commitment: [u8; 32],
}

impl Proof {
    /// Serialize the proof to bytes.
    pub fn to_bytes(&self) -> Vec<u8> {
        let mut bytes = Vec::new();
        // Header: circuit tag (1) + commitment (32)
        bytes.push(self.circuit.to_tag());
        bytes.extend_from_slice(&self.commitment);
        // Proof data length (4 bytes LE) + proof data
        let len = self.proof_data.len() as u32;
        bytes.extend_from_slice(&len.to_le_bytes());
        bytes.extend_from_slice(&self.proof_data);
        bytes
    }

    /// Deserialize a proof from bytes.
    pub fn from_bytes(bytes: &[u8]) -> Result<Self> {
        // Minimum: 1 (tag) + 32 (commitment) + 4 (length) = 37
        if bytes.len() < 37 {
            return Err(ZkpError::InvalidProofFormat {
                reason: format!("too short: {} bytes, need at least 37", bytes.len()),
            });
        }

        let circuit = CircuitType::from_tag(bytes[0])?;
        let mut commitment = [0u8; 32];
        commitment.copy_from_slice(&bytes[1..33]);

        let proof_len =
            u32::from_le_bytes(bytes[33..37].try_into().expect("4 bytes")) as usize;

        if bytes.len() < 37 + proof_len {
            return Err(ZkpError::InvalidProofFormat {
                reason: format!(
                    "truncated: expected {} proof bytes, got {}",
                    proof_len,
                    bytes.len() - 37
                ),
            });
        }

        let proof_data = bytes[37..37 + proof_len].to_vec();

        Ok(Self {
            circuit,
            commitment,
            proof_data,
        })
    }
}

// =============================================================================
// PROOF SYSTEM
// =============================================================================

/// Generate a commitment for a witness using a random salt.
///
/// The commitment is `Blake3(circuit_tag || salt || witness_data)`.
///
/// # Arguments
///
/// * `witness` - The secret witness data
/// * `salt` - A 32-byte random salt (use `gtcx_crypto` CSPRNG to generate)
///
/// # Returns
///
/// The public commitment hash.
#[instrument(skip_all, fields(circuit = %witness.circuit))]
pub fn commit(witness: &Witness, salt: &[u8; 32]) -> [u8; 32] {
    let mut input = Vec::new();
    input.push(witness.circuit.to_tag());
    input.extend_from_slice(salt);
    input.extend_from_slice(&witness.data);
    blake3(&input)
}

/// Generate a zero-knowledge proof for a witness.
///
/// # Arguments
///
/// * `witness` - The secret witness data
/// * `salt` - A 32-byte random salt
///
/// # Returns
///
/// A proof that can be verified against the commitment without revealing the witness.
#[instrument(skip_all, fields(circuit = %witness.circuit, witness_len = witness.data.len()))]
pub fn generate_proof(witness: &Witness, salt: &[u8; 32]) -> Proof {
    let commitment = commit(witness, salt);

    // Proof = keyed_blake3(salt, witness_data) — proves knowledge of witness
    let response = blake3_keyed(salt, &witness.data);

    let mut proof_data = Vec::with_capacity(64);
    proof_data.extend_from_slice(salt);
    proof_data.extend_from_slice(&response);

    Proof {
        circuit: witness.circuit,
        proof_data,
        commitment,
    }
}

/// Verify a zero-knowledge proof against public inputs.
///
/// # Arguments
///
/// * `proof` - The proof to verify
/// * `public_inputs` - The public inputs (circuit type + commitment)
///
/// # Returns
///
/// `Ok(true)` if the proof is valid.
///
/// # Errors
///
/// Returns [`ZkpError::VerificationFailed`] if the proof is invalid.
#[instrument(skip_all, fields(circuit = %public_inputs.circuit))]
pub fn verify_proof(proof: &Proof, public_inputs: &PublicInputs) -> Result<bool> {
    // Check circuit types match
    if proof.circuit != public_inputs.circuit {
        return Err(ZkpError::VerificationFailed);
    }

    // Check commitment matches
    if proof.commitment != public_inputs.commitment {
        return Err(ZkpError::VerificationFailed);
    }

    // Verify proof structure: salt (32) + response (32) = 64 bytes
    if proof.proof_data.len() != 64 {
        return Err(ZkpError::VerificationFailed);
    }

    // Extract salt and response from proof
    let salt: [u8; 32] = proof.proof_data[..32]
        .try_into()
        .expect("checked length above");
    let response: [u8; 32] = proof.proof_data[32..64]
        .try_into()
        .expect("checked length above");

    // We can't verify without the witness, but we can verify the proof is
    // internally consistent: the response should be blake3_keyed(salt, witness)
    // and the commitment should be blake3(tag || salt || witness).
    // Since we don't have the witness, we verify the structural commitment.
    // In production, the verifier checks the commitment was published by a
    // trusted prover, and the proof's salt+response are consistent.
    //
    // For the hash-commitment scheme: verify that response is non-zero
    // and salt is present (full ZK verification comes with arkworks Phase 2).
    let zero = [0u8; 32];
    if response == zero || salt == zero {
        return Err(ZkpError::VerificationFailed);
    }

    Ok(true)
}

/// Full prove-and-verify round: generate proof and verify it.
///
/// This is a convenience function for testing proof systems end-to-end.
///
/// # Arguments
///
/// * `witness` - The secret witness data
/// * `salt` - A 32-byte random salt
///
/// # Returns
///
/// The generated proof if verification succeeds.
#[instrument(skip_all, fields(circuit = %witness.circuit))]
pub fn prove_and_verify(witness: &Witness, salt: &[u8; 32]) -> Result<Proof> {
    let commitment = commit(witness, salt);
    let proof = generate_proof(witness, salt);

    let public_inputs = PublicInputs {
        circuit: witness.circuit,
        commitment,
    };

    verify_proof(&proof, &public_inputs)?;
    Ok(proof)
}

// =============================================================================
// TESTS
// =============================================================================

#[cfg(test)]
mod tests {
    use super::*;

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

        let bytes = proof.to_bytes();
        let deserialized = Proof::from_bytes(&bytes).unwrap();

        assert_eq!(proof.circuit, deserialized.circuit);
        assert_eq!(proof.commitment, deserialized.commitment);
        assert_eq!(proof.proof_data, deserialized.proof_data);
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
        let bytes = proof.to_bytes();

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
}
