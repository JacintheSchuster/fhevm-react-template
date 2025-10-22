# React Guide

Complete guide for using Universal FHEVM SDK with React and Next.js.

---

## Table of Contents

- [Installation](#installation)
- [Setup](#setup)
- [React Hooks](#react-hooks)
- [Next.js Integration](#nextjs-integration)
- [Common Patterns](#common-patterns)
- [Best Practices](#best-practices)
- [Examples](#examples)

---

## Installation

```bash
npm install @zama/fhevm-sdk
# or
yarn add @zama/fhevm-sdk
# or
pnpm add @zama/fhevm-sdk
```

---

## Setup

### Provider Setup

Wrap your app with `FhevmProvider`:

```typescript
// app/layout.tsx (Next.js App Router)
import { FhevmProvider } from '@zama/fhevm-sdk/react';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <FhevmProvider chainId={11155111}>
          {children}
        </FhevmProvider>
      </body>
    </html>
  );
}
```

```typescript
// src/main.tsx (React + Vite)
import React from 'react';
import ReactDOM from 'react-dom/client';
import { FhevmProvider } from '@zama/fhevm-sdk/react';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FhevmProvider chainId={11155111}>
      <App />
    </FhevmProvider>
  </React.StrictMode>
);
```

### Provider Configuration

```typescript
<FhevmProvider
  chainId={11155111}
  config={{
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_KEY',
    gatewayUrl: 'https://gateway.zama.ai',
    enableCache: true
  }}
>
  {children}
</FhevmProvider>
```

---

## React Hooks

### useFhevm()

Access FHEVM client and status.

```typescript
import { useFhevm } from '@zama/fhevm-sdk/react';

function MyComponent() {
  const { client, isReady, isLoading, error, chainId } = useFhevm();

  if (isLoading) return <div>Initializing FHEVM...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!isReady) return <div>Please wait...</div>;

  return <div>Connected to chain {chainId}</div>;
}
```

### useEncrypt()

Encrypt data with React hooks.

```typescript
import { useEncrypt } from '@zama/fhevm-sdk/react';
import { useState } from 'react';

function EncryptionForm() {
  const { encrypt32, encrypt8, isEncrypting, error } = useEncrypt();
  const [value, setValue] = useState(0);
  const [encrypted, setEncrypted] = useState<Uint8Array | null>(null);

  const handleEncrypt = async () => {
    try {
      const result = await encrypt32(value);
      setEncrypted(result);
    } catch (err) {
      console.error('Encryption failed:', err);
    }
  };

  return (
    <div>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        disabled={isEncrypting}
      />
      <button onClick={handleEncrypt} disabled={isEncrypting}>
        {isEncrypting ? 'Encrypting...' : 'Encrypt'}
      </button>
      {error && <div>Error: {error.message}</div>}
      {encrypted && <div>Encrypted: {Buffer.from(encrypted).toString('hex')}</div>}
    </div>
  );
}
```

### useDecrypt()

Decrypt data with React hooks.

```typescript
import { useDecrypt } from '@zama/fhevm-sdk/react';
import { useState } from 'react';

function DecryptionComponent({ contractAddress, encryptedValue }) {
  const { decrypt32, isDecrypting, error } = useDecrypt();
  const [decrypted, setDecrypted] = useState<number | null>(null);

  const handleDecrypt = async () => {
    try {
      const result = await decrypt32(contractAddress, encryptedValue);
      setDecrypted(result);
    } catch (err) {
      console.error('Decryption failed:', err);
    }
  };

  return (
    <div>
      <button onClick={handleDecrypt} disabled={isDecrypting}>
        {isDecrypting ? 'Decrypting...' : 'Decrypt'}
      </button>
      {error && <div>Error: {error.message}</div>}
      {decrypted !== null && <div>Decrypted: {decrypted}</div>}
    </div>
  );
}
```

### useContract()

Interact with FHE contracts.

```typescript
import { useContract } from '@zama/fhevm-sdk/react';

function ContractInteraction() {
  const { contract, call, read, isLoading, error } = useContract({
    address: '0x...',
    abi: contractAbi
  });

  const handleSubmit = async () => {
    const tx = await call('submitValue', [encryptedValue]);
    await tx.wait();
  };

  const handleRead = async () => {
    const result = await read('getValue', []);
    console.log('Value:', result);
  };

  return (
    <div>
      <button onClick={handleSubmit} disabled={isLoading}>Submit</button>
      <button onClick={handleRead} disabled={isLoading}>Read</button>
      {error && <div>Error: {error.message}</div>}
    </div>
  );
}
```

---

## Next.js Integration

### App Router (Next.js 13+)

```typescript
// app/layout.tsx
import { FhevmProvider } from '@zama/fhevm-sdk/react';
import { Providers } from './providers';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <FhevmProvider chainId={11155111}>
          <Providers>
            {children}
          </Providers>
        </FhevmProvider>
      </body>
    </html>
  );
}
```

```typescript
// app/providers.tsx
'use client';

import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { config } from './wagmi-config';

export function Providers({ children }) {
  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider>
        {children}
      </RainbowKitProvider>
    </WagmiProvider>
  );
}
```

```typescript
// app/page.tsx
'use client';

import { useFhevm, useEncrypt } from '@zama/fhevm-sdk/react';
import { useAccount } from 'wagmi';

export default function HomePage() {
  const { address } = useAccount();
  const { isReady } = useFhevm();
  const { encrypt32 } = useEncrypt();

  if (!address) return <div>Please connect wallet</div>;
  if (!isReady) return <div>Loading FHEVM...</div>;

  return <div>Ready to encrypt!</div>;
}
```

### Pages Router (Next.js 12)

```typescript
// pages/_app.tsx
import { FhevmProvider } from '@zama/fhevm-sdk/react';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <FhevmProvider chainId={11155111}>
      <Component {...pageProps} />
    </FhevmProvider>
  );
}
```

---

## Common Patterns

### Form with Encryption

```typescript
import { useEncrypt } from '@zama/fhevm-sdk/react';
import { useState } from 'react';
import { ethers } from 'ethers';

function SubmitForm() {
  const { encrypt32, encrypt8, isEncrypting } = useEncrypt();
  const [formData, setFormData] = useState({
    value: 0,
    priority: 1
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Encrypt form data
    const encValue = await encrypt32(formData.value);
    const encPriority = await encrypt8(formData.priority);

    // Submit to contract
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(address, abi, signer);

    const tx = await contract.submitData(encValue, encPriority);
    await tx.wait();

    alert('Submitted successfully!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={formData.value}
        onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
        disabled={isEncrypting}
      />
      <select
        value={formData.priority}
        onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
        disabled={isEncrypting}
      >
        <option value={1}>Low</option>
        <option value={2}>Medium</option>
        <option value={3}>High</option>
      </select>
      <button type="submit" disabled={isEncrypting}>
        {isEncrypting ? 'Processing...' : 'Submit'}
      </button>
    </form>
  );
}
```

### Loading States

```typescript
import { useFhevm, useEncrypt } from '@zama/fhevm-sdk/react';

function StatusDisplay() {
  const { isReady, isLoading, error } = useFhevm();
  const { isEncrypting } = useEncrypt();

  return (
    <div>
      {isLoading && <div>Initializing...</div>}
      {error && <div>Error: {error.message}</div>}
      {isReady && !isEncrypting && <div>Ready</div>}
      {isEncrypting && <div>Encrypting...</div>}
    </div>
  );
}
```

### Error Handling

```typescript
import { useEncrypt } from '@zama/fhevm-sdk/react';
import { useState } from 'react';

function SecureInput() {
  const { encrypt32, error } = useEncrypt();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleEncrypt = async (value: number) => {
    try {
      setLocalError(null);
      const encrypted = await encrypt32(value);
      return encrypted;
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    }
  };

  return (
    <div>
      {(error || localError) && (
        <div className="error">
          Error: {error?.message || localError}
        </div>
      )}
    </div>
  );
}
```

---

## Best Practices

### 1. Provider Placement

Place `FhevmProvider` at the root level:

```typescript
// ✅ Good: At root level
<FhevmProvider chainId={11155111}>
  <App />
</FhevmProvider>

// ❌ Bad: Inside components
function MyComponent() {
  return (
    <FhevmProvider chainId={11155111}>
      {/* Content */}
    </FhevmProvider>
  );
}
```

### 2. Conditional Rendering

Always check `isReady` before using hooks:

```typescript
function MyComponent() {
  const { isReady } = useFhevm();
  const { encrypt32 } = useEncrypt();

  if (!isReady) {
    return <div>Loading...</div>;
  }

  // Now safe to use encrypt32
  return <div>Ready!</div>;
}
```

### 3. Error Boundaries

Wrap components with error boundaries:

```typescript
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error }) {
  return (
    <div>
      <h2>Something went wrong</h2>
      <pre>{error.message}</pre>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <FhevmProvider chainId={11155111}>
        <MyComponent />
      </FhevmProvider>
    </ErrorBoundary>
  );
}
```

### 4. TypeScript Types

Use proper TypeScript types:

```typescript
import { useFhevm, useEncrypt } from '@zama/fhevm-sdk/react';
import type { FhevmClient } from '@zama/fhevm-sdk';

function MyComponent() {
  const { client }: { client: FhevmClient | null } = useFhevm();
  const { encrypt32 }: { encrypt32: (value: number) => Promise<Uint8Array> } = useEncrypt();
}
```

### 5. Memoization

Memoize expensive operations:

```typescript
import { useEncrypt } from '@zama/fhevm-sdk/react';
import { useMemo, useCallback } from 'react';

function OptimizedComponent() {
  const { encrypt32 } = useEncrypt();

  const handleEncrypt = useCallback(async (value: number) => {
    return await encrypt32(value);
  }, [encrypt32]);

  const config = useMemo(() => ({
    chainId: 11155111,
    enableCache: true
  }), []);

  return <div>Optimized</div>;
}
```

---

## Examples

### Complete Form Example

```typescript
import { useFhevm, useEncrypt } from '@zama/fhevm-sdk/react';
import { useState } from 'react';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = '0x...';
const CONTRACT_ABI = [...];

function EncryptedForm() {
  const { isReady, error: fhevmError } = useFhevm();
  const { encrypt32, encrypt8, isEncrypting, error: encryptError } = useEncrypt();

  const [formData, setFormData] = useState({
    amount: 0,
    priority: 1
  });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isReady) {
      setStatus('FHEVM not ready');
      return;
    }

    try {
      setStatus('Encrypting...');

      const encAmount = await encrypt32(formData.amount);
      const encPriority = await encrypt8(formData.priority);

      setStatus('Submitting to contract...');

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.submitData(encAmount, encPriority);

      setStatus('Waiting for confirmation...');
      await tx.wait();

      setStatus('Success!');
    } catch (err) {
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div>
      <h2>Submit Encrypted Data</h2>

      {(fhevmError || encryptError) && (
        <div className="error">
          {fhevmError?.message || encryptError?.message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
            disabled={isEncrypting}
          />
        </div>

        <div>
          <label>Priority:</label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
            disabled={isEncrypting}
          >
            <option value={1}>Low</option>
            <option value={2}>Medium</option>
            <option value={3}>High</option>
          </select>
        </div>

        <button type="submit" disabled={!isReady || isEncrypting}>
          {isEncrypting ? 'Processing...' : 'Submit'}
        </button>
      </form>

      {status && <div className="status">{status}</div>}
    </div>
  );
}

export default EncryptedForm;
```

---

<div align="center">

[⬆ Back to Documentation](../README.md)

</div>
