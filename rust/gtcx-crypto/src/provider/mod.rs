//! Cryptographic provider abstraction.
//!
//! Allows swapping between crypto backends at compile time:
//! - `dalek` (default): ed25519-dalek + k256 — fastest, well-audited
//! - `fips` (planned): aws-lc-rs — FIPS 140-3 validated (CMVP #4816)
//!
//! ## Design
//!
//! The provider traits operate on raw `&[u8]` bytes internally.
//! The public API (`PrivateKey`, `PublicKey`, `Signature` newtypes)
//! does not change — the abstraction is internal only.
//!
//! ## Usage
//!
//! ```rust
//! use gtcx_crypto::provider::{SigningProvider, HashProvider, default_signing, default_hashing};
//!
//! let signer = default_signing();
//! let hasher = default_hashing();
//!
//! let (sk, pk) = signer.generate_keypair();
//! let sig = signer.sign(b"message", &sk);
//! assert!(signer.verify(&sig, b"message", &pk));
//!
//! let hash = hasher.sha256(b"data");
//! assert_eq!(hash.len(), 32);
//! ```

mod dalek;

pub use dalek::{DalekHashProvider, DalekSigningProvider};

// =============================================================================
// SIGNING PROVIDER TRAIT
// =============================================================================

/// Trait for signing operations.
///
/// Implementations must guarantee:
/// - Key generation uses OS CSPRNG
/// - Signatures are deterministic (same msg + key = same sig)
/// - Verification is constant-time
/// - Private key material is zeroized on drop
pub trait SigningProvider: Send + Sync {
    /// Generate a new keypair. Returns (private_key_bytes, public_key_bytes).
    fn generate_keypair(&self) -> (Vec<u8>, Vec<u8>);

    /// Sign a message. Returns signature bytes.
    fn sign(&self, message: &[u8], private_key: &[u8]) -> Vec<u8>;

    /// Verify a signature. Returns true if valid.
    fn verify(&self, signature: &[u8], message: &[u8], public_key: &[u8]) -> bool;

    /// Derive public key from private key bytes.
    fn derive_public_key(&self, private_key: &[u8]) -> Vec<u8>;
}

// =============================================================================
// HASH PROVIDER TRAIT
// =============================================================================

/// Trait for hashing operations.
///
/// Implementations must guarantee:
/// - Determinism (same input = same output)
/// - Correct output length (32 bytes for SHA-256/BLAKE3, 64 for SHA-512)
pub trait HashProvider: Send + Sync {
    /// SHA-256 hash (32 bytes output).
    fn sha256(&self, data: &[u8]) -> [u8; 32];

    /// SHA-512 hash (64 bytes output).
    fn sha512(&self, data: &[u8]) -> [u8; 64];

    /// BLAKE3 hash (32 bytes output). Not FIPS-approved.
    /// FIPS providers should fall back to SHA-256.
    fn blake3(&self, data: &[u8]) -> [u8; 32];
}

// =============================================================================
// DEFAULT PROVIDER SELECTION
// =============================================================================

/// Get the default signing provider.
///
/// Returns `DalekSigningProvider` (ed25519-dalek).
/// When `--features fips` is available, this will return the FIPS provider.
pub fn default_signing() -> DalekSigningProvider {
    DalekSigningProvider
}

/// Get the default hash provider.
///
/// Returns `DalekHashProvider` (@noble-equivalent crates).
/// When `--features fips` is available, this will return the FIPS provider.
pub fn default_hashing() -> DalekHashProvider {
    DalekHashProvider
}
