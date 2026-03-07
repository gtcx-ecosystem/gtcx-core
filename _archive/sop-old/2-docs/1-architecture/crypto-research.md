# Cryptographic Infrastructure Over Blockchain

| Attribute | Value                           |
| --------- | ------------------------------- |
| Type      | Research brief / position paper |
| Status    | Active                          |

## Abstract

This brief documents the decision to use cryptographic verification infrastructure rather than a blockchain ledger for GTCX trust systems. It focuses on security equivalence, operational practicality, and adoption constraints for real-world deployments.

## Thesis

The security properties commonly attributed to blockchains are delivered by cryptographic primitives, not by the ledger itself. By deploying these primitives on conventional infrastructure, we achieve equivalent security with lower operational cost and higher adoption viability.

## Cryptographic Primitives (Current)

| Primitive          | Usage in gtcx-core                             |
| ------------------ | ---------------------------------------------- |
| Hash functions     | Event chains, content addressing, Merkle trees |
| Digital signatures | Ed25519 event and credential signing           |
| ZK proofs          | Groth16, Bulletproofs, Schnorr                 |

## Adoption Constraints in Target Deployments

- Intermittent connectivity
- Regulated environments requiring auditability and operational control
- Feature-phone and low-bandwidth access constraints
- Requirement for predictable operational costs

## Operational Advantages

- Standard cloud infrastructure and tooling
- Straightforward CI/CD and incident response
- Flexibility to adopt chain anchoring if requirements change

## Chain Optionality

The architecture remains chain-agnostic. If anchoring is required, Merkle roots can be published to a public ledger without schema changes.

## References

- `cryptographic-verification.md`
- `SOP/2-docs/3-engineering/security/security-framework.md`
