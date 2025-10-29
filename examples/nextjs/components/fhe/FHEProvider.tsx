'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createFhevmClient } from '@zama/fhevm-sdk';

interface FHEContextType {
  client: any;
  isInitialized: boolean;
  isLoading: boolean;
  error: Error | null;
  reinitialize: () => Promise<void>;
}

const FHEContext = createContext<FHEContextType | undefined>(undefined);

export function FHEProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const initializeClient = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const fhevmClient = await createFhevmClient({
        chainId: 11155111,
        gatewayUrl: 'https://gateway.zama.ai',
        enableCache: true,
      });

      setClient(fhevmClient);
      setIsInitialized(true);
    } catch (err: any) {
      console.error('FHE initialization error:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeClient();
  }, []);

  const reinitialize = async () => {
    await initializeClient();
  };

  return (
    <FHEContext.Provider
      value={{
        client,
        isInitialized,
        isLoading,
        error,
        reinitialize,
      }}
    >
      {children}
    </FHEContext.Provider>
  );
}

export function useFHEContext() {
  const context = useContext(FHEContext);
  if (context === undefined) {
    throw new Error('useFHEContext must be used within FHEProvider');
  }
  return context;
}
