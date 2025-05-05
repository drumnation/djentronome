# Generate Storybook Snapshot Tests

**Purpose:**  
Create snapshot or visual regression tests for all stories in a given component. Useful for visual diffing and catching UI regressions.

**Input Required:**  
- Component name or path
- `.stories.tsx` file content (optional)

**Behavior:**  
- Identify each story
- Add a snapshot test (via Storybook Test Runner, Chromatic, or Playwright)
- Output test file with snapshot logic
