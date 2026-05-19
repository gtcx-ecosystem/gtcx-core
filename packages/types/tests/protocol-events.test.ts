import { describe, it, expect } from 'vitest';

import { PROTOCOL_EVENT_SUBJECTS } from '../src/common/events';

describe('PROTOCOL_EVENT_SUBJECTS', () => {
  it('contains all protocol event mappings', () => {
    expect(PROTOCOL_EVENT_SUBJECTS['tradepass.issued']).toBe('gtcx.events.TradePass.issued');
    expect(PROTOCOL_EVENT_SUBJECTS['geotag.recorded']).toBe('gtcx.events.GeoTag.recorded');
    expect(PROTOCOL_EVENT_SUBJECTS['gci.scored']).toBe('gtcx.events.GCI.scored');
  });

  it('has exactly 9 entries', () => {
    expect(Object.keys(PROTOCOL_EVENT_SUBJECTS)).toHaveLength(9);
  });
});
