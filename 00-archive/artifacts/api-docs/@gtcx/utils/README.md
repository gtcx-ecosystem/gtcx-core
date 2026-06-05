[**GTCX Core API Reference**](../../README.md)

***

[GTCX Core API Reference](../../README.md) / @gtcx/utils

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

## Functions

- [debounce](functions/debounce.md)
- [deepClone](functions/deepClone.md)
- [generateId](functions/generateId.md)
- [isDefined](functions/isDefined.md)
- [omit](functions/omit.md)
- [pick](functions/pick.md)
- [retry](functions/retry.md)
- [safeJsonParse](functions/safeJsonParse.md)
- [sleep](functions/sleep.md)
- [throttle](functions/throttle.md)
