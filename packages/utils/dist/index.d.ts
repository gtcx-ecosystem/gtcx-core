/**
 * Sleep for a given number of milliseconds
 */
export declare function sleep(ms: number): Promise<void>;
/**
 * Generate a unique ID
 */
export declare function generateId(prefix?: string): string;
/**
 * Safely parse JSON with error handling
 */
export declare function safeJsonParse<T>(json: string, fallback: T): T;
/**
 * Check if a value is defined (not null or undefined)
 */
export declare function isDefined<T>(value: T | null | undefined): value is T;
/**
 * Omit keys from an object
 */
export declare function omit<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>;
/**
 * Pick keys from an object
 */
export declare function pick<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>;
/**
 * Deep clone an object
 */
export declare function deepClone<T>(obj: T): T;
/**
 * Debounce a function
 */
export declare function debounce<T extends (...args: unknown[]) => unknown>(fn: T, delay: number): (...args: Parameters<T>) => void;
/**
 * Throttle a function
 */
export declare function throttle<T extends (...args: unknown[]) => unknown>(fn: T, limit: number): (...args: Parameters<T>) => void;
/**
 * Retry a function with exponential backoff
 */
export declare function retry<T>(fn: () => Promise<T>, options?: {
    maxAttempts?: number;
    initialDelay?: number;
    maxDelay?: number;
    backoffMultiplier?: number;
}): Promise<T>;
//# sourceMappingURL=index.d.ts.map