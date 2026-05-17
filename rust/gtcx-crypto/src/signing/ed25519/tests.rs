    use super::*;

    #[test]
    fn test_sign_verify_roundtrip() {
        let private_key = PrivateKey::generate();
        let public_key = private_key.public_key();
        let message = b"Test message";

        let signature = sign(message, &private_key);
        assert!(verify(&signature, message, &public_key));
    }

    #[test]
    fn test_verify_wrong_message() {
        let private_key = PrivateKey::generate();
        let public_key = private_key.public_key();

        let signature = sign(b"Original", &private_key);
        assert!(!verify(&signature, b"Tampered", &public_key));
    }

    #[test]
    fn test_verify_wrong_key() {
        let private_key1 = PrivateKey::generate();
        let private_key2 = PrivateKey::generate();
        let public_key2 = private_key2.public_key();

        let signature = sign(b"Message", &private_key1);
        assert!(!verify(&signature, b"Message", &public_key2));
    }

    #[test]
    fn test_deterministic_signatures() {
        let private_key = PrivateKey::generate();
        let message = b"Same message";

        let sig1 = sign(message, &private_key);
        let sig2 = sign(message, &private_key);

        assert_eq!(sig1, sig2, "Ed25519 signatures should be deterministic");
    }

    #[test]
    fn test_batch_verify() {
        let keys: Vec<_> = (0..10).map(|_| PrivateKey::generate()).collect();
        let messages: Vec<Vec<u8>> = (0..10)
            .map(|i| format!("Message {i}").into_bytes())
            .collect();
        let signatures: Vec<_> = keys
            .iter()
            .zip(messages.iter())
            .map(|(k, m)| sign(m, k))
            .collect();
        let public_keys: Vec<_> = keys.iter().map(PrivateKey::public_key).collect();
        let message_refs: Vec<&[u8]> = messages.iter().map(Vec::as_slice).collect();

        assert!(batch_verify(&message_refs, &signatures, &public_keys).unwrap());
    }

    #[test]
    fn test_batch_verify_one_invalid() {
        let keys: Vec<_> = (0..10).map(|_| PrivateKey::generate()).collect();
        let messages: Vec<Vec<u8>> = (0..10)
            .map(|i| format!("Message {i}").into_bytes())
            .collect();
        let mut signatures: Vec<_> = keys
            .iter()
            .zip(messages.iter())
            .map(|(k, m)| sign(m, k))
            .collect();

        // Corrupt one signature
        signatures[5] = sign(b"Different message", &keys[5]);

        let public_keys: Vec<_> = keys.iter().map(PrivateKey::public_key).collect();
        let message_refs: Vec<&[u8]> = messages.iter().map(Vec::as_slice).collect();

        assert!(!batch_verify(&message_refs, &signatures, &public_keys).unwrap());
    }

    #[test]
    fn test_batch_verify_length_mismatch() {
        let keys: Vec<_> = (0..10).map(|_| PrivateKey::generate()).collect();
        let messages: Vec<Vec<u8>> = (0..10)
            .map(|i| format!("Message {i}").into_bytes())
            .collect();
        let signatures: Vec<_> = keys
            .iter()
            .zip(messages.iter())
            .map(|(k, m)| sign(m, k))
            .collect();

        // Wrong number of public keys
        let public_keys: Vec<_> = keys.iter().take(5).map(PrivateKey::public_key).collect();
        let message_refs: Vec<&[u8]> = messages.iter().map(Vec::as_slice).collect();

        let result = batch_verify(&message_refs, &signatures, &public_keys);
        assert!(matches!(result, Err(CryptoError::LengthMismatch { .. })));
    }

    #[test]
    fn test_key_serialization() {
        let private_key = PrivateKey::generate();
        let public_key = private_key.public_key();

        // Serialize/deserialize public key
        let json = serde_json::to_string(&public_key).unwrap();
        let deserialized: PublicKey = serde_json::from_str(&json).unwrap();
        assert_eq!(public_key, deserialized);
    }

    #[test]
    fn test_signature_serialization() {
        let private_key = PrivateKey::generate();
        let signature = sign(b"Test", &private_key);

        // Serialize/deserialize signature
        let json = serde_json::to_string(&signature).unwrap();
        let deserialized: Signature = serde_json::from_str(&json).unwrap();
        assert_eq!(signature, deserialized);
    }

    #[test]
    fn test_private_key_debug_redacted() {
        let private_key = PrivateKey::generate();
        let debug_str = format!("{private_key:?}");
        assert!(debug_str.contains("REDACTED"));
        assert!(!debug_str.contains(&hex::encode(private_key.as_bytes())));
    }
