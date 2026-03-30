# @gtcx/ai

AI integration hooks and tracing utilities.

## Installation

```bash
pnpm add @gtcx/ai
```

## Quick Start

```typescript
import { traced, createCategoryLogger } from '@gtcx/ai';

const classify = traced('classify', async (data) => {
  return { category: 'gold', confidence: 0.97 };
});

const logger = createCategoryLogger('ai.classification');
logger.info('Done', { confidence: 0.97 });
```

## API

| Export                           | Description                |
| -------------------------------- | -------------------------- |
| `traced(name, fn)`               | Wrap function with tracing |
| `withTrace(name, fn)`            | Create traced version      |
| `createCategoryLogger(category)` | Scoped logger              |

> No runtime dependencies.

## Related

- [ADR-008: Optional Tracing via Peer Dependencies](../../_sop/2-docs/3-engineering/6-decisions/008-optional-tracing-peer-deps.md)

## License

MIT
