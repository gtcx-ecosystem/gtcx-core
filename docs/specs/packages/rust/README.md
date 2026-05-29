---
title: "Rust Crate Specs"
status: "current"
date: "2026-05-27"
owner: "gtcx-core"
role: "protocol-architect"
agent_id: "agent://gtcx-core/2026-05-27/session-backfill"
trust_score: 95
autonomy_level: "sovereign"
tier: "critical"
tags: ["documentation", "specs"]
review_cycle: "on-change"
---

# Rust Crate Specs

Package specifications for the 6 Rust crates in `rust/`.

## Crates

| File                                   | Crate            | Purpose                                                    |
| -------------------------------------- | ---------------- | ---------------------------------------------------------- |
| [gtcx-crypto.md](gtcx-crypto.md)       | `gtcx-crypto`    | Ed25519 signing, Blake3/SHA-256 hashing, HD key derivation |
| [gtcx-zkp.md](gtcx-zkp.md)             | `gtcx-zkp`       | ZKP circuits — Groth16, Bulletproofs, Schnorr              |
| [gtcx-node.md](gtcx-node.md)           | `gtcx-node`      | Node runtime primitives for validator mesh                 |
| [gtcx-network.md](gtcx-network.md)     | `gtcx-network`   | P2P networking — libp2p QUIC + gossipsub                   |
| [gtcx-edge.md](gtcx-edge.md)           | `gtcx-edge`      | Edge/offline compute primitives                            |
| [gtcx-consensus.md](gtcx-consensus.md) | `gtcx-consensus` | PANX consensus engine (PBFT) — planned Phase 5             |

## Security Note

Changes to `gtcx-crypto` and `gtcx-zkp` require Cryptographic Security Engineer review and human approval before merge. See `docs/agents/workflows/safety-rules.md`.
