# Phase B Execution Pack

> **Status:** Ready
> **Date:** 2026-05-11
> **Owner:** User (org-level authority required)

This document contains every remaining Phase B action from the [10/10 Remediation Plan](../audit/remediation-10-10.md), with exact commands and verification steps. Phase A (all in-repo technical work) is complete; this pack closes the operational layer.

---

## 1. Add GPG key to GitHub account

**Why:** Commits are signed but GitHub shows "Unverified" until the public key is registered.

**Action:**

```bash
# Step 1: Export the public key (already done, saved to /tmp/gtcx-gpg-key.asc)
cat /tmp/gtcx-gpg-key.asc

# Step 2: Add via gh CLI (requires admin:gpg_key scope)
gh auth refresh -h github.com -s admin:gpg_key
# Complete browser flow, then:
gh gpg-key add /tmp/gtcx-gpg-key.asc
```

**Or via web UI:** https://github.com/settings/gpg/new — paste the key block.

**Verification:** Push any signed commit; GitHub should show green "Verified" badge.

---

## 2. Fix GitHub Actions billing (F-10)

**Root cause:** All CI jobs fail with "recent account payments have failed or your spending limit needs to be increased."

**Action:**

1. Visit https://github.com/organizations/gtcx-ecosystem/settings/billing
2. Check **Actions** spending limit — increase or remove cap
3. Verify payment method is current (expired card is the most common cause)
4. Optional: visit https://github.com/organizations/gtcx-ecosystem/settings/actions to confirm runner minute allocation

**Verification:** Trigger a push to `main`; CI jobs should run for >30 seconds and complete.

---

## 3. Set org secrets (F-11, F-12, F-13)

These secrets operate at org scope so all repos in `gtcx-ecosystem` inherit them.

### 3.1 ANTHROPIC_API_KEY (F-11) — AI CODEOWNER primary

```bash
gh secret set ANTHROPIC_API_KEY --org gtcx-ecosystem --visibility all
# Paste key from https://console.anthropic.com/ when prompted
```

### 3.2 OPENAI_API_KEY (F-12) — AI CODEOWNER fallback

```bash
gh secret set OPENAI_API_KEY --org gtcx-ecosystem --visibility all
# Paste key from https://platform.openai.com/api-keys when prompted
```

### 3.3 TURBO_TOKEN + TURBO_TEAM (F-13) — Remote cache

```bash
# Generate at https://vercel.com/account/tokens
gh secret set TURBO_TOKEN --org gtcx-ecosystem

# Your Vercel team slug (not the token)
gh variable set TURBO_TEAM --org gtcx-ecosystem --body "<your-team-slug>"
```

### 3.4 NPM_TOKEN (F-13) — Publish path

```bash
# Generate at https://www.npmjs.com/settings/<user>/tokens (automation token)
gh secret set NPM_TOKEN --org gtcx-ecosystem
```

**Verification:**

```bash
pnpm ops:check
# Expected: 11 pass, 0 fail, 0 warn, 0 skip
```

---

## 4. Send Zimbabwe pre-submission email (F-14)

**Draft:** [`docs/gtm/09-pre-submission-email-zimbabwe.md`](../gtm/09-pre-submission-email-zimbabwe.md)

**Action:**

1. Open the draft above
2. Adapt the Subject and Body to your voice
3. Send to: **fintech@rbz.co.zw**
4. CC: **info@seczim.co.zw**
5. Attach (as PDFs when ready):
   - `docs/gtm/00-executive-brief.md`
   - `docs/gtm/01-security-posture.md`
   - `docs/gtm/02-compliance-matrix.md`
   - `docs/gtm/03-fips-readiness.md`

**Follow-up protocol:**

- Day 0: Send email
- Day 5: Follow up if no response
- Day 10: Escalate to phone if no response

**Verification:**

```bash
# Create response tracker
cp docs/gtm/09-pre-submission-email-zimbabwe.md docs/gtm/responses/zimbabwe-2026-05-11.md
# Add "Sent: 2026-05-11" to the top
```

---

## Completion Checklist

- [ ] GPG key added to GitHub (commits show "Verified")
- [ ] GitHub Actions billing fixed (CI runs end-to-end)
- [ ] ANTHROPIC_API_KEY set at org level
- [ ] OPENAI_API_KEY set at org level
- [ ] TURBO_TOKEN set at org level
- [ ] TURBO_TEAM variable set at org level
- [ ] NPM_TOKEN set at org level
- [ ] Zimbabwe email sent
- [ ] `pnpm ops:check` shows 11 pass, 0 warn
- [ ] `pnpm docs:check-links` exits 0
- [ ] `pnpm architecture:check` exits 0

---

## Post-Phase B: What's next

**Phase C — GTM Execution (1-4 weeks):**

- Send Namibia, Zambia, Ghana emails
- Track regulator responses in `docs/gtm/responses/`
- Draft first case study after first positive response

**Phase D — External Attestations (8-10 weeks, $25-50K):**

- Engage external pen-test firm ($8-25K)
- Engage CPA for SOC 2 Type 1 ($15-45K)
- Decision criterion: only initiate after Phase C reveals first-customer requirements

**Phase E — Moat Amplifiers (post-first-customer):**

- Open-source AI-CODEOWNER template (30+ PRs of track record)
