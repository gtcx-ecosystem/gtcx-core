# @gtcx/api-client

Resilient HTTP client for GTCX service-to-service and backend integration. Provides retry, timeout, request signing, and optional mTLS support.

## Scope

- `createApiClient` factory with configurable retry and timeout
- Typed error taxonomy
- Optional request signing hook
- Optional mTLS via `undici` dispatcher

## Key Exports (`packages/api-client/src/index.ts`)

| Export               | Description                                    |
| -------------------- | ---------------------------------------------- |
| `createApiClient`    | Factory — returns a configured client instance |
| `ApiClientError`     | Base error class                               |
| `GTCXError`          | GTCX-specific error                            |
| `HttpError`          | HTTP 4xx/5xx                                   |
| `AuthError`          | Authentication failure                         |
| `NetworkError`       | Connection failure                             |
| `TimeoutError`       | Request timeout                                |
| `SigningError`       | Request signing failure                        |
| `ConfigurationError` | Misconfiguration                               |
| `ApiClientOptions`   | Client configuration type                      |
| `RequestOptions`     | Per-request options                            |
| `ApiResponse`        | Response wrapper type                          |
| `RequestSigner`      | Signing hook interface                         |

## Usage

```ts
import { createApiClient } from '@gtcx/api-client';

const client = createApiClient({
  baseUrl: 'https://api.gtcx.io',
  signer: async (ctx) => ({
    'x-gtcx-signature': signRequest(ctx.method, ctx.url),
  }),
  mtls: {
    cert: process.env.MTLS_CERT,
    key: process.env.MTLS_KEY,
  },
});

const response = await client.request({ method: 'GET', path: '/health' });
```

## Notes

- mTLS support is Node.js-only (requires `undici`).
- Offline queueing and protocol-level clients are not included.
