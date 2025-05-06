# Package Creation Guide

**Last Updated:** Monday, May 05, 2025 at 07:38:08 PM

This guide provides step-by-step instructions for creating new packages in the Djentronome monorepo.

## Prerequisites

- pnpm installed (v9.0.0+)
- Djentronome repository cloned
- Initial dependencies installed (`pnpm install` at the root)

## Creating a New Package

### 1. Create the Package Directory

```bash
mkdir -p packages/[package-name]/src
```

Replace `[package-name]` with the name of your package, using kebab-case (e.g., `audio-decoder`, `game-controller`).

### 2. Create the Package Structure

Create the following files:

#### package.json

```json
{
  "name": "@djentronome/[package-name]",
  "version": "0.1.0",
  "main": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./types": "./src/types/index.ts"
  },
  "license": "MIT",
  "scripts": {
    "clean": "git clean -xdf .turbo node_modules",
    "format": "prettier --check \"**/*.{ts,tsx}\"",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:unit": "vitest run --config @kit/testing/unit",
    "test:integration": "vitest run --config @kit/testing/integration",
    "test:e2e": "vitest run --config @kit/testing/e2e",
    "test:e2e:browser": "playwright test --config @kit/testing/playwright"
  },
  "devDependencies": {
    "@kit/tsconfig": "workspace:*",
    "@kit/eslint-config": "workspace:*",
    "@kit/prettier-config": "workspace:*",
    "@kit/testing": "workspace:*",
    "vitest": "^0.34.0"
  },
  "eslintConfig": {
    "root": true,
    "extends": [
      "@kit/eslint-config/base"
    ]
  },
  "prettier": "@kit/prettier-config"
}
```

#### tsconfig.json

```json
{
  "extends": "@kit/tsconfig/base",
  "compilerOptions": {
    "tsBuildInfoFile": "node_modules/.cache/tsbuildinfo.json",
    "baseUrl": "."
  },
  "include": ["*.ts", "*.tsx", "*.css", "src", "src/**/*.d.ts", "*.d.ts"],
  "exclude": ["node_modules"]
}
```

#### src/index.ts

```typescript
// Export your package's public API here

export * from './types';
```

#### src/types/index.ts

```typescript
// Define and export your package's types here

export interface YourType {
  // Properties...
}
```

### 3. Create Testing Directory Structure (Optional)

If your package requires testing beyond unit tests:

```bash
mkdir -p packages/[package-name]/testing/{integration,e2e}
```

### 4. Install Dependencies

```bash
pnpm install
```

### 5. Update Root README (if necessary)

If your package introduces a significant new capability, you may want to update the root README.md to mention it.

## Adding Dependencies to Your Package

### Adding External Dependencies

```bash
pnpm add [package-name] --filter @djentronome/[your-package-name]
```

### Adding Internal Dependencies

Edit your package.json to include other workspace packages:

```json
"dependencies": {
  "@djentronome/[other-package]": "workspace:*"
}
```

Then run:

```bash
pnpm install
```

## Creating Tests

### Unit Tests

Create test files in the `src` directory, alongside the files being tested:

```
src/
  feature.ts
  feature.test.ts
```

Run unit tests:

```bash
pnpm test:unit --filter @djentronome/[package-name]
```

### Integration Tests

For tests that involve multiple packages:

```
testing/
  integration/
    feature-integration.test.ts
```

Run integration tests:

```bash
pnpm test:integration --filter @djentronome/[package-name]
```

### E2E Tests

For end-to-end tests:

```
testing/
  e2e/
    feature-flow.test.ts
```

Run e2e tests:

```bash
pnpm test:e2e --filter @djentronome/[package-name]
```

## Best Practices

1. **Keep Packages Focused**: Each package should serve a specific purpose and have clearly defined responsibilities.

2. **Minimize External Dependencies**: Favor internal workspace dependencies over external ones when possible.

3. **Document Public APIs**: Add JSDoc comments to exported functions, classes, and interfaces.

4. **Maintain Test Coverage**: Ensure adequate test coverage for your package's functionality.

5. **Respect Semantic Versioning**: When updating packages, follow semantic versioning principles.