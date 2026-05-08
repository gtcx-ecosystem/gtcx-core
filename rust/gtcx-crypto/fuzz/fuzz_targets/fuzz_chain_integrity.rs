#![no_main]

use libfuzzer_sys::fuzz_target;
use gtcx_crypto::chain::{create_genesis_entry, create_entry, verify_chain};
use gtcx_crypto::keys::generate_keypair;

// Fuzz hash-chain integrity verification.
// Properties verified:
// 1. Valid chains always verify
// 2. Corrupting payload always detected (signature invalidation)
// 3. Corrupting prev_hash always detected (chain linkage break)
// 4. No panic on any input
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

    let entry_idx = (data[0] as usize) % 3;
    let corruption_byte = data[2] | 1; // ensure at least 1 bit flipped

    // Strategy 1: corrupt payload (always detectable — invalidates signature)
    if data[1] % 2 == 0 {
        let mut corrupted_chain = chain.clone();
        let payload = &mut corrupted_chain[entry_idx].payload;
        if !payload.is_empty() {
            let byte_idx = (data[1] as usize) % payload.len();
            payload[byte_idx] ^= corruption_byte;
            let result = verify_chain(&corrupted_chain, &public_key);
            assert!(result.is_err(), "Payload corruption must be detected");
        }
    }
    // Strategy 2: corrupt prev_hash on non-genesis entry (always detectable — breaks linkage)
    else if entry_idx > 0 {
        let mut corrupted_chain = chain.clone();
        let byte_idx = (data[1] as usize) % 32;
        corrupted_chain[entry_idx].prev_hash[byte_idx] ^= corruption_byte;
        let result = verify_chain(&corrupted_chain, &public_key);
        assert!(result.is_err(), "prev_hash corruption must be detected");
    }
});
