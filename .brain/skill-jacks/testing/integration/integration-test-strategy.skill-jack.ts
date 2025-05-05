/**
 * Skill-Jack: Integration Test Strategy
 * 
 * A comprehensive guide to effective integration testing methodologies and practices.
 * 
 * @module brain-garden/skill-jack
 * @category testing/patterns
 */

/**
 * Skill-Jack on Integration Test Strategy
 * 
 * This constant provides comprehensive guidance on understanding and applying
 * integration testing strategies in modern software development.
 */
export const topicGuide = {
  topic: "Integration Test Strategy",
  description: "A comprehensive approach to designing, implementing, and maintaining effective integration tests that verify component interactions and data flow across multiple modules or services.",
  corePrinciples: [
    {
      name: "Test Real Interactions",
      description: "Integration tests verify that components work together correctly through their actual interfaces, not via mocked proxies. Focus on testing the real interactions and data exchanges between components.",
      examples: [
        "Test that a service can correctly read from and write to an actual database (potentially in-memory or containerized)",
        "Verify that an API handler processes requests and produces responses that match schema contracts",
        "Confirm that multiple modules work together to complete multi-step business processes"
      ]
    },
    {
      name: "Minimize Mocking",
      description: "Unlike unit tests, integration tests should use real implementations for most components. Only mock external systems that are impractical to include (third-party APIs, payment gateways, etc.).",
      examples: [
        "Use in-memory or containerized databases instead of mocking database interactions",
        "Include actual file system operations but in a controlled test directory",
        "Test real message queues but in isolated test channels"
      ]
    },
    {
      name: "Controlled Test Environment",
      description: "Integration tests need a consistent, isolated environment that can be set up and torn down for each test. Use technologies like containers, in-memory implementations, or sandbox environments to achieve this.",
      examples: [
        "Docker containers to provide isolated database instances",
        "Memory-based filesystem implementations for file operations",
        "Environment variables to configure services for test mode"
      ]
    },
    {
      name: "Data Setup and Cleanup",
      description: "Tests must establish their required data state before running and clean up afterward to prevent test interference and maintain repeatability.",
      examples: [
        "Seed database with test data in beforeEach and clear in afterEach",
        "Create and delete test files for each test case",
        "Reset message queues between tests"
      ]
    },
    {
      name: "Test Meaningful Flows",
      description: "Focus on testing end-to-end flows that represent real use cases rather than exhaustive combinations of component interactions. Test the paths that matter to your application.",
      examples: [
        "Test user registration flow from API to database and email notification",
        "Verify order processing including inventory updates and payment processing",
        "Test data import/export flows across system boundaries"
      ]
    },
    {
      name: "Assertions at Boundaries",
      description: "Make assertions about the observable outcomes at system boundaries, not internal states. This keeps tests focused on behavior and less brittle to implementation changes.",
      examples: [
        "Verify API responses rather than internal service state",
        "Check database state after operations instead of in-memory representations",
        "Confirm outgoing messages or events reflect expected content"
      ]
    }
  ],
  applicationProcess: {
    description: "A structured approach to designing and implementing effective integration tests.",
    steps: [
      {
        name: "Identify Integration Boundaries",
        description: "Determine which components, services, or modules need to be tested together and which system boundaries define the scope of integration tests.",
        agentActions: [
          {
            action: "Map component dependencies",
            explanation: "Create a dependency graph showing how components interact with each other."
          },
          {
            action: "Identify critical integration points",
            explanation: "Pinpoint where data or control flows between distinct components or subsystems."
          },
          {
            action: "Distinguish between internal and external dependencies",
            explanation: "Determine which dependencies should be included in tests and which should be mocked."
          }
        ]
      },
      {
        name: "Design Test Environment",
        description: "Create a controlled, isolated environment where integration tests can run consistently and without interfering with each other.",
        agentActions: [
          {
            action: "Set up containerized dependencies",
            explanation: "Configure Docker containers for databases, message queues, or other infrastructure components."
          },
          {
            action: "Define test-specific configuration",
            explanation: "Create configuration that points components to test instances of dependencies."
          },
          {
            action: "Implement environment initialization and cleanup",
            explanation: "Develop scripts or utilities to set up and tear down the test environment."
          }
        ]
      },
      {
        name: "Identify Key Integration Scenarios",
        description: "Define the most important integration scenarios that represent real-world usage and critical business flows.",
        agentActions: [
          {
            action: "List core business processes",
            explanation: "Identify the main workflows that span multiple components."
          },
          {
            action: "Map data flow through the system",
            explanation: "Track how data moves between components and what transformations occur."
          },
          {
            action: "Prioritize scenarios by risk and importance",
            explanation: "Focus on testing the flows that have the highest business impact or technical risk."
          }
        ]
      },
      {
        name: "Implement Test Data Management",
        description: "Create strategies for setting up, managing, and cleaning up test data to ensure test isolation and repeatability.",
        agentActions: [
          {
            action: "Design test data factories",
            explanation: "Create utilities that generate consistent test data for different scenarios."
          },
          {
            action: "Implement database seeding and cleaning",
            explanation: "Develop mechanisms to prepare databases with known states and clean them after tests."
          },
          {
            action: "Set up data isolation between tests",
            explanation: "Ensure each test has its own isolated data context to prevent interference."
          }
        ]
      },
      {
        name: "Write Integration Tests",
        description: "Implement tests that verify the correct interaction between components across integration boundaries.",
        agentActions: [
          {
            action: "Set up the test context",
            explanation: "Initialize components and dependencies in their starting state."
          },
          {
            action: "Exercise the integration flow",
            explanation: "Trigger the operations that cause components to interact with each other."
          },
          {
            action: "Verify outcomes at boundaries",
            explanation: "Check that the expected results are observable at system boundaries."
          }
        ]
      },
      {
        name: "Ensure Test Robustness",
        description: "Enhance tests to handle asynchronous operations, timing issues, and potential flakiness.",
        agentActions: [
          {
            action: "Add proper waiting and synchronization",
            explanation: "Implement mechanisms to wait for async operations to complete before making assertions."
          },
          {
            action: "Handle retries for flaky operations",
            explanation: "Add retry logic for operations that might occasionally fail due to timing or external factors."
          },
          {
            action: "Implement timeouts to prevent test hangs",
            explanation: "Ensure tests fail relatively quickly if something goes wrong rather than hanging indefinitely."
          }
        ]
      }
    ]
  },
  examples: {
    description: "Practical examples of integration testing in different contexts.",
    useCases: [
      {
        scenario: "Testing API and Database Integration",
        implementation: "Integration tests that verify an API handler correctly processes requests, persists data to a database, and returns appropriate responses.",
        outcome: "Tests confirm that API endpoints correctly create, read, update, and delete records in the database, and that error handling works properly across the integration boundary."
      },
      {
        scenario: "Testing Service-to-Service Communication",
        implementation: "Tests that verify multiple services can communicate via message queues, RESTful APIs, or other mechanisms.",
        outcome: "Tests confirm that services can send messages or requests to each other, process them correctly, and handle various success and error scenarios appropriately."
      },
      {
        scenario: "Testing Data Processing Pipeline",
        implementation: "Integration tests for a multi-stage data processing pipeline that transforms, validates, and loads data across different components.",
        outcome: "Tests verify that data flows correctly through all stages of the pipeline, transformations are applied correctly, and error handling works across component boundaries."
      },
      {
        scenario: "Testing Authentication and Authorization Flow",
        implementation: "Tests that verify the integration between authentication services, user databases, and protected resources.",
        outcome: "Tests confirm that users can authenticate, tokens or sessions are properly created and validated, and access control works correctly for protected resources."
      }
    ]
  },
  codeExamples: [
    {
      language: "typescript",
      description: "Integration test for user service and database",
      code: `
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { UserService } from './user-service';
import { Database } from './database';
import { startTestDatabase, stopTestDatabase } from '../test-utils/db-container';

describe('UserService Integration', () => {
  let database: Database;
  let userService: UserService;
  let dbContainer;

  // Start a test database container before all tests
  beforeAll(async () => {
    dbContainer = await startTestDatabase();
    
    // Get connection details from the container
    const dbConfig = {
      host: dbContainer.getHost(),
      port: dbContainer.getMappedPort(5432),
      user: 'testuser',
      password: 'testpass',
      database: 'testdb'
    };
    
    // Connect to the database
    database = new Database(dbConfig);
    await database.connect();
    
    // Create the service with the real database
    userService = new UserService(database);
  });

  // Clean up database after tests
  afterAll(async () => {
    await database.disconnect();
    await stopTestDatabase(dbContainer);
  });

  // Reset data between tests
  beforeEach(async () => {
    await database.query('DELETE FROM users');
  });

  it('should create a user and store it in the database', async () => {
    // Arrange
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      fullName: 'Test User'
    };

    // Act
    const result = await userService.createUser(userData);

    // Assert
    expect(result.success).toBe(true);
    expect(result.user.id).toBeDefined();
    
    // Verify data was correctly stored in the database
    const dbUser = await database.query(
      'SELECT * FROM users WHERE username = $1',
      [userData.username]
    );
    
    expect(dbUser.rows[0]).toMatchObject({
      username: userData.username,
      email: userData.email,
      full_name: userData.fullName
    });
  });

  it('should retrieve a user by id from the database', async () => {
    // Arrange - create a user in the database
    const inserted = await database.query(
      'INSERT INTO users(username, email, full_name) VALUES($1, $2, $3) RETURNING id',
      ['finduser', 'find@example.com', 'Find User']
    );
    const userId = inserted.rows[0].id;

    // Act
    const user = await userService.getUserById(userId);

    // Assert
    expect(user).toMatchObject({
      id: userId,
      username: 'finduser',
      email: 'find@example.com',
      fullName: 'Find User'
    });
  });

  it('should update user information in the database', async () => {
    // Arrange - create a user to update
    const inserted = await database.query(
      'INSERT INTO users(username, email, full_name) VALUES($1, $2, $3) RETURNING id',
      ['updateuser', 'update@example.com', 'Original Name']
    );
    const userId = inserted.rows[0].id;

    // Act
    const updateResult = await userService.updateUser(userId, {
      fullName: 'Updated Name'
    });

    // Assert
    expect(updateResult.success).toBe(true);
    
    // Verify the update in the database
    const dbUser = await database.query(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    );
    
    expect(dbUser.rows[0].full_name).toBe('Updated Name');
    expect(dbUser.rows[0].email).toBe('update@example.com'); // unchanged
  });

  it('should handle duplicate username error correctly', async () => {
    // Arrange - create a user with a specific username
    await database.query(
      'INSERT INTO users(username, email, full_name) VALUES($1, $2, $3)',
      ['existinguser', 'existing@example.com', 'Existing User']
    );

    // Act - try to create another user with the same username
    const result = await userService.createUser({
      username: 'existinguser', // duplicate
      email: 'another@example.com',
      fullName: 'Another User'
    });

    // Assert
    expect(result.success).toBe(false);
    expect(result.error).toContain('username already exists');
    
    // Verify no new user was added
    const users = await database.query(
      'SELECT COUNT(*) FROM users WHERE username = $1',
      ['existinguser']
    );
    
    expect(Number(users.rows[0].count)).toBe(1);
  });
});
`,
      explanation: "This example demonstrates an integration test for a user service that interacts with a real database. It uses container technology to start a real database for testing, sets up the necessary schema, and verifies that the service correctly interacts with the database for various operations such as creating, retrieving, and updating users. The test verifies actual database state rather than mocking the database."
    },
    {
      language: "typescript",
      description: "Integration test for API and message queue",
      code: `
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { createServer } from 'http';
import { createTestClient } from '../test-utils/test-client';
import { setupMessageQueue, clearQueue, getMessages } from '../test-utils/message-queue';
import { app } from './app';

describe('Order API and Message Queue Integration', () => {
  let server;
  let client;
  
  beforeAll(async () => {
    // Set up the message queue for testing
    await setupMessageQueue({
      queueName: 'test-orders',
      exchangeName: 'test-exchange'
    });
    
    // Start the server
    server = createServer(app);
    await new Promise(resolve => server.listen(0, resolve));
    const port = server.address().port;
    
    // Create a test client
    client = createTestClient(\`http://localhost:\${port}\`);
  });
  
  afterAll(async () => {
    // Shut down the server
    await new Promise(resolve => server.close(resolve));
  });
  
  beforeEach(async () => {
    // Clear the message queue before each test
    await clearQueue('test-orders');
  });
  
  it('should create an order and send a message to the queue', async () => {
    // Arrange
    const orderData = {
      customerId: '12345',
      items: [
        { productId: 'product-1', quantity: 2, price: 10.99 },
        { productId: 'product-2', quantity: 1, price: 24.99 }
      ],
      shippingAddress: {
        street: '123 Test St',
        city: 'Testville',
        zipCode: '12345'
      }
    };
    
    // Act
    const response = await client.post('/api/orders', orderData);
    
    // Assert API response
    expect(response.status).toBe(201);
    expect(response.data.orderId).toBeDefined();
    expect(response.data.status).toBe('pending');
    
    // Give the system a moment to process the message
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Assert message was sent to the queue
    const messages = await getMessages('test-orders');
    expect(messages.length).toBe(1);
    
    const orderMessage = JSON.parse(messages[0].content.toString());
    expect(orderMessage.orderId).toBe(response.data.orderId);
    expect(orderMessage.customerId).toBe(orderData.customerId);
    expect(orderMessage.items.length).toBe(2);
    expect(orderMessage.status).toBe('pending');
  });
  
  it('should validate order data and return appropriate errors', async () => {
    // Arrange - invalid order data (missing required fields)
    const invalidOrderData = {
      customerId: '12345',
      // Missing items array
      shippingAddress: {
        street: '123 Test St',
        // Missing city
        zipCode: '12345'
      }
    };
    
    // Act
    const response = await client.post('/api/orders', invalidOrderData);
    
    // Assert API error response
    expect(response.status).toBe(400);
    expect(response.data.success).toBe(false);
    expect(response.data.errors).toContainEqual(
      expect.objectContaining({
        field: 'items',
        message: expect.stringContaining('required')
      })
    );
    expect(response.data.errors).toContainEqual(
      expect.objectContaining({
        field: 'shippingAddress.city',
        message: expect.stringContaining('required')
      })
    );
    
    // Assert no message was sent to the queue
    const messages = await getMessages('test-orders');
    expect(messages.length).toBe(0);
  });
  
  it('should update an order and send an update message', async () => {
    // Arrange - create an order first
    const createResponse = await client.post('/api/orders', {
      customerId: '12345',
      items: [{ productId: 'product-1', quantity: 1, price: 10.99 }],
      shippingAddress: {
        street: '123 Test St',
        city: 'Testville',
        zipCode: '12345'
      }
    });
    
    const orderId = createResponse.data.orderId;
    
    // Clear the queue after order creation
    await clearQueue('test-orders');
    
    // Act - update the order
    const updateResponse = await client.patch(\`/api/orders/\${orderId}\`, {
      status: 'shipped',
      trackingNumber: 'TRK123456789'
    });
    
    // Assert update response
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.data.status).toBe('shipped');
    expect(updateResponse.data.trackingNumber).toBe('TRK123456789');
    
    // Give the system a moment to process the message
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Assert update message was sent to the queue
    const messages = await getMessages('test-orders');
    expect(messages.length).toBe(1);
    
    const updateMessage = JSON.parse(messages[0].content.toString());
    expect(updateMessage.orderId).toBe(orderId);
    expect(updateMessage.status).toBe('shipped');
    expect(updateMessage.trackingNumber).toBe('TRK123456789');
    expect(updateMessage.type).toBe('order_updated');
  });
});
`,
      explanation: "This example shows an integration test for an API that processes orders and sends messages to a message queue. It verifies that the API correctly validates input, processes valid orders, and sends appropriate messages to the queue. It uses real HTTP requests and a test implementation of a message queue to verify the integration."
    }
  ],
  commonPitfalls: [
    {
      name: "Test Isolation Failures",
      description: "Tests that interfere with each other due to shared state or resources, causing unpredictable results and flaky tests.",
      solution: "Ensure each test has its own isolated environment and data. Use fresh containers, database schemas, or namespaced resources for each test run.",
      preventativeMeasures: [
        "Use unique identifiers for test resources (database names, queue names, etc.)",
        "Implement thorough cleanup in afterEach/afterAll hooks",
        "Run tests in isolated containers or environments"
      ]
    },
    {
      name: "Brittle Integration Points",
      description: "Tests that break frequently due to changes in integration contracts or interfaces, causing high maintenance overhead.",
      solution: "Focus assertions on stable contracts rather than implementation details. Consider using consumer-driven contract testing to maintain compatibility.",
      preventativeMeasures: [
        "Define and test against formal API contracts or schemas",
        "Use tools like Pact or OpenAPI for contract validation",
        "Focus assertions on behavior rather than specific payloads"
      ]
    },
    {
      name: "Slow Test Execution",
      description: "Integration tests that take too long to run, discouraging developers from running them frequently and reducing their value as feedback tools.",
      solution: "Optimize test execution through parallelization, efficient resource sharing, and focused test scope.",
      preventativeMeasures: [
        "Reuse expensive resources like database containers across multiple tests",
        "Run tests in parallel when possible",
        "Use in-memory or containerized alternatives to real services"
      ]
    },
    {
      name: "Ineffective Error Diagnosis",
      description: "Integration test failures that are difficult to diagnose due to unclear error messages or complex interactions between components.",
      solution: "Implement detailed logging, clear error messages, and tools to inspect the state of integration points during test failures.",
      preventativeMeasures: [
        "Add comprehensive logging in test environments",
        "Implement specific assertions with clear error messages",
        "Create utilities to dump state of relevant components on failure"
      ]
    },
    {
      name: "Over-testing at Integration Level",
      description: "Attempting to test every possible scenario at the integration level, which leads to slow, complex, and redundant test suites.",
      solution: "Use a test pyramid approach, where most edge cases are covered by unit tests and integration tests focus on key integration scenarios.",
      preventativeMeasures: [
        "Define clear boundaries between unit and integration tests",
        "Identify critical integration paths to test",
        "Avoid duplicating unit test scenarios in integration tests"
      ]
    },
    {
      name: "Unstable External Dependencies",
      description: "Integration tests that fail due to unavailable or misbehaving external services, causing false negatives and reduced confidence.",
      solution: "Replace unstable external dependencies with reliable test doubles or controlled versions.",
      preventativeMeasures: [
        "Use service virtualization for external APIs",
        "Implement retry mechanisms with timeouts for flaky services",
        "Run critical external services locally via containers"
      ]
    }
  ],
  improvementGuidelines: {
    description: "Strategies for improving integration test quality and efficiency over time.",
    metrics: [
      {
        name: "Test Execution Time",
        description: "The time it takes to run the integration test suite. Faster tests provide quicker feedback and encourage more frequent testing.",
        assessmentMethod: "Measure and track test execution time. Identify and optimize the slowest tests. Consider setting time budgets for test suites."
      },
      {
        name: "Test Reliability",
        description: "The consistency of test results across multiple runs. Reliable tests yield the same results when nothing relevant has changed.",
        assessmentMethod: "Track flaky tests (those that sometimes pass and sometimes fail without code changes). Run tests multiple times and analyze inconsistencies."
      },
      {
        name: "Integration Coverage",
        description: "The extent to which critical integration points and scenarios are covered by tests. This is more about quality and importance than quantity.",
        assessmentMethod: "Map critical business flows and integration points. Verify test coverage for each. Identify gaps in testing of important integrations."
      },
      {
        name: "Defect Detection Effectiveness",
        description: "How well integration tests detect real integration problems before they reach production.",
        assessmentMethod: "Track production issues related to component integration. Analyze which could have been caught by better integration tests."
      }
    ]
  },
  resources: [
    {
      type: "documentation",
      name: "Vitest Integration Testing",
      description: "Official Vitest documentation on integration testing methodologies and best practices.",
      link: "https://vitest.dev/guide/"
    },
    {
      type: "tutorial",
      name: "TestContainers for JavaScript",
      description: "A guide to using TestContainers to create isolated, containerized environments for integration testing.",
      link: "https://node.testcontainers.org/"
    },
    {
      type: "reference",
      name: "Effective Integration Testing",
      description: "A comprehensive guide to implementing effective integration testing strategies.",
      link: "https://martinfowler.com/bliki/IntegrationTest.html"
    },
    {
      type: "tool",
      name: "Pact for Contract Testing",
      description: "A contract testing tool that enables consumer-driven contract testing for service integrations.",
      link: "https://pact.io/"
    }
  ],
  conclusion: "Effective integration testing is essential for verifying that components work together correctly in a system. By focusing on real interactions between components, minimizing mocks, and establishing controlled test environments, integration tests can provide confidence that the system functions as a whole. Remember to prioritize testing key integration points and workflows rather than trying to test every possible scenario at the integration level. Balance the need for thorough testing with practical concerns like execution speed and maintainability. With a strategic approach to integration testing, you can catch integration issues early, reduce defects, and facilitate smoother collaboration between teams working on different components of the system."
}; 