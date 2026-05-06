# Enterprise Release Artifact Pack

This is the standard release evidence pack for security-conscious downstream teams and auditors.

---

## Required Artifacts

| Artifact                                     | Purpose                                                  |
| -------------------------------------------- | -------------------------------------------------------- |
| `quality/release-<date>-evidence.md`         | Human-readable gate summary and residual risks           |
| `quality/api-surface-report.json`            | Public API diff against baseline                         |
| `quality/api-surface-baseline.json`          | Approved API contract baseline                           |
| `benchmarks/performance-report.json`         | Current benchmark and budget status                      |
| `artifacts/provenance-manifest.json`         | Build provenance and artifact integrity metadata         |
| SBOM output from the release workflow        | Supply-chain inventory for the published release         |
| SAST, secret-scan, and dependency evidence   | Release-candidate security gate proof                    |
| Docs from `docs/release/` and `docs/audits/` | Supportability, migration, and current-readiness posture |

---

## Expected Review Questions

The artifact pack should let a reviewer answer:

- What changed publicly?
- Which gates ran, and did they pass?
- What residual risk is still external?
- What does a downstream team need to validate before deployment?
- Was any API drift intentional and approved?
