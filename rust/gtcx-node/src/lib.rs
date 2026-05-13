//! # GTCX Node.js Bindings
//!
//! NAPI-RS bindings exposing GTCX Rust crates to Node.js/TypeScript.
//!
//! ## Overview
//!
//! This crate provides high-performance native bindings for:
//! - Ed25519 signing and verification
//! - SHA-256, SHA-512, and Blake3 hashing
//! - Key generation and derivation
//! - Hash-chain audit log creation and verification
//!
//! ## Usage (TypeScript)
//!
//! ```typescript
//! import { sign, verify, generateKeyPair } from '@gtcx/crypto-native';
//!
//! const { privateKey, publicKey } = generateKeyPair();
//! const signature = sign(message, privateKey);
//! const isValid = verify(signature, message, publicKey);
//! ```

#![deny(unsafe_code)]
#![deny(warnings)]
#![deny(missing_docs)]

pub mod bulletproofs;
pub mod crypto;
pub mod groth16;
pub mod schnorr;
pub mod zkp;

mod utils;

pub use bulletproofs::*;
pub use crypto::*;
pub use groth16::*;
pub use schnorr::*;
pub use zkp::*;

use napi_derive::napi;

/// Get the version of the GTCX native bindings.
#[napi]
pub fn version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

#[cfg(test)]
mod tests;
