/**
 * TypeScript Type Definitions for FHE Operations
 */

export type FHEDataType = 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address';

export interface EncryptedValue {
  data: Uint8Array;
  type: FHEDataType;
  timestamp: Date;
}

export interface EncryptionResult {
  encrypted: Uint8Array;
  type: FHEDataType;
  size: number;
  encryptionTime: number;
}

export interface DecryptionResult {
  decrypted: any;
  type: FHEDataType;
  decryptionTime: number;
}

export interface ComputationRequest {
  operation: 'add' | 'multiply' | 'compare' | 'max' | 'min';
  operands: EncryptedValue[];
  contractAddress?: string;
}

export interface ComputationResult {
  result: EncryptedValue;
  operation: string;
  computationTime: number;
}

export interface FHEClientState {
  isInitialized: boolean;
  isLoading: boolean;
  error: Error | null;
  chainId: number;
}

export interface FHEOperation {
  id: string;
  type: 'encrypt' | 'decrypt' | 'compute';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  error?: string;
}
