# gtcx-zkp

Zero-Knowledge Proof system for privacy-preserving verification.
Hash-commitment proofs remain available for lightweight flows, and the first
arkworks Groth16 circuit (GCI threshold) is now implemented.

## Usage

```toml
[dependencies]
gtcx-zkp = "0.1"
```

```rust
use gtcx_zkp::{CircuitType, Witness, generate_proof, verify_proof};

let witness = Witness::new(CircuitType::Compliance, vec![b"field1".to_vec()]);
let salt = [0u8; 32];
let proof = generate_proof(&witness, &salt);
let public_inputs = gtcx_zkp::PublicInputs {
    circuit: CircuitType::Compliance,
    commitment: proof.commitment,
};
assert!(verify_proof(&proof, &public_inputs).unwrap());
```

### Groth16 (GCI Threshold)

```rust
use gtcx_zkp::{
    Groth16CircuitType, groth16_generate_keys, groth16_prove_gci_threshold, groth16_verify,
};

let keys = groth16_generate_keys(Groth16CircuitType::GciThreshold).unwrap();
let proof = groth16_prove_gci_threshold(92, 80, &keys).unwrap();
assert!(groth16_verify(&proof).unwrap());
```

## API

| Type/Function                 | Description                               |
| ----------------------------- | ----------------------------------------- |
| `CircuitType`                 | Compliance, Provenance, Quality, Identity |
| `Witness`                     | Private inputs for proof generation       |
| `Proof`                       | Generated proof with serialization        |
| `generate_proof(witness)`     | Create a ZK proof                         |
| `verify_proof(proof)`         | Verify a proof                            |
| `groth16_generate_keys`       | Generate Groth16 keypairs                 |
| `groth16_prove_gci_threshold` | Prove score >= threshold                  |
| `groth16_verify`              | Verify Groth16 proofs                     |

## License

MIT
