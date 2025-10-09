/**
 * React Hooks for FHEVM SDK
 * wagmi-inspired API for React applications
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { FhevmClient, createFhevmClient } from '../core/client';
import type {
  FhevmProviderProps,
  UseFhevmResult,
  UseEncryptResult,
  UseDecryptResult,
  UseContractResult,
  ContractConfig,
} from '../types';

/**
 * FHEVM Context
 */
const FhevmContext = createContext<{
  client: FhevmClient | null;
  isReady: boolean;
  isLoading: boolean;
  error?: Error;
  chainId: number;
} | null>(null);

/**
 * FHEVM Provider Component
 * Wrap your app with this to enable FHEVM hooks
 */
export function FhevmProvider({
  children,
  chainId,
  rpcUrl,
  gatewayUrl,
  aclAddress,
  enableCache = true,
}: FhevmProviderProps) {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        setIsLoading(true);
        const fhevmClient = await createFhevmClient({
          chainId,
          rpcUrl,
          gatewayUrl,
          aclAddress,
          enableCache,
        });

        if (mounted) {
          setClient(fhevmClient);
          setIsReady(true);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
          setIsLoading(false);
        }
      }
    }

    init();

    return () => {
      mounted = false;
    };
  }, [chainId, rpcUrl, gatewayUrl, aclAddress, enableCache]);

  return (
    <FhevmContext.Provider value={{ client, isReady, isLoading, error, chainId }}>
      {children}
    </FhevmContext.Provider>
  );
}

/**
 * useFhevm Hook
 * Access FHEVM client and status
 */
export function useFhevm(): UseFhevmResult {
  const context = useContext(FhevmContext);

  if (!context) {
    throw new Error('useFhevm must be used within FhevmProvider');
  }

  return {
    client: context.client,
    isReady: context.isReady,
    isLoading: context.isLoading,
    error: context.error,
    chainId: context.chainId,
  };
}

/**
 * useEncrypt Hook
 * Encryption utilities
 */
export function useEncrypt(): UseEncryptResult {
  const { client, isReady } = useFhevm();
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<Error>();

  const encrypt8 = useCallback(
    async (value: number): Promise<Uint8Array> => {
      if (!client || !isReady) {
        throw new Error('FHEVM client not ready');
      }

      try {
        setIsEncrypting(true);
        setError(undefined);
        const encrypted = await client.encryptUint8(value);
        return encrypted;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client, isReady]
  );

  const encrypt16 = useCallback(
    async (value: number): Promise<Uint8Array> => {
      if (!client || !isReady) {
        throw new Error('FHEVM client not ready');
      }

      try {
        setIsEncrypting(true);
        setError(undefined);
        return await client.encryptUint16(value);
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client, isReady]
  );

  const encrypt32 = useCallback(
    async (value: number): Promise<Uint8Array> => {
      if (!client || !isReady) {
        throw new Error('FHEVM client not ready');
      }

      try {
        setIsEncrypting(true);
        setError(undefined);
        return await client.encryptUint32(value);
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client, isReady]
  );

  const encrypt64 = useCallback(
    async (value: bigint): Promise<Uint8Array> => {
      if (!client || !isReady) {
        throw new Error('FHEVM client not ready');
      }

      try {
        setIsEncrypting(true);
        setError(undefined);
        return await client.encryptUint64(value);
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client, isReady]
  );

  const encryptBool = useCallback(
    async (value: boolean): Promise<Uint8Array> => {
      if (!client || !isReady) {
        throw new Error('FHEVM client not ready');
      }

      try {
        setIsEncrypting(true);
        setError(undefined);
        return await client.encryptBool(value);
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client, isReady]
  );

  const encryptAddress = useCallback(
    async (address: string): Promise<Uint8Array> => {
      if (!client || !isReady) {
        throw new Error('FHEVM client not ready');
      }

      try {
        setIsEncrypting(true);
        setError(undefined);
        return await client.encryptAddress(address);
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client, isReady]
  );

  return {
    encrypt8,
    encrypt16,
    encrypt32,
    encrypt64,
    encryptBool,
    encryptAddress,
    isEncrypting,
    error,
  };
}

/**
 * useDecrypt Hook
 * Decryption utilities
 */
export function useDecrypt(): UseDecryptResult {
  const { client, isReady } = useFhevm();
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState<Error>();

  const decrypt8 = useCallback(
    async (contractAddress: string, encrypted: Uint8Array): Promise<number> => {
      if (!client || !isReady) {
        throw new Error('FHEVM client not ready');
      }

      try {
        setIsDecrypting(true);
        setError(undefined);
        return await client.decryptUint8(contractAddress, encrypted);
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsDecrypting(false);
      }
    },
    [client, isReady]
  );

  const decrypt32 = useCallback(
    async (contractAddress: string, encrypted: Uint8Array): Promise<number> => {
      if (!client || !isReady) {
        throw new Error('FHEVM client not ready');
      }

      try {
        setIsDecrypting(true);
        setError(undefined);
        return await client.decryptUint32(contractAddress, encrypted);
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsDecrypting(false);
      }
    },
    [client, isReady]
  );

  const decrypt64 = useCallback(
    async (contractAddress: string, encrypted: Uint8Array): Promise<bigint> => {
      if (!client || !isReady) {
        throw new Error('FHEVM client not ready');
      }

      try {
        setIsDecrypting(true);
        setError(undefined);
        return await client.decryptUint64(contractAddress, encrypted);
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsDecrypting(false);
      }
    },
    [client, isReady]
  );

  const decryptBool = useCallback(
    async (contractAddress: string, encrypted: Uint8Array): Promise<boolean> => {
      if (!client || !isReady) {
        throw new Error('FHEVM client not ready');
      }

      try {
        setIsDecrypting(true);
        setError(undefined);
        return await client.decryptBool(contractAddress, encrypted);
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsDecrypting(false);
      }
    },
    [client, isReady]
  );

  const decryptBatch = useCallback(
    async (contractAddress: string, encrypted: Uint8Array[]): Promise<any[]> => {
      if (!client || !isReady) {
        throw new Error('FHEVM client not ready');
      }

      try {
        setIsDecrypting(true);
        setError(undefined);
        return await client.decryptBatch(contractAddress, encrypted);
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsDecrypting(false);
      }
    },
    [client, isReady]
  );

  return {
    decrypt8,
    decrypt32,
    decrypt64,
    decryptBool,
    decryptBatch,
    isDecrypting,
    error,
  };
}

/**
 * useContract Hook
 * Contract interaction utilities
 */
export function useContract(config: ContractConfig): UseContractResult {
  const { client, isReady } = useFhevm();
  const [contract, setContract] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    let mounted = true;

    async function initContract() {
      if (!client || !isReady) {
        return;
      }

      try {
        setIsLoading(true);
        const contractInstance = await client.getContract(config);

        if (mounted) {
          setContract(contractInstance);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
          setIsLoading(false);
        }
      }
    }

    initContract();

    return () => {
      mounted = false;
    };
  }, [client, isReady, config]);

  const call = useCallback(
    async (method: string, args: any[]): Promise<any> => {
      if (!contract) {
        throw new Error('Contract not initialized');
      }

      try {
        setIsLoading(true);
        setError(undefined);
        const result = await contract[method](...args);
        return result;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [contract]
  );

  const read = useCallback(
    async (method: string, args: any[] = []): Promise<any> => {
      if (!contract) {
        throw new Error('Contract not initialized');
      }

      return await contract[method](...args);
    },
    [contract]
  );

  const write = useCallback(
    async (method: string, args: any[]): Promise<any> => {
      if (!contract) {
        throw new Error('Contract not initialized');
      }

      const tx = await contract[method](...args);
      return await tx.wait();
    },
    [contract]
  );

  return {
    contract,
    call,
    read,
    write,
    isLoading,
    error,
  };
}

// Re-export types
export type {
  FhevmProviderProps,
  UseFhevmResult,
  UseEncryptResult,
  UseDecryptResult,
  UseContractResult,
} from '../types';
