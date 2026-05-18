# gtcx-node

Node.js native bindings via NAPI-RS for GTCX cryptographic operations.

## Overview

This crate exposes high-performance Rust cryptographic primitives to Node.js/TypeScript:

- Ed25519 signing and verification
- SHA-256, SHA-512, and Blake3 hashing
- Key generation and derivation
- Hash-chain audit log creation and verification
- Zero-knowledge proof verification (Groth16, Bulletproofs, Schnorr)

## Usage (TypeScript)

```typescript
import { sign, verify, generateKeyPair, hash256, hash512 } from '@gtcx/crypto-native';

const { privateKey, publicKey } = generateKeyPair();
const signature = sign(message, privateKey);
const isValid = verify(signature, message, publicKey);

const hash = hash256(data);
```

## Building

```bash
cd rust
cargo build -p gtcx-node
```

## Modules

| Module         | Exports                                      |
| -------------- | -------------------------------------------- |
| `crypto`       | `sign`, `verify`, `generateKeyPair`, hashing |
| `bulletproofs` | Range proof operations                       |
| `groth16`      | zk-SNARK proof verification                  |
| `schnorr`      | Schnorr signature operations                 |
| `zkp`          | High-level ZKP verification API              |

## License

MIT
