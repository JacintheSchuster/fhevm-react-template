# Contributing to Universal FHEVM SDK

Thank you for your interest in contributing to the Universal FHEVM SDK! This document provides guidelines and instructions for contributing to this project.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for everyone. We pledge to make participation in our project a harassment-free experience for all, regardless of age, body size, disability, ethnicity, gender identity, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behaviors include:**

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behaviors include:**

- Trolling, insulting comments, or personal attacks
- Public or private harassment
- Publishing private information without permission
- Other conduct which could reasonably be considered inappropriate

---

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Git** for version control
- **TypeScript** knowledge
- **Blockchain** development experience (helpful)

### First Contribution

If this is your first contribution:

1. Star the repository ⭐
2. Fork the repository
3. Clone your fork locally
4. Set up the development environment
5. Look for issues labeled `good first issue` or `help wanted`

---

## Development Setup

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/fhevm-react-template.git
cd fhevm-react-template

# Add upstream remote
git remote add upstream https://github.com/JacintheSchuster/fhevm-react-template.git
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install SDK dependencies
cd packages/fhevm-sdk
npm install

# Install example dependencies (optional)
cd ../../examples/logistics-optimizer
npm install
```

### 3. Build the SDK

```bash
cd packages/fhevm-sdk
npm run build
```

### 4. Run Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### 5. Start Development Server

```bash
# Run logistics optimizer example
cd examples/logistics-optimizer
npm run dev
```

---

## Project Structure

```
fhevm-react-template/
├── packages/
│   └── fhevm-sdk/              # Main SDK package
│       ├── src/
│       │   ├── core/           # Framework-agnostic core
│       │   │   ├── client.ts   # FHEVM client
│       │   │   ├── encrypt.ts  # Encryption utilities
│       │   │   └── decrypt.ts  # Decryption utilities
│       │   ├── react/          # React hooks
│       │   │   └── index.tsx   # Hooks implementation
│       │   ├── vue/            # Vue composables
│       │   ├── types/          # TypeScript definitions
│       │   └── index.ts        # Main exports
│       ├── tests/              # Test files
│       ├── package.json
│       └── tsconfig.json
├── examples/
│   ├── logistics-optimizer/    # Production example
│   ├── nextjs/                 # Next.js template
│   ├── react/                  # React template
│   ├── vue/                    # Vue template
│   └── nodejs/                 # Node.js template
├── docs/                       # Documentation
└── README.md
```

---

## How to Contribute

### Types of Contributions

We welcome various types of contributions:

1. **Bug Fixes** - Fix issues in existing code
2. **Features** - Add new functionality
3. **Documentation** - Improve or add documentation
4. **Tests** - Add or improve test coverage
5. **Examples** - Create new example applications
6. **Performance** - Optimize existing code
7. **Refactoring** - Improve code structure

### Contribution Workflow

1. **Find or Create an Issue**
   - Check existing issues
   - Create new issue if needed
   - Get assignment or approval

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

3. **Make Changes**
   - Write code following our standards
   - Add tests for new functionality
   - Update documentation

4. **Test Your Changes**
   ```bash
   npm run build
   npm test
   npm run lint
   ```

5. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

6. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create Pull Request**
   - Go to GitHub
   - Create PR from your branch to `main`
   - Fill out PR template
   - Link related issues

---

## Coding Standards

### TypeScript Guidelines

```typescript
// ✅ Good: Use explicit types
function encryptValue(value: number): Promise<Uint8Array> {
  return encrypt.uint32(value);
}

// ❌ Bad: Avoid 'any' type
function encryptValue(value: any): any {
  return encrypt.uint32(value);
}

// ✅ Good: Use interfaces for objects
interface EncryptConfig {
  chainId: number;
  rpcUrl?: string;
}

// ✅ Good: Use JSDoc comments
/**
 * Encrypts a uint32 value using FHEVM
 * @param value - The number to encrypt (0 to 2^32-1)
 * @returns Encrypted value as Uint8Array
 */
async function encryptUint32(value: number): Promise<Uint8Array> {
  // Implementation
}
```

### Code Style

- **Indentation**: 2 spaces
- **Quotes**: Single quotes for strings
- **Semicolons**: Required
- **Line Length**: Max 100 characters
- **Naming Conventions**:
  - camelCase for variables and functions
  - PascalCase for classes and types
  - UPPER_CASE for constants

### File Organization

```typescript
// 1. Imports (external, then internal)
import { ethers } from 'ethers';
import { createInstance } from 'fhevmjs';

import { FhevmConfig } from '../types';
import { encrypt } from './encrypt';

// 2. Types and interfaces
interface ClientConfig {
  chainId: number;
}

// 3. Constants
const DEFAULT_TIMEOUT = 30000;

// 4. Main code
export class FhevmClient {
  // Implementation
}

// 5. Helper functions
function validateConfig(config: ClientConfig): boolean {
  // Implementation
}
```

---

## Testing Guidelines

### Test Structure

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { createFhevmClient } from '../src';

describe('FhevmClient', () => {
  let client: FhevmClient;

  beforeEach(async () => {
    client = await createFhevmClient({ chainId: 11155111 });
  });

  it('should encrypt uint32 values', async () => {
    const encrypted = await client.encrypt.uint32(1000);
    expect(encrypted).toBeInstanceOf(Uint8Array);
    expect(encrypted.length).toBeGreaterThan(0);
  });

  it('should throw error for invalid values', async () => {
    await expect(client.encrypt.uint32(-1)).rejects.toThrow();
  });
});
```

### Test Coverage Requirements

- **Minimum Coverage**: 80% overall
- **New Features**: 90% coverage required
- **Critical Paths**: 100% coverage required

### Running Tests

```bash
# All tests
npm test

# Specific file
npm test -- encrypt.test.ts

# With coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

---

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Commit Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements

### Examples

```bash
# Feature
git commit -m "feat(core): add uint64 encryption support"

# Bug fix
git commit -m "fix(react): resolve hook dependency issue"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Breaking change
git commit -m "feat(api): change encrypt API signature

BREAKING CHANGE: encrypt functions now return Promise<EncryptedValue>"
```

---

## Pull Request Process

### Before Submitting

- [ ] Code builds without errors
- [ ] All tests pass
- [ ] Test coverage meets requirements
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] Commit messages follow convention
- [ ] Branch is up to date with main

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How was this tested?

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Review Process

1. **Automated Checks**: CI/CD pipeline runs tests
2. **Code Review**: Maintainer reviews code
3. **Feedback**: Address review comments
4. **Approval**: Maintainer approves PR
5. **Merge**: PR merged to main branch

### After Merge

- Delete your feature branch
- Update your local repository
- Close related issues

---

## Reporting Bugs

### Before Reporting

- Check existing issues
- Verify bug in latest version
- Gather reproduction steps

### Bug Report Template

```markdown
**Description**
Clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Install SDK
2. Run code...
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS: [e.g., Windows 11]
- Node.js: [e.g., 18.0.0]
- SDK Version: [e.g., 1.0.0]

**Additional Context**
Screenshots, logs, etc.
```

---

## Feature Requests

### Before Requesting

- Check existing feature requests
- Ensure it aligns with project goals
- Consider implementation complexity

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
Clear description of the problem

**Describe the solution you'd like**
What you want to happen

**Describe alternatives you've considered**
Other solutions you've thought about

**Additional context**
Any other context or screenshots
```

---

## Documentation Contributions

### Documentation Types

- **README**: Project overview and quick start
- **API Docs**: Complete API reference
- **Guides**: Step-by-step tutorials
- **Examples**: Working code examples

### Documentation Standards

- Write in clear, simple English
- Include code examples
- Keep examples up to date
- Test all code snippets
- Use proper markdown formatting

---

## Community

### Communication Channels

- **GitHub Issues**: Bug reports and features
- **GitHub Discussions**: Questions and ideas
- **Pull Requests**: Code contributions

### Getting Help

If you need help:

1. Check documentation
2. Search existing issues
3. Create new issue with details
4. Be patient and respectful

---

## Recognition

Contributors will be:

- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Acknowledged in documentation

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## Questions?

If you have questions about contributing:

1. Check this guide
2. Review existing contributions
3. Ask in GitHub Discussions
4. Contact maintainers

---

<div align="center">

**Thank you for contributing to Universal FHEVM SDK!**

Your contributions help make confidential smart contracts accessible to every developer.

[⬆ Back to Top](#contributing-to-universal-fhevm-sdk)

</div>
