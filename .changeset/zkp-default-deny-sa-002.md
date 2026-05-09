---
'@gtcx/crypto': major
---

**Breaking:** `HashCommitmentZkpEngine.generate()` now fails closed by default

Closes SA-002. The placeholder hash-commitment engine produces output indistinguishable from random bytes to a verifier, but its previous default was warn-only. Sandbox regulators and AI-driven verification pipelines could miss the warning and consume placeholder proofs as real ZK proofs.

**What changed:**

- `HashCommitmentZkpEngine.generate()` throws unless `GTCX_ALLOW_HASH_COMMITMENT_ZKP=1` is set (literal string `'1'` — `'true'`, `'yes'`, etc. do not opt in)
- `createZkpEngine()` factory's no-native fallback path also throws by default; the same flag opts in
- `verify()` remains open without the flag — services that only validate proofs they receive do not need to opt in
- `GTCX_REQUIRE_NATIVE=true` continues to surface a pointed error message when native bindings are unavailable; this flag's behavior is unchanged

**Migration:**

If your service generates placeholder proofs intentionally (testing, non-regulatory contexts), set `GTCX_ALLOW_HASH_COMMITMENT_ZKP=1`. For production, install `@gtcx/crypto-native` and use `createZkpEngine()` — it auto-selects the native arkworks backend (Groth16, Bulletproofs, Schnorr).

Tests that exercise `generate()` should wrap with `vi.stubEnv('GTCX_ALLOW_HASH_COMMITMENT_ZKP', '1')` in `beforeEach`.

See `docs/security/threat-model.md` (SA-002 row) and `packages/crypto/src/zkp.ts:113-152`.
