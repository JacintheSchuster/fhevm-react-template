# Migration Guide

Guide for migrating from fhevmjs to Universal FHEVM SDK.

---

## Why Migrate?

### Before (fhevmjs)
- Complex setup (50+ lines)
- Scattered dependencies
- Manual provider management
- No built-in hooks
- Limited TypeScript support

### After (Universal FHEVM SDK)
- Simple setup (3-5 lines)
- All-in-one package
- Automatic configuration
- React/Vue hooks included
- Full TypeScript support

---

## Migration Steps

### Step 1: Update Dependencies

**Remove old dependencies:**
```bash
npm uninstall fhevmjs @zama-fhe/gateway ethers
```

**Install new SDK:**
```bash
npm install @zama/fhevm-sdk
```

### Step 2: Update Imports

**Before:**
```typescript
import { createInstance } from 'fhevmjs';
import { initGateway } from '@zama-fhe/gateway';
import { ethers } from 'ethers';
```

**After:**
```typescript
import { createFhevmClient, encrypt, decrypt } from '@zama/fhevm-sdk';
// or for React
import { useFhevm, useEncrypt, useDecrypt } from '@zama/fhevm-sdk/react';
```

### Step 3: Update Initialization

**Before:**
```typescript
const provider = new ethers.BrowserProvider(window.ethereum);
const network = await provider.getNetwork();
const signer = await provider.getSigner();

const publicKey = await provider.call({
  to: aclAddress,
  data: '0x...'
});

const fhevm = await createInstance({
  chainId: Number(network.chainId),
  publicKey,
  gatewayUrl: 'https://gateway.zama.ai',
  // More config...
});
```

**After:**
```typescript
const fhevm = await createFhevmClient({ chainId: 11155111 });
```

### Step 4: Update Encryption

**Before:**
```typescript
const input = fhevm.createEncryptedInput(contractAddress, userAddress);
input.add32(1000);
input.add8(5);
const { handles, inputProof } = await input.encrypt();
```

**After:**
```typescript
const enc1 = await fhevm.encrypt.uint32(1000);
const enc2 = await fhevm.encrypt.uint8(5);
```

### Step 5: Update Decryption

**Before:**
```typescript
const gateway = initGateway({
  gatewayUrl: 'https://gateway.zama.ai',
  ...
});

const requestId = await gateway.requestDecryption({
  contractAddress,
  encryptedValue
});

const decrypted = await gateway.waitForDecryption(requestId);
```

**After:**
```typescript
const decrypted = await fhevm.decrypt.uint32(contractAddress, encryptedValue);
```

---

## Code Comparison

### Example: Encrypted Form Submission

**Before (fhevmjs):**
```typescript
import { createInstance } from 'fhevmjs';
import { ethers } from 'ethers';

async function submitEncryptedData(value: number) {
  // Initialize provider
  const provider = new ethers.BrowserProvider(window.ethereum);
  const network = await provider.getNetwork();
  const signer = await provider.getSigner();
  const userAddress = await signer.getAddress();

  // Get public key
  const publicKeyCall = await provider.call({
    to: aclAddress,
    data: getPublicKeySelector
  });
  const publicKey = ethers.dataSlice(publicKeyCall, 0);

  // Initialize FHEVM
  const fhevm = await createInstance({
    chainId: Number(network.chainId),
    publicKey,
    gatewayUrl: 'https://gateway.zama.ai'
  });

  // Create encrypted input
  const input = fhevm.createEncryptedInput(contractAddress, userAddress);
  input.add32(value);
  const { handles, inputProof } = await input.encrypt();

  // Submit to contract
  const contract = new ethers.Contract(contractAddress, abi, signer);
  const tx = await contract.submitValue(handles[0], inputProof);
  await tx.wait();
}
```

**After (Universal FHEVM SDK):**
```typescript
import { createFhevmClient } from '@zama/fhevm-sdk';
import { ethers } from 'ethers';

async function submitEncryptedData(value: number) {
  // Initialize (one line)
  const fhevm = await createFhevmClient({ chainId: 11155111 });

  // Encrypt (one line)
  const encrypted = await fhevm.encrypt.uint32(value);

  // Submit (standard ethers)
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abi, signer);
  const tx = await contract.submitValue(encrypted);
  await tx.wait();
}
```

**Reduction: 50 lines → 10 lines (80% less code!)**

---

## React Migration

### Before (Manual Setup)

```typescript
import { createInstance } from 'fhevmjs';
import { useState, useEffect } from 'react';

function App() {
  const [fhevm, setFhevm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const provider = new ethers.BrowserProvider(window.ethereum);
      // ... complex setup
      const instance = await createInstance({ /* config */ });
      setFhevm(instance);
      setIsLoading(false);
    }
    init();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return <div>Ready</div>;
}
```

### After (With Hooks)

```typescript
import { FhevmProvider, useFhevm } from '@zama/fhevm-sdk/react';

function App() {
  return (
    <FhevmProvider chainId={11155111}>
      <MyComponent />
    </FhevmProvider>
  );
}

function MyComponent() {
  const { isReady, isLoading } = useFhevm();

  if (isLoading) return <div>Loading...</div>;
  return <div>Ready</div>;
}
```

---

## Breaking Changes

### 1. Encryption Return Type

**Before:** Returns handles array
```typescript
const { handles } = await input.encrypt();
```

**After:** Returns Uint8Array directly
```typescript
const encrypted = await encrypt.uint32(value);
```

### 2. Batch Encryption

**Before:** Add multiple values to single input
```typescript
const input = fhevm.createEncryptedInput(address, user);
input.add32(100);
input.add32(200);
const { handles } = await input.encrypt();
```

**After:** Encrypt values individually
```typescript
const enc1 = await encrypt.uint32(100);
const enc2 = await encrypt.uint32(200);
```

### 3. Decryption API

**Before:** Gateway with request/wait pattern
```typescript
const requestId = await gateway.requestDecryption(...);
const result = await gateway.waitForDecryption(requestId);
```

**After:** Direct decrypt method
```typescript
const result = await decrypt.uint32(contractAddress, encrypted);
```

---

## Migration Checklist

- [ ] Update package.json dependencies
- [ ] Replace fhevmjs imports with SDK imports
- [ ] Simplify initialization code
- [ ] Update encryption calls
- [ ] Update decryption calls
- [ ] Add provider (React/Vue) if using frameworks
- [ ] Test all encrypted operations
- [ ] Update tests
- [ ] Update documentation

---

## Troubleshooting

### Issue: "Module not found"

**Solution:** Ensure correct import path
```typescript
// ✅ Correct
import { createFhevmClient } from '@zama/fhevm-sdk';
import { useFhevm } from '@zama/fhevm-sdk/react';

// ❌ Wrong
import { createFhevmClient } from 'fhevm-sdk';
```

### Issue: "Client not initialized"

**Solution:** Check provider setup
```typescript
// React: Wrap with Provider
<FhevmProvider chainId={11155111}>
  <App />
</FhevmProvider>

// Vanilla: Await initialization
const client = await createFhevmClient({ chainId: 11155111 });
```

---

## Getting Help

- Check [API Reference](./api-reference.md)
- See [Examples](../examples/)
- Open [GitHub Issue](https://github.com/JacintheSchuster/fhevm-react-template/issues)

---

<div align="center">

[⬆ Back to Documentation](../README.md)

</div>
