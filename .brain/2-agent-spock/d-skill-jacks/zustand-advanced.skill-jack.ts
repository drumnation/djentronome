/**
 * Skill-Jack: Zustand Advanced Patterns
 * 
 * Provides guidance on advanced usage patterns for the Zustand state management library.
 * 
 * @module brain-garden/skill-jack
 * @category tools
 */

/**
 * Skill-Jack on Zustand Advanced Patterns
 * 
 * This constant provides comprehensive guidance on understanding and applying
 * advanced Zustand features like middleware, slice patterns, persistence, and performance optimization.
 */
export const zustandAdvancedGuide = {
  topic: "Zustand Advanced Patterns",
  description: "Covers techniques beyond basic store creation and usage, including middleware (devtools, persist), splitting state into slices, handling asynchronous actions, and optimizing selectors.",
  corePrinciples: [
    {
      name: "Simplicity and Boilerplate Reduction",
      description: "Zustand aims for minimal boilerplate compared to other state management libraries like Redux.",
    },
    {
      name: "Hook-Based Access",
      description: "State and actions are accessed within React components via a single generated hook.",
      examples: ["`const { bears, increasePopulation } = useBearStore();`"],
    },
    {
      name: "State Immutability (Convention)",
      description: "While Zustand doesn't enforce immutability itself, updates should be performed immutably (creating new state objects/arrays) to work correctly with React's rendering and prevent unexpected side effects.",
      examples: ["Using spread syntax: `set(state => ({ bears: state.bears + 1 }))`", "Using Immer middleware for easier immutable updates."],
    },
    {
      name: "Middleware for Extensibility",
      description: "Zustand supports middleware to add extra capabilities like developer tools integration, state persistence, logging, or handling immutable updates.",
      examples: ["`devtools(store)`", "`persist(store, { name: 'my-app-storage' })`", "`immer(store)`"],
    },
    {
      name: "Selectors for Performance",
      description: "Subscribing components only to specific parts of the state they need, using selector functions, prevents unnecessary re-renders when unrelated state changes.",
      examples: ["`const nuts = useBearStore(state => state.nuts);`", "Using `shallow` compare function for selecting multiple values: `const { nuts, honey } = useBearStore(state => ({ nuts: state.nuts, honey: state.honey }), shallow);`"],
    },
    {
      name: "Slice Pattern for Modularity",
      description: "For larger stores, state and actions can be organized into logical slices, which are combined into the main store. Each slice typically manages a specific domain of the state.",
      examples: ["Creating `createFishSlice`, `createBearSlice` functions.", "Combining slices: `create((...a) => ({ ...createBearSlice(...a), ...createFishSlice(...a) }))`"],
    },
  ],
  applicationProcess: {
    description: "Steps for an agent to apply advanced Zustand patterns.",
    steps: [
      {
        name: "Integrate Middleware",
        description: "Add middleware like devtools or persist to the store creator.",
        agentActions: [
          {
            action: "Import necessary middleware functions.",
            explanation: "`import { devtools, persist } from 'zustand/middleware';`",
          },
          {
            action: "Wrap the store definition function with the middleware.",
            explanation: "`create(devtools(persist((set) => ({ ... }), { name: 'storage-name' })))` Middleware composition order matters.",
          },
          {
            action: "Install Redux DevTools browser extension (for devtools middleware).",
            explanation: "Allows inspecting state changes and time-travel debugging.",
          },
        ],
      },
      {
        name: "Implement Slice Pattern",
        description: "Organize a large store into modular slices.",
        agentActions: [
          {
            action: "Define the state shape and actions for each slice in separate functions.",
            explanation: "E.g., `createBearSlice: StateCreator<BearSlice & FishSlice, [], [], BearSlice> = (set) => ({ bears: 0, increase: () => set(state => ({ bears: state.bears + 1 })) })`",
          },
          {
            action: "Combine slice creators within the main `create` call.",
            explanation: "`const useBoundStore = create<BearSlice & FishSlice>()(devtools((...a) => ({ ...createBearSlice(...a), ...createFishSlice(...a) }))))` Note the type parameter combining slice types.",
          },
        ],
      },
      {
        name: "Optimize Component Renders with Selectors",
        description: "Prevent unnecessary re-renders by selecting only the required state pieces.",
        agentActions: [
          {
            action: "Identify components that re-render when unrelated global state changes.",
            explanation: "Use React DevTools Profiler.",
          },
          {
            action: "Pass a selector function to the store hook.",
            explanation: "`const bearCount = useBoundStore(state => state.bears);` This component only re-renders if `bears` changes.",
          },
          {
            action: "Use `shallow` compare for selecting multiple values needed by a component.",
            explanation: "`const { bears, fishes } = useBoundStore(state => ({ bears: state.bears, fishes: state.fishes }), shallow);` Prevents re-renders if the object reference changes but values haven't.",
          },
        ],
      },
      {
        name: "Handle Asynchronous Actions",
        description: "Implement actions that perform async operations (e.g., API calls) and update the store.",
        agentActions: [
          {
            action: "Define an async action function within the store.",
            explanation: "`fetchData: async () => { set({ loading: true }); try { const res = await fetch(...); const data = await res.json(); set({ data, loading: false }); } catch (e) { set({ error: e, loading: false }); } }`",
          },
          {
            action: "Call the async action from the component.",
            explanation: "`const fetchData = useBoundStore(state => state.fetchData); useEffect(() => { fetchData(); }, [fetchData]);`",
          },
          {
            action: "Use status flags (loading, error) within the store state to reflect the async operation's progress.",
            explanation: "Components can select these flags to show loading indicators or error messages.",
          },
        ],
      },
    ],
  },
  examples: {
    description: "Scenarios showcasing advanced Zustand features.",
    useCases: [
      {
        scenario: "Adding Redux DevTools support to an existing store.",
        implementation: "Import `devtools` from `zustand/middleware`. Wrap the store creator function: `create(devtools((set) => ({ ... })))`.",
        outcome: "Store state changes become visible in the Redux DevTools extension.",
      },
      {
        scenario: "Persisting user preferences (e.g., theme) to localStorage.",
        implementation: "Import `persist`. Wrap the relevant part of the store (or the whole store) with `persist`: `create(persist((set) => ({ theme: 'dark', setTheme: (t) => set({ theme: t }) }), { name: 'user-prefs' }))`.",
        outcome: "The `theme` state is saved to localStorage and rehydrated on page load.",
      },
      {
        scenario: "Optimizing a component that only needs the `user.name` from a large store.",
        implementation: "Instead of `const user = useUserStore(state => state.user);`, use `const userName = useUserStore(state => state.user.name);`.",
        outcome: "The component only re-renders when `user.name` changes, not when other parts of the `user` object or store change.",
      },
      {
        scenario: "Structuring state for user data and game settings separately.",
        implementation: "Create `createUserSlice` and `createSettingsSlice`. Combine them in the main store: `create<UserSlice & SettingsSlice>()((...a) => ({ ...createUserSlice(...a), ...createSettingsSlice(...a) }))`.",
        outcome: "State logic is modularized, making the store easier to manage and understand.",
      },
    ],
  },
  codeExamples: [
    {
      language: "typescript",
      description: "Store with Devtools and Persist Middleware",
      code: `import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface AppState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(\n    persist(\n      (set) => ({
        theme: 'dark', // Default value
        toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      }),\n      { name: 'app-storage' } // LocalStorage key
    )\n  )\n);`,
      explanation: "Demonstrates composing `devtools` and `persist` middleware. The theme state will be persisted to localStorage under the key 'app-storage' and changes will be visible in Redux DevTools.",
    },
    {
      language: "typescript",
      description: "Slice Pattern Example",
      code: `import { create, StateCreator } from 'zustand';

interface BearSlice {
  bears: number;
  addBear: () => void;
}
interface FishSlice {
  fishes: number;
  addFish: () => void;
}

const createBearSlice: StateCreator<BearSlice & FishSlice, [], [], BearSlice> = (set) => ({
  bears: 0,
  addBear: () => set((state) => ({ bears: state.bears + 1 })),
});

const createFishSlice: StateCreator<BearSlice & FishSlice, [], [], FishSlice> = (set) => ({
  fishes: 0,
  addFish: () => set((state) => ({ fishes: state.fishes + 1 })),
});

export const useBoundStore = create<BearSlice & FishSlice>()((...a) => ({
  ...createBearSlice(...a),
  ...createFishSlice(...a),
}));

// Usage in component:
// const bears = useBoundStore(state => state.bears);
// const addFish = useBoundStore(state => state.addFish);`,
      explanation: "Shows how to define separate slice creators (`createBearSlice`, `createFishSlice`) with their own state and actions, and then combine them into a single store using `create<BearSlice & FishSlice>()(...)`.",
    },
  ],
  commonPitfalls: [
    {
      name: "Mutating State Directly",
      description: "Modifying state objects or arrays directly within `set` instead of returning new ones (when not using Immer middleware). This breaks React's change detection.",
      solution: "Always return new objects/arrays using spread syntax or array methods that return new arrays (`map`, `filter`, `concat`). Alternatively, use the `immer` middleware.",
      preventativeMeasures: ["Code reviews focusing on immutability.", "Enable strict mode in React.", "Use `immer` middleware for complex nested updates."],
    },
    {
      name: "Selector Performance Issues",
      description: "Selecting large objects or creating new object references within selectors without a shallow compare function, causing components to re-render unnecessarily.",
      solution: "Select only the primitive values needed. If selecting multiple values, use the `shallow` compare function from `zustand/shallow` as the second argument to the hook.",
      preventativeMeasures: ["Profile component renders.", "Be mindful of selector return values.", "Use `shallow` compare when selecting partial state objects."],
    },
    {
      name: "Incorrect Middleware Order",
      description: "Applying middleware in an order that causes issues (e.g., devtools not tracking changes correctly if applied after certain other middleware).",
      solution: "Generally, `devtools` should wrap other middleware like `persist`. Consult documentation for specific middleware interaction recommendations.",
      preventativeMeasures: ["Follow examples in Zustand documentation.", "Test middleware interactions."],
    },
    {
      name: "Forgetting Type Parameters with Slices",
      description: "When using the slice pattern, forgetting to provide the combined type (`create<SliceA & SliceB>()`) leads to TypeScript errors when accessing state or actions from different slices.",
      solution: "Ensure the combined type argument is passed to the main `create` function.",
      preventativeMeasures: ["Pay close attention to TypeScript errors during slice implementation."],
    },
  ],
  resources: [
    {
      type: "documentation",
      name: "Zustand Documentation (GitHub)",
      description: "Official documentation and primary source for Zustand.",
      link: "https://github.com/pmndrs/zustand",
    },
    {
      type: "documentation",
      name: "Zustand Middleware",
      description: "Section covering available middleware and usage.",
      link: "https://github.com/pmndrs/zustand#middleware",
    },
    {
      type: "documentation",
      name: "Zustand Selecting Multiple State Slices",
      description: "Guide explaining selectors and the `shallow` compare function.",
      link: "https://github.com/pmndrs/zustand#selecting-multiple-state-slices",
    },
    {
      type: "reference",
      name: "Zustand Slice Pattern Example",
      description: "Official example demonstrating the slice pattern.",
      link: "https://github.com/pmndrs/zustand#slices-pattern",
    },
  ],
  conclusion: "Zustand offers powerful features beyond basic state management. Leveraging middleware, the slice pattern, and optimized selectors allows for building scalable, maintainable, and performant global state solutions in React applications.",
}; 