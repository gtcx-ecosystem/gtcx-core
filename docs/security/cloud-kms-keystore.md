# Cloud KMS KeyStore — Design

**Module:** `gtcx_crypto::cloud_kms_keystore` (planned, not yet shipped)
**Feature flag:** `cloud_kms` (planned)
**Status:** Design complete; implementation deferred to a Rust toolchain bump
**Closes:** F-8 from [10/10 remediation plan](../audit/remediation-10-10.md) (architectural design)
**Cross-references:** [PKCS#11 KeyStore](./pkcs11-keystore.md), [Key Ceremony](./key-ceremony.md), [Trust Portal](../trust/README.md)

---

## Why this exists

The `KeyStore` trait in `rust/gtcx-crypto/src/keystore.rs` is backend-agnostic. Two implementations have shipped:

- `MemoryKeyStore` — in-process, zeroizing memory. Tests, single-process services.
- `Pkcs11KeyStore` — PKCS#11 module, hardware-backed. SoftHSM, AWS CloudHSM, hardware HSMs.

The natural third implementation is **cloud-managed KMS**: AWS KMS, GCP Cloud KMS, Azure Key Vault. These are appropriate for cloud-native deployments where the consumer doesn't run their own HSM but trusts a cloud provider's HSM-backed key service.

This document specifies the architecture. The implementation is deferred until the workspace's Rust toolchain is bumped from 1.88 to 1.91+ — `aws-sdk-kms` requires the newer rustc.

---

## Why deferred

`aws-sdk-kms 1.34+` (and its transitive deps `aws-smithy-types`, `aws-types`) require Rust 1.91. The workspace pins 1.88 in `rust-toolchain.toml` for cargo-deny and reproducibility reasons.

A toolchain bump is a workspace-wide decision because:

- Every Rust crate in the repo recompiles
- Cargo-deny rules may need re-validation
- Older rust-target deployments (some embedded contexts) may not have 1.91 available
- CI base images need updating

This isn't a hard blocker; it's a coordination issue. Bumping to 1.91 is a discrete task, ~1 day, including audit log updates and a CI matrix smoke test. Until that lands, this document specifies the design so the architectural slot is reserved and the code shape is unambiguous.

---

## Provider scope

**Phase 1 (this document):** AWS KMS only. AWS provides Ed25519 in KMS as of [2022](https://aws.amazon.com/about-aws/whats-new/2022/02/aws-key-management-service-asymmetric-keys-rsa-ecc-edwards-curve/), supports remote sign/verify operations, and is the most common cloud KMS consumed by institutional financial services.

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
    let aws_config = aws_config::load_from_env().await;

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
    let key_id = store.generate_key(Algorithm::Ed25519)?;
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

`KeyId` format: `cloud-kms:aws:<region>:<account>:key/<uuid>` — a parseable URI that can be round-tripped from the AWS KMS key ARN. Distinguishable from `mem-key-N` and `pkcs11:N`.

---

## KeyStore trait mapping

| `KeyStore` method                  | AWS KMS API call                                                                                                                                                                                                 | Notes                                                                                                                                                                                                                                                                                                                                                                                        |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `generate_key(Algorithm::Ed25519)` | `CreateKey` with `KeySpec=ECC_NIST_P256` for P-256 (KMS doesn't support raw Ed25519 spec naming; uses `ECC_NIST_P256` for ECDSA P-256 or `ECC_SECG_P256K1` for secp256k1, or no `KeySpec` for default symmetric) | Need to confirm Ed25519 spec name; AWS uses `ECC_*` prefixes. As of 2024 the value is `ECC_NIST_P256` only — Ed25519 is not yet a KMS-managed key spec. **This means AWS KMS cannot directly back Ed25519 today.** GCP Cloud KMS does support Ed25519 (`EC_SIGN_ED25519`). Adjust scope: AWS KMS implementation will support ECDSA P-256 and secp256k1; Ed25519 routes through GCP or Azure. |
| `sign(key_id, message)`            | `Sign` with `MessageType=RAW`, `SigningAlgorithm=ECDSA_SHA_256` (or appropriate)                                                                                                                                 | Async; block on tokio Handle.                                                                                                                                                                                                                                                                                                                                                                |
| `public_key(key_id)`               | `GetPublicKey`                                                                                                                                                                                                   | Returns DER-encoded SubjectPublicKeyInfo; we strip the SPKI envelope to return raw bytes.                                                                                                                                                                                                                                                                                                    |
| `key_state(key_id)`                | local read from `KeyStateStore`                                                                                                                                                                                  | Same trait as PKCS#11.                                                                                                                                                                                                                                                                                                                                                                       |
| `transition(key_id, new)`          | local write to `KeyStateStore` + `EnableKey` / `DisableKey` for KMS-side state coherence                                                                                                                         | Two-write pattern; if KMS write fails, rollback the local store.                                                                                                                                                                                                                                                                                                                             |
| `destroy_key(key_id)`              | `ScheduleKeyDeletion` (KMS enforces 7-30 day grace period)                                                                                                                                                       | KMS does not allow immediate destruction — the key enters `PendingDeletion`. The gtcx `KeyState::Destroyed` is set locally; the actual KMS key remains for the grace window.                                                                                                                                                                                                                 |

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

Recommendation: do (1) before (2). Adding `Algorithm::EcdsaP256` is a few hours of trait extension and the secp256k1 module already wired in `rust/gtcx-crypto/src/signing/secp256k1.rs` is a useful reference. The trait extension allows the same `CloudKmsKeyStore` to back ECDSA-using consumers (most banks) and the future GCP / Azure backend to back Ed25519-using consumers (developer-tier services).

This adjustment is documented but not yet executed; tracked as a Sprint 5+ task.

---

## Concurrency

`CloudKmsKeyStore` is `Send + Sync`. Internally:

- The `aws-sdk-kms` Client is `Clone + Send + Sync` (per aws-sdk-rust convention)
- Each method call creates a request future; we `Handle::current().block_on(future)` to bridge sync/async
- The state store has its own concurrency model (memory or filesystem)

Caller responsibility: a tokio runtime must be available when `CloudKmsKeyStore` methods are invoked. If invoked from a non-tokio context, calls panic with a clear error. The constructor captures the handle at build time and uses it at call time — no runtime is created internally.

---

## Authentication

Standard AWS SDK credential chain:

1. Environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`)
2. Shared credentials file (`~/.aws/credentials`)
3. EC2 IMDS (instance metadata) for EC2-hosted services
4. ECS task role
5. Web identity token (for EKS / OIDC federation)

`gtcx-core` does not implement any AWS auth itself; it uses `aws_config::load_from_env()` which routes through the standard chain.

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

Once implementation lands:

### Unit tests (no AWS account)

- `KeyId` ARN parsing / generation round-trip
- State store integration (using the same `MemoryKeyStateStore` from PKCS#11)
- Mock the AWS SDK client trait for happy-path and error-path coverage

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
4. Verify the signature using `signing::secp256k1::verify` (or P-256 equivalent once added)
5. Schedule deletion (7-day grace) — leaves key in `PendingDeletion`, doesn't affect future test runs
6. Assert state-store + KMS-side state coherence

---

## Roadmap to ship

| Step                                                   | Effort                | Dependency          |
| ------------------------------------------------------ | --------------------- | ------------------- |
| Bump rust-toolchain.toml from 1.88 → 1.91              | ~1 day workspace-wide | None                |
| Add `Algorithm::EcdsaP256` variant + signing module    | ~half day             | Toolchain bump      |
| Implement `CloudKmsKeyStore` for AWS KMS               | ~2 days               | Algorithm extension |
| Integration tests (AWS account, paid for the duration) | ~half day             | AWS account         |
| GCP Cloud KMS implementation (Ed25519-capable)         | ~2 days               | AWS done            |
| Azure Key Vault implementation                         | ~2 days               | GCP done            |

**Total:** ~1.5 weeks. Currently deferred until workspace toolchain bump is approved.

---

## Cross-references

- [PKCS#11 KeyStore](./pkcs11-keystore.md) — sibling implementation; same trait, different backend
- [Key Ceremony](./key-ceremony.md) — NIST SP 800-57 lifecycle context
- [Trust Portal](../trust/README.md) — section "Cryptographic correctness"
- [10/10 Remediation Plan](../audit/remediation-10-10.md) — F-8

## Changelog

- **1.0.0** (2026-05-10) — Initial design. Implementation deferred pending toolchain bump from 1.88 → 1.91. Critical scope finding: AWS KMS does not support Ed25519; the implementation will require adding `Algorithm::EcdsaP256` first.
