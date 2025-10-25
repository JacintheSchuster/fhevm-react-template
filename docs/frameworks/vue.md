# Vue Guide

Complete guide for using Universal FHEVM SDK with Vue 3.

---

## Table of Contents

- [Installation](#installation)
- [Setup](#setup)
- [Composables](#composables)
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

### Plugin Setup

Install the FHEVM plugin in your Vue app:

```typescript
// src/main.ts
import { createApp } from 'vue';
import { createFhevmPlugin } from '@zama/fhevm-sdk/vue';
import App from './App.vue';

const app = createApp(App);

app.use(createFhevmPlugin({
  chainId: 11155111,
  enableCache: true
}));

app.mount('#app');
```

### Plugin Configuration

```typescript
app.use(createFhevmPlugin({
  chainId: 11155111,
  rpcUrl: 'https://sepolia.infura.io/v3/YOUR_KEY',
  gatewayUrl: 'https://gateway.zama.ai',
  enableCache: true,
  cacheSize: 1000
}));
```

---

## Composables

### useFhevm()

Access FHEVM client and status.

```vue
<script setup lang="ts">
import { useFhevm } from '@zama/fhevm-sdk/vue';

const { client, isReady, isLoading, error, chainId } = useFhevm();
</script>

<template>
  <div>
    <div v-if="isLoading">Initializing FHEVM...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else-if="isReady">Connected to chain {{ chainId }}</div>
  </div>
</template>
```

### useEncrypt()

Encrypt data with Vue composables.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useEncrypt } from '@zama/fhevm-sdk/vue';

const { encrypt32, encrypt8, isEncrypting, error } = useEncrypt();
const value = ref(0);
const encrypted = ref<Uint8Array | null>(null);

async function handleEncrypt() {
  try {
    encrypted.value = await encrypt32(value.value);
  } catch (err) {
    console.error('Encryption failed:', err);
  }
}
</script>

<template>
  <div>
    <input
      v-model.number="value"
      type="number"
      :disabled="isEncrypting"
    />
    <button @click="handleEncrypt" :disabled="isEncrypting">
      {{ isEncrypting ? 'Encrypting...' : 'Encrypt' }}
    </button>
    <div v-if="error">Error: {{ error.message }}</div>
    <div v-if="encrypted">
      Encrypted: {{ Buffer.from(encrypted).toString('hex') }}
    </div>
  </div>
</template>
```

### useDecrypt()

Decrypt data with Vue composables.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useDecrypt } from '@zama/fhevm-sdk/vue';

const props = defineProps<{
  contractAddress: string;
  encryptedValue: Uint8Array;
}>();

const { decrypt32, isDecrypting, error } = useDecrypt();
const decrypted = ref<number | null>(null);

async function handleDecrypt() {
  try {
    decrypted.value = await decrypt32(props.contractAddress, props.encryptedValue);
  } catch (err) {
    console.error('Decryption failed:', err);
  }
}
</script>

<template>
  <div>
    <button @click="handleDecrypt" :disabled="isDecrypting">
      {{ isDecrypting ? 'Decrypting...' : 'Decrypt' }}
    </button>
    <div v-if="error">Error: {{ error.message }}</div>
    <div v-if="decrypted !== null">Decrypted: {{ decrypted }}</div>
  </div>
</template>
```

### useContract()

Interact with FHE contracts.

```vue
<script setup lang="ts">
import { useContract } from '@zama/fhevm-sdk/vue';
import contractAbi from './abi.json';

const { contract, call, read, isLoading, error } = useContract({
  address: '0x...',
  abi: contractAbi
});

async function handleSubmit() {
  const tx = await call('submitValue', [encryptedValue]);
  await tx.wait();
}

async function handleRead() {
  const result = await read('getValue', []);
  console.log('Value:', result);
}
</script>

<template>
  <div>
    <button @click="handleSubmit" :disabled="isLoading">Submit</button>
    <button @click="handleRead" :disabled="isLoading">Read</button>
    <div v-if="error">Error: {{ error.message }}</div>
  </div>
</template>
```

---

## Common Patterns

### Form with Encryption

```vue
<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useEncrypt } from '@zama/fhevm-sdk/vue';
import { ethers } from 'ethers';

const { encrypt32, encrypt8, isEncrypting } = useEncrypt();

const formData = reactive({
  value: 0,
  priority: 1
});

const status = ref('');

async function handleSubmit() {
  try {
    status.value = 'Encrypting...';

    const encValue = await encrypt32(formData.value);
    const encPriority = await encrypt8(formData.priority);

    status.value = 'Submitting to contract...';

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(address, abi, signer);

    const tx = await contract.submitData(encValue, encPriority);

    status.value = 'Waiting for confirmation...';
    await tx.wait();

    status.value = 'Success!';
  } catch (err: any) {
    status.value = `Error: ${err.message}`;
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label>Value:</label>
      <input
        v-model.number="formData.value"
        type="number"
        :disabled="isEncrypting"
      />
    </div>

    <div>
      <label>Priority:</label>
      <select
        v-model.number="formData.priority"
        :disabled="isEncrypting"
      >
        <option :value="1">Low</option>
        <option :value="2">Medium</option>
        <option :value="3">High</option>
      </select>
    </div>

    <button type="submit" :disabled="isEncrypting">
      {{ isEncrypting ? 'Processing...' : 'Submit' }}
    </button>

    <div v-if="status">{{ status }}</div>
  </form>
</template>
```

### Loading States

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { useFhevm, useEncrypt } from '@zama/fhevm-sdk/vue';

const { isReady, isLoading, error } = useFhevm();
const { isEncrypting } = useEncrypt();

const statusMessage = computed(() => {
  if (error.value) return `Error: ${error.value.message}`;
  if (isLoading.value) return 'Initializing...';
  if (isEncrypting.value) return 'Encrypting...';
  if (isReady.value) return 'Ready';
  return 'Unknown';
});
</script>

<template>
  <div class="status">
    {{ statusMessage }}
  </div>
</template>
```

### Error Handling

```vue
<script setup lang="ts">
import { ref, watch } from 'vue';
import { useEncrypt } from '@zama/fhevm-sdk/vue';

const { encrypt32, error } = useEncrypt();
const localError = ref<string | null>(null);

watch(error, (newError) => {
  if (newError) {
    console.error('FHEVM Error:', newError.message);
  }
});

async function handleEncrypt(value: number) {
  try {
    localError.value = null;
    const encrypted = await encrypt32(value);
    return encrypted;
  } catch (err) {
    localError.value = err instanceof Error ? err.message : 'Unknown error';
    return null;
  }
}
</script>

<template>
  <div>
    <div v-if="error || localError" class="error">
      Error: {{ error?.message || localError }}
    </div>
  </div>
</template>
```

---

## Best Practices

### 1. Plugin Registration

Register plugin at app level:

```typescript
// ✅ Good: At app level
const app = createApp(App);
app.use(createFhevmPlugin({ chainId: 11155111 }));
app.mount('#app');

// ❌ Bad: Multiple registrations
// Don't register plugin in components
```

### 2. Reactive References

Use Vue's reactivity system properly:

```vue
<script setup>
import { ref, computed } from 'vue';
import { useEncrypt } from '@zama/fhevm-sdk/vue';

// ✅ Good: Use ref for reactive values
const value = ref(0);
const { encrypt32 } = useEncrypt();

// ✅ Good: Use computed for derived values
const isValid = computed(() => value.value > 0);
</script>
```

### 3. Conditional Rendering

Check `isReady` before operations:

```vue
<script setup>
import { useFhevm, useEncrypt } from '@zama/fhevm-sdk/vue';

const { isReady } = useFhevm();
const { encrypt32 } = useEncrypt();
</script>

<template>
  <div v-if="isReady">
    <!-- Safe to use FHEVM operations -->
  </div>
  <div v-else>
    Loading...
  </div>
</template>
```

### 4. TypeScript Support

Use TypeScript for type safety:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useEncrypt } from '@zama/fhevm-sdk/vue';
import type { Ref } from 'vue';

const { encrypt32 }: {
  encrypt32: (value: number) => Promise<Uint8Array>
} = useEncrypt();

const encrypted: Ref<Uint8Array | null> = ref(null);
</script>
```

### 5. Watchers for Side Effects

Use watchers for reactive side effects:

```vue
<script setup>
import { ref, watch } from 'vue';
import { useEncrypt } from '@zama/fhevm-sdk/vue';

const { encrypt32, error } = useEncrypt();
const showError = ref(false);

watch(error, (newError) => {
  if (newError) {
    showError.value = true;
    setTimeout(() => {
      showError.value = false;
    }, 5000);
  }
});
</script>
```

---

## Examples

### Complete Component Example

```vue
<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useFhevm, useEncrypt } from '@zama/fhevm-sdk/vue';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = '0x...';
const CONTRACT_ABI = [...];

const { isReady, error: fhevmError } = useFhevm();
const { encrypt32, encrypt8, isEncrypting, error: encryptError } = useEncrypt();

const formData = reactive({
  amount: 0,
  priority: 1
});

const status = ref('');

const hasError = computed(() => !!(fhevmError.value || encryptError.value));
const errorMessage = computed(() =>
  fhevmError.value?.message || encryptError.value?.message || ''
);

async function handleSubmit() {
  if (!isReady.value) {
    status.value = 'FHEVM not ready';
    return;
  }

  try {
    status.value = 'Encrypting...';

    const encAmount = await encrypt32(formData.amount);
    const encPriority = await encrypt8(formData.priority);

    status.value = 'Submitting to contract...';

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    const tx = await contract.submitData(encAmount, encPriority);

    status.value = 'Waiting for confirmation...';
    await tx.wait();

    status.value = 'Success!';

    // Reset form
    formData.amount = 0;
    formData.priority = 1;
  } catch (err: any) {
    status.value = `Error: ${err.message}`;
  }
}
</script>

<template>
  <div class="encrypted-form">
    <h2>Submit Encrypted Data</h2>

    <div v-if="hasError" class="error">
      {{ errorMessage }}
    </div>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="amount">Amount:</label>
        <input
          id="amount"
          v-model.number="formData.amount"
          type="number"
          :disabled="isEncrypting"
          min="0"
        />
      </div>

      <div class="form-group">
        <label for="priority">Priority:</label>
        <select
          id="priority"
          v-model.number="formData.priority"
          :disabled="isEncrypting"
        >
          <option :value="1">Low</option>
          <option :value="2">Medium</option>
          <option :value="3">High</option>
        </select>
      </div>

      <button
        type="submit"
        :disabled="!isReady || isEncrypting"
        class="submit-btn"
      >
        {{ isEncrypting ? 'Processing...' : 'Submit' }}
      </button>
    </form>

    <div v-if="status" class="status">
      {{ status }}
    </div>
  </div>
</template>

<style scoped>
.encrypted-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.error {
  padding: 10px;
  background: #fee;
  color: #c00;
  border-radius: 4px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.submit-btn {
  width: 100%;
  padding: 10px;
  background: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.status {
  margin-top: 20px;
  padding: 10px;
  background: #efe;
  border-radius: 4px;
}
</style>
```

### Composition with Other Libraries

```vue
<script setup lang="ts">
import { ref, watch } from 'vue';
import { useEncrypt } from '@zama/fhevm-sdk/vue';
import { useWallet } from '@/composables/wallet';
import { useNotification } from '@/composables/notification';

const { address, isConnected } = useWallet();
const { showSuccess, showError } = useNotification();
const { encrypt32, isEncrypting } = useEncrypt();

const value = ref(0);

watch(isConnected, (connected) => {
  if (connected) {
    showSuccess('Wallet connected!');
  }
});

async function handleEncrypt() {
  if (!isConnected.value) {
    showError('Please connect wallet first');
    return;
  }

  try {
    const encrypted = await encrypt32(value.value);
    showSuccess('Value encrypted successfully!');
    return encrypted;
  } catch (err: any) {
    showError(`Encryption failed: ${err.message}`);
  }
}
</script>

<template>
  <div>
    <div v-if="!isConnected">
      <p>Please connect your wallet</p>
    </div>
    <div v-else>
      <input v-model.number="value" type="number" />
      <button @click="handleEncrypt" :disabled="isEncrypting">
        Encrypt
      </button>
    </div>
  </div>
</template>
```

---

<div align="center">

[⬆ Back to Documentation](../README.md)

</div>
