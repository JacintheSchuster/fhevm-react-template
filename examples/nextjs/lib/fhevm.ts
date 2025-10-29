/**
 * FHEVM SDK Configuration and Utilities
 *
 * This file demonstrates how to configure and use the FHEVM SDK
 * in a Next.js application with TypeScript.
 */

import { createFhevmClient } from '@zama/fhevm-sdk';

/**
 * Contract ABIs for example contracts
 */
export const COUNTER_ABI = [
  'function increment(bytes calldata encryptedValue) external',
  'function getCounter(address user) external view returns (bytes)',
  'function setEncryptedValue(bytes calldata encryptedValue) external',
  'function getEncryptedValue(address user) external view returns (bytes)',
] as const;

export const VOTING_ABI = [
  'function vote(uint256 proposalId, bytes calldata encryptedVote) external',
  'function getVoteCount(uint256 proposalId) external view returns (bytes)',
  'function hasVoted(address voter, uint256 proposalId) external view returns (bool)',
] as const;

/**
 * Contract addresses on Sepolia testnet
 */
export const CONTRACTS = {
  COUNTER: '0x1234567890123456789012345678901234567890', // Replace with actual address
  VOTING: '0x0987654321098765432109876543210987654321',  // Replace with actual address
} as const;

/**
 * Network configuration
 */
export const NETWORK_CONFIG = {
  chainId: 11155111, // Sepolia
  gatewayUrl: 'https://gateway.zama.ai',
  rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
} as const;

/**
 * Initialize FHEVM client for server-side usage
 * (e.g., in API routes or server components)
 */
export async function initFhevmClient() {
  return createFhevmClient({
    chainId: NETWORK_CONFIG.chainId,
    gatewayUrl: NETWORK_CONFIG.gatewayUrl,
    enableCache: true,
  });
}

/**
 * Utility types for encrypted values
 */
export type EncryptedValue = Uint8Array;

export interface EncryptedData {
  value: EncryptedValue;
  proof?: string;
  timestamp: number;
}

/**
 * Helper function to format encrypted data for display
 */
export function formatEncryptedValue(value: Uint8Array): string {
  if (!value || value.length === 0) return 'N/A';

  const hex = Array.from(value)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return `0x${hex.slice(0, 8)}...${hex.slice(-8)}`;
}

/**
 * Helper function to validate encrypted value format
 */
export function isValidEncryptedValue(value: unknown): value is Uint8Array {
  return value instanceof Uint8Array && value.length > 0;
}

/**
 * Error handling utilities
 */
export class FhevmError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'FhevmError';
  }
}

export function handleFhevmError(error: unknown): FhevmError {
  if (error instanceof FhevmError) {
    return error;
  }

  if (error instanceof Error) {
    return new FhevmError(
      error.message,
      'UNKNOWN_ERROR',
      error
    );
  }

  return new FhevmError(
    'An unknown error occurred',
    'UNKNOWN_ERROR',
    error
  );
}

/**
 * Storage utilities for caching encrypted values
 */
export const encryptedStorage = {
  set: (key: string, value: EncryptedData) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`fhevm:${key}`, JSON.stringify({
      value: Array.from(value.value),
      proof: value.proof,
      timestamp: value.timestamp,
    }));
  },

  get: (key: string): EncryptedData | null => {
    if (typeof window === 'undefined') return null;

    const stored = localStorage.getItem(`fhevm:${key}`);
    if (!stored) return null;

    try {
      const parsed = JSON.parse(stored);
      return {
        value: new Uint8Array(parsed.value),
        proof: parsed.proof,
        timestamp: parsed.timestamp,
      };
    } catch {
      return null;
    }
  },

  remove: (key: string) => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(`fhevm:${key}`);
  },

  clear: () => {
    if (typeof window === 'undefined') return;
    Object.keys(localStorage)
      .filter(key => key.startsWith('fhevm:'))
      .forEach(key => localStorage.removeItem(key));
  },
};
