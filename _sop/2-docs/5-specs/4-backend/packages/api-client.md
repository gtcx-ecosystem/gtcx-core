# Package Spec — `@gtcx/api-client`

**Classification:** Standard — changes follow normal PR review process.

---

## Purpose

HTTP client for GTCX protocol services. Provides a typed, retrying, mTLS-capable API client with request signing, structured error categorization, and configurable timeout/retry policies. Used by services and applications that communicate with GTCX backend APIs.

---

## Public API

### Client

| Export             | Description                                                         |
| ------------------ | ------------------------------------------------------------------- |
| `ApiClientError`   | Error class — structured error with code, category, retryability    |
| `IApiClient`       | Interface: the client contract for dependency injection             |
| `ApiClientOptions` | Type: client configuration — base URL, timeout, retry, mTLS, signer |

### Request / Response

| Export                  | Description                                           |
| ----------------------- | ----------------------------------------------------- |
| `ApiResponse<T>`        | Type: typed response envelope                         |
| `RequestOptions`        | Type: per-request options — headers, timeout override |
| `RequestSigner`         | Interface: pluggable request signing                  |
| `RequestSigningContext` | Type: context passed to a signer                      |
| `MtlsOptions`           | Type: mTLS certificate configuration                  |

### Error Typing

| Export             | Description                                                                |
| ------------------ | -------------------------------------------------------------------------- |
| `ApiErrorCode`     | Enum: granular error codes (timeout, auth, rate-limit, server-error, etc.) |
| `ApiErrorCategory` | Enum: high-level categories (network, auth, client, server)                |

---

## Dependencies

| Dependency | Role                                        |
| ---------- | ------------------------------------------- |
| `undici`   | High-performance HTTP/1.1 and HTTP/2 client |

No `@gtcx/*` dependencies. This package is deliberately isolated from domain logic.

---

## Default Behavior

| Parameter        | Default                                                      |
| ---------------- | ------------------------------------------------------------ |
| Timeout          | 30,000ms                                                     |
| Retry attempts   | 3                                                            |
| Retry base delay | 250ms                                                        |
| Retry max delay  | 2,000ms (exponential backoff)                                |
| Retryable errors | Network errors, 5xx responses, rate limit (429)              |
| Non-retryable    | Auth failures (401, 403), bad request (400), not found (404) |

---

## Request Signing

The `RequestSigner` interface allows plugging in any signing scheme. The GTCX default implementation uses Ed25519 signatures via `@gtcx/crypto` — injected by the consuming service, not bundled in this package.

---

## Non-Goals

- Does not implement WebSocket or streaming connections
- Does not manage authentication tokens — callers inject a signer
- Does not contain business logic — purely a transport utility

---

## Implementation

`packages/api-client/src/`

---

## Reference

- [`_sop/2-docs/5-specs/4-backend/packages/crypto.md`](./crypto.md) — Ed25519 request signing
- [`_sop/2-docs/5-specs/4-backend/core-spec.md`](../core-spec.md) — system overview
