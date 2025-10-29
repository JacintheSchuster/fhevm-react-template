/**
 * API Type Definitions
 * Types for API requests and responses
 */

import { FHEType, FHEOperation } from './fhe';

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface EncryptionRequest {
  value: any;
  type: FHEType;
  options?: {
    cache?: boolean;
    proof?: boolean;
  };
}

export interface EncryptionResponse {
  success: boolean;
  encrypted: string;
  type: FHEType;
  originalValue: string;
  size: number;
  encryptionTime: number;
  timestamp: string;
}

export interface DecryptionRequest {
  encryptedValue: string;
  type: FHEType;
  contractAddress: string;
  options?: {
    useGateway?: boolean;
  };
}

export interface DecryptionResponse {
  success: boolean;
  decrypted: string;
  type: FHEType;
  decryptionTime: number;
  contractAddress: string;
  timestamp: string;
}

export interface ComputationRequest {
  operation: FHEOperation;
  operands: number[];
  contractAddress?: string;
  contractAbi?: any[];
}

export interface ComputationResponse {
  success: boolean;
  result: {
    operation: string;
    description: string;
    operands: number[];
    note: string;
  };
  encryptedOperandsCount: number;
  computationTime: number;
  timestamp: string;
  message: string;
}

export interface KeyManagementRequest {
  operation: 'generate' | 'rotate' | 'revoke';
  keyId?: string;
}

export interface KeyManagementResponse {
  success: boolean;
  message: string;
  publicKey?: string;
  keyId?: string;
  newKeyId?: string;
  timestamp: string;
}

export interface FHEStatusResponse {
  message: string;
  endpoints: string[];
  version: string;
  status?: 'ready' | 'initializing' | 'error';
}

export interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: any;
  timestamp: string;
}

export type FHEAPIResponse =
  | EncryptionResponse
  | DecryptionResponse
  | ComputationResponse
  | KeyManagementResponse
  | FHEStatusResponse
  | ErrorResponse;
