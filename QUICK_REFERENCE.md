# ⚡ Universal FHEVM SDK - Quick Reference

> **Copy-paste examples for fast development**

---

## 📦 Installation

```bash
npm install @zama/fhevm-sdk
```

---

## 🚀 Quick Start (3 Lines)

```typescript
import { createFhevmClient } from '@zama/fhevm-sdk';

const fhevm = await createFhevmClient({ chainId: 11155111 });
const encrypted = await fhevm.encryptUint32(1000);
await contract.submitValue(encrypted);
```

---

## ⚛️ React Hooks

### Setup Provider

```typescript
import { FhevmProvider } from '@zama/fhevm-sdk/react';

<FhevmProvider chainId={11155111}>
  <App />
</FhevmProvider>
```

### Use Encryption

```typescript
import { useEncrypt } from '@zama/fhevm-sdk/react';

const { encrypt32, isEncrypting } = useEncrypt();
const encrypted = await encrypt32(1000);
```

### Use Decryption

```typescript
import { useDecrypt } from '@zama/fhevm-sdk/react';

const { decrypt32, isDecrypting } = useDecrypt();
const value = await decrypt32(contractAddress, encrypted);
```

### Use Contract

```typescript
import { useContract } from '@zama/fhevm-sdk/react';

const { contract, call, read } = useContract({
  address: '0x...',
  abi: [...],
});
```

---

## 🟢 Vue 3 Composables

### Setup Plugin

```typescript
import { createFhevmPlugin } from '@zama/fhevm-sdk/vue';

app.use(createFhevmPlugin({ chainId: 11155111 }));
```

### Use in Component

```vue
<script setup>
import { useEncrypt } from '@zama/fhevm-sdk/vue';

const { encrypt32 } = useEncrypt();
const encrypted = await encrypt32(1000);
</script>
```

---

## 🟦 TypeScript Types

```typescript
import type {
  FhevmClientConfig,
  EncryptionResult,
  UseFhevmResult,
  UseEncryptResult,
  UseDecryptResult,
} from '@zama/fhevm-sdk';
```

---

## 📝 Common Patterns

### Encrypt All Types

```typescript
const enc8 = await fhevm.encryptUint8(42);
const enc16 = await fhevm.encryptUint16(1000);
const enc32 = await fhevm.encryptUint32(1000000);
const enc64 = await fhevm.encryptUint64(1000000000n);
const encBool = await fhevm.encryptBool(true);
const encAddr = await fhevm.encryptAddress('0x...');
```

### Batch Decrypt

```typescript
const values = await fhevm.decryptBatch(
  contractAddress,
  [enc1, enc2, enc3]
);
```

### Contract Interaction

```typescript
// Get contract
const contract = await fhevm.getContract({
  address: '0x...',
  abi: [...],
  signer,
});

// Submit encrypted value
await contract.submitValue(encrypted);

// Read encrypted state
const encBalance = await contract.getBalance(user);
const balance = await fhevm.decryptUint64(contract.address, encBalance);
```

---

## 🎯 Real Example: Route Submission

```typescript
import { useEncrypt, useDecrypt } from '@zama/fhevm-sdk/react';

function RouteOptimizer() {
  const { encrypt32, encrypt8 } = useEncrypt();
  const { decrypt64 } = useDecrypt();

  // Submit route
  const submit = async () => {
    const encStartX = await encrypt32(100);
    const encStartY = await encrypt32(200);
    const encEndX = await encrypt32(500);
    const encEndY = await encrypt32(800);
    const encPriority = await encrypt8(4);

    await contract.submitRoute(
      encStartX, encStartY, encEndX, encEndY, encPriority
    );
  };

  // Get results
  const getResults = async () => {
    const route = await contract.getUserRoute(address, routeId);
    const distance = await decrypt64(
      contract.address,
      route.encOptimizedDistance
    );
    return distance;
  };
}
```

---

## ⚙️ Configuration

### Basic

```typescript
const fhevm = await createFhevmClient({
  chainId: 11155111,
});
```

### Advanced

```typescript
const fhevm = await createFhevmClient({
  chainId: 11155111,
  rpcUrl: 'https://sepolia.infura.io/v3/...',
  privateKey: process.env.PRIVATE_KEY,
  gatewayUrl: 'https://gateway.zama.ai',
  aclAddress: '0x...',
  enableCache: true,
});
```

---

## 🔍 Debugging

### Check Initialization

```typescript
const { isReady, isLoading, error } = useFhevm();

if (error) {
  console.error('FHEVM init failed:', error);
}
```

### Monitor Loading States

```typescript
const { encrypt32, isEncrypting, error } = useEncrypt();

console.log('Encrypting:', isEncrypting);
if (error) console.error('Encryption failed:', error);
```

---

## 📚 Links

- **Full Docs**: [README.md](./README.md)
- **Getting Started**: [docs/getting-started.md](./docs/getting-started.md)
- **Examples**: [examples/](./examples/)
- **Logistics App**: [examples/logistics-optimizer/](./examples/logistics-optimizer/)

---

<div align="center">

**Universal FHEVM SDK** - Making encryption simple

[⬆ Back to README](./README.md)

</div>
