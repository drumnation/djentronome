/**
 * Skill-Jack: Playwright Page Object Model (POM) Patterns
 * 
 * A comprehensive guide to implementing the Page Object Model pattern in Playwright E2E tests.
 * 
 * @module brain-garden/skill-jack
 * @category testing/patterns
 */

/**
 * Skill-Jack on Playwright Page Object Model Patterns
 * 
 * This constant provides comprehensive guidance on understanding and applying
 * the Page Object Model pattern in Playwright E2E tests.
 */
export const topicGuide = {
  topic: "Playwright Page Object Model Patterns",
  description: "A comprehensive approach to implementing the Page Object Model pattern in Playwright E2E tests, enabling more maintainable, readable, and robust browser automation tests.",
  corePrinciples: [
    {
      name: "Separation of Concerns",
      description: "Separate test logic from page interactions by encapsulating page-specific operations in dedicated page objects.",
      examples: [
        "Creating a LoginPage class that handles all login form interactions",
        "Implementing a ProductPage that encapsulates product viewing and purchasing actions",
        "Building a Navigation class that manages menu and site navigation operations"
      ]
    },
    {
      name: "Interface Abstraction",
      description: "Page objects should provide a high-level interface that abstracts away the details of DOM interactions and selectors.",
      examples: [
        "Exposing methods like `login(username, password)` instead of exposing form field selectors",
        "Providing a `searchProducts(query)` method rather than exposing search input and button selectors",
        "Offering a `completeCheckout()` method instead of exposing individual checkout form fields"
      ]
    },
    {
      name: "State Verification",
      description: "Page objects should include methods to verify their state, such as whether certain elements are visible or specific conditions are met.",
      examples: [
        "Implementing an `isLoggedIn()` method to check authentication state",
        "Creating a `hasProducts()` method to verify products are displayed",
        "Providing an `isFormValid()` method to check form validation state"
      ]
    },
    {
      name: "Component Reusability",
      description: "Break down pages into reusable components that can be shared across multiple page objects to promote code reuse and maintainability.",
      examples: [
        "Creating a HeaderComponent used across multiple page objects",
        "Implementing a SearchComponent that can be reused wherever search functionality appears",
        "Building a FormComponent that standardizes form interaction methods"
      ]
    },
    {
      name: "Chainable Actions",
      description: "Design page objects with chainable actions to enable fluent, readable test sequences that mirror user workflows.",
      examples: [
        "Enabling chains like `loginPage.fillUsername().fillPassword().clickLogin()`",
        "Supporting workflows like `productPage.addToCart().viewCart().checkout()`",
        "Creating navigation flows like `navigation.goToCategory().sortBy('price').filterBy('brand')`"
      ]
    },
    {
      name: "Selector Encapsulation",
      description: "Encapsulate all selectors within page objects to centralize selector maintenance and prevent selector duplication across tests.",
      examples: [
        "Storing all login form selectors as private properties in the LoginPage class",
        "Defining a selectors object or class properties for all page elements",
        "Using descriptive names for selectors to improve readability and maintenance"
      ]
    }
  ],
  applicationProcess: {
    description: "A structured approach to implementing the Page Object Model pattern with Playwright.",
    steps: [
      {
        name: "Define Page Structure",
        description: "Analyze the application to identify distinct pages and their components.",
        agentActions: [
          {
            action: "Identify key pages in the application",
            explanation: "Map out the main pages users interact with (login, dashboard, settings, etc.)."
          },
          {
            action: "Break down pages into components",
            explanation: "Identify reusable components within pages (headers, navigation menus, forms, etc.)."
          },
          {
            action: "Document page relationships",
            explanation: "Define how pages relate to each other and common navigation flows."
          }
        ]
      },
      {
        name: "Create Base Page Class",
        description: "Implement a base page class with common functionality shared across all page objects.",
        agentActions: [
          {
            action: "Define core page methods",
            explanation: "Implement methods for common operations like waiting for page load, navigation, etc."
          },
          {
            action: "Set up page initialization",
            explanation: "Create constructor to accept and store Playwright page object and initialize common elements."
          },
          {
            action: "Implement shared utilities",
            explanation: "Add helper methods for waiting, element interaction, error handling, etc."
          }
        ]
      },
      {
        name: "Implement Page Objects",
        description: "Create specific page object classes for each page in the application.",
        agentActions: [
          {
            action: "Define page selectors",
            explanation: "Create properties for all selectors needed to interact with the page elements."
          },
          {
            action: "Implement page-specific methods",
            explanation: "Create methods that represent user actions specific to the page."
          },
          {
            action: "Add state verification methods",
            explanation: "Implement methods to verify page state, element visibility, etc."
          },
          {
            action: "Create navigation methods",
            explanation: "Add methods that handle navigation to other pages and return appropriate page objects."
          }
        ]
      },
      {
        name: "Develop Reusable Components",
        description: "Create component classes for elements shared across multiple pages.",
        agentActions: [
          {
            action: "Identify common components",
            explanation: "Extract components used across multiple pages (headers, footers, modals, etc.)."
          },
          {
            action: "Implement component classes",
            explanation: "Create classes for each component with relevant selectors and methods."
          },
          {
            action: "Integrate components with page objects",
            explanation: "Use composition to include component instances in relevant page objects."
          }
        ]
      },
      {
        name: "Write E2E Tests Using Page Objects",
        description: "Implement tests that use the page objects to interact with the application.",
        agentActions: [
          {
            action: "Initialize page objects",
            explanation: "Create page object instances at appropriate points in the test flow."
          },
          {
            action: "Use page methods for interactions",
            explanation: "Interact with the application exclusively through page object methods."
          },
          {
            action: "Implement assertions on page states",
            explanation: "Use page object state verification methods for assertions."
          },
          {
            action: "Follow page-to-page navigation",
            explanation: "Use page navigation methods to move between pages in the application."
          }
        ]
      },
      {
        name: "Refine and Maintain",
        description: "Continuously improve the page object implementation based on test experience and application changes.",
        agentActions: [
          {
            action: "Update selectors when UI changes",
            explanation: "Maintain selector accuracy when the application UI is updated."
          },
          {
            action: "Refactor common patterns",
            explanation: "Extract newly identified common patterns into shared components or base class methods."
          },
          {
            action: "Optimize for readability and maintenance",
            explanation: "Regularly review and refine page objects to improve clarity and reduce duplication."
          }
        ]
      }
    ]
  },
  examples: {
    description: "Practical examples of implementing the Page Object Model pattern in Playwright tests.",
    useCases: [
      {
        scenario: "E-commerce user journey",
        implementation: "A set of page objects for browsing products, adding to cart, and completing checkout.",
        outcome: "Tests can simulate complete purchase flows using high-level methods, making them readable and maintainable even as the UI evolves."
      },
      {
        scenario: "User account management",
        implementation: "Page objects for registration, login, profile editing, and account settings.",
        outcome: "Authentication and account management tests use consistent interfaces to interact with forms and verify user states across the application."
      },
      {
        scenario: "Content management system",
        implementation: "Page objects for the admin dashboard, content editor, media library, and publishing workflow.",
        outcome: "CMS tests can create, edit, and publish content through meaningful method calls without directly interacting with complex UI elements."
      },
      {
        scenario: "Data-heavy dashboard application",
        implementation: "Page objects for various dashboard views, filters, visualization components, and report generation.",
        outcome: "Tests can interact with complex data visualizations and controls through intuitive methods that abstract away implementation details."
      }
    ]
  },
  codeExamples: [
    {
      language: "typescript",
      description: "Base Page Object implementation",
      code: `
import { Page, Locator } from '@playwright/test';

/**
 * Base class for all page objects
 */
export abstract class BasePage {
  protected readonly page: Page;
  
  constructor(page: Page) {
    this.page = page;
  }
  
  /**
   * Wait for the page to be loaded
   */
  async waitForPageLoad(): Promise<void> {
    // Wait for the main content to be visible
    await this.page.waitForSelector('main', { state: 'visible' });
  }
  
  /**
   * Get a locator with a descriptive error message for timeout
   */
  protected getLocator(selector: string, description: string): Locator {
    return this.page.locator(selector, {
      hasText: description
    });
  }
  
  /**
   * Safely type into an input field with retry logic
   */
  protected async safeType(selector: string, text: string): Promise<void> {
    await this.page.waitForSelector(selector, { state: 'visible' });
    
    // Clear the field first
    await this.page.locator(selector).clear();
    
    // Type the text
    await this.page.locator(selector).type(text);
  }
  
  /**
   * Safely click on an element with retry logic
   */
  protected async safeClick(selector: string): Promise<void> {
    await this.page.waitForSelector(selector, { state: 'visible' });
    await this.page.locator(selector).click();
  }
  
  /**
   * Get text content from an element
   */
  protected async getText(selector: string): Promise<string> {
    await this.page.waitForSelector(selector, { state: 'visible' });
    return await this.page.locator(selector).textContent() || '';
  }
  
  /**
   * Check if an element exists on the page
   */
  protected async elementExists(selector: string): Promise<boolean> {
    const elements = await this.page.locator(selector).count();
    return elements > 0;
  }
}
`,
      explanation: "This example shows a base page object class with common utility methods for interacting with page elements. It includes methods for waiting for the page to load, safely typing into input fields, clicking elements, and retrieving text content. All page-specific classes will inherit from this base class to leverage these common utilities."
    },
    {
      language: "typescript",
      description: "Login Page Object implementation",
      code: `
import { Page } from '@playwright/test';
import { BasePage } from './base-page';
import { DashboardPage } from './dashboard-page';

/**
 * Page object for the login page
 */
export class LoginPage extends BasePage {
  // Selectors
  private readonly usernameSelector = '#username';
  private readonly passwordSelector = '#password';
  private readonly loginButtonSelector = 'button[type="submit"]';
  private readonly errorMessageSelector = '.error-message';
  
  constructor(page: Page) {
    super(page);
  }
  
  /**
   * Navigate to the login page
   */
  async navigate(): Promise<LoginPage> {
    await this.page.goto('/login');
    await this.waitForPageLoad();
    return this;
  }
  
  /**
   * Fill the username field
   */
  async fillUsername(username: string): Promise<LoginPage> {
    await this.safeType(this.usernameSelector, username);
    return this;
  }
  
  /**
   * Fill the password field
   */
  async fillPassword(password: string): Promise<LoginPage> {
    await this.safeType(this.passwordSelector, password);
    return this;
  }
  
  /**
   * Click the login button
   */
  async clickLogin(): Promise<void> {
    await this.safeClick(this.loginButtonSelector);
  }
  
  /**
   * Complete the login process and return the dashboard page
   */
  async login(username: string, password: string): Promise<DashboardPage> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLogin();
    
    // Wait for navigation to complete
    await this.page.waitForURL('**/dashboard');
    
    // Return the dashboard page
    return new DashboardPage(this.page);
  }
  
  /**
   * Check if an error message is displayed
   */
  async hasErrorMessage(): Promise<boolean> {
    return this.elementExists(this.errorMessageSelector);
  }
  
  /**
   * Get the error message text
   */
  async getErrorMessage(): Promise<string> {
    if (await this.hasErrorMessage()) {
      return this.getText(this.errorMessageSelector);
    }
    return '';
  }
  
  /**
   * Check if the login page is displayed
   */
  async isDisplayed(): Promise<boolean> {
    return this.page.url().includes('/login');
  }
}
`,
      explanation: "This example demonstrates a page object for a login page. It encapsulates all the selectors and interactions specific to the login functionality, providing methods for filling out the login form, submitting it, and checking for error messages. The page object uses method chaining to enable a fluent API and returns other page objects when navigation occurs."
    },
    {
      language: "typescript",
      description: "Reusable component implementation",
      code: `
import { Page, Locator } from '@playwright/test';

/**
 * Component class for a header navigation menu
 */
export class HeaderNavigation {
  private readonly page: Page;
  
  // Selectors
  private readonly headerSelector = 'header.main-header';
  private readonly logoSelector = 'header .logo';
  private readonly searchInputSelector = 'header .search-input';
  private readonly searchButtonSelector = 'header .search-button';
  private readonly userMenuSelector = 'header .user-menu';
  private readonly userMenuDropdownSelector = 'header .user-dropdown';
  
  constructor(page: Page) {
    this.page = page;
  }
  
  /**
   * Get the header locator
   */
  get header(): Locator {
    return this.page.locator(this.headerSelector);
  }
  
  /**
   * Click the logo to go to home page
   */
  async clickLogo(): Promise<void> {
    await this.page.locator(this.logoSelector).click();
    await this.page.waitForURL('**/');
  }
  
  /**
   * Search for a query
   */
  async search(query: string): Promise<void> {
    await this.page.locator(this.searchInputSelector).fill(query);
    await this.page.locator(this.searchButtonSelector).click();
    await this.page.waitForURL('**/search**');
  }
  
  /**
   * Open the user menu
   */
  async openUserMenu(): Promise<void> {
    // Only open if not already open
    if (await this.page.locator(this.userMenuDropdownSelector).isHidden()) {
      await this.page.locator(this.userMenuSelector).click();
      await this.page.waitForSelector(this.userMenuDropdownSelector, { state: 'visible' });
    }
  }
  
  /**
   * Click an item in the user menu
   */
  async clickUserMenuItem(itemName: string): Promise<void> {
    await this.openUserMenu();
    await this.page.locator(\`\${this.userMenuDropdownSelector} a:has-text("\${itemName}")\`).click();
  }
  
  /**
   * Logout using the user menu
   */
  async logout(): Promise<void> {
    await this.clickUserMenuItem('Logout');
    await this.page.waitForURL('**/login');
  }
  
  /**
   * Go to profile using the user menu
   */
  async goToProfile(): Promise<void> {
    await this.clickUserMenuItem('Profile');
    await this.page.waitForURL('**/profile');
  }
  
  /**
   * Check if user is logged in based on user menu presence
   */
  async isLoggedIn(): Promise<boolean> {
    return await this.page.locator(this.userMenuSelector).isVisible();
  }
}
`,
      explanation: "This example shows a reusable component for a header navigation menu that might appear across multiple pages. The component encapsulates all the selectors and interactions related to the header, such as searching, accessing the user menu, and navigating to different sections. This component can be included in various page objects to provide consistent access to header functionality."
    },
    {
      language: "typescript",
      description: "Usage in an E2E test",
      code: `
import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/login-page';
import { ProductPage } from '../page-objects/product-page';
import { CartPage } from '../page-objects/cart-page';
import { CheckoutPage } from '../page-objects/checkout-page';

test.describe('E-commerce purchase flow', () => {
  test('User can purchase a product', async ({ page }) => {
    // Create page objects
    const loginPage = new LoginPage(page);
    
    // Test user credentials
    const username = 'testuser@example.com';
    const password = 'Password123';
    
    // Start by logging in
    await loginPage.navigate();
    const dashboardPage = await loginPage.login(username, password);
    
    // Verify login was successful
    expect(await dashboardPage.isDisplayed()).toBeTruthy();
    
    // Search for a product
    const searchResults = await dashboardPage.header.search('smartphone');
    expect(await searchResults.hasProducts()).toBeTruthy();
    
    // Select the first product
    const productPage = await searchResults.selectProduct(0);
    
    // Add the product to cart
    await productPage.selectVariant('color', 'Black');
    await productPage.selectVariant('storage', '128GB');
    await productPage.setQuantity(2);
    const cartPage = await productPage.addToCart();
    
    // Verify cart contains the product
    expect(await cartPage.getItemCount()).toBe(1);
    expect(await cartPage.getTotalItems()).toBe(2);
    
    // Proceed to checkout
    const checkoutPage = await cartPage.proceedToCheckout();
    
    // Fill shipping information
    await checkoutPage.fillShippingAddress({
      firstName: 'Test',
      lastName: 'User',
      address: '123 Test St',
      city: 'Test City',
      state: 'CA',
      zipCode: '12345',
      country: 'United States'
    });
    
    // Fill payment information
    await checkoutPage.fillPaymentDetails({
      cardNumber: '4111111111111111',
      cardholderName: 'Test User',
      expiryDate: '12/25',
      cvv: '123'
    });
    
    // Complete order
    const confirmationPage = await checkoutPage.placeOrder();
    
    // Verify order was placed successfully
    expect(await confirmationPage.isDisplayed()).toBeTruthy();
    expect(await confirmationPage.getOrderNumber()).toBeTruthy();
    expect(await confirmationPage.getSuccessMessage()).toContain('Thank you for your order');
  });
});
`,
      explanation: "This example shows how the Page Object Model is used in an actual E2E test. The test uses multiple page objects (LoginPage, DashboardPage, ProductPage, CartPage, CheckoutPage, ConfirmationPage) to simulate a complete purchase flow. Notice how the test code is focused on the business process being tested rather than implementation details of the UI. All the selectors and UI interaction logic are encapsulated within the page objects, making the test readable and maintainable."
    }
  ],
  commonPitfalls: [
    {
      name: "Exposing Selectors to Tests",
      description: "Making page selectors public or directly accessible to tests, which couples tests to UI implementation details and reduces maintainability.",
      solution: "Keep selectors private within page objects and only expose high-level methods that represent user actions or state verification.",
      preventativeMeasures: [
        "Define all selectors as private properties",
        "Create methods that encapsulate selector usage",
        "Review tests to ensure they don't directly use selectors"
      ]
    },
    {
      name: "Overly Granular Methods",
      description: "Creating too many tiny methods that require tests to make multiple calls for simple operations, making tests verbose and harder to understand.",
      solution: "Balance granularity by providing both low-level actions and higher-level methods that combine common sequences of actions.",
      preventativeMeasures: [
        "Create helper methods for common action sequences",
        "Implement both granular methods and convenience methods that combine them",
        "Consider the readability of tests when designing page object interfaces"
      ]
    },
    {
      name: "Missing Page Transitions",
      description: "Failing to handle navigation between pages or return appropriate page objects when actions result in navigation.",
      solution: "When an action navigates to a new page, the method should return an instance of the new page object.",
      preventativeMeasures: [
        "Return new page objects from methods that cause navigation",
        "Wait for navigation to complete before returning the new page object",
        "Document methods that result in page transitions"
      ]
    },
    {
      name: "Insufficient State Verification",
      description: "Not providing methods to verify page state, forcing tests to implement their own verification logic.",
      solution: "Include methods in page objects to verify expected states and conditions, making assertions more consistent and maintainable.",
      preventativeMeasures: [
        "Add methods to check for expected elements or states",
        "Implement specific verification methods for important page conditions",
        "Return meaningful state information rather than just booleans when appropriate"
      ]
    },
    {
      name: "Tight Coupling Between Page Objects",
      description: "Creating hard dependencies between page objects that make them difficult to maintain independently.",
      solution: "Use loose coupling between page objects, with navigation methods handling the creation of connected page objects as needed.",
      preventativeMeasures: [
        "Create page objects on demand rather than storing references",
        "Use dependency injection to pass shared resources like the Playwright page",
        "Avoid circular dependencies between page objects"
      ]
    },
    {
      name: "Duplicating Code Across Page Objects",
      description: "Implementing the same functionality in multiple page objects, leading to maintenance challenges when that functionality changes.",
      solution: "Extract common functionality into base classes or reusable components that can be shared across page objects.",
      preventativeMeasures: [
        "Create a robust base page class with common utilities",
        "Implement reusable components for shared UI elements",
        "Regularly refactor to identify and extract common patterns"
      ]
    }
  ],
  improvementGuidelines: {
    description: "Strategies for improving Page Object Model implementation over time.",
    metrics: [
      {
        name: "Test Readability",
        description: "How easily developers can understand the intent and flow of tests. Improved page objects should make tests more declarative and focused on what rather than how.",
        assessmentMethod: "Review tests to see if they clearly express user workflows without implementation details. Ask new team members to explain test purpose without looking at page objects."
      },
      {
        name: "Maintenance Efficiency",
        description: "How quickly and safely UI changes can be accommodated in the test suite. Well-designed page objects should localize changes to a single place.",
        assessmentMethod: "Track time spent updating tests when UI changes. Measure what percentage of UI changes require modifications to multiple files."
      },
      {
        name: "Code Reuse",
        description: "The extent to which page object code is reused rather than duplicated across the test suite. Higher reuse indicates better abstraction.",
        assessmentMethod: "Measure the amount of duplicated code in page objects. Track the ratio of page objects to application pages to identify missing abstractions."
      },
      {
        name: "Test Stability",
        description: "How resistant tests are to breaking due to minor UI changes. Well-implemented page objects should shield tests from many UI changes.",
        assessmentMethod: "Track flaky tests and failures caused by selector changes. Measure the frequency of test breakage during UI refactoring."
      }
    ]
  },
  resources: [
    {
      type: "documentation",
      name: "Playwright Test Documentation",
      description: "Official documentation for Playwright Test, including Page Object Model examples.",
      link: "https://playwright.dev/docs/pom"
    },
    {
      type: "tutorial",
      name: "Page Object Model Best Practices",
      description: "A comprehensive guide to implementing effective page object models in modern web testing.",
      link: "https://www.selenium.dev/documentation/test_practices/encouraged/page_object_models/"
    },
    {
      type: "reference",
      name: "Playwright Page API",
      description: "Documentation for the Playwright Page class, which is crucial for implementing page objects.",
      link: "https://playwright.dev/docs/api/class-page"
    },
    {
      type: "tool",
      name: "Playwright Test Generator",
      description: "A tool for generating initial Page Object Model structure from existing applications.",
      link: "https://playwright.dev/docs/codegen"
    }
  ],
  conclusion: "The Page Object Model pattern is a powerful approach for creating maintainable, readable, and robust E2E tests with Playwright. By encapsulating page-specific logic and selectors within dedicated classes, tests can focus on business workflows rather than implementation details. This separation of concerns makes tests more resistant to UI changes and promotes reuse of common interaction patterns. When implemented effectively, with attention to proper abstraction levels, component reuse, and state verification, the Page Object Model can significantly improve the long-term maintainability of your E2E test suite while making tests more expressive and easier to understand."
}; 