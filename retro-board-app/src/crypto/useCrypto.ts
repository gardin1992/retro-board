import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { decrypt, encrypt } from './crypto';

type UseCryptoHook = {
  encrypt: (clear: string | null) => string;
  decrypt: (encrypted: string | null) => string;
};

export default function useCrypto(): UseCryptoHook {
  const { hash } = useLocation();
  const key = hash ? hash.slice(1) : null;

  const encryptCallback = useCallback(
    (clear: string | null) => {
      return encrypt(clear, key);
    },
    [key]
  );

  const decryptCallback = useCallback(
    (encrypted: string | null) => {
      return decrypt(encrypted, key);
    },
    [key]
  );

  return { encrypt: encryptCallback, decrypt: decryptCallback };
}
