import type { PredicateDefinition } from '@gtcx/verification';

import { WORKPROOF_PREDICATE_URIS } from '../uri';

export const PaymentReceived: PredicateDefinition = {
  uri: WORKPROOF_PREDICATE_URIS.PaymentReceived,
  name: 'Payment Received',
  description: 'Income payment confirmed and recorded',
  domain: 'financial',
  version: '2.1.0',
  schema: { type: 'number', min: 0 },
  evidence: { required: ['document_hash'] },
  attestation: {
    allowedAttestors: [{ type: 'credential', value: 'FinanceID' }],
    selfAttestation: false,
  },
  confidence: { baseScore: 0.95, evidenceWeights: { document_hash: 1.0 }, minimumThreshold: 0.8 },
  temporal: { validDuration: 'P5Y', renewalRequired: false },
  ai: {
    embeddingModel: 'text-embedding-3-large',
    reasoningHints: ['transaction record analysis'],
    relatedPredicates: [WORKPROOF_PREDICATE_URIS.CommodityProduced],
    contextTemplate: 'Payment received: {{value}} {{unit}}',
  },
};
export const LoanDisbursed: PredicateDefinition = {
  uri: WORKPROOF_PREDICATE_URIS.LoanDisbursed,
  name: 'Loan Disbursed',
  description: 'Credit disbursement received',
  domain: 'financial',
  version: '2.1.0',
  schema: { type: 'number', min: 0 },
  evidence: { required: ['document_hash'] },
  attestation: {
    allowedAttestors: [{ type: 'credential', value: 'FinanceID' }],
    selfAttestation: false,
  },
  confidence: { baseScore: 0.95, evidenceWeights: { document_hash: 1.0 }, minimumThreshold: 0.8 },
  temporal: { validDuration: 'P5Y', renewalRequired: false },
  ai: {
    embeddingModel: 'text-embedding-3-large',
    reasoningHints: ['loan agreement analysis'],
    relatedPredicates: [WORKPROOF_PREDICATE_URIS.RepaymentCompleted],
    contextTemplate: 'Loan disbursed: {{value}} {{unit}}',
  },
};
export const RepaymentCompleted: PredicateDefinition = {
  uri: WORKPROOF_PREDICATE_URIS.RepaymentCompleted,
  name: 'Repayment Completed',
  description: 'Loan repayment obligation met',
  domain: 'financial',
  version: '2.1.0',
  schema: { type: 'number', min: 0 },
  evidence: { required: ['document_hash'] },
  attestation: {
    allowedAttestors: [{ type: 'credential', value: 'FinanceID' }],
    selfAttestation: false,
  },
  confidence: { baseScore: 0.95, evidenceWeights: { document_hash: 1.0 }, minimumThreshold: 0.8 },
  temporal: { validDuration: 'P5Y', renewalRequired: false },
  ai: {
    embeddingModel: 'text-embedding-3-large',
    reasoningHints: ['repayment pattern analysis'],
    relatedPredicates: [WORKPROOF_PREDICATE_URIS.LoanDisbursed],
    contextTemplate: 'Repayment completed: {{value}} {{unit}}',
  },
};
export const SavingsDeposited: PredicateDefinition = {
  uri: WORKPROOF_PREDICATE_URIS.SavingsDeposited,
  name: 'Savings Deposited',
  description: 'Savings contribution recorded',
  domain: 'financial',
  version: '2.1.0',
  schema: { type: 'number', min: 0 },
  evidence: { required: ['document_hash'] },
  attestation: {
    allowedAttestors: [{ type: 'credential', value: 'FinanceID' }],
    selfAttestation: false,
  },
  confidence: { baseScore: 0.9, evidenceWeights: { document_hash: 1.0 }, minimumThreshold: 0.7 },
  temporal: { validDuration: 'P5Y', renewalRequired: false },
  ai: {
    embeddingModel: 'text-embedding-3-large',
    reasoningHints: ['savings balance verification'],
    relatedPredicates: [WORKPROOF_PREDICATE_URIS.PaymentReceived],
    contextTemplate: 'Savings deposited: {{value}} {{unit}}',
  },
};
export const TaxWithheld: PredicateDefinition = {
  uri: WORKPROOF_PREDICATE_URIS.TaxWithheld,
  name: 'Tax Withheld',
  description: 'Tax obligation met through withholding',
  domain: 'financial',
  version: '2.1.0',
  schema: { type: 'number', min: 0 },
  evidence: { required: ['document_hash'] },
  attestation: {
    allowedAttestors: [{ type: 'credential', value: 'AuthorityID' }],
    selfAttestation: false,
  },
  confidence: { baseScore: 0.95, evidenceWeights: { document_hash: 1.0 }, minimumThreshold: 0.8 },
  temporal: { validDuration: 'P1Y', renewalRequired: false },
  ai: {
    embeddingModel: 'text-embedding-3-large',
    reasoningHints: ['tax record verification'],
    relatedPredicates: [WORKPROOF_PREDICATE_URIS.PaymentReceived],
    contextTemplate: 'Tax withheld: {{value}} {{unit}}',
  },
};
