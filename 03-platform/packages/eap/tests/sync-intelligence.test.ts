import { describe, expect, it } from 'vitest';

import { mergeApiKeyIntoBundle, parseAuthKeysBundle } from '../src/sync-intelligence.js';

describe('sync-intelligence', () => {
  it('merges new api key into bundle', () => {
    const bundle = parseAuthKeysBundle(
      JSON.stringify({
        AUTH_API_KEYS: 'existing-key-1234567890',
        AUTH_KEY_ROLES: 'existing-key-1234567890:intelligence',
      })
    );
    const merged = mergeApiKeyIntoBundle(bundle, 'new-key-123456789012', 'smoke');
    expect(merged.AUTH_API_KEYS).toContain('existing-key-1234567890');
    expect(merged.AUTH_API_KEYS).toContain('new-key-123456789012');
    expect(merged.AUTH_KEY_ROLES).toContain('new-key-123456789012:smoke');
  });
});
