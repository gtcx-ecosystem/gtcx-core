# gtcx-zkp

Zero-Knowledge Proof system for privacy-preserving verification.
Hash-commitment proofs remain available for lightweight flows, and the first
arkworks Groth16 circuits (GCI threshold, asset ownership, location region) plus a
Bulletproofs amount range proof and Schnorr identity attribute proofs are now implemented.

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

### Groth16 (Asset Ownership)

```rust
use gtcx_zkp::{
    Groth16CircuitType, groth16_generate_keys, groth16_prove_asset_ownership, groth16_verify,
};

let keys = groth16_generate_keys(Groth16CircuitType::AssetOwnership).unwrap();
// Build asset_id, owner_hash, randomness, ownership_root, and merkle_path from your tree.
let (proof, _inputs) = groth16_prove_asset_ownership(
    [1u8; 32],
    [2u8; 32],
    [3u8; 32],
    [4u8; 32],
    merkle_path,
    &keys,
)
.unwrap();
assert!(groth16_verify(&proof).unwrap());
```

### Groth16 (Location Region)

```rust
use gtcx_zkp::{
    Groth16CircuitType, groth16_generate_keys, groth16_prove_location_region, groth16_verify,
};

let keys = groth16_generate_keys(Groth16CircuitType::LocationRegion).unwrap();
// Provide lat, lon, timestamp, randomness, and bounds [min_lat, max_lat, min_lon, max_lon].
let (proof, _inputs) = groth16_prove_location_region(
    15,
    35,
    1_700_000_000,
    [9u8; 32],
    [10, 20, 30, 40],
    &keys,
)
.unwrap();
assert!(groth16_verify(&proof).unwrap());
```

### Bulletproofs (Amount Range)

```rust
use gtcx_zkp::{bulletproofs_prove_amount_range, bulletproofs_verify_amount_range};

let proof = bulletproofs_prove_amount_range(55, 10, 100, [7u8; 32]).unwrap();
assert!(bulletproofs_verify_amount_range(&proof).unwrap());
```

### Schnorr (Identity Attribute)

```rust
use gtcx_zkp::{schnorr_prove_identity_attribute, schnorr_verify_identity_attribute};

let subject_hash = [3u8; 32];
let proof = schnorr_prove_identity_attribute(b"citizenship:GTX", subject_hash).unwrap();
assert!(schnorr_verify_identity_attribute(&proof).unwrap());
```

## API

| Type/Function                       | Description                               |
| ----------------------------------- | ----------------------------------------- |
| `CircuitType`                       | Compliance, Provenance, Quality, Identity |
| `Witness`                           | Private inputs for proof generation       |
| `Proof`                             | Generated proof with serialization        |
| `generate_proof(witness)`           | Create a ZK proof                         |
| `verify_proof(proof)`               | Verify a proof                            |
| `groth16_generate_keys`             | Generate Groth16 keypairs                 |
| `groth16_prove_gci_threshold`       | Prove score >= threshold                  |
| `groth16_verify`                    | Verify Groth16 proofs                     |
| `groth16_prove_asset_ownership`     | Prove asset ownership via Merkle path     |
| `groth16_prove_location_region`     | Prove location within a region            |
| `bulletproofs_prove_amount_range`   | Prove amount within [min, max]            |
| `bulletproofs_verify_amount_range`  | Verify amount range proof                 |
| `schnorr_prove_identity_attribute`  | Prove identity attribute possession       |
| `schnorr_verify_identity_attribute` | Verify identity attribute proof           |

## License

MIT
