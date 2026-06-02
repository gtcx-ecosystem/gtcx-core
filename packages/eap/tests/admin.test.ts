import { describe, expect, it } from 'vitest';

import { createEapAdminService } from '../src/admin.js';

describe('EapAdminService', () => {
  it('issues API key and returns fingerprint without evidence secret', async () => {
    const eap = createEapAdminService({ environment: 'staging' });
    const result = await eap.issueApiKey({
      tenantId: 'gtcx-internal-smoke',
      clientId: 'smoke-test-01',
      tier: 'E0',
      scopes: ['intelligence:health'],
      actor: 'human://gtcx/security',
    });

    expect(result.credentialFingerprint).toMatch(/^sha256:[a-f0-9]{64}$/);
    expect(result.secret).toMatch(/^gtcx_/);
    expect(result.secretStorageArn).toContain('gtcx-eap/staging');

    const listed = eap.listFingerprints('gtcx-internal-smoke');
    expect(listed.credentials).toHaveLength(1);
    expect(listed.credentials[0]?.clientId).toBe('smoke-test-01');
  });

  it('revokes active credential', async () => {
    const eap = createEapAdminService({ environment: 'staging' });
    await eap.issueApiKey({
      tenantId: 't1',
      clientId: 'c1',
      tier: 'E1',
      scopes: ['intelligence:metrics'],
      actor: 'human://gtcx/security',
    });

    const revoked = await eap.revoke({
      tenantId: 't1',
      clientId: 'c1',
      actor: 'human://gtcx/security',
    });
    expect(revoked.revoked).toBe(true);

    const listed = eap.listFingerprints('t1');
    expect(listed.credentials[0]?.status).toBe('revoked');
  });

  it('rejects duplicate active issue', async () => {
    const eap = createEapAdminService({ environment: 'staging' });
    await eap.issueApiKey({
      tenantId: 't2',
      clientId: 'dup',
      tier: 'E0',
      scopes: [],
      actor: 'human://gtcx/security',
    });

    await expect(
      eap.issueApiKey({
        tenantId: 't2',
        clientId: 'dup',
        tier: 'E0',
        scopes: [],
        actor: 'human://gtcx/security',
      })
    ).rejects.toThrow(/already active/);
  });
});
