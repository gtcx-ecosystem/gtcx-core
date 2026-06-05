# @gtcx/utils

Common utility functions for GTCX applications.

## Installation

```bash
pnpm add @gtcx/utils
```

## Quick Start

```typescript
import { generateId, retry, debounce, safeJsonParse } from '@gtcx/utils';

const id = generateId();
const data = safeJsonParse('{"key": "value"}');
const result = await retry(() => fetchData(), { maxAttempts: 3 });
```

## API

| Export               | Description                 |
| -------------------- | --------------------------- |
| `sleep(ms)`          | Async delay                 |
| `generateId()`       | Generate unique ID          |
| `safeJsonParse(str)` | Parse JSON without throwing |
| `retry(fn, opts)`    | Retry with backoff          |
| `debounce(fn, ms)`   | Debounce function           |
| `throttle(fn, ms)`   | Throttle function           |
| `deepClone(obj)`     | Deep clone object           |

## License

MIT
