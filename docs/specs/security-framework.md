# Section 8: Security and Privacy

## Document Control

| Attribute              | Value                |
| ---------------------- | -------------------- |
| **Section**            | 8 of 14              |
| **Title**              | Security and Privacy |
| **Status**             | Publication-Ready    |
| **Primary Principles** | P2, P7, P9, P12      |

---

## 8.1 Overview

This section defines the comprehensive security and privacy framework for GTCX Protocol v3.0, establishing:

- **Cryptographic standards** for identity, signatures, and encryption
- **Key management** including HSM integration
- **Zero-knowledge proofs** for privacy-preserving verification
- **Threat models** with mitigations
- **Security monitoring** and incident response

### Security Philosophy

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     GTCX SECURITY PRINCIPLES                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. DEFENSE IN DEPTH                                                    │
│     Multiple layers of security controls                                │
│     No single point of failure                                          │
│                                                                         │
│  2. LEAST PRIVILEGE                                                     │
│     Minimum access necessary for function                               │
│     Time-bounded permissions                                            │
│                                                                         │
│  3. ZERO TRUST                                                          │
│     Verify every request                                                │
│     Assume breach mindset                                               │
│                                                                         │
│  4. PRIVACY BY DESIGN                                                   │
│     Data minimization                                                   │
│     Selective disclosure                                                │
│                                                                         │
│  5. CRYPTOGRAPHIC PROOF                                                 │
│     Mathematical certainty over institutional trust                     │
│     Verifiable without revealing secrets                                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 8.2 Cryptographic Standards

### 8.2.1 Algorithm Selection

| Purpose                  | Algorithm   | Key Size | Standard        |
| ------------------------ | ----------- | -------- | --------------- |
| **Digital Signatures**   | Ed25519     | 256-bit  | RFC 8032        |
| **Key Exchange**         | X25519      | 256-bit  | RFC 7748        |
| **Symmetric Encryption** | AES-256-GCM | 256-bit  | NIST SP 800-38D |
| **Hashing**              | SHA-256     | 256-bit  | FIPS 180-4      |
| **Hashing (Extended)**   | SHA-512     | 512-bit  | FIPS 180-4      |
| **Key Derivation**       | HKDF-SHA256 | Variable | RFC 5869        |
| **Password Hashing**     | Argon2id    | 256-bit  | RFC 9106        |
| **Random Generation**    | CSPRNG      | Variable | NIST SP 800-90A |

### 8.2.2 Signature Scheme

```typescript
// crypto/signatures.ts
import { z } from 'zod';

/**
 * Ed25519 Signature Configuration
 */
export const Ed25519Config = {
  algorithm: 'Ed25519',
  keySize: 256,
  signatureSize: 512, // 64 bytes
  publicKeySize: 256, // 32 bytes
  privateKeySize: 512, // 64 bytes (includes public key)
} as const;

/**
 * Signature Schema
 */
export const SignatureDataSchema = z.object({
  /** Algorithm identifier */
  algorithm: z.literal('Ed25519'),

  /** Base64-encoded signature (64 bytes) */
  value: z.string().regex(/^[A-Za-z0-9+/]{86}==$/, 'Invalid Ed25519 signature format'),

  /** Key ID used for signing */
  keyId: z.string(),

  /** Timestamp of signature */
  created: z.string().datetime(),
});

export type SignatureData = z.infer<typeof SignatureDataSchema>;

/**
 * Signing interface
 */
export interface ISigner {
  /**
   * Sign a message
   * @param message - Data to sign (will be hashed)
   * @returns Signature with metadata
   */
  sign(message: Uint8Array): Promise<SignatureData>;

  /**
   * Verify a signature
   * @param message - Original message
   * @param signature - Signature to verify
   * @param publicKey - Public key for verification
   * @returns Whether signature is valid
   */
  verify(message: Uint8Array, signature: SignatureData, publicKey: Uint8Array): Promise<boolean>;

  /**
   * Get the public key
   */
  getPublicKey(): Uint8Array;

  /**
   * Get the key ID
   */
  getKeyId(): string;
}

/**
 * Signature creation flow
 */
export async function createSignature(
  signer: ISigner,
  data: Record<string, unknown>
): Promise<SignatureData> {
  // 1. Canonicalize data (deterministic JSON)
  const canonical = JSON.stringify(data, Object.keys(data).sort());

  // 2. Hash the canonical form
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(canonical));

  // 3. Sign the hash
  return signer.sign(new Uint8Array(hash));
}
```

### 8.2.3 Encryption Scheme

```typescript
// crypto/encryption.ts
import { z } from 'zod';

/**
 * AES-256-GCM Encryption Configuration
 */
export const AES256GCMConfig = {
  algorithm: 'AES-GCM',
  keySize: 256,
  ivSize: 96, // 12 bytes (NIST recommendation)
  tagSize: 128, // 16 bytes
} as const;

/**
 * Encrypted data envelope
 */
export const EncryptedEnvelopeSchema = z.object({
  /** Algorithm identifier */
  algorithm: z.literal('AES-256-GCM'),

  /** Base64-encoded initialization vector */
  iv: z.string().regex(/^[A-Za-z0-9+/]{16}$/),

  /** Base64-encoded ciphertext with auth tag */
  ciphertext: z.string(),

  /** Key ID used for encryption */
  keyId: z.string(),

  /** Optional: Ephemeral public key for ECDH */
  ephemeralPublicKey: z.string().optional(),
});

export type EncryptedEnvelope = z.infer<typeof EncryptedEnvelopeSchema>;

/**
 * Encryption interface
 */
export interface IEncryptor {
  /**
   * Encrypt data
   * @param plaintext - Data to encrypt
   * @param aad - Additional authenticated data (optional)
   * @returns Encrypted envelope
   */
  encrypt(plaintext: Uint8Array, aad?: Uint8Array): Promise<EncryptedEnvelope>;

  /**
   * Decrypt data
   * @param envelope - Encrypted envelope
   * @param aad - Additional authenticated data (must match encrypt)
   * @returns Decrypted plaintext
   */
  decrypt(envelope: EncryptedEnvelope, aad?: Uint8Array): Promise<Uint8Array>;
}

/**
 * Hybrid encryption for large data
 * Uses X25519 key exchange + AES-256-GCM
 */
export async function hybridEncrypt(
  recipientPublicKey: Uint8Array,
  plaintext: Uint8Array,
  aad?: Uint8Array
): Promise<HybridEncryptedEnvelope> {
  // 1. Generate ephemeral X25519 keypair
  const ephemeralKeyPair = await generateX25519KeyPair();

  // 2. Derive shared secret via ECDH
  const sharedSecret = await x25519(ephemeralKeyPair.privateKey, recipientPublicKey);

  // 3. Derive encryption key via HKDF
  const encryptionKey = await hkdf(sharedSecret, 'GTCX-Encryption', 32);

  // 4. Encrypt with AES-256-GCM
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await aesGcmEncrypt(encryptionKey, iv, plaintext, aad);

  return {
    algorithm: 'X25519-AES-256-GCM',
    ephemeralPublicKey: base64Encode(ephemeralKeyPair.publicKey),
    iv: base64Encode(iv),
    ciphertext: base64Encode(encrypted),
  };
}
```

### 8.2.4 Hash Functions

```typescript
// crypto/hashing.ts

/**
 * Hash configuration
 */
export const HashConfig = {
  SHA256: {
    algorithm: 'SHA-256',
    outputSize: 32,
    prefix: 'sha256:',
  },
  SHA512: {
    algorithm: 'SHA-512',
    outputSize: 64,
    prefix: 'sha512:',
  },
} as const;

/**
 * Create prefixed hash
 */
export async function hash(
  data: Uint8Array | string,
  algorithm: 'SHA256' | 'SHA512' = 'SHA256'
): Promise<string> {
  const config = HashConfig[algorithm];
  const input = typeof data === 'string' ? new TextEncoder().encode(data) : data;

  const hashBuffer = await crypto.subtle.digest(config.algorithm, input);
  const hashHex = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return `${config.prefix}${hashHex}`;
}

/**
 * Merkle tree for verification chain integrity
 */
export class MerkleTree {
  private leaves: string[] = [];
  private layers: string[][] = [];

  /**
   * Add leaf to tree
   */
  async addLeaf(data: Uint8Array | string): Promise<void> {
    const leafHash = await hash(data, 'SHA256');
    this.leaves.push(leafHash);
  }

  /**
   * Build tree and return root
   */
  async build(): Promise<string> {
    if (this.leaves.length === 0) {
      return await hash('empty', 'SHA256');
    }

    this.layers = [this.leaves];
    let currentLayer = this.leaves;

    while (currentLayer.length > 1) {
      const nextLayer: string[] = [];

      for (let i = 0; i < currentLayer.length; i += 2) {
        const left = currentLayer[i];
        const right = currentLayer[i + 1] || left; // Duplicate if odd
        const combined = await hash(left + right, 'SHA256');
        nextLayer.push(combined);
      }

      this.layers.push(nextLayer);
      currentLayer = nextLayer;
    }

    return currentLayer[0];
  }

  /**
   * Generate proof for leaf at index
   */
  getProof(index: number): MerkleProof {
    const proof: MerkleProofStep[] = [];
    let currentIndex = index;

    for (let layer = 0; layer < this.layers.length - 1; layer++) {
      const isRight = currentIndex % 2 === 1;
      const siblingIndex = isRight ? currentIndex - 1 : currentIndex + 1;

      if (siblingIndex < this.layers[layer].length) {
        proof.push({
          hash: this.layers[layer][siblingIndex],
          position: isRight ? 'left' : 'right',
        });
      }

      currentIndex = Math.floor(currentIndex / 2);
    }

    return {
      leaf: this.leaves[index],
      root: this.layers[this.layers.length - 1][0],
      proof,
    };
  }

  /**
   * Verify a Merkle proof
   */
  static async verify(proof: MerkleProof): Promise<boolean> {
    let currentHash = proof.leaf;

    for (const step of proof.proof) {
      const combined = step.position === 'left' ? step.hash + currentHash : currentHash + step.hash;
      currentHash = await hash(combined, 'SHA256');
    }

    return currentHash === proof.root;
  }
}

interface MerkleProofStep {
  hash: string;
  position: 'left' | 'right';
}

interface MerkleProof {
  leaf: string;
  root: string;
  proof: MerkleProofStep[];
}
```

---

## 8.3 Key Management

### 8.3.1 Key Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        KEY HIERARCHY                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Level 0: ROOT KEYS (HSM Protected)                                     │
│  ├── Protocol Master Key                                                │
│  ├── Validator Root Key                                                 │
│  └── Recovery Root Key                                                  │
│                                                                          │
│  Level 1: DOMAIN KEYS (Derived from Root)                               │
│  ├── Identity Domain Key                                                │
│  ├── Settlement Domain Key                                              │
│  ├── Compliance Domain Key                                              │
│  └── Audit Domain Key                                                   │
│                                                                          │
│  Level 2: SERVICE KEYS (Derived from Domain)                            │
│  ├── TradePass Service Key                                              │
│  ├── GCI Service Key                                                    │
│  ├── VaultMark Service Key                                              │
│  └── PvP Service Key                                                    │
│                                                                          │
│  Level 3: OPERATIONAL KEYS (Per-Instance)                               │
│  ├── Node Signing Key                                                   │
│  ├── Node Encryption Key                                                │
│  └── Session Keys (Ephemeral)                                           │
│                                                                          │
│  Level 4: USER KEYS (Device-Bound)                                      │
│  ├── TradePass Identity Key                                             │
│  ├── Device Authentication Key                                          │
│  └── Backup Recovery Key                                                │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 8.3.2 Key Derivation

```typescript
// crypto/key-derivation.ts
import { z } from 'zod';

/**
 * Key derivation path schema
 */
export const KeyPathSchema = z
  .string()
  .regex(
    /^gtcx\/[a-z]+\/[a-z]+\/[a-z0-9-]+$/,
    'Key path format: gtcx/<domain>/<service>/<identifier>'
  );

/**
 * Key derivation using HKDF
 */
export async function deriveKey(
  parentKey: Uint8Array,
  path: string,
  length: number = 32
): Promise<Uint8Array> {
  // Validate path
  KeyPathSchema.parse(path);

  // Import parent key
  const importedKey = await crypto.subtle.importKey('raw', parentKey, { name: 'HKDF' }, false, [
    'deriveBits',
  ]);

  // Derive using HKDF
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'HKDF',
      hash: 'SHA-256',
      salt: new TextEncoder().encode('GTCX-v3'),
      info: new TextEncoder().encode(path),
    },
    importedKey,
    length * 8
  );

  return new Uint8Array(derivedBits);
}

/**
 * Key derivation paths
 */
export const KeyPaths = {
  // Domain keys
  identity: (region: string) => `gtcx/identity/root/${region}`,
  settlement: (region: string) => `gtcx/settlement/root/${region}`,
  compliance: (region: string) => `gtcx/compliance/root/${region}`,

  // Service keys
  tradepass: (nodeId: string) => `gtcx/identity/tradepass/${nodeId}`,
  gci: (nodeId: string) => `gtcx/compliance/gci/${nodeId}`,
  vaultmark: (nodeId: string) => `gtcx/custody/vaultmark/${nodeId}`,
  pvp: (nodeId: string) => `gtcx/settlement/pvp/${nodeId}`,

  // User keys
  userIdentity: (did: string) => `gtcx/user/identity/${did}`,
  userDevice: (did: string, deviceId: string) => `gtcx/user/device/${did}-${deviceId}`,
} as const;
```

### 8.3.3 HSM Integration

```typescript
// crypto/hsm.ts
import { z } from 'zod';

/**
 * HSM Provider Configuration
 */
export const HSMConfigSchema = z.object({
  /** HSM provider type */
  provider: z.enum([
    'aws_cloudhsm',
    'azure_keyvault',
    'google_cloudkms',
    'thales_luna',
    'yubihsm',
    'software', // For development only
  ]),

  /** Connection configuration */
  connection: z.object({
    endpoint: z.string().url().optional(),
    region: z.string().optional(),
    clusterId: z.string().optional(),
    credentials: z
      .object({
        keyId: z.string().optional(),
        secretKey: z.string().optional(),
        certificate: z.string().optional(),
      })
      .optional(),
  }),

  /** Key protection level */
  protectionLevel: z
    .enum([
      'SOFTWARE', // Software-protected (dev only)
      'HSM', // HSM-protected
      'HSM_FIPS', // FIPS 140-2 Level 3
    ])
    .default('HSM'),

  /** Retry configuration */
  retry: z
    .object({
      maxAttempts: z.number().int().min(1).max(10).default(3),
      backoffMs: z.number().int().min(100).max(10000).default(1000),
    })
    .default({}),
});

export type HSMConfig = z.infer<typeof HSMConfigSchema>;

/**
 * HSM Key Reference
 */
export const HSMKeyRefSchema = z.object({
  /** Key identifier in HSM */
  keyId: z.string(),

  /** Key version */
  version: z.string().optional(),

  /** Key algorithm */
  algorithm: z.enum(['Ed25519', 'AES-256', 'RSA-2048']),

  /** Key usage */
  usage: z.array(z.enum(['sign', 'verify', 'encrypt', 'decrypt', 'wrap', 'unwrap'])),

  /** Creation timestamp */
  createdAt: z.string().datetime(),

  /** Rotation schedule */
  rotationSchedule: z
    .object({
      enabled: z.boolean().default(true),
      intervalDays: z.number().int().min(30).max(365).default(90),
      nextRotation: z.string().datetime().optional(),
    })
    .optional(),
});

export type HSMKeyRef = z.infer<typeof HSMKeyRefSchema>;

/**
 * HSM Provider Interface
 */
export interface IHSMProvider {
  /** Initialize HSM connection */
  connect(): Promise<void>;

  /** Disconnect from HSM */
  disconnect(): Promise<void>;

  /** Generate a new key */
  generateKey(
    algorithm: 'Ed25519' | 'AES-256',
    usage: string[],
    metadata?: Record<string, string>
  ): Promise<HSMKeyRef>;

  /** Sign data using HSM key */
  sign(keyRef: HSMKeyRef, data: Uint8Array): Promise<Uint8Array>;

  /** Verify signature using HSM key */
  verify(keyRef: HSMKeyRef, data: Uint8Array, signature: Uint8Array): Promise<boolean>;

  /** Encrypt data using HSM key */
  encrypt(keyRef: HSMKeyRef, plaintext: Uint8Array): Promise<Uint8Array>;

  /** Decrypt data using HSM key */
  decrypt(keyRef: HSMKeyRef, ciphertext: Uint8Array): Promise<Uint8Array>;

  /** Wrap a key for export */
  wrapKey(keyRef: HSMKeyRef, keyToWrap: Uint8Array): Promise<Uint8Array>;

  /** Unwrap an imported key */
  unwrapKey(keyRef: HSMKeyRef, wrappedKey: Uint8Array): Promise<Uint8Array>;

  /** Rotate a key */
  rotateKey(keyRef: HSMKeyRef): Promise<HSMKeyRef>;

  /** Get key metadata */
  getKeyInfo(keyId: string): Promise<HSMKeyRef | null>;

  /** List all keys */
  listKeys(filter?: { algorithm?: string; usage?: string }): Promise<HSMKeyRef[]>;

  /** Destroy a key */
  destroyKey(keyRef: HSMKeyRef): Promise<void>;
}

/**
 * HSM Operations Audit Log
 */
export const HSMOperationLogSchema = z.object({
  operationId: z.string().uuid(),
  timestamp: z.string().datetime(),
  operation: z.enum([
    'key_generate',
    'key_sign',
    'key_verify',
    'key_encrypt',
    'key_decrypt',
    'key_wrap',
    'key_unwrap',
    'key_rotate',
    'key_destroy',
  ]),
  keyId: z.string(),
  actor: z.object({
    type: z.enum(['service', 'operator', 'system']),
    id: z.string(),
  }),
  result: z.enum(['success', 'failure', 'denied']),
  errorCode: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type HSMOperationLog = z.infer<typeof HSMOperationLogSchema>;
```

### 8.3.4 Key Rotation

```typescript
// crypto/rotation.ts

/**
 * Key rotation policy
 */
export interface KeyRotationPolicy {
  /** Enable automatic rotation */
  enabled: boolean;

  /** Rotation interval in days */
  intervalDays: number;

  /** Grace period for old key (days) */
  gracePeriodDays: number;

  /** Notification before rotation (days) */
  notifyBeforeDays: number;
}

/**
 * Default rotation policies by key type
 */
export const DefaultRotationPolicies: Record<string, KeyRotationPolicy> = {
  root: {
    enabled: true,
    intervalDays: 365, // Annual rotation
    gracePeriodDays: 30,
    notifyBeforeDays: 60,
  },
  domain: {
    enabled: true,
    intervalDays: 180, // Semi-annual
    gracePeriodDays: 14,
    notifyBeforeDays: 30,
  },
  service: {
    enabled: true,
    intervalDays: 90, // Quarterly
    gracePeriodDays: 7,
    notifyBeforeDays: 14,
  },
  operational: {
    enabled: true,
    intervalDays: 30, // Monthly
    gracePeriodDays: 3,
    notifyBeforeDays: 7,
  },
  session: {
    enabled: false, // Ephemeral, no rotation
    intervalDays: 0,
    gracePeriodDays: 0,
    notifyBeforeDays: 0,
  },
};

/**
 * Key rotation executor
 */
export class KeyRotationService {
  constructor(
    private readonly hsm: IHSMProvider,
    private readonly logger: ILogger,
    private readonly metrics: IMetricsCollector
  ) {}

  async rotateKey(keyRef: HSMKeyRef): Promise<HSMKeyRef> {
    const timer = this.metrics.startTimer('key_rotation_duration');

    try {
      // 1. Generate new key version
      const newKeyRef = await this.hsm.rotateKey(keyRef);

      // 2. Log rotation
      this.logger.info('Key rotated', {
        oldKeyId: keyRef.keyId,
        oldVersion: keyRef.version,
        newKeyId: newKeyRef.keyId,
        newVersion: newKeyRef.version,
      });

      // 3. Update metrics
      this.metrics.increment('key_rotations_total', {
        algorithm: keyRef.algorithm,
      });

      return newKeyRef;
    } catch (error) {
      this.logger.error('Key rotation failed', error as Error, {
        keyId: keyRef.keyId,
      });
      throw error;
    } finally {
      timer.end();
    }
  }

  async scheduleRotation(keyRef: HSMKeyRef, policy: KeyRotationPolicy): Promise<void> {
    if (!policy.enabled) return;

    const nextRotation = new Date();
    nextRotation.setDate(nextRotation.getDate() + policy.intervalDays);

    // Schedule rotation job
    // Implementation depends on job scheduler
  }
}
```

---

## 8.4 Zero-Knowledge Proofs

### 8.4.1 ZK Proof Types

```typescript
// crypto/zkp.ts
import { z } from 'zod';

/**
 * Supported ZK proof systems
 */
export const ZKProofSystemSchema = z.enum([
  'schnorr', // Simple Schnorr proofs (identity)
  'bulletproofs', // Range proofs (amounts)
  'groth16', // General circuits (complex predicates)
  'plonk', // Universal setup (flexible circuits)
]);

/**
 * ZK Proof schema
 */
export const ZKProofSchema = z.object({
  /** Proof system used */
  system: ZKProofSystemSchema,

  /** Proof type/circuit identifier */
  proofType: z.string(),

  /** Public inputs (known to verifier) */
  publicInputs: z.array(z.string()),

  /** The proof data */
  proof: z.string(), // Base64 encoded

  /** Verification key reference */
  verificationKeyId: z.string(),

  /** Creation timestamp */
  created: z.string().datetime(),
});

export type ZKProof = z.infer<typeof ZKProofSchema>;
```

### 8.4.2 Privacy-Preserving Verifications

```typescript
// crypto/zkp-verifications.ts

/**
 * ZK Proof: GCI Score Above Threshold
 * Proves score >= threshold without revealing exact score
 */
export interface GCIThresholdProof {
  proofType: 'gci_threshold';
  publicInputs: {
    /** The threshold being proven */
    threshold: number;
    /** Commitment to the actual score */
    scoreCommitment: string;
    /** Entity identifier (hashed) */
    entityHash: string;
  };
}

/**
 * Generate GCI threshold proof
 */
export async function generateGCIThresholdProof(
  actualScore: number,
  threshold: number,
  entityId: string,
  provingKey: Uint8Array
): Promise<ZKProof> {
  // Verify precondition
  if (actualScore < threshold) {
    throw new Error('Cannot prove: score below threshold');
  }

  // Generate score commitment (Pedersen commitment)
  const randomness = crypto.getRandomValues(new Uint8Array(32));
  const commitment = await pedersenCommit(actualScore, randomness);

  // Generate range proof: score >= threshold
  const rangeProof = await generateBulletproof(
    actualScore - threshold, // Must be >= 0
    0,
    100 - threshold, // Upper bound
    randomness
  );

  return {
    system: 'bulletproofs',
    proofType: 'gci_threshold',
    publicInputs: [threshold.toString(), commitment, await hash(entityId, 'SHA256')],
    proof: base64Encode(rangeProof),
    verificationKeyId: 'bulletproofs-gci-v1',
    created: new Date().toISOString(),
  };
}

/**
 * ZK Proof: Location Within Region
 * Proves location is within licensed area without revealing exact coordinates
 */
export interface LocationRegionProof {
  proofType: 'location_region';
  publicInputs: {
    /** Hash of the region boundary polygon */
    regionHash: string;
    /** Commitment to actual coordinates */
    locationCommitment: string;
    /** Timestamp of proof */
    timestamp: string;
  };
}

/**
 * ZK Proof: Asset Ownership
 * Proves ownership of asset without revealing asset details
 */
export interface AssetOwnershipProof {
  proofType: 'asset_ownership';
  publicInputs: {
    /** Commitment to asset ID */
    assetCommitment: string;
    /** Owner's public key hash */
    ownerHash: string;
    /** Merkle root of ownership chain */
    ownershipRoot: string;
  };
}

/**
 * ZK Proof: Amount in Range
 * Proves transaction amount is within range without revealing exact amount
 */
export interface AmountRangeProof {
  proofType: 'amount_range';
  publicInputs: {
    /** Commitment to amount */
    amountCommitment: string;
    /** Minimum amount */
    minAmount: number;
    /** Maximum amount */
    maxAmount: number;
  };
}

/**
 * ZK Proof Verifier
 */
export interface IZKVerifier {
  /** Verify a ZK proof */
  verify(proof: ZKProof): Promise<boolean>;

  /** Get verification key for proof type */
  getVerificationKey(proofType: string): Promise<Uint8Array>;
}
```

### 8.4.3 Selective Disclosure

```typescript
// crypto/selective-disclosure.ts
import { z } from 'zod';

/**
 * BBS+ Signature for selective disclosure
 */
export const BBSSignatureSchema = z.object({
  /** Signature value */
  signature: z.string(),

  /** Number of messages signed */
  messageCount: z.number().int().positive(),

  /** Public key used */
  publicKey: z.string(),
});

/**
 * Disclosure proof (subset of signed data)
 */
export const DisclosureProofSchema = z.object({
  /** Original BBS+ signature */
  originalSignature: BBSSignatureSchema,

  /** Indices of disclosed attributes */
  disclosedIndices: z.array(z.number().int().nonnegative()),

  /** Disclosed attribute values */
  disclosedValues: z.array(z.string()),

  /** Zero-knowledge proof of remaining attributes */
  proof: z.string(),
});

export type DisclosureProof = z.infer<typeof DisclosureProofSchema>;

/**
 * Create selective disclosure proof
 */
export async function createDisclosureProof(
  credential: VerifiableCredential,
  attributesToDisclose: string[],
  bbsKeyPair: BBSKeyPair
): Promise<DisclosureProof> {
  // Get all attributes from credential
  const allAttributes = Object.keys(credential.credentialSubject);

  // Determine which indices to disclose
  const disclosedIndices = attributesToDisclose
    .map((attr) => allAttributes.indexOf(attr))
    .filter((i) => i >= 0);

  // Get disclosed values
  const disclosedValues = disclosedIndices.map((i) =>
    String(credential.credentialSubject[allAttributes[i]])
  );

  // Generate BBS+ proof
  const proof = await bbsCreateProof({
    signature: credential.proof?.proofValue || '',
    publicKey: bbsKeyPair.publicKey,
    messages: allAttributes.map((attr) => String(credential.credentialSubject[attr])),
    disclosedIndices,
  });

  return {
    originalSignature: {
      signature: credential.proof?.proofValue || '',
      messageCount: allAttributes.length,
      publicKey: base64Encode(bbsKeyPair.publicKey),
    },
    disclosedIndices,
    disclosedValues,
    proof: base64Encode(proof),
  };
}
```

---

## 8.5 Threat Model

### 8.5.1 Threat Categories

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        THREAT CATEGORIES                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  IDENTITY THREATS                                                        │
│  ├── T1.1 Identity Spoofing                                             │
│  ├── T1.2 Credential Theft                                              │
│  ├── T1.3 Biometric Replay                                              │
│  └── T1.4 Sybil Attacks                                                 │
│                                                                          │
│  DATA INTEGRITY THREATS                                                  │
│  ├── T2.1 Data Tampering                                                │
│  ├── T2.2 False Attestations                                            │
│  ├── T2.3 Replay Attacks                                                │
│  └── T2.4 Merkle Tree Manipulation                                      │
│                                                                          │
│  PRIVACY THREATS                                                         │
│  ├── T3.1 Unauthorized Data Access                                      │
│  ├── T3.2 Traffic Analysis                                              │
│  ├── T3.3 Correlation Attacks                                           │
│  └── T3.4 Inference Attacks                                             │
│                                                                          │
│  AVAILABILITY THREATS                                                    │
│  ├── T4.1 Denial of Service                                             │
│  ├── T4.2 Resource Exhaustion                                           │
│  ├── T4.3 Network Partition                                             │
│  └── T4.4 Data Loss                                                     │
│                                                                          │
│  ECONOMIC THREATS                                                        │
│  ├── T5.1 Double Spending                                               │
│  ├── T5.2 Front-Running                                                 │
│  ├── T5.3 Market Manipulation                                           │
│  └── T5.4 Collusion                                                     │
│                                                                          │
│  GOVERNANCE THREATS                                                      │
│  ├── T6.1 Validator Collusion                                           │
│  ├── T6.2 Protocol Capture                                              │
│  ├── T6.3 Censorship                                                    │
│  └── T6.4 Regulatory Attack                                             │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 8.5.2 Detailed Threat Analysis

```typescript
// security/threat-model.ts
import { z } from 'zod';

/**
 * Threat severity levels
 */
export const ThreatSeveritySchema = z.enum([
  'critical', // System compromise, major financial loss
  'high', // Significant impact, data breach
  'medium', // Limited impact, service degradation
  'low', // Minimal impact, inconvenience
]);

/**
 * Threat likelihood levels
 */
export const ThreatLikelihoodSchema = z.enum([
  'almost_certain', // >90% probability
  'likely', // 50-90% probability
  'possible', // 10-50% probability
  'unlikely', // 1-10% probability
  'rare', // <1% probability
]);

/**
 * Threat definition
 */
export const ThreatSchema = z.object({
  id: z.string().regex(/^T\d+\.\d+$/),
  name: z.string(),
  category: z.enum([
    'identity',
    'data_integrity',
    'privacy',
    'availability',
    'economic',
    'governance',
  ]),
  description: z.string(),

  // Risk assessment
  severity: ThreatSeveritySchema,
  likelihood: ThreatLikelihoodSchema,
  riskScore: z.number().min(1).max(25), // severity × likelihood

  // Attack details
  attackVector: z.string(),
  prerequisites: z.array(z.string()),
  affectedComponents: z.array(z.string()),

  // Mitigations
  mitigations: z.array(
    z.object({
      id: z.string(),
      description: z.string(),
      effectiveness: z.enum(['full', 'partial', 'detection_only']),
      implemented: z.boolean(),
    })
  ),

  // Detection
  indicators: z.array(z.string()),
  detectionMethods: z.array(z.string()),

  // References
  cweId: z.string().optional(), // Common Weakness Enumeration
  owaspId: z.string().optional(), // OWASP reference
});

export type Threat = z.infer<typeof ThreatSchema>;

/**
 * Example threats
 */
export const IdentityThreats: Threat[] = [
  {
    id: 'T1.1',
    name: 'Identity Spoofing',
    category: 'identity',
    description: 'Attacker impersonates legitimate user to perform unauthorized actions',
    severity: 'critical',
    likelihood: 'possible',
    riskScore: 15,
    attackVector: 'Stolen credentials, compromised device, social engineering',
    prerequisites: ['Target user credentials', 'Access to GTCX system'],
    affectedComponents: ['TradePass', 'PvP Settlement', 'GCI'],
    mitigations: [
      {
        id: 'M1.1.1',
        description: 'Multi-factor authentication with biometrics',
        effectiveness: 'full',
        implemented: true,
      },
      {
        id: 'M1.1.2',
        description: 'Device binding with hardware attestation',
        effectiveness: 'full',
        implemented: true,
      },
      {
        id: 'M1.1.3',
        description: 'Behavioral analysis for anomaly detection',
        effectiveness: 'partial',
        implemented: true,
      },
    ],
    indicators: [
      'Login from new device/location',
      'Unusual transaction patterns',
      'Failed biometric attempts',
    ],
    detectionMethods: [
      'Real-time anomaly detection',
      'Device fingerprinting',
      'IP geolocation analysis',
    ],
    cweId: 'CWE-287',
    owaspId: 'A07:2021',
  },
  {
    id: 'T1.3',
    name: 'Biometric Replay',
    category: 'identity',
    description: 'Attacker captures and replays biometric data to bypass authentication',
    severity: 'high',
    likelihood: 'unlikely',
    riskScore: 8,
    attackVector: 'Capture biometric data during enrollment or authentication',
    prerequisites: ['Physical access to capture device', 'Technical capability'],
    affectedComponents: ['TradePass Biometrics'],
    mitigations: [
      {
        id: 'M1.3.1',
        description: 'Liveness detection during biometric capture',
        effectiveness: 'full',
        implemented: true,
      },
      {
        id: 'M1.3.2',
        description: 'Template never stored raw, only hashed',
        effectiveness: 'full',
        implemented: true,
      },
      {
        id: 'M1.3.3',
        description: 'Challenge-response with timestamp',
        effectiveness: 'partial',
        implemented: true,
      },
    ],
    indicators: [
      'Multiple identical biometric submissions',
      'Biometric quality anomalies',
      'Timestamp manipulation',
    ],
    detectionMethods: [
      'Liveness detection algorithms',
      'Template comparison analysis',
      'Temporal analysis',
    ],
    cweId: 'CWE-294',
  },
];

export const EconomicThreats: Threat[] = [
  {
    id: 'T5.1',
    name: 'Double Spending',
    category: 'economic',
    description: 'Attempt to transfer same asset or funds multiple times',
    severity: 'critical',
    likelihood: 'possible',
    riskScore: 15,
    attackVector: 'Race condition exploitation, offline queue manipulation',
    prerequisites: ['Active escrow or custody', 'Network latency or partition'],
    affectedComponents: ['PvP Settlement', 'VaultMark'],
    mitigations: [
      {
        id: 'M5.1.1',
        description: 'Atomic settlement with 2PC',
        effectiveness: 'full',
        implemented: true,
      },
      {
        id: 'M5.1.2',
        description: 'PANX consensus before finality',
        effectiveness: 'full',
        implemented: true,
      },
      {
        id: 'M5.1.3',
        description: 'Offline queue CRDT with causal ordering',
        effectiveness: 'partial',
        implemented: true,
      },
    ],
    indicators: [
      'Concurrent transfer attempts',
      'Out-of-order transactions',
      'Custody state conflicts',
    ],
    detectionMethods: [
      'Transaction graph analysis',
      'Real-time conflict detection',
      'CRDT merge anomalies',
    ],
    cweId: 'CWE-362',
  },
];
```

### 8.5.3 Risk Matrix

| Threat ID | Name                | Severity | Likelihood | Risk Score | Mitigated  |
| --------- | ------------------- | -------- | ---------- | ---------- | ---------- |
| T1.1      | Identity Spoofing   | Critical | Possible   | 15         | ✅ Yes     |
| T1.2      | Credential Theft    | High     | Likely     | 16         | ✅ Yes     |
| T1.3      | Biometric Replay    | High     | Unlikely   | 8          | ✅ Yes     |
| T1.4      | Sybil Attacks       | High     | Possible   | 12         | ✅ Yes     |
| T2.1      | Data Tampering      | Critical | Unlikely   | 10         | ✅ Yes     |
| T2.2      | False Attestations  | High     | Possible   | 12         | ✅ Yes     |
| T2.3      | Replay Attacks      | Medium   | Possible   | 6          | ✅ Yes     |
| T3.1      | Unauthorized Access | High     | Likely     | 16         | ✅ Yes     |
| T3.2      | Traffic Analysis    | Medium   | Likely     | 8          | ⚠️ Partial |
| T4.1      | Denial of Service   | High     | Likely     | 16         | ✅ Yes     |
| T5.1      | Double Spending     | Critical | Possible   | 15         | ✅ Yes     |
| T5.2      | Front-Running       | Medium   | Unlikely   | 4          | ✅ Yes     |
| T6.1      | Validator Collusion | High     | Unlikely   | 8          | ✅ Yes     |

---

## 8.6 Access Control

### 8.6.1 Role-Based Access Control (RBAC)

```typescript
// security/rbac.ts
import { z } from 'zod';

/**
 * System roles
 */
export const RoleSchema = z.enum([
  // User roles
  'producer',
  'rco',
  'aggregator',
  'vault_operator',
  'refiner',
  'buyer',

  // Operational roles
  'inspector',
  'validator',
  'auditor',

  // Administrative roles
  'government_official',
  'system_admin',
  'protocol_council',
]);

/**
 * Permissions
 */
export const PermissionSchema = z.enum([
  // Identity
  'identity:create',
  'identity:read',
  'identity:update',
  'identity:delete',
  'identity:verify',

  // Assets
  'asset:create',
  'asset:read',
  'asset:transfer',
  'asset:verify',

  // Compliance
  'gci:read',
  'gci:calculate',
  'gci:appeal',
  'gci:approve_appeal',

  // Settlement
  'escrow:create',
  'escrow:fund',
  'escrow:release',
  'escrow:dispute',
  'escrow:resolve_dispute',

  // Validation
  'consensus:vote',
  'consensus:propose',

  // Administration
  'system:configure',
  'system:audit',
  'system:emergency',
]);

/**
 * Role-Permission mapping
 */
export const RolePermissions: Record<string, string[]> = {
  producer: [
    'identity:read',
    'identity:update',
    'asset:create',
    'asset:read',
    'asset:transfer',
    'gci:read',
    'escrow:create',
    'escrow:fund',
  ],

  rco: [
    'identity:read',
    'identity:update',
    'identity:verify',
    'asset:read',
    'asset:transfer',
    'asset:verify',
    'gci:read',
    'gci:calculate',
    'escrow:create',
    'escrow:fund',
    'escrow:release',
  ],

  validator: [
    'identity:read',
    'identity:verify',
    'asset:read',
    'asset:verify',
    'gci:read',
    'gci:calculate',
    'consensus:vote',
    'consensus:propose',
  ],

  government_official: [
    'identity:read',
    'asset:read',
    'gci:read',
    'gci:approve_appeal',
    'escrow:read',
    'escrow:resolve_dispute',
    'system:audit',
  ],

  system_admin: ['system:configure', 'system:audit', 'system:emergency'],
};

/**
 * Check permission
 */
export function hasPermission(
  role: string,
  permission: string,
  context?: { jurisdiction?: string; resource?: string }
): boolean {
  const permissions = RolePermissions[role] || [];

  // Check direct permission
  if (permissions.includes(permission)) {
    return true;
  }

  // Check wildcard permissions
  const [category] = permission.split(':');
  if (permissions.includes(`${category}:*`)) {
    return true;
  }

  return false;
}
```

### 8.6.2 Attribute-Based Access Control (ABAC)

```typescript
// security/abac.ts
import { z } from 'zod';

/**
 * Access control policy
 */
export const PolicySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),

  // Subject attributes (who)
  subject: z.object({
    roles: z.array(RoleSchema).optional(),
    jurisdictions: z.array(z.string()).optional(),
    gciMinimum: z.number().optional(),
    verified: z.boolean().optional(),
  }),

  // Resource attributes (what)
  resource: z.object({
    types: z.array(z.string()).optional(),
    jurisdictions: z.array(z.string()).optional(),
    sensitivity: z.enum(['public', 'internal', 'confidential', 'restricted']).optional(),
  }),

  // Action attributes (how)
  action: z.object({
    operations: z.array(PermissionSchema),
  }),

  // Environment attributes (when/where)
  environment: z
    .object({
      timeWindow: z
        .object({
          start: z.string().optional(),
          end: z.string().optional(),
        })
        .optional(),
      ipAllowlist: z.array(z.string()).optional(),
      mfaRequired: z.boolean().optional(),
    })
    .optional(),

  // Effect
  effect: z.enum(['allow', 'deny']),

  // Priority (higher = evaluated first)
  priority: z.number().int().default(0),
});

export type Policy = z.infer<typeof PolicySchema>;

/**
 * Policy evaluation result
 */
export interface PolicyEvaluation {
  allowed: boolean;
  matchedPolicy?: Policy;
  reason: string;
  obligations?: string[];
}

/**
 * ABAC Policy Engine
 */
export class PolicyEngine {
  private policies: Policy[] = [];

  addPolicy(policy: Policy): void {
    this.policies.push(policy);
    // Sort by priority (descending)
    this.policies.sort((a, b) => b.priority - a.priority);
  }

  evaluate(request: AccessRequest): PolicyEvaluation {
    for (const policy of this.policies) {
      if (this.matchesPolicy(request, policy)) {
        return {
          allowed: policy.effect === 'allow',
          matchedPolicy: policy,
          reason: `Matched policy: ${policy.name}`,
          obligations: this.getObligations(policy),
        };
      }
    }

    // Default deny
    return {
      allowed: false,
      reason: 'No matching policy found (default deny)',
    };
  }

  private matchesPolicy(request: AccessRequest, policy: Policy): boolean {
    // Check subject attributes
    if (policy.subject.roles && !policy.subject.roles.includes(request.subject.role as any)) {
      return false;
    }

    if (
      policy.subject.jurisdictions &&
      !policy.subject.jurisdictions.includes(request.subject.jurisdiction)
    ) {
      return false;
    }

    if (policy.subject.gciMinimum && (request.subject.gciScore ?? 0) < policy.subject.gciMinimum) {
      return false;
    }

    // Check resource attributes
    if (policy.resource.types && !policy.resource.types.includes(request.resource.type)) {
      return false;
    }

    // Check action
    if (!policy.action.operations.includes(request.action as any)) {
      return false;
    }

    // Check environment
    if (policy.environment?.mfaRequired && !request.environment.mfaVerified) {
      return false;
    }

    return true;
  }

  private getObligations(policy: Policy): string[] {
    const obligations: string[] = [];

    if (policy.environment?.mfaRequired) {
      obligations.push('mfa_verification');
    }

    return obligations;
  }
}

interface AccessRequest {
  subject: {
    did: string;
    role: string;
    jurisdiction: string;
    gciScore?: number;
    verified: boolean;
  };
  resource: {
    id: string;
    type: string;
    jurisdiction: string;
  };
  action: string;
  environment: {
    timestamp: string;
    ipAddress: string;
    mfaVerified: boolean;
  };
}
```

---

## 8.7 Data Protection

### 8.7.1 Data Classification

| Classification   | Description        | Examples                            | Controls                    |
| ---------------- | ------------------ | ----------------------------------- | --------------------------- |
| **Public**       | No restrictions    | Protocol specs, public APIs         | None                        |
| **Internal**     | Business sensitive | Aggregate statistics, logs          | Access control              |
| **Confidential** | User data          | TradePass profiles, GCI scores      | Encryption + access control |
| **Restricted**   | Highly sensitive   | Private keys, biometrics, financial | HSM + encryption + audit    |

### 8.7.2 Encryption at Rest

```typescript
// security/encryption-at-rest.ts

/**
 * Data encryption configuration
 */
export const EncryptionAtRestConfig = {
  // Database encryption
  database: {
    enabled: true,
    algorithm: 'AES-256-GCM',
    keyRotationDays: 90,
    keySource: 'HSM',
  },

  // Field-level encryption (for sensitive fields)
  fieldLevel: {
    enabled: true,
    fields: ['biometric_template', 'private_key', 'financial_account', 'personal_identifier'],
    algorithm: 'AES-256-GCM',
  },

  // Backup encryption
  backup: {
    enabled: true,
    algorithm: 'AES-256-GCM',
    keySource: 'HSM',
  },

  // Log encryption (for sensitive logs)
  logs: {
    enabled: true,
    algorithm: 'AES-256-GCM',
    retentionDays: 365,
  },
} as const;

/**
 * Field-level encryption wrapper
 */
export class FieldEncryptor {
  constructor(
    private readonly encryptor: IEncryptor,
    private readonly sensitiveFields: string[]
  ) {}

  async encryptSensitiveFields<T extends Record<string, unknown>>(data: T): Promise<T> {
    const result = { ...data };

    for (const field of this.sensitiveFields) {
      if (field in result && result[field] !== null) {
        const plaintext = JSON.stringify(result[field]);
        const encrypted = await this.encryptor.encrypt(new TextEncoder().encode(plaintext));
        result[field] = { __encrypted: true, data: encrypted } as any;
      }
    }

    return result;
  }

  async decryptSensitiveFields<T extends Record<string, unknown>>(data: T): Promise<T> {
    const result = { ...data };

    for (const field of this.sensitiveFields) {
      if (
        field in result &&
        typeof result[field] === 'object' &&
        (result[field] as any)?.__encrypted
      ) {
        const encrypted = (result[field] as any).data;
        const decrypted = await this.encryptor.decrypt(encrypted);
        result[field] = JSON.parse(new TextDecoder().decode(decrypted));
      }
    }

    return result;
  }
}
```

### 8.7.3 Encryption in Transit

```typescript
// security/encryption-in-transit.ts

/**
 * TLS Configuration
 */
export const TLSConfig = {
  // Minimum TLS version
  minVersion: 'TLSv1.3',

  // Allowed cipher suites (TLS 1.3)
  cipherSuites: [
    'TLS_AES_256_GCM_SHA384',
    'TLS_CHACHA20_POLY1305_SHA256',
    'TLS_AES_128_GCM_SHA256',
  ],

  // Certificate requirements
  certificates: {
    minKeySize: 2048, // RSA
    minEcKeySize: 256, // ECDSA
    allowedAlgorithms: ['RSA', 'ECDSA'],
    maxValidityDays: 397, // 13 months
    requireOCSPStapling: true,
  },

  // Client certificate authentication (mTLS)
  clientCerts: {
    required: true, // For internal services
    optional: false, // For external clients
  },

  // HSTS configuration
  hsts: {
    enabled: true,
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
} as const;

/**
 * Service mesh encryption
 */
export const ServiceMeshConfig = {
  // mTLS between services
  mtls: {
    enabled: true,
    mode: 'STRICT', // Require mTLS for all traffic
    certificateRotation: {
      enabled: true,
      intervalHours: 24,
    },
  },

  // Service identity (SPIFFE)
  identity: {
    format: 'spiffe://gtcx.org/<service>/<instance>',
    trustDomain: 'gtcx.org',
  },
} as const;
```

### 8.7.4 Data Minimization

```typescript
// security/data-minimization.ts

/**
 * Data retention policy
 */
export const DataRetentionPolicy = {
  // User data
  userProfile: {
    active: 'indefinite',
    inactive: '2 years',
    deleted: '30 days',
  },

  // Transaction data
  transactions: {
    completed: '7 years', // Regulatory requirement
    failed: '90 days',
    pending: '7 days',
  },

  // Audit logs
  auditLogs: {
    security: '7 years',
    operational: '1 year',
    debug: '30 days',
  },

  // Biometric data
  biometrics: {
    templateHash: 'indefinite', // Only hash stored
    rawCapture: '0', // Never stored
    liveness: '24 hours',
  },

  // Session data
  sessions: {
    active: '24 hours',
    expired: '7 days',
  },
} as const;

/**
 * Data anonymization
 */
export function anonymizeForAnalytics<T extends Record<string, unknown>>(
  data: T,
  config: AnonymizationConfig
): T {
  const result = { ...data };

  // Remove PII fields
  for (const field of config.removeFields) {
    delete result[field];
  }

  // Hash identifying fields
  for (const field of config.hashFields) {
    if (field in result) {
      result[field] = hash(String(result[field]), 'SHA256') as any;
    }
  }

  // Generalize location
  if (config.generalizeLocation && 'coordinates' in result) {
    const coords = result.coordinates as { latitude: number; longitude: number };
    result.coordinates = {
      // Round to ~1km precision
      latitude: Math.round(coords.latitude * 100) / 100,
      longitude: Math.round(coords.longitude * 100) / 100,
    } as any;
  }

  // Generalize timestamps
  if (config.generalizeTimestamps) {
    for (const field of ['createdAt', 'updatedAt', 'timestamp']) {
      if (field in result && typeof result[field] === 'string') {
        // Round to day
        const date = new Date(result[field] as string);
        date.setHours(0, 0, 0, 0);
        result[field] = date.toISOString() as any;
      }
    }
  }

  return result;
}

interface AnonymizationConfig {
  removeFields: string[];
  hashFields: string[];
  generalizeLocation: boolean;
  generalizeTimestamps: boolean;
}
```

---

## 8.8 Security Monitoring

### 8.8.1 Security Events

```typescript
// security/events.ts
import { z } from 'zod';

/**
 * Security event categories
 */
export const SecurityEventCategorySchema = z.enum([
  'authentication',
  'authorization',
  'data_access',
  'configuration',
  'cryptographic',
  'network',
  'system',
]);

/**
 * Security event severity
 */
export const SecurityEventSeveritySchema = z.enum([
  'critical', // Immediate action required
  'high', // Action required within 1 hour
  'medium', // Action required within 24 hours
  'low', // Informational
]);

/**
 * Security event schema
 */
export const SecurityEventSchema = z.object({
  eventId: z.string().uuid(),
  timestamp: z.string().datetime(),

  category: SecurityEventCategorySchema,
  severity: SecurityEventSeveritySchema,

  // Event details
  eventType: z.string(),
  description: z.string(),

  // Actor information
  actor: z.object({
    type: z.enum(['user', 'service', 'system', 'unknown']),
    id: z.string().optional(),
    ip: z.string().optional(),
    userAgent: z.string().optional(),
  }),

  // Target information
  target: z
    .object({
      type: z.string(),
      id: z.string(),
    })
    .optional(),

  // Outcome
  outcome: z.enum(['success', 'failure', 'blocked', 'unknown']),

  // Additional context
  context: z.record(z.string(), z.unknown()).optional(),

  // Correlation
  traceId: z.string().optional(),
  sessionId: z.string().optional(),
});

export type SecurityEvent = z.infer<typeof SecurityEventSchema>;

/**
 * Security event types
 */
export const SecurityEventTypes = {
  // Authentication events
  AUTH_SUCCESS: 'auth.success',
  AUTH_FAILURE: 'auth.failure',
  AUTH_LOCKOUT: 'auth.lockout',
  AUTH_MFA_REQUIRED: 'auth.mfa_required',
  AUTH_MFA_SUCCESS: 'auth.mfa_success',
  AUTH_MFA_FAILURE: 'auth.mfa_failure',

  // Authorization events
  AUTHZ_DENIED: 'authz.denied',
  AUTHZ_PRIVILEGE_ESCALATION: 'authz.privilege_escalation',

  // Data access events
  DATA_ACCESS_SENSITIVE: 'data.access_sensitive',
  DATA_EXPORT: 'data.export',
  DATA_MODIFICATION: 'data.modification',
  DATA_DELETION: 'data.deletion',

  // Cryptographic events
  CRYPTO_KEY_GENERATED: 'crypto.key_generated',
  CRYPTO_KEY_ROTATED: 'crypto.key_rotated',
  CRYPTO_SIGNATURE_INVALID: 'crypto.signature_invalid',

  // System events
  SYSTEM_CONFIG_CHANGE: 'system.config_change',
  SYSTEM_EMERGENCY_MODE: 'system.emergency_mode',
} as const;
```

### 8.8.2 Security Metrics

```typescript
// security/metrics.ts

/**
 * Security metrics for Prometheus
 */
export const SecurityMetrics = {
  // Authentication metrics
  authentication_attempts_total: {
    name: 'gtcx_auth_attempts_total',
    help: 'Total authentication attempts',
    labelNames: ['method', 'outcome'],
  },

  authentication_latency_seconds: {
    name: 'gtcx_auth_latency_seconds',
    help: 'Authentication latency in seconds',
    labelNames: ['method'],
    buckets: [0.1, 0.25, 0.5, 1, 2.5, 5],
  },

  // Authorization metrics
  authorization_decisions_total: {
    name: 'gtcx_authz_decisions_total',
    help: 'Total authorization decisions',
    labelNames: ['outcome', 'resource_type'],
  },

  // Cryptographic metrics
  crypto_operations_total: {
    name: 'gtcx_crypto_operations_total',
    help: 'Total cryptographic operations',
    labelNames: ['operation', 'algorithm'],
  },

  crypto_key_rotations_total: {
    name: 'gtcx_crypto_key_rotations_total',
    help: 'Total key rotations',
    labelNames: ['key_type'],
  },

  // Security events
  security_events_total: {
    name: 'gtcx_security_events_total',
    help: 'Total security events',
    labelNames: ['category', 'severity', 'event_type'],
  },

  // Active sessions
  active_sessions: {
    name: 'gtcx_active_sessions',
    help: 'Current active sessions',
    labelNames: ['role'],
  },

  // Failed attempts (for rate limiting)
  failed_attempts: {
    name: 'gtcx_failed_attempts',
    help: 'Failed authentication/authorization attempts',
    labelNames: ['type', 'reason'],
  },
};
```

### 8.8.3 Alerting Rules

```yaml
# security/alerts.yaml

groups:
  - name: gtcx_security_alerts
    rules:
      # Critical: Multiple authentication failures
      - alert: HighAuthenticationFailureRate
        expr: |
          sum(rate(gtcx_auth_attempts_total{outcome="failure"}[5m])) 
          / sum(rate(gtcx_auth_attempts_total[5m])) > 0.1
        for: 5m
        labels:
          severity: high
        annotations:
          summary: High authentication failure rate
          description: >
            Authentication failure rate is {{ $value | humanizePercentage }} 
            over the last 5 minutes.

      # Critical: Privilege escalation attempt
      - alert: PrivilegeEscalationAttempt
        expr: |
          increase(gtcx_security_events_total{
            event_type="authz.privilege_escalation"
          }[5m]) > 0
        for: 0m
        labels:
          severity: critical
        annotations:
          summary: Privilege escalation attempt detected
          description: >
            {{ $value }} privilege escalation attempts in the last 5 minutes.

      # High: Unusual data export
      - alert: UnusualDataExport
        expr: |
          increase(gtcx_security_events_total{
            event_type="data.export"
          }[1h]) > 100
        for: 0m
        labels:
          severity: high
        annotations:
          summary: Unusual data export activity
          description: >
            {{ $value }} data exports in the last hour (threshold: 100).

      # High: HSM operation failure
      - alert: HSMOperationFailure
        expr: |
          increase(gtcx_crypto_operations_total{
            outcome="failure"
          }[5m]) > 0
        for: 0m
        labels:
          severity: high
        annotations:
          summary: HSM operation failure
          description: >
            {{ $value }} HSM operation failures in the last 5 minutes.

      # Medium: Key rotation overdue
      - alert: KeyRotationOverdue
        expr: |
          (time() - gtcx_crypto_key_last_rotation_timestamp) > 86400 * 100
        for: 1h
        labels:
          severity: medium
        annotations:
          summary: Key rotation overdue
          description: >
            Key {{ $labels.key_id }} has not been rotated in over 100 days.
```

---

## 8.9 Incident Response

### 8.9.1 Incident Classification

| Severity        | Description                    | Response Time | Examples                             |
| --------------- | ------------------------------ | ------------- | ------------------------------------ |
| **P1 Critical** | System compromise, data breach | 15 minutes    | Key compromise, unauthorized access  |
| **P2 High**     | Significant security impact    | 1 hour        | Failed attacks, anomalies            |
| **P3 Medium**   | Limited impact                 | 4 hours       | Policy violations, misconfigurations |
| **P4 Low**      | Minimal impact                 | 24 hours      | False positives, minor issues        |

### 8.9.2 Response Procedures

```typescript
// security/incident-response.ts

/**
 * Incident response workflow
 */
export const IncidentResponseWorkflow = {
  stages: [
    {
      name: 'Detection',
      actions: [
        'Automated alert triggered',
        'Manual report received',
        'Initial severity assessment',
      ],
    },
    {
      name: 'Triage',
      actions: [
        'Confirm incident is real',
        'Assign severity level',
        'Notify response team',
        'Create incident ticket',
      ],
    },
    {
      name: 'Containment',
      actions: [
        'Isolate affected systems',
        'Block malicious actors',
        'Preserve evidence',
        'Implement temporary mitigations',
      ],
    },
    {
      name: 'Investigation',
      actions: [
        'Collect logs and forensic data',
        'Determine root cause',
        'Assess impact scope',
        'Identify compromised data',
      ],
    },
    {
      name: 'Remediation',
      actions: [
        'Remove malicious artifacts',
        'Patch vulnerabilities',
        'Restore from backup if needed',
        'Verify system integrity',
      ],
    },
    {
      name: 'Recovery',
      actions: [
        'Gradually restore services',
        'Monitor for recurrence',
        'Validate security controls',
        'Communicate with stakeholders',
      ],
    },
    {
      name: 'Post-Incident',
      actions: [
        'Document lessons learned',
        'Update security controls',
        'Train team on findings',
        'Update incident playbooks',
      ],
    },
  ],
};

/**
 * Emergency contacts
 */
export const EmergencyContacts = {
  securityTeam: {
    email: 'security@gtcx.org',
    phone: '+1-xxx-xxx-xxxx',
    pagerDuty: 'gtcx-security',
  },
  engineeringLead: {
    email: 'engineering@gtcx.org',
    pagerDuty: 'gtcx-engineering',
  },
  legal: {
    email: 'legal@gtcx.org',
  },
  communications: {
    email: 'comms@gtcx.org',
  },
};
```

---

## 8.10 Compliance

### 8.10.1 Regulatory Alignment

| Regulation        | Scope                | GTCX Compliance                             |
| ----------------- | -------------------- | ------------------------------------------- |
| **GDPR**          | EU data protection   | Data minimization, consent, deletion rights |
| **SOC 2 Type II** | Security controls    | Annual audit certification                  |
| **ISO 27001**     | Information security | ISMS implementation                         |
| **PCI DSS**       | Payment data         | Tokenization, encryption, access control    |
| **OWASP ASVS**    | Application security | Level 2 compliance target                   |

### 8.10.2 Audit Trail

```typescript
// security/audit.ts
import { z } from 'zod';

/**
 * Audit log entry
 */
export const AuditLogSchema = z.object({
  logId: z.string().uuid(),
  timestamp: z.string().datetime(),

  // Who
  actor: z.object({
    type: z.enum(['user', 'service', 'system']),
    id: z.string(),
    role: z.string().optional(),
    ip: z.string().optional(),
  }),

  // What
  action: z.string(),
  resource: z.object({
    type: z.string(),
    id: z.string(),
  }),

  // How
  method: z.string().optional(),

  // Result
  outcome: z.enum(['success', 'failure', 'partial']),

  // Before/after for modifications
  changes: z
    .object({
      before: z.record(z.string(), z.unknown()).optional(),
      after: z.record(z.string(), z.unknown()).optional(),
    })
    .optional(),

  // Integrity
  hash: z.string(),
  previousHash: z.string(),
});

export type AuditLog = z.infer<typeof AuditLogSchema>;

/**
 * Tamper-evident audit log chain
 */
export class AuditChain {
  private previousHash: string = 'genesis';

  async append(entry: Omit<AuditLog, 'hash' | 'previousHash'>): Promise<AuditLog> {
    const entryWithChain = {
      ...entry,
      previousHash: this.previousHash,
      hash: '', // Will be calculated
    };

    // Calculate hash of entry
    const canonical = JSON.stringify(entryWithChain, Object.keys(entryWithChain).sort());
    entryWithChain.hash = await hash(canonical, 'SHA256');

    // Update chain
    this.previousHash = entryWithChain.hash;

    return entryWithChain as AuditLog;
  }

  async verify(entries: AuditLog[]): Promise<boolean> {
    let expectedPreviousHash = 'genesis';

    for (const entry of entries) {
      // Verify chain link
      if (entry.previousHash !== expectedPreviousHash) {
        return false;
      }

      // Verify entry hash
      const entryForHash = { ...entry, hash: '' };
      const canonical = JSON.stringify(entryForHash, Object.keys(entryForHash).sort());
      const calculatedHash = await hash(canonical, 'SHA256');

      if (entry.hash !== calculatedHash) {
        return false;
      }

      expectedPreviousHash = entry.hash;
    }

    return true;
  }
}
```

---

## 8.11 Integration Points

### 8.11.1 Security Service Interfaces

| Service        | Security Functions                           | Integration             |
| -------------- | -------------------------------------------- | ----------------------- |
| **TradePass™** | Identity verification, credential management | Authentication provider |
| **GCI™**       | Score-based access control                   | Authorization input     |
| **PvP™**       | Escrow security, payment protection          | Transaction security    |
| **PANX™**      | Consensus security, validator auth           | Multi-party security    |

### 8.11.2 External Integrations

| System                  | Purpose         | Security Considerations |
| ----------------------- | --------------- | ----------------------- |
| **HSM**                 | Key storage     | mTLS, access control    |
| **SIEM**                | Log aggregation | Encrypted transport     |
| **Identity Provider**   | Federation      | OIDC, SAML              |
| **Threat Intelligence** | Threat feeds    | API authentication      |

---

## 8.12 Performance Metrics

| Metric                     | Target   | Measurement           |
| -------------------------- | -------- | --------------------- |
| **Authentication latency** | <500ms   | P99 response time     |
| **Signature verification** | <10ms    | Per-operation timing  |
| **Encryption throughput**  | >100MB/s | AES-256-GCM           |
| **HSM operations**         | >1000/s  | Operations per second |
| **ZK proof generation**    | <5s      | Complex proofs        |
| **ZK proof verification**  | <100ms   | Verification time     |

---

## 8.13 Security Hardening

### 8.13.1 Penetration Testing

| Activity                     | Frequency  | Scope                                                 | Provider                                   |
| ---------------------------- | ---------- | ----------------------------------------------------- | ------------------------------------------ |
| Third-party penetration test | Annual     | Full ecosystem (API, mobile, web, infrastructure)     | Independent security firm                  |
| Automated vulnerability scan | Quarterly  | All deployed containers and endpoints                 | Trivy + OWASP ZAP                          |
| Bug bounty program           | Continuous | Public-facing APIs and protocol implementations       | Managed platform (HackerOne or equivalent) |
| Red team exercise            | Annual     | Social engineering, physical security, infrastructure | Internal or contracted                     |

### 8.13.2 Dependency Security

| Control                       | Implementation                                            | SLA                |
| ----------------------------- | --------------------------------------------------------- | ------------------ |
| Automated dependency scanning | Dependabot (GitHub) + Renovate for automated PRs          | Continuous         |
| Critical CVE response         | Security team alerted, patch deployed                     | 48 hours           |
| High CVE response             | Ticket created, patch scheduled                           | 7 days             |
| Dependency audit              | Review all transitive dependencies for risk               | Quarterly          |
| License compliance            | Verify all dependencies are MIT/Apache-2.0/BSD compatible | Per new dependency |

### 8.13.3 Secrets Management

| Principle            | Implementation                                                 |
| -------------------- | -------------------------------------------------------------- |
| No secrets in code   | Pre-commit hook (TruffleHog) blocks commits containing secrets |
| No secrets in config | Environment variables via Kubernetes secrets or Vault          |
| Secret storage       | HashiCorp Vault for production, SOPS for development           |
| API key rotation     | 90-day rotation, automated via Vault                           |
| HSM key rotation     | Annual rotation with Shamir key ceremony (3-of-5 threshold)    |
| Service credentials  | Short-lived tokens (1 hour max TTL) via Vault                  |
| Developer access     | No production secrets accessible in development environments   |

### 8.13.4 Zero-Trust Implementation Checklist

| Layer          | Control                                                            | Status   |
| -------------- | ------------------------------------------------------------------ | -------- |
| Network        | mTLS between all services (Istio/Linkerd service mesh)             | Required |
| API            | API key per consumer, rate limiting per key                        | Required |
| Authentication | JWT with short expiry (15 min access, 7 day refresh)               | Required |
| Authorization  | RBAC at every service boundary, ABAC for data access               | Required |
| Input          | Validation at all API boundaries (Zod schemas, request validation) | Required |
| Output         | Response filtering (no internal errors exposed, no stack traces)   | Required |
| Database       | Per-service database credentials, no shared database access        | Required |
| Logging        | Every auth event logged with correlation ID                        | Required |
| Monitoring     | Failed auth attempt tracking, anomaly detection on access patterns | Required |

### 8.13.5 Security Audit Trail

Every security-relevant event produces an audit entry:

| Event Category       | Examples                                               | Retention |
| -------------------- | ------------------------------------------------------ | --------- |
| Authentication       | Login, logout, token refresh, failed attempt           | 1 year    |
| Authorization        | Permission grant, deny, escalation attempt             | 1 year    |
| Data access          | Read/write of Restricted or Sovereign data             | 7 years   |
| Configuration change | Secret rotation, permission change, policy update      | 7 years   |
| Security incident    | Vulnerability detection, breach attempt, anomaly alert | 7 years   |

Anomaly detection rules:

| Trigger                             | Response                                                          |
| ----------------------------------- | ----------------------------------------------------------------- |
| 5 failed auth attempts in 5 minutes | Account lockout + alert security team                             |
| Access from new geographic location | Step-up authentication required                                   |
| Bulk data export request            | Manual approval required from data governance lead                |
| Off-hours access to Sovereign data  | Alert security team; access logged with justification requirement |
| Privilege escalation attempt        | Immediate alert; session terminated; incident ticket created      |

---

_End of Section 8_
