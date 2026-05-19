---
title: 'rustls-webpki Vulnerability Mitigation'
status: 'current'
date: '2026-05-19'
owner: 'protocol-architect'
role: 'crypto-security-engineer'
tier: 'critical'
tags: ['security', 'rust', 'vulnerability', 'mitigation', 'rustsec']
review_cycle: 'on-change'
advisory_ids:
  - 'RUSTSEC-2026-0098'
  - 'RUSTSEC-2026-0099'
  - 'RUSTSEC-2026-0104'
affected_crate: 'rustls-webpki'
affected_version: '0.101.7'
---

# rustls-webpki Vulnerability Mitigation

## Advisories

| ID                | Date       | Title                                                                     | CVSS   |
| ----------------- | ---------- | ------------------------------------------------------------------------- | ------ |
| RUSTSEC-2026-0098 | 2026-04-14 | Name constraints for URI names were incorrectly accepted                  | Medium |
| RUSTSEC-2026-0099 | 2026-04-14 | Name constraints were accepted for certificates asserting a wildcard name | Medium |
| RUSTSEC-2026-0104 | 2026-04-22 | Reachable panic in certificate revocation list parsing                    | Medium |

## Dependency Path

```text
rustls-webpki 0.101.7
  rustls 0.21.12
    tokio-rustls 0.24.1
      hyper-rustls 0.24.2
        aws-smithy-http-client 1.1.12
          aws-smithy-runtime 1.11.1
            aws-config 1.8.16
              gtcx-crypto 0.1.0
```

All three advisories affect `rustls-webpki` 0.101.7, which is a transitive dependency brought in by the AWS SDK for Rust (`aws-config` → `aws-smithy-runtime` → `hyper-rustls` → `rustls` → `rustls-webpki`).

## Threat Model Assessment

### Why This Is Acceptable Risk

1. **No direct usage.** `gtcx-core` does not invoke `rustls-webpki` APIs directly. Certificate validation is entirely delegated to the AWS SDK's HTTP client.

2. **AWS endpoints use well-formed certificates.** The vulnerabilities involve malformed or adversarially crafted certificates with:
   - Invalid URI name constraints (RUSTSEC-2026-0098)
   - Wildcard names with name constraints (RUSTSEC-2026-0099)
   - Malformed CRL data (RUSTSEC-2026-0104)
     AWS Certificate Authority does not issue certificates matching these patterns.

3. **No custom TLS configuration.** We do not override `rustls` certificate validation logic, disable hostname verification, or implement custom name constraint handling.

4. **Deployment context.** In production deployments, GTCX nodes connect to AWS KMS endpoints over TLS. The attack surface requires an active MitM with the ability to present a specially crafted certificate signed by a trusted root — a threshold that makes these vulnerabilities non-exploitable in our operational context.

### What Would Make This Exploitable

These vulnerabilities would become actionable if any of the following were true:

- We implemented a custom TLS server that accepts client-provided certificates with name constraints.
- We parsed untrusted X.509 certificates or CRLs directly using `rustls-webpki`.
- We operated in an environment where a rogue CA could issue certificates to our infrastructure.

None of these conditions apply to `gtcx-core`.

## Remediation Plan

### Immediate (Now — Ongoing)

- **Monitor upstream.** Track `aws-smithy-http-client` and `hyper-rustls` releases for rustls 0.23+ migration.
- **Weekly `cargo audit`.** CI runs `cargo audit` on every push; failures are triaged within 24 hours.

### Short-Term (Next 4–8 Weeks)

- **Evaluate `aws-lc` TLS backend.** The AWS SDK is migrating to `aws-lc` as the default TLS backend. When available, this will remove the `rustls-webpki` dependency entirely.
- **Pin advisory exceptions.** If `cargo audit` blocks CI before upstream resolves, add explicit exceptions in `rust/deny.toml` with justification referencing this document.

### Long-Term (Next Quarter)

- **Upgrade to `rustls` 0.23+.** Once `hyper-rustls` and `aws-smithy-http-client` publish compatible versions, update `rust/Cargo.toml` and regenerate `Cargo.lock`.

## Monitoring

| Check                  | Frequency  | Owner              | Last Run   |
| ---------------------- | ---------- | ------------------ | ---------- |
| `cargo audit`          | Every push | CI                 | 2026-05-19 |
| Upstream issue tracker | Weekly     | protocol-architect | —          |
| `rustls` release notes | Weekly     | protocol-architect | —          |

## References

- [RUSTSEC-2026-0098](https://rustsec.org/advisories/RUSTSEC-2026-0098)
- [RUSTSEC-2026-0099](https://rustsec.org/advisories/RUSTSEC-2026-0099)
- [RUSTSEC-2026-0104](https://rustsec.org/advisories/RUSTSEC-2026-0104)
- [rustls-webpki changelog](https://github.com/rustls/webpki/blob/main/RELEASE_NOTES.md)
