'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { EncryptionDemo } from '@/components/EncryptionDemo';
import { DecryptionDemo } from '@/components/DecryptionDemo';
import { ContractInteractionDemo } from '@/components/ContractInteractionDemo';
import { GatewayDemo } from '@/components/GatewayDemo';
import { StatusIndicator } from '@/components/StatusIndicator';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Universal FHEVM SDK
          </h1>
          <p className="text-xl text-purple-200 mb-6">
            Next.js Integration Example
          </p>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            This example demonstrates how to integrate the Universal FHEVM SDK into a Next.js application
            with full encryption, decryption, and contract interaction capabilities.
          </p>

          <div className="flex justify-center items-center gap-4 mb-8">
            <ConnectButton />
            <StatusIndicator />
          </div>
        </header>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <EncryptionDemo />
          <DecryptionDemo />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <ContractInteractionDemo />
          <GatewayDemo />
        </div>

        {/* SDK Features */}
        <section className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 mb-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            SDK Features Demonstrated
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🔐</div>
              <h3 className="text-xl font-semibold text-white mb-2">Encryption</h3>
              <p className="text-gray-300 text-sm">
                Client-side encryption of uint8, uint16, uint32, uint64, bool, and address types
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-3">🔓</div>
              <h3 className="text-xl font-semibold text-white mb-2">Decryption</h3>
              <p className="text-gray-300 text-sm">
                Secure decryption via gateway with automatic request handling
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-3">📝</div>
              <h3 className="text-xl font-semibold text-white mb-2">Contracts</h3>
              <p className="text-gray-300 text-sm">
                Easy integration with smart contracts for encrypted operations
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="text-xl font-semibold text-white mb-2">React Hooks</h3>
              <p className="text-gray-300 text-sm">
                Convenient hooks for FHEVM operations in React components
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-3">🎨</div>
              <h3 className="text-xl font-semibold text-white mb-2">Type Safety</h3>
              <p className="text-gray-300 text-sm">
                Full TypeScript support with comprehensive type definitions
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="text-xl font-semibold text-white mb-2">Performance</h3>
              <p className="text-gray-300 text-sm">
                Optimized with caching and batch operations support
              </p>
            </div>
          </div>
        </section>

        {/* Code Example */}
        <section className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4">
            Quick Start Code
          </h2>

          <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto text-sm text-gray-300">
{`// app/providers.tsx
import { FhevmProvider } from '@zama/fhevm-sdk/react';

export function Providers({ children }) {
  return (
    <FhevmProvider chainId={11155111}>
      {children}
    </FhevmProvider>
  );
}

// components/MyComponent.tsx
import { useFhevm, useEncrypt, useDecrypt } from '@zama/fhevm-sdk/react';

export function MyComponent() {
  const { isReady } = useFhevm();
  const { encrypt32, encrypt8 } = useEncrypt();
  const { decrypt32 } = useDecrypt();

  const handleEncrypt = async () => {
    const encrypted = await encrypt32(1000);
    // Use encrypted value in contract call
  };

  return <button onClick={handleEncrypt}>Encrypt Value</button>;
}`}
          </pre>
        </section>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-400 text-sm">
          <p className="mb-2">
            Built with Universal FHEVM SDK by Zama
          </p>
          <p>
            Network: Sepolia Testnet | Chain ID: 11155111
          </p>
        </footer>
      </div>
    </div>
  );
}
