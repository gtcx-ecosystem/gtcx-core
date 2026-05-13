//! Utility helpers for GTCX Node.js bindings.

/// Map a hex decoding or general error to a NAPI error.
pub(crate) fn map_hex_err<E: std::fmt::Display>(e: E) -> napi::Error {
    napi::Error::from_reason(e.to_string())
}

/// Decode a hex string into a fixed 32-byte array.
pub(crate) fn decode_32_bytes(hex_str: &str, name: &str) -> napi::Result<[u8; 32]> {
    let bytes = hex::decode(hex_str).map_err(map_hex_err)?;
    if bytes.len() != 32 {
        return Err(napi::Error::from_reason(format!(
            "{} must be 32 bytes, got {}",
            name,
            bytes.len()
        )));
    }
    let mut arr = [0u8; 32];
    arr.copy_from_slice(&bytes);
    Ok(arr)
}

/// Parse a Groth16 circuit type from its string representation.
pub(crate) fn circuit_type_from_str(s: &str) -> napi::Result<gtcx_zkp::Groth16CircuitType> {
    match s {
        "gci_threshold" => Ok(gtcx_zkp::Groth16CircuitType::GciThreshold),
        "asset_ownership" => Ok(gtcx_zkp::Groth16CircuitType::AssetOwnership),
        "location_region" => Ok(gtcx_zkp::Groth16CircuitType::LocationRegion),
        _ => Err(napi::Error::from_reason(format!(
            "Unknown circuit type: {s}"
        ))),
    }
}
