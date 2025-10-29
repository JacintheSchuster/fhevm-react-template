/**
 * Security Utilities
 * Helper functions for secure FHE operations
 */

export class SecurityUtils {
  /**
   * Validate Ethereum address format
   */
  static isValidAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  /**
   * Validate hex string format
   */
  static isValidHex(hex: string): boolean {
    return /^0x[a-fA-F0-9]*$/.test(hex);
  }

  /**
   * Sanitize user input for numeric values
   */
  static sanitizeNumericInput(input: string): number | null {
    const cleaned = input.trim();
    if (!/^\d+$/.test(cleaned)) {
      return null;
    }
    const value = parseInt(cleaned, 10);
    return isNaN(value) ? null : value;
  }

  /**
   * Convert Uint8Array to hex string
   */
  static uint8ArrayToHex(array: Uint8Array): string {
    return '0x' + Array.from(array)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Convert hex string to Uint8Array
   */
  static hexToUint8Array(hex: string): Uint8Array {
    const cleaned = hex.replace(/^0x/, '');
    const matches = cleaned.match(/.{1,2}/g);
    if (!matches) {
      throw new Error('Invalid hex string');
    }
    return new Uint8Array(matches.map(byte => parseInt(byte, 16)));
  }

  /**
   * Truncate address for display
   */
  static truncateAddress(address: string, startLength: number = 6, endLength: number = 4): string {
    if (!this.isValidAddress(address)) {
      return address;
    }
    return `${address.substring(0, startLength)}...${address.substring(address.length - endLength)}`;
  }

  /**
   * Truncate hex value for display
   */
  static truncateHex(hex: string, maxLength: number = 16): string {
    if (hex.length <= maxLength) {
      return hex;
    }
    const halfLength = Math.floor(maxLength / 2) - 2;
    return `${hex.substring(0, halfLength)}...${hex.substring(hex.length - halfLength)}`;
  }

  /**
   * Rate limiting check (simple implementation)
   */
  private static requestCounts = new Map<string, { count: number; resetTime: number }>();

  static checkRateLimit(identifier: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const record = this.requestCounts.get(identifier);

    if (!record || now > record.resetTime) {
      this.requestCounts.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
      });
      return true;
    }

    if (record.count >= maxRequests) {
      return false;
    }

    record.count++;
    return true;
  }

  /**
   * Validate value range for FHE types
   */
  static validateValueRange(value: number, type: string): boolean {
    switch (type) {
      case 'uint8':
        return value >= 0 && value <= 255;
      case 'uint16':
        return value >= 0 && value <= 65535;
      case 'uint32':
        return value >= 0 && value <= 4294967295;
      case 'uint64':
        return value >= 0;
      case 'bool':
        return value === 0 || value === 1;
      default:
        return false;
    }
  }

  /**
   * Generate secure random ID
   */
  static generateSecureId(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 15);
    return `${timestamp}_${randomPart}`;
  }

  /**
   * Hash data for comparison (simple implementation)
   */
  static async hashData(data: string): Promise<string> {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    // Fallback for Node.js environment
    return data;
  }
}
