//! FIPS-validated crypto provider using aws-lc-rs.
//!
//! Inherits FIPS 140-3 validation from AWS-LC (NIST CMVP #4816). Enabled
//! with `--features fips`. See `docs/security/fips-validation-boundary.md`
//! for the algorithm mapping and ZKP exemption rationale.
//!
//! Algorithm coverage:
//! - Ed25519 signing  → FIPS-validated via aws-lc-rs
//! - SHA-256          → FIPS-validated via aws-lc-rs
//! - SHA-512          → FIPS-validated via aws-lc-rs
//! - BLAKE3           → falls through to the blake3 crate; BLAKE3 is not
//!                      FIPS-approved at any module level. Consumers in
//!                      regulatory contexts must not use BLAKE3 for the
//!                      regulated path; it remains available for non-
//!                      regulatory artifacts (e.g., file integrity).

use aws_lc_rs::{
    digest,
    rand::{SecureRandom, SystemRandom},
    signature::{Ed25519KeyPair, KeyPair, UnparsedPublicKey, ED25519},
};

use super::{HashProvider, SigningProvider};

/// FIPS-validated Ed25519 signing provider.
///
/// All key generation, signing, and verification operations route through
/// aws-lc-rs, which inherits the FIPS 140-3 validation of AWS-LC.
pub struct AwsLcSigningProvider;

impl SigningProvider for AwsLcSigningProvider {
    fn generate_keypair(&self) -> (Vec<u8>, Vec<u8>) {
        // Generate the 32-byte Ed25519 seed directly from the FIPS-validated
        // CSPRNG (aws-lc-rs SystemRandom). We avoid PKCS#8 entirely so the
        // wire format matches DalekSigningProvider — same 32-byte private
        // scalar layout, same 32-byte public key — keeping the
        // SigningProvider trait contract uniform across backends.
        let rng = SystemRandom::new();
        let mut seed = [0u8; 32];
        rng.fill(&mut seed).expect("aws-lc-rs CSPRNG must not fail");
        let key_pair = Ed25519KeyPair::from_seed_unchecked(&seed)
            .expect("aws-lc-rs must accept a random 32-byte ed25519 seed");
        let public_key = key_pair.public_key().as_ref().to_vec();
        (seed.to_vec(), public_key)
    }

    fn sign(&self, message: &[u8], private_key: &[u8]) -> Vec<u8> {
        let seed: [u8; 32] = private_key
            .try_into()
            .expect("private key must be 32 bytes");
        let key_pair = Ed25519KeyPair::from_seed_unchecked(&seed)
            .expect("aws-lc-rs must accept a 32-byte ed25519 seed");
        key_pair.sign(message).as_ref().to_vec()
    }

    fn verify(&self, signature: &[u8], message: &[u8], public_key: &[u8]) -> bool {
        let pk = UnparsedPublicKey::new(&ED25519, public_key);
        pk.verify(message, signature).is_ok()
    }

    fn derive_public_key(&self, private_key: &[u8]) -> Vec<u8> {
        let seed: [u8; 32] = private_key
            .try_into()
            .expect("private key must be 32 bytes");
        let key_pair = Ed25519KeyPair::from_seed_unchecked(&seed)
            .expect("aws-lc-rs must accept a 32-byte ed25519 seed");
        key_pair.public_key().as_ref().to_vec()
    }
}

/// FIPS-validated hash provider.
///
/// SHA-256 and SHA-512 route through aws-lc-rs (FIPS-validated).
/// BLAKE3 routes through the blake3 crate — BLAKE3 has no FIPS-approved
/// implementation. Consumers in regulatory contexts must use sha256() /
/// sha512() for the regulated path.
pub struct AwsLcHashProvider;

impl HashProvider for AwsLcHashProvider {
    fn sha256(&self, data: &[u8]) -> [u8; 32] {
        let d = digest::digest(&digest::SHA256, data);
        let mut out = [0u8; 32];
        out.copy_from_slice(d.as_ref());
        out
    }

    fn sha512(&self, data: &[u8]) -> [u8; 64] {
        let d = digest::digest(&digest::SHA512, data);
        let mut out = [0u8; 64];
        out.copy_from_slice(d.as_ref());
        out
    }

    fn blake3(&self, data: &[u8]) -> [u8; 32] {
        // BLAKE3 has no FIPS-approved implementation. Documented as
        // supplementary, non-FIPS in docs/security/fips-validation-boundary.md.
        // Consumers in regulatory paths must use sha256() instead.
        *blake3::hash(data).as_bytes()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn fips_signing_roundtrip() {
        let provider = AwsLcSigningProvider;
        let (sk, pk) = provider.generate_keypair();
        let sig = provider.sign(b"test message", &sk);
        assert!(provider.verify(&sig, b"test message", &pk));
        assert!(!provider.verify(&sig, b"wrong message", &pk));
    }

    #[test]
    fn fips_derive_public_key_consistency() {
        let provider = AwsLcSigningProvider;
        let (sk, pk) = provider.generate_keypair();
        let derived = provider.derive_public_key(&sk);
        assert_eq!(pk, derived);
    }

    #[test]
    fn fips_signing_interop_with_dalek() {
        // A signature produced by dalek must verify under aws-lc-rs and vice
        // versa. Both backends must be wire-format compatible to honor the
        // SigningProvider contract.
        use crate::provider::DalekSigningProvider;
        let dalek = DalekSigningProvider;
        let aws_lc = AwsLcSigningProvider;

        let (sk_d, pk_d) = dalek.generate_keypair();
        let sig_d = dalek.sign(b"interop", &sk_d);
        assert!(aws_lc.verify(&sig_d, b"interop", &pk_d));

        let (sk_a, pk_a) = aws_lc.generate_keypair();
        let sig_a = aws_lc.sign(b"interop", &sk_a);
        assert!(dalek.verify(&sig_a, b"interop", &pk_a));
    }

    #[test]
    fn fips_hash_determinism() {
        let provider = AwsLcHashProvider;
        let h1 = provider.sha256(b"data");
        let h2 = provider.sha256(b"data");
        assert_eq!(h1, h2);
        assert_eq!(h1.len(), 32);

        let h3 = provider.sha512(b"data");
        assert_eq!(h3.len(), 64);

        let h4 = provider.blake3(b"data");
        assert_eq!(h4.len(), 32);
        assert_ne!(h1, h4);
    }

    #[test]
    fn fips_sha256_matches_dalek() {
        // aws-lc-rs and sha2 must produce bit-identical SHA-256 output.
        // If this drifts, one of the backends has a bug.
        use crate::provider::DalekHashProvider;
        let aws_lc = AwsLcHashProvider;
        let dalek = DalekHashProvider;

        let test_vectors: &[&[u8]] = &[
            b"",
            b"abc",
            b"The quick brown fox jumps over the lazy dog",
            b"\x00\xff\x00\xff",
        ];

        for v in test_vectors {
            assert_eq!(
                aws_lc.sha256(v),
                dalek.sha256(v),
                "SHA-256 mismatch on input length {}",
                v.len()
            );
            assert_eq!(
                aws_lc.sha512(v),
                dalek.sha512(v),
                "SHA-512 mismatch on input length {}",
                v.len()
            );
        }
    }
}
