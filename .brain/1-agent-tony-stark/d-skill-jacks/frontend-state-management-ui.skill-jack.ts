/**
 * Skill-Jack: Frontend State Management (UI Specific)
 * 
 * Provides guidance on managing local UI state within React components, complementing global state management (like Zustand).
 * 
 * @module brain-garden/skill-jack
 * @category patterns
 */

/**
 * Skill-Jack on UI-Specific Frontend State Management
 * 
 * This constant provides comprehensive guidance on choosing and applying appropriate
 * patterns for managing local component state in React, distinct from global application state.
 */
export const frontendUiStateManagementGuide = {
  topic: "Frontend State Management (UI Specific)",
  description: "Covers strategies for handling state that is local to a component or a small group of related components, using React hooks like `useState`, `useReducer`, and custom hooks, while interfacing with global state managers when necessary.",
  corePrinciples: [
    {
      name: "Identify State Scope",
      description: "Determine if state is truly local to a component/feature or if it needs to be shared globally. Local state is simpler and often preferred if data isn't needed elsewhere.",
      examples: ["Dropdown open/close status (local).", "User authentication status (global).", "Form input values before submission (local)."],
    },
    {
      name: "`useState` for Simple State",
      description: "Use the `useState` hook for managing simple, independent state variables like booleans, strings, numbers, or small arrays/objects within a single component.",
      examples: ["`const [isOpen, setIsOpen] = useState(false);`", "`const [searchTerm, setSearchTerm] = useState('');`"],
    },
    {
      name: "`useReducer` for Complex State Logic",
      description: "Use the `useReducer` hook when state transitions are complex, involve multiple sub-values, or when the next state depends on the previous one in non-trivial ways. Often beneficial for state shared between a few closely related components.",
      examples: ["Managing state for a multi-step form.", "Handling complex drag-and-drop interactions.", "Implementing undo/redo functionality."],
    },
    {
      name: "Custom Hooks for Reusable State Logic",
      description: "Encapsulate related state variables and their update logic within custom hooks (`useMyFeatureState`) to promote reusability and separation of concerns.",
      examples: ["`useDisclosure` from Mantine (manages open/close state).", "A custom `useFormInput` hook managing value and validation.", "`useFetchData` hook handling loading, error, and data states."],
    },
    {
      name: "Lifting State Up",
      description: "When multiple child components need access to the same state, lift the state management (using `useState` or `useReducer`) to their closest common ancestor component and pass down state and update functions as props.",
      examples: ["Managing the state of a list of items in a parent component and passing item data and delete handlers down to child item components."],
    },
    {
      name: "Composition over Context (for Local State)",
      description: "Avoid using React Context for state that is only needed by a few nested components. Prop drilling through a few levels or component composition (passing components as props) is often simpler and more performant.",
      examples: ["Passing JSX as `children`.", "Using render props (less common now with hooks)."],
    },
  ],
  applicationProcess: {
    description: "Steps for an agent to decide and implement local UI state management.",
    steps: [
      {
        name: "Identify the State Need",
        description: "Determine what information needs to be stored and how it changes within the component or feature.",
        agentActions: [
          {
            action: "List the pieces of data that vary based on user interaction or other events.",
            explanation: "Examples: Is a modal open? What's the current value of the input? Is data loading?",
          },
          {
            action: "Determine the scope: Is this state needed *only* within this component or its direct children?",
            explanation: "If needed globally, consider the global state manager (Zustand). If needed locally, proceed with local state patterns.",
          },
        ],
      },
      {
        name: "Choose the Right Hook (`useState` vs `useReducer`)",
        description: "Select the appropriate React hook based on state complexity.",
        agentActions: [
          {
            action: "Default to `useState` for simple, independent values.",
            explanation: "Use for toggles, input values, simple counters etc.",
          },
          {
            action: "Consider `useReducer` if state logic is complex, involves related variables, or benefits from dispatch actions.",
            explanation: "Better for managing state transitions like `LOADING -> SUCCESS | ERROR`, or complex form states.",
          },
          {
            action: "Evaluate if logic is reusable across components.",
            explanation: "If yes, plan to encapsulate it in a custom hook.",
          },
        ],
      },
      {
        name: "Implement State Initialization",
        description: "Initialize the state using the chosen hook.",
        agentActions: [
          {
            action: "Call `useState(initialValue)` or `useReducer(reducerFn, initialArg, initFn?)`.",
            explanation: "Provide the correct initial state value(s).",
          },
        ],
      },
      {
        name: "Implement State Updates",
        description: "Create event handlers or effects that update the state.",
        agentActions: [
          {
            action: "Call the setter function from `useState` (e.g., `setIsOpen(true)`).",
            explanation: "Trigger state updates in response to events (clicks, input changes).",
          },
          {
            action: "Call the `dispatch` function from `useReducer` with an action object (e.g., `dispatch({ type: 'FETCH_SUCCESS', payload: data })`).",
            explanation: "Trigger state updates via defined reducer actions.",
          },
          {
            action: "Ensure update logic is correct and handles edge cases.",
            explanation: "Verify state transitions behave as expected.",
          },
        ],
      },
      {
        name: "Encapsulate in Custom Hook (if applicable)",
        description: "Move reusable state logic into a custom hook.",
        agentActions: [
          {
            action: "Create a new file `useMyFeatureState.hook.ts`.",
            explanation: "Co-locate the hook with the feature/component if specific, or place in a shared hooks directory if generic.",
          },
          {
            action: "Move `useState`/`useReducer` calls and related update logic into the custom hook function.",
            explanation: "The hook manages the internal state.",
          },
          {
            action: "Return necessary state values and update functions from the custom hook.",
            explanation: "Expose the required interface for components using the hook.",
          },
          {
            action: "Use the custom hook in the component(s).",
            explanation: "`const { value, updateValue } = useMyFeatureState();`",
          },
        ],
      },
      {
        name: "Lift State Up (if necessary)",
        description: "Move state management to a common ancestor if multiple siblings need access.",
        agentActions: [
          {
            action: "Identify the lowest common parent component.",
            explanation: "Find the component that contains all children needing the state.",
          },
          {
            action: "Move the `useState`/`useReducer` call to the parent component.",
            explanation: "The parent now owns the state.",
          },
          {
            action: "Pass state values down to children as props.",
            explanation: "Children receive the data they need to render.",
          },
          {
            action: "Pass update functions (or dispatch) down to children as props.",
            explanation: "Allows children to trigger state changes in the parent.",
          },
        ],
      },
    ],
  },
  examples: {
    description: "Scenarios illustrating different local state management approaches.",
    useCases: [
      {
        scenario: "Managing the visibility of a tooltip on hover.",
        implementation: "Use `useState(false)` within the component that triggers the tooltip. Use `onMouseEnter` and `onMouseLeave` events to call the setter function.",
        outcome: "Tooltip visibility is controlled locally and simply using `useState`.",
      },
      {
        scenario: "Handling the state of a fetch request (idle, loading, success, error) within a data display component.",
        implementation: "Use `useReducer` with actions like `FETCH_START`, `FETCH_SUCCESS`, `FETCH_FAILURE` to manage status and data/error state. Encapsulate this in a `useFetchData` custom hook.",
        outcome: "Complex state transitions are managed cleanly using `useReducer` encapsulated in a reusable hook.",
      },
      {
        scenario: "A list component where each item can be individually selected, but the parent needs the list of selected IDs.",
        implementation: "Lift state up. The parent component holds the array of selected IDs using `useState([])`. It passes the array and an `onSelectItem(id)` function down to each child. Each child calls `onSelectItem(itemId)` when clicked.",
        outcome: "Shared state is managed by the common ancestor, avoiding unnecessary complexity in children.",
      },
    ],
  },
  codeExamples: [
    {
      language: "typescript",
      description: "Using useReducer for Fetch State",
      code: `type State = { status: 'idle' | 'loading' | 'success' | 'error'; data: any | null; error: Error | null; };\ntype Action = \n  | { type: 'FETCH_START' }\n  | { type: 'FETCH_SUCCESS'; payload: any }\n  | { type: 'FETCH_FAILURE'; payload: Error };\n\nconst initialState: State = { status: 'idle', data: null, error: null };\n\nfunction reducer(state: State, action: Action): State {\n  switch (action.type) {\n    case 'FETCH_START': return { ...initialState, status: 'loading' };\n    case 'FETCH_SUCCESS': return { ...state, status: 'success', data: action.payload, error: null };\n    case 'FETCH_FAILURE': return { ...state, status: 'error', error: action.payload };\n    default: throw new Error('Unknown action');\n  }\n}\n\nfunction MyDataComponent() {\n  const [state, dispatch] = useReducer(reducer, initialState);\n\n  useEffect(() => {\n    dispatch({ type: 'FETCH_START' });\n    fetchData()\n      .then(data => dispatch({ type: 'FETCH_SUCCESS', payload: data }))\n      .catch(error => dispatch({ type: 'FETCH_FAILURE', payload: error }));\n  }, []);\n\n  // Render based on state.status\n  // ...\n}`,
      explanation: "Demonstrates using `useReducer` to manage the distinct states (idle, loading, success, error) of an asynchronous data fetching operation.",
    },
    {
      language: "typescript",
      description: "Custom Hook for Toggle State",
      code: `import { useState, useCallback } from 'react';\n\nfunction useToggle(initialState = false): [boolean, () => void] {\n  const [state, setState] = useState(initialState);\n  const toggle = useCallback(() => setState(s => !s), []);\n  return [state, toggle];\n}\n\n// Usage in a component:\nfunction ToggleComponent() {\n  const [isOpen, toggleOpen] = useToggle();\n\n  return (\n    <div>\n      <button onClick={toggleOpen}>{isOpen ? 'Close' : 'Open'}</button>\n      {isOpen && <div>Content</div>}\n    </div>\n  );\n}`,
      explanation: "A simple custom hook `useToggle` encapsulates the boolean state and the toggle function, making it reusable across different components.",
    },
  ],
  commonPitfalls: [
    {
      name: "Overusing Global State",
      description: "Putting state into the global store (like Zustand) when it's only used by one component or a small, localized feature area. This adds unnecessary complexity and potential performance overhead.",
      solution: "Critically evaluate if state *truly* needs to be global. Prefer local state (`useState`, `useReducer`, custom hooks) whenever possible.",
      preventativeMeasures: ["Code reviews focusing on state scope.", "Question the need for global state before adding it."],
    },
    {
      name: "Prop Drilling Excessive State",
      description: "Passing local state down through many intermediate components that don't use the state themselves, just to reach a deeply nested child.",
      solution: "Consider component composition (passing components as props) or, if the state is genuinely shared across distant branches, evaluate if it should become global state or use React Context (sparingly). Lift state only to the *closest* common ancestor.",
      preventativeMeasures: ["Analyze component hierarchy before lifting state.", "Explore composition patterns."],
    },
    {
      name: "Complex Logic inside `useState` Setters",
      description: "Placing complex state transition logic directly inside `setState(prevState => ...)` functions instead of using `useReducer`.",
      solution: "If the logic for deriving the next state is complex or depends non-trivially on the previous state, refactor to use `useReducer` for better clarity and separation of concerns.",
      preventativeMeasures: ["Recognize complex state updates as a signal to consider `useReducer`."],
    },
    {
      name: "Not Encapsulating Reusable Logic",
      description: "Repeating the same `useState` or `useReducer` logic across multiple components instead of extracting it into a custom hook.",
      solution: "Identify recurring state patterns and encapsulate them in custom hooks for better reusability and maintainability.",
      preventativeMeasures: ["Look for opportunities to create custom hooks during development and refactoring."],
    },
  ],
  resources: [
    {
      type: "documentation",
      name: "React Docs - State Hooks",
      description: "Official documentation for `useState` and `useReducer`.",
      link: "https://react.dev/reference/react/hooks#state-hooks",
    },
    {
      type: "documentation",
      name: "React Docs - Lifting State Up",
      description: "Official guide on the lifting state up pattern.",
      link: "https://react.dev/learn/sharing-state-between-components",
    },
    {
      type: "documentation",
      name: "React Docs - Building Your Own Hooks",
      description: "Official guide on creating custom hooks.",
      link: "https://react.dev/learn/reusing-logic-with-custom-hooks",
    },
    {
      type: "reference",
      name: "Zustand Docs (for Global State Comparison)",
      description: "Documentation for the global state manager used in the project, useful for contrasting with local state.",
      link: "https://github.com/pmndrs/zustand",
    },
  ],
  conclusion: "Effectively managing local UI state is crucial for building maintainable and performant React applications. Choose the right tool (`useState`, `useReducer`, custom hooks) based on complexity, lift state judiciously, and distinguish clearly between local and global state concerns.",
}; 