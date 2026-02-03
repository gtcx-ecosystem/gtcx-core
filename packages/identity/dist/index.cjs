"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  DID_METHOD: () => DID_METHOD,
  createDID: () => createDID,
  createDIDDocument: () => createDIDDocument,
  createEnhancedIdentity: () => createEnhancedIdentity,
  createIdentity: () => createIdentity,
  deriveIdentity: () => deriveIdentity,
  extractPublicKey: () => extractPublicKey,
  generateIdentityId: () => generateIdentityId,
  isIdentityExpired: () => isIdentityExpired,
  isValidDID: () => isValidDID,
  parseDID: () => parseDID,
  resolveDID: () => resolveDID,
  validateIdentity: () => validateIdentity
});
module.exports = __toCommonJS(index_exports);

// src/identity.ts
var import_crypto = require("@gtcx/crypto");
var import_crypto2 = require("@gtcx/crypto");
function generateIdentityId(prefix = "GTCX") {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `${prefix}_${timestamp}_${random}`;
}
async function createIdentity(options = {}) {
  const {
    securityLevel = "standard",
    metadata = {},
    algorithm = "Ed25519"
  } = options;
  const keyPair = await (0, import_crypto.generateKeyPair)(algorithm);
  const id = generateIdentityId();
  const privateKeyRef = `gtcx_identity_${id}`;
  const fingerprint = (0, import_crypto2.hash256)(keyPair.publicKey).substring(0, 16);
  const identity = {
    id,
    publicKey: keyPair.publicKey,
    privateKeyRef,
    createdAt: Date.now(),
    securityLevel,
    metadata: {
      fingerprint,
      ...metadata
    }
  };
  return {
    identity,
    privateKey: keyPair.privateKey
  };
}
async function createEnhancedIdentity(options = {}) {
  const {
    securityLevel = "military",
    metadata = {},
    keyDerivation
  } = options;
  const ed25519KeyPair = await (0, import_crypto.generateKeyPair)("Ed25519");
  const secp256k1KeyPair = await (0, import_crypto.generateKeyPair)("Secp256k1");
  const id = generateIdentityId("MIL");
  const ed25519KeyRef = `gtcx_ed25519_${id}`;
  const secp256k1KeyRef = `gtcx_secp256k1_${id}`;
  const combinedKeys = ed25519KeyPair.publicKey + secp256k1KeyPair.publicKey;
  const quantumHash = (0, import_crypto2.hash256)((0, import_crypto2.hash256)(combinedKeys) + Date.now().toString());
  const fingerprint = (0, import_crypto2.hash256)(ed25519KeyPair.publicKey).substring(0, 16);
  const multiKeyPairs = {
    ed25519: {
      algorithm: "Ed25519",
      publicKey: ed25519KeyPair.publicKey,
      privateKeyRef: ed25519KeyRef,
      createdAt: Date.now()
    },
    secp256k1: {
      algorithm: "Secp256k1",
      publicKey: secp256k1KeyPair.publicKey,
      privateKeyRef: secp256k1KeyRef,
      createdAt: Date.now()
    }
  };
  const identity = {
    id,
    publicKey: ed25519KeyPair.publicKey,
    // Primary key
    privateKeyRef: ed25519KeyRef,
    createdAt: Date.now(),
    securityLevel,
    metadata: {
      fingerprint,
      ...metadata
    },
    multiKeyPairs,
    quantumResistantHash: quantumHash,
    keyDerivation: keyDerivation ? {
      algorithm: keyDerivation.algorithm ?? "Argon2",
      iterations: keyDerivation.iterations ?? 1e5,
      salt: keyDerivation.salt ?? generateIdentityId("SALT")
    } : void 0
  };
  return {
    identity,
    privateKeys: {
      ed25519: ed25519KeyPair.privateKey,
      secp256k1: secp256k1KeyPair.privateKey
    }
  };
}
function validateIdentity(identity) {
  const errors = [];
  if (!identity.id) errors.push("Missing identity ID");
  if (!identity.publicKey) errors.push("Missing public key");
  if (!identity.privateKeyRef) errors.push("Missing private key reference");
  if (!identity.createdAt) errors.push("Missing creation timestamp");
  if (identity.publicKey && identity.publicKey.length < 64) {
    errors.push("Invalid public key length");
  }
  if (identity.expiresAt && identity.expiresAt < Date.now()) {
    errors.push("Identity has expired");
  }
  return {
    valid: errors.length === 0,
    errors
  };
}
function isIdentityExpired(identity) {
  if (!identity.expiresAt) return false;
  return identity.expiresAt < Date.now();
}
async function deriveIdentity(parentIdentity, context, options = {}) {
  const derivedMetadata = {
    ...parentIdentity.metadata,
    ...options.metadata,
    parentIdentityId: parentIdentity.id,
    derivationContext: context
  };
  return createIdentity({
    ...options,
    securityLevel: options.securityLevel ?? parentIdentity.securityLevel,
    metadata: derivedMetadata
  });
}

// src/did.ts
var import_crypto3 = require("@gtcx/crypto");
var DID_METHOD = "gtcx";
function createDID(identity) {
  const fingerprint = identity.metadata.fingerprint ?? (0, import_crypto3.hash256)(identity.publicKey).substring(0, 32);
  return `did:${DID_METHOD}:${fingerprint}`;
}
function parseDID(did) {
  const match = did.match(/^did:([^:]+):([^#]+)(#.*)?$/);
  if (!match) return null;
  return {
    method: match[1],
    identifier: match[2],
    fragment: match[3]?.substring(1)
  };
}
function isValidDID(did) {
  const parsed = parseDID(did);
  return parsed !== null && parsed.method === DID_METHOD;
}
function createDIDDocument(identity) {
  const did = createDID(identity);
  const verificationMethods = [
    {
      id: `${did}#keys-1`,
      type: "Ed25519VerificationKey2020",
      controller: did,
      publicKeyHex: identity.publicKey
    }
  ];
  if ("multiKeyPairs" in identity && identity.multiKeyPairs.secp256k1) {
    verificationMethods.push({
      id: `${did}#keys-2`,
      type: "EcdsaSecp256k1VerificationKey2019",
      controller: did,
      publicKeyHex: identity.multiKeyPairs.secp256k1.publicKey
    });
  }
  return {
    "@context": [
      "https://www.w3.org/ns/did/v1",
      "https://w3id.org/security/suites/ed25519-2020/v1"
    ],
    id: did,
    verificationMethod: verificationMethods,
    authentication: verificationMethods.map((vm) => vm.id),
    assertionMethod: verificationMethods.map((vm) => vm.id),
    created: new Date(identity.createdAt).toISOString()
  };
}
async function resolveDID(did, resolver) {
  if (!isValidDID(did)) {
    return null;
  }
  if (resolver) {
    return resolver(did);
  }
  return null;
}
function extractPublicKey(document, keyId) {
  const method = keyId ? document.verificationMethod.find((vm) => vm.id === keyId) : document.verificationMethod[0];
  return method?.publicKeyHex ?? method?.publicKeyMultibase ?? null;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DID_METHOD,
  createDID,
  createDIDDocument,
  createEnhancedIdentity,
  createIdentity,
  deriveIdentity,
  extractPublicKey,
  generateIdentityId,
  isIdentityExpired,
  isValidDID,
  parseDID,
  resolveDID,
  validateIdentity
});
