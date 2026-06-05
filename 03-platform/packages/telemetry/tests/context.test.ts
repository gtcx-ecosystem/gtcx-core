import { describe, it, expect } from 'vitest';

import { runWithSpanContext, getCurrentSpanContext } from '../src/context';
import { createSpanContext } from '../src/tracing';

describe('AsyncLocalStorage trace context', () => {
  it('propagates context through sync callbacks', () => {
    const ctx = createSpanContext();
    runWithSpanContext(ctx, () => {
      expect(getCurrentSpanContext()).toBe(ctx);
    });
  });

  it('propagates context through async callbacks', async () => {
    const ctx = createSpanContext();
    await runWithSpanContext(ctx, async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(getCurrentSpanContext()).toBe(ctx);
    });
  });

  it('returns undefined outside context', () => {
    expect(getCurrentSpanContext()).toBeUndefined();
  });

  it('isolates nested contexts', () => {
    const parent = createSpanContext();
    const child = createSpanContext(parent);

    runWithSpanContext(parent, () => {
      expect(getCurrentSpanContext()).toBe(parent);
      runWithSpanContext(child, () => {
        expect(getCurrentSpanContext()).toBe(child);
      });
      expect(getCurrentSpanContext()).toBe(parent);
    });
  });
});
