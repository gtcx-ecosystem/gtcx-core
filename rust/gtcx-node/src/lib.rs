//! # GTCX Node.js Bindings
//!
//! NAPI-RS bindings exposing all GTCX Rust crates to Node.js/TypeScript.
//!
//! ## Status: Planned
//!
//! This crate will provide:
//! - Auto-generated TypeScript definitions
//! - High-performance native bindings
//! - Zero-copy where possible
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

use napi_derive::napi;

/// Placeholder - Node bindings planned for Phase 2.
#[napi]
pub fn placeholder() -> String {
    "GTCX Node bindings - coming soon".to_string()
}
