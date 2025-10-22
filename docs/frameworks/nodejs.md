# Node.js Guide

Complete guide for using Universal FHEVM SDK with Node.js and Express.

---

## Installation

```bash
npm install @zama/fhevm-sdk ethers
```

---

## Basic Setup

```typescript
// server.ts
import { createFhevmClient } from '@zama/fhevm-sdk';
import express from 'express';

const app = express();
app.use(express.json());

// Initialize FHEVM client
let fhevmClient: any;

async function initializeFhevm() {
  fhevmClient = await createFhevmClient({
    chainId: 11155111,
    rpcUrl: process.env.RPC_URL,
    privateKey: process.env.PRIVATE_KEY,
  });
  console.log('FHEVM client initialized');
}

initializeFhevm();

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

---

## Encryption API

```typescript
// Encrypt endpoint
app.post('/api/encrypt', async (req, res) => {
  try {
    const { value, type } = req.body;

    let encrypted;
    switch (type) {
      case 'uint32':
        encrypted = await fhevmClient.encrypt.uint32(value);
        break;
      case 'uint8':
        encrypted = await fhevmClient.encrypt.uint8(value);
        break;
      case 'bool':
        encrypted = await fhevmClient.encrypt.bool(value);
        break;
      default:
        return res.status(400).json({ error: 'Invalid type' });
    }

    res.json({
      encrypted: Buffer.from(encrypted).toString('hex'),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## Decryption API

```typescript
// Decrypt endpoint
app.post('/api/decrypt', async (req, res) => {
  try {
    const { contractAddress, encryptedValue, type } = req.body;

    const encryptedBuffer = Buffer.from(encryptedValue, 'hex');

    let decrypted;
    switch (type) {
      case 'uint32':
        decrypted = await fhevmClient.decrypt.uint32(
          contractAddress,
          encryptedBuffer
        );
        break;
      case 'uint8':
        decrypted = await fhevmClient.decrypt.uint8(
          contractAddress,
          encryptedBuffer
        );
        break;
      default:
        return res.status(400).json({ error: 'Invalid type' });
    }

    res.json({ decrypted });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## Contract Interaction

```typescript
import { ethers } from 'ethers';

app.post('/api/contract/submit', async (req, res) => {
  try {
    const { value } = req.body;

    // Encrypt value
    const encrypted = await fhevmClient.encrypt.uint32(value);

    // Get contract
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
    const contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS!,
      contractAbi,
      wallet
    );

    // Submit transaction
    const tx = await contract.submitValue(encrypted);
    const receipt = await tx.wait();

    res.json({
      success: true,
      txHash: receipt.hash,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## Complete Server Example

```typescript
import { createFhevmClient } from '@zama/fhevm-sdk';
import express from 'express';
import cors from 'cors';
import { ethers } from 'ethers';

const app = express();
app.use(cors());
app.use(express.json());

let fhevmClient: any;

async function initializeFhevm() {
  fhevmClient = await createFhevmClient({
    chainId: 11155111,
    rpcUrl: process.env.RPC_URL!,
    privateKey: process.env.PRIVATE_KEY!,
  });
}

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    fhevmReady: !!fhevmClient,
  });
});

// Encrypt endpoint
app.post('/api/encrypt', async (req, res) => {
  if (!fhevmClient) {
    return res.status(503).json({ error: 'FHEVM not initialized' });
  }

  const { value, type } = req.body;

  try {
    let encrypted;
    switch (type) {
      case 'uint32':
        encrypted = await fhevmClient.encrypt.uint32(value);
        break;
      case 'uint8':
        encrypted = await fhevmClient.encrypt.uint8(value);
        break;
      default:
        return res.status(400).json({ error: 'Invalid type' });
    }

    res.json({
      encrypted: Buffer.from(encrypted).toString('hex'),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Decrypt endpoint
app.post('/api/decrypt', async (req, res) => {
  if (!fhevmClient) {
    return res.status(503).json({ error: 'FHEVM not initialized' });
  }

  const { contractAddress, encryptedValue, type } = req.body;

  try {
    const buffer = Buffer.from(encryptedValue, 'hex');
    let decrypted;

    switch (type) {
      case 'uint32':
        decrypted = await fhevmClient.decrypt.uint32(contractAddress, buffer);
        break;
      default:
        return res.status(400).json({ error: 'Invalid type' });
    }

    res.json({ decrypted });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;

initializeFhevm()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize FHEVM:', error);
    process.exit(1);
  });
```

---

## Environment Variables

Create `.env` file:

```
RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
PRIVATE_KEY=your_private_key_here
CONTRACT_ADDRESS=0x...
PORT=3000
```

---

## Best Practices

### 1. Error Handling

```typescript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});
```

### 2. Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 3. Input Validation

```typescript
import { body, validationResult } from 'express-validator';

app.post(
  '/api/encrypt',
  [
    body('value').isNumeric(),
    body('type').isIn(['uint8', 'uint16', 'uint32', 'uint64']),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Process request
  }
);
```

---

<div align="center">

[⬆ Back to Documentation](../README.md)

</div>
