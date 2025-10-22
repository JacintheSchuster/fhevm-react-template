# Best Practices

Security, performance, and optimization guidelines for Universal FHEVM SDK.

---

## Security Best Practices

### 1. Private Key Management

**❌ Never hardcode private keys:**
```typescript
// DON'T DO THIS
const client = await createFhevmClient({
  privateKey: '0x1234567890abcdef...'
});
```

**✅ Use environment variables:**
```typescript
const client = await createFhevmClient({
  chainId: 11155111,
  privateKey: process.env.PRIVATE_KEY
});
```

### 2. Input Validation

**Always validate before encrypting:**
```typescript
function validateAndEncrypt(value: number) {
  // Validate range
  if (value < 0 || value > 4294967295) {
    throw new Error('Value out of range for uint32');
  }

  // Validate type
  if (!Number.isInteger(value)) {
    throw new Error('Value must be an integer');
  }

  return encrypt.uint32(value);
}
```

### 3. Error Handling

**Implement comprehensive error handling:**
```typescript
try {
  const encrypted = await encrypt.uint32(value);
  const tx = await contract.submitValue(encrypted);
  await tx.wait();
} catch (error) {
  if (error.code === 'INSUFFICIENT_FUNDS') {
    alert('Insufficient funds for transaction');
  } else if (error.message.includes('user rejected')) {
    alert('Transaction rejected by user');
  } else {
    console.error('Unexpected error:', error);
    alert('Transaction failed. Please try again.');
  }
}
```

### 4. Access Control

**Verify user permissions:**
```typescript
async function submitEncryptedData(value: number) {
  // Check wallet connection
  if (!window.ethereum) {
    throw new Error('No wallet detected');
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  // Check contract permissions
  const hasPermission = await contract.hasPermission(address);
  if (!hasPermission) {
    throw new Error('User not authorized');
  }

  // Proceed with encryption
  const encrypted = await encrypt.uint32(value);
  // ...
}
```

---

## Performance Optimization

### 1. Enable Caching

**Cache encrypted values to avoid re-encryption:**
```typescript
const client = await createFhevmClient({
  chainId: 11155111,
  enableCache: true,
  cacheSize: 1000 // Adjust based on your needs
});
```

### 2. Batch Operations

**Use batch decryption for multiple values:**
```typescript
// ❌ Slow: Multiple individual calls
const val1 = await decrypt.uint32(address, enc1);
const val2 = await decrypt.uint32(address, enc2);
const val3 = await decrypt.uint32(address, enc3);

// ✅ Fast: Single batch call
const [val1, val2, val3] = await decrypt.batch(address, [enc1, enc2, enc3]);
```

### 3. Lazy Initialization

**Initialize FHEVM client only when needed:**
```typescript
let clientCache: FhevmClient | null = null;

async function getFhevmClient() {
  if (!clientCache) {
    clientCache = await createFhevmClient({ chainId: 11155111 });
  }
  return clientCache;
}
```

### 4. Memoization (React)

**Memoize expensive computations:**
```typescript
import { useMemo, useCallback } from 'react';
import { useEncrypt } from '@zama/fhevm-sdk/react';

function OptimizedComponent() {
  const { encrypt32 } = useEncrypt();

  const handleEncrypt = useCallback(async (value: number) => {
    return await encrypt32(value);
  }, [encrypt32]);

  const config = useMemo(() => ({
    chainId: 11155111,
    enableCache: true
  }), []);

  return <div>...</div>;
}
```

---

## Code Organization

### 1. Separation of Concerns

**Separate encryption logic from UI:**
```typescript
// lib/fhevm.ts - Encryption utilities
export async function encryptRouteData(route: RouteData) {
  const client = await getFhevmClient();
  return {
    encStartX: await client.encrypt.uint32(route.startX),
    encStartY: await client.encrypt.uint32(route.startY),
    encEndX: await client.encrypt.uint32(route.endX),
    encEndY: await client.encrypt.uint32(route.endY)
  };
}

// components/RouteForm.tsx - UI component
function RouteForm() {
  const handleSubmit = async (route: RouteData) => {
    const encrypted = await encryptRouteData(route);
    await submitToContract(encrypted);
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### 2. Custom Hooks (React)

**Create reusable custom hooks:**
```typescript
// hooks/useEncryptedSubmit.ts
export function useEncryptedSubmit(contractAddress: string) {
  const { encrypt32, encrypt8 } = useEncrypt();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = useCallback(async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const encrypted = {
        value: await encrypt32(data.value),
        priority: await encrypt8(data.priority)
      };

      const contract = getContract(contractAddress);
      const tx = await contract.submit(encrypted.value, encrypted.priority);
      await tx.wait();

      return { success: true };
    } catch (error) {
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  }, [encrypt32, encrypt8, contractAddress]);

  return { submit, isSubmitting };
}
```

### 3. Type Safety

**Define comprehensive types:**
```typescript
// types/fhevm.ts
export interface EncryptedRoute {
  encStartX: Uint8Array;
  encStartY: Uint8Array;
  encEndX: Uint8Array;
  encEndY: Uint8Array;
  encPriority: Uint8Array;
}

export interface DecryptedRoute {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  priority: number;
}

// Usage with type safety
async function encryptRoute(route: DecryptedRoute): Promise<EncryptedRoute> {
  return {
    encStartX: await encrypt.uint32(route.startX),
    encStartY: await encrypt.uint32(route.startY),
    encEndX: await encrypt.uint32(route.endX),
    encEndY: await encrypt.uint32(route.endY),
    encPriority: await encrypt.uint8(route.priority)
  };
}
```

---

## Testing Best Practices

### 1. Mock FHEVM Client

**Mock for unit tests:**
```typescript
// __mocks__/@zama/fhevm-sdk.ts
export const createFhevmClient = jest.fn().mockResolvedValue({
  encrypt: {
    uint32: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
    uint8: jest.fn().mockResolvedValue(new Uint8Array([4, 5]))
  },
  decrypt: {
    uint32: jest.fn().mockResolvedValue(1000)
  }
});
```

### 2. Integration Tests

**Test with real FHEVM instance:**
```typescript
describe('Encryption Integration', () => {
  let client: FhevmClient;

  beforeAll(async () => {
    client = await createFhevmClient({ chainId: 11155111 });
  });

  it('should encrypt and decrypt uint32', async () => {
    const value = 1000;
    const encrypted = await client.encrypt.uint32(value);

    expect(encrypted).toBeInstanceOf(Uint8Array);
    expect(encrypted.length).toBeGreaterThan(0);
  });
});
```

---

## Smart Contract Best Practices

### 1. Gas Optimization

**Minimize encrypted operations:**
```solidity
// ✅ Good: Single encrypted comparison
function isEligible(euint32 encAge) public view returns (bool) {
    return TFHE.decrypt(TFHE.ge(encAge, TFHE.asEuint32(18)));
}

// ❌ Bad: Multiple encrypted operations
function processAge(euint32 encAge) public {
    bool isAdult = TFHE.decrypt(TFHE.ge(encAge, TFHE.asEuint32(18)));
    bool isSenior = TFHE.decrypt(TFHE.ge(encAge, TFHE.asEuint32(65)));
    // Process...
}
```

### 2. Access Control

**Implement proper ACL checks:**
```solidity
import "fhevm/lib/TFHE.sol";

contract SecureVault {
    mapping(address => euint32) private balances;

    function getBalance() public view returns (euint32) {
        // Allow only owner to decrypt
        TFHE.allow(balances[msg.sender], msg.sender);
        return balances[msg.sender];
    }
}
```

---

## Production Checklist

### Before Deployment

- [ ] Enable caching for performance
- [ ] Implement comprehensive error handling
- [ ] Add input validation
- [ ] Set up monitoring and logging
- [ ] Test with real encrypted data
- [ ] Review smart contract gas usage
- [ ] Verify access control mechanisms
- [ ] Set up environment variables
- [ ] Configure RPC endpoints
- [ ] Test wallet connection flows

### Security Audit

- [ ] No hardcoded keys
- [ ] Input validation in place
- [ ] Error messages don't leak sensitive data
- [ ] Access control verified
- [ ] Dependencies audited
- [ ] Rate limiting implemented (API)
- [ ] HTTPS enforced
- [ ] CORS configured properly

---

## Common Pitfalls

### 1. Not Checking isReady

**❌ Wrong:**
```typescript
function Component() {
  const { encrypt32 } = useEncrypt();

  // encrypt32 might not be ready!
  const handleClick = () => encrypt32(100);
}
```

**✅ Correct:**
```typescript
function Component() {
  const { isReady } = useFhevm();
  const { encrypt32 } = useEncrypt();

  const handleClick = () => {
    if (!isReady) {
      alert('Please wait...');
      return;
    }
    encrypt32(100);
  };
}
```

### 2. Ignoring Errors

**❌ Wrong:**
```typescript
const encrypted = await encrypt.uint32(value);
await contract.submit(encrypted);
```

**✅ Correct:**
```typescript
try {
  const encrypted = await encrypt.uint32(value);
  const tx = await contract.submit(encrypted);
  const receipt = await tx.wait();

  if (receipt.status === 0) {
    throw new Error('Transaction failed');
  }
} catch (error) {
  console.error('Operation failed:', error);
  // Handle error appropriately
}
```

### 3. Memory Leaks (React)

**❌ Wrong:**
```typescript
useEffect(() => {
  const interval = setInterval(async () => {
    const encrypted = await encrypt32(value);
    // Process...
  }, 1000);
  // Missing cleanup!
});
```

**✅ Correct:**
```typescript
useEffect(() => {
  const interval = setInterval(async () => {
    const encrypted = await encrypt32(value);
    // Process...
  }, 1000);

  return () => clearInterval(interval);
}, [encrypt32, value]);
```

---

<div align="center">

[⬆ Back to Documentation](../README.md)

</div>
