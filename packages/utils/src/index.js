"use strict";
// ============================================================================
// @gtcx/utils - Common Utilities
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = sleep;
exports.generateId = generateId;
exports.safeJsonParse = safeJsonParse;
exports.isDefined = isDefined;
exports.omit = omit;
exports.pick = pick;
exports.deepClone = deepClone;
exports.debounce = debounce;
exports.throttle = throttle;
exports.retry = retry;
/**
 * Sleep for a given number of milliseconds
 */
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 * Generate a unique ID
 */
function generateId(prefix = '') {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return prefix ? `${prefix}_${timestamp}${random}` : `${timestamp}${random}`;
}
/**
 * Safely parse JSON with error handling
 */
function safeJsonParse(json, fallback) {
    try {
        return JSON.parse(json);
    }
    catch {
        return fallback;
    }
}
/**
 * Check if a value is defined (not null or undefined)
 */
function isDefined(value) {
    return value !== null && value !== undefined;
}
/**
 * Omit keys from an object
 */
function omit(obj, keys) {
    const result = { ...obj };
    for (const key of keys) {
        delete result[key];
    }
    return result;
}
/**
 * Pick keys from an object
 */
function pick(obj, keys) {
    const result = {};
    for (const key of keys) {
        if (key in obj) {
            result[key] = obj[key];
        }
    }
    return result;
}
/**
 * Deep clone an object
 */
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
/**
 * Debounce a function
 */
function debounce(fn, delay) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}
/**
 * Throttle a function
 */
function throttle(fn, limit) {
    let inThrottle = false;
    return (...args) => {
        if (!inThrottle) {
            fn(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}
/**
 * Retry a function with exponential backoff
 */
async function retry(fn, options = {}) {
    const { maxAttempts = 3, initialDelay = 1000, maxDelay = 30000, backoffMultiplier = 2, } = options;
    let lastError;
    let delay = initialDelay;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            if (attempt === maxAttempts)
                break;
            await sleep(delay);
            delay = Math.min(delay * backoffMultiplier, maxDelay);
        }
    }
    throw lastError;
}
//# sourceMappingURL=index.js.map