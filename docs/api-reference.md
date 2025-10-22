# API Reference

Complete API documentation for Universal FHEVM SDK.

---

## Table of Contents

- [Core API](#core-api)
- [Encryption API](#encryption-api)
- [Decryption API](#decryption-api)
- [Contract API](#contract-api)
- [Gateway API](#gateway-api)
- [React Hooks](#react-hooks)
- [Vue Composables](#vue-composables)
- [Type Definitions](#type-definitions)

---

## Core API

### `createFhevmClient(config)`

Creates and initializes an FHEVM client instance.

**Parameters:**

```typescript
interface FhevmClientConfig {
  chainId: number;              // Required: Network chain ID (e.g., 11155111 for Sepolia)
  rpcUrl?: string;              // Optional: Custom RPC endpoint
  privateKey?: string;          // Optional: For server-side usage
  gatewayUrl?: string;          // Optional: Custom gateway URL
  aclAddress?: string;          // Optional: Custom ACL contract address
  enableCache?: boolean;        // Optional: Enable encryption caching (default: true)
  cacheSize?: number;           // Optional: Maximum cache size (default: 1000)
}
```

**Returns:** `Promise<FhevmClient>`

**Example:**

```typescript
import { createFhevmClient } from '@zama/fhevm-sdk';

const client = await createFhevmClient({
  chainId: 11155111,
  enableCache: true
});
```

**Throws:**
- `Error` if chainId is invalid
- `Error` if initialization fails

---

## Encryption API

### `encrypt.uint8(value)`

Encrypts an 8-bit unsigned integer.

**Parameters:**
- `value: number` - Value between 0 and 255

**Returns:** `Promise<Uint8Array>`

**Example:**

```typescript
const encrypted = await client.encrypt.uint8(42);
```

### `encrypt.uint16(value)`

Encrypts a 16-bit unsigned integer.

**Parameters:**
- `value: number` - Value between 0 and 65535

**Returns:** `Promise<Uint8Array>`

**Example:**

```typescript
const encrypted = await client.encrypt.uint16(1000);
```

### `encrypt.uint32(value)`

Encrypts a 32-bit unsigned integer.

**Parameters:**
- `value: number` - Value between 0 and 4294967295

**Returns:** `Promise<Uint8Array>`

**Example:**

```typescript
const encrypted = await client.encrypt.uint32(1000000);
```

### `encrypt.uint64(value)`

Encrypts a 64-bit unsigned integer.

**Parameters:**
- `value: bigint` - Value between 0 and 2^64-1

**Returns:** `Promise<Uint8Array>`

**Example:**

```typescript
const encrypted = await client.encrypt.uint64(1000000000000n);
```

### `encrypt.bool(value)`

Encrypts a boolean value.

**Parameters:**
- `value: boolean`

**Returns:** `Promise<Uint8Array>`

**Example:**

```typescript
const encrypted = await client.encrypt.bool(true);
```

### `encrypt.address(value)`

Encrypts an Ethereum address.

**Parameters:**
- `value: string` - Ethereum address (0x...)

**Returns:** `Promise<Uint8Array>`

**Example:**

```typescript
const encrypted = await client.encrypt.address('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');
```

### `encrypt.uint32WithProof(value)`

Encrypts a uint32 with zero-knowledge proof for contract submission.

**Parameters:**
- `value: number`

**Returns:**

```typescript
Promise<{
  encrypted: Uint8Array;
  proof: string;
}>
```

**Example:**

```typescript
const { encrypted, proof } = await client.encrypt.uint32WithProof(1000);
await contract.submitValue(encrypted, proof);
```

---

## Decryption API

### `decrypt.uint8(contractAddress, encryptedValue)`

Decrypts an encrypted uint8.

**Parameters:**
- `contractAddress: string` - Contract that owns the encrypted data
- `encryptedValue: Uint8Array` - Encrypted value

**Returns:** `Promise<number>`

**Example:**

```typescript
const value = await client.decrypt.uint8(contractAddress, encrypted);
```

### `decrypt.uint16(contractAddress, encryptedValue)`

Decrypts an encrypted uint16.

**Parameters:**
- `contractAddress: string`
- `encryptedValue: Uint8Array`

**Returns:** `Promise<number>`

### `decrypt.uint32(contractAddress, encryptedValue)`

Decrypts an encrypted uint32.

**Parameters:**
- `contractAddress: string`
- `encryptedValue: Uint8Array`

**Returns:** `Promise<number>`

### `decrypt.uint64(contractAddress, encryptedValue)`

Decrypts an encrypted uint64.

**Parameters:**
- `contractAddress: string`
- `encryptedValue: Uint8Array`

**Returns:** `Promise<bigint>`

### `decrypt.bool(contractAddress, encryptedValue)`

Decrypts an encrypted boolean.

**Parameters:**
- `contractAddress: string`
- `encryptedValue: Uint8Array`

**Returns:** `Promise<boolean>`

### `decrypt.address(contractAddress, encryptedValue)`

Decrypts an encrypted address.

**Parameters:**
- `contractAddress: string`
- `encryptedValue: Uint8Array`

**Returns:** `Promise<string>`

### `decrypt.batch(contractAddress, encryptedValues)`

Decrypts multiple values in a single call.

**Parameters:**
- `contractAddress: string`
- `encryptedValues: Uint8Array[]`

**Returns:** `Promise<Array<number | bigint | boolean | string>>`

**Example:**

```typescript
const values = await client.decrypt.batch(contractAddress, [enc1, enc2, enc3]);
```

---

## Contract API

### `getContract(config)`

Creates a contract instance with FHE support.

**Parameters:**

```typescript
interface ContractConfig {
  address: string;
  abi: any[];
  signer?: ethers.Signer;
  provider?: ethers.Provider;
}
```

**Returns:** `Promise<Contract>`

**Example:**

```typescript
const contract = await client.getContract({
  address: '0x...',
  abi: contractAbi,
  signer: await provider.getSigner()
});
```

### Contract Methods

Once you have a contract instance, you can call methods:

```typescript
// Read methods
const result = await contract.getValue();

// Write methods
const tx = await contract.setValue(encryptedValue);
await tx.wait();

// Methods with encrypted parameters
const tx = await contract.submitEncryptedValue(encrypted, proof);
```

---

## Gateway API

### `gateway.requestDecryption(contractAddress, encryptedValue)`

Requests decryption via gateway.

**Parameters:**
- `contractAddress: string`
- `encryptedValue: Uint8Array`

**Returns:** `Promise<string>` - Request ID

**Example:**

```typescript
const requestId = await client.gateway.requestDecryption(
  contractAddress,
  encryptedValue
);
```

### `gateway.waitForDecryption(requestId, timeout?)`

Waits for decryption to complete.

**Parameters:**
- `requestId: string`
- `timeout?: number` - Timeout in milliseconds (default: 30000)

**Returns:** `Promise<any>` - Decrypted value

**Example:**

```typescript
const decrypted = await client.gateway.waitForDecryption(requestId, 60000);
```

### `gateway.getStatus(requestId)`

Gets decryption request status.

**Parameters:**
- `requestId: string`

**Returns:**

```typescript
Promise<{
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: any;
  error?: string;
}>
```

---

## React Hooks

### `useFhevm()`

Hook for accessing FHEVM client and status.

**Returns:**

```typescript
{
  client: FhevmClient | null;
  isReady: boolean;
  isLoading: boolean;
  error: Error | null;
  chainId: number;
}
```

**Example:**

```typescript
function MyComponent() {
  const { isReady, error } = useFhevm();

  if (!isReady) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>Ready!</div>;
}
```

### `useEncrypt()`

Hook for encryption operations.

**Returns:**

```typescript
{
  encrypt8: (value: number) => Promise<Uint8Array>;
  encrypt16: (value: number) => Promise<Uint8Array>;
  encrypt32: (value: number) => Promise<Uint8Array>;
  encrypt64: (value: bigint) => Promise<Uint8Array>;
  encryptBool: (value: boolean) => Promise<Uint8Array>;
  encryptAddress: (value: string) => Promise<Uint8Array>;
  isEncrypting: boolean;
  error: Error | null;
}
```

**Example:**

```typescript
function EncryptForm() {
  const { encrypt32, isEncrypting } = useEncrypt();
  const [value, setValue] = useState(0);

  const handleSubmit = async () => {
    const encrypted = await encrypt32(value);
    // Use encrypted value
  };

  return (
    <button onClick={handleSubmit} disabled={isEncrypting}>
      {isEncrypting ? 'Encrypting...' : 'Encrypt'}
    </button>
  );
}
```

### `useDecrypt()`

Hook for decryption operations.

**Returns:**

```typescript
{
  decrypt8: (contractAddress: string, value: Uint8Array) => Promise<number>;
  decrypt32: (contractAddress: string, value: Uint8Array) => Promise<number>;
  decrypt64: (contractAddress: string, value: Uint8Array) => Promise<bigint>;
  decryptBool: (contractAddress: string, value: Uint8Array) => Promise<boolean>;
  isDecrypting: boolean;
  error: Error | null;
}
```

### `useContract(config)`

Hook for contract interactions.

**Parameters:**

```typescript
{
  address: string;
  abi: any[];
}
```

**Returns:**

```typescript
{
  contract: Contract | null;
  call: (method: string, args: any[]) => Promise<any>;
  read: (method: string, args: any[]) => Promise<any>;
  write: (method: string, args: any[]) => Promise<any>;
  isLoading: boolean;
  error: Error | null;
}
```

### `useGateway()`

Hook for gateway operations.

**Returns:**

```typescript
{
  requestDecryption: (contractAddress: string, value: Uint8Array) => Promise<string>;
  waitForDecryption: (requestId: string) => Promise<any>;
  getStatus: (requestId: string) => Promise<GatewayStatus>;
  isPending: boolean;
  error: Error | null;
}
```

---

## Vue Composables

### `useFhevm()`

Composable for accessing FHEVM client.

**Returns:** Same as React hook but with Vue reactivity

**Example:**

```vue
<script setup>
import { useFhevm } from '@zama/fhevm-sdk/vue';

const { isReady, error } = useFhevm();
</script>
```

### `useEncrypt()`

Composable for encryption operations.

**Returns:** Same as React hook but with Vue reactivity

### `useDecrypt()`

Composable for decryption operations.

**Returns:** Same as React hook but with Vue reactivity

---

## Type Definitions

### `FhevmClient`

```typescript
class FhevmClient {
  readonly chainId: number;
  readonly encrypt: EncryptAPI;
  readonly decrypt: DecryptAPI;
  readonly gateway: GatewayAPI;

  getContract(config: ContractConfig): Promise<Contract>;
  clearCache(): void;
}
```

### `EncryptAPI`

```typescript
interface EncryptAPI {
  uint8(value: number): Promise<Uint8Array>;
  uint16(value: number): Promise<Uint8Array>;
  uint32(value: number): Promise<Uint8Array>;
  uint64(value: bigint): Promise<Uint8Array>;
  bool(value: boolean): Promise<Uint8Array>;
  address(value: string): Promise<Uint8Array>;
  uint32WithProof(value: number): Promise<{ encrypted: Uint8Array; proof: string }>;
}
```

### `DecryptAPI`

```typescript
interface DecryptAPI {
  uint8(contractAddress: string, value: Uint8Array): Promise<number>;
  uint16(contractAddress: string, value: Uint8Array): Promise<number>;
  uint32(contractAddress: string, value: Uint8Array): Promise<number>;
  uint64(contractAddress: string, value: Uint8Array): Promise<bigint>;
  bool(contractAddress: string, value: Uint8Array): Promise<boolean>;
  address(contractAddress: string, value: Uint8Array): Promise<string>;
  batch(contractAddress: string, values: Uint8Array[]): Promise<any[]>;
}
```

### `GatewayAPI`

```typescript
interface GatewayAPI {
  requestDecryption(contractAddress: string, value: Uint8Array): Promise<string>;
  waitForDecryption(requestId: string, timeout?: number): Promise<any>;
  getStatus(requestId: string): Promise<GatewayStatus>;
}
```

---

## Error Handling

All methods can throw errors. Recommended error handling:

```typescript
try {
  const encrypted = await client.encrypt.uint32(1000);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Invalid input:', error.message);
  } else if (error instanceof NetworkError) {
    console.error('Network issue:', error.message);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

---

## Performance Considerations

### Caching

Encryption results are cached by default:

```typescript
const client = await createFhevmClient({
  chainId: 11155111,
  enableCache: true,
  cacheSize: 1000
});

// Clear cache manually
client.clearCache();
```

### Batch Operations

Use batch operations for multiple decryptions:

```typescript
// ❌ Slow: Multiple calls
const val1 = await decrypt.uint32(address, enc1);
const val2 = await decrypt.uint32(address, enc2);
const val3 = await decrypt.uint32(address, enc3);

// ✅ Fast: Single batch call
const [val1, val2, val3] = await decrypt.batch(address, [enc1, enc2, enc3]);
```

---

<div align="center">

[⬆ Back to Main README](../README.md)

</div>
