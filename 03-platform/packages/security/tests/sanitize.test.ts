/**
 * Tests for @gtcx/security - Input Sanitization (sanitize.ts)
 *
 * Covers: sanitizeString, sanitizeObject, createBoundaryValidator,
 * createStrictValidator, sanitizeForSql, sanitizeForUrlPath,
 * sanitizeFilename, sanitizeForLog, SanitizationError, BoundaryValidationError
 */

import { describe, it, expect } from 'vitest';
import { z } from 'zod';

import {
  sanitizeString,
  sanitizeObject,
  createBoundaryValidator,
  createStrictValidator,
  sanitizeForSql,
  sanitizeForUrlPath,
  sanitizeFilename,
  sanitizeForLog,
  SanitizationError,
  BoundaryValidationError,
} from '../src/validation/sanitize';

// =============================================================================
// sanitizeString
// =============================================================================

describe('sanitizeString', () => {
  describe('HTML stripping', () => {
    it('should strip simple HTML tags', () => {
      expect(sanitizeString('<b>bold</b>')).toBe('bold');
      expect(sanitizeString('<i>italic</i>')).toBe('italic');
    });

    it('should strip script tags (XSS)', () => {
      expect(sanitizeString('<script>alert("xss")</script>safe')).toBe('alert("xss")safe');
    });

    it('should strip nested tags', () => {
      expect(sanitizeString('<div><span>text</span></div>')).toBe('text');
    });

    it('should strip event handler attributes', () => {
      expect(sanitizeString('<img onerror="alert(1)" src=x>')).toBe('');
    });

    it('should strip self-closing tags', () => {
      expect(sanitizeString('before<br/>after')).toBe('beforeafter');
      expect(sanitizeString('before<hr />after')).toBe('beforeafter');
    });

    it('should handle SVG-based XSS', () => {
      const svg = '<svg onload="alert(1)"><circle r="10"/></svg>';
      const result = sanitizeString(svg);
      expect(result).not.toContain('<svg');
      expect(result).not.toContain('onload');
    });

    it('should handle HTML entities in tags', () => {
      expect(sanitizeString('<a href="javascript:alert(1)">click</a>')).toBe('click');
    });

    it('should not strip when stripHtml is false', () => {
      const result = sanitizeString('<b>bold</b>', { stripHtml: false });
      expect(result).toBe('<b>bold</b>');
    });
  });

  describe('control character stripping', () => {
    it('should remove null bytes', () => {
      expect(sanitizeString('hello\x00world')).toBe('helloworld');
    });

    it('should remove bell character', () => {
      expect(sanitizeString('hello\x07world')).toBe('helloworld');
    });

    it('should remove backspace and other low-range controls', () => {
      expect(sanitizeString('he\x08llo\x01wor\x02ld')).toBe('helloworld');
    });

    it('should preserve newlines', () => {
      expect(sanitizeString('line1\nline2')).toBe('line1\nline2');
    });

    it('should preserve tabs', () => {
      expect(sanitizeString('col1\tcol2')).toBe('col1\tcol2');
    });

    it('should preserve carriage return', () => {
      // \r is \x0D which is within preserved range (\x09, \x0A, \x0D)
      // Actually the regex is [\x00-\x08\x0B\x0C\x0E-\x1F\x7F]
      // \x0D (carriage return) is NOT in the strip range
      expect(sanitizeString('line1\r\nline2')).toBe('line1\r\nline2');
    });

    it('should remove DEL character', () => {
      expect(sanitizeString('hello\x7Fworld')).toBe('helloworld');
    });

    it('should not strip when stripControlChars is false', () => {
      const result = sanitizeString('a\x00b', { stripControlChars: false });
      expect(result).toBe('a\x00b');
    });
  });

  describe('Unicode normalization', () => {
    it('should normalize NFD to NFC', () => {
      const decomposed = 'e\u0301'; // e + combining accent
      const composed = '\u00e9'; // precomposed e-acute
      expect(sanitizeString(decomposed)).toBe(composed);
    });

    it('should not normalize when disabled', () => {
      const decomposed = 'e\u0301';
      const result = sanitizeString(decomposed, { normalizeUnicode: false });
      expect(result).toBe(decomposed);
    });
  });

  describe('trimming', () => {
    it('should trim whitespace by default', () => {
      expect(sanitizeString('  hello  ')).toBe('hello');
    });

    it('should not trim when disabled', () => {
      expect(sanitizeString('  hello  ', { trimWhitespace: false })).toBe('  hello  ');
    });
  });

  describe('max length', () => {
    it('should truncate strings exceeding maxLength', () => {
      const long = 'a'.repeat(20000);
      const result = sanitizeString(long);
      expect(result.length).toBe(10000); // default maxLength
    });

    it('should respect custom maxLength', () => {
      expect(sanitizeString('abcdefgh', { maxLength: 5 })).toBe('abcde');
    });

    it('should not truncate short strings', () => {
      expect(sanitizeString('short', { maxLength: 100 })).toBe('short');
    });
  });

  describe('allowed pattern', () => {
    it('should filter to allowed characters only', () => {
      const result = sanitizeString('abc123!@#', {
        allowedPattern: /[a-z0-9]/,
      });
      expect(result).toBe('abc123');
    });

    it('should remove all non-matching characters', () => {
      const result = sanitizeString('Hello World!', {
        allowedPattern: /[A-Za-z]/,
      });
      expect(result).toBe('HelloWorld');
    });
  });

  describe('type coercion', () => {
    it('should convert null to empty string', () => {
      expect(sanitizeString(null)).toBe('');
    });

    it('should convert undefined to empty string', () => {
      expect(sanitizeString(undefined)).toBe('');
    });

    it('should convert numbers to string', () => {
      expect(sanitizeString(42)).toBe('42');
    });

    it('should convert boolean to string', () => {
      expect(sanitizeString(true)).toBe('true');
    });

    it('should convert objects to string representation', () => {
      const result = sanitizeString({ key: 'value' });
      expect(result).toBe('[object Object]');
    });
  });

  describe('combined XSS payloads', () => {
    it('should neutralize img onerror payload', () => {
      const result = sanitizeString('<img src=x onerror="alert(document.cookie)">');
      expect(result).not.toContain('<img');
      expect(result).not.toContain('onerror');
    });

    it('should neutralize javascript: URI', () => {
      const result = sanitizeString('<a href="javascript:void(0)">link</a>');
      expect(result).not.toContain('javascript:');
    });

    it('should neutralize data: URI in tags', () => {
      const result = sanitizeString(
        '<object data="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">'
      );
      expect(result).not.toContain('<object');
    });

    it('should neutralize event handlers', () => {
      const payloads = [
        '<div onmouseover="alert(1)">hover</div>',
        '<body onload="alert(1)">',
        '<input onfocus="alert(1)" autofocus>',
      ];
      for (const payload of payloads) {
        const result = sanitizeString(payload);
        expect(result).not.toContain('<');
        expect(result).not.toContain('>');
      }
    });
  });
});

// =============================================================================
// sanitizeObject
// =============================================================================

describe('sanitizeObject', () => {
  describe('primitive handling', () => {
    it('should return null as-is', () => {
      expect(sanitizeObject(null)).toBeNull();
    });

    it('should return undefined as-is', () => {
      expect(sanitizeObject(undefined)).toBeUndefined();
    });

    it('should sanitize string values', () => {
      expect(sanitizeObject('<b>text</b>')).toBe('text');
    });

    it('should pass through numbers', () => {
      expect(sanitizeObject(42)).toBe(42);
    });

    it('should pass through booleans', () => {
      expect(sanitizeObject(true)).toBe(true);
      expect(sanitizeObject(false)).toBe(false);
    });
  });

  describe('object handling', () => {
    it('should sanitize string values in objects', () => {
      const result = sanitizeObject<Record<string, string>>({
        name: '<script>x</script>Alice',
        title: '<b>Admin</b>',
      });
      expect(result['name']).toBe('xAlice');
      expect(result['title']).toBe('Admin');
    });

    it('should handle nested objects', () => {
      const input = {
        level1: {
          level2: {
            value: '<i>deep</i>',
          },
        },
      };
      const result = sanitizeObject<typeof input>(input);
      expect(result.level1.level2.value).toBe('deep');
    });

    it('should preserve number and boolean values in objects', () => {
      const input = { name: 'test', count: 5, active: true };
      const result = sanitizeObject<typeof input>(input);
      expect(result.count).toBe(5);
      expect(result.active).toBe(true);
    });
  });

  describe('array handling', () => {
    it('should sanitize array elements', () => {
      const result = sanitizeObject<string[]>(['<b>a</b>', '<i>b</i>']);
      expect(result).toEqual(['a', 'b']);
    });

    it('should truncate arrays exceeding maxArrayLength', () => {
      const input = Array.from({ length: 20 }, (_, i) => i);
      const result = sanitizeObject<number[]>(input, { maxArrayLength: 5 });
      expect(result).toHaveLength(5);
    });

    it('should handle nested arrays', () => {
      const input = [
        [1, 2],
        [3, 4],
      ];
      const result = sanitizeObject<number[][]>(input);
      expect(result).toEqual([
        [1, 2],
        [3, 4],
      ]);
    });
  });

  describe('depth limit', () => {
    it('should throw SanitizationError at maxDepth', () => {
      const deep = { a: { b: { c: { d: 'value' } } } };
      expect(() => sanitizeObject(deep, { maxDepth: 2 })).toThrow(SanitizationError);
      expect(() => sanitizeObject(deep, { maxDepth: 2 })).toThrow('Maximum depth exceeded');
    });

    it('should not throw when within depth limit', () => {
      const shallow = { a: { b: 'value' } };
      expect(() => sanitizeObject(shallow, { maxDepth: 5 })).not.toThrow();
    });
  });

  describe('key limit', () => {
    it('should throw SanitizationError when exceeding maxKeys', () => {
      const obj: Record<string, number> = {};
      for (let i = 0; i < 10; i++) {
        obj[`key${i}`] = i;
      }
      expect(() => sanitizeObject(obj, { maxKeys: 5 })).toThrow(SanitizationError);
      expect(() => sanitizeObject(obj, { maxKeys: 5 })).toThrow('Maximum keys exceeded');
    });
  });

  describe('prototype pollution protection', () => {
    it('should strip __proto__', () => {
      const malicious = JSON.parse('{"__proto__": {"polluted": true}, "safe": "ok"}');
      const result = sanitizeObject<Record<string, unknown>>(malicious);
      expect(result).not.toHaveProperty('__proto__');
      expect(result['safe']).toBe('ok');
    });

    it('should strip constructor property', () => {
      const malicious = JSON.parse('{"constructor": {"polluted": true}, "safe": "ok"}');
      const result = sanitizeObject<Record<string, unknown>>(malicious);
      expect(result).not.toHaveProperty('constructor');
      expect(result['safe']).toBe('ok');
    });

    it('should strip prototype property', () => {
      const malicious = JSON.parse('{"prototype": {"polluted": true}, "safe": "ok"}');
      const result = sanitizeObject<Record<string, unknown>>(malicious);
      expect(result).not.toHaveProperty('prototype');
    });

    it('should not strip constructor when stripProto is false', () => {
      // Use an object-with-null-prototype so the key is actually enumerable
      const obj = Object.create(null);
      obj.constructor = { polluted: true };
      obj.safe = 'ok';
      const result = sanitizeObject<Record<string, unknown>>(obj, {
        stripProto: false,
      });
      expect(Object.keys(result)).toContain('constructor');
      expect(result['safe']).toBe('ok');
    });
  });

  describe('nullish stripping', () => {
    it('should strip null values when stripNullish is true', () => {
      const result = sanitizeObject<Record<string, unknown>>(
        { a: 'keep', b: null, c: undefined },
        { stripNullish: true }
      );
      expect(result).toHaveProperty('a', 'keep');
      expect(result).not.toHaveProperty('b');
      expect(result).not.toHaveProperty('c');
    });

    it('should keep null values when stripNullish is false', () => {
      const result = sanitizeObject<Record<string, unknown>>(
        { a: 'keep', b: null },
        { stripNullish: false }
      );
      expect(result['b']).toBeNull();
    });

    it('should strip nullish from arrays', () => {
      const result = sanitizeObject<unknown[]>([1, null, 'two', undefined, 3], {
        stripNullish: true,
      });
      expect(result).toEqual([1, 'two', 3]);
    });
  });

  describe('unsupported types', () => {
    it('should throw for functions', () => {
      expect(() => sanitizeObject(() => {})).toThrow(SanitizationError);
      expect(() => sanitizeObject(() => {})).toThrow('Unsupported type');
    });

    it('should throw for symbols', () => {
      expect(() => sanitizeObject(Symbol('test'))).toThrow(SanitizationError);
    });
  });

  describe('string options passthrough', () => {
    it('should apply string sanitization options to nested strings', () => {
      const input = { name: '  <b>Alice</b>  ' };
      const result = sanitizeObject<{ name: string }>(input, {
        stringOptions: { stripHtml: true, trimWhitespace: true },
      });
      expect(result.name).toBe('Alice');
    });
  });
});

// =============================================================================
// createBoundaryValidator
// =============================================================================

describe('createBoundaryValidator', () => {
  it('should return success for valid data', () => {
    const schema = z.object({ name: z.string(), age: z.number() });
    const validate = createBoundaryValidator(schema);
    const result = validate({ name: 'Alice', age: 30 });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ name: 'Alice', age: 30 });
    }
  });

  it('should return error for invalid data', () => {
    const schema = z.object({ name: z.string() });
    const validate = createBoundaryValidator(schema);
    const result = validate({ name: 123 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('VALIDATION_ERROR');
    }
  });

  it('should include path in error', () => {
    const schema = z.object({
      user: z.object({ email: z.string().email() }),
    });
    const validate = createBoundaryValidator(schema);
    const result = validate({ user: { email: 'bad' } });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.path).toEqual(['user', 'email']);
    }
  });

  it('should include details in error', () => {
    const schema = z.object({ n: z.number() });
    const validate = createBoundaryValidator(schema);
    const result = validate({ n: 'not a number' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.details).toBeDefined();
    }
  });

  it('should sanitize before validating when sanitize option is true', () => {
    const schema = z.object({ name: z.string() });
    const validate = createBoundaryValidator(schema, { sanitize: true });
    const result = validate({ name: '<b>Alice</b>' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('Alice');
    }
  });

  it('should propagate sanitization errors', () => {
    const schema = z.object({ data: z.unknown() });
    const validate = createBoundaryValidator(schema, {
      sanitize: true,
      sanitizeOptions: { maxDepth: 1 },
    });
    const deepInput = { data: { nested: { deep: 'value' } } };
    const result = validate(deepInput);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('MAX_DEPTH');
    }
  });

  it('should handle unexpected errors', () => {
    // Create a schema whose parse throws a non-Zod error
    const weirdSchema = {
      parse: () => {
        throw new TypeError('Unexpected');
      },
    } as unknown as z.ZodSchema;
    const validate = createBoundaryValidator(weirdSchema);
    const result = validate({});
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('UNKNOWN_ERROR');
    }
  });
});

// =============================================================================
// createStrictValidator
// =============================================================================

describe('createStrictValidator', () => {
  it('should return data on success', () => {
    const schema = z.object({ name: z.string() });
    const validate = createStrictValidator(schema);
    const data = validate({ name: 'Bob' });
    expect(data.name).toBe('Bob');
  });

  it('should throw BoundaryValidationError on failure', () => {
    const schema = z.object({ name: z.string() });
    const validate = createStrictValidator(schema);
    expect(() => validate({ name: 123 })).toThrow(BoundaryValidationError);
  });

  it('should sanitize before validating when configured', () => {
    const schema = z.object({ name: z.string() });
    const validate = createStrictValidator(schema, { sanitize: true });
    const data = validate({ name: '<script>x</script>Bob' });
    expect(data.name).toBe('xBob');
  });
});

// =============================================================================
// sanitizeForSql
// =============================================================================

describe('sanitizeForSql', () => {
  it('should escape single quotes', () => {
    expect(sanitizeForSql("O'Brien")).toBe("O''Brien");
  });

  it('should escape backslashes', () => {
    expect(sanitizeForSql('path\\to\\file')).toBe('path\\\\to\\\\file');
  });

  it('should remove null bytes', () => {
    expect(sanitizeForSql('hello\x00world')).toBe('helloworld');
  });

  it('should handle SQL injection payloads', () => {
    const payload = "'; DROP TABLE users; --";
    const result = sanitizeForSql(payload);
    expect(result).toBe("''; DROP TABLE users; --");
    // Single quote is escaped, so it would not terminate the SQL string
  });

  it('should handle multiple single quotes', () => {
    expect(sanitizeForSql("it''s a test's")).toBe("it''''s a test''s");
  });

  it('should handle empty string', () => {
    expect(sanitizeForSql('')).toBe('');
  });

  it('should handle UNION-based injection', () => {
    const payload = "' UNION SELECT * FROM passwords --";
    const result = sanitizeForSql(payload);
    expect(result).toContain("''"); // quote is escaped
  });
});

// =============================================================================
// sanitizeForUrlPath
// =============================================================================

describe('sanitizeForUrlPath', () => {
  it('should encode special characters', () => {
    const result = sanitizeForUrlPath('hello world');
    expect(result).not.toContain(' ');
    // Only allowed chars pass through before encoding
  });

  it('should remove HTML from path', () => {
    const result = sanitizeForUrlPath('<script>alert(1)</script>test');
    expect(result).not.toContain('<');
    expect(result).not.toContain('>');
  });

  it('should allow alphanumeric and safe chars', () => {
    const result = sanitizeForUrlPath('valid-path_name.html');
    expect(decodeURIComponent(result)).toBe('valid-path_name.html');
  });

  it('should enforce max length of 200', () => {
    const long = 'a'.repeat(300);
    const result = sanitizeForUrlPath(long);
    expect(decodeURIComponent(result).length).toBeLessThanOrEqual(200);
  });

  it('should handle path traversal attempts', () => {
    const result = sanitizeForUrlPath('../../etc/passwd');
    // Only allowed chars: a-zA-Z0-9, -, _, .
    // The / is filtered out, so the path becomes safe
    expect(decodeURIComponent(result)).toBe('....etcpasswd');
  });
});

// =============================================================================
// sanitizeFilename
// =============================================================================

describe('sanitizeFilename', () => {
  it('should allow safe filenames', () => {
    expect(sanitizeFilename('document.pdf')).toBe('document.pdf');
  });

  it('should remove special characters', () => {
    expect(sanitizeFilename('file name!@#$.txt')).toBe('filename.txt');
  });

  it('should remove leading dots (hidden files)', () => {
    expect(sanitizeFilename('.htaccess')).toBe('htaccess');
    expect(sanitizeFilename('...hidden')).toBe('hidden');
  });

  it('should enforce max length of 255', () => {
    const long = 'a'.repeat(300) + '.txt';
    const result = sanitizeFilename(long);
    expect(result.length).toBeLessThanOrEqual(255);
  });

  it('should handle path traversal in filename', () => {
    expect(sanitizeFilename('../../../etc/passwd')).toBe('etcpasswd');
  });

  it('should remove HTML from filename', () => {
    expect(sanitizeFilename('<script>alert(1)</script>file.txt')).toBe('alert1file.txt');
  });

  it('should handle empty string', () => {
    expect(sanitizeFilename('')).toBe('');
  });
});

// =============================================================================
// sanitizeForLog
// =============================================================================

describe('sanitizeForLog', () => {
  it('should mask long API key-like strings', () => {
    const longKey = 'abcdefghijklmnopqrstuvwxyz1234567890abcd';
    const result = sanitizeForLog(`API key: ${longKey}`);
    expect(result).not.toContain(longKey);
    expect(result).toContain('...');
  });

  it('should not mask short strings', () => {
    const result = sanitizeForLog('short-value');
    expect(result).toBe('short-value');
  });

  it('should mask email addresses', () => {
    const result = sanitizeForLog('User email: alice@example.com');
    expect(result).not.toContain('alice@');
    expect(result).toContain('***@example.com');
  });

  it('should mask phone numbers', () => {
    const result = sanitizeForLog('Phone: +1234567890123');
    expect(result).toContain('***PHONE***');
  });

  it('should handle multiple sensitive values', () => {
    const input =
      'User alice@test.com with key abcdefghijklmnopqrstuvwxyz1234567890abcd called +12345678901';
    const result = sanitizeForLog(input);
    expect(result).not.toContain('alice@');
    expect(result).toContain('***@test.com');
    expect(result).toContain('***PHONE***');
  });

  it('should preserve non-sensitive content', () => {
    const result = sanitizeForLog('Normal log message about trade #123');
    expect(result).toBe('Normal log message about trade #123');
  });

  it('should handle empty string', () => {
    expect(sanitizeForLog('')).toBe('');
  });
});

// =============================================================================
// Error Classes
// =============================================================================

describe('SanitizationError', () => {
  it('should have correct name and code', () => {
    const err = new SanitizationError('Max depth exceeded', 'MAX_DEPTH');
    expect(err.name).toBe('SanitizationError');
    expect(err.code).toBe('MAX_DEPTH');
    expect(err.message).toBe('Max depth exceeded');
    expect(err).toBeInstanceOf(Error);
  });
});

describe('BoundaryValidationError', () => {
  it('should have correct name and validation error', () => {
    const validationError = {
      code: 'VALIDATION_ERROR',
      message: 'Invalid input',
      path: ['field'],
    };
    const err = new BoundaryValidationError(validationError);
    expect(err.name).toBe('BoundaryValidationError');
    expect(err.message).toBe('Invalid input');
    expect(err.validationError).toEqual(validationError);
    expect(err).toBeInstanceOf(Error);
  });
});
