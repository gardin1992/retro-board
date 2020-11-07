import aes from 'crypto-js/aes';
import { stringify } from 'crypto-js/enc-utf8';

export const ENCRYPTED_PREFIX = '<<ENCRYPTED>>';
export const CHECK_PREFIX = 'check';
export const CANT_DECRYPT = '(encrypted)';

export function encrypt(clear: string | null, key: string | null): string {
  if (!clear) {
    return '';
  }
  if (key) {
    const encrypted = aes
      .encrypt(CHECK_PREFIX + clear.replace(ENCRYPTED_PREFIX, ''), key)
      .toString();
    return ENCRYPTED_PREFIX + encrypted;
  }
  return clear;
}

export function decrypt(encrypted: string | null, key: string | null): string {
  if (!encrypted) {
    return '';
  }
  if (encrypted.startsWith(ENCRYPTED_PREFIX)) {
    if (key) {
      try {
        const bytes = aes.decrypt(encrypted.replace(ENCRYPTED_PREFIX, ''), key);
        var clear = stringify(bytes);

        if (clear.startsWith(CHECK_PREFIX)) {
          return clear.replace(CHECK_PREFIX, '');
        } else {
          return CANT_DECRYPT;
        }
      } catch {
        return CANT_DECRYPT;
      }
    } else {
      return CANT_DECRYPT;
    }
  }

  return encrypted;
}
