# Telemetry Schema

Minimum required fields for structured logs and telemetry events across `gtcx-core` packages.

## Base Fields (Required)

| Field        | Type                | Description                                                       |
| ------------ | ------------------- | ----------------------------------------------------------------- |
| `timestamp`  | number (epoch ms)   | Event emission time                                               |
| `type`       | string              | Canonical event type (e.g., `crypto.sign`, `p2p.publish`)         |
| `category`   | string              | Domain category (`crypto`, `network`, `security`, `domain`, etc.) |
| `success`    | boolean             | Outcome flag                                                      |
| `durationMs` | number \| null      | End-to-end execution duration                                     |
| `metadata`   | object \| undefined | Optional structured metadata                                      |

## Error Fields (Optional)

| Field           | Type                | Description                |
| --------------- | ------------------- | -------------------------- |
| `error.name`    | string              | Stable error class/code    |
| `error.message` | string              | Human-readable summary     |
| `error.stack`   | string \| undefined | Stack trace when available |

## Event Sources

| Source         | Event Type Prefix | Package                                           |
| -------------- | ----------------- | ------------------------------------------------- |
| Crypto tracing | `crypto.*`        | `@gtcx/crypto` traced operations (`OperationLog`) |
| Network        | `p2p.*`           | `@gtcx/network` (`NetworkTelemetryEvent`)         |
| Domain         | `domain.*`        | `@gtcx/domain` + `@gtcx/events` (`DomainEvent`)   |

## Logging Rules

1. Never log private keys or raw secrets.
2. Sanitize high-risk payloads before logging.
3. Include correlation IDs when available.
4. Preserve failure causality via `Error.cause` when wrapping errors.

## References

- `SOP/2-docs/2-specs/packages/logging.md`
- `SOP/2-docs/1-architecture/decisions/012-error-taxonomy-and-cause-propagation.md`
