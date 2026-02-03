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
export declare function buildMerkleTree(items: string[]): MerkleTree;
/**
 * Generate a proof for a leaf at given index
 */
export declare function generateMerkleProof(tree: MerkleTree, leafIndex: number): MerkleProof;
/**
 * Verify a Merkle proof
 */
export declare function verifyMerkleProof(proof: MerkleProof): boolean;
/**
 * Create an inclusion proof for specific data
 */
export declare function createInclusionProof(data: string, allData: string[]): MerkleProof | null;
/**
 * Verify data is included in a set with given root
 */
export declare function verifyInclusion(data: string, proof: MerkleProof): boolean;
/**
 * Batch verify multiple proofs
 */
export declare function batchVerifyProofs(proofs: MerkleProof[]): boolean[];
/**
 * Compute root from leaf and proof (without full verification)
 */
export declare function computeRootFromProof(proof: Omit<MerkleProof, 'root'>): string;
//# sourceMappingURL=proofs.d.ts.map