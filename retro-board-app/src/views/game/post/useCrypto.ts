import { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Post } from 'retro-board-common';
import { getLorem } from './lorem';
import aes from 'crypto-js/aes';
import { stringify } from 'crypto-js/enc-utf8';

type UseCryptoHook = [string, (clear: string) => string];

export default function useCrypto(post: Post, blurred: boolean): UseCryptoHook {
  const { hash } = useLocation();
  const key = hash ? hash.slice(1) : null;

  const encrypt = useCallback(
    (clear: string) => {
      console.log('encrypt', key);
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

  const result = useMemo((): UseCryptoHook => {
    if (blurred) {
      return [generateLoremIpsum(post.content), encrypt];
    }

    if (key) {
      const bytes = aes.decrypt(post.content, key);
      var clear = stringify(bytes);

      console.log('-- Decrypt --');
      console.log('Key: ', key);
      console.log('Clear: ', clear);
      console.log('Encrypted: ', post.content);
      return [clear, encrypt];
    }

    return [post.content, encrypt];
  }, [blurred, encrypt, key, post.content]);
  return result;
}

function generateLoremIpsum(originalText: string) {
  const count = originalText.split(' ').length;
  return getLorem(count);
}
