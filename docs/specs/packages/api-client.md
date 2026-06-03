---
title: 'Package Spec — `@gtcx/api-client`'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'standard'
tags: ['documentation', 'specs']
review_cycle: 'on-change'
---

---

title: 'Api Client'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs', 'specs']
review_cycle: 'on-change'

---

# Package Spec — `@gtcx/api-client`

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

**Classification:** Standard — changes follow normal PR review process.

---

## Purpose

HTTP client for GTCX protocol services. Provides a factory-based, typed, retrying, mTLS-capable API client with request signing, structured error categorization (8 categories, 7 error subclasses), and configurable timeout/retry policies. Used by services and applications that communicate with GTCX backend APIs.

---

## Public API

### Client Factory

| Export                     | Description                                                                                             |
| -------------------------- | ------------------------------------------------------------------------------------------------------- |
| `createApiClient(options)` | Factory: creates an `IApiClient` with configured base URL, retry, mTLS, and signing                     |
| `IApiClient`               | Interface: `{ get, post, put, delete }` — typed HTTP methods                                            |
| `ApiClientOptions`         | Interface: client configuration — baseUrl, timeout, retries, headers, signer, fetcher, dispatcher, mtls |

### Request / Response

| Export                  | Description                                                                                           |
| ----------------------- | ----------------------------------------------------------------------------------------------------- |
| `ApiResponse<T>`        | Interface: `{ data: T; status: number; headers: Record<string, string>; durationMs: number }`         |
| `RequestOptions`        | Interface: per-request options — headers, timeout, signal, signer, unsigned                           |
| `RequestSigner`         | Type: `(context: RequestSigningContext) => Promise<Record<string, string>> \| Record<string, string>` |
| `RequestSigningContext` | Interface: `{ method, url, headers, body?, attempt }`                                                 |
| `MtlsOptions`           | Interface: `{ key, cert, ca?, passphrase?, serverName?, rejectUnauthorized? }`                        |

### Error Classes

| Export               | Extends          | Description                                                                |
| -------------------- | ---------------- | -------------------------------------------------------------------------- |
| `ApiClientError`     | `Error`          | Base error class with `status?`, `code`, `category`, `retryable`, `cause?` |
| `GTCXError`          | `ApiClientError` | General GTCX protocol error                                                |
| `HttpError`          | `ApiClientError` | Non-OK HTTP response (4xx/5xx)                                             |
| `AuthError`          | `ApiClientError` | Authentication/authorization failure (401, 403)                            |
| `NetworkError`       | `ApiClientError` | Network-level failure (DNS, connection refused)                            |
| `TimeoutError`       | `ApiClientError` | Request timeout exceeded                                                   |
| `AbortError`         | `ApiClientError` | Request aborted by caller signal                                           |
| `SigningError`       | `ApiClientError` | Request signing failed                                                     |
| `ConfigurationError` | `ApiClientError` | Client configuration error (e.g., mTLS setup)                              |

### Error Typing

| Export             | Description                                                                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `ApiErrorCode`     | Type: `'HTTP_ERROR' \| 'NETWORK_ERROR' \| 'TIMEOUT' \| 'ABORTED' \| 'AUTH_ERROR' \| 'SIGNING_ERROR' \| 'CONFIG_ERROR' \| 'REQUEST_FAILED'` |
| `ApiErrorCategory` | Type: `'http' \| 'network' \| 'timeout' \| 'abort' \| 'auth' \| 'signing' \| 'config' \| 'unknown'`                                        |
| `ApiError`         | Interface: `{ message, status?, code?, category, retryable, cause? }` — plain error shape                                                  |

---

## Dependencies

| Dependency | Role                                         |
| ---------- | -------------------------------------------- |
| `undici`   | mTLS dispatcher (Agent) for Node.js runtimes |

No `@gtcx/*` dependencies. This package is deliberately isolated from domain logic. The `undici` dependency is used only for mTLS support via `undici.Agent`; HTTP requests use the global `fetch` by default (or a custom `fetcher` injected via options).

---

## Default Behavior

| Parameter        | Default                                                        |
| ---------------- | -------------------------------------------------------------- |
| Timeout          | 30,000ms                                                       |
| Retry attempts   | 3                                                              |
| Retry base delay | 250ms                                                          |
| Retry max delay  | 2,000ms (exponential backoff)                                  |
| Retryable errors | Network errors, 5xx responses, rate limit (429), timeouts      |
| Non-retryable    | Auth failures (401, 403), abort, signing errors, config errors |

---

## Request Signing

The `RequestSigner` type allows plugging in any signing scheme. A signer receives a `RequestSigningContext` (method, url, headers, body, attempt) and returns additional headers to merge. The GTCX default implementation uses Ed25519 signatures via `@gtcx/crypto` — injected by the consuming service, not bundled in this package. Per-request signing can be overridden or disabled via `RequestOptions.signer` or `RequestOptions.unsigned`.

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

- [`docs/specs/packages/crypto.md`](./crypto.md) — Ed25519 request signing
- [`docs/specs/core-spec.md`](../core-spec.md) — system overview
