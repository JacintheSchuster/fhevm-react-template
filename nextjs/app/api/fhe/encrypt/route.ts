import { NextRequest, NextResponse } from 'next/server';
import { createFhevmClient } from '@zama/fhevm-sdk';

/**
 * Encryption API Route
 * Server-side encryption endpoint for various data types
 */

export async function POST(request: NextRequest) {
  try {
    const { value, type = 'uint32' } = await request.json();

    if (value === undefined || value === null) {
      return NextResponse.json(
        { error: 'Value is required' },
        { status: 400 }
      );
    }

    // Initialize FHEVM client
    const fhevm = await createFhevmClient({
      chainId: 11155111,
      gatewayUrl: 'https://gateway.zama.ai',
    });

    let encrypted: Uint8Array;
    const startTime = Date.now();

    // Perform encryption based on type
    switch (type) {
      case 'uint8':
        encrypted = await fhevm.encrypt.uint8(parseInt(value));
        break;
      case 'uint16':
        encrypted = await fhevm.encrypt.uint16(parseInt(value));
        break;
      case 'uint32':
        encrypted = await fhevm.encrypt.uint32(parseInt(value));
        break;
      case 'uint64':
        encrypted = await fhevm.encrypt.uint64(BigInt(value));
        break;
      case 'bool':
        encrypted = await fhevm.encrypt.bool(Boolean(value));
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid type' },
          { status: 400 }
        );
    }

    const encryptionTime = Date.now() - startTime;

    // Convert Uint8Array to hex string for JSON response
    const encryptedHex = '0x' + Array.from(encrypted)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    return NextResponse.json({
      success: true,
      encrypted: encryptedHex,
      type,
      originalValue: value.toString(),
      size: encrypted.length,
      encryptionTime,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Encryption error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Encryption failed'
      },
      { status: 500 }
    );
  }
}
