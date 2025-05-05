/**
 * Skill-Jack: CLI Helper Execa
 * 
 * A guide to using execa for CLI testing.
 * 
 * @module brain-garden/skill-jack
 * @category testing/tools
 */

/**
 * Skill-Jack on CLI Helper Execa
 * 
 * This constant provides comprehensive guidance on understanding and applying
 * the execa library for testing command-line applications.
 */
export const topicGuide = {
  topic: "CLI Testing with Execa",
  description: "A comprehensive approach to testing command-line interfaces (CLIs) and applications using the execa library, enabling thorough verification of CLI behavior, output, and error handling.",
  corePrinciples: [
    {
      name: "Process Execution Isolation",
      description: "CLI tests should execute commands in isolated processes to prevent interference with the test runner or other tests.",
      examples: [
        "Running commands in separate child processes",
        "Isolating environment variables for each test case",
        "Ensuring process cleanup after test completion"
      ]
    },
    {
      name: "Input/Output Verification",
      description: "Tests should verify both the input handling and output generation of CLIs, including stdout, stderr, and exit codes.",
      examples: [
        "Verifying command output text matches expected format",
        "Checking error messages on invalid input",
        "Confirming exit codes reflect success or failure appropriately"
      ]
    },
    {
      name: "Environment Control",
      description: "Tests should have complete control over the environment in which CLI commands execute, including working directory, environment variables, and file system.",
      examples: [
        "Setting specific environment variables for testing",
        "Changing working directory for command execution",
        "Creating temporary directories for file operations"
      ]
    },
    {
      name: "Command Argument Verification",
      description: "Tests should verify that CLI commands correctly handle various arguments, options, and input formats.",
      examples: [
        "Testing with valid command arguments in different combinations",
        "Verifying handling of invalid or missing arguments",
        "Testing complex option combinations and conflicts"
      ]
    },
    {
      name: "Interactive CLI Testing",
      description: "For interactive CLIs, tests should be able to simulate user input and verify the resulting behavior and output.",
      examples: [
        "Sending input to stdin to simulate user typing",
        "Testing prompt responses with different values",
        "Verifying CLI behavior in interactive mode"
      ]
    },
    {
      name: "Reproducible Test Conditions",
      description: "CLI tests should create reproducible conditions for each test run, avoiding dependencies on external state or configuration.",
      examples: [
        "Resetting configuration files before tests",
        "Using mock servers for external service dependencies",
        "Isolating file system operations to test-specific directories"
      ]
    }
  ],
  applicationProcess: {
    description: "A systematic approach to implementing effective CLI tests using execa.",
    steps: [
      {
        name: "Set Up Test Environment",
        description: "Prepare the test environment for CLI testing, including required dependencies and test structure.",
        agentActions: [
          {
            action: "Install execa and related testing utilities",
            explanation: "Add execa and any additional libraries needed for CLI testing to the project dependencies."
          },
          {
            action: "Create helpers for temporary directories",
            explanation: "Implement utilities to create and clean up temporary directories for file-based CLI operations."
          },
          {
            action: "Set up test fixtures and configuration",
            explanation: "Prepare any files, data, or configuration needed for CLI tests."
          }
        ]
      },
      {
        name: "Implement Basic Command Execution",
        description: "Create utilities to execute CLI commands and capture their output.",
        agentActions: [
          {
            action: "Create command execution wrapper",
            explanation: "Implement a function that uses execa to run commands and handle errors consistently."
          },
          {
            action: "Set up output capturing",
            explanation: "Configure execa to capture stdout, stderr, and exit codes for verification."
          },
          {
            action: "Implement timeout handling",
            explanation: "Set appropriate timeouts to prevent tests from hanging if commands don't complete."
          }
        ]
      },
      {
        name: "Handle Command Arguments and Options",
        description: "Develop utilities to work with various command arguments, options, and input formats.",
        agentActions: [
          {
            action: "Create helpers for argument formatting",
            explanation: "Implement functions to properly format and escape command arguments."
          },
          {
            action: "Set up option handling",
            explanation: "Create utilities to work with both short and long option formats."
          },
          {
            action: "Implement environment variable control",
            explanation: "Develop functions to set or override environment variables for commands."
          }
        ]
      },
      {
        name: "Implement Interactive Testing",
        description: "Set up capabilities for testing interactive CLI applications that require user input.",
        agentActions: [
          {
            action: "Create stdin input simulation",
            explanation: "Implement utilities to send input to the stdin of CLI processes."
          },
          {
            action: "Set up prompt response automation",
            explanation: "Develop helpers to automatically respond to CLI prompts with specified values."
          },
          {
            action: "Implement output monitoring",
            explanation: "Create functions to monitor output in real-time and respond based on content."
          }
        ]
      },
      {
        name: "Develop Assertion Utilities",
        description: "Create helper functions for verifying CLI command results and output.",
        agentActions: [
          {
            action: "Implement output content verification",
            explanation: "Create functions to check command output against expected content (exact match, regex, etc.)."
          },
          {
            action: "Set up exit code verification",
            explanation: "Develop helpers to verify that commands exit with expected status codes."
          },
          {
            action: "Create file system change validation",
            explanation: "Implement utilities to verify file creation, modification, or deletion by CLI commands."
          }
        ]
      },
      {
        name: "Organize Test Structure",
        description: "Structure CLI tests in a clear, maintainable way that reflects the command hierarchy and functionality.",
        agentActions: [
          {
            action: "Group tests by command or feature",
            explanation: "Organize tests into logical groups based on the CLI structure or functionality."
          },
          {
            action: "Implement common setup and teardown",
            explanation: "Create shared setup and teardown routines for related CLI tests."
          },
          {
            action: "Document test coverage and gaps",
            explanation: "Track which CLI features and commands are covered by tests and identify gaps."
          }
        ]
      }
    ]
  },
  examples: {
    description: "Practical examples of CLI testing with execa in different scenarios.",
    useCases: [
      {
        scenario: "File generation CLI",
        implementation: "Tests for a CLI tool that generates files based on templates and user input.",
        outcome: "Tests verify that the CLI correctly creates files with expected content based on provided arguments, handles errors for invalid inputs, and respects configuration options."
      },
      {
        scenario: "Data processing command",
        implementation: "Tests for a command that processes data files, transforms content, and outputs results.",
        outcome: "Tests confirm that the command correctly reads input files, applies transformations, and generates output in the expected format, with proper error handling for invalid inputs."
      },
      {
        scenario: "Interactive configuration tool",
        implementation: "Tests for an interactive CLI that guides users through configuration setup with prompts.",
        outcome: "Tests verify that the tool presents appropriate prompts, responds correctly to user input, validates entries, and saves configuration properly."
      },
      {
        scenario: "Multi-command CLI application",
        implementation: "Tests for a complex CLI with multiple sub-commands and shared options.",
        outcome: "Tests ensure that each sub-command works correctly, global and command-specific options are properly handled, and commands interact appropriately when used together."
      }
    ]
  },
  codeExamples: [
    {
      language: "typescript",
      description: "Basic CLI command testing with execa",
      code: `
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { execa } from 'execa';
import { mkdtemp, rm, writeFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

describe('File Processing CLI', () => {
  let tempDir: string;
  
  beforeEach(async () => {
    // Create a temporary directory for the test
    tempDir = await mkdtemp(join(tmpdir(), 'cli-test-'));
  });
  
  afterEach(async () => {
    // Clean up the temporary directory
    await rm(tempDir, { recursive: true, force: true });
  });
  
  it('should process a valid input file', async () => {
    // Arrange: Create a test input file
    const inputFile = join(tempDir, 'input.txt');
    const outputFile = join(tempDir, 'output.json');
    
    await writeFile(inputFile, 'name: Test User\\nemail: test@example.com\\nage: 30');
    
    // Act: Run the CLI command
    const { stdout, stderr, exitCode } = await execa('node', [
      './dist/cli.js',
      'process',
      '--input', inputFile,
      '--output', outputFile,
      '--format', 'json'
    ]);
    
    // Assert: Check command output and results
    expect(exitCode).toBe(0);
    expect(stdout).toContain('Successfully processed file');
    expect(stderr).toBe('');
    
    // Verify the output file was created with correct content
    const outputContent = require(outputFile);
    expect(outputContent).toEqual({
      name: 'Test User',
      email: 'test@example.com',
      age: 30
    });
  });
  
  it('should handle missing input file error', async () => {
    // Arrange: Use a non-existent input file
    const nonExistentFile = join(tempDir, 'does-not-exist.txt');
    
    // Act & Assert: Verify the command fails appropriately
    await expect(execa('node', [
      './dist/cli.js',
      'process',
      '--input', nonExistentFile,
      '--output', join(tempDir, 'output.json')
    ])).rejects.toThrow();
    
    try {
      await execa('node', [
        './dist/cli.js',
        'process',
        '--input', nonExistentFile,
        '--output', join(tempDir, 'output.json')
      ]);
    } catch (error) {
      // Verify error details
      expect(error.exitCode).toBe(1);
      expect(error.stderr).toContain('Input file not found');
    }
  });
  
  it('should support different output formats', async () => {
    // Arrange
    const inputFile = join(tempDir, 'input.txt');
    await writeFile(inputFile, 'name: Test User\\nemail: test@example.com');
    
    // Act: Test with CSV format
    const { stdout: csvStdout, exitCode: csvExitCode } = await execa('node', [
      './dist/cli.js',
      'process',
      '--input', inputFile,
      '--output', join(tempDir, 'output.csv'),
      '--format', 'csv'
    ]);
    
    // Assert
    expect(csvExitCode).toBe(0);
    expect(csvStdout).toContain('CSV format');
    
    // Act: Test with XML format
    const { stdout: xmlStdout, exitCode: xmlExitCode } = await execa('node', [
      './dist/cli.js',
      'process',
      '--input', inputFile,
      '--output', join(tempDir, 'output.xml'),
      '--format', 'xml'
    ]);
    
    // Assert
    expect(xmlExitCode).toBe(0);
    expect(xmlStdout).toContain('XML format');
  });
});
`,
      explanation: "This example demonstrates basic CLI testing with execa. It creates a temporary directory for file operations, executes CLI commands with various arguments, and verifies both the command output and the resulting files. It tests both successful execution and error handling scenarios."
    },
    {
      language: "typescript",
      description: "Testing interactive CLI prompts",
      code: `
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { execa } from 'execa';
import { mkdtemp, rm, readFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

describe('Interactive Configuration CLI', () => {
  let tempDir: string;
  
  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'cli-test-'));
  });
  
  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });
  
  it('should configure settings through interactive prompts', async () => {
    // Arrange: Prepare the input to simulate user responses to prompts
    const userInput = [
      'My Project', // Project name prompt
      'y',          // Use TypeScript? (yes)
      'src',        // Source directory
      'n',          // Install dependencies now? (no)
      ''            // Empty line to confirm and exit
    ].join('\\n');
    
    const configFile = join(tempDir, 'config.json');
    
    // Act: Run the CLI in interactive mode and provide input
    const { stdout, exitCode } = await execa('node', [
      './dist/cli.js',
      'init',
      '--config', configFile
    ], {
      cwd: tempDir,
      input: userInput, // Simulate user typing these responses
      env: {
        ...process.env,
        CI: 'true' // Tell the CLI we're in a CI environment
      }
    });
    
    // Assert: Verify the interaction and results
    expect(exitCode).toBe(0);
    expect(stdout).toContain('Project name:');
    expect(stdout).toContain('Use TypeScript?');
    expect(stdout).toContain('Source directory:');
    expect(stdout).toContain('Install dependencies now?');
    expect(stdout).toContain('Configuration complete!');
    
    // Verify the config file was created with the expected content
    const configContent = JSON.parse(await readFile(configFile, 'utf8'));
    expect(configContent).toEqual({
      projectName: 'My Project',
      typescript: true,
      sourceDir: 'src',
      dependencies: {
        install: false
      }
    });
  });
  
  it('should validate input and show error messages', async () => {
    // Arrange: First provide invalid input, then valid input
    const userInput = [
      '', // Empty project name (invalid)
      'My Project', // Valid project name
      'invalid', // Invalid TypeScript option
      'y', // Valid TypeScript option
      '../outside', // Invalid directory (outside project)
      'src', // Valid directory
      'n', // Don't install dependencies
      '' // Confirm and exit
    ].join('\\n');
    
    // Act: Run the CLI with the sequence of inputs
    const { stdout, exitCode } = await execa('node', [
      './dist/cli.js',
      'init',
      '--config', join(tempDir, 'config.json')
    ], {
      cwd: tempDir,
      input: userInput,
      env: { CI: 'true' }
    });
    
    // Assert: Check for error messages and validation
    expect(exitCode).toBe(0);
    expect(stdout).toContain('Project name cannot be empty');
    expect(stdout).toContain('Please enter y or n');
    expect(stdout).toContain('Directory must be within the project');
    
    // Verify the final output shows success
    expect(stdout).toContain('Configuration complete!');
  });
  
  it('should support non-interactive mode with arguments', async () => {
    // Act: Run the CLI in non-interactive mode with all options specified
    const { stdout, exitCode } = await execa('node', [
      './dist/cli.js',
      'init',
      '--config', join(tempDir, 'config.json'),
      '--project-name', 'CLI Test Project',
      '--typescript',
      '--source-dir', 'source',
      '--skip-install',
      '--non-interactive' // Skip all prompts
    ], {
      cwd: tempDir
    });
    
    // Assert: Verify the command ran without prompts
    expect(exitCode).toBe(0);
    expect(stdout).not.toContain('Project name:'); // No prompts
    expect(stdout).toContain('Configuration created in non-interactive mode');
    
    // Verify the config file has the expected content
    const configContent = JSON.parse(
      await readFile(join(tempDir, 'config.json'), 'utf8')
    );
    
    expect(configContent).toEqual({
      projectName: 'CLI Test Project',
      typescript: true,
      sourceDir: 'source',
      dependencies: {
        install: false
      }
    });
  });
});
`,
      explanation: "This example demonstrates testing an interactive CLI that uses prompts to collect user input. It simulates user responses by providing input through stdin, verifies that prompts are displayed correctly, and checks that user responses are properly processed. It also tests input validation by providing invalid inputs followed by valid ones, and tests non-interactive mode using command-line arguments."
    },
    {
      language: "typescript",
      description: "Creating CLI test helpers with execa",
      code: `
// cli-test-utils.ts
import { execa, ExecaChildProcess, Options as ExecaOptions } from 'execa';
import { mkdtemp, rm, mkdir, writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { existsSync } from 'fs';

interface TestCliOptions {
  binPath?: string;
  workingDir?: string;
  env?: Record<string, string>;
  timeout?: number;
}

interface CommandResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  timeTaken: number;
}

/**
 * Helper class for testing CLI applications with execa
 */
export class CliTester {
  private binPath: string;
  private workingDir: string | null = null;
  private isTemporaryDir = false;
  private env: Record<string, string>;
  private timeout: number;
  
  constructor({
    binPath = './dist/cli.js',
    workingDir = null,
    env = {},
    timeout = 10000
  }: TestCliOptions = {}) {
    this.binPath = binPath;
    this.workingDir = workingDir;
    this.env = { ...process.env, ...env };
    this.timeout = timeout;
  }
  
  /**
   * Create a temporary directory for testing
   */
  async createTempDir(): Promise<string> {
    const tempDir = await mkdtemp(join(tmpdir(), 'cli-test-'));
    this.workingDir = tempDir;
    this.isTemporaryDir = true;
    return tempDir;
  }
  
  /**
   * Clean up temporary resources
   */
  async cleanup(): Promise<void> {
    if (this.isTemporaryDir && this.workingDir) {
      await rm(this.workingDir, { recursive: true, force: true });
      this.workingDir = null;
      this.isTemporaryDir = false;
    }
  }
  
  /**
   * Create a file in the working directory
   */
  async createFile(filename: string, content: string): Promise<string> {
    if (!this.workingDir) {
      throw new Error('Working directory not set. Call createTempDir() first.');
    }
    
    const filePath = join(this.workingDir, filename);
    const dirPath = filePath.substring(0, filePath.lastIndexOf('/'));
    
    if (!existsSync(dirPath)) {
      await mkdir(dirPath, { recursive: true });
    }
    
    await writeFile(filePath, content);
    return filePath;
  }
  
  /**
   * Read a file from the working directory
   */
  async readFile(filename: string): Promise<string> {
    if (!this.workingDir) {
      throw new Error('Working directory not set. Call createTempDir() first.');
    }
    
    const filePath = join(this.workingDir, filename);
    return readFile(filePath, 'utf8');
  }
  
  /**
   * Execute a CLI command and return the result
   */
  async run(
    command: string,
    args: string[] = [],
    options: Partial<ExecaOptions> = {}
  ): Promise<CommandResult> {
    const startTime = Date.now();
    
    const execaOptions: ExecaOptions = {
      cwd: this.workingDir || undefined,
      env: this.env,
      timeout: this.timeout,
      ...options
    };
    
    try {
      const result = await execa(command, args, execaOptions);
      return {
        stdout: result.stdout,
        stderr: result.stderr,
        exitCode: result.exitCode,
        timeTaken: Date.now() - startTime
      };
    } catch (error) {
      if (error.exitCode !== undefined) {
        // Command executed but failed with non-zero exit code
        return {
          stdout: error.stdout || '',
          stderr: error.stderr || '',
          exitCode: error.exitCode,
          timeTaken: Date.now() - startTime
        };
      }
      // Command failed to execute
      throw error;
    }
  }
  
  /**
   * Execute the CLI binary with specified arguments
   */
  async runCli(
    args: string[] = [],
    options: Partial<ExecaOptions> = {}
  ): Promise<CommandResult> {
    return this.run('node', [this.binPath, ...args], options);
  }
  
  /**
   * Run an interactive CLI command with provided input
   */
  async runInteractive(
    args: string[] = [],
    input: string | string[]
  ): Promise<CommandResult> {
    const inputStr = Array.isArray(input) ? input.join('\\n') : input;
    
    return this.runCli(args, {
      input: inputStr
    });
  }
}

// Example usage in a test file:
// test-cli.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CliTester } from './cli-test-utils';

describe('CLI Application', () => {
  let cli: CliTester;
  
  beforeEach(async () => {
    cli = new CliTester({
      binPath: './dist/cli.js',
      env: { NODE_ENV: 'test' }
    });
    await cli.createTempDir();
  });
  
  afterEach(async () => {
    await cli.cleanup();
  });
  
  it('should generate a project structure', async () => {
    // Arrange
    await cli.createFile('template.json', JSON.stringify({
      name: 'Test Project',
      version: '1.0.0'
    }));
    
    // Act
    const result = await cli.runCli([
      'generate',
      '--template', 'template.json',
      '--output', 'project'
    ]);
    
    // Assert
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Project generated successfully');
    
    // Verify generated files
    const packageJson = JSON.parse(await cli.readFile('project/package.json'));
    expect(packageJson.name).toBe('Test Project');
    expect(packageJson.version).toBe('1.0.0');
  });
  
  it('should support interactive configuration', async () => {
    // Act
    const result = await cli.runInteractive(
      ['init'],
      [
        'My Interactive Project',
        'y', // Use TypeScript
        'src',
        'n' // Skip dependencies
      ]
    );
    
    // Assert
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Configuration complete');
    
    // Verify configuration file
    const config = JSON.parse(await cli.readFile('cli-config.json'));
    expect(config.projectName).toBe('My Interactive Project');
    expect(config.typescript).toBe(true);
  });
});
`,
      explanation: "This example demonstrates creating a reusable helper class for CLI testing with execa. The CliTester class provides methods for setting up temporary directories, creating and reading files, executing CLI commands with arguments, and running interactive commands with simulated user input. This approach encapsulates common CLI testing patterns and makes tests more concise and maintainable."
    }
  ],
  commonPitfalls: [
    {
      name: "Process Cleanup Issues",
      description: "Not properly terminating child processes, leading to orphaned processes that can cause resource leaks or test interference.",
      solution: "Ensure all spawned processes are properly terminated, even in error cases, and implement timeout handling to prevent hanging processes.",
      preventativeMeasures: [
        "Use try/finally blocks to ensure process termination",
        "Implement proper error handling for process execution",
        "Set appropriate timeouts to prevent indefinite hanging"
      ]
    },
    {
      name: "Environment Leakage",
      description: "Tests affecting each other through shared environment variables or file system state, causing unpredictable behavior and flaky tests.",
      solution: "Isolate each test's environment by using temporary directories, resetting environment variables, and cleaning up after tests.",
      preventativeMeasures: [
        "Use unique temporary directories for each test",
        "Reset environment variables between tests",
        "Implement thorough cleanup in afterEach/afterAll hooks"
      ]
    },
    {
      name: "Platform-Dependent Tests",
      description: "Writing tests that only work on specific platforms (Windows, macOS, Linux) due to path formatting, line endings, or command availability.",
      solution: "Design tests to be platform-agnostic by using path utilities, normalizing line endings, and handling platform-specific commands.",
      preventativeMeasures: [
        "Use path.join() instead of hardcoded path separators",
        "Normalize line endings when comparing output",
        "Include platform checks and skip tests when necessary"
      ]
    },
    {
      name: "Interactive CLI Testing Complexity",
      description: "Difficulty in testing interactive CLIs that require multiple input/output exchanges, leading to brittle or incomplete tests.",
      solution: "Create robust utilities for simulating user input and monitoring output, with appropriate timing and synchronization mechanisms.",
      preventativeMeasures: [
        "Implement helpers for simulating interactive input sequences",
        "Include fallback mechanisms for timing variations",
        "Create non-interactive modes for more reliable testing"
      ]
    },
    {
      name: "Output Assertion Brittleness",
      description: "Tests that break due to minor, non-functional changes in command output formatting or wording.",
      solution: "Make output assertions flexible by focusing on key content rather than exact formatting, using regular expressions or partial matching.",
      preventativeMeasures: [
        "Use substring or regular expression matching instead of exact string comparison",
        "Focus assertions on essential output elements",
        "Create structured output formats for easier testing when possible"
      ]
    },
    {
      name: "Slow Test Execution",
      description: "CLI tests that take too long to run due to process startup overhead or inefficient setup/teardown.",
      solution: "Optimize test performance by batching related tests, reusing expensive setup steps, and focusing tests on essential behaviors.",
      preventativeMeasures: [
        "Group related tests to share setup costs",
        "Mock heavy external dependencies when appropriate",
        "Use smaller, focused test cases instead of large end-to-end scenarios"
      ]
    }
  ],
  improvementGuidelines: {
    description: "Strategies for improving the effectiveness and efficiency of CLI testing over time.",
    metrics: [
      {
        name: "Command Coverage",
        description: "The extent to which tests cover the CLI's commands, subcommands, options, and arguments.",
        assessmentMethod: "Map all CLI commands, options, and arguments and track which ones are tested. Identify gaps in coverage for critical functionality."
      },
      {
        name: "Error Handling Coverage",
        description: "How comprehensively tests verify the CLI's handling of error conditions, invalid inputs, and edge cases.",
        assessmentMethod: "Identify potential error scenarios and verify test coverage. Check that all error messages and exit codes are tested."
      },
      {
        name: "Test Execution Time",
        description: "The time required to run CLI tests, which affects feedback cycles and developer productivity.",
        assessmentMethod: "Measure and track test execution time. Identify and optimize slow tests. Consider parallelizing tests where possible."
      },
      {
        name: "Test Reliability",
        description: "How consistently tests produce the same results across different environments and runs.",
        assessmentMethod: "Run tests in different environments and track flaky tests. Address platform-specific issues and timing dependencies."
      }
    ]
  },
  resources: [
    {
      type: "documentation",
      name: "Execa Documentation",
      description: "Official documentation for the execa library, which provides a better interface for executing commands.",
      link: "https://github.com/sindresorhus/execa"
    },
    {
      type: "tutorial",
      name: "Testing CLI Applications",
      description: "A comprehensive guide to testing command-line interfaces effectively.",
      link: "https://storybook.js.org/tutorials/cli/react/en/test/"
    },
    {
      type: "reference",
      name: "Vitest with Execa",
      description: "Examples and best practices for using Vitest with execa for CLI testing.",
      link: "https://vitest.dev/guide/mocking.html"
    },
    {
      type: "tool",
      name: "Temp Directory Management",
      description: "Utilities for managing temporary directories in tests.",
      link: "https://github.com/sindresorhus/tempy"
    }
  ],
  conclusion: "Testing command-line interfaces effectively requires a systematic approach to process execution, input/output verification, and environment control. Using execa provides a powerful and flexible foundation for CLI testing, enabling comprehensive verification of CLI behavior, output, and error handling. By following the principles and techniques outlined in this guide, developers can create reliable, maintainable tests that ensure CLI applications work correctly across different environments and use cases. While CLI testing presents unique challenges compared to other forms of testing, the strategies and patterns described here help address those challenges and create a robust testing approach."
}; 