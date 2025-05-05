/**
 * Skill-Jack: Vitest Mocking APIs
 * 
 * A comprehensive guide to using Vitest's powerful mocking capabilities for effective unit testing.
 * 
 * @module brain-garden/skill-jack
 * @category testing/tools
 */

/**
 * Skill-Jack on Vitest Mocking APIs
 * 
 * This constant provides comprehensive guidance on understanding and applying
 * Vitest's mocking APIs for effective unit testing.
 */
export const topicGuide = {
  topic: "Vitest Mocking APIs",
  description: "A comprehensive guide to Vitest's mocking capabilities, including function mocks, module mocks, timers, and other techniques to isolate code for effective unit testing.",
  corePrinciples: [
    {
      name: "Mocking Functions with vi.fn()",
      description: "Create mock functions that can track calls, arguments, and return predefined values or implementations. This is the core building block for most mocking scenarios.",
      examples: [
        "Mock a callback function to verify it's called with specific arguments",
        "Create a mock implementation of a utility function",
        "Track how many times a function is called in a specific test"
      ]
    },
    {
      name: "Mocking Modules with vi.mock()",
      description: "Replace entire modules with mock implementations to isolate the code under test from external dependencies such as API clients, databases, or third-party libraries.",
      examples: [
        "Mock an API client module to return predefined responses",
        "Mock a database module to avoid actual database connections",
        "Mock utility modules to simplify testing complex interactions"
      ]
    },
    {
      name: "Time Control with vi.useFakeTimers()",
      description: "Control time-related functions (setTimeout, setInterval, Date) to test time-dependent code without waiting for actual time to pass, ensuring fast and deterministic tests.",
      examples: [
        "Test a debounce function without waiting for the actual delay",
        "Verify that a recurring task executes the expected number of times",
        "Test date-dependent logic by mocking the current time"
      ]
    },
    {
      name: "Spy on Objects with vi.spyOn()",
      description: "Monitor real functions or methods without completely replacing them, allowing verification of interactions while preserving original behavior when desired.",
      examples: [
        "Verify a method on a real object was called with certain arguments",
        "Track calls to console.log without replacing its functionality",
        "Monitor DOM API methods like createElement without mocking the entire browser API"
      ]
    },
    {
      name: "Mock Reset and Restoration",
      description: "Properly reset, clear, or restore mocks between tests to ensure test isolation and prevent mock state from leaking between test cases.",
      examples: [
        "Clear call history between tests with mockFn.mockClear()",
        "Reset mock implementation and call history with mockFn.mockReset()",
        "Restore original implementation with mockFn.mockRestore() after spying"
      ]
    },
    {
      name: "Partial Module Mocking",
      description: "Selectively mock specific exports from a module while keeping others with their original implementation, providing fine-grained control over dependency behavior.",
      examples: [
        "Mock a specific utility function while keeping others untouched",
        "Replace just the API request functions while preserving data transformation functions",
        "Mock harmful side effects while using real business logic"
      ]
    }
  ],
  applicationProcess: {
    description: "A structured approach to applying Vitest's mocking capabilities effectively in your tests.",
    steps: [
      {
        name: "Identify Mocking Needs",
        description: "Analyze the code under test to determine what dependencies need to be mocked and what type of mocking technique is most appropriate.",
        agentActions: [
          {
            action: "Identify external dependencies",
            explanation: "Determine which external modules, APIs, or services the code interacts with that should be replaced with mocks."
          },
          {
            action: "Identify non-deterministic elements",
            explanation: "Locate time-dependent functions, random generators, or other sources of non-determinism that need to be controlled."
          },
          {
            action: "Determine appropriate mocking technique",
            explanation: "Select whether to use vi.fn(), vi.mock(), vi.spyOn(), or other techniques based on the nature of the dependency."
          }
        ]
      },
      {
        name: "Set Up Test Environment",
        description: "Configure the test environment with the necessary mocks before running tests.",
        agentActions: [
          {
            action: "Place vi.mock() calls at the module level",
            explanation: "Add module mocks at the top of your test file, before imports, as they are hoisted automatically by Vitest."
          },
          {
            action: "Configure time mocking if needed",
            explanation: "Set up fake timers with vi.useFakeTimers() in a beforeEach block if testing time-dependent code."
          },
          {
            action: "Create mock factory functions",
            explanation: "For complex modules, create factory functions that return mock implementations with the right structure."
          }
        ]
      },
      {
        name: "Configure Mock Behavior",
        description: "Set up the expected behavior of mocks for specific test cases.",
        agentActions: [
          {
            action: "Define mock return values",
            explanation: "Use mockReturnValue(), mockResolvedValue(), or mockRejectedValue() to specify what the mock should return."
          },
          {
            action: "Implement mock function behavior",
            explanation: "Use mockImplementation() to create more complex mock behavior when a simple return value isn't sufficient."
          },
          {
            action: "Set up sequential responses",
            explanation: "Configure mocks to return different values on successive calls using mockReturnValueOnce() when testing sequences."
          }
        ]
      },
      {
        name: "Execute Tests with Mocks",
        description: "Run tests with the configured mocks, potentially manipulating fake timers or other controlled elements.",
        agentActions: [
          {
            action: "Execute code under test",
            explanation: "Run the function or method being tested, which will now interact with mocks instead of real dependencies."
          },
          {
            action: "Advance time if using fake timers",
            explanation: "Use vi.advanceTimersByTime() or vi.runAllTimers() to simulate the passage of time without waiting."
          },
          {
            action: "Trigger events or callbacks",
            explanation: "If testing event handlers or callbacks, manually trigger them with the appropriate arguments."
          }
        ]
      },
      {
        name: "Verify Mock Interactions",
        description: "Check that the code under test interacted with the mocks as expected.",
        agentActions: [
          {
            action: "Verify function calls",
            explanation: "Use toHaveBeenCalled() or toHaveBeenCalledTimes() to verify if and how many times a mock was called."
          },
          {
            action: "Check call arguments",
            explanation: "Use toHaveBeenCalledWith() or various argument matchers to verify the arguments passed to mocks."
          },
          {
            action: "Examine call order if relevant",
            explanation: "Use mock.mock.calls to analyze the sequence of calls if the order is important."
          }
        ]
      },
      {
        name: "Clean Up Between Tests",
        description: "Reset or restore mocks appropriately between test cases to ensure test isolation.",
        agentActions: [
          {
            action: "Reset mocks in beforeEach/afterEach",
            explanation: "Use vi.clearAllMocks(), vi.resetAllMocks(), or vi.restoreAllMocks() in setup/teardown hooks."
          },
          {
            action: "Restore real timers if using fake ones",
            explanation: "Call vi.useRealTimers() after tests that use fake timers to prevent affecting subsequent tests."
          },
          {
            action: "Reset specific mocks individually",
            explanation: "Use mockFn.mockClear(), mockFn.mockReset(), or mockFn.mockRestore() to reset specific mocks as needed."
          }
        ]
      }
    ]
  },
  examples: {
    description: "Practical examples of using Vitest's mocking APIs in different testing scenarios.",
    useCases: [
      {
        scenario: "Testing API interaction logic",
        implementation: "A service that makes API requests and processes the responses.",
        outcome: "Tests use vi.mock() to replace the API client, allowing verification that the service correctly handles both successful responses and errors without making actual network requests."
      },
      {
        scenario: "Testing timeout and interval behavior",
        implementation: "A component that uses setTimeout or setInterval for delayed or recurring operations.",
        outcome: "Tests use vi.useFakeTimers() to simulate the passage of time, verifying that operations occur at the expected times without waiting for actual delays."
      },
      {
        scenario: "Testing environment-dependent code",
        implementation: "A utility that behaves differently based on environment variables or runtime environment.",
        outcome: "Tests use vi.mock() for Node.js modules like process or os, controlling the environment values returned to test different behaviors without modifying the actual environment."
      },
      {
        scenario: "Testing complex object interactions",
        implementation: "A function that works with complex objects having multiple methods and properties.",
        outcome: "Tests use vi.fn() and vi.spyOn() to create mock methods on objects, verifying that the function interacts with the object correctly while maintaining control over the object's behavior."
      }
    ]
  },
  codeExamples: [
    {
      language: "typescript",
      description: "Basic function mocking with vi.fn()",
      code: `
import { describe, it, expect, vi } from 'vitest';

// Function to test
function processItems(items: string[], processFn: (item: string) => string): string[] {
  return items.map(processFn);
}

describe('processItems', () => {
  it('should apply the process function to each item', () => {
    // Create a mock function
    const mockProcessFn = vi.fn((item) => \`processed_\${item}\`);
    
    // Execute function with mock
    const result = processItems(['a', 'b', 'c'], mockProcessFn);
    
    // Verify results
    expect(result).toEqual(['processed_a', 'processed_b', 'processed_c']);
    
    // Verify mock was called correctly
    expect(mockProcessFn).toHaveBeenCalledTimes(3);
    expect(mockProcessFn).toHaveBeenCalledWith('a');
    expect(mockProcessFn).toHaveBeenCalledWith('b');
    expect(mockProcessFn).toHaveBeenCalledWith('c');
    
    // Verify call sequence
    expect(mockProcessFn.mock.calls).toEqual([['a'], ['b'], ['c']]);
  });
  
  it('should work with various mock implementations', () => {
    // Mock returning a value
    const mockReturn = vi.fn().mockReturnValue('fixed_result');
    expect(processItems(['x', 'y'], mockReturn)).toEqual(['fixed_result', 'fixed_result']);
    
    // Mock sequential returns
    const mockSequence = vi.fn()
      .mockReturnValueOnce('first')
      .mockReturnValueOnce('second')
      .mockReturnValue('default');
    expect(processItems(['a', 'b', 'c'], mockSequence)).toEqual(['first', 'second', 'default']);
    
    // Mock implementation
    const mockImpl = vi.fn().mockImplementation((item) => item.toUpperCase());
    expect(processItems(['a', 'b'], mockImpl)).toEqual(['A', 'B']);
  });
});
`,
      explanation: "This example demonstrates basic function mocking with vi.fn(), showing how to create mock functions, configure their behavior, and verify their usage. It covers basic return values, sequential returns, and custom implementations, as well as verification of calls and arguments."
    },
    {
      language: "typescript",
      description: "Module mocking with vi.mock()",
      code: `
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchUserData } from './user-api'; // Original module
import { UserProcessor } from './user-processor'; // Module to test

// Mock the entire user-api module
vi.mock('./user-api', () => ({
  fetchUserData: vi.fn()
}));

describe('UserProcessor', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it('should transform user data correctly', async () => {
    // Configure the mock to return test data
    (fetchUserData as any).mockResolvedValue({
      id: '123',
      firstName: 'John',
      lastName: 'Doe',
      age: 30,
      email: 'john.doe@example.com'
    });
    
    // Create the processor and process data
    const processor = new UserProcessor();
    const result = await processor.getProcessedUserData('123');
    
    // Verify the API was called correctly
    expect(fetchUserData).toHaveBeenCalledWith('123');
    expect(fetchUserData).toHaveBeenCalledTimes(1);
    
    // Verify the processor transformed the data correctly
    expect(result).toEqual({
      id: '123',
      displayName: 'John Doe',
      contact: 'john.doe@example.com',
      isAdult: true
    });
  });
  
  it('should handle API errors gracefully', async () => {
    // Configure the mock to reject
    (fetchUserData as any).mockRejectedValue(new Error('Network error'));
    
    // Create the processor
    const processor = new UserProcessor();
    
    // Verify it handles the error as expected
    await expect(processor.getProcessedUserData('123')).rejects.toThrow('Failed to process user: Network error');
  });
});
`,
      explanation: "This example shows how to mock an entire module using vi.mock(), replacing its exports with mock functions. It demonstrates setting up mock resolved and rejected values for async functions, and verifying that the code under test interacts with the module correctly and handles both success and error cases."
    },
    {
      language: "typescript",
      description: "Controlling time with vi.useFakeTimers()",
      code: `
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DelayedExecutor } from './delayed-executor';

describe('DelayedExecutor', () => {
  beforeEach(() => {
    // Setup fake timers before each test
    vi.useFakeTimers();
  });
  
  afterEach(() => {
    // Restore real timers after each test
    vi.useRealTimers();
  });
  
  it('should execute the function after the specified delay', () => {
    // Create a mock function to be executed
    const mockFn = vi.fn();
    
    // Create the executor and schedule execution
    const executor = new DelayedExecutor();
    executor.executeAfterDelay(mockFn, 2000);
    
    // Verify function hasn't been called immediately
    expect(mockFn).not.toHaveBeenCalled();
    
    // Advance time by less than the delay
    vi.advanceTimersByTime(1000);
    expect(mockFn).not.toHaveBeenCalled();
    
    // Advance time to reach the delay
    vi.advanceTimersByTime(1000);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
  
  it('should handle multiple scheduled executions', () => {
    const mockFn1 = vi.fn();
    const mockFn2 = vi.fn();
    
    const executor = new DelayedExecutor();
    executor.executeAfterDelay(mockFn1, 1000);
    executor.executeAfterDelay(mockFn2, 3000);
    
    // After 1 second, only first function should be called
    vi.advanceTimersByTime(1000);
    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn2).not.toHaveBeenCalled();
    
    // After 2 more seconds, second function should be called
    vi.advanceTimersByTime(2000);
    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn2).toHaveBeenCalledTimes(1);
  });
  
  it('should clear scheduled execution when cancelled', () => {
    const mockFn = vi.fn();
    
    const executor = new DelayedExecutor();
    const taskId = executor.executeAfterDelay(mockFn, 2000);
    
    // Cancel the task
    executor.cancelExecution(taskId);
    
    // Advance time past when it would have executed
    vi.advanceTimersByTime(3000);
    
    // Verify function was never called
    expect(mockFn).not.toHaveBeenCalled();
  });
  
  it('should work with runAllTimers() for simplicity', () => {
    const mockFn = vi.fn();
    
    const executor = new DelayedExecutor();
    executor.executeAfterDelay(mockFn, 9999);
    
    // Run all timers to completion, regardless of duration
    vi.runAllTimers();
    
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
`,
      explanation: "This example demonstrates using Vitest's fake timers to test time-dependent code without waiting for actual time to pass. It shows how to set up fake timers, advance time by specific amounts with advanceTimersByTime(), and run all timers to completion with runAllTimers(). This approach makes time-dependent tests fast and deterministic."
    },
    {
      language: "typescript",
      description: "Spying on objects with vi.spyOn()",
      code: `
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Logger } from './logger';
import { UserService } from './user-service';

describe('UserService', () => {
  let logger: Logger;
  let userService: UserService;
  
  beforeEach(() => {
    // Create a real logger instance
    logger = new Logger();
    
    // Spy on logger methods without replacing them
    vi.spyOn(logger, 'info');
    vi.spyOn(logger, 'error');
    
    // Create service with the real logger
    userService = new UserService(logger);
  });
  
  afterEach(() => {
    // Restore all spies
    vi.restoreAllMocks();
  });
  
  it('should log user creation correctly', () => {
    // Act - create a user
    userService.createUser('john', 'doe', 'john@example.com');
    
    // Assert - verify logging happened correctly
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining('User created'),
      expect.objectContaining({
        email: 'john@example.com'
      })
    );
  });
  
  it('should log errors when validation fails', () => {
    // Act - try to create user with invalid data
    const result = userService.createUser('', '', 'not-an-email');
    
    // Assert - verify result and logging
    expect(result.success).toBe(false);
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('Validation failed'),
      expect.arrayContaining([
        expect.stringContaining('firstName'),
        expect.stringContaining('lastName'),
        expect.stringContaining('email')
      ])
    );
  });
  
  it('should use console.error for critical errors', () => {
    // Spy on console.error
    const consoleSpy = vi.spyOn(console, 'error');
    
    // Simulate a situation that causes a critical error
    userService.performCriticalOperation();
    
    // Verify console.error was called
    expect(consoleSpy).toHaveBeenCalled();
    
    // Restore console.error specifically
    consoleSpy.mockRestore();
  });
});
`,
      explanation: "This example demonstrates using vi.spyOn() to monitor method calls on real objects without replacing their functionality. It shows how to spy on methods of a service's dependencies to verify they're called correctly, and how to spy on built-in objects like console. This approach is useful when you want to verify interactions while keeping the real implementation."
    }
  ],
  commonPitfalls: [
    {
      name: "Incorrect Mock Hoisting",
      description: "Placing vi.mock() calls after imports, causing them to execute too late and not properly replace imported modules in tests.",
      solution: "Always place vi.mock() calls at the top of your test file, before any imports, or use vi.doMock() when you need to defer mocking until after imports.",
      preventativeMeasures: [
        "Review test files to ensure vi.mock() calls come before imports",
        "Use ESLint rules to enforce proper mock hoisting",
        "If dynamic mocking is needed, use vi.doMock() instead of vi.mock()"
      ]
    },
    {
      name: "Mocking Non-existent Paths",
      description: "Attempting to mock modules that don't exist or using incorrect paths, which can cause confusing errors or silently fail to replace the intended modules.",
      solution: "Verify that the paths used in vi.mock() exactly match the paths used in import statements, including relative paths.",
      preventativeMeasures: [
        "Double-check import paths against mock paths",
        "Use TypeScript path aliases consistently in both imports and mocks",
        "Test that mock replacements are actually happening by verifying mock behavior"
      ]
    },
    {
      name: "Mock State Leakage Between Tests",
      description: "Failing to reset or clear mocks between tests, causing state from one test to affect subsequent tests and lead to unpredictable behavior.",
      solution: "Consistently reset mocks in beforeEach or afterEach hooks using vi.clearAllMocks(), vi.resetAllMocks(), or vi.restoreAllMocks() as appropriate.",
      preventativeMeasures: [
        "Add vi.clearAllMocks() to beforeEach hooks in all test files",
        "Be aware of the differences between clear, reset, and restore operations",
        "Consider setting up a global setup in setupTests that handles mock reset"
      ]
    },
    {
      name: "Inadequate Type Safety in Mocks",
      description: "Creating mocks that don't match the types of the real implementations, leading to type errors or runtime failures when the code uses mock properties or methods.",
      solution: "Use TypeScript to ensure mocks match the types of real implementations, using interfaces or type assertions where necessary.",
      preventativeMeasures: [
        "Use type-aware mocking techniques like jest.Mocked<T>",
        "Define interfaces for dependencies to ensure mock implementations match",
        "Configure TypeScript and ESLint to catch type mismatches in tests"
      ]
    },
    {
      name: "Forgetting to Restore Real Timers",
      description: "Not restoring real timers after using fake ones, which can cause subsequent tests that rely on real timing to fail or behave unexpectedly.",
      solution: "Always call vi.useRealTimers() in afterEach hooks when tests use fake timers to prevent affecting other tests.",
      preventativeMeasures: [
        "Pair vi.useFakeTimers() with vi.useRealTimers() in before/after hooks",
        "Isolate tests that use fake timers in their own describe blocks with appropriate setup/teardown",
        "Consider a global teardown that restores real timers"
      ]
    },
    {
      name: "Overly Strict Mock Verification",
      description: "Setting overly specific expectations about mock usage, such as exact call counts or argument equality, making tests brittle and prone to breaking with minor changes.",
      solution: "Make verification as loose as possible while still ensuring the important aspects of behavior are tested. Use matchers like expect.objectContaining() instead of exact equality.",
      preventativeMeasures: [
        "Review tests to identify overly strict verifications",
        "Use flexible matchers when exact values aren't critical",
        "Focus verification on the key aspects of the behavior being tested"
      ]
    }
  ],
  improvementGuidelines: {
    description: "Strategies for improving your use of Vitest's mocking APIs over time.",
    metrics: [
      {
        name: "Mock Setup Clarity",
        description: "How easy it is to understand what is being mocked and how in a test file. Clear mock setups are easier to maintain and troubleshoot.",
        assessmentMethod: "Review test files and assess how quickly a new developer could understand what's being mocked and why. Consider extracting complex mock setups into helper functions with descriptive names."
      },
      {
        name: "Mock Specificity",
        description: "How precisely mocks are tailored to test requirements, avoiding both over-mocking (too many details) and under-mocking (insufficient control).",
        assessmentMethod: "Analyze tests for how much mock configuration they contain versus actual test logic. Look for opportunities to simplify mocks while still meeting test needs."
      },
      {
        name: "Mock Resilience",
        description: "How well mocks hold up to changes in implementation details without requiring updates, allowing for refactoring without breaking tests.",
        assessmentMethod: "Track how often tests break during refactoring when behavior hasn't changed. Identify brittle mock setups that are too tied to implementation details."
      },
      {
        name: "Consistent Mock Patterns",
        description: "The consistency of mocking approaches across the test suite, making it easier for developers to understand and extend tests.",
        assessmentMethod: "Review mocking patterns across test files and identify inconsistencies. Establish and document standard patterns for common mocking scenarios."
      }
    ]
  },
  resources: [
    {
      type: "documentation",
      name: "Vitest Official Mocking Documentation",
      description: "The official documentation for Vitest's mocking capabilities, including vi.fn(), vi.mock(), and other utilities.",
      link: "https://vitest.dev/api/vi.html"
    },
    {
      type: "tutorial",
      name: "Vitest Mocking Examples",
      description: "A collection of practical examples showing how to use Vitest's mocking features for common testing scenarios.",
      link: "https://vitest.dev/guide/mocking.html"
    },
    {
      type: "reference",
      name: "Vitest Timer Mocks",
      description: "Detailed documentation on using Vitest's timer mocks to control time in tests.",
      link: "https://vitest.dev/api/vi.html#vi-usefaketimers"
    },
    {
      type: "tool",
      name: "TypeScript-aware Mocking",
      description: "Techniques for creating type-safe mocks in TypeScript with Vitest.",
      link: "https://vitest.dev/guide/mocking.html#typescript"
    }
  ],
  conclusion: "Vitest's mocking APIs provide powerful tools for isolating code during testing, controlling dependencies, and verifying interactions. By understanding and effectively using vi.fn(), vi.mock(), vi.spyOn(), and time control functions, you can create fast, reliable, and deterministic tests that focus on the behavior of your code without being affected by external dependencies. Remember that the goal of mocking is to simplify testing and increase reliability, not to create complex test setups that mirror the entire system. Use mocks judiciously, focusing on isolating the code under test while maintaining readable and maintainable tests. With practice and attention to the pitfalls mentioned above, you can create a robust test suite that supports refactoring and catches real issues early in the development process."
}; 