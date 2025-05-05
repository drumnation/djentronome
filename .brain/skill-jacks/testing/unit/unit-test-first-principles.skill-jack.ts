/**
 * Skill-Jack: Unit Test First Principles
 * 
 * A comprehensive guide to fundamental unit testing principles and practices.
 * 
 * @module brain-garden/skill-jack
 * @category testing/patterns
 */

/**
 * Skill-Jack on Unit Test First Principles
 * 
 * This constant provides comprehensive guidance on understanding and applying
 * unit testing first principles in the context of software development.
 */
export const topicGuide = {
  topic: "Unit Test First Principles",
  description: "Foundational principles and practices for effective unit testing that drive high-quality software design, maintainable code, and reliable test suites.",
  corePrinciples: [
    {
      name: "Test One Thing at a Time",
      description: "Each unit test should focus on validating a single behavior or functionality, not multiple aspects at once. This creates tests that are easy to understand, maintain, and debug when they fail.",
      examples: [
        "Test that a validation function correctly identifies an invalid email, not email validation AND password requirements in the same test.",
        "Test that a calculation returns the expected value, not the calculation AND that it logs errors correctly."
      ]
    },
    {
      name: "Arrange-Act-Assert (AAA) Pattern",
      description: "Structure tests into three distinct phases: Arrange (setup), Act (execute), and Assert (verify). This clear separation makes tests more readable and their intent obvious.",
      examples: [
        "Arrange: const calculator = new Calculator(); const x = 5; const y = 3;",
        "Act: const result = calculator.add(x, y);",
        "Assert: expect(result).toBe(8);"
      ]
    },
    {
      name: "Deterministic Tests",
      description: "Tests should always produce the same results given the same inputs and conditions. Avoid dependencies on time, randomness, or external state that could cause tests to be flaky.",
      examples: [
        "Use mocks for date/time functions instead of new Date()",
        "Seed random number generators with fixed values during tests",
        "Reset global state before each test run"
      ]
    },
    {
      name: "Test Behavior, Not Implementation",
      description: "Focus on testing what a function or module does, not how it does it. Tests should validate expected outputs for given inputs, not the internal workings of the implementation.",
      examples: [
        "Test that a user registration function creates a user with the right properties, not that it called specific internal methods.",
        "Test that an authentication method returns the correct result, not that it called a specific validation helper."
      ]
    },
    {
      name: "Fast Execution",
      description: "Unit tests should execute quickly (milliseconds, not seconds) to provide immediate feedback during development and enable frequent test runs.",
      examples: [
        "Mock expensive operations like database calls or network requests",
        "Limit the scope of what each unit test covers",
        "Use in-memory implementations for external dependencies"
      ]
    },
    {
      name: "Isolated Tests",
      description: "Tests should be independent of each other, with no shared state or execution order dependencies. Each test should be able to run alone or in any order.",
      examples: [
        "Reset shared state in beforeEach/afterEach hooks",
        "Create fresh test data for each test case",
        "Avoid test that rely on side effects from other tests"
      ]
    },
    {
      name: "Test-Driven Development (TDD)",
      description: "Write tests before implementing functionality using the Red-Green-Refactor cycle: write a failing test, implement the minimum code to pass the test, then refactor while keeping tests passing.",
      examples: [
        "Red: Write a test for a validation function that doesn't exist yet",
        "Green: Implement the validation function with just enough code to pass",
        "Refactor: Improve the implementation while ensuring tests continue to pass"
      ]
    }
  ],
  applicationProcess: {
    description: "A systematic approach to applying unit testing first principles effectively in a development workflow.",
    steps: [
      {
        name: "Identify Testing Boundaries",
        description: "Determine what constitutes a 'unit' in your application context. This could be a function, class, or small group of closely related functions.",
        agentActions: [
          {
            action: "Analyze the function/module signature and purpose",
            explanation: "Examine the function parameters, return values, and primary responsibility to understand what it does and how it should be tested."
          },
          {
            action: "Identify dependencies and external interactions",
            explanation: "Map out what the unit interacts with (databases, APIs, other modules) to determine what needs to be mocked or stubbed."
          },
          {
            action: "Define clear test scope",
            explanation: "Document exactly what aspects of behavior will be validated in tests, and what's considered out of scope."
          }
        ]
      },
      {
        name: "Design Test Cases",
        description: "Create a comprehensive set of test cases that cover normal operation, edge cases, and error conditions.",
        agentActions: [
          {
            action: "Outline happy path scenarios",
            explanation: "Define tests for normal, expected use cases where inputs are valid and operations succeed."
          },
          {
            action: "Identify edge cases and boundaries",
            explanation: "Consider extreme values, empty collections, minimum/maximum limits, and other boundary conditions."
          },
          {
            action: "Plan error condition tests",
            explanation: "Define tests for invalid inputs, resource unavailability, and other error scenarios to verify proper error handling."
          },
          {
            action: "Consider performance constraints",
            explanation: "For time-sensitive operations, include tests that verify performance requirements are met."
          }
        ]
      },
      {
        name: "Implement Test Infrastructure",
        description: "Set up the necessary testing framework, mocks, and utilities to support effective unit testing.",
        agentActions: [
          {
            action: "Configure the testing framework (Vitest)",
            explanation: "Set up Vitest with appropriate configuration for the project, including path resolution, timeouts, and environment settings."
          },
          {
            action: "Create mock implementations",
            explanation: "Develop mocks for external dependencies that provide predictable responses and allow test verification."
          },
          {
            action: "Establish test data factories",
            explanation: "Create utilities that generate consistent test data to use across test suites."
          },
          {
            action: "Set up test helpers and utilities",
            explanation: "Implement reusable testing utilities that simplify common testing tasks."
          }
        ]
      },
      {
        name: "Write Focused Test Suites",
        description: "Implement test suites that clearly validate each unit's behavior without unnecessary complexity.",
        agentActions: [
          {
            action: "Structure tests using describe/it nesting",
            explanation: "Organize tests hierarchically to group related test cases and provide context in test output."
          },
          {
            action: "Follow the AAA pattern consistently",
            explanation: "Structure each test with clear Arrange, Act, and Assert sections, possibly with comments to separate them."
          },
          {
            action: "Use descriptive test names",
            explanation: "Name tests to clearly indicate what's being tested and expected outcomes, serving as documentation."
          },
          {
            action: "Keep individual tests focused",
            explanation: "Ensure each test validates only one specific behavior or condition."
          }
        ]
      },
      {
        name: "Ensure Comprehensive Coverage",
        description: "Verify that tests adequately cover all important code paths and behaviors.",
        agentActions: [
          {
            action: "Run coverage analysis",
            explanation: "Use Vitest's coverage tools to identify untested code paths and functions."
          },
          {
            action: "Review uncovered code and add tests",
            explanation: "Analyze any gaps in coverage and write additional tests to address them."
          },
          {
            action: "Evaluate the quality of test assertions",
            explanation: "Review tests to ensure they make meaningful assertions that validate behavior, not just execute code."
          },
          {
            action: "Perform mutation testing",
            explanation: "If available, use tools like Stryker to verify tests catch code changes that would break functionality."
          }
        ]
      }
    ]
  },
  examples: {
    description: "Practical examples demonstrating the application of unit testing first principles in different scenarios.",
    useCases: [
      {
        scenario: "Testing a Pure Calculation Function",
        implementation: "A function that calculates the total price including tax and discounts for items in a shopping cart.",
        outcome: "Tests verify correct calculations for various combinations of inputs, including edge cases like empty carts, zero-priced items, and maximum discount scenarios."
      },
      {
        scenario: "Testing Input Validation Logic",
        implementation: "A validation module that verifies user input meets required formats and constraints.",
        outcome: "Tests confirm valid inputs pass validation, invalid inputs are properly rejected with appropriate error messages, and edge cases (empty strings, whitespace-only, etc.) are handled correctly."
      },
      {
        scenario: "Testing State Transitions",
        implementation: "A state machine that manages the flow of a user through a multi-step process.",
        outcome: "Tests verify each valid state transition works as expected, invalid transitions are prevented, and the state machine maintains consistency throughout the process."
      },
      {
        scenario: "Testing Module with External Dependencies",
        implementation: "A service that processes user data and interacts with authentication and logging services.",
        outcome: "Tests use mocks to isolate the service from its dependencies, verifying it correctly interacts with them while focusing on its own logic and error handling."
      }
    ]
  },
  codeExamples: [
    {
      language: "typescript",
      description: "Basic unit test for a pure function using the AAA pattern",
      code: `
import { describe, it, expect } from 'vitest';
import { calculateTotal } from './cart-utils';

describe('calculateTotal', () => {
  it('should correctly calculate total with tax and discount', () => {
    // Arrange
    const items = [
      { name: 'Item 1', price: 100, quantity: 2 },
      { name: 'Item 2', price: 50, quantity: 1 }
    ];
    const taxRate = 0.1; // 10%
    const discountRate = 0.05; // 5%
    
    // Act
    const result = calculateTotal(items, taxRate, discountRate);
    
    // Assert
    // Expected calculation: (100*2 + 50*1) * 0.95 * 1.1 = 247.5
    expect(result).toBe(247.5);
  });
  
  it('should return 0 for empty cart', () => {
    // Arrange
    const items = [];
    const taxRate = 0.1;
    const discountRate = 0.05;
    
    // Act
    const result = calculateTotal(items, taxRate, discountRate);
    
    // Assert
    expect(result).toBe(0);
  });
});
`,
      explanation: "This example demonstrates testing a pure calculation function with clear AAA structure. It tests both the normal case and an edge case (empty cart). The calculation is explained in a comment so the expected value is clear."
    },
    {
      language: "typescript",
      description: "Testing a function with external dependencies using mocks",
      code: `
import { describe, it, expect, vi } from 'vitest';
import { processUserData } from './user-service';
import { AuthService } from './auth-service';
import { LoggerService } from './logger-service';

// Mock the dependencies
vi.mock('./auth-service');
vi.mock('./logger-service');

describe('processUserData', () => {
  it('should process valid user data and return success', async () => {
    // Arrange
    const mockUser = { id: 'user1', name: 'Test User', email: 'test@example.com' };
    const mockAuthService = AuthService as jest.Mocked<typeof AuthService>;
    const mockLoggerService = LoggerService as jest.Mocked<typeof LoggerService>;
    
    // Configure mocks
    mockAuthService.validateUser.mockResolvedValue(true);
    mockLoggerService.log.mockImplementation(() => { /* do nothing */ });
    
    // Act
    const result = await processUserData(mockUser);
    
    // Assert
    expect(result.success).toBe(true);
    expect(mockAuthService.validateUser).toHaveBeenCalledWith(mockUser.id);
    expect(mockLoggerService.log).toHaveBeenCalledWith(
      'info', 
      expect.stringContaining(mockUser.id)
    );
  });
  
  it('should handle authentication failure', async () => {
    // Arrange
    const mockUser = { id: 'invalid', name: 'Invalid User', email: 'invalid@example.com' };
    const mockAuthService = AuthService as jest.Mocked<typeof AuthService>;
    const mockLoggerService = LoggerService as jest.Mocked<typeof LoggerService>;
    
    // Configure mocks
    mockAuthService.validateUser.mockResolvedValue(false);
    mockLoggerService.log.mockImplementation(() => { /* do nothing */ });
    
    // Act
    const result = await processUserData(mockUser);
    
    // Assert
    expect(result.success).toBe(false);
    expect(result.error).toBe('Authentication failed');
    expect(mockLoggerService.log).toHaveBeenCalledWith(
      'error', 
      expect.stringContaining(mockUser.id)
    );
  });
});
`,
      explanation: "This example shows how to test a function that depends on external services by using Vitest's mocking capabilities. The dependencies are mocked, and their behavior is configured for each test case. The tests verify both the function's output and its interactions with dependencies."
    },
    {
      language: "typescript",
      description: "Test-Driven Development (TDD) example workflow",
      code: `
// TDD Step 1: Write a failing test
import { describe, it, expect } from 'vitest';
// The function doesn't exist yet, but we write the test first
import { validateEmail } from './validators';

describe('validateEmail', () => {
  it('should return true for valid email addresses', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('name.surname@company.co.uk')).toBe(true);
  });
  
  it('should return false for invalid email addresses', () => {
    expect(validateEmail('')).toBe(false);
    expect(validateEmail('not-an-email')).toBe(false);
    expect(validateEmail('missing@domain')).toBe(false);
  });
});

// TDD Step 2: Implement the minimum code to pass the test
// In validators.ts:
export function validateEmail(email: string): boolean {
  if (!email) return false;
  
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return emailRegex.test(email);
}

// TDD Step 3: Refactor while keeping tests passing
// Improved implementation with better handling and comments:
export function validateEmail(email: string): boolean {
  // Early return for empty strings
  if (!email || email.trim() === '') return false;
  
  // Basic regex for email validation
  // Checks for: something@something.something
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return emailRegex.test(email);
  
  // Note: This is a simplified validation.
  // For production, consider a more comprehensive validation
  // or a dedicated library like validator.js
}
`,
      explanation: "This example demonstrates the TDD workflow: first writing tests that describe the expected behavior, then implementing the minimum code to make the tests pass, and finally refactoring to improve the implementation while ensuring tests continue to pass."
    }
  ],
  commonPitfalls: [
    {
      name: "Testing Implementation Details",
      description: "Writing tests that verify how a function works internally rather than focusing on the observable behavior and outputs. This leads to brittle tests that break when refactoring even if the behavior doesn't change.",
      solution: "Focus tests on public interfaces, inputs, and outputs rather than internal methods or state. Test what the code does, not how it does it.",
      preventativeMeasures: [
        "Review tests to ensure they only validate observable behavior",
        "Avoid excessive mocking of implementation details",
        "Consider the test from a consumer's perspective: would they care about this aspect?"
      ]
    },
    {
      name: "Test Interdependence",
      description: "Creating tests that depend on each other or must run in a specific order to pass. This leads to confusing failures and makes it hard to run or debug individual tests.",
      solution: "Ensure each test is fully self-contained with its own setup and teardown. Never rely on state from previous tests.",
      preventativeMeasures: [
        "Use beforeEach to reset state for each test",
        "Run tests in random order to catch dependencies",
        "Create fresh test data in each test rather than sharing"
      ]
    },
    {
      name: "Insufficient Test Coverage",
      description: "Missing tests for important code paths, edge cases, or error conditions, leading to potential bugs in production that could have been caught by tests.",
      solution: "Systematically identify and test all code paths, focusing on edge cases and error handling in addition to happy paths.",
      preventativeMeasures: [
        "Use coverage tools to identify untested code",
        "Establish minimum coverage thresholds",
        "Review tests during code review to ensure comprehensive coverage",
        "Practice TDD to ensure test coverage from the start"
      ]
    },
    {
      name: "Flaky Tests",
      description: "Tests that sometimes pass and sometimes fail without any changes to the code, often due to dependencies on time, network, or other external factors.",
      solution: "Make tests deterministic by controlling all inputs and dependencies, including time, randomness, and external services.",
      preventativeMeasures: [
        "Mock date/time functions and APIs",
        "Use dependency injection to replace non-deterministic components",
        "Set fixed seeds for any random operations",
        "Run tests in isolated environments"
      ]
    },
    {
      name: "Overspecified Tests",
      description: "Tests that are too specific or rigid, validating exact implementation details that may change rather than focusing on behavior, making refactoring difficult.",
      solution: "Make tests more resilient by focusing on important behavioral expectations rather than exact implementations.",
      preventativeMeasures: [
        "Use partial matching or custom matchers when appropriate",
        "Test behavior rather than exact values when the precise value isn't important",
        "Consider what aspects of the behavior are important to preserve during refactoring"
      ]
    },
    {
      name: "Ignoring Test Failures",
      description: "Allowing failing tests to persist by marking them as skipped or ignoring failures, leading to a degraded test suite that doesn't provide confidence.",
      solution: "Treat failing tests as a high priority: either fix the test or fix the code that's causing the failure.",
      preventativeMeasures: [
        "Configure CI to fail builds on test failures",
        "Regular test suite maintenance",
        "Never commit code with failing or skipped tests without documented reasons",
        "Establish team norms against ignoring test failures"
      ]
    }
  ],
  improvementGuidelines: {
    description: "Continuous improvement strategies for enhancing the quality and effectiveness of your unit testing approach.",
    metrics: [
      {
        name: "Code Coverage",
        description: "Percentage of source code executed by tests, providing a baseline metric for test completeness. While high coverage is good, quality of assertions is equally important.",
        assessmentMethod: "Use Vitest's coverage tools (based on Istanbul) to generate reports of statement, branch, function, and line coverage."
      },
      {
        name: "Test Suite Speed",
        description: "Total execution time of the test suite, with faster tests enabling more frequent runs and quicker feedback cycles.",
        assessmentMethod: "Measure and track the execution time of the test suite, identifying and optimizing slow tests."
      },
      {
        name: "Test Reliability",
        description: "Consistency of test results across multiple runs, with no flaky tests that pass and fail inconsistently.",
        assessmentMethod: "Run tests multiple times (possibly in CI) and track any inconsistent results, focusing on eliminating flakiness."
      },
      {
        name: "Defect Detection Rate",
        description: "Percentage of real bugs caught by unit tests before reaching production, indicating the effectiveness of the test suite.",
        assessmentMethod: "Track bugs found in production and analyze whether they could have been caught by better unit tests."
      },
      {
        name: "Refactoring Confidence",
        description: "Ability to refactor code without breaking existing functionality, enabled by a comprehensive test suite.",
        assessmentMethod: "Measure how often refactoring efforts break unrelated functionality, and assess team confidence in making changes."
      }
    ]
  },
  resources: [
    {
      type: "documentation",
      name: "Vitest Documentation",
      description: "Official documentation for Vitest, the testing framework used in this project.",
      link: "https://vitest.dev/guide/"
    },
    {
      type: "tutorial",
      name: "Test-Driven Development Basics",
      description: "A comprehensive guide to Test-Driven Development (TDD) principles and practices.",
      link: "https://www.freecodecamp.org/news/test-driven-development-tutorial-how-to-test-javascript-and-reactjs-app/"
    },
    {
      type: "reference",
      name: "Testing JavaScript Applications",
      description: "A detailed reference for testing JavaScript applications, covering various testing types and strategies.",
      link: "https://github.com/goldbergyoni/javascript-testing-best-practices"
    },
    {
      type: "tool",
      name: "Vitest Coverage",
      description: "Guide to measuring and improving test coverage using Vitest's built-in coverage tools.",
      link: "https://vitest.dev/guide/coverage.html"
    }
  ],
  conclusion: "Effective unit testing based on first principles is a cornerstone of high-quality software development. By focusing on testing behavior rather than implementation, keeping tests isolated and deterministic, and practicing Test-Driven Development, developers can create reliable test suites that enable confident refactoring and prevent regressions. Remember that the goal of unit testing is not just to achieve high coverage metrics, but to provide fast feedback, document expected behavior, and support continuous improvement of the codebase. Invest time in learning these principles and applying them consistently to build a robust testing culture."
}; 