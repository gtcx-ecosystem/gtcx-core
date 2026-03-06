# @gtcx/security

Security utilities that complement `@gtcx/crypto`: validation, auth/session helpers, offline secure storage, and audit logging.

## Scope

- Validation + sanitization (`validation/*`)
- Auth tokens, sessions, and permissions (`auth/*`)
- Offline secure storage + credential caching (`offline/*`)
- Audit logging (`audit/*`)

## Key Exports

From `packages/security/src/index.ts`:

- `validation/*` — Zod schemas + sanitizers
- `auth/*` — permissions, sessions, tokens
- `offline/*` — `SecureStorageBase`, `CredentialCache`, tamper detection
- `audit/*` — security event logging

## Notes

- Encryption is provided by a pluggable `EncryptionProvider` (AES‑256‑GCM recommended).
- Storage backends are injected for web, mobile, or node runtimes.

## References

- `docs/specs/security-framework.md`
- `packages/security/src/offline/storage.ts`
