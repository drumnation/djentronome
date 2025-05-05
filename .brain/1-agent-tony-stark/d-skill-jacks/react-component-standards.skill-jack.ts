/**
 * Skill-Jack: React Component Standards
 * 
 * Provides guidance on structuring, styling, typing, and testing React components using Emotion styled-components within the Djentronome project.
 * 
 * @module brain-garden/skill-jack
 * @category patterns
 */

/**
 * Skill-Jack on React Component Standards
 * 
 * This constant provides comprehensive guidance on understanding and applying
 * standardized practices for building React components in the context of the Djentronome frontend.
 */
export const reactComponentStandardsGuide = {
  topic: "React Component Standards",
  description: "Defines the standard structure, styling approach (Emotion styled-components), typing conventions, state management patterns, and Storybook practices for React components in the Djentronome project.",
  corePrinciples: [
    {
      name: "Component Structure (Folder-per-Component)",
      description: "Each component resides in its own folder containing files for logic, styles, types, hooks, and stories to promote modularity and separation of concerns.",
      examples: ["ComponentName/{ComponentName.tsx, ComponentName.styles.ts, ComponentName.types.ts, ComponentName.stories.tsx, index.ts}"],
    },
    {
      name: "Styling with Emotion Styled Components",
      description: "Utilize Emotion's `styled` API for creating styled components. Avoid inline styles and global CSS pollution. Styles are co-located within the component folder in `.styles.ts`.",
      examples: ["`export const Wrapper = styled.div\`...\`;` in ComponentName.styles.ts", "Using theme variables within styled components."],
    },
    {
      name: "Strict TypeScript Typing",
      description: "All components must have explicit prop types defined in `.types.ts`. Avoid `any` and use specific types or generics where appropriate.",
      examples: ["Defining `interface ComponentNameProps { ... }`", "Exporting types via `index.ts`."],
    },
    {
      name: "Logic Separation (Hooks & Logic Files)",
      description: "Separate stateful logic into custom hooks (`.hook.ts`) and pure business logic into utility functions (`.logic.ts`) to keep the main component file focused on rendering.",
      examples: ["`useComponentNameState()` hook managing local state.", "Utility functions in `logic.ts` for data transformation."],
    },
    {
      name: "Storybook for Development and Testing",
      description: "Every component should have corresponding stories (`.stories.tsx`) to facilitate isolated development, visual testing, and documentation.",
      examples: ["Creating Default, Loading, and Error state stories.", "Using Storybook controls for interactive props."],
    },
    {
      name: "Functional Programming Preference",
      description: "Favor functional components and hooks over class components. Utilize FP principles like immutability and pure functions where applicable.",
    },
  ],
  applicationProcess: {
    description: "Steps for an agent to create a new React component following project standards.",
    steps: [
      {
        name: "Create Component Folder and Files",
        description: "Set up the standard directory structure and initial files for the new component.",
        agentActions: [
          {
            action: "Create folder `src/components/[ComponentName]` (or appropriate subfolder like atoms/molecules).",
            explanation: "Organize components based on Atomic Design principles or feature grouping.",
          },
          {
            action: "Create initial files: `[ComponentName].tsx`, `[ComponentName].styles.ts`, `[ComponentName].types.ts`, `[ComponentName].stories.tsx`, `index.ts`.",
            explanation: "Establish the standard file structure even if some files start empty.",
          },
        ],
      },
      {
        name: "Define Prop Types",
        description: "Define the component's interface in `.types.ts`.",
        agentActions: [
          {
            action: "Declare and export the `ComponentNameProps` interface.",
            explanation: "Clearly define all expected props and their types.",
          },
        ],
      },
      {
        name: "Implement Component Logic & Rendering",
        description: "Write the component's rendering logic in `.tsx` file, importing types.",
        agentActions: [
          {
            action: "Create the main functional component `ComponentName: React.FC<ComponentNameProps>`.",
            explanation: "Implement the JSX structure.",
          },
          {
            action: "Extract stateful logic to `useComponentName.hook.ts` if complex.",
            explanation: "Keeps the main component clean and focused on rendering.",
          },
           {
            action: "Extract pure utility functions to `ComponentName.logic.ts` if needed.",
            explanation: "Separates business logic from component rendering.",
          },
        ],
      },
      {
        name: "Implement Styling",
        description: "Define styled components in `.styles.ts` using Emotion.",
        agentActions: [
          {
            action: "Import `styled` from `@emotion/styled`.",
            explanation: "Use the primary styling method.",
          },
          {
            action: "Create and export styled components (e.g., `Wrapper`, `Title`, `Input`).",
            explanation: "Define styles using tagged template literals, leveraging theme variables.",
          },
          {
            action: "Import and use styled components within the main `.tsx` file.",
            explanation: "Apply styles by rendering the defined styled components.",
          },
        ],
      },
      {
        name: "Create Storybook Stories",
        description: "Develop stories in `.stories.tsx` to showcase component variations.",
        agentActions: [
          {
            action: "Import the component and define meta information (title, component).",
            explanation: "Set up the basic Storybook configuration.",
          },
          {
            action: "Create named exports for different stories (e.g., `Default`, `WithError`, `Loading`).",
            explanation: "Represent different states and prop combinations.",
          },
          {
            action: "Use `args` to pass props to stories.",
            explanation: "Control component props within Storybook.",
          },
        ],
      },
      {
        name: "Export via Barrel File",
        description: "Export the component and its types from `index.ts`.",
        agentActions: [
          {
            action: "Add `export * from './ComponentName';` and `export * from './ComponentName.types';` to `index.ts`.",
            explanation: "Simplifies importing the component elsewhere.",
          },
        ],
      },
    ],
  },
  examples: {
    description: "Scenarios demonstrating the application of these standards.",
    useCases: [
      {
        scenario: "Creating a reusable Button component.",
        implementation: "Follow folder structure. Define `ButtonProps` (variant, size, onClick). Create styled `StyledButton` in `.styles.ts`. Implement `Button.tsx`. Add stories for different variants/sizes in `Button.stories.tsx`. Export from `index.ts`.",
        outcome: "A well-structured, styled, typed, and documented Button component ready for use.",
      },
      {
        scenario: "Building a complex UserProfile card with state.",
        implementation: "Follow folder structure. Define `UserProfileProps`. Extract data fetching and state logic into `useUserProfile.hook.ts`. Define styles for card layout, avatar, text sections in `.styles.ts`. Render using data from the hook in `UserProfile.tsx`. Add stories for loading, error, and loaded states.",
        outcome: "A clean UserProfile component with separated concerns for state, style, and rendering.",
      },
    ],
  },
  codeExamples: [
    {
      language: "typescript",
      description: "Example ComponentName.styles.ts using Emotion",
      code: "import styled from '@emotion/styled';\n\nexport const Wrapper = styled.div`\n  padding: ${({ theme }) => theme.spacing.md};\n  background-color: ${({ theme }) => theme.colors.gray[0]};\n  border-radius: ${({ theme }) => theme.radius.sm};\n`;\n\nexport const Title = styled.h3`\n  color: ${({ theme }) => theme.colors.blue[6]};\n  margin-bottom: ${({ theme }) => theme.spacing.xs};\n`;",
      explanation: "Demonstrates creating styled components using Emotion's `styled` API and accessing theme variables (spacing, colors, radius) via the theme prop.",
    },
    {
      language: "typescript",
      description: "Example ComponentName.tsx structure",
      code: "import React from 'react';\nimport { ComponentNameProps } from './ComponentName.types';\nimport * as S from './ComponentName.styles';\n// import { useComponentName } from './ComponentName.hook'; // If stateful\n\nexport const ComponentName: React.FC<ComponentNameProps> = ({ title }) => {\n  // const { data, isLoading } = useComponentName(); // Example hook usage\n\n  return (\n    <S.Wrapper>\n      <S.Title>{title}</S.Title>\n      {/* ... other elements ... */}\n    </S.Wrapper>\n  );\n};",
      explanation: "Shows the basic structure of the main component file, importing props types, styled components aliased as 'S', potentially a custom hook, and rendering the structure using styled components.",
    },
     {
      language: "typescript",
      description: "Example index.ts barrel file",
      code: "export * from './ComponentName';\nexport * from './ComponentName.types';",
      explanation: "Exports the main component and its associated types for easier consumption by other modules.",
    }
  ],
  commonPitfalls: [
    {
      name: "Mixing Concerns in Component File",
      description: "Including complex state logic, data fetching, and styling directly within the `.tsx` file, making it hard to read and maintain.",
      solution: "Strictly adhere to separating concerns: state/fetching into hooks (`.hook.ts`), styles into styled components (`.styles.ts`), pure logic into utilities (`.logic.ts`).",
      preventativeMeasures: ["Code reviews focusing on separation of concerns.", "Establish clear boundaries for what belongs in each file type."],
    },
    {
      name: "Using Inline Styles or sx Prop Excessively",
      description: "Applying styles directly via the `style` prop or Mantine's `sx` prop instead of using styled-components or theme values.",
      solution: "Use Emotion styled components for all component-specific styling. Leverage theme values for consistency. Use `sx` only for minor, non-reusable overrides.",
      preventativeMeasures: ["Enforce styling standards during code reviews.", "Prioritize theme modifications and styled components."],
    },
    {
      name: "Inconsistent Naming Conventions",
      description: "Using different naming patterns for files, props interfaces, or styled components across the codebase.",
      solution: "Strictly follow the documented naming conventions: `ComponentName`, `ComponentNameProps`, `ComponentName.styles.ts`, etc.",
      preventativeMeasures: ["Use linters with naming convention rules if possible.", "Provide clear documentation and examples of naming standards."],
    },
    {
      name: "Missing Storybook Coverage",
      description: "Creating components without corresponding Storybook stories, hindering isolated development and visual testing.",
      solution: "Make Storybook story creation a mandatory part of the component development workflow.",
      preventativeMeasures: ["Include Storybook updates in pull request checklists.", "Automated checks or reminders for missing stories if feasible."],
    }
  ],
  improvementGuidelines: {
    description: "Guidelines for maintaining high-quality React components.",
    metrics: [
      {
        name: "Component Size (Lines of Code)",
        description: "Track the LoC for `.tsx` files to ensure they remain focused and don't become overly complex.",
        assessmentMethod: "Code analysis tools or manual review. Aim for < 300 lines, refactor if exceeding 500.",
      },
      {
        name: "Prop Interface Clarity",
        description: "Assess how well-defined and understandable the component's props are.",
        assessmentMethod: "Code review, checking for clear prop names, types, and documentation (JSDoc) within the `.types.ts` file.",
      },
      {
        name: "Test Coverage (Storybook Interactions)",
        description: "Ensure critical component states and interactions are covered by Storybook stories and potentially interaction tests.",
        assessmentMethod: "Review Storybook files for comprehensive state coverage. Use Storybook's test runner for interaction validation.",
      },
    ],
  },
  resources: [
    {
      type: "documentation",
      name: "React Official Docs",
      description: "Fundamental concepts of React.",
      link: "https://react.dev/",
    },
    {
      type: "documentation",
      name: "Emotion Styled Components",
      description: "Documentation for the `@emotion/styled` library.",
      link: "https://emotion.sh/docs/styled",
    },
    {
      type: "documentation",
      name: "Storybook Official Docs",
      description: "Guides for writing stories and configuring Storybook.",
      link: "https://storybook.js.org/docs/",
    },
    {
      type: "reference",
      name: "Atomic Design Principles",
      description: "Concept for organizing UI components (useful for structuring `src/components`).",
      link: "https://atomicdesign.bradfrost.com/",
    },
  ],
  conclusion: "Adhering to these React component standards ensures consistency, maintainability, and testability across the Djentronome frontend. Separating concerns and leveraging standardized structures allows for more efficient development and collaboration.",
}; 