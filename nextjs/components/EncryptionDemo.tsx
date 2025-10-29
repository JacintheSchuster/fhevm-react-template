'use client';

import { useState } from 'react';
import { useEncrypt, useFhevm } from '@zama/fhevm-sdk/react';
import { formatEncryptedValue } from '@/lib/fhevm';

export function EncryptionDemo() {
  const { isReady } = useFhevm();
  const { encrypt8, encrypt16, encrypt32, encrypt64, encryptBool, isEncrypting, error } = useEncrypt();

  const [selectedType, setSelectedType] = useState<'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool'>('uint32');
  const [inputValue, setInputValue] = useState<string>('1000');
  const [encryptedResult, setEncryptedResult] = useState<Uint8Array | null>(null);
  const [encryptionTime, setEncryptionTime] = useState<number>(0);

  const handleEncrypt = async () => {
    if (!isReady) {
      alert('FHEVM SDK is not ready. Please wait...');
      return;
    }

    try {
      setEncryptedResult(null);
      const startTime = performance.now();

      let result: Uint8Array;

      switch (selectedType) {
        case 'uint8':
          result = await encrypt8(parseInt(inputValue));
          break;
        case 'uint16':
          result = await encrypt16(parseInt(inputValue));
          break;
        case 'uint32':
          result = await encrypt32(parseInt(inputValue));
          break;
        case 'uint64':
          result = await encrypt64(BigInt(inputValue));
          break;
        case 'bool':
          result = await encryptBool(inputValue === 'true' || inputValue === '1');
          break;
        default:
          throw new Error('Invalid type');
      }

      const endTime = performance.now();
      setEncryptionTime(endTime - startTime);
      setEncryptedResult(result);

    } catch (err: any) {
      console.error('Encryption error:', err);
      alert(`Encryption failed: ${err.message}`);
    }
  };

  return (
    <div className="glass-panel">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <span>🔐</span>
        <span>Encryption Demo</span>
      </h2>

      <p className="text-gray-300 text-sm mb-6">
        Demonstrate client-side encryption of different data types using the Universal FHEVM SDK.
      </p>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-3 rounded-lg mb-4 text-sm">
          Error: {error.message}
        </div>
      )}

      <div className="space-y-4">
        {/* Type Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Data Type:
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="input-field"
            disabled={isEncrypting}
          >
            <option value="uint8">uint8 (0-255)</option>
            <option value="uint16">uint16 (0-65,535)</option>
            <option value="uint32">uint32 (0-4,294,967,295)</option>
            <option value="uint64">uint64 (0-18,446,744,073,709,551,615)</option>
            <option value="bool">bool (true/false)</option>
          </select>
        </div>

        {/* Value Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Value to Encrypt:
          </label>
          {selectedType === 'bool' ? (
            <select
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="input-field"
              disabled={isEncrypting}
            >
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          ) : (
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Enter ${selectedType} value`}
              className="input-field"
              disabled={isEncrypting}
            />
          )}
        </div>

        {/* Encrypt Button */}
        <button
          onClick={handleEncrypt}
          disabled={!isReady || isEncrypting || !inputValue}
          className="btn-primary w-full"
        >
          {isEncrypting ? '🔐 Encrypting...' : '🔐 Encrypt Value'}
        </button>

        {/* Result Display */}
        {encryptedResult && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-green-300 font-semibold">
              <span>✅</span>
              <span>Encryption Successful</span>
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-1">Encrypted Value (hex):</p>
              <div className="code-block text-purple-300">
                {formatEncryptedValue(encryptedResult)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Size:</p>
                <p className="text-white font-mono">{encryptedResult.length} bytes</p>
              </div>
              <div>
                <p className="text-gray-400">Time:</p>
                <p className="text-white font-mono">{encryptionTime.toFixed(2)} ms</p>
              </div>
            </div>

            <div className="text-xs text-gray-400 italic">
              This encrypted value can now be safely submitted to a smart contract without revealing the original data.
            </div>
          </div>
        )}

        {/* Usage Example */}
        <details className="bg-white/5 rounded-lg p-4 text-sm">
          <summary className="cursor-pointer font-semibold text-white mb-2">
            View Code Example
          </summary>
          <pre className="code-block text-gray-300 mt-2 overflow-x-auto">
{`import { useEncrypt } from '@zama/fhevm-sdk/react';

function MyComponent() {
  const { encrypt32, isEncrypting } = useEncrypt();

  const handleEncrypt = async () => {
    const encrypted = await encrypt32(1000);
    // Use encrypted value in contract call
    await contract.submitValue(encrypted);
  };

  return (
    <button onClick={handleEncrypt}>
      Encrypt & Submit
    </button>
  );
}`}
          </pre>
        </details>
      </div>
    </div>
  );
}
