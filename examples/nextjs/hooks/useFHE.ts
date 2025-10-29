'use client';

import { useState, useEffect } from 'react';
import { createFhevmClient } from '@zama/fhevm-sdk';

export function useFHE() {
  const [client, setClient] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const initializeFHE = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const fhevmClient = await createFhevmClient({
          chainId: 11155111,
          gatewayUrl: 'https://gateway.zama.ai',
          enableCache: true,
        });

        if (mounted) {
          setClient(fhevmClient);
          setIsReady(true);
        }
      } catch (err: any) {
        console.error('FHE initialization error:', err);
        if (mounted) {
          setError(err);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeFHE();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    client,
    isReady,
    isLoading,
    error,
  };
}
