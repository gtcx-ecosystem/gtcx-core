# Cryptographic Infrastructure Over Blockchain

## Document Control

| Attribute   | Value                                                             |
| ----------- | ----------------------------------------------------------------- |
| **Type**    | Research brief / position paper                                   |
| **Status**  | Active                                                            |
| **Related** | `cryptographic-verification.md`, `../specs/security-framework.md` |

---

## Abstract

This brief documents the decision to use cryptographic verification infrastructure rather than a blockchain ledger for GTCX trust systems. It focuses on security equivalence, operational practicality, and adoption constraints for real-world deployments.

## 1. Thesis

The security properties commonly attributed to blockchains are delivered by cryptographic primitives, not by the ledger itself. By deploying these primitives on conventional infrastructure, we achieve equivalent security with lower operational cost and higher adoption viability.

## 2. Cryptographic Primitives (Current)

| Primitive          | Usage in gtcx-core                             |
| ------------------ | ---------------------------------------------- |
| Hash functions     | Event chains, content addressing, Merkle trees |
| Digital signatures | Ed25519 event and credential signing           |
| ZK proofs          | Groth16, Bulletproofs, Schnorr                 |

## 3. Adoption Constraints

Common constraints in target deployments:

- Intermittent connectivity
- Regulated environments requiring auditability and control
- Feature-phone access constraints
- Need for predictable operational costs

## 4. Operational Advantages

- Standard cloud infrastructure and tooling
- Straightforward CI/CD and incident response
- Flexibility to adopt chain anchoring if needed

## 5. Optionality for Future Chains

The architecture remains chain-agnostic. If anchoring is required, Merkle roots can be published without schema changes.

## References

- `cryptographic-verification.md`
- `../specs/security-framework.md`
