//! Default crypto provider using ed25519-dalek and sha2/blake3 crates.
//!
//! This is the non-FIPS, performance-optimized backend.

use ed25519_dalek::{Signer, SigningKey, Verifier, VerifyingKey};
use rand::rngs::OsRng;
use sha2::{Digest, Sha256, Sha512};

use super::{HashProvider, SigningProvider};

/// Ed25519 signing provider using ed25519-dalek.
pub struct DalekSigningProvider;

impl SigningProvider for DalekSigningProvider {
    fn generate_keypair(&self) -> (Vec<u8>, Vec<u8>) {
        let mut csprng = OsRng;
        let signing_key = SigningKey::generate(&mut csprng);
        let verifying_key = signing_key.verifying_key();
        (
            signing_key.to_bytes().to_vec(),
            verifying_key.to_bytes().to_vec(),
        )
    }

    fn sign(&self, message: &[u8], private_key: &[u8]) -> Vec<u8> {
        let bytes: [u8; 32] = private_key
            .try_into()
            .expect("private key must be 32 bytes");
        let signing_key = SigningKey::from_bytes(&bytes);
        signing_key.sign(message).to_bytes().to_vec()
    }

    fn verify(&self, signature: &[u8], message: &[u8], public_key: &[u8]) -> bool {
        let Ok(pk_bytes) = <[u8; 32]>::try_from(public_key) else {
            return false;
        };
        let Ok(sig_bytes) = <[u8; 64]>::try_from(signature) else {
            return false;
        };
        let Ok(verifying_key) = VerifyingKey::from_bytes(&pk_bytes) else {
            return false;
        };
        let sig = ed25519_dalek::Signature::from_bytes(&sig_bytes);
        verifying_key.verify(message, &sig).is_ok()
    }

    fn derive_public_key(&self, private_key: &[u8]) -> Vec<u8> {
        let bytes: [u8; 32] = private_key
            .try_into()
            .expect("private key must be 32 bytes");
        let signing_key = SigningKey::from_bytes(&bytes);
        signing_key.verifying_key().to_bytes().to_vec()
    }
}

/// Hash provider using sha2 and blake3 crates.
pub struct DalekHashProvider;

impl HashProvider for DalekHashProvider {
    fn sha256(&self, data: &[u8]) -> [u8; 32] {
        let mut hasher = Sha256::new();
        hasher.update(data);
        hasher.finalize().into()
    }

    fn sha512(&self, data: &[u8]) -> [u8; 64] {
        let mut hasher = Sha512::new();
        hasher.update(data);
        hasher.finalize().into()
    }

    fn blake3(&self, data: &[u8]) -> [u8; 32] {
        *blake3::hash(data).as_bytes()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn signing_roundtrip() {
        let provider = DalekSigningProvider;
        let (sk, pk) = provider.generate_keypair();
        let sig = provider.sign(b"test message", &sk);
        assert!(provider.verify(&sig, b"test message", &pk));
        assert!(!provider.verify(&sig, b"wrong message", &pk));
    }

    #[test]
    fn derive_public_key_consistency() {
        let provider = DalekSigningProvider;
        let (sk, pk) = provider.generate_keypair();
        let derived = provider.derive_public_key(&sk);
        assert_eq!(pk, derived);
    }

    #[test]
    fn hash_determinism() {
        let provider = DalekHashProvider;
        let h1 = provider.sha256(b"data");
        let h2 = provider.sha256(b"data");
        assert_eq!(h1, h2);
        assert_eq!(h1.len(), 32);

        let h3 = provider.sha512(b"data");
        assert_eq!(h3.len(), 64);

        let h4 = provider.blake3(b"data");
        assert_eq!(h4.len(), 32);
        assert_ne!(h1, h4); // SHA-256 and BLAKE3 must differ
    }
}
