/**
 * Skill-Jack: Mantine UI Advanced Patterns
 * 
 * Provides advanced guidance for leveraging Mantine UI features beyond basic setup and component usage.
 * 
 * @module brain-garden/skill-jack
 * @category tools
 */

/**
 * Skill-Jack on Mantine UI Advanced Patterns
 * 
 * This constant provides comprehensive guidance on understanding and applying
 * advanced Mantine UI features like custom theme extensions, complex layouts (AppShell), responsive strategies, and performance optimization.
 */
export const mantineUiAdvancedGuide = {
  topic: "Mantine UI Advanced Patterns",
  description: "Explores advanced techniques for theme customization, building complex application layouts with AppShell, implementing sophisticated responsive designs, and optimizing Mantine component performance.",
  corePrinciples: [
    {
      name: "Deep Theme Customization",
      description: "Go beyond basic color/font changes. Customize component default props, variants, sizes, classNames, and styles theme-wide using the `theme.components` object.",
      examples: ["Setting default `variant='light'` for all Buttons.", "Adding custom sizes to the `Badge` component.", "Overriding internal component classNames for specific adjustments."],
    },
    {
      name: "AppShell for Layout Structure",
      description: "Utilize the `AppShell` component for standard application layouts including headers, footers, navbars (sidebars), and asides. It handles responsive collapsing and fixed positioning.",
      examples: ["Creating a dashboard layout with a fixed sidebar and header.", "Implementing responsive behavior where the navbar collapses into a burger menu on smaller screens."],
    },
    {
      name: "Advanced Responsive Design",
      description: "Leverage Mantine's breakpoint system (`theme.breakpoints`), responsive style props (`p`, `m`, `fontSize` with object syntax), and hooks like `useMediaQuery` for complex responsive UIs.",
      examples: ["`fontSize={{ base: 'sm', md: 'lg' }}`", "Conditionally rendering components based on `useMediaQuery('(min-width: 768px)')`.", "Using `<Grid>` and `<Grid.Col span={{ base: 12, sm: 6, md: 4 }}>` for responsive column layouts."],
    },
    {
      name: "Performance Optimization",
      description: "Optimize rendering performance by understanding Mantine component composition, leveraging memoization (React.memo), virtualizing lists (if needed), and being mindful of expensive style recalculations.",
      examples: ["Wrapping complex/pure components passed as props in `React.memo`.", "Using libraries like `react-window` or `react-virtual` for very long lists displayed within Mantine components.", "Analyzing component render times using React DevTools profiler."],
    },
    {
      name: "Custom Component Variants/Styles",
      description: "Define custom variants or apply ad-hoc complex styles using `theme.components` overrides, `createStyles` (older API, less common now), or Emotion's `css` prop for dynamic styles.",
      examples: ["Adding a `danger` variant to the `Button` component via theme.", "Using the `css` prop with Emotion for highly dynamic styles based on props."],
    },
  ],
  applicationProcess: {
    description: "Steps for an agent to implement advanced Mantine patterns.",
    steps: [
      {
        name: "Customize Component Theme",
        description: "Modify the default appearance or behavior of a specific Mantine component globally.",
        agentActions: [
          {
            action: "Locate the `theme.components` section in the `MantineProvider` theme configuration.",
            explanation: "Ensure the theme object is properly structured.",
          },
          {
            action: "Add an entry for the target component (e.g., `Button`, `TextInput`).",
            explanation: "Use the component's name as the key.",
          },
          {
            action: "Define `defaultProps`, `styles`, `classNames`, or `vars` within the component's theme object.",
            explanation: "Refer to Mantine documentation for the specific component's theming API to understand available overrides (e.g., `styles` takes a function receiving theme, props, context).",
          },
          {
            action: "Verify changes are applied globally to the component.",
            explanation: "Check instances of the component throughout the application or in Storybook.",
          },
        ],
      },
      {
        name: "Implement AppShell Layout",
        description: "Structure the main application layout using AppShell.",
        agentActions: [
          {
            action: "Import `AppShell` and its subcomponents (`Header`, `Navbar`, `Footer`, `Aside`).",
            explanation: "Get the necessary building blocks.",
          },
          {
            action: "Wrap the main application content within the `<AppShell>` tags.",
            explanation: "`AppShell` becomes a top-level layout container.",
          },
          {
            action: "Configure `AppShell` props for header height, navbar width, padding, fixed positioning, and breakpoints.",
            explanation: "Define the overall layout behavior and dimensions.",
          },
          {
            action: "Place content within the respective `AppShell.Header`, `AppShell.Navbar`, `AppShell.Main`, etc.",
            explanation: "Populate the defined layout sections.",
          },
          {
            action: "Implement state management for navbar visibility (e.g., using `useDisclosure`).",
            explanation: "Control the opening/closing of the navbar, especially on mobile, often using a Burger component in the Header.",
          },
        ],
      },
      {
        name: "Apply Responsive Styles",
        description: "Make UI elements adapt to different screen sizes.",
        agentActions: [
          {
            action: "Use object syntax for style props like `p`, `m`, `fontSize`, `w`, `h`.",
            explanation: "Example: `<Text fz={{ base: 14, sm: 16, lg: 18 }}>Responsive Text</Text>`",
          },
          {
            action: "Utilize responsive props on layout components like `Group`, `Stack`, `Grid.Col`.",
            explanation: "Example: `<Grid.Col span={{ base: 12, md: 6 }}>Half width on medium screens</Grid.Col>`",
          },
          {
            action: "Use the `useMediaQuery` hook for conditional rendering or logic based on screen size.",
            explanation: "`const isMobile = useMediaQuery('(max-width: ${theme.breakpoints.sm})');`",
          },
          {
            action: "Test responsiveness thoroughly using browser developer tools or Storybook viewports.",
            explanation: "Verify layout and styles adapt correctly at different breakpoints.",
          },
        ],
      },
    ],
  },
  examples: {
    description: "Scenarios applying advanced Mantine techniques.",
    useCases: [
      {
        scenario: "Creating a fixed sidebar navigation that collapses on mobile.",
        implementation: "Use `AppShell` with an `AppShell.Navbar`. Configure navbar `width` and `breakpoint` props. Use `useDisclosure` and a `Burger` component in the `AppShell.Header` to toggle visibility on mobile.",
        outcome: "A standard application layout with responsive navigation.",
      },
      {
        scenario: "Making all Buttons in the application use the 'outline' variant by default.",
        implementation: "In the `MantineProvider` theme: `theme.components.Button = { defaultProps: { variant: 'outline' } };`",
        outcome: "All `<Button>` instances without an explicit `variant` prop will now render as outline buttons.",
      },
      {
        scenario: "Displaying a complex data grid that adjusts columns based on screen size.",
        implementation: "Use the `<Grid>` component. Define `<Grid.Col>` components for each column, using the `span` prop with object syntax to specify column spans for different breakpoints (e.g., `span={{ base: 12, sm: 6, md: 4, lg: 3 }}`).",
        outcome: "A responsive grid layout that reflows content effectively on various devices.",
      },
    ],
  },
  codeExamples: [
    {
      language: "typescript",
      description: "Customizing Button default props in theme",
      code: "import { MantineProvider, createTheme, Button } from '@mantine/core';\n\nconst theme = createTheme({\n  components: {\n    Button: Button.extend({\n      defaultProps: {\n        color: 'cyan',\n        radius: 'xl',\n      },\n    }),\n  },\n});\n\nfunction App() {\n  return (\n    <MantineProvider theme={theme}>\n      {/* All Buttons will now be cyan with xl radius by default */}\n      <Button>Default Cyan XL</Button>\n      <Button color=\"red\" radius=\"sm\">Explicit Override</Button>\n    </MantineProvider>\n  );\n}",
      explanation: "Demonstrates using `Button.extend` within `createTheme` to set `defaultProps` for all Button components application-wide.",
    },
    {
      language: "typescript",
      description: "Basic AppShell structure",
      code: "import { AppShell, Burger, Group, Text } from '@mantine/core';\nimport { useDisclosure } from '@mantine/hooks';\n\nfunction AppLayout({ children }) {\n  const [opened, { toggle }] = useDisclosure();\n\n  return (\n    <AppShell\n      header={{ height: 60 }}\n      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}\n      padding=\"md\"\n    >\n      <AppShell.Header>\n        <Group h=\"100%\" px=\"md\">\n          <Burger opened={opened} onClick={toggle} hiddenFrom=\"sm\" size=\"sm\" />\n          <Text>Djentronome</Text>\n        </Group>\n      </AppShell.Header>\n      <AppShell.Navbar p=\"md\">\n        Navigation Links\n      </AppShell.Navbar>\n      <AppShell.Main>{children}</AppShell.Main>\n    </AppShell>\n  );\n}",
      explanation: "Shows a basic implementation of AppShell with a header containing a responsive Burger menu and a collapsible navbar.",
    },
  ],
  commonPitfalls: [
    {
      name: "Overly Complex Theme Overrides",
      description: "Creating excessively complex or deeply nested style overrides in `theme.components` that become difficult to understand and maintain.",
      solution: "Keep theme overrides focused and clear. For highly complex component-specific styling, consider creating a dedicated wrapper component using Emotion `styled` instead of deep theme overrides.",
      preventativeMeasures: ["Favor simpler `defaultProps` or direct style overrides where possible.", "Document complex theme overrides thoroughly."],
    },
    {
      name: "Incorrect AppShell Breakpoints",
      description: "Setting `AppShell` navbar/aside breakpoints that don't align well with the application's content or overall responsive design, leading to awkward layouts.",
      solution: "Test `AppShell` behavior at various screen widths. Adjust the `breakpoint` prop based on where the layout naturally needs to change (e.g., when the navbar content feels too cramped).",
      preventativeMeasures: ["Use standard Mantine breakpoints (`xs`, `sm`, `md`, `lg`, `xl`) consistently.", "Test on real devices or simulators."],
    },
    {
      name: "Ignoring Performance Implications",
      description: "Building complex UIs with deeply nested Mantine components or frequent state updates without considering potential rendering performance bottlenecks.",
      solution: "Profile the application using React DevTools. Apply memoization (`React.memo`) to expensive components. Virtualize long lists if necessary. Simplify component structure where possible.",
      preventativeMeasures: ["Be mindful of component render frequency.", "Profile periodically, especially for complex screens."],
    },
  ],
  resources: [
    {
      type: "documentation",
      name: "Mantine Theming - Components Styles",
      description: "Guide on customizing component styles and props via the theme.",
      link: "https://mantine.dev/theming/theme-object/#components",
    },
    {
      type: "documentation",
      name: "Mantine AppShell Component",
      description: "Documentation for the AppShell layout component.",
      link: "https://mantine.dev/core/app-shell/",
    },
    {
      type: "documentation",
      name: "Mantine Responsive Styles",
      description: "Guide on creating responsive layouts and styles.",
      link: "https://mantine.dev/styles/responsive/",
    },
    {
      type: "documentation",
      name: "Mantine useMediaQuery Hook",
      description: "Hook for reacting to media queries.",
      link: "https://mantine.dev/hooks/use-media-query/",
    }
  ],
  conclusion: "Mastering advanced Mantine patterns like theme customization via `theme.components`, utilizing `AppShell` for robust layouts, and implementing effective responsive design strategies allows for the creation of sophisticated, consistent, and performant user interfaces.",
}; 