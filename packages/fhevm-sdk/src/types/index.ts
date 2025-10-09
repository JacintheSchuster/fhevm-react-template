/**
 * FHEVM SDK Type Definitions
 */

/**
 * Client configuration
 */
export interface FhevmClientConfig {
  /** Chain ID (e.g., 11155111 for Sepolia) */
  chainId: number;

  /** RPC URL (optional, will use window.ethereum if not provided) */
  rpcUrl?: string;

  /** Private key for server-side usage (optional) */
  privateKey?: string;

  /** Gateway URL for decryption (optional) */
  gatewayUrl?: string;

  /** ACL contract address (optional) */
  aclAddress?: string;

  /** Enable encryption caching (default: true) */
  enableCache?: boolean;
}

/**
 * Encryption result with proof
 */
export interface EncryptionResult {
  /** Encrypted value */
  encrypted: Uint8Array;

  /** Zero-knowledge proof for contract verification */
  proof: Uint8Array;
}

/**
 * Supported encrypted types
 */
export type EncryptedType = 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address';

/**
 * Decryption request
 */
export interface DecryptionRequest {
  /** Contract address */
  contractAddress: string;

  /** Encrypted value */
  encryptedValue: Uint8Array;

  /** Type of encrypted value */
  type: EncryptedType;
}

/**
 * Gateway decryption status
 */
export interface DecryptionStatus {
  /** Request ID */
  requestId: string;

  /** Status */
  status: 'pending' | 'processing' | 'completed' | 'failed';

  /** Decrypted value (if completed) */
  value?: number | bigint | boolean | string;

  /** Error message (if failed) */
  error?: string;
}

/**
 * Contract configuration
 */
export interface ContractConfig {
  /** Contract address */
  address: string;

  /** Contract ABI */
  abi: any[];

  /** Signer (optional) */
  signer?: any;
}

/**
 * Hook state
 */
export interface HookState<T = any> {
  /** Data */
  data?: T;

  /** Loading state */
  isLoading: boolean;

  /** Error */
  error?: Error;
}

/**
 * FHEVM hook result
 */
export interface UseFhevmResult {
  /** Client instance */
  client: any;

  /** Ready state */
  isReady: boolean;

  /** Loading state */
  isLoading: boolean;

  /** Error */
  error?: Error;

  /** Chain ID */
  chainId: number;
}

/**
 * Encryption hook result
 */
export interface UseEncryptResult {
  /** Encrypt uint8 */
  encrypt8: (value: number) => Promise<Uint8Array>;

  /** Encrypt uint16 */
  encrypt16: (value: number) => Promise<Uint8Array>;

  /** Encrypt uint32 */
  encrypt32: (value: number) => Promise<Uint8Array>;

  /** Encrypt uint64 */
  encrypt64: (value: bigint) => Promise<Uint8Array>;

  /** Encrypt boolean */
  encryptBool: (value: boolean) => Promise<Uint8Array>;

  /** Encrypt address */
  encryptAddress: (address: string) => Promise<Uint8Array>;

  /** Encrypting state */
  isEncrypting: boolean;

  /** Error */
  error?: Error;
}

/**
 * Decryption hook result
 */
export interface UseDecryptResult {
  /** Decrypt uint8 */
  decrypt8: (contractAddress: string, encrypted: Uint8Array) => Promise<number>;

  /** Decrypt uint32 */
  decrypt32: (contractAddress: string, encrypted: Uint8Array) => Promise<number>;

  /** Decrypt uint64 */
  decrypt64: (contractAddress: string, encrypted: Uint8Array) => Promise<bigint>;

  /** Decrypt boolean */
  decryptBool: (contractAddress: string, encrypted: Uint8Array) => Promise<boolean>;

  /** Batch decrypt */
  decryptBatch: (contractAddress: string, encrypted: Uint8Array[]) => Promise<any[]>;

  /** Decrypting state */
  isDecrypting: boolean;

  /** Error */
  error?: Error;
}

/**
 * Contract hook result
 */
export interface UseContractResult {
  /** Contract instance */
  contract?: any;

  /** Call contract function */
  call: (method: string, args: any[]) => Promise<any>;

  /** Read contract state */
  read: (method: string, args: any[]) => Promise<any>;

  /** Write to contract */
  write: (method: string, args: any[]) => Promise<any>;

  /** Loading state */
  isLoading: boolean;

  /** Error */
  error?: Error;
}

/**
 * Gateway hook result
 */
export interface UseGatewayResult {
  /** Request decryption */
  requestDecryption: (contractAddress: string, encrypted: Uint8Array) => Promise<string>;

  /** Wait for decryption */
  waitForDecryption: (requestId: string) => Promise<any>;

  /** Get decryption status */
  getStatus: (requestId: string) => Promise<DecryptionStatus>;

  /** Pending state */
  isPending: boolean;

  /** Error */
  error?: Error;
}

/**
 * Provider props
 */
export interface FhevmProviderProps {
  /** Children */
  children: React.ReactNode;

  /** Chain ID */
  chainId: number;

  /** RPC URL (optional) */
  rpcUrl?: string;

  /** Gateway URL (optional) */
  gatewayUrl?: string;

  /** ACL address (optional) */
  aclAddress?: string;

  /** Enable cache (optional) */
  enableCache?: boolean;
}
