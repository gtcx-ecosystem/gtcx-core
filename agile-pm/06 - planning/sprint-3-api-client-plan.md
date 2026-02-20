# Sprint 3 Plan: API Client Enterprise Hardening

**Updated**: 2026-02-20  
**Sprint Goal**: Add signing, mTLS, and structured error taxonomy to the API client.  
**Status**: In progress  
**Epic**: Sprint 3 in `agile-pm/05 - roadmap/gtcx-core-full-spec-epics.md`

## Scope

- Request signing hooks for enterprise integrations.
- mTLS support for node-based deployments.
- Structured error taxonomy and classes.
- Tests + docs updates for the new capabilities.

## Out of Scope

- Circuit breaker and offline queue (future sprint).
- Full `GTCXClient` protocol/client surface (separate epic).

## Task Breakdown

- [x] API-001: Add request signing hooks.
- [x] API-002: Add mTLS dispatcher support for Node.
- [x] API-003: Implement structured error taxonomy + classes.
- [x] API-004: Update README and package docs.
- [x] API-005: Add tests for signing and error classification.
- [ ] API-006: UAT evidence run and log entry (mTLS pending; sandbox cannot bind).

## Acceptance Criteria

1. Signing hooks can inject headers per request.
2. Node mTLS can be configured via client options.
3. Errors are categorized and typed for retry logic.
4. Tests cover signing, auth error, and timeout classification.

## UAT Scenarios

1. Signed request includes signature header in request.
2. mTLS configured client negotiates TLS (node env).
3. Auth error is categorized and surfaced as `AuthError`.

## Dependencies

- Security framework: `docs/specs/security-framework.md`

## Estimates

- Engineering: 2 to 3 weeks.
- QA and UAT: 1 week.
