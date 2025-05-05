export const agentPromptWritingGuide = {
  applicationProcess: {
    description:
      'This outlines a step-by-step process for crafting and refining prompts for AI agents within a multi-agent software development environment. Each step includes specific actions for the agent (you, in this case) to ensure the creation of high-quality, effective prompts.',
    steps: [
      {
        agentActions: [
          "Action 1: Review the agent's documentation or profile, if available. This is crucial to understand the agent's intended purpose and functionalities.",
          "Action 2: Identify the specific tasks the agent is designed to perform. This involves creating a detailed list of the agent's responsibilities within the software development process.",
          "Action 3: Determine the agent's input and output formats. Knowing what kind of data the agent can process and produce is essential for crafting compatible prompts.",
          "Action 4: Assess the agent's limitations. Recognizing what the agent *cannot* do is equally important to prevent giving it tasks beyond its capabilities.",
          'Action 5: If possible, engage in a test interaction with the agent to gauge its understanding and response patterns. This will provide valuable insights into how to best structure your prompts.',
        ],
        stepDescription:
          "Before writing a prompt, thoroughly understand the specific agent's role within the system, its capabilities, limitations, and knowledge base. This involves analyzing its designated tasks, the tools it can access, and any prior training or fine-tuning it has received.",
        stepName: "Understand the Agent's Role and Capabilities",
      },
      {
        agentActions: [
          'Action 1: Write a concise statement that summarizes the task. Use clear and unambiguous language, avoiding jargon or technical terms the agent may not understand.',
          'Action 2: Break down the task into smaller, manageable subtasks. This will make it easier for the agent to understand and execute the task step-by-step.',
          'Action 3: Specify the desired output format. Be explicit about data types, units, and any specific formatting requirements.',
          'Action 4: Define any relevant constraints or requirements. This could include deadlines, resource limitations, coding standards, or specific libraries to be used.',
          'Action 5: If possible, provide an example of the desired output. This will give the agent a clear target to aim for.',
        ],
        stepDescription:
          'Clearly articulate the specific task the agent needs to perform. Define the desired outcome in detail, including the expected output format, quality standards, and any specific constraints or requirements.',
        stepName: 'Define the Task and Expected Outcome',
      },
      {
        agentActions: [
          'Action 1: Start with a clear and concise instruction that directly tells the agent what to do. Use imperative verbs and avoid ambiguity.',
          'Action 2: Provide the necessary context. Explain the purpose of the task and how it fits into the overall project. Include any relevant background information, assumptions, or constraints.',
          'Action 3: Break down the task into smaller steps within the prompt. This will guide the agent through the process and make it easier to follow.',
          'Action 4: Use formatting to improve readability. Use bullet points, numbered lists, or headings to structure the prompt and highlight important information.',
          'Action 5: Explicitly state any assumptions you are making. This will help prevent the agent from making incorrect assumptions of its own.',
        ],
        stepDescription:
          "Based on the agent's profile and the task definition, write the initial prompt. Use clear, concise language, and provide all necessary context and instructions. Incorporate the core principles of prompt engineering, such as clarity, specificity, and explicit output definition.",
        stepName: 'Craft the Initial Prompt',
      },
      {
        agentActions: [
          'Action 1: Submit the prompt to the agent and observe its response. Pay close attention to the output and any error messages or unexpected behavior.',
          "Action 2: Compare the agent's output to the desired output. Assess whether the agent met the requirements and produced the expected results.",
          'Action 3: Analyze any discrepancies between the expected and actual output. Identify areas where the agent may have misunderstood the prompt or encountered difficulties.',
          "Action 4: Document the agent's response and any issues encountered. This will be valuable for refining the prompt in the next step.",
          "Action 5: Ask clarifying questions if the agent's response is unclear or incomplete. This can help pinpoint areas where the prompt needs improvement.",
        ],
        stepDescription:
          'Submit the initial prompt to the agent and carefully evaluate its response. Assess whether the agent understood the task correctly and produced the desired output. Identify any areas of confusion or misinterpretation.',
        stepName: 'Test and Evaluate the Prompt',
      },
      {
        agentActions: [
          'Action 1: Identify areas of the prompt that were unclear or led to misinterpretations. Rephrase these sections using more precise language and provide additional context if needed.',
          "Action 2: Add or modify instructions to address any errors or shortcomings in the agent's output. Be more explicit about the desired behavior and output format.",
          'Action 3: Incorporate feedback from the agent, if available. Use its responses to identify areas where the prompt can be improved.',
          "Action 4: Test the revised prompt and evaluate the agent's response again. Repeat this process iteratively until the agent consistently produces the desired output.",
          'Action 5: Document each iteration of the prompt and the corresponding agent responses. This will help track progress and identify patterns that can inform future prompt engineering efforts.',
        ],
        stepDescription:
          'Based on the evaluation, refine the prompt to address any issues or ambiguities. Iterate on the prompt, testing and refining it multiple times until the agent consistently produces the desired output. Use the feedback from each iteration to improve the clarity, specificity, and effectiveness of the prompt.',
        stepName: 'Refine and Iterate',
      },
    ],
  },
  codeExamples: [
    {
      description:
        'This section provides additional well-commented code examples related to prompt engineering, focusing on techniques and configurations that enhance agent communication and understanding.',
      example: {
        code: "```typescript\n// Example of a well-structured prompt for a code generation agent\ninterface AgentPrompt {\n  task: string; // Clear and concise task description\n  context: string; // Relevant background information and constraints\n  codebase?: string; // Optional: Existing codebase for context\n  outputFormat: {\n    type: string; // Expected output type (e.g., 'typescript', 'json', 'text')\n    schema?: string; // Optional: Schema definition for structured output\n    example?: string; // Optional: Example of desired output\n  };\n  constraints: string[]; // List of specific requirements and limitations\n}\n\n// Example usage:\nconst prompt: AgentPrompt = {\n  task: 'Generate a TypeScript function that validates a user registration form.',\n  context:\n    'The application uses React and Formik for form handling. The user registration form has the following fields: firstName (string, required), lastName (string, required), email (string, required, valid email format), password (string, required, minimum 8 characters, at least one uppercase, one lowercase, one number, and one special character).',\n  codebase: `\n    // Existing form component (simplified for brevity):\n    const RegistrationForm = () => {\n      // ... form implementation using Formik ...\n    };\n  `,\n  outputFormat: {\n    type: 'typescript',\n    example: `\n      \"typescript\\n      function validateForm(values: FormValues) {\\n        // Validation logic here\\n      }\\n      \"\n    `,\n  },\n  constraints: [\n    'The function should be named `validateForm`',\n    'The function should take a single argument `values` representing the form data.',\n    'The function should return an object containing error messages, if any.',\n    'Use regular expressions to validate the email and password formats.',\n  ],\n};\n\n// This structured prompt provides the agent with all the necessary information\n// to generate the desired code, including context, constraints, and output specifications.\n```",
        language: 'typescript',
      },
    },
    {
      description:
        'Example of using template strings to create dynamic prompts based on runtime information. This is especially useful when prompt content needs to be adjusted based on previous agent actions or dynamic data.',
      example: {
        code: '```typescript\n// Example of using template strings for dynamic prompt generation\nfunction createDynamicPrompt(taskDescription: string, data: any, agentRole: string): string {\n  return `\n    Agent Role: ${agentRole}\n    Task: ${taskDescription}\n    Data: ${JSON.stringify(data, null, 2)}\n\n    Instructions:\n    - Process the provided data according to your role.\n    - Return the output in JSON format.\n  `;\n}\n\n// Example usage:\nconst task = \'Analyze the following user activity data and generate a summary report.\';\nconst userData = {\n  userId: 123,\n  activity: [\n    { type: \'login\', timestamp: \'2024-11-28T10:00:00Z\' },\n    { type: \'purchase\', timestamp: \'2024-11-28T12:30:00Z\' },\n  ],\n};\nconst agent = \'Data Analysis Agent\';\n\nconst dynamicPrompt = createDynamicPrompt(task, userData, agent);\nconsole.log(dynamicPrompt);\n\n/* Output:\nAgent Role: Data Analysis Agent\nTask: Analyze the following user activity data and generate a summary report.\nData: {\n  "userId": 123,\n  "activity": [\n    { \n      "type": "login",\n      "timestamp": "2024-11-28T10:00:00Z"\n    },\n    { \n      "type": "purchase",\n      "timestamp": "2024-11-28T12:30:00Z"\n    }\n  ]\n}\n\nInstructions:\n- Process the provided data according to your role.\n- Return the output in JSON format.\n*/\n```',
        language: 'typescript',
      },
    },
  ],
  commonPitfalls: [
    {
      description:
        "Providing too much information or unnecessary details can overwhelm the agent and lead to confusion. While context is important, it's crucial to strike a balance and avoid including irrelevant information that might distract the agent from the core task.",
      name: 'Overly Verbose Prompts',
      preventativeMeasures: [
        'Measure 1: Before sending a prompt, review it critically and remove any information that is not directly relevant to the task.',
        'Measure 2: Use concise language and avoid unnecessary jargon or technical terms.',
      ],
      solution:
        'Focus on providing only the essential information needed for the task. Use concise language and avoid redundant details. Review prompts critically to identify and remove any unnecessary information.',
    },
    {
      description:
        'Using vague or ambiguous terms can lead to misinterpretations and incorrect outputs. Agents may struggle to understand the intended meaning, resulting in errors or unexpected behavior.',
      name: 'Ambiguous Language',
      preventativeMeasures: [
        'Measure 1: Use precise and unambiguous language, avoiding terms that could have multiple interpretations.',
        'Measure 2: Define any technical terms or jargon that the agent might not understand.',
      ],
      solution:
        'Use clear, precise language with a single, unambiguous interpretation. Define any terms that could have multiple meanings. Provide specific examples to illustrate the desired outcome.',
    },
    {
      description:
        "Failing to provide sufficient context can hinder the agent's ability to understand the task and its purpose. Without proper background information, the agent may struggle to generate relevant and accurate outputs.",
      name: 'Lack of Context',
      preventativeMeasures: [
        'Measure 1: Before writing a prompt, consider what background information the agent needs to understand the task.',
        'Measure 2: Explain the purpose of the task and how it fits into the overall project.',
      ],
      solution:
        "Provide all necessary context, including relevant background information, constraints, and assumptions. Explain the purpose of the task and how it fits into the overall project. Tailor the context to the specific agent's role and knowledge base.",
    },
    {
      description:
        'Failing to specify or enforce a consistent output format can lead to integration issues between agents. Inconsistent data structures or formatting can disrupt the flow of information and require additional processing.',
      name: 'Inconsistent Output Formatting',
      preventativeMeasures: [
        'Measure 1: Always specify the desired output format in the prompt.',
        'Measure 2: Provide examples of the expected output whenever possible.',
      ],
      solution:
        'Clearly define the expected output format, structure, and content. Specify data types, units, and any specific formatting requirements. Provide examples of desired outputs whenever possible. Use a consistent format for similar tasks across different agents.',
    },
    {
      description:
        "Assigning tasks that exceed an agent's capabilities can lead to failures or suboptimal results. Prompts should be tailored to each agent's strengths and limitations.",
      name: 'Ignoring Agent Limitations',
      preventativeMeasures: [
        "Measure 1: Before writing a prompt, review the agent's documentation and understand its capabilities.",
        "Measure 2: Avoid assigning tasks that are clearly beyond the agent's abilities.",
      ],
      solution:
        "Thoroughly understand each agent's capabilities and limitations. Design prompts that align with their specific roles and expertise. Avoid assigning tasks that are beyond their current capabilities.",
    },
  ],
  conclusion:
    "Mastering prompt improvement for agents is a critical skill in the context of multi-agent software development. By crafting clear, specific, and context-aware prompts tailored to each agent's capabilities, you can significantly enhance the effectiveness of agent collaboration and the overall success of software projects. Continuous evaluation, refinement, and adaptation of prompts, combined with a deep understanding of agent roles and the principles outlined in this guide, will empower your Cursor AI agents to perform at their best and contribute to a highly efficient and productive development process. Remember that prompt engineering is an iterative and evolving practice. Embrace experimentation, learn from both successes and failures, and strive for continuous improvement to unlock the full potential of your multi-agent system.",
  corePrinciples: [
    {
      description:
        "Prompts must be written in clear, concise language, avoiding jargon or overly technical terms that the agent might not understand. Each instruction should have a single, unambiguous interpretation to prevent miscommunication and ensure the agent performs the intended action. Avoid vague language like 'handle this' or 'process that'. Instead, be specific about what actions the agent should take. For instance, instead of 'handle the user input', say 'validate the user input against the defined schema and return an error if invalid'.",
      name: 'Clarity and Unambiguity',
    },
    {
      description:
        "Provide sufficient context for the task, including relevant background information, constraints, and assumptions. Agents need to understand the 'why' behind the task, not just the 'what'. Tailor prompts to the specific agent's role, capabilities, and knowledge base. A prompt for a coding agent will differ significantly from one for a testing agent. Include information about the overall project goal, the specific module being worked on, and any relevant coding standards or design patterns.",
      name: 'Contextual Specificity',
    },
    {
      description:
        'Clearly define the expected output format, structure, and content. Specify data types, units, and any specific formatting requirements. This ensures consistency and facilitates seamless integration between agents. Provide examples of desired outputs whenever possible. For instance, if the agent is expected to generate JSON, specify the schema and provide a sample JSON object. If the agent is to produce code, specify the programming language, coding style, and expected functionality.',
      name: 'Explicit Output Definition',
    },
    {
      description:
        "Prompt engineering is an iterative process. Continuously evaluate the agent's responses and refine prompts based on observed performance. Analyze errors and misunderstandings to identify areas for improvement in prompt clarity and specificity. Encourage feedback from the agents themselves, if possible. Implement a system for tracking prompt versions and their corresponding outcomes to facilitate learning and improvement over time.",
      name: 'Iterative Refinement',
    },
    {
      description:
        "Customize prompts based on each agent's individual capabilities, role, and knowledge base. Recognize that different agents may have varying levels of understanding and expertise. Tailor the language, complexity, and level of detail in prompts accordingly. Utilize the agent's known strengths and address potential weaknesses through specific instructions. For example, a specialized code-generating agent might receive a highly detailed prompt with specific instructions about code structure and style. In contrast, a higher-level planning agent might get a more general prompt focusing on overall project goals and milestones.",
      name: 'Agent-Specific Tailoring',
    },
  ],
  description:
    'This guide focuses on optimizing prompts specifically designed for AI agents within a multi-agent system. It covers strategies to enhance clarity, specificity, and effectiveness of prompts to ensure agents understand their tasks, constraints, and expected outputs, ultimately leading to improved collaboration and successful software development outcomes. This involves crafting instructions that are not only precise and unambiguous but also tailored to the unique capabilities and operational context of each agent.',
  examples: {
    description:
      'These examples demonstrate how to apply the principles of prompt improvement in different software development scenarios. Each use case highlights a specific aspect of prompt engineering and provides concrete examples of before-and-after prompts.',
    useCases: [
      {
        example:
          ' \n**Initial Prompt (Vague):**\n"Write a Python function to sort a list of numbers."\n\n**Agent Output (Incorrect - may use a less efficient algorithm or sort in descending order):**\n`python\ndef sort_numbers(data):\n  return sorted(data, reverse=True)\n`\n\n**Improved Prompt (Specific):**\n"Write a Python function called `sort_numbers` that takes a list of numbers as input and returns a new list containing the same numbers sorted in ascending order using the merge sort algorithm. Ensure the function handles empty lists and lists with duplicate numbers correctly."\n\n**Agent Output (Correct):**\n`python\ndef sort_numbers(data):\n  if not data:\n    return []\n  if len(data) == 1:\n    return data\n  mid = len(data) // 2\n  left = sort_numbers(data[:mid])\n  right = sort_numbers(data[mid:])\n  return merge(left, right)\n\ndef merge(left, right):\n  result = []\n  i = j = 0\n  while i < len(left) and j < len(right):\n    if left[i] <= right[j]:\n      result.append(left[i])\n      i += 1\n    else:\n      result.append(right[j])\n      j += 1\n  result += left[i:]\n  result += right[j:]\n  return result\n`',
        name: 'Code Generation',
        scenario:
          'An agent is tasked with generating a Python function that sorts a list of numbers in ascending order. The initial prompt is vague, leading to incorrect output. The improved prompt provides specific instructions and constraints.',
      },
      {
        example:
          "**Initial Prompt (Lacking Context):**\n\"Generate test cases for the `calculate_discount` function.\"\n\n**Agent Output (Incomplete - may miss edge cases):**\n`typescript\ndescribe('calculate_discount', () => {\n  it('should calculate discount correctly', () => {\n    expect(calculate_discount(100, 0.1)).toBe(90);\n  });\n});\n`\n\n**Improved Prompt (Detailed):**\n\"Generate comprehensive unit test cases in Jest for the `calculate_discount` function, which takes two arguments: `price` (a number) and `discount` (a number between 0 and 1). The function should return the discounted price. Ensure your test suite covers the following scenarios:\n\n*   Valid inputs: Test with various price and discount values.\n*   Edge cases: Test with a price of 0, a discount of 0, and a discount of 1.\n*   Invalid inputs: Test with negative prices and discounts outside the 0-1 range. The function should throw an error in these cases.\"\n\n**Agent Output (Comprehensive):**\n`typescript\ndescribe('calculate_discount', () => {\n  it('should calculate discount correctly for valid inputs', () => {\n    expect(calculate_discount(100, 0.1)).toBe(90);\n    expect(calculate_discount(50, 0.2)).toBe(40);\n  });\n\n  it('should handle edge cases', () => {\n    expect(calculate_discount(0, 0.5)).toBe(0);\n    expect(calculate_discount(100, 0)).toBe(100);\n    expect(calculate_discount(100, 1)).toBe(0);\n  });\n\n  it('should throw errors for invalid inputs', () => {\n    expect(() => calculate_discount(-100, 0.1)).toThrow();\n    expect(() => calculate_discount(100, -0.1)).toThrow();\n    expect(() => calculate_discount(100, 1.1)).toThrow();\n  });\n});\n`",
        name: 'Test Case Generation',
        scenario:
          'An agent is tasked with generating test cases for a function. The initial prompt lacks context and specific requirements, leading to incomplete test coverage. The improved prompt provides detailed instructions and specifies edge cases to be covered.',
      },
      {
        example:
          "**Initial Prompt (Too General):**\n\"Refactor the following code to improve its readability:\n`javascript\nfunction calculate(x,y,op){if(op==='+'){return x+y;}else if(op==='-'){return x-y;}else if(op==='*'){return x*y;}else{return 'Invalid';}}\n`\"\n\n**Agent Output (Minimal Changes):**\n`javascript\nfunction calculate(x, y, op) {\n  if (op === '+') {\n    return x + y;\n  } else if (op === '-') {\n    return x - y;\n  } else if (op === '*') {\n    return x * y;\n  } else {\n    return 'Invalid';\n  }\n}\n`\n\n**Improved Prompt (Specific Guidelines):**\n\"Refactor the following JavaScript code to improve its readability and maintainability. Apply the following guidelines:\n\n*   Use meaningful variable names.\n*   Extract the conditional logic into separate functions.\n*   Use a switch statement instead of multiple if-else statements.\n*   Add comments to explain the purpose of each function and code block.\n\n`javascript\nfunction calculate(x,y,op){if(op==='+'){return x+y;}else if(op==='-'){return x-y;}else if(op==='*'){return x*y;}else{return 'Invalid';}}\n`\"\n\n**Agent Output (Significant Improvements):**\n`javascript\n/**\n * Performs arithmetic calculations based on the given operator.\n *\n * @param {number} operand1 - The first operand.\n * @param {number} operand2 - The second operand.\n * @param {string} operator - The operator ('+', '-', '*').\n * @returns {number|string} The result of the calculation or 'Invalid' if the operator is unknown.\n */\nfunction calculate(operand1, operand2, operator) {\n  switch (operator) {\n    case '+':\n      return add(operand1, operand2);\n    case '-':\n      return subtract(operand1, operand2);\n    case '*':\n      return multiply(operand1, operand2);\n    default:\n      return 'Invalid';\n  }\n}\n\n/**\n * Adds two numbers.\n *\n * @param {number} a - The first number.\n * @param {number} b - The second number.\n * @returns {number} The sum of a and b.\n */\nfunction add(a, b) {\n  return a + b;\n}\n\n/**\n * Subtracts two numbers.\n *\n * @param {number} a - The first number.\n * @param {number} b - The second number.\n * @returns {number} The difference between a and b.\n */\nfunction subtract(a, b) {\n  return a - b;\n}\n\n/**\n * Multiplies two numbers.\n *\n * @param {number} a - The first number.\n * @param {number} b - The second number.\n * @returns {number} The product of a and b.\n */\nfunction multiply(a, b) {\n  return a * b;\n}\n`",
        name: 'Code Refactoring',
        scenario:
          'An agent is tasked with refactoring a piece of code to improve its readability and maintainability. The initial prompt is too general, leading to minimal changes. The improved prompt provides specific guidelines and suggests areas for improvement.',
      },
    ],
  },
  improvementGuidelines: [
    {
      detail:
        'Prompt engineering is an ongoing process. Continuously review and update prompts based on agent performance, feedback, and evolving project requirements. This helps maintain prompt effectiveness and adapt to changes in the system or agent capabilities. Track prompt versions and their corresponding outcomes to identify areas for improvement and measure the impact of changes over time.',
      guideline: 'Regularly review and update prompts.',
    },
    {
      detail:
        'Creating and using a standardized template for prompts can improve consistency and ensure that all necessary information is included. A template can serve as a checklist, helping to cover aspects like task definition, context, constraints, and output format. This promotes a more structured and systematic approach to prompt engineering.',
      guideline: 'Use a standardized prompt template.',
    },
    {
      detail:
        'Anticipate potential errors or misunderstandings and include instructions for how the agent should handle them. This can involve specifying fallback behaviors, requesting clarification, or generating error reports. This improves the robustness of the system and helps agents recover from unexpected situations. For example, you can instruct the agent to return a partial result with an error message if it encounters an issue.',
      guideline: 'Incorporate error handling and recovery instructions.',
    },
    {
      detail:
        'Experiment with different phrasing, levels of detail, and prompt structures to identify the most effective approaches. Systematically vary parameters like the amount of context provided, the specificity of instructions, and the output format to determine the optimal settings for each agent and task. This can help identify the most efficient and reliable prompt configurations.',
      guideline: 'Test prompts with different variations and parameters.',
    },
    {
      detail:
        "If possible, design a mechanism for agents to provide feedback on the prompts they receive. This could involve agents rating the clarity of a prompt, flagging potential ambiguities, or suggesting improvements. This feedback loop can provide valuable insights for refining prompts and improving agent communication. This can be as simple as allowing the agent to add a 'clarityScore' or 'feedbackNotes' to its response.",
      guideline: 'Encourage agent feedback.',
    },
  ],
  notes: [
    '* Note: This information is based on best practices as of November 28, 2024. The field of AI and agent interaction is rapidly evolving, so always refer to the latest research and documentation for the most up-to-date information.',
    '* Note: The principles described here are generally applicable, but specific techniques may need to be adapted based on the capabilities and limitations of the particular AI agents being used.',
  ],
  relevance:
    'In a multi-agent system for software development, the quality of inter-agent communication is paramount. Well-crafted prompts are crucial for coordinating agents, ensuring they correctly interpret their roles, understand the nuances of their tasks, and collaborate effectively. Effective prompt engineering directly impacts the efficiency, accuracy, and overall success of the software development process. Poorly written prompts can lead to misinterpretations, wasted effort, and inconsistencies in the final product. Mastering prompt improvement is essential for maximizing the collective intelligence and collaborative potential of the agent team.',
  resources: [
    {
      name: 'OpenAI Prompt Engineering Guide',
      url: '[https://platform.openai.com/docs/guides/prompt-engineering](https://platform.openai.com/docs/guides/prompt-engineering)',
    },
    {
      name: "Anthropic's Claude Documentation",
      url: '[https://docs.anthropic.com/claude/docs](https://docs.anthropic.com/claude/docs)',
    },
    {
      name: 'Prompt Engineering Institute',
      url: '[https://www.promptengineering.org/](https://www.promptengineering.org/)',
    },
  ],
  topic: 'Prompt Improvement for Prompts Meant for Agents',
};
