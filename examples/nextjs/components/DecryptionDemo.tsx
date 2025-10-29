'use client';

import { useState } from 'react';
import { useDecrypt, useFhevm } from '@zama/fhevm-sdk/react';

export function DecryptionDemo() {
  const { isReady } = useFhevm();
  const { decrypt8, decrypt16, decrypt32, decrypt64, decryptBool, isDecrypting, error } = useDecrypt();

  const [selectedType, setSelectedType] = useState<'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool'>('uint32');
  const [contractAddress, setContractAddress] = useState<string>('0x1234567890123456789012345678901234567890');
  const [encryptedValueHex, setEncryptedValueHex] = useState<string>('');
  const [decryptedResult, setDecryptedResult] = useState<string | null>(null);
  const [decryptionTime, setDecryptionTime] = useState<number>(0);

  const handleDecrypt = async () => {
    if (!isReady) {
      alert('FHEVM SDK is not ready. Please wait...');
      return;
    }

    if (!encryptedValueHex.trim()) {
      alert('Please enter an encrypted value in hex format');
      return;
    }

    try {
      setDecryptedResult(null);

      // Convert hex string to Uint8Array
      const hex = encryptedValueHex.replace(/^0x/, '');
      const encryptedValue = new Uint8Array(
        hex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []
      );

      const startTime = performance.now();

      let result: any;

      switch (selectedType) {
        case 'uint8':
          result = await decrypt8(contractAddress, encryptedValue);
          break;
        case 'uint16':
          result = await decrypt16(contractAddress, encryptedValue);
          break;
        case 'uint32':
          result = await decrypt32(contractAddress, encryptedValue);
          break;
        case 'uint64':
          result = await decrypt64(contractAddress, encryptedValue);
          break;
        case 'bool':
          result = await decryptBool(contractAddress, encryptedValue);
          break;
        default:
          throw new Error('Invalid type');
      }

      const endTime = performance.now();
      setDecryptionTime(endTime - startTime);
      setDecryptedResult(result?.toString() || 'null');

    } catch (err: any) {
      console.error('Decryption error:', err);
      alert(`Decryption failed: ${err.message}`);
    }
  };

  return (
    <div className="glass-panel">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <span>🔓</span>
        <span>Decryption Demo</span>
      </h2>

      <p className="text-gray-300 text-sm mb-6">
        Decrypt encrypted values from smart contracts using the gateway integration.
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
            disabled={isDecrypting}
          >
            <option value="uint8">uint8</option>
            <option value="uint16">uint16</option>
            <option value="uint32">uint32</option>
            <option value="uint64">uint64</option>
            <option value="bool">bool</option>
          </select>
        </div>

        {/* Contract Address */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Contract Address:
          </label>
          <input
            type="text"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            placeholder="0x..."
            className="input-field font-mono text-sm"
            disabled={isDecrypting}
          />
        </div>

        {/* Encrypted Value Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Encrypted Value (hex):
          </label>
          <textarea
            value={encryptedValueHex}
            onChange={(e) => setEncryptedValueHex(e.target.value)}
            placeholder="0x123abc..."
            rows={3}
            className="input-field font-mono text-sm resize-none"
            disabled={isDecrypting}
          />
        </div>

        {/* Decrypt Button */}
        <button
          onClick={handleDecrypt}
          disabled={!isReady || isDecrypting || !encryptedValueHex.trim()}
          className="btn-primary w-full"
        >
          {isDecrypting ? '🔓 Decrypting via Gateway...' : '🔓 Decrypt Value'}
        </button>

        {/* Result Display */}
        {decryptedResult !== null && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-blue-300 font-semibold">
              <span>✅</span>
              <span>Decryption Successful</span>
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-1">Decrypted Value:</p>
              <div className="code-block text-green-300 text-lg">
                {decryptedResult}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Type:</p>
                <p className="text-white font-mono">{selectedType}</p>
              </div>
              <div>
                <p className="text-gray-400">Time:</p>
                <p className="text-white font-mono">{decryptionTime.toFixed(2)} ms</p>
              </div>
            </div>

            <div className="text-xs text-gray-400 italic">
              Decryption was performed securely via the Zama gateway service.
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-sm">
          <p className="text-purple-200 font-semibold mb-2">ℹ️ How it works:</p>
          <ul className="text-gray-300 space-y-1 text-xs">
            <li>• Decryption requests are sent to the Zama gateway</li>
            <li>• The gateway verifies your permissions</li>
            <li>• Encrypted data is decrypted securely off-chain</li>
            <li>• Only authorized addresses can decrypt specific values</li>
          </ul>
        </div>

        {/* Usage Example */}
        <details className="bg-white/5 rounded-lg p-4 text-sm">
          <summary className="cursor-pointer font-semibold text-white mb-2">
            View Code Example
          </summary>
          <pre className="code-block text-gray-300 mt-2 overflow-x-auto">
{`import { useDecrypt } from '@zama/fhevm-sdk/react';

function MyComponent() {
  const { decrypt32, isDecrypting } = useDecrypt();

  const handleDecrypt = async () => {
    const encryptedValue = await contract.getValue();
    const decrypted = await decrypt32(
      contractAddress,
      encryptedValue
    );
    console.log('Decrypted:', decrypted);
  };

  return (
    <button onClick={handleDecrypt}>
      Decrypt Value
    </button>
  );
}`}
          </pre>
        </details>
      </div>
    </div>
  );
}
