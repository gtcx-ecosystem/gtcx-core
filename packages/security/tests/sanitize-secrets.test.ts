import { describe, it, expect } from 'vitest';

import { sanitizeSecrets } from '../src/validation/sanitize';

describe('sanitizeSecrets', () => {
  it('should redact sensitive keys from a simple object', () => {
    const input = {
      id: 'user-1',
      privateKey: 'very-secret-key',
      publicKey: 'public-key',
      password: 'password123',
    };

    const output = sanitizeSecrets(input);

    expect(output.id).toBe('user-1');
    expect(output.publicKey).toBe('public-key');
    expect(output.privateKey).toBe('[REDACTED]');
    expect(output.password).toBe('[REDACTED]');
  });

  it('should redact sensitive keys recursively', () => {
    const input = {
      user: {
        name: 'John',
        credentials: {
          token: 'abc-123',
          secret: 'shhh',
        },
      },
      apiKey: 'key-999',
    };

    const output = sanitizeSecrets(input);

    expect(output.user.name).toBe('John');
    expect(output.user.credentials.token).toBe('[REDACTED]');
    expect(output.user.credentials.secret).toBe('[REDACTED]');
    expect(output.apiKey).toBe('[REDACTED]');
  });

  it('should handle arrays of objects', () => {
    const input = [
      { id: 1, seed: 'seed1' },
      { id: 2, mnemonic: 'mne2' },
    ];

    const output = sanitizeSecrets(input);

    expect(output[0].id).toBe(1);
    expect(output[0].seed).toBe('[REDACTED]');
    expect(output[1].id).toBe(2);
    expect(output[1].mnemonic).toBe('[REDACTED]');
  });

  it('should be case-insensitive for sensitive keys', () => {
    const input = {
      PRIVATE_KEY: 'secret1',
      Secret: 'secret2',
    };

    const output = sanitizeSecrets(input);

    expect(output.PRIVATE_KEY).toBe('[REDACTED]');
    expect(output.Secret).toBe('[REDACTED]');
  });

  it('should return non-object inputs unchanged', () => {
    expect(sanitizeSecrets('string')).toBe('string');
    expect(sanitizeSecrets(123)).toBe(123);
    expect(sanitizeSecrets(null)).toBe(null);
    expect(sanitizeSecrets(undefined)).toBe(undefined);
  });
});
