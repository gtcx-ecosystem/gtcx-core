# Cross-Protocol Integration Patterns

## Document Control

| Attribute         | Value                                                                                                                                          |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Scope**         | gtcx-core architecture                                                                                                                         |
| **Status**        | Publication-Ready                                                                                                                              |
| **Related Specs** | [Data Models](../specs/data-models.md), [Security Framework](../specs/security-framework.md), [Network Protocol](../specs/network-protocol.md) |

---

## 1. Overview

GTCX protocols do not operate in isolation. Every real-world commodity verification involves multiple protocols executing in coordinated sequence. This document defines the canonical integration patterns, the shared infrastructure that enables them, and the interface contracts between protocols.

### 1.1 Protocol Dependency Map

```
                    TradePass (Identity)
                   /        |         \
                  /         |          \
            GeoTag       VaultMark     GCI
          (Location)    (Custody)   (Compliance)
                \         |          /
                 \        |         /
                  PvP (Settlement)
                       |
                    PANX (Consensus)
```

Every protocol depends on TradePass for actor identity. PvP depends on all upstream protocols being satisfied before settlement can execute. PANX provides consensus attestation across the network.

### 1.2 Integration Depth Classification

| Integration   | Protocols                            | Shared Surface                                                          |
| ------------- | ------------------------------------ | ----------------------------------------------------------------------- |
| **Deep**      | TradePass + GeoTag + GCI             | Identity, cryptography, data models, verification workflows             |
| **Critical**  | VaultMark + TradePass + GeoTag + GCI | Custody chain integrity requires upstream verification at every handoff |
| **Atomic**    | PvP + all upstream protocols         | Settlement is blocked until all conditions from all protocols are met   |
| **Consensus** | PANX + PvP + GCI                     | Oracle price feeds and validator attestations gate settlement           |

---

## 2. Architecture Layers

### 2.1 Layer 1: Shared Authentication

All protocols share a single identity resolution path through TradePass.

```typescript
// Every protocol operation begins with identity resolution
interface ProtocolOperation {
  // The actor performing the operation
  actor: {
    did: string; // did:gtcx:tp_{hash}
    credential: VerifiableCredential;
    role: OperatorRole;
    verificationLevel: 'L0' | 'L1' | 'L2' | 'L3' | 'L4';
  };

  // The operation being performed
  operation: string;

  // Protocol-specific payload
  payload: unknown;

  // Cryptographic signature from actor's TradePass key
  signature: Ed25519Signature;
}
```

Identity is verified once at the protocol gateway and propagated via signed JWT to downstream protocol calls within the same workflow. This prevents redundant biometric checks while maintaining cryptographic proof of identity at each step.

### 2.2 Layer 2: Shared Cryptography

All protocols share the primitives defined in `@gtcx/crypto`:

| Primitive      | Algorithm             | Usage                                                     |
| -------------- | --------------------- | --------------------------------------------------------- |
| Signing        | Ed25519               | All protocol signatures, event signing, credential proofs |
| Hashing        | SHA-256, Blake3       | Content addressing, Merkle trees, audit chains            |
| Key Exchange   | X25519                | Encrypted protocol-to-protocol messages                   |
| Zero-Knowledge | Schnorr, Bulletproofs | GCI selective disclosure, GeoTag privacy proofs           |
| Key Derivation | HKDF-SHA-256          | Per-protocol key derivation from master identity key      |

Key derivation hierarchy (see [Security Framework](../specs/security-framework.md) Section 8.2):

```
TradePass Master Key
├── GeoTag Signing Key     (path: m/gtcx/geotag/0)
├── VaultMark Signing Key  (path: m/gtcx/vaultmark/0)
├── GCI Signing Key        (path: m/gtcx/gci/0)
├── PvP Signing Key        (path: m/gtcx/pvp/0)
└── PANX Voting Key        (path: m/gtcx/panx/0)
```

### 2.3 Layer 3: Shared Data Models

All protocols use the schemas defined in [Data Models](../specs/data-models.md) (Section 7). Shared types include:

- **Core primitives**: `GTCXDIDSchema`, `UUIDSchema`, `DateTimeSchema`, `CoordinatesSchema`
- **Asset schemas**: `AssetIdentitySchema`, `AssetTypeSchema`, `VerificationRecordSchema`
- **Identity schemas**: `TradePassDIDDocumentSchema`, `VerifiableCredentialSchema`
- **Compliance schemas**: `GCIInputSchema`, `GCIOutputSchema`
- **Settlement schemas**: `EscrowSchema`, `PaymentMethodSchema`

All cross-protocol data exchange uses these schemas with Zod runtime validation at every boundary.

### 2.4 Layer 4: Protocol Orchestration

The orchestration layer coordinates multi-protocol workflows via an event-driven architecture.

```typescript
interface WorkflowEngine {
  // Register a multi-protocol workflow
  register(workflow: WorkflowDefinition): void;

  // Execute a workflow instance
  execute(workflowId: string, input: WorkflowInput): Promise<WorkflowResult>;

  // Get workflow status
  status(instanceId: string): WorkflowStatus;
}

interface WorkflowDefinition {
  id: string;
  name: string;
  steps: WorkflowStep[];
  compensations: CompensationStep[]; // Rollback on failure
  timeout: number; // Max execution time (ms)
}

interface WorkflowStep {
  protocol: 'tradepass' | 'geotag' | 'vaultmark' | 'gci' | 'pvp' | 'panx';
  operation: string;
  input: (context: WorkflowContext) => unknown;
  guards: StepGuard[]; // Preconditions from prior steps
  retryPolicy: RetryPolicy;
}
```

Cross-protocol communication uses the `@gtcx/events` package with typed event contracts per protocol (83 total event types across 6 protocols).

---

## 3. Canonical Integration Patterns

### 3.1 Pattern: Full Verification Workflow

The most common pattern. Used when a commodity lot moves from producer to buyer with complete verification.

```
Actor authenticates via TradePass (L2+ required)
    │
    ▼
GeoTag captures origin location with GPS + photo evidence
    │
    ▼
VaultMark creates asset identity with weight + purity attributes
    │
    ▼
GCI calculates compliance score from verification data
    │  Score must meet buyer's minimum threshold (typically ≥65)
    │
    ▼
PvP creates escrow with release conditions:
    │  - GCI threshold met
    │  - Custody verified by VaultMark
    │  - PANX consensus reached (≥67% validators)
    │
    ▼
PANX validators attest to verification bundle
    │
    ▼
PvP executes atomic settlement:
    commodity → buyer, payment → seller (simultaneous)
```

**Cross-protocol data flow:**

| Step | Protocol  | Reads From                                          | Writes To                        |
| ---- | --------- | --------------------------------------------------- | -------------------------------- |
| 1    | TradePass | —                                                   | `actor.did`, `actor.credential`  |
| 2    | GeoTag    | `actor.did`                                         | `origin.coordinates`, `geoProof` |
| 3    | VaultMark | `actor.did`, `geoProof`                             | `assetId`, `verifications[]`     |
| 4    | GCI       | `actor.did`, `assetId`, `verifications[]`           | `gciScore`, `breakdown`          |
| 5    | PvP       | `assetId`, `gciScore`, `actor.did` (buyer + seller) | `escrowId`                       |
| 6    | PANX      | `escrowId`, `verifications[]`                       | `consensusAttestation`           |
| 7    | PvP       | `consensusAttestation`                              | `settlementReceipt`              |

### 3.2 Pattern: Supply Chain Custody Tracking

Used for tracking a commodity through multiple custody handoffs.

```
Production ──► Aggregation ──► Vault ──► Refinery ──► Final Buyer
    │              │             │           │            │
    GeoTag +       VaultMark    VaultMark   VaultMark    PvP
    TradePass      weight       weight +    assay +      settlement
    identity       verification purity      purity
```

At each custody handoff, the following occurs atomically:

```typescript
interface CustodyHandoff {
  // Both parties must be authenticated
  from: { did: string; signature: Ed25519Signature };
  to: { did: string; signature: Ed25519Signature };

  // Asset being transferred
  assetId: string;

  // Verification at handoff point
  verification: {
    weight: WeightMeasurement; // Must match within tolerance
    location: GeoTagProof; // GPS of handoff location
    timestamp: string; // ISO 8601
    photos: EvidenceReference[]; // Visual evidence
  };

  // Both signatures required for handoff to be valid
  // Creates an immutable link in the custody chain
}
```

### 3.3 Pattern: Government Inspector Workflow

Used when a government inspector performs field verification. Different from standard workflows because the inspector's TradePass has `verificationLevel: 'L4'` (government) and can write authoritative GCI attestations.

```
Inspector authenticates (L4 TradePass)
    │
    ▼
GeoTag verifies inspector is at the licensed mine site
    │  (coordinates must fall within license boundary polygon)
    │
    ▼
VaultMark: inspector records weight, purity, labor observations
    │
    ▼
GCI: inspector's attestation carries higher weight (government role)
    │  environmental + safety + regulatory factors updated
    │
    ▼
Event emitted: INSPECTION_COMPLETED
    │  All downstream systems (CRX, SGX) receive notification
```

### 3.4 Pattern: Offline-First Verification

Used in areas with no connectivity (40% of target users). All protocols support offline operation with eventual sync.

```
                    OFFLINE                          ONLINE
                    ──────                           ──────
TradePass: cached credential (72h validity)
GeoTag: GPS capture stored locally           ──►  Upload on reconnect
VaultMark: weight/photo stored locally       ──►  Sync via @gtcx/sync
GCI: provisional score (offline formula)     ──►  Recalculated server-side
PvP: queued in @gtcx/events offline queue    ──►  Settlement executes on sync
```

Conflict resolution per protocol:

| Protocol  | Offline Strategy | Rationale                                      |
| --------- | ---------------- | ---------------------------------------------- |
| TradePass | Last-write-wins  | Most recent credential update is authoritative |
| GeoTag    | Append-only      | Location proofs are immutable, never overwrite |
| VaultMark | Chain-validated  | Custody chain integrity must be maintained     |
| PvP       | Highest-version  | Latest settlement state wins                   |
| GCI       | Highest-version  | Compliance scores use version numbers          |
| PANX      | Server-wins      | Oracle prices are server-authoritative         |

---

## 4. Interface Contracts

### 4.1 Protocol-to-Protocol Event Types

Each protocol emits typed events that other protocols subscribe to:

| Emitting Protocol | Event                   | Consuming Protocols             |
| ----------------- | ----------------------- | ------------------------------- |
| TradePass         | `CREDENTIAL_ISSUED`     | GeoTag, VaultMark, GCI, PvP     |
| TradePass         | `CREDENTIAL_REVOKED`    | All (blocks further operations) |
| GeoTag            | `PROOF_CREATED`         | VaultMark, GCI                  |
| GeoTag            | `ANOMALY_DETECTED`      | GCI (triggers score reduction)  |
| VaultMark         | `CUSTODY_TRANSFERRED`   | PvP, GCI                        |
| VaultMark         | `CHAIN_BROKEN`          | PvP (blocks settlement), GCI    |
| GCI               | `SCORE_CALCULATED`      | PvP (release condition check)   |
| GCI               | `CERTIFICATION_GRANTED` | PvP, PANX                       |
| PvP               | `ESCROW_CREATED`        | PANX (triggers consensus round) |
| PvP               | `SETTLEMENT_COMPLETED`  | All (closes workflow)           |
| PANX              | `CONSENSUS_REACHED`     | PvP (release condition check)   |

### 4.2 Cross-Protocol Validation Rules

Before any protocol accepts data from another protocol, it validates:

1. **Signature verification**: The emitting protocol's signature is valid against the actor's TradePass public key
2. **Temporal validity**: The data is not older than the protocol's staleness threshold (configurable per protocol, default 24h)
3. **Schema validation**: The data parses against the expected Zod schema version
4. **Permission check**: The actor has the required role and verification level for the operation

```typescript
interface CrossProtocolValidator {
  validateSignature(data: SignedPayload, expectedDid: string): boolean;
  validateFreshness(timestamp: string, maxAgeMs: number): boolean;
  validateSchema<T>(data: unknown, schema: ZodType<T>): ValidationResult<T>;
  validatePermission(
    actor: ActorContext,
    requiredRole: OperatorRole,
    requiredLevel: string
  ): boolean;
}
```

---

## 5. Error Handling

### 5.1 Cross-Protocol Failure Modes

| Failure                                           | Impact                         | Recovery                                             |
| ------------------------------------------------- | ------------------------------ | ---------------------------------------------------- |
| TradePass credential expired mid-workflow         | All downstream steps blocked   | Re-authenticate, resume from last completed step     |
| GeoTag anomaly detected during custody handoff    | VaultMark handoff rejected     | Manual review by government inspector (L4)           |
| GCI score drops below threshold during settlement | PvP escrow paused              | Seller improves compliance factors, GCI recalculates |
| PANX consensus timeout                            | PvP settlement delayed         | Retry consensus round with fallback validator set    |
| Network partition during multi-protocol workflow  | Partial state across protocols | Compensation steps roll back incomplete operations   |

### 5.2 Compensation (Saga Pattern)

Multi-protocol workflows use the saga pattern for rollback:

```typescript
interface CompensationStep {
  // Which step to compensate
  stepIndex: number;

  // Compensation action
  action: (context: WorkflowContext) => Promise<void>;

  // Whether compensation is idempotent (safe to retry)
  idempotent: boolean;
}

// Example: if PvP escrow creation fails after VaultMark custody transfer,
// the compensation reverses the custody transfer back to the original holder
```

---

## 6. Related Documents

- [Data Models and Schemas](../specs/data-models.md) — Complete schema definitions for all cross-protocol types
- [Security Framework](../specs/security-framework.md) — Cryptographic standards, key hierarchy, threat model
- [Network Protocol](../specs/network-protocol.md) — Message transport, peer discovery, consensus messaging
- [EventCore Specification](../specs/eventcore.md) — Canonical event envelope format
- [Shared Infrastructure](./shared-infrastructure.md) — Package architecture and dependency graph
- [@gtcx/events](../packages/events.md) — Event bus and offline queue
- [@gtcx/sync](../packages/sync.md) — Offline-first synchronization engine
