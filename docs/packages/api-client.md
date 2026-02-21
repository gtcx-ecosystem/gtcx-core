# @gtcx/api-client

Low‑level HTTP client with retry, request signing hooks, and optional mTLS support. Designed for Node runtimes and service‑to‑service integration.

## Scope

- `request()` helper with retries and timeout
- Typed error taxonomy (`ApiClientError`, `HttpError`, `NetworkError`, etc.)
- Optional request signing
- Optional mTLS via `undici` dispatcher

## Key Exports

From `packages/api-client/src/index.ts`:

- `createApiClient` (factory)
- Error classes: `ApiClientError`, `GTCXError`, `HttpError`, `AuthError`, `NetworkError`, `TimeoutError`, `SigningError`, `ConfigurationError`
- Types: `ApiClientOptions`, `RequestOptions`, `ApiResponse`, `RequestSigner`

## Example

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

- Offline queueing and protocol‑level clients are not included in this package.
- mTLS support is Node‑only (requires `undici`).

## References

- `docs/operations/release-checklist.md`
