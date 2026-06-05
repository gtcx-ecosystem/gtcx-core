import * as cryptoApi from '@gtcx/crypto';
import * as domainApi from '@gtcx/domain';
import * as eventsApi from '@gtcx/events';
import * as identityApi from '@gtcx/identity';
import * as schemasApi from '@gtcx/schemas';
import * as securityApi from '@gtcx/security';
import * as verificationApi from '@gtcx/verification';
import { describe, expect, it } from 'vitest';

describe('Public API contract', () => {
  it('exports required cryptography entrypoints', () => {
    expect(typeof cryptoApi.hash256).toBe('function');
    expect(typeof cryptoApi.sign).toBe('function');
    expect(typeof cryptoApi.verify).toBe('function');
  });

  it('exports required identity and verification entrypoints', () => {
    expect(typeof identityApi.createIdentity).toBe('function');
    expect(typeof identityApi.createDID).toBe('function');
    expect(typeof verificationApi.createStandardCertificateData).toBe('function');
    expect(typeof verificationApi.createProofBundle).toBe('function');
    expect(typeof verificationApi.tracedGenerateCertificate).toBe('function');
  });

  it('exports required domain and security entrypoints', () => {
    expect(typeof domainApi.safeValidateRegistrationData).toBe('function');
    expect(typeof domainApi.InMemoryEventEmitter).toBe('function');
    expect(typeof securityApi.sanitizeString).toBe('function');
    expect(typeof securityApi.CredentialCache).toBe('function');
  });

  it('exports required schema and event entrypoints', () => {
    expect(typeof schemasApi.getAllControls).toBe('function');
    expect(typeof eventsApi.TypedEventBus).toBe('function');
  });
});
