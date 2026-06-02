import { assertHex, isHex } from './index';
import type { NativeByteArray } from './index';

export interface NativeGroth16Keys {
  circuit: string;
  provingKey: string;
  verifyingKey: string;
}

export interface NativeGroth16ProofBundle {
  circuit: string;
  proof: string;
  verifyingKey: string;
  publicInputsJson: string;
}

export interface NativeBulletproofsBundle {
  min: number;
  max: number;
  commitment: string;
  proofLow: string;
  proofHigh: string;
}

export interface NativeBulletproofsCommodityRangeBundle {
  min: number;
  max: number;
  commitment: string;
  commodityHash: string;
  unitHash: string;
  proofLow: string;
  proofHigh: string;
}

export interface NativeSchnorrBundle {
  attributeHash: string;
  subjectHash: string;
  nonceCommitment: string;
  response: string;
}

function optionalNativeFn<T extends (...args: never[]) => unknown>(
  raw: Record<string, unknown>,
  keys: string[]
): T | undefined {
  for (const key of keys) {
    const value = raw[key];
    if (typeof value === 'function') {
      return value as T;
    }
  }
  return undefined;
}

export function createZkpBindings(raw: Record<string, unknown>) {
  const groth16GenerateKeys = optionalNativeFn<(circuitType: string) => NativeGroth16Keys>(raw, [
    'groth16_generate_keys',
    'groth16GenerateKeys',
  ]);

  const rawGroth16ProveCommodityOrigin = optionalNativeFn<
    (
      commodityType: number,
      mineIdHex: string,
      lat: number,
      lon: number,
      primaryMetric: number,
      secondaryMetric: number,
      primaryRandomnessHex: string,
      secondaryRandomnessHex: string,
      locationRandomnessHex: string,
      bounds: number[],
      minPrimary: number,
      minSecondary: number,
      certificationFlags: number,
      merklePathHex: string,
      provingKeyHex: string,
      verifyingKeyHex: string
    ) => NativeGroth16ProofBundle
  >(raw, ['groth16_prove_commodity_origin', 'groth16ProveCommodityOrigin']);

  const groth16ProveCommodityOrigin = rawGroth16ProveCommodityOrigin
    ? (
        commodityType: number,
        mineIdHex: string,
        lat: number,
        lon: number,
        primaryMetric: number,
        secondaryMetric: number,
        primaryRandomnessHex: string,
        secondaryRandomnessHex: string,
        locationRandomnessHex: string,
        bounds: number[],
        minPrimary: number,
        minSecondary: number,
        certificationFlags: number,
        merklePathHex: string,
        provingKeyHex: string,
        verifyingKeyHex: string
      ): NativeGroth16ProofBundle => {
        assertHex(mineIdHex, 'mineId');
        assertHex(primaryRandomnessHex, 'primaryRandomness');
        assertHex(secondaryRandomnessHex, 'secondaryRandomness');
        assertHex(locationRandomnessHex, 'locationRandomness');
        assertHex(merklePathHex, 'merklePath');
        assertHex(provingKeyHex, 'provingKey');
        assertHex(verifyingKeyHex, 'verifyingKey');
        if (bounds.length !== 4) {
          throw new Error('bounds must have exactly 4 elements [minLat, maxLat, minLon, maxLon]');
        }
        return rawGroth16ProveCommodityOrigin(
          commodityType,
          mineIdHex,
          lat,
          lon,
          primaryMetric,
          secondaryMetric,
          primaryRandomnessHex,
          secondaryRandomnessHex,
          locationRandomnessHex,
          bounds,
          minPrimary,
          minSecondary,
          certificationFlags,
          merklePathHex,
          provingKeyHex,
          verifyingKeyHex
        );
      }
    : undefined;

  const rawGroth16ProveGciThreshold = optionalNativeFn<
    (
      score: number,
      threshold: number,
      provingKeyHex: string,
      verifyingKeyHex: string
    ) => NativeGroth16ProofBundle
  >(raw, ['groth16_prove_gci_threshold', 'groth16ProveGciThreshold']);

  const groth16ProveGciThreshold = rawGroth16ProveGciThreshold
    ? (
        score: number,
        threshold: number,
        provingKeyHex: string,
        verifyingKeyHex: string
      ): NativeGroth16ProofBundle => {
        assertHex(provingKeyHex, 'provingKey');
        assertHex(verifyingKeyHex, 'verifyingKey');
        return rawGroth16ProveGciThreshold(score, threshold, provingKeyHex, verifyingKeyHex);
      }
    : undefined;

  const rawGroth16VerifyProof = optionalNativeFn<
    (
      circuitType: string,
      proofHex: string,
      verifyingKeyHex: string,
      publicInputsJson: string
    ) => boolean
  >(raw, ['groth16_verify_proof', 'groth16VerifyProof']);

  const groth16VerifyProof = rawGroth16VerifyProof
    ? (
        circuitType: string,
        proofHex: string,
        verifyingKeyHex: string,
        publicInputsJson: string
      ): boolean => {
        if (!isHex(proofHex) || !isHex(verifyingKeyHex)) {
          return false;
        }
        return rawGroth16VerifyProof(circuitType, proofHex, verifyingKeyHex, publicInputsJson);
      }
    : undefined;

  const rawBulletproofsProveAmountRange = optionalNativeFn<
    (amount: number, min: number, max: number, randomnessHex: string) => NativeBulletproofsBundle
  >(raw, ['bulletproofs_prove_amount_range', 'bulletproofsProveAmountRange']);

  const bulletproofsProveAmountRange = rawBulletproofsProveAmountRange
    ? (
        amount: number,
        min: number,
        max: number,
        randomnessHex: string
      ): NativeBulletproofsBundle => {
        assertHex(randomnessHex, 'randomness');
        return rawBulletproofsProveAmountRange(amount, min, max, randomnessHex);
      }
    : undefined;

  const rawBulletproofsVerifyAmountRange = optionalNativeFn<
    (
      min: number,
      max: number,
      commitmentHex: string,
      proofLowHex: string,
      proofHighHex: string
    ) => boolean
  >(raw, ['bulletproofs_verify_amount_range', 'bulletproofsVerifyAmountRange']);

  const bulletproofsVerifyAmountRange = rawBulletproofsVerifyAmountRange
    ? (
        min: number,
        max: number,
        commitmentHex: string,
        proofLowHex: string,
        proofHighHex: string
      ): boolean => {
        if (!isHex(commitmentHex) || !isHex(proofLowHex) || !isHex(proofHighHex)) {
          return false;
        }
        return rawBulletproofsVerifyAmountRange(min, max, commitmentHex, proofLowHex, proofHighHex);
      }
    : undefined;

  const rawBulletproofsProveCommodityRange = optionalNativeFn<
    (
      quantity: number,
      min: number,
      max: number,
      commodityHashHex: string,
      unitHashHex: string,
      randomnessHex: string
    ) => NativeBulletproofsCommodityRangeBundle
  >(raw, ['bulletproofs_prove_commodity_range', 'bulletproofsProveCommodityRange']);

  const bulletproofsProveCommodityRange = rawBulletproofsProveCommodityRange
    ? (
        quantity: number,
        min: number,
        max: number,
        commodityHashHex: string,
        unitHashHex: string,
        randomnessHex: string
      ): NativeBulletproofsCommodityRangeBundle => {
        assertHex(commodityHashHex, 'commodityHash');
        assertHex(unitHashHex, 'unitHash');
        assertHex(randomnessHex, 'randomness');
        return rawBulletproofsProveCommodityRange(
          quantity,
          min,
          max,
          commodityHashHex,
          unitHashHex,
          randomnessHex
        );
      }
    : undefined;

  const rawBulletproofsVerifyCommodityRange = optionalNativeFn<
    (
      min: number,
      max: number,
      commitmentHex: string,
      commodityHashHex: string,
      unitHashHex: string,
      proofLowHex: string,
      proofHighHex: string
    ) => boolean
  >(raw, ['bulletproofs_verify_commodity_range', 'bulletproofsVerifyCommodityRange']);

  const bulletproofsVerifyCommodityRange = rawBulletproofsVerifyCommodityRange
    ? (
        min: number,
        max: number,
        commitmentHex: string,
        commodityHashHex: string,
        unitHashHex: string,
        proofLowHex: string,
        proofHighHex: string
      ): boolean => {
        if (
          !isHex(commitmentHex) ||
          !isHex(commodityHashHex) ||
          !isHex(unitHashHex) ||
          !isHex(proofLowHex) ||
          !isHex(proofHighHex)
        ) {
          return false;
        }
        return rawBulletproofsVerifyCommodityRange(
          min,
          max,
          commitmentHex,
          commodityHashHex,
          unitHashHex,
          proofLowHex,
          proofHighHex
        );
      }
    : undefined;

  const rawSchnorrProveIdentityAttribute = optionalNativeFn<
    (attribute: NativeByteArray, subjectHashHex: string) => NativeSchnorrBundle
  >(raw, ['schnorr_prove_identity_attribute', 'schnorrProveIdentityAttribute']);

  const schnorrProveIdentityAttribute = rawSchnorrProveIdentityAttribute
    ? (attribute: Uint8Array, subjectHashHex: string): NativeSchnorrBundle => {
        assertHex(subjectHashHex, 'subjectHash');
        return rawSchnorrProveIdentityAttribute(Array.from(attribute), subjectHashHex);
      }
    : undefined;

  const rawSchnorrVerifyIdentityAttribute = optionalNativeFn<
    (
      attributeHashHex: string,
      subjectHashHex: string,
      nonceCommitmentHex: string,
      responseHex: string
    ) => boolean
  >(raw, ['schnorr_verify_identity_attribute', 'schnorrVerifyIdentityAttribute']);

  const schnorrVerifyIdentityAttribute = rawSchnorrVerifyIdentityAttribute
    ? (
        attributeHashHex: string,
        subjectHashHex: string,
        nonceCommitmentHex: string,
        responseHex: string
      ): boolean => {
        if (
          !isHex(attributeHashHex) ||
          !isHex(subjectHashHex) ||
          !isHex(nonceCommitmentHex) ||
          !isHex(responseHex)
        ) {
          return false;
        }
        return rawSchnorrVerifyIdentityAttribute(
          attributeHashHex,
          subjectHashHex,
          nonceCommitmentHex,
          responseHex
        );
      }
    : undefined;

  return {
    groth16GenerateKeys,
    groth16ProveCommodityOrigin,
    groth16ProveGciThreshold,
    groth16VerifyProof,
    bulletproofsProveAmountRange,
    bulletproofsVerifyAmountRange,
    bulletproofsProveCommodityRange,
    bulletproofsVerifyCommodityRange,
    schnorrProveIdentityAttribute,
    schnorrVerifyIdentityAttribute,
  };
}
