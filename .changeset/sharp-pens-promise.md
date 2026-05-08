---
'@gtcx/api-client': minor
---

Add canonical request canonicalization contract (`@gtcx/api-client/canonical`)

A shared server/client-safe signing contract aligned with the gtcx-mobile auth-token.ts implementation. Prevents mobile/backend drift:

- `createCanonicalSigner()` — produces a `RequestSigner` for `createApiClient`
- `verifyCanonicalSignature()` — server-side verification with clock-skew guard
- `buildCanonicalRequest()` — 9-line deterministic canonical string
- `formatDID()` / `formatKeyId()` — `did:gtcx:tp_<32-hex>` and 32-char key IDs
- Emits headers: `Authorization`, `X-GTCX-Auth-Scheme`, `X-GTCX-DID`, `X-GTCX-Key-Id`, `X-GTCX-Timestamp`, `X-GTCX-Nonce`, `X-GTCX-Audience`, `X-GTCX-Body-SHA256`, `X-GTCX-Signature`
- Generates short-lived bearer tokens: `base64url(JSON({did, iat, exp})).<signature>`

Both sides import identical canonicalization logic from the shared package.
