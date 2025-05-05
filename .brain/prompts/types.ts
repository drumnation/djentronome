/**
 * Task Sequence Types for Workflow Definitions
 * These types define how workflows are structured and executed
 */

export interface TaskParameters {
  [key: string]: unknown;
}

export interface TaskOutput {
  [key: string]: unknown;
}

// Base task definition
export interface BaseTask {
  dependsOn?: string[];
  explanation?: string;
  name: string;
  parameters: TaskParameters;
  subtasks?: Task[];
}

// Task with prompt handling
export interface PromptTask extends BaseTask {
  parameters: TaskParameters & {
    // Additional parameters
    [key: string]: unknown;
    // Input to the prompt
    input?: Record<string, unknown>;
    // Fields to extract from prompt output
    outputFields?: string[];
    // Single prompt reference
    prompt?: string;
    // Multiple prompt references
    prompts?: string[];
  };
}

// Union type for all task types
export type Task = BaseTask | PromptTask;

// Task sequence definition
export interface TaskSequence {
  inputParameters?: string[];
  metadata?: {
    description?: string;
    name?: string;
    tags?: string[];
    version?: string;
  };
  tasks: Task[];
}
