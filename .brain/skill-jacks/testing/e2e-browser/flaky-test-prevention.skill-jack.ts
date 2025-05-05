/**
 * Skill-Jack: Flaky Test Prevention
 * 
 * A comprehensive guide to identifying, preventing, and fixing flaky tests in E2E testing.
 * 
 * @module brain-garden/skill-jack
 * @category testing/patterns
 */

/**
 * Skill-Jack on Flaky Test Prevention
 * 
 * This constant provides comprehensive guidance on understanding and addressing
 * flaky tests in E2E testing environments.
 */
export const topicGuide = {
  topic: "Flaky Test Prevention",
  description: "A systematic approach to identifying, preventing, and fixing flaky tests in E2E testing, ensuring reliable and consistent test results across different environments and executions.",
  corePrinciples: [
    {
      name: "Deterministic Testing",
      description: "Design tests to produce the same result every time they run under the same conditions, eliminating sources of randomness or unpredictability.",
      examples: [
        "Using fixed seeds for any random operations",
        "Setting consistent timestamps or dates in test environments",
        "Ensuring test data is created in a predictable, repeatable way"
      ]
    },
    {
      name: "Synchronization Management",
      description: "Implement proper waiting strategies to handle timing issues, ensuring tests wait appropriately for application states and don't rely on arbitrary delays.",
      examples: [
        "Waiting for network requests to complete rather than using sleep statements",
        "Using element visibility or property changes as synchronization points",
        "Implementing custom waiters for complex application states"
      ]
    },
    {
      name: "Isolation Between Tests",
      description: "Ensure tests are truly independent, with no shared state or order dependencies that could cause interference or flakiness.",
      examples: [
        "Creating fresh browser contexts for each test",
        "Using unique test data that won't conflict between tests",
        "Implementing proper cleanup of test resources after each test"
      ]
    },
    {
      name: "Environmental Consistency",
      description: "Minimize differences between test environments to reduce environment-specific failures and ensure tests run consistently everywhere.",
      examples: [
        "Configuring browsers with consistent settings across environments",
        "Using containerization to ensure consistent system dependencies",
        "Setting explicit viewport sizes and device parameters"
      ]
    },
    {
      name: "Resilient Selectors",
      description: "Design element selectors that are resilient to minor UI changes and provide clear, actionable failure messages when they fail.",
      examples: [
        "Using data-testid attributes instead of relying on CSS classes or styles",
        "Creating robust selectors that don't depend on precise DOM structure",
        "Implementing selector strategies that fail fast with descriptive messages"
      ]
    },
    {
      name: "Comprehensive Logging",
      description: "Implement detailed logging to provide visibility into test execution and simplify diagnosis when tests fail intermittently.",
      examples: [
        "Capturing screenshots or videos when tests fail",
        "Logging network requests and responses",
        "Recording the state of critical application elements during key test phases"
      ]
    }
  ],
  applicationProcess: {
    description: "A structured approach to addressing flaky tests in E2E testing workflows.",
    steps: [
      {
        name: "Identify Flaky Tests",
        description: "Systematically detect and track flaky tests to understand the scope of the problem.",
        agentActions: [
          {
            action: "Run tests repeatedly",
            explanation: "Execute test suites multiple times to identify tests that pass and fail inconsistently."
          },
          {
            action: "Track flaky test metrics",
            explanation: "Implement tools to automatically flag tests that fail non-deterministically."
          },
          {
            action: "Prioritize flaky tests by impact",
            explanation: "Focus on fixing the most impactful flaky tests first, considering factors like frequency of flakiness and criticality of the feature."
          }
        ]
      },
      {
        name: "Diagnose Root Causes",
        description: "Determine the underlying causes of test flakiness through systematic investigation.",
        agentActions: [
          {
            action: "Enhance test logging",
            explanation: "Add detailed logging to flaky tests to capture more information about what's happening during execution."
          },
          {
            action: "Analyze timing patterns",
            explanation: "Look for patterns in when tests fail, such as specific times of day or system load conditions."
          },
          {
            action: "Inspect test dependencies",
            explanation: "Check for hidden dependencies on external systems, shared state, or execution order."
          },
          {
            action: "Review browser and network behavior",
            explanation: "Examine network requests, rendering behavior, and other browser-specific aspects that might cause inconsistency."
          }
        ]
      },
      {
        name: "Implement Synchronization Strategies",
        description: "Apply appropriate waiting and synchronization patterns to address timing-related flakiness.",
        agentActions: [
          {
            action: "Replace arbitrary sleeps",
            explanation: "Eliminate hard-coded sleep statements and replace them with explicit waits for specific conditions."
          },
          {
            action: "Implement smart waiters",
            explanation: "Create custom waiting utilities that poll for specific application states with appropriate timeouts."
          },
          {
            action: "Add network request tracking",
            explanation: "Implement network request tracking to ensure all expected requests complete before proceeding."
          },
          {
            action: "Handle animation and transition states",
            explanation: "Add specific handling for UI animations or transitions that could affect test stability."
          }
        ]
      },
      {
        name: "Improve Selector Strategies",
        description: "Enhance element selectors to be more resilient and provide better failure information.",
        agentActions: [
          {
            action: "Audit existing selectors",
            explanation: "Review current selectors to identify brittle or unreliable patterns."
          },
          {
            action: "Implement data-testid attributes",
            explanation: "Add dedicated test attributes to elements that tests need to interact with."
          },
          {
            action: "Create selector helpers",
            explanation: "Develop utility functions that construct robust selectors with built-in waiting and error reporting."
          },
          {
            action: "Document selector best practices",
            explanation: "Establish and document team standards for creating reliable selectors."
          }
        ]
      },
      {
        name: "Enhance Test Environment Control",
        description: "Improve control and consistency of the test environment to reduce environmental sources of flakiness.",
        agentActions: [
          {
            action: "Standardize browser configuration",
            explanation: "Ensure browsers are launched with consistent settings across all environments."
          },
          {
            action: "Isolate test execution",
            explanation: "Run tests in isolated environments to prevent interference from other processes or tests."
          },
          {
            action: "Control external dependencies",
            explanation: "Mock or stabilize external systems that tests depend on, such as APIs or databases."
          },
          {
            action: "Monitor system resources",
            explanation: "Track CPU, memory, and network usage during test execution to identify resource-related issues."
          }
        ]
      },
      {
        name: "Implement Retry Strategies",
        description: "Add appropriate retry mechanisms for handling truly non-deterministic aspects of testing.",
        agentActions: [
          {
            action: "Identify non-deterministic operations",
            explanation: "Determine which operations are inherently non-deterministic and require retry handling."
          },
          {
            action: "Implement targeted retries",
            explanation: "Add retry logic to specific test actions that may fail transiently, rather than retrying entire tests."
          },
          {
            action: "Configure global retry policies",
            explanation: "Set up test runner retry policies with appropriate backoff strategies and limits."
          },
          {
            action: "Track and analyze retry patterns",
            explanation: "Monitor which tests and actions require retries to identify opportunities for further improvement."
          }
        ]
      }
    ]
  },
  examples: {
    description: "Practical examples of flaky test prevention techniques in different scenarios.",
    useCases: [
      {
        scenario: "Handling network request flakiness",
        implementation: "Implementing robust waiting strategies for network requests instead of using arbitrary timeouts.",
        outcome: "Tests reliably wait for actual network completion instead of failing sporadically when requests take longer than expected."
      },
      {
        scenario: "Addressing animation-related flakiness",
        implementation: "Creating custom waiters that check for completed animations or transitions before interacting with elements.",
        outcome: "Tests consistently interact with elements at the right time, avoiding failures due to animations in progress."
      },
      {
        scenario: "Managing test data consistency",
        implementation: "Implementing isolated, deterministic test data creation and cleanup for each test.",
        outcome: "Tests run reliably with predictable data regardless of execution order or concurrent test runs."
      },
      {
        scenario: "Handling third-party service variability",
        implementation: "Using consistent mocks or stable test environments for external dependencies.",
        outcome: "Tests remain stable even when external services experience performance fluctuations or outages."
      }
    ]
  },
  codeExamples: [
    {
      language: "typescript",
      description: "Implementing smart waiting utilities",
      code: `
import { Page, Locator, expect } from '@playwright/test';

/**
 * Smart waiting utilities for reducing test flakiness
 */
export class WaitUtils {
  constructor(private page: Page) {}

  /**
   * Wait for all network requests to complete
   */
  async waitForNetworkIdle(options?: { timeout?: number; idleTime?: number }): Promise<void> {
    await this.page.waitForLoadState('networkidle', options);
  }

  /**
   * Wait for an element to be stable (not moving on screen)
   */
  async waitForElementStable(locator: Locator, options: { timeout?: number, stabilityThreshold?: number } = {}): Promise<void> {
    const timeout = options.timeout || 10000;
    const stabilityThreshold = options.stabilityThreshold || 300;
    const startTime = Date.now();
    
    let lastRect: { x: number; y: number } | null = null;
    let stableTime = 0;
    
    while (Date.now() - startTime < timeout) {
      // Verify element is visible
      await locator.waitFor({ state: 'visible' });
      
      try {
        // Get current position
        const boundingBox = await locator.boundingBox();
        if (!boundingBox) {
          await this.page.waitForTimeout(50);
          continue;
        }
        
        const currentRect = { x: boundingBox.x, y: boundingBox.y };
        
        // Check if position changed
        if (lastRect && 
            lastRect.x === currentRect.x && 
            lastRect.y === currentRect.y) {
          // Position is stable, track time
          if (stableTime === 0) {
            stableTime = Date.now();
          } else if (Date.now() - stableTime >= stabilityThreshold) {
            // Element stable for threshold duration
            return;
          }
        } else {
          // Position changed, reset stable time
          stableTime = 0;
          lastRect = currentRect;
        }
        
        await this.page.waitForTimeout(50);
      } catch (error) {
        // Element might have disappeared, reset tracking
        stableTime = 0;
        lastRect = null;
        await this.page.waitForTimeout(50);
      }
    }
    
    throw new Error(\`Element did not stabilize within \${timeout}ms\`);
  }
  
  /**
   * Wait for an element to stop changing (content and attributes stable)
   */
  async waitForElementContentStable(locator: Locator, options: { timeout?: number, checkInterval?: number, stabilityThreshold?: number } = {}): Promise<void> {
    const timeout = options.timeout || 10000;
    const checkInterval = options.checkInterval || 100;
    const stabilityThreshold = options.stabilityThreshold || 500;
    const startTime = Date.now();
    
    let lastHTML = '';
    let stableTime = 0;
    
    // Wait for element to be visible first
    await locator.waitFor({ state: 'visible', timeout });
    
    while (Date.now() - startTime < timeout) {
      try {
        // Get current HTML content
        const html = await locator.evaluate(el => el.outerHTML);
        
        if (html === lastHTML) {
          // Content is stable, track time
          if (stableTime === 0) {
            stableTime = Date.now();
          } else if (Date.now() - stableTime >= stabilityThreshold) {
            // Content stable for threshold duration
            return;
          }
        } else {
          // Content changed, reset stable time
          stableTime = 0;
          lastHTML = html;
        }
        
        await this.page.waitForTimeout(checkInterval);
      } catch (error) {
        // Element might be detached, reset tracking
        stableTime = 0;
        lastHTML = '';
        await this.page.waitForTimeout(checkInterval);
      }
    }
    
    throw new Error(\`Element content did not stabilize within \${timeout}ms\`);
  }
  
  /**
   * Wait for a specific number of network requests matching a pattern
   */
  async waitForRequests(urlPattern: RegExp, count: number, options: { timeout?: number } = {}): Promise<void> {
    const timeout = options.timeout || 30000;
    const startTime = Date.now();
    let matchedRequests = 0;
    
    // Setup request listener
    const requestListener = (request: any) => {
      if (urlPattern.test(request.url())) {
        matchedRequests++;
      }
    };
    
    this.page.on('request', requestListener);
    
    try {
      // Wait for enough requests to occur
      while (matchedRequests < count) {
        if (Date.now() - startTime > timeout) {
          throw new Error(\`Timed out waiting for \${count} requests matching \${urlPattern}. Only saw \${matchedRequests}\`);
        }
        
        await this.page.waitForTimeout(100);
      }
    } finally {
      // Always remove the listener
      this.page.off('request', requestListener);
    }
  }
  
  /**
   * Wait for an application-specific event via a custom attribute
   */
  async waitForAppReady(options: { timeout?: number } = {}): Promise<void> {
    const timeout = options.timeout || 30000;
    
    await this.page.waitForFunction(() => {
      return document.documentElement.getAttribute('data-app-ready') === 'true';
    }, { timeout });
  }
  
  /**
   * Safely click on an element with retry and logging
   */
  async safeClick(locator: Locator, options: { timeout?: number, retries?: number } = {}): Promise<void> {
    const timeout = options.timeout || 10000;
    const retries = options.retries || 3;
    let lastError;
    
    // Wait for element to be clickable first
    await locator.waitFor({ state: 'visible', timeout });
    
    // Try clicking with retries
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        // Wait for element to stabilize before clicking
        await this.waitForElementStable(locator, { timeout: timeout / 2 });
        
        // Perform the click
        await locator.click({ timeout: timeout / 2 });
        return;
      } catch (error: any) {
        lastError = error;
        console.log(\`Click attempt \${attempt} failed: \${error.message}\`);
        
        // Take a screenshot for debugging on failure
        if (attempt === retries) {
          await this.page.screenshot({ path: \`click-failure-\${Date.now()}.png\` });
        }
        
        // Short wait before retry
        await this.page.waitForTimeout(200);
      }
    }
    
    throw new Error(\`Failed to click element after \${retries} attempts: \${lastError?.message}\`);
  }
}
`,
      explanation: "This example demonstrates a comprehensive utility class for handling various timing issues in UI tests. It includes methods for waiting for network requests, element stability, content changes, and application-specific events. These utilities replace arbitrary sleep statements with intelligent waiting strategies that adapt to actual application state, reducing flakiness caused by timing issues."
    },
    {
      language: "typescript",
      description: "Resilient selector strategies",
      code: `
import { Page, Locator } from '@playwright/test';

/**
 * Resilient selector strategies to reduce flaky tests
 */
export class SelectorUtils {
  constructor(private page: Page) {}
  
  /**
   * Create a selector that prioritizes test IDs but falls back to other strategies
   */
  selectElement(options: {
    testId?: string;
    text?: string;
    label?: string;
    role?: string;
    css?: string;
  }): Locator {
    // Prioritize test ID if available (most stable)
    if (options.testId) {
      return this.page.locator(\`[data-testid="\${options.testId}"]\`);
    }
    
    // Use role and name/text if available (good accessibility practice)
    if (options.role && options.text) {
      return this.page.getByRole(options.role as any, { name: options.text });
    }
    
    // Use label if available (good for form fields)
    if (options.label) {
      return this.page.getByLabel(options.label);
    }
    
    // Use text content (less stable but readable)
    if (options.text) {
      return this.page.getByText(options.text);
    }
    
    // Use CSS as last resort (least stable)
    if (options.css) {
      return this.page.locator(options.css);
    }
    
    throw new Error('At least one selector strategy must be provided');
  }
  
  /**
   * Select a form field with fallback strategies
   */
  selectFormField(options: {
    testId?: string;
    label?: string;
    placeholder?: string;
    name?: string;
  }): Locator {
    // Prioritize test ID
    if (options.testId) {
      return this.page.locator(\`[data-testid="\${options.testId}"]\`);
    }
    
    // Use label (most user-friendly)
    if (options.label) {
      return this.page.getByLabel(options.label);
    }
    
    // Use placeholder (less reliable but visible to user)
    if (options.placeholder) {
      return this.page.locator(\`[placeholder="\${options.placeholder}"]\`);
    }
    
    // Use name attribute (more stable but not visible to user)
    if (options.name) {
      return this.page.locator(\`[name="\${options.name}"]\`);
    }
    
    throw new Error('At least one form field selector strategy must be provided');
  }
  
  /**
   * Select a button with fallback strategies
   */
  selectButton(options: {
    testId?: string;
    text?: string;
    ariaLabel?: string;
    type?: string;
  }): Locator {
    // Prioritize test ID
    if (options.testId) {
      return this.page.locator(\`[data-testid="\${options.testId}"]\`);
    }
    
    // Use text (visible to user)
    if (options.text) {
      return this.page.getByRole('button', { name: options.text });
    }
    
    // Use aria-label (good for icon buttons)
    if (options.ariaLabel) {
      return this.page.locator(\`button[aria-label="\${options.ariaLabel}"]\`);
    }
    
    // Use button type
    if (options.type) {
      return this.page.locator(\`button[type="\${options.type}"]\`);
    }
    
    throw new Error('At least one button selector strategy must be provided');
  }
  
  /**
   * Select an item from a list or menu
   */
  selectListItem(options: {
    listTestId?: string;
    itemTestId?: string;
    text?: string;
    index?: number;
  }): Locator {
    let listLocator: Locator;
    
    // Get the list container
    if (options.listTestId) {
      listLocator = this.page.locator(\`[data-testid="\${options.listTestId}"]\`);
    } else {
      listLocator = this.page.locator('ul, ol, [role="list"], [role="menu"], [role="listbox"]');
    }
    
    // Select specific item
    if (options.itemTestId) {
      return listLocator.locator(\`[data-testid="\${options.itemTestId}"]\`);
    }
    
    if (options.text) {
      return listLocator.getByText(options.text);
    }
    
    if (options.index !== undefined) {
      return listLocator.locator('li, [role="menuitem"], [role="option"]').nth(options.index);
    }
    
    throw new Error('Must provide itemTestId, text, or index to select list item');
  }
  
  /**
   * Create a selector with built-in waiting and error handling
   */
  async withRetry<T>(
    selector: Locator,
    action: (locator: Locator) => Promise<T>,
    options: {
      retries?: number;
      description?: string;
      timeout?: number;
    } = {}
  ): Promise<T> {
    const retries = options.retries || 3;
    const timeout = options.timeout || 5000;
    const description = options.description || selector.toString();
    
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        // Wait for element to be visible
        await selector.waitFor({
          state: 'visible',
          timeout: timeout / retries
        });
        
        // Perform the action
        return await action(selector);
      } catch (err: any) {
        lastError = new Error(
          \`Failed to perform action on \${description} (attempt \${attempt}/${retries}): \${err.message}\`
        );
        
        if (attempt === retries) {
          // Take a screenshot on last failure attempt
          await this.page.screenshot({
            path: \`selector-failure-\${Date.now()}.png\`
          });
          break;
        }
        
        // Wait before retrying
        await this.page.waitForTimeout(200);
      }
    }
    
    throw lastError;
  }
}
`,
      explanation: "This example shows a utility class for creating resilient selectors that can withstand minor UI changes. It implements a strategy pattern to prioritize stable selectors like data-testid attributes while providing fallbacks for different element types. It also includes a retry mechanism for performing actions on elements that might be temporarily unstable."
    },
    {
      language: "typescript",
      description: "Test isolation and setup in Playwright",
      code: `
import { test as base, expect, BrowserContext } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';
import { mockApi } from '../utils/api-mock';
import { WaitUtils } from '../utils/wait-utils';
import { SelectorUtils } from '../utils/selector-utils';

// Define fixtures with enhanced isolation
type TestFixtures = {
  context: BrowserContext;
  waitUtils: WaitUtils;
  selectUtils: SelectorUtils;
  testRunId: string;
  mockNetworkRequests: boolean;
};

// Extend the base test with isolation enhancements
export const test = base.extend<TestFixtures>({
  // Override the built-in context fixture for better isolation
  context: async ({ browser }, use) => {
    // Create a unique context for each test with consistent settings
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      userAgent: 'Playwright Test Agent',
      locale: 'en-US',
      timezoneId: 'UTC',
      // Eliminate sources of non-determinism
      geolocation: { latitude: 37.7749, longitude: -122.4194 }, // Fixed location
      permissions: ['geolocation'], // Pre-grant permissions
      colorScheme: 'light', // Fixed color scheme
      // Avoid shared cache/storage between tests
      storageState: { cookies: [], origins: [] }
    });
    
    // Reduce animation sources of flakiness
    await context.addInitScript(() => {
      // Disable CSS animations and transitions
      const style = document.createElement('style');
      style.textContent = \`
        *, *::before, *::after {
          animation-duration: 0.0001s !important;
          transition-duration: 0.0001s !important;
          animation-delay: 0.0001s !important;
          transition-delay: 0.0001s !important;
        }
      \`;
      document.head.appendChild(style);
    });
    
    // Use the context
    await use(context);
    
    // Clean up
    await context.close();
  },
  
  // Generate a unique ID for this test run to isolate data
  testRunId: async ({}, use) => {
    const uniqueId = \`test_\${uuidv4().replace(/-/g, '')}\`;
    await use(uniqueId);
  },
  
  // Create wait utilities for the page
  waitUtils: async ({ page }, use) => {
    await use(new WaitUtils(page));
  },
  
  // Create selector utilities for the page
  selectUtils: async ({ page }, use) => {
    await use(new SelectorUtils(page));
  },
  
  // Setup network mocking
  mockNetworkRequests: [async ({ context }, use) => {
    // Setup API mocking
    await mockApi(context);
    
    // Use the mock
    await use(true);
  }, { auto: false }] // Only enable when explicitly requested
});

// Define a base test object with retry logic
const baseTest = {
  // Extend the test with enhanced retry policy
  describe: (title: string, testFunction: Function) => {
    return test.describe(title, testFunction);
  },
  
  // Define a test with built-in retry for flaky tests
  it: (title: string, testFn: Function, options: { retries?: number } = {}) => {
    const retries = options.retries !== undefined ? options.retries : 1;
    
    // Add retry metadata to test title for tracking
    const titleWithRetryInfo = retries > 0 ? 
      \`\${title} [auto-retry=\${retries}]\` : title;
    
    return test(titleWithRetryInfo, testFn, {
      retries,
      timeout: 60000, // Default longer timeout for E2E tests
    });
  },
  
  // Helper to run tests that depend on a specific feature flag
  withFeatureFlag: (flagName: string, flagValue: boolean) => {
    return {
      describe: (title: string, testFn: Function) => {
        return test.describe(\`\${title} [feature=\${flagName}:\${flagValue}]\`, () => {
          test.beforeEach(async ({ page }) => {
            // Set feature flag for this test
            await page.addInitScript(\`
              window.FEATURE_FLAGS = window.FEATURE_FLAGS || {};
              window.FEATURE_FLAGS["\${flagName}"] = \${flagValue};
            \`);
          });
          
          testFn();
        });
      }
    };
  }
};

// Re-export expect and enhanced test objects
export { expect, baseTest as test };
`,
      explanation: "This example demonstrates techniques for ensuring test isolation to reduce flakiness. It includes creating isolated browser contexts with consistent settings, disabling animations, generating unique test IDs for data isolation, and setting up utilities for waiting and selecting elements. It also implements a test wrapper with retry capabilities for handling truly non-deterministic scenarios."
    },
    {
      language: "typescript",
      description: "Comprehensive test reporting and diagnostics",
      code: `
import { FullConfig, Reporter, TestCase, TestResult, TestError, TestStep } from '@playwright/test/reporter';
import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';

/**
 * Custom Playwright reporter to help diagnose flaky tests
 */
class FlakyTestReporter implements Reporter {
  private config: FullConfig | undefined;
  private flakySuspects: Map<string, { 
    passes: number; 
    failures: number;
    totalRuns: number;
    errors: TestError[];
    testCase: TestCase | null;
  }> = new Map();
  private startTime: number = Date.now();
  private reportDir: string = '';
  
  onBegin(config: FullConfig, suite: any): void {
    this.config = config;
    this.startTime = Date.now();
    this.reportDir = path.join(config.rootDir, 'flaky-test-report');
    
    // Create report directory
    if (!fs.existsSync(this.reportDir)) {
      fs.mkdirSync(this.reportDir, { recursive: true });
    }
    
    console.log('🔍 Flaky test detection active');
  }
  
  onTestBegin(test: TestCase): void {
    const testId = this.getTestId(test);
    if (!this.flakySuspects.has(testId)) {
      this.flakySuspects.set(testId, { 
        passes: 0, 
        failures: 0, 
        totalRuns: 0,
        errors: [],
        testCase: test 
      });
    }
    
    // Increment runs
    const data = this.flakySuspects.get(testId)!;
    data.totalRuns++;
  }
  
  onTestEnd(test: TestCase, result: TestResult): void {
    const testId = this.getTestId(test);
    const data = this.flakySuspects.get(testId)!;
    
    // Count passes and failures
    if (result.status === 'passed') {
      data.passes++;
    } else if (result.status === 'failed' || result.status === 'timedOut') {
      data.failures++;
      
      // Record errors
      if (result.error) {
        data.errors.push(result.error);
      }
      
      // Save screenshot if available
      if (result.attachments) {
        for (const attachment of result.attachments) {
          if (attachment.name.includes('screenshot') && attachment.path) {
            const fileName = \`\${this.sanitizeFileName(test.title)}-\${Date.now()}.png\`;
            const destPath = path.join(this.reportDir, fileName);
            
            try {
              fs.copyFileSync(attachment.path, destPath);
            } catch (err) {
              console.error(\`Failed to copy screenshot: \${err}\`);
            }
          }
        }
      }
    }
  }
  
  onEnd(): void {
    // Calculate flakiness scores and generate report
    const reportData: any[] = [];
    
    for (const [testId, data] of this.flakySuspects.entries()) {
      if (data.totalRuns > 1) {
        const flakinessScore = (data.passes > 0 && data.failures > 0) 
          ? (Math.min(data.passes, data.failures) / data.totalRuns)
          : 0;
          
        reportData.push({
          testId,
          title: data.testCase?.title || testId,
          file: data.testCase?.location.file,
          totalRuns: data.totalRuns,
          passes: data.passes,
          failures: data.failures,
          flakinessScore: flakinessScore,
          errorTypes: this.categorizeErrors(data.errors),
          isFlaky: flakinessScore > 0
        });
      }
    }
    
    // Sort by flakiness score
    reportData.sort((a, b) => b.flakinessScore - a.flakinessScore);
    
    // Generate HTML report
    this.generateHtmlReport(reportData);
    
    // Log summary
    const flakyTests = reportData.filter(r => r.isFlaky);
    console.log(\`\n📊 Flaky Test Summary: \${flakyTests.length} flaky tests detected\`);
    
    if (flakyTests.length > 0) {
      console.log(\`\n🔴 Top flaky tests:\`);
      for (let i = 0; i < Math.min(5, flakyTests.length); i++) {
        const test = flakyTests[i];
        console.log(\`   - \${test.title}: \${test.passes} passes, \${test.failures} failures (score: \${(test.flakinessScore * 100).toFixed(1)}%)\`);
      }
      console.log(\`\n📑 Full report available at: \${path.join(this.reportDir, 'flaky-report.html')}\`);
    }
  }
  
  private getTestId(test: TestCase): string {
    return \`\${test.location.file}:\${test.location.line}:\${test.title}\`;
  }
  
  private sanitizeFileName(name: string): string {
    return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  }
  
  private categorizeErrors(errors: TestError[]): Record<string, number> {
    const categories: Record<string, number> = {};
    
    for (const error of errors) {
      if (!error) continue;
      
      let category = 'unknown';
      
      if (error.message.includes('timeout')) {
        category = 'timeout';
      } else if (error.message.includes('navigation')) {
        category = 'navigation';
      } else if (error.message.includes('detached')) {
        category = 'detached_element';
      } else if (error.message.includes('not visible')) {
        category = 'element_not_visible';
      } else if (error.message.includes('network')) {
        category = 'network';
      } else {
        // Hash the error message for grouping similar errors
        category = createHash('md5').update(error.message).digest('hex').slice(0, 8);
      }
      
      categories[category] = (categories[category] || 0) + 1;
    }
    
    return categories;
  }
  
  private generateHtmlReport(reportData: any[]): void {
    const htmlPath = path.join(this.reportDir, 'flaky-report.html');
    const flakyTests = reportData.filter(r => r.isFlaky);
    
    const html = \`<!DOCTYPE html>
<html>
<head>
    <title>Flaky Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
        .summary { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        tr:hover { background-color: #f5f5f5; }
        .flaky { background-color: #fff0f0; }
        .score-high { color: #d32f2f; font-weight: bold; }
        .score-medium { color: #ff9800; }
        .score-low { color: #4caf50; }
        .error-category { display: inline-block; margin-right: 10px; background: #eee; padding: 2px 5px; border-radius: 3px; }
    </style>
</head>
<body>
    <h1>Flaky Test Report</h1>
    
    <div class="summary">
        <p><strong>Generated:</strong> \${new Date().toLocaleString()}</p>
        <p><strong>Total Tests:</strong> \${reportData.length}</p>
        <p><strong>Flaky Tests:</strong> \${flakyTests.length}</p>
        <p><strong>Flakiness Rate:</strong> \${reportData.length > 0 ? ((flakyTests.length / reportData.length) * 100).toFixed(1) + '%' : '0%'}</p>
    </div>
    
    <h2>Flaky Tests</h2>
    <table>
        <tr>
            <th>Test</th>
            <th>File</th>
            <th>Runs</th>
            <th>Passes</th>
            <th>Failures</th>
            <th>Flakiness Score</th>
            <th>Error Categories</th>
        </tr>
        \${flakyTests.map(test => \`
        <tr class="flaky">
            <td>\${test.title}</td>
            <td>\${test.file}</td>
            <td>\${test.totalRuns}</td>
            <td>\${test.passes}</td>
            <td>\${test.failures}</td>
            <td class="\${test.flakinessScore > 0.3 ? 'score-high' : (test.flakinessScore > 0.1 ? 'score-medium' : 'score-low')}">\${(test.flakinessScore * 100).toFixed(1)}%</td>
            <td>\${Object.entries(test.errorTypes).map(([type, count]) => 
                \`<span class="error-category">\${type}: \${count}</span>\`
            ).join('')}</td>
        </tr>
        \`).join('')}
    </table>
    
    <h2>All Tests</h2>
    <table>
        <tr>
            <th>Test</th>
            <th>File</th>
            <th>Runs</th>
            <th>Passes</th>
            <th>Failures</th>
            <th>Flakiness Score</th>
        </tr>
        \${reportData.map(test => \`
        <tr class="\${test.isFlaky ? 'flaky' : ''}">
            <td>\${test.title}</td>
            <td>\${test.file}</td>
            <td>\${test.totalRuns}</td>
            <td>\${test.passes}</td>
            <td>\${test.failures}</td>
            <td class="\${test.flakinessScore > 0.3 ? 'score-high' : (test.flakinessScore > 0.1 ? 'score-medium' : 'score-low')}">\${(test.flakinessScore * 100).toFixed(1)}%</td>
        </tr>
        \`).join('')}
    </table>
</body>
</html>\`;
    
    fs.writeFileSync(htmlPath, html);
  }
}

export default FlakyTestReporter;
`,
      explanation: "This example shows a comprehensive reporter for tracking and analyzing flaky tests. It monitors test runs, records pass/fail statistics, captures screenshots on failures, and generates detailed reports on flaky tests. The reporter categorizes errors to help identify common causes of flakiness and calculates a flakiness score to prioritize which tests need attention. This kind of reporting is essential for systematically addressing flaky tests in a large test suite."
    }
  ],
  commonPitfalls: [
    {
      name: "Arbitrary Sleep Statements",
      description: "Using fixed sleep/timeout values instead of waiting for specific conditions, leading to tests that are either too slow or flaky when timing varies.",
      solution: "Replace all arbitrary sleep statements with explicit waits for specific application states, DOM elements, or network conditions.",
      preventativeMeasures: [
        "Ban the use of setTimeout or similar arbitrary delays in tests",
        "Create a library of smart waiters for different application scenarios",
        "Add linting rules to detect and prevent arbitrary sleeps"
      ]
    },
    {
      name: "Brittle Selectors",
      description: "Using selectors that depend on CSS classes, specific DOM structure, or other implementation details that frequently change.",
      solution: "Use dedicated test attributes like data-testid for critical elements, and implement robust fallback selector strategies.",
      preventativeMeasures: [
        "Add dedicated test attributes to all elements used in tests",
        "Create a selector utility library with best practices built in",
        "Review selectors during code reviews for brittleness"
      ]
    },
    {
      name: "Shared Test State",
      description: "Tests that depend on state created by other tests or on a specific execution order, causing failures when run in isolation or in different orders.",
      solution: "Ensure each test creates its own isolated state and cleans up afterward, with no dependencies on other tests.",
      preventativeMeasures: [
        "Run tests in random order to detect order dependencies",
        "Use unique identifiers for test data to prevent conflicts",
        "Implement proper setup and teardown for each test"
      ]
    },
    {
      name: "Environment Dependencies",
      description: "Tests that rely on specific environment conditions like screen size, timezone, locale, or system resources, causing inconsistent results across different environments.",
      solution: "Explicitly set and control all relevant environment variables and conditions in the test setup.",
      preventativeMeasures: [
        "Configure browsers with explicit viewport sizes, locales, and other settings",
        "Mock or fix time-dependent operations to use consistent timestamps",
        "Run tests in containerized environments with controlled resources"
      ]
    },
    {
      name: "Network Unpredictability",
      description: "Tests that depend on network operations with variable response times or unreliable external services.",
      solution: "Mock external dependencies or implement robust waiting strategies for network operations.",
      preventativeMeasures: [
        "Use mock servers for external API dependencies",
        "Implement network request tracking and waiting",
        "Set appropriate timeouts for network operations with retry logic"
      ]
    },
    {
      name: "Animation and Transition Effects",
      description: "Tests that interact with elements while CSS animations or transitions are in progress, causing sporadic failures.",
      solution: "Either disable animations in the test environment or implement waiting strategies that account for animation completion.",
      preventativeMeasures: [
        "Add CSS overrides to disable or accelerate animations in test mode",
        "Create waiters that detect when animations have completed",
        "Implement element stability detection before interactions"
      ]
    }
  ],
  improvementGuidelines: {
    description: "Strategies for systematically addressing flaky tests and improving overall test reliability.",
    metrics: [
      {
        name: "Flake Rate",
        description: "The percentage of test runs that result in non-deterministic failures. A lower flake rate indicates more reliable tests.",
        assessmentMethod: "Track pass/fail results across multiple test runs. Calculate: (number of failures when rerun passes / total runs) * 100."
      },
      {
        name: "Mean Time Between Flakes",
        description: "The average time or number of test runs between intermittent failures. Longer times indicate more stable tests.",
        assessmentMethod: "Track consecutive successful test runs and calculate the average number of runs or time period between flaky failures."
      },
      {
        name: "Flaky Test Distribution",
        description: "How flakiness is distributed across the test suite. Concentrated flakiness is easier to address than widespread issues.",
        assessmentMethod: "Track which tests are flaky and analyze patterns. Look for common components, features, or test types."
      },
      {
        name: "Recovery Rate",
        description: "The percentage of flaky tests that are fixed and remain stable after intervention. Higher rates indicate effective flakiness addressing strategies.",
        assessmentMethod: "Track tests that have been identified as flaky, fixed, and monitor if they remain stable over time."
      }
    ]
  },
  resources: [
    {
      type: "documentation",
      name: "Playwright Test Retry and Timeout",
      description: "Official documentation for Playwright Test's retry mechanisms and timeout configurations.",
      link: "https://playwright.dev/docs/test-retries"
    },
    {
      type: "tutorial",
      name: "Best Practices for Stable Selectors",
      description: "A guide to creating stable, resilient selectors in Playwright tests.",
      link: "https://playwright.dev/docs/selectors"
    },
    {
      type: "reference",
      name: "Debugging Flaky Tests",
      description: "Techniques and tools for diagnosing and fixing flaky tests in Playwright.",
      link: "https://playwright.dev/docs/debug"
    },
    {
      type: "tool",
      name: "Testing Library",
      description: "A set of utilities that encourage good testing practices focused on user behavior rather than implementation details.",
      link: "https://testing-library.com/"
    }
  ],
  conclusion: "Flaky tests are one of the biggest challenges in E2E testing, undermining confidence in the test suite and wasting developer time. By applying systematic prevention techniques focused on deterministic testing, proper synchronization, test isolation, environmental consistency, resilient selectors, and comprehensive logging, teams can dramatically reduce flakiness and build more reliable test suites. Remember that addressing flaky tests is an ongoing process that requires both reactive fixes for existing flaky tests and proactive prevention strategies for new tests. With the right approach, E2E tests can be a trustworthy guardian of application quality rather than a source of frustration."
}; 