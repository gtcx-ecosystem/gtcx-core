# gtcx-zkp

Zero-Knowledge Proof system with hash-commitment proofs for privacy-preserving verification.

## Usage

```toml
[dependencies]
gtcx-zkp = "0.1"
```

```rust
use gtcx_zkp::{CircuitType, Witness, generate_proof, verify_proof};

let witness = Witness::new(CircuitType::Compliance, vec![b"field1".to_vec()]);
let proof = generate_proof(&witness).unwrap();
assert!(verify_proof(&proof));
```

## API

| Type/Function             | Description                               |
| ------------------------- | ----------------------------------------- |
| `CircuitType`             | Compliance, Provenance, Quality, Identity |
| `Witness`                 | Private inputs for proof generation       |
| `Proof`                   | Generated proof with serialization        |
| `generate_proof(witness)` | Create a ZK proof                         |
| `verify_proof(proof)`     | Verify a proof                            |

## License

MIT
