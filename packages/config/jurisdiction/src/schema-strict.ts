import { z } from 'zod';

/** Object schema that rejects unknown keys (DTF-5.5.1 jurisdiction pack CI). */
export function strictObject<T extends z.ZodRawShape>(shape: T) {
  return z.object(shape).strict();
}
