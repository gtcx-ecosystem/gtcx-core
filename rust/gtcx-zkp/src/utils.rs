//! Shared utility helpers for ZKP modules.

use std::io::Cursor;

use ark_bn254::Fr;
use ark_crypto_primitives::crh::sha256::Sha256;
use ark_crypto_primitives::crh::{CRHScheme, TwoToOneCRHScheme};
use ark_r1cs_std::boolean::Boolean;
use ark_r1cs_std::uint64::UInt64;
use ark_r1cs_std::uint8::UInt8;
use ark_r1cs_std::ToBitsGadget;
use ark_relations::r1cs::SynthesisError;
use ark_serialize::{CanonicalDeserialize, CanonicalSerialize};
use ark_std::rand::{rngs::StdRng, RngCore, SeedableRng};
use curve25519_dalek::ristretto::{CompressedRistretto, RistrettoPoint};
use gtcx_crypto::hashing::sha256;

use crate::error::{Result, ZkpError};
use crate::types::{COMMITMENT_BYTES, DIGEST_BYTES};

pub(crate) fn serialize<T: CanonicalSerialize>(value: &T) -> Result<Vec<u8>> {
    let mut bytes = Vec::new();
    value
        .serialize_compressed(&mut bytes)
        .map_err(|err| ZkpError::SerializationError {
            reason: err.to_string(),
        })?;
    Ok(bytes)
}

pub(crate) fn deserialize<T: CanonicalDeserialize>(bytes: &[u8]) -> Result<T> {
    let mut cursor = Cursor::new(bytes);
    T::deserialize_compressed(&mut cursor).map_err(|err| ZkpError::DeserializationError {
        reason: err.to_string(),
    })
}

pub(crate) fn map_proof_system_error(err: impl std::fmt::Display) -> ZkpError {
    ZkpError::ProofSystemError {
        reason: err.to_string(),
    }
}

pub(crate) fn zk_rng() -> StdRng {
    let mut seed = [0u8; 32];
    ark_std::rand::rngs::OsRng.fill_bytes(&mut seed);
    StdRng::from_seed(seed)
}

pub(crate) fn u64_to_fr_bits(value: u64) -> Vec<Fr> {
    (0..64).map(|i| Fr::from((value >> i) & 1)).collect()
}

pub(crate) fn bytes_to_fr_bits(bytes: &[u8]) -> Vec<Fr> {
    let mut bits = Vec::with_capacity(bytes.len() * 8);
    for byte in bytes {
        for i in 0..8 {
            bits.push(Fr::from(u64::from((byte >> i) & 1)));
        }
    }
    bits
}

pub(crate) fn u64_to_le_bytes(value: u64) -> [u8; 8] {
    value.to_le_bytes()
}

pub(crate) fn uint64_from_le_bytes(
    bytes: &[UInt8<Fr>],
) -> std::result::Result<UInt64<Fr>, SynthesisError> {
    if bytes.len() != 8 {
        return Err(SynthesisError::Unsatisfiable);
    }
    let mut bits = Vec::with_capacity(64);
    for byte in bytes {
        bits.extend(byte.to_bits_le()?);
    }
    Ok(UInt64::from_bits_le(&bits))
}

pub(crate) fn vec_to_digest(bytes: Vec<u8>) -> Result<[u8; DIGEST_BYTES]> {
    if bytes.len() != DIGEST_BYTES {
        return Err(ZkpError::InvalidWitness {
            reason: format!("digest length {} != {}", bytes.len(), DIGEST_BYTES),
        });
    }
    let mut digest = [0u8; DIGEST_BYTES];
    digest.copy_from_slice(&bytes);
    Ok(digest)
}

pub(crate) fn sha256_digest(data: &[u8]) -> Result<[u8; DIGEST_BYTES]> {
    let digest =
        <Sha256 as CRHScheme>::evaluate(&(), data).map_err(|_| ZkpError::ProofSystemError {
            reason: "sha256 evaluation failed".to_string(),
        })?;
    let mut out = [0u8; DIGEST_BYTES];
    out.copy_from_slice(&digest);
    Ok(out)
}

pub(crate) fn uint64_is_ge<F: ark_ff::Field>(
    lhs: &UInt64<F>,
    rhs: &UInt64<F>,
) -> std::result::Result<Boolean<F>, SynthesisError> {
    let lhs_bits = lhs.to_bits_le();
    let rhs_bits = rhs.to_bits_le();
    let mut greater = Boolean::constant(false);
    let mut equal = Boolean::constant(true);

    for i in (0..lhs_bits.len()).rev() {
        let l = lhs_bits[i].clone();
        let r = rhs_bits[i].clone();
        let l_and_not_r = l.and(&r.not())?;
        let greater_if_equal = equal.and(&l_and_not_r)?;
        greater = greater.or(&greater_if_equal)?;
        let bits_equal = l.xor(&r)?.not();
        equal = equal.and(&bits_equal)?;
    }

    greater.or(&equal)
}

pub(crate) fn ristretto_point_from_bytes(bytes: [u8; COMMITMENT_BYTES]) -> Result<RistrettoPoint> {
    let compressed = CompressedRistretto(bytes);
    compressed.decompress().ok_or(ZkpError::InvalidProofFormat {
        reason: "invalid compressed Ristretto point".to_string(),
    })
}
