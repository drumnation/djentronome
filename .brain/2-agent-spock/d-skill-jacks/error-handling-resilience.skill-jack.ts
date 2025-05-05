/**
 * Skill-Jack: Error Handling and Resilience
 * 
 * Provides guidance on implementing robust error handling and making systems resilient to failures.
 * 
 * @module brain-garden/skill-jack
 * @category patterns
 */

/**
 * Skill-Jack on Error Handling and Resilience
 * 
 * This constant provides comprehensive guidance on designing and implementing
 * robust error handling strategies to make the Djentronome application more resilient and user-friendly.
 */
export const errorHandlingResilienceGuide = {
  topic: "Error Handling and Resilience",
  description: "Covers strategies for anticipating, catching, handling, logging, and recovering from errors gracefully in both frontend and backend/core logic, minimizing user disruption.",
  corePrinciples: [
    {
      name: "Anticipate Failures",
      description: "Assume that errors *will* occur (network issues, invalid data, unexpected MIDI messages, file loading failures, API errors). Design code defensively.",
    },
    {
      name: "Catch Errors Appropriately",
      description: "Use `try...catch` blocks for synchronous code that might throw exceptions and `.catch()` for Promises handling asynchronous operations.",
      examples: ["Wrapping `JSON.parse()` in `try...catch`.", "Adding `.catch(error => ...)` to a `fetch` call."],
    },
    {
      name: "Fail Gracefully",
      description: "When an error occurs, aim to handle it in a way that minimizes disruption to the user. Provide informative feedback instead of crashing or showing cryptic messages.",
      examples: ["Showing a 'Failed to load song' message instead of a blank screen.", "Disabling a feature temporarily if its backend fails.", "Falling back to default settings if preferences fail to load."],
    },
    {
      name: "Meaningful Error Messages",
      description: "Provide error messages (both user-facing and logged) that are informative and help diagnose the problem.",
      examples: ["User message: 'Could not connect to MIDI device. Please ensure it is plugged in and try again.'", "Log message: 'Error fetching song data for ID [songId]: Network timeout.'"],
    },
    {
      name: "Logging for Debugging",
      description: "Implement structured logging (especially for backend or complex core logic) to record errors and relevant context, aiding debugging.",
      examples: ["Using a logging library (e.g., pino, winston) if needed.", "Logging error stack traces, relevant state variables, and user actions leading to the error."],
    },
    {
      name: "Error Boundaries (React)",
      description: "Use React Error Boundaries (class components with `componentDidCatch`) to catch rendering errors in parts of the UI tree and display a fallback UI instead of crashing the whole app.",
      examples: ["Wrapping major layout sections or specific widgets in Error Boundaries."],
    },
    {
      name: "Input Validation",
      description: "Validate user input and data from external sources (APIs, files) early to prevent errors deeper in the application logic.",
      examples: ["Using libraries like Zod for schema validation.", "Checking MIDI note numbers/types before processing."],
    },
  ],
  applicationProcess: {
    description: "Steps for an agent to implement robust error handling.",
    steps: [
      {
        name: "Identify Potential Failure Points",
        description: "Analyze code sections prone to errors.",
        agentActions: [
          {
            action: "Review areas involving I/O (network requests, file access, MIDI).",
            explanation: "These are common sources of external failures.",
          },
          {
            action: "Review data parsing/processing logic (JSON, audio decoding, MIDI messages).",
            explanation: "Invalid or unexpected data formats can cause errors.",
          },
          {
            action: "Review complex calculations or state transitions.",
            explanation: "Ensure edge cases and invalid states are handled.",
          },
          {
            action: "Review React component rendering logic, especially with external data.",
            explanation: "Identify where missing data or errors could break rendering.",
          },
        ],
      },
      {
        name: "Implement Catching Mechanisms",
        description: "Add `try...catch` for synchronous code, `.catch()` for Promises.",
        agentActions: [
          {
            action: "Wrap specific synchronous operations that might throw (e.g., `JSON.parse`) in `try...catch`.",
            explanation: "Handle the exception within the `catch` block.",
          },
          {
            action: "Chain `.catch(error => ...)` onto Promise-based operations (`fetch`, async functions).",
            explanation: "Handle asynchronous errors gracefully.",
          },
        ],
      },
      {
        name: "Implement Handling Logic",
        description: "Define what happens when an error is caught.",
        agentActions: [
          {
            action: "Log the error with context.",
            explanation: "Use `console.error(message, errorObject, context)` or a dedicated logger.",
          },
          {
            action: "Update application state to reflect the error (if applicable).",
            explanation: "E.g., set an `error` property in Zustand state: `set({ error: new Error('Failed to load') })`.",
          },
          {
            action: "Determine if the error is recoverable.",
            explanation: "Can the operation be retried? Can a default value be used?",
          },
          {
            action: "Provide user feedback (if UI-related).",
            explanation: "Display a user-friendly message via notifications, modals, or inline error states.",
          },
        ],
      },
      {
        name: "Implement React Error Boundaries (UI)",
        description: "Wrap UI sections to prevent component crashes from breaking the whole app.",
        agentActions: [
          {
            action: "Create a class component implementing `getDerivedStateFromError` and `componentDidCatch`.",
            explanation: "This defines the Error Boundary.",
          },
          {
            action: "In `getDerivedStateFromError`, return state to indicate an error occurred.",
            explanation: "Typically `{ hasError: true }`.",
          },
          {
            action: "In `componentDidCatch`, log the error information.",
            explanation: "`componentDidCatch(error, errorInfo) { logError(error, errorInfo); }`",
          },
          {
            action: "In the `render` method, conditionally render a fallback UI if `this.state.hasError` is true, otherwise render `this.props.children`.",
            explanation: "Show a safe UI instead of the crashed component tree.",
          },
          {
            action: "Wrap potentially problematic component sections in the application with the Error Boundary component.",
            explanation: "`<ErrorBoundary><ProblematicComponent /></ErrorBoundary>`",
          },
        ],
      },
      {
        name: "Add Input Validation",
        description: "Validate data at boundaries.",
        agentActions: [
          {
            action: "Use libraries like Zod to define schemas and validate data received from APIs or files.",
            explanation: "Ensures data structure is correct before processing.",
          },
          {
            action: "Add checks for expected ranges or types for critical inputs (e.g., MIDI note numbers).",
            explanation: "Prevent unexpected values from causing issues later.",
          },
        ],
      },
    ],
  },
  examples: {
    description: "Scenarios demonstrating error handling.",
    useCases: [
      {
        scenario: "Handling a failed API request to load song list.",
        implementation: "Wrap the `fetch` call in `try...catch` (if using async/await) or use `.catch()`. In the catch block, log the error and update UI state to show a 'Failed to load songs' message.",
        outcome: "User sees an informative message instead of an empty list or crash.",
      },
      {
        scenario: "A specific UI widget throws a rendering error due to unexpected data.",
        implementation: "Wrap the widget in a React Error Boundary. The boundary catches the error, logs it, and displays a fallback message like 'Widget failed to load'.",
        outcome: "The rest of the application remains functional, and the user sees a localized error indicator.",
      },
      {
        scenario: "Receiving an unexpected MIDI message type.",
        implementation: "In the MIDI message handler, add checks for expected message types/commands (e.g., Note On). If an unexpected message is received, log a warning and ignore it instead of throwing an error that might stop MIDI processing.",
        outcome: "The application remains stable despite unexpected input, and logs provide debugging information.",
      },
    ],
  },
  codeExamples: [
    {
      language: "typescript",
      description: "Handling Promise rejection with .catch()",
      code: `function loadData(url: string) {\n  fetch(url)\n    .then(response => {\n      if (!response.ok) {\n        throw new Error(\`HTTP error! status: \${response.status}\`);\n      }\n      return response.json();\n    })\n    .then(data => {\n      console.log("Data loaded:", data);\n      // Update state with data\n    })\n    .catch(error => {\n      console.error("Failed to load data:", error);\n      // Update state to show error message\n      // showUserErrorMessage("Could not load data. Please try again later.");\n    });\n}`,
      explanation: "Demonstrates using `.catch()` on a fetch promise chain to handle network errors or non-OK responses gracefully, log the error, and update UI state.",
    },
    {
      language: "typescript",
      description: "Basic React Error Boundary Component",
      code: `import React, { Component, ErrorInfo, ReactNode } from 'react';\n\ninterface Props {\n  children?: ReactNode;\n  fallback?: ReactNode;\n}\n\ninterface State {\n  hasError: boolean;\n}\n\nclass ErrorBoundary extends Component<Props, State> {\n  public state: State = {\n    hasError: false\n  };\n\n  public static getDerivedStateFromError(_: Error): State {\n    // Update state so the next render will show the fallback UI.\n    return { hasError: true };\n  }\n\n  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {\n    console.error("Uncaught error in component tree:", error, errorInfo);\n    // You can also log this to an error reporting service\n  }\n\n  public render() {\n    if (this.state.hasError) {\n      return this.props.fallback || <h1>Something went wrong.</h1>;\n    }\n\n    return this.props.children; \n  }\n}\n\nexport default ErrorBoundary;\n\n// Usage: <ErrorBoundary fallback={\"Oops!\"}><MyComponent /></ErrorBoundary>`,
      explanation: "A standard implementation of a React Error Boundary class component that catches JavaScript errors in its child component tree, logs them, and displays a fallback UI.",
    },
  ],
  commonPitfalls: [
    {
      name: "Swallowing Errors",
      description: "Catching errors (with `try...catch` or `.catch()`) but doing nothing with them (no logging, no user feedback, no state update). This hides bugs and makes debugging very difficult.",
      solution: "Always at least log the error when it's caught. Decide if user feedback or a state change is also necessary.",
      preventativeMeasures: ["Code reviews checking `catch` blocks.", "Use linters that might warn about empty catch blocks."],
    },
    {
      name: "Catching Too Broadly",
      description: "Using a single top-level `try...catch` or Error Boundary for the entire application, which might mask the origin of errors or prevent more localized recovery strategies.",
      solution: "Apply error catching mechanisms (try/catch, Promises, Error Boundaries) at appropriate levels where specific recovery or fallback logic makes sense.",
      preventativeMeasures: ["Place Error Boundaries around logical UI sections, not just the whole app.", "Use specific catch blocks for specific operations."],
    },
    {
      name: "Cryptic Error Messages",
      description: "Showing raw error objects or technical jargon directly to the user.",
      solution: "Catch technical errors, log the details, but present a simplified, user-friendly message indicating what went wrong and potentially what the user can do.",
      preventativeMeasures: ["Design user-facing error messages separately from logging."],
    },
    {
      name: "Not Handling Asynchronous Errors Correctly",
      description: "Forgetting to add `.catch()` to Promises or failing to handle errors within `async/await` try/catch blocks.",
      solution: "Ensure all Promise chains have a `.catch()` handler or are awaited within a `try...catch` block.",
      preventativeMeasures: ["Use linters that can detect unhandled promise rejections."],
    },
    {
      name: "Error Boundaries Don't Catch All Errors",
      description: "Expecting React Error Boundaries to catch errors in event handlers, async code, or server-side rendering. They primarily catch errors during rendering, in lifecycle methods, and constructors.",
      solution: "Use standard `try...catch` or Promise `.catch()` for errors in event handlers and asynchronous code.",
      preventativeMeasures: ["Understand the limitations of Error Boundaries from React documentation."],
    },
  ],
  resources: [
    {
      type: "documentation",
      name: "MDN: try...catch statement",
      description: "Reference for synchronous error handling.",
      link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch",
    },
    {
      type: "documentation",
      name: "MDN: Promise.prototype.catch()",
      description: "Reference for handling Promise rejections.",
      link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch",
    },
    {
      type: "documentation",
      name: "React Docs: Error Boundaries",
      description: "Official documentation for React Error Boundaries.",
      link: "https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary",
    },
  ],
  conclusion: "Robust error handling is crucial for application stability and user experience. By anticipating failures, catching errors appropriately, failing gracefully, providing clear feedback, logging effectively, and using tools like Error Boundaries and input validation, agents can build more resilient and debuggable applications.",
}; 