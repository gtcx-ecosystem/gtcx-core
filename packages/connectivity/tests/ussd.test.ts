import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { UssdSession, UssdParser, UssdParseError } from '../src/ussd/index.js';

describe('UssdSession', () => {
  let sessionManager: UssdSession;

  beforeEach(() => {
    sessionManager = new UssdSession();
  });

  afterEach(() => {
    sessionManager.clear();
  });

  it('creates a new session with init state', () => {
    const session = sessionManager.create('sess-1', '+254712345678');
    expect(session.sessionId).toBe('sess-1');
    expect(session.phoneNumber).toBe('+254712345678');
    expect(session.state).toBe('init');
    expect(session.data).toEqual({});
    expect(session.createdAt).toBeGreaterThan(0);
    expect(session.lastActivityAt).toBe(session.createdAt);
  });

  it('retrieves an existing session', () => {
    sessionManager.create('sess-1', '+254712345678');
    const retrieved = sessionManager.get('sess-1');
    expect(retrieved).toBeDefined();
    expect(retrieved?.phoneNumber).toBe('+254712345678');
  });

  it('returns undefined for unknown session', () => {
    expect(sessionManager.get('nonexistent')).toBeUndefined();
  });

  it('updates session state and data', () => {
    sessionManager.create('sess-1', '+254712345678');
    const updated = sessionManager.update('sess-1', {
      state: 'menu',
      data: { commodity: 'gold' },
      currentMenu: 'main',
    });
    expect(updated?.state).toBe('menu');
    expect(updated?.data).toEqual({ commodity: 'gold' });
    expect(updated?.currentMenu).toBe('main');
    expect(updated?.lastActivityAt).toBeGreaterThanOrEqual(updated?.createdAt ?? 0);
  });

  it('returns undefined when updating nonexistent session', () => {
    expect(sessionManager.update('nonexistent', { state: 'menu' })).toBeUndefined();
  });

  it('merges data rather than replacing', () => {
    sessionManager.create('sess-1', '+254712345678');
    sessionManager.update('sess-1', { data: { a: '1' } });
    sessionManager.update('sess-1', { data: { b: '2' } });
    const session = sessionManager.get('sess-1');
    expect(session?.data).toEqual({ a: '1', b: '2' });
  });

  it('destroys a session', () => {
    sessionManager.create('sess-1', '+254712345678');
    expect(sessionManager.destroy('sess-1')).toBe(true);
    expect(sessionManager.get('sess-1')).toBeUndefined();
  });

  it('returns false when destroying nonexistent session', () => {
    expect(sessionManager.destroy('nonexistent')).toBe(false);
  });

  it('counts active sessions', () => {
    sessionManager.create('sess-1', '+254712345678');
    sessionManager.create('sess-2', '+254712345679');
    expect(sessionManager.count()).toBe(2);
  });

  it('reports size including expired sessions', () => {
    sessionManager.create('sess-1', '+254712345678');
    expect(sessionManager.size()).toBe(1);
  });

  it('expires sessions after TTL', () => {
    const shortTtl = new UssdSession({ ttlMs: 50 });
    shortTtl.create('sess-1', '+254712345678');
    expect(shortTtl.isExpired('sess-1')).toBe(false);

    const session = shortTtl.get('sess-1');
    if (session) {
      session.lastActivityAt = Date.now() - 100;
    }
    expect(shortTtl.isExpired('sess-1')).toBe(true);
    shortTtl.clear();
  });

  it('cleans up expired sessions', () => {
    const shortTtl = new UssdSession({ ttlMs: 50 });
    shortTtl.create('sess-1', '+254712345678');
    shortTtl.create('sess-2', '+254712345679');

    const s1 = shortTtl.get('sess-1');
    if (s1) s1.lastActivityAt = Date.now() - 100;

    expect(shortTtl.cleanup()).toBe(1);
    expect(shortTtl.get('sess-1')).toBeUndefined();
    expect(shortTtl.get('sess-2')).toBeDefined();
    shortTtl.clear();
  });

  it('clears all sessions', () => {
    sessionManager.create('sess-1', '+254712345678');
    sessionManager.clear();
    expect(sessionManager.size()).toBe(0);
  });
});

describe('UssdParser', () => {
  let parser: UssdParser;

  beforeEach(() => {
    parser = new UssdParser();
  });

  describe('parse', () => {
    it('parses a valid camelCase payload', () => {
      const payload = {
        sessionId: 'abc-123',
        phoneNumber: '+254712345678',
        serviceCode: '*384*123#',
        text: '1',
      };
      const req = parser.parse(payload);
      expect(req.sessionId).toBe('abc-123');
      expect(req.phoneNumber).toBe('+254712345678');
      expect(req.serviceCode).toBe('*384*123#');
      expect(req.text).toBe('1');
    });

    it('parses a valid snake_case payload', () => {
      const payload = {
        session_id: 'abc-123',
        phone_number: '+254712345678',
        service_code: '*384*123#',
        text: '',
      };
      const req = parser.parse(payload);
      expect(req.sessionId).toBe('abc-123');
      expect(req.phoneNumber).toBe('+254712345678');
      expect(req.serviceCode).toBe('*384*123#');
      expect(req.text).toBe('');
    });

    it('accepts msisdn as phone number alias', () => {
      const payload = {
        sessionId: 'abc-123',
        msisdn: '+254712345678',
        serviceCode: '*384#',
        text: '',
      };
      const req = parser.parse(payload);
      expect(req.phoneNumber).toBe('+254712345678');
    });

    it('trims whitespace from string fields', () => {
      const payload = {
        sessionId: '  abc-123  ',
        phoneNumber: ' +254712345678 ',
        serviceCode: '*384#',
        text: '',
      };
      const req = parser.parse(payload);
      expect(req.sessionId).toBe('abc-123');
      expect(req.phoneNumber).toBe('+254712345678');
    });

    it('throws when payload is not an object', () => {
      expect(() => parser.parse(null)).toThrow(UssdParseError);
      expect(() => parser.parse('string')).toThrow(UssdParseError);
      expect(() => parser.parse(42)).toThrow(UssdParseError);
    });

    it('throws when sessionId is missing', () => {
      const payload = { phoneNumber: '+254', serviceCode: '*384#' };
      expect(() => parser.parse(payload)).toThrow('Missing required field: sessionId');
    });

    it('throws when phoneNumber is missing', () => {
      const payload = { sessionId: 'abc', serviceCode: '*384#' };
      expect(() => parser.parse(payload)).toThrow('Missing required field: phoneNumber');
    });

    it('throws when serviceCode is missing', () => {
      const payload = { sessionId: 'abc', phoneNumber: '+254' };
      expect(() => parser.parse(payload)).toThrow('Missing required field: serviceCode');
    });
  });

  describe('formatResponse', () => {
    it('formats an active session response', () => {
      const res = parser.formatResponse('Main Menu\n1. Gold\n2. Cocoa', true);
      expect(res.text).toBe('Main Menu\n1. Gold\n2. Cocoa');
      expect(res.sessionActive).toBe(true);
    });

    it('formats a terminating response', () => {
      const res = parser.formatResponse('Thank you. Goodbye.', false);
      expect(res.sessionActive).toBe(false);
    });
  });

  describe('extractInput', () => {
    it('extracts input after service code', () => {
      const input = parser.extractInput('*384*123*1*42#', '*384*123#');
      expect(input).toBe('1*42');
    });

    it('returns empty string when no input follows code', () => {
      const input = parser.extractInput('*384*123#', '*384*123#');
      expect(input).toBe('');
    });

    it('returns raw string for non-standard format', () => {
      const input = parser.extractInput('raw text', '*384#');
      expect(input).toBe('raw text');
    });
  });

  describe('parseDialString', () => {
    it('parses dial string into code and input', () => {
      const parsed = parser.parseDialString('*384*1*42#');
      expect(parsed.serviceCode).toBe('*384#');
      expect(parsed.input).toBe('1*42');
    });

    it('handles simple service code without input', () => {
      const parsed = parser.parseDialString('*384#');
      expect(parsed.serviceCode).toBe('*384#');
      expect(parsed.input).toBe('');
    });

    it('returns raw string for non-standard format', () => {
      const parsed = parser.parseDialString('invalid');
      expect(parsed.serviceCode).toBe('invalid');
      expect(parsed.input).toBe('');
    });
  });
});
