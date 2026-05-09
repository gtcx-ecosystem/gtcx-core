# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in gtcx-core, please report it responsibly.

**Do NOT open a public GitHub issue for security vulnerabilities.**

Email: **security@gtcx.io**

The internal response process is documented in [`SECURITY-INCIDENT.md`](./SECURITY-INCIDENT.md).

Include:

- Description of the vulnerability
- Steps to reproduce
- Affected package(s) and version(s)
- Impact assessment (if known)

## Response Timeline

| Severity | Initial Response | Fix Target   |
| -------- | ---------------- | ------------ |
| Critical | 24 hours         | 72 hours     |
| High     | 48 hours         | 7 days       |
| Medium   | 7 days           | 30 days      |
| Low      | 14 days          | Next release |

## Scope

This policy covers all packages in the `@gtcx/*` npm scope and the `gtcx-*` Rust crates published from this repository.

## Security Practices

- All cryptographic operations use audited libraries (`@noble/curves`, `@noble/hashes`, `ed25519-dalek`)
- No custom cryptographic primitives
- `#![deny(unsafe_code)]` enforced across all Rust crates
- SBOM (CycloneDX) generated on every CI build
- Trivy vulnerability scanning on every PR
- 12 threat controls mapped and validated in CI
- Private keys wiped from memory after use (`secureWipe`)
- Constant-time comparison for all security-sensitive operations
- JSON.parse size-bounded at all trust boundaries

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 1.x     | Yes       |
| < 1.0   | No        |
