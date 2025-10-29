'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Input, Select } from '../ui/Input';
import { Button } from '../ui/Button';

export function ComputationDemo() {
  const [operation, setOperation] = useState('add');
  const [operand1, setOperand1] = useState('100');
  const [operand2, setOperand2] = useState('200');
  const [isComputing, setIsComputing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCompute = async () => {
    setIsComputing(true);
    setResult(null);

    try {
      const response = await fetch('/api/fhe/compute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation,
          operands: [parseInt(operand1), parseInt(operand2)],
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      console.error('Computation error:', error);
      setResult({
        success: false,
        error: error.message,
      });
    } finally {
      setIsComputing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🧮</span>
          <span>Homomorphic Computation</span>
        </CardTitle>
        <CardDescription>
          Perform computations on encrypted data without decrypting it
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <Select
            label="Operation"
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            options={[
              { value: 'add', label: 'Addition' },
              { value: 'multiply', label: 'Multiplication' },
              { value: 'compare', label: 'Comparison' },
              { value: 'max', label: 'Maximum' },
            ]}
            disabled={isComputing}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Value"
              type="number"
              value={operand1}
              onChange={(e) => setOperand1(e.target.value)}
              placeholder="Enter first value"
              disabled={isComputing}
            />

            <Input
              label="Second Value"
              type="number"
              value={operand2}
              onChange={(e) => setOperand2(e.target.value)}
              placeholder="Enter second value"
              disabled={isComputing}
            />
          </div>

          <Button
            onClick={handleCompute}
            disabled={isComputing || !operand1 || !operand2}
            className="w-full"
            isLoading={isComputing}
          >
            {isComputing ? 'Computing...' : '🧮 Compute on Encrypted Data'}
          </Button>

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
                    <span>Computation Successful</span>
                  </div>
                  <div className="text-gray-300">
                    <p><strong>Operation:</strong> {result.result?.operation}</p>
                    <p><strong>Description:</strong> {result.result?.description}</p>
                    <p><strong>Input Values:</strong> {result.result?.operands?.join(', ')}</p>
                    <p><strong>Time:</strong> {result.computationTime}ms</p>
                  </div>
                  <div className="mt-3 p-3 bg-purple-500/10 rounded text-purple-200 text-xs">
                    ℹ️ {result.result?.note}
                  </div>
                </div>
              ) : (
                <div className="text-red-300 text-sm">
                  ❌ Error: {result.error}
                </div>
              )}
            </div>
          )}

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-sm">
            <p className="text-blue-200 font-semibold mb-2">💡 How it works:</p>
            <ul className="text-gray-300 space-y-1 text-xs list-disc list-inside">
              <li>Values are encrypted before computation</li>
              <li>Operations are performed on ciphertext</li>
              <li>Result remains encrypted throughout</li>
              <li>No intermediate values are exposed</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
