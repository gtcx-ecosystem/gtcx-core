# @gtcx/security

Security utilities that complement `@gtcx/crypto`: input validation, auth/session helpers, offline secure storage, and audit logging.

## Scope

- Validation and sanitization
- Auth tokens, sessions, and permissions
- Offline secure storage and credential caching
- Security audit event logging

## Key Exports (`packages/security/src/index.ts`)

| Module         | Exports                                                  |
| -------------- | -------------------------------------------------------- |
| `validation/*` | Zod schemas and input sanitizers                         |
| `auth/*`       | Permission checks, session management, token helpers     |
| `offline/*`    | `SecureStorageBase`, `CredentialCache`, tamper detection |
| `audit/*`      | Security event logging interfaces and emitters           |

## Architecture Notes

- **Encryption**: provided by a pluggable `EncryptionProvider` interface. AES-256-GCM is the recommended implementation; no platform-specific provider ships in this package.
- **Storage backends**: injected by the consuming runtime (web, mobile, Node).
- All credential caching includes expiry, revocation window, and signature verification.

## References

- `../../../engineering/security/security-framework.md`
- `../../../engineering/security/threat-control-matrix.md`
- `packages/security/src/offline/storage.ts`
