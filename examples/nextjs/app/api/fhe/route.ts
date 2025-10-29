import { NextRequest, NextResponse } from 'next/server';
import { createFhevmClient } from '@zama/fhevm-sdk';

/**
 * Main FHE Operations API Route
 * Handles general FHE operations
 */

export async function POST(request: NextRequest) {
  try {
    const { operation, data } = await request.json();

    // Initialize FHEVM client
    const fhevm = await createFhevmClient({
      chainId: 11155111,
      gatewayUrl: 'https://gateway.zama.ai',
    });

    let result;

    switch (operation) {
      case 'initialize':
        result = {
          success: true,
          message: 'FHE client initialized successfully',
          chainId: 11155111,
        };
        break;

      case 'getStatus':
        result = {
          success: true,
          status: 'ready',
          version: '1.0.0',
        };
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid operation' },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('FHE operation error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'FHE API is running',
    endpoints: [
      '/api/fhe/encrypt',
      '/api/fhe/decrypt',
      '/api/fhe/compute',
      '/api/keys',
    ],
    version: '1.0.0',
  });
}
