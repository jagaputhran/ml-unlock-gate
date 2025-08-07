export const SALT = 'quantum-7x';

// Simple XOR + base64 helpers for lightweight obfuscation (not true security)
export function xorEncode(input: string, salt: string = SALT): string {
  const bytes = Array.from(input).map((ch, i) => ch.charCodeAt(0) ^ salt.charCodeAt(i % salt.length));
  const bin = String.fromCharCode(...bytes);
  return btoa(bin);
}

export function xorDecode(encoded: string, salt: string = SALT): string {
  const bin = atob(encoded);
  const chars = Array.from(bin).map((ch, i) => String.fromCharCode(ch.charCodeAt(0) ^ salt.charCodeAt(i % salt.length)));
  return chars.join('');
}
