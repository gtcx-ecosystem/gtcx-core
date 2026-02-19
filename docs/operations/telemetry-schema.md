# Telemetry Schema

Last updated: 2026-02-19

## Required Fields

All structured logs and operational events should include:

| Field           | Type                | Description                                                      |
| --------------- | ------------------- | ---------------------------------------------------------------- |
| `timestamp`     | number (epoch ms)   | Event emission time                                              |
| `category`      | string              | Domain category (`verification`, `compliance`, `security`, etc.) |
| `operationName` | string              | Canonical operation identifier                                   |
| `success`       | boolean             | Outcome flag                                                     |
| `durationMs`    | number \| null      | End-to-end execution duration                                    |
| `traceId`       | string \| undefined | Correlation ID across workflow                                   |
| `error.name`    | string \| undefined | Stable error class/code                                          |
| `error.message` | string \| undefined | Human-readable failure summary                                   |

## Logging Rules

1. Never log private keys or raw secrets.
2. Sanitize high-risk payload fields before logging.
3. Include `traceId` for all workflow-level operations.
4. Preserve failure causality (`Error.cause`) when wrapping errors.
