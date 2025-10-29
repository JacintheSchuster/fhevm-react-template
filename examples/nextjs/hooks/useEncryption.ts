'use client';

import { useState, useCallback } from 'react';
import { useFHE } from './useFHE';

export function useEncryption() {
  const { client, isReady } = useFHE();
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const encrypt = useCallback(async (value: any, type: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address') => {
    if (!isReady || !client) {
      throw new Error('FHE client is not ready');
    }

    setIsEncrypting(true);
    setError(null);

    try {
      let encrypted: Uint8Array;

      switch (type) {
        case 'uint8':
          encrypted = await client.encrypt.uint8(parseInt(value));
          break;
        case 'uint16':
          encrypted = await client.encrypt.uint16(parseInt(value));
          break;
        case 'uint32':
          encrypted = await client.encrypt.uint32(parseInt(value));
          break;
        case 'uint64':
          encrypted = await client.encrypt.uint64(BigInt(value));
          break;
        case 'bool':
          encrypted = await client.encrypt.bool(Boolean(value));
          break;
        case 'address':
          encrypted = await client.encrypt.address(value);
          break;
        default:
          throw new Error('Invalid type');
      }

      return encrypted;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsEncrypting(false);
    }
  }, [client, isReady]);

  const encryptUint8 = useCallback((value: number) => encrypt(value, 'uint8'), [encrypt]);
  const encryptUint16 = useCallback((value: number) => encrypt(value, 'uint16'), [encrypt]);
  const encryptUint32 = useCallback((value: number) => encrypt(value, 'uint32'), [encrypt]);
  const encryptUint64 = useCallback((value: bigint | number) => encrypt(value, 'uint64'), [encrypt]);
  const encryptBool = useCallback((value: boolean) => encrypt(value, 'bool'), [encrypt]);
  const encryptAddress = useCallback((value: string) => encrypt(value, 'address'), [encrypt]);

  return {
    encrypt,
    encryptUint8,
    encryptUint16,
    encryptUint32,
    encryptUint64,
    encryptBool,
    encryptAddress,
    isEncrypting,
    error,
  };
}
