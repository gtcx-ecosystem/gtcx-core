//! Digital signature algorithms.
//!
//! This module provides Ed25519, ECDSA P-256, and secp256k1 digital signatures.
//!
//! ## Supported Algorithms
//!
//! | Algorithm | Use Case |
//! |-----------|----------|
//! | Ed25519 | Default, fastest, recommended |
//! | ECDSA P-256 | FIPS-aligned interoperability and cloud KMS |
//! | secp256k1 | Bitcoin/Ethereum compatibility |
//!
//! ## Example
//!
//! ```rust
//! use gtcx_crypto::signing::ed25519::{sign, verify, PrivateKey};
//!
//! let private_key = PrivateKey::generate();
//! let public_key = private_key.public_key();
//!
//! let signature = sign(b"Hello, GTCX!", &private_key);
//! assert!(verify(&signature, b"Hello, GTCX!", &public_key));
//! ```

pub mod ed25519;
pub mod p256;
pub mod secp256k1;
