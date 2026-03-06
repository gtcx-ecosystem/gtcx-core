# Protocol: Security

## Version

1.0

## Authentication

- **JWT with short expiry** — access tokens expire in 15 minutes maximum.
- **Refresh tokens** — long-lived, stored securely, rotated on use.
- **OAuth2** for third-party integrations — use authorization code flow with PKCE.
- **No rolling your own crypto** — use established libraries (`jose`, `passport`, `next-auth`).

## Authorization

- **RBAC (Role-Based Access Control)** — define roles with explicit permissions.
- **Principle of least privilege** — grant only the minimum permissions required.
- **Check at the API boundary** — authorization is enforced in middleware or route guards, never only in the UI.
- **Document roles and permissions** — maintain a role matrix in the project's reference docs.

## Secrets Management

- **GCP Secret Manager** (or equivalent) for all production secrets.
- **Never in code** — no secrets in source files, `.env` files committed to git, Dockerfiles, or CI logs.
- **`.env` files are gitignored** — always. Use `.env.example` with placeholder values.
- **Rotation schedule:**
  - API keys: every 90 days
  - Database credentials: every 90 days
  - JWT signing keys: every 180 days
  - Immediately after any suspected exposure

## Input Validation

- **Validate at the API boundary** — every request is validated before processing.
  - TypeScript: **Zod** schemas
  - Python: **Pydantic** models
- **Sanitize user input** — strip or escape HTML/script content in user-provided strings.
- **Parameterized queries only** — no string concatenation in SQL. Use Prisma, SQLAlchemy, or equivalent ORM/query builder.
- **Reject unexpected fields** — use strict schemas that fail on unknown properties.

## Dependencies

- **Automated vulnerability scanning** — Snyk or GitHub Dependabot enabled on every repo.
- **Patch critical vulnerabilities within 24 hours.**
- **Patch high vulnerabilities within 7 days.**
- **Review dependency updates** — do not blindly auto-merge. Check changelogs for breaking changes.
- **Lock files committed** — `pnpm-lock.yaml`, `poetry.lock`, `Cargo.lock` are always in version control.

## Data Protection

- **Encrypt PII at rest** — use database-level or field-level encryption for personally identifiable information.
- **TLS for all traffic** — no unencrypted HTTP in staging or production. Enforce HTTPS.
- **Data classification:**
  | Level | Description | Examples |
  |-------|-------------|----------|
  | **Public** | Safe to share externally | Marketing content, public docs |
  | **Internal** | GTCX employees and contractors only | Architecture docs, internal tools |
  | **Confidential** | Need-to-know basis | Customer data, financial reports |
  | **Restricted** | Strict access controls, audit logged | Auth secrets, encryption keys, PII |

## Incident Response

If a secret or credential is exposed:

1. **Revoke immediately** — disable the compromised credential within minutes, not hours.
2. **Rotate** — generate a new credential and deploy it.
3. **Audit logs** — review access logs to determine if the credential was used maliciously.
4. **Notify** — inform the security lead and affected stakeholders.
5. **Post-mortem** — document what happened, how it was detected, and what changes prevent recurrence.

## Reference

- Template: [`templates/audits/security-audit.md`](/templates/audits/security-audit.md)
- Template: [`templates/hygiene/security-hygiene.md`](/templates/hygiene/security-hygiene.md)
