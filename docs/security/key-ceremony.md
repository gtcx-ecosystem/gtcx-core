# Key Ceremony — gtcx-core

**Version:** 1.0.0
**Status:** Active
**Last reviewed:** 2026-05-08
**Review cycle:** Annually or on key compromise
**Standard:** NIST SP 800-57 Rev. 5

---

## Scope

This document covers key generation, storage, rotation, and destruction procedures for all cryptographic key material managed through gtcx-core packages. It applies to:

- Ed25519 signing keys (`@gtcx/crypto`)
- Secp256k1 keys (`@gtcx/crypto`)
- DID keys (`@gtcx/identity`)
- HMAC request signing keys (`@gtcx/api-client`)

---

## 1. Key Generation

### 1.1 Environment Requirements

| Requirement              | Standard               | Implementation                                                               |
| ------------------------ | ---------------------- | ---------------------------------------------------------------------------- |
| Entropy source           | NIST SP 800-90A        | Node.js `crypto.randomBytes()` backed by OS CSPRNG; Rust `rand::rngs::OsRng` |
| Key generation isolation | SP 800-57              | Client-side only. Private keys never transit a network.                      |
| Air-gapped generation    | Required for root keys | Offline device with verified OS. Not applicable for per-session DID keys.    |

### 1.2 Key Types and Generation Paths

| Key Type        | Algorithm | Generation Function                      | Entropy Source                                                   |
| --------------- | --------- | ---------------------------------------- | ---------------------------------------------------------------- |
| Ed25519 signing | Ed25519   | `generateKeyPair()`                      | `@noble/curves/ed25519.utils.randomPrivateKey()` → OS CSPRNG     |
| Secp256k1       | ECDSA     | `generateSecp256k1KeyPair()`             | `@noble/curves/secp256k1.utils.randomPrivateKey()` → OS CSPRNG   |
| FIPS P-256      | ECDSA     | `fipsGenerateKeyPair()`                  | `node:crypto.generateKeyPairSync('ec', { namedCurve: 'P-256' })` |
| DID key         | Ed25519   | `createIdentity()` → `generateKeyPair()` | Same as Ed25519 signing                                          |
| HMAC signing    | SHA-256   | `crypto.randomBytes(32)`                 | OS CSPRNG                                                        |

### 1.3 Post-Generation Verification

After key generation, the following self-tests execute:

1. **Pairwise consistency test**: Sign a known message with the new key, verify with the derived public key
2. **Key format validation**: `isValidPublicKey()` and `isValidPrivateKey()` check byte lengths
3. **DID derivation**: Verify `derivePublicKey(privateKey)` matches the generated public key

If any self-test fails, the key pair is discarded and generation retries (max 3 attempts).

---

## 2. Key Storage

### 2.1 Storage Tiers

| Tier                      | Use Case                   | Storage Mechanism                                         | Security Level                  |
| ------------------------- | -------------------------- | --------------------------------------------------------- | ------------------------------- |
| **Tier 0 — Ephemeral**    | Per-request signing        | In-memory only, `secureWipe()` after use                  | Volatile — lost on process exit |
| **Tier 1 — Software**     | Device-local DID keys      | Encrypted local storage (`@gtcx/security` secure storage) | AES-256-GCM at rest             |
| **Tier 2 — Cloud HSM**    | Organizational root keys   | AWS CloudHSM / Azure Dedicated HSM / HashiCorp Vault      | FIPS 140-2 Level 3              |
| **Tier 3 — Hardware HSM** | Regulatory/government keys | YubiHSM 2 / Thales Luna                                   | FIPS 140-3 Level 3              |

### 2.2 Current State

gtcx-core currently implements **Tier 0** (ephemeral) and **Tier 1** (software encrypted storage). Tier 2/3 HSM integration is planned for Phase D of the remediation roadmap.

### 2.3 Storage Rules

- Private keys are never serialized to JSON, logged, or included in error messages
- `sanitizeSecrets()` is applied to all objects before logging (defense-in-depth via `redactSecrets()` in `@gtcx/ai`)
- Key material in memory is zeroized after use via `secureWipe()` (TypeScript) and `Zeroize` derive (Rust)
- No key escrow. Private keys are never transmitted to a server or third party.

---

## 3. Key Rotation

### 3.1 Rotation Schedule

| Key Type                 | Rotation Period | Trigger                 |
| ------------------------ | --------------- | ----------------------- |
| Per-session signing keys | Per session     | Session end             |
| Device DID keys          | 90 days         | Scheduled               |
| Organizational root keys | 365 days        | Scheduled               |
| Emergency rotation       | Immediate       | Key compromise detected |

### 3.2 Rotation Procedure

1. **Generate new key pair** using the same generation procedure (Section 1)
2. **Update DID document** to add the new public key and set the old key to `revoked` status
3. **Re-sign active certificates** that reference the old key (if within re-signing window)
4. **Publish DID update** to the DID resolution infrastructure
5. **Mark old key** as `rotated` in the key lifecycle state machine
6. **Retain old key** for verification of historical signatures (read-only, cannot sign)
7. **Schedule destruction** of old key after retention period (see Section 5)

### 3.3 Emergency Revocation

Triggered when:

- Key compromise is suspected or confirmed
- Operator credentials are revoked (dismissal, role change)
- Device is lost or stolen

Emergency procedure:

1. Immediately mark key as `revoked` in DID document
2. Publish revocation to all DID resolvers
3. Flag all certificates signed with the compromised key for re-verification
4. Generate new key pair and issue replacement certificates
5. File incident report per `docs/devops/runbooks/quality-runbook.md`

---

## 4. Key Lifecycle State Machine

```
created ──→ active ──→ rotated ──→ destroyed
                  └──→ revoked ──→ destroyed
```

| State       | Can Sign | Can Verify         | Transition                                         |
| ----------- | -------- | ------------------ | -------------------------------------------------- |
| `created`   | No       | No                 | → `active` after self-test and DID publication     |
| `active`    | Yes      | Yes                | → `rotated` (scheduled) or → `revoked` (emergency) |
| `rotated`   | No       | Yes                | → `destroyed` after retention period               |
| `revoked`   | No       | Yes (with warning) | → `destroyed` after retention period               |
| `destroyed` | No       | No                 | Terminal state                                     |

### Invalid Transitions (must be rejected)

- `created` → `rotated` (must be active first)
- `created` → `destroyed` (must be active and then rotated/revoked)
- `rotated` → `active` (cannot re-activate a rotated key)
- `revoked` → `active` (cannot re-activate a revoked key)
- `destroyed` → any state (terminal)

---

## 5. Key Destruction

### 5.1 Retention Period

| Key Type                 | Retention After Rotation/Revocation |
| ------------------------ | ----------------------------------- |
| Per-session keys         | 0 (immediate destruction)           |
| Device DID keys          | 90 days                             |
| Organizational root keys | 7 years (regulatory audit trail)    |

### 5.2 Destruction Procedure

1. Verify all certificates signed with the key have been re-verified or expired
2. Execute `secureWipe()` on all in-memory copies
3. Overwrite key storage with random data (3 passes)
4. Delete storage entry
5. Record destruction event in audit log with timestamp and operator identity
6. Verify key cannot be recovered (attempt DID resolution — must fail)

### 5.3 Rust Key Zeroization

All Rust key types derive `Zeroize` and `ZeroizeOnDrop`:

- `PrivateKey` — zeroized when dropped
- `KeyPair` — both private and public key bytes zeroized on drop
- No `Clone` on `PrivateKey` — prevents accidental copies

---

## 6. Recovery and Multi-Party Access

### 6.1 Shamir Secret Sharing (Planned — Phase D)

For organizational root keys, Shamir's Secret Sharing will split the key into `n` shares with threshold `t`:

| Configuration | Shares (n) | Threshold (t) | Use Case                  |
| ------------- | ---------- | ------------- | ------------------------- |
| Standard      | 5          | 3             | Organizational root key   |
| High-security | 7          | 4             | Government/regulatory key |

### 6.2 Recovery Procedure

1. Gather `t` share holders in a secure environment
2. Each holder provides their share via air-gapped device
3. Reconstruct key using Shamir reconstruction
4. Execute required operation (rotation, emergency signing)
5. Re-split key into new shares if reconstruction was for rotation
6. Zeroize reconstruction artifacts

---

## 7. Audit and Evidence

### 7.1 Events Logged

| Event             | Severity | Fields                                             |
| ----------------- | -------- | -------------------------------------------------- |
| Key generated     | Info     | algorithm, publicKeyFingerprint, timestamp         |
| Key activated     | Info     | publicKeyFingerprint, DID, timestamp               |
| Key rotated       | Warn     | oldFingerprint, newFingerprint, reason, timestamp  |
| Key revoked       | Error    | publicKeyFingerprint, reason, revokedBy, timestamp |
| Key destroyed     | Warn     | publicKeyFingerprint, destroyedBy, timestamp       |
| Self-test failure | Error    | algorithm, reason, timestamp                       |

### 7.2 Evidence Requirements

- All key lifecycle events are structured JSON (via `@gtcx/security` audit module)
- Events include operator identity (DID of the human or agent performing the action)
- Audit trail is append-only and hash-chained (tamper-evident)
- Retention: 7 years minimum for SOC 2 / ISO 27001 compliance

---

## References

- NIST SP 800-57 Rev. 5 — Recommendation for Key Management
- NIST SP 800-133 Rev. 2 — Recommendation for Cryptographic Key Generation
- NIST SP 800-90A — Recommendation for Random Number Generation Using Deterministic Random Bit Generators
- [Security Framework](./security-framework.md)
- [Threat Model](./threat-model.md)
- [FIPS Assessment](./fips-assessment.md)
