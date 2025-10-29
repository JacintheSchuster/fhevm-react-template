/**
 * Client-side FHE Operations
 * Handles browser-based encryption and decryption
 */

import { createFhevmClient } from '@zama/fhevm-sdk';

export interface FHEClientConfig {
  chainId: number;
  gatewayUrl?: string;
  enableCache?: boolean;
}

export class FHEClient {
  private client: any;
  private isInitialized: boolean = false;

  constructor(private config: FHEClientConfig) {}

  async initialize() {
    if (this.isInitialized) {
      return;
    }

    try {
      this.client = await createFhevmClient({
        chainId: this.config.chainId,
        gatewayUrl: this.config.gatewayUrl || 'https://gateway.zama.ai',
        enableCache: this.config.enableCache ?? true,
      });

      this.isInitialized = true;
    } catch (error) {
      console.error('FHE client initialization failed:', error);
      throw error;
    }
  }

  async encrypt(value: any, type: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address'): Promise<Uint8Array> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    switch (type) {
      case 'uint8':
        return await this.client.encrypt.uint8(parseInt(value));
      case 'uint16':
        return await this.client.encrypt.uint16(parseInt(value));
      case 'uint32':
        return await this.client.encrypt.uint32(parseInt(value));
      case 'uint64':
        return await this.client.encrypt.uint64(BigInt(value));
      case 'bool':
        return await this.client.encrypt.bool(Boolean(value));
      case 'address':
        return await this.client.encrypt.address(value);
      default:
        throw new Error(`Unsupported type: ${type}`);
    }
  }

  async decrypt(
    contractAddress: string,
    encryptedValue: Uint8Array,
    type: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool'
  ): Promise<any> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    switch (type) {
      case 'uint8':
        return await this.client.decrypt.uint8(contractAddress, encryptedValue);
      case 'uint16':
        return await this.client.decrypt.uint16(contractAddress, encryptedValue);
      case 'uint32':
        return await this.client.decrypt.uint32(contractAddress, encryptedValue);
      case 'uint64':
        return await this.client.decrypt.uint64(contractAddress, encryptedValue);
      case 'bool':
        return await this.client.decrypt.bool(contractAddress, encryptedValue);
      default:
        throw new Error(`Unsupported type: ${type}`);
    }
  }

  getClient() {
    return this.client;
  }

  isReady(): boolean {
    return this.isInitialized;
  }
}

export const defaultFHEClient = new FHEClient({
  chainId: 11155111,
});
