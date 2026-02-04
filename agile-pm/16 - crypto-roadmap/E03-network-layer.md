# Epic E03: Network Layer (P2P Networking)

## Document Information

- **Project**: GTCX Cryptographic Systems
- **Epic**: E03 -- Network Layer (P2P Networking)
- **Phase**: 3
- **Priority**: P1 (High)
- **Date**: 2026-02-03
- **Owner**: Crypto Engineering
- **Estimated Effort**: 5 sprints (10 weeks)
- **Total Story Points**: 55
- **Classification**: CONFIDENTIAL
- **Dependencies**: Phase 0 (Cryptographic Foundation) -- DONE
- **Target**: Q2 2026
- **Success Criteria**: Nodes discover peers within 30 seconds, all messages are cryptographically authenticated with replay protection, mesh clusters form within 60 seconds over BLE or LoRa, offline operations buffer for up to 45 days and merge without data loss, and the network layer is hardened against flooding, partition, and transport-level attacks


## Epic Summary

This epic delivers the peer-to-peer networking infrastructure for the GTCX ecosystem using libp2p. It establishes node identity and discovery, defines a standard authenticated message envelope with multiple transport options, implements mesh networking for offline-capable and resource-constrained environments, hardens the network against common attack vectors, and provides operational observability. The network layer is a prerequisite for Phase 4 (PANX Consensus), which depends on reliable peer communication.


### What Exists Today

| Component | Location | Status |
|-----------|----------|--------|
| agent.proto | protocols/proto/sensei/v1/agent.proto | Peer message types defined (AgentMessage, PeerEnvelope, PeerAnnounce, PeerRequest, PeerResponse); gRPC service stubs for agent-to-agent communication |
| Architecture docs | docs/developers/architecture/three-layer-architecture/ | Describes the agent communication model, transport selection strategy, and mesh topology requirements |
| Rust networking code | -- | None; no crates, modules, or stubs exist for the network layer |
| libp2p dependency | -- | Planned but not yet added to any Cargo.toml |
| btleplug dependency | -- | Planned for BLE mesh; not yet added |
| LoRa hardware drivers | -- | No driver abstraction exists; hardware-specific integration is deferred to Sprint 14 |
| CRDT library | -- | Neither crdts nor automerge crate is present in the workspace |

### What This Epic Delivers

1. DID-based node identity system with Ed25519-backed keypairs, persistent across restarts, following the did:gtcx:node_[hex16] format
2. Multi-source peer discovery via DNS seeds and gossip-based peer exchange (PEX) with authenticated peer sharing
3. Multi-factor peer reputation scoring with configurable decay, persistence, and automatic deprioritization of misbehaving peers
4. Standard authenticated message envelope with deterministic serialization, Ed25519 signature verification, and replay protection
5. WebSocket Secure (WSS) and MQTT transports with automatic priority-aware transport selection and failover
6. Mesh cluster formation over BLE and LoRa radio links with hop-limited routing and loop prevention
7. CRDT-based offline sync queue supporting up to 45 days of buffered operations with automatic conflict-free merge on reconnection
8. TLS certificate pinning, message rate limiting, encrypted peer state at rest, and network partition detection
9. Transport-level metrics collection, peer health data export, and hash-chained network event audit log


## Sprint Allocation

| Sprint | Theme | Story Points | Stories |
|--------|-------|-------------|---------|
| Sprint 12 | Node Identity and Peer Discovery | 11 | 4 |
| Sprint 13 | Transport and Message Envelope | 13 | 4 |
| Sprint 14 | Mesh Networking | 11 | 3 |
| Sprint 15 | Network Security and Hardening | 11 | 4 |
| Sprint 16 | Network Observability | 9 | 3 |
| **Total** | | **55** | **18** |


## Success Criteria

- Nodes discover peers from DNS seeds within 30 seconds of startup
- All network messages are cryptographically authenticated with replay protection
- Mesh clusters form within 60 seconds over BLE or LoRa links
- Offline operations buffer for up to 45 days and merge without data loss on reconnection
- No single transport failure prevents message delivery for critical messages
- Rate limiting drops flooding attacks within 500ms of detection threshold breach
- Network partitions are detected and reported within 2 minutes
- Peer reputation and routing state are encrypted at rest with AES-256-GCM
- Transport metrics are available within 10 seconds of collection interval


---


## Sprint 12: Node Identity and Peer Discovery

**Sprint Goal**: Establish DID-based node identities and build a self-healing peer discovery mechanism that allows nodes to find each other through DNS seeds and peer exchange.

**Sprint Points**: 11


### NET-US-001: Node Identity

**Story ID**: NET-US-001
**Title**: DID-Based Node Identity System
**Priority**: P0
**Story Points**: 3
**Sprint**: 12
**Assignee**: Unassigned

**User Story**:
As a network node operator, I want each node to have a persistent DID-based identity so that peers can authenticate and address my node across restarts and network changes.

**Description**:
Implement a `NodeIdentity` struct in a new `gtcx-network/src/identity.rs` module. Each node identity follows the format `did:gtcx:node_[hex16]` and is backed by an Ed25519 keypair. The identity document includes the node's public key, network endpoints, supported capabilities, and protocol version. The private key must be wrapped in `Zeroizing<T>` and must never appear in logs, debug output, or error messages. On first startup, the node generates a fresh identity and persists it to a configurable path. On subsequent startups, the node loads the existing identity without regeneration. The identity document must be serializable to canonical JSON and Protobuf for wire transport and out-of-band verification.

**Acceptance Criteria**:
- Node generates a DID-based identity (`did:gtcx:node_[hex16]`) on first startup
- Identity is backed by an Ed25519 keypair with the private key wrapped in `Zeroizing<T>`
- Identity document includes: public key, network endpoints (as a `Vec<Multiaddr>`), capabilities list, and protocol version
- Identity persists across node restarts without regeneration (stored at a configurable file path)
- Node can export its identity document as canonical JSON for out-of-band verification
- Identity document is serializable to Protobuf using the `PeerAnnounce` message type from `agent.proto`
- Invalid or corrupted identity files produce a clear error and do not silently regenerate
- `#\![deny(unsafe_code)]` is enforced in the module
- Unit tests include identity generation, persistence round-trip, and corruption detection

**Dependencies**:
- Phase 0 signing module (`gtcx-crypto::signing`)
- `agent.proto` `PeerAnnounce` message type

**Definition of Done**:
- Implementation complete in `gtcx-network/src/identity.rs`
- Unit tests written and passing with 100% branch coverage for the module
- Property-based tests with `proptest` for DID format invariants and serialization round-trips
- Code reviewed and approved by designated security reviewer
- No private key material appears in any log output at any log level (verified by grep over test logs)
- Module-level doc comments describe identity lifecycle and threat model assumptions
- No `unsafe` code


---


### NET-US-002: DNS Seed Discovery

**Story ID**: NET-US-002
**Title**: Bootstrap Peer Discovery via DNS Seeds
**Priority**: P0
**Story Points**: 3
**Sprint**: 12
**Assignee**: Unassigned

**User Story**:
As a new node joining the GTCX network, I want to discover initial peers from well-known DNS seed addresses so that I can connect to the network without manual peer configuration.

**Description**:
Implement a `DnsSeedResolver` struct in `gtcx-network/src/discovery/dns.rs`. The node queries `seed1.gtcx.network`, `seed2.gtcx.network`, and `seed3.gtcx.network` on startup to obtain an initial set of peers. DNS TXT records encode peer identity documents (DID, public key, multiaddr endpoints) in a compact format. The resolver must handle individual seed failures gracefully, validate discovered peer signatures before adding them to the peer table, and support configurable seed lists for non-production environments. DNS resolution uses the system resolver with a per-query timeout of 10 seconds.

**Acceptance Criteria**:
- Node queries DNS seeds (`seed1.gtcx.network`, `seed2.gtcx.network`, `seed3.gtcx.network`) on startup
- Node discovers at least one valid peer within 30 seconds under normal network conditions
- DNS resolution failures for individual seeds do not prevent discovery from remaining seeds
- Discovered peers are validated (identity signature check) before being added to the peer table
- Seed list is configurable for non-production environments via a `NetworkConfig` struct
- Per-query timeout of 10 seconds prevents indefinite blocking on unresponsive seeds
- DNS TXT record parsing handles malformed records without panicking (returns `Result`)
- Metrics counter tracks: total queries, successful resolutions, failed resolutions, peers discovered
- Unit tests include: all seeds succeed, partial seed failure, all seeds fail, malformed TXT records
- Integration test uses a mock DNS server to verify end-to-end discovery flow

**Dependencies**:
- NET-US-001 (`NodeIdentity` for peer validation)

**Definition of Done**:
- Implementation complete in `gtcx-network/src/discovery/dns.rs`
- Unit tests and integration tests written and passing
- Mock DNS server test fixture created for CI
- Error handling returns typed errors (no `unwrap()` in production paths)
- Doc comments describe the DNS TXT record format and fallback behavior
- No `unsafe` code
