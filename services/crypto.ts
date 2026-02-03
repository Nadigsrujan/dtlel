
/**
 * Generates a SHA-256 hash for a given text using Browser's native Crypto API.
 * Ensures data integrity and supports Zero-Knowledge verification.
 */
export async function generateHash(text: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}
