# gtcx-core v1.0.x GA Release Checklist

**Last reviewed:** 2026-05-06

**Owner**: Core Platform
**Scope**: gtcx-core — shared cryptographic and protocol foundation library
**Target**: v1.0.x GA (internal consumption by downstream GTCX repos)

---

## Release Gates

### Security

- [x] All security remediation sprints completed (Phases 0-3)
- [ ] Dependency scans clean (no critical/high CVEs in production deps) — 2026-05-02: 0 production vulns; 4 dev-only findings (vite, postcss)
- [ ] SAST clean (no critical/high findings) — CodeQL is configured in `.github/workflows/ci.yml`; attach latest clean result for the release candidate
- [ ] Secret scan clean — `pnpm security:secret-scan` is configured in CI/release; attach latest release-candidate output
- [ ] Pen test complete and no critical findings — not yet scheduled
- [x] Rust crates: `#![deny(unsafe_code)]` enforced; key material zeroized (`Zeroizing<T>`)

### Performance

- [x] All 12 crypto benchmarks within budget (Ed25519 sign 78us, verify 58us, key gen 48us)
- [x] Performance trend enforcement active (8% max regression, 5-sample window)
- [x] Benchmark results archived (`benchmarks/performance-report.json`, 2026-04-05)

### Compliance

- [ ] SOC2 evidence pipeline operational — pipeline documented, evidence not collected
- [x] ISO 27001 controls mapped (`docs/compliance/compliance-requirements.md`)
- [x] Audit log: hash-chain tamper detection in `rust/gtcx-crypto`
- [x] Change management: all changes via PR, conventional commits, ADRs for architecture decisions

### Documentation

- [x] API surface baselined and drift-checked (`quality/api-surface-baseline.json`, 2026-05-06)
- [x] Per-package READMEs complete (18 public packages + shared config workspace packages)
- [x] Cross-package integration guide published (`docs/specs/integration-guide.md`, `docs/specs/external-integration-guide.md`)
- [x] AI stub status documented (READMEs updated 2026-05-02)

### Supply Chain

- [x] Architecture boundary enforcement in CI (`tools/check-package-boundaries.mjs`)
- [x] Threat matrix validation in CI (`tools/check-threat-matrix.mjs`)
- [x] Provenance manifest generated (`artifacts/provenance-manifest.json`)
- [ ] SBOM published — generation scripted, not yet executed for a release

### Library-Specific (N/A for services)

- [x] No circular dependencies (enforced by `pnpm architecture:check`)
- [x] Dual CJS/ESM output for all packages
- [x] TypeScript strict mode with declaration maps
- [x] Changeset versioning configured (`.changeset/config.json`)
- [ ] Formal tagged release cut — zero git tags exist

---

## Sign-off

| Area       | Owner           | Sign-off | Date |
| ---------- | --------------- | -------- | ---- |
| Security   | CISO            | [ ]      |      |
| Platform   | CTO             | [ ]      |      |
| Product    | PM              | [ ]      |      |
| Compliance | Compliance Lead | [ ]      |      |

---

_All gates must be complete before GA release is authorized._
