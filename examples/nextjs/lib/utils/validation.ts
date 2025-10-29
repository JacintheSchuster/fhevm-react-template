/**
 * Validation Utilities
 * Input validation and data verification functions
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export class ValidationUtils {
  /**
   * Validate encryption input
   */
  static validateEncryptionInput(value: any, type: string): ValidationResult {
    if (value === undefined || value === null || value === '') {
      return {
        isValid: false,
        error: 'Value cannot be empty',
      };
    }

    switch (type) {
      case 'uint8':
      case 'uint16':
      case 'uint32':
        const numValue = parseInt(value);
        if (isNaN(numValue)) {
          return {
            isValid: false,
            error: 'Value must be a valid number',
          };
        }
        if (numValue < 0) {
          return {
            isValid: false,
            error: 'Value must be non-negative',
          };
        }
        if (type === 'uint8' && numValue > 255) {
          return {
            isValid: false,
            error: 'uint8 value must be between 0 and 255',
          };
        }
        if (type === 'uint16' && numValue > 65535) {
          return {
            isValid: false,
            error: 'uint16 value must be between 0 and 65535',
          };
        }
        if (type === 'uint32' && numValue > 4294967295) {
          return {
            isValid: false,
            error: 'uint32 value must be between 0 and 4294967295',
          };
        }
        break;

      case 'uint64':
        try {
          const bigIntValue = BigInt(value);
          if (bigIntValue < 0n) {
            return {
              isValid: false,
              error: 'uint64 value must be non-negative',
            };
          }
        } catch {
          return {
            isValid: false,
            error: 'Invalid uint64 value',
          };
        }
        break;

      case 'bool':
        if (typeof value !== 'boolean' && value !== 'true' && value !== 'false' && value !== 0 && value !== 1) {
          return {
            isValid: false,
            error: 'Value must be a boolean',
          };
        }
        break;

      case 'address':
        if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
          return {
            isValid: false,
            error: 'Invalid Ethereum address format',
          };
        }
        break;

      default:
        return {
          isValid: false,
          error: `Unsupported type: ${type}`,
        };
    }

    return { isValid: true };
  }

  /**
   * Validate contract address
   */
  static validateContractAddress(address: string): ValidationResult {
    if (!address || address.trim() === '') {
      return {
        isValid: false,
        error: 'Contract address is required',
      };
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return {
        isValid: false,
        error: 'Invalid contract address format',
      };
    }

    return { isValid: true };
  }

  /**
   * Validate encrypted value format
   */
  static validateEncryptedValue(encryptedHex: string): ValidationResult {
    if (!encryptedHex || encryptedHex.trim() === '') {
      return {
        isValid: false,
        error: 'Encrypted value is required',
      };
    }

    if (!/^0x[a-fA-F0-9]*$/.test(encryptedHex)) {
      return {
        isValid: false,
        error: 'Encrypted value must be in hex format (0x...)',
      };
    }

    if (encryptedHex.length < 4) {
      return {
        isValid: false,
        error: 'Encrypted value is too short',
      };
    }

    return { isValid: true };
  }

  /**
   * Validate computation operands
   */
  static validateComputationOperands(operands: any[]): ValidationResult {
    if (!Array.isArray(operands)) {
      return {
        isValid: false,
        error: 'Operands must be an array',
      };
    }

    if (operands.length < 2) {
      return {
        isValid: false,
        error: 'At least 2 operands are required',
      };
    }

    for (let i = 0; i < operands.length; i++) {
      const value = parseInt(operands[i]);
      if (isNaN(value)) {
        return {
          isValid: false,
          error: `Operand ${i + 1} must be a valid number`,
        };
      }
    }

    return { isValid: true };
  }

  /**
   * Validate key ID format
   */
  static validateKeyId(keyId: string): ValidationResult {
    if (!keyId || keyId.trim() === '') {
      return {
        isValid: false,
        error: 'Key ID is required',
      };
    }

    if (keyId.length < 8) {
      return {
        isValid: false,
        error: 'Key ID is too short',
      };
    }

    return { isValid: true };
  }

  /**
   * Validate API request body
   */
  static validateAPIRequest(body: any, requiredFields: string[]): ValidationResult {
    if (!body || typeof body !== 'object') {
      return {
        isValid: false,
        error: 'Request body must be a valid object',
      };
    }

    for (const field of requiredFields) {
      if (!(field in body)) {
        return {
          isValid: false,
          error: `Missing required field: ${field}`,
        };
      }
    }

    return { isValid: true };
  }

  /**
   * Sanitize string input
   */
  static sanitizeString(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .substring(0, 1000); // Limit length
  }

  /**
   * Validate numeric range
   */
  static validateRange(value: number, min: number, max: number): ValidationResult {
    if (value < min || value > max) {
      return {
        isValid: false,
        error: `Value must be between ${min} and ${max}`,
      };
    }
    return { isValid: true };
  }
}
