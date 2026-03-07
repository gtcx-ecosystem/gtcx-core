# Crate Spec — `gtcx-network`

**Classification:** Standard — changes follow normal PR review process.

---

## Purpose

P2P networking type system and message layer for the GTCX protocol in Rust. Provides typed peer identities, gossip topic management, message serialization, and PANX protocol message types. The transport layer (QUIC, libp2p) plugs into the types defined here — this crate does not implement transport directly.

---

## Public API

### Peer Identity

| Type       | Description                                                          |
| ---------- | -------------------------------------------------------------------- |
| `PeerId`   | Cryptographic peer identifier — Blake3 hash of the peer's public key |
| `PeerInfo` | Peer metadata — `PeerId`, multiaddr, role, capabilities              |

### Gossip Topics

| Type          | Description                                               |
| ------------- | --------------------------------------------------------- |
| `GossipTopic` | Typed gossip topic — protocol enum mapped to topic string |
| `TopicRouter` | Routes incoming messages to the correct handler by topic  |

### Message Types

| Type             | Description                                             |
| ---------------- | ------------------------------------------------------- |
| `NetworkMessage` | Envelope: topic, sender `PeerId`, payload bytes, TTL    |
| `PanxMessage`    | PANX protocol messages — proposals, votes, attestations |

### Errors

| Type           | Description                                                                 |
| -------------- | --------------------------------------------------------------------------- |
| `NetworkError` | Enum: `InvalidPeerId`, `SerializationError`, `TopicError`, `TransportError` |

---

## Dependencies

| Crate                  | Role                                  |
| ---------------------- | ------------------------------------- |
| `gtcx-crypto` (local)  | Blake3 hashing for peer ID generation |
| `serde` + `serde_json` | Message serialization                 |
| `tracing`              | Observability                         |
| `thiserror`            | Error types                           |

---

## Phase 2 Roadmap

Full libp2p integration (QUIC transport, GossipSub) is planned for Phase 2. The current implementation establishes the type system and message schema so that the transport layer can be added without breaking API changes.

---

## Non-Goals

- Does not implement network transport — transport is an infrastructure concern
- Does not manage consensus — that is `gtcx-consensus`
- Does not expose NAPI bindings — networking runs in the Rust runtime

---

## Implementation

`rust/gtcx-network/src/`

---

## Reference

- [`_sop/2-docs/5-specs/4-backend/packages/network.md`](../network.md) — TypeScript P2P network package
- [`_sop/2-docs/5-specs/4-backend/packages/rust/gtcx-crypto.md`](./gtcx-crypto.md) — foundation crate
- [`_sop/2-docs/5-specs/4-backend/core-spec.md`](../../core-spec.md) — system overview
