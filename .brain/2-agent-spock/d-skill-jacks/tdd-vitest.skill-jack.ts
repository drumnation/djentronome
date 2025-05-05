/**
 * Skill-Jack: Test-Driven Development (TDD) with Vitest
 * 
 * Provides guidance on applying TDD principles using the Vitest testing framework within the Djentronome project.
 * 
 * @module brain-garden/skill-jack
 * @category patterns
 */

/**
 * Skill-Jack on TDD with Vitest
 * 
 * This constant provides comprehensive guidance on understanding and applying
 * Test-Driven Development (TDD) using Vitest for writing unit and integration tests.
 */
export const tddVitestGuide = {
  topic: "Test-Driven Development (TDD) with Vitest",
  description: "Covers the core TDD cycle (Red-Green-Refactor), best practices for writing tests first with Vitest, choosing between unit and integration tests, and utilizing Vitest features effectively.",
  corePrinciples: [
    {
      name: "Test First",
      description: "Write a failing test before writing the corresponding implementation code. The test defines the desired behavior and requirements.",
      examples: ["Creating `feature.test.ts` before `feature.ts`.", "Writing an `expect()` assertion that initially fails because the functionality doesn't exist."],
    },
    {
      name: "Red-Green-Refactor Cycle",
      description: "The fundamental TDD workflow: 1. Red: Write a minimal failing test. 2. Green: Write the minimal code to make the test pass. 3. Refactor: Improve the code and test structure while ensuring tests remain green.",
      examples: ["Focusing solely on passing the current test in the Green phase.", "Improving variable names or extracting functions during the Refactor phase."],
    },
    {
      name: "Minimal Implementation",
      description: "In the Green phase, write only the code necessary to pass the current failing test. Avoid adding extra functionality not yet covered by a test.",
    },
    {
      name: "Keep Tests Isolated and Focused",
      description: "Each test should ideally verify a single behavior or requirement. Avoid overly complex tests that check multiple things at once.",
      examples: ["Having separate `it` blocks for success cases, error cases, and edge cases."],
    },
    {
      name: "Refactor with Confidence",
      description: "The passing test suite acts as a safety net, allowing for confident refactoring of the implementation code without breaking existing functionality.",
    },
    {
      name: "Choose Appropriate Test Type (Unit vs. Integration)",
      description: "Consciously decide whether a unit test (testing a module in isolation with mocks) or an integration test (testing interaction between modules) is more suitable for the feature being developed.",
      examples: ["Unit testing a complex calculation function.", "Integration testing a feature involving API calls and database interaction."]
    }
  ],
  applicationProcess: {
    description: "Steps for an agent to apply TDD when implementing a new feature or fixing a bug.",
    steps: [
      {
        name: "Understand Requirements",
        description: "Clearly define the desired behavior or the bug to be fixed.",
        agentActions: [
          {
            action: "Analyze the feature request or bug report.",
            explanation: "Identify inputs, outputs, expected behavior, and edge cases.",
          },
        ],
      },
      {
        name: "Write a Failing Test (Red)",
        description: "Create a new test case (or modify an existing one) that describes the desired outcome and currently fails.",
        agentActions: [
          {
            action: "Create or navigate to the relevant `.test.ts` file.",
            explanation: "Test files should be co-located with the source code or follow project conventions.",
          },
          {
            action: "Write an `it(...)` block describing the specific behavior.",
            explanation: "Use clear, descriptive language for the test case.",
          },
          {
            action: "Set up necessary preconditions (arrange).",
            explanation: "Initialize variables, mock dependencies (if unit testing), or prepare system state (if integration testing).",
          },
          {
            action: "Call the function/method to be implemented (act).",
            explanation: "Invoke the code path that should exhibit the desired behavior.",
          },
          {
            action: "Write an assertion (`expect()`) that currently fails (assert).",
            explanation: "Define the expected outcome that the (not yet written) code should produce.",
          },
          {
            action: "Run the test suite to confirm the new test fails as expected.",
            explanation: "Use `pnpm test` or `vitest` command, potentially filtered.",
          },
        ],
      },
      {
        name: "Write Minimal Code to Pass (Green)",
        description: "Implement the simplest possible code that makes the failing test pass.",
        agentActions: [
          {
            action: "Navigate to the source file (`.ts`).",
            explanation: "Locate the module where the implementation logic belongs.",
          },
          {
            action: "Write only the code required to satisfy the test assertion.",
            explanation: "Avoid implementing unrelated functionality. Focus solely on making the red test green.",
          },
          {
            action: "Run the test suite again to confirm the test now passes.",
            explanation: "Verify the implementation correctly addresses the test case.",
          },
        ],
      },
      {
        name: "Refactor (Optional but Recommended)",
        description: "Improve the structure, clarity, and efficiency of the code and/or test, while keeping tests passing.",
        agentActions: [
          {
            action: "Review the newly written code and test for potential improvements.",
            explanation: "Look for duplication, unclear names, overly complex logic, or inefficient patterns.",
          },
          {
            action: "Make refactoring changes to the code or test.",
            explanation: "Examples: Rename variables, extract functions/methods, simplify conditionals, improve test descriptions or setup.",
          },
          {
            action: "Run the test suite frequently during refactoring.",
            explanation: "Ensure that refactoring steps do not break existing functionality (tests remain green).",
          },
        ],
      },
      {
        name: "Repeat",
        description: "Continue the Red-Green-Refactor cycle for the next piece of functionality or requirement.",
        agentActions: [
          {
            action: "Identify the next logical step or requirement for the feature.",
            explanation: "Break down the feature into small, testable units.",
          },
          {
            action: "Return to the 'Write a Failing Test (Red)' step.",
            explanation: "Continue driving development with tests.",
          },
        ],
      },
    ],
  },
  examples: {
    description: "Scenarios illustrating the TDD workflow with Vitest.",
    useCases: [
      {
        scenario: "Implementing a `sum(a, b)` function.",
        implementation: "1. Red: Write `it('should return the sum of two numbers', () => { expect(sum(2, 3)).toBe(5); });` - fails (sum undefined). 2. Green: Create `function sum(a, b) { return a + b; }` - passes. 3. Refactor: Code is simple, maybe add types `sum(a: number, b: number): number` - still passes.",
        outcome: "A correctly implemented and tested `sum` function.",
      },
      {
        scenario: "Adding error handling for invalid input to `sum`.",
        implementation: "1. Red: Write `it('should throw an error if inputs are not numbers', () => { expect(() => sum('a', 3)).toThrow('Inputs must be numbers'); });` - fails. 2. Green: Add `if (typeof a !== 'number' || typeof b !== 'number') throw new Error(...)` to `sum` - passes. 3. Refactor: Ensure error message is clear - still passes.",
        outcome: "The `sum` function now handles invalid input, driven by tests.",
      },
    ],
  },
  codeExamples: [
    {
      language: "typescript",
      description: "Vitest test file structure",
      code: "import { describe, it, expect, beforeEach } from 'vitest';\nimport { FunctionOrClassToTest } from './source';\n\ndescribe('FunctionOrClassToTest', () => {\n  // Optional: Setup logic before each test in the block\n  beforeEach(() => {\n    // Reset state, clear mocks, etc.\n  });\n\n  it('should handle scenario A correctly', () => {\n    // Arrange\n    const input = '...';\n    const expectedOutput = '...';\n\n    // Act\n    const result = FunctionOrClassToTest(input);\n\n    // Assert\n    expect(result).toEqual(expectedOutput);\n  });\n\n  it('should handle scenario B (e.g., error case)', () => {\n    // Arrange\n    const invalidInput = '...';\n\n    // Act & Assert\n    expect(() => FunctionOrClassToTest(invalidInput)).toThrow('Specific error message');\n  });\n\n  // ... more it blocks for other scenarios\n});",
      explanation: "Shows the basic structure using Vitest's `describe`, `it`, `expect`. Includes an optional `beforeEach` for setup and demonstrates testing both success and error cases.",
    },
  ],
  commonPitfalls: [
    {
      name: "Writing Tests After Implementation",
      description: "Writing tests after the code is written misses the design benefits of TDD and often results in tests tightly coupled to the implementation.",
      solution: "Strictly adhere to the 'Test First' principle. Write the test before the implementation code.",
      preventativeMeasures: ["Team discipline and code reviews emphasizing the TDD workflow."],
    },
    {
      name: "Writing Overly Large Tests",
      description: "Creating tests that try to verify too much functionality at once, making them brittle and hard to debug when they fail.",
      solution: "Break down functionality into smaller, testable units. Each `it` block should focus on a single behavior.",
      preventativeMeasures: ["Review test scope during the 'Red' phase.", "Refactor large tests into smaller ones."],
    },
    {
      name: "Not Refactoring",
      description: "Skipping the Refactor step, leading to suboptimal code structure even if the tests pass.",
      solution: "Explicitly dedicate time to the Refactor step after getting a test to pass. Clean up code and tests.",
      preventativeMeasures: ["Make refactoring a standard part of the TDD loop in team practices."],
    },
    {
      name: "Testing Implementation Details",
      description: "Writing tests that assert internal state or mock private methods, making tests fragile and resistant to refactoring.",
      solution: "Focus tests on the public API and observable behavior of the unit under test. Avoid mocking internal implementation details.",
      preventativeMeasures: ["Follow Functional Test Principles.", "Review tests to ensure they test 'what' the code does, not 'how' it does it."],
    },
    {
      name: "Forgetting to Run Tests",
      description: "Making code changes without running the relevant tests, potentially introducing regressions.",
      solution: "Run tests frequently, especially after the Green and Refactor phases. Integrate tests into pre-commit hooks or CI pipelines.",
      preventativeMeasures: ["Automate test execution where possible.", "Develop the habit of running tests often during development."],
    }
  ],
  resources: [
    {
      type: "documentation",
      name: "Vitest Official Documentation",
      description: "Primary documentation for Vitest API, configuration, and features.",
      link: "https://vitest.dev/",
    },
     {
      type: "documentation",
      name: "Vitest API Reference",
      description: "Details on `describe`, `it`, `expect`, mocking, etc.",
      link: "https://vitest.dev/api/",
    },
    {
      type: "reference",
      name: "Test-Driven Development (Martin Fowler)",
      description: "Canonical article explaining TDD principles.",
      link: "https://martinfowler.com/bliki/TestDrivenDevelopment.html"
    }
  ],
  conclusion: "TDD, when practiced correctly with Vitest, leads to more robust, maintainable, and well-designed code. The Red-Green-Refactor cycle provides a structured approach to development, using tests to drive design and ensure correctness.",
}; 