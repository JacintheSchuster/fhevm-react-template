'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

export function KeyManager() {
  const [isOperating, setIsOperating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [currentKeyId, setCurrentKeyId] = useState<string | null>(null);

  const handleKeyOperation = async (operation: string) => {
    setIsOperating(true);
    setResult(null);

    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation }),
      });

      const data = await response.json();
      setResult(data);

      if (data.success && data.keyId) {
        setCurrentKeyId(data.keyId);
      }
      if (data.success && data.newKeyId) {
        setCurrentKeyId(data.newKeyId);
      }
    } catch (error: any) {
      console.error('Key operation error:', error);
      setResult({
        success: false,
        error: error.message,
      });
    } finally {
      setIsOperating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🔑</span>
          <span>Key Management</span>
        </CardTitle>
        <CardDescription>
          Generate and manage cryptographic keys for FHE operations
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {currentKeyId && (
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <p className="text-xs text-gray-400 mb-1">Current Key ID:</p>
              <p className="font-mono text-purple-300 text-sm">{currentKeyId}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              onClick={() => handleKeyOperation('generate')}
              disabled={isOperating}
              variant="primary"
              className="w-full"
            >
              🔑 Generate Keys
            </Button>

            <Button
              onClick={() => handleKeyOperation('rotate')}
              disabled={isOperating || !currentKeyId}
              variant="secondary"
              className="w-full"
            >
              🔄 Rotate Keys
            </Button>

            <Button
              onClick={() => handleKeyOperation('revoke')}
              disabled={isOperating || !currentKeyId}
              variant="danger"
              className="w-full"
            >
              🗑️ Revoke Keys
            </Button>
          </div>

          {result && (
            <div className={`rounded-lg p-4 ${
              result.success
                ? 'bg-green-500/10 border border-green-500/30'
                : 'bg-red-500/10 border border-red-500/30'
            }`}>
              {result.success ? (
                <div className="space-y-2 text-sm">
                  <div className="font-semibold text-green-300 flex items-center gap-2">
                    <span>✅</span>
                    <span>{result.message}</span>
                  </div>
                  {result.publicKey && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Public Key:</p>
                      <p className="font-mono text-purple-300 text-xs break-all">
                        {result.publicKey}
                      </p>
                    </div>
                  )}
                  {result.keyId && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Key ID:</p>
                      <p className="font-mono text-blue-300 text-sm">{result.keyId}</p>
                    </div>
                  )}
                  {result.newKeyId && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1">New Key ID:</p>
                      <p className="font-mono text-blue-300 text-sm">{result.newKeyId}</p>
                    </div>
                  )}
                  <p className="text-xs text-gray-400">
                    {new Date(result.timestamp).toLocaleString()}
                  </p>
                </div>
              ) : (
                <div className="text-red-300 text-sm">
                  ❌ Error: {result.error}
                </div>
              )}
            </div>
          )}

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-sm">
            <p className="text-yellow-200 font-semibold mb-2">⚠️ Security Best Practices:</p>
            <ul className="text-gray-300 space-y-1 text-xs list-disc list-inside">
              <li>Store private keys securely</li>
              <li>Rotate keys regularly</li>
              <li>Never share private keys</li>
              <li>Use hardware security modules when possible</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
