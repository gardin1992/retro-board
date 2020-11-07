import { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import useGlobalState from '../state';

type UseEncryptionKeyValue = [
  value: string | null,
  setValue: (key: string) => void
];

/**
 * Try to get the encryption key locally
 */
export function useEncryptionKey(
  sessionId: string | null = null
): UseEncryptionKeyValue {
  const { hash } = useLocation();
  const { state } = useGlobalState();
  const actualSessionId = sessionId || state.session?.id;
  const localStorageKey = actualSessionId
    ? `session-encryption-key-${actualSessionId}`
    : null;

  const storeKey = useCallback(
    (key: string) => {
      if (localStorageKey) {
        localStorage.setItem(localStorageKey, key);
      }
    },
    [localStorageKey]
  );

  const result = useMemo((): UseEncryptionKeyValue => {
    const key = hash ? hash.slice(1) : null;
    if (key) {
      return [key, storeKey];
    }

    if (localStorageKey) {
      const key = localStorage.getItem(localStorageKey);
      return [key, storeKey];
    }

    return [null, storeKey];
  }, [hash, localStorageKey, storeKey]);
  return result;
}
