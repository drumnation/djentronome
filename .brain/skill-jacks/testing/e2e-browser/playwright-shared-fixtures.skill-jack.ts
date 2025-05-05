/**
 * Skill-Jack: Playwright Shared Fixtures
 * 
 * A comprehensive guide to creating and using shared fixtures in Playwright E2E tests.
 * 
 * @module brain-garden/skill-jack
 * @category testing/tools
 */

/**
 * Skill-Jack on Playwright Shared Fixtures
 * 
 * This constant provides comprehensive guidance on understanding and applying
 * shared fixtures in Playwright E2E tests.
 */
export const topicGuide = {
  topic: "Playwright Shared Fixtures",
  description: "A comprehensive approach to creating and using shared fixtures in Playwright E2E tests to improve test maintainability, reduce duplication, and enhance test organization.",
  corePrinciples: [
    {
      name: "Test Environment Consistency",
      description: "Fixtures ensure each test runs in a consistent, well-defined environment with predictable starting conditions.",
      examples: [
        "Authentication fixtures that ensure tests start with a logged-in user",
        "Database fixtures that reset to a known state between tests",
        "UI state fixtures that navigate to a specific starting point"
      ]
    },
    {
      name: "Setup and Teardown Automation",
      description: "Fixtures handle the setup before tests and cleanup afterward, ensuring resources are properly initialized and released.",
      examples: [
        "Creating test data before tests and removing it afterward",
        "Starting services or servers needed for tests and shutting them down after",
        "Managing browser state between tests to prevent interference"
      ]
    },
    {
      name: "Composition and Reuse",
      description: "Fixtures should be composable, allowing tests to combine multiple fixtures to build complex test environments while promoting code reuse.",
      examples: [
        "Combining authentication, data, and UI fixtures to test protected features",
        "Reusing the same authentication fixture across multiple test suites",
        "Building higher-level fixtures by composing simpler ones"
      ]
    },
    {
      name: "Fixture Isolation",
      description: "Each fixture should be isolated from others, allowing independent use and preventing unintended side effects between fixtures.",
      examples: [
        "Ensuring authentication fixtures don't interfere with data fixtures",
        "Creating unique test data that won't conflict with other tests",
        "Using separate browser contexts or pages for different test aspects"
      ]
    },
    {
      name: "Declarative Test Dependencies",
      description: "Tests should explicitly declare which fixtures they require, making dependencies clear and preventing hidden coupling.",
      examples: [
        "Using Playwright's fixture parameters to request specific fixtures",
        "Documenting fixture purposes and relationships",
        "Creating descriptive fixture names that convey their purpose"
      ]
    },
    {
      name: "Performance Optimization",
      description: "Fixtures should be designed for optimal performance, reusing expensive resources when possible while maintaining test isolation.",
      examples: [
        "Sharing browser instances across tests while using separate contexts",
        "Batching database operations for test data setup",
        "Caching authentication tokens instead of logging in for each test"
      ]
    }
  ],
  applicationProcess: {
    description: "A structured approach to implementing effective shared fixtures in Playwright tests.",
    steps: [
      {
        name: "Identify Fixture Needs",
        description: "Analyze your tests to identify common setup, state, and resource needs that could benefit from fixtures.",
        agentActions: [
          {
            action: "Review existing test setup code",
            explanation: "Look for repeated setup code across tests that could be extracted into fixtures."
          },
          {
            action: "Identify common test prerequisites",
            explanation: "Determine what state or resources most tests need before they can run."
          },
          {
            action: "Map test dependencies",
            explanation: "Create a dependency map showing which tests need which resources or states."
          }
        ]
      },
      {
        name: "Design Fixture Architecture",
        description: "Create a cohesive architecture for fixtures that supports composition and clear dependency management.",
        agentActions: [
          {
            action: "Define fixture scope and lifetime",
            explanation: "Determine if fixtures should be test-scoped, suite-scoped, or worker-scoped."
          },
          {
            action: "Plan fixture dependencies",
            explanation: "Map how fixtures depend on each other and how they'll be composed."
          },
          {
            action: "Design fixture interfaces",
            explanation: "Define what each fixture provides to tests and other fixtures."
          }
        ]
      },
      {
        name: "Implement Base Fixtures",
        description: "Create the foundational fixtures that other fixtures and tests will build upon.",
        agentActions: [
          {
            action: "Implement browser and context fixtures",
            explanation: "Create fixtures that provide configured browser and context instances."
          },
          {
            action: "Develop authentication fixtures",
            explanation: "Build fixtures for user authentication and session management."
          },
          {
            action: "Create data management fixtures",
            explanation: "Implement fixtures for setting up and cleaning up test data."
          }
        ]
      },
      {
        name: "Implement Composite Fixtures",
        description: "Build higher-level fixtures that combine and build upon base fixtures for specific test scenarios.",
        agentActions: [
          {
            action: "Create user role fixtures",
            explanation: "Implement fixtures for different user roles (admin, regular user, etc.)."
          },
          {
            action: "Develop feature-specific fixtures",
            explanation: "Build fixtures that set up specific application features for testing."
          },
          {
            action: "Implement workflow fixtures",
            explanation: "Create fixtures that prepare multi-step workflows at specific points."
          }
        ]
      },
      {
        name: "Integrate Fixtures with Tests",
        description: "Modify tests to use fixtures instead of inline setup code.",
        agentActions: [
          {
            action: "Update test parameter signatures",
            explanation: "Add fixture parameters to test functions to request specific fixtures."
          },
          {
            action: "Remove duplicated setup code",
            explanation: "Delete inline setup code that's now handled by fixtures."
          },
          {
            action: "Document fixture requirements",
            explanation: "Add comments or documentation explaining which fixtures each test uses and why."
          }
        ]
      },
      {
        name: "Optimize Fixture Performance",
        description: "Refine fixtures to minimize test execution time while maintaining isolation.",
        agentActions: [
          {
            action: "Implement fixture sharing",
            explanation: "Configure fixtures to share expensive resources when safe to do so."
          },
          {
            action: "Add caching mechanisms",
            explanation: "Implement caching for expensive operations like authentication."
          },
          {
            action: "Tune fixture scopes",
            explanation: "Adjust fixture scopes to balance between performance and isolation."
          }
        ]
      }
    ]
  },
  examples: {
    description: "Practical examples of shared fixtures in Playwright tests.",
    useCases: [
      {
        scenario: "Authentication fixtures",
        implementation: "Fixtures that handle user authentication and provide logged-in browser contexts for tests.",
        outcome: "Tests can start with authenticated users without duplicating login code, and authentication tokens can be cached to improve performance."
      },
      {
        scenario: "Data setup fixtures",
        implementation: "Fixtures that create, manage, and clean up test data in databases or APIs.",
        outcome: "Tests run against consistent, isolated data sets without interference, and test data is automatically removed after tests complete."
      },
      {
        scenario: "Page object fixtures",
        implementation: "Fixtures that provide initialized page objects for different application screens.",
        outcome: "Tests can directly access page objects without initialization code, and page objects can be shared across tests that need the same pages."
      },
      {
        scenario: "Server and API fixtures",
        implementation: "Fixtures that start mock servers or API proxies for testing external integrations.",
        outcome: "Tests can run against controlled API environments without external dependencies, and server state can be reset between tests."
      }
    ]
  },
  codeExamples: [
    {
      language: "typescript",
      description: "Basic Playwright test fixtures",
      code: `
import { test as base, expect, BrowserContext, Page } from '@playwright/test';

// Define our fixture types
type MyFixtures = {
  context: BrowserContext;
  authenticatedPage: Page;
  adminPage: Page;
};

// Extend the base test with custom fixtures
export const test = base.extend<MyFixtures>({
  // Override the built-in context fixture to customize it
  context: async ({ browser }, use) => {
    // Create a context with specific options
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      userAgent: 'Playwright Test Agent',
      locale: 'en-US',
      timezoneId: 'America/New_York',
    });
    
    // Set up any global navigation listeners, etc.
    context.on('request', request => {
      console.log(\`>> \${request.method()} \${request.url()}\`);
    });
    
    // Use the context in the test
    await use(context);
    
    // Clean up after the test is done
    await context.close();
  },
  
  // Create a fixture for an authenticated page
  authenticatedPage: async ({ context }, use) => {
    // Create a new page in the context
    const page = await context.newPage();
    
    // Navigate to the login page
    await page.goto('/login');
    
    // Fill and submit the login form
    await page.fill('#username', 'testuser@example.com');
    await page.fill('#password', 'password123');
    await page.click('button[type="submit"]');
    
    // Wait for login to complete
    await page.waitForURL('**/dashboard');
    
    // Provide the authenticated page to the test
    await use(page);
    
    // No cleanup needed here as the context fixture will close all pages
  },
  
  // Create a fixture for an admin page
  adminPage: async ({ context }, use) => {
    // Create a new page in the context
    const page = await context.newPage();
    
    // Navigate to the login page
    await page.goto('/login');
    
    // Fill and submit the login form with admin credentials
    await page.fill('#username', 'admin@example.com');
    await page.fill('#password', 'adminpass');
    await page.click('button[type="submit"]');
    
    // Wait for login to complete
    await page.waitForURL('**/admin-dashboard');
    
    // Provide the admin page to the test
    await use(page);
    
    // No cleanup needed here as the context fixture will close all pages
  }
});

// Re-export expect for convenience
export { expect };
`,
      explanation: "This example demonstrates how to create basic Playwright fixtures by extending the base test object. It includes a customized browser context fixture and two page fixtures for different user roles. The fixtures handle authentication automatically, allowing tests to start with users already logged in. Each fixture follows the standard pattern of setup, providing the resource via the use callback, and cleanup."
    },
    {
      language: "typescript",
      description: "Data fixtures with API calls",
      code: `
import { test as base, expect } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';
import { apiClient } from '../utils/api-client';

// Define test data types
interface TestUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface TestProduct {
  id: string;
  name: string;
  price: number;
  description: string;
}

// Define our fixture types
type DataFixtures = {
  testUser: TestUser;
  testAdmin: TestUser;
  testProducts: TestProduct[];
};

// Extend base test with data fixtures
export const test = base.extend<DataFixtures>({
  // Create a regular test user via API
  testUser: async ({}, use) => {
    // Generate unique email to avoid conflicts
    const uniqueId = uuidv4().substring(0, 8);
    const email = \`testuser_\${uniqueId}@example.com\`;
    
    // Create user via API
    const response = await apiClient.post('/api/users', {
      name: 'Test User',
      email,
      password: 'Password123',
      role: 'user'
    });
    
    const user: TestUser = response.data;
    console.log(\`Created test user: \${user.id}\`);
    
    // Provide the user to the test
    await use(user);
    
    // Clean up after test
    try {
      await apiClient.delete(\`/api/users/\${user.id}\`);
      console.log(\`Deleted test user: \${user.id}\`);
    } catch (error) {
      console.error(\`Failed to delete test user \${user.id}:\`, error);
    }
  },
  
  // Create an admin test user via API
  testAdmin: async ({}, use) => {
    // Generate unique email to avoid conflicts
    const uniqueId = uuidv4().substring(0, 8);
    const email = \`testadmin_\${uniqueId}@example.com\`;
    
    // Create admin user via API
    const response = await apiClient.post('/api/users', {
      name: 'Test Admin',
      email,
      password: 'AdminPass123',
      role: 'admin'
    });
    
    const admin: TestUser = response.data;
    console.log(\`Created test admin: \${admin.id}\`);
    
    // Provide the admin to the test
    await use(admin);
    
    // Clean up after test
    try {
      await apiClient.delete(\`/api/users/\${admin.id}\`);
      console.log(\`Deleted test admin: \${admin.id}\`);
    } catch (error) {
      console.error(\`Failed to delete test admin \${admin.id}:\`, error);
    }
  },
  
  // Create test products via API
  testProducts: async ({}, use) => {
    const createdProducts: TestProduct[] = [];
    
    // Create several test products
    for (let i = 1; i <= 3; i++) {
      const uniqueId = uuidv4().substring(0, 8);
      
      const response = await apiClient.post('/api/products', {
        name: \`Test Product \${i}\`,
        price: 10.99 * i,
        description: \`This is test product \${i}\`,
        sku: \`TEST-\${uniqueId}\`
      });
      
      createdProducts.push(response.data);
      console.log(\`Created test product: \${response.data.id}\`);
    }
    
    // Provide the products to the test
    await use(createdProducts);
    
    // Clean up all created products
    for (const product of createdProducts) {
      try {
        await apiClient.delete(\`/api/products/\${product.id}\`);
        console.log(\`Deleted test product: \${product.id}\`);
      } catch (error) {
        console.error(\`Failed to delete test product \${product.id}:\`, error);
      }
    }
  }
});

// Re-export expect for convenience
export { expect };
`,
      explanation: "This example demonstrates data fixtures that use API calls to create and clean up test data. It includes fixtures for creating regular users, admin users, and product data. Each fixture creates unique test data, provides it to the test, and then cleans up afterward. The fixtures use UUID generation to ensure test data doesn't conflict between concurrent test runs."
    },
    {
      language: "typescript",
      description: "Composable fixtures with dependencies",
      code: `
import { test as base, expect, Page } from '@playwright/test';
import { LoginPage } from '../page-objects/login-page';
import { DashboardPage } from '../page-objects/dashboard-page';
import { ProductsPage } from '../page-objects/products-page';
import { CartPage } from '../page-objects/cart-page';

// Define our fixture types
type PageFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  productsPage: ProductsPage;
  cartPage: CartPage;
  
  // Higher-level fixtures that depend on other fixtures
  loggedInUser: { page: Page; dashboardPage: DashboardPage };
  userWithItemsInCart: { page: Page; cartPage: CartPage };
};

// Extend the base test with page object fixtures
export const test = base.extend<PageFixtures>({
  // Base page object fixtures
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },
  
  productsPage: async ({ page }, use) => {
    const productsPage = new ProductsPage(page);
    await use(productsPage);
  },
  
  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },
  
  // Composite fixture that depends on other fixtures
  loggedInUser: async ({ page, loginPage, dashboardPage }, use) => {
    // Navigate to login page
    await loginPage.navigate();
    
    // Log in with test credentials
    await loginPage.login('testuser@example.com', 'password123');
    
    // Wait for dashboard to load
    await dashboardPage.waitForPageLoad();
    
    // Provide both the page and dashboard to the test
    await use({ page, dashboardPage });
    
    // No cleanup needed as page fixture will be closed automatically
  },
  
  // Advanced composite fixture that builds on loggedInUser
  userWithItemsInCart: async ({ loggedInUser, productsPage, cartPage }, use) => {
    // Use the already logged-in page from the loggedInUser fixture
    const { page } = loggedInUser;
    
    // Navigate to products page
    await page.goto('/products');
    await productsPage.waitForPageLoad();
    
    // Add a couple of products to cart
    await productsPage.addProductToCart(0);
    await productsPage.addProductToCart(2);
    
    // Navigate to cart
    await page.goto('/cart');
    await cartPage.waitForPageLoad();
    
    // Verify items are in cart
    const itemCount = await cartPage.getItemCount();
    if (itemCount < 2) {
      throw new Error('Failed to add items to cart in fixture setup');
    }
    
    // Provide the page and cart page to the test
    await use({ page, cartPage });
    
    // Optional cleanup: empty the cart after test
    await cartPage.emptyCart();
  }
});

// Re-export expect for convenience
export { expect };
`,
      explanation: "This example demonstrates composable fixtures with dependencies. It includes base fixtures for page objects, as well as higher-level composite fixtures that build on them. The loggedInUser fixture depends on loginPage and dashboardPage fixtures, while userWithItemsInCart builds on loggedInUser and adds additional setup. This composition allows tests to request exactly the environment they need without duplicating setup code."
    },
    {
      language: "typescript",
      description: "Using fixtures in tests",
      code: `
import { test, expect } from './fixtures';

test.describe('Shopping cart functionality', () => {
  test('User can view dashboard after login', async ({ loggedInUser }) => {
    // The loggedInUser fixture provides an already authenticated user
    const { dashboardPage } = loggedInUser;
    
    // Verify user is logged in and on dashboard
    expect(await dashboardPage.isUserLoggedIn()).toBeTruthy();
    expect(await dashboardPage.getUserName()).toBe('Test User');
    
    // Test dashboard functionality
    expect(await dashboardPage.getRecentOrdersCount()).toBeGreaterThanOrEqual(0);
    expect(await dashboardPage.isQuickActionsVisible()).toBeTruthy();
  });
  
  test('User can add products to cart', async ({ loggedInUser, productsPage }) => {
    const { page } = loggedInUser;
    
    // Navigate to products page
    await page.goto('/products');
    await productsPage.waitForPageLoad();
    
    // Get initial product count
    const initialCount = await productsPage.getProductCount();
    expect(initialCount).toBeGreaterThan(0);
    
    // Add a product to cart
    const productName = await productsPage.getProductName(0);
    await productsPage.addProductToCart(0);
    
    // Verify cart indicator updated
    expect(await productsPage.getCartItemCount()).toBe(1);
    
    // Navigate to cart and verify product is there
    await page.goto('/cart');
    const cartPage = new CartPage(page);
    await cartPage.waitForPageLoad();
    
    expect(await cartPage.getItemCount()).toBe(1);
    expect(await cartPage.getItemName(0)).toBe(productName);
  });
  
  test('User can checkout from cart with items', async ({ userWithItemsInCart }) => {
    // The userWithItemsInCart fixture provides a user with products already in cart
    const { cartPage } = userWithItemsInCart;
    
    // Verify items are in cart
    expect(await cartPage.getItemCount()).toBeGreaterThanOrEqual(2);
    
    // Proceed to checkout
    const checkoutPage = await cartPage.proceedToCheckout();
    
    // Verify checkout page loaded with correct items
    expect(await checkoutPage.getTitle()).toContain('Checkout');
    expect(await checkoutPage.getItemCount()).toBeGreaterThanOrEqual(2);
    expect(await checkoutPage.getTotalAmount()).toBeGreaterThan(0);
  });
});
`,
      explanation: "This example demonstrates how to use fixtures in tests. The tests import custom fixtures and use them to set up the test environment. Notice how each test can request specific fixtures that provide exactly the environment it needs. The first test uses the loggedInUser fixture to test dashboard functionality, the second uses loggedInUser and productsPage to test adding products to the cart, and the third uses the userWithItemsInCart fixture to start with products already in the cart and test checkout."
    }
  ],
  commonPitfalls: [
    {
      name: "Overly Complex Fixtures",
      description: "Creating fixtures that do too much, making them brittle, hard to maintain, and difficult to debug when they fail.",
      solution: "Follow the single responsibility principle: create focused fixtures that do one thing well, and compose them to build more complex scenarios.",
      preventativeMeasures: [
        "Review fixtures regularly to ensure they have a clear, single purpose",
        "Extract multiple responsibilities into separate fixtures",
        "Use composition rather than creating monolithic fixtures"
      ]
    },
    {
      name: "Hidden Dependencies",
      description: "Creating fixtures with implicit dependencies on other fixtures or global state, making test failures unpredictable and hard to diagnose.",
      solution: "Make dependencies explicit by declaring them in fixture parameters and avoiding reliance on global state.",
      preventativeMeasures: [
        "Declare all fixture dependencies in the fixture parameters",
        "Avoid using global variables or state in fixtures",
        "Document fixture dependencies clearly"
      ]
    },
    {
      name: "Insufficient Cleanup",
      description: "Failing to properly clean up resources created by fixtures, leading to test interference and resource leaks.",
      solution: "Implement thorough cleanup in fixtures, using try-finally blocks to ensure cleanup runs even after test failures.",
      preventativeMeasures: [
        "Add cleanup code after the use callback in every fixture",
        "Use try-finally blocks to ensure cleanup runs after errors",
        "Verify that all created resources are properly released or deleted"
      ]
    },
    {
      name: "Performance Bottlenecks",
      description: "Creating fixtures that are unnecessarily slow, making the entire test suite take longer to run and reducing developer productivity.",
      solution: "Optimize fixture performance by caching results, reusing resources when safe, and minimizing expensive operations.",
      preventativeMeasures: [
        "Profile fixture execution time to identify slow fixtures",
        "Cache expensive resources like authentication tokens",
        "Use appropriate fixture scopes to balance isolation and performance"
      ]
    },
    {
      name: "Over-Isolation",
      description: "Creating completely new environments for every test, leading to slow tests and excessive resource usage without improving test reliability.",
      solution: "Find the right balance between isolation and resource sharing based on test requirements and resource costs.",
      preventativeMeasures: [
        "Share read-only resources between tests when safe",
        "Use worker-scoped fixtures for expensive but stateless resources",
        "Reset state between tests rather than recreating everything"
      ]
    },
    {
      name: "Poor Error Reporting",
      description: "Fixtures that fail without providing clear error information, making it difficult to diagnose issues in the test environment setup.",
      solution: "Add detailed logging and error handling to fixtures to provide clear context when problems occur.",
      preventativeMeasures: [
        "Add descriptive error messages for fixture failures",
        "Log key fixture actions for debugging",
        "Wrap fixture logic in try-catch blocks with contextual error reporting"
      ]
    }
  ],
  improvementGuidelines: {
    description: "Strategies for improving shared fixtures over time.",
    metrics: [
      {
        name: "Fixture Reuse Rate",
        description: "How frequently fixtures are reused across different tests. Higher reuse indicates well-designed fixtures that provide value in multiple scenarios.",
        assessmentMethod: "Track which fixtures are used by which tests. Identify fixtures that are only used by one test and consider whether they should be inline setup instead."
      },
      {
        name: "Test Setup Time",
        description: "The time spent in fixture setup and teardown relative to actual test execution. Efficient fixtures minimize setup time while providing necessary environment.",
        assessmentMethod: "Measure the time spent in fixture setup versus test execution. Optimize fixtures that consume a disproportionate amount of time."
      },
      {
        name: "Fixture Failure Rate",
        description: "How often tests fail due to fixture setup issues rather than actual test failures. Reliable fixtures should rarely cause test failures.",
        assessmentMethod: "Track test failures and categorize by cause (test issue vs. fixture issue). Address fixtures with high failure rates."
      },
      {
        name: "Fixture Complexity",
        description: "The complexity of fixture implementation, including lines of code, number of dependencies, and cognitive complexity.",
        assessmentMethod: "Review fixture code for complexity metrics. Refactor complex fixtures into simpler, more focused ones."
      }
    ]
  },
  resources: [
    {
      type: "documentation",
      name: "Playwright Test Fixtures",
      description: "Official documentation for Playwright Test fixtures, including creation and usage patterns.",
      link: "https://playwright.dev/docs/test-fixtures"
    },
    {
      type: "tutorial",
      name: "Advanced Playwright Fixtures",
      description: "In-depth guide to creating and composing advanced Playwright fixtures for complex testing scenarios.",
      link: "https://playwright.dev/docs/test-advanced"
    },
    {
      type: "reference",
      name: "Fixture Options and Scopes",
      description: "Reference documentation for fixture configuration options and scope settings.",
      link: "https://playwright.dev/docs/api/class-test"
    },
    {
      type: "tool",
      name: "Playwright Test Fixture Examples",
      description: "Examples of fixture usage in the Playwright repository.",
      link: "https://github.com/microsoft/playwright/tree/main/tests/playwright-test/fixtures"
    }
  ],
  conclusion: "Shared fixtures in Playwright tests provide a powerful mechanism for creating maintainable, consistent test environments while reducing code duplication. By encapsulating setup and teardown logic in reusable fixtures, tests can focus on verifying application behavior rather than environment setup. When designed with principles like composition, isolation, and explicit dependencies in mind, fixtures can significantly improve test reliability, readability, and performance. Investing time in a well-designed fixture architecture pays dividends in the long term through faster test development, easier maintenance, and more reliable test execution."
}; 