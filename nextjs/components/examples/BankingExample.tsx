'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useEncrypt, useDecrypt } from '@zama/fhevm-sdk/react';

export function BankingExample() {
  const { encrypt32, isEncrypting } = useEncrypt();
  const { decrypt32, isDecrypting } = useDecrypt();

  const [balance, setBalance] = useState('10000');
  const [transferAmount, setTransferAmount] = useState('500');
  const [encryptedBalance, setEncryptedBalance] = useState<Uint8Array | null>(null);
  const [decryptedBalance, setDecryptedBalance] = useState<string | null>(null);
  const [status, setStatus] = useState('');

  const handleEncryptBalance = async () => {
    try {
      setStatus('🔐 Encrypting account balance...');
      const encrypted = await encrypt32(parseInt(balance));
      setEncryptedBalance(encrypted);
      setStatus('✅ Balance encrypted successfully!');
    } catch (error: any) {
      setStatus(`❌ Error: ${error.message}`);
    }
  };

  const handleTransfer = async () => {
    if (!encryptedBalance) {
      setStatus('⚠️ Please encrypt balance first');
      return;
    }

    try {
      setStatus('🔐 Encrypting transfer amount...');
      const encryptedAmount = await encrypt32(parseInt(transferAmount));

      setStatus('💸 Processing encrypted transfer...');

      // Simulate transfer operation
      await new Promise(resolve => setTimeout(resolve, 1500));

      setStatus('✅ Transfer completed! Balance remains encrypted.');
    } catch (error: any) {
      setStatus(`❌ Error: ${error.message}`);
    }
  };

  const handleDecryptBalance = async () => {
    if (!encryptedBalance) {
      setStatus('⚠️ No encrypted balance to decrypt');
      return;
    }

    try {
      setStatus('🔓 Decrypting balance...');
      // Note: In real scenario, you'd need contract address
      const contractAddress = '0x1234567890123456789012345678901234567890';
      const decrypted = await decrypt32(contractAddress, encryptedBalance);
      setDecryptedBalance(decrypted?.toString() || 'N/A');
      setStatus('✅ Balance decrypted successfully!');
    } catch (error: any) {
      setStatus(`❌ Error: ${error.message}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🏦</span>
          <span>Confidential Banking</span>
        </CardTitle>
        <CardDescription>
          Secure financial operations with fully encrypted account balances and transactions
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Account Balance */}
          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-2">Account Balance</p>
            <p className="text-3xl font-bold text-green-300 mb-2">
              ${parseInt(balance).toLocaleString()}
            </p>
            {encryptedBalance && (
              <p className="text-xs text-gray-400 mt-2">
                🔒 Balance is encrypted and secure
              </p>
            )}
          </div>

          {/* Operations */}
          <div className="space-y-3">
            <Input
              label="Account Balance (USD)"
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              placeholder="Enter balance"
              disabled={isEncrypting || isDecrypting}
            />

            <Button
              onClick={handleEncryptBalance}
              disabled={isEncrypting || !balance}
              className="w-full"
              isLoading={isEncrypting}
            >
              🔐 Encrypt Balance
            </Button>

            <div className="border-t border-white/10 pt-3">
              <Input
                label="Transfer Amount (USD)"
                type="number"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                placeholder="Enter amount"
                disabled={isEncrypting || !encryptedBalance}
              />

              <Button
                onClick={handleTransfer}
                disabled={isEncrypting || !encryptedBalance || !transferAmount}
                variant="secondary"
                className="w-full mt-3"
                isLoading={isEncrypting}
              >
                💸 Execute Encrypted Transfer
              </Button>
            </div>

            {encryptedBalance && (
              <Button
                onClick={handleDecryptBalance}
                disabled={isDecrypting}
                variant="outline"
                className="w-full"
                isLoading={isDecrypting}
              >
                🔓 Decrypt Balance (Authorized Only)
              </Button>
            )}
          </div>

          {/* Status */}
          {status && (
            <div className={`rounded-lg p-3 text-sm ${
              status.includes('✅') ? 'bg-green-500/10 border border-green-500/30 text-green-300' :
              status.includes('❌') ? 'bg-red-500/10 border border-red-500/30 text-red-300' :
              status.includes('⚠️') ? 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-300' :
              'bg-blue-500/10 border border-blue-500/30 text-blue-300'
            }`}>
              {status}
            </div>
          )}

          {/* Decrypted Balance Display */}
          {decryptedBalance && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <p className="text-xs text-gray-400 mb-1">Decrypted Balance:</p>
              <p className="text-2xl font-bold text-green-300">
                ${parseInt(decryptedBalance).toLocaleString()}
              </p>
            </div>
          )}

          {/* Privacy Features */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-sm">
            <p className="text-purple-200 font-semibold mb-2">🔒 Privacy Features:</p>
            <ul className="text-gray-300 space-y-1 text-xs list-disc list-inside">
              <li>Account balances remain encrypted on-chain</li>
              <li>Transaction amounts are never exposed</li>
              <li>Only authorized parties can decrypt data</li>
              <li>Computations performed on encrypted data</li>
              <li>Full audit trail without revealing details</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
