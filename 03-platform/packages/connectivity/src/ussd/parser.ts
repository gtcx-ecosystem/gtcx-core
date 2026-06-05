import type { UssdParsedInput, UssdRequest, UssdResponse } from './types.js';

/** Error thrown when an incoming payload cannot be parsed as a valid USSD request. */
export class UssdParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UssdParseError';
  }
}

/**
 * USSD message parser and formatter.
 *
 * Normalises raw gateway payloads into structured {@link UssdRequest}
 * objects and formats outgoing {@link UssdResponse} payloads.
 */
export class UssdParser {
  /**
   * Parse a raw gateway payload into a structured request.
   *
   * Accepts both camelCase and snake_case field names to maximise
   * compatibility with different gateway implementations.
   *
   * @throws {UssdParseError} when required fields are missing or invalid.
   */
  parse(payload: unknown): UssdRequest {
    if (payload === null || typeof payload !== 'object') {
      throw new UssdParseError('Payload must be an object');
    }

    const record = payload as Record<string, unknown>;

    const sessionId = this.extractString(record, 'sessionId', 'session_id');
    const phoneNumber = this.extractString(record, 'phoneNumber', 'phone_number', 'msisdn');
    const serviceCode = this.extractString(record, 'serviceCode', 'service_code');
    const text = this.extractString(record, 'text', 'input') ?? '';
    const networkCode = this.extractString(record, 'networkCode', 'network_code');

    if (!sessionId) {
      throw new UssdParseError('Missing required field: sessionId');
    }
    if (!phoneNumber) {
      throw new UssdParseError('Missing required field: phoneNumber');
    }
    if (!serviceCode) {
      throw new UssdParseError('Missing required field: serviceCode');
    }

    const req: UssdRequest = { sessionId, phoneNumber, serviceCode, text };
    if (networkCode !== undefined) {
      req.networkCode = networkCode;
    }
    return req;
  }

  /**
   * Format a response for the gateway.
   *
   * Some gateways expect JSON; others expect URL-encoded form data.
   * This helper returns a plain object that the transport layer can
   * serialise as needed.
   */
  formatResponse(text: string, sessionActive: boolean): UssdResponse {
    return { text, sessionActive };
  }

  /**
   * Extract user input from a raw dial string.
   *
   * USSD dial strings follow the pattern `*service-code*input#`.
   * Only the portion after the service code is returned.
   *
   * @example
   * ```ts
   * parser.extractInput('*384*123*1*42#'); // => '1*42'
   * parser.extractInput('*384*123#');      // => ''
   * ```
   */
  extractInput(dialString: string, serviceCode: string): string {
    const prefix = `${serviceCode}`;
    if (!dialString.startsWith('*') || !dialString.endsWith('#')) {
      return dialString;
    }

    // Remove leading * and trailing #
    const body = dialString.slice(1, -1);
    const parts = body.split('*');

    // Reconstruct the service code from parts (handles multi-part codes like 384*123)
    const codeParts = prefix.startsWith('*') ? prefix.slice(1).split('*') : prefix.split('*');

    if (parts.length <= codeParts.length) {
      return '';
    }

    return parts.slice(codeParts.length).join('*');
  }

  /**
   * Parse a full dial string into service code and user input.
   *
   * @example
   * ```ts
   * parser.parseDialString('*384*123*1*42#'); // => { serviceCode: '*384*123#', input: '1*42' }
   * ```
   */
  parseDialString(dialString: string): UssdParsedInput {
    if (!dialString.startsWith('*') || !dialString.endsWith('#')) {
      return { serviceCode: dialString, input: '' };
    }

    const body = dialString.slice(1, -1);
    const parts = body.split('*');

    // Heuristic: service codes are typically 3-5 digits;
    // if there are trailing parts, treat the last ones as input.
    if (parts.length <= 1) {
      return { serviceCode: dialString, input: '' };
    }

    // Use the first part(s) as service code until we detect user input.
    // In practice the service code is known up-front; this parser is
    // a best-effort fallback for unknown codes.
    const serviceCode = `*${parts[0]}#`;
    const input = parts.slice(1).join('*');
    return { serviceCode, input };
  }

  private extractString(record: Record<string, unknown>, ...keys: string[]): string | undefined {
    for (const key of keys) {
      const value = record[key];
      if (typeof value === 'string') {
        return value.trim();
      }
    }
    return undefined;
  }
}
