/**
 * Skill-Jack: Storybook Interaction Testing
 * 
 * Provides guidance on writing interaction tests within Storybook using the `play` function and testing utilities.
 * 
 * @module brain-garden/skill-jack
 * @category testing
 */

/**
 * Skill-Jack on Storybook Interaction Testing
 * 
 * This constant provides comprehensive guidance on understanding and applying
 * Storybook's interaction testing features to simulate user behavior and assert component state within stories.
 */
export const storybookInteractionTestingGuide = {
  topic: "Storybook Interaction Testing",
  description: "Covers how to use the `play` function in Storybook stories to simulate user interactions (clicks, typing, etc.) using `@storybook/testing-library` and `@storybook/jest`, and assert the resulting component state or DOM changes.",
  corePrinciples: [
    {
      name: "Simulate User Behavior",
      description: "Interaction tests focus on simulating how a user interacts with a component rather than just rendering it in a specific state.",
      examples: ["Testing that clicking a button triggers a state change.", "Verifying form submission logic by filling inputs and clicking submit."],
    },
    {
      name: "The `play` Function",
      description: "The `play` function, exported alongside a story, contains the interaction logic. It receives the `canvasElement` as an argument, allowing interaction with the rendered story.",
      examples: ["`export const LoggedIn: Story = { play: async ({ canvasElement }) => { ... } };`"],
    },
    {
      name: "`@storybook/testing-library`",
      description: "Provides utilities (`within`, `userEvent`) based on Testing Library to query the DOM within the story canvas and simulate user events.",
      examples: ["`const canvas = within(canvasElement);`", "`await userEvent.click(canvas.getByRole('button'));`", "`await userEvent.type(canvas.getByLabelText('Username'), 'testuser');`"],
    },
    {
      name: "`@storybook/jest`",
      description: "Provides Jest's `expect` assertion library for making claims about the component's state or DOM after interactions.",
      examples: ["`await expect(canvas.getByText('Success')).toBeInTheDocument();`", "`await expect(args.onSubmit).toHaveBeenCalled();` (requires spy args)"],
    },
    {
      name: "Asynchronous Operations",
      description: "The `play` function is asynchronous (`async/await`) because user interactions and subsequent state updates often happen asynchronously.",
      examples: ["Using `await` before `userEvent` actions.", "Using `await expect(...)` for assertions."],
    },
    {
      name: "Integration with Storybook UI",
      description: "Interaction tests run directly in the browser within the Storybook UI, providing visual feedback and debugging capabilities (step-through, DOM inspection).",
    },
  ],
  applicationProcess: {
    description: "Steps for an agent to add interaction tests to a Storybook story.",
    steps: [
      {
        name: "Identify Interaction Scenario",
        description: "Determine the specific user interaction flow to test for a given story.",
        agentActions: [
          {
            action: "Choose a story representing a state where interaction is possible.",
            explanation: "E.g., a form story, a component with buttons, etc.",
          },
          {
            action: "Define the sequence of user actions (clicks, types).",
            explanation: "What steps would a user take?",
          },
          {
            action: "Define the expected outcome after the interactions.",
            explanation: "What should change in the DOM? What state should be updated? Should a prop function be called?",
          },
        ],
      },
      {
        name: "Add `play` Function to Story",
        description: "Define the async `play` function for the chosen story export.",
        agentActions: [
          {
            action: "Add `play: async ({ canvasElement, args }) => { ... }` to the story object.",
            explanation: "Args are available if needed to assert function calls passed as props.",
          },
        ],
      },
      {
        name: "Query Elements",
        description: "Use `@storybook/testing-library` to find DOM elements within the story's canvas.",
        agentActions: [
          {
            action: "Import `within`, `userEvent` from `@storybook/testing-library`.",
            explanation: "Get the necessary utilities.",
          },
          {
            action: "Get the canvas context: `const canvas = within(canvasElement);`",
            explanation: "Scope queries to the specific story rendering.",
          },
          {
            action: "Use Testing Library queries (`getByRole`, `getByLabelText`, `findByText`, etc.) to find elements.",
            explanation: "`const button = canvas.getByRole('button', { name: /Submit/i });`",
          },
        ],
      },
      {
        name: "Simulate User Events",
        description: "Use `userEvent` to trigger interactions.",
        agentActions: [
          {
            action: "Use `await userEvent.click(element)` for clicks.",
            explanation: "Simulates a user clicking the found element.",
          },
          {
            action: "Use `await userEvent.type(element, 'text')` for typing.",
            explanation: "Simulates typing into an input field.",
          },
          {
            action: "Use other `userEvent` methods (`hover`, `selectOptions`, etc.) as needed.",
            explanation: "Refer to Testing Library's `userEvent` documentation.",
          },
        ],
      },
      {
        name: "Assert Outcomes",
        description: "Use `@storybook/jest` (`expect`) to verify the results of the interactions.",
        agentActions: [
          {
            action: "Import `expect` from `@storybook/jest`.",
            explanation: "Get the assertion function.",
          },
          {
            action: "Assert DOM changes: `await expect(canvas.queryByText('Loading...')).not.toBeInTheDocument();`",
            explanation: "Check if elements appear, disappear, or change content.",
          },
          {
            action: "Assert function calls (if using spies): `await expect(args.onSubmit).toHaveBeenCalledTimes(1);`",
            explanation: "Requires passing mock functions (e.g., `jest.fn()` or `vi.fn()`) as action props (`args`) in the story.",
          },
        ],
      },
      {
        name: "Run and Debug",
        description: "Run Storybook and observe the interaction test execution.",
        agentActions: [
          {
            action: "Start Storybook (`pnpm storybook`).",
            explanation: "Navigate to the story with the `play` function.",
          },
          {
            action: "Observe the 'Interactions' panel in the Storybook UI.",
            explanation: "See the steps execute, step through them, and inspect errors.",
          },
          {
            action: "Use browser dev tools to inspect the DOM within the story iframe if needed.",
            explanation: "Helps debug query selectors.",
          },
        ],
      },
    ],
  },
  examples: {
    description: "Scenarios demonstrating interaction testing.",
    useCases: [
      {
        scenario: "Testing a login form submission.",
        implementation: "Create a story for the form. In the `play` function: query username/password inputs and submit button, use `userEvent.type` to fill inputs, use `userEvent.click` on the button. Assert that a success message appears or an `onSubmit` arg (mock function) was called.",
        outcome: "Verifies the login form's interaction logic within Storybook.",
      },
      {
        scenario: "Testing that clicking a toggle button changes its state and displayed text.",
        implementation: "Create a story for the button in its initial state. In `play`: query the button, `await userEvent.click(button)`. Assert that the button text changes (e.g., from 'Enable' to 'Disable') using `expect(canvas.getByRole(...)).toHaveTextContent(...)`.",
        outcome: "Confirms the button's state change logic works correctly.",
      },
    ],
  },
  codeExamples: [
    {
      language: "typescript",
      description: "Story with a basic interaction test",
      code: "import type { Meta, StoryObj } from '@storybook/react';\nimport { within, userEvent } from '@storybook/testing-library';\nimport { expect } from '@storybook/jest';\nimport { Button } from './Button'; // Assuming a simple Button component\n\nconst meta: Meta<typeof Button> = {\n  title: 'Example/ButtonInteraction',\n  component: Button,\n  args: {\n    onClick: () => console.log('Button Clicked'), // Real function or jest.fn() / vi.fn()\n    children: 'Click Me',\n  },\n};\n\nexport default meta;\ntype Story = StoryObj<typeof Button>;\n\nexport const BasicClick: Story = {\n  play: async ({ canvasElement, args }) => {\n    const canvas = within(canvasElement);\n\n    // Find the button by its text\n    const button = canvas.getByRole('button', { name: /Click Me/i });\n\n    // Simulate clicking the button\n    await userEvent.click(button);\n\n    // Example Assertion: Check if an onClick handler passed via args was called (requires a spy)\n    // Replace console.log with spy fn passed in args for this to work:\n    // await expect(args.onClick).toHaveBeenCalledTimes(1);\n\n    // Example Assertion: Check if button text changes (if it does)\n    // await expect(button).toHaveTextContent('Clicked!');\n  },\n};",
      explanation: "Demonstrates a story exporting a `play` function that finds a button using `within` and `getByRole`, simulates a click using `userEvent.click`, and includes commented-out examples of assertions using `expect`.",
    },
  ],
  commonPitfalls: [
    {
      name: "Forgetting `await`",
      description: "Not using `await` with `userEvent` actions or `expect` assertions can lead to tests finishing before interactions complete, causing flaky results or incorrect assertions.",
      solution: "Always use `await` with `userEvent` methods and often with `expect` assertions, especially those querying the DOM after an interaction.",
      preventativeMeasures: ["Make `async`/`await` standard practice within `play` functions.", "Linters might help catch unawaited promises."],
    },
    {
      name: "Incorrect / Brittle Selectors",
      description: "Using query selectors that are too specific (e.g., relying on CSS classes or complex XPath) or likely to change, making tests break easily on implementation changes.",
      solution: "Prefer user-facing attributes for querying: `getByRole`, `getByLabelText`, `getByPlaceholderText`, `getByText`. Use `data-testid` as a last resort.",
      preventativeMeasures: ["Follow Testing Library best practices for queries.", "Review selectors during code changes."],
    },
    {
      name: "Asserting Too Early",
      description: "Making assertions immediately after an interaction without waiting for potential asynchronous state updates or re-renders to complete.",
      solution: "Use `findBy*` queries (which wait for elements to appear) or wrap assertions in `waitFor` from `@testing-library/dom` if necessary, although often awaiting `userEvent` is sufficient.",
      preventativeMeasures: ["Understand the asynchronous nature of interactions and state updates.", "Use `findBy*` queries when expecting elements to appear asynchronously."],
    },
    {
      name: "Testing Implementation Details",
      description: "Asserting internal component state or specific DOM structure instead of the user-visible outcome.",
      solution: "Focus assertions on what the user would see or experience. Check for rendered text, element visibility, or called action props, not internal state variables.",
      preventativeMeasures: ["Review assertions to ensure they reflect user outcomes.", "Avoid inspecting component instances directly in tests."],
    }
  ],
  resources: [
    {
      type: "documentation",
      name: "Storybook Interaction Testing",
      description: "Official documentation for the `play` function and interaction testing.",
      link: "https://storybook.js.org/docs/writing-stories/play-function/",
    },
    {
      type: "documentation",
      name: "Storybook Testing Library",
      description: "Documentation for `@storybook/testing-library` utilities (`within`, `userEvent`).",
      link: "https://storybook.js.org/docs/writing-tests/test-runner#test-utilities-from-testing-library", // Link points to Test Runner but covers utilities
    },
    {
      type: "documentation",
      name: "Storybook Jest",
      description: "Documentation for `@storybook/jest` assertions (`expect`).",
      link: "https://storybook.js.org/docs/writing-tests/test-runner#assertions-with-jest", // Link points to Test Runner but covers assertions
    },
    {
      type: "documentation",
      name: "Testing Library - `user-event`",
      description: "Detailed documentation for simulating user events.",
      link: "https://testing-library.com/docs/user-event/intro",
    },
    {
      type: "documentation",
      name: "Testing Library - Queries",
      description: "Guide to choosing the right Testing Library queries.",
      link: "https://testing-library.com/docs/queries/about",
    },
  ],
  conclusion: "Storybook's interaction testing provides a powerful way to verify component behavior in response to user actions directly within the development environment. Using the `play` function with `@storybook/testing-library` and `@storybook/jest` enables robust testing of component logic and state changes.",
}; 