---
'@gtcx/verification': major
---

**Breaking:** `tracedVerifyCertificate()` now requires a `RevocationChecker`

Closes SA-004 / AT-002. The certificate verify path previously had no revocation check at all — a revoked certificate with a valid signature passed verification. This is a high-severity gap for any sandbox-regulator submission.

**What changed:**

- `tracedVerifyCertificate(certificate, revocationChecker)` — new required second arg
- `RevocationChecker` interface exported from `@gtcx/verification`:
  ```ts
  interface RevocationChecker {
    check(certificate: Certificate): Promise<RevocationStatus>;
  }
  ```
- `CertificateVerificationResult.checks` now includes `notRevoked: boolean`
- Fail-closed semantics: if the checker throws or times out, `notRevoked` is set to `false` and the verify result is `isValid: false` with a `revocation check failed` reason
- Confidence calculation now divides by 5 checks (was 4); a fully-valid certificate scores 1.0; a certificate that fails only revocation scores 0.8

**Three factory functions provided:**

- `createInMemoryRevocationChecker()` — backed by the existing singleton `RevocationRegistry`. Suitable for tests and single-process environments. Not durable.
- `createDenyAllRevocationChecker(reason?)` — always returns `revoked: true`. Use during incident response or as a fail-safe when the real backend isn't wired up.
- `createNoopRevocationChecker()` — always returns `revoked: false`. **Tests only — using this in production silently reintroduces SA-004.**

**Migration:**

Every call to `tracedVerifyCertificate(cert)` becomes `tracedVerifyCertificate(cert, checker)`. Production deployments should implement a `RevocationChecker` that consults their authoritative source (status list endpoint, on-chain registry, internal database). Tests can use `createNoopRevocationChecker()` for code paths where revocation is out of scope.

See `docs/security/threat-model.md` (Scenario 1) and `packages/verification/src/certificates/revocation.ts:124-200`.
