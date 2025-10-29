/**
 * FHE Type Definitions
 * Core types for FHE operations
 */

export type FHEType = 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address';

export type FHEOperation = 'add' | 'subtract' | 'multiply' | 'divide' | 'compare' | 'max' | 'min';

export interface FHEConfig {
  chainId: number;
  rpcUrl?: string;
  gatewayUrl?: string;
  aclAddress?: string;
  enableCache?: boolean;
  privateKey?: string;
}

export interface EncryptedData {
  value: Uint8Array;
  type: FHEType;
  size: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface EncryptionOptions {
  type: FHEType;
  proof?: boolean;
  cache?: boolean;
}

export interface DecryptionOptions {
  contractAddress: string;
  type: FHEType;
  useGateway?: boolean;
}

export interface ComputationOptions {
  operation: FHEOperation;
  operands: EncryptedData[];
  contractAddress?: string;
  gasLimit?: number;
}

export interface FHEState {
  isInitialized: boolean;
  isLoading: boolean;
  error: Error | null;
  chainId?: number;
  gatewayUrl?: string;
}

export interface FHETransaction {
  hash: string;
  from: string;
  to: string;
  data: EncryptedData;
  timestamp: Date;
  status: 'pending' | 'confirmed' | 'failed';
  gasUsed?: number;
}

export interface FHEGatewayRequest {
  id: string;
  contractAddress: string;
  encryptedValue: Uint8Array;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestTime: Date;
  completionTime?: Date;
  result?: any;
  error?: string;
}

export interface FHEKeyPair {
  publicKey: string;
  privateKey: string;
  keyId: string;
  algorithm: string;
  createdAt: Date;
}

export interface FHESecurityContext {
  userId: string;
  permissions: string[];
  keyId: string;
  sessionId: string;
  expiresAt: Date;
}
