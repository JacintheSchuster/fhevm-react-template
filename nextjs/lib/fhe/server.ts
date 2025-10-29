/**
 * Server-side FHE Operations
 * Handles Node.js-based encryption and decryption for API routes
 */

import { createFhevmClient } from '@zama/fhevm-sdk';

export interface ServerFHEConfig {
  chainId: number;
  rpcUrl?: string;
  gatewayUrl?: string;
  privateKey?: string;
}

export class ServerFHE {
  private static instance: ServerFHE;
  private client: any;
  private config: ServerFHEConfig;

  private constructor(config: ServerFHEConfig) {
    this.config = config;
  }

  static getInstance(config?: ServerFHEConfig): ServerFHE {
    if (!ServerFHE.instance) {
      if (!config) {
        throw new Error('Config required for first initialization');
      }
      ServerFHE.instance = new ServerFHE(config);
    }
    return ServerFHE.instance;
  }

  async initialize() {
    if (this.client) {
      return this.client;
    }

    try {
      this.client = await createFhevmClient({
        chainId: this.config.chainId,
        rpcUrl: this.config.rpcUrl,
        gatewayUrl: this.config.gatewayUrl || 'https://gateway.zama.ai',
        privateKey: this.config.privateKey,
      });

      return this.client;
    } catch (error) {
      console.error('Server FHE initialization failed:', error);
      throw error;
    }
  }

  async encryptValue(value: any, type: string): Promise<Uint8Array> {
    if (!this.client) {
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
      default:
        throw new Error(`Unsupported type: ${type}`);
    }
  }

  async decryptValue(
    contractAddress: string,
    encryptedValue: Uint8Array,
    type: string
  ): Promise<any> {
    if (!this.client) {
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
}

export const serverFHE = ServerFHE.getInstance({
  chainId: 11155111,
  gatewayUrl: 'https://gateway.zama.ai',
});
