import aes from 'crypto-js/aes';
import { stringify } from 'crypto-js/enc-utf8';

export const ENCRYPTED_PREFIX = '<<ENCRYPTED>>';

export function encrypt(clear: string | null, key: string | null): string {
  if (!clear) {
    return '';
  }
  if (key) {
    const encrypted = aes
      .encrypt(clear.replace(ENCRYPTED_PREFIX, ''), key)
      .toString();
    // console.log('-- Encrypt --');
    // console.log('Key: ', key);
    // console.log('Clear: ', clear);
    // console.log('Encrypted: ', encrypted);
    return ENCRYPTED_PREFIX + encrypted;
  }
  return clear;
}

export function decrypt(encrypted: string | null, key: string | null): string {
  if (!encrypted) {
    return '';
  }
  if (key && encrypted.startsWith(ENCRYPTED_PREFIX)) {
    const bytes = aes.decrypt(encrypted.replace(ENCRYPTED_PREFIX, ''), key);
    var clear = stringify(bytes);
    // console.log('-- Decrypt --');
    // console.log('Key: ', key);
    // console.log('Clear: ', clear);
    // console.log('Encrypted: ', encrypted);
    return clear;
  }
  return encrypted;
}
