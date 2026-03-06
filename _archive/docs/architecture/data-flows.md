# Core Data Flows

This document captures the canonical data flows across identity, verification, sync, network transport, and ZKP proofs.

## 1) Identity Lifecycle

1. Client generates keypair (`@gtcx/crypto` or `@gtcx/crypto-native`).
2. DID is derived and stored locally (`@gtcx/identity`).
3. Credentials are issued and attached to the DID.
4. Audit trails are recorded in the domain/event layer (`@gtcx/events`, `@gtcx/domain`).

## 2) Verification Flow

1. Verifier requests a proof bundle or certificate.
2. Client produces proof bundle (JS or Rust-backed).
3. Verifier validates signatures, hashes, and ZKP proofs.
4. Result is emitted as a verification event.

## 3) Offline Sync Flow

1. Local changes are recorded to the offline queue.
2. Sync engine batches updates and retries on reconnect.
3. Conflicts are resolved deterministically.
4. Successful sync emits events for downstream services.

## 4) Network Transport Flow

1. Node joins mesh (TCP/QUIC libp2p).
2. Topics are subscribed and published over encrypted channels.
3. Peer discovery and reputation update routing decisions.
4. Messages are validated and then routed to handlers.

## 5) ZKP Proof Flow

1. Witness inputs are prepared (amount range, identity attributes, etc.).
2. Proof generated via `rust/gtcx-zkp` (Groth16 / Bulletproofs / Schnorr).
3. Proof bundle returned to caller, optionally serialized for transport.
4. Verifier checks proof and public inputs.

## 6) Observability Flow

1. Telemetry is emitted for key actions (signing, sync, verification, network events).
2. Metrics and logs are structured for aggregation.
3. SLO evaluation and alerting use the telemetry schema.

## References

- `docs/specs/identity-core.md`
- `docs/specs/network-protocol.md`
- `docs/specs/security-framework.md`
- `docs/operations/telemetry-schema.md`
