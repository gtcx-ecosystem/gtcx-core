# Glossary (gtcx-core)

| Term              | Definition                                                                                                   |
| ----------------- | ------------------------------------------------------------------------------------------------------------ |
| **ADR**           | Architecture Decision Record — documents a significant architectural decision, its context, and consequences |
| **Blake3**        | Fast cryptographic hash function used for content addressing and Merkle trees in `gtcx-core`                 |
| **Bulletproofs**  | Range proof system used for `amount_range` proofs in `rust/gtcx-zkp`                                         |
| **Core12**        | GTCX's 12-domain compliance framework validated by `@gtcx/schemas`                                           |
| **DID**           | Decentralized Identifier — W3C-spec identifier for identity documents (`did:gtcx:<prefix>`)                  |
| **Ed25519**       | Primary signing algorithm for all GTCX identity and event signing                                            |
| **GCI**           | Global Compliance Index — scored attribute used in `gci_threshold` ZKP proofs                                |
| **Groth16**       | ZK proof system used for GCI threshold, asset ownership, and location region proofs                          |
| **mTLS**          | Mutual TLS — bidirectional certificate authentication used by `@gtcx/api-client`                             |
| **NAPI-RS**       | Rust-to-Node.js native binding framework used by `gtcx-node`                                                 |
| **Offline-first** | Architecture design assuming intermittent connectivity with deterministic conflict resolution on sync        |
| **P2P**           | Peer-to-peer networking — used by `@gtcx/network` via libp2p                                                 |
| **PANX**          | Protocol for multi-party attestation and consensus (GTCX protocols repo)                                     |
| **PBFT**          | Practical Byzantine Fault Tolerance — consensus algorithm used by `gtcx-consensus`                           |
| **Schnorr**       | Signature scheme used for identity attribute possession proofs                                               |
| **Secp256k1**     | Secondary signing algorithm available in `@gtcx/crypto` for blockchain interop                               |
| **SLO**           | Service Level Objective — engineering operations quality targets                                             |
| **TradeCV**       | W3C Verifiable Credential-based trade/work credential structure in `@gtcx/workproof`                         |
| **UAT**           | User Acceptance Testing — evidence-driven validation phase documented per sprint                             |
| **VC**            | Verifiable Credential — W3C standard for cryptographically verifiable claims                                 |
| **WorkProof**     | Work attestation credential system in `@gtcx/workproof`                                                      |
| **ZKP**           | Zero-Knowledge Proof — proves a statement without revealing the private witness                              |
