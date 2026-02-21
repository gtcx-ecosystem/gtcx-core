# Telemetry Schema

**Updated**: 2026-02-21

This schema describes the minimum fields expected for structured logs and telemetry events across `gtcx-core` packages.

## Base Fields (Required)

| Field        | Type                | Description                                                       |
| ------------ | ------------------- | ----------------------------------------------------------------- |
| `timestamp`  | number (epoch ms)   | Event emission time                                               |
| `type`       | string              | Canonical event type (e.g., `crypto.sign`, `p2p.publish`)         |
| `category`   | string              | Domain category (`crypto`, `network`, `security`, `domain`, etc.) |
| `success`    | boolean             | Outcome flag                                                      |
| `durationMs` | number \| null      | End‑to‑end execution duration                                     |
| `metadata`   | object \| undefined | Optional structured metadata                                      |

## Error Fields (Optional)

| Field           | Type                | Description                |
| --------------- | ------------------- | -------------------------- |
| `error.name`    | string              | Stable error class/code    |
| `error.message` | string              | Human‑readable summary     |
| `error.stack`   | string \| undefined | Stack trace when available |

## Event Sources

- **Crypto tracing**: `@gtcx/crypto` traced operations emit `OperationLog`.
- **Network**: `NetworkTelemetryEvent` emits `p2p.*` event types.
- **Domain**: `DomainEvent` emits workflow events for registration/trading/compliance.

## Logging Rules

1. Never log private keys or raw secrets.
2. Sanitize high‑risk payloads before logging.
3. Include correlation IDs when available.
4. Preserve failure causality via `Error.cause` when wrapping errors.
