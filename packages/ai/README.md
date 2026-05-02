# @gtcx/ai

Observability stubs and tracing hooks for AI-native operations.

> **Stub package.** `traced()` and `withTrace()` are no-ops in this package. The full tracing implementation lives in `gtcx-intelligence` and is injected at runtime via the optional peer dependency pattern described in [ADR-008](../../_sop/2-docs/3-engineering/6-decisions/008-optional-tracing-peer-deps.md). Downstream packages (`@gtcx/crypto`, `@gtcx/verification`) gracefully degrade when the full implementation is unavailable.

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
