/**
 * Universal FHEVM SDK
 * Framework-agnostic SDK for building confidential frontends
 *
 * @example
 * ```typescript
 * import { createFhevmClient, encrypt, decrypt } from '@zama/fhevm-sdk';
 *
 * // Initialize
 * const fhevm = await createFhevmClient({ chainId: 11155111 });
 *
 * // Encrypt
 * const encrypted = await encrypt.uint32(1000);
 *
 * // Decrypt
 * const value = await decrypt.uint32(contractAddress, encrypted);
 * ```
 */

// Core exports
export { FhevmClient, createFhevmClient } from './core/client';

// Type exports
export type {
  FhevmClientConfig,
  EncryptionResult,
  EncryptedType,
  DecryptionRequest,
  DecryptionStatus,
  ContractConfig,
  HookState,
} from './types';

/**
 * Encryption utilities
 * Framework-agnostic encryption functions
 */
export const encrypt = {
  /**
   * Encrypt uint8 value
   * @param value - Value to encrypt (0-255)
   */
  uint8: async (value: number, client?: any): Promise<Uint8Array> => {
    if (!client) {
      throw new Error('Client required. Use createFhevmClient() first.');
    }
    return client.encryptUint8(value);
  },

  /**
   * Encrypt uint16 value
   * @param value - Value to encrypt (0-65535)
   */
  uint16: async (value: number, client?: any): Promise<Uint8Array> => {
    if (!client) {
      throw new Error('Client required. Use createFhevmClient() first.');
    }
    return client.encryptUint16(value);
  },

  /**
   * Encrypt uint32 value
   * @param value - Value to encrypt
   */
  uint32: async (value: number, client?: any): Promise<Uint8Array> => {
    if (!client) {
      throw new Error('Client required. Use createFhevmClient() first.');
    }
    return client.encryptUint32(value);
  },

  /**
   * Encrypt uint64 value
   * @param value - Value to encrypt
   */
  uint64: async (value: bigint, client?: any): Promise<Uint8Array> => {
    if (!client) {
      throw new Error('Client required. Use createFhevmClient() first.');
    }
    return client.encryptUint64(value);
  },

  /**
   * Encrypt boolean value
   * @param value - Value to encrypt
   */
  bool: async (value: boolean, client?: any): Promise<Uint8Array> => {
    if (!client) {
      throw new Error('Client required. Use createFhevmClient() first.');
    }
    return client.encryptBool(value);
  },

  /**
   * Encrypt address
   * @param address - Address to encrypt
   */
  address: async (address: string, client?: any): Promise<Uint8Array> => {
    if (!client) {
      throw new Error('Client required. Use createFhevmClient() first.');
    }
    return client.encryptAddress(address);
  },
};

/**
 * Decryption utilities
 * Framework-agnostic decryption functions
 */
export const decrypt = {
  /**
   * Decrypt uint8 value
   * @param contractAddress - Contract address
   * @param encrypted - Encrypted value
   */
  uint8: async (contractAddress: string, encrypted: Uint8Array, client?: any): Promise<number> => {
    if (!client) {
      throw new Error('Client required. Use createFhevmClient() first.');
    }
    return client.decryptUint8(contractAddress, encrypted);
  },

  /**
   * Decrypt uint32 value
   * @param contractAddress - Contract address
   * @param encrypted - Encrypted value
   */
  uint32: async (contractAddress: string, encrypted: Uint8Array, client?: any): Promise<number> => {
    if (!client) {
      throw new Error('Client required. Use createFhevmClient() first.');
    }
    return client.decryptUint32(contractAddress, encrypted);
  },

  /**
   * Decrypt uint64 value
   * @param contractAddress - Contract address
   * @param encrypted - Encrypted value
   */
  uint64: async (contractAddress: string, encrypted: Uint8Array, client?: any): Promise<bigint> => {
    if (!client) {
      throw new Error('Client required. Use createFhevmClient() first.');
    }
    return client.decryptUint64(contractAddress, encrypted);
  },

  /**
   * Decrypt boolean value
   * @param contractAddress - Contract address
   * @param encrypted - Encrypted value
   */
  bool: async (contractAddress: string, encrypted: Uint8Array, client?: any): Promise<boolean> => {
    if (!client) {
      throw new Error('Client required. Use createFhevmClient() first.');
    }
    return client.decryptBool(contractAddress, encrypted);
  },

  /**
   * Batch decrypt multiple values
   * @param contractAddress - Contract address
   * @param encrypted - Array of encrypted values
   */
  batch: async (contractAddress: string, encrypted: Uint8Array[], client?: any): Promise<any[]> => {
    if (!client) {
      throw new Error('Client required. Use createFhevmClient() first.');
    }
    return client.decryptBatch(contractAddress, encrypted);
  },
};

/**
 * Contract utilities
 * Framework-agnostic contract interaction
 */
export const contract = {
  /**
   * Get contract instance
   * @param config - Contract configuration
   */
  get: async (config: any, client?: any): Promise<any> => {
    if (!client) {
      throw new Error('Client required. Use createFhevmClient() first.');
    }
    return client.getContract(config);
  },
};

/**
 * Gateway utilities
 * Framework-agnostic gateway integration
 */
export const gateway = {
  /**
   * Request decryption via gateway
   * @param contractAddress - Contract address
   * @param encrypted - Encrypted value
   */
  requestDecryption: async (contractAddress: string, encrypted: Uint8Array, client?: any): Promise<string> => {
    // Implementation would use gateway SDK
    throw new Error('Gateway integration coming soon');
  },

  /**
   * Wait for decryption result
   * @param requestId - Request ID from gateway
   */
  waitForDecryption: async (requestId: string, client?: any): Promise<any> => {
    // Implementation would poll gateway for result
    throw new Error('Gateway integration coming soon');
  },
};
