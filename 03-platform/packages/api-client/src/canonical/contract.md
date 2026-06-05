# Canonical Request Signing Contract v1

## Scope

This contract defines the canonical request signing format shared between:

- **gtcx-mobile** (Flutter client)
- **gtcx-protocols** (server-side PEP)
- **gtcx-infrastructure** (edge gateways, load balancers)

All implementations MUST produce byte-for-byte identical canonical request strings for the same logical request. Any drift breaks signature verification.

## Version

`v1` — specified by `CanonicalVersion = 'v1'`.

## Test Vectors

Locked test vectors are in `test-vectors.json`. All implementations MUST validate against these vectors before claiming compatibility.

Run vectors in this repo:

```bash
pnpm --filter @gtcx/api-client test -- src/canonical/test-vectors.test.ts
```

Downstream consumers should import `test-vectors.json` and run equivalent assertions in their language/framework.

## Canonicalization Rules

### 1. Path Normalization (`canonicalizePath`)

- Collapse repeated slashes: `//lots///123` → `/lots/123`
- Preserve single slashes and trailing slashes
- Do NOT percent-encode

### 2. Query String Normalization (`canonicalizeQueryString`)

- Sort by key alphabetically, then by value alphabetically
- Use `URLSearchParams.toString()` encoding (spaces → `+`, ampersands → `%26`)
- No `?` prefix in the canonical string

### 3. Body Hashing (`canonicalizeBody`)

- `null` or `undefined` body → SHA-256 of empty string
- String body → SHA-256 of the string
- `Uint8Array` body → SHA-256 of the bytes
- Output: lowercase hex string, 64 characters

### 4. Timestamp Format

- ISO 8601 UTC with milliseconds: `YYYY-MM-DDTHH:mm:ss.sssZ`
- Example: `2026-05-08T12:00:00.000Z`

### 5. Nonce Format

- 16 cryptographically random bytes
- Hex-encoded: 32 lowercase hex characters
- Example: `aabbccddeeff00112233445566778899`

### 6. DID Format (`formatDID`)

```
did:gtcx:tp_<first-32-chars-of-SHA256(publicKeyHex)>
```

- Prefix: `did:gtcx:tp_`
- Fingerprint: 32 hex characters
- Total length: 48 characters

### 7. Key ID Format (`formatKeyId`)

```
SHA256(`${did}:${keyRef}`).slice(0, 32)
```

- Without keyRef: `SHA256(did).slice(0, 32)`
- Output: 32 hex characters

### 8. Canonical Request String

9 lines, joined by `\n` (LF, no trailing newline):

```
{METHOD}
{normalizedPath}
{normalizedQueryString}
{bodyHash}
{timestamp}
{nonce}
{did}
{keyId}
{audience}
```

### 9. Signature

- Sign SHA-256 of the canonical request string
- Algorithm: Ed25519
- Signature encoding: hex string

### 10. Envelope Wire Format

Single header value, 6 semicolon-separated fields:

```
v1;ed25519;{keyId};{timestamp};{nonce};{signatureHex}
```

### 11. Auth Token (Bearer)

```
base64url(JSON({did, iat, exp})).<ed25519-signature>
```

- `iat`: issue time (unix ms)
- `exp`: expiration (unix ms)
- Default TTL: 5 minutes

## Clock Skew

Default tolerance: 5 minutes. Servers MAY reject requests outside this window.

## Header Names

| Header        | Name                 |
| ------------- | -------------------- |
| Authorization | `authorization`      |
| Auth Scheme   | `x-gtcx-auth-scheme` |
| DID           | `x-gtcx-did`         |
| Key ID        | `x-gtcx-key-id`      |
| Timestamp     | `x-gtcx-timestamp`   |
| Nonce         | `x-gtcx-nonce`       |
| Audience      | `x-gtcx-audience`    |
| Body Hash     | `x-gtcx-body-sha256` |
| Signature     | `x-gtcx-signature`   |

## Change Control

- Contract versions are immutable. `v2` would be a new type (`'v2'`).
- Test vectors are locked. Changes require a new version and migration path.
- All three downstream repos must validate against the same vector file before any contract change is accepted.
