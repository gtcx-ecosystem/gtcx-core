import { getBackend } from '../src';

describe('crypto backend selection', () => {
  it('defaults to js when native bindings are unavailable', () => {
    expect(getBackend()).toBe('js');
  });
});
