import { createInstance, FhevmInstance } from 'fhevmjs';
import { ethers } from 'ethers';
import type { FhevmClientConfig, EncryptionResult } from '../types';

/**
 * Universal FHEVM Client
 * Framework-agnostic core for encryption/decryption operations
 */
export class FhevmClient {
  private instance: FhevmInstance | null = null;
  private config: FhevmClientConfig;
  private provider: ethers.Provider | null = null;
  private signer: ethers.Signer | null = null;
  private cache: Map<string, any> = new Map();

  constructor(config: FhevmClientConfig) {
    this.config = {
      enableCache: true,
      ...config,
    };
  }

  /**
   * Initialize the FHEVM instance
   */
  async initialize(): Promise<void> {
    if (this.instance) {
      return; // Already initialized
    }

    try {
      // Setup provider
      if (this.config.rpcUrl) {
        this.provider = new ethers.JsonRpcProvider(this.config.rpcUrl);
      } else if (typeof window !== 'undefined' && (window as any).ethereum) {
        this.provider = new ethers.BrowserProvider((window as any).ethereum);
      }

      // Setup signer if private key provided
      if (this.config.privateKey && this.provider) {
        this.signer = new ethers.Wallet(this.config.privateKey, this.provider);
      }

      // Get public key from ACL contract or provider
      const publicKey = await this.getPublicKey();

      // Create FHEVM instance
      this.instance = await createInstance({
        chainId: this.config.chainId,
        publicKey,
        gatewayUrl: this.config.gatewayUrl,
        aclAddress: this.config.aclAddress,
      });
    } catch (error) {
      throw new Error(`Failed to initialize FHEVM: ${error}`);
    }
  }

  /**
   * Get public key for encryption
   */
  private async getPublicKey(): Promise<string> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    // Try to get from ACL contract if address provided
    if (this.config.aclAddress) {
      try {
        const publicKey = await this.provider.call({
          to: this.config.aclAddress,
          data: '0x...', // getPublicKey() selector
        });
        return publicKey;
      } catch (error) {
        console.warn('Failed to get public key from ACL, using default');
      }
    }

    // Return default public key for testnet
    return '0x...'; // Default public key
  }

  /**
   * Ensure instance is initialized
   */
  private ensureInitialized(): FhevmInstance {
    if (!this.instance) {
      throw new Error('FHEVM not initialized. Call initialize() first');
    }
    return this.instance;
  }

  /**
   * Encrypt uint8 value
   */
  async encryptUint8(value: number): Promise<Uint8Array> {
    const instance = this.ensureInitialized();
    const cacheKey = `uint8:${value}`;

    if (this.config.enableCache && this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const encrypted = instance.encrypt8(value);

    if (this.config.enableCache) {
      this.cache.set(cacheKey, encrypted);
    }

    return encrypted;
  }

  /**
   * Encrypt uint16 value
   */
  async encryptUint16(value: number): Promise<Uint8Array> {
    const instance = this.ensureInitialized();
    return instance.encrypt16(value);
  }

  /**
   * Encrypt uint32 value
   */
  async encryptUint32(value: number): Promise<Uint8Array> {
    const instance = this.ensureInitialized();
    const cacheKey = `uint32:${value}`;

    if (this.config.enableCache && this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const encrypted = instance.encrypt32(value);

    if (this.config.enableCache) {
      this.cache.set(cacheKey, encrypted);
    }

    return encrypted;
  }

  /**
   * Encrypt uint64 value
   */
  async encryptUint64(value: bigint): Promise<Uint8Array> {
    const instance = this.ensureInitialized();
    return instance.encrypt64(value);
  }

  /**
   * Encrypt boolean value
   */
  async encryptBool(value: boolean): Promise<Uint8Array> {
    const instance = this.ensureInitialized();
    return instance.encryptBool(value);
  }

  /**
   * Encrypt address
   */
  async encryptAddress(address: string): Promise<Uint8Array> {
    const instance = this.ensureInitialized();
    return instance.encryptAddress(address);
  }

  /**
   * Encrypt with proof for contract submission
   */
  async encryptWithProof(value: number, type: 'uint8' | 'uint16' | 'uint32' | 'uint64'): Promise<EncryptionResult> {
    const instance = this.ensureInitialized();

    let encrypted: Uint8Array;
    switch (type) {
      case 'uint8':
        encrypted = instance.encrypt8(value);
        break;
      case 'uint16':
        encrypted = instance.encrypt16(value);
        break;
      case 'uint32':
        encrypted = instance.encrypt32(value);
        break;
      case 'uint64':
        encrypted = instance.encrypt64(BigInt(value));
        break;
    }

    // Generate proof (ZKPoK)
    const proof = await instance.generateProof(encrypted);

    return {
      encrypted,
      proof,
    };
  }

  /**
   * Decrypt uint8 value
   */
  async decryptUint8(contractAddress: string, encryptedValue: Uint8Array): Promise<number> {
    const instance = this.ensureInitialized();

    if (!this.signer) {
      throw new Error('Signer required for decryption');
    }

    const decrypted = await instance.decrypt(contractAddress, encryptedValue);
    return Number(decrypted);
  }

  /**
   * Decrypt uint32 value
   */
  async decryptUint32(contractAddress: string, encryptedValue: Uint8Array): Promise<number> {
    const instance = this.ensureInitialized();

    if (!this.signer) {
      throw new Error('Signer required for decryption');
    }

    const decrypted = await instance.decrypt(contractAddress, encryptedValue);
    return Number(decrypted);
  }

  /**
   * Decrypt uint64 value
   */
  async decryptUint64(contractAddress: string, encryptedValue: Uint8Array): Promise<bigint> {
    const instance = this.ensureInitialized();

    if (!this.signer) {
      throw new Error('Signer required for decryption');
    }

    const decrypted = await instance.decrypt(contractAddress, encryptedValue);
    return BigInt(decrypted);
  }

  /**
   * Decrypt boolean value
   */
  async decryptBool(contractAddress: string, encryptedValue: Uint8Array): Promise<boolean> {
    const instance = this.ensureInitialized();

    if (!this.signer) {
      throw new Error('Signer required for decryption');
    }

    const decrypted = await instance.decrypt(contractAddress, encryptedValue);
    return Boolean(decrypted);
  }

  /**
   * Batch decrypt multiple values
   */
  async decryptBatch(contractAddress: string, encryptedValues: Uint8Array[]): Promise<(number | bigint | boolean)[]> {
    return Promise.all(
      encryptedValues.map(value => this.decryptUint32(contractAddress, value))
    );
  }

  /**
   * Get contract instance with FHE support
   */
  async getContract(config: {
    address: string;
    abi: any[];
    signer?: ethers.Signer;
  }): Promise<ethers.Contract> {
    const signer = config.signer || this.signer;

    if (!signer) {
      throw new Error('Signer required for contract interaction');
    }

    return new ethers.Contract(config.address, config.abi, signer);
  }

  /**
   * Clear encryption cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get configuration
   */
  getConfig(): FhevmClientConfig {
    return { ...this.config };
  }

  /**
   * Check if initialized
   */
  isInitialized(): boolean {
    return this.instance !== null;
  }
}

/**
 * Create FHEVM client instance
 */
export async function createFhevmClient(config: FhevmClientConfig): Promise<FhevmClient> {
  const client = new FhevmClient(config);
  await client.initialize();
  return client;
}
