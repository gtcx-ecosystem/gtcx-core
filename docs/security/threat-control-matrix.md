# Threat Control Matrix

**Updated**: 2026-02-21

This matrix links high‑risk controls to executable evidence in the repository.

| Control ID | Threat                               | Control                                                       | Status   | Evidence                                                                          |
| ---------- | ------------------------------------ | ------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------- |
| SEC-001    | Input injection into APIs            | Schema validation + sanitization at trust boundaries          | Enforced | `packages/security/tests/sanitize.test.ts`                                        |
| SEC-002    | Unauthorized action execution        | Role/permission checks before protected operations            | Enforced | `packages/security/tests/permissions.test.ts`                                     |
| SEC-003    | Session replay / invalid token usage | Signed tokens + expiry + session validation                   | Enforced | `packages/security/tests/sessions.test.ts`                                        |
| SEC-004    | Offline credential misuse            | Cached credential expiry, revocation window, signature checks | Enforced | `packages/security/tests/credential-cache.test.ts`                                |
| SEC-005    | Tampered local secure storage        | Integrity checks + lockout and key verification               | Enforced | `packages/security/tests/storage.test.ts`                                         |
| SEC-006    | Certificate forgery                  | Certificate structure validation + signing preconditions      | Enforced | `packages/verification/tests/certificates.test.ts`                                |
| SEC-007    | Malformed QR replay or spoof         | QR structure validation and timestamp checks                  | Enforced | `packages/verification/tests/qr-codes.test.ts`                                    |
| SEC-008    | Proof bundle manipulation            | Structural checks + cryptographic proof references            | Enforced | `packages/verification/tests/proof-bundles.test.ts`                               |
| SEC-009    | Inconsistent domain validation       | Zod schema guardrails and strict parsing utilities            | Enforced | `packages/domain/tests/schemas.test.ts`                                           |
| SEC-010    | End‑to‑end trust regression          | Integration tests for identity/verification flows             | Enforced | `tests/integration/identity-verification.test.ts`                                 |
| SEC-011    | Cryptographic invariant regression   | Property tests for hash determinism and change sensitivity    | Enforced | `packages/crypto/tests/property-hashing.test.ts`                                  |
| SEC-012    | ZKP proof verification regression    | Groth16/Bulletproofs/Schnorr proof tests                      | Enforced | `rust/gtcx-zkp/src/lib.rs` tests                                                  |
| SEC-013    | Native crypto fallback errors        | Backend selection + native smoke tests                        | Enforced | `packages/crypto/tests/backend.test.ts`, `.github/workflows/crypto-native-ci.yml` |
