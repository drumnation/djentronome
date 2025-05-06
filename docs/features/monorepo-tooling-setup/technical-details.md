# Technical Details: Monorepo & Tooling Setup

**Last Updated:** Monday, May 05, 2025 at 07:38:08 PM

## Overview
The Monorepo & Tooling Setup feature establishes the foundational structure for the Djentronome project, implementing a TypeScript-based monorepo architecture using pnpm for package management and Turborepo for build orchestration. This approach enables efficient code sharing between packages while maintaining clear boundaries between functional domains.

## Key Design Decisions & Rationale
* **Monorepo with Clear Domain Separation**: Each package represents a specific domain (audio, graphics, game logic, etc.) with well-defined boundaries and interfaces. This approach enables teams to work on separate packages simultaneously while ensuring cohesive integration.
  * Rationale: Promotes modularity, clear separation of concerns, and facilitates targeted testing.

* **pnpm for Package Management**: Using pnpm instead of npm or yarn provides more efficient node_modules handling with content-addressable storage and strict dependency management.
  * Rationale: Reduces disk space usage, ensures consistent dependency resolution, and provides better workspace handling.

* **Turborepo for Build Orchestration**: Implementing Turborepo to manage build pipelines and task dependencies across the monorepo.
  * Rationale: Provides intelligent caching, parallel execution, and optimized build pipelines that understand dependencies between packages.

* **Standardized Package Structure**: Each package follows a consistent template with standardized configuration for TypeScript, ESLint, Prettier, and testing.
  * Rationale: Ensures consistency across the codebase, simplifies onboarding, and makes maintenance more predictable.

* **Comprehensive Testing Strategy**: Implementing multiple testing approaches (unit, integration, e2e) with shared configurations.
  * Rationale: Enables thorough validation at multiple levels while maintaining a consistent testing approach.

## Implementation Notes
* The monorepo is structured into three main workspace directories:
  * `apps/`: Contains executable applications that consume packages
  * `packages/`: Houses domain-specific libraries that export functionality
  * `tooling/`: Contains shared tooling configurations (ESLint, TypeScript, testing, etc.)

* Internal dependencies between packages use the `workspace:*` protocol to ensure consistent versioning.

* Testing is configured at multiple levels:
  * Unit tests: For isolated function/component testing
  * Integration tests: For validating interactions between packages
  * E2E tests: For full workflow validation
  * Browser tests: For UI testing with Playwright

* Package template includes standard configurations for:
  * TypeScript (extends from `@kit/tsconfig`)
  * ESLint (extends from `@kit/eslint-config`)
  * Prettier (uses `@kit/prettier-config`)
  * Testing (uses `@kit/testing` configurations)

## Usage / API
### Creating a New Package
```bash
# 1. Create the directory structure
mkdir -p packages/[package-name]/src

# 2. Copy template files (package.json, tsconfig.json)
cp -r templates/package/* packages/[package-name]/

# 3. Update package.json with the correct package name
# Edit packages/[package-name]/package.json

# 4. Install dependencies
pnpm install
```

### Common Commands
```bash
# Install dependencies
pnpm install

# Run development servers
pnpm dev

# Build all packages
pnpm build

# Run tests across all packages
pnpm test

# Run specific test type
pnpm test:unit
pnpm test:integration
pnpm test:e2e
pnpm test:e2e:browser

# Run commands for specific package
pnpm test --filter=@djentronome/[package-name]
```

## Gotchas & Known Issues
* **Dependency Hoisting**: Be careful with dependencies that require singletons (like React). While pnpm mitigates most issues, certain libraries may need special handling.

* **TypeScript Path Aliases**: When using path aliases in tsconfig.json, ensure they're consistently applied across packages and build configurations.

* **Turborepo Cache**: The cache can occasionally become stale when making changes to the build configuration. If you encounter unexpected behavior, run `pnpm clean` to clear caches.

* **Test Environment Variables**: When running tests that require environment variables, ensure they're properly set at both the package and workspace levels. 