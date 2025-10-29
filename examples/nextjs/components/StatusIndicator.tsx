'use client';

import { useFhevm } from '@zama/fhevm-sdk/react';

export function StatusIndicator() {
  const { isReady, isLoading, error, chainId } = useFhevm();

  if (error) {
    return (
      <div className="status-badge bg-red-500/20 text-red-300 border border-red-500/50">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
        <span>SDK Error: {error.message}</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="status-badge bg-yellow-500/20 text-yellow-300 border border-yellow-500/50">
        <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
        <span>Initializing SDK...</span>
      </div>
    );
  }

  if (isReady) {
    return (
      <div className="status-badge bg-green-500/20 text-green-300 border border-green-500/50">
        <span className="w-2 h-2 rounded-full bg-green-500"></span>
        <span>SDK Ready (Chain: {chainId})</span>
      </div>
    );
  }

  return (
    <div className="status-badge bg-gray-500/20 text-gray-300 border border-gray-500/50">
      <span className="w-2 h-2 rounded-full bg-gray-500"></span>
      <span>SDK Not Initialized</span>
    </div>
  );
}
