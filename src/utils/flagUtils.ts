import { xorDecode, xorEncode } from './obfuscate';

// Store flags encoded to discourage trivial copy-paste from devtools
const encodedFlags = {
  classifier: xorEncode('FLAG{classifier}'),
  labels: xorEncode('FLAG{labels}'),
  accuracy80: xorEncode('FLAG{accuracy80}'),
  not_toast: xorEncode('FLAG{not_toast}'),
} as const;

export type FlagKey = keyof typeof encodedFlags;

export function getFlag(key: FlagKey): string {
  return xorDecode(encodedFlags[key]);
}

export function validateCombinedFlags(input: string): boolean {
  const normalized = input.trim();
  const expected = [
    getFlag('classifier'),
    getFlag('labels'),
    getFlag('accuracy80'),
    getFlag('not_toast'),
  ].join('-');
  return normalized === expected;
}
