import type { UssdSessionData, UssdSessionOptions, UssdSessionState } from './types.js';

const DEFAULT_TTL_MS = 300_000;

/**
 * In-memory USSD session manager.
 *
 * Handles creation, lookup, state transitions, and expiration
 * of feature-phone sessions. Designed for single-node deployments;
 * scale-out requires an external session store.
 */
export class UssdSession {
  private readonly sessions = new Map<string, UssdSessionData>();
  private readonly ttlMs: number;

  constructor(options?: UssdSessionOptions) {
    this.ttlMs = options?.ttlMs ?? DEFAULT_TTL_MS;
  }

  /**
   * Create a new session or replace an existing one.
   *
   * @returns The newly created session data.
   */
  create(sessionId: string, phoneNumber: string): UssdSessionData {
    const now = Date.now();
    const session: UssdSessionData = {
      sessionId,
      phoneNumber,
      state: 'init',
      data: {},
      createdAt: now,
      lastActivityAt: now,
    };
    this.sessions.set(sessionId, session);
    return session;
  }

  /** Retrieve a session by ID, or `undefined` if not found. */
  get(sessionId: string): UssdSessionData | undefined {
    return this.sessions.get(sessionId);
  }

  /**
   * Update session state and/or accumulated data.
   *
   * Automatically refreshes `lastActivityAt`. Returns the updated
   * session, or `undefined` if the session does not exist.
   */
  update(
    sessionId: string,
    updates: {
      state?: UssdSessionState;
      data?: Record<string, string>;
      currentMenu?: string;
    }
  ): UssdSessionData | undefined {
    const session = this.sessions.get(sessionId);
    if (!session) return undefined;

    if (updates.state !== undefined) {
      session.state = updates.state;
    }
    if (updates.data !== undefined) {
      session.data = { ...session.data, ...updates.data };
    }
    if (updates.currentMenu !== undefined) {
      session.currentMenu = updates.currentMenu;
    }
    session.lastActivityAt = Date.now();
    return session;
  }

  /** Remove a session permanently. */
  destroy(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  /** Check whether a session has exceeded its TTL. */
  isExpired(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return true;
    return Date.now() - session.lastActivityAt > this.ttlMs;
  }

  /** Remove all sessions that have exceeded their TTL. Returns the number removed. */
  cleanup(): number {
    const now = Date.now();
    let removed = 0;
    for (const [id, session] of this.sessions) {
      if (now - session.lastActivityAt > this.ttlMs) {
        this.sessions.delete(id);
        removed++;
      }
    }
    return removed;
  }

  /** Return the number of active (non-expired) sessions. */
  count(): number {
    let active = 0;
    const now = Date.now();
    for (const session of this.sessions.values()) {
      if (now - session.lastActivityAt <= this.ttlMs) {
        active++;
      }
    }
    return active;
  }

  /** Return the total number of sessions in the registry (including expired). */
  size(): number {
    return this.sessions.size;
  }

  /** Clear every session. */
  clear(): void {
    this.sessions.clear();
  }
}
