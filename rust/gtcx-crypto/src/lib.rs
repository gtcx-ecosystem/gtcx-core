//! # GTCX Cryptographic Primitives
//!
//! Core cryptographic operations for the GTCX protocol.
//! This crate is the **SINGLE SOURCE OF TRUTH** for all cryptography in GTCX.
//!
//! ## Design Principles
//!
//! 1. **No unsafe code** — Memory safety guaranteed
//! 2. **Zeroize secrets** — Private keys wiped from memory on drop
//! 3. **Type-safe** — Newtypes prevent key/signature confusion
//! 4. **Auditable** — Every function documented and tested
//! 5. **Traceable** — All operations instrumented for observability
//!
//! ## Modules
//!
//! - [`signing`] — Ed25519, ECDSA P-256, and secp256k1 digital signatures
//! - [`hashing`] — SHA-256, SHA-512, Blake3 hashing
//! - [`keys`] — Key generation and derivation
//! - [`chain`] — Hash-chained audit logs
//!
//! ## Quick Start
//!
//! ```rust
//! use gtcx_crypto::{sign, verify, generate_keypair, sha256};
//!
//! // Generate a key pair
//! let (private_key, public_key) = generate_keypair();
//!
//! // Sign a message
//! let message = b"Hello, GTCX!";
//! let signature = sign(message, &private_key);
//!
//! // Verify the signature
//! assert!(verify(&signature, message, &public_key));
//!
//! // Hash some data
//! let hash = sha256(b"data to hash");
//! ```
//!
//! ## Security
//!
//! All private keys are automatically zeroed when dropped:
//!
//! ```rust
//! use gtcx_crypto::signing::ed25519::PrivateKey;
//!
//! {
//!     let key = PrivateKey::generate();
//!     // ... use key ...
//! } // key is securely wiped from memory here
//! ```

// =============================================================================
// CRATE-LEVEL CONFIGURATION
// =============================================================================

// Principle 7/8: No unsafe code, no warning suppression
#![deny(unsafe_code)]
#![deny(warnings)]
#![deny(missing_docs)]
#![deny(clippy::all)]
#![warn(clippy::pedantic)]
#![warn(clippy::nursery)]
// Allow some pedantic lints that conflict with our style
#![allow(clippy::module_name_repetitions)]
#![allow(clippy::must_use_candidate)]

// =============================================================================
// MODULE DECLARATIONS
// =============================================================================

pub mod chain;
#[cfg(feature = "cloud_kms")]
pub mod cloud_kms_keystore;
pub mod error;
pub mod hashing;
pub mod keys;
pub mod keystore;
#[cfg(feature = "pkcs11")]
pub mod pkcs11_keystore;
#[cfg(any(feature = "pkcs11", feature = "cloud_kms"))]
pub mod pkcs11_state;
pub mod provider;
pub mod signing;

// =============================================================================
// RE-EXPORTS (Convenience API)
// =============================================================================

// Error types
pub use error::CryptoError;

// Signing (most common operations)
pub use signing::ed25519::{batch_verify, sign, verify};
pub use signing::ed25519::{PrivateKey, PublicKey, Signature};
pub use signing::p256;
pub use signing::secp256k1;

// Hashing
pub use hashing::{blake3, sha256, sha512};

// Keys
pub use keys::{generate_keypair, KeyPair};

// Chain
pub use chain::{create_entry, ChainEntry};

// =============================================================================
// RESULT TYPE
// =============================================================================

/// Result type for cryptographic operations.
///
/// All fallible operations in this crate return this type.
pub type Result<T> = std::result::Result<T, CryptoError>;
