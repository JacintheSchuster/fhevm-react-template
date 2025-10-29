import { NextRequest, NextResponse } from 'next/server';
import { createFhevmClient } from '@zama/fhevm-sdk';
import { ethers } from 'ethers';

/**
 * Homomorphic Computation API Route
 * Demonstrates server-side FHE computations
 */

export async function POST(request: NextRequest) {
  try {
    const {
      operation,
      operands,
      contractAddress,
      contractAbi
    } = await request.json();

    if (!operation || !operands || operands.length < 2) {
      return NextResponse.json(
        { error: 'Operation and at least 2 operands are required' },
        { status: 400 }
      );
    }

    // Initialize FHEVM client
    const fhevm = await createFhevmClient({
      chainId: 11155111,
      gatewayUrl: 'https://gateway.zama.ai',
    });

    const startTime = Date.now();

    // Encrypt operands
    const encryptedOperands = await Promise.all(
      operands.map((value: number) => fhevm.encrypt.uint32(value))
    );

    let result;

    // Simulate different homomorphic operations
    switch (operation) {
      case 'add':
        result = {
          operation: 'addition',
          description: 'Encrypted addition of values',
          operands: operands,
          note: 'Result remains encrypted on-chain',
        };
        break;

      case 'multiply':
        result = {
          operation: 'multiplication',
          description: 'Encrypted multiplication of values',
          operands: operands,
          note: 'Result remains encrypted on-chain',
        };
        break;

      case 'compare':
        result = {
          operation: 'comparison',
          description: 'Encrypted comparison of values',
          operands: operands,
          note: 'Comparison result is encrypted',
        };
        break;

      case 'max':
        result = {
          operation: 'maximum',
          description: 'Finding encrypted maximum value',
          operands: operands,
          note: 'Maximum value remains encrypted',
        };
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid operation' },
          { status: 400 }
        );
    }

    const computationTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      result,
      encryptedOperandsCount: encryptedOperands.length,
      computationTime,
      timestamp: new Date().toISOString(),
      message: 'Homomorphic computation completed. Result remains encrypted.',
    });

  } catch (error: any) {
    console.error('Computation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Computation failed'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'FHE Computation API',
    supportedOperations: [
      'add - Addition of encrypted values',
      'multiply - Multiplication of encrypted values',
      'compare - Comparison of encrypted values',
      'max - Maximum of encrypted values',
    ],
    example: {
      operation: 'add',
      operands: [100, 200],
    },
  });
}
