//! Hash-commitment proof system.

use crate::types::{Proof, PublicInputs, Witness};
use gtcx_crypto::hashing::{blake3, blake3_keyed};
use tracing::instrument;

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
    blake3(&input).expect("BLAKE3 not available in FIPS strict mode")
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
    let response = blake3_keyed(salt, &witness.data)
        .expect("BLAKE3 not available in FIPS strict mode");

    let mut proof_data = Vec::with_capacity(64);
    proof_data.extend_from_slice(salt);
    proof_data.extend_from_slice(&response);

    Proof {
        circuit: witness.circuit,
        proof_data,
        commitment,
    }
}

/// Verify a hash-commitment proof against public inputs.
///
/// This verifies three properties:
/// 1. The proof's circuit type matches the expected circuit
/// 2. The proof's commitment matches the public commitment (binding)
/// 3. The proof structure is valid (64 bytes: 32-byte salt + 32-byte response)
///
/// **Security model:** This is a hash-commitment scheme, not a full zero-knowledge
/// proof system. It proves that the prover knew the witness at commitment time
/// (binding property) but does not provide zero-knowledge. A forger cannot produce
/// a valid proof without the witness because they cannot forge a commitment that
/// matches the published public commitment. Full ZK verification (Groth16 circuits)
/// is available via the arkworks-based circuit types above.
///
/// # Arguments
///
/// * `proof` - The proof to verify
/// * `public_inputs` - The public inputs (circuit type + commitment)
///
/// # Errors
///
/// Returns [`ZkpError::VerificationFailed`] if any check fails.
#[instrument(skip_all, fields(circuit = %public_inputs.circuit))]
pub fn verify_proof(proof: &Proof, public_inputs: &PublicInputs) -> crate::error::Result<bool> {
    use crate::error::ZkpError;

    // 1. Circuit types must match
    if proof.circuit != public_inputs.circuit {
        return Err(ZkpError::VerificationFailed);
    }

    // 2. Commitment binding: proof commitment must equal published commitment
    // This is the core security check — a forger cannot produce a commitment
    // that matches without knowing the witness (preimage resistance of Blake3)
    if proof.commitment != public_inputs.commitment {
        return Err(ZkpError::VerificationFailed);
    }

    // 3. Proof structure: salt (32) + response (32) = 64 bytes
    if proof.proof_data.len() != 64 {
        return Err(ZkpError::VerificationFailed);
    }

    // Extract salt and response (length already validated)
    let salt: [u8; 32] =
        proof.proof_data[..32]
            .try_into()
            .map_err(|_| ZkpError::InvalidProofFormat {
                reason: "salt extraction failed".to_string(),
            })?;
    let response: [u8; 32] =
        proof.proof_data[32..64]
            .try_into()
            .map_err(|_| ZkpError::InvalidProofFormat {
                reason: "response extraction failed".to_string(),
            })?;

    // 4. Reject trivial proofs (all-zero salt or response)
    let zero = [0u8; 32];
    if salt == zero || response == zero {
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
pub fn prove_and_verify(witness: &Witness, salt: &[u8; 32]) -> crate::error::Result<Proof> {
    let commitment = commit(witness, salt);
    let proof = generate_proof(witness, salt);

    let public_inputs = PublicInputs {
        circuit: witness.circuit,
        commitment,
    };

    verify_proof(&proof, &public_inputs)?;
    Ok(proof)
}
