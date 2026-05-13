import type { ConnectivityProfile } from './types.js';

export interface CompressedPayload {
  format: 'gzip' | 'json' | 'none';
  data: string;
  originalSize: number;
}

const LOW_BANDWIDTH_PROFILES: readonly ConnectivityProfile[] = ['edge', 'ussd-only', 'satellite'];

/** Determine whether payload compression should be used for a profile. */
export function shouldCompress(profile: ConnectivityProfile): boolean {
  return LOW_BANDWIDTH_PROFILES.includes(profile);
}

function bytesToBase64(bytes: Uint8Array): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64');
  }
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary);
}

function base64ToBytes(base64: string): Uint8Array {
  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(base64, 'base64'));
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function readAllChunks(reader: ReadableStreamDefaultReader<Uint8Array>): Promise<Uint8Array> {
  const chunks: Uint8Array[] = [];
  let totalLength = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    totalLength += value.length;
  }

  const concatenated = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    concatenated.set(chunk, offset);
    offset += chunk.length;
  }

  return concatenated;
}

/**
 * Compress a payload for low-bandwidth transmission.
 *
 * Uses native CompressionStream when available (gzip). Falls back to
 * JSON + base64 for environments where CompressionStream is missing
 * (e.g. legacy USSD gateways).
 */
export async function compressPayload(data: unknown): Promise<CompressedPayload> {
  const json = JSON.stringify(data);
  const originalSize = json.length;

  if (typeof CompressionStream !== 'undefined') {
    const stream = new CompressionStream('gzip');
    const writer = stream.writable.getWriter();
    writer.write(new TextEncoder().encode(json));
    writer.close();

    const compressed = await readAllChunks(stream.readable.getReader());
    return {
      format: 'gzip',
      data: bytesToBase64(compressed),
      originalSize,
    };
  }

  // Fallback for environments without CompressionStream
  return {
    format: 'json',
    data: bytesToBase64(new TextEncoder().encode(json)),
    originalSize,
  };
}

/**
 * Decompress a payload previously compressed by {@link compressPayload}.
 */
export async function decompressPayload(compressed: CompressedPayload): Promise<unknown> {
  if (compressed.format === 'none') {
    return compressed.data;
  }

  const bytes = base64ToBytes(compressed.data);

  if (compressed.format === 'gzip' && typeof DecompressionStream !== 'undefined') {
    const stream = new DecompressionStream('gzip');
    const writer = stream.writable.getWriter();
    writer.write(bytes);
    writer.close();

    const decompressed = await readAllChunks(stream.readable.getReader());
    const json = new TextDecoder().decode(decompressed);
    return JSON.parse(json);
  }

  // Fallback for json format or missing DecompressionStream
  const json = new TextDecoder().decode(bytes);
  return JSON.parse(json);
}
