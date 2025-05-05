/**
 * Skill-Jack: Playwright CI Orchestration in Turbo Repos
 * 
 * A comprehensive guide to setting up and optimizing Playwright E2E tests in CI pipelines using Turborepo.
 * 
 * @module brain-garden/skill-jack
 * @category testing/ci
 */

/**
 * Skill-Jack on Playwright CI Orchestration
 * 
 * This constant provides comprehensive guidance on understanding and implementing
 * efficient CI pipelines for Playwright E2E tests in Turborepo monorepos.
 */
export const topicGuide = {
  topic: "Playwright CI Orchestration in Turbo Repos",
  description: "A comprehensive approach to setting up, optimizing, and maintaining CI pipelines for Playwright E2E tests in Turborepo monorepos, ensuring fast, reliable, and scalable test execution across the CI environment.",
  corePrinciples: [
    {
      name: "Turborepo-Aware Test Execution",
      description: "Integrate Playwright test execution with Turborepo's pipeline model for optimal dependency handling and caching.",
      examples: [
        "Configuring Playwright tasks in turbo.json with appropriate inputs and outputs",
        "Using Turborepo's dependency graph to run tests after prerequisite build steps",
        "Setting up caching strategies specific to test artifacts and results"
      ]
    },
    {
      name: "Parallelization and Sharding",
      description: "Implement test distribution strategies to maximize test execution speed without overwhelming CI resources.",
      examples: [
        "Sharding tests across multiple CI jobs for parallel execution",
        "Balancing test load based on historical execution times",
        "Implementing Playwright's built-in sharding capabilities with Turborepo's task distribution"
      ]
    },
    {
      name: "Cross-Browser Matrix Strategy",
      description: "Efficiently manage cross-browser testing in CI to provide comprehensive coverage without excessive build times.",
      examples: [
        "Setting up browser-specific CI jobs or matrix builds",
        "Implementing selective browser testing based on affected packages",
        "Using browser distribution strategies that prevent resource contention"
      ]
    },
    {
      name: "Artifact Management",
      description: "Implement effective strategies for handling test artifacts (traces, screenshots, videos) in the CI environment.",
      examples: [
        "Setting up artifact storage and retrieval in CI",
        "Implementing conditional artifact capture to minimize storage usage",
        "Integrating artifacts with test reports and failure analysis"
      ]
    },
    {
      name: "CI-Specific Reliability Techniques",
      description: "Apply specialized techniques to improve test reliability in CI environments, where tests often behave differently than in local development.",
      examples: [
        "Implementing CI-specific timeouts and retry strategies",
        "Setting up quarantine workflows for flaky tests",
        "Using specially configured browser instances for CI environments"
      ]
    },
    {
      name: "Monorepo-Aware Test Filtering",
      description: "Run only the tests relevant to the changed packages or files, optimizing CI resources and providing faster feedback.",
      examples: [
        "Using Turborepo's dependency graph to identify affected packages",
        "Implementing test filtering based on changed files",
        "Running different test subsets based on the nature of changes"
      ]
    }
  ],
  applicationProcess: {
    description: "A structured approach to implementing effective CI orchestration for Playwright tests in Turborepo monorepos.",
    steps: [
      {
        name: "Configure Turborepo Pipeline",
        description: "Set up Playwright test tasks within the Turborepo pipeline configuration.",
        agentActions: [
          {
            action: "Define test tasks in turbo.json",
            explanation: "Configure Playwright test tasks with appropriate inputs, outputs, and dependencies."
          },
          {
            action: "Set up cache configuration",
            explanation: "Configure caching for test tasks to optimize incremental testing."
          },
          {
            action: "Establish task dependencies",
            explanation: "Ensure test tasks run after required build and setup tasks."
          }
        ]
      },
      {
        name: "Set Up CI Configuration",
        description: "Configure CI workflows to execute Playwright tests efficiently.",
        agentActions: [
          {
            action: "Create CI workflow definitions",
            explanation: "Set up GitHub Actions, CircleCI, or other CI workflows for Playwright test execution."
          },
          {
            action: "Configure environment setup",
            explanation: "Set up CI runners with required dependencies, browsers, and environment variables."
          },
          {
            action: "Implement matrix testing",
            explanation: "Configure matrix builds for different browsers, platforms, or test suites."
          }
        ]
      },
      {
        name: "Implement Test Distribution",
        description: "Set up strategies to distribute test execution across CI resources.",
        agentActions: [
          {
            action: "Configure test sharding",
            explanation: "Set up Playwright test sharding to split test execution across workers."
          },
          {
            action: "Balance test distribution",
            explanation: "Implement strategies to ensure even distribution of tests across shards."
          },
          {
            action: "Set up parallel job execution",
            explanation: "Configure CI to run test jobs in parallel where appropriate."
          }
        ]
      },
      {
        name: "Optimize for Monorepo Structure",
        description: "Tailor the CI workflow to efficiently handle the monorepo's structure and dependencies.",
        agentActions: [
          {
            action: "Implement workspace filtering",
            explanation: "Use Turborepo's filtering capabilities to run tests only for affected packages."
          },
          {
            action: "Set up dependency awareness",
            explanation: "Ensure tests for dependent packages run when dependencies change."
          },
          {
            action: "Optimize CI cache usage",
            explanation: "Configure CI caching to leverage Turborepo's caching mechanisms."
          }
        ]
      },
      {
        name: "Configure Artifact Management",
        description: "Set up systems to handle test artifacts effectively in CI.",
        agentActions: [
          {
            action: "Configure CI artifact storage",
            explanation: "Set up artifact storage and retrieval in the CI platform."
          },
          {
            action: "Implement conditional artifact capture",
            explanation: "Capture traces, screenshots, and videos only when needed."
          },
          {
            action: "Set up artifact organization",
            explanation: "Organize artifacts by test, package, and browser for easy access."
          }
        ]
      },
      {
        name: "Implement Reliability Measures",
        description: "Add features to improve test reliability in the CI environment.",
        agentActions: [
          {
            action: "Set up CI-specific configuration",
            explanation: "Add configuration overrides specific to the CI environment."
          },
          {
            action: "Implement retry strategies",
            explanation: "Configure test retries and quarantine mechanisms for flaky tests."
          },
          {
            action: "Add CI-specific logging",
            explanation: "Enhance logging and debugging information for CI test runs."
          }
        ]
      }
    ]
  },
  examples: {
    description: "Practical examples of Playwright CI orchestration in Turborepo environments.",
    useCases: [
      {
        scenario: "Monorepo with shared UI components and multiple apps",
        implementation: "Setting up Playwright tests that run on affected apps when shared components change, using Turborepo's dependency graph to determine which apps to test.",
        outcome: "Tests run automatically for all affected apps when shared components change, without running tests for unaffected apps, improving CI efficiency."
      },
      {
        scenario: "Cross-browser testing in a large application",
        implementation: "Implementing a matrix build that shards tests by browser, with critical-path tests running on all browsers and non-critical tests running only on Chromium.",
        outcome: "Comprehensive cross-browser coverage with optimized CI resources, prioritizing critical features while maintaining reasonable build times."
      },
      {
        scenario: "Large test suite with performance concerns",
        implementation: "Setting up test sharding across multiple CI workers with load balancing based on historical test execution times.",
        outcome: "Dramatically reduced test execution time, with even distribution of test load across workers and consistent CI feedback times."
      },
      {
        scenario: "Flaky test management in continuous deployment pipeline",
        implementation: "Implementing a quarantine workflow that isolates flaky tests, allows them to run with higher retry counts, and maintains a separate report of flakiness trends.",
        outcome: "Prevents flaky tests from blocking deployment while maintaining visibility into test quality and enabling systematic flakiness reduction."
      }
    ]
  },
  codeExamples: [
    {
      language: "json",
      description: "Turborepo configuration for Playwright tests",
      code: `
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": [".env"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"],
      "inputs": [
        "src/**/*.tsx",
        "src/**/*.ts",
        "test/**/*.ts",
        "test/**/*.tsx"
      ],
      "outputMode": "full"
    },
    "test:e2e": {
      "dependsOn": ["^build"],
      "inputs": [
        "src/**/*.tsx",
        "src/**/*.ts",
        "e2e/**/*.ts",
        "playwright.config.ts"
      ],
      "outputs": [
        "playwright-report/**",
        "test-results/**"
      ],
      "cache": true,
      "outputMode": "full"
    },
    "test:e2e:ui": {
      "dependsOn": ["^build"],
      "cache": false,
      "outputMode": "full"
    },
    "test:e2e:chromium": {
      "dependsOn": ["^build"],
      "inputs": [
        "src/**/*.tsx",
        "src/**/*.ts",
        "e2e/**/*.ts",
        "playwright.config.ts"
      ],
      "outputs": [
        "playwright-report/**",
        "test-results/**"
      ],
      "cache": true,
      "outputMode": "full"
    },
    "test:e2e:firefox": {
      "dependsOn": ["^build"],
      "inputs": [
        "src/**/*.tsx",
        "src/**/*.ts",
        "e2e/**/*.ts",
        "playwright.config.ts"
      ],
      "outputs": [
        "playwright-report/**",
        "test-results/**"
      ],
      "cache": true,
      "outputMode": "full"
    },
    "test:e2e:webkit": {
      "dependsOn": ["^build"],
      "inputs": [
        "src/**/*.tsx",
        "src/**/*.ts",
        "e2e/**/*.ts",
        "playwright.config.ts"
      ],
      "outputs": [
        "playwright-report/**",
        "test-results/**"
      ],
      "cache": true,
      "outputMode": "full"
    },
    "lint": {
      "outputs": []
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
`,
      explanation: "This example demonstrates a Turborepo configuration that includes tasks for Playwright E2E tests. It defines separate tasks for different browsers (chromium, firefox, webkit) and includes appropriate input/output definitions for caching. The configuration ensures that tests run after the build step and captures test results as outputs for storage and review."
    },
    {
      language: "yaml",
      description: "GitHub Actions workflow for Playwright tests in a Turborepo",
      code: `
# .github/workflows/e2e-tests.yml
name: E2E Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  detect-changes:
    runs-on: ubuntu-latest
    outputs:
      affected_apps: ${{ steps.filter.outputs.affected_apps }}
      should_run_all: ${{ steps.filter.outputs.should_run_all }}
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - name: Check for changes affecting all tests
        id: filter
        uses: dorny/paths-filter@v2
        with:
          filters: |
            shared_deps:
              - 'packages/ui/**'
              - 'packages/core/**'
              - 'package.json'
              - 'pnpm-lock.yaml'
              - 'turbo.json'
            app1:
              - 'apps/app1/**'
            app2:
              - 'apps/app2/**'
        
      - name: Determine affected apps
        id: determine-apps
        run: |
          ALL_APPS="app1,app2"
          AFFECTED=""
          
          if [[ "${{ steps.filter.outputs.shared_deps }}" == "true" ]]; then
            echo "Changes to shared deps - testing all apps"
            echo "should_run_all=true" >> $GITHUB_OUTPUT
            echo "affected_apps=$ALL_APPS" >> $GITHUB_OUTPUT
          else
            if [[ "${{ steps.filter.outputs.app1 }}" == "true" ]]; then
              AFFECTED="${AFFECTED},app1"
            fi
            if [[ "${{ steps.filter.outputs.app2 }}" == "true" ]]; then
              AFFECTED="${AFFECTED},app2"
            fi
            
            AFFECTED=$(echo $AFFECTED | sed 's/^,//')
            
            if [[ -z "$AFFECTED" ]]; then
              echo "No apps affected, running app1 as default"
              AFFECTED="app1"
            fi
            
            echo "should_run_all=false" >> $GITHUB_OUTPUT
            echo "affected_apps=$AFFECTED" >> $GITHUB_OUTPUT
          fi

  install:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Cache node_modules
        uses: actions/cache@v3
        id: cache-node-modules
        with:
          path: |
            node_modules
            */*/node_modules
          key: ${{ runner.os }}-node-modules-${{ hashFiles('**/pnpm-lock.yaml') }}

  build:
    needs: install
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Restore node_modules
        uses: actions/cache@v3
        with:
          path: |
            node_modules
            */*/node_modules
          key: ${{ runner.os }}-node-modules-${{ hashFiles('**/pnpm-lock.yaml') }}
      
      - name: Build
        run: pnpm turbo build
      
      - name: Cache Turbo
        uses: actions/cache@v3
        with:
          path: .turbo
          key: ${{ runner.os }}-turbo-${{ github.sha }}
          restore-keys: |
            ${{ runner.os }}-turbo-

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-artifacts
          path: |
            apps/*/dist
            packages/*/dist
            !**/node_modules
          retention-days: 1

  playwright-tests:
    needs: [detect-changes, build]
    strategy:
      fail-fast: false
      matrix:
        app: ${{ fromJSON(format('[{0}]', needs.detect-changes.outputs.affected_apps)) }}
        shardIndex: [1, 2, 3, 4]
        shardTotal: [4]
        browser: [chromium]
        # Only run Firefox and WebKit on main branch to save CI resources
        include:
          - app: app1
            shardIndex: 1
            shardTotal: 2
            browser: firefox
            filter: '@critical'
          - app: app1
            shardIndex: 1
            shardTotal: 2
            browser: webkit
            filter: '@critical'
        
    runs-on: ubuntu-latest
    
    defaults:
      run:
        working-directory: apps/${{ matrix.app }}
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Restore node_modules
        uses: actions/cache@v3
        with:
          path: |
            node_modules
            */*/node_modules
          key: ${{ runner.os }}-node-modules-${{ hashFiles('**/pnpm-lock.yaml') }}
      
      - name: Restore Turbo cache
        uses: actions/cache@v3
        with:
          path: .turbo
          key: ${{ runner.os }}-turbo-${{ github.sha }}
          restore-keys: |
            ${{ runner.os }}-turbo-
      
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-artifacts
      
      - name: Install Playwright Browsers
        run: pnpm exec playwright install --with-deps ${{ matrix.browser }}
      
      - name: Run Playwright tests
        env:
          CI: true
          TEST_SHARD_INDEX: ${{ matrix.shardIndex }}
          TEST_SHARD_TOTAL: ${{ matrix.shardTotal }}
          PLAYWRIGHT_BROWSER: ${{ matrix.browser }}
          PLAYWRIGHT_FILTER: ${{ matrix.filter || '' }}
        run: |
          ARGS="--project=${{ matrix.browser }}"
          if [ ! -z "$PLAYWRIGHT_FILTER" ]; then
            ARGS="$ARGS --grep=$PLAYWRIGHT_FILTER"
          fi
          pnpm test:e2e $ARGS --shard=$TEST_SHARD_INDEX/$TEST_SHARD_TOTAL
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report-${{ matrix.app }}-${{ matrix.browser }}-${{ matrix.shardIndex }}
          path: apps/${{ matrix.app }}/playwright-report/
          retention-days: 30
      
      - name: Upload test traces
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: test-traces-${{ matrix.app }}-${{ matrix.browser }}-${{ matrix.shardIndex }}
          path: apps/${{ matrix.app }}/test-results/
          retention-days: 7

  report-results:
    if: always()
    needs: playwright-tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Download all test reports
        uses: actions/download-artifact@v3
        with:
          path: reports
          pattern: playwright-report-*
      
      - name: Merge reports
        run: |
          npm init -y
          npm i -D playwright-merge-reports
          npx playwright-merge-reports ./reports ./merged-report
      
      - name: Upload merged report
        uses: actions/upload-artifact@v3
        with:
          name: playwright-merged-report
          path: merged-report
          retention-days: 30
      
      - name: Post summary
        run: |
          echo "## E2E Test Results" >> $GITHUB_STEP_SUMMARY
          
          if [ -f "./merged-report/summary.json" ]; then
            # Extract stats from summary.json
            TOTAL=$(jq '.total' ./merged-report/summary.json)
            PASSED=$(jq '.passed' ./merged-report/summary.json)
            FAILED=$(jq '.failed' ./merged-report/summary.json)
            FLAKY=$(jq '.flaky' ./merged-report/summary.json)
            SKIPPED=$(jq '.skipped' ./merged-report/summary.json)
            
            # Create a nice table
            echo "| Status | Count |" >> $GITHUB_STEP_SUMMARY
            echo "| ------ | ----- |" >> $GITHUB_STEP_SUMMARY
            echo "| ✅ Passed | $PASSED |" >> $GITHUB_STEP_SUMMARY
            echo "| ❌ Failed | $FAILED |" >> $GITHUB_STEP_SUMMARY
            echo "| ⚠️ Flaky | $FLAKY |" >> $GITHUB_STEP_SUMMARY
            echo "| ⏭️ Skipped | $SKIPPED |" >> $GITHUB_STEP_SUMMARY
            echo "| 📊 Total | $TOTAL |" >> $GITHUB_STEP_SUMMARY
          else
            echo "No test summary available" >> $GITHUB_STEP_SUMMARY
          fi
`,
      explanation: "This example shows a GitHub Actions workflow for running Playwright tests in a Turborepo monorepo. It includes change detection to only run tests for affected apps, parallelization with sharding to distribute test execution across multiple runners, and browser-specific test execution. The workflow also includes artifact management for test reports and traces, with a final step to merge reports and create a summary."
    },
    {
      language: "typescript",
      description: "Playwright configuration with CI-specific settings",
      code: `
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
import path from 'path';

// Use environment variables for CI-specific configuration
const CI = process.env.CI === 'true';
const SHARD_INDEX = process.env.TEST_SHARD_INDEX ? parseInt(process.env.TEST_SHARD_INDEX, 10) : undefined;
const SHARD_TOTAL = process.env.TEST_SHARD_TOTAL ? parseInt(process.env.TEST_SHARD_TOTAL, 10) : undefined;

// Read from .env files in root and app directory
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config({ path: path.join(__dirname, '.env') });

/**
 * Configuration for Playwright tests with CI-specific overrides
 */
export default defineConfig({
  // Test directory
  testDir: './e2e',
  
  // Maximum time one test can run
  timeout: CI ? 60000 : 30000,  // Longer timeout in CI
  
  // Run tests in files in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: CI,
  
  // Retry tests in CI
  retries: CI ? 2 : 0,
  
  // Limit the number of failures to make the CI logs more readable
  maxFailures: CI ? 10 : undefined,
  
  // Use shard information from environment variables
  shard: SHARD_INDEX && SHARD_TOTAL ? 
    { current: SHARD_INDEX, total: SHARD_TOTAL } : undefined,
  
  // Reporter to use
  reporter: [
    ['html', { open: CI ? 'never' : 'on-failure' }],
    ['list'],
    // Add JUnit reporter for CI integration
    CI ? ['junit', { outputFile: 'test-results/junit-report.xml' }] : null,
  ].filter(Boolean),
  
  // Control test order randomization
  // Use consistent seed in CI to make test execution order predictable per commit
  // This helps with isolating flakiness due to test order
  use: {
    // Base URL for navigation
    baseURL: process.env.TEST_BASE_URL || 'http://localhost:3000',
    
    // Collect traces in CI, only on retry in local dev
    trace: CI ? 'on' : 'on-first-retry',
    
    // Screenshot on failure in CI
    screenshot: CI ? 'only-on-failure' : 'off',
    
    // Record video only on failure in CI
    video: CI ? 'on-first-retry' : 'off',
    
    // Control headless mode
    headless: CI ? true : false,
    
    // CI-specific environment setup
    launchOptions: {
      // Add extra args for CI environments
      args: CI ? [
        // Disable GPU in CI
        '--disable-gpu',
        // Sandboxing often causes issues in CI
        '--no-sandbox',
        // Disable shared memory in CI to prevent crashes
        '--disable-dev-shm-usage',
        // More stability flags...
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process'
      ] : []
    }
  },
  
  // Configure browser projects with specific settings
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Run with a specific viewport in CI
        viewport: { width: 1280, height: 720 },
        // Override default launch args in CI
        launchOptions: CI ? {
          args: [
            '--window-size=1280,720',
            // Additional Chrome-specific flags for CI
            '--disable-extensions',
            '--disable-component-extensions-with-background-pages',
            '--disable-default-apps'
          ]
        } : {}
      },
    },
    
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'] 
      },
    },
    
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'] 
      },
    },
    
    // Mobile browsers
    {
      name: 'mobile-chromium',
      use: { 
        ...devices['Pixel 5'] 
      },
    },
    
    {
      name: 'mobile-safari',
      use: { 
        ...devices['iPhone 13'] 
      },
    },
    
    // Special project for tests that are known to be flaky
    // These run with higher retry counts and special reporters
    {
      name: 'quarantine',
      grep: /@quarantine/,
      retries: 5, // Higher retry count for quarantined tests
      use: {
        trace: 'on', // Always trace quarantined tests
        video: 'on', // Always record video for quarantined tests
      }
    }
  ],
  
  // Web server to start before tests
  webServer: [
    {
      command: CI 
        ? 'echo "Using pre-built app in CI"' // Skip in CI, use already built app
        : 'pnpm turbo dev --filter=@app/web --no-deps',
      port: 3000,
      reuseExistingServer: !CI,
      timeout: 60000,
    },
    // Additional servers for API testing if needed
    {
      command: CI 
        ? 'echo "Using pre-built API in CI"'
        : 'pnpm turbo dev --filter=@app/api --no-deps',
      port: 3001,
      reuseExistingServer: !CI,
      timeout: 60000,
    }
  ],
  
  // Global setup to run before all tests
  globalSetup: CI ? './e2e/global-setup.ts' : undefined,
  
  // Global teardown to run after all tests
  globalTeardown: CI ? './e2e/global-teardown.ts' : undefined,
});
`,
      explanation: "This example demonstrates a Playwright configuration file with CI-specific settings. It includes conditional configuration based on the CI environment, such as headless mode, trace and video capture, and different timeout values. The configuration also includes sharding support for parallel execution in CI and special project settings for quarantined/flaky tests."
    },
    {
      language: "typescript",
      description: "Turborepo test script with Playwright integration",
      code: `
// scripts/run-e2e-tests.ts
import { spawnSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import path from 'path';
import minimist from 'minimist';

/**
 * Script to run Playwright E2E tests in a Turborepo context
 * Handles workspace filtering, browser selection, and results reporting
 */
function main() {
  // Parse command line arguments
  const args = minimist(process.argv.slice(2), {
    string: ['filter', 'browser', 'workspace'],
    boolean: ['all-browsers', 'debug', 'ui'],
    default: {
      'browser': 'chromium',
      'all-browsers': false,
      'debug': false,
      'ui': false
    },
    alias: {
      f: 'filter',
      b: 'browser',
      w: 'workspace',
      a: 'all-browsers',
      d: 'debug',
      u: 'ui'
    }
  });

  // Determine which workspaces to test
  const workspaces = args.workspace ? 
    args.workspace.split(',') : 
    determineAffectedWorkspaces();
  
  if (workspaces.length === 0) {
    console.log('No affected workspaces found, exiting.');
    process.exit(0);
  }
  
  console.log(\`Running E2E tests for workspaces: \${workspaces.join(', ')}\`);
  
  // Determine which browsers to test
  const browsers = args['all-browsers'] ? 
    ['chromium', 'firefox', 'webkit'] : 
    [args.browser];
  
  console.log(\`Testing on browsers: \${browsers.join(', ')}\`);
  
  // Build the affected workspaces first
  buildWorkspaces(workspaces);
  
  // Track overall success/failure
  let allTestsPassed = true;
  
  // Run tests for each workspace and browser combination
  for (const workspace of workspaces) {
    for (const browser of browsers) {
      const success = runTests({
        workspace,
        browser,
        filter: args.filter,
        debug: args.debug,
        ui: args.ui
      });
      
      if (!success) {
        allTestsPassed = false;
        console.error(\`❌ Tests failed for \${workspace} on \${browser}\`);
      } else {
        console.log(\`✅ Tests passed for \${workspace} on \${browser}\`);
      }
    }
  }
  
  // Exit with appropriate code
  process.exit(allTestsPassed ? 0 : 1);
}

/**
 * Determine which workspaces have been affected by recent changes
 */
function determineAffectedWorkspaces(): string[] {
  // Try to use Turborepo to determine affected workspaces
  const turboResult = spawnSync('pnpm', [
    'turbo', 'run', 'build', '--dry-run', '--filter=[HEAD^1]'
  ], { encoding: 'utf8' });
  
  if (turboResult.status !== 0) {
    console.warn('Failed to determine affected packages with Turborepo, testing all workspaces.');
    return getAllWorkspaces();
  }
  
  // Parse Turborepo output to find affected workspaces
  const output = turboResult.stdout;
  const affectedRegex = /► Running build in (\S+)/g;
  const affected = new Set<string>();
  
  let match;
  while ((match = affectedRegex.exec(output)) !== null) {
    const workspace = match[1];
    // Only include workspaces with e2e tests
    if (hasE2ETests(workspace)) {
      affected.add(workspace);
    }
  }
  
  return Array.from(affected);
}

/**
 * Get all workspaces in the monorepo
 */
function getAllWorkspaces(): string[] {
  // Read pnpm-workspace.yaml to find workspace patterns
  const workspaceConfig = readFileSync('pnpm-workspace.yaml', 'utf8');
  const packagesPaths = workspaceConfig.match(/- '([^']+)'/g)?.map(m => m.slice(3, -1)) || [];
  
  // Return only workspaces with e2e tests
  return packagesPaths
    .flatMap(pattern => {
      if (pattern.includes('*')) {
        // Handle glob patterns (very simplified approach)
        const baseDir = pattern.split('*')[0];
        const spawnResult = spawnSync('find', [
          baseDir, '-type', 'd', '-maxdepth', '1'
        ], { encoding: 'utf8' });
        
        return spawnResult.stdout.split('\\n')
          .filter(p => p.length > 0)
          .map(p => p.trim());
      }
      return [pattern];
    })
    .filter(hasE2ETests);
}

/**
 * Check if a workspace has E2E tests
 */
function hasE2ETests(workspace: string): boolean {
  return existsSync(path.join(workspace, 'e2e')) || 
         existsSync(path.join(workspace, 'tests', 'e2e'));
}

/**
 * Build the specified workspaces
 */
function buildWorkspaces(workspaces: string[]): void {
  console.log('Building affected workspaces...');
  
  const filterArg = workspaces.map(w => \`--filter=\${w}\`).join(' ');
  const buildResult = spawnSync('pnpm', [
    'turbo', 'run', 'build', ...filterArg.split(' ')
  ], { 
    stdio: 'inherit',
    encoding: 'utf8'
  });
  
  if (buildResult.status !== 0) {
    console.error('Build failed');
    process.exit(1);
  }
}

/**
 * Run tests for a specific workspace and browser
 */
function runTests(options: {
  workspace: string;
  browser: string;
  filter?: string;
  debug?: boolean;
  ui?: boolean;
}): boolean {
  const { workspace, browser, filter, debug, ui } = options;
  
  console.log(\`Running tests for \${workspace} on \${browser}...\`);
  
  // Build the command arguments
  const args = ['turbo', 'run'];
  
  // Determine which task to run
  if (ui) {
    args.push('test:e2e:ui');
  } else {
    args.push(\`test:e2e:\${browser}\`);
  }
  
  // Add workspace filter
  args.push(\`--filter=\${workspace}\`);
  
  // Handle debug mode
  if (debug) {
    args.push('--debug');
  }
  
  // Add environment variables for Playwright
  const env = {
    ...process.env,
    PLAYWRIGHT_BROWSER: browser
  };
  
  // Add test filter if specified
  if (filter) {
    env.PLAYWRIGHT_TEST_GREP = filter;
  }
  
  // Run the command
  const result = spawnSync('pnpm', args, { 
    stdio: 'inherit',
    encoding: 'utf8',
    env
  });
  
  return result.status === 0;
}

// Run the script
main();
`,
      explanation: "This example shows a script for running Playwright E2E tests in a Turborepo monorepo. It integrates with Turborepo's dependency graph to determine which workspaces need testing, supports running tests on multiple browsers, and handles filtering and debugging options. The script also manages test execution and result reporting."
    }
  ],
  commonPitfalls: [
    {
      name: "Ignoring Workspace Dependencies",
      description: "Running tests only for directly changed packages without considering packages that depend on them, potentially missing integration issues.",
      solution: "Use Turborepo's dependency graph to run tests for both changed packages and packages that depend on them.",
      preventativeMeasures: [
        "Implement dependency-aware test filtering in CI workflows",
        "Use Turborepo's '--filter=[HEAD^1]...' syntax to include dependent packages",
        "Document the dependency structure to help understand test coverage"
      ]
    },
    {
      name: "Resource Contention in CI",
      description: "Running too many parallel tests or browser instances on CI runners, leading to resource exhaustion, timeouts, and flaky tests.",
      solution: "Carefully balance parallelization with resource constraints, limiting concurrent browser instances and implementing efficient sharding.",
      preventativeMeasures: [
        "Monitor CI resource usage to identify contention",
        "Configure appropriate concurrency limits based on available CPU and memory",
        "Implement browser process isolation to prevent interference"
      ]
    },
    {
      name: "Inefficient CI Caching",
      description: "Not leveraging Turborepo's caching capabilities effectively in CI, leading to redundant work and slower feedback cycles.",
      solution: "Configure CI to properly store and restore Turborepo's cache between runs, with appropriate cache keys and dependency tracking.",
      preventativeMeasures: [
        "Set up CI-specific caching for Turborepo's .turbo directory",
        "Configure appropriate cache keys based on content hashes",
        "Monitor cache hit rates and optimize cache effectiveness"
      ]
    },
    {
      name: "Excessive Artifact Storage",
      description: "Capturing and storing traces, screenshots, and videos for all tests, leading to excessive storage usage and slow CI artifact uploads/downloads.",
      solution: "Implement conditional artifact capture, storing detailed artifacts only for failed tests or specific test subsets.",
      preventativeMeasures: [
        "Configure Playwright to capture traces and videos only on failure",
        "Implement artifact rotation or cleanup policies",
        "Use selective artifact uploading based on test results"
      ]
    },
    {
      name: "Inadequate CI-Specific Configuration",
      description: "Using the same Playwright configuration in CI as in local development, ignoring the different characteristics and constraints of CI environments.",
      solution: "Create CI-specific Playwright configurations that account for headless mode, resource limitations, and environmental differences.",
      preventativeMeasures: [
        "Implement environment-aware configuration using environment variables",
        "Add CI-specific browser arguments and settings",
        "Document and test CI-specific configuration regularly"
      ]
    },
    {
      name: "Poor Flaky Test Management",
      description: "Allowing flaky tests to repeatedly break the build without a systematic approach to identification, isolation, and resolution.",
      solution: "Implement a quarantine system for flaky tests, with separate reporting and higher retry counts, while maintaining visibility for resolution.",
      preventativeMeasures: [
        "Tag known flaky tests and run them separately",
        "Implement flaky test detection and reporting",
        "Create a process for resolving flaky tests rather than ignoring them"
      ]
    }
  ],
  improvementGuidelines: {
    description: "Strategies for improving Playwright CI orchestration in Turborepo monorepos over time.",
    metrics: [
      {
        name: "CI Execution Time",
        description: "The time it takes to complete E2E test execution in CI. Shorter times indicate more efficient orchestration.",
        assessmentMethod: "Track test execution time across CI runs, focusing on trends rather than absolute values. Break down time by setup, execution, and reporting phases."
      },
      {
        name: "Test Reliability",
        description: "The consistency of test results across multiple CI runs. Higher reliability indicates better test isolation and environment configuration.",
        assessmentMethod: "Track flaky test rates and analyze patterns of inconsistent failures. Calculate the percentage of runs where all tests pass consistently."
      },
      {
        name: "Resource Efficiency",
        description: "How effectively CI resources (CPU, memory, concurrency) are utilized during test execution. Optimal efficiency maximizes throughput without contention.",
        assessmentMethod: "Monitor resource usage during test runs, identifying bottlenecks and idle periods. Calculate resource utilization percentages."
      },
      {
        name: "Feedback Time",
        description: "How quickly developers receive test results after making changes. Faster feedback loops improve development velocity.",
        assessmentMethod: "Measure the time from commit to test result notification. Track the percentage of changes that get test feedback within target thresholds."
      }
    ]
  },
  resources: [
    {
      type: "documentation",
      name: "Playwright CI Guide",
      description: "Official documentation for running Playwright tests in CI environments.",
      link: "https://playwright.dev/docs/ci"
    },
    {
      type: "tutorial",
      name: "Turborepo CI/CD Pipelines",
      description: "Guide to setting up efficient CI/CD pipelines with Turborepo.",
      link: "https://turbo.build/repo/docs/ci/github-actions"
    },
    {
      type: "reference",
      name: "GitHub Actions Workflow Syntax",
      description: "Reference documentation for GitHub Actions workflow configuration.",
      link: "https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions"
    },
    {
      type: "tool",
      name: "Playwright Test Sharding",
      description: "Documentation for Playwright's test sharding capabilities for parallel execution.",
      link: "https://playwright.dev/docs/test-sharding"
    }
  ],
  conclusion: "Effective CI orchestration for Playwright tests in Turborepo monorepos requires a thoughtful approach to workspace dependency management, test distribution, and resource optimization. By leveraging Turborepo's pipeline model and caching capabilities alongside Playwright's testing features, teams can create efficient, reliable test workflows that provide fast feedback without excessive resource usage. The key is to integrate these tools cohesively, with configurations that account for the specific characteristics of monorepo structures and CI environments. With proper implementation of the strategies outlined in this guide, teams can achieve comprehensive test coverage while maintaining reasonable build times and resource utilization."
}; 