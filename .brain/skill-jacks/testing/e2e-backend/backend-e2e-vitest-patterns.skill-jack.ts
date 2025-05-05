/**
 * Skill-Jack: Backend E2E Vitest Patterns
 * 
 * A comprehensive guide to implementing end-to-end tests for backend systems using Vitest.
 * 
 * @module brain-garden/skill-jack
 * @category testing/patterns
 */

/**
 * Skill-Jack on Backend E2E Vitest Patterns
 * 
 * This constant provides comprehensive guidance on understanding and applying
 * end-to-end testing patterns for backend systems using Vitest.
 */
export const topicGuide = {
  topic: "Backend E2E Testing with Vitest",
  description: "A comprehensive approach to designing and implementing end-to-end tests for backend systems using Vitest, focusing on testing complete workflows across multiple components without browser interactions.",
  corePrinciples: [
    {
      name: "Complete Workflow Testing",
      description: "E2E tests should validate entire business workflows from start to finish, testing all components involved in a process rather than isolated units.",
      examples: [
        "Testing a user registration flow from API request through validation, database storage, and email sending",
        "Verifying order processing including inventory updates, payment processing, and notification generation",
        "Testing data import/export flows from file upload through processing, storage, and reporting"
      ]
    },
    {
      name: "Realistic Environment Setup",
      description: "Tests should run in an environment that closely resembles production, with all dependencies either present or realistically mocked.",
      examples: [
        "Using containerized databases with production-like schema and constraints",
        "Setting up test instances of message queues or event buses",
        "Configuring services with production-like settings but in test mode"
      ]
    },
    {
      name: "External System Simulation",
      description: "External systems should be simulated with mocks or test doubles that faithfully represent their behavior without requiring actual external connections.",
      examples: [
        "Mocking payment gateways with configurable responses for different test scenarios",
        "Creating simulation APIs for third-party services",
        "Using test doubles for email or SMS delivery that capture messages for verification"
      ]
    },
    {
      name: "Data-Driven Scenario Testing",
      description: "Tests should be structured to easily run the same workflows with different input data to cover various scenarios and edge cases.",
      examples: [
        "Testing validation with both valid and invalid data variations",
        "Verifying business logic with different user types or permission levels",
        "Testing error handling with various error conditions and recovery paths"
      ]
    },
    {
      name: "Asynchronous Process Verification",
      description: "Tests should effectively handle and verify asynchronous processes, including background jobs, scheduled tasks, and event-driven operations.",
      examples: [
        "Verifying that scheduled jobs execute at the right time and produce expected results",
        "Testing event handlers process events correctly and produce appropriate side effects",
        "Confirming that long-running processes complete successfully and update status appropriately"
      ]
    },
    {
      name: "Stateful Test Progression",
      description: "Tests should be able to establish and maintain state throughout a test workflow, allowing verification of complex multi-step processes.",
      examples: [
        "Maintaining a user session across multiple API requests",
        "Tracking created entities and their state changes throughout a workflow",
        "Building up scenario state progressively to test complex interactions"
      ]
    }
  ],
  applicationProcess: {
    description: "A structured approach to implementing effective backend E2E tests with Vitest.",
    steps: [
      {
        name: "Define E2E Test Boundaries",
        description: "Determine the scope and boundaries of E2E tests, identifying complete workflows to test and interfaces to mock.",
        agentActions: [
          {
            action: "Identify critical user journeys",
            explanation: "Map out the primary user workflows that cross multiple components or services."
          },
          {
            action: "Determine system boundaries",
            explanation: "Define which external systems will be mocked and which will be included in the test environment."
          },
          {
            action: "Prioritize test scenarios",
            explanation: "Rank workflows by risk, complexity, and business importance to focus testing efforts."
          }
        ]
      },
      {
        name: "Set Up Test Environment",
        description: "Create a controlled test environment that includes all necessary components and dependencies.",
        agentActions: [
          {
            action: "Configure containerized dependencies",
            explanation: "Set up Docker containers for databases, message queues, and other infrastructure components."
          },
          {
            action: "Implement external service mocks",
            explanation: "Create mock implementations of external APIs and services for testing."
          },
          {
            action: "Configure environment variables",
            explanation: "Set appropriate environment variables to put services in test mode and connect to test dependencies."
          }
        ]
      },
      {
        name: "Implement Test Data Management",
        description: "Develop strategies for creating, managing, and cleaning up test data to support E2E scenarios.",
        agentActions: [
          {
            action: "Create seed data utilities",
            explanation: "Build functions to seed databases and other stores with baseline test data."
          },
          {
            action: "Implement data factories",
            explanation: "Develop generators for creating test entities with appropriate values and relationships."
          },
          {
            action: "Set up data cleanup routines",
            explanation: "Create utilities to reset the environment to a clean state after tests."
          }
        ]
      },
      {
        name: "Build Workflow Test Helpers",
        description: "Create helper functions and utilities to simplify writing and executing workflow-based tests.",
        agentActions: [
          {
            action: "Develop API client helpers",
            explanation: "Create utilities for making API requests with appropriate authentication and formatting."
          },
          {
            action: "Implement state tracking utilities",
            explanation: "Build helpers to track and verify state changes across workflow steps."
          },
          {
            action: "Create verification helpers",
            explanation: "Develop functions to verify complex output or state conditions."
          }
        ]
      },
      {
        name: "Structure E2E Tests",
        description: "Organize tests in a way that clearly represents the workflows being tested and allows for easy maintenance.",
        agentActions: [
          {
            action: "Group tests by workflow or feature",
            explanation: "Organize tests into logical groups based on business functionality or user journeys."
          },
          {
            action: "Structure tests in workflow steps",
            explanation: "Divide tests into clear setup, action, and verification steps that follow the user journey."
          },
          {
            action: "Use descriptive test names",
            explanation: "Name tests to clearly describe the scenario and expected outcome, serving as documentation."
          }
        ]
      },
      {
        name: "Handle Asynchronous Operations",
        description: "Implement mechanisms to properly test asynchronous operations and ensure reliable test results.",
        agentActions: [
          {
            action: "Set up waiting mechanisms",
            explanation: "Create utilities to wait for asynchronous operations to complete before verification."
          },
          {
            action: "Implement polling for status changes",
            explanation: "Build functions to poll for expected state changes with appropriate timeouts."
          },
          {
            action: "Configure event listeners",
            explanation: "Set up event listeners to detect when asynchronous processes have completed."
          }
        ]
      }
    ]
  },
  examples: {
    description: "Practical examples of backend E2E testing patterns in different scenarios.",
    useCases: [
      {
        scenario: "User registration and authentication flow",
        implementation: "E2E tests that verify a complete user registration, email verification, and login process using a REST API.",
        outcome: "Tests confirm that users can register, receive verification emails, verify their accounts, log in successfully, and access protected resources with the correct permissions."
      },
      {
        scenario: "Order processing workflow",
        implementation: "Tests that verify the complete order processing flow from order creation through payment, inventory updates, and fulfillment.",
        outcome: "Tests confirm that orders are processed correctly, inventory is updated, payments are verified, and the order status progresses through expected states as the workflow completes."
      },
      {
        scenario: "Data import and processing pipeline",
        implementation: "E2E tests for a data import system that processes files, validates data, transforms records, and produces reports.",
        outcome: "Tests verify that valid files are processed correctly, data is transformed and stored according to business rules, invalid data is handled appropriately, and accurate reports are generated."
      },
      {
        scenario: "Scheduled job execution",
        implementation: "Tests that verify the execution and results of scheduled background jobs that process data or perform system maintenance.",
        outcome: "Tests confirm that jobs execute at the expected times, process their tasks correctly, handle errors appropriately, and produce expected results or side effects."
      }
    ]
  },
  codeExamples: [
    {
      language: "typescript",
      description: "E2E test for user registration and authentication flow",
      code: `
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { setup, teardown } from '../test-utils/environment';
import { ApiClient } from '../test-utils/api-client';
import { EmailTester } from '../test-utils/email-tester';
import { UserFactory } from '../test-utils/factories';
import { extractVerificationToken } from '../test-utils/email-parser';

describe('User Registration and Authentication E2E', () => {
  let environment;
  let apiClient: ApiClient;
  let emailTester: EmailTester;
  
  beforeAll(async () => {
    // Set up the test environment (databases, services, etc.)
    environment = await setup({
      seedDatabase: true,
      startEmailServer: true
    });
    
    // Create test clients
    apiClient = new ApiClient(environment.apiUrl);
    emailTester = new EmailTester(environment.emailServer);
  });
  
  afterAll(async () => {
    // Clean up the test environment
    await teardown(environment);
  });
  
  beforeEach(async () => {
    // Clear emails and reset any per-test state
    await emailTester.clearEmails();
  });
  
  it('should register, verify, and authenticate a user successfully', async () => {
    // STEP 1: Generate test user data
    const testUser = UserFactory.build({
      email: \`test-\${Date.now()}@example.com\`,
      password: 'Password123!'
    });
    
    // STEP 2: Register user
    const registerResponse = await apiClient.post('/auth/register', {
      email: testUser.email,
      password: testUser.password,
      name: testUser.name
    });
    
    // Verify registration response
    expect(registerResponse.status).toBe(201);
    expect(registerResponse.data.success).toBe(true);
    expect(registerResponse.data.message).toContain('verification email');
    
    // STEP 3: Retrieve and verify the verification email
    const emails = await emailTester.waitForEmails({
      to: testUser.email,
      subject: /verification/i,
      timeout: 5000
    });
    
    expect(emails.length).toBe(1);
    const verificationEmail = emails[0];
    expect(verificationEmail.subject).toContain('Verify Your Account');
    
    // Extract verification token from email
    const verificationToken = extractVerificationToken(verificationEmail.html);
    expect(verificationToken).toBeTruthy();
    
    // STEP 4: Verify email with the token
    const verifyResponse = await apiClient.post('/auth/verify-email', {
      token: verificationToken
    });
    
    // Verify response
    expect(verifyResponse.status).toBe(200);
    expect(verifyResponse.data.success).toBe(true);
    
    // STEP 5: Log in with verified credentials
    const loginResponse = await apiClient.post('/auth/login', {
      email: testUser.email,
      password: testUser.password
    });
    
    // Verify login response
    expect(loginResponse.status).toBe(200);
    expect(loginResponse.data.success).toBe(true);
    expect(loginResponse.data.token).toBeTruthy();
    
    // Store the authentication token
    const authToken = loginResponse.data.token;
    
    // STEP 6: Access a protected resource
    const profileResponse = await apiClient.get('/user/profile', {
      headers: {
        Authorization: \`Bearer \${authToken}\`
      }
    });
    
    // Verify profile access
    expect(profileResponse.status).toBe(200);
    expect(profileResponse.data.email).toBe(testUser.email);
    expect(profileResponse.data.name).toBe(testUser.name);
    expect(profileResponse.data.verified).toBe(true);
    
    // STEP 7: Verify unauthorized access is prevented
    const unauthorizedResponse = await apiClient.get('/user/profile', {
      failOnError: false // Don't throw on error status
    });
    
    // Verify unauthorized response
    expect(unauthorizedResponse.status).toBe(401);
  });
  
  it('should handle invalid registration data correctly', async () => {
    // Test with invalid data
    const invalidUserData = {
      email: 'not-an-email',
      password: '123', // Too short
      name: '' // Empty name
    };
    
    // Attempt to register
    const response = await apiClient.post('/auth/register', invalidUserData, {
      failOnError: false
    });
    
    // Verify error response
    expect(response.status).toBe(400);
    expect(response.data.success).toBe(false);
    expect(response.data.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'email' }),
        expect.objectContaining({ field: 'password' }),
        expect.objectContaining({ field: 'name' })
      ])
    );
    
    // Verify no email was sent
    const emails = await emailTester.getEmails({ to: invalidUserData.email });
    expect(emails.length).toBe(0);
  });
});
`,
      explanation: "This example demonstrates an E2E test for a complete user registration and authentication flow. It sets up a test environment, simulates a user registering, receiving and using a verification email, logging in, and accessing protected resources. The test verifies the complete workflow across multiple backend components including API endpoints, authentication logic, email sending, and data persistence."
    },
    {
      language: "typescript",
      description: "E2E test for an order processing workflow",
      code: `
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { setup, teardown } from '../test-utils/environment';
import { ApiClient } from '../test-utils/api-client';
import { DatabaseClient } from '../test-utils/db-client';
import { MockPaymentGateway } from '../test-utils/payment-gateway-mock';
import { OrderFactory, ProductFactory } from '../test-utils/factories';
import { waitForOrderStatus } from '../test-utils/async-helpers';

describe('Order Processing Workflow E2E', () => {
  let environment;
  let apiClient: ApiClient;
  let dbClient: DatabaseClient;
  let paymentGateway: MockPaymentGateway;
  let testProducts;
  let authToken;
  
  beforeAll(async () => {
    // Set up the test environment
    environment = await setup({
      seedDatabase: true,
      mockPaymentGateway: true
    });
    
    // Initialize test clients
    apiClient = new ApiClient(environment.apiUrl);
    dbClient = new DatabaseClient(environment.dbConfig);
    paymentGateway = environment.paymentGateway;
    
    // Create test products in the database
    testProducts = await createTestProducts(dbClient);
    
    // Authenticate for API requests
    authToken = await authenticateTestUser(apiClient);
  });
  
  afterAll(async () => {
    await teardown(environment);
  });
  
  beforeEach(async () => {
    // Reset payment gateway and any per-test state
    await paymentGateway.reset();
  });
  
  async function createTestProducts(db) {
    const products = [
      ProductFactory.build({ name: 'Test Product 1', price: 25.99, stockQuantity: 100 }),
      ProductFactory.build({ name: 'Test Product 2', price: 10.50, stockQuantity: 200 })
    ];
    
    // Insert products into database
    for (const product of products) {
      await db.query(
        'INSERT INTO products (name, price, stock_quantity) VALUES ($1, $2, $3) RETURNING id',
        [product.name, product.price, product.stockQuantity]
      );
    }
    
    // Retrieve products with IDs
    const result = await db.query('SELECT * FROM products WHERE name LIKE $1', ['Test Product%']);
    return result.rows;
  }
  
  async function authenticateTestUser(client) {
    const loginResponse = await client.post('/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    return loginResponse.data.token;
  }
  
  it('should process an order from creation to fulfillment', async () => {
    // STEP 1: Create an order
    const orderItems = [
      { productId: testProducts[0].id, quantity: 2 },
      { productId: testProducts[1].id, quantity: 3 }
    ];
    
    const orderData = {
      items: orderItems,
      shippingAddress: {
        name: 'Test Customer',
        street: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
        country: 'Test Country'
      }
    };
    
    const createResponse = await apiClient.post('/orders', orderData, {
      headers: { Authorization: \`Bearer \${authToken}\` }
    });
    
    // Verify order creation
    expect(createResponse.status).toBe(201);
    expect(createResponse.data.orderId).toBeDefined();
    expect(createResponse.data.status).toBe('pending');
    
    const orderId = createResponse.data.orderId;
    
    // STEP 2: Verify inventory was reserved
    const inventoryCheck = await dbClient.query(
      'SELECT * FROM products WHERE id = $1',
      [testProducts[0].id]
    );
    
    expect(inventoryCheck.rows[0].reserved_quantity).toBe(2);
    
    // STEP 3: Submit payment
    const totalPrice = (testProducts[0].price * 2) + (testProducts[1].price * 3);
    
    const paymentResponse = await apiClient.post(\`/orders/\${orderId}/payments\`, {
      paymentMethod: 'credit_card',
      cardNumber: '4111111111111111',
      expiryMonth: '12',
      expiryYear: '2030',
      cvv: '123'
    }, {
      headers: { Authorization: \`Bearer \${authToken}\` }
    });
    
    // Verify payment response
    expect(paymentResponse.status).toBe(200);
    expect(paymentResponse.data.success).toBe(true);
    expect(paymentResponse.data.paymentId).toBeDefined();
    
    // Verify payment gateway received the request
    const paymentRequests = await paymentGateway.getRequests();
    expect(paymentRequests.length).toBe(1);
    expect(paymentRequests[0].amount).toBeCloseTo(totalPrice);
    
    // STEP 4: Wait for order processing to complete
    const processedOrder = await waitForOrderStatus(dbClient, orderId, 'processing', {
      maxWaitMs: 5000,
      intervalMs: 500
    });
    
    expect(processedOrder).not.toBeNull();
    expect(processedOrder.payment_status).toBe('paid');
    
    // STEP 5: Simulate fulfillment
    const fulfillResponse = await apiClient.post(
      \`/admin/orders/\${orderId}/fulfill\`,
      {
        trackingNumber: 'TRK123456789',
        carrier: 'Test Carrier'
      },
      {
        headers: { Authorization: \`Bearer \${authToken}\` }
      }
    );
    
    // Verify fulfillment response
    expect(fulfillResponse.status).toBe(200);
    expect(fulfillResponse.data.success).toBe(true);
    
    // STEP 6: Wait for order to be marked as shipped
    const shippedOrder = await waitForOrderStatus(dbClient, orderId, 'shipped', {
      maxWaitMs: 5000,
      intervalMs: 500
    });
    
    expect(shippedOrder).not.toBeNull();
    expect(shippedOrder.tracking_number).toBe('TRK123456789');
    
    // STEP 7: Verify inventory was updated (reserved quantities converted to reductions)
    const finalInventory = await dbClient.query(
      'SELECT * FROM products WHERE id = $1',
      [testProducts[0].id]
    );
    
    expect(finalInventory.rows[0].stock_quantity).toBe(98); // 100 - 2
    expect(finalInventory.rows[0].reserved_quantity).toBe(0);
    
    // STEP 8: Verify order details via API
    const orderResponse = await apiClient.get(\`/orders/\${orderId}\`, {
      headers: { Authorization: \`Bearer \${authToken}\` }
    });
    
    // Verify complete order details
    expect(orderResponse.status).toBe(200);
    expect(orderResponse.data.id).toBe(orderId);
    expect(orderResponse.data.status).toBe('shipped');
    expect(orderResponse.data.paymentStatus).toBe('paid');
    expect(orderResponse.data.trackingNumber).toBe('TRK123456789');
    expect(orderResponse.data.items.length).toBe(2);
    expect(orderResponse.data.totalPrice).toBeCloseTo(totalPrice);
  });
  
  it('should handle payment failure correctly', async () => {
    // Configure payment gateway to reject the next payment
    await paymentGateway.configureNextResponse({
      success: false,
      errorCode: 'card_declined',
      errorMessage: 'The card was declined'
    });
    
    // Create an order
    const orderItems = [
      { productId: testProducts[0].id, quantity: 1 }
    ];
    
    const createResponse = await apiClient.post('/orders', {
      items: orderItems,
      shippingAddress: {
        name: 'Test Customer',
        street: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
        country: 'Test Country'
      }
    }, {
      headers: { Authorization: \`Bearer \${authToken}\` }
    });
    
    const orderId = createResponse.data.orderId;
    
    // Submit payment that will be declined
    const paymentResponse = await apiClient.post(\`/orders/\${orderId}/payments\`, {
      paymentMethod: 'credit_card',
      cardNumber: '4111111111111111',
      expiryMonth: '12',
      expiryYear: '2030',
      cvv: '123'
    }, {
      headers: { Authorization: \`Bearer \${authToken}\` },
      failOnError: false
    });
    
    // Verify payment failure
    expect(paymentResponse.status).toBe(400);
    expect(paymentResponse.data.success).toBe(false);
    expect(paymentResponse.data.error).toContain('declined');
    
    // Wait for order to be marked as payment_failed
    const failedOrder = await waitForOrderStatus(dbClient, orderId, 'payment_failed', {
      maxWaitMs: 5000,
      intervalMs: 500
    });
    
    expect(failedOrder).not.toBeNull();
    
    // Verify inventory reservation was released
    const inventoryCheck = await dbClient.query(
      'SELECT * FROM products WHERE id = $1',
      [testProducts[0].id]
    );
    
    expect(inventoryCheck.rows[0].reserved_quantity).toBe(0);
    expect(inventoryCheck.rows[0].stock_quantity).toBe(100); // Unchanged
  });
});
`,
      explanation: "This example demonstrates an E2E test for an order processing workflow. It sets up test data including products and user authentication, then tests the complete flow of creating an order, reserving inventory, processing payment, fulfilling the order, and verifying the final state. It also tests the error path of payment failure and inventory release. The test uses a mock payment gateway to simulate external payment processing without making real charges."
    }
  ],
  commonPitfalls: [
    {
      name: "Insufficient Test Isolation",
      description: "Tests that interfere with each other due to shared state or resources, causing unpredictable results and flaky tests.",
      solution: "Ensure each test has its own isolated environment and data. Use unique identifiers, separate databases, or transactions to prevent tests from affecting each other.",
      preventativeMeasures: [
        "Generate unique test data with timestamps or UUIDs",
        "Run tests in separate database schemas or with transaction rollbacks",
        "Clean up all created resources after each test"
      ]
    },
    {
      name: "Inadequate Asynchronous Handling",
      description: "Tests that fail or become flaky because they don't properly handle asynchronous operations, leading to race conditions or timing issues.",
      solution: "Implement proper waiting mechanisms, polling, or event-based systems to ensure tests wait appropriately for asynchronous operations to complete.",
      preventativeMeasures: [
        "Create helper functions to wait for specific conditions with timeouts",
        "Use polling to check for expected state changes",
        "Implement hooks into asynchronous systems to signal completion"
      ]
    },
    {
      name: "Unrealistic Mocks",
      description: "Using mocks that don't accurately represent the behavior of real systems, leading to tests that pass but miss real integration issues.",
      solution: "Design mocks to faithfully represent external system behavior, including error conditions, timing characteristics, and edge cases.",
      preventativeMeasures: [
        "Base mocks on actual API contracts and specifications",
        "Include realistic error scenarios and edge cases in mocks",
        "Periodically validate mocks against real systems"
      ]
    },
    {
      name: "Brittle Test Assertions",
      description: "Tests with overly specific assertions that break when implementation details change, even if the overall behavior remains correct.",
      solution: "Focus assertions on business outcomes and stable interfaces rather than implementation details or exact values that might change.",
      preventativeMeasures: [
        "Use matcher functions that allow for flexibility (contains, approximately, etc.)",
        "Assert on important business rules and outcomes rather than exact implementation",
        "Avoid asserting on timestamps, specific IDs, or other volatile data"
      ]
    },
    {
      name: "Slow Execution Time",
      description: "E2E tests that take too long to run, leading to slow feedback cycles and discouraging developers from running tests frequently.",
      solution: "Optimize tests for speed while maintaining effectiveness through parallel execution, resource reuse, and focused scope.",
      preventativeMeasures: [
        "Run tests in parallel when possible",
        "Reuse expensive setup steps across multiple tests",
        "Focus on critical paths rather than testing every possible variation"
      ]
    },
    {
      name: "Poor Error Diagnosis",
      description: "Tests that fail without providing clear information about what went wrong, making debugging difficult and time-consuming.",
      solution: "Enhance test infrastructure to provide detailed error information, including logs, state dumps, and context about failed assertions.",
      preventativeMeasures: [
        "Add comprehensive logging during test execution",
        "Create custom error messages that include context",
        "Implement utilities to dump system state on test failure"
      ]
    }
  ],
  improvementGuidelines: {
    description: "Strategies for improving the effectiveness and efficiency of backend E2E tests over time.",
    metrics: [
      {
        name: "Test Coverage of Critical Workflows",
        description: "The extent to which E2E tests cover the most important business workflows and user journeys in the system.",
        assessmentMethod: "Map critical business processes and verify test coverage for each. Identify gaps in coverage of important flows."
      },
      {
        name: "Test Execution Time",
        description: "The time it takes to run the E2E test suite. Faster tests provide quicker feedback and enable more frequent testing.",
        assessmentMethod: "Measure and track test execution time. Identify and optimize the slowest tests. Consider setting time budgets for test suites."
      },
      {
        name: "Test Reliability",
        description: "How consistently the tests produce the same results when the system behavior hasn't changed.",
        assessmentMethod: "Track flaky tests (those that sometimes pass and sometimes fail without code changes). Run tests multiple times and analyze inconsistencies."
      },
      {
        name: "Defect Detection Effectiveness",
        description: "How well the E2E tests detect real issues before they reach production.",
        assessmentMethod: "Track production issues and analyze which could have been caught by better E2E tests. Update tests to cover these scenarios."
      }
    ]
  },
  resources: [
    {
      type: "documentation",
      name: "Vitest Documentation",
      description: "Official documentation for Vitest, including features for writing and running E2E tests.",
      link: "https://vitest.dev/guide/"
    },
    {
      type: "tutorial",
      name: "End-to-End Testing Best Practices",
      description: "A comprehensive guide to best practices for E2E testing of backend systems.",
      link: "https://martinfowler.com/articles/practical-test-pyramid.html"
    },
    {
      type: "reference",
      name: "TestContainers for Integration Testing",
      description: "Documentation for TestContainers, a library for creating containerized test environments.",
      link: "https://node.testcontainers.org/"
    },
    {
      type: "tool",
      name: "Nock for HTTP Mocking",
      description: "A tool for mocking HTTP servers and external API calls in Node.js tests.",
      link: "https://github.com/nock/nock"
    }
  ],
  conclusion: "Backend E2E testing with Vitest provides a powerful approach to verifying complete workflows and business processes across multiple components and services. By focusing on testing realistic user journeys from end to end, these tests can catch integration issues and business logic problems that might be missed by more isolated unit or integration tests. While E2E tests require more setup and can be more complex to maintain, they provide unique value in ensuring that the system works correctly as a whole. With proper attention to test design, environment setup, and asynchronous handling, backend E2E tests can be a reliable and effective part of a comprehensive testing strategy."
}; 