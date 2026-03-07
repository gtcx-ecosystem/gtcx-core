# ADR-007: Offline-First with Deterministic Conflict Resolution

## Status

Accepted

## Date

2025-01-15

## Context

40% of GTCX target users operate on feature phones with no smartphone access. Even smartphone users in mining regions, rural farms, and developing markets face intermittent connectivity — cellular coverage is unreliable, and WiFi is often unavailable.

GTCX operations must continue uninterrupted during connectivity gaps:

- Asset lot registration at mine sites or farms
- Quality assessments at field inspection points
- Ownership transfers at trading posts
- Compliance checks at border crossings

The system must support at least 72 hours of offline operation (Principle P8) with automatic synchronization when connectivity returns. Conflicts arising from concurrent offline edits must be resolved deterministically — the same conflict inputs must produce the same resolution regardless of which node processes the sync.

## Decision

Every `@gtcx/*` package supports offline-first operation. The architecture provides:

1. **Local-first data** — All operations write to local storage first, then sync
2. **Offline queue** (`@gtcx/domain` `OfflineQueue`) — Buffers operations during disconnection, replays them in order on reconnect
3. **Event buffering** (`@gtcx/events` `OfflineEventBuffer`) — Queues events locally, drains to the event bus when online
4. **Connectivity detection** (`@gtcx/connectivity`) — Monitors network status, classifies connection quality into profiles (offline, metered, broadband)
5. **Sync engine** (`@gtcx/sync`) — Manages bidirectional sync with deterministic conflict resolution
6. **Local signing** — Ed25519 signatures are generated locally (no network required), timestamped, and synced later

Conflict resolution uses a deterministic algorithm:

- Last-write-wins for simple fields (based on signed timestamp)
- Append-only for audit trail events (hash chain ensures ordering)
- Merge for collection fields (union with deduplication by ID)

## Consequences

### Positive

- System remains fully functional during 72+ hour connectivity gaps
- Users in low-connectivity regions are not second-class citizens
- Local signing provides cryptographic proof of authorship even offline
- Deterministic conflict resolution eliminates manual merge decisions
- Event replay ensures no data is lost during offline periods

### Negative

- Increased complexity in every package (must handle online and offline code paths)
- Local storage requirements on devices (SQLite for mobile, IndexedDB for web)
- Conflict resolution rules must be carefully designed per data type
- Clock skew between devices can affect last-write-wins ordering (mitigated by signed timestamps)

### Neutral

- Feature phone users interact via USSD — their operations are server-side but designed to tolerate intermittent cellular connectivity
- The sync engine interface is currently a stub (`@gtcx/sync`) — full implementation is Phase C
