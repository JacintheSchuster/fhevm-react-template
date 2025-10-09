# 🚀 Getting Started with Universal FHEVM SDK

Welcome to the Universal FHEVM SDK! This guide will help you get up and running in less than 10 minutes.

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js**: Version 18.x or higher
- **npm/yarn/pnpm**: Latest version
- **MetaMask**: Browser extension installed (for frontend apps)
- **Basic knowledge**: React, TypeScript, and Ethereum basics

---

## 📦 Installation

### Option 1: npm

```bash
npm install @zama/fhevm-sdk
```

### Option 2: yarn

```bash
yarn add @zama/fhevm-sdk
```

### Option 3: pnpm

```bash
pnpm add @zama/fhevm-sdk
```

---

## 🎯 Quick Start (< 10 Lines)

### Step 1: Create Client

```typescript
import { createFhevmClient } from '@zama/fhevm-sdk';

// Initialize FHEVM client
const fhevm = await createFhevmClient({
  chainId: 11155111, // Sepolia testnet
});
```

### Step 2: Encrypt Data

```typescript
// Encrypt a number
const encrypted = await fhevm.encryptUint32(1000);
```

### Step 3: Use in Contract

```typescript
// Submit encrypted value to your smart contract
await contract.submitValue(encrypted);
```

### Step 4: Decrypt Results

```typescript
// Decrypt encrypted result from contract
const value = await fhevm.decryptUint32(
  contractAddress,
  encryptedResult
);

console.log('Decrypted value:', value); // 1000
```

**That's it! 🎉 You've successfully used FHEVM encryption in 4 steps.**

---

## 🔧 Framework-Specific Setup

### React / Next.js

#### 1. Install Dependencies

```bash
npm install @zama/fhevm-sdk react@^18.0.0
```

#### 2. Wrap App with Provider

```typescript
// app/layout.tsx (Next.js 13+)
import { FhevmProvider } from '@zama/fhevm-sdk/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

#### 3. Use Hooks in Components

```typescript
// app/page.tsx
import { useEncrypt, useDecrypt } from '@zama/fhevm-sdk/react';

export default function HomePage() {
  const { encrypt32, isEncrypting } = useEncrypt();
  const { decrypt32, isDecrypting } = useDecrypt();

  const handleSubmit = async () => {
    const encrypted = await encrypt32(1000);
    await contract.submitValue(encrypted);
  };

  return (
    <button onClick={handleSubmit} disabled={isEncrypting}>
      {isEncrypting ? 'Encrypting...' : 'Submit Encrypted Value'}
    </button>
  );
}
```

---

### Vue 3

#### 1. Install Dependencies

```bash
npm install @zama/fhevm-sdk vue@^3.3.0
```

#### 2. Setup Plugin

```typescript
// main.ts
import { createApp } from 'vue';
import { createFhevmPlugin } from '@zama/fhevm-sdk/vue';
import App from './App.vue';

const app = createApp(App);

app.use(createFhevmPlugin({
  chainId: 11155111,
}));

app.mount('#app');
```

#### 3. Use Composables

```vue
<script setup>
import { useFhevm, useEncrypt } from '@zama/fhevm-sdk/vue';

const { isReady } = useFhevm();
const { encrypt32, isEncrypting } = useEncrypt();

async function submit() {
  const encrypted = await encrypt32(1000);
  // Use encrypted value
}
</script>

<template>
  <div>
    <button @click="submit" :disabled="isEncrypting || !isReady">
      {{ isEncrypting ? 'Encrypting...' : 'Submit' }}
    </button>
  </div>
</template>
```

---

### Node.js (Backend)

#### 1. Install Dependencies

```bash
npm install @zama/fhevm-sdk ethers
```

#### 2. Initialize Client

```typescript
import { createFhevmClient } from '@zama/fhevm-sdk';

const fhevm = await createFhevmClient({
  chainId: 11155111,
  rpcUrl: 'https://sepolia.infura.io/v3/YOUR_KEY',
  privateKey: process.env.PRIVATE_KEY, // Optional for server-side
});
```

#### 3. Use in API

```typescript
import express from 'express';

const app = express();

app.post('/encrypt', async (req, res) => {
  const { value } = req.body;

  // Encrypt value
  const encrypted = await fhevm.encryptUint32(value);

  res.json({
    encrypted: Buffer.from(encrypted).toString('hex'),
  });
});

app.listen(3000);
```

---

## 🌐 Configuration Options

### Basic Configuration

```typescript
const fhevm = await createFhevmClient({
  chainId: 11155111,  // Required: Network chain ID
});
```

### Advanced Configuration

```typescript
const fhevm = await createFhevmClient({
  chainId: 11155111,              // Required: Network chain ID
  rpcUrl: 'https://...',          // Optional: Custom RPC endpoint
  privateKey: 'your_private_key', // Optional: For server-side usage
  gatewayUrl: 'https://...',      // Optional: Custom gateway URL
  aclAddress: '0x...',            // Optional: Custom ACL contract
  enableCache: true,              // Optional: Cache encrypted values (default: true)
});
```

---

## 📚 Common Operations

### Encrypting Different Types

```typescript
// Encrypt uint8 (0-255)
const enc8 = await fhevm.encryptUint8(42);

// Encrypt uint16 (0-65535)
const enc16 = await fhevm.encryptUint16(1000);

// Encrypt uint32 (0-4294967295)
const enc32 = await fhevm.encryptUint32(1000000);

// Encrypt uint64 (BigInt)
const enc64 = await fhevm.encryptUint64(1000000000n);

// Encrypt boolean
const encBool = await fhevm.encryptBool(true);

// Encrypt address
const encAddr = await fhevm.encryptAddress('0x...');
```

### Decrypting Values

```typescript
// Decrypt uint32
const value = await fhevm.decryptUint32(
  contractAddress,
  encryptedValue
);

// Decrypt boolean
const boolValue = await fhevm.decryptBool(
  contractAddress,
  encryptedBool
);

// Batch decrypt
const values = await fhevm.decryptBatch(
  contractAddress,
  [enc1, enc2, enc3]
);
```

### Working with Contracts

```typescript
// Get contract instance
const contract = await fhevm.getContract({
  address: '0x...',
  abi: [...],
  signer: ethersProvider.getSigner(),
});

// Call contract function
await contract.submitEncryptedValue(encrypted);

// Read encrypted state
const encryptedBalance = await contract.getBalance(userAddress);
```

---

## 🔍 Troubleshooting

### Issue: "FHEVM not initialized"

**Solution**: Make sure to await the client creation:

```typescript
// ❌ Wrong
const fhevm = createFhevmClient({ chainId: 11155111 });

// ✅ Correct
const fhevm = await createFhevmClient({ chainId: 11155111 });
```

### Issue: "Provider not found"

**Solution**: Ensure MetaMask is installed and connected:

```typescript
if (!window.ethereum) {
  alert('Please install MetaMask');
  return;
}

const fhevm = await createFhevmClient({ chainId: 11155111 });
```

### Issue: "Signer required for decryption"

**Solution**: Provide a signer when creating the client:

```typescript
import { ethers } from 'ethers';

const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

const fhevm = await createFhevmClient({
  chainId: 11155111,
  privateKey: await signer.getPrivate(), // For decryption
});
```

---

## 📖 Next Steps

Now that you have the SDK set up, explore:

1. **[API Reference](./api-reference.md)** - Complete method documentation
2. **[React Guide](./frameworks/react.md)** - In-depth React integration
3. **[Vue Guide](./frameworks/vue.md)** - Vue 3 usage patterns
4. **[Examples](../examples/)** - Real-world applications
5. **[Best Practices](./best-practices.md)** - Security and optimization tips

---

## 💬 Get Help

- **GitHub Issues**: [Report bugs or request features](#)
- **Discord**: [Join our community](#)
- **Documentation**: [Full docs](./api-reference.md)
- **Examples**: [See working code](../examples/)

---

## ✅ Checklist

Before moving to production, ensure:

- [ ] SDK initialized successfully
- [ ] Encryption and decryption work
- [ ] Contract integration tested
- [ ] Error handling implemented
- [ ] Loading states managed
- [ ] TypeScript types checked
- [ ] Test coverage adequate
- [ ] Security review done

---

**You're all set! Start building confidential applications with FHEVM. 🚀**
