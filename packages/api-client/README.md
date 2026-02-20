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

## Signing

```typescript
const client = createApiClient({
  baseUrl: 'https://api.gtcx.io',
  signer: async ({ method, url }) => ({
    'x-signature': signRequest(method, url),
  }),
});
```

## mTLS (Node.js)

```typescript
const client = createApiClient({
  baseUrl: 'https://api.gtcx.io',
  mtls: {
    cert: process.env.MTLS_CERT!,
    key: process.env.MTLS_KEY!,
    ca: process.env.MTLS_CA,
  },
});
```

## Errors

```typescript
import { AuthError, NetworkError, TimeoutError } from '@gtcx/api-client';
```

## API

| Export                  | Description              |
| ----------------------- | ------------------------ |
| `createApiClient(opts)` | Create configured client |
| `ApiClientOptions`      | Configuration type       |
| `ApiResponse`           | Response envelope type   |

## License

MIT
