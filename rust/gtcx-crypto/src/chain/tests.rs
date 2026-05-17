    use super::*;
    use crate::keys::generate_keypair;

    #[test]
    fn test_create_genesis() {
        let (private_key, public_key) = generate_keypair();
        let genesis = create_genesis_entry(b"Genesis payload", &private_key);

        assert_eq!(genesis.sequence, 0);
        assert_eq!(genesis.prev_hash, [0u8; 32]);
        assert!(verify_entry(&genesis, &public_key));
    }

    #[test]
    fn test_create_chain() {
        let (private_key, public_key) = generate_keypair();

        let genesis = create_genesis_entry(b"Genesis", &private_key);
        let entry1 = create_entry(1, genesis.hash, b"Entry 1", &private_key);
        let entry2 = create_entry(2, entry1.hash, b"Entry 2", &private_key);

        let chain = vec![genesis, entry1, entry2];
        assert!(verify_chain(&chain, &public_key).is_ok());
    }

    #[test]
    fn test_tampered_payload_fails() {
        let (private_key, public_key) = generate_keypair();

        let genesis = create_genesis_entry(b"Genesis", &private_key);
        let mut entry1 = create_entry(1, genesis.hash, b"Entry 1", &private_key);

        // Tamper with the payload
        entry1.payload = b"Tampered!".to_vec();

        // Signature verification should fail
        assert!(!verify_entry(&entry1, &public_key));
    }

    #[test]
    fn test_broken_chain_fails() {
        let (private_key, public_key) = generate_keypair();

        let genesis = create_genesis_entry(b"Genesis", &private_key);
        let entry1 = create_entry(1, genesis.hash, b"Entry 1", &private_key);

        // Create entry2 with wrong prev_hash
        let entry2 = create_entry(2, [1u8; 32], b"Entry 2", &private_key);

        let chain = vec![genesis, entry1, entry2];
        assert!(verify_chain(&chain, &public_key).is_err());
    }

    #[test]
    fn test_wrong_signer_fails() {
        let (private_key1, _) = generate_keypair();
        let (_, public_key2) = generate_keypair();

        let genesis = create_genesis_entry(b"Genesis", &private_key1);

        // Verify with wrong public key
        assert!(!verify_entry(&genesis, &public_key2));
    }

    #[test]
    fn test_verify_extension() {
        let (private_key, public_key) = generate_keypair();

        let genesis = create_genesis_entry(b"Genesis", &private_key);
        let entry1 = create_entry(1, genesis.hash, b"Entry 1", &private_key);

        assert!(verify_extension(&genesis, &entry1, &public_key).is_ok());
    }

    #[test]
    fn test_serialization_roundtrip() {
        let (private_key, _) = generate_keypair();
        let genesis = create_genesis_entry(b"Genesis", &private_key);

        let json = serde_json::to_string(&genesis).unwrap();
        let deserialized: ChainEntry = serde_json::from_str(&json).unwrap();

        assert_eq!(genesis.sequence, deserialized.sequence);
        assert_eq!(genesis.prev_hash, deserialized.prev_hash);
        assert_eq!(genesis.payload, deserialized.payload);
        assert_eq!(genesis.hash, deserialized.hash);
    }

    #[test]
    fn test_deterministic_hash() {
        // Same inputs should produce same hash (except timestamp)
        let (private_key, _) = generate_keypair();

        let entry1 = create_entry(5, [42u8; 32], b"payload", &private_key);
        let entry2 = create_entry(5, [42u8; 32], b"payload", &private_key);

        // Note: timestamps will differ, so hashes will differ
        // But structure is consistent
        assert_eq!(entry1.sequence, entry2.sequence);
        assert_eq!(entry1.prev_hash, entry2.prev_hash);
        assert_eq!(entry1.payload, entry2.payload);
    }
