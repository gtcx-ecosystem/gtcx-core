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
  batchVerify: () => batchVerify,
  batchVerifyProofs: () => batchVerifyProofs,
  buildMerkleTree: () => buildMerkleTree,
  combineHashes: () => combineHashes,
  compressPublicKey: () => compressPublicKey,
  computeRootFromProof: () => computeRootFromProof,
  createCommitment: () => createCommitment,
  createInclusionProof: () => createInclusionProof,
  createSignedMessage: () => createSignedMessage,
  derivePublicKey: () => derivePublicKey,
  doubleHash256: () => doubleHash256,
  generateKeyId: () => generateKeyId,
  generateKeyPair: () => generateKeyPair,
  generateMerkleProof: () => generateMerkleProof,
  generateSalt: () => generateSalt,
  getPublicKeyLength: () => getPublicKeyLength,
  hash: () => hash,
  hash256: () => hash256,
  hash512: () => hash512,
  hashObject: () => hashObject,
  isValidPrivateKey: () => isValidPrivateKey,
  isValidPublicKey: () => isValidPublicKey,
  keyFormats: () => keyFormats,
  logKeyEvent: () => logKeyEvent,
  logSigningOperation: () => logSigningOperation,
  sign: () => sign,
  signHash: () => signHash,
  tracedBatchVerify: () => tracedBatchVerify,
  tracedCombineHashes: () => tracedCombineHashes,
  tracedCompressPublicKey: () => tracedCompressPublicKey,
  tracedCreateCommitment: () => tracedCreateCommitment,
  tracedCreateSignedMessage: () => tracedCreateSignedMessage,
  tracedDerivePublicKey: () => tracedDerivePublicKey,
  tracedDoubleHash256: () => tracedDoubleHash256,
  tracedGenerateKeyId: () => tracedGenerateKeyId,
  tracedGenerateKeyPair: () => tracedGenerateKeyPair,
  tracedGenerateSalt: () => tracedGenerateSalt,
  tracedHash: () => tracedHash,
  tracedHash256: () => tracedHash256,
  tracedHash512: () => tracedHash512,
  tracedHashObject: () => tracedHashObject,
  tracedIsValidPrivateKey: () => tracedIsValidPrivateKey,
  tracedIsValidPublicKey: () => tracedIsValidPublicKey,
  tracedSign: () => tracedSign,
  tracedSignHash: () => tracedSignHash,
  tracedVerify: () => tracedVerify,
  tracedVerifyCommitment: () => tracedVerifyCommitment,
  tracedVerifyHash: () => tracedVerifyHash,
  tracedVerifyHashValue: () => tracedVerifyHashValue,
  tracedVerifySignedMessage: () => tracedVerifySignedMessage,
  verify: () => verify,
  verifyCommitment: () => verifyCommitment,
  verifyHash: () => verifyHash,
  verifyHashValue: () => verifyHash2,
  verifyInclusion: () => verifyInclusion,
  verifyMerkleProof: () => verifyMerkleProof,
  verifySignedMessage: () => verifySignedMessage
});
module.exports = __toCommonJS(index_exports);

// src/keys.ts
var import_ed25519 = require("@noble/curves/ed25519");
var import_secp256k1 = require("@noble/curves/secp256k1");
var import_utils = require("@noble/hashes/utils");
function generateKeyPair(algorithm = "Ed25519") {
  if (algorithm === "Secp256k1") {
    const privateKey2 = import_secp256k1.secp256k1.utils.randomPrivateKey();
    const publicKey2 = import_secp256k1.secp256k1.getPublicKey(privateKey2);
    return {
      publicKey: (0, import_utils.bytesToHex)(publicKey2),
      privateKey: (0, import_utils.bytesToHex)(privateKey2),
      algorithm: "Secp256k1"
    };
  }
  const privateKey = import_ed25519.ed25519.utils.randomPrivateKey();
  const publicKey = import_ed25519.ed25519.getPublicKey(privateKey);
  return {
    publicKey: (0, import_utils.bytesToHex)(publicKey),
    privateKey: (0, import_utils.bytesToHex)(privateKey),
    algorithm: "Ed25519"
  };
}
function derivePublicKey(privateKeyHex, algorithm = "Ed25519") {
  const privateKey = (0, import_utils.hexToBytes)(privateKeyHex);
  if (algorithm === "Secp256k1") {
    const publicKey2 = import_secp256k1.secp256k1.getPublicKey(privateKey);
    return (0, import_utils.bytesToHex)(publicKey2);
  }
  const publicKey = import_ed25519.ed25519.getPublicKey(privateKey);
  return (0, import_utils.bytesToHex)(publicKey);
}
function isValidPublicKey(publicKeyHex, algorithm = "Ed25519") {
  try {
    const bytes = (0, import_utils.hexToBytes)(publicKeyHex);
    if (algorithm === "Secp256k1") {
      return bytes.length === 33 || bytes.length === 65;
    }
    return bytes.length === 32;
  } catch {
    return false;
  }
}
function isValidPrivateKey(privateKeyHex) {
  try {
    const bytes = (0, import_utils.hexToBytes)(privateKeyHex);
    return bytes.length === 32 || bytes.length === 64;
  } catch {
    return false;
  }
}
function generateKeyId(publicKeyHex) {
  return `did:gtcx:${publicKeyHex.substring(0, 16)}`;
}
var keyFormats = {
  toBytes: (hex) => (0, import_utils.hexToBytes)(hex),
  toHex: (bytes) => (0, import_utils.bytesToHex)(bytes),
  toBase64: (hex) => {
    const bytes = (0, import_utils.hexToBytes)(hex);
    if (typeof btoa !== "undefined") {
      return btoa(String.fromCharCode(...bytes));
    }
    return Buffer.from(bytes).toString("base64");
  },
  fromBase64: (base64) => {
    if (typeof atob !== "undefined") {
      const binary = atob(base64);
      const bytes2 = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes2[i] = binary.charCodeAt(i);
      }
      return (0, import_utils.bytesToHex)(bytes2);
    }
    const bytes = Buffer.from(base64, "base64");
    return (0, import_utils.bytesToHex)(new Uint8Array(bytes));
  }
};
function getPublicKeyLength(algorithm) {
  return algorithm === "Secp256k1" ? 33 : 32;
}
function compressPublicKey(publicKeyHex) {
  const bytes = (0, import_utils.hexToBytes)(publicKeyHex);
  if (bytes.length === 33) {
    return publicKeyHex;
  }
  if (bytes.length === 65) {
    const lastByte = bytes[64];
    if (lastByte === void 0) {
      throw new Error("Invalid public key format");
    }
    const prefix = lastByte % 2 === 0 ? 2 : 3;
    const compressed = new Uint8Array(33);
    compressed[0] = prefix;
    compressed.set(bytes.slice(1, 33), 1);
    return (0, import_utils.bytesToHex)(compressed);
  }
  throw new Error("Invalid public key length for compression");
}

// src/signing.ts
var import_ed255192 = require("@noble/curves/ed25519");
var import_utils2 = require("@noble/hashes/utils");
function sign(message, privateKeyHex) {
  const privateKey = (0, import_utils2.hexToBytes)(privateKeyHex);
  const messageBytes = typeof message === "string" ? new TextEncoder().encode(message) : message;
  const signature = import_ed255192.ed25519.sign(messageBytes, privateKey);
  return (0, import_utils2.bytesToHex)(signature);
}
function signHash(hash2, privateKeyHex) {
  const privateKey = (0, import_utils2.hexToBytes)(privateKeyHex);
  const hashBytes = (0, import_utils2.hexToBytes)(hash2);
  const signature = import_ed255192.ed25519.sign(hashBytes, privateKey);
  return (0, import_utils2.bytesToHex)(signature);
}
function verify(message, signatureHex, publicKeyHex) {
  try {
    const signature = (0, import_utils2.hexToBytes)(signatureHex);
    const publicKey = (0, import_utils2.hexToBytes)(publicKeyHex);
    const messageBytes = typeof message === "string" ? new TextEncoder().encode(message) : message;
    return import_ed255192.ed25519.verify(signature, messageBytes, publicKey);
  } catch {
    return false;
  }
}
function verifyHash(hashHex, signatureHex, publicKeyHex) {
  try {
    const hash2 = (0, import_utils2.hexToBytes)(hashHex);
    const signature = (0, import_utils2.hexToBytes)(signatureHex);
    const publicKey = (0, import_utils2.hexToBytes)(publicKeyHex);
    return import_ed255192.ed25519.verify(signature, hash2, publicKey);
  } catch {
    return false;
  }
}
function createSignedMessage(data, privateKeyHex, publicKeyHex) {
  const message = typeof data === "string" ? data : JSON.stringify(data, Object.keys(data).sort());
  const signature = sign(message, privateKeyHex);
  return {
    signature,
    publicKey: publicKeyHex,
    message,
    timestamp: Date.now()
  };
}
function verifySignedMessage(signedMessage) {
  const isValid = verify(
    signedMessage.message,
    signedMessage.signature,
    signedMessage.publicKey
  );
  return {
    valid: isValid,
    publicKey: signedMessage.publicKey,
    error: isValid ? void 0 : "Invalid signature"
  };
}
function batchVerify(items) {
  return items.map((item) => verify(item.message, item.signature, item.publicKey));
}

// src/hashing.ts
var import_sha256 = require("@noble/hashes/sha256");
var import_sha512 = require("@noble/hashes/sha512");
var import_utils3 = require("@noble/hashes/utils");
function hash256(data) {
  const bytes = typeof data === "string" ? new TextEncoder().encode(data) : data;
  return (0, import_utils3.bytesToHex)((0, import_sha256.sha256)(bytes));
}
function hash512(data) {
  const bytes = typeof data === "string" ? new TextEncoder().encode(data) : data;
  return (0, import_utils3.bytesToHex)((0, import_sha512.sha512)(bytes));
}
function hash(data, algorithm = "sha256") {
  switch (algorithm) {
    case "sha256":
      return hash256(data);
    case "sha512":
      return hash512(data);
    default:
      throw new Error(`Unsupported hash algorithm: ${algorithm}`);
  }
}
function hashObject(obj) {
  const sortedJson = JSON.stringify(obj, Object.keys(obj).sort());
  return hash256(sortedJson);
}
function doubleHash256(data) {
  const firstHash = (0, import_sha256.sha256)(
    typeof data === "string" ? new TextEncoder().encode(data) : data
  );
  return (0, import_utils3.bytesToHex)((0, import_sha256.sha256)(firstHash));
}
function verifyHash2(data, expectedHash, algorithm = "sha256") {
  const computedHash = hash(data, algorithm);
  return computedHash === expectedHash.toLowerCase();
}
function createCommitment(data, salt) {
  return hash256(`${salt}:${data}`);
}
function verifyCommitment(data, salt, commitment) {
  const computed = createCommitment(data, salt);
  return computed === commitment.toLowerCase();
}
function generateSalt(length = 32) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return (0, import_utils3.bytesToHex)(bytes);
}
function combineHashes(...hashes) {
  const combined = hashes.sort().join("");
  return hash256(combined);
}

// src/proofs.ts
function buildMerkleTree(items) {
  if (items.length === 0) {
    return { root: "", leaves: [], layers: [] };
  }
  const leaves = items.map((item) => hash256(item));
  const layers = [leaves];
  let currentLayer = leaves;
  while (currentLayer.length > 1) {
    const nextLayer = [];
    for (let i = 0; i < currentLayer.length; i += 2) {
      const left = currentLayer[i];
      const right = currentLayer[i + 1];
      if (left !== void 0) {
        nextLayer.push(combineHashes(left, right ?? left));
      }
    }
    layers.push(nextLayer);
    currentLayer = nextLayer;
  }
  return {
    root: currentLayer[0] ?? "",
    leaves,
    layers
  };
}
function generateMerkleProof(tree, leafIndex) {
  if (leafIndex < 0 || leafIndex >= tree.leaves.length) {
    throw new Error("Invalid leaf index");
  }
  const siblings = [];
  let currentIndex = leafIndex;
  for (let i = 0; i < tree.layers.length - 1; i++) {
    const layer = tree.layers[i];
    if (!layer) continue;
    const isRightNode = currentIndex % 2 === 1;
    const siblingIndex = isRightNode ? currentIndex - 1 : currentIndex + 1;
    const siblingHash = layer[siblingIndex];
    if (siblingIndex < layer.length && siblingHash !== void 0) {
      siblings.push({
        hash: siblingHash,
        position: isRightNode ? "left" : "right"
      });
    }
    currentIndex = Math.floor(currentIndex / 2);
  }
  const leaf = tree.leaves[leafIndex];
  if (leaf === void 0) {
    throw new Error("Invalid leaf index");
  }
  return {
    root: tree.root,
    leaf,
    leafIndex,
    siblings
  };
}
function verifyMerkleProof(proof) {
  let currentHash = proof.leaf;
  for (const sibling of proof.siblings) {
    if (sibling.position === "left") {
      currentHash = combineHashes(sibling.hash, currentHash);
    } else {
      currentHash = combineHashes(currentHash, sibling.hash);
    }
  }
  return currentHash === proof.root;
}
function createInclusionProof(data, allData) {
  const tree = buildMerkleTree(allData);
  const dataHash = hash256(data);
  const leafIndex = tree.leaves.indexOf(dataHash);
  if (leafIndex === -1) {
    return null;
  }
  return generateMerkleProof(tree, leafIndex);
}
function verifyInclusion(data, proof) {
  const dataHash = hash256(data);
  if (dataHash !== proof.leaf) {
    return false;
  }
  return verifyMerkleProof(proof);
}
function batchVerifyProofs(proofs) {
  return proofs.map(verifyMerkleProof);
}
function computeRootFromProof(proof) {
  let currentHash = proof.leaf;
  for (const sibling of proof.siblings) {
    if (sibling.position === "left") {
      currentHash = combineHashes(sibling.hash, currentHash);
    } else {
      currentHash = combineHashes(currentHash, sibling.hash);
    }
  }
  return currentHash;
}

// src/traced.ts
var import_ai = require("@gtcx/ai");
var cryptoLog = (0, import_ai.createCategoryLogger)("crypto");
var tracedSign = (0, import_ai.traced)(
  (message, privateKeyHex) => {
    return sign(message, privateKeyHex);
  },
  "crypto.sign",
  {
    category: "crypto",
    logInput: false,
    // Never log private keys
    logOutput: false,
    // Don't log signatures (could be sensitive)
    metadata: { algorithm: "Ed25519" }
  }
);
var tracedSignHash = (0, import_ai.traced)(
  (hash2, privateKeyHex) => {
    return signHash(hash2, privateKeyHex);
  },
  "crypto.signHash",
  {
    category: "crypto",
    logInput: false,
    logOutput: false,
    metadata: { algorithm: "Ed25519" }
  }
);
var tracedVerify = (0, import_ai.traced)(
  (message, signatureHex, publicKeyHex) => {
    return verify(message, signatureHex, publicKeyHex);
  },
  "crypto.verify",
  {
    category: "crypto",
    logInput: false,
    logOutput: true,
    // Log success/failure
    metadata: { algorithm: "Ed25519" }
  }
);
var tracedVerifyHash = (0, import_ai.traced)(
  (hashHex, signatureHex, publicKeyHex) => {
    return verifyHash(hashHex, signatureHex, publicKeyHex);
  },
  "crypto.verifyHash",
  {
    category: "crypto",
    logInput: false,
    logOutput: true,
    metadata: { algorithm: "Ed25519" }
  }
);
var tracedCreateSignedMessage = (0, import_ai.traced)(
  (data, privateKeyHex, publicKeyHex) => {
    return createSignedMessage(data, privateKeyHex, publicKeyHex);
  },
  "crypto.createSignedMessage",
  {
    category: "crypto",
    logInput: false,
    logOutput: false,
    metadata: { algorithm: "Ed25519" }
  }
);
var tracedVerifySignedMessage = (0, import_ai.traced)(
  (signedMessage) => {
    return verifySignedMessage(signedMessage);
  },
  "crypto.verifySignedMessage",
  {
    category: "crypto",
    logInput: false,
    logOutput: true,
    metadata: { algorithm: "Ed25519" }
  }
);
var tracedBatchVerify = (0, import_ai.traced)(
  (items) => {
    return batchVerify(items);
  },
  "crypto.batchVerify",
  {
    category: "crypto",
    logInput: false,
    logOutput: true,
    metadata: { algorithm: "Ed25519" },
    sanitizeOutput: (output) => {
      const results = output;
      return {
        total: results.length,
        valid: results.filter(Boolean).length,
        invalid: results.filter((r) => !r).length
      };
    }
  }
);
function logSigningOperation(metadata) {
  if (metadata.success) {
    cryptoLog.info(`${metadata.operation}`, {
      publicKeyId: metadata.publicKeyId,
      context: metadata.context
    });
  } else {
    cryptoLog.warn(`${metadata.operation}.failed`, {
      publicKeyId: metadata.publicKeyId,
      context: metadata.context
    });
  }
}

// src/traced-hashing.ts
var import_ai2 = require("@gtcx/ai");
var tracedHash256 = (0, import_ai2.traced)(
  (input) => hash256(input),
  "crypto.hash256",
  {
    category: "crypto",
    logInput: false,
    logOutput: false,
    // Hashes can be sensitive
    metadata: { algorithm: "SHA-256" }
  }
);
var tracedHash512 = (0, import_ai2.traced)(
  (input) => hash512(input),
  "crypto.hash512",
  {
    category: "crypto",
    logInput: false,
    logOutput: false,
    metadata: { algorithm: "SHA-512" }
  }
);
var tracedHash = (0, import_ai2.traced)(
  (input, algorithm = "sha256") => hash(input, algorithm),
  "crypto.hash",
  {
    category: "crypto",
    logInput: false,
    logOutput: false
  }
);
var tracedHashObject = (0, import_ai2.traced)(
  (obj) => hashObject(obj),
  "crypto.hashObject",
  {
    category: "crypto",
    logInput: false,
    logOutput: false
  }
);
var tracedDoubleHash256 = (0, import_ai2.traced)(
  (input) => doubleHash256(input),
  "crypto.doubleHash256",
  {
    category: "crypto",
    logInput: false,
    logOutput: false,
    metadata: { algorithm: "SHA-256-double" }
  }
);
var tracedVerifyHashValue = (0, import_ai2.traced)(
  (input, expectedHash, algorithm = "sha256") => verifyHash2(input, expectedHash, algorithm),
  "crypto.verifyHashValue",
  {
    category: "crypto",
    logInput: false,
    logOutput: true
    // Log success/failure
  }
);
var tracedCreateCommitment = (0, import_ai2.traced)(
  (value, salt) => createCommitment(value, salt),
  "crypto.createCommitment",
  {
    category: "crypto",
    logInput: false,
    logOutput: false
  }
);
var tracedVerifyCommitment = (0, import_ai2.traced)(
  (value, salt, commitment) => verifyCommitment(value, salt, commitment),
  "crypto.verifyCommitment",
  {
    category: "crypto",
    logInput: false,
    logOutput: true
  }
);
var tracedGenerateSalt = (0, import_ai2.traced)(
  (length = 32) => generateSalt(length),
  "crypto.generateSalt",
  {
    category: "crypto",
    logInput: true,
    logOutput: false,
    // Never log salt values
    metadata: { purpose: "salt-generation" }
  }
);
var tracedCombineHashes = (0, import_ai2.traced)(
  (...hashes) => combineHashes(...hashes),
  "crypto.combineHashes",
  {
    category: "crypto",
    logInput: false,
    logOutput: false,
    sanitizeInput: (input) => {
      const args = input;
      return {
        hashCount: args.length
      };
    }
  }
);

// src/traced-keys.ts
var import_ai3 = require("@gtcx/ai");
var cryptoLog2 = (0, import_ai3.createCategoryLogger)("crypto");
var tracedGenerateKeyPair = (0, import_ai3.traced)(
  (algorithm = "Ed25519") => {
    return generateKeyPair(algorithm);
  },
  "crypto.generateKeyPair",
  {
    category: "crypto",
    logInput: true,
    logOutput: false,
    // Never log key material
    sanitizeOutput: (output) => {
      const result = output;
      return {
        algorithm: result.algorithm,
        publicKeyLength: result.publicKey.length
      };
    }
  }
);
var tracedDerivePublicKey = (0, import_ai3.traced)(
  (privateKeyHex, algorithm = "Ed25519") => {
    return derivePublicKey(privateKeyHex, algorithm);
  },
  "crypto.derivePublicKey",
  {
    category: "crypto",
    logInput: false,
    // Never log private keys
    logOutput: false,
    // Don't log public keys either
    sanitizeOutput: (output) => {
      const publicKey = output;
      return {
        publicKeyLength: publicKey.length
      };
    }
  }
);
var tracedIsValidPublicKey = (0, import_ai3.traced)(
  (publicKeyHex, algorithm = "Ed25519") => {
    return isValidPublicKey(publicKeyHex, algorithm);
  },
  "crypto.isValidPublicKey",
  {
    category: "crypto",
    logInput: false,
    logOutput: true
    // Log valid/invalid
  }
);
var tracedIsValidPrivateKey = (0, import_ai3.traced)(
  (privateKeyHex) => {
    return isValidPrivateKey(privateKeyHex);
  },
  "crypto.isValidPrivateKey",
  {
    category: "crypto",
    logInput: false,
    // Never log private keys
    logOutput: true
  }
);
var tracedGenerateKeyId = (0, import_ai3.traced)(
  (publicKeyHex) => {
    return generateKeyId(publicKeyHex);
  },
  "crypto.generateKeyId",
  {
    category: "crypto",
    logInput: false,
    logOutput: false,
    sanitizeOutput: (output) => {
      const keyId = output;
      return {
        keyIdPrefix: keyId.slice(0, 8) + "..."
      };
    }
  }
);
var tracedCompressPublicKey = (0, import_ai3.traced)(
  (publicKeyHex) => {
    return compressPublicKey(publicKeyHex);
  },
  "crypto.compressPublicKey",
  {
    category: "crypto",
    logInput: false,
    logOutput: false
  }
);
function logKeyEvent(event) {
  cryptoLog2.info(`key.${event.type}`, {
    keyIdPrefix: event.keyId.slice(0, 8) + "...",
    algorithm: event.algorithm,
    context: event.context
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  batchVerify,
  batchVerifyProofs,
  buildMerkleTree,
  combineHashes,
  compressPublicKey,
  computeRootFromProof,
  createCommitment,
  createInclusionProof,
  createSignedMessage,
  derivePublicKey,
  doubleHash256,
  generateKeyId,
  generateKeyPair,
  generateMerkleProof,
  generateSalt,
  getPublicKeyLength,
  hash,
  hash256,
  hash512,
  hashObject,
  isValidPrivateKey,
  isValidPublicKey,
  keyFormats,
  logKeyEvent,
  logSigningOperation,
  sign,
  signHash,
  tracedBatchVerify,
  tracedCombineHashes,
  tracedCompressPublicKey,
  tracedCreateCommitment,
  tracedCreateSignedMessage,
  tracedDerivePublicKey,
  tracedDoubleHash256,
  tracedGenerateKeyId,
  tracedGenerateKeyPair,
  tracedGenerateSalt,
  tracedHash,
  tracedHash256,
  tracedHash512,
  tracedHashObject,
  tracedIsValidPrivateKey,
  tracedIsValidPublicKey,
  tracedSign,
  tracedSignHash,
  tracedVerify,
  tracedVerifyCommitment,
  tracedVerifyHash,
  tracedVerifyHashValue,
  tracedVerifySignedMessage,
  verify,
  verifyCommitment,
  verifyHash,
  verifyHashValue,
  verifyInclusion,
  verifyMerkleProof,
  verifySignedMessage
});
