/**
 * Key Management Utilities
 * Handles cryptographic key generation and management
 */

export interface KeyPair {
  publicKey: string;
  privateKey: string;
  keyId: string;
  createdAt: Date;
}

export interface KeyMetadata {
  keyId: string;
  algorithm: string;
  createdAt: Date;
  lastRotated?: Date;
  status: 'active' | 'rotated' | 'revoked';
}

export class KeyManager {
  private keys: Map<string, KeyPair> = new Map();
  private metadata: Map<string, KeyMetadata> = new Map();

  /**
   * Generate a new key pair
   */
  generateKeyPair(): KeyPair {
    const keyId = this.generateKeyId();
    const publicKey = this.generatePublicKey();
    const privateKey = this.generatePrivateKey();

    const keyPair: KeyPair = {
      publicKey,
      privateKey,
      keyId,
      createdAt: new Date(),
    };

    this.keys.set(keyId, keyPair);
    this.metadata.set(keyId, {
      keyId,
      algorithm: 'FHE',
      createdAt: new Date(),
      status: 'active',
    });

    return keyPair;
  }

  /**
   * Rotate an existing key
   */
  rotateKey(oldKeyId: string): KeyPair {
    const oldMetadata = this.metadata.get(oldKeyId);
    if (!oldMetadata) {
      throw new Error(`Key ${oldKeyId} not found`);
    }

    // Mark old key as rotated
    oldMetadata.status = 'rotated';
    oldMetadata.lastRotated = new Date();

    // Generate new key
    return this.generateKeyPair();
  }

  /**
   * Revoke a key
   */
  revokeKey(keyId: string): void {
    const metadata = this.metadata.get(keyId);
    if (!metadata) {
      throw new Error(`Key ${keyId} not found`);
    }

    metadata.status = 'revoked';
    this.keys.delete(keyId);
  }

  /**
   * Get key by ID
   */
  getKey(keyId: string): KeyPair | undefined {
    return this.keys.get(keyId);
  }

  /**
   * Get key metadata
   */
  getKeyMetadata(keyId: string): KeyMetadata | undefined {
    return this.metadata.get(keyId);
  }

  /**
   * List all active keys
   */
  listActiveKeys(): KeyMetadata[] {
    return Array.from(this.metadata.values()).filter(
      (meta) => meta.status === 'active'
    );
  }

  private generateKeyId(): string {
    return `key_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  private generatePublicKey(): string {
    // Simulated public key generation
    return '0x' + Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }

  private generatePrivateKey(): string {
    // Simulated private key generation
    // In production, use proper cryptographic key generation
    return '0x' + Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }
}

export const keyManager = new KeyManager();
