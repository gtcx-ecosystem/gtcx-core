# Sprint 3: API Client Enterprise Hardening

**Goal**: Add signing, mTLS, and structured error taxonomy to the API client.
**Status**: Complete (2026-02-21)

## Scope

- Request signing hooks for enterprise integrations
- mTLS support for node-based deployments
- Structured error taxonomy and classes
- Tests + docs updates

## Out of Scope

- Circuit breaker and offline queue (future sprint)
- Full `GTCXClient` protocol/client surface (separate epic)

## Tasks

- [x] API-001: Add request signing hooks
- [x] API-002: Add mTLS dispatcher support for Node
- [x] API-003: Implement structured error taxonomy + classes
- [x] API-004: Update README and package docs
- [x] API-005: Add tests for signing and error classification
- [x] API-006: UAT evidence run and log entry (mTLS evidence executed)

## Acceptance Criteria

1. Signing hooks inject headers per request
2. Node mTLS can be configured via client options
3. Errors are categorized and typed for retry logic
4. Tests cover signing, auth error, and timeout classification

## UAT Scenarios

1. Signed request includes signature header
2. mTLS configured client negotiates TLS (node env)
3. Auth error categorized and surfaced as `AuthError`

## References

- `SOP/2-docs/3-engineering/security/security-framework.md`
- `SOP/2-docs/2-specs/packages/api-client.md`
- `SOP/3-agile/uat-evidence-log.md` — Sprint 3
