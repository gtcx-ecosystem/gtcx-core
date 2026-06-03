mod bulletproofs;
mod commitment;
mod error;
mod groth16;
mod property_based;
mod schnorr;
mod serialization;
#[cfg(feature = "differential")]
mod differential;
#[cfg(feature = "sidechannel-bench")]
mod sidechannel;
mod types;

pub(crate) fn test_salt() -> [u8; 32] {
    let mut salt = [0u8; 32];
    for (i, byte) in salt.iter_mut().enumerate() {
        *byte = (i as u8).wrapping_mul(7).wrapping_add(42);
    }
    salt
}

pub(crate) fn test_salt_2() -> [u8; 32] {
    let mut salt = [0u8; 32];
    for (i, byte) in salt.iter_mut().enumerate() {
        *byte = (i as u8).wrapping_mul(13).wrapping_add(99);
    }
    salt
}
