'use client';

import { useState } from 'react';
import { useContract, useEncrypt, useFhevm } from '@zama/fhevm-sdk/react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { COUNTER_ABI, CONTRACTS } from '@/lib/fhevm';

export function ContractInteractionDemo() {
  const { isReady } = useFhevm();
  const { address, isConnected } = useAccount();
  const { encrypt32, isEncrypting } = useEncrypt();

  const [incrementValue, setIncrementValue] = useState<string>('1');
  const [txStatus, setTxStatus] = useState<string>('');
  const [txHash, setTxHash] = useState<string>('');

  const handleIncrement = async () => {
    if (!isReady || !isConnected) {
      alert('Please connect your wallet and wait for SDK to be ready');
      return;
    }

    try {
      setTxStatus('🔐 Encrypting value...');
      setTxHash('');

      // Encrypt the increment value
      const encryptedValue = await encrypt32(parseInt(incrementValue));

      setTxStatus('📝 Preparing transaction...');

      // Get provider and signer
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('MetaMask not found');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Create contract instance
      const contract = new ethers.Contract(
        CONTRACTS.COUNTER,
        COUNTER_ABI,
        signer
      );

      setTxStatus('📤 Submitting transaction...');

      // Call contract with encrypted value
      const tx = await contract.increment(encryptedValue);

      setTxStatus('⏳ Waiting for confirmation...');
      setTxHash(tx.hash);

      // Wait for transaction to be mined
      await tx.wait();

      setTxStatus('✅ Transaction confirmed!');

    } catch (err: any) {
      console.error('Transaction error:', err);
      setTxStatus(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div className="glass-panel">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <span>📝</span>
        <span>Contract Interaction Demo</span>
      </h2>

      <p className="text-gray-300 text-sm mb-6">
        Interact with smart contracts using encrypted values. This example demonstrates
        submitting encrypted data to a counter contract.
      </p>

      {!isConnected && (
        <div className="bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 p-3 rounded-lg mb-4 text-sm">
          ⚠️ Please connect your wallet to interact with the contract
        </div>
      )}

      <div className="space-y-4">
        {/* Contract Info */}
        <div className="bg-white/5 rounded-lg p-4 text-sm">
          <p className="text-gray-400 mb-1">Contract Address:</p>
          <p className="font-mono text-purple-300 text-xs break-all">
            {CONTRACTS.COUNTER}
          </p>
          <p className="text-gray-400 mt-3 mb-1">Connected Account:</p>
          <p className="font-mono text-blue-300 text-xs break-all">
            {address || 'Not connected'}
          </p>
        </div>

        {/* Increment Value Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Value to Increment:
          </label>
          <input
            type="number"
            value={incrementValue}
            onChange={(e) => setIncrementValue(e.target.value)}
            placeholder="Enter value"
            className="input-field"
            disabled={isEncrypting || !isConnected}
            min="1"
          />
        </div>

        {/* Increment Button */}
        <button
          onClick={handleIncrement}
          disabled={!isReady || !isConnected || isEncrypting || !incrementValue}
          className="btn-primary w-full"
        >
          {isEncrypting ? '🔐 Processing...' : '🚀 Increment Counter (Encrypted)'}
        </button>

        {/* Status Display */}
        {txStatus && (
          <div className={`rounded-lg p-4 text-sm ${
            txStatus.includes('✅') ? 'bg-green-500/10 border border-green-500/30' :
            txStatus.includes('❌') ? 'bg-red-500/10 border border-red-500/30' :
            'bg-blue-500/10 border border-blue-500/30'
          }`}>
            <p className="text-white">{txStatus}</p>
            {txHash && (
              <a
                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-300 hover:underline text-xs mt-2 inline-block"
              >
                View on Etherscan ↗
              </a>
            )}
          </div>
        )}

        {/* Process Flow */}
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-sm">
          <p className="text-purple-200 font-semibold mb-2">🔄 Process Flow:</p>
          <ol className="text-gray-300 space-y-1 text-xs list-decimal list-inside">
            <li>Value is encrypted client-side using FHEVM SDK</li>
            <li>Encrypted value is submitted to smart contract</li>
            <li>Contract performs operations on encrypted data</li>
            <li>Result remains encrypted on-chain</li>
            <li>Only authorized users can decrypt the result</li>
          </ol>
        </div>

        {/* Usage Example */}
        <details className="bg-white/5 rounded-lg p-4 text-sm">
          <summary className="cursor-pointer font-semibold text-white mb-2">
            View Code Example
          </summary>
          <pre className="code-block text-gray-300 mt-2 overflow-x-auto">
{`import { useEncrypt } from '@zama/fhevm-sdk/react';
import { ethers } from 'ethers';

function MyComponent() {
  const { encrypt32 } = useEncrypt();

  const submitToContract = async () => {
    // Encrypt the value
    const encrypted = await encrypt32(1000);

    // Get contract instance
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      contractAddress,
      abi,
      signer
    );

    // Submit encrypted value
    const tx = await contract.increment(encrypted);
    await tx.wait();
  };

  return <button onClick={submitToContract}>Submit</button>;
}`}
          </pre>
        </details>
      </div>
    </div>
  );
}
