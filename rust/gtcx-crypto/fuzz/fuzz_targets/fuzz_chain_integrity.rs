#![no_main]

use libfuzzer_sys::fuzz_target;
use gtcx_crypto::chain::{create_genesis_entry, create_entry, verify_chain};
use gtcx_crypto::keys::generate_keypair;

// Fuzz hash-chain integrity verification.
// Properties verified:
// 1. Valid chains always verify
// 2. Corrupted chains are always detected (no false positives)
// 3. No panic on any input
fuzz_target!(|data: &[u8]| {
    if data.len() < 3 {
        return;
    }

    let (private_key, public_key) = generate_keypair();

    // Build a short valid chain
    let genesis = create_genesis_entry(b"genesis", &private_key);
    let entry1 = create_entry(1, genesis.hash, b"entry-1", &private_key);
    let entry2 = create_entry(2, entry1.hash, b"entry-2", &private_key);

    let chain = vec![genesis.clone(), entry1.clone(), entry2.clone()];

    // Valid chain must always verify
    assert!(verify_chain(&chain, &public_key).is_ok());

    // Now corrupt a byte using fuzz data
    let entry_idx = (data[0] as usize) % 3;
    let field_selector = data[1] % 3; // 0=payload, 1=hash, 2=signature
    let corruption_byte = data[2];

    let mut corrupted_chain = chain.clone();
    let entry = &mut corrupted_chain[entry_idx];

    match field_selector {
        0 => {
            // Corrupt payload
            let mut payload = entry.payload.clone();
            if !payload.is_empty() {
                payload[0] ^= corruption_byte | 1; // ensure at least 1 bit flipped
                entry.payload = payload;
            }
        }
        1 => {
            // Corrupt hash
            entry.hash[0] ^= corruption_byte | 1;
        }
        _ => {
            // Corrupt signature
            let mut sig = entry.signature.clone();
            if !sig.is_empty() {
                sig[0] ^= corruption_byte | 1;
                entry.signature = sig;
            }
        }
    }

    // Corrupted chain must fail verification (never pass)
    let result = verify_chain(&corrupted_chain, &public_key);
    assert!(result.is_err(), "Corrupted chain must not verify as valid");
});
