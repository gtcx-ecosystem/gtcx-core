# Testing Evidence

User acceptance and delivery-quality evidence for `gtcx-core` releases.

| File                                           | Purpose                                                     |
| ---------------------------------------------- | ----------------------------------------------------------- |
| [`uat-evidence-log.md`](./uat-evidence-log.md) | Append-only log of UAT cycles, scope, results, and sign-off |

**Audience:** quality leads tracking delivery health, audit reviewers verifying release evidence, downstream consumers cross-checking what was tested before a release shipped.

This directory complements automated test gates (the 405+ tests in `@gtcx/crypto`, 109+ integration tests, 63/63 Rust FIPS tests) with the human-attested UAT layer that automated tests cannot replace.
