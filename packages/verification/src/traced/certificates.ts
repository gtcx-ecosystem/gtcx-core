/**
 * Traced certificate operations.
 */

import { hash256, sign, verify } from '@gtcx/crypto';

import {
  createMilitaryGradeCertificateData,
  createStandardCertificateData,
  verifyCertificateStructure,
} from '../certificates/generator.js';
import { traced } from '../tracing.js';
import type {
  Certificate,
  MilitaryGradeCertificate,
  StandardCertificate,
  CertificateVerificationResult,
} from '../types';

import {
  GenerateCertificateInput,
  sanitizeGenerateCertificateInput,
  sanitizeGenerateCertificateOutput,
  sanitizeVerifyCertificateInput,
} from './sanitizers';

export const tracedGenerateCertificate = traced(
  async (
    params: GenerateCertificateInput
  ): Promise<MilitaryGradeCertificate | StandardCertificate> => {
    const certInput = {
      templateId: params.type,
      location: params.location,
      userRole: params.assetData?.operatorRole ?? 'operator',
      deviceId: 'traced-verification',
      assetLotData: params.assetData,
      complianceData: params.claims ? { claims: params.claims } : undefined,
    };

    const shouldUseMilitary =
      params.securityLevel === 'military' || params.securityLevel === 'post-quantum';

    if (shouldUseMilitary) {
      const unsigned = createMilitaryGradeCertificateData(certInput);
      const postQuantumHash = hash256(unsigned.dataForPostQuantumHash);
      const dataToSign = JSON.stringify({
        certificateId: unsigned.certificateId,
        metadata: unsigned.metadata,
        postQuantumHash,
      });
      const ed25519Signature = sign(dataToSign, params.privateKey);
      const certificate = { ...unsigned };
      delete (certificate as { dataToSign?: string }).dataToSign;
      delete (certificate as { dataForPostQuantumHash?: string }).dataForPostQuantumHash;

      return {
        ...certificate,
        postQuantumHash,
        multiSignature: {
          ed25519: ed25519Signature,
        },
        verificationData: {
          ...certificate.verificationData,
          publicKey: params.publicKey,
          signature: ed25519Signature,
          entropyQuality: 1,
        },
        certificateData: {
          ...certificate.certificateData,
          claims: params.claims,
        },
      };
    }

    const unsigned = createStandardCertificateData(certInput);
    const signature = sign(unsigned.dataToSign, params.privateKey);
    const certificate = { ...unsigned };
    delete (certificate as { dataToSign?: string }).dataToSign;

    return {
      ...certificate,
      signature,
      verificationData: {
        ...certificate.verificationData,
        publicKey: params.publicKey,
        signature,
      },
    };
  },
  'verification.generateCertificate',
  {
    category: 'verification',
    logInput: true,
    logOutput: true,
    sanitizeInput: sanitizeGenerateCertificateInput,
    sanitizeOutput: sanitizeGenerateCertificateOutput,
  }
);

export const tracedVerifyCertificate = traced(
  async (certificate: Certificate): Promise<CertificateVerificationResult> => {
    const structure = verifyCertificateStructure(certificate);
    const now = Date.now();

    const hashValid =
      'dataHash' in certificate
        ? Boolean(certificate.dataHash)
        : 'postQuantumHash' in certificate
          ? Boolean(certificate.postQuantumHash)
          : false;

    let signatureValid = false;
    let cryptoVerified = false;
    const { publicKey, signature: sig } = certificate.verificationData ?? {};
    if (publicKey && sig) {
      let dataToSign: string | null = null;

      if ('dataHash' in certificate && certificate.dataHash) {
        dataToSign = JSON.stringify({
          certificateId: certificate.certificateId,
          metadata: certificate.metadata,
          dataHash: certificate.dataHash,
        });
      } else if ('postQuantumHash' in certificate && certificate.postQuantumHash) {
        dataToSign = JSON.stringify({
          certificateId: certificate.certificateId,
          metadata: certificate.metadata,
          postQuantumHash: certificate.postQuantumHash,
        });
      }

      if (dataToSign) {
        try {
          signatureValid = verify(dataToSign, sig, publicKey);
          cryptoVerified = true;
        } catch {
          signatureValid = false;
          cryptoVerified = true;
        }
      }
    }
    const timestampValid =
      certificate.metadata.issuedAt <= now &&
      certificate.verificationData.timestamp <= now &&
      certificate.createdAt <= now;
    const notExpired = !certificate.metadata.expiresAt || certificate.metadata.expiresAt > now;

    const isValid = structure.valid && hashValid && signatureValid && timestampValid && notExpired;
    const passedChecks = [hashValid, signatureValid, timestampValid, notExpired].filter(
      Boolean
    ).length;
    const confidence = passedChecks / 4;
    const details = isValid
      ? `Certificate passed ${cryptoVerified ? 'cryptographic' : 'structural'} and temporal checks`
      : `Certificate validation failed: ${structure.errors.join(', ') || 'one or more checks failed'}`;

    return {
      isValid,
      certificate,
      confidence,
      details,
      checks: {
        hashValid,
        signatureValid,
        timestampValid,
        notExpired,
      },
    };
  },
  'verification.verifyCertificate',
  {
    category: 'verification',
    logInput: true,
    logOutput: true,
    sanitizeInput: sanitizeVerifyCertificateInput,
  }
);
