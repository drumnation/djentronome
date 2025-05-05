# 🧪 Testing Prompt Index

A collection of prompts aligned with the **Functional Validation Testing Philosophy**:  
Tests must verify real, observable application behavior with minimal mocking. If the tests pass, the app works. If they fail, something meaningful is broken.

---

## 🔧 Prompt List

### 1. [`write-functional-tests.prompt.md`](./write-functional-tests.prompt.md)
**Use when:** You want to create high-signal, no-mock functional tests for a feature or bug fix.

**Behavior:**  
- Writes integration or usage-level tests  
- Avoids implementation details and mocks  
- Ensures each test validates real user behavior

---

### 2. [`run-functional-tests.prompt.md`](./run-functional-tests.prompt.md)
**Use when:** You want to manually trigger test execution.

**Behavior:**  
- Auto-detects the correct test runner (`vitest`, `mocha`, `playwright`, etc.)  
- Runs tests (scoped where possible)  
- Outputs pass/fail status and summarizes any failures

---

### 3. [`validate-after-task.prompt.md`](./validate-after-task.prompt.md)
**Use when:** A code task or feature subtask has just been completed.

**Behavior:**  
- Runs the relevant tests for the changed area  
- Treats test results as authoritative  
- Suggests new tests if none exist

---

### 4. [`investigate-test-failure.prompt.md`](./investigate-test-failure.prompt.md)
**Use when:** A test is failing and you need to understand why.

**Behavior:**  
- Diagnoses whether it's a regression or spec change  
- Prevents blind test updates or deletions  
- Guides thoughtful, traceable test evolution

---

### 5. [`design-test-strategy-for-feature.prompt.md`](./design-test-strategy-for-feature.prompt.md)
**Use when:** You’re creating a plan or task list for a new feature.

**Behavior:**  
- Creates a minimal, MECE-aligned test strategy  
- Recommends functional over unit tests  
- Anchors testing to usage, not internals

---

## 🧠 Best Practices

- Pair these prompts with `functional-test-principles.rules.mdc`
- Prefer fast, low-maintenance, real-world test coverage
- Avoid over-relying on coverage %, mocks, or brittle internal checks

