# Core Data Flows

Canonical data flows across identity, verification, sync, network transport, ZKP proofs, and observability.

## 1. Identity Lifecycle

1. Client generates keypair (`@gtcx/crypto` or `@gtcx/crypto-native`).
2. DID is derived and stored locally (`@gtcx/identity`).
3. Credentials are issued and attached to the DID.
4. Audit trails are recorded in the domain and event layer (`@gtcx/events`, `@gtcx/domain`).

## 2. Verification Flow

1. Verifier requests a proof bundle or certificate.
2. Client produces proof bundle (JS or Rust-backed via `@gtcx/crypto`).
3. Verifier validates signatures, hashes, and ZKP proofs (`@gtcx/verification`).
4. Result is emitted as a verification event.

## 3. Offline Sync Flow

1. Local changes are recorded to the offline queue (`@gtcx/sync`, `@gtcx/events`).
2. Sync engine batches updates and retries on reconnect (`@gtcx/connectivity`).
3. Conflicts are resolved deterministically per configured strategy.
4. Successful sync emits events for downstream services.

## 4. Network Transport Flow

1. Node joins mesh via TCP/QUIC libp2p (`@gtcx/network`).
2. Topics are subscribed and published over encrypted channels.
3. Peer discovery and reputation update routing decisions.
4. Messages are validated and routed to handlers.

## 5. ZKP Proof Flow

1. Witness inputs are prepared (amount range, identity attributes, GCI score, etc.).
2. Proof is generated via `rust/gtcx-zkp` (Groth16, Bulletproofs, or Schnorr).
3. Proof bundle is returned to the caller, optionally serialized for transport.
4. Verifier checks proof against public inputs.

## 6. Observability Flow

1. Telemetry is emitted for key actions (signing, sync, verification, network events).
2. Metrics and logs are structured per the telemetry schema.
3. SLO evaluation and alerting use the telemetry schema as the canonical format.

## References

- `SOP/2-docs/2-specs/identity-core.md`
- `SOP/2-docs/2-specs/network-protocol.md`
- `SOP/2-docs/2-specs/eventcore.md`
- `SOP/2-docs/4-operations/runbooks/telemetry-schema.md`
- `SOP/2-docs/1-architecture/zkp-circuit-plan.md`
