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
logger.error('Connection failed', { host: 'db.gtcx.io' });
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
