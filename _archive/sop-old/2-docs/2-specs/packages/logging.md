# @gtcx/logging

Structured logging utilities for GTCX packages and services.

## Scope

- `Logger` class with configurable level filtering
- `createLogger` factory for named loggers
- Typed `LogEntry` and configuration types

## Key Exports (`packages/logging/src/index.ts`)

| Export         | Description                                                |
| -------------- | ---------------------------------------------------------- |
| `createLogger` | Factory — returns a named `Logger` instance                |
| `Logger`       | Logger class with `debug`, `info`, `warn`, `error` methods |
| `LogEntry`     | Structured log entry type                                  |
| `LoggerConfig` | Logger configuration type                                  |

## Notes

- Log levels: `debug`, `info`, `warn`, `error`.
- Structured output — all entries are objects, not plain strings.
- See `../../../operations/runbooks/telemetry-schema.md` for the required telemetry fields that consuming packages must emit.

## References

- `packages/logging/src/logger.ts`
