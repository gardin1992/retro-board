import { getPortalUrl } from './api';
import { useEffect, useState } from 'react';

export default function usePortalUrl(): string | null {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    async function fetchUrl() {
      console.log('abbout to fetch');
      const url = await getPortalUrl();
      console.log('got url', url);
      setUrl(url);
    }
    fetchUrl();
  }, []);

  return url;
}
