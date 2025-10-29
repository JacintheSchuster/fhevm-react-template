'use client';

import { useState, useCallback } from 'react';

export function useComputation() {
  const [isComputing, setIsComputing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<any>(null);

  const compute = useCallback(async (
    operation: 'add' | 'multiply' | 'compare' | 'max',
    operands: number[],
    contractAddress?: string,
    contractAbi?: any[]
  ) => {
    setIsComputing(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/fhe/compute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operation,
          operands,
          contractAddress,
          contractAbi,
        }),
      });

      if (!response.ok) {
        throw new Error(`Computation failed: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Computation failed');
      }

      setResult(data);
      return data;
    } catch (err: any) {
      console.error('Computation error:', err);
      setError(err);
      throw err;
    } finally {
      setIsComputing(false);
    }
  }, []);

  const add = useCallback((a: number, b: number) => compute('add', [a, b]), [compute]);
  const multiply = useCallback((a: number, b: number) => compute('multiply', [a, b]), [compute]);
  const compare = useCallback((a: number, b: number) => compute('compare', [a, b]), [compute]);
  const max = useCallback((...values: number[]) => compute('max', values), [compute]);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    compute,
    add,
    multiply,
    compare,
    max,
    isComputing,
    error,
    result,
    reset,
  };
}
