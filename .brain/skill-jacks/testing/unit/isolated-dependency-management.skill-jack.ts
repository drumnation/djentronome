/**
 * Skill-Jack: Isolated Dependency Management
 * 
 * A comprehensive guide to managing external dependencies in unit tests to ensure proper isolation.
 * 
 * @module brain-garden/skill-jack
 * @category testing/patterns
 */

/**
 * Skill-Jack on Isolated Dependency Management
 * 
 * This constant provides comprehensive guidance on understanding and applying
 * techniques for isolating dependencies in unit tests.
 */
export const topicGuide = {
  topic: "Isolated Dependency Management in Unit Tests",
  description: "Strategies and techniques for effectively managing and isolating external dependencies in unit tests to create reliable, deterministic test suites that focus on testing units in isolation.",
  corePrinciples: [
    {
      name: "Dependency Isolation",
      description: "Unit tests should focus on testing a single unit of code in isolation from its dependencies. External dependencies should be replaced with controlled test doubles to isolate the component under test.",
      examples: [
        "Replace a database connection with an in-memory implementation",
        "Substitute API clients with mocked responses",
        "Replace random number generators with deterministic functions"
      ]
    },
    {
      name: "Clear Dependency Boundaries",
      description: "Design code with clear dependency boundaries and interfaces that can be easily substituted in tests. This facilitates both testing and future extension or modification.",
      examples: [
        "Use dependency injection to provide dependencies to components",
        "Define interfaces for services rather than using concrete implementations directly",
        "Use factory functions that can be overridden in tests"
      ]
    },
    {
      name: "Appropriate Test Double Selection",
      description: "Choose the right type of test double (mock, stub, spy, fake) based on the testing needs and the nature of the dependency being replaced.",
      examples: [
        "Use stubs for simple return value replacement",
        "Use mocks to verify interaction with dependencies",
        "Use fakes for complex dependencies like databases or file systems"
      ]
    },
    {
      name: "Minimal Mocking",
      description: "Only mock what is necessary to isolate the unit under test. Excessive mocking leads to brittle tests that are tightly coupled to implementation details.",
      examples: [
        "Mock external API calls but use real utility functions",
        "Mock time-dependent functions but use real business logic",
        "Only mock the specific methods that would cause side effects"
      ]
    },
    {
      name: "Explicit Dependency Declaration",
      description: "Dependencies should be explicitly declared and passed to the code under test, rather than being implicitly created or accessed through global state.",
      examples: [
        "Accept dependencies as constructor parameters rather than instantiating them internally",
        "Use dependency injection frameworks or containers in complex applications",
        "Export factory functions that accept dependencies as parameters"
      ]
    },
    {
      name: "Control Over External State",
      description: "Tests should have complete control over any external state that affects the behavior of the code under test, ensuring test determinism and repeatability.",
      examples: [
        "Reset database state before each test",
        "Mock system clocks to return specific times",
        "Use environment variable mocking for configuration-dependent code"
      ]
    }
  ],
  applicationProcess: {
    description: "A systematic approach to implementing effective dependency isolation in unit tests.",
    steps: [
      {
        name: "Identify Dependencies",
        description: "Analyze the code under test to identify all external dependencies that need to be managed in the test environment.",
        agentActions: [
          {
            action: "Map out direct dependencies",
            explanation: "Identify all dependencies that are directly used by the code under test, such as services, APIs, databases, etc."
          },
          {
            action: "Identify indirect dependencies",
            explanation: "Determine dependencies that are used by the direct dependencies which might affect test outcomes."
          },
          {
            action: "Categorize dependencies by type",
            explanation: "Group dependencies by their nature (e.g., data stores, external services, time-dependent functions) to apply appropriate isolation strategies."
          }
        ]
      },
      {
        name: "Design Test Doubles",
        description: "Create appropriate test doubles (mocks, stubs, spies, fakes) for each dependency.",
        agentActions: [
          {
            action: "Determine the appropriate test double type",
            explanation: "Choose between mocks, stubs, spies, or fakes based on the nature of the dependency and test requirements."
          },
          {
            action: "Define the interface for the test double",
            explanation: "Ensure the test double matches the interface of the real dependency to prevent type errors and ensure compatibility."
          },
          {
            action: "Implement behavior for test doubles",
            explanation: "Configure the test double to provide appropriate responses or behaviors for the test scenarios."
          }
        ]
      },
      {
        name: "Set Up Dependency Injection",
        description: "Implement a mechanism to inject test doubles in place of real dependencies during tests.",
        agentActions: [
          {
            action: "Refactor code to accept dependencies as parameters",
            explanation: "Modify functions or classes to accept dependencies explicitly rather than creating them internally."
          },
          {
            action: "Create factory functions for complex object creation",
            explanation: "Implement factory functions that can be overridden in tests to control object creation."
          },
          {
            action: "Use dependency injection containers if appropriate",
            explanation: "For complex applications, consider using DI containers that can be configured differently in test environments."
          }
        ]
      },
      {
        name: "Implement Mocking in Tests",
        description: "Use the testing framework's mocking capabilities to create and configure the required test doubles.",
        agentActions: [
          {
            action: "Set up mocking for imports or modules",
            explanation: "Use Vitest's vi.mock() to replace imported modules with test implementations."
          },
          {
            action: "Configure mock behavior for specific tests",
            explanation: "Set up return values, resolved promises, or mock implementations for each test case."
          },
          {
            action: "Reset mocks between tests",
            explanation: "Clear mock state and configurations between tests to prevent test interference."
          }
        ]
      },
      {
        name: "Verify Mock Interactions",
        description: "When necessary, verify that the code under test interacts correctly with its dependencies.",
        agentActions: [
          {
            action: "Check if functions were called",
            explanation: "Verify that specific dependencies were actually used by the code under test."
          },
          {
            action: "Verify call arguments",
            explanation: "Check that dependencies were called with the expected arguments."
          },
          {
            action: "Confirm call sequence or count",
            explanation: "Verify the order or number of times dependencies were called if relevant to the test."
          }
        ]
      },
      {
        name: "Handle Complex Dependencies",
        description: "Implement strategies for particularly challenging dependencies like time functions, databases, or third-party services.",
        agentActions: [
          {
            action: "Create specialized fakes for complex systems",
            explanation: "Implement in-memory versions of databases or other complex systems when needed."
          },
          {
            action: "Use clock mocking for time-dependent code",
            explanation: "Replace timing functions with controlled versions that can be advanced in tests."
          },
          {
            action: "Consider integration tests for complex integrations",
            explanation: "For some dependencies, it may be more appropriate to test with them in an integration test rather than mocking them extensively."
          }
        ]
      }
    ]
  },
  examples: {
    description: "Practical examples of dependency isolation techniques in different testing scenarios.",
    useCases: [
      {
        scenario: "Testing a data fetching service",
        implementation: "A service that fetches user data from an API and transforms it for use in the application.",
        outcome: "Tests mock the HTTP client to return predefined responses, allowing verification that the service correctly transforms data and handles errors without making actual API calls."
      },
      {
        scenario: "Testing a component with database interactions",
        implementation: "A repository class that performs CRUD operations on a database.",
        outcome: "Tests use an in-memory database implementation to verify that the repository correctly builds queries and handles database responses without requiring a real database connection."
      },
      {
        scenario: "Testing time-dependent logic",
        implementation: "A function that performs different operations based on the current time or date.",
        outcome: "Tests mock the Date object or time functions to return specific times, allowing verification of behavior under different time conditions without waiting or relying on the actual system time."
      },
      {
        scenario: "Testing event-driven components",
        implementation: "A service that reacts to and processes events from various sources.",
        outcome: "Tests manually trigger events with controlled payloads to verify that the service reacts correctly to different event types and handles event data appropriately."
      }
    ]
  },
  codeExamples: [
    {
      language: "typescript",
      description: "Mocking API calls in a user service test",
      code: `
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserService } from './user-service';
import { ApiClient } from './api-client';

// Mock the entire ApiClient module
vi.mock('./api-client');

describe('UserService', () => {
  let userService: UserService;
  let mockApiClient: jest.Mocked<ApiClient>;
  
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    
    // Create a typed mock of the ApiClient
    mockApiClient = new ApiClient() as jest.Mocked<ApiClient>;
    
    // Create the service with the mocked dependency
    userService = new UserService(mockApiClient);
  });
  
  it('should fetch and transform user data correctly', async () => {
    // Arrange
    const mockUserResponse = {
      id: '123',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      created_at: '2023-01-15T12:00:00Z'
    };
    
    // Configure the mock to return our test data
    mockApiClient.fetchUser.mockResolvedValue(mockUserResponse);
    
    // Act
    const result = await userService.getUserDetails('123');
    
    // Assert
    expect(mockApiClient.fetchUser).toHaveBeenCalledWith('123');
    expect(result).toEqual({
      id: '123',
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      createdAt: new Date('2023-01-15T12:00:00Z')
    });
  });
  
  it('should handle API errors gracefully', async () => {
    // Arrange
    mockApiClient.fetchUser.mockRejectedValue(new Error('Network error'));
    
    // Act & Assert
    await expect(userService.getUserDetails('123')).rejects.toThrow('Failed to fetch user: Network error');
    expect(mockApiClient.fetchUser).toHaveBeenCalledWith('123');
  });
});
`,
      explanation: "This example demonstrates how to test a service that depends on an API client. The API client is mocked to return controlled responses or errors, allowing the tests to verify that the service correctly processes successful responses and handles errors without making actual API calls."
    },
    {
      language: "typescript",
      description: "Testing time-dependent code using vi.useFakeTimers()",
      code: `
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ScheduledTask } from './scheduled-task';

describe('ScheduledTask', () => {
  beforeEach(() => {
    // Set up fake timers before each test
    vi.useFakeTimers();
  });
  
  afterEach(() => {
    // Restore real timers after each test
    vi.useRealTimers();
  });
  
  it('should execute the task after the specified delay', () => {
    // Arrange
    const mockTask = vi.fn();
    const taskDelayMs = 1000;
    const scheduledTask = new ScheduledTask(mockTask, taskDelayMs);
    
    // Act
    scheduledTask.start();
    
    // Assert - task should not be called immediately
    expect(mockTask).not.toHaveBeenCalled();
    
    // Fast-forward time by the delay amount
    vi.advanceTimersByTime(taskDelayMs);
    
    // Assert - task should now have been called
    expect(mockTask).toHaveBeenCalledTimes(1);
  });
  
  it('should execute the task repeatedly when in recurring mode', () => {
    // Arrange
    const mockTask = vi.fn();
    const taskDelayMs = 500;
    const scheduledTask = new ScheduledTask(mockTask, taskDelayMs);
    
    // Act
    scheduledTask.startRecurring();
    
    // Fast-forward time by multiple intervals
    vi.advanceTimersByTime(taskDelayMs * 3.5);
    
    // Assert - task should have been called 3 times
    expect(mockTask).toHaveBeenCalledTimes(3);
  });
  
  it('should stop executing when stopped', () => {
    // Arrange
    const mockTask = vi.fn();
    const taskDelayMs = 1000;
    const scheduledTask = new ScheduledTask(mockTask, taskDelayMs);
    
    // Act
    scheduledTask.startRecurring();
    
    // Fast-forward time by one interval
    vi.advanceTimersByTime(taskDelayMs);
    
    // Stop the task
    scheduledTask.stop();
    
    // Fast-forward time by several more intervals
    vi.advanceTimersByTime(taskDelayMs * 3);
    
    // Assert - task should have been called only once
    expect(mockTask).toHaveBeenCalledTimes(1);
  });
});
`,
      explanation: "This example shows how to test time-dependent code by using Vitest's fake timers. The tests can control the passage of time, allowing them to verify behavior that depends on timers or intervals without having to wait for real time to pass. This makes the tests fast and deterministic."
    },
    {
      language: "typescript",
      description: "Using dependency injection for testability",
      code: `
// ProductService.ts
import { IProductRepository } from './interfaces/product-repository.interface';
import { ICacheService } from './interfaces/cache-service.interface';
import { ILogger } from './interfaces/logger.interface';
import { Product } from './models/product.model';

export class ProductService {
  constructor(
    private productRepository: IProductRepository,
    private cacheService: ICacheService,
    private logger: ILogger
  ) {}
  
  async getProduct(id: string): Promise<Product | null> {
    // Try to get from cache first
    const cachedProduct = await this.cacheService.get<Product>(\`product:\${id}\`);
    if (cachedProduct) {
      this.logger.info(\`Cache hit for product \${id}\`);
      return cachedProduct;
    }
    
    // Not in cache, fetch from repository
    this.logger.info(\`Cache miss for product \${id}, fetching from repository\`);
    const product = await this.productRepository.findById(id);
    
    if (product) {
      // Store in cache for future requests
      await this.cacheService.set(\`product:\${id}\`, product, 3600); // 1 hour
    }
    
    return product;
  }
}

// ProductService.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProductService } from './product-service';
import { Product } from './models/product.model';

describe('ProductService', () => {
  // Create mock implementations of the dependencies
  const mockRepository = {
    findById: vi.fn()
  };
  
  const mockCacheService = {
    get: vi.fn(),
    set: vi.fn()
  };
  
  const mockLogger = {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  };
  
  let productService: ProductService;
  
  beforeEach(() => {
    // Clear all mocks and create a fresh service instance
    vi.clearAllMocks();
    productService = new ProductService(mockRepository, mockCacheService, mockLogger);
  });
  
  it('should return product from cache when available', async () => {
    // Arrange
    const testProduct: Product = { id: '123', name: 'Test Product', price: 99.99 };
    mockCacheService.get.mockResolvedValue(testProduct);
    
    // Act
    const result = await productService.getProduct('123');
    
    // Assert
    expect(result).toEqual(testProduct);
    expect(mockCacheService.get).toHaveBeenCalledWith('product:123');
    expect(mockRepository.findById).not.toHaveBeenCalled();
    expect(mockLogger.info).toHaveBeenCalledWith('Cache hit for product 123');
  });
  
  it('should fetch from repository and update cache on cache miss', async () => {
    // Arrange
    const testProduct: Product = { id: '456', name: 'Another Product', price: 49.99 };
    mockCacheService.get.mockResolvedValue(null); // Cache miss
    mockRepository.findById.mockResolvedValue(testProduct);
    
    // Act
    const result = await productService.getProduct('456');
    
    // Assert
    expect(result).toEqual(testProduct);
    expect(mockCacheService.get).toHaveBeenCalledWith('product:456');
    expect(mockRepository.findById).toHaveBeenCalledWith('456');
    expect(mockCacheService.set).toHaveBeenCalledWith('product:456', testProduct, 3600);
    expect(mockLogger.info).toHaveBeenCalledWith('Cache miss for product 456, fetching from repository');
  });
  
  it('should return null when product is not found', async () => {
    // Arrange
    mockCacheService.get.mockResolvedValue(null); // Cache miss
    mockRepository.findById.mockResolvedValue(null); // Not in repository either
    
    // Act
    const result = await productService.getProduct('999');
    
    // Assert
    expect(result).toBeNull();
    expect(mockCacheService.get).toHaveBeenCalledWith('product:999');
    expect(mockRepository.findById).toHaveBeenCalledWith('999');
    expect(mockCacheService.set).not.toHaveBeenCalled(); // Shouldn't cache null results
  });
});
`,
      explanation: "This example demonstrates dependency injection for better testability. The ProductService takes its dependencies (repository, cache, logger) through the constructor, making it easy to provide mock implementations in tests. This allows the tests to control the behavior of these dependencies and verify how the service interacts with them."
    }
  ],
  commonPitfalls: [
    {
      name: "Excessive Mocking",
      description: "Creating too many mocks or mocking too deeply, which results in tests that are brittle, complex, and coupled to implementation details rather than behavior.",
      solution: "Only mock direct dependencies that are necessary to isolate the unit under test. Use real implementations for simple, pure functions and utilities.",
      preventativeMeasures: [
        "Review tests for excessive mock setup code",
        "Consider if the code design might be overly complex if it requires extensive mocking",
        "Use integration tests for complex interactions instead of attempting to mock everything"
      ]
    },
    {
      name: "Mocking Internal Implementation Details",
      description: "Mocking private methods or internal implementation details, resulting in tests that break when implementation changes even if the behavior remains the same.",
      solution: "Only mock at public boundaries and interfaces. Refactor code if internal details need to be tested directly.",
      preventativeMeasures: [
        "Focus on testing observable behavior through public interfaces",
        "Avoid using techniques to access or mock private methods",
        "Consider if code that requires testing of private methods should be refactored"
      ]
    },
    {
      name: "Inappropriate Test Double Types",
      description: "Using the wrong type of test double for the situation, such as using mocks when stubs would be simpler or more appropriate.",
      solution: "Select the appropriate test double based on testing needs: stubs for input/output testing, mocks for interaction verification, fakes for complex dependencies.",
      preventativeMeasures: [
        "Understand the differences between test double types and their purposes",
        "Review tests to ensure they use the simplest type of test double that meets their needs",
        "Use mocks primarily when interaction verification is essential"
      ]
    },
    {
      name: "Incomplete Mock Behavior",
      description: "Not fully configuring mocks to handle all possible interactions, leading to misleading test results or unexpected errors.",
      solution: "Ensure mocks have appropriate responses for all methods that will be called during the test, including error conditions.",
      preventativeMeasures: [
        "Define fallback behaviors for mocks when appropriate",
        "Test error handling paths as well as happy paths",
        "Use strict mocking modes when available to catch unexpected calls"
      ]
    },
    {
      name: "Mock Pollution Between Tests",
      description: "Allowing mock configurations or state to leak between tests, causing unpredictable behavior and false positives/negatives.",
      solution: "Reset or recreate mocks between tests to ensure clean state. Use beforeEach to set up fresh mocks for each test.",
      preventativeMeasures: [
        "Always call vi.clearAllMocks() or similar before each test",
        "Create fresh mock instances for each test",
        "Avoid sharing mock configurations across tests"
      ]
    },
    {
      name: "Over-specific Mocking Expectations",
      description: "Setting overly strict expectations about how mocks are used, such as exact call counts or argument matching when not essential to the behavior being tested.",
      solution: "Only verify interactions that are directly relevant to the behavior under test. Use less specific matchers when exact values aren't important.",
      preventativeMeasures: [
        "Use expect.any() or similar matchers for arguments where exact values aren't crucial",
        "Consider if call count verification is actually important for the test",
        "Focus verification on the key interactions that determine correct behavior"
      ]
    }
  ],
  improvementGuidelines: {
    description: "Strategies for improving dependency management and isolation in your test suite over time.",
    metrics: [
      {
        name: "Mock Setup Complexity",
        description: "The amount of code required to set up mocks and test doubles. Complex setup may indicate over-mocking or poorly designed dependencies.",
        assessmentMethod: "Review tests for lines of code devoted to mock setup versus actual testing. Consider refactoring tests or production code if setup exceeds 30-40% of test code."
      },
      {
        name: "Test Isolation Level",
        description: "The degree to which tests are isolated from external dependencies, environment, and each other. Higher isolation leads to more reliable and maintainable tests.",
        assessmentMethod: "Check if tests can run in parallel, in isolation, or on different machines. Verify that tests don't depend on global state or specific execution order."
      },
      {
        name: "Mock Fidelity",
        description: "How accurately test doubles represent the behavior of real dependencies. Higher fidelity leads to more realistic tests but might increase complexity.",
        assessmentMethod: "Periodically compare mock behavior to real implementations. Consider contract tests or integration tests to verify alignment."
      },
      {
        name: "Test Brittleness",
        description: "How often tests break due to implementation changes that don't affect external behavior. Brittle tests often result from over-mocking or focusing on implementation details.",
        assessmentMethod: "Track how many tests break during refactoring when external behavior hasn't changed. Higher numbers indicate brittle tests that may be over-coupled to implementation."
      }
    ]
  },
  resources: [
    {
      type: "documentation",
      name: "Vitest Mocking",
      description: "Official documentation for Vitest's mocking capabilities.",
      link: "https://vitest.dev/api/vi.html"
    },
    {
      type: "tutorial",
      name: "Test Doubles: Mocks, Stubs, and Fakes",
      description: "A comprehensive guide to different types of test doubles and when to use each.",
      link: "https://martinfowler.com/articles/mocksArentStubs.html"
    },
    {
      type: "reference",
      name: "Dependency Injection Patterns",
      description: "Patterns and best practices for implementing dependency injection to improve testability.",
      link: "https://refactoring.guru/design-patterns/dependency-injection"
    },
    {
      type: "tool",
      name: "MSW (Mock Service Worker)",
      description: "A tool for API mocking at the network level, useful for complex API-dependent applications.",
      link: "https://mswjs.io/"
    }
  ],
  conclusion: "Effective dependency management in unit tests is critical for creating reliable, maintainable test suites that provide confidence in code correctness. By clearly identifying dependencies, choosing appropriate test doubles, and implementing proper isolation techniques, developers can create tests that focus on behavior rather than implementation details. Remember that the goal of mocking is to simplify testing and isolate the code under test, not to create complex test setups that mirror the entire system. Strike a balance between isolation and realism, and continuously refine your approach based on how well your tests support refactoring and catch real issues. With thoughtful dependency management, unit tests become valuable tools for ensuring code quality rather than obstacles to change."
}; 