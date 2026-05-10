# Threat Control Matrix — GTCX Core

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Cryptographic Security Engineer

**Version:** 1.0.0
**Last reviewed:** 2026-03-18
**Review cycle:** Quarterly

---

## Controls

| Control ID | Threat              | Mitigation                                   | Package            | Evidence                                          |
| ---------- | ------------------- | -------------------------------------------- | ------------------ | ------------------------------------------------- |
| TC-001     | Key compromise      | Ed25519 signing with audited noble/curves    | @gtcx/crypto       | `packages/crypto/src/signing.ts`                  |
| TC-002     | Hash collision      | SHA-256/BLAKE3 with domain separation        | @gtcx/crypto       | `packages/crypto/src/hashing.ts`                  |
| TC-003     | ZKP forgery         | Commitment verification with Pedersen scheme | @gtcx/crypto       | `packages/crypto/src/zkp.ts`                      |
| TC-004     | Input injection     | Zod schema validation at all boundaries      | @gtcx/domain       | `packages/domain/src/schemas.ts`                  |
| TC-005     | XSS/injection       | HTML/SQL/JS sanitization layer               | @gtcx/security     | `packages/security/src/validation/sanitize.ts`    |
| TC-006     | Unauthorized access | Zone-based permission system                 | @gtcx/security     | `packages/security/src/auth/permissions.ts`       |
| TC-007     | Session hijacking   | TTL-based token lifecycle                    | @gtcx/security     | `packages/security/src/auth/tokens.ts`            |
| TC-008     | Offline data theft  | Encrypted offline storage                    | @gtcx/security     | `packages/security/src/offline/secure-storage.ts` |
| TC-009     | Replay attack       | Nonce + timestamp verification               | @gtcx/crypto       | `packages/crypto/src/signing.ts`                  |
| TC-010     | DID spoofing        | Cryptographic DID resolution                 | @gtcx/identity     | `packages/identity/src/resolver.ts`               |
| TC-011     | Evidence tampering  | Hash-chained proof bundles                   | @gtcx/verification | `packages/verification/src/proofs/bundler.ts`     |
| TC-012     | API request forgery | HMAC request signing                         | @gtcx/api-client   | `packages/api-client/src/index.ts`                |
