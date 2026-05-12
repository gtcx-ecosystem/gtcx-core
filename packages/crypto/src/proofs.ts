// ============================================================================
// CRYPTOGRAPHIC PROOFS
// Merkle trees and inclusion proofs
// ============================================================================

import { hash256, combineHashes, constantTimeEqual } from './hashing';

export interface MerkleProof {
  root: string;
  leaf: string;
  leafIndex: number;
  siblings: Array<{
    hash: string;
    position: 'left' | 'right';
  }>;
}

export interface MerkleTree {
  root: string;
  leaves: string[];
  layers: string[][];
}

/**
 * Build a Merkle tree from data items
 */
export function buildMerkleTree(items: string[]): MerkleTree {
  if (items.length === 0) {
    return { root: '', leaves: [], layers: [] };
  }

  // Hash all items to create leaves
  const leaves = items.map((item) => hash256(item));

  const layers: string[][] = [leaves];
  let currentLayer = leaves;

  // Build tree layers bottom-up
  while (currentLayer.length > 1) {
    const nextLayer: string[] = [];

    for (let i = 0; i < currentLayer.length; i += 2) {
      const left = currentLayer[i];
      const right = currentLayer[i + 1];
      // Use left value if right doesn't exist (odd number of nodes)
      if (left !== undefined) {
        nextLayer.push(combineHashes(left, right ?? left));
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
export function generateMerkleProof(tree: MerkleTree, leafIndex: number): MerkleProof {
  if (leafIndex < 0 || leafIndex >= tree.leaves.length) {
    throw new Error('Invalid leaf index');
  }

  const siblings: MerkleProof['siblings'] = [];
  let currentIndex = leafIndex;

  for (let i = 0; i < tree.layers.length - 1; i++) {
    const layer = tree.layers[i];
    if (!layer) continue;

    const isRightNode = currentIndex % 2 === 1;
    const siblingIndex = isRightNode ? currentIndex - 1 : currentIndex + 1;
    const siblingHash = layer[siblingIndex];

    if (siblingIndex < layer.length && siblingHash !== undefined) {
      siblings.push({
        hash: siblingHash,
        position: isRightNode ? 'left' : 'right',
      });
    } else if (!isRightNode && siblingIndex >= layer.length) {
      // Unpaired node in odd-length layer — was self-paired during tree construction
      const selfHash = layer[currentIndex];
      if (selfHash !== undefined) {
        siblings.push({ hash: selfHash, position: 'right' });
      }
    }

    currentIndex = Math.floor(currentIndex / 2);
  }

  const leaf = tree.leaves[leafIndex];
  /* c8 ignore next 2 -- defensive; leafIndex validated at function entry */
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
export function verifyMerkleProof(proof: MerkleProof): boolean {
  let currentHash = proof.leaf;

  for (const sibling of proof.siblings) {
    if (sibling.position === 'left') {
      currentHash = combineHashes(sibling.hash, currentHash);
    } else {
      currentHash = combineHashes(currentHash, sibling.hash);
    }
  }

  return constantTimeEqual(currentHash, proof.root);
}

/**
 * Create an inclusion proof for specific data
 */
export function createInclusionProof(data: string, allData: string[]): MerkleProof | null {
  const tree = buildMerkleTree(allData);
  const dataHash = hash256(data);
  const leafIndex = tree.leaves.indexOf(dataHash);

  if (leafIndex === -1) {
    return null;
  }

  return generateMerkleProof(tree, leafIndex);
}

/**
 * Verify data is included in a set with given root
 */
export function verifyInclusion(data: string, proof: MerkleProof): boolean {
  const dataHash = hash256(data);

  if (!constantTimeEqual(dataHash, proof.leaf)) {
    return false;
  }

  return verifyMerkleProof(proof);
}

/**
 * Batch verify multiple proofs
 */
export function batchVerifyProofs(proofs: MerkleProof[]): boolean[] {
  return proofs.map(verifyMerkleProof);
}

/**
 * Compute root from leaf and proof (without full verification)
 */
export function computeRootFromProof(proof: Omit<MerkleProof, 'root'>): string {
  let currentHash = proof.leaf;

  for (const sibling of proof.siblings) {
    if (sibling.position === 'left') {
      currentHash = combineHashes(sibling.hash, currentHash);
    } else {
      currentHash = combineHashes(currentHash, sibling.hash);
    }
  }

  return currentHash;
}
