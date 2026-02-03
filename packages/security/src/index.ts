/**
 * @gtcx/security
 * 
 * Security utilities for the GTCX Protocol ecosystem.
 * 
 * This package provides non-cryptographic security utilities that complement @gtcx/crypto:
 * - validation/ - Input sanitization, Zod schemas (P2, P9)
 * - auth/ - Authentication tokens, sessions, permissions (P9)
 * - offline/ - Secure storage, credential caching, tamper detection (P8)
 * - audit/ - Security event logging, audit trails (P12)
 * 
 * @see /docs/architecture/security.md for full security architecture
 */

// Re-export all modules
export * from './validation';
export * from './auth';
export * from './offline';
export * from './audit';
