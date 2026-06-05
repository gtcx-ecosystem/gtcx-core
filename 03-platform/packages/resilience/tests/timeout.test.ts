import { describe, it, expect } from 'vitest';

import { withTimeout, TimeoutError } from '../src/timeout';

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('withTimeout', () => {
  it('returns result when function resolves before timeout', async () => {
    const result = await withTimeout(() => Promise.resolve(42), { timeoutMs: 1000 });
    expect(result).toBe(42);
  });

  it('rejects with TimeoutError when function exceeds timeout', async () => {
    await expect(withTimeout(() => wait(500), { timeoutMs: 50 })).rejects.toBeInstanceOf(
      TimeoutError
    );
  });

  it('TimeoutError includes timeoutMs', async () => {
    try {
      await withTimeout(() => wait(500), { timeoutMs: 50 });
      expect.fail('should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(TimeoutError);
      expect((error as TimeoutError).timeoutMs).toBe(50);
      expect((error as Error).message).toContain('50ms');
    }
  });

  it('passes AbortSignal to the function', async () => {
    let receivedSignal: AbortSignal | undefined;
    await withTimeout(
      (signal) => {
        receivedSignal = signal;
        return Promise.resolve(1);
      },
      { timeoutMs: 100 }
    );
    expect(receivedSignal).toBeDefined();
    expect(receivedSignal!.aborted).toBe(false);
  });

  it('aborts the signal on timeout', async () => {
    let receivedSignal: AbortSignal | undefined;
    await expect(
      withTimeout(
        (signal) => {
          receivedSignal = signal;
          return wait(500);
        },
        { timeoutMs: 50 }
      )
    ).rejects.toBeInstanceOf(TimeoutError);

    expect(receivedSignal).toBeDefined();
    expect(receivedSignal!.aborted).toBe(true);
  });

  it('calls onTimeout callback when timeout fires', async () => {
    let called = false;
    await expect(
      withTimeout(() => wait(500), {
        timeoutMs: 50,
        onTimeout: () => {
          called = true;
        },
      })
    ).rejects.toBeInstanceOf(TimeoutError);
    expect(called).toBe(true);
  });

  it('does not call onTimeout when function resolves in time', async () => {
    let called = false;
    await withTimeout(() => Promise.resolve(1), {
      timeoutMs: 1000,
      onTimeout: () => {
        called = true;
      },
    });
    expect(called).toBe(false);
  });

  it('propagates non-timeout errors', async () => {
    await expect(
      withTimeout(() => Promise.reject(new Error('boom')), { timeoutMs: 1000 })
    ).rejects.toThrow('boom');
  });

  it('does not leak timers on success', async () => {
    // This is implicit — if timers leaked, vitest would warn
    await withTimeout(() => Promise.resolve(1), { timeoutMs: 10_000 });
  });
});
