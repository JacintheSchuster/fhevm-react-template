# Troubleshooting Guide

Common issues and solutions when using Universal FHEVM SDK.

---

## Installation Issues

### Issue: npm install fails

**Error:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solutions:**

1. **Use legacy peer deps:**
```bash
npm install --legacy-peer-deps @zama/fhevm-sdk
```

2. **Clear cache and retry:**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

3. **Update npm:**
```bash
npm install -g npm@latest
```

---

## Initialization Issues

### Issue: "FHEVM client not initialized"

**Symptoms:**
- `useFhevm()` returns `isReady: false`
- Encryption/decryption fails
- Console shows initialization errors

**Solutions:**

1. **Check provider placement:**
```typescript
// ✅ Correct: At root level
<FhevmProvider chainId={11155111}>
  <App />
</FhevmProvider>

// ❌ Wrong: Inside component
function MyComponent() {
  return <FhevmProvider>...</FhevmProvider>
}
```

2. **Verify chain ID:**
```typescript
// Use correct chain ID for your network
const client = await createFhevmClient({
  chainId: 11155111 // Sepolia testnet
});
```

3. **Check RPC endpoint:**
```typescript
const client = await createFhevmClient({
  chainId: 11155111,
  rpcUrl: 'https://sepolia.infura.io/v3/YOUR_KEY' // Valid RPC
});
```

---

## Encryption Issues

### Issue: Encryption fails with "Invalid value"

**Error:**
```
Error: Value out of range for uint32
```

**Solutions:**

1. **Validate input range:**
```typescript
// uint8: 0 to 255
// uint16: 0 to 65535
// uint32: 0 to 4294967295
// uint64: 0 to 2^64-1

if (value < 0 || value > 4294967295) {
  throw new Error('Value out of range for uint32');
}
```

2. **Use correct type:**
```typescript
// ❌ Wrong: Using uint8 for large value
await encrypt.uint8(1000); // Fails! Max is 255

// ✅ Correct: Use uint32
await encrypt.uint32(1000);
```

### Issue: "Cannot read property 'encrypt' of null"

**Cause:** FHEVM client not ready

**Solution:**
```typescript
function Component() {
  const { isReady } = useFhevm();
  const { encrypt32 } = useEncrypt();

  if (!isReady) {
    return <div>Loading FHEVM...</div>;
  }

  // Now safe to use encrypt32
  return <button onClick={() => encrypt32(100)}>Encrypt</button>;
}
```

---

## Decryption Issues

### Issue: Decryption returns wrong value

**Cause:** Decrypting with wrong type

**Solution:**
```typescript
// Match encryption type with decryption type
const encrypted = await encrypt.uint32(1000);

// ✅ Correct: Same type
const decrypted = await decrypt.uint32(contractAddress, encrypted);

// ❌ Wrong: Different type
const decrypted = await decrypt.uint8(contractAddress, encrypted);
```

### Issue: "Unauthorized to decrypt"

**Cause:** Address doesn't have decryption permission

**Solution:**
```solidity
// In your smart contract, grant permission
function getData() public view returns (euint32) {
    euint32 value = encryptedValues[msg.sender];
    TFHE.allow(value, msg.sender); // Grant permission
    return value;
}
```

---

## React Issues

### Issue: "Invalid hook call"

**Error:**
```
Error: Invalid hook call. Hooks can only be called inside the body of a function component.
```

**Solutions:**

1. **Check provider wrapping:**
```typescript
// Ensure component is inside provider
<FhevmProvider chainId={11155111}>
  <ComponentUsingHooks /> {/* ✅ */}
</FhevmProvider>

<ComponentUsingHooks /> {/* ❌ Outside provider */}
```

2. **Don't call hooks conditionally:**
```typescript
// ❌ Wrong: Conditional hook
function Component() {
  if (condition) {
    const { encrypt32 } = useEncrypt(); // Error!
  }
}

// ✅ Correct: Always call
function Component() {
  const { encrypt32 } = useEncrypt();
  if (condition) {
    // Use encrypt32
  }
}
```

### Issue: "Rendered more hooks than during previous render"

**Cause:** Hooks called conditionally or in loops

**Solution:**
```typescript
// ❌ Wrong
function Component({ showEncryption }) {
  if (showEncryption) {
    const { encrypt32 } = useEncrypt();
  }
}

// ✅ Correct
function Component({ showEncryption }) {
  const { encrypt32 } = useEncrypt();

  if (!showEncryption) {
    return null;
  }

  // Use encrypt32
}
```

---

## Contract Interaction Issues

### Issue: "Transaction reverted"

**Causes & Solutions:**

1. **Incorrect encrypted data format:**
```typescript
// ✅ Correct: Use encrypted bytes directly
const encrypted = await encrypt.uint32(1000);
await contract.submitValue(encrypted);

// ❌ Wrong: Converting to hex string
await contract.submitValue(Buffer.from(encrypted).toString('hex'));
```

2. **Missing proof for reencryption:**
```typescript
// If contract requires proof
const { encrypted, proof } = await encrypt.uint32WithProof(1000);
await contract.submitValueWithProof(encrypted, proof);
```

3. **Gas limit too low:**
```typescript
const tx = await contract.submitValue(encrypted, {
  gasLimit: 500000 // Increase gas limit
});
```

### Issue: "Insufficient funds"

**Solution:**
```typescript
// Check balance before transaction
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const balance = await provider.getBalance(await signer.getAddress());

if (balance < ethers.parseEther('0.01')) {
  throw new Error('Insufficient funds. Please add ETH to your wallet.');
}
```

---

## Network Issues

### Issue: "Network request failed"

**Solutions:**

1. **Check RPC endpoint:**
```typescript
// Test RPC connection
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const blockNumber = await provider.getBlockNumber();
console.log('Connected! Current block:', blockNumber);
```

2. **Use fallback RPC:**
```typescript
const RPC_URLS = [
  'https://sepolia.infura.io/v3/YOUR_KEY',
  'https://rpc.sepolia.org',
  'https://ethereum-sepolia.publicnode.com'
];

async function getProvider() {
  for (const url of RPC_URLS) {
    try {
      const provider = new ethers.JsonRpcProvider(url);
      await provider.getBlockNumber();
      return provider;
    } catch (error) {
      continue;
    }
  }
  throw new Error('All RPC endpoints failed');
}
```

3. **Implement retry logic:**
```typescript
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error('Max retries exceeded');
}

// Usage
const encrypted = await withRetry(() => encrypt.uint32(1000));
```

---

## TypeScript Issues

### Issue: Type errors with Uint8Array

**Error:**
```typescript
Type 'Uint8Array' is not assignable to type 'BytesLike'
```

**Solution:**
```typescript
// Cast to BytesLike
import { ethers } from 'ethers';

const encrypted: Uint8Array = await encrypt.uint32(1000);
const bytesLike = encrypted as ethers.BytesLike;
await contract.submitValue(bytesLike);

// Or use ethers.hexlify
await contract.submitValue(ethers.hexlify(encrypted));
```

### Issue: "Cannot find module '@zama/fhevm-sdk'"

**Solutions:**

1. **Check import path:**
```typescript
// ✅ Correct
import { createFhevmClient } from '@zama/fhevm-sdk';
import { useFhevm } from '@zama/fhevm-sdk/react';

// ❌ Wrong
import { createFhevmClient } from 'fhevm-sdk';
```

2. **Add to tsconfig.json:**
```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true
  }
}
```

---

## Performance Issues

### Issue: Slow encryption

**Solutions:**

1. **Enable caching:**
```typescript
const client = await createFhevmClient({
  chainId: 11155111,
  enableCache: true,
  cacheSize: 1000
});
```

2. **Use batch operations:**
```typescript
// Batch decrypt for better performance
const values = await decrypt.batch(contractAddress, [enc1, enc2, enc3]);
```

3. **Debounce user input:**
```typescript
import { debounce } from 'lodash';

const debouncedEncrypt = debounce(async (value: number) => {
  const encrypted = await encrypt.uint32(value);
  // Process encrypted value
}, 500);
```

---

## Build Issues

### Issue: Build fails with "Cannot resolve module"

**Solution for Next.js:**

```javascript
// next.config.js
module.exports = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};
```

**Solution for Vite:**

```javascript
// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@zama/fhevm-sdk': '@zama/fhevm-sdk/dist/index.js'
    }
  }
});
```

---

## Browser Compatibility

### Issue: "Buffer is not defined"

**Solution:**
```typescript
// Install buffer polyfill
npm install buffer

// Add to your entry file
import { Buffer } from 'buffer';
window.Buffer = Buffer;
```

### Issue: Works in development but fails in production

**Solution:**
```typescript
// Check for window object
if (typeof window !== 'undefined') {
  // Browser-only code
  const provider = new ethers.BrowserProvider(window.ethereum);
}

// Or use dynamic import
const encryptValue = async (value: number) => {
  if (typeof window === 'undefined') {
    throw new Error('Browser environment required');
  }

  const { createFhevmClient } = await import('@zama/fhevm-sdk');
  const client = await createFhevmClient({ chainId: 11155111 });
  return await client.encrypt.uint32(value);
};
```

---

## Debugging Tips

### Enable Debug Logging

```typescript
// Set debug mode
localStorage.setItem('DEBUG', 'fhevm:*');

// Or via environment
process.env.DEBUG = 'fhevm:*';
```

### Check FHEVM Status

```typescript
import { useFhevm } from '@zama/fhevm-sdk/react';

function DebugInfo() {
  const { client, isReady, isLoading, error, chainId } = useFhevm();

  return (
    <div>
      <div>Chain ID: {chainId}</div>
      <div>Ready: {isReady ? 'Yes' : 'No'}</div>
      <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
      <div>Error: {error?.message || 'None'}</div>
      <div>Client: {client ? 'Initialized' : 'Not initialized'}</div>
    </div>
  );
}
```

### Test Encryption/Decryption

```typescript
async function testFhevm() {
  console.log('Testing FHEVM...');

  const client = await createFhevmClient({ chainId: 11155111 });
  console.log('✅ Client initialized');

  const value = 1000;
  const encrypted = await client.encrypt.uint32(value);
  console.log('✅ Encryption successful:', encrypted);

  // Note: Decryption requires contract address
  // const decrypted = await client.decrypt.uint32(contractAddress, encrypted);
  // console.log('✅ Decryption successful:', decrypted);
}
```

---

## Getting Help

If you can't find a solution:

1. **Check Examples**: Review working examples in `examples/` directory
2. **Search Issues**: Look for similar issues on [GitHub](https://github.com/JacintheSchuster/fhevm-react-template/issues)
3. **Create Issue**: Open a new issue with:
   - Error message
   - Code snippet
   - Environment details (OS, Node version, browser)
   - Steps to reproduce

---

<div align="center">

[⬆ Back to Documentation](../README.md)

</div>
