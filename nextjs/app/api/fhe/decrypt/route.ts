import { NextRequest, NextResponse } from 'next/server';
import { createFhevmClient } from '@zama/fhevm-sdk';

/**
 * Decryption API Route
 * Server-side decryption endpoint via gateway
 */

export async function POST(request: NextRequest) {
  try {
    const { encryptedValue, type = 'uint32', contractAddress } = await request.json();

    if (!encryptedValue || !contractAddress) {
      return NextResponse.json(
        { error: 'Encrypted value and contract address are required' },
        { status: 400 }
      );
    }

    // Initialize FHEVM client
    const fhevm = await createFhevmClient({
      chainId: 11155111,
      gatewayUrl: 'https://gateway.zama.ai',
    });

    // Convert hex string to Uint8Array
    const hex = encryptedValue.replace(/^0x/, '');
    const encryptedBytes = new Uint8Array(
      hex.match(/.{1,2}/g)?.map((byte: string) => parseInt(byte, 16)) || []
    );

    const startTime = Date.now();
    let decrypted: any;

    // Perform decryption based on type
    switch (type) {
      case 'uint8':
        decrypted = await fhevm.decrypt.uint8(contractAddress, encryptedBytes);
        break;
      case 'uint16':
        decrypted = await fhevm.decrypt.uint16(contractAddress, encryptedBytes);
        break;
      case 'uint32':
        decrypted = await fhevm.decrypt.uint32(contractAddress, encryptedBytes);
        break;
      case 'uint64':
        decrypted = await fhevm.decrypt.uint64(contractAddress, encryptedBytes);
        break;
      case 'bool':
        decrypted = await fhevm.decrypt.bool(contractAddress, encryptedBytes);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid type' },
          { status: 400 }
        );
    }

    const decryptionTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      decrypted: decrypted?.toString() || null,
      type,
      decryptionTime,
      contractAddress,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Decryption error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Decryption failed'
      },
      { status: 500 }
    );
  }
}
