# 🎥 Video Demo Script for demo.mp4

**Duration**: 5 minutes
**Format**: Screen recording with voiceover
**Resolution**: 1080p MP4

---

## 📋 Demo Structure

### Part 1: Introduction (30 seconds)

**Visual**: Show main README with SDK title and badges

**Narration**:
> "Hi! Today I'm presenting the Universal FHEVM SDK - the next-generation toolkit for building confidential frontends with Zama FHEVM. This SDK makes encryption as simple as using wagmi for web3."

**Show**:
- Main README header
- Key features list
- Framework-agnostic badges

---

### Part 2: Quick Setup Demo (<10 Lines) (60 seconds)

**Visual**: VS Code with empty file → Complete working example

**Narration**:
> "Let's see how quick it is to get started. Watch as I go from zero to a working encrypted application in less than 10 lines of code."

**Show**:

```typescript
// Step 1: Install (show terminal)
npm install @zama/fhevm-sdk

// Step 2: Import and initialize (type in VS Code)
import { createFhevmClient } from '@zama/fhevm-sdk';

const fhevm = await createFhevmClient({ chainId: 11155111 });

// Step 3: Encrypt
const encrypted = await fhevm.encryptUint32(1000);

// Step 4: Use in contract
await contract.submitValue(encrypted);

// Step 5: Decrypt
const value = await fhevm.decryptUint32(contractAddress, result);

console.log('Decrypted:', value); // Output: 1000
```

**Highlight**:
- Count lines: "That's it! Just 5 lines of actual code."
- Show console output working
- Emphasize simplicity

---

### Part 3: Framework-Agnostic Demo (90 seconds)

**Visual**: Split screen showing React, Vue, and Node.js examples side-by-side

**Narration**:
> "The SDK works across all major frameworks. Here's the same encryption operation in React, Vue, and Node.js - notice how the API stays consistent."

**Show**:

**React Example**:
```typescript
import { useEncrypt } from '@zama/fhevm-sdk/react';

function MyComponent() {
  const { encrypt32 } = useEncrypt();

  const handleClick = async () => {
    const enc = await encrypt32(1000);
    await contract.submit(enc);
  };
}
```

**Vue Example**:
```vue
<script setup>
import { useEncrypt } from '@zama/fhevm-sdk/vue';

const { encrypt32 } = useEncrypt();

async function submit() {
  const enc = await encrypt32(1000);
  await contract.submit(enc);
}
</script>
```

**Node.js Example**:
```typescript
import { createFhevmClient } from '@zama/fhevm-sdk';

const fhevm = await createFhevmClient({ chainId: 11155111 });
const enc = await fhevm.encryptUint32(1000);
```

**Highlight**:
- "Same `encrypt32` method across all frameworks"
- "Choose your favorite - the SDK adapts"

---

### Part 4: Wagmi-like API Demonstration (60 seconds)

**Visual**: Compare wagmi hooks with FHEVM SDK hooks

**Narration**:
> "If you've used wagmi, you'll feel right at home. We've adopted the same hook patterns that web3 developers love."

**Show**:

**wagmi hooks**:
```typescript
import { useAccount, useBalance } from 'wagmi';

const { address } = useAccount();
const { data: balance } = useBalance({ address });
```

**FHEVM SDK hooks**:
```typescript
import { useFhevm, useEncrypt, useDecrypt } from '@zama/fhevm-sdk/react';

const { isReady } = useFhevm();
const { encrypt32, isEncrypting } = useEncrypt();
const { decrypt32, isDecrypting } = useDecrypt();
```

**Highlight**:
- Similar naming convention
- Built-in loading states
- Error handling included
- "Familiar patterns = faster adoption"

---

### Part 5: Real-World Application - Logistics Optimizer (120 seconds)

**Visual**: Live demo of Logistics Route Optimizer application

**Narration**:
> "Now let's see a production application. This is our Logistics Route Optimizer - a real-world app deployed on Sepolia that uses the SDK to encrypt delivery coordinates and calculate optimal routes without revealing sensitive data."

**Show**:

1. **Open Application** (15s)
   - Navigate to live demo URL
   - Show UI with form inputs
   - Point out "Powered by Universal FHEVM SDK" badge

2. **Submit Encrypted Route** (30s)
   ```typescript
   // Show code in inspector
   const { encrypt32, encrypt8 } = useEncrypt();

   // Encrypt coordinates
   const encStartX = await encrypt32(100);
   const encStartY = await encrypt32(200);
   const encEndX = await encrypt32(500);
   const encEndY = await encrypt32(800);
   const encPriority = await encrypt8(4);

   // Submit to contract
   await contract.submitRoute(
     encStartX, encStartY, encEndX, encEndY, encPriority
   );
   ```
   - Fill form with sample data
   - Click "Optimize Route"
   - Show MetaMask transaction
   - Point out encryption happening

3. **View Results** (30s)
   - Navigate to "My Routes"
   - Show encrypted route entry
   - Click "Decrypt"
   - Show decrypted distance and time
   ```typescript
   const { decrypt64 } = useDecrypt();
   const distance = await decrypt64(contract.address, route.encOptimizedDistance);
   ```

4. **Show Etherscan** (30s)
   - Open contract on Sepolia Etherscan
   - Show transaction with encrypted data
   - Explain "This data is encrypted on-chain"
   - Show contract verification

5. **Code Walkthrough** (15s)
   - Quick peek at source code
   - Highlight SDK integration points
   - "Less than 50 lines of encryption code"

---

### Part 6: Package Structure & Design Decisions (60 seconds)

**Visual**: File tree and architecture diagram

**Narration**:
> "Let's talk about how the SDK is structured and why we made certain design decisions."

**Show**:

1. **Package Structure** (20s)
   ```
   packages/fhevm-sdk/
   ├── src/
   │   ├── core/       ← Framework-agnostic
   │   ├── react/      ← React hooks
   │   ├── vue/        ← Vue composables
   │   └── types/      ← TypeScript definitions
   ```
   - "Core logic is framework-independent"
   - "Framework adapters add convenience"

2. **Architecture Diagram** (20s)
   ```
   Core SDK (fhevmjs + gateway + ethers)
         ↓
   Framework Adapters (React/Vue/Node)
         ↓
   Your Application
   ```
   - "One source of truth"
   - "Multiple interfaces"

3. **Design Decisions** (20s)
   - **Why framework-agnostic?** "Developers use different tools"
   - **Why wagmi-like API?** "Familiar = faster adoption"
   - **Why all-in-one package?** "No dependency hell"
   - **Why TypeScript-first?** "Catch errors at compile time"

---

### Part 7: Conclusion & Next Steps (30 seconds)

**Visual**: Summary slide with key points

**Narration**:
> "To summarize: The Universal FHEVM SDK makes building confidential applications simple, consistent, and developer-friendly. It works across all frameworks, includes complete TypeScript support, and follows familiar patterns from wagmi. You can get started in less than 10 lines of code."

**Show**:
- ✅ Quick setup (<10 lines)
- ✅ Framework-agnostic
- ✅ Wagmi-like API
- ✅ Production-ready
- ✅ Complete documentation

**Call to Action**:
> "Check out the GitHub repository, try the examples, and start building your own confidential applications today. Links in the description. Thanks for watching!"

**Show**:
- GitHub URL
- npm package URL
- Documentation URL
- Live demo URL

---

## 🎬 Recording Checklist

### Pre-Recording
- [ ] Clear browser cache and cookies
- [ ] Close unnecessary tabs and applications
- [ ] Set screen resolution to 1920x1080
- [ ] Test microphone audio quality
- [ ] Prepare sample data for live demo
- [ ] Open all necessary URLs in tabs

### During Recording
- [ ] Speak clearly and at moderate pace
- [ ] Pause between sections (easier editing)
- [ ] Show mouse cursor for important clicks
- [ ] Use zoom for small text/code
- [ ] Keep animations smooth (no lag)

### Post-Recording
- [ ] Edit out mistakes and long pauses
- [ ] Add background music (subtle, royalty-free)
- [ ] Add text overlays for key points
- [ ] Add chapter markers for navigation
- [ ] Export as MP4 1080p, 30fps
- [ ] File size target: < 100MB

---

## 📝 Key Messages to Emphasize

1. **Simplicity**: "Less than 10 lines to get started"
2. **Consistency**: "Same API across all frameworks"
3. **Familiarity**: "Wagmi-like patterns web3 devs know"
4. **Completeness**: "Full FHEVM flow: init, encrypt, decrypt, contracts"
5. **Production-Ready**: "Real app deployed on Sepolia"

---

## 🎯 Target Audience Notes

**Assume viewer is:**
- Familiar with web3 development
- May or may not know FHEVM/FHE
- Looking for quick, practical solutions
- Values clean, simple APIs
- Wants to see real examples

**Avoid:**
- Deep cryptography explanations
- Complex mathematical concepts
- Too much theory
- Jargon without context

**Focus on:**
- Developer experience
- Practical usage
- Real-world applications
- Ease of integration

---

## 📹 Production Notes

**File**: `demo.mp4`
**Location**: Root of repository
**Thumbnail**: `demo-thumbnail.png` (create catchy thumbnail with title)
**Captions**: Optional but recommended for accessibility

**Tools Recommended**:
- **Screen Recording**: OBS Studio (free, professional)
- **Video Editing**: DaVinci Resolve (free) or Adobe Premiere
- **Audio**: Audacity for cleanup
- **Thumbnail**: Figma or Canva

---

## ✅ Final Checklist

- [ ] All code examples tested and working
- [ ] Live demo accessible and functioning
- [ ] Audio clear and professional
- [ ] Video smooth with no lag
- [ ] All links shown are correct
- [ ] Duration under 6 minutes
- [ ] File size reasonable (<100MB)
- [ ] Uploaded to repository as `demo.mp4`

---

**Good luck with the recording! 🎬✨**
