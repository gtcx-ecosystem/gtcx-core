import { describe, it, expect } from 'vitest';

import type { EventType, DomainEvent } from '../src/common/events';

describe('EventType', () => {
  it('identity events are valid string literals', () => {
    const events: EventType[] = [
      'identity.created',
      'identity.updated',
      'identity.verified',
      'identity.suspended',
      'role.granted',
      'role.revoked',
    ];
    for (const e of events) {
      expect(e).toMatch(/^(identity|role)\./);
    }
  });

  it('trading events are valid string literals', () => {
    const events: EventType[] = [
      'listing.created',
      'listing.updated',
      'listing.cancelled',
      'order.placed',
      'order.matched',
      'order.cancelled',
      'trade.executed',
      'settlement.initiated',
      'settlement.completed',
      'settlement.failed',
    ];
    for (const e of events) {
      expect(e).toMatch(/^(listing|order|trade|settlement)\./);
    }
  });

  it('custody events are valid string literals', () => {
    const events: EventType[] = [
      'custody.received',
      'custody.transferred',
      'custody.sealed',
      'custody.verified',
      'lot.registered',
      'lot.certified',
    ];
    for (const e of events) {
      expect(e).toMatch(/^(custody|lot)\./);
    }
  });

  it('protocol events are valid string literals', () => {
    const events: EventType[] = [
      'tradepass.issued',
      'tradepass.revoked',
      'tradepass.expired',
      'geotag.recorded',
      'geotag.verified',
      'geotag.disputed',
      'gci.scored',
      'gci.updated',
      'gci.expired',
    ];
    for (const e of events) {
      expect(e).toMatch(/^(tradepass|geotag|gci)\./);
    }
  });
});

describe('DomainEvent structure', () => {
  it('can construct a typed domain event', () => {
    const event: DomainEvent<{ userId: string }> = {
      id: 'evt-1',
      type: 'identity.created',
      timestamp: Date.now(),
      version: '1',
      source: 'registration',
      data: { userId: 'u-123' },
    };
    expect(event.type).toBe('identity.created');
    expect(event.data.userId).toBe('u-123');
    expect(event.version).toBe('1');
  });

  it('supports optional actor and subject', () => {
    const event: DomainEvent<{ amount: number }> = {
      id: 'evt-2',
      type: 'trade.executed',
      timestamp: Date.now(),
      version: '1',
      source: 'trading',
      correlationId: 'corr-abc',
      causationId: 'cause-xyz',
      actor: { id: 'buyer-1', type: 'trader' },
      subject: { id: 'lot-42', type: 'asset_lot' },
      data: { amount: 1000 },
    };
    expect(event.actor?.id).toBe('buyer-1');
    expect(event.subject?.type).toBe('asset_lot');
    expect(event.correlationId).toBe('corr-abc');
  });

  it('supports metadata', () => {
    const event: DomainEvent = {
      id: 'evt-3',
      type: 'compliance.evaluated',
      timestamp: Date.now(),
      version: '2',
      source: 'compliance',
      data: null,
      metadata: { framework: 'IFC_ESG', jurisdiction: 'ZW' },
    };
    expect(event.metadata?.framework).toBe('IFC_ESG');
  });
});
