---
title: 'Cloud Kms Keystore'
status: 'current'
date: '2026-05-17'
owner: 'crypto-security-engineer'
role: 'crypto-security-engineer'
tier: 'critical'
tags: ['docs', 'security']
review_cycle: 'quarterly'
---

# Cloud KMS KeyStore

**Module:** `gtcx_crypto::cloud_kms_keystore`
**Feature flag:** `cloud_kms`
**Status:** Current
**Closes:** `SEC-001` from [10/10 remediation plan](../remediation/remediation-plan.md) — AWS-first cloud-managed custody path
**Cross-references:** [PKCS#11 KeyStore](./pkcs11-keystore.md), [Key Ceremony](./key-ceremony.md), [Trust Portal](../governance/trust-portal.md)

---

## Why this exists

The `KeyStore` trait in `rust/gtcx-crypto/src/keystore.rs` is backend-agnostic. Two implementations have shipped:

- `MemoryKeyStore` — in-process, zeroizing memory. Tests, single-process services.
- `Pkcs11KeyStore` — PKCS#11 module, hardware-backed. SoftHSM, AWS CloudHSM, hardware HSMs.

The natural third implementation is **cloud-managed KMS**: AWS KMS, GCP Cloud KMS, Azure Key Vault. These are appropriate for cloud-native deployments where the consumer doesn't run their own HSM but trusts a cloud provider's HSM-backed key service.

The AWS-first implementation now ships behind `cargo --features cloud_kms`. The workspace toolchain floor moved to Rust `1.91` so the AWS SDK can compile in CI and local development.

---

## What shipped

Sprint 1 shipped the minimum honest AWS KMS path:

- Workspace bump from Rust `1.88` to `1.91`
- `Algorithm::EcdsaP256` added to `gtcx_crypto::keystore`
- `signing::p256` module added for deterministic ECDSA P-256 signing + verification
- `CloudKmsKeyStore` implemented behind `--features cloud_kms`
- Feature-gated CI lane added in `.github/workflows/ci.yml`
- Integration test added at `rust/gtcx-crypto/tests/cloud_kms_integration.rs` and skipped cleanly unless `GTCX_AWS_KMS_INTEGRATION=1`

Two items are intentionally still external or follow-on work:

- Real AWS-backed integration proof still requires a credentialed account and budgeted key lifecycle exercise.
- GCP Cloud KMS and Azure Key Vault adapters remain future work.

---

## Provider scope

**Phase 1 (current):** AWS KMS only. AWS is the institutional default for cloud-native buyer environments and supports ECDSA P-256 remote sign / verify operations.

**Phase 2 (Sprint 5+):** GCP Cloud KMS. Similar API surface, separate SDK (`google-cloud-kms`).

**Phase 3 (Sprint 5+):** Azure Key Vault. Different model — Key Vault is more vault-than-KMS, with managed HSM as the FIPS-validated tier.

Each phase is a separate trait implementation. No common abstraction across providers; the `KeyStore` trait is the common abstraction.

---

## API design

```rust
use std::sync::Arc;
use aws_config::SdkConfig;
use gtcx_crypto::keystore::{Algorithm, KeyState, KeyStore, KeyId};
use gtcx_crypto::cloud_kms_keystore::{CloudKmsKeyStore, AwsKmsConfig};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // 1. Load AWS config from environment / IMDS / instance profile.
    let aws_config = aws_config::load_defaults(aws_config::BehaviorVersion::latest()).await;

    // 2. Construct the keystore. Holds an aws-sdk-kms Client internally.
    //    The handle to the current tokio runtime is captured at
    //    construction so the synchronous KeyStore trait can block on
    //    async API calls.
    let store = CloudKmsKeyStore::new(AwsKmsConfig {
        sdk_config: aws_config,
        // Optional: AWS region override. Default is config's region.
        region: None,
        // Optional: tag propagation for KMS keys. KMS supports tags;
        // gtcx-core uses them for KeyState lifecycle tracking when no
        // external state store is supplied.
        tag_prefix: "gtcx-".to_string(),
    })?;

    // 3. Use the standard KeyStore trait.
    let key_id = store.generate_key(Algorithm::EcdsaP256)?;
    let signature = store.sign(&key_id, b"message")?;
    let public_key = store.public_key(&key_id)?;

    // Lifecycle. KMS has its own state model (Enabled/Disabled/PendingDeletion);
    // the gtcx KeyState machine layers on top via a configurable state store
    // identical to Pkcs11KeyStore's KeyStateStore trait.
    store.transition(&key_id, KeyState::Rotated)?;
    store.destroy_key(&key_id)?; // calls ScheduleKeyDeletion (7-day default)

    Ok(())
}
```

`KeyId` format: `cloud-kms:aws:<region>:<account>:key:<uuid>` — a parseable identifier that round-trips from an AWS KMS key ARN. Distinguishable from `mem-key-N` and `pkcs11:N`.

---

## KeyStore trait mapping

| `KeyStore` method                    | AWS KMS API call                                                                         | Notes                                                                                                                                                                        |
| ------------------------------------ | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `generate_key(Algorithm::EcdsaP256)` | `CreateKey` with `KeySpec=ECC_NIST_P256`, `KeyUsage=SIGN_VERIFY`                         | This is the shipped AWS path. `Algorithm::Ed25519` is rejected explicitly by `CloudKmsKeyStore` because AWS KMS still does not expose an Ed25519 key spec.                   |
| `sign(key_id, message)`              | `Sign` with `MessageType=RAW`, `SigningAlgorithm=ECDSA_SHA_256` (or appropriate)         | Async; block on tokio Handle.                                                                                                                                                |
| `public_key(key_id)`                 | `GetPublicKey`                                                                           | Returns DER-encoded SubjectPublicKeyInfo; we strip the SPKI envelope to return raw bytes.                                                                                    |
| `key_state(key_id)`                  | local read from `KeyStateStore`                                                          | Same trait as PKCS#11.                                                                                                                                                       |
| `transition(key_id, new)`            | local write to `KeyStateStore` + `EnableKey` / `DisableKey` for KMS-side state coherence | Two-write pattern; if KMS write fails, rollback the local store.                                                                                                             |
| `destroy_key(key_id)`                | `ScheduleKeyDeletion` (KMS enforces 7-30 day grace period)                               | KMS does not allow immediate destruction — the key enters `PendingDeletion`. The gtcx `KeyState::Destroyed` is set locally; the actual KMS key remains for the grace window. |

The `KeyStateStore` trait from PKCS#11 is **shared** with cloud KMS — same interface, same `MemoryKeyStateStore` and `FileSystemKeyStateStore` implementations work unchanged.

### Important scope adjustment — AWS KMS does not support Ed25519

This is the load-bearing finding from the trait mapping. AWS KMS supports:

- RSA (2048, 3072, 4096)
- ECDSA NIST P-256, P-384, P-521
- ECDSA secp256k1
- Symmetric (AES, HMAC)

Ed25519 is **not** in the AWS KMS algorithm catalog as of the most recent SDK survey. Two paths:

1. **Add ECDSA P-256 to gtcx-core's `Algorithm` enum.** Use ECDSA P-256 for AWS KMS-backed keys. This matches FIPS-approved algorithms anyway (Ed25519 is FIPS-validated through aws-lc-rs but not via every cloud provider).
2. **Use GCP Cloud KMS or Azure Key Vault for Ed25519.** Both support Ed25519 directly.

Recommendation remains: use AWS KMS for P-256 institutional custody today, and add GCP / Azure Ed25519 adapters only when a concrete consumer requires them.

---

## Concurrency

`CloudKmsKeyStore` is `Send + Sync`. Internally:

- The `aws-sdk-kms` Client is `Clone + Send + Sync` (per aws-sdk-rust convention)
- Each method call creates a request future; we `Handle::current().block_on(future)` to bridge sync/async
- The state store has its own concurrency model (memory or filesystem)

Caller responsibility: a tokio runtime must be active when the keystore is constructed. The constructor captures its handle and the sync `KeyStore` methods use that handle to bridge to AWS's async SDK. No runtime is created internally.

---

## Authentication

Standard AWS SDK credential chain:

1. Environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`)
2. Shared credentials file (`~/.aws/credentials`)
3. EC2 IMDS (instance metadata) for EC2-hosted services
4. ECS task role
5. Web identity token (for EKS / OIDC federation)

`gtcx-core` does not implement any AWS auth itself; callers typically build config with `aws_config::load_defaults(aws_config::BehaviorVersion::latest())`, which routes through the standard chain.

For workloads running in AWS:

- IAM role with `kms:CreateKey`, `kms:Sign`, `kms:GetPublicKey`, `kms:ScheduleKeyDeletion`, `kms:EnableKey`, `kms:DisableKey`, `kms:TagResource`, `kms:DescribeKey`
- Optional but recommended: a KMS key policy that restricts which IAM principals can perform which actions, scoped per key

---

## Cost notes

AWS KMS pricing (2026 levels):

- $1/key/month for asymmetric keys
- $0.03 per 10K signing requests
- $0.03 per 10K Sign / Verify / GetPublicKey calls

For a service signing 100K times per month with 100 active keys, the monthly cost is roughly $100 (keys) + $0.30 (signing). Cheaper than maintaining your own HSM cluster for most use cases; more expensive than `MemoryKeyStore` (free) by definition.

GCP Cloud KMS pricing is broadly similar; Azure Key Vault has a different per-operation pricing model.

---

## Testing strategy

### Unit tests (no AWS account)

- `KeyId` ARN parsing / generation round-trip
- State transition matrix parity with `MemoryKeyStore`
- Explicit invalid-key-ID rejection

### Integration tests (AWS account required)

Gated by `GTCX_AWS_KMS_INTEGRATION=1`. Skipped silently when unset, so CI without AWS credentials still passes.

```bash
GTCX_AWS_KMS_INTEGRATION=1 \
  AWS_REGION=us-east-1 \
  cargo test -p gtcx-crypto --features cloud_kms --test cloud_kms_integration
```

The integration tests should:

1. Generate an ECDSA P-256 key
2. Sign a known message
3. Get the public key
4. Verify the signature using `signing::p256::verify`
5. Schedule deletion (7-day grace) — leaves key in `PendingDeletion`, doesn't affect future test runs
6. Assert state-store + KMS-side state coherence

---

## Remaining roadmap

| Step                                                        | Effort    | Dependency                                 |
| ----------------------------------------------------------- | --------- | ------------------------------------------ |
| Run credentialed AWS integration proof in CI or staging     | ~half day | AWS account                                |
| Add state-store rollback coverage for KMS transition errors | ~half day | AWS mocking seam or staged fault injection |
| GCP Cloud KMS implementation (Ed25519-capable)              | ~2 days   | AWS path stable                            |
| Azure Key Vault implementation                              | ~2 days   | GCP done                                   |

**Current shipped scope:** AWS KMS + ECDSA P-256, feature-gated.

---

## Cross-references

- [PKCS#11 KeyStore](./pkcs11-keystore.md) — sibling implementation; same trait, different backend
- [Key Ceremony](./key-ceremony.md) — NIST SP 800-57 lifecycle context
- [Trust Portal](../governance/trust-portal.md) — section "Cryptographic correctness"
- [10/10 Remediation Plan](../remediation/remediation-plan.md) — `SEC-001`

## Changelog

- **1.1.0** (2026-05-10) — AWS-first implementation shipped behind `--features cloud_kms`, with Rust `1.91`, `Algorithm::EcdsaP256`, and integration-test scaffolding.
- **1.0.0** (2026-05-10) — Initial design. Identified the AWS Ed25519 gap and the required `Algorithm::EcdsaP256` extension.
