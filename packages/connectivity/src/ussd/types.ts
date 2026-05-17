/**
 * USSD request as received from a mobile network gateway.
 *
 * Gateways typically send this as URL-encoded POST data
 * or JSON payload on each user interaction.
 */
export interface UssdRequest {
  /** Gateway-assigned session identifier. */
  sessionId: string;
  /** MSISDN of the subscriber (E.164 format preferred). */
  phoneNumber: string;
  /** The dialed service code, e.g. `*384*123#`. */
  serviceCode: string;
  /** Text entered by the user since the last prompt (empty string on first hit). */
  text: string;
  /** Optional mobile network operator code. */
  networkCode?: string;
}

/**
 * USSD response to be returned to the gateway.
 *
 * The gateway renders `text` on the handset.
 * When `sessionActive` is `false` the gateway terminates the session.
 */
export interface UssdResponse {
  /** Body text shown to the user. Keep under 160 chars for feature-phone compatibility. */
  text: string;
  /** `true` to keep the session open and wait for further input. */
  sessionActive: boolean;
}

/** Lifecycle states of a USSD session. */
export type UssdSessionState =
  | 'init'
  | 'menu'
  | 'input'
  | 'confirm'
  | 'complete'
  | 'error'
  | 'timeout';

/** Persisted data for an active USSD session. */
export interface UssdSessionData {
  sessionId: string;
  phoneNumber: string;
  state: UssdSessionState;
  /** Key-value store accumulated during the session. */
  data: Record<string, string>;
  /** Identifier of the current menu/step, if any. */
  currentMenu?: string;
  /** Unix timestamp (ms) when the session was created. */
  createdAt: number;
  /** Unix timestamp (ms) of the most recent interaction. */
  lastActivityAt: number;
}

/** Options for the USSD session manager. */
export interface UssdSessionOptions {
  /** Session time-to-live in milliseconds. Default: 300000 (5 min). */
  ttlMs?: number;
}

/** Parsed result of a raw USSD text input. */
export interface UssdParsedInput {
  /** The service code extracted from the dial string. */
  serviceCode: string;
  /** User-supplied payload after the service code. */
  input: string;
}
