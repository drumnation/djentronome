# ▶️ Run Functional Tests

Automatically run the functional test suite and report results.

## Instructions:
- Detect the test runner (`vitest`, `mocha`, `playwright`, etc.)
- Run only affected or tagged tests when possible
- Report test results
- If any fail:
  - Diagnose whether it’s a regression or a legitimate test to update
  - Log test name, file path, and failure summary
- If all pass: log ✅ status
