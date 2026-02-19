// ============================================================================
// IDENTITY PROTOCOL TYPES
// Digital identity and credential types for GTCX
// ============================================================================

/**
 * Security levels for cryptographic operations
 */
export type SecurityLevel = 'standard' | 'enhanced' | 'military';

/**
 * Supported cryptographic algorithms
 */
export type CryptoAlgorithm =
  | 'Ed25519'
  | 'Secp256k1'
  | 'Ed25519-SHA256'
  | 'Secp256k1-SHA256'
  | 'MultiSig'
  | 'QuantumResistant';

/**
 * Key pair representation
 */
export interface KeyPair {
  algorithm: CryptoAlgorithm;
  publicKey: string;
  privateKeyRef: string; // Reference to secure storage key
  createdAt: number;
}

/**
 * Multi-key identity for enhanced security
 */
export interface MultiKeyPairs {
  ed25519: KeyPair;
  secp256k1?: KeyPair;
}

/**
 * Digital identity for GTCX participants
 */
export interface DigitalIdentity {
  id: string;
  did?: string; // Decentralized identifier
  publicKey: string;
  privateKeyRef: string;
  createdAt: number;
  expiresAt?: number;
  securityLevel: SecurityLevel;
  metadata: IdentityMetadata;
}

export interface IdentityMetadata {
  userId?: string;
  deviceId?: string;
  userRole?: string;
  issuer?: string;
  fingerprint?: string;
  complianceStandards?: string[];
}

/**
 * Enhanced identity with multi-signature support
 */
export interface EnhancedIdentity extends DigitalIdentity {
  multiKeyPairs: MultiKeyPairs;
  quantumResistantHash?: string;
  keyDerivation?: KeyDerivationParams;
  entropyValidation?: EntropyValidation;
  certificationChain?: string[];
}

export interface KeyDerivationParams {
  algorithm: 'PBKDF2' | 'Argon2' | 'Scrypt';
  iterations: number;
  salt: string;
}

export interface EntropyValidation {
  source: 'hardware' | 'cryptographic' | 'hybrid';
  quality: number; // 0-1
  timestamp: number;
}

/**
 * Device attestation for mobile identity
 */
export interface DeviceIdentity {
  deviceId: string;
  platform: 'ios' | 'android' | 'web';
  modelInfo?: string;
  osVersion?: string;
  integrityToken?: string;
  attestationTime: number;
}

/**
 * Verifiable credential structure
 */
export interface VerifiableCredential {
  '@context': string[];
  type: string[];
  issuer: string | CredentialIssuer;
  issuanceDate: string;
  expirationDate?: string;
  credentialSubject: CredentialSubject;
  proof?: CredentialProof;
}

export interface CredentialIssuer {
  id: string;
  name?: string;
}

export interface CredentialSubject {
  id: string;
  [key: string]: unknown;
}

export interface CredentialProof {
  type: string;
  created: string;
  verificationMethod: string;
  proofPurpose: string;
  proofValue: string;
}

/**
 * Identity verification result
 */
export interface IdentityVerificationResult {
  valid: boolean;
  identity?: DigitalIdentity;
  errors?: string[];
  verifiedAt: number;
}
