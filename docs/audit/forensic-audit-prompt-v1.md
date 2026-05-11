# Forensic Audit Prompt — Anti-Inflation Protocol

> **Status:** Current
> **Date:** 2026-05-11
> **Owner:** Quality & Evidence Lead
> **Version:** 1.0.0
> **Purpose:** Prevent documentation-inflated scores, hallucinated claims, and implementation vs. aspiration gaps in bank-grade certification audits.

This prompt is the mandatory methodology for any future master audit of `gtcx-core`. It was born from a hardcore sanity check that found the 2026-05-11 audit inflated its core score by ~1.1 points through false coverage claims, aspirational certification assertions, and opaque scoring adjustments.

---

## Golden Rule

**If a claim cannot be verified by running a command against the actual codebase, it does not exist.**

Documentation is evidence of _intent_. Commands are evidence of _reality_. Never conflate the two.

---

## Phase 1 — Coverage Forensics (Mandatory)

### 1.1 Never Trust the Audit's Coverage Table

**Procedure:**

1. Run `pnpm test:coverage:critical` (or per-package `vitest run --coverage`) independently.
2. Capture the **actual** output. Do not copy numbers from the prior audit.
3. For any package claiming ≥95% statements or branches, inspect the per-file breakdown.

**Red flags that require downgrading the coverage score:**

| Finding                                                              | Severity     | Action                                                          |
| -------------------------------------------------------------------- | ------------ | --------------------------------------------------------------- |
| Crypto/signing file <80% statements                                  | **Blocking** | Score cannot exceed 7.0/10 for Test Coverage                    |
| Any file with `/* v8 ignore */` hiding real logic (not barrel files) | **Blocking** | Exclude those lines from the "covered" count; report honest gap |
| Coverage table claims 100% but actual is <90%                        | **Blocking** | Audit integrity finding; flag as data fabrication               |
| Barrel files (pure re-exports) counted in coverage averages          | Minor        | Exclude from averages or mark as N/A                            |

**Command checklist:**

```bash
# Critical packages only
cd packages/crypto && pnpm vitest run --coverage
cd packages/domain && pnpm vitest run --coverage
cd packages/security && pnpm vitest run --coverage
cd packages/services && pnpm vitest run --coverage
cd packages/verification && pnpm vitest run --coverage
```

### 1.2 v8 Ignore Marker Audit

**Procedure:**

```bash
grep -rn "v8 ignore" packages/*/src/ --include="*.ts"
grep -rn "v8 ignore" rust/ --include="*.rs" | grep -v target
```

**For each `v8 ignore` block, answer:**

- Does it cover genuinely unreachable code (e.g., module-init require in a tested env)?
- Or does it cover a degradation path that _should_ be tested (e.g., pure-JS crypto fallback)?

**If the latter:** The coverage score must be calculated **with** those lines included, not excluded. Report the honest number.

---

## Phase 2 — Security Claims Forensics (Mandatory)

### 2.1 FIPS Validation

**Never accept:** "FIPS 140-3 via [dependency name]"

**Verify:**

```bash
# Check the actual sys crate being linked
cat rust/Cargo.lock | grep -A 5 "name = \"aws-lc-rs\""
# Look for aws-lc-sys (non-FIPS) vs aws-lc-fips-sys (CMVP-validated)
```

**Acceptable claim:** "FIPS feature flag wires `aws-lc-fips-sys` (CMVP #XXXX); validated at link time"
**Unacceptable claim:** "FIPS 140-3 via aws-lc-rs" when `Cargo.toml` lacks `features = ["fips"]`

**Score impact:** If the FIPS claim is false, Security score cap is 7.5/10 regardless of other controls.

### 2.2 SLSA Attestation Levels

**Source Level 2:**

- Verify: `git log --show-signature -5` shows GPG signatures
- Verify: `gh api repos/{owner}/{repo}/branches/main/protection/required_signatures`
- Verify enforcement date — if <30 days old, note as "recent enforcement"

**Build Level 3:**

- **Check npm:** `npm view @gtcx/crypto --json | jq '.dist.attestations'`
- If no packages published → **claim is aspirational**, not achieved.
- Check CI: Does `.github/workflows/release.yml` actually publish on merge, or only on `workflow_dispatch`?
- Check reproducible builds: Is `build:reproducible` run in CI, or just documented?

**Score impact:** Build L3 without published packages = 0 points for that sub-dimension.

### 2.3 Threat Matrix Validation

**Never accept:** "12/12 threats mitigated" without verifying the validator.

**Procedure:**

```bash
cat tools/check-threat-matrix.mjs | head -50
```

**If the validator only checks file existence** (not control effectiveness), the threat matrix score is capped at:

- 5.0/10 if gaps are documented in the threat model itself
- 3.0/10 if gaps are not documented

**Real validation requires:** Code review of at least 3 random mitigations to confirm they are implemented, not just described.

### 2.4 HSM/KMS Implementation Reality

**Never accept:** "CloudKmsKeyStore shipped" without checking for actual API calls.

**Procedure:**

```bash
grep -rn "aws_sdk_kms\|Client\|send()" rust/gtcx-crypto/src/cloud_kms_keystore.rs
```

**If the file is <100 lines and contains only trait scaffolding → not implemented.**
**If the file contains actual `.sign().key_id(...).send()` calls → implemented.**

---

## Phase 3 — Code Quality Forensics (Mandatory)

### 3.1 LOC Limits

**Procedure:**

```bash
find packages -name "*.ts" -not -path "*/node_modules/*" -not -path "*/dist/*" -exec wc -l {} + | sort -rn | head -20
find rust -name "*.rs" -not -path "*/target/*" -exec wc -l {} + | sort -rn | head -20
```

**If any source file exceeds 500 LOC:** The "no files >500 LOC" claim is false. Report the actual count and largest file.

### 3.2 TODO/FIXME/HACK Audit

**Procedure:**

```bash
grep -rni "TODO\|FIXME\|HACK\|XXX" packages/*/src/ --include="*.ts" | grep -vi "toDownload"
grep -rni "TODO\|FIXME\|HACK\|XXX" rust/*/src/ --include="*.rs" | grep -v target
```

**Zero tolerance for source directories.** Test files and build scripts are exempt but must be noted.

### 3.3 Unsafe Block Audit

**Procedure:**

```bash
grep -rn "unsafe {" rust/ --include="*.rs" | grep -v target
grep -rn "unsafe fn" rust/ --include="*.rs" | grep -v target
```

**If zero matches:** Verify `#![deny(unsafe_code)]` exists in every crate's `lib.rs`.

---

## Phase 4 — Architecture & Ops Forensics (Mandatory)

### 4.1 Package Boundary Enforcement

**Procedure:**

```bash
pnpm architecture:check
```

**Verify the script actually checks boundaries**, not just counts files. Read `tools/check-package-boundaries.mjs` to confirm it validates `forbiddenImports`.

### 4.2 ops:check Reality

**Procedure:**

```bash
node tools/check-ops-prereqs.mjs
```

**For each check, ask:**

- Is it meaningful, or is it trivial? (e.g., "git is installed" vs "branch protection configured")
- Does it check actual state, or just file existence?
- Are WARN findings real gaps or noise?

**If >20% of checks are trivial:** Downgrade the Operational Readiness sub-score by 0.5.

### 4.3 Reproducible Builds

**Procedure:**

```bash
pnpm build:reproducible --canonicalize
```

**Verify it actually compares hashes**, not just exits 0. Look for:

- Two clean builds
- SHA-256 comparison
- Explicit pass/fail output

---

## Phase 5 — Global South Resilience Forensics (Mandatory)

### 5.1 Offline-First

**Verify actual implementation:**

```bash
grep -rn "class OfflineQueue\|class ConnectivityDetector" packages/ --include="*.ts"
```

**If only interfaces/types exist → not implemented.**
**If classes with logic and tests exist → implemented.**

### 5.2 USSD / Low-Bandwidth

**Procedure:**

```bash
grep -rn "USSD\|ussd" packages/ --include="*.ts" | grep -v "test" | grep -v "dist"
```

**If the only hits are enum values and test assertions → "described, not implemented"**
**If protocol handlers, message parsers, or session managers exist → implemented**

**Score impact:** String-only USSD support caps Resilience at 8.5/10.

---

## Phase 6 — Documentation Forensics (Mandatory)

### 6.1 Link Integrity

**Procedure:**

```bash
pnpm docs:check-links
```

**Verify the tool checks internal links**, not just counts files. If the tool fails on a deleted file, that's a real gap.

### 6.2 Frontmatter Sampling

**Procedure:**

```bash
for f in $(find docs -name "*.md" | grep -v README | shuf | head -10); do
  echo "=== $f ==="
  head -5 "$f"
done
```

**If >20% of sampled docs lack Status/Date/Owner → downscore Documentation by 0.5.**

---

## Phase 7 — Scoring Methodology Enforcement (Mandatory)

### 7.1 No Opaque Boosts

**The raw weighted score is the ceiling.** Any rounding or adjustment must be:

- Transparently documented
- Mathematically derived (not editorial)
- Applied consistently across all dimensions

**Forbidden:**

> "However, the Security and Enterprise dimensions carry the most institutional signal. Applying the prior audit's rounding convention..."

**Required:**

> "Security dimension receives a 1.2× multiplier because [specific reason backed by evidence]. Calculation: (9.5 × 1.2 × 20) ÷ 145 = ..."

### 7.2 Caps Must Be Real

**If a cap table exists, verify each cap trigger:**

| Cap                     | Trigger                      | Verification Command                                         |
| ----------------------- | ---------------------------- | ------------------------------------------------------------ |
| Unresolved critical     | Severity P0 open >7 days     | `gh issue list --label "severity:critical" --state open`     |
| Money in process memory | Private keys without Zeroize | `grep -rn "Zeroize\|zeroize" rust/gtcx-crypto/src/`          |
| No safe degraded-mode   | Missing fallback paths       | Review `native-loader.ts` and `signing.ts` fallback branches |

**If a cap should trigger but doesn't:** Score integrity finding.

---

## Phase 8 — Final Score Calculation

### Step 1: Calculate honest dimension scores

Apply all findings from Phases 1–7. Use the lower bound of any range.

### Step 2: Calculate raw weighted score

Use the audit's own weights. No opaque adjustments.

### Step 3: Document the gap

```
Claimed core score: X.X/10
Honest core score: Y.Y/10
Gap: Δ = X.X - Y.Y

Top 3 inflation sources:
1. [Dimension] — [Specific claim] claimed [X] but actual is [Y]
2. [Dimension] — [Specific claim] claimed [X] but actual is [Y]
3. [Dimension] — [Specific claim] claimed [X] but actual is [Y]
```

### Step 4: Audience lens honesty

For each lens, recalculate with honest scores. Document which claims an investor/enterprise/sovereign buyer would flag during due diligence.

---

## Anti-Patterns Checklist

Before finalizing any audit, verify NONE of these are present:

- [ ] Coverage table copied from prior audit without independent verification
- [ ] "FIPS" claim without checking the actual sys crate in Cargo.lock
- [ ] "SLSA Build L3" claim without checking npm registry for published attestations
- [ ] "12/12 mitigations" without reading the validator source code
- [ ] "No files >500 LOC" without checking Rust source files
- [ ] Opaque +0.3 (or any) score boost without mathematical derivation
- [ ] Documentation completeness scored as implementation completeness
- [ ] Feature flags scored as implemented features
- [ ] CI configuration scored as working CI (when billing is blocked)
- [ ] Aspirational roadmap items scored as current capabilities

---

## Cross-References

- [Master Audit 2026-05-11](./master-audit-2026-05-11.md) — first audit using this methodology
- [10/10 Remediation Plan](./remediation-2026-05-11.md)
- [Trust Portal](../governance/trust-portal.md)
- [SLSA Attestation](../security/slsa-attestation.md)
