import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import aes from 'crypto-js/aes';
import { stringify } from 'crypto-js/enc-utf8';

type UseCryptoHook = {
  encrypt: (clear: string | null) => string;
  decrypt: (encrypted: string | null) => string;
};

export default function useCrypto(): UseCryptoHook {
  const { hash } = useLocation();
  const key = hash ? hash.slice(1) : null;

  const encrypt = useCallback(
    (clear: string | null) => {
      if (!clear) {
        return '';
      }
      if (key) {
        const encrypted = aes.encrypt(clear, key).toString();
        console.log('-- Encrypt --');
        console.log('Key: ', key);
        console.log('Clear: ', clear);
        console.log('Encrypted: ', encrypted);
        return encrypted;
      }
      return clear;
    },
    [key]
  );

  const decrypt = useCallback(
    (encrypted: string | null) => {
      if (!encrypted) {
        return '';
      }
      if (key) {
        const bytes = aes.decrypt(encrypted, key);
        var clear = stringify(bytes);
        console.log('-- Decrypt --');
        console.log('Key: ', key);
        console.log('Clear: ', clear);
        console.log('Encrypted: ', encrypted);
        return clear;
      }
      return encrypted;
    },
    [key]
  );

  return { encrypt, decrypt };
}
