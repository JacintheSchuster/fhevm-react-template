'use client';

import { useState } from 'react';
import { useGateway, useFhevm } from '@zama/fhevm-sdk/react';

export function GatewayDemo() {
  const { isReady } = useFhevm();
  const { requestDecryption, waitForDecryption, getStatus, isPending, error } = useGateway();

  const [contractAddress, setContractAddress] = useState<string>('0x1234567890123456789012345678901234567890');
  const [encryptedValueHex, setEncryptedValueHex] = useState<string>('');
  const [requestId, setRequestId] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [decryptedValue, setDecryptedValue] = useState<any>(null);

  const handleRequestDecryption = async () => {
    if (!isReady) {
      alert('FHEVM SDK is not ready. Please wait...');
      return;
    }

    if (!encryptedValueHex.trim()) {
      alert('Please enter an encrypted value');
      return;
    }

    try {
      setStatus('📤 Sending decryption request to gateway...');

      // Convert hex to Uint8Array
      const hex = encryptedValueHex.replace(/^0x/, '');
      const encryptedValue = new Uint8Array(
        hex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []
      );

      // Request decryption
      const reqId = await requestDecryption(contractAddress, encryptedValue);

      setRequestId(reqId);
      setStatus('✅ Decryption request submitted. Request ID: ' + reqId);

    } catch (err: any) {
      console.error('Request error:', err);
      setStatus(`❌ Error: ${err.message}`);
    }
  };

  const handleWaitForDecryption = async () => {
    if (!requestId) {
      alert('Please request decryption first');
      return;
    }

    try {
      setStatus('⏳ Waiting for gateway to process decryption...');

      const result = await waitForDecryption(requestId);

      setDecryptedValue(result);
      setStatus('✅ Decryption completed successfully!');

    } catch (err: any) {
      console.error('Wait error:', err);
      setStatus(`❌ Error: ${err.message}`);
    }
  };

  const handleCheckStatus = async () => {
    if (!requestId) {
      alert('Please request decryption first');
      return;
    }

    try {
      const statusResult = await getStatus(requestId);
      setStatus(`ℹ️ Status: ${JSON.stringify(statusResult, null, 2)}`);
    } catch (err: any) {
      console.error('Status check error:', err);
      setStatus(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div className="glass-panel">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <span>🌐</span>
        <span>Gateway Integration Demo</span>
      </h2>

      <p className="text-gray-300 text-sm mb-6">
        Interact directly with the Zama gateway for decryption requests and status tracking.
      </p>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-3 rounded-lg mb-4 text-sm">
          Error: {error.message}
        </div>
      )}

      <div className="space-y-4">
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
            disabled={isPending}
          />
        </div>

        {/* Encrypted Value */}
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
            disabled={isPending}
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <button
            onClick={handleRequestDecryption}
            disabled={!isReady || isPending || !encryptedValueHex.trim()}
            className="btn-primary"
          >
            📤 Request Decrypt
          </button>

          <button
            onClick={handleWaitForDecryption}
            disabled={!requestId || isPending}
            className="btn-secondary"
          >
            ⏳ Wait for Result
          </button>

          <button
            onClick={handleCheckStatus}
            disabled={!requestId || isPending}
            className="btn-secondary"
          >
            ℹ️ Check Status
          </button>
        </div>

        {/* Request ID Display */}
        {requestId && (
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Request ID:</p>
            <p className="font-mono text-purple-300 text-sm break-all">{requestId}</p>
          </div>
        )}

        {/* Status Display */}
        {status && (
          <div className={`rounded-lg p-4 text-sm ${
            status.includes('✅') ? 'bg-green-500/10 border border-green-500/30' :
            status.includes('❌') ? 'bg-red-500/10 border border-red-500/30' :
            status.includes('⏳') ? 'bg-yellow-500/10 border border-yellow-500/30' :
            'bg-blue-500/10 border border-blue-500/30'
          }`}>
            <pre className="text-white whitespace-pre-wrap text-xs">{status}</pre>
          </div>
        )}

        {/* Decrypted Value Display */}
        {decryptedValue !== null && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-2">Decrypted Value:</p>
            <div className="code-block text-green-300 text-lg">
              {JSON.stringify(decryptedValue, null, 2)}
            </div>
          </div>
        )}

        {/* Gateway Info */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-sm">
          <p className="text-white font-semibold mb-2">🌐 Gateway Flow:</p>
          <ol className="text-gray-300 space-y-1 text-xs list-decimal list-inside">
            <li>Request decryption with contract address and encrypted value</li>
            <li>Receive a unique request ID</li>
            <li>Gateway verifies permissions and processes request</li>
            <li>Wait for decryption result or check status periodically</li>
            <li>Retrieve decrypted value when ready</li>
          </ol>
        </div>

        {/* Usage Example */}
        <details className="bg-white/5 rounded-lg p-4 text-sm">
          <summary className="cursor-pointer font-semibold text-white mb-2">
            View Code Example
          </summary>
          <pre className="code-block text-gray-300 mt-2 overflow-x-auto">
{`import { useGateway } from '@zama/fhevm-sdk/react';

function MyComponent() {
  const {
    requestDecryption,
    waitForDecryption,
    getStatus,
    isPending
  } = useGateway();

  const decrypt = async () => {
    // Step 1: Request decryption
    const requestId = await requestDecryption(
      contractAddress,
      encryptedValue
    );

    // Step 2: Wait for result
    const decrypted = await waitForDecryption(requestId);

    console.log('Decrypted:', decrypted);
  };

  return <button onClick={decrypt}>Decrypt</button>;
}`}
          </pre>
        </details>
      </div>
    </div>
  );
}
