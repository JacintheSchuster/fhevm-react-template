# Universal FHEVM SDK - Next.js Example

This is a comprehensive example demonstrating how to integrate the **Universal FHEVM SDK** into a Next.js 14+ application with full encryption, decryption, and smart contract interaction capabilities.

## Features Demonstrated

- **🔐 Encryption**: Client-side encryption of various data types (uint8, uint16, uint32, uint64, bool)
- **🔓 Decryption**: Secure decryption via Zama gateway integration
- **📝 Contract Interaction**: Submitting encrypted values to smart contracts
- **🌐 Gateway Management**: Direct interaction with the Zama gateway for decryption requests
- **⚡ React Hooks**: Using FHEVM hooks in Next.js components
- **🎨 RainbowKit Integration**: Wallet connection with RainbowKit
- **📱 Responsive UI**: Beautiful, responsive interface with Tailwind CSS

## Quick Start

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Configure Environment

Create a `.env.local` file:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

Get a free project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/).

### 3. Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
nextjs/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Main page component
│   ├── providers.tsx       # FHEVM & Wagmi providers
│   └── globals.css         # Global styles
├── components/
│   ├── StatusIndicator.tsx        # SDK status display
│   ├── EncryptionDemo.tsx         # Encryption demonstration
│   ├── DecryptionDemo.tsx         # Decryption demonstration
│   ├── ContractInteractionDemo.tsx # Contract interaction
│   └── GatewayDemo.tsx            # Gateway integration
├── lib/
│   └── fhevm.ts           # FHEVM utilities and config
├── next.config.js         # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies
```

## SDK Integration Guide

### 1. Setup Providers

Wrap your app with the `FhevmProvider`:

```tsx
// app/providers.tsx
import { FhevmProvider } from '@zama/fhevm-sdk/react';

export function Providers({ children }) {
  return (
    <FhevmProvider
      chainId={11155111}
      gatewayUrl="https://gateway.zama.ai"
      enableCache={true}
    >
      {children}
    </FhevmProvider>
  );
}
```

### 2. Use Hooks in Components

```tsx
// components/MyComponent.tsx
'use client';

import { useFhevm, useEncrypt, useDecrypt } from '@zama/fhevm-sdk/react';

export function MyComponent() {
  const { isReady, error } = useFhevm();
  const { encrypt32, isEncrypting } = useEncrypt();
  const { decrypt32, isDecrypting } = useDecrypt();

  const handleEncrypt = async () => {
    const encrypted = await encrypt32(1000);
    // Use encrypted value...
  };

  return (
    <div>
      <button onClick={handleEncrypt} disabled={!isReady}>
        Encrypt Value
      </button>
    </div>
  );
}
```

### 3. Contract Interaction

```tsx
import { useEncrypt } from '@zama/fhevm-sdk/react';
import { ethers } from 'ethers';

export function ContractExample() {
  const { encrypt32 } = useEncrypt();

  const submitToContract = async () => {
    // Encrypt value
    const encrypted = await encrypt32(1000);

    // Get contract
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(address, abi, signer);

    // Submit encrypted value
    const tx = await contract.submitValue(encrypted);
    await tx.wait();
  };

  return <button onClick={submitToContract}>Submit</button>;
}
```

## Available Hooks

### `useFhevm()`

Access FHEVM SDK status and client instance.

```tsx
const { isReady, isLoading, error, client, chainId } = useFhevm();
```

### `useEncrypt()`

Encrypt values of different types.

```tsx
const { encrypt8, encrypt16, encrypt32, encrypt64, encryptBool, encryptAddress, isEncrypting, error } = useEncrypt();
```

### `useDecrypt()`

Decrypt encrypted values via gateway.

```tsx
const { decrypt8, decrypt16, decrypt32, decrypt64, decryptBool, isDecrypting, error } = useDecrypt();
```

### `useContract()`

Interact with smart contracts with FHE support.

```tsx
const { contract, call, read, write, isLoading, error } = useContract({
  address: '0x...',
  abi: [...],
});
```

### `useGateway()`

Direct gateway interaction for advanced use cases.

```tsx
const { requestDecryption, waitForDecryption, getStatus, isPending, error } = useGateway();
```

## Components Overview

### EncryptionDemo

Demonstrates client-side encryption of various data types with performance metrics.

### DecryptionDemo

Shows how to decrypt encrypted values from smart contracts using the gateway.

### ContractInteractionDemo

Complete example of submitting encrypted values to a smart contract.

### GatewayDemo

Advanced gateway usage including request tracking and status checking.

## Building for Production

```bash
npm run build
npm start
```

## Deployment

This app can be deployed to Vercel, Netlify, or any platform that supports Next.js.

### Vercel (Recommended)

```bash
vercel deploy
```

### Environment Variables

Make sure to set these environment variables in your deployment:

- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: Your WalletConnect project ID

## Network Configuration

This example is configured for **Sepolia Testnet**:

- Chain ID: `11155111`
- Gateway: `https://gateway.zama.ai`
- RPC: Sepolia RPC endpoint

To use a different network, update the configuration in `app/providers.tsx` and `lib/fhevm.ts`.

## Troubleshooting

### Webpack Errors

If you encounter webpack errors, ensure your `next.config.js` includes the proper fallbacks:

```js
webpack: (config) => {
  config.resolve.fallback = { fs: false, net: false, tls: false };
  config.externals.push('pino-pretty', 'encoding');
  return config;
};
```

### RainbowKit Issues

Make sure you have a valid WalletConnect Project ID set in your environment variables.

### SDK Not Ready

The SDK requires a connection to the blockchain. Ensure:
1. Your wallet is connected
2. You're on the correct network (Sepolia)
3. The RPC endpoint is accessible

## Learn More

- [Universal FHEVM SDK Documentation](../../README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Zama FHEVM Documentation](https://docs.zama.ai/fhevm)
- [RainbowKit Documentation](https://www.rainbowkit.com/)

## License

MIT
