//! Schnorr identity attribute proofs.

use crate::error::{Result, ZkpError};
use crate::types::{COMMITMENT_BYTES, DIGEST_BYTES, ristretto_point_from_bytes, SchnorrIdentityProofBundle, zk_rng};
use curve25519_dalek::constants::RISTRETTO_BASEPOINT_POINT;
use curve25519_dalek::ristretto::RistrettoPoint;
use curve25519_dalek::scalar::Scalar;
use gtcx_crypto::hashing::sha256;
use tracing::instrument;

fn attribute_scalar(attribute: &[u8]) -> Scalar {
    Scalar::from_bytes_mod_order(sha256(attribute))
}

fn schnorr_challenge(
    nonce: &RistrettoPoint,
    public_key: &RistrettoPoint,
    subject_hash: &[u8; DIGEST_BYTES],
) -> Scalar {
    let mut input = Vec::with_capacity(COMMITMENT_BYTES * 2 + DIGEST_BYTES + 24);
    input.extend_from_slice(b"gtcx.schnorr.identity");
    input.extend_from_slice(nonce.compress().as_bytes());
    input.extend_from_slice(public_key.compress().as_bytes());
    input.extend_from_slice(subject_hash);
    Scalar::from_bytes_mod_order(sha256(&input))
}

/// Derive the public attribute hash (commitment) from an attribute value.
pub fn schnorr_attribute_hash(attribute: &[u8]) -> Result<[u8; COMMITMENT_BYTES]> {
    if attribute.is_empty() {
        return Err(ZkpError::InvalidWitness {
            reason: "attribute value is empty".to_string(),
        });
    }
    let secret = attribute_scalar(attribute);
    Ok((RISTRETTO_BASEPOINT_POINT * secret).compress().to_bytes())
}

/// Generate a Schnorr proof that an attribute value corresponds to a public hash.
#[instrument(skip_all)]
pub fn schnorr_prove_identity_attribute(
    attribute: &[u8],
    subject_hash: [u8; DIGEST_BYTES],
) -> Result<SchnorrIdentityProofBundle> {
    if attribute.is_empty() {
        return Err(ZkpError::InvalidWitness {
            reason: "attribute value is empty".to_string(),
        });
    }

    let secret = attribute_scalar(attribute);
    let public_key = RISTRETTO_BASEPOINT_POINT * secret;
    let attribute_hash = public_key.compress().to_bytes();

    let mut rng = zk_rng();
    let nonce = Scalar::random(&mut rng);
    let nonce_point = RISTRETTO_BASEPOINT_POINT * nonce;
    let challenge = schnorr_challenge(&nonce_point, &public_key, &subject_hash);
    let response = nonce + challenge * secret;

    Ok(SchnorrIdentityProofBundle {
        attribute_hash,
        subject_hash,
        nonce_commitment: nonce_point.compress().to_bytes(),
        response: response.to_bytes(),
    })
}

/// Verify a Schnorr identity attribute proof bundle.
#[instrument(skip_all)]
pub fn schnorr_verify_identity_attribute(bundle: &SchnorrIdentityProofBundle) -> Result<bool> {
    let public_key = ristretto_point_from_bytes(bundle.attribute_hash)?;
    let nonce_point = ristretto_point_from_bytes(bundle.nonce_commitment)?;
    let response = Scalar::from_canonical_bytes(bundle.response);
    let response = Option::<Scalar>::from(response).ok_or(ZkpError::InvalidProofFormat {
        reason: "invalid Schnorr response scalar".to_string(),
    })?;

    let challenge = schnorr_challenge(&nonce_point, &public_key, &bundle.subject_hash);
    let lhs = RISTRETTO_BASEPOINT_POINT * response;
    let rhs = nonce_point + public_key * challenge;

    Ok(lhs == rhs)
}
