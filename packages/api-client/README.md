# @gtcx/api-client

HTTP API client for GTCX services with retry, timeout handling, and canonical request signing.

## Installation

```bash
pnpm add @gtcx/api-client
```

## Quick Start

```typescript
import { createApiClient } from '@gtcx/api-client';

const client = createApiClient({ baseUrl: 'https://api.gtcx.io' });
```

## Canonical Request Signing

Both mobile and backend import the same canonicalization contract from `@gtcx/api-client/canonical` to prevent signature drift:

```typescript
import { createCanonicalSigner, verifyCanonicalSignature } from '@gtcx/api-client/canonical';

// Client side
const signer = createCanonicalSigner({
  privateKeyHex: 'a1b2...',
  publicKeyHex: 'c3d4...',
  keyRef: 'primary',
});

const client = createApiClient({
  baseUrl: 'https://api.gtcx.io',
  signer,
});

// Server side
const result = verifyCanonicalSignature(
  'POST',
  'https://api.gtcx.io/trades',
  headers,
  body,
  publicKeyHex
);
```

The canonical signing contract emits these headers on every authenticated request:

| Header | Value |
|--------|-------|
| `Authorization` | `Bearer <base64url({did,iat,exp}).<signature>` |
| `X-GTCX-Auth-Scheme` | `gtcx-signed-bearer-v1` |
| `X-GTCX-DID` | `did:gtcx:tp_<32-hex-chars>` |
| `X-GTCX-Key-Id` | `SHA-256("${did}:${keyRef}")[0:32]` |
| `X-GTCX-Timestamp` | ISO 8601 UTC milliseconds |
| `X-GTCX-Nonce` | 16-byte hex (32 chars) |
| `X-GTCX-Audience` | Request URL origin |
| `X-GTCX-Body-SHA256` | SHA-256 hex of body string |
| `X-GTCX-Signature` | Ed25519 signature of canonical request hash |

The **canonical request** is a 9-line string:

```
METHOD
normalizedPath
normalizedQueryString
bodyHash
timestamp
nonce
did
keyId
audience
```

Both sides hash this string with SHA-256, then sign the hash with Ed25519.

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

| Export | Description |
|--------|-------------|
| `createApiClient(opts)` | Create configured client |
| `createCanonicalSigner(keys, opts)` | Canonical request signer |
| `verifyCanonicalSignature(...)` | Server-side signature verifier |
| `buildCanonicalRequest(...)` | Build canonical request string |

## License

MIT
