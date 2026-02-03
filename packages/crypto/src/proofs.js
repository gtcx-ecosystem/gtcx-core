"use strict";
// ============================================================================
// CRYPTOGRAPHIC PROOFS
// Merkle trees and inclusion proofs
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMerkleTree = buildMerkleTree;
exports.generateMerkleProof = generateMerkleProof;
exports.verifyMerkleProof = verifyMerkleProof;
exports.createInclusionProof = createInclusionProof;
exports.verifyInclusion = verifyInclusion;
exports.batchVerifyProofs = batchVerifyProofs;
exports.computeRootFromProof = computeRootFromProof;
const hashing_1 = require("./hashing");
/**
 * Build a Merkle tree from data items
 */
function buildMerkleTree(items) {
    if (items.length === 0) {
        return { root: '', leaves: [], layers: [] };
    }
    // Hash all items to create leaves
    const leaves = items.map(item => (0, hashing_1.hash256)(item));
    const layers = [leaves];
    let currentLayer = leaves;
    // Build tree layers bottom-up
    while (currentLayer.length > 1) {
        const nextLayer = [];
        for (let i = 0; i < currentLayer.length; i += 2) {
            const left = currentLayer[i];
            const right = currentLayer[i + 1];
            // Use left value if right doesn't exist (odd number of nodes)
            if (left !== undefined) {
                nextLayer.push((0, hashing_1.combineHashes)(left, right ?? left));
            }
        }
        layers.push(nextLayer);
        currentLayer = nextLayer;
    }
    return {
        root: currentLayer[0] ?? '',
        leaves,
        layers,
    };
}
/**
 * Generate a proof for a leaf at given index
 */
function generateMerkleProof(tree, leafIndex) {
    if (leafIndex < 0 || leafIndex >= tree.leaves.length) {
        throw new Error('Invalid leaf index');
    }
    const siblings = [];
    let currentIndex = leafIndex;
    for (let i = 0; i < tree.layers.length - 1; i++) {
        const layer = tree.layers[i];
        if (!layer)
            continue;
        const isRightNode = currentIndex % 2 === 1;
        const siblingIndex = isRightNode ? currentIndex - 1 : currentIndex + 1;
        const siblingHash = layer[siblingIndex];
        if (siblingIndex < layer.length && siblingHash !== undefined) {
            siblings.push({
                hash: siblingHash,
                position: isRightNode ? 'left' : 'right',
            });
        }
        currentIndex = Math.floor(currentIndex / 2);
    }
    const leaf = tree.leaves[leafIndex];
    if (leaf === undefined) {
        throw new Error('Invalid leaf index');
    }
    return {
        root: tree.root,
        leaf,
        leafIndex,
        siblings,
    };
}
/**
 * Verify a Merkle proof
 */
function verifyMerkleProof(proof) {
    let currentHash = proof.leaf;
    for (const sibling of proof.siblings) {
        if (sibling.position === 'left') {
            currentHash = (0, hashing_1.combineHashes)(sibling.hash, currentHash);
        }
        else {
            currentHash = (0, hashing_1.combineHashes)(currentHash, sibling.hash);
        }
    }
    return currentHash === proof.root;
}
/**
 * Create an inclusion proof for specific data
 */
function createInclusionProof(data, allData) {
    const tree = buildMerkleTree(allData);
    const dataHash = (0, hashing_1.hash256)(data);
    const leafIndex = tree.leaves.indexOf(dataHash);
    if (leafIndex === -1) {
        return null;
    }
    return generateMerkleProof(tree, leafIndex);
}
/**
 * Verify data is included in a set with given root
 */
function verifyInclusion(data, proof) {
    const dataHash = (0, hashing_1.hash256)(data);
    if (dataHash !== proof.leaf) {
        return false;
    }
    return verifyMerkleProof(proof);
}
/**
 * Batch verify multiple proofs
 */
function batchVerifyProofs(proofs) {
    return proofs.map(verifyMerkleProof);
}
/**
 * Compute root from leaf and proof (without full verification)
 */
function computeRootFromProof(proof) {
    let currentHash = proof.leaf;
    for (const sibling of proof.siblings) {
        if (sibling.position === 'left') {
            currentHash = (0, hashing_1.combineHashes)(sibling.hash, currentHash);
        }
        else {
            currentHash = (0, hashing_1.combineHashes)(currentHash, sibling.hash);
        }
    }
    return currentHash;
}
//# sourceMappingURL=proofs.js.map