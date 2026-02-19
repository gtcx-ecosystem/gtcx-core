# EventCore v1.0 — Canonical Data Model and Encoding

| Attribute   | Value                                                                                                                                       |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Type**    | Protocol Specification                                                                                                                      |
| **Status**  | Publication-Ready                                                                                                                           |
| **Version** | 1.0.0                                                                                                                                       |
| **License** | Schema files: Apache 2.0; Documentation: CC BY 4.0                                                                                          |
| **Related** | [Data Models](./data-models.md), [Data and Identity Core](../architecture/data-identity-core.md), [Network Protocol](./network-protocol.md) |

A commodity-agnostic event schema for provenance, compliance, and settlement systems.

---

## 1. Purpose and Scope

EventCore standardizes how every custody, provenance, compliance, assay, and financial-settlement event is represented on the GTCX network — and by extension, in any interoperable commodity-tracking ecosystem. It delivers:

- **A single, versioned JSON and Protobuf schema** for all physical-asset events.
- **Optional CBOR and Parquet encodings** for constrained devices and batch analytics.
- **A deterministic field-ordering and hashing rule** so identical events yield identical IDs across implementations.
- **A forward-compatible extension mechanism** so industries can add domain-specific attributes without forking the core model.

The spec intentionally avoids commodity-specific fields; those live in **Extension Packs** that layer on top (e.g. `gold-v1`, `grain-eu`, `battery-v1`).

---

## 2. Data Model Overview

All EventCore messages share a common envelope:

```jsonc
{
  "eventType": "CustodyTransfer",   // enum (see Section 4)
  "schemaVersion": "1.0.0",         // SemVer
  "eventId": "ec:sha3_256:...",     // deterministic hash (see Section 6)
  "timestamp": "2025-06-06T12:34:56Z",
  "actor": {
    "tradePassId": "tp:abcd1234...",
    "role": "Aggregator"
  },
  "assetRef": {
    "lotId": "lot:xyz",
    "commodity": "Au",             // ISO 4217 or ISO 1043 (metals) or FAOSTAT code
    "quantity": {
      "amount": 12.5,
      "unit": "kg"
    }
  },
  "payload": { /* type-specific body */ },
  "extensions": {
    "gold.audit": { ... },          // Example Extension Pack field
    "grain.euro": { ... }
  },
  "signature": {
    "algorithm": "Ed25519",
    "signature": "..."
  }
}
```

### Required Fields

`eventType`, `schemaVersion`, `eventId`, `timestamp`, `actor.tradePassId`, `assetRef.lotId`, `payload` (may be empty `{}` for heartbeat events).

### Optional Fields

`actor.role`, `assetRef.quantity`, `extensions`, `signature`. Signature SHOULD be present before an event is accepted by a regulator or settlement engine.

---

## 3. Event Types

| #   | Type                                | Description                                         |
| --- | ----------------------------------- | --------------------------------------------------- |
| 1   | **CustodyTransfer**                 | Asset moves from one actor to another               |
| 2   | **LocationFix**                     | GeoTag or UWB fix recorded in field                 |
| 3   | **AssayReport**                     | Lab or handheld reading; includes method and result |
| 4   | **ComplianceScore**                 | Output from ComReg; stores score and evidence hash  |
| 5   | **PaymentInstruction**              | Hash of PvP escrow or fiat wire                     |
| 6   | **SensorTelemetry**                 | Temperature, humidity, CO2, etc.; includes sensorId |
| 7   | **InventorySnapshot**               | Periodic reconciliation at custody site             |
| 8   | **DisputeOpened / DisputeResolved** | References eventIds under contention                |

Additional types may be registered via Governance RFC (see Section 11).

---

## 4. Encoding Formats and Media Types

| Encoding         | Media Type                             | Extension  | Usage                           |
| ---------------- | -------------------------------------- | ---------- | ------------------------------- |
| JSON (canonical) | `application/vnd.eventcore.v1+json`    | `.ec.json` | Human-readable, API payloads    |
| Protobuf 3       | `application/vnd.eventcore.v1+proto`   | `.ec.pb`   | High-throughput services        |
| CBOR             | `application/vnd.eventcore.v1+cbor`    | `.ec.cbor` | Low-bandwidth IoT               |
| Parquet          | `application/vnd.eventcore.v1+parquet` | `.ec.parq` | Batch analytics (Spark, DuckDB) |

Canonical JSON rules: UTF-8, no insignificant whitespace, keys sorted UTF-8 ascending.

---

## 5. Deterministic Hashing and ID Generation

```
id = sha3_256( canonical_json(event without signature field) )
```

- Output encoded as lowercase hex and prefixed with `ec:sha3_256:`.
- Same algorithm applies across encodings — serialize to canonical JSON first.

---

## 6. Versioning and Compatibility

- **Major** bump (2.x) may remove or rename fields — requires Governance vote.
- **Minor** bump (1.1) can add optional fields or new event types.
- **Patch** bump (1.0.1) fixes typos or clarifies docs; schema unchanged.

Consumers **MUST** ignore unknown top-level keys and unknown `extensions`.

---

## 7. Extension Mechanism

Namespaced keys inside `extensions` object: `"{package}.{field}": value`.

- Package names MUST be registered in the EventCore registry.
- Each extension ships a JSON Schema / Protobuf fragment + version.
- Consumers MAY validate if they know the package; otherwise ignore.

---

## 8. Security Considerations

- Signatures use detached JSON Web Signature (JWS) or embedded field.
- Signature covers entire canonical JSON except `signature` object.
- Timestamp skew must be <= 5 minutes to prevent replay.
- Large binary artifacts (x-ray images, PDF) SHOULD NOT be in payload; include a SHA-256 hash + URI instead.

---

## 9. Reference Schemas and Code

- `schema/eventcore.schema.json` — JSON Schema 2020-12
- `proto/eventcore.proto` — Protobuf definition
- `cddl/eventcore.cddl` — CBOR diagnostic
- Go and Python SDKs auto-generated under `/sdk/`

---

## 10. Governance and Extension Registration

- New event types or extension packages proposed via **GTCX-RFC** documents.
- Accepted items merged into `registry/event_types.csv` or `registry/extensions.csv` with unique IDs.
- Parameter changes recorded via Governance contract.

---

## 11. Test Vectors

Directory `testvectors/` contains:

- `custodytransfer-gold.json` — gold sample, expected hash
- `locationfix-silo.cbor` — CBOR, expected hash
- `payment.pb` — Protobuf bytes + hex hash

CI verifies encoder/decoder parity across languages.

---

## 12. Roadmap

| Version | Planned Feature                            | Target  |
| ------- | ------------------------------------------ | ------- |
| 1.1     | Recursive event (bundled batch) field      | 2026 Q2 |
| 1.2     | Merkle-tree aggregation and partial proofs | 2026 Q4 |

---

## Related Documents

- [Data Models](./data-models.md) — Schema definitions referenced by EventCore payloads
- [Data and Identity Core](../architecture/data-identity-core.md) — How EventCore and TradePass work together
- [Network Protocol](./network-protocol.md) — How EventCore messages are transmitted and validated
- [Security Framework](./security-framework.md) — Signature algorithms and key hierarchy
- [@gtcx/events](../packages/events.md) — TypeScript event contracts built on EventCore
