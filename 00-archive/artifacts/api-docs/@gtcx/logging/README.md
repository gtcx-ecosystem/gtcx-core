[**GTCX Core API Reference**](../../README.md)

***

[GTCX Core API Reference](../../README.md) / @gtcx/logging

# @gtcx/logging

Structured logging for GTCX services.

## Installation

```bash
pnpm add @gtcx/logging
```

## Quick Start

```typescript
import { createLogger } from '@gtcx/logging';

const logger = createLogger({ level: 'info' });
logger.info('Service started', { port: 3000 });
logger.error('Connection failed', { host: 'db.gtcx.trade' });
```

## API

| Export               | Description              |
| -------------------- | ------------------------ |
| `createLogger(opts)` | Create structured logger |
| `Logger`             | Logger interface         |
| `LogLevel`           | Log level type           |
| `LogEntry`           | Log entry type           |

> No runtime dependencies.

## License

MIT

## Classes

- [Logger](classes/Logger.md)

## Interfaces

- [LogEntry](interfaces/LogEntry.md)
- [LoggerConfig](interfaces/LoggerConfig.md)

## Type Aliases

- [LogLevel](type-aliases/LogLevel.md)

## Functions

- [createLogger](functions/createLogger.md)
