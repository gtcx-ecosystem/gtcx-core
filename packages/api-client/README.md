# @gtcx/api-client

HTTP API client for GTCX services with retry and timeout handling.

## Installation

```bash
pnpm add @gtcx/api-client
```

## Quick Start

```typescript
import { createApiClient } from '@gtcx/api-client';

const client = createApiClient({ baseUrl: 'https://api.gtcx.io' });
```

## API

| Export                  | Description              |
| ----------------------- | ------------------------ |
| `createApiClient(opts)` | Create configured client |
| `ApiClientOptions`      | Configuration type       |
| `ApiResponse`           | Response envelope type   |

## License

MIT
